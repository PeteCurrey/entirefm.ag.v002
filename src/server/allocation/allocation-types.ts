/**
 * ENTIREFM SUPPLIER OPPORTUNITY, DISPATCH & INTELLIGENT ALLOCATION (PHASE 5)
 * =========================================================================
 * Full controlled workflow: Work Requirement -> Hard Eligibility Gates ->
 * Explainable Candidate Suitability -> Opportunities -> Responses ->
 * Human Award Decisions -> Real-Time Revalidation -> Dispatch -> Acknowledgement.
 */

export type AllocationSourceType =
  | 'REACTIVE_SERVICE_REQUEST'
  | 'WORK_ORDER'
  | 'PPM_TASK'
  | 'PROJECT_REQUIREMENT'
  | 'EMERGENCY_REQUIREMENT';

export type OpportunityType =
  | 'DIRECT_OFFER'
  | 'MULTI_SUPPLIER_OPPORTUNITY'
  | 'QUOTE_REQUEST'
  | 'EMERGENCY_OFFER'
  | 'PPM_ALLOCATION'
  | 'PROJECT_INVITATION';

export type OpportunityStatus =
  | 'ISSUED'
  | 'RESPONSES_RECEIVED'
  | 'AWAITING_AWARD'
  | 'AWARDED'
  | 'TIMED_OUT'
  | 'WITHDRAWN'
  | 'CANCELLED';

export type OpportunityResponseDecision =
  | 'ACCEPT'
  | 'DECLINE'
  | 'SUBMIT_QUOTE'
  | 'REQUEST_CLARIFICATION'
  | 'UNABLE_TO_MEET_SLA';

export type DeclineReason =
  | 'NO_CAPACITY'
  | 'OUTSIDE_AREA'
  | 'SKILL_UNAVAILABLE'
  | 'PARTS_UNAVAILABLE'
  | 'SLA_UNACHIEVABLE'
  | 'COMMERCIAL_RATE'
  | 'OTHER';

export type AwardReason =
  | 'BEST_OVERALL_SUITABILITY'
  | 'CONTRACTED_SUPPLIER'
  | 'PREFERRED_SUPPLIER'
  | 'FASTEST_RESPONSE'
  | 'CLIENT_MANDATED'
  | 'OEM_REQUIRED'
  | 'LOWEST_COMPLIANT_QUOTE'
  | 'BEST_VALUE'
  | 'EMERGENCY_AVAILABILITY'
  | 'MANUAL_OPERATIONAL_DECISION';

export type DispatchStatus =
  | 'AWAITING_ACKNOWLEDGEMENT'
  | 'ACKNOWLEDGED'
  | 'SCHEDULED'
  | 'EN_ROUTE'
  | 'ON_SITE'
  | 'COMPLETED'
  | 'REASSIGNED'
  | 'CANCELLED';

export type CommercialBasis =
  | 'CONTRACT_RATE'
  | 'FIXED_PRICE'
  | 'CALL_OUT_PLUS_RATE'
  | 'QUOTED'
  | 'NOT_TO_EXCEED'
  | 'EMERGENCY_AUTHORISATION';

export type SupplierAvailabilityStatus =
  | 'AVAILABLE'
  | 'LIMITED'
  | 'UNAVAILABLE'
  | 'OUT_OF_HOURS_ONLY'
  | 'EMERGENCY_ONLY';

/**
 * Canonical Work Allocation Requirement
 */
export interface WorkAllocationRequirement {
  id: string;
  source_type: AllocationSourceType;
  source_id: string; // e.g. "WO-2026-9041"
  client_id: string;
  client_name: string;
  site_id: string;
  site_name: string;
  site_city: string;
  site_postcode: string;
  service_slug: string;
  service_name: string;
  sub_service?: string;
  asset_name?: string;
  oem_manufacturer?: string;
  priority: 'P1_EMERGENCY' | 'P2_URGENT' | 'P3_STANDARD' | 'P4_SCHEDULED';
  sla_attendance_target_hours: number;
  scope_summary: string;
  detailed_scope?: string;
  work_risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimated_value_gbp?: number;
  not_to_exceed_gbp?: number;
  out_of_hours_required: boolean;
  mandatory_accreditations?: string[];
  client_mandated_supplier_id?: string;
  created_at: string;
}

/**
 * Hard Eligibility Gate Result
 */
export interface HardEligibilityGateResult {
  is_eligible: boolean;
  exclusion_reasons: string[];
  passed_checks: string[];
  failed_checks: string[];
}

/**
 * Explainable Candidate Evaluation
 */
export interface AllocationCandidate {
  supplier_id: string;
  supplier_name: string;
  is_eligible: boolean;
  hard_gate_result: HardEligibilityGateResult;
  suitability_score: number; // 0 - 100
  strengths: string[];
  considerations: string[];
  sla_rate: number;
  ftf_rate: number;
  evidence_rate: number;
  distance_miles?: number;
  current_open_workload: number;
  is_24_7_capable: boolean;
  is_preferred_partner: boolean;
  commercial_rate_indicator?: 'STANDARD' | 'PREMIUM' | 'ECONOMY';
}

/**
 * Supplier Opportunity Record
 */
export interface SupplierOpportunityRecord {
  id: string;
  requirement_id: string;
  opportunity_type: OpportunityType;
  status: OpportunityStatus;
  invited_supplier_ids: string[];
  response_deadline: string; // ISO string
  title: string;
  scope_summary: string;
  service_slug: string;
  site_city: string;
  priority: string;
  commercial_basis: CommercialBasis;
  not_to_exceed_gbp?: number;
  issued_at: string;
  issued_by: string;
  awarded_supplier_id?: string;
  awarded_at?: string;
}

/**
 * Supplier Opportunity Response
 */
export interface SupplierOpportunityResponse {
  id: string;
  opportunity_id: string;
  supplier_id: string;
  supplier_name: string;
  decision: OpportunityResponseDecision;
  decline_reason?: DeclineReason;
  quoted_price_gbp?: number;
  quoted_lead_time_hours?: number;
  planned_attendance_date?: string;
  clarification_question?: string;
  clarification_response?: string;
  notes?: string;
  responded_at: string;
  responded_by: string;
}

/**
 * Formal Award Decision Record
 */
export interface AwardDecisionRecord {
  id: string;
  opportunity_id: string;
  requirement_id: string;
  selected_supplier_id: string;
  selected_supplier_name: string;
  candidate_ids_evaluated: string[];
  award_reason: AwardReason;
  commercial_basis: CommercialBasis;
  agreed_value_gbp?: number;
  not_to_exceed_gbp?: number;
  is_override: boolean;
  override_rationale?: string;
  awarded_by: string;
  awarded_at: string;
  pre_dispatch_revalidation_passed: boolean;
}

/**
 * Work Order Dispatch Record
 */
export interface WorkOrderDispatchRecord {
  id: string;
  work_order_id: string;
  opportunity_id: string;
  award_id: string;
  supplier_id: string;
  supplier_name: string;
  service_name: string;
  site_name: string;
  site_city: string;
  priority: string;
  sla_target_time: string;
  status: DispatchStatus;
  assigned_operative_name?: string;
  assigned_operative_phone?: string;
  scheduled_attendance_start?: string;
  acknowledged_at?: string;
  acknowledged_by?: string;
  rams_submitted: boolean;
  dispatched_at: string;
  dispatched_by: string;
}

/**
 * Supplier Operating Availability
 */
export interface SupplierAvailabilityRecord {
  id: string;
  supplier_id: string;
  status: SupplierAvailabilityStatus;
  daily_reactive_slots: number;
  available_engineers_count: number;
  emergency_out_of_hours: boolean;
  unavailable_from?: string;
  unavailable_until?: string;
  reason?: string;
  updated_at: string;
}

/**
 * Allocation Analytics Summary
 */
export interface AllocationAnalyticsSummary {
  total_opportunities_issued: number;
  direct_offers_count: number;
  multi_rfq_count: number;
  emergency_cascades_count: number;
  average_time_to_award_minutes: number;
  average_supplier_response_time_minutes: number;
  overall_acceptance_rate_percentage: number;
  no_eligible_supplier_rate_percentage: number;
  decline_reasons_breakdown: Record<DeclineReason, number>;
  supplier_allocation_share: Array<{
    supplier_name: string;
    awarded_jobs_count: number;
    share_percentage: number;
  }>;
}
