/**
 * ENTIREFM SUPPLIER PERFORMANCE & ALLOCATION INTELLIGENCE (PHASE 4)
 * ================================================================
 * Evidence-led multi-dimensional performance framework:
 * SLA, Response, Attendance, First-Time Fix (FTF), Quality Defects,
 * Evidence Gating, Commercial Accuracy, Client Feedback, Safety,
 * Scorecards, Benchmarks, Improvement Plans (PIPs), QBRs, and
 * Allocation Suitability.
 */

export type PerformanceStatus =
  | 'EXCELLENT'
  | 'GOOD'
  | 'WATCH'
  | 'IMPROVEMENT_REQUIRED'
  | 'CRITICAL'
  | 'INSUFFICIENT_DATA';

export type DataSufficiencyStatus =
  | 'NO_DATA'
  | 'INSUFFICIENT_DATA'
  | 'REPORTABLE';

export type PerformanceTrend = 'IMPROVING' | 'STABLE' | 'DECLINING' | 'INSUFFICIENT_HISTORY';

export type DelayAttribution =
  | 'SUPPLIER_DELAY'
  | 'CLIENT_DELAY'
  | 'ACCESS_DELAY'
  | 'PARTS_DELAY'
  | 'ENTIREFM_DELAY'
  | 'APPROVAL_DELAY'
  | 'THIRD_PARTY_DELAY'
  | 'FORCE_MAJEURE';

export type QualityDefectSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';

export type PipStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'IMPROVING'
  | 'TARGET_MET'
  | 'FAILED'
  | 'EXTENDED'
  | 'CLOSED';

export type PerformanceReviewType =
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'BIANNUAL'
  | 'ANNUAL'
  | 'AD_HOC';

export type WorkType = 'REACTIVE' | 'PPM' | 'PROJECT' | 'EMERGENCY' | 'INSPECTION';

/**
 * Single Performance Metric Result
 */
export interface MetricMeasurement {
  metric_code: string;
  metric_name: string;
  value: number; // e.g. 92.5 (%)
  unit: '%' | 'days' | 'hours' | 'rating' | 'count';
  sample_size: number; // e.g. 48 jobs
  sufficiency_status: DataSufficiencyStatus;
  target_threshold: number;
  is_meeting_target: boolean;
  trend: PerformanceTrend;
  underlying_event_ids?: string[];
}

/**
 * Service-Specific Performance Breakdown
 */
export interface ServicePerformanceBreakdown {
  service_slug: string;
  service_name: string;
  sample_size: number;
  sla_attendance_rate: number;
  first_time_fix_rate: number;
  evidence_acceptance_rate: number;
  status: PerformanceStatus;
}

/**
 * Geographic Performance Breakdown
 */
export interface GeographicPerformanceBreakdown {
  region_or_city: string;
  sample_size: number;
  sla_attendance_rate: number;
  first_time_fix_rate: number;
  status: PerformanceStatus;
}

/**
 * EntireFM Supplier Scorecard
 */
export interface SupplierScorecard {
  supplier_id: string;
  supplier_name: string;
  measurement_window: '30_DAYS' | '90_DAYS' | '12_MONTHS' | 'LIFETIME';
  overall_status: PerformanceStatus;
  overall_performance_index?: number; // Configurable weighted 0-100
  total_completed_jobs: number;
  sufficiency_status: DataSufficiencyStatus;
  
  // Core Operational Dimensions
  sla_attendance_rate: MetricMeasurement;
  first_time_fix_rate: MetricMeasurement;
  attendance_reliability_rate: MetricMeasurement;
  evidence_acceptance_rate: MetricMeasurement;
  invoice_accuracy_rate: MetricMeasurement;
  client_feedback_rating: MetricMeasurement; // 1-5
  safety_incident_count: MetricMeasurement;
  
  // Breakdown dimensions
  service_breakdowns: ServicePerformanceBreakdown[];
  geographic_breakdowns: GeographicPerformanceBreakdown[];
  
  // Status & Recommendations
  active_pip_id?: string;
  eligible_for_preferred_review: boolean;
  last_calculated_at: string;
}

/**
 * Supplier Quality Defect Log
 */
export interface SupplierQualityDefectRecord {
  id: string;
  supplier_id: string;
  work_order_id: string;
  service_slug: string;
  site_id?: string;
  issue_title: string;
  description: string;
  severity: QualityDefectSeverity;
  raised_by: string;
  raised_at: string;
  root_cause: 'RESOURCE' | 'TRAINING' | 'PARTS' | 'PROCESS' | 'COMMUNICATION' | 'SCHEDULING' | 'SUBCONTRACTOR' | 'QUALITY_CONTROL' | 'SYSTEM' | 'OTHER';
  is_supplier_attributable: boolean;
  remediation_required: string;
  resolved_at?: string;
  resolution_notes?: string;
}

/**
 * Performance Improvement Plan (PIP)
 */
export interface PerformanceImprovementPlan {
  id: string;
  supplier_id: string;
  supplier_name: string;
  reason: string;
  target_metrics: Array<{
    metric_name: string;
    baseline_value: number;
    target_value: number;
    current_value: number;
  }>;
  action_plan: string;
  owner_role: string;
  supplier_contact: string;
  start_date: string;
  target_date: string;
  status: PipStatus;
  review_notes?: string;
  closed_at?: string;
  closed_by?: string;
}

/**
 * Supplier Quarterly Business Review (QBR) Record
 */
export interface SupplierPerformanceReviewRecord {
  id: string;
  supplier_id: string;
  review_period: string; // e.g. "Q2 2026"
  review_type: PerformanceReviewType;
  reviewer_name: string;
  reviewer_role: string;
  attendees: string[];
  metrics_snapshot: {
    total_jobs: number;
    sla_attendance_rate: number;
    first_time_fix_rate: number;
    evidence_quality_rate: number;
    invoice_accuracy_rate: number;
    client_feedback_score: number;
  };
  strengths: string[];
  areas_for_improvement: string[];
  decisions: string[];
  relationship_tier_recommendation?: 'MAINTAIN' | 'ELEVATE_TO_PREFERRED' | 'ELEVATE_TO_STRATEGIC' | 'PLACE_ON_WATCH' | 'DEMOTE';
  next_review_date: string;
  conducted_at: string;
}

/**
 * Allocation Suitability Assessment
 */
export interface SupplierAllocationSuitability {
  supplier_id: string;
  supplier_name: string;
  is_eligible: boolean; // Hard Gates
  ineligibility_reasons: string[];
  
  // Soft Scoring
  suitability_score: number; // 0 - 100
  strengths: string[];
  considerations: string[];
  
  // Component operational indicators
  sla_rate: number;
  ftf_rate: number;
  evidence_rate: number;
  distance_miles?: number;
  current_open_workload: number;
  is_24_7_capable: boolean;
}

/**
 * Benchmark Medians by Service & City
 */
export interface ServiceBenchmarkMedian {
  service_slug: string;
  service_name: string;
  region_or_city: string;
  total_suppliers_measured: number;
  median_sla_rate: number;
  median_ftf_rate: number;
  median_evidence_rate: number;
  updated_at: string;
}
