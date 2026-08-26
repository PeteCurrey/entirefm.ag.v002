/**
 * GET /api/supplier/auth/reset-password/session
 * ===============================================
 * One-time recovery session reader.
 *
 * Called by the /supplier-portal/reset-password client page after arriving from
 * /auth/confirm?type=recovery. Reads the short-lived efm_recovery HTTP-only cookie,
 * validates its HMAC signature and TTL, and returns the Supabase access_token
 * needed to call supabaseUpdatePassword.
 *
 * SECURITY INVARIANTS:
 * - Cookie is immediately deleted after a successful read (one-time-use).
 * - Cookie path is restricted to this endpoint only.
 * - Cookie is HTTP-only and Secure in production.
 * - TTL is 5 minutes from issuance by /auth/confirm.
 * - The access_token is never stored server-side beyond the duration of this response.
 * - No sensitive data is logged.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifyRecoveryCookieValue } from '@/server/auth/recovery-cookie';

const RECOVERY_COOKIE_NAME = 'efm_recovery';

export async function GET(request: NextRequest) {
  const cookieValue = request.cookies.get(RECOVERY_COOKIE_NAME)?.value;

  if (!cookieValue) {
    console.warn('[SUPPLIER_AUTH] Recovery session read: no recovery cookie present.');
    return NextResponse.json(
      { valid: false, reason: 'not_found' },
      { status: 401 }
    );
  }

  const result = verifyRecoveryCookieValue(cookieValue);

  if ('error' in result) {
    console.warn('[SUPPLIER_AUTH] Recovery session read: cookie invalid or expired.', {
      reason: result.error,
    });
    const response = NextResponse.json(
      { valid: false, reason: result.error },
      { status: 401 }
    );
    // Clear the invalid/expired cookie
    response.cookies.delete(RECOVERY_COOKIE_NAME);
    return response;
  }

  console.info('[SUPPLIER_AUTH] Recovery session read: valid token returned to reset page.');

  // Return access_token to the reset page client component
  const response = NextResponse.json({
    valid: true,
    accessToken: result.accessToken,
  });

  // Immediately delete the one-time-use cookie
  response.cookies.delete(RECOVERY_COOKIE_NAME);

  return response;
}
