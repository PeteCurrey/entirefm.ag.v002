-- ============================================================================
-- ENTIREFM CONTENT DISTRIBUTION, FM NEWSLETTER & AUDIENCE GROWTH ENGINE
-- MIGRATION 0006: POSTGRESQL SCHEMA
-- ============================================================================
-- Version: 1.0.0
-- Architecture: Relational, audit-logged, state-gated newsletter & distribution engine
--               for 'The FM Briefing', multi-channel syndication, and UTM attribution.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ENUMS
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.newsletter_subscriber_status as enum (
    'PENDING',
    'ACTIVE',
    'UNSUBSCRIBED',
    'BOUNCED',
    'COMPLAINED',
    'SUPPRESSED',
    'BLOCKED'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.newsletter_campaign_status as enum (
    'DRAFT',
    'READY',
    'SCHEDULED',
    'SENDING',
    'SENT',
    'FAILED',
    'CANCELLED'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.newsletter_suppression_reason as enum (
    'UNSUBSCRIBED',
    'BOUNCE_HARD',
    'SPAM_COMPLAINT',
    'ADMIN_MANUAL',
    'LEGAL_REQUEST'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.website_feature_location as enum (
    'HOMEPAGE',
    'BLOG_HOME',
    'RESOURCES_HUB',
    'AI_HUB',
    'COMPLIANCE_HUB'
  );
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 2. SUBSCRIBERS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id                    uuid primary key default gen_random_uuid(),
  email                 text not null unique,
  first_name            text,
  company               text,
  role                  text,
  status                public.newsletter_subscriber_status not null default 'ACTIVE',
  
  -- Explicit Consent Capture
  consent_source        text not null default 'PUBLIC_WEBSITE',
  consent_text_version  text not null default '2026-V1',
  consented_at          timestamptz not null default now(),
  
  -- Attribution
  signup_page           text not null default '/fm-briefing',
  utm_source            text,
  utm_medium            text,
  utm_campaign          text,
  utm_term              text,
  utm_content           text,
  
  -- Unsubscribe Security Token
  unsubscribe_token     uuid not null default gen_random_uuid() unique,
  
  -- Declared & Inferred Interests
  interests             text[] default '{}',
  
  -- Metadata
  last_email_sent_at    timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists idx_newsletter_subscribers_status on public.newsletter_subscribers (status);
create index if not exists idx_newsletter_subscribers_email on public.newsletter_subscribers (email);
create index if not exists idx_newsletter_subscribers_token on public.newsletter_subscribers (unsubscribe_token);

-- ----------------------------------------------------------------------------
-- 3. SUPPRESSION LIST
-- ----------------------------------------------------------------------------
create table if not exists public.newsletter_suppressions (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  reason      public.newsletter_suppression_reason not null,
  source      text not null default 'SYSTEM_AUTO',
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_newsletter_suppressions_email on public.newsletter_suppressions (email);

-- ----------------------------------------------------------------------------
-- 4. CAMPAIGNS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.newsletter_campaigns (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  subject             text not null,
  preview_text        text not null,
  sender_name         text not null default 'EntireFM Editorial Team',
  reply_to            text not null default 'editorial@entirefm.com',
  
  status              public.newsletter_campaign_status not null default 'DRAFT',
  
  scheduled_at        timestamptz,
  sent_at             timestamptz,
  
  utm_campaign        text not null,
  
  -- Structured Content Blocks (JSON array of typed blocks)
  content_blocks      jsonb not null default '[]'::jsonb,
  
  -- Target Audience Query / Tags
  target_audience     jsonb not null default '{"all": true}'::jsonb,
  
  -- Delivery & Engagement Metrics
  total_recipients    integer not null default 0,
  total_delivered     integer not null default 0,
  total_opened        integer not null default 0,
  total_clicked       integer not null default 0,
  total_unsubscribed  integer not null default 0,
  total_bounced       integer not null default 0,
  
  -- Pre-Send QA Verification Flags
  validation_passed   boolean not null default false,
  validation_details  jsonb default '{}'::jsonb,
  
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_newsletter_campaigns_status on public.newsletter_campaigns (status);
create index if not exists idx_newsletter_campaigns_created on public.newsletter_campaigns (created_at desc);

-- ----------------------------------------------------------------------------
-- 5. CAMPAIGN CONTENT ATTRIBUTION MAP
-- ----------------------------------------------------------------------------
create table if not exists public.newsletter_campaign_content (
  id              uuid primary key default gen_random_uuid(),
  campaign_id     uuid not null references public.newsletter_campaigns(id) on delete cascade,
  content_type    text not null, -- 'BLOG_POST', 'TOOL', 'AI_GUIDE', 'COMPLIANCE'
  content_path    text not null,
  content_title   text not null,
  click_count     integer not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists idx_campaign_content_cid on public.newsletter_campaign_content(campaign_id);

-- ----------------------------------------------------------------------------
-- 6. AUTOMATION SETTINGS & RUNS
-- ----------------------------------------------------------------------------
create table if not exists public.newsletter_automation_settings (
  id                      text primary key default 'default',
  auto_draft_enabled      boolean not null default true,
  auto_schedule_enabled   boolean not null default false,
  auto_send_enabled       boolean not null default false,
  draft_day_of_week       integer not null default 2, -- Tuesday
  draft_hour_utc          integer not null default 8, -- 08:00 UTC
  kill_switch_paused      boolean not null default false,
  email_delivery_provider text not null default 'RESEND',
  sending_domain          text not null default 'entirefm.com',
  updated_at              timestamptz not null default now()
);

create table if not exists public.newsletter_automation_runs (
  id              uuid primary key default gen_random_uuid(),
  job_type        text not null default 'WEEKLY_BRIEFING_DRAFT',
  status          text not null, -- 'SUCCESS', 'FAILED', 'SKIPPED'
  campaign_id     uuid references public.newsletter_campaigns(id),
  error_message   text,
  items_selected  jsonb default '[]'::jsonb,
  created_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 7. SOCIAL DISTRIBUTION DRAFTS (LINKEDIN & CHANNELS)
-- ----------------------------------------------------------------------------
create table if not exists public.social_distribution_drafts (
  id              uuid primary key default gen_random_uuid(),
  source_path     text not null, -- e.g. /post/predictive-maintenance-vs-ppm
  source_title    text not null,
  channel         text not null default 'LINKEDIN',
  post_copy       text not null,
  key_points      text[] default '{}',
  status          text not null default 'DRAFT', -- 'DRAFT', 'APPROVED', 'PUBLISHED'
  scheduled_at    timestamptz,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 8. WEBSITE FEATURE PLACEMENTS
-- ----------------------------------------------------------------------------
create table if not exists public.website_feature_placements (
  id              uuid primary key default gen_random_uuid(),
  location        public.website_feature_location not null,
  content_path    text not null,
  content_title   text not null,
  eyebrow         text,
  image_key       text,
  sort_order      integer not null default 0,
  is_active       boolean not null default true,
  expires_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_feature_placements_loc on public.website_feature_placements (location, is_active);
