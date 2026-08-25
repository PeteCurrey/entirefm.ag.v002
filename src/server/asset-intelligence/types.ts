/**
 * ENTIREFM ASSET INTELLIGENCE — TYPE DEFINITIONS (Phase 0K)
 * ==========================================================
 * Canonical types for Asset Intelligence, Lifecycle Cost,
 * Failure Analysis, and Predictive Maintenance Foundation.
 *
 * Truth semantics:
 *   - DataNoValue = 'NO_DATA' is always preferred over 0 or null for absent data
 *   - No mystery aggregate scores
 *   - All metrics include provenance and confidence
 */

// ─── CONTROLLED VOCABULARIES ────────────────────────────────────────────────

export type AssetCondition =
  | 'EXCELLENT'
  | 'GOOD'
  | 'FAIR'
  | 'POOR'
  | 'CRITICAL'
  | 'UNKNOWN';

export type AssetCriticality = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AssetLifecycleStatus =
  | 'ACTIVE'
  | 'OUT_OF_SERVICE'
  | 'DECOMMISSIONED'
  | 'REPLACED'
  | 'DISPOSED';

export type FailureCategory =
  | 'FUNCTIONAL_FAILURE'
  | 'PARTIAL_FAILURE'
  | 'PERFORMANCE_DEGRADATION'
  | 'SAFETY_FAILURE'
  | 'CONTROLS_FAILURE'
  | 'LEAK'
  | 'ELECTRICAL_FAILURE'
  | 'MECHANICAL_FAILURE'
  | 'OTHER'
  | 'UNKNOWN';

export const ENTIREFM_CONTROLLED_FAILURE_TAXONOMY: readonly FailureCategory[] = [
  'FUNCTIONAL_FAILURE',
  'PARTIAL_FAILURE',
  'PERFORMANCE_DEGRADATION',
  'SAFETY_FAILURE',
  'CONTROLS_FAILURE',
  'LEAK',
  'ELECTRICAL_FAILURE',
  'MECHANICAL_FAILURE',
  'OTHER',
  'UNKNOWN',
] as const;

export type SignalType =
  | 'REPEAT_FAILURE'
  | 'HIGH_REACTIVE_COST'
  | 'AGE_APPROACHING_EXPECTED_LIFE'
  | 'AGE_EXCEEDS_EXPECTED_LIFE'
  | 'CONDITION_POOR'
  | 'CONDITION_CRITICAL'
  | 'REPAIR_COST_THRESHOLD'
  | 'WARRANTY_EXPIRING'
  | 'HIGH_DOWNTIME'
  | 'PPM_FAILURE_TREND'
  | 'OBSOLESCENCE_REVIEW_REQUIRED'
  | 'DATA_INCOMPLETE';

export type SignalSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

export type PredictiveReadiness =
  | 'NOT_READY'
  | 'HISTORY_READY'
  | 'CONDITION_READY'
  | 'TELEMETRY_CONFIGURED'
  | 'TELEMETRY_READY'
  | 'MODEL_ELIGIBLE';

export type CostAttributionType =
  | 'DIRECTLY_ATTRIBUTED'
  | 'SYSTEM_LEVEL'
  | 'SITE_LEVEL_UNALLOCATED'
  | 'UNKNOWN';

export type WarrantyStatus = 'IN_WARRANTY' | 'EXPIRING' | 'EXPIRED' | 'UNKNOWN';

export type ReplacementEstimateFreshness = 'CURRENT' | 'AGEING' | 'STALE' | 'UNKNOWN';

export type ReplacementReviewStatus =
  | 'OPEN'
  | 'ASSESSMENT_REQUIRED'
  | 'QUOTE_REQUIRED'
  | 'CLIENT_REVIEW'
  | 'APPROVED'
  | 'DEFERRED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED';

export type ExpectedLifeSource =
  | 'MANUFACTURER'
  | 'CLIENT_STANDARD'
  | 'ENTIREFM_POLICY'
  | 'ASSET_DATABASE'
  | 'ENGINEER_ASSESSMENT'
  | 'HISTORICAL_ANALYSIS'
  | 'NOT_CONFIGURED';

export type ConditionSource =
  | 'ENGINEER_ASSESSMENT'
  | 'AI_ASSISTED'
  | 'IMPORT'
  | 'NOT_ASSESSED';

/** Sentinel value for absent data — never use 0 in its place */
export type DataNoValue = 'NO_DATA';

export type TaxBasis = 'NET' | 'GROSS' | 'EXEMPT' | 'UNKNOWN';

// ─── ASSET AGE ───────────────────────────────────────────────────────────────

export interface AssetAgeBreakdown {
  /** Installation Age: current_date - installation_date. NO_DATA if installation_date unknown. Never falls back to commission_date. */
  installation_age_years: number | DataNoValue;
  /** Commissioning Age: current_date - commission_date. NO_DATA if commission_date unknown. */
  commissioning_age_years: number | DataNoValue;
  /** Manufacture Age: current_date - manufacture_date (or parsed from metadata). NO_DATA if unknown. */
  manufacture_age_years: number | DataNoValue;
  /** Primary canonical age type currently active */
  primary_age_type: 'INSTALLATION' | 'COMMISSION' | 'MANUFACTURE' | 'NO_DATA';
  /** Primary canonical age value */
  primary_age_years: number | DataNoValue;
  /** ISO date calculated */
  as_of: string;
}

/** Legacy alias for backwards compatibility */
export type AssetAge = AssetAgeBreakdown;

// ─── EXPECTED LIFE ───────────────────────────────────────────────────────────

export interface ExpectedLifeProfile {
  /** Expected life in years, or NO_DATA if not configured */
  expected_life_years: number | DataNoValue;
  source: ExpectedLifeSource;
  source_date: string | null;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
}

export interface ExpectedLifeRemaining {
  /** Remaining years from installation_date only (never substitutes commission/manufacture date). NO_DATA if unknown. */
  remaining_years: number | DataNoValue;
  /** Percentage of expected life elapsed from installation date, or NO_DATA */
  pct_elapsed: number | DataNoValue;
  note: string;
}

// ─── CONDITION ────────────────────────────────────────────────────────────────

export interface ConditionRecord {
  condition: AssetCondition;
  source: ConditionSource;
  assessed_at: string | null;
  assessed_by_name: string | null;
  confidence: string;
}

export interface ConditionAssessment {
  id: string;
  asset_id: string;
  assessed_by: string | null;
  assessed_at: string;
  condition: AssetCondition;
  previous_condition: AssetCondition | null;
  operational_status: string;
  observed_defects: string[];
  observed_notes: string | null;
  recommended_action: string | null;
  next_review_date: string | null;
  confidence: string;
  source: string;
  ai_assisted: boolean;
  ai_extracted_observations: Record<string, unknown> | null;
}

// ─── FAILURE ──────────────────────────────────────────────────────────────────

export interface AssetFailureEvent {
  id: string;
  asset_id: string;
  work_order_id: string | null;
  defect_id: string | null;
  visit_id: string | null;
  failure_category: FailureCategory;
  failure_description: string | null;
  cause: string | null;
  resolution: string | null;
  parts_used: string[];
  direct_cost_gbp: number | null;
  /** null = UNKNOWN, not zero */
  downtime_minutes: number | null;
  downtime_business_impact: string | null;
  failed_at: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface RepeatFailureResult {
  asset_id: string;
  asset_reference: string;
  asset_name: string;
  site_name: string;
  failure_count: number;
  window_days: number;
  failure_categories: string[];
  first_failure_at: string;
  last_failure_at: string;
}

// ─── SIGNALS ──────────────────────────────────────────────────────────────────

export interface AssetSignal {
  id: string;
  asset_id: string;
  signal_type: SignalType;
  severity: SignalSeverity;
  title: string;
  description: string;
  evidence_snapshot: Record<string, unknown>;
  policy_version: string;
  is_active: boolean;
  generated_at: string;
}

// ─── COST ────────────────────────────────────────────────────────────────────

export interface AssetCostPeriod {
  period_label: string;
  period_start: string;
  period_end: string;
  reactive_cost_gbp: number;
  ppm_cost_gbp: number;
  total_directly_attributed_gbp: number;
  attribution_type: CostAttributionType;
  /** What % of cost lines have a traceable asset_id path */
  cost_coverage_pct: number;
  work_order_count: number;
}

export interface AssetCostLedger {
  asset_id: string;
  periods: AssetCostPeriod[];
  site_level_unallocated_note: string;
  /** Finance module is authoritative — cost never recalculated here */
  finance_authority_confirmed: boolean;
  data_status: 'LIVE' | DataNoValue;
}

// ─── REPAIR / REPLACE ────────────────────────────────────────────────────────

export interface ReplacementCostProvenance {
  amount: number | DataNoValue;
  currency: 'GBP';
  tax_basis: TaxBasis;
  source: string | null;
  source_date: string | null;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  freshness: ReplacementEstimateFreshness;
  requires_update: boolean;
}

export interface PartialTcoBreakdown {
  asset_id: string;
  purchase_price_gbp: number | DataNoValue;
  energy_cost_gbp: number | DataNoValue;
  disposal_cost_gbp: number | DataNoValue;
  reactive_cost_gbp: number | DataNoValue;
  ppm_cost_gbp: number | DataNoValue;
  total_attributable_gbp: number;
  label: 'PARTIAL TCO';
  coverage_note: string;
  data_status: 'LIVE' | DataNoValue;
}

export interface RepairToReplacementRatio {
  period_label: string;
  repair_spend_gbp: number;
  replacement_estimate_gbp: number | DataNoValue;
  currency: 'GBP';
  tax_basis: TaxBasis;
  /** repair_spend / replacement_estimate × 100, or NO_DATA */
  ratio_pct: number | DataNoValue;
  estimate_source: string | null;
  estimate_date: string | null;
  estimate_freshness: ReplacementEstimateFreshness;
  data_status: 'LIVE' | DataNoValue;
}

// ─── LIFECYCLE ───────────────────────────────────────────────────────────────

export interface PredictiveReadinessCriteria {
  has_installation_date: boolean;
  has_expected_life: boolean;
  has_condition_assessed: boolean;
  has_failure_history: boolean;
  /** Requires >= 5 work events */
  has_sufficient_work_history: boolean;
  has_telemetry_source: boolean;
  failure_count: number;
  work_event_count: number;
  /** Actual count of timestamped sensor observations received */
  telemetry_observation_count?: number;
  /** Hours since last valid observation, or null if never received */
  telemetry_last_seen_hours_ago?: number | null;
  /** Data quality status of observations (VALID vs INVALID/CORRUPT/NO_DATA) */
  telemetry_data_quality_valid?: boolean;
  /** Policy threshold: minimum required observations for TELEMETRY_READY (default: 10) */
  telemetry_min_observations_required?: number;
  /** Policy threshold: maximum allowed staleness in hours (default: 48) */
  telemetry_max_stale_hours?: number;
}

export interface AssetLifecycleProfile {
  asset_id: string;
  age: AssetAge;
  expected_life: ExpectedLifeProfile;
  expected_life_remaining: ExpectedLifeRemaining;
  warranty_status: WarrantyStatus;
  warranty_expiry: string | null;
  lifecycle_status: AssetLifecycleStatus;
  predecessor_asset_id: string | null;
  successor_asset_id: string | null;
  predictive_readiness: PredictiveReadiness;
  predictive_readiness_criteria: PredictiveReadinessCriteria;
}

// ─── INTELLIGENCE PROFILE ─────────────────────────────────────────────────────

export interface AssetIntelligenceProfile {
  asset_id: string;
  asset_reference: string;
  name: string;
  category: string;
  manufacturer: string | null;
  model: string | null;
  serial_number: string | null;
  site_name: string;
  site_code: string;
  condition: ConditionRecord;
  criticality: AssetCriticality;
  lifecycle: AssetLifecycleProfile;
  signals: AssetSignal[];
  failure_count_12m: number;
  /** NO_DATA when no attributable finance records */
  reactive_cost_12m_gbp: number | DataNoValue;
  ppm_count_12m: number;
  repeat_failure: boolean;
  data_status: 'LIVE' | DataNoValue;
}

// ─── DATA QUALITY ─────────────────────────────────────────────────────────────

export interface AssetDataQuality {
  /** Metric identifier for this data quality definition */
  metric_code: 'METRIC_ASSET_DATA_QUALITY_V1';
  /** Semver of the metric definition — increment when fields/weights change */
  version: '1.0';
  /** Fields included in coverage measurement */
  fields_measured: string[];
  /** Denominator: all ACTIVE assets */
  scope: 'ACTIVE_ASSETS';
  total_assets: number;
  // ─── Canonical coverage fields ───────────────────────────────────────────
  installation_date_coverage_pct: number;
  manufacturer_coverage_pct: number;
  model_coverage_pct: number;
  serial_coverage_pct: number;
  expected_life_coverage_pct: number;
  condition_coverage_pct: number;
  cost_attribution_coverage_pct: number;
  ppm_link_coverage_pct: number;
  // ─── Legacy aliases (kept for backward compatibility) ────────────────────
  install_date_coverage_pct: number;
  condition_assessed_pct: number;
  // ─── Missing counts ───────────────────────────────────────────────────────
  missing_install_date: number;
  missing_manufacturer: number;
  missing_model: number;
  missing_serial: number;
  missing_expected_life: number;
  no_condition_assessment: number;
  critical_with_no_condition: number;
  data_status: 'LIVE' | DataNoValue;
}

export interface EnrichmentQueueSummary {
  missing_condition: number;
  missing_installation_date: number;
  missing_expected_life: number;
  missing_manufacturer: number;
  total: number;
}

export interface EnrichmentQueue {
  items: EnrichmentQueueItem[];
  summary: EnrichmentQueueSummary;
  data_status: 'LIVE' | DataNoValue;
}

export interface EnrichmentQueueItem {
  issue: string;
  count: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  example_asset_references: string[];
}

// ─── SITE / CLIENT EXPOSURE ───────────────────────────────────────────────────

export interface SiteAssetExposure {
  site_id: string;
  site_name: string;
  total_assets: number;
  critical_assets: number;
  poor_condition_count: number;
  critical_condition_count: number;
  repeat_failure_assets: number;
  over_life_assets: number;
  approaching_life_assets: number;
  high_cost_assets: number;
  open_replacement_reviews: number;
  unknown_condition_count: number;
  unknown_install_date_count: number;
  data_status: 'LIVE' | DataNoValue;
}

export interface ClientAssetExposure {
  client_account_id: string;
  client_name: string;
  sites: SiteAssetExposure[];
  totals: Omit<SiteAssetExposure, 'site_id' | 'site_name'>;
  data_status: 'LIVE' | DataNoValue;
}

// ─── MANUFACTURER / CLASS PERFORMANCE ────────────────────────────────────────

export interface AssetClassPerformance {
  category: string;
  manufacturer: string | null;
  model: string | null;
  asset_count: number;
  total_reactive_cost_gbp: number;
  avg_reactive_cost_gbp: number;
  failure_count: number;
  repeat_failure_count: number;
  period_label: string;
  /** true when asset_count < 5 — never rank without this warning */
  sample_size_warning: boolean;
}

// ─── REPLACEMENT REVIEW ───────────────────────────────────────────────────────

export interface AssetReplacementReview {
  id: string;
  asset_id: string;
  opened_at: string;
  opened_by: string | null;
  status: ReplacementReviewStatus;
  evidence_snapshot: Record<string, unknown>;
  ai_rationale: string | null;
  reviewed_by: string | null;
  decision: string | null;
  decision_at: string | null;
  decision_notes: string | null;
  created_at: string;
}

export interface ReplacementReviewCandidate {
  asset_id: string;
  asset_reference: string;
  asset_name: string;
  site_name: string;
  signals: SignalType[];
  age_years: number | DataNoValue;
  expected_life_years: number | DataNoValue;
  condition: AssetCondition;
  criticality: AssetCriticality;
  reactive_cost_12m_gbp: number | DataNoValue;
  repeat_failure_count: number;
  replacement_estimate_gbp: number | null;
  estimate_freshness: ReplacementEstimateFreshness;
  has_open_review: boolean;
}

// ─── RANKED ASSET (for high-cost, high-failure queries) ─────────────────────

export interface RankedAsset {
  asset_id: string;
  asset_reference: string;
  asset_name: string;
  category: string;
  site_name: string;
  site_code: string;
  rank: number;
  metric_value: number;
  metric_label: string;
  condition: AssetCondition;
  criticality: AssetCriticality;
  period_label: string;
}

// ─── CEO TOOL RESPONSE WRAPPERS ───────────────────────────────────────────────

export interface AssetIntelligenceSummary {
  data_status: 'LIVE' | DataNoValue;
  total_assets: number;
  assets_with_signals: number;
  critical_signals: number;
  high_cost_assets: RankedAsset[];
  repeat_failure_assets: RepeatFailureResult[];
  replacement_candidates: ReplacementReviewCandidate[];
  data_quality: AssetDataQuality;
  period_label: string;
}
