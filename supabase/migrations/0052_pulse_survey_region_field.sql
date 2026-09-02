-- ============================================================
-- MIGRATION 0052: PULSE SURVEY REGION FIELD
-- ============================================================
-- Adds optional 'region' column to lobby_annual_survey_responses
-- so future survey responses collect structured UK geographic region
-- for cross-tabulated reporting (e.g. salary x region, day-rate x region).
--
-- Existing responses remain NULL and are never backfilled or estimated.
-- ============================================================

BEGIN;

ALTER TABLE public.lobby_annual_survey_responses
  ADD COLUMN IF NOT EXISTS region TEXT;

CREATE INDEX IF NOT EXISTS idx_lobby_survey_year_region
  ON public.lobby_annual_survey_responses(year, region)
  WHERE region IS NOT NULL;

INSERT INTO public._schema_migrations (version, applied_at)
VALUES ('0052_pulse_survey_region_field', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;
