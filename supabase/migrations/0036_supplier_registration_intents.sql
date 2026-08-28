-- ============================================================================
-- MIGRATION 0036: SUPPLIER REGISTRATION INTENTS (ORPHAN DETECTION)
-- ============================================================================
-- Lightweight outbox table written immediately after Supabase Auth signup.
-- If org/draft creation fails, this record remains in PENDING_ORG_SETUP state.
-- Admin can query supplier_registration_intents for orphaned auth users.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.supplier_registration_intents (
  auth_user_id       TEXT        PRIMARY KEY,
  email              TEXT        NOT NULL,
  first_name         TEXT        NOT NULL DEFAULT '',
  last_name          TEXT        NOT NULL DEFAULT '',
  status             TEXT        NOT NULL DEFAULT 'PENDING_ORG_SETUP',
  -- PENDING_ORG_SETUP | ORG_CREATED | COMPLETED | FAILED | CLASSIFIED_BY_ADMIN
  application_type   TEXT        NOT NULL DEFAULT 'CONTRACTOR',
  registration_source TEXT       NOT NULL DEFAULT 'CONTRACTOR_ONBOARDING',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  org_created_at     TIMESTAMPTZ,
  draft_created_at   TIMESTAMPTZ,
  completed_at       TIMESTAMPTZ,
  failure_reason     TEXT,
  classified_by      TEXT,
  classified_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_registration_intents_status
  ON public.supplier_registration_intents (status);

CREATE INDEX IF NOT EXISTS idx_registration_intents_email
  ON public.supplier_registration_intents (lower(email));

ALTER TABLE public.supplier_registration_intents ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'service_role_registration_intents'
      AND tablename  = 'supplier_registration_intents'
  ) THEN
    CREATE POLICY service_role_registration_intents
      ON public.supplier_registration_intents
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

COMMENT ON TABLE public.supplier_registration_intents IS
  'Outbox: created immediately after Supabase Auth signup.
   Records older than 1h with status PENDING_ORG_SETUP are detectable orphans.
   Admin recovery via /admin/suppliers/applications?status=ORPHAN.';
