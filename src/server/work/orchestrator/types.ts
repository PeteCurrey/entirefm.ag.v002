/**
 * ENTIREFM JOB LIFECYCLE ORCHESTRATION TYPES (Phase 0M Addendum)
 * ===============================================================
 * Canonical types for post-dispatch lifecycle orchestration,
 * chasing state machines, truthful client projections, completion gates,
 * and finance billing readiness handoff.
 */

export type JobLifecycleStage =
  | 'INTAKE'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'ACKNOWLEDGED'
  | 'EN_ROUTE'
  | 'ON_SITE'
  | 'IN_PROGRESS'
  | 'AWAITING_PARTS'
  | 'AWAITING_QUOTE'
  | 'AWAITING_CLIENT_APPROVAL'
  | 'RETURN_VISIT_REQUIRED'
  | 'OPERATIONAL_COMPLETE'
  | 'COMPLETED'
  | 'READY_FOR_BILLING'
  | 'BILLED'
  | 'CANCELLED';

export type ClientStatusProjection =
  | 'REPORTED'
  | 'BEING_REVIEWED'
  | 'ATTENDANCE_BEING_ARRANGED'
  | 'CONTRACTOR_ASSIGNED'
  | 'ENGINEER_ASSIGNED'
  | 'ENGINEER_EN_ROUTE'
  | 'ENGINEER_ON_SITE'
  | 'WORK_IN_PROGRESS'
  | 'AWAITING_PARTS'
  | 'AWAITING_QUOTE'
  | 'AWAITING_YOUR_APPROVAL'
  | 'RETURN_VISIT_REQUIRED'
  | 'COMPLETED'
  | 'CLOSED';

export type ActionOwner =
  | 'CONTRACTOR'
  | 'ENGINEER'
  | 'CLIENT'
  | 'HELPDESK'
  | 'FINANCE'
  | 'SYSTEM';

export type SLAState =
  | 'ON_TRACK'
  | 'AT_RISK'
  | 'BREACHED'
  | 'PAUSED'
  | 'ACHIEVED';

export type BillingState =
  | 'NOT_READY'
  | 'AWAITING_COMPLETION'
  | 'AWAITING_EVIDENCE'
  | 'AWAITING_SUPPLIER_COST'
  | 'AWAITING_QUOTE_APPROVAL'
  | 'READY_FOR_BILLING'
  | 'BILLED'
  | 'BILLING_EXCEPTION';

export type EvidenceState =
  | 'NOT_SUBMITTED'
  | 'PARTIAL'
  | 'SUBMITTED'
  | 'VERIFIED'
  | 'REJECTED';

export type ChaseType =
  | 'ACKNOWLEDGEMENT_CHASE'
  | 'ETA_CHASE'
  | 'ON_SITE_PROGRESS_CHASE'
  | 'QUOTE_APPROVAL_CHASE'
  | 'EVIDENCE_CHASE'
  | 'SUPPLIER_INVOICE_CHASE';

export interface ChasePolicy {
  acknowledgement_timeout_mins: number; // e.g. 15 for P1, 30 for P2, 60 for P3
  max_chase_attempts: number; // e.g. 2
  reassignment_after_chase_failure: boolean;
  on_site_update_cadence_hours: number; // e.g. 2 hours on P1
  quote_approval_reminder_cadence_hours: number; // e.g. 24 hours
  supplier_invoice_chase_cadence_days: number; // e.g. 7 days
}

export interface TimelineEvent {
  timestamp: string;
  source: 'CLIENT' | 'HELPDESK' | 'CONTRACTOR' | 'ENGINEER' | 'FINANCE' | 'SYSTEM';
  visibility: 'CLIENT_VISIBLE' | 'PROVIDER_VISIBLE' | 'INTERNAL_ONLY' | 'ENGINEER_VISIBLE';
  title: string;
  detail?: string;
  actor_name?: string;
}

export interface CompletionGateResult {
  is_verified: boolean;
  operational_work_complete: boolean;
  mandatory_evidence_passed: boolean;
  service_report_passed: boolean;
  has_unapproved_quote: boolean;
  has_outstanding_return_visit: boolean;
  blocking_reasons: string[];
}

export interface BillingReadinessResult {
  billing_state: BillingState;
  is_ready_for_billing: boolean;
  work_order_id: string;
  client_id?: string;
  site_id?: string;
  completion_date?: string;
  client_price_net_gbp?: number;
  client_price_gross_gbp?: number;
  known_supplier_cost_net_gbp?: number;
  expected_margin_pct?: number;
  purchase_order_id?: string;
  po_number?: string;
  supplier_invoice_id?: string;
  billing_rule: 'PER_WORK_ORDER' | 'MONTHLY_CONTRACT' | 'INCLUSIVE_PPM' | 'QUOTED_MILESTONE';
  exceptions: string[];
}

export interface JobOrchestrationSnapshot {
  work_order_id: string;
  work_order_number: string;
  title: string;
  priority: string;
  trade: string;
  site_id?: string;
  site_name?: string;
  client_id?: string;
  client_name?: string;
  assigned_provider_id?: string;
  assigned_provider_name?: string;
  assigned_engineer_id?: string;
  assigned_engineer_name?: string;
  current_stage: JobLifecycleStage;
  client_status: ClientStatusProjection;
  next_required_action: string;
  action_owner: ActionOwner;
  action_due_at: string;
  sla_state: SLAState;
  sla_resolution_due_at: string;
  sla_minutes_remaining: number;
  chase_state: {
    is_chase_due: boolean;
    chase_type?: ChaseType;
    attempt_count: number;
    last_chase_at?: string;
  };
  evidence_state: EvidenceState;
  completion_gate: CompletionGateResult;
  billing_readiness: BillingReadinessResult;
  timeline: TimelineEvent[];
}
