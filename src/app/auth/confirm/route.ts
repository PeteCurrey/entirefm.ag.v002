/**
 * GET /auth/confirm
 * ==================
 * Canonical Supabase SSR Email Confirmation Callback Endpoint.
 *
 * Handles incoming verification links from Supabase Auth emails:
 *   /auth/confirm?token_hash=...&type=email|recovery|signup|invite|email_change
 *
 * Lifecycle:
 * 1. Validates token_hash and type parameters.
 * 2. Calls Supabase Auth to verify the OTP / token hash server-side.
 * 3. Dispatches correctly by type:
 *    - recovery: stores verified access_token in encrypted, short-lived HTTP-only cookie
 *                and redirects to /supplier-portal/reset-password.
 *    - signup / email_change / invite: marks supplier domain record verified,
 *                clears any session cookie, redirects to /supplier-portal/sign-in?verified=1.
 * 4. On failure (invalid/expired/already used), redirects to /supplier-portal/verify-email?error=invalid_or_expired.
 *
 * RECOVERY TOKEN SECURITY:
 * The Supabase recovery access_token is never exposed in the URL.
 * It is stored in an HTTP-only, Secure, SameSite=Strict cookie (efm_recovery)
 * with a 5-minute TTL and consumed exactly once by GET /api/supplier/auth/reset-password/session.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { supabaseVerifyOtp, type EmailOtpType } from '@/server/auth/supabase-auth';
import { setSupplierUserEmailVerified } from '@/server/suppliers/supplier-auth-store';
import { AUTH_COOKIE_NAME } from '@/server/identity';
import { createRecoveryCookieValue } from '@/server/auth/recovery-cookie';

const RECOVERY_COOKIE_NAME = 'efm_recovery';

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
      console.warn('[AUTH_CONFIRM] Supabase OTP verification rejected:', result.error?.message, { type });
      const errorUrl = new URL('/supplier-portal/verify-email', request.url);
      errorUrl.searchParams.set('error', 'invalid_or_expired');
      return NextResponse.redirect(errorUrl);
    }

    const verifiedUser = result.data.user;
    const verifiedSession = result.data.session;

    // 3. Mark Domain Record Verified (for non-recovery types)
    if (verifiedUser?.id && type !== 'recovery') {
      await setSupplierUserEmailVerified(verifiedUser.id, true);
    }

    // 4a. Handle Password Recovery — store access_token in secure HTTP-only cookie
    if (type === 'recovery') {
      const accessToken = verifiedSession?.access_token;

      if (!accessToken) {
        console.error('[AUTH_CONFIRM] Recovery OTP verified but no access_token returned from Supabase.');
        const errorUrl = new URL('/supplier-portal/forgot-password', request.url);
        errorUrl.searchParams.set('error', 'recovery_token_missing');
        return NextResponse.redirect(errorUrl);
      }

      console.info('[AUTH_CONFIRM] Recovery token verified. Routing to password reset page.', {
        userId: verifiedUser?.id,
      });

      const resetUrl = new URL('/supplier-portal/reset-password', request.url);
      const cookieValue = createRecoveryCookieValue(accessToken);

      const response = NextResponse.redirect(resetUrl);
      // HTTP-only, Secure in production, SameSite=Lax (Strict would block the redirect itself), 5-minute TTL
      response.cookies.set(RECOVERY_COOKIE_NAME, cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 300, // 5 minutes
      });
      // Clear any existing session so recovery cannot bypass auth
      response.cookies.delete(AUTH_COOKIE_NAME);
      response.cookies.delete('efm_admin');
      return response;
    }

    // 4b. Email Verification Success — route to sign-in with verified flag
    console.info('[AUTH_CONFIRM] Email verification success.', {
      userId: verifiedUser?.id,
      type,
    });

    const successUrl = new URL('/supplier-portal/sign-in', request.url);
    successUrl.searchParams.set('verified', '1');

    const response = NextResponse.redirect(successUrl);
    response.cookies.delete(AUTH_COOKIE_NAME);
    response.cookies.delete('efm_admin');
    return response;
  } catch (err: any) {
    console.error('[AUTH_CONFIRM] Unexpected verification exception:', err?.message || err);
    const errorUrl = new URL('/supplier-portal/verify-email', request.url);
    errorUrl.searchParams.set('error', 'invalid_or_expired');
    return NextResponse.redirect(errorUrl);
  }
}
