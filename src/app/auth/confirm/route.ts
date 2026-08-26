/**
 * GET /auth/confirm
 * ==================
 * Canonical Supabase SSR Email Confirmation Callback Endpoint.
 *
 * Handles incoming verification links from Supabase Auth emails:
 *   /auth/confirm?token_hash=...&type=email
 *
 * Lifecycle:
 * 1. Validates token_hash and type parameters.
 * 2. Calls Supabase Auth to verify the OTP / token hash server-side.
 * 3. Marks the supplier domain user's email as verified.
 * 4. Ensures no transient session bypasses sign-in.
 * 5. Redirects to /supplier-portal/sign-in?verified=1 with clean URL.
 * 6. On failure (invalid/expired/already used), redirects to /supplier-portal/verify-email?error=invalid_or_expired.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { supabaseVerifyOtp, type EmailOtpType } from '@/server/auth/supabase-auth';
import { setSupplierUserEmailVerified } from '@/server/suppliers/supplier-auth-store';
import { AUTH_COOKIE_NAME } from '@/server/identity';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = (searchParams.get('type') || 'email') as EmailOtpType;

  // 1. Missing Parameter Guard (Fail-Closed)
  if (!token_hash) {
    console.warn('[AUTH_CONFIRM] Missing token_hash parameter in verification request.');
    const errorUrl = new URL('/supplier-portal/verify-email', request.url);
    errorUrl.searchParams.set('error', 'invalid_or_expired');
    return NextResponse.redirect(errorUrl);
  }

  // 2. Server-Side Token Verification via Supabase Auth
  try {
    const result = await supabaseVerifyOtp(token_hash, type);

    if (result.error || !result.data) {
      console.warn('[AUTH_CONFIRM] Supabase OTP verification rejected:', result.error?.message);
      const errorUrl = new URL('/supplier-portal/verify-email', request.url);
      errorUrl.searchParams.set('error', 'invalid_or_expired');
      return NextResponse.redirect(errorUrl);
    }

    const verifiedUser = result.data.user;

    // 3. Mark Domain Record Verified
    if (verifiedUser?.id) {
      await setSupplierUserEmailVerified(verifiedUser.id, true);
    }

    // 4. Handle Password Recovery vs Email Verification
    if (type === 'recovery') {
      const resetUrl = new URL('/supplier-portal/reset-password', request.url);
      return NextResponse.redirect(resetUrl);
    }

    // 5. Success Destination: /supplier-portal/sign-in?verified=1
    // Explicitly delete any temporary session cookie so the user enters their credentials
    const successUrl = new URL('/supplier-portal/sign-in', request.url);
    successUrl.searchParams.set('verified', '1');

    const response = NextResponse.redirect(successUrl);
    response.cookies.delete(AUTH_COOKIE_NAME);
    response.cookies.delete('efm_admin');
    return response;
  } catch (err: any) {
    console.error('[AUTH_CONFIRM] Unexpected verification exception:', err);
    const errorUrl = new URL('/supplier-portal/verify-email', request.url);
    errorUrl.searchParams.set('error', 'invalid_or_expired');
    return NextResponse.redirect(errorUrl);
  }
}
