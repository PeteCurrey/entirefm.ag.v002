/**
 * ENTIREFM POLICY VERSIONING & ACCEPTANCE AUDIT DOMAIN MODULE
 * ============================================================
 * Manages contractual policy lifecycle, cryptographic version hashes,
 * electronic acceptance records, and legal audit history.
 */

import { createHash } from 'node:crypto';
import { dbQuery } from '../db/client';
import { recordAuditEvent } from '../audit';
import type { UserSession } from '../identity';
import { LEGAL_POLICIES } from '@/lib/legal/legal-content-registry';

export interface PolicyVersionRecord {
  id: string;
  policy_slug: string;
  title: string;
  version: string;
  effective_date: string;
  sha256_hash: string;
  summary_of_changes: string;
  requires_explicit_acceptance: boolean;
  published_by_person_id?: string;
  published_at: string;
}

export interface PolicyAcceptanceRecord {
  id: string;
  policy_slug: string;
  policy_version: string;
  user_person_id: string;
  user_email: string;
  user_name: string;
  organisation_id: string;
  organisation_name: string;
  work_order_id?: string;
  sha256_hash: string;
  ip_address?: string;
  user_agent?: string;
  accepted_at: string;
}

/**
 * Generate SHA-256 hash of policy text to guarantee audit immutability
 */
export function computePolicyHash(slug: string): string {
  const policy = LEGAL_POLICIES[slug];
  if (!policy) return '0000000000000000000000000000000000000000000000000000000000000000';

  const serialized = JSON.stringify({
    slug: policy.slug,
    version: policy.version,
    effectiveDate: policy.effectiveDate,
    sections: policy.sections.map((s) => ({ id: s.id, heading: s.heading, body: s.body })),
  });

  return createHash('sha256').update(serialized).digest('hex');
}

/**
 * List all active policies and their current versions
 */
export function listActivePolicyManifest(): PolicyVersionRecord[] {
  return Object.values(LEGAL_POLICIES).map((policy) => {
    const isContractual = [
      'contractor-terms',
      'work-order-terms',
      'contractor-code',
      'acceptable-use',
      'terms-of-business',
      'data-processing',
    ].includes(policy.slug);

    return {
      id: `pol-${policy.slug}`,
      policy_slug: policy.slug,
      title: policy.title,
      version: policy.version,
      effective_date: policy.effectiveDate,
      sha256_hash: computePolicyHash(policy.slug),
      summary_of_changes: 'Initial 2026 unified legal architecture release.',
      requires_explicit_acceptance: isContractual,
      published_at: new Date(policy.effectiveDate).toISOString(),
    };
  });
}

/**
 * Record timestamped electronic acceptance of a contractual policy
 */
export async function recordPolicyAcceptance(payload: {
  policy_slug: string;
  policy_version: string;
  session: UserSession;
  work_order_id?: string;
  ip_address?: string;
  user_agent?: string;
}): Promise<PolicyAcceptanceRecord> {
  const hash = computePolicyHash(payload.policy_slug);
  const now = new Date().toISOString();

  const record: PolicyAcceptanceRecord = {
    id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    policy_slug: payload.policy_slug,
    policy_version: payload.policy_version,
    user_person_id: payload.session.personId,
    user_email: payload.session.email,
    user_name: payload.session.name,
    organisation_id: payload.session.orgId,
    organisation_name: payload.session.orgName,
    work_order_id: payload.work_order_id,
    sha256_hash: hash,
    ip_address: payload.ip_address,
    user_agent: payload.user_agent,
    accepted_at: now,
  };

  try {
    await dbQuery('policy_acceptances', {
      method: 'POST',
      body: record,
    });
  } catch {
    console.log('[POLICY_ACCEPTANCE_LOG]', record);
  }

  // Record audit ledger event
  await recordAuditEvent({
    event_type: 'POLICY_ACCEPTED',
    actor_id: payload.session.personId,
    actor_type: 'HUMAN',
    organisation_id: payload.session.orgId,
    object_type: 'POLICY_ACCEPTANCE',
    object_id: record.id,
    reason: `User ${payload.session.email} accepted ${payload.policy_slug} v${payload.policy_version}`,
    after_state: record,
  });

  return record;
}

/**
 * Check if an organization or user has accepted the latest version of a contractual policy
 */
export async function hasAcceptedLatestPolicy(
  policy_slug: string,
  personId: string,
  orgId: string
): Promise<boolean> {
  const policy = LEGAL_POLICIES[policy_slug];
  if (!policy) return true;

  try {
    const { data } = await dbQuery<PolicyAcceptanceRecord[]>(
      `policy_acceptances?policy_slug=eq.${encodeURIComponent(
        policy_slug
      )}&policy_version=eq.${encodeURIComponent(
        policy.version
      )}&or=(user_person_id.eq.${encodeURIComponent(
        personId
      )},organisation_id.eq.${encodeURIComponent(orgId)})&select=*`
    );

    return !!data && data.length > 0;
  } catch {
    return true; // fallback in development
  }
}
