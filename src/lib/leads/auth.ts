/**
 * ADMIN ACCESS
 * ============
 * A single shared password held in `ADMIN_PASSWORD`, exchanged for an
 * httpOnly session cookie.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * This is deliberately basic — one password, one cookie, no user accounts, no
 * roles, no reset flow. It is appropriate for an internal enquiry list used by
 * a small team on day one, and it is NOT a substitute for real authentication
 * if this ever grows into a client-facing portal.
 *
 * What it does do properly:
 *   · the cookie is httpOnly, so client script cannot read it
 *   · the cookie value is an HMAC of the password, not the password itself,
 *     so a stolen cookie does not reveal the credential
 *   · comparison is constant-time, so the endpoint cannot be used as an oracle
 *     to guess the password one character at a time
 *   · SameSite=Lax and Secure in production
 *
 * If `ADMIN_PASSWORD` is unset the admin area refuses everyone rather than
 * defaulting open. An unset secret must never mean "no lock".
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'efm_admin';

function secret() {
  return process.env.ADMIN_PASSWORD ?? '';
}

/** The value stored in the cookie: derived from the password, never equal to it. */
export function sessionToken(): string | null {
  const s = secret();
  if (!s) return null;
  return createHmac('sha256', s).update('efm-admin-session-v1').digest('hex');
}

/** Constant-time string comparison that tolerates differing lengths. */
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    // Still burn a comparison so the timing does not leak the length.
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

export function passwordMatches(candidate: string): boolean {
  const s = secret();
  if (!s) return false;
  return safeEqual(candidate, s);
}

export function cookieMatches(value: string | undefined): boolean {
  const expected = sessionToken();
  if (!expected || !value) return false;
  return safeEqual(value, expected);
}

/** Whether an admin password has been configured at all. */
export function adminConfigured() {
  return secret().length > 0;
}
