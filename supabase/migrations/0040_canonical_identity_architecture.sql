-- ============================================================================
-- ENTIREFM MIGRATION 0040: CANONICAL IDENTITY ARCHITECTURE & LOBBY REGISTRY
-- ============================================================================
-- Architecture:
-- 1. One Human = One Supabase Auth User (auth.users.id is canonical root)
-- 2. user_identities (1:1 with auth.users)
-- 3. lobby_members (1:1 with auth.users if member, NOT NULL UNIQUE auth_user_id)
-- 4. operational_identities (1:0..1 with auth.users, UNIQUE auth_user_id enforces exclusivity:
--    A user can have AT MOST ONE of CLIENT, ENGINEER, CONTRACTOR)
-- 5. admin_user_identity_directory (Secure administrative SQL View)
-- 6. user_identity_audit_log (Immutable identity event log)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. BASE IDENTITY: public.user_identities
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_identities (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id            uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  person_id               uuid,
  email                   text,
  primary_email_snapshot  text,
  display_name            text,
  first_name              text,
  last_name               text,
  status                  text NOT NULL DEFAULT 'ACTIVE',
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

-- Safely extend user_identities if it already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_identities' AND column_name = 'primary_email_snapshot') THEN
    ALTER TABLE public.user_identities ADD COLUMN primary_email_snapshot text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_identities' AND column_name = 'display_name') THEN
    ALTER TABLE public.user_identities ADD COLUMN display_name text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_identities' AND column_name = 'first_name') THEN
    ALTER TABLE public.user_identities ADD COLUMN first_name text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_identities' AND column_name = 'last_name') THEN
    ALTER TABLE public.user_identities ADD COLUMN last_name text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_identities' AND column_name = 'status') THEN
    ALTER TABLE public.user_identities ADD COLUMN status text NOT NULL DEFAULT 'ACTIVE';
  END IF;
END $$;

-- Populate primary_email_snapshot from email if null
UPDATE public.user_identities SET primary_email_snapshot = email WHERE primary_email_snapshot IS NULL AND email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_identities_auth_user_id ON public.user_identities (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_identities_email ON public.user_identities (lower(COALESCE(primary_email_snapshot, email, '')));

-- ----------------------------------------------------------------------------
-- 2. LOBBY MEMBERSHIP: public.lobby_members
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lobby_members (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id            uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email                   text NOT NULL,
  display_name            text NOT NULL,
  first_name              text NOT NULL,
  last_name               text NOT NULL,
  username                text NOT NULL UNIQUE,
  avatar_url              text,
  headline                text,
  bio                     text,
  company                 text,
  job_title               text,
  location                text,
  website                 text,
  linkedin_url            text,
  member_status           text NOT NULL DEFAULT 'active' CHECK (member_status IN ('pending_verification', 'active', 'restricted', 'suspended', 'banned', 'deleted')),
  profile_visibility      text NOT NULL DEFAULT 'public' CHECK (profile_visibility IN ('public', 'members_only', 'private')),
  disciplines             text[] DEFAULT '{}',
  sectors                 text[] DEFAULT '{}',
  qualifications          text[] DEFAULT '{}',
  badges                  text[] DEFAULT '{ "Lobby Member" }',
  reputation_score        integer NOT NULL DEFAULT 10,
  saved_content_ids       text[] DEFAULT '{}',
  email_preferences       jsonb DEFAULT '{"weeklyBriefing": true, "communityUpdates": true, "directMessages": true, "marketingConsent": false}'::jsonb,
  notification_preferences jsonb DEFAULT '{"inApp": true, "emailDigest": true, "mentionAlerts": true}'::jsonb,
  policy_consents         jsonb DEFAULT '[]'::jsonb,
  email_verified_at       timestamptz,
  last_active_at          timestamptz DEFAULT now(),
  joined_at               timestamptz DEFAULT now(),
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lobby_members_auth_user_id ON public.lobby_members (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_lobby_members_username ON public.lobby_members (lower(username));
CREATE INDEX IF NOT EXISTS idx_lobby_members_email ON public.lobby_members (lower(email));
CREATE INDEX IF NOT EXISTS idx_lobby_members_status ON public.lobby_members (member_status);

-- ----------------------------------------------------------------------------
-- 3. OPERATIONAL IDENTITY: public.operational_identities
-- ----------------------------------------------------------------------------
-- EXCLUSIVITY MECHANISM: auth_user_id is UNIQUE.
-- One auth user can have at most ONE operational identity: CLIENT, ENGINEER, or CONTRACTOR.
CREATE TABLE IF NOT EXISTS public.operational_identities (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id            uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  identity_type           text NOT NULL CHECK (identity_type IN ('CLIENT', 'ENGINEER', 'CONTRACTOR')),
  organisation_id         text,
  organisation_name       text,
  role_code               text NOT NULL DEFAULT 'CONTRACTOR_ADMIN',
  status                  text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PENDING', 'SUSPENDED', 'ARCHIVED')),
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_operational_identities_auth_user_id ON public.operational_identities (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_operational_identities_type ON public.operational_identities (identity_type);
CREATE INDEX IF NOT EXISTS idx_operational_identities_org ON public.operational_identities (organisation_id);

-- ----------------------------------------------------------------------------
-- 4. IDENTITY AUDIT LOG: public.user_identity_audit_log
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_identity_audit_log (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id            uuid NOT NULL,
  action                  text NOT NULL,
  actor_id                text NOT NULL,
  details                 jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_identity_audit_auth_user ON public.user_identity_audit_log (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_identity_audit_created ON public.user_identity_audit_log (created_at);

-- ----------------------------------------------------------------------------
-- 5. SECURE IDENTITY DIRECTORY VIEW: public.admin_user_identity_directory
-- ----------------------------------------------------------------------------
DROP VIEW IF EXISTS public.admin_user_identity_directory CASCADE;

CREATE OR REPLACE VIEW public.admin_user_identity_directory AS
SELECT
  u.id AS auth_user_id,
  u.email AS email,
  (u.email_confirmed_at IS NOT NULL) AS email_verified,
  COALESCE(
    lm.display_name,
    ui.display_name,
    NULLIF(TRIM(CONCAT(COALESCE(u.raw_user_meta_data->>'first_name', ''), ' ', COALESCE(u.raw_user_meta_data->>'last_name', ''))), ''),
    u.email
  ) AS display_name,
  COALESCE(lm.first_name, ui.first_name, u.raw_user_meta_data->>'first_name') AS first_name,
  COALESCE(lm.last_name, ui.last_name, u.raw_user_meta_data->>'last_name') AS last_name,
  (lm.id IS NOT NULL) AS is_lobby_member,
  COALESCE(lm.member_status, 'none') AS lobby_member_status,
  lm.username AS lobby_username,
  lm.joined_at AS lobby_joined_at,
  COALESCE(oi.identity_type, 'NONE') AS operational_identity_type,
  COALESCE(oi.status, 'NONE') AS operational_status,
  COALESCE(oi.organisation_id, so.id) AS organisation_id,
  COALESCE(oi.organisation_name, so.legal_name) AS organisation_name,
  COALESCE(oi.role_code, 'NONE') AS operational_role_code,
  u.created_at AS auth_created_at,
  u.last_sign_in_at AS last_sign_in_at
FROM auth.users u
LEFT JOIN public.user_identities ui ON ui.auth_user_id = u.id
LEFT JOIN public.lobby_members lm ON lm.auth_user_id = u.id
LEFT JOIN public.operational_identities oi ON oi.auth_user_id = u.id
LEFT JOIN public.supplier_organisations so ON so.owner_id = u.id;

-- Security: Enable RLS on base tables
ALTER TABLE public.user_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operational_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_identity_audit_log ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_user_identities' AND tablename = 'user_identities') THEN
    DROP POLICY IF EXISTS service_role_user_identities ON public.user_identities;
CREATE POLICY service_role_user_identities ON public.user_identities FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_lobby_members' AND tablename = 'lobby_members') THEN
    DROP POLICY IF EXISTS service_role_lobby_members ON public.lobby_members;
CREATE POLICY service_role_lobby_members ON public.lobby_members FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_operational_identities' AND tablename = 'operational_identities') THEN
    DROP POLICY IF EXISTS service_role_operational_identities ON public.operational_identities;
CREATE POLICY service_role_operational_identities ON public.operational_identities FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_identity_audit' AND tablename = 'user_identity_audit_log') THEN
    DROP POLICY IF EXISTS service_role_identity_audit ON public.user_identity_audit_log;
CREATE POLICY service_role_identity_audit ON public.user_identity_audit_log FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
