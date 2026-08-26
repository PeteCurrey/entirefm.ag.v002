/**
 * ENTIREFM AUTH — Recovery Cookie Utilities
 * ==========================================
 * Encodes and verifies the one-time, HMAC-signed, HTTP-only recovery cookie
 * used to securely pass a Supabase access_token from /auth/confirm to
 * /api/supplier/auth/reset-password/session without ever exposing it in the URL.
 *
 * Cookie format: base64url(accessToken).timestamp.hmac-signature
 * TTL: 5 minutes from issuance
 */

import { createHmac } from 'node:crypto';

const RECOVERY_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getRecoverySecret(): string {
  return (
    process.env.AUTH_HMAC_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'efm-recovery-fallback-key'
  );
}

function signRecoveryPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Encode a Supabase access_token into a signed, time-stamped cookie value.
 * Format: base64url(accessToken).timestamp.hmac-signature
 */
export function createRecoveryCookieValue(accessToken: string): string {
  const secret = getRecoverySecret();
  const encoded = Buffer.from(accessToken).toString('base64url');
  const ts = Date.now().toString();
  const sig = signRecoveryPayload(`${encoded}.${ts}`, secret);
  return `${encoded}.${ts}.${sig}`;
}

/**
 * Verify and decode a recovery cookie value.
 * Returns the access_token if valid, or an error reason if not.
 */
export function verifyRecoveryCookieValue(
  cookieValue: string
): { accessToken: string } | { error: 'expired' | 'invalid' } {
  try {
    const secret = getRecoverySecret();
    const parts = cookieValue.split('.');
    if (parts.length !== 3) return { error: 'invalid' };
    const [encoded, ts, sig] = parts;
    const expectedSig = signRecoveryPayload(`${encoded}.${ts}`, secret);
    if (expectedSig !== sig) return { error: 'invalid' };
    const issueTime = parseInt(ts, 10);
    if (isNaN(issueTime) || Date.now() - issueTime > RECOVERY_TTL_MS) {
      return { error: 'expired' };
    }
    const accessToken = Buffer.from(encoded, 'base64url').toString('utf8');
    return { accessToken };
  } catch {
    return { error: 'invalid' };
  }
}
