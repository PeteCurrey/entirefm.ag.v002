-- ============================================================
-- MIGRATION 0048: LOBBY SIX GROWTH & OPERATIONAL DIFFERENTIATOR FEATURES
-- ============================================================
-- 1. Jobs Board: listings, applications, saved jobs
-- 2. Training & CPD: activity logging & member total hours
-- 3. Who Won What Performance: contractor opt-in toggle on organisations
-- 4. Real-world Event Presence: event RSVPs & attendee networking
-- 5. Annual Benchmarking: survey responses & aggregation table
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. ORGANISATIONS & MEMBERS EXTENSIONS
-- ------------------------------------------------------------

-- Contractor performance public display opt-in (default OFF)
ALTER TABLE public.organisations 
ADD COLUMN IF NOT EXISTS public_performance_visible BOOLEAN NOT NULL DEFAULT false;

-- Member CPD hours total cached field
ALTER TABLE public.lobby_members 
ADD COLUMN IF NOT EXISTS cpd_hours_logged NUMERIC(6,2) NOT NULL DEFAULT 0.0;


-- ------------------------------------------------------------
-- 2. FM JOBS BOARD
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lobby_job_listings (
  id                              TEXT PRIMARY KEY,
  slug                            TEXT UNIQUE NOT NULL,
  title                           TEXT NOT NULL,
  employer_name                   TEXT NOT NULL,
  employer_org_id                 UUID REFERENCES public.organisations(id) ON DELETE SET NULL,
  is_entirefm_verified_employer   BOOLEAN NOT NULL DEFAULT false,
  location                        TEXT NOT NULL,
  location_type                   TEXT NOT NULL DEFAULT 'on_site' CHECK (location_type IN ('on_site', 'hybrid', 'remote', 'mobile_field')),
  salary_min                      INT,
  salary_max                      INT,
  salary_currency                 TEXT NOT NULL DEFAULT 'GBP',
  salary_period                   TEXT NOT NULL DEFAULT 'per_annum' CHECK (salary_period IN ('per_annum', 'per_day', 'per_hour')),
  seniority                       TEXT NOT NULL DEFAULT 'practitioner' CHECK (seniority IN ('apprentice', 'technician', 'practitioner', 'lead', 'manager', 'head_of', 'director')),
  discipline_tags                 TEXT[] NOT NULL DEFAULT '{}',
  sector_tags                     TEXT[] NOT NULL DEFAULT '{}',
  description                     TEXT NOT NULL,
  requirements                    TEXT[] NOT NULL DEFAULT '{}',
  benefits                        TEXT[] NOT NULL DEFAULT '{}',
  application_method              TEXT NOT NULL DEFAULT 'in_platform' CHECK (application_method IN ('in_platform', 'external_url', 'email')),
  external_apply_url              TEXT,
  contact_email                   TEXT,
  posted_by_member_id             UUID REFERENCES public.lobby_members(id) ON DELETE SET NULL,
  status                          TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'pending_moderation', 'published', 'closed', 'expired')),
  moderation_state                TEXT NOT NULL DEFAULT 'approved' CHECK (moderation_state IN ('pending', 'approved', 'rejected')),
  view_count                      INT NOT NULL DEFAULT 0,
  application_count               INT NOT NULL DEFAULT 0,
  created_at                      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                      TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at                      TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS idx_lobby_jobs_status_created ON public.lobby_job_listings(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lobby_jobs_slug ON public.lobby_job_listings(slug);
CREATE INDEX IF NOT EXISTS idx_lobby_jobs_verified ON public.lobby_job_listings(is_entirefm_verified_employer);

ALTER TABLE public.lobby_job_listings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_lobby_jobs" ON public.lobby_job_listings;
CREATE POLICY "service_role_lobby_jobs" ON public.lobby_job_listings FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Job Applications (profile-linked)
CREATE TABLE IF NOT EXISTS public.lobby_job_applications (
  id                      TEXT PRIMARY KEY,
  job_id                  TEXT NOT NULL REFERENCES public.lobby_job_listings(id) ON DELETE CASCADE,
  applicant_member_id     UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  applicant_name          TEXT NOT NULL,
  applicant_email         TEXT NOT NULL,
  applicant_headline      TEXT,
  applicant_company       TEXT,
  cover_note              TEXT NOT NULL,
  cv_url                  TEXT,
  linkedin_url            TEXT,
  status                  TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'viewed', 'shortlisted', 'declined')),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, applicant_member_id)
);

CREATE INDEX IF NOT EXISTS idx_lobby_job_apps_member ON public.lobby_job_applications(applicant_member_id);
CREATE INDEX IF NOT EXISTS idx_lobby_job_apps_job ON public.lobby_job_applications(job_id);

ALTER TABLE public.lobby_job_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_lobby_job_apps" ON public.lobby_job_applications;
CREATE POLICY "service_role_lobby_job_apps" ON public.lobby_job_applications FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Saved Jobs
CREATE TABLE IF NOT EXISTS public.lobby_saved_jobs (
  id          TEXT PRIMARY KEY,
  job_id      TEXT NOT NULL REFERENCES public.lobby_job_listings(id) ON DELETE CASCADE,
  member_id   UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_lobby_saved_jobs_member ON public.lobby_saved_jobs(member_id);

ALTER TABLE public.lobby_saved_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_lobby_saved_jobs" ON public.lobby_saved_jobs;
CREATE POLICY "service_role_lobby_saved_jobs" ON public.lobby_saved_jobs FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');


-- ------------------------------------------------------------
-- 3. CPD ACTIVITY LOGGING
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lobby_member_cpd_logs (
  id                TEXT PRIMARY KEY,
  member_id         UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  activity_type     TEXT NOT NULL CHECK (activity_type IN ('ask_research', 'live_room', 'lobby_daily_read', 'community_challenge', 'external_course')),
  title             TEXT NOT NULL,
  description       TEXT,
  duration_minutes  INT NOT NULL CHECK (duration_minutes > 0),
  source_ref        TEXT,
  logged_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lobby_cpd_member ON public.lobby_member_cpd_logs(member_id, logged_at DESC);

ALTER TABLE public.lobby_member_cpd_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_lobby_cpd" ON public.lobby_member_cpd_logs;
CREATE POLICY "service_role_lobby_cpd" ON public.lobby_member_cpd_logs FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');


-- ------------------------------------------------------------
-- 4. REAL-WORLD EVENT RSVPS & ATTENDEE NETWORKING
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lobby_event_rsvps (
  id          TEXT PRIMARY KEY,
  event_slug  TEXT NOT NULL,
  member_id   UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'attending' CHECK (status IN ('attending', 'interested', 'cancelled')),
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_slug, member_id)
);

CREATE INDEX IF NOT EXISTS idx_lobby_event_rsvps_event ON public.lobby_event_rsvps(event_slug, status);
CREATE INDEX IF NOT EXISTS idx_lobby_event_rsvps_member ON public.lobby_event_rsvps(member_id);

ALTER TABLE public.lobby_event_rsvps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_lobby_event_rsvps" ON public.lobby_event_rsvps;
CREATE POLICY "service_role_lobby_event_rsvps" ON public.lobby_event_rsvps FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');


-- ------------------------------------------------------------
-- 5. ANNUAL "STATE OF UK FM" BENCHMARKING SURVEY
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lobby_annual_survey_responses (
  id                          TEXT PRIMARY KEY,
  year                        INT NOT NULL DEFAULT 2026,
  member_id                   UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  salary_band                 TEXT NOT NULL,
  team_size                   TEXT NOT NULL,
  primary_sector              TEXT NOT NULL,
  biggest_challenge           TEXT NOT NULL,
  technology_adoption_level   TEXT NOT NULL,
  sustainability_target_year  TEXT NOT NULL,
  raw_responses               JSONB NOT NULL DEFAULT '{}',
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (year, member_id)
);

CREATE INDEX IF NOT EXISTS idx_lobby_survey_year ON public.lobby_annual_survey_responses(year);

ALTER TABLE public.lobby_annual_survey_responses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_lobby_survey" ON public.lobby_annual_survey_responses;
CREATE POLICY "service_role_lobby_survey" ON public.lobby_annual_survey_responses FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');


-- ------------------------------------------------------------
-- 6. RECORD MIGRATION
-- ------------------------------------------------------------

INSERT INTO public._schema_migrations (version, applied_at)
VALUES (
  '0048_lobby_six_growth_features',
  now()
)
ON CONFLICT (version) DO NOTHING;

COMMIT;
