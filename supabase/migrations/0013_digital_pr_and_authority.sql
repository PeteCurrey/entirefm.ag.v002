-- ============================================================================
-- ENTIREFM DIGITAL PR, LINK EARNING & INDUSTRY AUTHORITY ENGINE
-- Migration: 0013_digital_pr_and_authority.sql
-- ============================================================================

-- 1. PR Campaigns
create table if not exists public.pr_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  primary_asset_url text not null,
  story_angle text not null,
  target_audience text not null,
  status text not null default 'DRAFT', -- 'DRAFT', 'RESEARCH', 'BUILDING', 'READY', 'ACTIVE', 'COMPLETE', 'ARCHIVED'
  launch_date date default null,
  owner text not null default 'PR Lead',
  key_findings jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Media Targets & Editorial Contacts
create table if not exists public.media_targets (
  id uuid primary key default gen_random_uuid(),
  publication_name text not null,
  website text not null,
  category text not null default 'FM_PRESS', -- 'FM_PRESS', 'PROPERTY', 'BUILDING_ENGINEERING', 'ENERGY', 'TECH_AI', 'REGIONAL_BUSINESS'
  contact_name text default null,
  role text default null,
  editorial_focus text default '',
  relationship_status text not null default 'UNCONTACTED', -- 'UNCONTACTED', 'PITCHED', 'RESPONDED', 'COVERAGE_EARNED', 'DO_NOT_CONTACT'
  notes text default '',
  last_interaction_at timestamptz default null,
  created_at timestamptz not null default now()
);

-- 3. Expert Commentary Opportunities
create table if not exists public.expert_commentaries (
  id uuid primary key default gen_random_uuid(),
  topic_title text not null,
  news_source_url text default '',
  why_it_matters_to_fm text not null,
  draft_comment text not null,
  approved_by text default null,
  status text not null default 'DRAFT', -- 'DRAFT', 'REVIEW', 'APPROVED', 'PITCHED', 'PUBLISHED', 'ARCHIVED'
  created_at timestamptz not null default now()
);

-- 4. Earned Media Coverage & Backlinks
create table if not exists public.earned_coverage (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.pr_campaigns(id) on delete set null,
  publication_name text not null,
  article_title text not null,
  article_url text not null,
  published_date date not null,
  has_backlink boolean default false,
  backlink_url text default null,
  link_type text default 'FOLLOW', -- 'FOLLOW', 'NOFOLLOW', 'UNLINKED_MENTION'
  anchor_text text default null,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.pr_campaigns enable row level security;
alter table public.media_targets enable row level security;
alter table public.expert_commentaries enable row level security;
alter table public.earned_coverage enable row level security;
