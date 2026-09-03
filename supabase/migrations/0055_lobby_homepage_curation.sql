-- ====================================================================
-- ENTIREFM THE LOBBY — HOMEPAGE EDITORIAL CURATION STORE
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.lobby_homepage_curation (
  id                      TEXT PRIMARY KEY DEFAULT 'current',
  lead_story_slug         TEXT NOT NULL,
  compliance_watch_slug   TEXT NOT NULL,
  engineers_note_slug     TEXT NOT NULL,
  useful_thing_slug       TEXT NOT NULL,
  from_the_field_slug     TEXT NOT NULL,
  ask_entirefm_slug       TEXT NOT NULL,
  worth_attending_slug    TEXT NOT NULL,
  featured_toolkit_urls   JSONB NOT NULL DEFAULT '[]',
  active_question_id      TEXT,
  active_pulse_id         TEXT,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by              TEXT
);

-- Seed initial current curation row if not present
INSERT INTO public.lobby_homepage_curation (
  id,
  lead_story_slug,
  compliance_watch_slug,
  engineers_note_slug,
  useful_thing_slug,
  from_the_field_slug,
  ask_entirefm_slug,
  worth_attending_slug,
  featured_toolkit_urls,
  active_question_id,
  active_pulse_id,
  updated_at,
  updated_by
) VALUES (
  'current',
  'building-safety-act-what-fm-teams-need-to-know-now',
  'mandatory-digital-occurrence-reporting-duty-holder-rules',
  'condenser-airflow-starvation-on-enclosed-rooftops',
  'fm-mobilisation-handover-audit-matrix',
  'rooftop-condenser-vibration-resonance-defect',
  'mobilisation-handover-what-compliance-data-to-demand',
  'building-decarbonisation-hard-fm-summit-2026',
  '["/tools/ppm-schedule-builder","/tools/compliance-checker","/tools/tender-brief"]'::jsonb,
  'lq-2026-w35',
  'pulse-2026-08',
  now(),
  'system-seed'
) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.lobby_homepage_curation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_lobby_homepage_curation" ON public.lobby_homepage_curation;
CREATE POLICY "service_role_lobby_homepage_curation"
  ON public.lobby_homepage_curation FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
