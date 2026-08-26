/**
 * POST /api/supplier/auth/register
 * ================================
 * Register a new supplier user via Supabase Auth (Canonical Authority).
 * Passes credentials to Supabase Auth. EntireFM NEVER stores or hashes passwords.
 * Provisions supplier-domain user record linked to Supabase Auth UUID.
 */

import { NextResponse } from 'next/server';
import { supabaseSignUp } from '@/server/auth/supabase-auth';
import { createOrLinkSupplierUser } from '@/server/suppliers/supplier-auth-store';
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  getRolePermissions,
} from '@/server/identity';

const SUPPLIER_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { firstName, lastName, email, password, confirmPassword } = body as Record<string, string>;

    // 1. Server-side validation
    const errors: string[] = [];
    if (!firstName?.trim()) errors.push('First name is required.');
    if (!lastName?.trim()) errors.push('Last name is required.');
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.push('A valid work email address is required.');
    if (!password || password.length < 10)
      errors.push('Password must be at least 10 characters.');
    if (!/[A-Z]/.test(password || ''))
      errors.push('Password must contain at least one uppercase letter.');
    if (!/\d/.test(password || ''))
      errors.push('Password must contain at least one number.');
    if (password !== confirmPassword)
      errors.push('Passwords do not match.');

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const normEmail = email.trim().toLowerCase();

    // 2. Delegate credential authority to Supabase Auth
    const { data: authData, error: authError } = await supabaseSignUp(
      normEmail,
      password,
      {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        user_type: 'SUPPLIER',
      }
    );

    if (authError || !authData?.user) {
      const errMsg = authError?.message || 'Registration failed with authentication provider.';
      // User already registered check
      if (errMsg.toLowerCase().includes('already registered') || errMsg.toLowerCase().includes('user already exists')) {
        return NextResponse.json(
          { success: false, errors: ['An account with this email address already exists. Please sign in.'] },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, errors: [errMsg] },
        { status: 400 }
      );
    }

    const supabaseUser = authData.user;
    const isEmailConfirmed = !!supabaseUser.email_confirmed_at;

    // 3. Provision Supplier Domain User linked to Supabase UUID
    const domainResult = await createOrLinkSupplierUser(
      supabaseUser.id,
      normEmail,
      firstName.trim(),
      lastName.trim(),
      'SUPPLIER_ADMIN',
      isEmailConfirmed
    );

    if (!domainResult.success || !domainResult.user) {
      return NextResponse.json(
        { success: false, errors: ['Failed to provision supplier account metadata. Please try again.'] },
        { status: 500 }
      );
    }

    // 4. Issue authenticated session
    const session = {
      personId: supabaseUser.id,
      authUserId: supabaseUser.id,
      email: normEmail,
      name: `${firstName.trim()} ${lastName.trim()}`,
      role: 'SUPPLIER_ADMIN' as const,
      orgId: domainResult.user.organisation_id || supabaseUser.id,
      orgName: 'New Supplier',
      orgType: 'SUPPLIER' as const,
      activeApplication: 'ADMIN' as const,
      permissions: getRolePermissions('SUPPLIER_ADMIN' as any),
      scopes: [],
      expiresAt: Date.now() + SUPPLIER_SESSION_MAX_AGE * 1000,
    };

    const token = createSessionToken(session as any);

    const redirectUrl = isEmailConfirmed
      ? '/supplier-portal/org-setup'
      : `/supplier-portal/verify-email?email=${encodeURIComponent(normEmail)}`;

    const response = NextResponse.json({
      success: true,
      emailVerificationRequired: !isEmailConfirmed,
      redirectUrl,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SUPPLIER_SESSION_MAX_AGE,
    });

    return response;
  } catch (err: any) {
    console.error('[SUPPLIER_REGISTER] Unexpected error:', err);
    return NextResponse.json(
      { success: false, errors: ['An unexpected error occurred. Please try again.'] },
      { status: 500 }
    );
  }
}
