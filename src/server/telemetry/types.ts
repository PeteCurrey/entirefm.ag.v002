/**
 * ENTIREFM TELEMETRY — TYPE DEFINITIONS (Phase 0L)
 * =================================================
 * Canonical types for telemetry ingestion, quality, unit normalisation,
 * sensor health, and connector state.
 */

export type ObservationQuality =
  | 'VALID'
  | 'SUSPECT'
  | 'INVALID'
  | 'STALE'
  | 'MISSING'
  | 'OUT_OF_RANGE'
  | 'SOURCE_ERROR';

export type QualityEventType =
  | 'INVALID'
  | 'STALE'
  | 'OUT_OF_RANGE'
  | 'SOURCE_ERROR'
  | 'DUPLICATE'
  | 'FUTURE_TIMESTAMP'
  | 'IMPOSSIBLE_VALUE'
  | 'MISSING_IDENTITY'
  | 'UNIT_INCOMPATIBLE';

export type ConnectorState =
  | 'LIVE'
  | 'TEST'
  | 'INTERFACE_ONLY'
  | 'NOT_CONFIGURED'
  | 'DEGRADED'
  | 'FAILED'
  | 'DISABLED';

export type SensorStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'UNCONFIGURED'
  | 'OFFLINE'
  | 'DISABLED';

export type SensorHealthSignalType =
  | 'SENSOR_OFFLINE'
  | 'SENSOR_FLATLINE'
  | 'SENSOR_OUT_OF_RANGE'
  | 'SENSOR_NOISY'
  | 'SENSOR_CLOCK_DRIFT'
  | 'SENSOR_STALE';

export type AggregateWindowType =
  | 'HOURLY'
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY';

export type RetentionClassName =
  | 'RAW_HIGH_FREQUENCY'
  | 'RAW_STANDARD'
  | 'HOURLY_AGGREGATE'
  | 'DAILY_AGGREGATE'
  | 'LONG_TERM_FEATURE';

export type BaselineStatus =
  | 'ACTIVE'
  | 'INSUFFICIENT_DATA'
  | 'STALE'
  | 'COMPUTING'
  | 'FAILED';

export type MetricCode =
  | 'TEMPERATURE'
  | 'SUPPLY_TEMPERATURE'
  | 'RETURN_TEMPERATURE'
  | 'PRESSURE'
  | 'DIFFERENTIAL_PRESSURE'
  | 'FLOW_RATE'
  | 'VIBRATION_RMS'
  | 'CURRENT'
  | 'VOLTAGE'
  | 'POWER'
  | 'ENERGY'
  | 'HUMIDITY'
  | 'CO2'
  | 'FAN_SPEED'
  | 'VALVE_POSITION'
  | 'COMPRESSOR_RUN_STATE'
  | 'RUNTIME_HOURS'
  | 'START_COUNT'
  | 'FAULT_CODE'
  | 'TEMPERATURE_DELTA'
  | string;

export interface MetricDefinition {
  code: MetricCode;
  canonical_unit: string;
  valid_min: number | null;
  valid_max: number | null;
  asset_classes: string[] | null;
  description: string;
  quality_rules: Array<{ rule: string; value: number }>;
  source_mapping: Record<string, string[]>;
  is_active: boolean;
}

export interface UnitConversion {
  from_unit: string;
  to_unit: string;
  formula: string;
  convert: (value: number) => number;
}

export interface TelemetrySource {
  id: string;
  asset_id: string;
  source_type: string;
  source_identifier: string | null;
  connector_state: ConnectorState;
  protocol: string | null;
  last_connected_at: string | null;
  last_error: string | null;
  last_error_at: string | null;
  expected_reporting_interval_seconds: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TelemetrySensor {
  id: string;
  source_id: string;
  asset_id: string;
  metric_code: MetricCode;
  sensor_reference: string | null;
  display_name: string | null;
  expected_reporting_interval_seconds: number;
  status: SensorStatus;
  last_observation_at: string | null;
  last_known_quality: ObservationQuality | null;
  created_at: string;
  updated_at: string;
}

export interface TelemetryObservation {
  id: string;
  idempotency_key: string;
  asset_id: string;
  source_id: string;
  sensor_id: string | null;
  metric_code: MetricCode;
  raw_value: number | null;
  raw_unit: string | null;
  raw_string_value: string | null;
  normalised_value: number | null;
  canonical_unit: string | null;
  quality: ObservationQuality;
  quality_reason: string | null;
  observed_at: string;
  received_at: string;
  source_system: string | null;
  source_message_id: string | null;
}

export interface IngestionPayload {
  source_id: string;
  sensor_id?: string;
  sensor_reference?: string;
  asset_id: string;
  metric_code: MetricCode;
  value: number | string;
  unit: string;
  observed_at: string;
  source_system?: string;
  source_message_id?: string;
}

export interface IngestionResult {
  accepted: boolean;
  idempotency_key: string;
  duplicate: boolean;
  observation_id?: string;
  quality: ObservationQuality;
  normalised_value?: number;
  canonical_unit?: string;
  rejection_reason?: string;
}

export interface BatchIngestionResult {
  total: number;
  accepted: number;
  duplicate: number;
  rejected: number;
  results: IngestionResult[];
}

export interface TelemetryAggregate {
  id: string;
  asset_id: string;
  sensor_id: string | null;
  metric_code: MetricCode;
  window_type: AggregateWindowType;
  window_start: string;
  window_end: string;
  sample_count: number;
  valid_sample_count: number;
  agg_min: number | null;
  agg_max: number | null;
  agg_mean: number | null;
  agg_median: number | null;
  agg_stddev: number | null;
  agg_p95: number | null;
  computed_at: string;
}

export interface SensorHealthSignal {
  sensor_id: string;
  asset_id: string;
  source_id: string;
  signal_type: SensorHealthSignalType;
  scope: 'SENSOR';
  description: string;
  evidence: Record<string, unknown>;
  detected_at: string;
}

export interface ObservationValidationResult {
  valid: boolean;
  quality: ObservationQuality;
  reason?: string;
  normalised_value?: number;
  canonical_unit?: string;
  idempotency_key: string;
}
