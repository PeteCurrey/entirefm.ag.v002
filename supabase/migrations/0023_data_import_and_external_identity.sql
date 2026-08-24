-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0023: DATA IMPORT AND EXTERNAL IDENTITY PROVENANCE
-- ============================================================================
-- Version: 1.0.0 (Phase 0I-PRE)
-- Purpose:
--   1. Data Provenance & External Identity Tracking (organisations, client_accounts, sites, provider_organisations)
--   2. Data Import Staging & Reconciliation Model (batches, files, rows, mappings, issues)
--   3. Strict Row Level Security (RLS) - Internal Admins Only
-- ============================================================================

-- ============================================================================
-- 1. DATA IMPORT STAGING TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.data_import_batches (
  id                        uuid primary key default gen_random_uuid(),
  batch_reference           text not null unique,
  entity_type               text not null check (entity_type in ('CLIENT', 'SITE', 'CONTRACTOR', 'ASSET', 'PPM_SCHEDULE', 'WORK_ORDER', 'GENERIC')),
  source_system             text not null default 'SIMPRO' check (source_system in ('SIMPRO', 'BIGCHANGE', 'JOBLOGIC', 'CSV', 'GENERIC_CSV', 'API')),
  status                    text not null default 'UPLOADED' check (status in ('UPLOADED', 'MAPPING_REQUIRED', 'VALIDATING', 'VALIDATION_FAILED', 'READY_FOR_REVIEW', 'IMPORTING', 'COMPLETED', 'COMPLETED_WITH_ERRORS', 'FAILED', 'ROLLED_BACK')),
  total_rows                integer not null default 0,
  valid_rows                integer not null default 0,
  error_rows                integer not null default 0,
  duplicate_rows            integer not null default 0,
  imported_rows             integer not null default 0,
  rolled_back_rows          integer not null default 0,
  mapping_config            jsonb default '{}'::jsonb,
  summary                   jsonb default '{}'::jsonb,
  created_by_person_id      uuid references public.persons(id),
  committed_by_person_id    uuid references public.persons(id),
  rolled_back_by_person_id  uuid references public.persons(id),
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  committed_at              timestamptz,
  rolled_back_at            timestamptz
);

CREATE TABLE IF NOT EXISTS public.data_import_files (
  id                        uuid primary key default gen_random_uuid(),
  batch_id                  uuid not null references public.data_import_batches(id) on delete cascade,
  filename                  text not null,
  file_size_bytes           integer not null default 0,
  mime_type                 text not null default 'text/csv',
  storage_path              text,
  file_checksum             text not null,
  raw_headers               jsonb not null default '[]'::jsonb,
  encoding                  text default 'utf-8',
  delimiter                 text default ',',
  created_at                timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.data_import_rows (
  id                        uuid primary key default gen_random_uuid(),
  batch_id                  uuid not null references public.data_import_batches(id) on delete cascade,
  row_index                 integer not null,
  raw_data                  jsonb not null,
  mapped_data               jsonb default '{}'::jsonb,
  row_hash                  text not null,
  status                    text not null default 'PENDING' check (status in ('PENDING', 'VALID', 'INVALID', 'DUPLICATE', 'SKIPPED', 'IMPORTED', 'FAILED', 'ROLLED_BACK')),
  target_entity_id          uuid,
  external_id               text,
  error_messages            jsonb default '[]'::jsonb,
  warning_messages          jsonb default '[]'::jsonb,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.data_import_mappings (
  id                        uuid primary key default gen_random_uuid(),
  name                      text not null,
  entity_type               text not null check (entity_type in ('CLIENT', 'SITE', 'CONTRACTOR', 'ASSET', 'PPM_SCHEDULE', 'WORK_ORDER', 'GENERIC')),
  source_system             text not null default 'SIMPRO',
  is_system_preset          boolean not null default false,
  column_mappings           jsonb not null default '{}'::jsonb,
  transform_rules           jsonb default '{}'::jsonb,
  created_by_person_id      uuid references public.persons(id),
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.data_import_issues (
  id                        uuid primary key default gen_random_uuid(),
  batch_id                  uuid not null references public.data_import_batches(id) on delete cascade,
  row_id                    uuid references public.data_import_rows(id) on delete cascade,
  row_index                 integer not null,
  severity                  text not null check (severity in ('ERROR', 'WARNING', 'INFO')),
  field_name                text,
  issue_code                text not null,
  message                   text not null,
  raw_value                 text,
  resolution                text default 'UNRESOLVED' check (resolution in ('UNRESOLVED', 'IGNORED', 'OVERRIDDEN', 'CORRECTED')),
  created_at                timestamptz not null default now()
);

-- ============================================================================
-- 2. DOMAIN TABLE PROVENANCE & EXTERNAL IDENTITY COLUMNS
-- ============================================================================

-- organisations
ALTER TABLE public.organisations
  ADD COLUMN IF NOT EXISTS source_system text default 'ENTIREFM',
  ADD COLUMN IF NOT EXISTS external_id text,
  ADD COLUMN IF NOT EXISTS import_batch_id uuid references public.data_import_batches(id) on delete set null,
  ADD COLUMN IF NOT EXISTS imported_at timestamptz,
  ADD COLUMN IF NOT EXISTS source_record_reference text,
  ADD COLUMN IF NOT EXISTS source_hash text;

-- client_accounts
ALTER TABLE public.client_accounts
  ADD COLUMN IF NOT EXISTS source_system text default 'ENTIREFM',
  ADD COLUMN IF NOT EXISTS external_id text,
  ADD COLUMN IF NOT EXISTS import_batch_id uuid references public.data_import_batches(id) on delete set null,
  ADD COLUMN IF NOT EXISTS imported_at timestamptz,
  ADD COLUMN IF NOT EXISTS source_record_reference text,
  ADD COLUMN IF NOT EXISTS source_hash text;

-- sites
ALTER TABLE public.sites
  ADD COLUMN IF NOT EXISTS source_system text default 'ENTIREFM',
  ADD COLUMN IF NOT EXISTS external_id text,
  ADD COLUMN IF NOT EXISTS import_batch_id uuid references public.data_import_batches(id) on delete set null,
  ADD COLUMN IF NOT EXISTS imported_at timestamptz,
  ADD COLUMN IF NOT EXISTS source_record_reference text,
  ADD COLUMN IF NOT EXISTS source_hash text;

-- provider_organisations
ALTER TABLE public.provider_organisations
  ADD COLUMN IF NOT EXISTS source_system text default 'ENTIREFM',
  ADD COLUMN IF NOT EXISTS external_id text,
  ADD COLUMN IF NOT EXISTS import_batch_id uuid references public.data_import_batches(id) on delete set null,
  ADD COLUMN IF NOT EXISTS imported_at timestamptz,
  ADD COLUMN IF NOT EXISTS source_record_reference text,
  ADD COLUMN IF NOT EXISTS source_hash text;

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_data_import_batches_ref ON public.data_import_batches (batch_reference);
CREATE INDEX IF NOT EXISTS idx_data_import_batches_status ON public.data_import_batches (status);
CREATE INDEX IF NOT EXISTS idx_data_import_files_batch ON public.data_import_files (batch_id);
CREATE INDEX IF NOT EXISTS idx_data_import_rows_batch_idx ON public.data_import_rows (batch_id, row_index);
CREATE INDEX IF NOT EXISTS idx_data_import_rows_hash ON public.data_import_rows (row_hash);
CREATE INDEX IF NOT EXISTS idx_data_import_rows_ext_id ON public.data_import_rows (external_id);
CREATE INDEX IF NOT EXISTS idx_data_import_issues_batch ON public.data_import_issues (batch_id);

CREATE INDEX IF NOT EXISTS idx_organisations_source_ext ON public.organisations (source_system, external_id);
CREATE INDEX IF NOT EXISTS idx_client_accounts_source_ext ON public.client_accounts (source_system, external_id);
CREATE INDEX IF NOT EXISTS idx_sites_source_ext ON public.sites (source_system, external_id);
CREATE INDEX IF NOT EXISTS idx_provider_organisations_source_ext ON public.provider_organisations (source_system, external_id);

-- ============================================================================
-- 4. SYSTEM PRESET MAPPINGS (SimPRO & Generic Presets)
-- ============================================================================

INSERT INTO public.data_import_mappings (name, entity_type, source_system, is_system_preset, column_mappings)
VALUES
  (
    'SimPRO Default Client Customer Export',
    'CLIENT',
    'SIMPRO',
    true,
    '{
      "CustomerID": "external_id",
      "CustomerName": "name",
      "CompanyName": "company_name",
      "AccountNo": "account_number",
      "Email": "email",
      "Phone": "phone",
      "Address": "address_line1",
      "City": "city",
      "State": "county",
      "PostalCode": "postcode",
      "Country": "country",
      "PaymentTerms": "payment_terms_days",
      "CreditLimit": "credit_limit_gbp"
    }'::jsonb
  ),
  (
    'SimPRO Default Site Export',
    'SITE',
    'SIMPRO',
    true,
    '{
      "SiteID": "external_id",
      "CustomerID": "parent_client_external_id",
      "CustomerName": "parent_client_name",
      "SiteName": "name",
      "SiteCode": "site_code",
      "Address": "address_line1",
      "Street2": "address_line2",
      "City": "city",
      "State": "county",
      "PostalCode": "postcode",
      "Country": "country",
      "SiteType": "site_type"
    }'::jsonb
  ),
  (
    'SimPRO Default Contractor / Supplier Export',
    'CONTRACTOR',
    'SIMPRO',
    true,
    '{
      "SupplierID": "external_id",
      "SupplierName": "name",
      "Trade": "primary_trade",
      "Email": "email",
      "Phone": "phone",
      "Address": "address_line1",
      "City": "city",
      "PostalCode": "postcode",
      "CompanyNumber": "company_number",
      "VATNumber": "vat_number"
    }'::jsonb
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.data_import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_import_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_import_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_import_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_import_issues ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS
-- Internal Admin Access Policy
DO $$ BEGIN
  CREATE POLICY data_import_batches_admin_all ON public.data_import_batches
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.organisation_memberships m
        JOIN public.organisations o ON o.id = m.organisation_id
        WHERE m.person_id = auth.uid()
          AND o.org_type = 'ENTIREFM'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY data_import_files_admin_all ON public.data_import_files
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.organisation_memberships m
        JOIN public.organisations o ON o.id = m.organisation_id
        WHERE m.person_id = auth.uid()
          AND o.org_type = 'ENTIREFM'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY data_import_rows_admin_all ON public.data_import_rows
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.organisation_memberships m
        JOIN public.organisations o ON o.id = m.organisation_id
        WHERE m.person_id = auth.uid()
          AND o.org_type = 'ENTIREFM'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY data_import_mappings_admin_all ON public.data_import_mappings
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.organisation_memberships m
        JOIN public.organisations o ON o.id = m.organisation_id
        WHERE m.person_id = auth.uid()
          AND o.org_type = 'ENTIREFM'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY data_import_issues_admin_all ON public.data_import_issues
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.organisation_memberships m
        JOIN public.organisations o ON o.id = m.organisation_id
        WHERE m.person_id = auth.uid()
          AND o.org_type = 'ENTIREFM'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
