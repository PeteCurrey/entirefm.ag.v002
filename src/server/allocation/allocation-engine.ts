import {
  WorkAllocationRequirement,
  HardEligibilityGateResult,
  AllocationCandidate,
  SupplierOpportunityResponse,
} from './allocation-types';
import { SupplierOrganisationRecord } from '../suppliers/types';
import { ServiceApprovalRecord, GeographicApprovalRecord, ComplianceHoldRecord } from '../suppliers/assurance-types';
import { SupplierScorecard } from '../suppliers/performance-types';

/**
 * DETERMINISTIC HARD ELIGIBILITY GATE EVALUATOR
 * Enforces strict legal, technical, and regulatory gates before any supplier is considered.
 */
export function evaluateSupplierHardGates(params: {
  supplier: SupplierOrganisationRecord;
  requirement: WorkAllocationRequirement;
  serviceApprovals: ServiceApprovalRecord[];
  geographicApprovals: GeographicApprovalRecord[];
  activeHolds: ComplianceHoldRecord[];
}): HardEligibilityGateResult {
  const { supplier, requirement, serviceApprovals, geographicApprovals, activeHolds } = params;

  const passedChecks: string[] = [];
  const failedChecks: string[] = [];
  const exclusionReasons: string[] = [];

  // Check 1: Active Compliance Status
  if (supplier.compliance_status === 'APPROVED' || supplier.compliance_status === 'CONDITIONALLY_APPROVED') {
    passedChecks.push('COMPLIANCE_STATUS_APPROVED');
  } else {
    failedChecks.push('COMPLIANCE_STATUS_UNAPPROVED');
    exclusionReasons.push(`Supplier compliance status '${supplier.compliance_status}' does not permit work dispatch`);
  }

  // Check 2: No Blocking Compliance Holds
  const globalHold = activeHolds.find((h) => h.is_active && h.hold_scope === 'GLOBAL');
  const serviceHold = activeHolds.find((h) => h.is_active && h.hold_scope === 'SERVICE' && h.affected_service_slug === requirement.service_slug);
  const geoHold = activeHolds.find((h) => h.is_active && h.hold_scope === 'GEOGRAPHY' && h.affected_city?.toLowerCase() === requirement.site_city.toLowerCase());

  if (globalHold || serviceHold || geoHold) {
    failedChecks.push('ACTIVE_COMPLIANCE_HOLD');
    const hold = globalHold || serviceHold || geoHold;
    exclusionReasons.push(`Active Compliance Hold: ${hold?.hold_reason}`);
  } else {
    passedChecks.push('NO_ACTIVE_COMPLIANCE_HOLDS');
  }

  // Check 3: Scoped Service Approval
  const srvApproval = serviceApprovals.find(
    (sa) => sa.service_slug.toLowerCase() === requirement.service_slug.toLowerCase() && sa.approval_status === 'APPROVED'
  );
  if (srvApproval) {
    passedChecks.push('SERVICE_DISCIPLINE_APPROVED');
  } else {
    failedChecks.push('SERVICE_NOT_APPROVED');
    exclusionReasons.push(`Service '${requirement.service_name}' is not approved for this supplier`);
  }

  // Check 4: Scoped Geographic Approval
  const geoApproval = geographicApprovals.find(
    (ga) => ga.region_or_city.toLowerCase() === requirement.site_city.toLowerCase() && ga.is_approved
  );
  if (supplier.is_national || geoApproval) {
    passedChecks.push('GEOGRAPHY_AUTHORISED');
  } else {
    failedChecks.push('GEOGRAPHY_NOT_AUTHORISED');
    exclusionReasons.push(`Supplier is not approved to deliver works in '${requirement.site_city}'`);
  }

  // Check 5: Emergency 24/7 Capability (If P1 Emergency)
  if (requirement.priority === 'P1_EMERGENCY' && !supplier.emergency_24_7) {
    failedChecks.push('NO_24_7_EMERGENCY_CAPABILITY');
    exclusionReasons.push('Requirement demands 24/7 emergency response capability');
  } else if (requirement.priority === 'P1_EMERGENCY') {
    passedChecks.push('24_7_EMERGENCY_CAPABLE');
  }

  const isEligible = failedChecks.length === 0;

  return {
    is_eligible: isEligible,
    exclusion_reasons: exclusionReasons,
    passed_checks: passedChecks,
    failed_checks: failedChecks,
  };
}

/**
 * EXPLAINABLE CANDIDATE SUITABILITY SCORING
 * Computes deterministic soft factors only for technically eligible suppliers.
 */
export function calculateCandidateSuitability(params: {
  supplier: SupplierOrganisationRecord;
  requirement: WorkAllocationRequirement;
  hardGate: HardEligibilityGateResult;
  scorecard: SupplierScorecard | null;
  distanceMiles?: number;
  currentOpenWorkload: number;
}): AllocationCandidate {
  const { supplier, requirement, hardGate, scorecard, distanceMiles, currentOpenWorkload } = params;

  const strengths: string[] = [];
  const considerations: string[] = [];

  const sla = scorecard?.sla_attendance_rate.value || 85;
  const ftf = scorecard?.first_time_fix_rate.value || 80;
  const evidence = scorecard?.evidence_acceptance_rate.value || 90;

  let score = 0;

  if (hardGate.is_eligible) {
    // Deterministic Formula: 40% SLA + 30% FTF + 20% Evidence + 10% 24/7 capability - Workload Penalty
    score = Math.round(
      sla * 0.4 +
      ftf * 0.3 +
      evidence * 0.2 +
      (supplier.emergency_24_7 ? 10 : 0) -
      Math.min(currentOpenWorkload * 2, 20)
    );
    score = Math.max(0, Math.min(100, score));

    if (sla >= 92) strengths.push(`Strong SLA attendance record (${sla}%)`);
    if (ftf >= 85) strengths.push(`High first-time fix rate (${ftf}%)`);
    if (supplier.emergency_24_7) strengths.push('24/7 Emergency response capable');
    if (distanceMiles && distanceMiles <= 15) strengths.push(`Close geographic proximity (${distanceMiles} miles)`);
    if (supplier.relationship_level === 'STRATEGIC_PARTNER' || supplier.relationship_level === 'PREFERRED_SUPPLIER') {
      strengths.push(`Recognised ${supplier.relationship_level.replace('_', ' ')}`);
    }

    if (currentOpenWorkload >= 6) considerations.push(`High active workload (${currentOpenWorkload} open jobs)`);
    if (scorecard?.overall_status === 'WATCH') considerations.push('Supplier is currently on operational performance watch');
  }

  return {
    supplier_id: supplier.id,
    supplier_name: supplier.legal_name,
    is_eligible: hardGate.is_eligible,
    hard_gate_result: hardGate,
    suitability_score: score,
    strengths,
    considerations,
    sla_rate: sla,
    ftf_rate: ftf,
    evidence_rate: evidence,
    distance_miles: distanceMiles,
    current_open_workload: currentOpenWorkload,
    is_24_7_capable: supplier.emergency_24_7,
    is_preferred_partner: supplier.relationship_level === 'PREFERRED_SUPPLIER',
  };
}

/**
 * QUOTE COMPARISON HELPER
 */
export function compareSupplierQuotes(responses: SupplierOpportunityResponse[]) {
  const quoteResponses = responses.filter((r) => r.decision === 'SUBMIT_QUOTE' && r.quoted_price_gbp !== undefined);
  return quoteResponses.sort((a, b) => (a.quoted_price_gbp || 0) - (b.quoted_price_gbp || 0));
}
