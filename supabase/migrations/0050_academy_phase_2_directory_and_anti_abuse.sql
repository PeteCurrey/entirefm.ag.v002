-- =============================================================================
-- Migration 0050: Academy Phase 2 — Public Directory, Admin Authoring & Anti-Abuse
-- =============================================================================

-- 1. Add directory_opt_in to lobby_members (Default FALSE: Opt-in, not default-on)
ALTER TABLE public.lobby_members
  ADD COLUMN IF NOT EXISTS directory_opt_in BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_lobby_members_directory_opt_in 
  ON public.lobby_members (directory_opt_in);

-- 2. Add audit trail columns to academy_learning_paths
ALTER TABLE public.academy_learning_paths
  ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- Ensure status check includes 'archived'
DO $$
BEGIN
  ALTER TABLE public.academy_learning_paths 
    DROP CONSTRAINT IF EXISTS academy_learning_paths_status_check;
  
  ALTER TABLE public.academy_learning_paths 
    ADD CONSTRAINT academy_learning_paths_status_check 
    CHECK (status IN ('draft', 'published', 'archived'));
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 3. Add audit trail and version columns to academy_assessments
ALTER TABLE public.academy_assessments
  ADD COLUMN IF NOT EXISTS updated_by TEXT,
  ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1;

-- 4. Add attempt_history JSONB to academy_member_certifications for anti-abuse tracking
ALTER TABLE public.academy_member_certifications
  ADD COLUMN IF NOT EXISTS attempt_history JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Comment on changes
COMMENT ON COLUMN public.lobby_members.directory_opt_in IS 
  'Explicit opt-in toggle for appearing in the public FM Practitioner Directory. Off by default.';

COMMENT ON COLUMN public.academy_member_certifications.attempt_history IS 
  'Immutable log of assessment attempts containing timestamps, scores, and client fingerprints for anti-abuse monitoring.';
