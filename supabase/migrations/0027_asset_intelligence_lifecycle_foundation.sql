/**
 * ENTIREFM UNIFIED OPERATIONS PLATFORM
 * MIGRATION 0027 — ASSET INTELLIGENCE & LIFECYCLE FOUNDATION (Phase 0K)
 * =======================================================================
 * Transforms the Asset Register into an Asset Intelligence platform.
 *
 * Extends public.assets with lifecycle, provenance, and replacement fields.
 * Adds:
 *   - asset_condition_assessments  (evidence-backed condition records)
 *   - asset_failure_events         (first-class failure taxonomy)
 *   - asset_intelligence_signals   (deterministic attention signals)
 *   - asset_replacement_reviews    (repair/replace decision support)
 *   - asset_telemetry_sources      (IoT/BMS foundation — no live data)
 *   - repeat_failure_policies      (configurable repeat-failure windows)
 *
 * Truth semantics:
 *   - condition default changed to 'UNKNOWN' (previously 'GOOD')
 *   - expected_life_source defaults to 'NOT_CONFIGURED'
 *   - No fake data, no health scores, no unsupported predictive claims
 */

-- ============================================================================
-- 1. EXTEND public.assets
-- ============================================================================

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS commission_date                date,
  ADD COLUMN IF NOT EXISTS expected_life_source           text NOT NULL DEFAULT 'NOT_CONFIGURED',
  -- MANUFACTURER | CLIENT_STANDARD | ENTIREFM_POLICY | ASSET_DATABASE | ENGINEER_ASSESSMENT | HISTORICAL_ANALYSIS | NOT_CONFIGURED
  ADD COLUMN IF NOT EXISTS expected_life_source_date      date,
  ADD COLUMN IF NOT EXISTS expected_life_confidence       text NOT NULL DEFAULT 'UNKNOWN',
  -- HIGH | MEDIUM | LOW | UNKNOWN
  ADD COLUMN IF NOT EXISTS condition_source               text NOT NULL DEFAULT 'NOT_ASSESSED',
  -- ENGINEER_ASSESSMENT | AI_ASSISTED | IMPORT | NOT_ASSESSED
  ADD COLUMN IF NOT EXISTS condition_assessed_at          timestamptz,
  ADD COLUMN IF NOT EXISTS condition_assessed_by          uuid REFERENCES public.persons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS condition_confidence           text NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN IF NOT EXISTS lifecycle_status               text NOT NULL DEFAULT 'ACTIVE',
  -- ACTIVE | OUT_OF_SERVICE | DECOMMISSIONED | REPLACED | DISPOSED
  ADD COLUMN IF NOT EXISTS replacement_cost_estimate_gbp  numeric(12,2),
  ADD COLUMN IF NOT EXISTS replacement_cost_source        text,
  -- APPROVED_QUOTE | SUPPLIER_QUOTE | CLIENT_BUDGET | RATE_DATABASE | MANUAL_ESTIMATE | HISTORICAL_SIMILAR
  ADD COLUMN IF NOT EXISTS replacement_cost_source_date   date,
  ADD COLUMN IF NOT EXISTS replacement_cost_confidence    text NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN IF NOT EXISTS successor_asset_id             uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS predecessor_asset_id           uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS parts_status                   text NOT NULL DEFAULT 'UNKNOWN',
  -- SUPPORTED | LIMITED | OBSOLETE | UNKNOWN
  ADD COLUMN IF NOT EXISTS manufacturer_support_status    text NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN IF NOT EXISTS obsolescence_status            text NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN IF NOT EXISTS energy_source                  text,
  -- GAS | ELECTRIC | OIL | DUAL | UNKNOWN
  ADD COLUMN IF NOT EXISTS rated_power_kw                 numeric(8,2),
  ADD COLUMN IF NOT EXISTS meter_id                       text;

-- Change condition default to UNKNOWN for new assets without an assessment source
-- Existing rows are NOT updated — they may have been manually assessed
ALTER TABLE public.assets ALTER COLUMN condition SET DEFAULT 'UNKNOWN';

-- ============================================================================
-- 2. ASSET CONDITION ASSESSMENTS
--    Structured, evidence-backed condition records. Each change is recorded.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_condition_assessments (
  id                          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id                    uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  assessed_by                 uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  assessed_at                 timestamptz NOT NULL DEFAULT now(),
  condition                   text        NOT NULL,
  -- EXCELLENT | GOOD | FAIR | POOR | CRITICAL | UNKNOWN
  previous_condition          text,
  operational_status          text        NOT NULL DEFAULT 'OPERATIONAL',
  -- OPERATIONAL | DEGRADED | NON_OPERATIONAL
  observed_defects            text[],
  -- controlled list: BEARING_NOISE, BELT_WEAR, CORROSION, LEAK, VIBRATION, ELECTRICAL_FAULT, etc.
  observed_notes              text,
  recommended_action          text,
  next_review_date            date,
  confidence                  text        NOT NULL DEFAULT 'MEDIUM',
  -- HIGH | MEDIUM | LOW
  source                      text        NOT NULL DEFAULT 'ENGINEER_ASSESSMENT',
  -- ENGINEER_ASSESSMENT | AI_ASSISTED | IMPORT | NOT_ASSESSED
  ai_assisted                 boolean     NOT NULL DEFAULT false,
  ai_extracted_observations   jsonb,
  -- { bearings: 'noisy', belts: 'worn', casing: 'corroded', suggested_condition: 'POOR', confidence: 0.91 }
  photos_stored               boolean     NOT NULL DEFAULT false,
  created_at                  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. ASSET FAILURE EVENTS
--    First-class failure records linked to work/defect evidence.
--    Does NOT equate every reactive WO with a failure.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_failure_events (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id                uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  work_order_id           uuid        REFERENCES public.work_orders(id) ON DELETE SET NULL,
  defect_id               uuid,
  -- FK to defects table if present; nullable
  visit_id                uuid,
  -- FK to visits table if present; nullable
  failure_category        text        NOT NULL,
  -- FUNCTIONAL_FAILURE | PARTIAL_FAILURE | PERFORMANCE_DEGRADATION | SAFETY_FAILURE
  -- CONTROLS_FAILURE | LEAK | ELECTRICAL_FAILURE | MECHANICAL_FAILURE | OTHER
  failure_description     text,
  cause                   text,
  resolution              text,
  parts_used              text[],
  direct_cost_gbp         numeric(10,2),
  downtime_minutes        integer,
  -- NULL means UNKNOWN, not zero
  downtime_business_impact text,
  -- NONE | LOW | MEDIUM | HIGH | CRITICAL
  failed_at               timestamptz,
  resolved_at             timestamptz,
  created_by              uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. ASSET INTELLIGENCE SIGNALS
--    Deterministic attention signals. AI does not set severity.
--    Policy version stored for auditability.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_intelligence_signals (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  signal_type         text        NOT NULL,
  -- REPEAT_FAILURE | HIGH_REACTIVE_COST | AGE_APPROACHING_EXPECTED_LIFE
  -- AGE_EXCEEDS_EXPECTED_LIFE | CONDITION_POOR | CONDITION_CRITICAL
  -- REPAIR_COST_THRESHOLD | WARRANTY_EXPIRING | HIGH_DOWNTIME
  -- PPM_FAILURE_TREND | OBSOLESCENCE_REVIEW_REQUIRED | DATA_INCOMPLETE
  severity            text        NOT NULL DEFAULT 'INFO',
  -- INFO | WARNING | HIGH | CRITICAL
  title               text        NOT NULL,
  description         text        NOT NULL,
  evidence_snapshot   jsonb       NOT NULL DEFAULT '{}'::jsonb,
  policy_version      text        NOT NULL DEFAULT '1.0',
  is_active           boolean     NOT NULL DEFAULT true,
  generated_at        timestamptz NOT NULL DEFAULT now(),
  resolved_at         timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. ASSET REPLACEMENT REVIEWS
--    Human-led repair/replace decision support. No AUTO_REPLACE.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_replacement_reviews (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  opened_at           timestamptz NOT NULL DEFAULT now(),
  opened_by           uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  trigger_signal_id   uuid        REFERENCES public.asset_intelligence_signals(id) ON DELETE SET NULL,
  status              text        NOT NULL DEFAULT 'OPEN',
  -- OPEN | ASSESSMENT_REQUIRED | QUOTE_REQUIRED | CLIENT_REVIEW
  -- APPROVED | DEFERRED | REJECTED | COMPLETED | CANCELLED
  evidence_snapshot   jsonb       NOT NULL DEFAULT '{}'::jsonb,
  -- age_years, expected_life_years, condition, criticality,
  -- reactive_cost_gbp, period_label, repeat_failure_count,
  -- downtime_minutes, repair_estimate_gbp, replacement_estimate_gbp
  ai_rationale        text,
  -- AI explains deterministic evidence; human decides
  reviewed_by         uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  decision            text,
  -- REPLACE | DEFER | REJECT
  decision_at         timestamptz,
  decision_notes      text,
  closed_at           timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. ASSET TELEMETRY SOURCES
--    Foundation for future IoT/BMS integration. No live telemetry in Phase 0K.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_telemetry_sources (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  source_type         text        NOT NULL DEFAULT 'UNCONFIGURED',
  -- BMS | IOT_SENSOR | METER | GATEWAY | UNCONFIGURED
  source_identifier   text,
  metric_name         text,
  unit                text,
  last_seen_at        timestamptz,
  status              text        NOT NULL DEFAULT 'UNCONFIGURED',
  -- ACTIVE | INACTIVE | UNCONFIGURED
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 7. REPEAT FAILURE POLICIES
--    Configurable windows. Not hardcoded globally.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.repeat_failure_policies (
  id                    uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  text    NOT NULL,
  window_days           integer NOT NULL DEFAULT 90,
  min_occurrences       integer NOT NULL DEFAULT 3,
  category_match_mode   text    NOT NULL DEFAULT 'EXACT',
  -- EXACT | RELATED
  is_default            boolean NOT NULL DEFAULT false,
  version               text    NOT NULL DEFAULT '1.0',
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- Seed the default policy
INSERT INTO public.repeat_failure_policies (name, window_days, min_occurrences, category_match_mode, is_default, version)
VALUES ('Default 90-day Repeat Failure Policy', 90, 3, 'EXACT', true, '1.0')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. INDEXES
-- ============================================================================

-- Asset-level intelligence indexes
CREATE INDEX IF NOT EXISTS idx_assets_lifecycle_status   ON public.assets(lifecycle_status);
CREATE INDEX IF NOT EXISTS idx_assets_condition          ON public.assets(condition);
CREATE INDEX IF NOT EXISTS idx_assets_criticality        ON public.assets(criticality);
CREATE INDEX IF NOT EXISTS idx_assets_manufacturer       ON public.assets(manufacturer);
CREATE INDEX IF NOT EXISTS idx_assets_installation_date  ON public.assets(installation_date);
CREATE INDEX IF NOT EXISTS idx_assets_successor          ON public.assets(successor_asset_id) WHERE successor_asset_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_assets_predecessor        ON public.assets(predecessor_asset_id) WHERE predecessor_asset_id IS NOT NULL;

-- Failure events
CREATE INDEX IF NOT EXISTS idx_asset_failure_events_asset_id    ON public.asset_failure_events(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_failure_events_failed_at   ON public.asset_failure_events(failed_at);
CREATE INDEX IF NOT EXISTS idx_asset_failure_events_category    ON public.asset_failure_events(failure_category);
CREATE INDEX IF NOT EXISTS idx_asset_failure_events_work_order  ON public.asset_failure_events(work_order_id);

-- Signals
CREATE INDEX IF NOT EXISTS idx_asset_signals_asset_id   ON public.asset_intelligence_signals(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_signals_type        ON public.asset_intelligence_signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_asset_signals_active      ON public.asset_intelligence_signals(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_asset_signals_severity    ON public.asset_intelligence_signals(severity);

-- Condition assessments
CREATE INDEX IF NOT EXISTS idx_asset_conditions_asset_id ON public.asset_condition_assessments(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_conditions_date     ON public.asset_condition_assessments(assessed_at);

-- Replacement reviews
CREATE INDEX IF NOT EXISTS idx_asset_reviews_asset_id   ON public.asset_replacement_reviews(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_reviews_status     ON public.asset_replacement_reviews(status);

-- Telemetry
CREATE INDEX IF NOT EXISTS idx_asset_telemetry_asset_id ON public.asset_telemetry_sources(asset_id);

-- ============================================================================
-- 9. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.asset_condition_assessments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_failure_events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_intelligence_signals   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_replacement_reviews    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_telemetry_sources      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repeat_failure_policies      ENABLE ROW LEVEL SECURITY;

-- Service role bypass (following existing pattern — application uses service role key)
DROP POLICY IF EXISTS "service_role_bypass" ON public.asset_condition_assessments;
CREATE POLICY "service_role_bypass" ON public.asset_condition_assessments
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass" ON public.asset_failure_events;
CREATE POLICY "service_role_bypass" ON public.asset_failure_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass" ON public.asset_intelligence_signals;
CREATE POLICY "service_role_bypass" ON public.asset_intelligence_signals
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass" ON public.asset_replacement_reviews;
CREATE POLICY "service_role_bypass" ON public.asset_replacement_reviews
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass" ON public.asset_telemetry_sources;
CREATE POLICY "service_role_bypass" ON public.asset_telemetry_sources
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass" ON public.repeat_failure_policies;
CREATE POLICY "service_role_bypass" ON public.repeat_failure_policies
  FOR ALL TO service_role USING (true) WITH CHECK (true);
