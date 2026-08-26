/**
 * POST /api/supplier/org/create
 * ==============================
 * Create a supplier organisation for an authenticated supplier user.
 * Idempotent — if the user already has an organisation, returns it.
 * Performs duplicate company number + name checks.
 *
 * DIAGNOSTICS: All provisioning steps are logged with safe identifiers only.
 * No passwords, JWTs, access tokens, or refresh tokens are ever logged.
 */

import { NextResponse } from 'next/server';
import {
  createSupplierOrganisation,
  validateSupplierAuthUser,
  getOrCreateApplicationDraft,
  getSupplierOrganisationById,
  resolveResumeDestination,
  getSupplierUserByAuthId,
} from '@/server/suppliers/supplier-auth-store';
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
} from '@/server/identity';
import { cookies } from 'next/headers';

const SUPPLIER_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function log(step: string, data: Record<string, unknown> = {}) {
  console.info(`[ORG_SETUP] ${step}`, JSON.stringify(data));
}

export async function POST(request: Request) {
  const correlationId = `org-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    log('ORG_SETUP_SUBMIT_RECEIVED', { correlationId });

    // ── 1. Session resolution ────────────────────────────────────────────────
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
      log('AUTH_REQUIRED', { correlationId, reason: 'no_valid_supplier_session' });
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in to your supplier account.' },
        { status: 401 }
      );
    }

    const authUserId = session.personId || (session as any).authUserId || '';
    log('SESSION_RESOLVED', { correlationId, auth_user_id: authUserId });

    // ── 2. Live Supabase Auth User Validation ────────────────────────────────
    const authState = await validateSupplierAuthUser(authUserId);
    log('AUTH_VALIDATION', {
      correlationId,
      auth_user_id: authUserId,
      valid: authState.valid,
      reason: authState.reason,
      auth_email_verified: authState.isVerified,
      supplier_user_found: !!authState.supplierUser,
      supplier_user_id: authState.supplierUser?.id || null,
    });

    if (!authState.valid || !authState.authUser || !authState.supplierUser) {
      log('AUTH_VALIDATION_FAILED', { correlationId, reason: authState.reason });
      return NextResponse.json(
        {
          success: false,
          error: 'Your supplier session could not be verified. Please sign out and sign back in.',
          correlationId,
        },
        { status: 401 }
      );
    }

    const user = authState.supplierUser;

    // ── 3. Parse request body ────────────────────────────────────────────────
    const body = await request.json().catch(() => ({}));
    const { legalName, tradingName, companyNumber } = body as Record<string, string>;

    log('FORM_DATA_RECEIVED', {
      correlationId,
      legalName_present: !!legalName?.trim(),
      tradingName_present: !!(tradingName?.trim()),
      companyNumber_present: !!(companyNumber?.trim()),
    });

    if (!legalName?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Legal company name is required.' },
        { status: 400 }
      );
    }

    // ── 4. Idempotent check: user already has an organisation ────────────────
    if (user.organisation_id) {
      log('ORGANISATION_ALREADY_EXISTS', { correlationId, organisation_id: user.organisation_id });
      const existingOrg = await getSupplierOrganisationById(user.organisation_id);
      const draft = await getOrCreateApplicationDraft(user.organisation_id);

      const updatedSession = {
        ...session,
        orgId: user.organisation_id,
        orgName: existingOrg?.tradingName || existingOrg?.legalName || 'Supplier Organisation',
        expiresAt: Date.now() + SUPPLIER_SESSION_MAX_AGE * 1000,
      };
      const newToken = createSessionToken(updatedSession as any);

      log('REDIRECT_EXISTING', {
        correlationId,
        organisation_id: user.organisation_id,
        application_reference: draft.applicationReference,
      });

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

    // ── 5. Create Organisation ───────────────────────────────────────────────
    log('ORGANISATION_CREATE_STARTED', { correlationId, auth_user_id: user.auth_user_id });

    const result = await createSupplierOrganisation(
      user.auth_user_id,
      legalName.trim(),
      tradingName?.trim(),
      companyNumber?.trim()
    );

    log('ORGANISATION_CREATE_RESULT', {
      correlationId,
      success: result.success,
      organisation_id: result.organisation?.id || null,
      duplicate: result.duplicate || false,
      error_code: result.error ? 'create_failed' : null,
      error_message: result.error || null,
    });

    if (!result.success || !result.organisation) {
      return NextResponse.json(
        {
          success: false,
          duplicate: result.duplicate || false,
          error: result.error || "We couldn't finish creating your supplier organisation. Your account is safe and no duplicate application has been created. Please try again.",
          correlationId,
        },
        { status: result.duplicate ? 409 : 400 }
      );
    }

    const org = result.organisation;

    // ── 6. Create / verify application draft ────────────────────────────────
    log('APPLICATION_DRAFT_CREATE_STARTED', { correlationId, organisation_id: org.id });

    const draft = await getOrCreateApplicationDraft(org.id);

    log('APPLICATION_DRAFT_RESULT', {
      correlationId,
      application_id: draft.orgId,
      application_reference: draft.applicationReference,
      lifecycle_status: draft.lifecycleStatus,
    });

    // ── 7. Post-write verification: fresh DB read before redirect ────────────
    log('POST_WRITE_CONTEXT_RESOLUTION_STARTED', { correlationId });

    const freshUser = await getSupplierUserByAuthId(user.auth_user_id);
    const freshOrg = freshUser?.organisation_id
      ? await getSupplierOrganisationById(freshUser.organisation_id)
      : null;
    const resumeDestination = await resolveResumeDestination(user.auth_user_id);

    log('POST_WRITE_CONTEXT_RESOLUTION', {
      correlationId,
      supplier_user_found: !!freshUser,
      supplier_user_organisation_id: freshUser?.organisation_id || null,
      organisation_found: !!freshOrg,
      organisation_id: freshOrg?.id || null,
      organisation_lifecycle_status: freshOrg?.lifecycleStatus || null,
      resume_destination: resumeDestination,
      final_redirect: '/supplier-portal/onboarding',
    });

    if (resumeDestination === '/supplier-portal/org-setup') {
      // Post-write context resolution still sees org-setup — DB write may not have committed
      console.error('[ORG_SETUP] CRITICAL: post-write verification returned org-setup', {
        correlationId,
        auth_user_id: user.auth_user_id,
        created_org_id: org.id,
        fresh_user_org_id: freshUser?.organisation_id,
      });

      return NextResponse.json(
        {
          success: false,
          error: "We couldn't finish creating your supplier organisation. Your account is safe and no duplicate application has been created. Please try again.",
          correlationId,
        },
        { status: 500 }
      );
    }

    // ── 8. Refresh session token with new orgId ──────────────────────────────
    const updatedSession = {
      ...session,
      orgId: org.id,
      orgName: org.tradingName || org.legalName,
      expiresAt: Date.now() + SUPPLIER_SESSION_MAX_AGE * 1000,
    };
    const newToken = createSessionToken(updatedSession as any);

    log('FINAL_REDIRECT', {
      correlationId,
      organisation_id: org.id,
      application_reference: draft.applicationReference,
      final_redirect: '/supplier-portal/onboarding',
    });

    const response = NextResponse.json({
      success: true,
      orgId: org.id,
      applicationReference: draft.applicationReference,
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
    console.error('[ORG_SETUP] Unexpected error:', err?.message || err, { correlationId });
    return NextResponse.json(
      {
        success: false,
        error: "We couldn't finish creating your supplier organisation. Your account is safe and no duplicate application has been created. Please try again.",
        correlationId,
      },
      { status: 500 }
    );
  }
}
