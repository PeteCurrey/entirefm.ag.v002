/**
 * ENTIREFM CONTRACTOR ORCHESTRATION & DISPATCH TYPES (Phase 0M)
 * =============================================================
 * Canonical types for deterministic eligibility, explainable ranking,
 * reactive auto-dispatch, and the contractor accept/decline loop.
 */

import { TradeCategory, UrgencyLevel } from '../helpdesk/types';

export type AutomationLevel =
  | 'MANUAL'
  | 'ASSIST'
  | 'AUTO_TRIAGE'
  | 'AUTO_DISPATCH'
  | 'AUTO_DISPATCH_AND_PO';

export type AutoPOPolicy =
  | 'MANUAL'
  | 'AUTO_PREPARE'
  | 'AUTO_RAISE';

export interface HardEligibilityGate {
  is_eligible: boolean;
  passed_checks: string[];
  failed_checks: string[];
  exclusion_reasons: string[];
}

export interface EligibleContractorCandidate {
  supplier_id: string;
  supplier_name: string;
  supplier_code: string;
  contact_email?: string;
  contact_phone?: string;
  trade_match_score: number; // 0-100
  geographic_distance_miles?: number;
  sla_adherence_rate: number; // 0-100
  acceptance_rate: number; // 0-100
  current_open_jobs: number;
  agreed_callout_rate_gbp?: number;
  agreed_hourly_rate_gbp?: number;
  total_suitability_score: number; // 0-100
  scoring_factors: {
    trade_match_explanation: string;
    location_coverage_explanation: string;
    sla_performance_explanation: string;
    workload_explanation: string;
    rate_agreement_explanation: string;
  };
  eligibility_gates: HardEligibilityGate;
}

export interface DeclineRecord {
  supplier_id: string;
  supplier_name: string;
  decline_reason: string;
  declined_at: string;
}

export interface DispatchExecutionResult {
  status:
    | 'DISPATCHED'
    | 'AWAITING_APPROVAL'
    | 'NO_ELIGIBLE_PROVIDER'
    | 'ESCALATED'
    | 'DECLINED_REASSIGNED';
  work_order_id: string;
  work_order_number: string;
  assigned_supplier_id?: string;
  assigned_supplier_name?: string;
  purchase_order_id?: string;
  po_number?: string;
  po_gross_value_gbp?: number;
  ranked_candidates: EligibleContractorCandidate[];
  decline_history: DeclineRecord[];
  client_update_message?: string;
  contractor_notification_message?: string;
  audit_run_id?: string;
  exception_reason?: string;
}
