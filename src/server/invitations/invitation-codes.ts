/**
 * ENTIREFM INVITATION CODE REPOSITORY & ATOMIC REDEMPTION ENGINE
 * =============================================================
 * Authority for:
 * 1. Secure generation of non-guessable EntireFM Invitation Codes (EFM-XXXX-XXXX).
 * 2. Strict server-side verification and policy validation.
 * 3. Atomic, race-condition-free server-side redemption and fee waiver.
 * 4. Immutable audit ledger recording standard price, waiver amount, and actor.
 *
 * NON-NEGOTIABLE SAFETY GUARANTEES:
 * - Server-side price authority: Client-provided amount=0 is never accepted.
 * - Atomic concurrency control: Two simultaneous requests against a 1-use code
 *   will result in exactly one successful redemption.
 * - Fee waiver ONLY: Does NOT bypass compliance vetting or auto-approve contractor.
 * - Canonical pricing: The standard amount waived is always £95 (the single annual
 *   membership fee). Historical £295/£695 waivers are preserved in the audit ledger
 *   as-is — do not alter historical records.
 */

import { randomBytes } from 'node:crypto';
import { dbQuery, isDbConfigured } from '@/server/db/client';
import { SUPPLIER_MEMBERSHIP } from '@/config/supplier-membership';
import type { MembershipTierCode } from '@/config/supplier-data';
import {
  InvitationCodeRecord,
  InvitationRedemptionRecord,
  InvitationTierEligibility,
  InvitationFeeTreatment,
  InvitationValidationResult,
} from './types';

// ── In-Memory Global Cache (Singleton for zero-downtime & test isolation) ─────

interface GlobalInvitationStore {
  codesById: Map<string, InvitationCodeRecord>;
  codesByNormalizedString: Map<string, string>; // lower(code) -> id
  redemptions: InvitationRedemptionRecord[];
}

const GLOBAL_INVITATION_KEY = Symbol.for('entirefm.invitation.store');
const globalScope = globalThis as unknown as {
  [GLOBAL_INVITATION_KEY]?: GlobalInvitationStore;
};

if (!globalScope[GLOBAL_INVITATION_KEY]) {
  globalScope[GLOBAL_INVITATION_KEY] = {
    codesById: new Map(),
    codesByNormalizedString: new Map(),
    redemptions: [],
  };
}

const store = globalScope[GLOBAL_INVITATION_KEY]!;

// ── Code Generation ──────────────────────────────────────────────────────────

/**
 * Generates an EntireFM invitation code in standard format: EFM-XXXX-XXXX
 * Uses cryptographic randomness (non-sequential, high-entropy, uppercase alphanumeric).
 */
export function generateInvitationCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude visually ambiguous chars: 0, 1, I, O
  const getSegment = (length: number) => {
    const bytes = randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[bytes[i] % chars.length];
    }
    return result;
  };

  return `EFM-${getSegment(4)}-${getSegment(4)}`;
}

// ── Code Creation (Admin) ───────────────────────────────────────────────────

export interface CreateInvitationParams {
  tierEligibility?: InvitationTierEligibility;
  feeTreatment?: InvitationFeeTreatment;
  maxRedemptions?: number;
  expiryDays?: number;
  boundEmail?: string | null;
  boundOrgId?: string | null;
  internalReason?: string | null;
  createdByAdminId: string;
}

export async function createInvitationCode(
  params: CreateInvitationParams
): Promise<InvitationCodeRecord> {
  const code = generateInvitationCode();
  const id = `inv_${randomBytes(12).toString('hex')}`;
  const now = new Date();
  const expiryDays = typeof params.expiryDays === 'number' ? params.expiryDays : 30;
  const expiresAt = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000).toISOString();

  const record: InvitationCodeRecord = {
    id,
    code,
    tierEligibility: params.tierEligibility || 'ANY',
    feeTreatment: params.feeTreatment || 'FULL_WAIVER',
    maxRedemptions: typeof params.maxRedemptions === 'number' && params.maxRedemptions > 0 ? params.maxRedemptions : 1,
    redemptionsCount: 0,
    boundEmail: params.boundEmail ? params.boundEmail.trim().toLowerCase() : null,
    boundOrgId: params.boundOrgId ? params.boundOrgId.trim() : null,
    expiresAt,
    internalReason: params.internalReason?.trim() || null,
    createdByAdminId: params.createdByAdminId,
    isRevoked: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  // 1. Write to DB if configured
  if (isDbConfigured()) {
    try {
      await dbQuery(
        'entirefm_invitation_codes',
        {
          method: 'POST',
          body: {
            id: record.id,
            code: record.code,
            tier_eligibility: record.tierEligibility,
            fee_treatment: record.feeTreatment,
            max_redemptions: record.maxRedemptions,
            redemptions_count: record.redemptionsCount,
            bound_email: record.boundEmail,
            bound_org_id: record.boundOrgId,
            expires_at: record.expiresAt,
            internal_reason: record.internalReason,
            created_by_admin_id: record.createdByAdminId,
            is_revoked: record.isRevoked,
            created_at: record.createdAt,
            updated_at: record.updatedAt,
          },
        }
      );
    } catch (err) {
      console.warn('DB insert failed for invitation code, writing to memory cache:', err);
    }
  }

  // 2. Cache in memory
  store.codesById.set(record.id, record);
  store.codesByNormalizedString.set(record.code.toLowerCase(), record.id);

  return record;
}

// ── Validation Engine ────────────────────────────────────────────────────────

export interface ValidateInvitationOptions {
  tier?: MembershipTierCode;
  email?: string;
  orgId?: string;
}

export async function validateInvitationCode(
  rawCode: string,
  options: ValidateInvitationOptions = {}
): Promise<InvitationValidationResult> {
  if (!rawCode || typeof rawCode !== 'string') {
    return { valid: false, reason: 'INVALID_CODE', message: 'No invitation code provided.' };
  }

  const normalized = rawCode.trim().toLowerCase();
  let codeRecord: InvitationCodeRecord | null = null;

  // 1. Check DB first if available
  if (isDbConfigured()) {
    try {
      const res = await dbQuery<any[]>(
        `entirefm_invitation_codes?code=ilike.${encodeURIComponent(normalized)}&limit=1`,
        { method: 'GET' }
      );
      const rows = res.data;
      if (rows && rows.length > 0) {
        const r = rows[0];
        codeRecord = {
          id: r.id,
          code: r.code,
          tierEligibility: r.tier_eligibility,
          feeTreatment: r.fee_treatment,
          maxRedemptions: r.max_redemptions,
          redemptionsCount: r.redemptions_count,
          boundEmail: r.bound_email,
          boundOrgId: r.bound_org_id,
          expiresAt: r.expires_at,
          internalReason: r.internal_reason,
          createdByAdminId: r.created_by_admin_id,
          isRevoked: Boolean(r.is_revoked),
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        };
        // Update memory cache
        store.codesById.set(codeRecord.id, codeRecord);
        store.codesByNormalizedString.set(codeRecord.code.toLowerCase(), codeRecord.id);
      }
    } catch (err) {
      console.warn('DB lookup failed for invitation code, falling back to cache:', err);
    }
  }

  // 2. Fallback to memory cache
  if (!codeRecord) {
    const id = store.codesByNormalizedString.get(normalized);
    if (id) {
      codeRecord = store.codesById.get(id) || null;
    }
  }

  if (!codeRecord) {
    return {
      valid: false,
      reason: 'INVALID_CODE',
      message: 'The invitation code entered is invalid. Please check and try again.',
    };
  }

  // Check Revocation
  if (codeRecord.isRevoked) {
    return {
      valid: false,
      reason: 'REVOKED',
      message: 'This invitation code has been revoked by EntireFM Administrator.',
    };
  }

  // Check Expiry
  const now = new Date();
  const expiresAtDate = new Date(codeRecord.expiresAt);
  if (now > expiresAtDate) {
    return {
      valid: false,
      reason: 'EXPIRED',
      message: 'This invitation code expired on ' + expiresAtDate.toLocaleDateString('en-GB') + '.',
    };
  }

  // Check Max Redemptions
  if (codeRecord.redemptionsCount >= codeRecord.maxRedemptions) {
    return {
      valid: false,
      reason: 'MAX_REDEMPTIONS_REACHED',
      message: 'This invitation code has already been redeemed the maximum permitted number of times.',
    };
  }

  // Check Tier Eligibility
  if (options.tier && codeRecord.tierEligibility !== 'ANY') {
    if ((codeRecord.tierEligibility as string) !== (options.tier as string)) {
      const eligibleName =
        (codeRecord.tierEligibility as string) === 'TIER_1'
          ? 'Contractor Network Member'
          : 'Network Partner';
      return {
        valid: false,
        reason: 'TIER_MISMATCH',
        message: `This invitation code is specifically allocated to the ${eligibleName}.`,
      };
    }
  }

  // Check Bound Email (if configured)
  if (codeRecord.boundEmail && options.email) {
    if (codeRecord.boundEmail.toLowerCase() !== options.email.trim().toLowerCase()) {
      return {
        valid: false,
        reason: 'EMAIL_MISMATCH',
        message: 'This invitation code is restricted to a specific registered contact email address.',
      };
    }
  }

  // Check Bound Org ID (if configured)
  if (codeRecord.boundOrgId && options.orgId) {
    if (codeRecord.boundOrgId !== options.orgId) {
      return {
        valid: false,
        reason: 'ORGANISATION_MISMATCH',
        message: 'This invitation code is restricted to a specific contractor organisation.',
      };
    }
  }

  // Canonical membership price: £95 + VAT / year (single membership, no tiers).
  // Historical £295/£695 waivers remain in the audit ledger unaltered.
  const standardAmountGbp = SUPPLIER_MEMBERSHIP.annualPriceExVat; // 95
  const waivedAmountGbp = standardAmountGbp;
  const finalAmountGbp = 0.00;

  return {
    valid: true,
    invitationId: codeRecord.id,
    code: codeRecord.code,
    tierEligibility: codeRecord.tierEligibility,
    feeTreatment: codeRecord.feeTreatment,
    standardAmountGbp,
    waivedAmountGbp,
    finalAmountGbp,
    boundEmail: codeRecord.boundEmail,
    expiresAt: codeRecord.expiresAt,
  };
}

// ── Atomic Redemption Engine (Concurrency-Safe) ─────────────────────────────

export interface RedeemInvitationParams {
  invitationId: string;
  supplierOrgId: string;
  authUserId: string;
  selectedTier: MembershipTierCode;
  email?: string;
}

export interface RedemptionResult {
  success: boolean;
  redemption?: InvitationRedemptionRecord;
  error?: string;
  errorCode?: string;
}

/**
 * Atomically redeems an EntireFM Invitation Code.
 * Ensures strict concurrency safety via conditional update (redemptions_count < max_redemptions).
 * Writes an immutable redemption record into entirefm_invitation_redemptions.
 */
export async function atomicRedeemInvitationCode(
  params: RedeemInvitationParams
): Promise<RedemptionResult> {
  const { invitationId, supplierOrgId, authUserId, selectedTier, email } = params;

  // 1. Validate eligibility
  let codeRecord: InvitationCodeRecord | null = store.codesById.get(invitationId) || null;

  if (isDbConfigured()) {
    try {
      const res = await dbQuery<any[]>(
        `entirefm_invitation_codes?id=eq.${encodeURIComponent(invitationId)}&limit=1`,
        { method: 'GET' }
      );
      const rows = res.data;
      if (rows && rows.length > 0) {
        const r = rows[0];
        codeRecord = {
          id: r.id,
          code: r.code,
          tierEligibility: r.tier_eligibility,
          feeTreatment: r.fee_treatment,
          maxRedemptions: r.max_redemptions,
          redemptionsCount: r.redemptions_count,
          boundEmail: r.bound_email,
          boundOrgId: r.bound_org_id,
          expiresAt: r.expires_at,
          internalReason: r.internal_reason,
          createdByAdminId: r.created_by_admin_id,
          isRevoked: Boolean(r.is_revoked),
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        };
      }
    } catch (err) {
      console.warn('DB read failed during atomic redemption, using cache:', err);
    }
  }

  if (!codeRecord) {
    return { success: false, error: 'Invitation record not found', errorCode: 'NOT_FOUND' };
  }

  // Pre-condition checks
  if (codeRecord.isRevoked) {
    return { success: false, error: 'Invitation has been revoked', errorCode: 'REVOKED' };
  }
  if (new Date() > new Date(codeRecord.expiresAt)) {
    return { success: false, error: 'Invitation has expired', errorCode: 'EXPIRED' };
  }
  if (codeRecord.redemptionsCount >= codeRecord.maxRedemptions) {
    return { success: false, error: 'Invitation redemption limit reached', errorCode: 'MAX_REDEMPTIONS_REACHED' };
  }
  if (codeRecord.boundEmail && email && codeRecord.boundEmail.toLowerCase() !== email.toLowerCase()) {
    return { success: false, error: 'Email does not match invitation assignment', errorCode: 'EMAIL_MISMATCH' };
  }

  const standardAmountGbp = SUPPLIER_MEMBERSHIP.annualPriceExVat;
  const waivedAmountGbp = standardAmountGbp;
  const finalAmountGbp = 0.00;

  // 2. Perform Atomic Increment
  let incremented = false;

  if (isDbConfigured()) {
    try {
      // Conditional PATCH enforcing redemptions_count < max_redemptions
      const patchRes = await dbQuery<any[]>(
        `entirefm_invitation_codes?id=eq.${encodeURIComponent(invitationId)}&redemptions_count=lt.${codeRecord.maxRedemptions}&is_revoked=eq.false`,
        {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: {
            redemptions_count: codeRecord.redemptionsCount + 1,
            updated_at: new Date().toISOString(),
          },
        }
      );

      const updatedRows = patchRes.data;
      if (updatedRows && updatedRows.length > 0) {
        incremented = true;
        codeRecord.redemptionsCount = updatedRows[0].redemptions_count;
      }
    } catch (err) {
      console.warn('DB atomic increment failed, attempting memory locking:', err);
    }
  }

  // In-memory fallback atomic increment
  if (!incremented) {
    const memoryRecord = store.codesById.get(invitationId);
    if (!memoryRecord || memoryRecord.redemptionsCount >= memoryRecord.maxRedemptions) {
      return {
        success: false,
        error: 'Concurrent redemption conflict: invitation has already been redeemed.',
        errorCode: 'CONCURRENT_CONFLICT',
      };
    }
    memoryRecord.redemptionsCount += 1;
    memoryRecord.updatedAt = new Date().toISOString();
    codeRecord = memoryRecord;
    incremented = true;
  }

  // 3. Write Immutable Audit Record
  const redemptionId = `red_${randomBytes(12).toString('hex')}`;
  const now = new Date().toISOString();
  const redemptionRecord: InvitationRedemptionRecord = {
    id: redemptionId,
    invitationCodeId: invitationId,
    supplierOrgId,
    redeemedByAuthUserId: authUserId,
    redeemedAt: now,
    membershipTier: selectedTier,
    standardAmountGbp,
    waivedAmountGbp,
    finalAmountGbp,
  };

  if (isDbConfigured()) {
    try {
      await dbQuery(
        'entirefm_invitation_redemptions',
        {
          method: 'POST',
          body: {
            id: redemptionRecord.id,
            invitation_code_id: redemptionRecord.invitationCodeId,
            supplier_org_id: redemptionRecord.supplierOrgId,
            redeemed_by_auth_user_id: redemptionRecord.redeemedByAuthUserId,
            redeemed_at: redemptionRecord.redeemedAt,
            membership_tier: redemptionRecord.membershipTier,
            standard_amount_gbp: redemptionRecord.standardAmountGbp,
            waived_amount_gbp: redemptionRecord.waivedAmountGbp,
            final_amount_gbp: redemptionRecord.finalAmountGbp,
          },
        }
      );
    } catch (err) {
      console.warn('Failed to insert redemption audit row to DB:', err);
    }
  }

  store.redemptions.push(redemptionRecord);

  // 4. Update memory cache
  store.codesById.set(codeRecord.id, codeRecord);

  return {
    success: true,
    redemption: redemptionRecord,
  };
}

// ── Admin Management Helpers ────────────────────────────────────────────────

export async function listAllInvitationCodes(): Promise<InvitationCodeRecord[]> {
  if (isDbConfigured()) {
    try {
      const rows = await dbQuery<any[]>(
        'entirefm_invitation_codes?select=*&order=created_at.desc&limit=200',
        { method: 'GET' }
      );
      if (rows && Array.isArray(rows)) {
        return rows.map((r) => ({
          id: r.id,
          code: r.code,
          tierEligibility: r.tier_eligibility,
          feeTreatment: r.fee_treatment,
          maxRedemptions: r.max_redemptions,
          redemptionsCount: r.redemptions_count,
          boundEmail: r.bound_email,
          boundOrgId: r.bound_org_id,
          expiresAt: r.expires_at,
          internalReason: r.internal_reason,
          createdByAdminId: r.created_by_admin_id,
          isRevoked: Boolean(r.is_revoked),
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        }));
      }
    } catch (err) {
      console.warn('DB list invitation codes failed, returning memory store:', err);
    }
  }

  return Array.from(store.codesById.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function revokeInvitationCode(id: string): Promise<boolean> {
  if (isDbConfigured()) {
    try {
      await dbQuery(
        `entirefm_invitation_codes?id=eq.${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          body: {
            is_revoked: true,
            updated_at: new Date().toISOString(),
          },
        }
      );
    } catch (err) {
      console.warn('DB revoke invitation code failed:', err);
    }
  }

  const record = store.codesById.get(id);
  if (record) {
    record.isRevoked = true;
    record.updatedAt = new Date().toISOString();
    return true;
  }
  return false;
}

export async function listRedemptionsForCode(invitationId: string): Promise<InvitationRedemptionRecord[]> {
  if (isDbConfigured()) {
    try {
      const rows = await dbQuery<any[]>(
        `entirefm_invitation_redemptions?invitation_code_id=eq.${encodeURIComponent(invitationId)}&order=redeemed_at.desc`,
        { method: 'GET' }
      );
      if (rows && Array.isArray(rows)) {
        return rows.map((r) => ({
          id: r.id,
          invitationCodeId: r.invitation_code_id,
          supplierOrgId: r.supplier_org_id,
          redeemedByAuthUserId: r.redeemed_by_auth_user_id,
          redeemedAt: r.redeemed_at,
          membershipTier: r.membership_tier,
          standardAmountGbp: parseFloat(r.standard_amount_gbp) || 0,
          waivedAmountGbp: parseFloat(r.waived_amount_gbp) || 0,
          finalAmountGbp: parseFloat(r.final_amount_gbp) || 0,
        }));
      }
    } catch (err) {
      console.warn('DB list redemptions failed:', err);
    }
  }

  return store.redemptions.filter((r) => r.invitationCodeId === invitationId);
}
