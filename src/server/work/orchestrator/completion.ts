/**
 * ENTIREFM COMPLETION READINESS EVALUATOR (Phase 0M Addendum)
 * ============================================================
 * Deterministic gate preventing premature completion and billing handoff.
 *
 * Rule:
 *   An operative or contractor pressing 'Complete' does NOT make the job verified
 *   or billable unless all mandatory evidence and quality gates pass.
 */

import { CompletionGateResult } from './types';

export interface CompletionEvaluationContext {
  workOrder: {
    id: string;
    status: string;
    work_type?: string;
    priority?: string;
  };
  visit?: {
    id: string;
    status: string;
    completed_at?: string;
    departure_time?: string;
  };
  evidence?: {
    has_before_photo?: boolean;
    has_after_photo?: boolean;
    has_required_readings?: boolean;
    has_client_signature?: boolean;
    missing_items?: string[];
  };
  serviceReport?: {
    id?: string;
    has_summary?: boolean;
    status?: string;
  };
  quotes?: Array<{
    id: string;
    status: string;
  }>;
  returnVisits?: Array<{
    id: string;
    status: string;
  }>;
}

export function evaluateCompletionReadiness(
  context: CompletionEvaluationContext
): CompletionGateResult {
  const blockingReasons: string[] = [];

  // 1. Operational Work Complete Check
  const operationalComplete =
    context.workOrder.status === 'COMPLETED' ||
    context.workOrder.status === 'OPERATIONAL_COMPLETE' ||
    context.visit?.status === 'COMPLETED' ||
    context.visit?.status === 'SUBMITTED';

  if (!operationalComplete) {
    blockingReasons.push('Operational fieldwork is not marked complete by operative or contractor');
  }

  // 2. Mandatory Evidence Check
  const ev = context.evidence || {};
  let evidencePassed = true;

  if (ev.has_before_photo === false) {
    evidencePassed = false;
    blockingReasons.push('Mandatory Before-photo is missing from digital job pack');
  }
  if (ev.has_after_photo === false) {
    evidencePassed = false;
    blockingReasons.push('Mandatory After-photo / completed work proof is missing');
  }
  if (ev.has_required_readings === false) {
    evidencePassed = false;
    blockingReasons.push('Mandatory test / meter readings not recorded');
  }
  if (ev.missing_items && ev.missing_items.length > 0) {
    evidencePassed = false;
    blockingReasons.push(...ev.missing_items.map((i) => `Missing evidence: ${i}`));
  }

  // 3. Service Report Quality Check
  const rep = context.serviceReport;
  const reportPassed = rep ? rep.has_summary !== false && rep.status !== 'REJECTED' : true;
  if (!reportPassed) {
    blockingReasons.push('Service report is incomplete or pending operative revision');
  }

  // 4. Outstanding Unapproved Quote Check
  const quotes = context.quotes || [];
  const hasUnapprovedQuote = quotes.some(
    (q) => q.status === 'DRAFT' || q.status === 'ISSUED' || q.status === 'PENDING_APPROVAL'
  );
  if (hasUnapprovedQuote) {
    blockingReasons.push('Outstanding remedial quote requires client approval before job closure');
  }

  // 5. Outstanding Return Visit Check
  const returnVisits = context.returnVisits || [];
  const hasOutstandingReturnVisit = returnVisits.some(
    (v) => ['PLANNED', 'SCHEDULED', 'OFFERED', 'ACCEPTED', 'IN_PROGRESS'].includes(v.status)
  );
  if (hasOutstandingReturnVisit) {
    blockingReasons.push('Subsequent return visit is scheduled and pending attendance');
  }

  const isVerified =
    operationalComplete &&
    evidencePassed &&
    reportPassed &&
    !hasUnapprovedQuote &&
    !hasOutstandingReturnVisit;

  return {
    is_verified: isVerified,
    operational_work_complete: operationalComplete,
    mandatory_evidence_passed: evidencePassed,
    service_report_passed: reportPassed,
    has_unapproved_quote: hasUnapprovedQuote,
    has_outstanding_return_visit: hasOutstandingReturnVisit,
    blocking_reasons: blockingReasons,
  };
}
