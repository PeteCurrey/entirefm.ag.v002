-- ============================================================================
-- ENTIREFM CONVERSION INTELLIGENCE, LEAD ATTRIBUTION & COMMERCIAL PERFORMANCE
-- Migration: 0008_conversion_intelligence.sql
-- ============================================================================

-- 1. Extend LEADS table with comprehensive attribution & qualification fields
alter table if exists public.leads
  add column if not exists first_touch_url text default '',
  add column if not exists last_touch_url text default '',
  add column if not exists first_touch_referrer text default '',
  add column if not exists last_touch_referrer text default '',
  add column if not exists form_id text default 'enquiry-form',
  add column if not exists form_page text default '',
  add column if not exists journey_trail jsonb default '[]'::jsonb,
  add column if not exists assisted_pages jsonb default '[]'::jsonb,
  add column if not exists gclid text default '',
  add column if not exists msclkid text default '',
  add column if not exists session_id text default '',
  add column if not exists qualification_status text default 'NEW',
  add column if not exists lead_source text default 'WEBSITE',
  add column if not exists marketing_channel text default 'ORGANIC_SEARCH',
  add column if not exists assigned_to text default '',
  add column if not exists estimated_value_gbp numeric default null,
  add column if not exists sector_interest text default '',
  add column if not exists location_interest text default '',
  add column if not exists is_test boolean default false,
  add column if not exists is_spam boolean default false;

-- Create indexes for fast commercial filtering
create index if not exists leads_qualification_idx on public.leads (qualification_status);
create index if not exists leads_marketing_channel_idx on public.leads (marketing_channel);
create index if not exists leads_service_idx on public.leads (service);
create index if not exists leads_location_idx on public.leads (location);
create index if not exists leads_is_test_idx on public.leads (is_test);

-- 2. Commercial Opportunities Table
create table if not exists public.commercial_opportunities (
  id uuid primary key default gen_random_uuid(),
  lead_id text references public.leads(enquiry_id) on delete set null,
  company text not null,
  service text default '',
  location text default '',
  estimated_value_gbp numeric default null,
  stage text not null default 'QUALIFIED', -- QUALIFIED, PROPOSAL_PREPARATION, PROPOSAL_SENT, NEGOTIATION, WON, LOST
  probability_pct integer default 50,
  expected_close_date date default null,
  owner text default '',
  won_lost_reason text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz default null
);

create index if not exists opp_stage_idx on public.commercial_opportunities (stage);
create index if not exists opp_created_at_idx on public.commercial_opportunities (created_at desc);

-- 3. Anonymous Non-PII Analytics Events Table
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  session_id text not null,
  path text not null,
  page_type text default '',
  event_params jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_name_idx on public.analytics_events (event_name);
create index if not exists events_path_idx on public.analytics_events (path);
create index if not exists events_created_idx on public.analytics_events (created_at desc);

-- 4. Daily Aggregates Cache Table (for instant dashboard load)
create table if not exists public.growth_daily_aggregates (
  date date not null,
  dimension_type text not null, -- 'OVERVIEW', 'PAGE', 'SERVICE', 'LOCATION', 'SECTOR', 'TOOL', 'CHANNEL'
  dimension_key text not null,
  sessions integer default 0,
  organic_sessions integer default 0,
  cta_clicks integer default 0,
  form_starts integer default 0,
  form_submits integer default 0,
  leads_count integer default 0,
  qualified_leads integer default 0,
  assisted_leads integer default 0,
  pipeline_value_gbp numeric default 0,
  won_value_gbp numeric default 0,
  created_at timestamptz not null default now(),
  primary key (date, dimension_type, dimension_key)
);

-- Enable RLS
alter table public.commercial_opportunities enable row level security;
alter table public.analytics_events enable row level security;
alter table public.growth_daily_aggregates enable row level security;
