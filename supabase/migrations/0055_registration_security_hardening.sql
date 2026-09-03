-- ============================================================================
-- ENTIREFM MIGRATION 0055: REGISTRATION SECURITY HARDENING
-- ============================================================================
-- Implements:
--   1. registration_security_events — persistent security audit log
--   2. Explicit DENY RLS on lobby_members for anon/authenticated INSERT/DELETE
--   3. Member self-read RLS on lobby_members (SELECT own row by auth_user_id)
--   4. Narrow user_identities self-update to safe columns only
--   5. risk_score + security_flags columns on lobby_members
--   6. Index on lobby_members.created_at for velocity queries
--   7. Add 'blocked' as explicit status (already covered by 'banned', documented)
-- ============================================================================

-- ── 1. SECURITY EVENT LOG ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.registration_security_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type      text NOT NULL,
  -- e.g. REGISTRATION_ATTEMPTED, TURNSTILE_FAILED, HONEYPOT_TRIGGERED,
  --      RATE_LIMITED, DISPOSABLE_EMAIL, EMAIL_VERIFIED, ACCOUNT_SUSPENDED,
  --      ACCOUNT_BLOCKED, SUSPICIOUS_REGISTRATION, REGISTRATION_BLOCKED,
  --      SIGNIN_RATE_LIMITED, PASSWORD_RESET_RATE_LIMITED
  ip_address      text,           -- Hashed or truncated for GDPR minimisation
  user_agent_hash text,           -- SHA-256 of user-agent string
  email_domain    text,           -- Domain portion only (not full email)
  auth_user_id    uuid,           -- Set once account is created
  member_id       uuid,           -- Set once lobby_members record exists
  risk_score      integer,        -- 0-100
  details         jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Retention: events older than 90 days are not personally identifiable (no full email stored)
COMMENT ON TABLE public.registration_security_events IS
  'Immutable security event log for registration and authentication abuse. '
  'No full email addresses stored — only domain. IP addresses are raw for '
  'admin review but should be treated as personal data under UK GDPR.';

CREATE INDEX IF NOT EXISTS idx_security_events_type    ON public.registration_security_events (event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_ip      ON public.registration_security_events (ip_address);
CREATE INDEX IF NOT EXISTS idx_security_events_created ON public.registration_security_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_member  ON public.registration_security_events (member_id);

-- RLS: only service_role can write or read
ALTER TABLE public.registration_security_events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'registration_security_events' AND policyname = 'security_events_service_role'
  ) THEN
    CREATE POLICY security_events_service_role
      ON public.registration_security_events
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Explicit deny for anon and authenticated (belt-and-suspenders)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'registration_security_events' AND policyname = 'security_events_deny_public'
  ) THEN
    CREATE POLICY security_events_deny_public
      ON public.registration_security_events
      FOR ALL TO anon, authenticated
      USING (false);
  END IF;
END $$;

-- ── 2. RISK SCORE & SECURITY FLAGS ON LOBBY_MEMBERS ────────────────────────

ALTER TABLE public.lobby_members
  ADD COLUMN IF NOT EXISTS risk_score      integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS security_flags  text[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS registration_ip text;

COMMENT ON COLUMN public.lobby_members.risk_score IS
  'Registration risk score 0-100. >50 = flagged for review. >80 = auto-restricted.';
COMMENT ON COLUMN public.lobby_members.security_flags IS
  'Array of security signal codes e.g. HONEYPOT, DISPOSABLE_EMAIL, HIGH_VELOCITY';
COMMENT ON COLUMN public.lobby_members.registration_ip IS
  'IP address used at registration time. Admin-only visibility via service_role.';

-- Index for velocity / risk queries
CREATE INDEX IF NOT EXISTS idx_lobby_members_created_at ON public.lobby_members (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lobby_members_risk_score ON public.lobby_members (risk_score DESC);

-- ── 3. EXPLICIT DENY RLS ON LOBBY_MEMBERS ──────────────────────────────────
-- Ensures that even if someone calls PostgREST directly with their Supabase
-- JWT, they cannot INSERT, UPDATE, or DELETE any lobby_members row.
-- The application only writes lobby_members via service_role.

ALTER TABLE public.lobby_members ENABLE ROW LEVEL SECURITY;

-- Deny INSERT from any authenticated/anon JWT
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'lobby_members' AND policyname = 'lobby_members_deny_insert'
  ) THEN
    CREATE POLICY lobby_members_deny_insert
      ON public.lobby_members
      FOR INSERT TO anon, authenticated
      WITH CHECK (false);
  END IF;
END $$;

-- Deny DELETE from any authenticated/anon JWT
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'lobby_members' AND policyname = 'lobby_members_deny_delete'
  ) THEN
    CREATE POLICY lobby_members_deny_delete
      ON public.lobby_members
      FOR DELETE TO anon, authenticated
      USING (false);
  END IF;
END $$;

-- Deny UPDATE from any authenticated/anon JWT
-- (Application updates go through service_role only)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'lobby_members' AND policyname = 'lobby_members_deny_update'
  ) THEN
    CREATE POLICY lobby_members_deny_update
      ON public.lobby_members
      FOR UPDATE TO anon, authenticated
      USING (false) WITH CHECK (false);
  END IF;
END $$;

-- Allow authenticated user to SELECT their own row (by auth_user_id)
-- This is needed for future client-side reads; does not expose other members.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'lobby_members' AND policyname = 'lobby_members_self_select'
  ) THEN
    CREATE POLICY lobby_members_self_select
      ON public.lobby_members
      FOR SELECT TO authenticated
      USING (auth.uid() = auth_user_id);
  END IF;
END $$;

-- Deny SELECT for anon (no public member data exposure via direct API)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'lobby_members' AND policyname = 'lobby_members_deny_anon_select'
  ) THEN
    CREATE POLICY lobby_members_deny_anon_select
      ON public.lobby_members
      FOR SELECT TO anon
      USING (false);
  END IF;
END $$;

-- ── 4. NARROW user_identities SELF-UPDATE ──────────────────────────────────
-- Previous policy allowed authenticated users to UPDATE any column on their
-- own user_identities row, including 'status'. Replace with a restricted
-- function-based update that only allows display_name / first_name / last_name.

DROP POLICY IF EXISTS user_identities_self_update ON public.user_identities;

-- The application never needs users to update user_identities directly.
-- All updates happen via service_role (triggered by auth.users sync trigger).
-- So we explicitly deny authenticated self-update.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_identities' AND policyname = 'user_identities_deny_self_update'
  ) THEN
    CREATE POLICY user_identities_deny_self_update
      ON public.user_identities
      FOR UPDATE TO authenticated
      USING (false) WITH CHECK (false);
  END IF;
END $$;

-- ── 5. SECURITY EVENTS VIEW FOR ADMIN ──────────────────────────────────────

DROP VIEW IF EXISTS public.admin_security_events_summary CASCADE;

CREATE OR REPLACE VIEW public.admin_security_events_summary
WITH (security_invoker = true) AS
SELECT
  event_type,
  ip_address,
  email_domain,
  risk_score,
  security_flags,
  details,
  created_at,
  member_id,
  auth_user_id
FROM public.registration_security_events
ORDER BY created_at DESC;

REVOKE ALL ON public.admin_security_events_summary FROM anon, authenticated, public;
GRANT SELECT ON public.admin_security_events_summary TO service_role;

-- ── 6. SPAM ACCOUNT IDENTIFICATION VIEW ─────────────────────────────────────
-- Provides a safe query for admins to identify suspicious accounts without
-- destructive operations.

DROP VIEW IF EXISTS public.admin_suspicious_members CASCADE;

CREATE OR REPLACE VIEW public.admin_suspicious_members
WITH (security_invoker = true) AS
SELECT
  lm.id,
  lm.email,
  lm.display_name,
  lm.username,
  lm.member_status,
  lm.risk_score,
  lm.security_flags,
  lm.registration_ip,
  lm.joined_at,
  lm.last_active_at,
  lm.email_verified_at,
  lm.company,
  lm.job_title,
  SPLIT_PART(lm.email, '@', 2) AS email_domain,
  -- Signals
  (lm.email_verified_at IS NULL AND lm.joined_at < now() - interval '48 hours') AS stale_unverified,
  (lm.risk_score >= 50)                                                           AS high_risk,
  (lm.security_flags != '{}')                                                     AS has_security_flags,
  (lm.bio IS NULL AND lm.company IS NULL AND lm.job_title IS NULL)                AS empty_profile,
  ui.email_verified                                                                AS auth_email_verified
FROM public.lobby_members lm
LEFT JOIN public.user_identities ui ON ui.auth_user_id = lm.auth_user_id
WHERE
  lm.member_status NOT IN ('deleted')
  AND (
    lm.risk_score >= 30
    OR lm.member_status = 'pending_verification'
    OR lm.security_flags != '{}'
    OR (lm.email_verified_at IS NULL AND lm.joined_at < now() - interval '48 hours')
  )
ORDER BY lm.risk_score DESC, lm.joined_at DESC;

REVOKE ALL ON public.admin_suspicious_members FROM anon, authenticated, public;
GRANT SELECT ON public.admin_suspicious_members TO service_role;

-- Done.
