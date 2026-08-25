import {
  WorkAllocationRequirement,
  SupplierOpportunityRecord,
  SupplierOpportunityResponse,
  AwardDecisionRecord,
  WorkOrderDispatchRecord,
  SupplierAvailabilityRecord,
  AllocationAnalyticsSummary,
  AllocationCandidate,
} from './allocation-types';
import { listSupplierOrganisations, getSupplierOrganisation } from '../suppliers/store';
import { listServiceApprovals, listGeographicApprovals, listComplianceHolds } from '../suppliers/assurance-store';
import { getSupplierScorecard } from '../suppliers/performance-store';
import { evaluateSupplierHardGates, calculateCandidateSuitability } from './allocation-engine';

class AllocationMemoryStore {
  public requirements = new Map<string, WorkAllocationRequirement>();
  public opportunities = new Map<string, SupplierOpportunityRecord>();
  public responses = new Map<string, SupplierOpportunityResponse[]>();
  public awards = new Map<string, AwardDecisionRecord>();
  public dispatches = new Map<string, WorkOrderDispatchRecord>();
  public availability = new Map<string, SupplierAvailabilityRecord>();

  constructor() {
    this.seedInitialAllocationData();
  }

  private seedInitialAllocationData() {
    // 1. Requirement 1: Reactive HVAC at Commercial HQ Manchester
    const req1: WorkAllocationRequirement = {
      id: 'req-2026-8801',
      source_type: 'REACTIVE_SERVICE_REQUEST',
      source_id: 'WO-2026-9041',
      client_id: 'cli-man-01',
      client_name: 'Barclays Corporate Real Estate',
      site_id: 'site-manc-tower',
      site_name: '1 Spinningfields',
      site_city: 'Manchester',
      site_postcode: 'M3 3JE',
      service_slug: 'hvac',
      service_name: 'HVAC & Chillers',
      asset_name: 'Chiller Plant #2 (Daikin EWAD-TZ)',
      oem_manufacturer: 'Daikin',
      priority: 'P2_URGENT',
      sla_attendance_target_hours: 4,
      scope_summary: 'Chiller circuit #2 high discharge pressure fault causing 4th floor cooling failure.',
      work_risk_level: 'MEDIUM',
      estimated_value_gbp: 750,
      not_to_exceed_gbp: 1200,
      out_of_hours_required: false,
      mandatory_accreditations: ['REFCOM', 'F-Gas'],
      created_at: '2026-08-25T10:00:00.000Z',
    };
    this.requirements.set(req1.id, req1);

    // 2. Direct Opportunity for Apex HVAC
    const opp1: SupplierOpportunityRecord = {
      id: 'opp-2026-001',
      requirement_id: req1.id,
      opportunity_type: 'DIRECT_OFFER',
      status: 'AWARDED',
      invited_supplier_ids: ['sup-01'],
      response_deadline: '2026-08-25T10:45:00.000Z',
      title: 'Reactive Chiller Repair — 1 Spinningfields Manchester',
      scope_summary: 'Chiller circuit #2 high discharge pressure fault causing cooling failure.',
      service_slug: 'hvac',
      site_city: 'Manchester',
      priority: 'P2_URGENT',
      commercial_basis: 'CALL_OUT_PLUS_RATE',
      not_to_exceed_gbp: 1200,
      issued_at: '2026-08-25T10:05:00.000Z',
      issued_by: 'Alex Morgan (Senior Dispatcher)',
      awarded_supplier_id: 'sup-01',
      awarded_at: '2026-08-25T10:20:00.000Z',
    };
    this.opportunities.set(opp1.id, opp1);

    // 3. Response from Apex HVAC
    const resp1: SupplierOpportunityResponse = {
      id: 'resp-001',
      opportunity_id: opp1.id,
      supplier_id: 'sup-01',
      supplier_name: 'Apex Mechanical & HVAC Services Ltd',
      decision: 'ACCEPT',
      planned_attendance_date: '2026-08-25T12:30:00.000Z',
      notes: 'Mobile van technician Dave Miller en route from Salford Quays.',
      responded_at: '2026-08-25T10:14:00.000Z',
      responded_by: 'Marcus Vance (Apex MD)',
    };
    this.responses.set(opp1.id, [resp1]);

    // 4. Award Record
    const award1: AwardDecisionRecord = {
      id: 'awd-001',
      opportunity_id: opp1.id,
      requirement_id: req1.id,
      selected_supplier_id: 'sup-01',
      selected_supplier_name: 'Apex Mechanical & HVAC Services Ltd',
      candidate_ids_evaluated: ['sup-01'],
      award_reason: 'BEST_OVERALL_SUITABILITY',
      commercial_basis: 'CALL_OUT_PLUS_RATE',
      not_to_exceed_gbp: 1200,
      is_override: false,
      awarded_by: 'Alex Morgan (Senior Dispatcher)',
      awarded_at: '2026-08-25T10:20:00.000Z',
      pre_dispatch_revalidation_passed: true,
    };
    this.awards.set(award1.id, award1);

    // 5. Work Order Dispatch Record
    const disp1: WorkOrderDispatchRecord = {
      id: 'disp-001',
      work_order_id: 'WO-2026-9041',
      opportunity_id: opp1.id,
      award_id: award1.id,
      supplier_id: 'sup-01',
      supplier_name: 'Apex Mechanical & HVAC Services Ltd',
      service_name: 'HVAC & Chillers',
      site_name: '1 Spinningfields',
      site_city: 'Manchester',
      priority: 'P2_URGENT',
      sla_target_time: '2026-08-25T14:00:00.000Z',
      status: 'ACKNOWLEDGED',
      assigned_operative_name: 'Dave Miller',
      assigned_operative_phone: '07700 900123',
      scheduled_attendance_start: '2026-08-25T12:30:00.000Z',
      acknowledged_at: '2026-08-25T10:25:00.000Z',
      acknowledged_by: 'Dave Miller (Senior Chiller Engineer)',
      rams_submitted: true,
      dispatched_at: '2026-08-25T10:20:00.000Z',
      dispatched_by: 'Alex Morgan',
    };
    this.dispatches.set(disp1.id, disp1);

    // 6. Availability for Apex HVAC
    this.availability.set('sup-01', {
      id: 'avail-sup-01',
      supplier_id: 'sup-01',
      status: 'AVAILABLE',
      daily_reactive_slots: 6,
      available_engineers_count: 8,
      emergency_out_of_hours: true,
      updated_at: '2026-08-25T08:00:00.000Z',
    });
  }
}

const store = new AllocationMemoryStore();

/**
 * 1. WORK REQUIREMENTS
 */
export async function getWorkAllocationRequirement(id: string): Promise<WorkAllocationRequirement | null> {
  return store.requirements.get(id) || null;
}

export async function listWorkAllocationRequirements(): Promise<WorkAllocationRequirement[]> {
  return Array.from(store.requirements.values());
}

export async function createWorkAllocationRequirement(
  req: Omit<WorkAllocationRequirement, 'id' | 'created_at'>
): Promise<WorkAllocationRequirement> {
  const id = `req-${Date.now()}`;
  const record: WorkAllocationRequirement = {
    ...req,
    id,
    created_at: new Date().toISOString(),
  };
  store.requirements.set(id, record);
  return record;
}

/**
 * 2. CANDIDATE EVALUATION & DRY-RUN
 */
export async function evaluateCandidatesForRequirement(requirementId: string): Promise<AllocationCandidate[]> {
  const requirement = store.requirements.get(requirementId);
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
      distanceMiles: 8.5,
      currentOpenWorkload: 2,
    });
  });

  const candidates = await Promise.all(candidatePromises);

  // Sort: Eligible first, then descending suitability score
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
  const record: SupplierOpportunityRecord = {
    ...opp,
    id,
    status: 'ISSUED',
    issued_at: new Date().toISOString(),
  };
  store.opportunities.set(id, record);
  return record;
}

export async function listSupplierOpportunities(supplierId?: string): Promise<SupplierOpportunityRecord[]> {
  const all = Array.from(store.opportunities.values());
  if (!supplierId) return all;
  return all.filter((o) => o.invited_supplier_ids.includes(supplierId));
}

export async function getSupplierOpportunity(id: string): Promise<SupplierOpportunityRecord | null> {
  return store.opportunities.get(id) || null;
}

export async function submitOpportunityResponse(
  resp: Omit<SupplierOpportunityResponse, 'id' | 'responded_at'>
): Promise<SupplierOpportunityResponse> {
  const id = `resp-${Date.now()}`;
  const record: SupplierOpportunityResponse = {
    ...resp,
    id,
    responded_at: new Date().toISOString(),
  };

  const existing = store.responses.get(resp.opportunity_id) || [];
  store.responses.set(resp.opportunity_id, [...existing, record]);

  const opp = store.opportunities.get(resp.opportunity_id);
  if (opp) {
    opp.status = 'RESPONSES_RECEIVED';
    store.opportunities.set(opp.id, opp);
  }

  return record;
}

export async function listOpportunityResponses(opportunityId: string): Promise<SupplierOpportunityResponse[]> {
  return store.responses.get(opportunityId) || [];
}

/**
 * 4. AWARDS & REAL-TIME PRE-DISPATCH REVALIDATION
 */
export async function makeAwardDecision(award: Omit<AwardDecisionRecord, 'id' | 'awarded_at' | 'pre_dispatch_revalidation_passed'>): Promise<{
  success: boolean;
  award?: AwardDecisionRecord;
  revalidationError?: string;
}> {
  const requirement = store.requirements.get(award.requirement_id);
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
  const record: AwardDecisionRecord = {
    ...award,
    id,
    awarded_at: new Date().toISOString(),
    pre_dispatch_revalidation_passed: true,
  };
  store.awards.set(id, record);

  // Update opportunity status
  const opp = store.opportunities.get(award.opportunity_id);
  if (opp) {
    opp.status = 'AWARDED';
    opp.awarded_supplier_id = award.selected_supplier_id;
    opp.awarded_at = record.awarded_at;
    store.opportunities.set(opp.id, opp);
  }

  return { success: true, award: record };
}

export async function listAwardDecisions(): Promise<AwardDecisionRecord[]> {
  return Array.from(store.awards.values());
}

/**
 * 5. DISPATCH QUEUE & ACKNOWLEDGEMENT
 */
export async function dispatchWorkOrder(params: {
  awardId: string;
  dispatchedBy: string;
}): Promise<WorkOrderDispatchRecord | null> {
  const award = store.awards.get(params.awardId);
  if (!award) return null;

  const req = store.requirements.get(award.requirement_id);
  const opp = store.opportunities.get(award.opportunity_id);
  if (!req || !opp) return null;

  // Idempotency: return existing dispatch if already created
  const existing = Array.from(store.dispatches.values()).find((d) => d.award_id === award.id);
  if (existing) return existing;

  const id = `disp-${Date.now()}`;
  const record: WorkOrderDispatchRecord = {
    id,
    work_order_id: req.source_id,
    opportunity_id: opp.id,
    award_id: award.id,
    supplier_id: award.selected_supplier_id,
    supplier_name: award.selected_supplier_name,
    service_name: req.service_name,
    site_name: req.site_name,
    site_city: req.site_city,
    priority: req.priority,
    sla_target_time: new Date(Date.now() + req.sla_attendance_target_hours * 3600000).toISOString(),
    status: 'AWAITING_ACKNOWLEDGEMENT',
    rams_submitted: false,
    dispatched_at: new Date().toISOString(),
    dispatched_by: params.dispatchedBy,
  };

  store.dispatches.set(id, record);
  return record;
}

export async function acknowledgeDispatch(params: {
  dispatchId: string;
  acknowledgedBy: string;
  assignedOperativeName?: string;
  assignedOperativePhone?: string;
  scheduledAttendanceStart?: string;
}): Promise<WorkOrderDispatchRecord | null> {
  const disp = store.dispatches.get(params.dispatchId);
  if (!disp) return null;

  disp.status = 'ACKNOWLEDGED';
  disp.acknowledged_at = new Date().toISOString();
  disp.acknowledged_by = params.acknowledgedBy;
  if (params.assignedOperativeName) disp.assigned_operative_name = params.assignedOperativeName;
  if (params.assignedOperativePhone) disp.assigned_operative_phone = params.assignedOperativePhone;
  if (params.scheduledAttendanceStart) disp.scheduled_attendance_start = params.scheduledAttendanceStart;

  store.dispatches.set(disp.id, disp);
  return disp;
}

export async function listDispatches(supplierId?: string): Promise<WorkOrderDispatchRecord[]> {
  const all = Array.from(store.dispatches.values());
  if (!supplierId) return all;
  return all.filter((d) => d.supplier_id === supplierId);
}

/**
 * 6. SUPPLIER AVAILABILITY
 */
export async function getSupplierAvailability(supplierId: string): Promise<SupplierAvailabilityRecord | null> {
  return store.availability.get(supplierId) || null;
}

export async function updateSupplierAvailability(
  supplierId: string,
  update: Partial<SupplierAvailabilityRecord>
): Promise<SupplierAvailabilityRecord> {
  const existing = store.availability.get(supplierId) || {
    id: `avail-${supplierId}`,
    supplier_id: supplierId,
    status: 'AVAILABLE',
    daily_reactive_slots: 5,
    available_engineers_count: 4,
    emergency_out_of_hours: true,
    updated_at: new Date().toISOString(),
  };

  const updated: SupplierAvailabilityRecord = {
    ...existing,
    ...update,
    updated_at: new Date().toISOString(),
  };

  store.availability.set(supplierId, updated);
  return updated;
}

/**
 * 7. ALLOCATION ANALYTICS
 */
export async function getAllocationAnalytics(): Promise<AllocationAnalyticsSummary> {
  const opps = Array.from(store.opportunities.values());
  const awards = Array.from(store.awards.values());

  return {
    total_opportunities_issued: opps.length,
    direct_offers_count: opps.filter((o) => o.opportunity_type === 'DIRECT_OFFER').length,
    multi_rfq_count: opps.filter((o) => o.opportunity_type === 'MULTI_SUPPLIER_OPPORTUNITY' || o.opportunity_type === 'QUOTE_REQUEST').length,
    emergency_cascades_count: opps.filter((o) => o.opportunity_type === 'EMERGENCY_OFFER').length,
    average_time_to_award_minutes: 18.5,
    average_supplier_response_time_minutes: 9.2,
    overall_acceptance_rate_percentage: 91.5,
    no_eligible_supplier_rate_percentage: 2.1,
    decline_reasons_breakdown: {
      NO_CAPACITY: 4,
      OUTSIDE_AREA: 2,
      SKILL_UNAVAILABLE: 1,
      PARTS_UNAVAILABLE: 1,
      SLA_UNACHIEVABLE: 3,
      COMMERCIAL_RATE: 0,
      OTHER: 1,
    },
    supplier_allocation_share: [
      { supplier_name: 'Apex Mechanical & HVAC Services Ltd', awarded_jobs_count: 48, share_percentage: 42.0 },
      { supplier_name: 'Nordic HVAC & Chillers Ltd', awarded_jobs_count: 32, share_percentage: 28.0 },
      { supplier_name: 'PureClean FM Services Ltd', awarded_jobs_count: 24, share_percentage: 21.0 },
      { supplier_name: 'AeroThermal Drone AI Ltd', awarded_jobs_count: 10, share_percentage: 9.0 },
    ],
  };
}
