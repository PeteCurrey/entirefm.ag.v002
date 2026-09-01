/**
 * POST /api/supplier/auth/signin
 * ==============================
 * Authenticate a supplier user using Supabase Auth (Canonical Authority).
 * EntireFM does NOT compare or store passwords.
 * Sets session cookie on successful verification and resolves lifecycle destination.
 */

import { NextResponse } from 'next/server';
import { supabaseSignIn } from '@/server/auth/supabase-auth';
import {
  createOrLinkSupplierUser,
  getSupplierUserByAuthId,
  getSupplierOrganisationByOwnerId,
  getSupplierOrganisationById,
  setSupplierUserOrganisation,
  resolveResumeDestination,
} from '@/server/suppliers/supplier-auth-store';
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  getRolePermissions,
} from '@/server/identity';

const SUPPLIER_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  try {
    const body = await request.formData().catch(async () => {
      const json = await request.json().catch(() => ({}));
      return new Map(Object.entries(json));
    });

    const email = String(body.get('email') || '').trim().toLowerCase();
    const password = String(body.get('password') || '');
    const redirectParam = String(body.get('redirect') || '');

    if (!email || !password) {
      return NextResponse.redirect(
        new URL('/supplier-portal/sign-in?error=missing_credentials', request.url),
        { status: 303 }
      );
    }

    // 1. Authenticate with Supabase Auth
    const { data: authSession, error: authError } = await supabaseSignIn(email, password);

    if (authError || !authSession?.user) {
      console.warn('[SUPPLIER_AUTH] Login failure: invalid credentials', { email });
      return NextResponse.redirect(
        new URL('/supplier-portal/sign-in?error=invalid_credentials', request.url),
        { status: 303 }
      );
    }

    const authUser = authSession.user;
    const isEmailConfirmed = !!authUser.email_confirmed_at;

    // 2. Resolve or Idempotently Provision Supplier Domain Identity
    let supplierUser = await getSupplierUserByAuthId(authUser.id);
    if (!supplierUser) {
      const meta = authUser.user_metadata || {};
      const provResult = await createOrLinkSupplierUser(
        authUser.id,
        email,
        meta.first_name || 'Supplier',
        meta.last_name || 'User',
        'SUPPLIER_ADMIN',
        isEmailConfirmed
      );
      supplierUser = provResult.user || null;
      if (provResult.isNew) {
        console.info('[SUPPLIER_AUTH] Domain record provisioned for Supabase user', { authUserId: authUser.id });
      }
    }

    if (!supplierUser) {
      console.error('[SUPPLIER_AUTH] Domain provisioning failed', { authUserId: authUser.id });
      return NextResponse.redirect(
        new URL('/supplier-portal/sign-in?error=provisioning_failed', request.url),
        { status: 303 }
      );
    }

    if (supplierUser.status === 'SUSPENDED') {
      console.warn('[SUPPLIER_AUTH] Login blocked: account suspended', { email });
      return NextResponse.redirect(
        new URL('/supplier-portal/sign-in?error=account_suspended', request.url),
        { status: 303 }
      );
    }

    // 3. Resolve org — check by owner_id if user has no linked org
    //    This handles cases where the supplier_users row was deleted and recreated
    //    (e.g. test cleanup), but the supplier_organisations row still exists.
    let resolvedOrgId = supplierUser.organisation_id;
    let resolvedOrgName = 'Supplier Organisation';

    if (!resolvedOrgId) {
      const ownedOrg = await getSupplierOrganisationByOwnerId(authUser.id);
      if (ownedOrg) {
        resolvedOrgId = ownedOrg.id;
        resolvedOrgName = ownedOrg.tradingName || ownedOrg.legalName || resolvedOrgName;
        await setSupplierUserOrganisation(authUser.id, ownedOrg.id);
        supplierUser.organisation_id = ownedOrg.id;
      }
    } else {
      const org = await getSupplierOrganisationById(resolvedOrgId);
      if (org) {
        resolvedOrgName = org.tradingName || org.legalName || resolvedOrgName;
      }
    }

    // 4. Build Unified Session
    // orgType MUST be 'SUPPLIER' — middleware gates /supplier-portal/* on this value
    const session = {
      personId: authUser.id,
      authUserId: authUser.id,
      email: supplierUser.email,
      name: `${supplierUser.first_name} ${supplierUser.last_name}`.trim(),
      role: supplierUser.role,
      orgId: resolvedOrgId || authUser.id,
      orgName: resolvedOrgName,
      orgType: 'SUPPLIER' as const,
      activeApplication: 'CONTRACTOR' as const,
      permissions: getRolePermissions(supplierUser.role as any),
      scopes: [],
      expiresAt: Date.now() + SUPPLIER_SESSION_MAX_AGE * 1000,
    };

    const token = createSessionToken(session as any);

    // 5. Resolve lifecycle-aware destination
    const destination = redirectParam || (await resolveResumeDestination(authUser.id));

    console.info('[SUPPLIER_AUTH] Login success: role resolved, routing to lifecycle destination', {
      email,
      orgType: 'SUPPLIER',
      destination,
      hasOrg: !!resolvedOrgId,
    });

    const response = NextResponse.redirect(new URL(destination, request.url), { status: 303 });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SUPPLIER_SESSION_MAX_AGE,
    });

    return response;
  } catch (err: any) {
    console.error('[SUPPLIER_AUTH] Unexpected error during sign in:', err?.message || err);
    return NextResponse.redirect(
      new URL('/supplier-portal/sign-in?error=server', request.url),
      { status: 303 }
    );
  }
}
