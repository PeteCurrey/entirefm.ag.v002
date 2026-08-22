/**
 * VERIFIED CLAIMS AUTHORITY
 * =========================
 * Single source of truth for all business claims, accreditations, and certifications.
 * Only claims with status === 'VERIFIED' may be rendered in user-facing components.
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

/** Check if a specific claim ID is verified for public display */
export function isClaimVerified(claimId: string): boolean {
  const c = BUSINESS_CLAIMS.find(item => item.id === claimId);
  return c ? c.status === 'VERIFIED' : false;
}

/** Get only verified accreditations for public rendering */
export function getVerifiedAccreditations(): BusinessClaim[] {
  return BUSINESS_CLAIMS.filter(c => c.category === 'Accreditation' && c.status === 'VERIFIED');
}

/** Get approved wording fallback if available */
export function getApprovedWording(claimId: string, fallback: string): string {
  const c = BUSINESS_CLAIMS.find(item => item.id === claimId);
  return (c && c.approvedWording) ? c.approvedWording : fallback;
}
