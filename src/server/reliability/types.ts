/**
 * ENTIREFM RELIABILITY INTELLIGENCE — TYPE DEFINITIONS (Phase 0L)
 * ================================================================
 * Canonical types for deterministic anomaly detection, reliability signals,
 * baseline computation, and the Asset Reliability Profile.
 */

export type AnomalyType =
  | 'STATIC_THRESHOLD'
  | 'RATE_OF_CHANGE'
  | 'BASELINE_DEVIATION'
  | 'PERSISTENT_DEVIATION'
  | 'SENSOR_FLATLINE'
  | 'SENSOR_DROPOUT'
  | 'START_STOP_CYCLING'
  | 'EXCESS_RUNTIME'
  | 'TEMPERATURE_DELTA'
  | 'PRESSURE_DELTA'
  | 'POWER_DEVIATION';

export type AnomalyScope = 'ASSET' | 'SENSOR';
export type AnomalySeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

export type ReliabilitySignalType =
  | 'TELEMETRY_ANOMALY'
  | 'PERSISTENT_ANOMALY'
  | 'DETERIORATING_TREND'
  | 'SENSOR_FAILURE'
  | 'EXCESS_RUNTIME'
  | 'SHORT_CYCLING'
  | 'EFFICIENCY_DEGRADATION'
  | 'CONDITION_AND_TELEMETRY_CONFLICT'
  | 'REPEAT_FAILURE_PLUS_ANOMALY'
  | 'HIGH_RISK_CRITICAL_ASSET';

export type SignalSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

export interface BaselineResult {
  status: 'ACTIVE' | 'INSUFFICIENT_DATA' | 'STALE' | 'NOT_FOUND';
  asset_id: string;
  metric_code: string;
  baseline_mean?: number;
  baseline_stddev?: number;
  baseline_min?: number;
  baseline_max?: number;
  baseline_p5?: number;
  baseline_p95?: number;
  sample_count?: number;
  training_window_days?: number;
  data_quality_coverage?: number;
  version?: number;
  computed_at?: string;
  insufficient_data_reason?: string;
}

export interface BaselineDeviationResult {
  deviation_absolute: number;
  deviation_stddev: number;
  deviation_pct: number;
  direction: 'ABOVE' | 'BELOW';
  is_anomalous: boolean;
  threshold_stddev: number;
  description: string;
}

export interface AnomalyEvidence {
  anomaly_type: AnomalyType;
  observed_value?: number;
  unit?: string;
  baseline_mean?: number;
  deviation_absolute?: number;
  deviation_pct?: number;
  duration_seconds?: number;
  sample_count?: number;
  threshold?: number;
  threshold_direction?: 'ABOVE' | 'BELOW';
  rate_of_change?: number;
  rate_threshold?: number;
  quality: string;
  description: string;
  scope: AnomalyScope;
}

export interface AnomalyRecord {
  id: string;
  asset_id: string;
  sensor_id: string | null;
  metric_code: string | null;
  anomaly_type: AnomalyType;
  anomaly_scope: AnomalyScope;
  severity: AnomalySeverity;
  evidence_json: AnomalyEvidence;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  sample_count: number | null;
  quality: string | null;
  is_active: boolean;
  resolved_at: string | null;
  resolution_reason: string | null;
  created_at: string;
}

export interface AssetContextSnapshot {
  criticality: string;
  condition: string;
  lifecycle_status: string;
  failure_count_90d: number;
  repeat_failure_detected: boolean;
  ppm_compliant: boolean | null;
  asset_age_years: number | null;
  expected_life_years: number | null;
  days_since_last_ppm: number | null;
}

export interface ReliabilitySignal {
  id: string;
  asset_id: string;
  signal_type: ReliabilitySignalType;
  severity: SignalSeverity;
  title: string;
  description: string;
  asset_context_snapshot: AssetContextSnapshot;
  evidence_snapshot: Record<string, unknown>;
  anomaly_id: string | null;
  policy_version: string;
  is_active: boolean;
  generated_at: string;
  resolved_at: string | null;
}

export interface AssetReliabilityProfile {
  asset_id: string;
  asset_reference: string;
  asset_name: string;
  criticality: string;
  condition: string;
  lifecycle_status: string;
  known_failure_count: number;
  repeat_failure_detected: boolean;
  repeat_failure_window_days: number;
  telemetry_source_count: number;
  active_sensor_count: number;
  live_source_count: number;
  observations_last_24h: number;
  active_anomaly_count: number;
  active_asset_anomaly_count: number;
  active_sensor_anomaly_count: number;
  highest_anomaly_severity: AnomalySeverity | null;
  active_signal_count: number;
  highest_signal_severity: SignalSeverity | null;
  days_since_last_ppm: number | null;
  asset_age_years: number | null;
  expected_life_years: number | null;
  life_elapsed_pct: number | null;
  profile_generated_at: string;
  data_status: 'ACTIVE' | 'PARTIAL' | 'NO_TELEMETRY' | 'NO_DATA';
}
