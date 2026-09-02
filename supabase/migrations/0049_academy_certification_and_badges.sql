-- ============================================================
-- MIGRATION 0049: ACADEMY CERTIFICATION & BADGES DATA MODEL
-- ============================================================
-- 1. public.academy_learning_paths
-- 2. public.academy_assessments
-- 3. public.academy_member_certifications
-- 4. RLS policies and server-side integrity guarantees
-- ============================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 1. ACADEMY LEARNING PATHS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.academy_learning_paths (
  id                  TEXT PRIMARY KEY,
  slug                TEXT UNIQUE NOT NULL,
  title               TEXT NOT NULL,
  description         TEXT NOT NULL,
  target_role         TEXT NOT NULL,
  modules             JSONB NOT NULL DEFAULT '[]'::jsonb,
  pass_mark_percent   INT NOT NULL CHECK (pass_mark_percent >= 50 AND pass_mark_percent <= 100),
  status              TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academy_paths_slug ON public.academy_learning_paths (slug);
CREATE INDEX IF NOT EXISTS idx_academy_paths_status ON public.academy_learning_paths (status);

-- ------------------------------------------------------------
-- 2. ACADEMY ASSESSMENTS (Server-graded only)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.academy_assessments (
  id                  TEXT PRIMARY KEY,
  path_id             TEXT UNIQUE NOT NULL REFERENCES public.academy_learning_paths(id) ON DELETE CASCADE,
  questions           JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academy_assessments_path_id ON public.academy_assessments (path_id);

-- ------------------------------------------------------------
-- 3. ACADEMY MEMBER CERTIFICATIONS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.academy_member_certifications (
  id                  TEXT PRIMARY KEY,
  member_uid          TEXT NOT NULL, -- Supabase auth.uid
  path_id             TEXT NOT NULL REFERENCES public.academy_learning_paths(id) ON DELETE CASCADE,
  started_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at        TIMESTAMPTZ,
  attempt_count       INT NOT NULL DEFAULT 0,
  score               NUMERIC(5, 2),
  status              TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'passed', 'failed')),
  badge_issued_at     TIMESTAMPTZ,
  public_cert_id      TEXT UNIQUE,
  last_attempt_at     TIMESTAMPTZ,
  viewed_modules      JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_academy_member_path UNIQUE (member_uid, path_id)
);

CREATE INDEX IF NOT EXISTS idx_academy_cert_member ON public.academy_member_certifications (member_uid);
CREATE INDEX IF NOT EXISTS idx_academy_cert_path ON public.academy_member_certifications (path_id);
CREATE INDEX IF NOT EXISTS idx_academy_cert_public_id ON public.academy_member_certifications (public_cert_id);
CREATE INDEX IF NOT EXISTS idx_academy_cert_status ON public.academy_member_certifications (status);

-- ------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------
ALTER TABLE public.academy_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_member_certifications ENABLE ROW LEVEL SECURITY;

-- 4A. Learning Paths RLS:
-- Anyone (anon or authenticated) can view published paths.
-- Drafts are strictly invisible to clients/members.
DROP POLICY IF EXISTS "Public can view published learning paths" ON public.academy_learning_paths;
CREATE POLICY "Public can view published learning paths"
  ON public.academy_learning_paths
  FOR SELECT
  USING (status = 'published');

-- 4B. Assessments RLS:
-- Assessment questions contain correctOptionId.
-- Direct client SELECT via PostgREST/anon/authenticated role is DENIED.
-- Clients MUST fetch sanitized questions via the server-side API or RPC.
-- Service role has full access.
DROP POLICY IF EXISTS "Deny direct client read of assessment questions" ON public.academy_assessments;
CREATE POLICY "Deny direct client read of assessment questions"
  ON public.academy_assessments
  FOR SELECT
  TO authenticated, anon
  USING (false);

-- 4C. Member Certifications RLS:
-- Read: A member can ONLY read their own certification records.
DROP POLICY IF EXISTS "Members can view own certifications" ON public.academy_member_certifications;
CREATE POLICY "Members can view own certifications"
  ON public.academy_member_certifications
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = member_uid);

-- Insert: A member can initialize their own in-progress certification record.
-- Must enforce that status starts at 'in_progress', completed_at is null, score is null, badge_issued_at is null.
DROP POLICY IF EXISTS "Members can initialize own in-progress certification" ON public.academy_member_certifications;
CREATE POLICY "Members can initialize own in-progress certification"
  ON public.academy_member_certifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid()::text = member_uid
    AND status = 'in_progress'
    AND score IS NULL
    AND completed_at IS NULL
    AND badge_issued_at IS NULL
    AND public_cert_id IS NULL
  );

-- Update: Members can update viewed_modules, but CANNOT tamper with status, score, completed_at, or badge_issued_at.
-- Only server-side (service_role) can set status to 'passed' or set scores/badges.
DROP POLICY IF EXISTS "Members can update viewed modules only" ON public.academy_member_certifications;
CREATE POLICY "Members can update viewed modules only"
  ON public.academy_member_certifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = member_uid)
  WITH CHECK (
    auth.uid()::text = member_uid
    AND status = 'in_progress'
    AND score IS NULL
    AND completed_at IS NULL
    AND badge_issued_at IS NULL
  );

-- ------------------------------------------------------------
-- 5. PUBLIC CERTIFICATE VERIFICATION VIEW / RPC (Sanitized)
-- ------------------------------------------------------------
-- Public unauthenticated verification view:
-- Exposes ONLY public verification data (no member_uid, no raw scores, no attempt logs)
CREATE OR REPLACE VIEW public.public_verified_credentials AS
  SELECT 
    c.public_cert_id,
    c.badge_issued_at,
    p.title AS path_title,
    p.target_role,
    p.slug AS path_slug,
    COALESCE(m.display_name, 'Verified FM Professional') AS recipient_name,
    m.company AS recipient_company
  FROM public.academy_member_certifications c
  JOIN public.academy_learning_paths p ON p.id = c.path_id
  LEFT JOIN public.lobby_members m ON m.auth_user_id = c.member_uid
  WHERE c.status = 'passed' AND c.public_cert_id IS NOT NULL;

COMMIT;
