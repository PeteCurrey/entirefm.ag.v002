/**
 * POST /api/supplier/org/create
 * ==============================
 * Create a supplier organisation for an authenticated supplier user.
 * Idempotent — if the user already has an organisation, returns it.
 * Performs duplicate company number + name checks.
 */

import { NextResponse } from 'next/server';
import {
  createSupplierOrganisation,
  validateSupplierAuthUser,
  getOrCreateApplicationDraft,
} from '@/server/suppliers/supplier-auth-store';
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
} from '@/server/identity';
import { cookies } from 'next/headers';

const SUPPLIER_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  try {
    let token: string | undefined;
    try {
      const jar = await cookies();
      token = jar.get(AUTH_COOKIE_NAME)?.value;
    } catch {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE_NAME}=([^;]+)`));
      token = match ? match[1] : undefined;
    }
    const session = verifySessionToken(token);

    if (!session || (session.orgType as string) !== 'SUPPLIER') {
      return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });
    }

    // Live Supabase Auth User Validation
    const authState = await validateSupplierAuthUser(session.personId || session.authUserId || '');
    if (!authState.valid || !authState.authUser || !authState.supplierUser) {
      return NextResponse.json({ success: false, error: 'Valid supplier authentication identity required.' }, { status: 401 });
    }

    const user = authState.supplierUser;

    const body = await request.json().catch(() => ({}));
    const { legalName, tradingName, companyNumber } = body as Record<string, string>;

    if (!legalName?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Legal company name is required.' },
        { status: 400 }
      );
    }

    // Idempotent: if user already has an org, return it and ensure session cookie is refreshed
    if (user.organisation_id) {
      const existingOrg = await getSupplierOrganisationById(user.organisation_id);
      const draft = await getOrCreateApplicationDraft(user.organisation_id);

      const updatedSession = {
        ...session,
        orgId: user.organisation_id,
        orgName: existingOrg?.tradingName || existingOrg?.legalName || 'Supplier Organisation',
        expiresAt: Date.now() + SUPPLIER_SESSION_MAX_AGE * 1000,
      };
      const newToken = createSessionToken(updatedSession as any);

      const response = NextResponse.json({
        success: true,
        orgId: user.organisation_id,
        applicationReference: draft.applicationReference,
        alreadyExists: true,
      });

      response.cookies.set(AUTH_COOKIE_NAME, newToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: SUPPLIER_SESSION_MAX_AGE,
      });

      return response;
    }

    const result = await createSupplierOrganisation(
      user.auth_user_id,
      legalName.trim(),
      tradingName?.trim(),
      companyNumber?.trim()
    );

    if (!result.success || !result.organisation) {
      return NextResponse.json(
        {
          success: false,
          duplicate: result.duplicate || false,
          error: result.error || 'Organisation creation failed.',
        },
        { status: result.duplicate ? 409 : 400 }
      );
    }

    const org = result.organisation;

    // Create blank application draft immediately
    await getOrCreateApplicationDraft(org.id);

    // Refresh session with updated orgId + orgName
    const updatedSession = {
      ...session,
      orgId: org.id,
      orgName: org.tradingName || org.legalName,
      expiresAt: Date.now() + SUPPLIER_SESSION_MAX_AGE * 1000,
    };
    const newToken = createSessionToken(updatedSession as any);

    const response = NextResponse.json({
      success: true,
      orgId: org.id,
      applicationReference: org.applicationReference,
    });

    response.cookies.set(AUTH_COOKIE_NAME, newToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SUPPLIER_SESSION_MAX_AGE,
    });

    return response;
  } catch (err: any) {
    console.error('[SUPPLIER_ORG_CREATE] Error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
