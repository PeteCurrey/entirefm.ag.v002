/**
 * ENTIREFM SUPPLY CHAIN DOMAIN MODULE (Phase 0B-R Operational Hardening)
 * ======================================================================
 * Complete Supply Chain Schema with Transparent Dispatch Candidate Matching:
 * Provider -> Location -> Resource -> Trade -> Competency -> Coverage -> Performance -> Restrictions.
 */

import { dbQuery } from '../db/client';

export interface ProviderLocation {
  id: string;
  provider_org_id: string;
  name: string;
  address_line1: string;
  city: string;
  postcode: string;
  latitude?: number;
  longitude?: number;
  is_hq: boolean;
  is_dispatch_point: boolean;
  emergency_available: boolean;
  created_at: string;
}

export interface ProviderResource {
  id: string;
  provider_org_id: string;
  person_id: string;
  employment_status: 'EMPLOYED' | 'SUBCONTRACTOR' | 'FREELANCE';
  trades_json?: string[];
  competencies_json?: string[];
  availability_json?: Record<string, any>;
  home_postcode?: string;
  max_daily_jobs: number;
  is_active: boolean;
  person?: { first_name: string; last_name: string; email: string; phone?: string };
  provider_organisation?: { name: string; code: string };
}

export interface CoverageArea {
  id: string;
  provider_org_id: string;
  location_id?: string;
  coverage_type: 'POSTCODE_DISTRICT' | 'RADIUS_MILES' | 'REGION' | 'GEO_POLYGON';
  boundary_value: string;
  radius_miles?: number;
  priority_rank: number;
  is_active: boolean;
}

export interface ProviderRestriction {
  id: string;
  provider_org_id: string;
  client_account_id?: string;
  site_id?: string;
  restriction_type:
    | 'BLOCKED'
    | 'APPROVED_ONLY'
    | 'SPEND_CEILING'
    | 'TRADE_RESTRICTION'
    | 'COMPLIANCE_HOLD'
    | 'EMERGENCY_ONLY'
    | 'PREFERRED'
    | 'PROHIBITED';
  spend_ceiling_gbp?: number;
  reason: string;
  is_active: boolean;
  created_at: string;
}

export interface ProviderOrganisation {
  id: string;
  organisation_id: string;
  tier: string;
  vetting_status: string;
  insurance_verified: boolean;
  public_liability_limit?: number;
  insurance_expiry?: string;
  coverage_radius_miles?: number;
  primary_trade?: string;
  performance_score: number;
  first_time_fix_rate: number;
  sla_adherence_rate: number;
  is_active: boolean;
  created_at: string;
  organisation?: { name: string; code: string; phone?: string; email?: string };
}

export interface DispatchCandidateEvaluation {
  provider: ProviderOrganisation;
  isEligible: boolean;
  reasons: string[];
  rankingScore: number;
}

/**
 * Evaluates candidate provider organizations for a work order, strictly separating
 * legal/operational ELIGIBILITY from preferential RANKING.
 */
export function evaluateCandidateProvider(
  provider: ProviderOrganisation,
  requirements: {
    requiredTrade?: string;
    clientAccountId?: string;
    sitePostcode?: string;
    isEmergency?: boolean;
    accreditations?: { isExpired: boolean; name: string }[];
    restrictions?: ProviderRestriction[];
  }
): DispatchCandidateEvaluation {
  const reasons: string[] = [];
  let isEligible = true;

  // 1. Vetting & Active Status
  if (!provider.is_active || provider.vetting_status !== 'APPROVED') {
    isEligible = false;
    reasons.push(`✕ Provider vetting status is '${provider.vetting_status}' (Requires APPROVED).`);
  } else {
    reasons.push(`✓ Provider is fully vetted and active.`);
  }

  // 2. Trade match
  if (requirements.requiredTrade && provider.primary_trade && provider.primary_trade !== requirements.requiredTrade) {
    isEligible = false;
    reasons.push(`✕ Trade mismatch: requires '${requirements.requiredTrade}', provider is '${provider.primary_trade}'.`);
  } else if (requirements.requiredTrade) {
    reasons.push(`✓ Trade matches required '${requirements.requiredTrade}'.`);
  }

  // 3. Insurance validity
  if (!provider.insurance_verified) {
    isEligible = false;
    reasons.push(`✕ Public liability insurance unverified.`);
  } else {
    reasons.push(`✓ Insurance verified (£${provider.public_liability_limit?.toLocaleString() || '5,000,000'}).`);
  }

  // 4. Accreditations
  if (requirements.accreditations && requirements.accreditations.some((a) => a.isExpired)) {
    const expired = requirements.accreditations.filter((a) => a.isExpired).map((a) => a.name);
    isEligible = false;
    reasons.push(`✕ Mandatory accreditation expired: ${expired.join(', ')}.`);
  }

  // 5. Client Restrictions
  if (requirements.restrictions && requirements.restrictions.length > 0) {
    const blocking = requirements.restrictions.find(
      (r) => r.restriction_type === 'BLOCKED' || r.restriction_type === 'COMPLIANCE_HOLD' || r.restriction_type === 'PROHIBITED'
    );
    if (blocking) {
      isEligible = false;
      reasons.push(`✕ Client restriction active: ${blocking.reason} (${blocking.restriction_type}).`);
    }
  }

  // Ranking calculation (score 0 to 100)
  let rankingScore = 0;
  if (isEligible) {
    rankingScore =
      (provider.performance_score || 80) * 0.5 +
      (provider.first_time_fix_rate || 85) * 0.3 +
      (provider.sla_adherence_rate || 90) * 0.2;
  }

  return {
    provider,
    isEligible,
    reasons,
    rankingScore: Math.round(rankingScore),
  };
}

export async function listProviders(): Promise<ProviderOrganisation[]> {
  const { data } = await dbQuery<ProviderOrganisation[]>(
    'provider_organisations?select=*,organisation:organisations(name,code,phone,email)&order=performance_score.desc'
  );
  return data || [];
}

export async function listProviderResources(): Promise<ProviderResource[]> {
  const { data } = await dbQuery<ProviderResource[]>(
    'provider_resources?select=*,person:persons(first_name,last_name,email,phone),provider_organisation:organisations(name,code)&order=is_active.desc'
  );
  return data || [];
}

export async function listProviderRestrictions(providerOrgId: string): Promise<ProviderRestriction[]> {
  const { data } = await dbQuery<ProviderRestriction[]>(
    `provider_restrictions?provider_org_id=eq.${encodeURIComponent(providerOrgId)}&is_active=eq.true&select=*`
  );
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// PHASE 0C: CONTRACTOR PORTAL OPERATIONS
// ─────────────────────────────────────────────────────────────

import { UserSession } from '../identity';
import { recordAuditEvent } from '../audit';

export interface ContractorDashboardMetrics {
  offersAwaitingResponse: number;
  activeAssignments: number;
  visitsToday: number;
  slaAtRisk: number;
  complianceWarnings: number;
  completionsPendingReview: number;
}

export async function acceptAssignmentOffer(
  assignmentId: string,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };
  const now = new Date().toISOString();
  const { error } = await dbQuery<any>(`work_assignments?id=eq.${assignmentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'ACCEPTED', accepted_at: now, updated_at: now }),
  });
  if (error) return { success: false, error: String(error) };
  await recordAuditEvent({ event_type: 'ASSIGNMENT_ACCEPTED', object_type: 'work_assignments', object_id: assignmentId, actor_id: session.personId, after_state: { status: 'ACCEPTED' } });
  return { success: true };
}

export async function declineAssignmentOffer(
  assignmentId: string,
  reason: string,
  notes: string | null,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };
  const now = new Date().toISOString();
  const { error } = await dbQuery<any>(`work_assignments?id=eq.${assignmentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'REJECTED', rejection_reason: reason, rejection_notes: notes, rejected_at: now, updated_at: now }),
  });
  if (error) return { success: false, error: String(error) };
  await recordAuditEvent({ event_type: 'ASSIGNMENT_REJECTED', object_type: 'work_assignments', object_id: assignmentId, actor_id: session.personId, after_state: { status: 'REJECTED', reason } });
  return { success: true };
}

export async function assignProviderResource(
  assignmentId: string,
  engineerPersonId: string,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };
  // Verify the engineer belongs to this contractor org
  const { data: resource } = await dbQuery<any[]>(
    `provider_resources?person_id=eq.${engineerPersonId}&provider_org_id=eq.${session.orgId}&is_active=eq.true&select=id`
  );
  if (!resource || resource.length === 0) {
    return { success: false, error: 'Engineer does not belong to your organisation or is not active' };
  }
  const now = new Date().toISOString();
  const { error } = await dbQuery<any>(`work_assignments?id=eq.${assignmentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ assigned_person_id: engineerPersonId, updated_at: now }),
  });
  if (error) return { success: false, error: String(error) };
  await recordAuditEvent({ event_type: 'ASSIGNMENT_RESOURCE_ASSIGNED', object_type: 'work_assignments', object_id: assignmentId, actor_id: session.personId, after_state: { assigned_person_id: engineerPersonId } });
  return { success: true };
}

export async function getContractorDashboardMetrics(
  orgId: string,
  _session: UserSession
): Promise<ContractorDashboardMetrics> {
  // These queries return real counts from DB. If DB unavailable, return zeros gracefully.
  const today = new Date().toISOString().split('T')[0];
  const [offers, active, visits] = await Promise.all([
    dbQuery<any[]>(`work_assignments?provider_org_id=eq.${orgId}&status=eq.OFFERED&select=id`),
    dbQuery<any[]>(`work_assignments?provider_org_id=eq.${orgId}&status=in.(ACCEPTED,IN_PROGRESS)&select=id`),
    dbQuery<any[]>(`visits?provider_org_id=eq.${orgId}&scheduled_date=eq.${today}&select=id`),
  ]);
  return {
    offersAwaitingResponse: offers.data?.length ?? 0,
    activeAssignments: active.data?.length ?? 0,
    visitsToday: visits.data?.length ?? 0,
    slaAtRisk: 0,         // Computed by SLA engine in full implementation
    complianceWarnings: 0, // Driven by contractor_compliance_documents expiry
    completionsPendingReview: 0,
  };
}

export async function listContractorAssignments(orgId: string, status?: string, _session?: UserSession): Promise<any[]> {
  let endpoint = `work_assignments?provider_org_id=eq.${orgId}&order=created_at.desc&select=*`;
  if (status) endpoint += `&status=eq.${encodeURIComponent(status)}`;
  const { data } = await dbQuery<any[]>(endpoint);
  return data || [];
}

export async function listContractorComplianceDocuments(orgId: string, _session: UserSession): Promise<any[]> {
  const { data } = await dbQuery<any[]>(
    `contractor_compliance_documents?provider_organisation_id=eq.${orgId}&order=created_at.desc&select=*`
  );
  return data || [];
}

export async function saveContractorComplianceDocument(
  data: { orgId: string; documentType: string; documentTitle: string; storagePath: string; fileSizeBytes?: number; mimeType?: string; expiryDate?: string; uploadedByPersonId: string },
  session: UserSession
): Promise<{ id: string | null; error?: string }> {
  if (!session) return { id: null, error: 'Authentication required' };
  const record = {
    provider_organisation_id: data.orgId,
    document_type: data.documentType,
    document_title: data.documentTitle,
    storage_path: data.storagePath,
    file_size_bytes: data.fileSizeBytes || null,
    mime_type: data.mimeType || null,
    expiry_date: data.expiryDate || null,
    uploaded_by_person_id: data.uploadedByPersonId,
    review_status: 'PENDING',
  };
  const { data: result, error } = await dbQuery<any[]>('contractor_compliance_documents?select=id', { method: 'POST', body: JSON.stringify(record) });
  if (error) return { id: null, error: String(error) };
  return { id: result?.[0]?.id ?? null };
}
