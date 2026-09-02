/**
 * ENTIREFM SUPABASE AUTH <-> FIRESTORE VERIFICATION BRIDGE
 * ==========================================================
 * Explicit server-side verification of Supabase Auth JWTs.
 * Prevents client-supplied UID spoofing before performing any
 * operations on Firestore documents keyed on /estates/{supabaseUid}.
 */

import { supabaseGetUser, SupabaseAuthUser } from '../auth/supabase-auth';

export interface VerifiedAuthContext {
  supabaseUid: string;
  user: SupabaseAuthUser;
}

/**
 * Extracts and strictly verifies the Supabase JWT from the Authorization header
 * or raw token string. Does NOT trust client-supplied uid parameters.
 *
 * @param authHeaderOrToken The "Bearer <token>" header or raw JWT token string
 * @returns VerifiedAuthContext containing the cryptographically confirmed Supabase UID
 * @throws Error if token is missing, invalid, or expired
 */
export async function verifySupabaseAuthToken(
  authHeaderOrToken?: string | null
): Promise<VerifiedAuthContext> {
  if (!authHeaderOrToken || typeof authHeaderOrToken !== 'string') {
    throw new Error('Authentication required: Missing Authorization token');
  }

  const token = authHeaderOrToken.startsWith('Bearer ')
    ? authHeaderOrToken.slice(7).trim()
    : authHeaderOrToken.trim();

  if (!token) {
    throw new Error('Authentication required: Malformed Bearer token');
  }

  // Cryptographically verify the token against Supabase Auth API
  const { data: user, error } = await supabaseGetUser(token);

  if (error || !user || !user.id) {
    throw new Error(
      `Invalid or expired authentication token: ${error?.message || 'Verification failed'}`
    );
  }

  return {
    supabaseUid: user.id,
    user,
  };
}

/**
 * Validates that a requested target UID strictly matches the verified Supabase UID.
 * Rejects any cross-user or privilege escalation attempts.
 */
export function assertMatchingUid(verifiedUid: string, targetUid: string): void {
  if (verifiedUid !== targetUid) {
    throw new Error(
      `Access Denied: Verified identity (${verifiedUid}) does not match target resource (${targetUid})`
    );
  }
}
