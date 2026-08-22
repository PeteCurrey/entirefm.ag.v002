/**
 * VERIFIED CLAIMS AUTHORITY
 * =========================
 * Single source of truth for all business claims, accreditations, and certifications.
 * Only claims with status === 'VERIFIED' may be rendered in user-facing components.
 *
 * Usage:
 *   const claim = getVerifiedClaim('gas-safe');
 *   if (!claim) return null; // Do not render if not verified
 */

import claimsConfig from '../../config/verified-claims.json';

export type ClaimStatus = 'VERIFIED' | 'TO_VERIFY' | 'DO_NOT_USE';

export interface BusinessClaim {
  id: string;
  claim: string;
  category: string;
  status: ClaimStatus;
  evidence: string | null;
  approvedWording: string | null;
  approvedContexts: string[];
  verifiedBy: string | null;
  verifiedDate: string | null;
}

export const BUSINESS_CLAIMS: BusinessClaim[] = claimsConfig.claims as BusinessClaim[];

/**
 * Get a verified claim by ID.
 * Returns null if the claim does not exist or is not VERIFIED.
 * Components MUST handle null — do not render anything when this returns null.
 */
export function getVerifiedClaim(claimId: string): BusinessClaim | null {
  const c = BUSINESS_CLAIMS.find(item => item.id === claimId);
  return c?.status === 'VERIFIED' ? c : null;
}

/**
 * Check if a specific claim ID is verified for public display.
 * Use getVerifiedClaim() when you need the claim data.
 * Use isClaimVerified() for boolean guards only.
 */
export function isClaimVerified(claimId: string): boolean {
  return getVerifiedClaim(claimId) !== null;
}

/**
 * Get only verified accreditations for public rendering.
 * Currently returns [] until accreditations are explicitly verified.
 */
export function getVerifiedAccreditations(): BusinessClaim[] {
  return BUSINESS_CLAIMS.filter(c => c.category === 'Accreditation' && c.status === 'VERIFIED');
}

/**
 * Get approved wording for a verified claim, or return fallback.
 * Returns fallback if claim is not verified (does not expose unverified claim text).
 */
export function getApprovedWording(claimId: string, fallback: string): string {
  const c = getVerifiedClaim(claimId);
  return c?.approvedWording ?? fallback;
}
