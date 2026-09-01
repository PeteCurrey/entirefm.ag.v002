/**
 * ENTIREFM UNIFIED OPERATIONS PLATFORM
 * MIGRATION 0030 — SUPPLIER DOMAIN CORE PERSISTENCE
 * ============================================================================
 * Canonical durable persistence for Supplier users, organisations, application
 * drafts, and invitations in Supabase.
 *
 * Replaces ephemeral in-memory state with durable cross-request PostgREST storage.
 */

-- ============================================================================
-- 1. SUPPLIER USERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.supplier_users (
  id                text        PRIMARY KEY,
  auth_user_id      text        NOT NULL UNIQUE,
  email             text        NOT NULL,
  first_name        text        NOT NULL DEFAULT '',
  last_name         text        NOT NULL DEFAULT '',
  organisation_id   text,
  role              text        NOT NULL DEFAULT 'SUPPLIER_ADMIN',
  status            text        NOT NULL DEFAULT 'ACTIVE',
  email_verified    boolean     NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_supplier_users_auth_user_id ON public.supplier_users (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_supplier_users_email ON public.supplier_users (lower(email));
CREATE INDEX IF NOT EXISTS idx_supplier_users_org_id ON public.supplier_users (organisation_id);

-- ============================================================================
-- 2. SUPPLIER ORGANISATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.supplier_organisations (
  id                    text        PRIMARY KEY,
  legal_name            text        NOT NULL,
  trading_name          text,
  company_number        text,
  vat_number            text,
  owner_id              text        NOT NULL,
  application_reference text        NOT NULL UNIQUE,
  lifecycle_status      text        NOT NULL DEFAULT 'DRAFT',
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_supplier_orgs_owner ON public.supplier_organisations (owner_id);
CREATE INDEX IF NOT EXISTS idx_supplier_orgs_company_num ON public.supplier_organisations (company_number);
CREATE INDEX IF NOT EXISTS idx_supplier_orgs_app_ref ON public.supplier_organisations (application_reference);
CREATE INDEX IF NOT EXISTS idx_supplier_orgs_legal_name ON public.supplier_organisations (lower(legal_name));

-- ============================================================================
-- 3. SUPPLIER APPLICATION DRAFTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.supplier_application_drafts (
  org_id                    text        PRIMARY KEY,
  application_reference     text        NOT NULL,
  current_step              integer     NOT NULL DEFAULT 1,
  lifecycle_status          text        NOT NULL DEFAULT 'DRAFT',
  legal_company_name        text,
  trading_name              text,
  company_number            text,
  vat_number                text,
  website_url               text,
  year_established          text,
  employee_count            text,
  trading_address           text,
  main_phone                text,
  general_email             text,
  business_type             text,
  company_summary           text,
  primary_contact_name      text,
  primary_contact_email     text,
  primary_contact_phone     text,
  ops_contact_name          text,
  ops_contact_email         text,
  selected_services         jsonb       NOT NULL DEFAULT '[]'::jsonb,
  selected_regions          jsonb       NOT NULL DEFAULT '[]'::jsonb,
  has_247                   boolean     NOT NULL DEFAULT false,
  emergency_sla_hours       text,
  has_subcontractors        boolean     NOT NULL DEFAULT false,
  direct_engineers          text,
  pl_insurer                text,
  pl_policy_number          text,
  pl_cover_limit            text,
  pl_expiry_date            text,
  selected_accreditations   jsonb       NOT NULL DEFAULT '[]'::jsonb,
  accreditation_numbers     jsonb       NOT NULL DEFAULT '{}'::jsonb,
  gas_safe_number           text,
  gas_safe_expiry           text,
  f_gas_number              text,
  f_gas_expiry              text,
  has_hs_policy             boolean     NOT NULL DEFAULT false,
  has_rams                  boolean     NOT NULL DEFAULT false,
  has_incident_history      boolean     NOT NULL DEFAULT false,
  anti_bribery              boolean     NOT NULL DEFAULT false,
  modern_slavery            boolean     NOT NULL DEFAULT false,
  code_of_conduct           boolean     NOT NULL DEFAULT false,
  truthfulness_declaration  boolean     NOT NULL DEFAULT false,
  payment_method            text        NOT NULL DEFAULT 'CARD',
  waiver_reason             text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. SUPPLIER INVITATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.supplier_invitations (
  id                    text        PRIMARY KEY,
  organisation_id       text        NOT NULL,
  email                 text        NOT NULL,
  role                  text        NOT NULL DEFAULT 'SUPPLIER_ADMIN',
  invited_by_auth_id    text        NOT NULL,
  status                text        NOT NULL DEFAULT 'PENDING',
  token                 text        NOT NULL UNIQUE,
  created_at            timestamptz NOT NULL DEFAULT now(),
  expires_at            timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_supplier_invitations_token ON public.supplier_invitations (token);
CREATE INDEX IF NOT EXISTS idx_supplier_invitations_email ON public.supplier_invitations (lower(email));
CREATE INDEX IF NOT EXISTS idx_supplier_invitations_org_id ON public.supplier_invitations (organisation_id);

-- ============================================================================
-- 5. RLS SECURITY POLICIES
-- ============================================================================

ALTER TABLE public.supplier_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_application_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_invitations ENABLE ROW LEVEL SECURITY;

-- Allow service role full access to all tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_supplier_users' AND tablename = 'supplier_users') THEN
    DROP POLICY IF EXISTS service_role_supplier_users ON public.supplier_users;
CREATE POLICY service_role_supplier_users ON public.supplier_users FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_supplier_orgs' AND tablename = 'supplier_organisations') THEN
    DROP POLICY IF EXISTS service_role_supplier_orgs ON public.supplier_organisations;
CREATE POLICY service_role_supplier_orgs ON public.supplier_organisations FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_supplier_drafts' AND tablename = 'supplier_application_drafts') THEN
    DROP POLICY IF EXISTS service_role_supplier_drafts ON public.supplier_application_drafts;
CREATE POLICY service_role_supplier_drafts ON public.supplier_application_drafts FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_supplier_invitations' AND tablename = 'supplier_invitations') THEN
    DROP POLICY IF EXISTS service_role_supplier_invitations ON public.supplier_invitations;
CREATE POLICY service_role_supplier_invitations ON public.supplier_invitations FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
