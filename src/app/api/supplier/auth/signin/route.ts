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
    }

    if (!supplierUser) {
      return NextResponse.redirect(
        new URL('/supplier-portal/sign-in?error=provisioning_failed', request.url),
        { status: 303 }
      );
    }

    if (supplierUser.status === 'SUSPENDED') {
      return NextResponse.redirect(
        new URL('/supplier-portal/sign-in?error=account_suspended', request.url),
        { status: 303 }
      );
    }

    // 3. Build Unified Session
    const session = {
      personId: authUser.id,
      authUserId: authUser.id,
      email: supplierUser.email,
      name: `${supplierUser.first_name} ${supplierUser.last_name}`.trim(),
      role: supplierUser.role,
      orgId: supplierUser.organisation_id || authUser.id,
      orgName: 'Supplier Organisation',
      orgType: 'SUPPLIER' as const,
      activeApplication: 'ADMIN' as const,
      permissions: getRolePermissions(supplierUser.role as any),
      scopes: [],
      expiresAt: Date.now() + SUPPLIER_SESSION_MAX_AGE * 1000,
    };

    const token = createSessionToken(session as any);

    // 4. Resolve lifecycle-aware destination
    const destination = redirectParam || (await resolveResumeDestination(authUser.id));

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
    console.error('[SUPPLIER_SIGNIN] Unexpected error:', err);
    return NextResponse.redirect(
      new URL('/supplier-portal/sign-in?error=server', request.url),
      { status: 303 }
    );
  }
}
