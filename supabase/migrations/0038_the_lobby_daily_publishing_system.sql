-- ============================================================================
-- ENTIREFM THE LOBBY DAILY — AUTOMATED FM NEWS EMAIL PUBLISHING SYSTEM
-- MIGRATION 0038: POSTGRESQL SCHEMA
-- ============================================================================
-- Version: 1.0.0
-- Architecture: Relational, audit-logged, state-gated daily email publishing
--               system for 'The Lobby Daily' by EntireFM.
-- Safe, additive migration preserving existing weekly subscribers and tables.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ENUMS FOR THE LOBBY DAILY
-- ----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.lobby_daily_edition_status AS ENUM (
    'DRAFT',
    'AWAITING_APPROVAL',
    'SCHEDULED',
    'SENDING',
    'SENT',
    'PAUSED',
    'FAILED',
    'CANCELLED'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.lobby_image_rights_status AS ENUM (
    'OWNED',
    'LICENSED',
    'PRESS_ASSET_APPROVED',
    'OPEN_ATTRIBUTION',
    'MANUALLY_APPROVED',
    'RESTRICTED',
    'UNKNOWN'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.lobby_subscription_frequency AS ENUM (
    'DAILY_LOBBY',
    'WEEKLY_BRIEFING',
    'COMPLIANCE_ALERTS',
    'CONTRACTS_OPPORTUNITIES'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 2. EXTEND EXISTING SUBSCRIBERS TABLE SAFELY
-- ----------------------------------------------------------------------------
-- Ensure existing weekly subscribers maintain their weekly preference
ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS subscription_preferences text[] DEFAULT ARRAY['WEEKLY_BRIEFING']::text[],
  ADD COLUMN IF NOT EXISTS confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS confirmation_token uuid DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS bounce_type text,
  ADD COLUMN IF NOT EXISTS unsubscribed_at timestamptz;

-- Set existing ACTIVE subscribers as confirmed if not already set
UPDATE public.newsletter_subscribers
SET confirmed_at = consented_at
WHERE status = 'ACTIVE' AND confirmed_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_subscribers_preferences ON public.newsletter_subscribers USING gin(subscription_preferences);
CREATE INDEX IF NOT EXISTS idx_subscribers_conf_token ON public.newsletter_subscribers (confirmation_token);

-- ----------------------------------------------------------------------------
-- 3. THE LOBBY DAILY EDITIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lobby_daily_editions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_number          integer NOT NULL UNIQUE,
  edition_date            date NOT NULL UNIQUE,
  slug                    text NOT NULL UNIQUE,
  status                  public.lobby_daily_edition_status NOT NULL DEFAULT 'DRAFT',
  
  subject_line            text NOT NULL,
  preheader               text NOT NULL,
  reading_time_minutes    integer NOT NULL DEFAULT 4,
  
  -- 10 Structured Editorial Sections (JSONB)
  masthead_data           jsonb NOT NULL DEFAULT '{}'::jsonb,
  lead_story              jsonb NOT NULL DEFAULT '{}'::jsonb,
  morning_brief           jsonb NOT NULL DEFAULT '[]'::jsonb,
  what_changed_today      jsonb NOT NULL DEFAULT '[]'::jsonb,
  compliance_watch        jsonb, -- Nullable if no verified compliance items
  contracts_mobilisations jsonb NOT NULL DEFAULT '[]'::jsonb,
  engineers_note          jsonb NOT NULL DEFAULT '{}'::jsonb,
  on_the_horizon          jsonb, -- Nullable if no milestone
  one_useful_thing        jsonb NOT NULL DEFAULT '{}'::jsonb,
  sponsor_block           jsonb, -- Nullable / disabled by default
  footer_details          jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  -- Quality Assurance & Verification
  validation_passed       boolean NOT NULL DEFAULT false,
  validation_report       jsonb NOT NULL DEFAULT '{"errors":[], "warnings":[], "verifiedLinks":[]}'::jsonb,
  
  -- Approval & Audit Trail
  approved_by_admin_id    text,
  approved_at             timestamptz,
  scheduled_send_at       timestamptz,
  sent_at                 timestamptz,
  editorial_audit_trail   jsonb NOT NULL DEFAULT '[]'::jsonb,
  
  -- Metrics & Attribution
  utm_campaign            text NOT NULL,
  total_recipients        integer NOT NULL DEFAULT 0,
  total_delivered         integer NOT NULL DEFAULT 0,
  total_opened            integer NOT NULL DEFAULT 0,
  total_clicked           integer NOT NULL DEFAULT 0,
  total_unsubscribed      integer NOT NULL DEFAULT 0,
  total_bounced           integer NOT NULL DEFAULT 0,
  total_complaints        integer NOT NULL DEFAULT 0,
  story_click_metrics     jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  -- Web & SEO Flag (Only indexable if substantial original EntireFM analysis)
  is_indexable_web_edition boolean NOT NULL DEFAULT false,
  
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lobby_daily_editions_date ON public.lobby_daily_editions (edition_date DESC);
CREATE INDEX IF NOT EXISTS idx_lobby_daily_editions_status ON public.lobby_daily_editions (status);
CREATE INDEX IF NOT EXISTS idx_lobby_daily_editions_slug ON public.lobby_daily_editions (slug);

-- ----------------------------------------------------------------------------
-- 4. CANDIDATE STORIES & INGESTION AUDIT LEDGER
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lobby_daily_candidates (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id               text NOT NULL,
  publisher_name          text NOT NULL,
  authority_tier          integer NOT NULL DEFAULT 3,
  
  source_url              text NOT NULL,
  canonical_url           text NOT NULL,
  normalized_headline     text NOT NULL,
  original_headline       text NOT NULL,
  
  published_at            timestamptz NOT NULL,
  ingested_at             timestamptz NOT NULL DEFAULT now(),
  
  category                text NOT NULL,
  summary                 text,
  operational_takeaway    text,
  
  -- Image & Rights Tracking
  original_image_url      text,
  resolved_image_url      text NOT NULL,
  image_rights_status     public.lobby_image_rights_status NOT NULL DEFAULT 'UNKNOWN',
  image_rights_basis      text,
  image_credit            text,
  image_alt               text,
  
  -- Quality & Deduplication
  source_confidence       numeric(3,2) NOT NULL DEFAULT 1.00,
  is_duplicate            boolean NOT NULL DEFAULT false,
  duplicate_of_id         uuid REFERENCES public.lobby_daily_candidates(id),
  rejection_reason        text,
  
  -- Editorial Selection
  used_in_edition_id      uuid REFERENCES public.lobby_daily_editions(id),
  assigned_section        text, -- 'LEAD', 'MORNING_BRIEF', 'WHAT_CHANGED', 'COMPLIANCE', 'CONTRACTS'
  is_manually_excluded    boolean NOT NULL DEFAULT false,
  
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_candidates_canonical ON public.lobby_daily_candidates (canonical_url);
CREATE INDEX IF NOT EXISTS idx_daily_candidates_headline_norm ON public.lobby_daily_candidates (normalized_headline);
CREATE INDEX IF NOT EXISTS idx_daily_candidates_published ON public.lobby_daily_candidates (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_candidates_edition ON public.lobby_daily_candidates (used_in_edition_id);

-- ----------------------------------------------------------------------------
-- 5. THE LOBBY DAILY DELIVERY LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lobby_daily_delivery_logs (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id              uuid NOT NULL REFERENCES public.lobby_daily_editions(id) ON DELETE CASCADE,
  subscriber_id           uuid NOT NULL REFERENCES public.newsletter_subscribers(id) ON DELETE CASCADE,
  email                   text NOT NULL,
  provider                text NOT NULL DEFAULT 'RESEND',
  provider_message_id     text,
  status                  text NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'SENT', 'DELIVERED', 'BOUNCED', 'COMPLAINED'
  error_message           text,
  opened_at               timestamptz,
  clicked_at              timestamptz,
  clicked_links           jsonb DEFAULT '[]'::jsonb,
  sent_at                 timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_delivery_logs_edition ON public.lobby_daily_delivery_logs (edition_id);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_subscriber ON public.lobby_daily_delivery_logs (subscriber_id);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_message_id ON public.lobby_daily_delivery_logs (provider_message_id);

-- ----------------------------------------------------------------------------
-- 6. THE LOBBY DAILY SYSTEM SETTINGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lobby_daily_settings (
  id                          text PRIMARY KEY DEFAULT 'default',
  send_schedule_type          text NOT NULL DEFAULT 'WEEKDAYS_ONLY', -- 'WEEKDAYS_ONLY' | 'EVERYDAY'
  send_time_london            text NOT NULL DEFAULT '06:45',
  timezone                    text NOT NULL DEFAULT 'Europe/London',
  
  min_stories_per_edition     integer NOT NULL DEFAULT 8,
  max_stories_per_edition     integer NOT NULL DEFAULT 14,
  
  auto_send_enabled           boolean NOT NULL DEFAULT false, -- Always starts false in production
  manual_approval_required    boolean NOT NULL DEFAULT true,  -- Requires admin sign-off
  emergency_kill_switch       boolean NOT NULL DEFAULT false,
  
  sender_name                 text NOT NULL DEFAULT 'The Lobby by EntireFM',
  sender_email                text NOT NULL DEFAULT 'briefing@entirefm.com',
  reply_to_email              text NOT NULL DEFAULT 'editorial@entirefm.com',
  
  sponsor_enabled             boolean NOT NULL DEFAULT false,
  sponsor_config              jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  source_allowlist            text[] DEFAULT '{}',
  source_blocklist            text[] DEFAULT '{}',
  
  updated_by_admin_id         text,
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Insert default settings row if not exists
INSERT INTO public.lobby_daily_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.lobby_daily_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_daily_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_daily_delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_daily_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'service_role_lobby_editions' AND tablename = 'lobby_daily_editions'
  ) THEN
    DROP POLICY IF EXISTS service_role_lobby_editions ON public.lobby_daily_editions;
CREATE POLICY service_role_lobby_editions ON public.lobby_daily_editions FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'service_role_lobby_candidates' AND tablename = 'lobby_daily_candidates'
  ) THEN
    DROP POLICY IF EXISTS service_role_lobby_candidates ON public.lobby_daily_candidates;
CREATE POLICY service_role_lobby_candidates ON public.lobby_daily_candidates FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'service_role_lobby_delivery_logs' AND tablename = 'lobby_daily_delivery_logs'
  ) THEN
    DROP POLICY IF EXISTS service_role_lobby_delivery_logs ON public.lobby_daily_delivery_logs;
CREATE POLICY service_role_lobby_delivery_logs ON public.lobby_daily_delivery_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'service_role_lobby_settings' AND tablename = 'lobby_daily_settings'
  ) THEN
    DROP POLICY IF EXISTS service_role_lobby_settings ON public.lobby_daily_settings;
CREATE POLICY service_role_lobby_settings ON public.lobby_daily_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

COMMENT ON TABLE public.lobby_daily_editions IS
  'Published and scheduled daily editions of The Lobby Daily by EntireFM with 10-section structure and QA metrics.';

COMMENT ON TABLE public.lobby_daily_candidates IS
  'Raw candidate news items ingested from Tier 1-3 statutory and trade feeds with deduplication and image rights status.';
