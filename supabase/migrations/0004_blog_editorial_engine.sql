-- ============================================================================
-- ENTIREFM BLOG MANAGEMENT & AUTOMATED EDITORIAL ENGINE
-- MIGRATION 0004: POSTGRESQL SCHEMA
-- ============================================================================
-- Version: 1.0.0
-- Architecture: Relational, audit-logged, state-gated editorial engine for
--               FM trade articles with AI-discovery, fact checking, and scheduling.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ENUM TYPES
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.blog_post_status as enum (
    'IDEA',
    'RESEARCHING',
    'DRAFT',
    'AI_DRAFT',
    'NEEDS_REVIEW',
    'SEO_REVIEW',
    'READY',
    'SCHEDULED',
    'PUBLISHED',
    'UPDATED',
    'ARCHIVED',
    'FAILED'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.blog_generation_mode as enum (
    'manual',
    'ai',
    'ai_assisted'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.blog_review_status as enum (
    'PENDING',
    'PASSED',
    'REJECTED',
    'HUMAN_OVERRIDE'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.blog_source_trust as enum (
    'OFFICIAL_GOV',
    'INDUSTRY_STANDARD',
    'TRADE_PUBLICATION',
    'OEM_TECHNICAL',
    'CORPORATE_RESEARCH',
    'GENERAL_MEDIA'
  );
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 2. CATEGORIES & AUTHORS
-- ----------------------------------------------------------------------------
create table if not exists public.blog_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  description text,
  icon        text default 'BookOpen',
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.blog_authors (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  role              text not null default 'Technical Team',
  bio               text,
  avatar_url        text,
  is_technical_team boolean not null default false,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 3. EXTERNAL SOURCES & CITATIONS
-- ----------------------------------------------------------------------------
create table if not exists public.blog_sources (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  url               text not null,
  publisher         text not null,
  title             text,
  publication_date  date,
  date_accessed     date not null default current_date,
  source_type       text not null default 'REGULATORY', -- REGULATORY, STANDARD, INDUSTRY_NEWS, TECHNICAL_GUIDE
  trust_level       public.blog_source_trust not null default 'TRADE_PUBLICATION',
  notes             text,
  created_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 4. BLOG POSTS (CORE ENTITY)
-- ----------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id                      uuid primary key default gen_random_uuid(),
  slug                    text not null unique,
  title                   text not null,
  subtitle                text,
  excerpt                 text not null,
  content                 text not null, -- Markdown / Clean HTML
  content_json            jsonb default '[]'::jsonb, -- Structured block array
  category_id             uuid references public.blog_categories(id) on delete set null,
  author_id               uuid references public.blog_authors(id) on delete set null,

  -- Featured Image
  featured_image          text,
  featured_image_alt      text,
  featured_image_caption  text,
  featured_image_source   text,

  -- Lifecycle & Scheduling
  status                  public.blog_post_status not null default 'DRAFT',
  generation_mode         public.blog_generation_mode not null default 'manual',
  published_at            timestamptz,
  scheduled_at            timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  -- SEO & Metadata
  primary_keyword         text,
  secondary_keywords      text[] default '{}',
  seo_title               text,
  meta_description        text,
  canonical_url           text,
  og_title                text,
  og_description          text,
  og_image                text,
  robots_index            boolean not null default true,
  robots_follow           boolean not null default true,
  sitemap_include         boolean not null default true,
  schema_type             text not null default 'Article',
  reading_time            integer not null default 5,

  -- Quality & Fact Check Indicators
  review_status           public.blog_review_status not null default 'PENDING',
  fact_check_status       public.blog_review_status not null default 'PENDING',
  seo_status              public.blog_review_status not null default 'PENDING',
  image_status            public.blog_review_status not null default 'PENDING',
  content_score           integer default 85,
  seo_score               integer default 90,

  -- Commercial & Linking
  primary_service_href    text,
  primary_service_cta     text,
  internal_links_json     jsonb default '[]'::jsonb,

  -- Audit & Authorship
  created_by              text default 'system',
  updated_by              text default 'system'
);

-- Junction table for Post Sources
create table if not exists public.blog_post_sources (
  post_id     uuid not null references public.blog_posts(id) on delete cascade,
  source_id   uuid not null references public.blog_sources(id) on delete cascade,
  citation    text,
  created_at  timestamptz not null default now(),
  primary key (post_id, source_id)
);

-- ----------------------------------------------------------------------------
-- 5. REVISIONS (IMMUTABLE AUDIT TRAIL)
-- ----------------------------------------------------------------------------
create table if not exists public.blog_revisions (
  id              uuid primary key default gen_random_uuid(),
  post_id         uuid not null references public.blog_posts(id) on delete cascade,
  revision_number integer not null,
  title           text not null,
  content         text not null,
  content_json    jsonb,
  seo_title       text,
  meta_description text,
  changed_by      text not null,
  change_type     text not null default 'MANUAL_EDIT', -- MANUAL_EDIT, AI_DRAFT, FACT_CHECK_UPDATE, PUBLISH
  change_summary  text,
  created_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 6. TOPIC OPPORTUNITIES & AI RESEARCH DISCOVERY
-- ----------------------------------------------------------------------------
create table if not exists public.blog_topics (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  topic_theme           text not null,
  why_now               text not null,
  category_id           uuid references public.blog_categories(id) on delete set null,
  search_intent         text not null,
  commercial_relevance  text not null,
  supporting_sources    jsonb default '[]'::jsonb,
  collision_status      text not null default 'NO_COLLISION', -- NO_COLLISION, UPDATE_EXISTING, MERGE_IDEA, HUMAN_REVIEW
  colliding_url         text,
  freshness_score       integer not null default 85,
  overall_score         integer not null default 88,
  status                text not null default 'OPPORTUNITY', -- OPPORTUNITY, QUEUED, APPROVED, GENERATED, REJECTED, BLOCKED
  recommended_publish_date date,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 7. AUTOMATION ENGINE SETTINGS & JOBS
-- ----------------------------------------------------------------------------
create table if not exists public.blog_automation_settings (
  id                        uuid primary key default gen_random_uuid(),
  automation_enabled        boolean not null default true,
  auto_research_enabled     boolean not null default true,
  auto_draft_enabled        boolean not null default true,
  auto_publish_enabled      boolean not null default false, -- Safe default: Human review before live
  emergency_hold            boolean not null default false,
  min_posts_per_week        integer not null default 3,
  target_posts_per_week     integer not null default 4,
  max_posts_per_week        integer not null default 5,
  allowed_publish_days      text[] default '{"Tuesday", "Wednesday", "Thursday", "Friday"}',
  preferred_publish_times   text[] default '{"09:00"}',
  min_quality_score         integer not null default 80,
  min_source_confidence     integer not null default 75,
  min_seo_score             integer not null default 85,
  max_similarity_threshold  integer not null default 30,
  image_generation_enabled  boolean not null default false,
  updated_at                timestamptz not null default now()
);

create table if not exists public.blog_generation_jobs (
  id              uuid primary key default gen_random_uuid(),
  topic_id        uuid references public.blog_topics(id) on delete set null,
  post_id         uuid references public.blog_posts(id) on delete set null,
  job_type        text not null, -- RESEARCH, DRAFT, FACT_CHECK, SEO_ENHANCE, IMAGE_GEN, PUBLISH
  status          text not null default 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
  started_at      timestamptz,
  completed_at    timestamptz,
  failure_reason  text,
  retry_count     integer not null default 0,
  log_json        jsonb default '[]'::jsonb,
  created_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 8. MEDIA LIBRARY
-- ----------------------------------------------------------------------------
create table if not exists public.blog_media (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  url           text not null,
  alt_text      text not null,
  caption       text,
  source_type   text not null default 'PHOTOGRAPHY', -- PHOTOGRAPHY, LICENSED_EDITORIAL, GENERATED
  license_info  text default 'EntireFM Proprietary',
  tags          text[] default '{}',
  usage_count   integer not null default 0,
  created_at    timestamptz not null default now()
);

-- Seed Default Settings
insert into public.blog_automation_settings (
  automation_enabled,
  auto_research_enabled,
  auto_draft_enabled,
  auto_publish_enabled,
  min_posts_per_week,
  target_posts_per_week,
  max_posts_per_week
) values (
  true,
  true,
  true,
  false,
  3,
  4,
  5
) on conflict do nothing;
