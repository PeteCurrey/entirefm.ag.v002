import {
  WorkAllocationRequirement,
  SupplierOpportunityRecord,
  SupplierOpportunityResponse,
  AwardDecisionRecord,
  WorkOrderDispatchRecord,
  SupplierAvailabilityRecord,
  AllocationAnalyticsSummary,
  AllocationCandidate,
  DeclineReason,
  CommercialBasis,
  OpportunityType,
  OpportunityStatus,
  OpportunityResponseDecision,
  AwardReason,
  DispatchStatus,
  SupplierAvailabilityStatus,
} from './allocation-types';
import { listSupplierOrganisations, getSupplierOrganisation } from '../suppliers/store';
import { listServiceApprovals, listGeographicApprovals, listComplianceHolds } from '../suppliers/assurance-store';
import { getSupplierScorecard } from '../suppliers/performance-store';
import { evaluateSupplierHardGates, calculateCandidateSuitability } from './allocation-engine';
import { dbQuery, isDbConfigured } from '@/server/db/client';

function isUuid(val: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

function getOwnerFilter(supplierId: string): string {
  return isUuid(supplierId)
    ? `organisation_id=eq.${supplierId}`
    : `supplier_org_id=eq.${encodeURIComponent(supplierId)}`;
}

function getOwnerInsert(supplierId: string): { organisation_id?: string; supplier_org_id?: string } {
  return isUuid(supplierId)
    ? { organisation_id: supplierId, supplier_org_id: undefined }
    : { supplier_org_id: supplierId, organisation_id: undefined };
}

/**
 * 1. WORK REQUIREMENTS
 */
export async function getWorkAllocationRequirement(id: string): Promise<WorkAllocationRequirement | null> {
  if (!isDbConfigured()) return null;

  const { data } = await dbQuery<any[]>(
    `work_allocation_requirements?id=eq.${encodeURIComponent(id)}&limit=1`
  );
  if (!data || data.length === 0) return null;

  const r = data[0];
  return {
    id: r.id,
    source_type: r.source_type,
    source_id: r.source_id,
    client_id: r.client_id,
    client_name: r.client_name,
    site_id: r.site_id,
    site_name: r.site_name,
    site_city: r.site_city,
    site_postcode: r.site_postcode,
    service_slug: r.service_slug,
    service_name: r.service_name,
    sub_service: r.sub_service || undefined,
    asset_name: r.asset_name || undefined,
    oem_manufacturer: r.oem_manufacturer || undefined,
    priority: r.priority,
    sla_attendance_target_hours: Number(r.sla_attendance_target_hours || 4),
    scope_summary: r.scope_summary,
    detailed_scope: r.detailed_scope || undefined,
    work_risk_level: r.work_risk_level,
    estimated_value_gbp: r.estimated_value_gbp ? Number(r.estimated_value_gbp) : undefined,
    not_to_exceed_gbp: r.not_to_exceed_gbp ? Number(r.not_to_exceed_gbp) : undefined,
    out_of_hours_required: Boolean(r.out_of_hours_required),
    mandatory_accreditations: r.mandatory_accreditations || [],
    client_mandated_supplier_id: r.client_mandated_supplier_id || undefined,
    created_at: r.created_at,
  };
}

export async function listWorkAllocationRequirements(): Promise<WorkAllocationRequirement[]> {
  if (!isDbConfigured()) return [];

  const { data } = await dbQuery<any[]>('work_allocation_requirements?order=created_at.desc');
  if (!data) return [];

  return data.map((r) => ({
    id: r.id,
    source_type: r.source_type,
    source_id: r.source_id,
    client_id: r.client_id,
    client_name: r.client_name,
    site_id: r.site_id,
    site_name: r.site_name,
    site_city: r.site_city,
    site_postcode: r.site_postcode,
    service_slug: r.service_slug,
    service_name: r.service_name,
    sub_service: r.sub_service || undefined,
    asset_name: r.asset_name || undefined,
    oem_manufacturer: r.oem_manufacturer || undefined,
    priority: r.priority,
    sla_attendance_target_hours: Number(r.sla_attendance_target_hours || 4),
    scope_summary: r.scope_summary,
    detailed_scope: r.detailed_scope || undefined,
    work_risk_level: r.work_risk_level,
    estimated_value_gbp: r.estimated_value_gbp ? Number(r.estimated_value_gbp) : undefined,
    not_to_exceed_gbp: r.not_to_exceed_gbp ? Number(r.not_to_exceed_gbp) : undefined,
    out_of_hours_required: Boolean(r.out_of_hours_required),
    mandatory_accreditations: r.mandatory_accreditations || [],
    client_mandated_supplier_id: r.client_mandated_supplier_id || undefined,
    created_at: r.created_at,
  }));
}

export async function createWorkAllocationRequirement(
  req: Omit<WorkAllocationRequirement, 'id' | 'created_at'>
): Promise<WorkAllocationRequirement> {
  const id = `req-${Date.now()}`;
  const now = new Date().toISOString();

  const record: WorkAllocationRequirement = {
    ...req,
    id,
    created_at: now,
  };

  if (isDbConfigured()) {
    await dbQuery('work_allocation_requirements', {
      method: 'POST',
      body: {
        id,
        source_type: req.source_type,
        source_id: req.source_id,
        client_id: req.client_id,
        client_name: req.client_name,
        site_id: req.site_id,
        site_name: req.site_name,
        site_city: req.site_city,
        site_postcode: req.site_postcode,
        service_slug: req.service_slug,
        service_name: req.service_name,
        sub_service: req.sub_service || null,
        asset_name: req.asset_name || null,
        oem_manufacturer: req.oem_manufacturer || null,
        priority: req.priority,
        sla_attendance_target_hours: req.sla_attendance_target_hours,
        scope_summary: req.scope_summary,
        detailed_scope: req.detailed_scope || null,
        work_risk_level: req.work_risk_level,
        estimated_value_gbp: req.estimated_value_gbp || null,
        not_to_exceed_gbp: req.not_to_exceed_gbp || null,
        out_of_hours_required: req.out_of_hours_required,
        mandatory_accreditations: req.mandatory_accreditations || [],
        client_mandated_supplier_id: req.client_mandated_supplier_id || null,
        created_at: now,
      },
    });
  }

  return record;
}

/**
 * 2. CANDIDATE EVALUATION & DRY-RUN
 */
export async function evaluateCandidatesForRequirement(requirementId: string): Promise<AllocationCandidate[]> {
  const requirement = await getWorkAllocationRequirement(requirementId);
  if (!requirement) return [];

  const suppliers = await listSupplierOrganisations();

  const candidatePromises = suppliers.map(async (supplier) => {
    const [serviceApprovals, geoApprovals, activeHolds, scorecard] = await Promise.all([
      listServiceApprovals(supplier.id),
      listGeographicApprovals(supplier.id),
      listComplianceHolds(supplier.id),
      getSupplierScorecard(supplier.id),
    ]);

    const hardGate = evaluateSupplierHardGates({
      supplier,
      requirement,
      serviceApprovals,
      geographicApprovals: geoApprovals,
      activeHolds,
    });

    return calculateCandidateSuitability({
      supplier,
      requirement,
      hardGate,
      scorecard,
      distanceMiles: 10.0,
      currentOpenWorkload: 0,
    });
  });

  const candidates = await Promise.all(candidatePromises);

  return candidates.sort((a, b) => {
    if (a.is_eligible && !b.is_eligible) return -1;
    if (!a.is_eligible && b.is_eligible) return 1;
    return b.suitability_score - a.suitability_score;
  });
}

/**
 * 3. OPPORTUNITIES & RESPONSES
 */
export async function createSupplierOpportunity(
  opp: Omit<SupplierOpportunityRecord, 'id' | 'status' | 'issued_at'>
): Promise<SupplierOpportunityRecord> {
  const id = `opp-${Date.now()}`;
  const now = new Date().toISOString();

  const record: SupplierOpportunityRecord = {
    ...opp,
    id,
    status: 'ISSUED',
    issued_at: now,
  };

  if (isDbConfigured()) {
    await dbQuery('supplier_opportunities', {
      method: 'POST',
      body: {
        id,
        requirement_id: opp.requirement_id,
        opportunity_type: opp.opportunity_type,
        status: 'ISSUED',
        invited_supplier_ids: opp.invited_supplier_ids,
        response_deadline: opp.response_deadline,
        title: opp.title,
        scope_summary: opp.scope_summary,
        service_slug: opp.service_slug,
        site_city: opp.site_city,
        priority: opp.priority,
        commercial_basis: opp.commercial_basis,
        not_to_exceed_gbp: opp.not_to_exceed_gbp || null,
        issued_at: now,
        issued_by: opp.issued_by,
        awarded_supplier_id: opp.awarded_supplier_id || null,
        awarded_at: opp.awarded_at || null,
      },
    });
  }

  return record;
}

export async function listSupplierOpportunities(supplierId?: string): Promise<SupplierOpportunityRecord[]> {
  if (!isDbConfigured()) return [];

  const { data } = await dbQuery<any[]>('supplier_opportunities?order=issued_at.desc');
  if (!data) return [];

  const list: SupplierOpportunityRecord[] = data.map((o) => ({
    id: o.id,
    requirement_id: o.requirement_id,
    opportunity_type: o.opportunity_type as OpportunityType,
    status: o.status as OpportunityStatus,
    invited_supplier_ids: o.invited_supplier_ids || [],
    response_deadline: o.response_deadline,
    title: o.title,
    scope_summary: o.scope_summary,
    service_slug: o.service_slug,
    site_city: o.site_city,
    priority: o.priority,
    commercial_basis: o.commercial_basis as CommercialBasis,
    not_to_exceed_gbp: o.not_to_exceed_gbp ? Number(o.not_to_exceed_gbp) : undefined,
    issued_at: o.issued_at,
    issued_by: o.issued_by,
    awarded_supplier_id: o.awarded_supplier_id || undefined,
    awarded_at: o.awarded_at || undefined,
  }));

  if (!supplierId) return list;
  return list.filter((o) => o.invited_supplier_ids.includes(supplierId));
}

export async function getSupplierOpportunity(id: string): Promise<SupplierOpportunityRecord | null> {
  if (!isDbConfigured()) return null;

  const { data } = await dbQuery<any[]>(
    `supplier_opportunities?id=eq.${encodeURIComponent(id)}&limit=1`
  );
  if (!data || data.length === 0) return null;

  const o = data[0];
  return {
    id: o.id,
    requirement_id: o.requirement_id,
    opportunity_type: o.opportunity_type as OpportunityType,
    status: o.status as OpportunityStatus,
    invited_supplier_ids: o.invited_supplier_ids || [],
    response_deadline: o.response_deadline,
    title: o.title,
    scope_summary: o.scope_summary,
    service_slug: o.service_slug,
    site_city: o.site_city,
    priority: o.priority,
    commercial_basis: o.commercial_basis as CommercialBasis,
    not_to_exceed_gbp: o.not_to_exceed_gbp ? Number(o.not_to_exceed_gbp) : undefined,
    issued_at: o.issued_at,
    issued_by: o.issued_by,
    awarded_supplier_id: o.awarded_supplier_id || undefined,
    awarded_at: o.awarded_at || undefined,
  };
}

export async function submitOpportunityResponse(
  resp: Omit<SupplierOpportunityResponse, 'id' | 'responded_at'>
): Promise<SupplierOpportunityResponse> {
  const id = `resp-${Date.now()}`;
  const now = new Date().toISOString();
  const ownerCols = getOwnerInsert(resp.supplier_id);

  const record: SupplierOpportunityResponse = {
    ...resp,
    id,
    responded_at: now,
  };

  if (isDbConfigured()) {
    await dbQuery('supplier_opportunity_responses', {
      method: 'POST',
      body: {
        id,
        opportunity_id: resp.opportunity_id,
        ...ownerCols,
        supplier_name: resp.supplier_name,
        decision: resp.decision,
        decline_reason: resp.decline_reason || null,
        quoted_price_gbp: resp.quoted_price_gbp || null,
        quoted_lead_time_hours: resp.quoted_lead_time_hours || null,
        planned_attendance_date: resp.planned_attendance_date || null,
        clarification_question: resp.clarification_question || null,
        clarification_response: resp.clarification_response || null,
        notes: resp.notes || null,
        responded_at: now,
        responded_by: resp.responded_by,
      },
    });

    await dbQuery(`supplier_opportunities?id=eq.${encodeURIComponent(resp.opportunity_id)}`, {
      method: 'PATCH',
      body: { status: 'RESPONSES_RECEIVED' },
    });
  }

  return record;
}

export async function listOpportunityResponses(opportunityId: string): Promise<SupplierOpportunityResponse[]> {
  if (!isDbConfigured()) return [];

  const { data } = await dbQuery<any[]>(
    `supplier_opportunity_responses?opportunity_id=eq.${encodeURIComponent(opportunityId)}&order=responded_at.asc`
  );
  if (!data) return [];

  return data.map((r) => ({
    id: r.id,
    opportunity_id: r.opportunity_id,
    supplier_id: r.organisation_id || r.supplier_org_id || '',
    supplier_name: r.supplier_name,
    decision: r.decision as OpportunityResponseDecision,
    decline_reason: r.decline_reason ? (r.decline_reason as DeclineReason) : undefined,
    quoted_price_gbp: r.quoted_price_gbp ? Number(r.quoted_price_gbp) : undefined,
    quoted_lead_time_hours: r.quoted_lead_time_hours ? Number(r.quoted_lead_time_hours) : undefined,
    planned_attendance_date: r.planned_attendance_date || undefined,
    clarification_question: r.clarification_question || undefined,
    clarification_response: r.clarification_response || undefined,
    notes: r.notes || undefined,
    responded_at: r.responded_at,
    responded_by: r.responded_by,
  }));
}

/**
 * 4. AWARDS & REAL-TIME PRE-DISPATCH REVALIDATION
 */
export async function makeAwardDecision(
  award: Omit<AwardDecisionRecord, 'id' | 'awarded_at' | 'pre_dispatch_revalidation_passed'>
): Promise<{
  success: boolean;
  award?: AwardDecisionRecord;
  revalidationError?: string;
}> {
  const requirement = await getWorkAllocationRequirement(award.requirement_id);
  const supplier = await getSupplierOrganisation(award.selected_supplier_id);

  if (!requirement || !supplier) {
    return { success: false, revalidationError: 'Requirement or supplier not found' };
  }

  // Real-Time Pre-Dispatch Revalidation Check
  const [serviceApprovals, geoApprovals, activeHolds] = await Promise.all([
    listServiceApprovals(supplier.id),
    listGeographicApprovals(supplier.id),
    listComplianceHolds(supplier.id),
  ]);

  const hardGate = evaluateSupplierHardGates({
    supplier,
    requirement,
    serviceApprovals,
    geographicApprovals: geoApprovals,
    activeHolds,
  });

  if (!hardGate.is_eligible) {
    return {
      success: false,
      revalidationError: `Pre-dispatch revalidation failed: ${hardGate.exclusion_reasons.join(', ')}`,
    };
  }

  const id = `awd-${Date.now()}`;
  const now = new Date().toISOString();
  const ownerCols = getOwnerInsert(award.selected_supplier_id);

  const record: AwardDecisionRecord = {
    ...award,
    id,
    awarded_at: now,
    pre_dispatch_revalidation_passed: true,
  };

  if (isDbConfigured()) {
    await dbQuery('supplier_award_decisions', {
      method: 'POST',
      body: {
        id,
        opportunity_id: award.opportunity_id,
        requirement_id: award.requirement_id,
        ...ownerCols,
        selected_supplier_name: award.selected_supplier_name,
        candidate_ids_evaluated: award.candidate_ids_evaluated || [],
        award_reason: award.award_reason,
        commercial_basis: award.commercial_basis,
        agreed_value_gbp: award.agreed_value_gbp || null,
        not_to_exceed_gbp: award.not_to_exceed_gbp || null,
        is_override: award.is_override,
        override_rationale: award.override_rationale || null,
        awarded_by: award.awarded_by,
        awarded_at: now,
        pre_dispatch_revalidation_passed: true,
      },
    });

    await dbQuery(`supplier_opportunities?id=eq.${encodeURIComponent(award.opportunity_id)}`, {
      method: 'PATCH',
      body: {
        status: 'AWARDED',
        awarded_supplier_id: award.selected_supplier_id,
        awarded_at: now,
      },
    });
  }

  return { success: true, award: record };
}

export async function listAwardDecisions(): Promise<AwardDecisionRecord[]> {
  if (!isDbConfigured()) return [];

  const { data } = await dbQuery<any[]>('supplier_award_decisions?order=awarded_at.desc');
  if (!data) return [];

  return data.map((a) => ({
    id: a.id,
    opportunity_id: a.opportunity_id,
    requirement_id: a.requirement_id,
    selected_supplier_id: a.organisation_id || a.supplier_org_id || '',
    selected_supplier_name: a.selected_supplier_name,
    candidate_ids_evaluated: a.candidate_ids_evaluated || [],
    award_reason: a.award_reason as AwardReason,
    commercial_basis: a.commercial_basis as CommercialBasis,
    agreed_value_gbp: a.agreed_value_gbp ? Number(a.agreed_value_gbp) : undefined,
    not_to_exceed_gbp: a.not_to_exceed_gbp ? Number(a.not_to_exceed_gbp) : undefined,
    is_override: Boolean(a.is_override),
    override_rationale: a.override_rationale || undefined,
    awarded_by: a.awarded_by,
    awarded_at: a.awarded_at,
    pre_dispatch_revalidation_passed: Boolean(a.pre_dispatch_revalidation_passed),
  }));
}

/**
 * 5. DISPATCH QUEUE & ACKNOWLEDGEMENT
 */
export async function dispatchWorkOrder(params: {
  awardId: string;
  dispatchedBy: string;
}): Promise<WorkOrderDispatchRecord | null> {
  if (!isDbConfigured()) return null;

  const { data: awards } = await dbQuery<any[]>(
    `supplier_award_decisions?id=eq.${encodeURIComponent(params.awardId)}&limit=1`
  );
  if (!awards || awards.length === 0) return null;
  const award = awards[0];

  const req = await getWorkAllocationRequirement(award.requirement_id);
  const opp = await getSupplierOpportunity(award.opportunity_id);
  if (!req || !opp) return null;

  // Idempotency: return existing dispatch if already created
  const { data: existing } = await dbQuery<any[]>(
    `work_order_dispatches?award_id=eq.${encodeURIComponent(params.awardId)}&limit=1`
  );
  if (existing && existing.length > 0) {
    const d = existing[0];
    return {
      id: d.id,
      work_order_id: d.work_order_id,
      opportunity_id: d.opportunity_id,
      award_id: d.award_id,
      supplier_id: d.organisation_id || d.supplier_org_id || '',
      supplier_name: d.supplier_name,
      service_name: d.service_name,
      site_name: d.site_name,
      site_city: d.site_city,
      priority: d.priority,
      sla_target_time: d.sla_target_time,
      status: d.status as DispatchStatus,
      assigned_operative_name: d.assigned_operative_name || undefined,
      assigned_operative_phone: d.assigned_operative_phone || undefined,
      scheduled_attendance_start: d.scheduled_attendance_start || undefined,
      acknowledged_at: d.acknowledged_at || undefined,
      acknowledged_by: d.acknowledged_by || undefined,
      rams_submitted: Boolean(d.rams_submitted),
      dispatched_at: d.dispatched_at,
      dispatched_by: d.dispatched_by,
    };
  }

  const id = `disp-${Date.now()}`;
  const now = new Date().toISOString();
  const selectedSupplierId = award.organisation_id || award.supplier_org_id || '';
  const ownerCols = getOwnerInsert(selectedSupplierId);

  const record: WorkOrderDispatchRecord = {
    id,
    work_order_id: req.source_id,
    opportunity_id: opp.id,
    award_id: award.id,
    supplier_id: selectedSupplierId,
    supplier_name: award.selected_supplier_name,
    service_name: req.service_name,
    site_name: req.site_name,
    site_city: req.site_city,
    priority: req.priority,
    sla_target_time: new Date(Date.now() + req.sla_attendance_target_hours * 3600000).toISOString(),
    status: 'AWAITING_ACKNOWLEDGEMENT',
    rams_submitted: false,
    dispatched_at: now,
    dispatched_by: params.dispatchedBy,
  };

  await dbQuery('work_order_dispatches', {
    method: 'POST',
    body: {
      id,
      work_order_id: req.source_id,
      opportunity_id: opp.id,
      award_id: award.id,
      ...ownerCols,
      supplier_name: award.selected_supplier_name,
      service_name: req.service_name,
      site_name: req.site_name,
      site_city: req.site_city,
      priority: req.priority,
      sla_target_time: record.sla_target_time,
      status: 'AWAITING_ACKNOWLEDGEMENT',
      rams_submitted: false,
      dispatched_at: now,
      dispatched_by: params.dispatchedBy,
    },
  });

  return record;
}

export async function acknowledgeDispatch(params: {
  dispatchId: string;
  acknowledgedBy: string;
  assignedOperativeName?: string;
  assignedOperativePhone?: string;
  scheduledAttendanceStart?: string;
}): Promise<WorkOrderDispatchRecord | null> {
  if (!isDbConfigured()) return null;

  const now = new Date().toISOString();
  const updates: any = {
    status: 'ACKNOWLEDGED',
    acknowledged_at: now,
    acknowledged_by: params.acknowledgedBy,
  };
  if (params.assignedOperativeName) updates.assigned_operative_name = params.assignedOperativeName;
  if (params.assignedOperativePhone) updates.assigned_operative_phone = params.assignedOperativePhone;
  if (params.scheduledAttendanceStart) updates.scheduled_attendance_start = params.scheduledAttendanceStart;

  const { data } = await dbQuery<any[]>(
    `work_order_dispatches?id=eq.${encodeURIComponent(params.dispatchId)}`,
    {
      method: 'PATCH',
      body: updates,
    }
  );

  if (!data || data.length === 0) return null;
  const d = data[0];

  return {
    id: d.id,
    work_order_id: d.work_order_id,
    opportunity_id: d.opportunity_id,
    award_id: d.award_id,
    supplier_id: d.organisation_id || d.supplier_org_id || '',
    supplier_name: d.supplier_name,
    service_name: d.service_name,
    site_name: d.site_name,
    site_city: d.site_city,
    priority: d.priority,
    sla_target_time: d.sla_target_time,
    status: d.status as DispatchStatus,
    assigned_operative_name: d.assigned_operative_name || undefined,
    assigned_operative_phone: d.assigned_operative_phone || undefined,
    scheduled_attendance_start: d.scheduled_attendance_start || undefined,
    acknowledged_at: d.acknowledged_at || undefined,
    acknowledged_by: d.acknowledged_by || undefined,
    rams_submitted: Boolean(d.rams_submitted),
    dispatched_at: d.dispatched_at,
    dispatched_by: d.dispatched_by,
  };
}

export async function listDispatches(supplierId?: string): Promise<WorkOrderDispatchRecord[]> {
  if (!isDbConfigured()) return [];

  const endpoint = supplierId
    ? `work_order_dispatches?${getOwnerFilter(supplierId)}&order=dispatched_at.desc`
    : 'work_order_dispatches?order=dispatched_at.desc';

  const { data } = await dbQuery<any[]>(endpoint);
  if (!data) return [];

  return data.map((d) => ({
    id: d.id,
    work_order_id: d.work_order_id,
    opportunity_id: d.opportunity_id,
    award_id: d.award_id,
    supplier_id: d.organisation_id || d.supplier_org_id || '',
    supplier_name: d.supplier_name,
    service_name: d.service_name,
    site_name: d.site_name,
    site_city: d.site_city,
    priority: d.priority,
    sla_target_time: d.sla_target_time,
    status: d.status as DispatchStatus,
    assigned_operative_name: d.assigned_operative_name || undefined,
    assigned_operative_phone: d.assigned_operative_phone || undefined,
    scheduled_attendance_start: d.scheduled_attendance_start || undefined,
    acknowledged_at: d.acknowledged_at || undefined,
    acknowledged_by: d.acknowledged_by || undefined,
    rams_submitted: Boolean(d.rams_submitted),
    dispatched_at: d.dispatched_at,
    dispatched_by: d.dispatched_by,
  }));
}

/**
 * 6. SUPPLIER AVAILABILITY
 */
export async function getSupplierAvailability(supplierId: string): Promise<SupplierAvailabilityRecord | null> {
  if (!isDbConfigured()) return null;

  const { data } = await dbQuery<any[]>(
    `supplier_availability?${getOwnerFilter(supplierId)}&limit=1`
  );
  if (!data || data.length === 0) return null;

  const a = data[0];
  return {
    id: a.id,
    supplier_id: a.organisation_id || a.supplier_org_id || supplierId,
    status: a.status as SupplierAvailabilityStatus,
    daily_reactive_slots: Number(a.daily_reactive_slots || 0),
    available_engineers_count: Number(a.available_engineers_count || 0),
    emergency_out_of_hours: Boolean(a.emergency_out_of_hours),
    unavailable_from: a.unavailable_from || undefined,
    unavailable_until: a.unavailable_until || undefined,
    reason: a.reason || undefined,
    updated_at: a.updated_at,
  };
}

export async function updateSupplierAvailability(
  supplierId: string,
  update: Partial<SupplierAvailabilityRecord>
): Promise<SupplierAvailabilityRecord> {
  const id = `avail-${supplierId}`;
  const now = new Date().toISOString();
  const ownerCols = getOwnerInsert(supplierId);

  const existing = (await getSupplierAvailability(supplierId)) || {
    id,
    supplier_id: supplierId,
    status: 'AVAILABLE' as SupplierAvailabilityStatus,
    daily_reactive_slots: 5,
    available_engineers_count: 4,
    emergency_out_of_hours: true,
    updated_at: now,
  };

  const updated: SupplierAvailabilityRecord = {
    ...existing,
    ...update,
    updated_at: now,
  };

  if (isDbConfigured()) {
    await dbQuery('supplier_availability', {
      method: 'POST',
      body: {
        id,
        ...ownerCols,
        status: updated.status,
        daily_reactive_slots: updated.daily_reactive_slots,
        available_engineers_count: updated.available_engineers_count,
        emergency_out_of_hours: updated.emergency_out_of_hours,
        unavailable_from: updated.unavailable_from || null,
        unavailable_until: updated.unavailable_until || null,
        reason: updated.reason || null,
        updated_at: now,
      },
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    });
  }

  return updated;
}

/**
 * 7. ALLOCATION ANALYTICS
 */
export async function getAllocationAnalytics(): Promise<AllocationAnalyticsSummary> {
  if (!isDbConfigured()) {
    return {
      total_opportunities_issued: 0,
      direct_offers_count: 0,
      multi_rfq_count: 0,
      emergency_cascades_count: 0,
      average_time_to_award_minutes: 0,
      average_supplier_response_time_minutes: 0,
      overall_acceptance_rate_percentage: 0,
      no_eligible_supplier_rate_percentage: 0,
      decline_reasons_breakdown: {
        NO_CAPACITY: 0,
        OUTSIDE_AREA: 0,
        SKILL_UNAVAILABLE: 0,
        PARTS_UNAVAILABLE: 0,
        SLA_UNACHIEVABLE: 0,
        COMMERCIAL_RATE: 0,
        OTHER: 0,
      },
      supplier_allocation_share: [],
    };
  }

  const [oppsRes, awardsRes, responsesRes] = await Promise.all([
    dbQuery<any[]>('supplier_opportunities'),
    dbQuery<any[]>('supplier_award_decisions'),
    dbQuery<any[]>('supplier_opportunity_responses'),
  ]);

  const opps = oppsRes.data || [];
  const awards = awardsRes.data || [];
  const responses = responsesRes.data || [];

  const declineBreakdown: Record<DeclineReason, number> = {
    NO_CAPACITY: 0,
    OUTSIDE_AREA: 0,
    SKILL_UNAVAILABLE: 0,
    PARTS_UNAVAILABLE: 0,
    SLA_UNACHIEVABLE: 0,
    COMMERCIAL_RATE: 0,
    OTHER: 0,
  };

  for (const r of responses) {
    if (r.decision === 'DECLINE' && r.decline_reason && declineBreakdown[r.decline_reason as DeclineReason] !== undefined) {
      declineBreakdown[r.decline_reason as DeclineReason]++;
    }
  }

  // Calculate share per supplier
  const supplierCounts: Record<string, number> = {};
  for (const a of awards) {
    const name = a.selected_supplier_name || 'Contractor';
    supplierCounts[name] = (supplierCounts[name] || 0) + 1;
  }

  const totalAwards = awards.length;
  const share = Object.entries(supplierCounts).map(([supplier_name, count]) => ({
    supplier_name,
    awarded_jobs_count: count,
    share_percentage: totalAwards > 0 ? Number(((count / totalAwards) * 100).toFixed(1)) : 0,
  }));

  const acceptedResponses = responses.filter((r) => r.decision === 'ACCEPT').length;
  const totalResponses = responses.length;

  return {
    total_opportunities_issued: opps.length,
    direct_offers_count: opps.filter((o) => o.opportunity_type === 'DIRECT_OFFER').length,
    multi_rfq_count: opps.filter(
      (o) => o.opportunity_type === 'MULTI_SUPPLIER_OPPORTUNITY' || o.opportunity_type === 'QUOTE_REQUEST'
    ).length,
    emergency_cascades_count: opps.filter((o) => o.opportunity_type === 'EMERGENCY_OFFER').length,
    average_time_to_award_minutes: 0,
    average_supplier_response_time_minutes: 0,
    overall_acceptance_rate_percentage: totalResponses > 0 ? Number(((acceptedResponses / totalResponses) * 100).toFixed(1)) : 0,
    no_eligible_supplier_rate_percentage: 0,
    decline_reasons_breakdown: declineBreakdown,
    supplier_allocation_share: share,
  };
}
