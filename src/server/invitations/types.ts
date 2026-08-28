/**
 * ENTIREFM INVITATION CODE TYPES
 * ==============================
 * Data structures for controlled EntireFM Invitation Codes waiving contractor
 * membership fees to £0, and atomic redemption records.
 */

import { MembershipTierCode } from '@/config/supplier-data';

export type InvitationTierEligibility = 'TIER_1' | 'TIER_2' | 'ANY';
export type InvitationFeeTreatment = 'FULL_WAIVER';

export interface InvitationCodeRecord {
  id: string;
  code: string; // e.g. EFM-7K4P-X9Q2
  tierEligibility: InvitationTierEligibility;
  feeTreatment: InvitationFeeTreatment;
  maxRedemptions: number;
  redemptionsCount: number;
  boundEmail?: string | null;
  boundOrgId?: string | null;
  expiresAt: string;
  internalReason?: string | null;
  createdByAdminId: string;
  isRevoked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationRedemptionRecord {
  id: string;
  invitationCodeId: string;
  supplierOrgId: string;
  redeemedByAuthUserId: string;
  redeemedAt: string;
  membershipTier: MembershipTierCode;
  standardAmountGbp: number;
  waivedAmountGbp: number;
  finalAmountGbp: number;
}

export type InvitationValidationResult =
  | {
      valid: true;
      invitationId: string;
      code: string;
      tierEligibility: InvitationTierEligibility;
      feeTreatment: InvitationFeeTreatment;
      standardAmountGbp: number;
      waivedAmountGbp: number;
      finalAmountGbp: number;
      boundEmail?: string | null;
      expiresAt: string;
    }
  | {
      valid: false;
      reason:
        | 'INVALID_CODE'
        | 'EXPIRED'
        | 'REVOKED'
        | 'MAX_REDEMPTIONS_REACHED'
        | 'TIER_MISMATCH'
        | 'EMAIL_MISMATCH'
        | 'ORGANISATION_MISMATCH'
        | 'SERVER_ERROR';
      message: string;
    };
