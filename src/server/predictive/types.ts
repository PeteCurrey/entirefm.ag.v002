/**
 * ENTIREFM PREDICTIVE MAINTENANCE — TYPE DEFINITIONS (Phase 0L)
 * ==============================================================
 * Canonical types for predictive model registry, feature definitions,
 * training datasets, predictions, reviews, and drift monitoring.
 */

export type ModelState =
  | 'DRAFT'
  | 'VALIDATING'
  | 'SHADOW'
  | 'ASSIST'
  | 'APPROVED'
  | 'RETIRED'
  | 'REJECTED';

export const MODEL_STATE_TRANSITIONS: Record<ModelState, ModelState[]> = {
  DRAFT: ['VALIDATING', 'REJECTED'],
  VALIDATING: ['SHADOW', 'REJECTED'],
  SHADOW: ['ASSIST', 'REJECTED', 'RETIRED'],
  ASSIST: ['RETIRED', 'REJECTED'],
  APPROVED: ['RETIRED'],
  RETIRED: [],
  REJECTED: [],
};

export type RiskLevel = 'ELEVATED' | 'MODERATE' | 'LOW' | 'INSUFFICIENT_DATA';

export type ReviewDecision =
  | 'NO_ACTION'
  | 'MONITOR'
  | 'INSPECT'
  | 'RAISE_DEFECT'
  | 'QUOTE'
  | 'ADJUST_PPM'
  | 'PLANNED_REPAIR'
  | 'REPLACEMENT_REVIEW';

export type ReviewStatus = 'OPEN' | 'IN_REVIEW' | 'DECIDED' | 'CLOSED' | 'SUPERSEDED';

export type EvaluationResult =
  | 'TRUE_POSITIVE'
  | 'FALSE_POSITIVE'
  | 'TRUE_NEGATIVE'
  | 'FALSE_NEGATIVE'
  | 'UNRESOLVED';

export type DriftType =
  | 'FEATURE_DRIFT'
  | 'INPUT_COVERAGE_CHANGE'
  | 'SENSOR_QUALITY_DEGRADATION'
  | 'POPULATION_CHANGE'
  | 'PERFORMANCE_DRIFT'
  | 'CALIBRATION_DRIFT';

export interface FeatureDefinition {
  code: string;
  version: number;
  formula: string;
  unit: string | null;
  window_days: number | null;
  source: 'TELEMETRY' | 'ASSET_REGISTER' | 'FAILURE_EVENTS' | 'PPM' | 'CONDITION' | 'COMPUTED';
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface TrainingDatasetConfig {
  name: string;
  description?: string;
  asset_population: {
    asset_classes?: string[];
    site_ids?: string[];
    asset_ids?: string[];
  };
  metric_population?: string[];
  date_range_from: string;
  date_range_to: string;
  feature_set_version: number;
  quality_filters?: {
    min_quality_fraction?: number;
    exclude_quality?: string[];
  };
  notes?: string;
  created_by?: string;
}

export interface TrainingDataset extends TrainingDatasetConfig {
  id: string;
  version: number;
  failure_label_source: 'ASSET_FAILURE_EVENTS';
  excluded_observations: unknown[];
  total_assets: number | null;
  total_observations: number | null;
  failure_event_count: number | null;
  non_failure_count: number | null;
  class_imbalance_ratio: number | null;
  created_at: string;
}

export interface PredictiveModel {
  id: string;
  name: string;
  asset_class: string | null;
  target: string;
  algorithm: string | null;
  description: string | null;
  owner: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ValidationMetrics {
  precision: number;
  recall: number;
  f1: number;
  roc_auc?: number;
  pr_auc?: number;
  fpr: number;
  fnr: number;
  lead_time_days_mean?: number;
  calibration_brier_score?: number;
  class_imbalance_ratio: number;
  failure_count: number;
  non_failure_count: number;
  note: string;
}

export interface ClassImbalanceReport {
  failure_count: number;
  non_failure_count: number;
  ratio: number;
  method: 'reported';
}

export interface PredictiveModelVersion {
  id: string;
  model_id: string;
  version: number;
  status: ModelState;
  training_dataset_id: string | null;
  feature_set_version: number;
  validation_window_days: number | null;
  validation_metrics: ValidationMetrics | null;
  class_imbalance_report: ClassImbalanceReport | null;
  trained_at: string | null;
  shadow_started_at: string | null;
  assist_started_at: string | null;
  prediction_count: number;
  true_positive_count: number;
  false_positive_count: number;
  true_negative_count: number;
  false_negative_count: number;
  notes: string | null;
  created_at: string;
}

export interface ModelApprovalRecord {
  model_version_id: string;
  from_state: ModelState;
  to_state: ModelState;
  decision: 'APPROVED' | 'REJECTED';
  reviewer_id?: string;
  reviewer_name?: string;
  validation_evidence_ref?: string;
  notes?: string;
}

export interface Prediction {
  id: string;
  model_version_id: string;
  asset_id: string;
  prediction_at: string;
  prediction_window_days: number;
  risk_level: RiskLevel;
  risk_score: number | null;
  feature_snapshot: Record<string, unknown>;
  data_quality: 'VALID' | 'PARTIAL' | 'INSUFFICIENT';
  data_freshness_hours: number | null;
  model_status_at_time: ModelState;
  created_at: string;
}

export interface PredictionOutcome {
  id: string;
  prediction_id: string;
  asset_id: string;
  actual_outcome: string | null;
  outcome_at: string | null;
  failure_event_id: string | null;
  evaluation_result: EvaluationResult | null;
  confirmed_by: string | null;
  confirmed_at: string;
  notes: string | null;
}

export interface PredictiveReview {
  id: string;
  prediction_id: string | null;
  asset_id: string;
  reliability_signal_id: string | null;
  opened_at: string;
  opened_by: string | null;
  status: ReviewStatus;
  recommended_action: ReviewDecision;
  evidence_snapshot: Record<string, unknown>;
  decision: ReviewDecision | null;
  decided_by: string | null;
  decision_at: string | null;
  decision_notes: string | null;
  resulting_work_order_id: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DriftEvent {
  id: string;
  model_version_id: string;
  drift_type: DriftType;
  severity: string;
  evidence_json: Record<string, unknown>;
  triggered_review: boolean;
  detected_at: string;
}

export interface FeatureSnapshot {
  asset_id: string;
  computed_at: string;
  window_end: string;
  features: Record<string, number | string | null>;
  feature_version: number;
  data_quality: 'VALID' | 'PARTIAL' | 'INSUFFICIENT';
  missing_features: string[];
}
