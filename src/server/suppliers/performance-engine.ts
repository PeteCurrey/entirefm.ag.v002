import {
  SupplierScorecard,
  MetricMeasurement,
  PerformanceStatus,
  DataSufficiencyStatus,
  PerformanceTrend,
  ServicePerformanceBreakdown,
  GeographicPerformanceBreakdown,
  SupplierAllocationSuitability,
  DelayAttribution,
} from './performance-types';
import { SupplierOrganisationRecord } from './types';
import { ServiceApprovalRecord, GeographicApprovalRecord, ComplianceHoldRecord } from './assurance-types';

/**
 * DETERMINISTIC SLA ATTENDANCE CALCULATION
 * Filters out non-supplier delays (e.g. CLIENT_DELAY, ACCESS_DELAY).
 */
export function calculateSlaAttendanceRate(events: Array<{
  is_on_time: boolean;
  delay_attribution?: DelayAttribution;
}>): { rate: number; sampleSize: number; supplierAttributableDelays: number } {
  const applicable = events.filter(
    (e) => !e.delay_attribution || e.delay_attribution === 'SUPPLIER_DELAY'
  );

  if (applicable.length === 0) return { rate: 100, sampleSize: 0, supplierAttributableDelays: 0 };

  const onTimeCount = applicable.filter((e) => e.is_on_time).length;
  const rate = Math.round((onTimeCount / applicable.length) * 1000) / 10;
  const supplierDelays = applicable.filter((e) => !e.is_on_time).length;

  return { rate, sampleSize: applicable.length, supplierAttributableDelays: supplierDelays };
}

/**
 * DETERMINISTIC FIRST-TIME FIX (FTF) CALCULATION
 * Evaluates single-visit resolutions without repeat callbacks in window.
 */
export function calculateFirstTimeFixRate(orders: Array<{
  single_visit_resolution: boolean;
  repeat_callback_within_window: boolean;
}>): { rate: number; sampleSize: number } {
  if (orders.length === 0) return { rate: 100, sampleSize: 0 };

  const ftfCount = orders.filter((o) => o.single_visit_resolution && !o.repeat_callback_within_window).length;
  const rate = Math.round((ftfCount / orders.length) * 1000) / 10;
  return { rate, sampleSize: orders.length };
}

/**
 * DATA SUFFICIENCY EVALUATOR
 */
export function evaluateDataSufficiency(sampleSize: number, minimumThreshold: number = 5): DataSufficiencyStatus {
  if (sampleSize === 0) return 'NO_DATA';
  if (sampleSize < minimumThreshold) return 'INSUFFICIENT_DATA';
  return 'REPORTABLE';
}

/**
 * PERFORMANCE STATUS CLASSIFIER
 */
export function classifyPerformanceStatus(params: {
  slaRate: number;
  ftfRate: number;
  sufficiency: DataSufficiencyStatus;
  activePip?: boolean;
}): PerformanceStatus {
  if (params.sufficiency !== 'REPORTABLE') return 'INSUFFICIENT_DATA';
  if (params.activePip) return 'IMPROVEMENT_REQUIRED';

  if (params.slaRate >= 92 && params.ftfRate >= 85) return 'EXCELLENT';
  if (params.slaRate >= 85 && params.ftfRate >= 75) return 'GOOD';
  if (params.slaRate >= 75 && params.ftfRate >= 65) return 'WATCH';
  if (params.slaRate < 60 || params.ftfRate < 50) return 'CRITICAL';
  return 'IMPROVEMENT_REQUIRED';
}

/**
 * ALLOCATION SUITABILITY EVALUATOR (HARD GATES + SOFT FACTORS)
 * Enforces strict compliance firewall and commercial insulation.
 */
export function evaluateAllocationSuitability(params: {
  supplier: SupplierOrganisationRecord;
  serviceSlug: string;
  cityOrRegion: string;
  scorecard: SupplierScorecard | null;
  serviceApprovals: ServiceApprovalRecord[];
  geographicApprovals: GeographicApprovalRecord[];
  activeHolds: ComplianceHoldRecord[];
  currentOpenJobsCount: number;
  distanceMiles?: number;
}): SupplierAllocationSuitability {
  const { supplier, serviceSlug, cityOrRegion, scorecard, serviceApprovals, geographicApprovals, activeHolds, currentOpenJobsCount, distanceMiles } = params;

  const ineligibilityReasons: string[] = [];
  const strengths: string[] = [];
  const considerations: string[] = [];

  // ==========================================
  // HARD GATES (Failure = NOT ELIGIBLE)
  // ==========================================
  if (supplier.compliance_status !== 'APPROVED' && supplier.compliance_status !== 'CONDITIONALLY_APPROVED') {
    ineligibilityReasons.push(`Supplier compliance status is '${supplier.compliance_status}' (Requires APPROVED)`);
  }

  const globalHold = activeHolds.find((h) => h.is_active && h.hold_scope === 'GLOBAL');
  if (globalHold) {
    ineligibilityReasons.push(`Active Global Compliance Hold: ${globalHold.hold_reason}`);
  }

  const srvApproval = serviceApprovals.find((sa) => sa.service_slug.toLowerCase() === serviceSlug.toLowerCase());
  if (!srvApproval || srvApproval.approval_status !== 'APPROVED') {
    ineligibilityReasons.push(`Service '${serviceSlug}' is not approved for this supplier`);
  }

  const geoApproval = geographicApprovals.find((ga) => ga.region_or_city.toLowerCase() === cityOrRegion.toLowerCase() && ga.is_approved);
  if (!supplier.is_national && !geoApproval) {
    ineligibilityReasons.push(`Supplier is not authorized for region '${cityOrRegion}'`);
  }

  const isEligible = ineligibilityReasons.length === 0;

  // ==========================================
  // SOFT FACTORS (Scored 0 - 100)
  // ==========================================
  let score = 50; // Base baseline

  const sla = scorecard?.sla_attendance_rate.value || 85;
  const ftf = scorecard?.first_time_fix_rate.value || 80;
  const evidence = scorecard?.evidence_acceptance_rate.value || 90;

  if (isEligible) {
    score = Math.round(
      sla * 0.4 +
      ftf * 0.3 +
      evidence * 0.2 +
      (supplier.emergency_24_7 ? 10 : 0) -
      Math.min(currentOpenJobsCount * 2, 20)
    );
    score = Math.max(0, Math.min(100, score));

    if (sla >= 92) strengths.push(`High SLA attendance history (${sla}%)`);
    if (ftf >= 85) strengths.push(`Strong first-time fix rate (${ftf}%)`);
    if (supplier.emergency_24_7) strengths.push('24/7 Emergency response capable');
    if (distanceMiles && distanceMiles <= 15) strengths.push(`Close geographic proximity (${distanceMiles} miles)`);

    if (currentOpenJobsCount >= 8) considerations.push(`Current active workload is high (${currentOpenJobsCount} open jobs)`);
    if (scorecard?.overall_status === 'WATCH') considerations.push('Supplier currently on performance watch');
  }

  return {
    supplier_id: supplier.id,
    supplier_name: supplier.legal_name,
    is_eligible: isEligible,
    ineligibility_reasons: ineligibilityReasons,
    suitability_score: score,
    strengths,
    considerations,
    sla_rate: sla,
    ftf_rate: ftf,
    evidence_rate: evidence,
    distance_miles: distanceMiles,
    current_open_workload: currentOpenJobsCount,
    is_24_7_capable: supplier.emergency_24_7,
  };
}
