/**
 * ENTIREFM UNIFIED OPERATIONS PLATFORM
 * MIGRATION 0029 — TELEMETRY, RELIABILITY INTELLIGENCE & PREDICTIVE FOUNDATION (Phase 0L)
 * ========================================================================================
 */

-- ============================================================================
-- 1. EXTEND asset_telemetry_sources WITH CANONICAL CONNECTOR STATE
-- ============================================================================

ALTER TABLE public.asset_telemetry_sources
  ADD COLUMN IF NOT EXISTS connector_state       text NOT NULL DEFAULT 'NOT_CONFIGURED',
  ADD COLUMN IF NOT EXISTS protocol              text,
  ADD COLUMN IF NOT EXISTS last_connected_at     timestamptz,
  ADD COLUMN IF NOT EXISTS last_error            text,
  ADD COLUMN IF NOT EXISTS last_error_at         timestamptz,
  ADD COLUMN IF NOT EXISTS expected_reporting_interval_seconds integer,
  ADD COLUMN IF NOT EXISTS config_fingerprint    text;

-- ============================================================================
-- 2. CANONICAL TELEMETRY METRIC REGISTRY
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.telemetry_metrics (
  code                text        PRIMARY KEY,
  canonical_unit      text        NOT NULL,
  valid_min           numeric,
  valid_max           numeric,
  asset_classes       text[],
  description         text,
  quality_rules       jsonb       NOT NULL DEFAULT '[]'::jsonb,
  source_mapping      jsonb       NOT NULL DEFAULT '{}'::jsonb,
  is_active           boolean     NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.telemetry_metrics (code, canonical_unit, valid_min, valid_max, description) VALUES
  ('TEMPERATURE',           '°C',   -50,  150,  'General temperature'),
  ('SUPPLY_TEMPERATURE',    '°C',   -20,  100,  'Supply air or water temperature'),
  ('RETURN_TEMPERATURE',    '°C',   -20,  100,  'Return air or water temperature'),
  ('PRESSURE',              'kPa',    0, 2000,  'General pressure'),
  ('DIFFERENTIAL_PRESSURE', 'kPa',    0,  500,  'Differential pressure across component'),
  ('FLOW_RATE',             'm³/h',   0, 9999,  'Volumetric flow rate'),
  ('VIBRATION_RMS',         'mm/s',   0,  200,  'Root mean square vibration velocity'),
  ('CURRENT',               'A',      0, 1000,  'Electrical current draw'),
  ('VOLTAGE',               'V',      0,  500,  'Supply voltage'),
  ('POWER',                 'W',      0, 500000,'Electrical power consumption'),
  ('ENERGY',                'kWh',    0, NULL,  'Cumulative energy consumption'),
  ('HUMIDITY',              '%',      0,  100,  'Relative humidity'),
  ('CO2',                   'ppm',    0, 5000,  'Carbon dioxide concentration'),
  ('FAN_SPEED',             'RPM',    0, 9999,  'Fan rotational speed'),
  ('VALVE_POSITION',        '%',      0,  100,  'Valve open position 0=closed 100=open'),
  ('COMPRESSOR_RUN_STATE',  'bool',   0,    1,  'Compressor running state 0=off 1=on'),
  ('RUNTIME_HOURS',         'h',      0, NULL,  'Cumulative runtime hours'),
  ('START_COUNT',           'count',  0, NULL,  'Cumulative start/stop cycle count'),
  ('FAULT_CODE',            'code',   NULL, NULL,'Manufacturer fault/alarm code'),
  ('TEMPERATURE_DELTA',     '°C',  -100,  100,  'Computed temperature differential')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 3. TELEMETRY SENSORS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.telemetry_sensors (
  id                              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id                       uuid        NOT NULL REFERENCES public.asset_telemetry_sources(id) ON DELETE CASCADE,
  asset_id                        uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  metric_code                     text        NOT NULL REFERENCES public.telemetry_metrics(code) ON DELETE RESTRICT,
  sensor_reference                text,
  display_name                    text,
  expected_reporting_interval_seconds integer DEFAULT 60,
  status                          text        NOT NULL DEFAULT 'UNCONFIGURED',
  last_observation_at             timestamptz,
  last_known_quality              text,
  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_id, sensor_reference)
);

-- ============================================================================
-- 4. TELEMETRY OBSERVATIONS (idempotent)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.telemetry_observations (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key     text        NOT NULL,
  asset_id            uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  source_id           uuid        NOT NULL REFERENCES public.asset_telemetry_sources(id) ON DELETE CASCADE,
  sensor_id           uuid        REFERENCES public.telemetry_sensors(id) ON DELETE SET NULL,
  metric_code         text        NOT NULL REFERENCES public.telemetry_metrics(code) ON DELETE RESTRICT,
  raw_value           numeric,
  raw_unit            text,
  raw_string_value    text,
  normalised_value    numeric,
  canonical_unit      text,
  quality             text        NOT NULL DEFAULT 'VALID',
  quality_reason      text,
  observed_at         timestamptz NOT NULL,
  received_at         timestamptz NOT NULL DEFAULT now(),
  source_system       text,
  source_message_id   text,
  UNIQUE (idempotency_key)
);

-- ============================================================================
-- 5. TELEMETRY QUALITY EVENTS (quarantine log)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.telemetry_quality_events (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            uuid        REFERENCES public.assets(id) ON DELETE CASCADE,
  source_id           uuid        REFERENCES public.asset_telemetry_sources(id) ON DELETE CASCADE,
  sensor_id           uuid        REFERENCES public.telemetry_sensors(id) ON DELETE SET NULL,
  metric_code         text,
  raw_payload         jsonb,
  quality_state       text        NOT NULL,
  rejection_reason    text,
  idempotency_key     text,
  observed_at         timestamptz,
  received_at         timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. TELEMETRY AGGREGATES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.telemetry_aggregates (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  sensor_id           uuid        REFERENCES public.telemetry_sensors(id) ON DELETE SET NULL,
  metric_code         text        NOT NULL REFERENCES public.telemetry_metrics(code) ON DELETE RESTRICT,
  window_type         text        NOT NULL,
  window_start        timestamptz NOT NULL,
  window_end          timestamptz NOT NULL,
  sample_count        integer     NOT NULL DEFAULT 0,
  valid_sample_count  integer     NOT NULL DEFAULT 0,
  agg_min             numeric,
  agg_max             numeric,
  agg_mean            numeric,
  agg_median          numeric,
  agg_stddev          numeric,
  agg_p95             numeric,
  computed_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (asset_id, metric_code, window_type, window_start)
);

-- ============================================================================
-- 7. TELEMETRY RETENTION CLASSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.telemetry_retention_classes (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  class_name          text        NOT NULL UNIQUE,
  retention_days      integer     NOT NULL,
  description         text,
  is_active           boolean     NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.telemetry_retention_classes (class_name, retention_days, description) VALUES
  ('RAW_HIGH_FREQUENCY', 30,   'Raw observations at sub-minute frequency — 30 days'),
  ('RAW_STANDARD',       180,  'Raw observations at standard intervals — 180 days'),
  ('HOURLY_AGGREGATE',   730,  'Hourly aggregates — 2 years'),
  ('DAILY_AGGREGATE',    1825, 'Daily aggregates — 5 years'),
  ('LONG_TERM_FEATURE',  3650, 'Computed features for model training — 10 years')
ON CONFLICT (class_name) DO NOTHING;

-- ============================================================================
-- 8. ASSET TELEMETRY BASELINES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_telemetry_baselines (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id                uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  metric_code             text        NOT NULL REFERENCES public.telemetry_metrics(code) ON DELETE RESTRICT,
  baseline_mean           numeric,
  baseline_stddev         numeric,
  baseline_min            numeric,
  baseline_max            numeric,
  baseline_p5             numeric,
  baseline_p95            numeric,
  baseline_type           text        NOT NULL DEFAULT 'ROLLING_MEAN',
  sample_count            integer     NOT NULL DEFAULT 0,
  training_window_days    integer     NOT NULL,
  training_from           timestamptz,
  training_to             timestamptz,
  data_quality_coverage   numeric,
  method                  text        NOT NULL DEFAULT 'STATISTICAL',
  version                 integer     NOT NULL DEFAULT 1,
  status                  text        NOT NULL DEFAULT 'INSUFFICIENT_DATA',
  min_samples_required    integer     NOT NULL DEFAULT 168,
  created_at              timestamptz NOT NULL DEFAULT now(),
  computed_at             timestamptz,
  UNIQUE (asset_id, metric_code, baseline_type)
);

-- ============================================================================
-- 9. ASSET TELEMETRY ANOMALIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_telemetry_anomalies (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  sensor_id           uuid        REFERENCES public.telemetry_sensors(id) ON DELETE SET NULL,
  metric_code         text        REFERENCES public.telemetry_metrics(code) ON DELETE SET NULL,
  anomaly_type        text        NOT NULL,
  anomaly_scope       text        NOT NULL DEFAULT 'ASSET',
  severity            text        NOT NULL DEFAULT 'WARNING',
  evidence_json       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  started_at          timestamptz NOT NULL,
  ended_at            timestamptz,
  duration_seconds    integer,
  sample_count        integer,
  quality             text,
  is_active           boolean     NOT NULL DEFAULT true,
  resolved_at         timestamptz,
  resolution_reason   text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 10. ASSET RELIABILITY SIGNALS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_reliability_signals (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id                uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  signal_type             text        NOT NULL,
  severity                text        NOT NULL DEFAULT 'WARNING',
  title                   text        NOT NULL,
  description             text        NOT NULL,
  asset_context_snapshot  jsonb       NOT NULL DEFAULT '{}'::jsonb,
  evidence_snapshot       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  anomaly_id              uuid        REFERENCES public.asset_telemetry_anomalies(id) ON DELETE SET NULL,
  policy_version          text        NOT NULL DEFAULT '1.0',
  is_active               boolean     NOT NULL DEFAULT true,
  generated_at            timestamptz NOT NULL DEFAULT now(),
  resolved_at             timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 11. PREDICTIVE FEATURE DEFINITIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_feature_definitions (
  code                text        NOT NULL,
  version             integer     NOT NULL DEFAULT 1,
  formula             text        NOT NULL,
  unit                text,
  window_days         integer,
  source              text        NOT NULL,
  description         text,
  is_active           boolean     NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  created_by          uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  PRIMARY KEY (code, version)
);

INSERT INTO public.predictive_feature_definitions
  (code, version, formula, unit, window_days, source, description)
VALUES
  ('mean_temperature_24h',     1, 'MEAN(normalised_value) WHERE metric=TEMPERATURE AND window=24h AND quality IN (VALID,SUSPECT)', '°C', 1, 'TELEMETRY', 'Mean temperature over last 24 hours'),
  ('temperature_delta_7d',     1, 'MEAN_last_24h minus MEAN_7d_ago_24h WHERE metric=TEMPERATURE', '°C', 7, 'TELEMETRY', 'Temperature change versus 7 days ago'),
  ('vibration_rms_mean_24h',   1, 'MEAN(normalised_value) WHERE metric=VIBRATION_RMS AND window=24h AND quality=VALID', 'mm/s', 1, 'TELEMETRY', 'Mean vibration RMS over last 24 hours'),
  ('vibration_rms_slope_7d',   1, 'LINEAR_SLOPE(DAILY_MEAN(vibration_rms)) OVER 7d', 'mm/s/day', 7, 'TELEMETRY', 'Linear trend of vibration RMS over 7 days'),
  ('starts_24h',               1, 'COUNT(START_COUNT transitions 0 to 1) WHERE window=24h', 'count', 1, 'TELEMETRY', 'Number of start cycles in last 24 hours'),
  ('runtime_hours_7d',         1, 'SUM(COMPRESSOR_RUN_STATE=1 seconds / 3600) WHERE window=7d', 'h', 7, 'TELEMETRY', 'Cumulative runtime hours over 7 days'),
  ('energy_per_runtime_hour',  1, 'SUM(ENERGY_kWh_24h) / MAX(runtime_hours_7d / 7)', 'kWh/h', 7, 'TELEMETRY', 'Energy consumption per hour of runtime'),
  ('failure_count_90d',        1, 'COUNT(asset_failure_events) WHERE asset_id=X AND failed_at >= NOW()-90d', 'count', 90, 'FAILURE_EVENTS', 'Number of failure events in last 90 days'),
  ('condition_state',          1, 'assets.condition WHERE asset_id=X', 'enum', NULL, 'ASSET_REGISTER', 'Current condition assessment'),
  ('asset_age',                1, 'YEARS_BETWEEN(commission_date OR installation_date, NOW())', 'years', NULL, 'ASSET_REGISTER', 'Asset age in years'),
  ('days_since_last_ppm',      1, 'DAYS_BETWEEN(MAX(ppm_visits.completed_at), NOW()) WHERE asset_id=X', 'days', NULL, 'PPM', 'Days since last completed PPM visit')
ON CONFLICT (code, version) DO NOTHING;

-- ============================================================================
-- 12. PREDICTIVE TRAINING DATASETS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_training_datasets (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    text        NOT NULL,
  version                 integer     NOT NULL DEFAULT 1,
  description             text,
  asset_population        jsonb       NOT NULL DEFAULT '{}'::jsonb,
  metric_population       text[],
  date_range_from         timestamptz NOT NULL,
  date_range_to           timestamptz NOT NULL,
  feature_set_version     integer     NOT NULL DEFAULT 1,
  failure_label_source    text        NOT NULL DEFAULT 'ASSET_FAILURE_EVENTS',
  excluded_observations   jsonb       NOT NULL DEFAULT '[]'::jsonb,
  quality_filters         jsonb       NOT NULL DEFAULT '{}'::jsonb,
  total_assets            integer,
  total_observations      integer,
  failure_event_count     integer,
  non_failure_count       integer,
  class_imbalance_ratio   numeric,
  created_at              timestamptz NOT NULL DEFAULT now(),
  created_by              uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  notes                   text
);

-- ============================================================================
-- 13. PREDICTIVE MODELS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_models (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text        NOT NULL,
  asset_class         text,
  target              text        NOT NULL,
  algorithm           text,
  description         text,
  owner               uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  is_active           boolean     NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 14. PREDICTIVE MODEL VERSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_model_versions (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id                uuid        NOT NULL REFERENCES public.predictive_models(id) ON DELETE CASCADE,
  version                 integer     NOT NULL,
  status                  text        NOT NULL DEFAULT 'DRAFT',
  training_dataset_id     uuid        REFERENCES public.predictive_training_datasets(id) ON DELETE SET NULL,
  feature_set_version     integer     NOT NULL DEFAULT 1,
  validation_window_days  integer,
  validation_metrics      jsonb,
  class_imbalance_report  jsonb,
  trained_at              timestamptz,
  shadow_started_at       timestamptz,
  assist_started_at       timestamptz,
  prediction_count        integer     NOT NULL DEFAULT 0,
  true_positive_count     integer     NOT NULL DEFAULT 0,
  false_positive_count    integer     NOT NULL DEFAULT 0,
  true_negative_count     integer     NOT NULL DEFAULT 0,
  false_negative_count    integer     NOT NULL DEFAULT 0,
  notes                   text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  UNIQUE (model_id, version)
);

-- ============================================================================
-- 15. PREDICTIVE MODEL APPROVALS (audit)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_model_approvals (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  model_version_id        uuid        NOT NULL REFERENCES public.predictive_model_versions(id) ON DELETE CASCADE,
  from_state              text        NOT NULL,
  to_state                text        NOT NULL,
  decision                text        NOT NULL,
  reviewer_id             uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  reviewer_name           text,
  validation_evidence_ref text,
  notes                   text,
  decided_at              timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 16. PREDICTIVE PREDICTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_predictions (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  model_version_id        uuid        NOT NULL REFERENCES public.predictive_model_versions(id) ON DELETE CASCADE,
  asset_id                uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  prediction_at           timestamptz NOT NULL DEFAULT now(),
  prediction_window_days  integer     NOT NULL,
  risk_level              text        NOT NULL,
  risk_score              numeric,
  feature_snapshot        jsonb       NOT NULL DEFAULT '{}'::jsonb,
  data_quality            text        NOT NULL DEFAULT 'VALID',
  data_freshness_hours    integer,
  model_status_at_time    text        NOT NULL DEFAULT 'SHADOW',
  created_at              timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 17. PREDICTIVE PREDICTION OUTCOMES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_prediction_outcomes (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id           uuid        NOT NULL REFERENCES public.predictive_predictions(id) ON DELETE CASCADE,
  asset_id                uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  actual_outcome          text,
  outcome_at              timestamptz,
  failure_event_id        uuid        REFERENCES public.asset_failure_events(id) ON DELETE SET NULL,
  evaluation_result       text,
  confirmed_by            uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  confirmed_at            timestamptz NOT NULL DEFAULT now(),
  notes                   text
);

-- ============================================================================
-- 18. PREDICTIVE REVIEWS (human decision entity)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_reviews (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id           uuid        REFERENCES public.predictive_predictions(id) ON DELETE SET NULL,
  asset_id                uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  reliability_signal_id   uuid        REFERENCES public.asset_reliability_signals(id) ON DELETE SET NULL,
  opened_at               timestamptz NOT NULL DEFAULT now(),
  opened_by               uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  status                  text        NOT NULL DEFAULT 'OPEN',
  recommended_action      text        NOT NULL,
  evidence_snapshot       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  decision                text,
  decided_by              uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  decision_at             timestamptz,
  decision_notes          text,
  resulting_work_order_id uuid,
  closed_at               timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 19. MODEL DRIFT EVENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_model_drift_events (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  model_version_id    uuid        NOT NULL REFERENCES public.predictive_model_versions(id) ON DELETE CASCADE,
  drift_type          text        NOT NULL,
  severity            text        NOT NULL DEFAULT 'WARNING',
  evidence_json       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  triggered_review    boolean     NOT NULL DEFAULT true,
  detected_at         timestamptz NOT NULL DEFAULT now(),
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 20. INDEXES
-- ============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_telemetry_obs_idempotency
  ON public.telemetry_observations (idempotency_key);

CREATE INDEX IF NOT EXISTS idx_telemetry_obs_asset_metric_time
  ON public.telemetry_observations (asset_id, metric_code, observed_at DESC);

CREATE INDEX IF NOT EXISTS idx_telemetry_obs_source_time
  ON public.telemetry_observations (source_id, observed_at DESC);

CREATE INDEX IF NOT EXISTS idx_telemetry_obs_sensor_time
  ON public.telemetry_observations (sensor_id, observed_at DESC)
  WHERE sensor_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_telemetry_obs_quality
  ON public.telemetry_observations (quality)
  WHERE quality != 'VALID';

CREATE INDEX IF NOT EXISTS idx_telemetry_sensors_source
  ON public.telemetry_sensors (source_id);

CREATE INDEX IF NOT EXISTS idx_telemetry_sensors_asset
  ON public.telemetry_sensors (asset_id);

CREATE INDEX IF NOT EXISTS idx_telemetry_quality_source
  ON public.telemetry_quality_events (source_id, received_at DESC)
  WHERE source_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_telemetry_agg_asset_metric_window
  ON public.telemetry_aggregates (asset_id, metric_code, window_type, window_start DESC);

CREATE INDEX IF NOT EXISTS idx_baselines_asset_metric
  ON public.asset_telemetry_baselines (asset_id, metric_code);

CREATE INDEX IF NOT EXISTS idx_anomalies_asset_active
  ON public.asset_telemetry_anomalies (asset_id, is_active)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_anomalies_asset_type
  ON public.asset_telemetry_anomalies (asset_id, anomaly_type);

CREATE INDEX IF NOT EXISTS idx_anomalies_scope
  ON public.asset_telemetry_anomalies (anomaly_scope, is_active);

CREATE INDEX IF NOT EXISTS idx_reliability_signals_asset_active
  ON public.asset_reliability_signals (asset_id, is_active)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_reliability_signals_type
  ON public.asset_reliability_signals (signal_type, severity);

CREATE INDEX IF NOT EXISTS idx_predictions_asset_time
  ON public.predictive_predictions (asset_id, prediction_at DESC);

CREATE INDEX IF NOT EXISTS idx_predictions_model_version
  ON public.predictive_predictions (model_version_id, prediction_at DESC);

CREATE INDEX IF NOT EXISTS idx_predictive_reviews_asset
  ON public.predictive_reviews (asset_id, status);

CREATE INDEX IF NOT EXISTS idx_predictive_reviews_open
  ON public.predictive_reviews (status, opened_at DESC)
  WHERE status = 'OPEN';

-- ============================================================================
-- 21. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.telemetry_metrics               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_sensors               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_observations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_quality_events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_aggregates            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_retention_classes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_telemetry_baselines       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_telemetry_anomalies       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_reliability_signals       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_feature_definitions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_training_datasets    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_models               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_model_versions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_model_approvals      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_predictions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_prediction_outcomes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_reviews              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_model_drift_events   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_bypass" ON public.telemetry_metrics               FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.telemetry_sensors               FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.telemetry_observations          FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.telemetry_quality_events        FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.telemetry_aggregates            FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.telemetry_retention_classes     FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.asset_telemetry_baselines       FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.asset_telemetry_anomalies       FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.asset_reliability_signals       FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.predictive_feature_definitions  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.predictive_training_datasets    FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.predictive_models               FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.predictive_model_versions       FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.predictive_model_approvals      FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.predictive_predictions          FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.predictive_prediction_outcomes  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.predictive_reviews              FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_bypass" ON public.predictive_model_drift_events   FOR ALL TO service_role USING (true) WITH CHECK (true);
