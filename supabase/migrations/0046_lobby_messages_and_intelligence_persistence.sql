-- ============================================================================
-- ENTIREFM MIGRATION 0046: LOBBY DIRECT MESSAGES & INTELLIGENCE PERSISTENCE
-- ============================================================================
-- Part A:
-- 1. public.lobby_conversations
-- 2. public.lobby_conversation_participants
-- 3. public.lobby_direct_messages
-- 4. public.lobby_member_blocks
--
-- Part B:
-- 5. public.canonical_intelligence_items
-- 6. public.procurement_opportunities
-- 7. public.raw_intelligence_records
-- 8. public.intelligence_ingestion_runs
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. LOBBY CONVERSATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lobby_conversations (
  id                        text PRIMARY KEY,
  type                      text NOT NULL DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now(),
  last_message_at           timestamptz NOT NULL DEFAULT now(),
  last_message_preview      text,
  last_message_author_name  text
);

CREATE INDEX IF NOT EXISTS idx_lobby_conversations_last_message_at ON public.lobby_conversations (last_message_at DESC);

-- ----------------------------------------------------------------------------
-- 2. LOBBY CONVERSATION PARTICIPANTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lobby_conversation_participants (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id           text NOT NULL REFERENCES public.lobby_conversations(id) ON DELETE CASCADE,
  member_id                 uuid NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  member_name               text NOT NULL,
  member_headline           text,
  member_company            text,
  member_avatar_url         text,
  status                    text NOT NULL DEFAULT 'pending_request' CHECK (status IN ('accepted', 'pending_request', 'declined', 'blocked')),
  joined_at                 timestamptz NOT NULL DEFAULT now(),
  last_read_at              timestamptz NOT NULL DEFAULT now(),
  muted                     boolean NOT NULL DEFAULT false,
  archived                  boolean NOT NULL DEFAULT false,
  CONSTRAINT uq_lobby_conv_participant UNIQUE (conversation_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_lobby_conv_participants_member_id ON public.lobby_conversation_participants (member_id);
CREATE INDEX IF NOT EXISTS idx_lobby_conv_participants_conv_id ON public.lobby_conversation_participants (conversation_id);

-- ----------------------------------------------------------------------------
-- 3. LOBBY DIRECT MESSAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lobby_direct_messages (
  id                        text PRIMARY KEY,
  conversation_id           text NOT NULL REFERENCES public.lobby_conversations(id) ON DELETE CASCADE,
  author_member_id          uuid NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  author_name               text NOT NULL,
  author_avatar_url         text,
  body                      text NOT NULL,
  created_at                timestamptz NOT NULL DEFAULT now(),
  edited_at                 timestamptz,
  moderation_state          text NOT NULL DEFAULT 'published' CHECK (moderation_state IN ('published', 'hidden', 'removed'))
);

CREATE INDEX IF NOT EXISTS idx_lobby_direct_messages_conv_created ON public.lobby_direct_messages (conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_lobby_direct_messages_author ON public.lobby_direct_messages (author_member_id);

-- ----------------------------------------------------------------------------
-- 4. LOBBY MEMBER BLOCKS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lobby_member_blocks (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_member_id         uuid NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  blocked_member_id         uuid NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  created_at                timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_lobby_member_block UNIQUE (blocker_member_id, blocked_member_id)
);

CREATE INDEX IF NOT EXISTS idx_lobby_member_blocks_blocker ON public.lobby_member_blocks (blocker_member_id);
CREATE INDEX IF NOT EXISTS idx_lobby_member_blocks_blocked ON public.lobby_member_blocks (blocked_member_id);

-- ----------------------------------------------------------------------------
-- 5. CANONICAL INTELLIGENCE ITEMS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.canonical_intelligence_items (
  id                        text PRIMARY KEY,
  canonical_url             text NOT NULL UNIQUE,
  source_content_id         text NOT NULL,
  title                     text NOT NULL,
  standfirst                text NOT NULL,
  editorial_summary         text,
  why_it_matters            text,
  action_required           text,
  event_type                text NOT NULL,
  legal_status              text NOT NULL,
  authority_tier            integer NOT NULL CHECK (authority_tier IN (1, 2, 3, 4)),
  primary_source            jsonb NOT NULL,
  secondary_sources         jsonb NOT NULL DEFAULT '[]'::jsonb,
  published_at              timestamptz NOT NULL,
  updated_at                timestamptz,
  effective_from            timestamptz,
  deadline                  timestamptz,
  jurisdictions             text[] NOT NULL DEFAULT '{}',
  trade_tags                text[] NOT NULL DEFAULT '{}',
  topics                    text[] NOT NULL DEFAULT '{}',
  provenance                jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_statutory              boolean NOT NULL DEFAULT false,
  requires_review           boolean NOT NULL DEFAULT false,
  review_status             text NOT NULL DEFAULT 'auto_published',
  reviewed_by               text,
  reviewed_at               timestamptz,
  content_hash              text NOT NULL,
  first_seen_at             timestamptz NOT NULL DEFAULT now(),
  last_seen_at              timestamptz NOT NULL DEFAULT now(),
  related_statute_citation  text,
  related_discussion_slug   text,
  related_room_slug         text,
  related_tool_url          text,
  related_resource_url      text,
  consultation_data         jsonb,
  parliament_data           jsonb,
  prosecution_data          jsonb,
  fm_relevance_score        integer,
  fm_relevance_reason       text,
  publication_eligibility   text,
  relevant_roles            text[] DEFAULT '{}',
  relevant_sectors          text[] DEFAULT '{}',
  is_editorially_featured   boolean DEFAULT false,
  editorial_slot            text,
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_intel_published_at ON public.canonical_intelligence_items (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_intel_authority_tier ON public.canonical_intelligence_items (authority_tier);
CREATE INDEX IF NOT EXISTS idx_intel_event_type ON public.canonical_intelligence_items (event_type);
CREATE INDEX IF NOT EXISTS idx_intel_review_status ON public.canonical_intelligence_items (review_status);
CREATE INDEX IF NOT EXISTS idx_intel_is_statutory ON public.canonical_intelligence_items (is_statutory);
CREATE INDEX IF NOT EXISTS idx_intel_trade_tags ON public.canonical_intelligence_items USING gin(trade_tags);
CREATE INDEX IF NOT EXISTS idx_intel_jurisdictions ON public.canonical_intelligence_items USING gin(jurisdictions);

-- ----------------------------------------------------------------------------
-- 6. PROCUREMENT OPPORTUNITIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.procurement_opportunities (
  id                        text PRIMARY KEY,
  ocid                      text NOT NULL UNIQUE,
  source                    text NOT NULL,
  notice_type               text NOT NULL,
  title                     text NOT NULL,
  description               text NOT NULL,
  why_it_matters_for_fm     text,
  buyer_name                text NOT NULL,
  buyer_region              text NOT NULL,
  cpv_codes                 text[] NOT NULL DEFAULT '{}',
  service_category          text NOT NULL,
  estimated_value           jsonb,
  published_at              timestamptz NOT NULL,
  closing_date              timestamptz,
  contract_start_date       timestamptz,
  contract_duration_months  integer,
  status                    text NOT NULL,
  official_notice_url       text NOT NULL,
  award_details             jsonb,
  fm_relevance_score        integer,
  fm_relevance_reason       text,
  is_high_value_award       boolean DEFAULT false,
  is_editorially_featured   boolean DEFAULT false,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_proc_opportunities_published ON public.procurement_opportunities (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_proc_opportunities_status ON public.procurement_opportunities (status);
CREATE INDEX IF NOT EXISTS idx_proc_opportunities_notice_type ON public.procurement_opportunities (notice_type);
CREATE INDEX IF NOT EXISTS idx_proc_opportunities_category ON public.procurement_opportunities (service_category);

-- ----------------------------------------------------------------------------
-- 7. RAW INTELLIGENCE RECORDS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.raw_intelligence_records (
  id                        text PRIMARY KEY,
  source_id                 text NOT NULL,
  source_content_id         text NOT NULL,
  canonical_url             text NOT NULL,
  fetched_at                timestamptz NOT NULL DEFAULT now(),
  content_hash              text NOT NULL,
  parser_version            text NOT NULL,
  raw_payload               jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_raw_intel_source_content ON public.raw_intelligence_records (source_id, source_content_id);

-- ----------------------------------------------------------------------------
-- 8. INTELLIGENCE INGESTION RUNS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.intelligence_ingestion_runs (
  id                        text PRIMARY KEY,
  source_id                 text NOT NULL,
  source_name               text NOT NULL,
  started_at                timestamptz NOT NULL,
  completed_at              timestamptz NOT NULL,
  duration_ms               integer NOT NULL,
  status                    text NOT NULL,
  records_fetched           integer NOT NULL DEFAULT 0,
  records_created           integer NOT NULL DEFAULT 0,
  records_updated           integer NOT NULL DEFAULT 0,
  duplicates_detected       integer NOT NULL DEFAULT 0,
  error                     text,
  parser_version            text NOT NULL,
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_intel_runs_started ON public.intelligence_ingestion_runs (started_at DESC);

-- ----------------------------------------------------------------------------
-- RLS POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.lobby_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_member_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_intelligence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_intelligence_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_ingestion_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_lobby_conversations ON public.lobby_conversations;
CREATE POLICY service_role_lobby_conversations ON public.lobby_conversations FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_lobby_conversation_participants ON public.lobby_conversation_participants;
CREATE POLICY service_role_lobby_conversation_participants ON public.lobby_conversation_participants FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_lobby_direct_messages ON public.lobby_direct_messages;
CREATE POLICY service_role_lobby_direct_messages ON public.lobby_direct_messages FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_lobby_member_blocks ON public.lobby_member_blocks;
CREATE POLICY service_role_lobby_member_blocks ON public.lobby_member_blocks FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_canonical_intelligence_items ON public.canonical_intelligence_items;
CREATE POLICY service_role_canonical_intelligence_items ON public.canonical_intelligence_items FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_procurement_opportunities ON public.procurement_opportunities;
CREATE POLICY service_role_procurement_opportunities ON public.procurement_opportunities FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_raw_intelligence_records ON public.raw_intelligence_records;
CREATE POLICY service_role_raw_intelligence_records ON public.raw_intelligence_records FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_intelligence_ingestion_runs ON public.intelligence_ingestion_runs;
CREATE POLICY service_role_intelligence_ingestion_runs ON public.intelligence_ingestion_runs FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS read_published_intelligence ON public.canonical_intelligence_items;
CREATE POLICY read_published_intelligence ON public.canonical_intelligence_items FOR SELECT USING (review_status IN ('approved', 'auto_published'));

DROP POLICY IF EXISTS read_procurement_opportunities ON public.procurement_opportunities;
CREATE POLICY read_procurement_opportunities ON public.procurement_opportunities FOR SELECT USING (true);
