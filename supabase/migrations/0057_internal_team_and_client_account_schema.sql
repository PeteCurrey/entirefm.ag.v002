-- ============================================================================
-- ENTIREFM MIGRATION 0057: INTERNAL TEAM SCHEMA & CLIENT ACCOUNT HARDENING
-- ============================================================================
-- Purpose:
--   1. Add missing columns to client_accounts that the application code already
--      expects (name, account_number, account_tier, account_status,
--      primary_contact_id). These columns were referenced in the estate server
--      module but never added to the schema, causing every client_accounts
--      query to fail silently via PostgREST.
--   2. Explicit service_role RLS policies on persons, client_accounts,
--      organisations, and organisation_memberships so the server-side DB
--      client (using the service role key) has guaranteed read/write access.
--   3. Indexes for account manager eligibility queries.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTEND client_accounts WITH MISSING COLUMNS
-- ----------------------------------------------------------------------------

ALTER TABLE public.client_accounts
  ADD COLUMN IF NOT EXISTS name             text,
  ADD COLUMN IF NOT EXISTS account_number   text,
  ADD COLUMN IF NOT EXISTS account_tier     text NOT NULL DEFAULT 'CORPORATE',
  ADD COLUMN IF NOT EXISTS account_status   text NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS primary_contact_id uuid REFERENCES public.persons(id) ON DELETE SET NULL;

-- Backfill account_number from account_code where null
UPDATE public.client_accounts
SET account_number = account_code
WHERE account_number IS NULL OR account_number = '';

-- Backfill name from linked organisation where null
UPDATE public.client_accounts ca
SET name = o.name
FROM public.organisations o
WHERE ca.organisation_id = o.id
  AND (ca.name IS NULL OR ca.name = '');

-- Ensure every row has a name at minimum
UPDATE public.client_accounts
SET name = 'Client Account ' || id::text
WHERE name IS NULL OR name = '';

-- Ensure every row has an account_number
UPDATE public.client_accounts
SET account_number = 'CLA-' || to_char(created_at, 'YYYY') || '-' || LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::text, 4, '0')
WHERE account_number IS NULL OR account_number = '';

-- Add unique constraint on account_number (safe, run after backfill)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'client_accounts_account_number_key'
    AND conrelid = 'public.client_accounts'::regclass
  ) THEN
    ALTER TABLE public.client_accounts ADD CONSTRAINT client_accounts_account_number_key UNIQUE (account_number);
  END IF;
END $$;

-- Index for common query patterns
CREATE INDEX IF NOT EXISTS idx_client_accounts_account_status ON public.client_accounts (account_status);
CREATE INDEX IF NOT EXISTS idx_client_accounts_account_tier   ON public.client_accounts (account_tier);
CREATE INDEX IF NOT EXISTS idx_client_accounts_account_manager ON public.client_accounts (account_manager_id);
CREATE INDEX IF NOT EXISTS idx_client_accounts_name           ON public.client_accounts (lower(name));

-- ----------------------------------------------------------------------------
-- 2. SERVICE ROLE RLS POLICIES
--    All server-side DB calls use the service role key via PostgREST.
--    Explicit service_role policies prevent any ambiguity.
-- ----------------------------------------------------------------------------

-- persons
DROP POLICY IF EXISTS "service_role_persons" ON public.persons;
CREATE POLICY "service_role_persons"
  ON public.persons FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- client_accounts
DROP POLICY IF EXISTS "service_role_client_accounts" ON public.client_accounts;
CREATE POLICY "service_role_client_accounts"
  ON public.client_accounts FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- organisations
DROP POLICY IF EXISTS "service_role_organisations" ON public.organisations;
CREATE POLICY "service_role_organisations"
  ON public.organisations FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- organisation_memberships
DROP POLICY IF EXISTS "service_role_org_memberships" ON public.organisation_memberships;
CREATE POLICY "service_role_org_memberships"
  ON public.organisation_memberships FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- roles (needed for membership joins)
DROP POLICY IF EXISTS "service_role_roles" ON public.roles;
CREATE POLICY "service_role_roles"
  ON public.roles FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 3. INDEXES FOR ACCOUNT MANAGER ELIGIBILITY QUERIES
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_persons_status          ON public.persons (status);
CREATE INDEX IF NOT EXISTS idx_persons_email           ON public.persons (lower(email));
CREATE INDEX IF NOT EXISTS idx_org_memberships_org     ON public.organisation_memberships (organisation_id, status);
CREATE INDEX IF NOT EXISTS idx_org_memberships_person  ON public.organisation_memberships (person_id, status);
