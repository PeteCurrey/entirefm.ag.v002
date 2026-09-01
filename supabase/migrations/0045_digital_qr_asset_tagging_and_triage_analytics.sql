-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0045: DIGITAL QR ASSET TAGGING, WORK ORDER TRIAGE & CONTRACTOR TOOLKIT
-- ============================================================================
-- Extends the CAFM foundation with:
--   1. public.asset_scans               (Auditable physical attendance & QR scan log)
--   2. public.contractor_brand_profiles (Contractor custom branding for independent docs)
--   3. public.contractor_clients        (Contractor independent customer directory)
--   4. public.contractor_independent_jobs (Contractor non-EntireFM work orders)
--   5. public.contractor_documents      (Generated / saved trade documents & reports)
-- ============================================================================

-- 1. ASSET SCANS & ATTENDANCE VERIFICATION LOG
create table if not exists public.asset_scans (
  id                      uuid primary key default gen_random_uuid(),
  asset_id                uuid not null references public.assets(id) on delete cascade,
  work_order_id           uuid references public.work_orders(id) on delete set null,
  site_id                 uuid references public.sites(id) on delete set null,
  scanned_by_person_id    uuid references public.persons(id) on delete set null,
  organisation_id         uuid not null references public.organisations(id) on delete cascade,
  scan_event_type         text not null default 'GENERAL_SCAN',
  -- GENERAL_SCAN | CHECK_IN | ATTENDANCE_VERIFIED | INSPECTION | PPM_ATTENDANCE | DEFECT_REPORT | AUDIT
  latitude                numeric(10, 7),
  longitude               numeric(10, 7),
  accuracy_meters         numeric(8, 2),
  device_metadata         jsonb default '{}'::jsonb,
  -- user_agent, platform, ip_hash, browser, screen_resolution
  notes                   text,
  verified_physical       boolean not null default false,
  created_at              timestamptz not null default now()
);

create index if not exists idx_asset_scans_asset_id ON public.asset_scans(asset_id);
create index if not exists idx_asset_scans_org_id ON public.asset_scans(organisation_id);
create index if not exists idx_asset_scans_created_at ON public.asset_scans(created_at desc);
create index if not exists idx_asset_scans_wo_id ON public.asset_scans(work_order_id) where work_order_id is not null;

-- 2. CONTRACTOR CUSTOM BRAND PROFILES
create table if not exists public.contractor_brand_profiles (
  id                      uuid primary key default gen_random_uuid(),
  organisation_id         uuid not null references public.organisations(id) on delete cascade unique,
  company_name            text not null,
  trading_name            text,
  logo_url                text,
  brand_color_primary     text not null default '#0284c7',
  brand_color_secondary   text not null default '#0f172a',
  vat_number              text,
  company_number          text,
  phone                   text,
  email                   text,
  website                 text,
  address_line1           text,
  address_line2           text,
  city                    text,
  postcode                text,
  document_prefix         text not null default 'DOC-',
  quote_prefix            text not null default 'QT-',
  invoice_prefix          text not null default 'INV-',
  footer_text             text default 'Thank you for your business.',
  settings                jsonb default '{}'::jsonb,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_contractor_brand_org ON public.contractor_brand_profiles(organisation_id);

-- 3. CONTRACTOR INDEPENDENT CLIENT DIRECTORY
create table if not exists public.contractor_clients (
  id                      uuid primary key default gen_random_uuid(),
  contractor_org_id       uuid not null references public.organisations(id) on delete cascade,
  client_name             text not null,
  contact_name            text,
  email                   text,
  phone                   text,
  address_line1           text,
  city                    text,
  postcode                text,
  notes                   text,
  status                  text not null default 'ACTIVE',
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_contractor_clients_org ON public.contractor_clients(contractor_org_id);

-- 4. CONTRACTOR INDEPENDENT JOBS
create table if not exists public.contractor_independent_jobs (
  id                      uuid primary key default gen_random_uuid(),
  contractor_org_id       uuid not null references public.organisations(id) on delete cascade,
  client_id               uuid references public.contractor_clients(id) on delete set null,
  job_reference           text not null,
  title                   text not null,
  description             text,
  site_address            text,
  trade                   text not null default 'GENERAL',
  priority                text not null default 'MEDIUM',
  status                  text not null default 'DRAFT',
  -- DRAFT | SCHEDULED | IN_PROGRESS | COMPLETED | INVOICED | CANCELLED
  scheduled_date          date,
  completed_at            timestamptz,
  lead_operative_id       uuid references public.persons(id) on delete set null,
  total_price_gbp         numeric(10, 2) default 0.00,
  sign_off_name           text,
  sign_off_signature_url  text,
  sign_off_at             timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_contractor_indep_jobs_org ON public.contractor_independent_jobs(contractor_org_id);
create index if not exists idx_contractor_indep_jobs_client ON public.contractor_independent_jobs(client_id);

-- 5. CONTRACTOR BUSINESS DOCUMENTS & GENERATED TEMPLATES
create table if not exists public.contractor_documents (
  id                      uuid primary key default gen_random_uuid(),
  contractor_org_id       uuid not null references public.organisations(id) on delete cascade,
  template_id             text not null,
  category                text not null,
  -- HEALTH_SAFETY | JOB_SERVICE | COMMERCIAL | SPECIALIST_TRADE
  document_number         text not null,
  title                   text not null,
  version                 text not null default '1.0',
  is_entirefm_job         boolean not null default false,
  work_order_id           uuid references public.work_orders(id) on delete set null,
  independent_job_id      uuid references public.contractor_independent_jobs(id) on delete set null,
  client_name             text,
  site_name               text,
  operative_name          text,
  status                  text not null default 'DRAFT',
  -- DRAFT | IN_PROGRESS | COMPLETED | SIGNED | ARCHIVED
  form_data               jsonb not null default '{}'::jsonb,
  signatures              jsonb default '[]'::jsonb,
  photos                  jsonb default '[]'::jsonb,
  pdf_url                 text,
  completed_at            timestamptz,
  created_by_person_id    uuid references public.persons(id) on delete set null,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_contractor_docs_org ON public.contractor_documents(contractor_org_id);
create index if not exists idx_contractor_docs_template ON public.contractor_documents(template_id);
create index if not exists idx_contractor_docs_wo ON public.contractor_documents(work_order_id) where work_order_id is not null;
create index if not exists idx_contractor_docs_job ON public.contractor_documents(independent_job_id) where independent_job_id is not null;

-- RLS
alter table public.asset_scans enable row level security;
alter table public.contractor_brand_profiles enable row level security;
alter table public.contractor_clients enable row level security;
alter table public.contractor_independent_jobs enable row level security;
alter table public.contractor_documents enable row level security;

DROP POLICY IF EXISTS "service_role_bypass" ON public.asset_scans;
CREATE POLICY "service_role_bypass" ON public.asset_scans for all to service_role using (true) with check (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.contractor_brand_profiles;
CREATE POLICY "service_role_bypass" ON public.contractor_brand_profiles for all to service_role using (true) with check (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.contractor_clients;
CREATE POLICY "service_role_bypass" ON public.contractor_clients for all to service_role using (true) with check (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.contractor_independent_jobs;
CREATE POLICY "service_role_bypass" ON public.contractor_independent_jobs for all to service_role using (true) with check (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.contractor_documents;
CREATE POLICY "service_role_bypass" ON public.contractor_documents for all to service_role using (true) with check (true);
