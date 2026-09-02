-- ============================================================
-- MIGRATION 0047: LOBBY COMMUNITY, ROOMS, AWARDS & SAVED RESEARCH PERSISTENCE
-- ============================================================
-- Implements persistent PostgreSQL-backed tables for:
--   1. Community Forum (discussions, replies, reactions, moderation, reputation, polls, challenges, Ask EntireFM)
--   2. Live Rooms (rooms, room messages)
--   3. Industry Awards directory
--   4. Saved Lobby Research (per-member)
--
-- All tables use RLS with service-role bypass.
-- Member actor columns reference lobby_members(id) where they exist.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. COMMUNITY FORUM
-- ============================================================

CREATE TABLE IF NOT EXISTS public.community_discussions (
  id                  TEXT PRIMARY KEY,
  slug                TEXT UNIQUE NOT NULL,
  title               TEXT NOT NULL,
  author_member_id    UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  author_name         TEXT NOT NULL,
  author_headline     TEXT,
  author_company      TEXT,
  author_avatar_url   TEXT,
  author_badge        TEXT,
  category_id         TEXT NOT NULL,
  category_slug       TEXT NOT NULL,
  category_name       TEXT NOT NULL,
  body                TEXT NOT NULL,
  tags                TEXT[] NOT NULL DEFAULT '{}',
  status              TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','locked','archived','hidden','removed')),
  moderation_state    TEXT NOT NULL DEFAULT 'published' CHECK (moderation_state IN ('published','under_review','flagged','hidden','removed')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_activity_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  reply_count         INT NOT NULL DEFAULT 0,
  helpful_count       INT NOT NULL DEFAULT 0,
  view_count          INT NOT NULL DEFAULT 0,
  featured            BOOLEAN NOT NULL DEFAULT false,
  pinned              BOOLEAN NOT NULL DEFAULT false,
  solved              BOOLEAN NOT NULL DEFAULT false,
  accepted_reply_id   TEXT,
  is_entirefm_official BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS community_discussions_slug_idx ON public.community_discussions(slug);
CREATE INDEX IF NOT EXISTS community_discussions_category_slug_idx ON public.community_discussions(category_slug);
CREATE INDEX IF NOT EXISTS community_discussions_last_activity_idx ON public.community_discussions(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS community_discussions_pinned_idx ON public.community_discussions(pinned DESC, last_activity_at DESC);

ALTER TABLE public.community_discussions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_community_discussions" ON public.community_discussions;
CREATE POLICY "service_role_community_discussions"
  ON public.community_discussions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.community_discussion_replies (
  id                    TEXT PRIMARY KEY,
  discussion_id         TEXT NOT NULL REFERENCES public.community_discussions(id) ON DELETE CASCADE,
  discussion_slug       TEXT NOT NULL,
  author_member_id      UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  author_name           TEXT NOT NULL,
  author_headline       TEXT,
  author_company        TEXT,
  author_avatar_url     TEXT,
  author_badge          TEXT,
  is_entirefm_official  BOOLEAN DEFAULT false,
  body                  TEXT NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  edited_at             TIMESTAMPTZ,
  parent_reply_id       TEXT,
  reply_to_member_name  TEXT,
  moderation_state      TEXT NOT NULL DEFAULT 'published' CHECK (moderation_state IN ('published','under_review','flagged','hidden','removed')),
  is_accepted_answer    BOOLEAN NOT NULL DEFAULT false,
  helpful_count         INT NOT NULL DEFAULT 0,
  helpful_member_ids    TEXT[] NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS community_replies_discussion_id_idx ON public.community_discussion_replies(discussion_id, created_at ASC);

ALTER TABLE public.community_discussion_replies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_community_replies" ON public.community_discussion_replies;
CREATE POLICY "service_role_community_replies"
  ON public.community_discussion_replies FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.community_helpful_reactions (
  id           TEXT PRIMARY KEY,
  reply_id     TEXT NOT NULL REFERENCES public.community_discussion_replies(id) ON DELETE CASCADE,
  member_id    UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (reply_id, member_id)
);

CREATE INDEX IF NOT EXISTS community_reactions_reply_idx ON public.community_helpful_reactions(reply_id);

ALTER TABLE public.community_helpful_reactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_community_reactions" ON public.community_helpful_reactions;
CREATE POLICY "service_role_community_reactions"
  ON public.community_helpful_reactions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.community_moderation_cases (
  id                      TEXT PRIMARY KEY,
  reporter_member_id      UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  reported_content_type   TEXT NOT NULL CHECK (reported_content_type IN ('discussion','reply','room_message','direct_message')),
  reported_content_id     TEXT NOT NULL,
  content_snapshot        TEXT NOT NULL,
  author_member_id        TEXT NOT NULL,
  reason                  TEXT NOT NULL,
  reporter_notes          TEXT,
  severity                TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
  status                  TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','under_review','actioned','dismissed','closed')),
  assigned_moderator_id   TEXT,
  outcome                 TEXT,
  internal_notes          TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at             TIMESTAMPTZ,
  closed_at               TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS community_moderation_status_idx ON public.community_moderation_cases(status, created_at DESC);

ALTER TABLE public.community_moderation_cases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_moderation_cases" ON public.community_moderation_cases;
CREATE POLICY "service_role_moderation_cases"
  ON public.community_moderation_cases FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.community_reputation_events (
  id          TEXT PRIMARY KEY,
  member_id   UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL CHECK (event_type IN ('discussion_accepted_answer','reply_marked_helpful','challenge_solved','editorial_contributor_bonus')),
  source_id   TEXT NOT NULL,
  points      INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_reputation_member_idx ON public.community_reputation_events(member_id, created_at DESC);

ALTER TABLE public.community_reputation_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_reputation_events" ON public.community_reputation_events;
CREATE POLICY "service_role_reputation_events"
  ON public.community_reputation_events FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.community_polls (
  id                      TEXT PRIMARY KEY,
  question                TEXT NOT NULL,
  context                 TEXT NOT NULL,
  topic                   TEXT NOT NULL,
  status                  TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','closed')),
  opens_at                TIMESTAMPTZ NOT NULL,
  closes_at               TIMESTAMPTZ NOT NULL,
  total_votes             INT NOT NULL DEFAULT 0,
  options                 JSONB NOT NULL DEFAULT '[]',
  editorial_analysis      TEXT,
  related_discussion_slug TEXT,
  series_id               TEXT
);

CREATE INDEX IF NOT EXISTS community_polls_status_idx ON public.community_polls(status, closes_at DESC);

ALTER TABLE public.community_polls ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_community_polls" ON public.community_polls;
CREATE POLICY "service_role_community_polls"
  ON public.community_polls FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.community_poll_votes (
  poll_id     TEXT NOT NULL REFERENCES public.community_polls(id) ON DELETE CASCADE,
  member_id   UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  option_id   TEXT NOT NULL,
  voted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (poll_id, member_id),
  UNIQUE (poll_id, member_id)
);

ALTER TABLE public.community_poll_votes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_poll_votes" ON public.community_poll_votes;
CREATE POLICY "service_role_poll_votes"
  ON public.community_poll_votes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.community_challenges (
  id                TEXT PRIMARY KEY,
  week_number       INT NOT NULL,
  year              INT NOT NULL,
  title             TEXT NOT NULL,
  question          TEXT NOT NULL,
  scenario          TEXT NOT NULL,
  topic             TEXT NOT NULL,
  difficulty        TEXT NOT NULL CHECK (difficulty IN ('Practitioner','Senior','Director')),
  points            INT NOT NULL DEFAULT 0,
  options           JSONB NOT NULL DEFAULT '[]',
  correct_option_id TEXT NOT NULL,
  explanation       TEXT NOT NULL,
  technical_why     TEXT NOT NULL,
  source_references TEXT[] NOT NULL DEFAULT '{}',
  status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','closed'))
);

CREATE INDEX IF NOT EXISTS community_challenges_status_idx ON public.community_challenges(status);
CREATE UNIQUE INDEX IF NOT EXISTS community_challenges_week_year_idx ON public.community_challenges(week_number, year);

ALTER TABLE public.community_challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_community_challenges" ON public.community_challenges;
CREATE POLICY "service_role_community_challenges"
  ON public.community_challenges FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.community_challenge_responses (
  challenge_id        TEXT NOT NULL REFERENCES public.community_challenges(id) ON DELETE CASCADE,
  member_id           UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  selected_option_id  TEXT NOT NULL,
  is_correct          BOOLEAN NOT NULL,
  points_awarded      INT NOT NULL DEFAULT 0,
  answered_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (challenge_id, member_id),
  UNIQUE (challenge_id, member_id)
);

ALTER TABLE public.community_challenge_responses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_challenge_responses" ON public.community_challenge_responses;
CREATE POLICY "service_role_challenge_responses"
  ON public.community_challenge_responses FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.community_ask_entirefm_submissions (
  id                      TEXT PRIMARY KEY,
  member_id               UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  member_name             TEXT NOT NULL,
  member_headline         TEXT,
  question                TEXT NOT NULL,
  context                 TEXT,
  topic                   TEXT NOT NULL,
  attribution_preference  TEXT NOT NULL CHECK (attribution_preference IN ('full_name','job_title_only','anonymous')),
  status                  TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','under_editorial_review','published','declined')),
  editorial_notes         TEXT,
  published_article_slug  TEXT,
  submitted_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_ask_submissions_member_idx ON public.community_ask_entirefm_submissions(member_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS community_ask_submissions_status_idx ON public.community_ask_entirefm_submissions(status);

ALTER TABLE public.community_ask_entirefm_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_ask_submissions" ON public.community_ask_entirefm_submissions;
CREATE POLICY "service_role_ask_submissions"
  ON public.community_ask_entirefm_submissions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');


-- ============================================================
-- 2. LIVE ROOMS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.lobby_rooms (
  id                    TEXT PRIMARY KEY,
  slug                  TEXT UNIQUE NOT NULL,
  name                  TEXT NOT NULL,
  description           TEXT NOT NULL,
  topic                 TEXT NOT NULL,
  type                  TEXT NOT NULL DEFAULT 'topic' CHECK (type IN ('topic','event','temporary','staff_hosted')),
  visibility            TEXT NOT NULL DEFAULT 'public_readable' CHECK (visibility IN ('public_readable','members_only','restricted')),
  status                TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','scheduled','archived','locked')),
  active_presence_count INT NOT NULL DEFAULT 0,
  total_messages_count  INT NOT NULL DEFAULT 0,
  last_activity_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  scheduled_start       TIMESTAMPTZ,
  scheduled_end         TIMESTAMPTZ,
  guidelines_prompt     TEXT
);

ALTER TABLE public.lobby_rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_lobby_rooms" ON public.lobby_rooms;
CREATE POLICY "service_role_lobby_rooms"
  ON public.lobby_rooms FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Seed canonical rooms (idempotent)
INSERT INTO public.lobby_rooms (id, slug, name, description, topic, type, visibility, status, active_presence_count, total_messages_count, guidelines_prompt)
VALUES
  ('room-01', 'fm-general',     'FM General Roundtable',           'Open professional discussion on estate management, leadership, FM strategy, and daily operations.',                                        'General FM',              'topic', 'public_readable', 'active', 0, 0, 'Keep commercial and site-specific client identities confidential.'),
  ('room-02', 'building-safety','Building Safety & Golden Thread',  'Accountable Person responsibilities, mandatory occurrence reporting, fire doors, and BSA compliance.',                                   'Building Safety',         'topic', 'public_readable', 'active', 0, 0, 'Strictly cite statutory sources (BSR, Gov.uk, BSA 2022) where applicable.'),
  ('room-03', 'engineering-me', 'Engineering & M&E Plant',          'Chillers, AHUs, boilers, BMS optimisation, electrical distribution, and hard FM troubleshooting.',                                     'Engineering & M&E',       'topic', 'public_readable', 'active', 0, 0, 'Share practical field engineering insight; avoid speculative guidance.'),
  ('room-04', 'fm-technology-ai','FM Technology & Applied AI',      'CAFM integrations, telemetry, IoT sensors, automation, data hygiene, and AI field tools.',                                             'CAFM & Technology',       'topic', 'public_readable', 'active', 0, 0, 'Discuss real operational implementations and ROI rather than marketing hype.'),
  ('room-05', 'contractor-desk','The Contractor Desk Live',         'Specialist MEP and soft services contractor roundtable: RAMS, job proof, mobilization, and supplier challenges.',                       'Contractor Management',   'topic', 'public_readable', 'active', 0, 0, 'No commercial job-order or operational client data. Focus on industry standards.'),
  ('room-06', 'careers-mentoring','Careers & Mentoring',            'IWFM/CIBSE pathways, engineering-to-management transitions, apprenticeships, and talent development.',                                  'Professional Development', 'topic', 'public_readable', 'active', 0, 0, 'Support peers with constructive guidance and mentoring insight.')
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lobby_room_messages (
  id                   TEXT PRIMARY KEY,
  room_id              TEXT NOT NULL REFERENCES public.lobby_rooms(id) ON DELETE CASCADE,
  room_slug            TEXT NOT NULL,
  author_member_id     UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  author_name          TEXT NOT NULL,
  author_headline      TEXT,
  author_company       TEXT,
  author_avatar_url    TEXT,
  author_badge         TEXT,
  is_entirefm_official BOOLEAN DEFAULT false,
  body                 TEXT NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  edited_at            TIMESTAMPTZ,
  reply_to_message_id  TEXT,
  reply_to_snippet     TEXT,
  moderation_state     TEXT NOT NULL DEFAULT 'published' CHECK (moderation_state IN ('published','hidden','removed'))
);

CREATE INDEX IF NOT EXISTS lobby_room_messages_room_idx ON public.lobby_room_messages(room_id, created_at ASC);
CREATE INDEX IF NOT EXISTS lobby_room_messages_room_slug_idx ON public.lobby_room_messages(room_slug, created_at ASC);

ALTER TABLE public.lobby_room_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_lobby_room_messages" ON public.lobby_room_messages;
CREATE POLICY "service_role_lobby_room_messages"
  ON public.lobby_room_messages FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');


-- ============================================================
-- 3. INDUSTRY AWARDS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.lobby_industry_awards (
  id                    TEXT PRIMARY KEY,
  slug                  TEXT UNIQUE NOT NULL,
  name                  TEXT NOT NULL,
  organiser             TEXT NOT NULL,
  description           TEXT NOT NULL,
  categories            TEXT[] NOT NULL DEFAULT '{}',
  entry_open_date       TIMESTAMPTZ,
  entry_deadline        TIMESTAMPTZ NOT NULL,
  shortlist_date        TIMESTAMPTZ,
  event_date            TIMESTAMPTZ NOT NULL,
  location              TEXT NOT NULL,
  official_url          TEXT NOT NULL,
  provenance            JSONB NOT NULL DEFAULT '{}',
  status                TEXT NOT NULL DEFAULT 'entries-open' CHECK (status IN ('entries-open','closing-soon','shortlisted','upcoming','winners-announced','completed')),
  is_sponsored          BOOLEAN DEFAULT false,
  sponsor_name          TEXT,
  sponsorship_disclosure TEXT,
  why_it_matters        TEXT
);

CREATE INDEX IF NOT EXISTS lobby_awards_status_deadline_idx ON public.lobby_industry_awards(status, entry_deadline ASC);

ALTER TABLE public.lobby_industry_awards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_lobby_awards" ON public.lobby_industry_awards;
CREATE POLICY "service_role_lobby_awards"
  ON public.lobby_industry_awards FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Seed real verified UK FM industry awards only.
-- award-004 (National Building & Construction Awards / "Events & PR UK") was removed as
-- its organiser is unverifiable against any established UK FM trade body.
INSERT INTO public.lobby_industry_awards (id, slug, name, organiser, description, categories, entry_open_date, entry_deadline, shortlist_date, event_date, location, official_url, status, why_it_matters, provenance)
VALUES
  (
    'award-001', 'iwfm-impact-awards-2026',
    'IWFM Impact Awards 2026',
    'Institute of Workplace and Facilities Management (IWFM)',
    'The premier benchmark of excellence in workplace and facilities management, recognising leadership, technological innovation, sustainability, and service partnership across the UK sector.',
    ARRAY['Excellence in Customer Experience','Workplace Experience: Non-commercial','Change Management','Product or Service Development','Sustainability Impact','Manager of the Year'],
    '2026-03-01T09:00:00Z', '2026-09-04T17:00:00Z', '2026-09-28T09:00:00Z', '2026-10-19T18:30:00Z',
    'JW Marriott Grosvenor House, London W1', 'https://www.iwfmawards.org', 'closing-soon',
    'The gold standard for UK FM benchmark recognition. Submissions require verified client KPI data and carbon reduction audits.',
    '{"imageType":"owned","imageUrl":"/images/editorial/entirefm-rooftop-plant-night-1200w.webp","altText":"JW Marriott Grosvenor House London event architecture","credit":"EntireFM Industry Recognition Wire"}'
  ),
  (
    'award-002', 'pfm-partnership-awards-2026',
    'PFM Partnership Awards 2026',
    'Premises & Facilities Management (PFM)',
    'Recognising the most effective client-supplier partnerships in UK facilities management with rigorous independent judging and site inspection visits.',
    ARRAY['Partnership in Hard FM','Partnership in Corporate Offices','Partnership in Healthcare','Partnership in Public Sector','FM Technology Innovation'],
    '2026-04-15T09:00:00Z', '2026-09-18T17:00:00Z', '2026-10-05T09:00:00Z', '2026-11-04T18:00:00Z',
    'The Brewery, Chiswell Street, London EC1', 'https://www.pfmawards.co.uk', 'entries-open',
    'PFM uniquely evaluates the strength of client-contractor trust and collaborative problem-solving rather than sales volume.',
    '{"imageType":"owned","imageUrl":"/images/editorial/entirefm-rooftop-plant-night-1200w.webp","altText":"London architectural heritage and ceremony venue","credit":"EntireFM Industry Recognition Wire"}'
  ),
  (
    'award-003', 'cibse-building-performance-awards-2027',
    'CIBSE Building Performance Awards 2027',
    'Chartered Institution of Building Services Engineers (CIBSE)',
    'The only awards recognising measured, in-use operational building performance rather than theoretical architectural design.',
    ARRAY['Commercial Building Performance','Building Operations & Maintenance Team','Building Performance Consultancy','Retrofit of the Year','Facilities Management Team of the Year'],
    '2026-07-01T09:00:00Z', '2026-09-25T17:00:00Z', '2026-11-12T09:00:00Z', '2027-02-25T18:30:00Z',
    'Park Plaza Westminster Bridge, London SE1', 'https://www.cibse.org/bpa', 'entries-open',
    'Entries require at least 12 months of actual meter data demonstrating energy reduction and indoor air quality performance.',
    '{"imageType":"owned","imageUrl":"/images/editorial/entirefm-rooftop-plant-night-1200w.webp","altText":"Modern commercial building facade and energy infrastructure","credit":"EntireFM Industry Recognition Wire"}'
  )
ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- 4. SAVED LOBBY RESEARCH
-- ============================================================

CREATE TABLE IF NOT EXISTS public.lobby_saved_research (
  id              TEXT PRIMARY KEY,
  member_id       UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  ask_session_id  TEXT NOT NULL,
  question        TEXT NOT NULL,
  mode            TEXT NOT NULL CHECK (mode IN ('ask','deep_research')),
  title           TEXT NOT NULL,
  answer_snapshot JSONB NOT NULL,
  jurisdiction    TEXT NOT NULL DEFAULT 'United Kingdom',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  saved_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  model_used      TEXT NOT NULL DEFAULT 'EntireFM Intelligence Engine',
  source_count    INT NOT NULL DEFAULT 0,
  version         INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS lobby_saved_research_member_idx ON public.lobby_saved_research(member_id, saved_at DESC);
CREATE INDEX IF NOT EXISTS lobby_saved_research_session_idx ON public.lobby_saved_research(ask_session_id);

ALTER TABLE public.lobby_saved_research ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_lobby_saved_research" ON public.lobby_saved_research;
CREATE POLICY "service_role_lobby_saved_research"
  ON public.lobby_saved_research FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');


-- ============================================================
-- SCHEMA MIGRATIONS RECORD
-- ============================================================
INSERT INTO public._schema_migrations (version, applied_at)
VALUES (
  '0047_lobby_community_rooms_awards_research_persistence',
  now()
)
ON CONFLICT (version) DO NOTHING;

COMMIT;
