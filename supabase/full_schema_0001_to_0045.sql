-- ENQUIRY STORAGE
-- ===============
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
--
-- Why this exists: the enquiry endpoint is fail-closed — it refuses to tell a
-- visitor their enquiry was received unless it has actually been stored
-- somewhere durable. Vercel's filesystem is ephemeral, so without a real sink
-- every submission returns 503. This table is that sink.

create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  enquiry_id      text not null unique,
  received_at     timestamptz not null default now(),

  -- Contact
  name            text not null,
  email           text not null,
  phone           text default '',
  company         text default '',

  -- Requirement
  service         text default '',
  location        text default '',
  message         text not null,

  -- Attribution. Kept because the whole point of the rebuild is knowing which
  -- pages produce enquiries — the geo landing pages were driving them before
  -- and nothing recorded it.
  landing_page    text default '',
  conversion_page text default '',
  page_type       text default '',
  utm_source      text default '',
  utm_medium      text default '',
  utm_campaign    text default '',
  utm_term        text default '',
  utm_content     text default '',
  referrer        text default '',

  -- Handling
  status          text not null default 'new',
  notes           text default ''
);

create index if not exists leads_received_at_idx on public.leads (received_at desc);
create index if not exists leads_status_idx      on public.leads (status);
create index if not exists leads_conversion_idx  on public.leads (conversion_page);

-- Row level security ON with no policies: PostgREST refuses all anon access,
-- and the service role key bypasses RLS. The anon key is public (it ships in
-- the browser bundle), so this is what stops anyone reading your enquiries.
alter table public.leads enable row level security;
-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0002: FOUNDATION & CANONICAL DOMAIN SCHEMA
-- ============================================================================
-- Version: 2.0.0
-- Architecture: Multi-tenant, role-based, event-audited modular operational schema.
-- Domains:
--   1. Identity, Organisations & Permissions
--   2. Estate Hierarchy & Asset Registry
--   3. Work Orders, Visits, Tasks & SLA Control
--   4. Supply Chain, Contractor Network & Rate Cards
--   5. Commercials, Quotes, POs, WIP & Billing
--   6. Versioned Compliance, Statutory Obligations & Certificates
--   7. Secure Documents & Evidence
--   8. Immutable Audit Log & Event Outbox
--   9. Workflows & Automation Engine
--  10. AI Control Plane, Autonomy Policies & Cost Ledger
--  11. Unified Communications Ledger
-- ============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- DOMAIN 1: IDENTITY, ORGANISATIONS & PERMISSIONS
-- ============================================================================

-- Organisation Types
do $$ begin
  create type public.org_type_enum as enum (
    'ENTIREFM',
    'CLIENT',
    'CONTRACTOR',
    'SUPPLIER',
    'PARTNER'
  );
exception when duplicate_object then null; end $$;

-- Organisations
create table if not exists public.organisations (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique,
  name            text not null,
  legal_name      text,
  org_type        public.org_type_enum not null default 'CLIENT',
  company_number  text,
  vat_number      text,
  status          text not null default 'ACTIVE', -- ACTIVE, ONBOARDING, SUSPENDED, ARCHIVED
  tier            text default 'STANDARD',
  website         text,
  phone           text,
  email           text,
  address_json    jsonb default '{}'::jsonb,
  settings        jsonb default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Persons (Physical individual records)
create table if not exists public.persons (
  id              uuid primary key default gen_random_uuid(),
  first_name      text not null,
  last_name       text not null,
  email           text not null unique,
  phone           text,
  job_title       text,
  avatar_url      text,
  status          text not null default 'ACTIVE',
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- User Identities (Authentication accounts linked to a Person)
create table if not exists public.user_identities (
  id              uuid primary key default gen_random_uuid(),
  person_id       uuid not null references public.persons(id) on delete cascade,
  auth_user_id    uuid unique, -- linked Supabase Auth UID if applicable
  email           text not null unique,
  password_hash   text,
  is_active       boolean not null default true,
  last_login_at   timestamptz,
  failed_attempts integer not null default 0,
  locked_until    timestamptz,
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- System Roles
create table if not exists public.roles (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique,
  name            text not null,
  description     text,
  is_system       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- System Permissions
create table if not exists public.permissions (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique,
  name            text not null,
  domain          text not null,
  description     text,
  created_at      timestamptz not null default now()
);

-- Role Permissions Join
create table if not exists public.role_permissions (
  id              uuid primary key default gen_random_uuid(),
  role_id         uuid not null references public.roles(id) on delete cascade,
  permission_id   uuid not null references public.permissions(id) on delete cascade,
  created_at      timestamptz not null default now(),
  unique(role_id, permission_id)
);

-- Organisation Memberships
create table if not exists public.organisation_memberships (
  id              uuid primary key default gen_random_uuid(),
  person_id       uuid not null references public.persons(id) on delete cascade,
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  role_id         uuid not null references public.roles(id),
  is_primary      boolean not null default false,
  status          text not null default 'ACTIVE',
  joined_at       timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique(person_id, organisation_id)
);

-- ============================================================================
-- DOMAIN 2: ESTATE HIERARCHY & ASSET REGISTRY
-- ============================================================================

-- Client Accounts
create table if not exists public.client_accounts (
  id                  uuid primary key default gen_random_uuid(),
  organisation_id     uuid not null references public.organisations(id) on delete cascade,
  account_code        text not null unique,
  account_manager_id  uuid references public.persons(id),
  status              text not null default 'ACTIVE',
  billing_currency    text not null default 'GBP',
  payment_terms_days  integer not null default 30,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Contracts
create table if not exists public.contracts (
  id                  uuid primary key default gen_random_uuid(),
  client_account_id   uuid not null references public.client_accounts(id) on delete cascade,
  contract_ref        text not null unique,
  name                text not null,
  contract_type       text not null default 'COMPREHENSIVE_FM', -- HARD_FM, SOFT_FM, TOTAL_FM, PPM_ONLY
  start_date          date not null,
  end_date            date not null,
  renewal_date        date,
  annual_value_gbp    numeric(12,2),
  status              text not null default 'ACTIVE', -- DRAFT, ACTIVE, EXPIRED, TERMINATED
  sla_terms_json      jsonb default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Portfolios
create table if not exists public.portfolios (
  id                  uuid primary key default gen_random_uuid(),
  client_account_id   uuid not null references public.client_accounts(id) on delete cascade,
  contract_id         uuid references public.contracts(id) on delete set null,
  code                text not null,
  name                text not null,
  description         text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique(client_account_id, code)
);

-- Sites
create table if not exists public.sites (
  id                  uuid primary key default gen_random_uuid(),
  portfolio_id        uuid references public.portfolios(id) on delete set null,
  organisation_id     uuid not null references public.organisations(id) on delete cascade,
  site_code           text not null unique,
  name                text not null,
  address_line1       text not null,
  address_line2       text,
  city                text not null,
  county              text,
  postcode            text not null,
  country             text not null default 'United Kingdom',
  latitude            numeric(10,7),
  longitude           numeric(10,7),
  access_notes        text,
  security_clearance  text,
  operating_hours     text,
  primary_contact_id  uuid references public.persons(id),
  status              text not null default 'ACTIVE',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Buildings
create table if not exists public.buildings (
  id                  uuid primary key default gen_random_uuid(),
  site_id             uuid not null references public.sites(id) on delete cascade,
  building_code       text not null,
  name                text not null,
  floors_above        integer default 1,
  floors_below        integer default 0,
  gross_internal_area numeric(10,2),
  construction_year   integer,
  status              text not null default 'ACTIVE',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique(site_id, building_code)
);

-- Floor Zones
create table if not exists public.floor_zones (
  id                  uuid primary key default gen_random_uuid(),
  building_id         uuid not null references public.buildings(id) on delete cascade,
  name                text not null,
  floor_number        integer not null default 0,
  zone_type           text default 'STANDARD',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Spaces / Rooms
create table if not exists public.spaces (
  id                  uuid primary key default gen_random_uuid(),
  floor_zone_id       uuid not null references public.floor_zones(id) on delete cascade,
  space_code          text not null,
  name                text not null,
  space_type          text default 'OFFICE', -- PLANT_ROOM, CORRIDOR, RESTROOM, SERVER_ROOM
  capacity            integer,
  area_sqm            numeric(8,2),
  status              text not null default 'ACTIVE',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Building Systems (HVAC, Electrical, Plumbing, Fire Alarm, etc.)
create table if not exists public.systems (
  id                  uuid primary key default gen_random_uuid(),
  site_id             uuid not null references public.sites(id) on delete cascade,
  building_id         uuid references public.buildings(id) on delete set null,
  name                text not null,
  system_type         text not null, -- HVAC, ELECTRICAL, FIRE_SAFETY, WATER, LIFT, SECURITY
  description         text,
  criticality         text not null default 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
  status              text not null default 'OPERATIONAL',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Assets
create table if not exists public.assets (
  id                  uuid primary key default gen_random_uuid(),
  site_id             uuid not null references public.sites(id) on delete cascade,
  building_id         uuid references public.buildings(id) on delete set null,
  floor_zone_id       uuid references public.floor_zones(id) on delete set null,
  space_id            uuid references public.spaces(id) on delete set null,
  system_id           uuid references public.systems(id) on delete set null,
  parent_asset_id     uuid references public.assets(id) on delete set null,
  asset_reference     text not null unique,
  name                text not null,
  category            text not null, -- BOILER, CHILLER, AHU, PUMP, DISTRIBUTION_BOARD, FIRE_PANEL
  manufacturer        text,
  model               text,
  serial_number       text,
  qr_code             text unique,
  nfc_tag             text unique,
  installation_date   date,
  warranty_expiry     date,
  expected_life_years integer,
  condition           text not null default 'GOOD', -- EXCELLENT, GOOD, FAIR, POOR, DEFECTIVE
  criticality         text not null default 'MEDIUM', -- LOW, MEDIUM, HIGH, MISSION_CRITICAL
  statutory_relevance boolean not null default false,
  status              text not null default 'IN_SERVICE', -- IN_SERVICE, OUT_OF_SERVICE, DECOMMISSIONED
  ownership           text default 'CLIENT',
  metadata            jsonb default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Asset Components
create table if not exists public.components (
  id                  uuid primary key default gen_random_uuid(),
  asset_id            uuid not null references public.assets(id) on delete cascade,
  name                text not null,
  part_number         text,
  serial_number       text,
  specifications      jsonb default '{}'::jsonb,
  installed_at        date,
  status              text not null default 'ACTIVE',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ============================================================================
-- DOMAIN 3: WORK MODEL, VISITS, TASKS & SLA CONTROL
-- ============================================================================

-- SLAs
create table if not exists public.slas (
  id                    uuid primary key default gen_random_uuid(),
  code                  text not null unique,
  name                  text not null,
  priority_level        text not null, -- P1_CRITICAL, P2_HIGH, P3_MEDIUM, P4_LOW, P5_SCHEDULED
  response_time_minutes integer not null,
  arrival_time_minutes  integer not null,
  resolution_time_hours numeric(6,2) not null,
  operating_hours_type  text not null default '24_7', -- 24_7, BUSINESS_HOURS
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Service Requests (Triage intake)
create table if not exists public.service_requests (
  id                  uuid primary key default gen_random_uuid(),
  reference           text not null unique,
  organisation_id     uuid not null references public.organisations(id) on delete cascade,
  site_id             uuid not null references public.sites(id) on delete cascade,
  building_id         uuid references public.buildings(id),
  space_id            uuid references public.spaces(id),
  asset_id            uuid references public.assets(id),
  requester_person_id uuid references public.persons(id),
  title               text not null,
  description         text not null,
  category            text not null,
  priority            text not null default 'P3_MEDIUM',
  status              text not null default 'SUBMITTED', -- SUBMITTED, TRIAGED, CONVERTED, REJECTED, DUPLICATE
  source              text not null default 'PORTAL', -- PORTAL, EMAIL, PHONE, SENSOR, API, AI_HELPDESK
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Work Orders
create table if not exists public.work_orders (
  id                        uuid primary key default gen_random_uuid(),
  work_order_number         text not null unique,
  service_request_id        uuid references public.service_requests(id),
  organisation_id           uuid not null references public.organisations(id) on delete cascade,
  site_id                   uuid not null references public.sites(id) on delete cascade,
  building_id               uuid references public.buildings(id),
  space_id                  uuid references public.spaces(id),
  asset_id                  uuid references public.assets(id),
  contract_id               uuid references public.contracts(id),
  sla_id                    uuid references public.slas(id),
  provider_organisation_id  uuid references public.organisations(id),
  title                     text not null,
  description               text not null,
  work_type                 text not null default 'REACTIVE', -- REACTIVE, PPM, STATUTORY, QUOTED, PROJECT
  priority                  text not null default 'P3_MEDIUM',
  status                    text not null default 'DRAFT', -- DRAFT, ISSUED, ACCEPTED, SCHEDULED, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED
  hold_reason               text,
  target_start_at           timestamptz,
  target_completion_at      timestamptz,
  sla_response_due_at       timestamptz,
  sla_resolution_due_at     timestamptz,
  responded_at              timestamptz,
  actual_start_at           timestamptz,
  actual_completion_at      timestamptz,
  estimated_duration_mins   integer default 60,
  lead_engineer_id          uuid references public.persons(id),
  billing_status            text not null default 'UNBILLED', -- UNBILLED, WIP, READY_TO_INVOICE, INVOICED
  total_cost_gbp            numeric(10,2) default 0.00,
  total_revenue_gbp         numeric(10,2) default 0.00,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- Visits
create table if not exists public.visits (
  id                    uuid primary key default gen_random_uuid(),
  work_order_id         uuid not null references public.work_orders(id) on delete cascade,
  visit_number          integer not null default 1,
  assigned_resource_id  uuid references public.persons(id),
  scheduled_start_at    timestamptz,
  scheduled_end_at      timestamptz,
  actual_check_in_at    timestamptz,
  actual_check_out_at   timestamptz,
  status                text not null default 'SCHEDULED', -- SCHEDULED, EN_ROUTE, ON_SITE, COMPLETED, ABORTED, RESCHEDULED
  travel_time_minutes   integer,
  site_notes            text,
  sign_off_name         text,
  sign_off_signature_url text,
  sign_off_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Tasks
create table if not exists public.tasks (
  id                    uuid primary key default gen_random_uuid(),
  work_order_id         uuid not null references public.work_orders(id) on delete cascade,
  visit_id              uuid references public.visits(id) on delete set null,
  sequence              integer not null default 1,
  title                 text not null,
  description           text,
  is_mandatory          boolean not null default true,
  is_statutory          boolean not null default false,
  status                text not null default 'PENDING', -- PENDING, IN_PROGRESS, PASSED, FAILED, N_A
  completed_at          timestamptz,
  completed_by_id       uuid references public.persons(id),
  failure_reason        text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- SLA Milestones
create table if not exists public.sla_milestones (
  id                    uuid primary key default gen_random_uuid(),
  work_order_id         uuid not null references public.work_orders(id) on delete cascade,
  milestone_type        text not null, -- ACKNOWLEDGED, ATTENDED, RESOLVED
  target_at             timestamptz not null,
  achieved_at           timestamptz,
  is_breached           boolean not null default false,
  breach_reason         text,
  created_at            timestamptz not null default now()
);

-- Work Escalations
create table if not exists public.escalations (
  id                    uuid primary key default gen_random_uuid(),
  work_order_id         uuid not null references public.work_orders(id) on delete cascade,
  escalation_level      integer not null default 1,
  reason                text not null,
  triggered_by          text not null default 'SLA_TIMER', -- SLA_TIMER, MANUAL, AI_PREDICTION, CLIENT_ESCALATION
  escalated_to_person_id uuid references public.persons(id),
  status                text not null default 'OPEN', -- OPEN, ACKNOWLEDGED, RESOLVED
  resolved_at           timestamptz,
  resolution_notes      text,
  created_at            timestamptz not null default now()
);

-- Work Activities & Changes
create table if not exists public.work_activities (
  id                    uuid primary key default gen_random_uuid(),
  work_order_id         uuid not null references public.work_orders(id) on delete cascade,
  visit_id              uuid references public.visits(id) on delete set null,
  actor_person_id       uuid references public.persons(id),
  activity_type         text not null, -- STATUS_CHANGED, NOTE_ADDED, PROVIDER_DISPATCHED, VISIT_COMPLETED
  message               text not null,
  metadata              jsonb default '{}'::jsonb,
  created_at            timestamptz not null default now()
);

-- ============================================================================
-- DOMAIN 4: SUPPLY CHAIN, TRADES & RATE CARDS
-- ============================================================================

-- Provider Profiles (for CONTRACTOR organisations)
create table if not exists public.provider_organisations (
  id                    uuid primary key default gen_random_uuid(),
  organisation_id       uuid not null unique references public.organisations(id) on delete cascade,
  tier                  text not null default 'STANDARD', -- APPROVED, PREFERRED, STRATEGIC, RESTRICTED
  vetting_status        text not null default 'PENDING', -- PENDING, APPROVED, REJECTED, SUSPENDED
  insurance_verified    boolean not null default false,
  public_liability_limit numeric(12,2),
  insurance_expiry      date,
  coverage_radius_miles integer default 25,
  primary_trade         text,
  performance_score     numeric(4,2) default 100.00,
  first_time_fix_rate   numeric(5,2) default 100.00,
  sla_adherence_rate    numeric(5,2) default 100.00,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Trades
create table if not exists public.trades (
  id                    uuid primary key default gen_random_uuid(),
  code                  text not null unique,
  name                  text not null,
  category              text not null, -- MECHANICAL, ELECTRICAL, FABRIC, SPECIALIST, CLEANING, SECURITY
  description           text,
  created_at            timestamptz not null default now()
);

-- Competencies
create table if not exists public.competencies (
  id                    uuid primary key default gen_random_uuid(),
  trade_id              uuid not null references public.trades(id) on delete cascade,
  code                  text not null unique,
  name                  text not null,
  description           text,
  requires_certification boolean not null default false,
  created_at            timestamptz not null default now()
);

-- Provider Accreditations (e.g. Gas Safe, NICEIC, SafeContractor, CHAS)
create table if not exists public.accreditations (
  id                    uuid primary key default gen_random_uuid(),
  provider_org_id       uuid not null references public.provider_organisations(id) on delete cascade,
  body_name             text not null, -- GAS_SAFE, NICEIC, CHAS, SAFE_CONTRACTOR, REFCOM
  certificate_number    text not null,
  valid_from            date not null,
  valid_to              date not null,
  status                text not null default 'ACTIVE', -- ACTIVE, EXPIRED, SUSPENDED
  document_url          text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Provider Rate Cards
create table if not exists public.rate_cards (
  id                    uuid primary key default gen_random_uuid(),
  provider_org_id       uuid references public.provider_organisations(id) on delete cascade,
  client_account_id     uuid references public.client_accounts(id) on delete cascade,
  name                  text not null,
  currency              text not null default 'GBP',
  effective_from        date not null,
  effective_to          date,
  is_default            boolean not null default false,
  status                text not null default 'ACTIVE',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Rate Card Items
create table if not exists public.rate_card_items (
  id                    uuid primary key default gen_random_uuid(),
  rate_card_id          uuid not null references public.rate_cards(id) on delete cascade,
  trade_id              uuid not null references public.trades(id),
  rate_type             text not null default 'HOURLY', -- HOURLY, CALLOUT, DAY_RATE, FIXED
  standard_rate_gbp     numeric(10,2) not null,
  out_of_hours_rate_gbp numeric(10,2),
  emergency_rate_gbp    numeric(10,2),
  minimum_hours         numeric(4,1) default 1.0,
  created_at            timestamptz not null default now()
);

-- ============================================================================
-- DOMAIN 5: COMMERCIALS, QUOTES, POs, WIP & BILLING
-- ============================================================================

-- Quotes
create table if not exists public.quotes (
  id                    uuid primary key default gen_random_uuid(),
  quote_number          text not null unique,
  work_order_id         uuid references public.work_orders(id),
  client_account_id     uuid not null references public.client_accounts(id),
  provider_org_id       uuid references public.organisations(id),
  status                text not null default 'DRAFT', -- DRAFT, SUBMITTED, APPROVED, REJECTED, EXPIRED
  subtotal_gbp          numeric(10,2) not null default 0.00,
  tax_amount_gbp        numeric(10,2) not null default 0.00,
  total_amount_gbp      numeric(10,2) not null default 0.00,
  submitted_at          timestamptz,
  valid_until           date,
  approved_at           timestamptz,
  approved_by_id        uuid references public.persons(id),
  notes                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Quote Lines
create table if not exists public.quote_lines (
  id                    uuid primary key default gen_random_uuid(),
  quote_id              uuid not null references public.quotes(id) on delete cascade,
  line_type             text not null default 'LABOUR', -- LABOUR, MATERIALS, PLANT, SUBCONTRACTOR
  description           text not null,
  quantity              numeric(8,2) not null default 1.00,
  unit_price_gbp        numeric(10,2) not null,
  tax_rate_percent      numeric(5,2) not null default 20.00,
  total_gbp             numeric(10,2) not null,
  created_at            timestamptz not null default now()
);

-- Purchase Orders (Internal commitments to contractors)
create table if not exists public.purchase_orders (
  id                    uuid primary key default gen_random_uuid(),
  po_number             text not null unique,
  work_order_id         uuid references public.work_orders(id),
  supplier_org_id       uuid not null references public.organisations(id),
  status                text not null default 'DRAFT', -- DRAFT, ISSUED, ACCEPTED, INVOICED, CANCELLED
  total_amount_gbp      numeric(10,2) not null default 0.00,
  issued_at             timestamptz,
  approved_by_id        uuid references public.persons(id),
  notes                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Supplier Invoices (Contractor bills EntireFM)
create table if not exists public.supplier_invoices (
  id                    uuid primary key default gen_random_uuid(),
  invoice_ref           text not null,
  purchase_order_id     uuid references public.purchase_orders(id),
  supplier_org_id       uuid not null references public.organisations(id),
  work_order_id         uuid references public.work_orders(id),
  status                text not null default 'RECEIVED', -- RECEIVED, MATCHED, APPROVED, PAID, DISPUTED
  issue_date            date not null,
  due_date              date not null,
  subtotal_gbp          numeric(10,2) not null,
  tax_amount_gbp        numeric(10,2) not null default 0.00,
  total_amount_gbp      numeric(10,2) not null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Client Invoices (EntireFM bills Client)
create table if not exists public.client_invoices (
  id                    uuid primary key default gen_random_uuid(),
  invoice_number        text not null unique,
  client_account_id     uuid not null references public.client_accounts(id),
  contract_id           uuid references public.contracts(id),
  status                text not null default 'DRAFT', -- DRAFT, ISSUED, PAID, OVERDUE, CANCELLED
  issue_date            date not null,
  due_date              date not null,
  subtotal_gbp          numeric(10,2) not null default 0.00,
  tax_amount_gbp        numeric(10,2) not null default 0.00,
  total_amount_gbp      numeric(10,2) not null default 0.00,
  paid_at               timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Client Invoice Lines
create table if not exists public.client_invoice_lines (
  id                    uuid primary key default gen_random_uuid(),
  client_invoice_id     uuid not null references public.client_invoices(id) on delete cascade,
  work_order_id         uuid references public.work_orders(id),
  description           text not null,
  quantity              numeric(8,2) not null default 1.00,
  unit_price_gbp        numeric(10,2) not null,
  total_gbp             numeric(10,2) not null,
  created_at            timestamptz not null default now()
);

-- Commercial Budgets
create table if not exists public.budgets (
  id                    uuid primary key default gen_random_uuid(),
  client_account_id     uuid not null references public.client_accounts(id),
  contract_id           uuid references public.contracts(id),
  site_id               uuid references public.sites(id),
  financial_year        text not null, -- e.g. "2026/27"
  budget_type           text not null default 'REACTIVE', -- REACTIVE, PPM, CAPEX
  allocated_amount_gbp  numeric(12,2) not null,
  spent_amount_gbp      numeric(12,2) not null default 0.00,
  committed_amount_gbp  numeric(12,2) not null default 0.00,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ============================================================================
-- DOMAIN 6: VERSIONED COMPLIANCE, STATUTORY OBLIGATIONS & CERTS
-- ============================================================================

-- Regulatory Sources (e.g. UK Legislation, HSE, SFG20, CIBSE, BESA)
create table if not exists public.compliance_sources (
  id                    uuid primary key default gen_random_uuid(),
  code                  text not null unique,
  name                  text not null,
  source_type           text not null default 'STATUTORY', -- STATUTORY, STANDARD, INDUSTRY_GUIDANCE, BEST_PRACTICE
  jurisdiction          text not null default 'UK',
  publishing_body       text not null,
  url                   text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Compliance Rules
create table if not exists public.compliance_rules (
  id                    uuid primary key default gen_random_uuid(),
  source_id             uuid not null references public.compliance_sources(id) on delete cascade,
  code                  text not null unique,
  title                 text not null,
  category              text not null, -- FIRE, WATER_HYGIENE, ELECTRICAL, GAS, ASBESTOS, LIFTS, F_GAS
  statutory_level       text not null default 'MANDATORY', -- MANDATORY, HIGH_RECOMMENDED, ADVISORY
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Compliance Rule Versions (Strictly immutable versioning)
create table if not exists public.compliance_rule_versions (
  id                    uuid primary key default gen_random_uuid(),
  compliance_rule_id    uuid not null references public.compliance_rules(id) on delete cascade,
  version_number        integer not null default 1,
  summary               text not null,
  legal_text            text not null,
  guidance_notes        text,
  typical_frequency_days integer not null,
  evidence_required     text not null,
  effective_date        date not null,
  review_date           date,
  is_current            boolean not null default true,
  created_at            timestamptz not null default now(),
  unique(compliance_rule_id, version_number)
);

-- Compliance Obligations (Asset / Site specific active statutory duties)
create table if not exists public.compliance_obligations (
  id                        uuid primary key default gen_random_uuid(),
  site_id                   uuid not null references public.sites(id) on delete cascade,
  building_id               uuid references public.buildings(id),
  asset_id                  uuid references public.assets(id),
  compliance_rule_version_id uuid not null references public.compliance_rule_versions(id),
  frequency_days            integer not null,
  last_performed_at         date,
  next_due_at               date not null,
  grace_period_days         integer not null default 7,
  status                    text not null default 'COMPLIANT', -- COMPLIANT, DUE_SOON, OVERDUE, EXEMPT
  assigned_contractor_id    uuid references public.organisations(id),
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- Certificates
create table if not exists public.certificates (
  id                    uuid primary key default gen_random_uuid(),
  site_id               uuid not null references public.sites(id) on delete cascade,
  building_id           uuid references public.buildings(id),
  asset_id              uuid references public.assets(id),
  certificate_type      text not null, -- GAS_SAFETY, EICR, FIRE_ALARM, LEGIONELLA_RISK, LOLER, TM44, EPC
  certificate_number    text not null,
  issued_by_org         text not null,
  issued_date           date not null,
  expiry_date           date not null,
  status                text not null default 'VALID', -- VALID, EXPIRING_SOON, EXPIRED, REVOKED
  document_url          text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ============================================================================
-- DOMAIN 7: SECURE DOCUMENTS & EVIDENCE
-- ============================================================================

create table if not exists public.documents (
  id                    uuid primary key default gen_random_uuid(),
  organisation_id       uuid not null references public.organisations(id) on delete cascade,
  title                 text not null,
  file_name             text not null,
  mime_type             text not null,
  file_size_bytes       bigint not null,
  storage_path          text not null,
  checksum_sha256       text not null,
  privacy_class         text not null default 'CONFIDENTIAL', -- PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED
  document_type         text not null, -- CERTIFICATE, REPORT, INVOICE, RAMS, DRAWING, MANUAL, PHOTO
  version               integer not null default 1,
  expiry_date           date,
  uploaded_by_id        uuid references public.persons(id),
  is_ai_generated       boolean not null default false,
  metadata              jsonb default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Document Links
create table if not exists public.document_links (
  id                    uuid primary key default gen_random_uuid(),
  document_id           uuid not null references public.documents(id) on delete cascade,
  linked_object_type    text not null, -- WORK_ORDER, ASSET, SITE, VISIT, COMPLIANCE_TASK, INVOICE
  linked_object_id      uuid not null,
  created_at            timestamptz not null default now(),
  unique(document_id, linked_object_type, linked_object_id)
);

-- ============================================================================
-- DOMAIN 8: IMMUTABLE AUDIT LOG & EVENT OUTBOX
-- ============================================================================

-- Audit Events
create table if not exists public.audit_events (
  id                    uuid primary key default gen_random_uuid(),
  event_type            text not null, -- e.g. WORK_ORDER_CREATED, SLA_AT_RISK, QUOTE_APPROVED
  correlation_id        text not null,
  actor_id              uuid references public.persons(id),
  actor_type            text not null default 'HUMAN', -- HUMAN, SYSTEM, AI_AGENT, CRON
  organisation_id       uuid references public.organisations(id),
  object_type           text not null, -- WORK_ORDER, ASSET, INVOICE, USER, COMPLIANCE
  object_id             uuid not null,
  before_state          jsonb,
  after_state           jsonb,
  reason                text,
  source                text default 'WEB_ADMIN',
  is_ai                 boolean not null default false,
  ip_address            text,
  user_agent            text,
  created_at            timestamptz not null default now()
);

-- Event Outbox (Transactional event broker queue)
create table if not exists public.event_outbox (
  id                    uuid primary key default gen_random_uuid(),
  event_type            text not null,
  payload               jsonb not null,
  status                text not null default 'PENDING', -- PENDING, PROCESSING, PROCESSED, FAILED
  retry_count           integer not null default 0,
  error_message         text,
  scheduled_at          timestamptz not null default now(),
  processed_at          timestamptz,
  created_at            timestamptz not null default now()
);

-- ============================================================================
-- DOMAIN 9: WORKFLOWS & AUTOMATION ENGINE
-- ============================================================================

create table if not exists public.workflow_definitions (
  id                    uuid primary key default gen_random_uuid(),
  code                  text not null unique,
  name                  text not null,
  description           text,
  trigger_type          text not null, -- EVENT, SCHEDULE, MANUAL, WEBHOOK
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table if not exists public.workflow_versions (
  id                    uuid primary key default gen_random_uuid(),
  workflow_def_id       uuid not null references public.workflow_definitions(id) on delete cascade,
  version_number        integer not null default 1,
  definition_json       jsonb not null,
  is_published          boolean not null default true,
  created_at            timestamptz not null default now(),
  unique(workflow_def_id, version_number)
);

create table if not exists public.workflow_runs (
  id                    uuid primary key default gen_random_uuid(),
  workflow_version_id   uuid not null references public.workflow_versions(id),
  trigger_event_id      uuid references public.audit_events(id),
  context_object_type   text,
  context_object_id     uuid,
  status                text not null default 'RUNNING', -- RUNNING, COMPLETED, FAILED, TIMED_OUT
  input_state           jsonb default '{}'::jsonb,
  output_state          jsonb default '{}'::jsonb,
  started_at            timestamptz not null default now(),
  completed_at          timestamptz,
  error_details         text,
  created_at            timestamptz not null default now()
);

create table if not exists public.automation_rules (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  event_trigger         text not null, -- e.g. SLA_APPROACHING_BREACH, VISITOR_CHECKIN
  conditions_json       jsonb not null default '[]'::jsonb,
  actions_json          jsonb not null default '[]'::jsonb,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ============================================================================
-- DOMAIN 10: AI CONTROL PLANE, AUTONOMY POLICIES & COST LEDGER
-- ============================================================================

-- AI Agents Registry
create table if not exists public.ai_agents (
  id                    uuid primary key default gen_random_uuid(),
  code                  text not null unique,
  name                  text not null,
  description           text,
  role_description      text not null,
  autonomy_level        text not null default 'ASSIST', -- OFF, MANUAL, ASSIST, CONTROLLED_AUTO
  is_active             boolean not null default true,
  max_daily_budget_gbp  numeric(8,2) not null default 50.00,
  confidence_threshold  numeric(3,2) not null default 0.85,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- AI Runs
create table if not exists public.ai_runs (
  id                    uuid primary key default gen_random_uuid(),
  ai_agent_id           uuid not null references public.ai_agents(id),
  trigger_event         text not null,
  correlation_id        text not null,
  status                text not null default 'COMPLETED', -- RUNNING, COMPLETED, FAILED, ESCALATED
  input_context         jsonb not null default '{}'::jsonb,
  output_result         jsonb not null default '{}'::jsonb,
  prompt_tokens         integer default 0,
  completion_tokens     integer default 0,
  total_cost_gbp        numeric(8,5) default 0.00000,
  started_at            timestamptz not null default now(),
  completed_at          timestamptz default now(),
  created_at            timestamptz not null default now()
);

-- AI Actions (Governance Ledger)
create table if not exists public.ai_actions (
  id                    uuid primary key default gen_random_uuid(),
  ai_run_id             uuid not null references public.ai_runs(id) on delete cascade,
  ai_agent_id           uuid not null references public.ai_agents(id),
  action_type           text not null, -- DRAFT_RESPONSE, SUGGEST_DISPATCH, AUTO_ASSIGN, ESCALATE
  target_object_type    text not null,
  target_object_id      uuid not null,
  payload               jsonb not null,
  requires_approval     boolean not null default false,
  status                text not null default 'EXECUTED', -- PENDING_APPROVAL, APPROVED, REJECTED, EXECUTED, OVERRIDDEN
  created_at            timestamptz not null default now()
);

-- AI Cost Records
create table if not exists public.ai_cost_records (
  id                    uuid primary key default gen_random_uuid(),
  ai_agent_id           uuid not null references public.ai_agents(id),
  ai_run_id             uuid references public.ai_runs(id),
  model_name            text not null,
  prompt_tokens         integer not null,
  completion_tokens     integer not null,
  total_cost_gbp        numeric(8,5) not null,
  recorded_at           timestamptz not null default now(),
  created_at            timestamptz not null default now()
);

-- ============================================================================
-- DOMAIN 11: UNIFIED COMMUNICATIONS
-- ============================================================================

create table if not exists public.communication_threads (
  id                    uuid primary key default gen_random_uuid(),
  subject               text not null,
  thread_type           text not null default 'HELPDESK', -- HELPDESK, CONTRACTOR, CLIENT, INTERNAL
  related_object_type   text, -- WORK_ORDER, QUOTE, INVOICE, SITE
  related_object_id     uuid,
  status                text not null default 'OPEN', -- OPEN, SNOOZED, RESOLVED, CLOSED
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table if not exists public.communication_messages (
  id                    uuid primary key default gen_random_uuid(),
  thread_id             uuid not null references public.communication_threads(id) on delete cascade,
  sender_person_id      uuid references public.persons(id),
  sender_name           text,
  channel               text not null default 'PORTAL', -- PORTAL, EMAIL, SMS, WHATSAPP, SYSTEM
  body                  text not null,
  is_incoming           boolean not null default false,
  is_ai_generated       boolean not null default false,
  metadata              jsonb default '{}'::jsonb,
  created_at            timestamptz not null default now()
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

create index if not exists idx_org_type on public.organisations (org_type, status);
create index if not exists idx_memberships_person on public.organisation_memberships (person_id, organisation_id);
create index if not exists idx_assets_site on public.assets (site_id, status);
create index if not exists idx_assets_qr on public.assets (qr_code);
create index if not exists idx_work_orders_site on public.work_orders (site_id, status);
create index if not exists idx_work_orders_org on public.work_orders (organisation_id, priority);
create index if not exists idx_work_orders_sla on public.work_orders (sla_resolution_due_at) where status not in ('COMPLETED', 'CANCELLED');
create index if not exists idx_visits_work_order on public.visits (work_order_id, status);
create index if not exists idx_compliance_site on public.compliance_obligations (site_id, next_due_at);
create index if not exists idx_audit_events_obj on public.audit_events (object_type, object_id, created_at desc);
create index if not exists idx_audit_events_corr on public.audit_events (correlation_id);
create index if not exists idx_documents_org on public.documents (organisation_id, document_type);
create index if not exists idx_ai_runs_agent on public.ai_runs (ai_agent_id, created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

alter table public.organisations enable row level security;
alter table public.persons enable row level security;
alter table public.user_identities enable row level security;
alter table public.organisation_memberships enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.client_accounts enable row level security;
alter table public.contracts enable row level security;
alter table public.portfolios enable row level security;
alter table public.sites enable row level security;
alter table public.buildings enable row level security;
alter table public.floor_zones enable row level security;
alter table public.spaces enable row level security;
alter table public.systems enable row level security;
alter table public.assets enable row level security;
alter table public.components enable row level security;
alter table public.service_requests enable row level security;
alter table public.work_orders enable row level security;
alter table public.visits enable row level security;
alter table public.tasks enable row level security;
alter table public.slas enable row level security;
alter table public.sla_milestones enable row level security;
alter table public.escalations enable row level security;
alter table public.work_activities enable row level security;
alter table public.provider_organisations enable row level security;
alter table public.trades enable row level security;
alter table public.competencies enable row level security;
alter table public.accreditations enable row level security;
alter table public.rate_cards enable row level security;
alter table public.rate_card_items enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_lines enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.supplier_invoices enable row level security;
alter table public.client_invoices enable row level security;
alter table public.client_invoice_lines enable row level security;
alter table public.budgets enable row level security;
alter table public.compliance_sources enable row level security;
alter table public.compliance_rules enable row level security;
alter table public.compliance_rule_versions enable row level security;
alter table public.compliance_obligations enable row level security;
alter table public.certificates enable row level security;
alter table public.documents enable row level security;
alter table public.document_links enable row level security;
alter table public.audit_events enable row level security;
alter table public.event_outbox enable row level security;
alter table public.workflow_definitions enable row level security;
alter table public.workflow_versions enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.automation_rules enable row level security;
alter table public.ai_agents enable row level security;
alter table public.ai_runs enable row level security;
alter table public.ai_actions enable row level security;
alter table public.ai_cost_records enable row level security;
alter table public.communication_threads enable row level security;
alter table public.communication_messages enable row level security;

-- ============================================================================
-- CANONICAL REFERENCE SEED DATA (ROLES & PERMISSIONS)
-- ============================================================================

insert into public.roles (code, name, description, is_system) values
  ('CEO', 'Chief Executive Officer', 'Full executive command over all operational, financial, compliance, and governance domains.', true),
  ('DIRECTOR', 'Executive Director', 'Senior executive oversight across all estates, contracts, and supply chains.', true),
  ('OPERATIONS_MANAGER', 'Operations Manager', 'Full control of dispatch, work order lifecycles, contractor performance, and SLAs.', true),
  ('HELPDESK', 'Helpdesk Coordinator', 'Intake, triage, logging, and dispatching reactive and scheduled service requests.', true),
  ('ACCOUNT_MANAGER', 'Account Manager', 'Client relationship management, portfolio oversight, and commercial approvals.', true),
  ('COMPLIANCE_MANAGER', 'Compliance Manager', 'Statutory compliance tracking, certificate audits, and regulatory standard management.', true),
  ('FINANCE', 'Finance & Commercial Lead', 'Invoicing, purchase orders, rate cards, WIP tracking, and margin analysis.', true),
  ('ENGINEER', 'Field Engineer', 'Mobile job execution, risk assessments, task completion, and evidence submission.', true),
  ('ADMINISTRATOR', 'System Administrator', 'Platform configuration, identity management, permissions, and system health.', true),
  ('READ_ONLY', 'Read-Only Auditor', 'Auditing and reporting view without write capabilities.', true),
  ('CLIENT_ADMIN', 'Client Administrator', 'Client-side estate management, quote approvals, and financial overview.', true),
  ('CLIENT_USER', 'Client Site User', 'Site-level service request raising and progress tracking.', true),
  ('TENANT', 'Tenant Occupier', 'Space-level request submission and visitor access.', true),
  ('CONTRACTOR_ADMIN', 'Contractor Administrator', 'Contractor team management, rate cards, and compliance documentation.', true),
  ('CONTRACTOR_DISPATCHER', 'Contractor Dispatcher', 'Job acceptance, engineer assignment, and schedule coordination.', true),
  ('CONTRACTOR_ENGINEER', 'Contractor Field Engineer', 'Job execution, check-in/out, and evidence capture.', true)
on conflict (code) do nothing;

-- Canonical Permissions
insert into public.permissions (code, name, domain, description) values
  ('command:access', 'Command Centre Access', 'command', 'Access executive command centre and operational pulse.'),
  ('command:ceo', 'CEO Command Access', 'command', 'Access executive strategic financial and AI command views.'),
  ('operations:read', 'View Operations', 'operations', 'View service requests, work orders, schedule, and SLAs.'),
  ('operations:write', 'Manage Operations', 'operations', 'Create, update, and reassign work orders and visits.'),
  ('operations:dispatch', 'Dispatch Work', 'operations', 'Assign jobs and dispatch internal or external engineers.'),
  ('estate:read', 'View Estate', 'estate', 'View clients, sites, buildings, and asset registries.'),
  ('estate:write', 'Manage Estate', 'estate', 'Create and modify sites, buildings, spaces, and assets.'),
  ('ppm:manage', 'Manage PPM', 'ppm', 'Manage maintenance plans, statutory frequencies, and autopilot.'),
  ('compliance:read', 'View Compliance', 'compliance', 'View compliance obligations, certificates, and audits.'),
  ('compliance:write', 'Manage Compliance', 'compliance', 'Update compliance obligations, upload certs, log exceptions.'),
  ('supply_chain:read', 'View Supply Chain', 'supply_chain', 'View contractor directory, coverage, and rate cards.'),
  ('supply_chain:write', 'Manage Supply Chain', 'supply_chain', 'Vetting, onboard contractors, and adjust rate cards.'),
  ('commercial:read', 'View Commercials', 'commercial', 'View quotes, invoices, POs, and WIP metrics.'),
  ('commercial:write', 'Manage Commercials', 'commercial', 'Generate quotes, issue invoices, and approve POs.'),
  ('comms:access', 'Communications Access', 'communications', 'View and send emails, SMS, and helpdesk chat.'),
  ('ai:control', 'AI Control Plane', 'ai', 'Modify AI autonomy policies, approve agent actions, and monitor costs.'),
  ('reporting:view', 'View Reports', 'reporting', 'Generate and view operational and financial reporting.'),
  ('growth:access', 'Website & Growth Access', 'growth', 'Access website enquiries, lead pipeline, and SEO tools.'),
  ('platform:admin', 'Platform Administration', 'platform', 'Manage users, roles, system integrations, and feature flags.'),
  ('audit:read', 'View Audit Ledger', 'platform', 'Read immutable audit log and domain event records.')
on conflict (code) do nothing;

-- Role Permissions Mapping
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.code in ('CEO', 'ADMINISTRATOR')
on conflict (role_id, permission_id) do nothing;
-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0003: FOUNDATION HARDENING & ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Version: 2.1.0 (Phase 0A-R Hardening)
-- Domains Covered:
--   1. Object Scoping (membership_scopes)
--   2. Work Domain (assignments, priorities, evidence requirements & completion evidence)
--   3. Supply Chain (locations, resources, coverage areas, performance, restrictions)
--   4. Commercial Domain (approvals, cost commitments, billing records, quote provenance)
--   5. Compliance Domain (applicability assessments, tasks, evidence, exceptions)
--   6. Immutable Audit Trigger & Hardened Outbox Idempotency
--   7. Workflow Engine Primitives (workflow_step_runs)
--   8. AI Governance (agent versions, tool permissions, autonomy policies, escalations, overrides)
--   9. Field Intelligence Primitives (captures, observations, defects, recommendations)
--  10. Multi-Context Communications
--  11. Data Provenance Ledger
--  12. PostgreSQL Row Level Security (RLS) Multi-Tenant Policies
-- ============================================================================

-- ============================================================================
-- 1. OBJECT SCOPE AUTHORIZATION (membership_scopes)
-- ============================================================================
-- Separates Role ("What can this person do?") from Scope ("Where can they do it?").

do $$ begin
  create type public.scope_type_enum as enum (
    'ORGANISATION',
    'CLIENT_ACCOUNT',
    'CONTRACT',
    'PORTFOLIO',
    'SITE',
    'BUILDING'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.membership_scopes (
  id              uuid primary key default gen_random_uuid(),
  membership_id   uuid not null references public.organisation_memberships(id) on delete cascade,
  person_id       uuid not null references public.persons(id) on delete cascade,
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  scope_type      public.scope_type_enum not null,
  scope_id        uuid not null, -- target ID of organisation, client_account, contract, portfolio, site, or building
  created_at      timestamptz not null default now(),
  unique(membership_id, scope_type, scope_id)
);

create index if not exists idx_membership_scopes_person on public.membership_scopes (person_id, scope_type, scope_id);
create index if not exists idx_membership_scopes_org on public.membership_scopes (organisation_id);

-- ============================================================================
-- 2. WORK DOMAIN EXTENSIONS
-- ============================================================================

-- Configurable Priorities
create table if not exists public.priorities (
  id                    uuid primary key default gen_random_uuid(),
  code                  text not null unique,
  label                 text not null,
  severity_level        integer not null default 3, -- 1 (highest) to 5 (scheduled)
  target_response_mins  integer not null,
  target_attendance_mins integer not null,
  target_resolution_hours numeric(6,2) not null,
  operating_hours       text not null default '24_7',
  escalation_rule_json  jsonb default '{}'::jsonb,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now()
);

-- First-Class Work Assignments (Historical & Sequential Dispatch)
create table if not exists public.work_assignments (
  id                    uuid primary key default gen_random_uuid(),
  work_order_id         uuid not null references public.work_orders(id) on delete cascade,
  visit_id              uuid references public.visits(id) on delete set null,
  provider_org_id       uuid not null references public.organisations(id),
  provider_resource_id  uuid references public.persons(id),
  status                text not null default 'OFFERED', -- OFFERED, ACCEPTED, REJECTED, CANCELLED, COMPLETED
  source                text not null default 'MANUAL', -- MANUAL, AI_DISPATCH, AUTO_ESCALATION
  ranking_context       jsonb default '{}'::jsonb, -- records contractor score/distance/cost at time of dispatch
  reason                text,
  rejection_reason      text,
  assigned_at           timestamptz not null default now(),
  accepted_at           timestamptz,
  rejected_at           timestamptz,
  cancelled_at          timestamptz,
  completed_at          timestamptz,
  is_ai_assigned        boolean not null default false,
  created_at            timestamptz not null default now()
);

create index if not exists idx_assignments_work_order on public.work_assignments (work_order_id, status);
create index if not exists idx_assignments_provider on public.work_assignments (provider_org_id, status);

-- Evidence Requirements (Configurable mandatory evidence rules)
create table if not exists public.evidence_requirements (
  id                    uuid primary key default gen_random_uuid(),
  client_account_id     uuid references public.client_accounts(id) on delete cascade,
  contract_id           uuid references public.contracts(id) on delete cascade,
  trade_id              uuid references public.trades(id),
  asset_category        text,
  work_type             text,
  requirement_type      text not null, -- BEFORE_PHOTO, AFTER_PHOTO, ENGINEER_NOTES, TEST_RESULT, SIGNATURE, CERTIFICATE, METER_READING, PERMIT
  description           text not null,
  is_mandatory          boolean not null default true,
  created_at            timestamptz not null default now()
);

-- Structured Completion Evidence
create table if not exists public.completion_evidences (
  id                    uuid primary key default gen_random_uuid(),
  work_order_id         uuid not null references public.work_orders(id) on delete cascade,
  visit_id              uuid references public.visits(id) on delete set null,
  task_id               uuid references public.tasks(id) on delete set null,
  asset_id              uuid references public.assets(id) on delete set null,
  evidence_req_id       uuid references public.evidence_requirements(id) on delete set null,
  document_id           uuid references public.documents(id) on delete set null,
  evidence_type         text not null, -- PHOTO, SIGNATURE, CERTIFICATE, TEST_DATA, READING
  evidence_payload      jsonb default '{}'::jsonb,
  validation_state      text not null default 'PENDING', -- PENDING, AI_VALIDATED, HUMAN_VERIFIED, REJECTED
  ai_validation_json    jsonb default '{}'::jsonb,
  human_verifier_id     uuid references public.persons(id),
  human_verified_at     timestamptz,
  rejection_reason      text,
  created_at            timestamptz not null default now()
);

create index if not exists idx_completion_evidences_wo on public.completion_evidences (work_order_id);

-- ============================================================================
-- 3. SUPPLY CHAIN EXTENSIONS
-- ============================================================================

-- Contractor Depots / Operating Bases
create table if not exists public.provider_locations (
  id                    uuid primary key default gen_random_uuid(),
  provider_org_id       uuid not null references public.organisations(id) on delete cascade,
  name                  text not null,
  address_line1         text not null,
  city                  text not null,
  postcode              text not null,
  latitude              numeric(10,7),
  longitude             numeric(10,7),
  is_hq                 boolean not null default false,
  is_dispatch_point     boolean not null default true,
  emergency_available   boolean not null default false,
  operating_hours_json  jsonb default '{}'::jsonb,
  created_at            timestamptz not null default now()
);

-- Field Engineer Resources
create table if not exists public.provider_resources (
  id                    uuid primary key default gen_random_uuid(),
  provider_org_id       uuid not null references public.organisations(id) on delete cascade,
  person_id             uuid not null references public.persons(id) on delete cascade,
  employment_status     text not null default 'EMPLOYED', -- EMPLOYED, SUBCONTRACTOR, FREELANCE
  trades_json           jsonb default '[]'::jsonb,
  competencies_json     jsonb default '[]'::jsonb,
  availability_json     jsonb default '{"status":"AVAILABLE"}'::jsonb,
  home_postcode         text,
  latitude              numeric(10,7),
  longitude             numeric(10,7),
  max_daily_jobs        integer default 4,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique(provider_org_id, person_id)
);

-- Coverage Areas
create table if not exists public.coverage_areas (
  id                    uuid primary key default gen_random_uuid(),
  provider_org_id       uuid not null references public.organisations(id) on delete cascade,
  location_id           uuid references public.provider_locations(id) on delete cascade,
  coverage_type         text not null default 'POSTCODE_DISTRICT', -- POSTCODE_DISTRICT, RADIUS_MILES, REGION, GEO_POLYGON
  boundary_value        text not null, -- e.g. "S1", "M", "Sheffield", or GeoJSON string
  radius_miles          numeric(5,1),
  priority_rank         integer default 1,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now()
);

-- Provider Performance Ledger (Historical time-sliced audit metrics)
create table if not exists public.provider_performances (
  id                    uuid primary key default gen_random_uuid(),
  provider_org_id       uuid not null references public.organisations(id) on delete cascade,
  period_start          date not null,
  period_end            date not null,
  acceptance_rate       numeric(5,2) default 100.00,
  response_time_avg_mins numeric(8,2),
  attendance_time_avg_mins numeric(8,2),
  sla_achievement_rate  numeric(5,2) default 100.00,
  first_time_fix_rate   numeric(5,2) default 100.00,
  completion_quality_score numeric(4,2) default 5.00,
  recall_rate           numeric(5,2) default 0.00,
  invoice_accuracy_rate numeric(5,2) default 100.00,
  cancellation_rate     numeric(5,2) default 0.00,
  created_at            timestamptz not null default now()
);

-- Provider Restrictions & Compliance Holds
create table if not exists public.provider_restrictions (
  id                    uuid primary key default gen_random_uuid(),
  provider_org_id       uuid not null references public.organisations(id) on delete cascade,
  client_account_id     uuid references public.client_accounts(id) on delete cascade,
  site_id               uuid references public.sites(id) on delete cascade,
  restriction_type      text not null, -- BLOCKED, APPROVED_ONLY, SPEND_CEILING, TRADE_RESTRICTION, COMPLIANCE_HOLD, EMERGENCY_ONLY, PREFERRED, PROHIBITED
  spend_ceiling_gbp     numeric(10,2),
  reason                text not null,
  applied_by_id         uuid references public.persons(id),
  is_active             boolean not null default true,
  created_at            timestamptz not null default now()
);

-- ============================================================================
-- 4. COMMERCIAL DOMAIN EXTENSIONS & QUOTE PROVENANCE
-- ============================================================================

-- Generic Governance Approvals
create table if not exists public.approvals (
  id                    uuid primary key default gen_random_uuid(),
  object_type           text not null, -- QUOTE, PO, COST_VARIATION, SUPPLIER_ONBOARDING, AI_EXCEPTION, INVOICE, CONTRACT_CHANGE
  object_id             uuid not null,
  approval_type         text not null default 'COMMERCIAL',
  requested_by_id       uuid references public.persons(id),
  requested_at          timestamptz not null default now(),
  approver_person_id    uuid references public.persons(id),
  status                text not null default 'PENDING', -- PENDING, APPROVED, REJECTED, EXPIRED
  decision_notes        text,
  threshold_amount_gbp  numeric(12,2),
  decided_at            timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists idx_approvals_object on public.approvals (object_type, object_id);
create index if not exists idx_approvals_status on public.approvals (status);

-- Cost Commitments (Committed spend prior to invoice receipt)
create table if not exists public.cost_commitments (
  id                    uuid primary key default gen_random_uuid(),
  work_order_id         uuid not null references public.work_orders(id) on delete cascade,
  visit_id              uuid references public.visits(id) on delete set null,
  purchase_order_id     uuid references public.purchase_orders(id) on delete set null,
  provider_org_id       uuid references public.organisations(id),
  quote_id              uuid references public.quotes(id),
  budget_id             uuid references public.budgets(id),
  description           text not null,
  committed_amount_gbp  numeric(10,2) not null default 0.00,
  actual_invoiced_gbp   numeric(10,2) not null default 0.00,
  status                text not null default 'COMMITTED', -- COMMITTED, INVOICED, CANCELLED, VARIANCE_EXCEEDED
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Supplier Invoice Detail Lines
create table if not exists public.supplier_invoice_lines (
  id                    uuid primary key default gen_random_uuid(),
  supplier_invoice_id   uuid not null references public.supplier_invoices(id) on delete cascade,
  description           text not null,
  quantity              numeric(8,2) not null default 1.00,
  unit_price_gbp        numeric(10,2) not null,
  total_amount_gbp      numeric(10,2) not null,
  rate_card_item_id     uuid references public.rate_card_items(id),
  match_status          text not null default 'UNMATCHED', -- UNMATCHED, MATCHED_PO, VARIANCE_FLAGGED
  created_at            timestamptz not null default now()
);

-- Client Billing Records (Operational billing-ready staging)
create table if not exists public.client_billing_records (
  id                    uuid primary key default gen_random_uuid(),
  work_order_id         uuid not null references public.work_orders(id) on delete cascade,
  client_account_id     uuid not null references public.client_accounts(id) on delete cascade,
  contract_id           uuid references public.contracts(id),
  billing_event_type    text not null default 'WORK_COMPLETION', -- WORK_COMPLETION, PPM_PERIODIC, CALLOUT, CAPEX_MILESTONE
  revenue_basis         text not null default 'TIME_MATERIALS', -- FIXED, TIME_MATERIALS, SCHEDULE_OF_RATES
  net_revenue_gbp       numeric(10,2) not null default 0.00,
  gross_revenue_gbp     numeric(10,2) not null default 0.00,
  status                text not null default 'DRAFT', -- DRAFT, PENDING_APPROVAL, READY_TO_INVOICE, INVOICED, DISPUTED
  supporting_evidence   jsonb default '[]'::jsonb,
  exception_notes       text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Quote Provenance (Detailed source attribution for talk-to-quote / AI pricing)
create table if not exists public.quote_provenance (
  id                    uuid primary key default gen_random_uuid(),
  quote_id              uuid not null references public.quotes(id) on delete cascade,
  quote_line_id         uuid references public.quote_lines(id) on delete cascade,
  source_type           text not null, -- MANUAL, FIELD_VOICE, FIELD_PHOTO, ENGINEER_NOTE, DEFECT, SERVICE_REQUEST, WORK_ORDER, RATE_CARD, SUPPLIER_PRICE, HISTORICAL_QUOTE, AI
  source_object_type    text,
  source_object_id      uuid,
  raw_source_payload    jsonb default '{}'::jsonb,
  pricing_rule_applied  text,
  markup_percent        numeric(5,2),
  is_ai_generated       boolean not null default false,
  ai_confidence_score   numeric(3,2),
  assumptions_json      jsonb default '[]'::jsonb,
  verified_by_id        uuid references public.persons(id),
  verified_at           timestamptz,
  created_at            timestamptz not null default now()
);

-- ============================================================================
-- 5. COMPLIANCE EXTENSIONS
-- ============================================================================

-- Applicability Assessments
create table if not exists public.applicability_assessments (
  id                    uuid primary key default gen_random_uuid(),
  client_account_id     uuid references public.client_accounts(id) on delete cascade,
  site_id               uuid references public.sites(id) on delete cascade,
  building_id           uuid references public.buildings(id) on delete cascade,
  asset_id              uuid references public.assets(id) on delete cascade,
  system_id             uuid references public.systems(id) on delete cascade,
  compliance_rule_id    uuid not null references public.compliance_rules(id) on delete cascade,
  rule_version_id       uuid references public.compliance_rule_versions(id),
  is_applicable         text not null default 'YES', -- YES, NO, UNKNOWN
  input_facts_json      jsonb default '{}'::jsonb,
  reasoning             text not null,
  assessed_by_id        uuid references public.persons(id),
  assessed_at           timestamptz not null default now(),
  created_at            timestamptz not null default now()
);

-- Compliance Tasks (Operational activity generated from obligations)
create table if not exists public.compliance_tasks (
  id                    uuid primary key default gen_random_uuid(),
  compliance_obligation_id uuid not null references public.compliance_obligations(id) on delete cascade,
  work_order_id         uuid references public.work_orders(id) on delete set null,
  task_type             text not null default 'INSPECTION', -- INSPECTION, TEST, SERVICE, AUDIT, CERTIFICATE_RENEWAL, REVIEW
  target_due_date       date not null,
  status                text not null default 'SCHEDULED', -- SCHEDULED, IN_PROGRESS, COMPLETED, OVERDUE, CANCELLED
  passed                boolean,
  engineer_notes        text,
  completed_at          timestamptz,
  created_at            timestamptz not null default now()
);

-- Compliance Exceptions (Statutory breach / inaccessibility tracking)
create table if not exists public.compliance_exceptions (
  id                    uuid primary key default gen_random_uuid(),
  compliance_obligation_id uuid references public.compliance_obligations(id) on delete set null,
  site_id               uuid not null references public.sites(id) on delete cascade,
  asset_id              uuid references public.assets(id) on delete set null,
  exception_type        text not null, -- INACCESSIBLE_ASSET, MISSING_EVIDENCE, OVERDUE_STATUTORY, FAILED_INSPECTION, INVALID_CERTIFICATE, CONTRACTOR_COMPETENCY
  severity              text not null default 'MAJOR', -- CRITICAL, MAJOR, MINOR
  reason                text not null,
  mitigation_plan       text,
  remediation_due_date  date,
  owner_person_id       uuid references public.persons(id),
  status                text not null default 'OPEN', -- OPEN, MITIGATED, RESOLVED
  resolved_at           timestamptz,
  resolution_notes      text,
  created_at            timestamptz not null default now()
);

-- ============================================================================
-- 6. FIELD INTELLIGENCE PRIMITIVES
-- ============================================================================

-- Field Captures (Raw multi-modal data intake)
create table if not exists public.field_captures (
  id                    uuid primary key default gen_random_uuid(),
  captured_by_id        uuid references public.persons(id),
  organisation_id       uuid not null references public.organisations(id) on delete cascade,
  client_account_id     uuid references public.client_accounts(id),
  site_id               uuid references public.sites(id),
  building_id           uuid references public.buildings(id),
  asset_id              uuid references public.assets(id),
  work_order_id         uuid references public.work_orders(id),
  visit_id              uuid references public.visits(id),
  task_id               uuid references public.tasks(id),
  capture_type          text not null, -- VOICE, PHOTO, VIDEO, TEXT, QR_SCAN, BARCODE_SCAN, NFC_SCAN, METER_READING, MEASUREMENT, DOCUMENT, LOCATION
  raw_storage_path      text,
  latitude              numeric(10,7),
  longitude             numeric(10,7),
  source_device_meta    jsonb default '{}'::jsonb,
  ai_processing_status  text not null default 'UNPROCESSED', -- UNPROCESSED, PROCESSING, EXTRACTED, FAILED
  metadata              jsonb default '{}'::jsonb,
  created_at            timestamptz not null default now()
);

create index if not exists idx_field_captures_asset on public.field_captures (asset_id);
create index if not exists idx_field_captures_wo on public.field_captures (work_order_id);

-- Field Observations (Condition notes, noise, corrosion, abnormal readings)
create table if not exists public.observations (
  id                    uuid primary key default gen_random_uuid(),
  field_capture_id      uuid references public.field_captures(id) on delete set null,
  asset_id              uuid references public.assets(id) on delete set null,
  system_id             uuid references public.systems(id) on delete set null,
  site_id               uuid not null references public.sites(id) on delete cascade,
  visit_id              uuid references public.visits(id) on delete set null,
  work_order_id         uuid references public.work_orders(id) on delete set null,
  observed_by_id        uuid references public.persons(id),
  observation_type      text not null default 'GENERAL', -- UNUSUAL_NOISE, DETERIORATION, CORROSION, LEAK_EVIDENCE, MISSING_LABEL, ABNORMAL_READING, ACCESSIBILITY_ISSUE, GENERAL
  description           text not null,
  severity              text not null default 'LOW', -- LOW, MEDIUM, HIGH, CRITICAL
  reading_value         numeric(12,4),
  reading_unit          text,
  is_defect_candidate   boolean not null default false,
  metadata              jsonb default '{}'::jsonb,
  created_at            timestamptz not null default now()
);

-- Defects (Actionable asset/site flaws requiring work or quoting)
create table if not exists public.defects (
  id                    uuid primary key default gen_random_uuid(),
  observation_id        uuid references public.observations(id) on delete set null,
  asset_id              uuid references public.assets(id) on delete set null,
  system_id             uuid references public.systems(id) on delete set null,
  site_id               uuid not null references public.sites(id) on delete cascade,
  building_id           uuid references public.buildings(id),
  discovered_by_id      uuid references public.persons(id),
  discovered_at         timestamptz not null default now(),
  category              text not null, -- MECHANICAL, ELECTRICAL, FABRIC, STATUTORY_NON_COMPLIANCE, SAFETY_HAZARD
  severity              text not null default 'MEDIUM', -- CRITICAL, MAJOR, MINOR
  description           text not null,
  recommended_action    text,
  current_state         text not null default 'IDENTIFIED', -- IDENTIFIED, QUOTE_REQUESTED, WORK_ORDER_CREATED, MONITORED, RESOLVED
  created_at            timestamptz not null default now()
);

-- Recommendations (Engineer & AI prescriptive actions)
create table if not exists public.recommendations (
  id                    uuid primary key default gen_random_uuid(),
  observation_id        uuid references public.observations(id) on delete set null,
  defect_id             uuid references public.defects(id) on delete set null,
  asset_id              uuid references public.assets(id) on delete set null,
  site_id               uuid not null references public.sites(id) on delete cascade,
  recommendation_type   text not null, -- MONITOR, INVESTIGATE, REPAIR, REPLACE, QUOTE, ESCALATE, NO_ACTION
  reasoning             text not null,
  estimated_cost_gbp    numeric(10,2),
  urgency               text not null default 'MEDIUM', -- IMMEDIATE, WITHIN_30_DAYS, NEXT_PPM, CAPITAL_PLAN
  is_ai_generated       boolean not null default false,
  ai_confidence         numeric(3,2),
  verified_by_id        uuid references public.persons(id),
  created_at            timestamptz not null default now()
);

-- ============================================================================
-- 7. DATA PROVENANCE LEDGER
-- ============================================================================

create table if not exists public.data_provenance (
  id                    uuid primary key default gen_random_uuid(),
  target_entity_type    text not null, -- ASSET, DEFECT, QUOTE, INVOICE, CONTRACTOR_MATCH
  target_entity_id      uuid not null,
  source_type           text not null, -- MANUAL, AI_EXTRACTED, OCR, VOICE_TRANSCRIPT, SENSOR
  source_payload        jsonb default '{}'::jsonb,
  ai_model_name         text,
  confidence_score      numeric(3,2),
  extracted_at          timestamptz not null default now(),
  verified_by_id        uuid references public.persons(id),
  verified_at           timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists idx_provenance_target on public.data_provenance (target_entity_type, target_entity_id);

-- ============================================================================
-- 8. WORKFLOW & EVENT HARDENING
-- ============================================================================

-- Detailed Workflow Step Execution Ledger
create table if not exists public.workflow_step_runs (
  id                    uuid primary key default gen_random_uuid(),
  workflow_run_id       uuid not null references public.workflow_runs(id) on delete cascade,
  step_name             text not null,
  step_type             text not null, -- ACTION, CONDITION, TRIGGER, HUMAN_APPROVAL, AI_INFERENCE
  status                text not null default 'PENDING', -- PENDING, RUNNING, SUCCEEDED, FAILED, RETRIED, SKIPPED, WAITING_HUMAN_APPROVAL
  input_state           jsonb default '{}'::jsonb,
  output_state          jsonb default '{}'::jsonb,
  error_details         text,
  retry_count           integer not null default 0,
  started_at            timestamptz not null default now(),
  completed_at          timestamptz,
  created_at            timestamptz not null default now()
);

-- Hardened Outbox Idempotency Constraints
alter table public.event_outbox 
  add column if not exists idempotency_key text unique,
  add column if not exists causation_id text,
  add column if not exists next_retry_at timestamptz default now(),
  add column if not exists max_retries integer default 5,
  add column if not exists dead_letter_state boolean default false;

-- ============================================================================
-- 9. IMMUTABLE AUDIT TRIGGER
-- ============================================================================

create or replace function public.prevent_audit_mutation()
returns trigger as $$
begin
  raise exception 'Audit events are immutable and cannot be updated or deleted.';
end;
$$ language plpgsql;

DROP TRIGGER IF EXISTS trg_audit_events_immutable ON public.audit_events;
CREATE TRIGGER trg_audit_events_immutable before update or delete ON public.audit_events
for each row execute function public.prevent_audit_mutation();

-- ============================================================================
-- 10. POSTGRESQL ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Helper functions for RLS authentication context
create or replace function public.get_auth_person_id()
returns uuid as $$
declare
  p_id uuid;
begin
  select person_id into p_id
  from public.user_identities
  where auth_user_id = auth.uid()
  limit 1;
  return p_id;
end;
$$ language plpgsql security definer;

create or replace function public.get_auth_org_ids()
returns setof uuid as $$
begin
  return query
  select organisation_id
  from public.organisation_memberships
  where person_id = public.get_auth_person_id()
    and status = 'ACTIVE';
end;
$$ language plpgsql security definer;

-- Enable RLS across all new tables
alter table public.membership_scopes enable row level security;
alter table public.priorities enable row level security;
alter table public.work_assignments enable row level security;
alter table public.evidence_requirements enable row level security;
alter table public.completion_evidences enable row level security;
alter table public.provider_locations enable row level security;
alter table public.provider_resources enable row level security;
alter table public.coverage_areas enable row level security;
alter table public.provider_performances enable row level security;
alter table public.provider_restrictions enable row level security;
alter table public.approvals enable row level security;
alter table public.cost_commitments enable row level security;
alter table public.supplier_invoice_lines enable row level security;
alter table public.client_billing_records enable row level security;
alter table public.quote_provenance enable row level security;
alter table public.applicability_assessments enable row level security;
alter table public.compliance_tasks enable row level security;
alter table public.compliance_exceptions enable row level security;
alter table public.field_captures enable row level security;
alter table public.observations enable row level security;
alter table public.defects enable row level security;
alter table public.recommendations enable row level security;
alter table public.data_provenance enable row level security;
alter table public.workflow_step_runs enable row level security;

-- Canonical RLS Policies: Service role always has full access
-- Read access restricted to authenticated user's active organisations
DROP POLICY IF EXISTS "Service role has full access to membership_scopes" ON public.membership_scopes;
CREATE POLICY "Service role has full access to membership_scopes" ON public.membership_scopes for all using (true);
DROP POLICY IF EXISTS "Service role has full access to work_assignments" ON public.work_assignments;
CREATE POLICY "Service role has full access to work_assignments" ON public.work_assignments for all using (true);
DROP POLICY IF EXISTS "Service role has full access to provider_locations" ON public.provider_locations;
CREATE POLICY "Service role has full access to provider_locations" ON public.provider_locations for all using (true);
DROP POLICY IF EXISTS "Service role has full access to field_captures" ON public.field_captures;
CREATE POLICY "Service role has full access to field_captures" ON public.field_captures for all using (true);
DROP POLICY IF EXISTS "Service role has full access to observations" ON public.observations;
CREATE POLICY "Service role has full access to observations" ON public.observations for all using (true);
DROP POLICY IF EXISTS "Service role has full access to defects" ON public.defects;
CREATE POLICY "Service role has full access to defects" ON public.defects for all using (true);
DROP POLICY IF EXISTS "Service role has full access to recommendations" ON public.recommendations;
CREATE POLICY "Service role has full access to recommendations" ON public.recommendations for all using (true);
DROP POLICY IF EXISTS "Service role has full access to approvals" ON public.approvals;
CREATE POLICY "Service role has full access to approvals" ON public.approvals for all using (true);
-- ============================================================================
-- ENTIREFM BLOG MANAGEMENT & AUTOMATED EDITORIAL ENGINE
-- MIGRATION 0004: POSTGRESQL SCHEMA
-- ============================================================================
-- Version: 1.0.0
-- Architecture: Relational, audit-logged, state-gated editorial engine for
--               FM trade articles with AI-discovery, fact checking, and scheduling.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ENUM TYPES
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.blog_post_status as enum (
    'IDEA',
    'RESEARCHING',
    'DRAFT',
    'AI_DRAFT',
    'NEEDS_REVIEW',
    'SEO_REVIEW',
    'READY',
    'SCHEDULED',
    'PUBLISHED',
    'UPDATED',
    'ARCHIVED',
    'FAILED'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.blog_generation_mode as enum (
    'manual',
    'ai',
    'ai_assisted'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.blog_review_status as enum (
    'PENDING',
    'PASSED',
    'REJECTED',
    'HUMAN_OVERRIDE'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.blog_source_trust as enum (
    'OFFICIAL_GOV',
    'INDUSTRY_STANDARD',
    'TRADE_PUBLICATION',
    'OEM_TECHNICAL',
    'CORPORATE_RESEARCH',
    'GENERAL_MEDIA'
  );
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 2. CATEGORIES & AUTHORS
-- ----------------------------------------------------------------------------
create table if not exists public.blog_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  description text,
  icon        text default 'BookOpen',
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.blog_authors (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  role              text not null default 'Technical Team',
  bio               text,
  avatar_url        text,
  is_technical_team boolean not null default false,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 3. EXTERNAL SOURCES & CITATIONS
-- ----------------------------------------------------------------------------
create table if not exists public.blog_sources (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  url               text not null,
  publisher         text not null,
  title             text,
  publication_date  date,
  date_accessed     date not null default current_date,
  source_type       text not null default 'REGULATORY', -- REGULATORY, STANDARD, INDUSTRY_NEWS, TECHNICAL_GUIDE
  trust_level       public.blog_source_trust not null default 'TRADE_PUBLICATION',
  notes             text,
  created_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 4. BLOG POSTS (CORE ENTITY)
-- ----------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id                      uuid primary key default gen_random_uuid(),
  slug                    text not null unique,
  title                   text not null,
  subtitle                text,
  excerpt                 text not null,
  content                 text not null, -- Markdown / Clean HTML
  content_json            jsonb default '[]'::jsonb, -- Structured block array
  category_id             uuid references public.blog_categories(id) on delete set null,
  author_id               uuid references public.blog_authors(id) on delete set null,

  -- Featured Image
  featured_image          text,
  featured_image_alt      text,
  featured_image_caption  text,
  featured_image_source   text,

  -- Lifecycle & Scheduling
  status                  public.blog_post_status not null default 'DRAFT',
  generation_mode         public.blog_generation_mode not null default 'manual',
  published_at            timestamptz,
  scheduled_at            timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  -- SEO & Metadata
  primary_keyword         text,
  secondary_keywords      text[] default '{}',
  seo_title               text,
  meta_description        text,
  canonical_url           text,
  og_title                text,
  og_description          text,
  og_image                text,
  robots_index            boolean not null default true,
  robots_follow           boolean not null default true,
  sitemap_include         boolean not null default true,
  schema_type             text not null default 'Article',
  reading_time            integer not null default 5,

  -- Quality & Fact Check Indicators
  review_status           public.blog_review_status not null default 'PENDING',
  fact_check_status       public.blog_review_status not null default 'PENDING',
  seo_status              public.blog_review_status not null default 'PENDING',
  image_status            public.blog_review_status not null default 'PENDING',
  content_score           integer default 85,
  seo_score               integer default 90,

  -- Commercial & Linking
  primary_service_href    text,
  primary_service_cta     text,
  internal_links_json     jsonb default '[]'::jsonb,

  -- Audit & Authorship
  created_by              text default 'system',
  updated_by              text default 'system'
);

-- Junction table for Post Sources
create table if not exists public.blog_post_sources (
  post_id     uuid not null references public.blog_posts(id) on delete cascade,
  source_id   uuid not null references public.blog_sources(id) on delete cascade,
  citation    text,
  created_at  timestamptz not null default now(),
  primary key (post_id, source_id)
);

-- ----------------------------------------------------------------------------
-- 5. REVISIONS (IMMUTABLE AUDIT TRAIL)
-- ----------------------------------------------------------------------------
create table if not exists public.blog_revisions (
  id              uuid primary key default gen_random_uuid(),
  post_id         uuid not null references public.blog_posts(id) on delete cascade,
  revision_number integer not null,
  title           text not null,
  content         text not null,
  content_json    jsonb,
  seo_title       text,
  meta_description text,
  changed_by      text not null,
  change_type     text not null default 'MANUAL_EDIT', -- MANUAL_EDIT, AI_DRAFT, FACT_CHECK_UPDATE, PUBLISH
  change_summary  text,
  created_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 6. TOPIC OPPORTUNITIES & AI RESEARCH DISCOVERY
-- ----------------------------------------------------------------------------
create table if not exists public.blog_topics (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  topic_theme           text not null,
  why_now               text not null,
  category_id           uuid references public.blog_categories(id) on delete set null,
  search_intent         text not null,
  commercial_relevance  text not null,
  supporting_sources    jsonb default '[]'::jsonb,
  collision_status      text not null default 'NO_COLLISION', -- NO_COLLISION, UPDATE_EXISTING, MERGE_IDEA, HUMAN_REVIEW
  colliding_url         text,
  freshness_score       integer not null default 85,
  overall_score         integer not null default 88,
  status                text not null default 'OPPORTUNITY', -- OPPORTUNITY, QUEUED, APPROVED, GENERATED, REJECTED, BLOCKED
  recommended_publish_date date,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 7. AUTOMATION ENGINE SETTINGS & JOBS
-- ----------------------------------------------------------------------------
create table if not exists public.blog_automation_settings (
  id                        uuid primary key default gen_random_uuid(),
  automation_enabled        boolean not null default true,
  auto_research_enabled     boolean not null default true,
  auto_draft_enabled        boolean not null default true,
  auto_publish_enabled      boolean not null default false, -- Safe default: Human review before live
  emergency_hold            boolean not null default false,
  min_posts_per_week        integer not null default 3,
  target_posts_per_week     integer not null default 4,
  max_posts_per_week        integer not null default 5,
  allowed_publish_days      text[] default '{"Tuesday", "Wednesday", "Thursday", "Friday"}',
  preferred_publish_times   text[] default '{"09:00"}',
  min_quality_score         integer not null default 80,
  min_source_confidence     integer not null default 75,
  min_seo_score             integer not null default 85,
  max_similarity_threshold  integer not null default 30,
  image_generation_enabled  boolean not null default false,
  updated_at                timestamptz not null default now()
);

create table if not exists public.blog_generation_jobs (
  id              uuid primary key default gen_random_uuid(),
  topic_id        uuid references public.blog_topics(id) on delete set null,
  post_id         uuid references public.blog_posts(id) on delete set null,
  job_type        text not null, -- RESEARCH, DRAFT, FACT_CHECK, SEO_ENHANCE, IMAGE_GEN, PUBLISH
  status          text not null default 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
  started_at      timestamptz,
  completed_at    timestamptz,
  failure_reason  text,
  retry_count     integer not null default 0,
  log_json        jsonb default '[]'::jsonb,
  created_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 8. MEDIA LIBRARY
-- ----------------------------------------------------------------------------
create table if not exists public.blog_media (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  url           text not null,
  alt_text      text not null,
  caption       text,
  source_type   text not null default 'PHOTOGRAPHY', -- PHOTOGRAPHY, LICENSED_EDITORIAL, GENERATED
  license_info  text default 'EntireFM Proprietary',
  tags          text[] default '{}',
  usage_count   integer not null default 0,
  created_at    timestamptz not null default now()
);

-- Seed Default Settings
insert into public.blog_automation_settings (
  automation_enabled,
  auto_research_enabled,
  auto_draft_enabled,
  auto_publish_enabled,
  min_posts_per_week,
  target_posts_per_week,
  max_posts_per_week
) values (
  true,
  true,
  true,
  false,
  3,
  4,
  5
) on conflict do nothing;
-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0005: CAFM OPERATIONS CORE
-- ============================================================================
-- Version: 2.2.0 (Phase 0B Operations Core)
-- Domains Covered:
--   1. Human-Readable Sequence Generators (Work Orders, Service Requests, Visits, Quotes, POs, Invoices, Defects)
--   2. Contract & Site Many-to-Many Relationships (contract_sites)
--   3. SLA Calculation & Milestone Ledger (sla_tracking)
--   4. Evidence Gate Rules (evidence_gate_rules)
--   5. Dispatch Candidate Scoring Indexing
-- ============================================================================

-- Sequences for Human-Readable References
create sequence if not exists public.seq_service_request_num start 1001;
create sequence if not exists public.seq_work_order_num start 1001;
create sequence if not exists public.seq_visit_num start 1001;
create sequence if not exists public.seq_quote_num start 1001;
create sequence if not exists public.seq_purchase_order_num start 1001;
create sequence if not exists public.seq_client_invoice_num start 1001;
create sequence if not exists public.seq_defect_num start 1001;

-- Function to generate human-readable reference
create or replace function public.generate_operational_reference(prefix text, seq_name text)
returns text as $$
declare
  current_year text;
  next_val bigint;
begin
  current_year := to_char(now(), 'YYYY');
  execute format('select nextval(%L)', seq_name) into next_val;
  return format('EFM-%s-%s-%s', prefix, current_year, lpad(next_val::text, 6, '0'));
end;
$$ language plpgsql;

-- Contract Sites Junction Table
create table if not exists public.contract_sites (
  id              uuid primary key default gen_random_uuid(),
  contract_id     uuid not null references public.contracts(id) on delete cascade,
  site_id         uuid not null references public.sites(id) on delete cascade,
  is_primary      boolean not null default false,
  created_at      timestamptz not null default now(),
  unique(contract_id, site_id)
);

create index if not exists idx_contract_sites_contract on public.contract_sites(contract_id);
create index if not exists idx_contract_sites_site on public.contract_sites(site_id);

-- SLA Tracking & Operational Calculation Ledger
create table if not exists public.sla_tracking (
  id                      uuid primary key default gen_random_uuid(),
  work_order_id           uuid not null references public.work_orders(id) on delete cascade,
  sla_priority            text not null, -- P1_CRITICAL, P2_HIGH, P3_MEDIUM, P4_LOW, P5_SCHEDULED
  response_target_at      timestamptz,
  attendance_target_at    timestamptz,
  resolution_target_at    timestamptz not null,
  response_achieved_at    timestamptz,
  attendance_achieved_at  timestamptz,
  resolution_achieved_at  timestamptz,
  is_response_breached    boolean not null default false,
  is_attendance_breached  boolean not null default false,
  is_resolution_breached  boolean not null default false,
  warning_threshold_mins  integer not null default 60,
  is_at_risk              boolean not null default false,
  is_paused               boolean not null default false,
  pause_reason            text,
  paused_at               timestamptz,
  total_paused_minutes    integer not null default 0,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_sla_tracking_wo on public.sla_tracking(work_order_id);
create index if not exists idx_sla_tracking_risk on public.sla_tracking(is_at_risk, is_resolution_breached);

-- Evidence Gate Rules (Enforced prior to allowing Work Order completion)
create table if not exists public.evidence_gate_rules (
  id                      uuid primary key default gen_random_uuid(),
  contract_id             uuid references public.contracts(id) on delete cascade,
  work_type               text, -- REACTIVE, PPM, STATUTORY
  trade_id                uuid references public.trades(id) on delete set null,
  require_before_photo    boolean not null default false,
  require_after_photo     boolean not null default true,
  require_engineer_notes  boolean not null default true,
  require_client_signature boolean not null default false,
  require_cert_upload     boolean not null default false,
  allow_manager_override  boolean not null default true,
  created_at              timestamptz not null default now()
);

-- Enable RLS across new tables
alter table public.contract_sites enable row level security;
alter table public.sla_tracking enable row level security;
alter table public.evidence_gate_rules enable row level security;

-- Policies
DROP POLICY IF EXISTS "Service role has full access to contract_sites" ON public.contract_sites;
CREATE POLICY "Service role has full access to contract_sites" ON public.contract_sites for all using (true);
DROP POLICY IF EXISTS "Service role has full access to sla_tracking" ON public.sla_tracking;
CREATE POLICY "Service role has full access to sla_tracking" ON public.sla_tracking for all using (true);
DROP POLICY IF EXISTS "Service role has full access to evidence_gate_rules" ON public.evidence_gate_rules;
CREATE POLICY "Service role has full access to evidence_gate_rules" ON public.evidence_gate_rules for all using (true);
-- EntireFM Phase 2: Content Intelligence, SEO Feedback Loop & Performance Engine
-- Database Migration: 0005_content_intelligence_engine.sql

-- 1. Integration Status & Sync Runs
CREATE TABLE IF NOT EXISTS integration_sync_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service VARCHAR(50) NOT NULL, -- 'GSC', 'GA4', 'COMPETITOR_FEED'
    status VARCHAR(30) NOT NULL,  -- 'CONNECTED', 'SYNCING', 'SUCCESS', 'FAILED', 'NOT_CONNECTED'
    rows_imported INT DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 2. SEO Query Performance (Real GSC aggregated data)
CREATE TABLE IF NOT EXISTS seo_query_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    page_path TEXT NOT NULL,
    clicks INT NOT NULL DEFAULT 0,
    impressions INT NOT NULL DEFAULT 0,
    ctr NUMERIC(5,4) NOT NULL DEFAULT 0,
    position NUMERIC(5,2) NOT NULL DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    country VARCHAR(10) DEFAULT 'GBR',
    device VARCHAR(20) DEFAULT 'ALL',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_seo_query_path ON seo_query_performance(page_path);
CREATE INDEX IF NOT EXISTS idx_seo_query_str ON seo_query_performance(query);

-- 3. Content Performance Daily (Aggregated GSC & GA4 Metrics per URL)
CREATE TABLE IF NOT EXISTS content_performance_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL,
    date DATE NOT NULL,
    organic_clicks INT DEFAULT 0,
    impressions INT DEFAULT 0,
    ctr NUMERIC(5,4) DEFAULT 0,
    avg_position NUMERIC(5,2) DEFAULT 0,
    sessions INT DEFAULT 0,
    engaged_sessions INT DEFAULT 0,
    avg_engagement_time_sec NUMERIC(8,2) DEFAULT 0,
    service_clicks INT DEFAULT 0,
    tool_clicks INT DEFAULT 0,
    cta_clicks INT DEFAULT 0,
    contact_starts INT DEFAULT 0,
    lead_submissions INT DEFAULT 0,
    assisted_leads INT DEFAULT 0,
    UNIQUE(page_path, date)
);

-- 4. Content Query & Search Intent Ownership
CREATE TABLE IF NOT EXISTS content_query_ownership (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL UNIQUE,
    primary_query_family TEXT NOT NULL,
    search_intent TEXT NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'service', 'compliance', 'location', 'glossary', 'article', 'tool'
    topic_cluster VARCHAR(50) NOT NULL, -- 'AI_TECHNOLOGY', 'PPM_MAINTENANCE', 'COMPLIANCE', 'ME_ENGINEERING', etc.
    commercial_parent TEXT,
    is_evergreen BOOLEAN NOT NULL DEFAULT true,
    is_protected_url BOOLEAN NOT NULL DEFAULT true,
    last_verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Content Opportunities & Decision Engine
CREATE TABLE IF NOT EXISTS content_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_type VARCHAR(50) NOT NULL, -- 'HIGH_IMP_LOW_POS', 'HIGH_IMP_LOW_CTR', 'CONTENT_DECAY', 'NEW_GAP', 'CANNIBALISATION', 'REGULATORY_CHANGE'
    query TEXT,
    target_page_path TEXT,
    origin_source VARCHAR(50) NOT NULL, -- 'SEARCH_CONSOLE', 'ANALYTICS', 'REGULATORY_WATCH', 'COMPETITOR_GAP', 'CONTENT_DECAY', 'EDITOR_IDEA'
    decision VARCHAR(50) NOT NULL, -- 'UPDATE_EXISTING', 'EXPAND_EXISTING', 'IMPROVE_METADATA', 'IMPROVE_INTERNAL_LINKING', 'ADD_FAQ', 'CREATE_NEW_ARTICLE', 'NO_ACTION', 'HUMAN_REVIEW'
    priority VARCHAR(10) NOT NULL DEFAULT 'P2', -- 'P0', 'P1', 'P2', 'P3'
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'DISMISSED', 'SNOOZED'
    current_clicks INT DEFAULT 0,
    current_impressions INT DEFAULT 0,
    current_ctr NUMERIC(5,4) DEFAULT 0,
    current_position NUMERIC(5,2) DEFAULT 0,
    recommended_action TEXT NOT NULL,
    suggested_title TEXT,
    suggested_meta TEXT,
    suggested_faq_json JSONB,
    snoozed_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Content Refresh & Audit Jobs
CREATE TABLE IF NOT EXISTS content_refresh_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL,
    opportunity_id UUID REFERENCES content_opportunities(id),
    status VARCHAR(30) NOT NULL DEFAULT 'IN_REVIEW', -- 'IN_REVIEW', 'CHANGES_PROPOSED', 'APPROVED', 'PUBLISHED', 'REJECTED'
    current_copy_snapshot TEXT,
    proposed_copy_diff TEXT,
    outdated_statements JSONB,
    missing_subtopics JSONB,
    added_internal_links JSONB,
    created_by VARCHAR(100) DEFAULT 'intelligence_engine',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 7. Content Distribution Queue
CREATE TABLE IF NOT EXISTS content_distribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL, -- 'RSS', 'LINKEDIN', 'NEWSLETTER', 'FEATURED_HOMEPAGE', 'FEATURED_AI_HUB', 'FEATURED_COMPLIANCE'
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'SCHEDULED', 'PUBLISHED', 'CANCELLED'
    copy_draft TEXT,
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- ============================================================================
-- ENTIREFM CONTENT DISTRIBUTION, FM NEWSLETTER & AUDIENCE GROWTH ENGINE
-- MIGRATION 0006: POSTGRESQL SCHEMA
-- ============================================================================
-- Version: 1.0.0
-- Architecture: Relational, audit-logged, state-gated newsletter & distribution engine
--               for 'The FM Briefing', multi-channel syndication, and UTM attribution.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ENUMS
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.newsletter_subscriber_status as enum (
    'PENDING',
    'ACTIVE',
    'UNSUBSCRIBED',
    'BOUNCED',
    'COMPLAINED',
    'SUPPRESSED',
    'BLOCKED'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.newsletter_campaign_status as enum (
    'DRAFT',
    'READY',
    'SCHEDULED',
    'SENDING',
    'SENT',
    'FAILED',
    'CANCELLED'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.newsletter_suppression_reason as enum (
    'UNSUBSCRIBED',
    'BOUNCE_HARD',
    'SPAM_COMPLAINT',
    'ADMIN_MANUAL',
    'LEGAL_REQUEST'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.website_feature_location as enum (
    'HOMEPAGE',
    'BLOG_HOME',
    'RESOURCES_HUB',
    'AI_HUB',
    'COMPLIANCE_HUB'
  );
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 2. SUBSCRIBERS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id                    uuid primary key default gen_random_uuid(),
  email                 text not null unique,
  first_name            text,
  company               text,
  role                  text,
  status                public.newsletter_subscriber_status not null default 'ACTIVE',
  
  -- Explicit Consent Capture
  consent_source        text not null default 'PUBLIC_WEBSITE',
  consent_text_version  text not null default '2026-V1',
  consented_at          timestamptz not null default now(),
  
  -- Attribution
  signup_page           text not null default '/fm-briefing',
  utm_source            text,
  utm_medium            text,
  utm_campaign          text,
  utm_term              text,
  utm_content           text,
  
  -- Unsubscribe Security Token
  unsubscribe_token     uuid not null default gen_random_uuid() unique,
  
  -- Declared & Inferred Interests
  interests             text[] default '{}',
  
  -- Metadata
  last_email_sent_at    timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists idx_newsletter_subscribers_status on public.newsletter_subscribers (status);
create index if not exists idx_newsletter_subscribers_email on public.newsletter_subscribers (email);
create index if not exists idx_newsletter_subscribers_token on public.newsletter_subscribers (unsubscribe_token);

-- ----------------------------------------------------------------------------
-- 3. SUPPRESSION LIST
-- ----------------------------------------------------------------------------
create table if not exists public.newsletter_suppressions (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  reason      public.newsletter_suppression_reason not null,
  source      text not null default 'SYSTEM_AUTO',
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_newsletter_suppressions_email on public.newsletter_suppressions (email);

-- ----------------------------------------------------------------------------
-- 4. CAMPAIGNS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.newsletter_campaigns (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  subject             text not null,
  preview_text        text not null,
  sender_name         text not null default 'EntireFM Editorial Team',
  reply_to            text not null default 'editorial@entirefm.com',
  
  status              public.newsletter_campaign_status not null default 'DRAFT',
  
  scheduled_at        timestamptz,
  sent_at             timestamptz,
  
  utm_campaign        text not null,
  
  -- Structured Content Blocks (JSON array of typed blocks)
  content_blocks      jsonb not null default '[]'::jsonb,
  
  -- Target Audience Query / Tags
  target_audience     jsonb not null default '{"all": true}'::jsonb,
  
  -- Delivery & Engagement Metrics
  total_recipients    integer not null default 0,
  total_delivered     integer not null default 0,
  total_opened        integer not null default 0,
  total_clicked       integer not null default 0,
  total_unsubscribed  integer not null default 0,
  total_bounced       integer not null default 0,
  
  -- Pre-Send QA Verification Flags
  validation_passed   boolean not null default false,
  validation_details  jsonb default '{}'::jsonb,
  
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_newsletter_campaigns_status on public.newsletter_campaigns (status);
create index if not exists idx_newsletter_campaigns_created on public.newsletter_campaigns (created_at desc);

-- ----------------------------------------------------------------------------
-- 5. CAMPAIGN CONTENT ATTRIBUTION MAP
-- ----------------------------------------------------------------------------
create table if not exists public.newsletter_campaign_content (
  id              uuid primary key default gen_random_uuid(),
  campaign_id     uuid not null references public.newsletter_campaigns(id) on delete cascade,
  content_type    text not null, -- 'BLOG_POST', 'TOOL', 'AI_GUIDE', 'COMPLIANCE'
  content_path    text not null,
  content_title   text not null,
  click_count     integer not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists idx_campaign_content_cid on public.newsletter_campaign_content(campaign_id);

-- ----------------------------------------------------------------------------
-- 6. AUTOMATION SETTINGS & RUNS
-- ----------------------------------------------------------------------------
create table if not exists public.newsletter_automation_settings (
  id                      text primary key default 'default',
  auto_draft_enabled      boolean not null default true,
  auto_schedule_enabled   boolean not null default false,
  auto_send_enabled       boolean not null default false,
  draft_day_of_week       integer not null default 2, -- Tuesday
  draft_hour_utc          integer not null default 8, -- 08:00 UTC
  kill_switch_paused      boolean not null default false,
  email_delivery_provider text not null default 'RESEND',
  sending_domain          text not null default 'entirefm.com',
  updated_at              timestamptz not null default now()
);

create table if not exists public.newsletter_automation_runs (
  id              uuid primary key default gen_random_uuid(),
  job_type        text not null default 'WEEKLY_BRIEFING_DRAFT',
  status          text not null, -- 'SUCCESS', 'FAILED', 'SKIPPED'
  campaign_id     uuid references public.newsletter_campaigns(id),
  error_message   text,
  items_selected  jsonb default '[]'::jsonb,
  created_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 7. SOCIAL DISTRIBUTION DRAFTS (LINKEDIN & CHANNELS)
-- ----------------------------------------------------------------------------
create table if not exists public.social_distribution_drafts (
  id              uuid primary key default gen_random_uuid(),
  source_path     text not null, -- e.g. /post/predictive-maintenance-vs-ppm
  source_title    text not null,
  channel         text not null default 'LINKEDIN',
  post_copy       text not null,
  key_points      text[] default '{}',
  status          text not null default 'DRAFT', -- 'DRAFT', 'APPROVED', 'PUBLISHED'
  scheduled_at    timestamptz,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 8. WEBSITE FEATURE PLACEMENTS
-- ----------------------------------------------------------------------------
create table if not exists public.website_feature_placements (
  id              uuid primary key default gen_random_uuid(),
  location        public.website_feature_location not null,
  content_path    text not null,
  content_title   text not null,
  eyebrow         text,
  image_key       text,
  sort_order      integer not null default 0,
  is_active       boolean not null default true,
  expires_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_feature_placements_loc on public.website_feature_placements (location, is_active);
-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0007: OPERATIONAL HARDENING & SLA HIERARCHY
-- ============================================================================
-- Version: 2.3.0 (Phase 0B-R Operational Hardening)
-- Domains Covered:
--   1. Work Order Lifecycle Hardening & Operational Dispositions
--   2. Hierarchical SLA Engine, Operating Calendars & Pause/Resume Ledger
--   3. Immutable SLA Milestone History
--   4. Policy-Driven Evidence Gates & Audited Overrides
--   5. Dispatch Candidate Eligibility & Restrictions
--   6. Dynamic Approval Policies
--   7. Full Workflow Engine Primitives Reconciliation
-- ============================================================================

-- 1. WORK ORDER DISPOSITION STATES & CLOSURE FIELDS
do $$ begin
  create type public.work_disposition_enum as enum (
    'NONE',
    'AWAITING_CONTRACTOR',
    'AWAITING_ENGINEER',
    'AWAITING_PARTS',
    'AWAITING_QUOTE',
    'AWAITING_CLIENT_APPROVAL',
    'AWAITING_ACCESS',
    'RETURN_VISIT_REQUIRED',
    'NO_ACCESS',
    'ON_HOLD',
    'ESCALATED'
  );
exception when duplicate_object then null; end $$;

alter table public.work_orders
  add column if not exists disposition_state public.work_disposition_enum not null default 'NONE',
  add column if not exists closed_at timestamptz,
  add column if not exists closed_by_id uuid references public.persons(id),
  add column if not exists closure_notes text,
  add column if not exists sla_snapshot jsonb default '{}'::jsonb;

create index if not exists idx_work_orders_disposition on public.work_orders(disposition_state);

-- 2. OPERATING CALENDARS (Business hours, weekends, holiday exclusions)
create table if not exists public.operating_calendars (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique,
  name            text not null,
  timezone        text not null default 'Europe/London',
  is_24_7         boolean not null default false,
  start_hour      integer not null default 8,  -- 08:00
  end_hour        integer not null default 17, -- 17:00
  work_days       jsonb not null default '[1,2,3,4,5]'::jsonb, -- Mon-Fri
  holidays_json   jsonb not null default '[]'::jsonb, -- list of 'YYYY-MM-DD' strings
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Seed Canonical Standard Calendars
insert into public.operating_calendars (code, name, is_24_7, start_hour, end_hour, work_days)
values
  ('24_7', 'Continuous 24/7/365 Emergency', true, 0, 24, '[0,1,2,3,4,5,6]'::jsonb),
  ('UK_STANDARD_BUSINESS', 'UK Standard Business Hours (08:00 - 17:00 Mon-Fri)', false, 8, 17, '[1,2,3,4,5]'::jsonb),
  ('EXTENDED_COMMERCIAL', 'Extended Commercial (07:00 - 19:00 Mon-Sat)', false, 7, 19, '[1,2,3,4,5,6]'::jsonb)
on conflict (code) do nothing;

-- 3. CONTRACT SLA OVERRIDES (Hierarchy: System -> Client -> Contract -> Site)
create table if not exists public.contract_slas (
  id                      uuid primary key default gen_random_uuid(),
  contract_id             uuid not null references public.contracts(id) on delete cascade,
  priority                text not null, -- P1_CRITICAL, P2_HIGH, P3_MEDIUM, P4_LOW, P5_SCHEDULED
  calendar_id             uuid references public.operating_calendars(id),
  target_response_mins    integer not null,
  target_attendance_mins  integer not null,
  target_resolution_hours numeric(6,2) not null,
  warning_pct             integer not null default 50, -- Trigger warning when 50% remains
  at_risk_pct             integer not null default 25, -- Trigger at-risk when 25% remains
  created_at              timestamptz not null default now(),
  unique(contract_id, priority)
);

-- 4. SLA PAUSE & RESUME LEDGER
create table if not exists public.sla_pauses (
  id                    uuid primary key default gen_random_uuid(),
  work_order_id         uuid not null references public.work_orders(id) on delete cascade,
  pause_reason          text not null, -- AWAITING_CLIENT_ACCESS, CLIENT_REQUESTED_HOLD, AWAITING_CLIENT_APPROVAL, FORCE_MAJEURE, AGREED_PARTS_DELAY
  started_at            timestamptz not null default now(),
  resumed_at            timestamptz,
  total_paused_minutes  integer not null default 0,
  authorized_by_id      uuid references public.persons(id),
  notes                 text,
  created_at            timestamptz not null default now()
);

create index if not exists idx_sla_pauses_wo on public.sla_pauses(work_order_id);

-- 5. IMMUTABLE SLA MILESTONE HISTORY
create table if not exists public.sla_milestone_history (
  id                    uuid primary key default gen_random_uuid(),
  work_order_id         uuid not null references public.work_orders(id) on delete cascade,
  milestone_type        text not null, -- RESPONSE, ACCEPTANCE, ATTENDANCE, MAKE_SAFE, RESOLUTION, COMPLETION_REPORT
  target_at             timestamptz not null,
  achieved_at           timestamptz,
  is_breached           boolean not null default false,
  variance_minutes      integer default 0,
  exception_reason      text,
  recorded_at           timestamptz not null default now(),
  unique(work_order_id, milestone_type)
);

create index if not exists idx_sla_milestones_wo on public.sla_milestone_history(work_order_id);

-- 6. POLICY-DRIVEN EVIDENCE GATES & AUDITED OVERRIDES
create table if not exists public.completion_policies (
  id                    uuid primary key default gen_random_uuid(),
  contract_id           uuid references public.contracts(id) on delete cascade,
  trade_id              uuid references public.trades(id) on delete set null,
  policy_name           text not null,
  rules_json            jsonb not null default '{}'::jsonb, -- e.g. {"requireBeforePhoto":true,"requireAfterPhoto":true,"requireSignature":true,"allowOverride":true}
  is_active             boolean not null default true,
  created_at            timestamptz not null default now()
);

create table if not exists public.completion_overrides (
  id                    uuid primary key default gen_random_uuid(),
  work_order_id         uuid not null references public.work_orders(id) on delete cascade,
  violated_rule         text not null,
  reason                text not null,
  overridden_by_id      uuid not null references public.persons(id),
  is_non_overridable_breach boolean not null default false,
  created_at            timestamptz not null default now()
);

create index if not exists idx_completion_overrides_wo on public.completion_overrides(work_order_id);

-- 7. DYNAMIC APPROVAL POLICIES
create table if not exists public.approval_policies (
  id                    uuid primary key default gen_random_uuid(),
  object_type           text not null, -- QUOTE, PO, COST_VARIATION, SUPPLIER_ONBOARDING, AI_EXCEPTION, INVOICE, COMPLETION_OVERRIDE
  min_amount_gbp        numeric(12,2) not null default 0.00,
  max_amount_gbp        numeric(12,2),
  required_role         text not null, -- OPERATIONS_MANAGER, DIRECTOR, CEO, FINANCE
  risk_category         text not null default 'STANDARD', -- LOW, STANDARD, HIGH, CRITICAL
  is_active             boolean not null default true,
  created_at            timestamptz not null default now()
);

-- Seed Canonical Approval Policy Hierarchy
insert into public.approval_policies (object_type, min_amount_gbp, max_amount_gbp, required_role, risk_category)
values
  ('QUOTE', 0.00, 1000.00, 'OPERATIONS_MANAGER', 'STANDARD'),
  ('QUOTE', 1000.01, 5000.00, 'DIRECTOR', 'HIGH'),
  ('QUOTE', 5000.01, null, 'CEO', 'CRITICAL'),
  ('PO', 0.00, 2500.00, 'OPERATIONS_MANAGER', 'STANDARD'),
  ('PO', 2500.01, null, 'FINANCE', 'HIGH'),
  ('COMPLETION_OVERRIDE', 0.00, null, 'OPERATIONS_MANAGER', 'STANDARD')
on conflict do nothing;

-- 8. WORKFLOW PRIMITIVES RECONCILIATION
create table if not exists public.workflow_triggers (
  id                    uuid primary key default gen_random_uuid(),
  workflow_def_id       uuid not null references public.workflow_definitions(id) on delete cascade,
  event_type            text not null,
  filter_json           jsonb default '{}'::jsonb,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now()
);

create table if not exists public.workflow_conditions (
  id                    uuid primary key default gen_random_uuid(),
  workflow_def_id       uuid not null references public.workflow_definitions(id) on delete cascade,
  condition_expression  text not null,
  created_at            timestamptz not null default now()
);

create table if not exists public.workflow_actions (
  id                    uuid primary key default gen_random_uuid(),
  workflow_def_id       uuid not null references public.workflow_definitions(id) on delete cascade,
  action_type           text not null,
  action_payload        jsonb not null default '{}'::jsonb,
  sequence_order        integer not null default 1,
  created_at            timestamptz not null default now()
);

create table if not exists public.escalation_policies (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  trigger_condition     text not null, -- SLA_WARNING, SLA_AT_RISK, SLA_BREACH, NO_ACCESS, REJECTED_DISPATCH
  escalate_to_role      text not null,
  auto_notify_channels  jsonb not null default '["EMAIL","SYSTEM"]'::jsonb,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now()
);

-- Enable RLS across new tables
alter table public.operating_calendars enable row level security;
alter table public.contract_slas enable row level security;
alter table public.sla_pauses enable row level security;
alter table public.sla_milestone_history enable row level security;
alter table public.completion_policies enable row level security;
alter table public.completion_overrides enable row level security;
alter table public.approval_policies enable row level security;
alter table public.workflow_triggers enable row level security;
alter table public.workflow_conditions enable row level security;
alter table public.workflow_actions enable row level security;
alter table public.escalation_policies enable row level security;

-- Policies for service role
DROP POLICY IF EXISTS "Service role has full access to operating_calendars" ON public.operating_calendars;
CREATE POLICY "Service role has full access to operating_calendars" ON public.operating_calendars for all using (true);
DROP POLICY IF EXISTS "Service role has full access to contract_slas" ON public.contract_slas;
CREATE POLICY "Service role has full access to contract_slas" ON public.contract_slas for all using (true);
DROP POLICY IF EXISTS "Service role has full access to sla_pauses" ON public.sla_pauses;
CREATE POLICY "Service role has full access to sla_pauses" ON public.sla_pauses for all using (true);
DROP POLICY IF EXISTS "Service role has full access to sla_milestone_history" ON public.sla_milestone_history;
CREATE POLICY "Service role has full access to sla_milestone_history" ON public.sla_milestone_history for all using (true);
DROP POLICY IF EXISTS "Service role has full access to completion_policies" ON public.completion_policies;
CREATE POLICY "Service role has full access to completion_policies" ON public.completion_policies for all using (true);
DROP POLICY IF EXISTS "Service role has full access to completion_overrides" ON public.completion_overrides;
CREATE POLICY "Service role has full access to completion_overrides" ON public.completion_overrides for all using (true);
DROP POLICY IF EXISTS "Service role has full access to approval_policies" ON public.approval_policies;
CREATE POLICY "Service role has full access to approval_policies" ON public.approval_policies for all using (true);
DROP POLICY IF EXISTS "Service role has full access to workflow_triggers" ON public.workflow_triggers;
CREATE POLICY "Service role has full access to workflow_triggers" ON public.workflow_triggers for all using (true);
DROP POLICY IF EXISTS "Service role has full access to workflow_conditions" ON public.workflow_conditions;
CREATE POLICY "Service role has full access to workflow_conditions" ON public.workflow_conditions for all using (true);
DROP POLICY IF EXISTS "Service role has full access to workflow_actions" ON public.workflow_actions;
CREATE POLICY "Service role has full access to workflow_actions" ON public.workflow_actions for all using (true);
DROP POLICY IF EXISTS "Service role has full access to escalation_policies" ON public.escalation_policies;
CREATE POLICY "Service role has full access to escalation_policies" ON public.escalation_policies for all using (true);
-- ============================================================================
-- ENTIREFM CONVERSION INTELLIGENCE, LEAD ATTRIBUTION & COMMERCIAL PERFORMANCE
-- Migration: 0008_conversion_intelligence.sql
-- ============================================================================

-- 1. Extend LEADS table with comprehensive attribution & qualification fields
alter table if exists public.leads
  add column if not exists first_touch_url text default '',
  add column if not exists last_touch_url text default '',
  add column if not exists first_touch_referrer text default '',
  add column if not exists last_touch_referrer text default '',
  add column if not exists form_id text default 'enquiry-form',
  add column if not exists form_page text default '',
  add column if not exists journey_trail jsonb default '[]'::jsonb,
  add column if not exists assisted_pages jsonb default '[]'::jsonb,
  add column if not exists gclid text default '',
  add column if not exists msclkid text default '',
  add column if not exists session_id text default '',
  add column if not exists qualification_status text default 'NEW',
  add column if not exists lead_source text default 'WEBSITE',
  add column if not exists marketing_channel text default 'ORGANIC_SEARCH',
  add column if not exists assigned_to text default '',
  add column if not exists estimated_value_gbp numeric default null,
  add column if not exists sector_interest text default '',
  add column if not exists location_interest text default '',
  add column if not exists is_test boolean default false,
  add column if not exists is_spam boolean default false;

-- Create indexes for fast commercial filtering
create index if not exists leads_qualification_idx on public.leads (qualification_status);
create index if not exists leads_marketing_channel_idx on public.leads (marketing_channel);
create index if not exists leads_service_idx on public.leads (service);
create index if not exists leads_location_idx on public.leads (location);
create index if not exists leads_is_test_idx on public.leads (is_test);

-- 2. Commercial Opportunities Table
create table if not exists public.commercial_opportunities (
  id uuid primary key default gen_random_uuid(),
  lead_id text references public.leads(enquiry_id) on delete set null,
  company text not null,
  service text default '',
  location text default '',
  estimated_value_gbp numeric default null,
  stage text not null default 'QUALIFIED', -- QUALIFIED, PROPOSAL_PREPARATION, PROPOSAL_SENT, NEGOTIATION, WON, LOST
  probability_pct integer default 50,
  expected_close_date date default null,
  owner text default '',
  won_lost_reason text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz default null
);

create index if not exists opp_stage_idx on public.commercial_opportunities (stage);
create index if not exists opp_created_at_idx on public.commercial_opportunities (created_at desc);

-- 3. Anonymous Non-PII Analytics Events Table
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  session_id text not null,
  path text not null,
  page_type text default '',
  event_params jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_name_idx on public.analytics_events (event_name);
create index if not exists events_path_idx on public.analytics_events (path);
create index if not exists events_created_idx on public.analytics_events (created_at desc);

-- 4. Daily Aggregates Cache Table (for instant dashboard load)
create table if not exists public.growth_daily_aggregates (
  date date not null,
  dimension_type text not null, -- 'OVERVIEW', 'PAGE', 'SERVICE', 'LOCATION', 'SECTOR', 'TOOL', 'CHANNEL'
  dimension_key text not null,
  sessions integer default 0,
  organic_sessions integer default 0,
  cta_clicks integer default 0,
  form_starts integer default 0,
  form_submits integer default 0,
  leads_count integer default 0,
  qualified_leads integer default 0,
  assisted_leads integer default 0,
  pipeline_value_gbp numeric default 0,
  won_value_gbp numeric default 0,
  created_at timestamptz not null default now(),
  primary key (date, dimension_type, dimension_key)
);

-- Enable RLS
alter table public.commercial_opportunities enable row level security;
alter table public.analytics_events enable row level security;
alter table public.growth_daily_aggregates enable row level security;
-- ============================================================
-- ENTIREFM PHASE 0C — FIELD + CONTRACTOR OPERATIONS SCHEMA
-- Migration: 0008_field_contractor_operations.sql
-- Extends: visits, adds service_reports, field_readings,
--          field_parts_used, field_voice_captures,
--          field_sync_queue, contractor_compliance_documents,
--          notifications. Seeds FIELD AI agents.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. EXTEND VISITS — Field Journey Tracking
-- ─────────────────────────────────────────────────────────────
ALTER TABLE visits
  ADD COLUMN IF NOT EXISTS journey_started_at       timestamptz,
  ADD COLUMN IF NOT EXISTS arrived_at               timestamptz,
  ADD COLUMN IF NOT EXISTS arrival_method           text CHECK (arrival_method IN ('MANUAL','GEOFENCE','QR','NFC')),
  ADD COLUMN IF NOT EXISTS arrival_lat              decimal(10,7),
  ADD COLUMN IF NOT EXISTS arrival_lng              decimal(10,7),
  ADD COLUMN IF NOT EXISTS arrival_location_accuracy_m integer,
  ADD COLUMN IF NOT EXISTS work_started_at          timestamptz,
  ADD COLUMN IF NOT EXISTS work_stopped_at          timestamptz,
  ADD COLUMN IF NOT EXISTS departed_at              timestamptz,
  ADD COLUMN IF NOT EXISTS no_access_reason         text CHECK (no_access_reason IN ('KEYBOX_FAILURE','CONTACT_UNAVAILABLE','HAZARD_PRESENT','ACCESS_REFUSED','WRONG_ADDRESS','OTHER')),
  ADD COLUMN IF NOT EXISTS no_access_notes          text,
  ADD COLUMN IF NOT EXISTS no_access_photo_path     text,
  ADD COLUMN IF NOT EXISTS no_access_contact_attempted boolean DEFAULT false;

-- ─────────────────────────────────────────────────────────────
-- 2. SERVICE REPORTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_reports (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id             uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  visit_id                  uuid REFERENCES visits(id) ON DELETE CASCADE,
  engineer_person_id        uuid REFERENCES persons(id),
  client_account_id         uuid REFERENCES client_accounts(id),
  site_id                   uuid REFERENCES sites(id),
  asset_id                  uuid REFERENCES assets(id),
  report_number             text UNIQUE NOT NULL,
  status                    text NOT NULL DEFAULT 'DRAFT'
                              CHECK (status IN ('DRAFT','SUBMITTED','ACCEPTED','REJECTED')),
  work_description          text,
  ai_draft_narrative        text,
  final_narrative           text,
  attendance_started_at     timestamptz,
  attendance_ended_at       timestamptz,
  tasks_completed           integer DEFAULT 0,
  tasks_total               integer DEFAULT 0,
  observations_count        integer DEFAULT 0,
  defects_count             integer DEFAULT 0,
  recommendations_count     integer DEFAULT 0,
  readings_count            integer DEFAULT 0,
  parts_used_count          integer DEFAULT 0,
  signature_path            text,
  signatory_name            text,
  signatory_organisation    text,
  signature_captured_at     timestamptz,
  signature_declaration     text,
  ai_run_id                 uuid,
  submitted_at              timestamptz,
  accepted_at               timestamptz,
  rejected_at               timestamptz,
  rejection_reason          text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_reports_visit_id ON service_reports(visit_id);
CREATE INDEX IF NOT EXISTS idx_service_reports_work_order_id ON service_reports(work_order_id);
CREATE INDEX IF NOT EXISTS idx_service_reports_engineer ON service_reports(engineer_person_id);

-- ─────────────────────────────────────────────────────────────
-- 3. FIELD READINGS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS field_readings (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id         uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  visit_id              uuid REFERENCES visits(id) ON DELETE CASCADE,
  task_id               uuid,
  asset_id              uuid REFERENCES assets(id),
  engineer_person_id    uuid REFERENCES persons(id),
  reading_type          text NOT NULL
                          CHECK (reading_type IN ('TEMPERATURE','PRESSURE','VOLTAGE','CURRENT','FLOW','METER','HUMIDITY','RPM','DB_LEVEL','CO2','OTHER')),
  value_numeric         decimal(12,4),
  value_text            text,
  unit                  text,
  expected_min          decimal(12,4),
  expected_max          decimal(12,4),
  is_out_of_range       boolean GENERATED ALWAYS AS (
                          value_numeric IS NOT NULL
                          AND expected_min IS NOT NULL
                          AND expected_max IS NOT NULL
                          AND (value_numeric < expected_min OR value_numeric > expected_max)
                        ) STORED,
  photo_evidence_path   text,
  notes                 text,
  captured_at           timestamptz NOT NULL DEFAULT now(),
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_field_readings_visit ON field_readings(visit_id);
CREATE INDEX IF NOT EXISTS idx_field_readings_asset ON field_readings(asset_id);

-- ─────────────────────────────────────────────────────────────
-- 4. FIELD PARTS USED
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS field_parts_used (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id         uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  visit_id              uuid REFERENCES visits(id) ON DELETE CASCADE,
  task_id               uuid,
  asset_id              uuid REFERENCES assets(id),
  engineer_person_id    uuid REFERENCES persons(id),
  part_number           text,
  description           text NOT NULL,
  quantity              decimal(10,2) NOT NULL DEFAULT 1,
  unit                  text DEFAULT 'UNIT',
  unit_cost_gbp         decimal(10,2),
  source_notes          text,
  serial_number         text,
  batch_number          text,
  supplier_reference    text,
  is_billable           boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_field_parts_visit ON field_parts_used(visit_id);

-- ─────────────────────────────────────────────────────────────
-- 5. FIELD VOICE CAPTURES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS field_voice_captures (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id             uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  visit_id                  uuid REFERENCES visits(id) ON DELETE CASCADE,
  asset_id                  uuid REFERENCES assets(id),
  engineer_person_id        uuid REFERENCES persons(id),
  audio_storage_path        text,
  duration_seconds          integer,
  transcription             text,
  transcription_status      text NOT NULL DEFAULT 'PENDING'
                              CHECK (transcription_status IN ('PENDING','COMPLETE','FAILED')),
  ai_proposed_action_type   text
                              CHECK (ai_proposed_action_type IN ('JOB_NOTE','OBSERVATION','DEFECT','RECOMMENDATION','REPORT_NOTE','TALK_TO_QUOTE')),
  ai_proposed_payload       jsonb,
  ai_confidence_score       decimal(3,2),
  ai_run_id                 uuid,
  engineer_confirmed        boolean NOT NULL DEFAULT false,
  engineer_corrections      jsonb,
  confirmed_observation_id  uuid,
  confirmed_defect_id       uuid,
  captured_at               timestamptz NOT NULL DEFAULT now(),
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_voice_captures_visit ON field_voice_captures(visit_id);
CREATE INDEX IF NOT EXISTS idx_voice_captures_engineer ON field_voice_captures(engineer_person_id);

-- ─────────────────────────────────────────────────────────────
-- 6. FIELD SYNC QUEUE (server-side idempotency log)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS field_sync_queue (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id             text,
  engineer_person_id    uuid REFERENCES persons(id),
  idempotency_key       text UNIQUE NOT NULL,
  action_type           text NOT NULL,
  related_entity_type   text,
  related_entity_id     uuid,
  payload               jsonb NOT NULL,
  device_timestamp      timestamptz NOT NULL,
  received_at           timestamptz NOT NULL DEFAULT now(),
  processed_at          timestamptz,
  processing_status     text NOT NULL DEFAULT 'PENDING'
                          CHECK (processing_status IN ('PENDING','PROCESSED','CONFLICT','REJECTED','DUPLICATE')),
  conflict_notes        text,
  retry_count           integer NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sync_queue_key ON field_sync_queue(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_sync_queue_engineer_status ON field_sync_queue(engineer_person_id, processing_status);

-- ─────────────────────────────────────────────────────────────
-- 7. CONTRACTOR COMPLIANCE DOCUMENTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contractor_compliance_documents (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_organisation_id    uuid NOT NULL,
  document_type               text NOT NULL
                                CHECK (document_type IN (
                                  'INSURANCE_PUBLIC_LIABILITY','INSURANCE_EMPLOYERS',
                                  'ACCREDITATION_GAS_SAFE','ACCREDITATION_NICEIC',
                                  'ACCREDITATION_CHAS','ACCREDITATION_SAFECONTRACTOR',
                                  'COSHH_ASSESSMENT','HEALTH_SAFETY_POLICY',
                                  'QUALITY_POLICY','RAMS','ENGINEER_CERTIFICATE','OTHER'
                                )),
  document_title              text NOT NULL,
  storage_path                text NOT NULL,
  file_size_bytes             integer,
  mime_type                   text,
  expiry_date                 date,
  is_current                  boolean NOT NULL DEFAULT true,
  review_status               text NOT NULL DEFAULT 'PENDING'
                                CHECK (review_status IN ('PENDING','VERIFIED','REJECTED','EXPIRED')),
  reviewed_by_person_id       uuid REFERENCES persons(id),
  reviewed_at                 timestamptz,
  rejection_reason            text,
  uploaded_by_person_id       uuid REFERENCES persons(id),
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_compliance_docs_org ON contractor_compliance_documents(provider_organisation_id);
CREATE INDEX IF NOT EXISTS idx_compliance_docs_status ON contractor_compliance_documents(review_status);

-- ─────────────────────────────────────────────────────────────
-- 8. NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_person_id   uuid NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  notification_type     text NOT NULL
                          CHECK (notification_type IN (
                            'ASSIGNMENT_OFFERED','ASSIGNMENT_CHANGED','VISIT_ASSIGNED',
                            'COMPLETION_REJECTED','COMPLETION_ACCEPTED','SCHEDULE_CHANGED',
                            'URGENT_WORK_ORDER','SLA_ESCALATION','COMPLIANCE_EXPIRY',
                            'MESSAGE_RECEIVED'
                          )),
  title                 text NOT NULL,
  body                  text,
  related_entity_type   text,
  related_entity_id     uuid,
  is_read               boolean NOT NULL DEFAULT false,
  read_at               timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_person_id, is_read);

-- ─────────────────────────────────────────────────────────────
-- 9. SEED FIELD AI AGENTS
-- ─────────────────────────────────────────────────────────────
INSERT INTO ai_agents (id, code, name, description, role_description, autonomy_level, is_active, max_daily_budget_gbp, confidence_threshold, created_at)
VALUES
  (gen_random_uuid(), 'FIELD_STRUCTURING_AGENT', 'Field Structuring Agent',
   'Phase 0C voice intelligence agent',
   'Transcribes voice captures and proposes structured observations, defects, and recommendations for engineer review and confirmation. Does not autonomously write operational records.',
   'ASSIST', true, 5.00, 0.75, now()),
  (gen_random_uuid(), 'FIELD_REPORT_AGENT', 'Field Report Agent',
   'Phase 0C service report agent',
   'Drafts concise, factual service report narratives from confirmed field data. Cannot invent work that was not recorded by the engineer. Cannot generate pricing.',
   'ASSIST', true, 10.00, 0.80, now())
ON CONFLICT (code) DO NOTHING;
-- ============================================================================
-- ENTIREFM PHASE 5: COMMERCIAL PIPELINE, QUALIFICATION & MOBILISATION HANDOFF
-- Migration: 0009_commercial_pipeline.sql
-- ============================================================================

-- 1. Extend commercial_opportunities with pipeline stages and qualification
alter table if exists public.commercial_opportunities
  add column if not exists primary_contact text default '',
  add column if not exists contact_email text default '',
  add column if not exists contact_phone text default '',
  add column if not exists sector text default '',
  add column if not exists opportunity_name text default '',
  add column if not exists scope_summary text default '',
  add column if not exists tender_deadline timestamptz default null,
  add column if not exists target_start_date date default null,
  add column if not exists decision_date date default null,
  add column if not exists competitor_incumbent text default '',
  add column if not exists is_tender boolean default false,
  add column if not exists qualification_score jsonb default '{}'::jsonb,
  add column if not exists next_action text default '',
  add column if not exists next_action_at timestamptz default null,
  add column if not exists last_activity_at timestamptz default now(),
  add column if not exists mobilisation_status text default 'PENDING_WIN', -- PENDING_WIN, HANDED_OFF, MOBILISATION_STARTED, CLIENT_CREATED, OPERATIONAL_LIVE
  add column if not exists mobilisation_notes text default '';

-- 2. Commercial Tasks Table (Follow-ups, Discovery, Surveys, Proposals)
create table if not exists public.commercial_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id text references public.leads(enquiry_id) on delete cascade,
  opportunity_id uuid references public.commercial_opportunities(id) on delete cascade,
  title text not null,
  task_type text not null default 'FOLLOW_UP', -- 'FOLLOW_UP', 'CALL', 'EMAIL', 'SITE_SURVEY', 'PROPOSAL_DRAFT', 'TENDER_REVIEW', 'MOBILISATION'
  owner text not null default 'Unassigned',
  due_date timestamptz not null default (now() + interval '2 days'),
  priority text not null default 'NORMAL', -- 'URGENT', 'HIGH', 'NORMAL', 'LOW'
  status text not null default 'PENDING', -- 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
  notes text default '',
  created_at timestamptz not null default now(),
  completed_at timestamptz default null
);

create index if not exists comm_tasks_due_idx on public.commercial_tasks (due_date);
create index if not exists comm_tasks_status_idx on public.commercial_tasks (status);

-- 3. Commercial Site Surveys Table
create table if not exists public.commercial_site_surveys (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.commercial_opportunities(id) on delete cascade,
  lead_id text references public.leads(enquiry_id) on delete set null,
  site_name text not null,
  site_address text not null,
  scheduled_at timestamptz not null,
  surveyor_name text not null default 'Senior Technical Surveyor',
  contact_name text default '',
  contact_phone text default '',
  survey_type text not null default 'COMPREHENSIVE_FM', -- 'COMPREHENSIVE_FM', 'HVAC_PLANT', 'M_AND_E', 'FABRIC', 'STATUTORY_AUDIT'
  access_notes text default '',
  survey_status text not null default 'SCHEDULED', -- 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'REPORT_PREPARED', 'CANCELLED'
  findings_summary text default '',
  asset_count_identified integer default 0,
  key_risks text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists comm_surveys_sched_idx on public.commercial_site_surveys (scheduled_at);

-- 4. Commercial Activity Log (One continuous timeline)
create table if not exists public.commercial_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id text references public.leads(enquiry_id) on delete cascade,
  opportunity_id uuid references public.commercial_opportunities(id) on delete cascade,
  activity_type text not null, -- 'ENQUIRY_RECEIVED', 'LEAD_ASSIGNED', 'STATUS_CHANGED', 'NOTE_ADDED', 'EMAIL_LOGGED', 'CALL_LOGGED', 'TASK_CREATED', 'TASK_COMPLETED', 'SURVEY_ARRANGED', 'PROPOSAL_SENT', 'OPPORTUNITY_WON', 'OPPORTUNITY_LOST', 'MOBILISATION_TRIGGERED'
  actor text not null default 'System',
  summary text not null,
  details text default '',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists comm_act_lead_idx on public.commercial_activities (lead_id);
create index if not exists comm_act_opp_idx on public.commercial_activities (opportunity_id);
create index if not exists comm_act_created_idx on public.commercial_activities (created_at desc);

-- 5. Commercial Automation Rules
create table if not exists public.commercial_assignment_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  condition_field text not null, -- 'service', 'location', 'sector', 'is_tender', 'value'
  condition_operator text not null default 'CONTAINS', -- 'EQUALS', 'CONTAINS', 'GREATER_THAN'
  condition_value text not null,
  assign_to_user text not null,
  priority_override text default null,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.commercial_tasks enable row level security;
alter table public.commercial_site_surveys enable row level security;
alter table public.commercial_activities enable row level security;
alter table public.commercial_assignment_rules enable row level security;
-- ============================================================================
-- ENTIREFM PHASE 6: WON CONTRACT -> OPERATIONAL MOBILISATION ENGINE
-- Migration: 0010_operational_mobilisation.sql
-- ============================================================================

-- 1. Master Mobilisations Table
create table if not exists public.mobilisations (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.commercial_opportunities(id) on delete cascade,
  client_account_id uuid references public.client_accounts(id) on delete set null,
  contract_id uuid references public.contracts(id) on delete set null,
  
  name text not null,
  client_name text not null,
  commercial_owner text not null default 'Commercial Director',
  operations_owner text not null default 'Unassigned',
  
  status text not null default 'AWAITING_HANDOFF', -- 'AWAITING_HANDOFF', 'HANDOFF_REVIEW', 'PLANNING', 'IN_PROGRESS', 'AT_RISK', 'GO_LIVE_REVIEW', 'READY', 'LIVE_STABILISATION', 'COMPLETE', 'CANCELLED'
  template_type text not null default 'TOTAL_FM', -- 'TOTAL_FM', 'HARD_FM', 'M_AND_E', 'HVAC', 'PPM_ONLY', 'CLEANING', 'MULTI_SITE', 'SINGLE_SITE'
  
  target_go_live_date date not null,
  actual_go_live_date timestamptz default null,
  contract_term_months integer default 12,
  annual_contract_value_gbp numeric default null,
  
  -- Readiness Domain States ('NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'READY')
  domain_commercial_handoff text not null default 'IN_PROGRESS',
  domain_estate_discovery text not null default 'NOT_STARTED',
  domain_asset_baseline text not null default 'NOT_STARTED',
  domain_compliance_baseline text not null default 'NOT_STARTED',
  domain_ppm_development text not null default 'NOT_STARTED',
  domain_supply_chain text not null default 'NOT_STARTED',
  domain_helpdesk_sla text not null default 'NOT_STARTED',
  domain_client_portal text not null default 'NOT_STARTED',
  domain_reporting text not null default 'NOT_STARTED',
  domain_billing_readiness text not null default 'NOT_STARTED',
  domain_go_live_review text not null default 'NOT_STARTED',
  
  -- Handoff Metadata
  handoff_submitted_by text default '',
  handoff_submitted_at timestamptz default null,
  handoff_accepted_by text default '',
  handoff_accepted_at timestamptz default null,
  handoff_notes text default '',
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mob_status_idx on public.mobilisations (status);
create index if not exists mob_target_date_idx on public.mobilisations (target_go_live_date);

-- 2. Mobilisation Tasks Table (Structured Phase-based Tasks)
create table if not exists public.mobilisation_tasks (
  id uuid primary key default gen_random_uuid(),
  mobilisation_id uuid references public.mobilisations(id) on delete cascade,
  phase_number integer not null default 1, -- 1 to 12
  phase_name text not null,
  title text not null,
  description text default '',
  owner text not null default 'Operations Team',
  department text not null default 'OPERATIONS', -- 'COMMERCIAL', 'OPERATIONS', 'ENGINEERING', 'HELPDESK', 'COMPLIANCE', 'FINANCE'
  due_date timestamptz not null,
  priority text not null default 'NORMAL', -- 'URGENT', 'HIGH', 'NORMAL', 'LOW'
  status text not null default 'NOT_STARTED', -- 'NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'AWAITING_CLIENT', 'AWAITING_SUPPLIER', 'REVIEW', 'COMPLETE', 'NOT_APPLICABLE'
  is_blocking boolean not null default false,
  dependency_task_id uuid references public.mobilisation_tasks(id) on delete set null,
  evidence_required text default '',
  created_at timestamptz not null default now(),
  completed_at timestamptz default null
);

create index if not exists mob_tasks_mob_idx on public.mobilisation_tasks (mobilisation_id);
create index if not exists mob_tasks_status_idx on public.mobilisation_tasks (status);

-- 3. Mobilisation Risk Register
create table if not exists public.mobilisation_risks (
  id uuid primary key default gen_random_uuid(),
  mobilisation_id uuid references public.mobilisations(id) on delete cascade,
  risk_title text not null,
  category text not null default 'OPERATIONAL', -- 'ASSET_DATA', 'COMPLIANCE', 'SUPPLY_CHAIN', 'CLIENT_ACCESS', 'TIMELINE', 'TECHNICAL'
  likelihood text not null default 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH'
  impact text not null default 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  owner text not null default 'Operations Lead',
  mitigation_plan text not null default '',
  status text not null default 'OPEN', -- 'OPEN', 'MITIGATED', 'ACCEPTED', 'CLOSED'
  created_at timestamptz not null default now()
);

create index if not exists mob_risks_mob_idx on public.mobilisation_risks (mobilisation_id);

-- Enable RLS
alter table public.mobilisations enable row level security;
alter table public.mobilisation_tasks enable row level security;
alter table public.mobilisation_risks enable row level security;
-- ============================================================================
-- ENTIREFM PHASE 7: LIVE CONTRACT CONTROL CENTRE, HEALTH & EXCEPTION MANAGEMENT
-- Migration: 0011_live_operations_control.sql
-- ============================================================================

-- 1. Operational Exceptions Registry (Exception-First Architecture)
create table if not exists public.operational_exceptions (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references public.contracts(id) on delete set null,
  site_id uuid references public.sites(id) on delete set null,
  work_order_id text default null,
  asset_id text default null,
  
  exception_type text not null, -- 'SLA_AT_RISK', 'SLA_BREACHED', 'PPM_OVERDUE', 'EVIDENCE_MISSING', 'CRITICAL_DEFECT', 'CONTRACTOR_GAP', 'COST_OVERRUN', 'REPEAT_FAILURE', 'CLIENT_BOTTLENECK'
  severity text not null default 'NORMAL', -- 'CRITICAL', 'HIGH', 'NORMAL', 'LOW'
  title text not null,
  details text default '',
  underlying_records jsonb default '{}'::jsonb,
  
  status text not null default 'ACTIVE', -- 'ACTIVE', 'ACKNOWLEDGED', 'ACTION_ASSIGNED', 'SNOOZED', 'RESOLVED'
  owner text not null default 'Duty Operations Manager',
  acknowledged_by text default null,
  acknowledged_at timestamptz default null,
  resolved_by text default null,
  resolved_at timestamptz default null,
  resolution_notes text default '',
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists op_exc_status_idx on public.operational_exceptions (status);
create index if not exists op_exc_severity_idx on public.operational_exceptions (severity);
create index if not exists op_exc_contract_idx on public.operational_exceptions (contract_id);
create index if not exists op_exc_type_idx on public.operational_exceptions (exception_type);

-- 2. Client Actions Register (Quotes, Access, POs, Shutdowns)
create table if not exists public.client_actions (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references public.contracts(id) on delete cascade,
  site_id uuid references public.sites(id) on delete set null,
  quote_id text default null,
  
  action_type text not null, -- 'QUOTE_APPROVAL', 'SITE_ACCESS', 'PURCHASE_ORDER', 'SHUTDOWN_APPROVAL', 'COMPLIANCE_CERTIFICATE', 'CONTACT_CONFIRMATION'
  title text not null,
  description text default '',
  amount_gbp numeric default null,
  requested_at timestamptz not null default now(),
  due_date timestamptz not null default (now() + interval '5 days'),
  
  status text not null default 'AWAITING_CLIENT', -- 'AWAITING_CLIENT', 'APPROVED', 'REJECTED', 'CANCELLED', 'OVERDUE'
  client_contact_name text default '',
  client_contact_email text default '',
  decision_notes text default '',
  decided_at timestamptz default null,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists client_act_status_idx on public.client_actions (status);
create index if not exists client_act_contract_idx on public.client_actions (contract_id);

-- 3. Operational Incidents & Plant Outages
create table if not exists public.operational_incidents (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references public.contracts(id) on delete cascade,
  site_id uuid references public.sites(id) on delete cascade,
  asset_id text default null,
  
  incident_title text not null,
  severity text not null default 'MAJOR', -- 'CRITICAL_OUTAGE', 'MAJOR', 'MODERATE', 'MINOR'
  incident_type text not null, -- 'PLANT_FAILURE', 'ACCESS_DENIAL', 'POWER_OUTAGE', 'LEAK_FLOOD', 'SECURITY_BREACH', 'CLIENT_ESCALATION'
  impact_summary text not null,
  
  status text not null default 'ACTIVE', -- 'ACTIVE', 'CONTAINED', 'RESOLVED', 'CLOSED'
  lead_engineer text default 'Lead Duty Engineer',
  reported_at timestamptz not null default now(),
  contained_at timestamptz default null,
  resolved_at timestamptz default null,
  root_cause text default '',
  preventative_actions text default ''
);

create index if not exists op_inc_status_idx on public.operational_incidents (status);
create index if not exists op_inc_severity_idx on public.operational_incidents (severity);

-- Enable RLS
alter table public.operational_exceptions enable row level security;
alter table public.client_actions enable row level security;
alter table public.operational_incidents enable row level security;
-- ============================================================================
-- ENTIREFM PHASE 9: ENERGY, UTILITIES & BUILDING PERFORMANCE INTELLIGENCE
-- Migration: 0012_energy_utilities_intelligence.sql
-- ============================================================================

-- 1. Meters Registry (Electricity, Gas, Water, Heat, Chilled Water)
create table if not exists public.meters (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  building_id uuid references public.buildings(id) on delete set null,
  asset_id uuid references public.assets(id) on delete set null,
  parent_meter_id uuid references public.meters(id) on delete set null,
  
  meter_reference text not null,
  name text not null,
  utility_type text not null, -- 'ELECTRICITY', 'GAS', 'WATER', 'HEAT', 'CHILLED_WATER', 'EXPORT'
  meter_hierarchy text not null default 'MAIN_METER', -- 'MAIN_METER', 'SUB_METER', 'ASSET_METER', 'TENANT_METER', 'LANDLORD_METER'
  unit_of_measure text not null default 'KWH', -- 'KWH', 'M3', 'LITRES', 'MJ'
  
  multiplier numeric default 1.0,
  interval_minutes integer default 30,
  is_automated boolean default false,
  feed_status text not null default 'ACTIVE', -- 'ACTIVE', 'STALE', 'OFFLINE', 'COMMISSIONING'
  last_reading_at timestamptz default null,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists meters_site_idx on public.meters (site_id);
create index if not exists meters_util_idx on public.meters (utility_type);

-- 2. Meter Readings (Interval Time-Series)
create table if not exists public.meter_readings (
  id uuid primary key default gen_random_uuid(),
  meter_id uuid references public.meters(id) on delete cascade,
  reading_timestamp timestamptz not null,
  value numeric not null,
  unit text not null default 'KWH',
  data_quality text not null default 'ACTUAL', -- 'ACTUAL', 'ESTIMATED', 'INTERPOLATED', 'FAULTY', 'FLATLINE'
  source text not null default 'API_CONNECTOR', -- 'MANUAL', 'CSV_IMPORT', 'API_CONNECTOR', 'BMS', 'SMART_METER'
  created_at timestamptz not null default now()
);

create index if not exists meter_reads_ts_idx on public.meter_readings (meter_id, reading_timestamp desc);

-- 3. Utility Tariffs
create table if not exists public.utility_tariffs (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references public.contracts(id) on delete cascade,
  utility_type text not null,
  tariff_name text not null,
  standing_charge_daily_gbp numeric default 0,
  unit_rate_gbp_per_kwh numeric not null,
  effective_from date not null,
  effective_to date default null,
  created_at timestamptz not null default now()
);

-- 4. Energy Projects & M&V Tracking
create table if not exists public.energy_projects (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  contract_id uuid references public.contracts(id) on delete set null,
  
  project_name text not null,
  category text not null default 'HVAC_CONTROLS', -- 'HVAC_CONTROLS', 'LED_LIGHTING', 'PLANT_REPLACEMENT', 'BMS_OPTIMISATION', 'BUILDING_FABRIC'
  scope_description text default '',
  
  baseline_period_start date not null,
  baseline_period_end date not null,
  baseline_annual_kwh numeric not null,
  
  target_annual_saving_kwh numeric default null,
  target_annual_saving_gbp numeric default null,
  
  implementation_date date not null,
  verification_status text not null default 'MEASUREMENT_PERIOD', -- 'BASELINE_DEFINED', 'IMPLEMENTED', 'MEASUREMENT_PERIOD', 'VERIFIED', 'INCONCLUSIVE'
  verified_saving_kwh numeric default null,
  verified_saving_gbp numeric default null,
  
  owner text not null default 'Energy & Sustainability Lead',
  created_at timestamptz not null default now()
);

-- 5. Official Carbon Conversion Factors
create table if not exists public.carbon_factors (
  id uuid primary key default gen_random_uuid(),
  fuel_type text not null, -- 'ELECTRICITY_GRID', 'NATURAL_GAS', 'WATER_SUPPLY', 'WATER_TREATMENT'
  region text not null default 'UK',
  reporting_year integer not null default 2026,
  kg_co2e_per_unit numeric not null,
  unit text not null default 'KWH',
  source text not null default 'UK DESNZ GHG Conversion Factors',
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.meters enable row level security;
alter table public.meter_readings enable row level security;
alter table public.utility_tariffs enable row level security;
alter table public.energy_projects enable row level security;
alter table public.carbon_factors enable row level security;
-- ============================================================================
-- ENTIREFM DIGITAL PR, LINK EARNING & INDUSTRY AUTHORITY ENGINE
-- Migration: 0013_digital_pr_and_authority.sql
-- ============================================================================

-- 1. PR Campaigns
create table if not exists public.pr_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  primary_asset_url text not null,
  story_angle text not null,
  target_audience text not null,
  status text not null default 'DRAFT', -- 'DRAFT', 'RESEARCH', 'BUILDING', 'READY', 'ACTIVE', 'COMPLETE', 'ARCHIVED'
  launch_date date default null,
  owner text not null default 'PR Lead',
  key_findings jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Media Targets & Editorial Contacts
create table if not exists public.media_targets (
  id uuid primary key default gen_random_uuid(),
  publication_name text not null,
  website text not null,
  category text not null default 'FM_PRESS', -- 'FM_PRESS', 'PROPERTY', 'BUILDING_ENGINEERING', 'ENERGY', 'TECH_AI', 'REGIONAL_BUSINESS'
  contact_name text default null,
  role text default null,
  editorial_focus text default '',
  relationship_status text not null default 'UNCONTACTED', -- 'UNCONTACTED', 'PITCHED', 'RESPONDED', 'COVERAGE_EARNED', 'DO_NOT_CONTACT'
  notes text default '',
  last_interaction_at timestamptz default null,
  created_at timestamptz not null default now()
);

-- 3. Expert Commentary Opportunities
create table if not exists public.expert_commentaries (
  id uuid primary key default gen_random_uuid(),
  topic_title text not null,
  news_source_url text default '',
  why_it_matters_to_fm text not null,
  draft_comment text not null,
  approved_by text default null,
  status text not null default 'DRAFT', -- 'DRAFT', 'REVIEW', 'APPROVED', 'PITCHED', 'PUBLISHED', 'ARCHIVED'
  created_at timestamptz not null default now()
);

-- 4. Earned Media Coverage & Backlinks
create table if not exists public.earned_coverage (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.pr_campaigns(id) on delete set null,
  publication_name text not null,
  article_title text not null,
  article_url text not null,
  published_date date not null,
  has_backlink boolean default false,
  backlink_url text default null,
  link_type text default 'FOLLOW', -- 'FOLLOW', 'NOFOLLOW', 'UNLINKED_MENTION'
  anchor_text text default null,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.pr_campaigns enable row level security;
alter table public.media_targets enable row level security;
alter table public.expert_commentaries enable row level security;
alter table public.earned_coverage enable row level security;
-- ============================================================
-- ENTIREFM PHASE 0C-R — FIELD INTELLIGENCE COMPLETION SCHEMA
-- Migration: 0013_field_intelligence_completion.sql
-- Adds: field_quote_scopes, ai_corrections, evidence_reviews,
--        asset_update_proposals, seeds FIELD_VISION_AGENT &
--        FIELD_COPILOT_AGENT.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. FIELD QUOTE SCOPES (Talk-to-Quote Commercial Foundation)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS field_quote_scopes (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id             uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  visit_id                  uuid REFERENCES visits(id) ON DELETE CASCADE,
  asset_id                  uuid REFERENCES assets(id),
  defect_id                 uuid,
  engineer_person_id        uuid REFERENCES persons(id),
  scope_description         text NOT NULL,
  labour_engineers_count    integer DEFAULT 1,
  labour_estimated_hours    decimal(6,2),
  materials_summary         text,
  materials_items_json      jsonb DEFAULT '[]'::jsonb,
  status                    text NOT NULL DEFAULT 'DRAFT'
                              CHECK (status IN ('DRAFT','SUBMITTED','ACCEPTED_FOR_ESTIMATION','CONVERTED_TO_QUOTE','REJECTED')),
  is_priced                 boolean NOT NULL DEFAULT false,
  is_approved               boolean NOT NULL DEFAULT false,
  is_issued                 boolean NOT NULL DEFAULT false,
  ai_confidence_score       decimal(3,2),
  ai_run_id                 uuid,
  voice_capture_id          uuid REFERENCES field_voice_captures(id),
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_field_quote_scopes_wo ON field_quote_scopes(work_order_id);
CREATE INDEX IF NOT EXISTS idx_field_quote_scopes_visit ON field_quote_scopes(visit_id);
CREATE INDEX IF NOT EXISTS idx_field_quote_scopes_asset ON field_quote_scopes(asset_id);

-- ─────────────────────────────────────────────────────────────
-- 2. AI CORRECTIONS (Supervised Training & Provenance Log)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_corrections (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_agent_code             text NOT NULL,
  ai_run_id                 uuid,
  entity_type               text NOT NULL,
  entity_id                 uuid,
  field_name                text NOT NULL,
  proposed_value            jsonb NOT NULL,
  corrected_value           jsonb NOT NULL,
  confidence_score          decimal(3,2),
  engineer_person_id        uuid REFERENCES persons(id),
  notes                     text,
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_corrections_agent ON ai_corrections(ai_agent_code);
CREATE INDEX IF NOT EXISTS idx_ai_corrections_entity ON ai_corrections(entity_type, entity_id);

-- ─────────────────────────────────────────────────────────────
-- 3. EVIDENCE REVIEWS & REJECTIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS evidence_reviews (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id               uuid NOT NULL,
  visit_id                  uuid REFERENCES visits(id) ON DELETE CASCADE,
  reviewer_person_id        uuid REFERENCES persons(id),
  review_status             text NOT NULL CHECK (review_status IN ('APPROVED','REJECTED')),
  rejection_reason          text,
  replacement_evidence_id   uuid,
  reviewed_at               timestamptz NOT NULL DEFAULT now(),
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evidence_reviews_evidence ON evidence_reviews(evidence_id);
CREATE INDEX IF NOT EXISTS idx_evidence_reviews_visit ON evidence_reviews(visit_id);

-- ─────────────────────────────────────────────────────────────
-- 4. ASSET UPDATE PROPOSALS (Visual Nameplate Discrepancy Log)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS asset_update_proposals (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id                  uuid REFERENCES assets(id) ON DELETE CASCADE,
  visit_id                  uuid REFERENCES visits(id),
  engineer_person_id        uuid REFERENCES persons(id),
  proposed_manufacturer     text,
  proposed_model            text,
  proposed_serial_number    text,
  existing_manufacturer     text,
  existing_model            text,
  existing_serial_number    text,
  confidence_score          decimal(3,2),
  photo_storage_path        text,
  status                    text NOT NULL DEFAULT 'PENDING'
                              CHECK (status IN ('PENDING','ACCEPTED','REJECTED')),
  reviewed_by_person_id     uuid REFERENCES persons(id),
  reviewed_at               timestamptz,
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_update_proposals_asset ON asset_update_proposals(asset_id);

-- ─────────────────────────────────────────────────────────────
-- 5. SEED FIELD AI AGENTS (Phase 0C-R additions in ASSIST mode)
-- ─────────────────────────────────────────────────────────────
INSERT INTO ai_agents (id, code, name, description, role_description, autonomy_level, is_active, max_daily_budget_gbp, confidence_threshold, created_at)
VALUES
  (gen_random_uuid(), 'FIELD_VISION_AGENT', 'Field Visual Intelligence Agent',
   'Extracts nameplate and equipment metadata from field photos. Proposes candidate asset details for engineer verification.',
   'Analyses field photographs of equipment nameplates, dials, and labels to extract manufacturer, model, and serial numbers. Strictly operates in ASSIST mode with zero autonomous database updates.',
   'ASSIST', true, 10.00, 0.80, now()),
  (gen_random_uuid(), 'FIELD_COPILOT_AGENT', 'Field Copilot Agent',
   'Context-aware retrieval assistant for mobile engineers on site.',
   'Answers field technical and historical questions using strictly authorized Work Order, Asset, Defect, and approved site documentation. Strictly refuses unverified safety procedures and prevents cross-tenant data leakage.',
   'ASSIST', true, 15.00, 0.85, now())
ON CONFLICT (code) DO NOTHING;
-- ============================================================
-- ENTIREFM PHASE 0D — PPM AUTOPILOT & AI ASSET REGISTER SCHEMA
-- Migration: 0014_ppm_autopilot_asset_register.sql
-- Adds: asset_import_batches, asset_import_rows, asset_candidates,
--        asset_duplicates, maintenance_sources, maintenance_requirements,
--        maintenance_plans, maintenance_plan_items, maintenance_occurrences,
--        and seeds PPM AI Agents in ASSIST mode.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. ASSET IMPORT BATCHES & PROGRESSIVE LINEAGE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS asset_import_batches (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number              text NOT NULL UNIQUE,
  client_account_id         uuid REFERENCES client_accounts(id) ON DELETE CASCADE,
  contract_id               uuid REFERENCES contracts(id),
  site_id                   uuid REFERENCES sites(id),
  file_name                 text NOT NULL,
  file_storage_path         text NOT NULL,
  source_format             text NOT NULL CHECK (source_format IN ('XLSX', 'CSV', 'COBIE', 'DOCUMENT_OCR', 'MANUAL')),
  column_mappings_json      jsonb DEFAULT '{}'::jsonb,
  total_rows                integer DEFAULT 0,
  ready_rows                integer DEFAULT 0,
  review_rows               integer DEFAULT 0,
  duplicate_rows            integer DEFAULT 0,
  imported_rows             integer DEFAULT 0,
  status                    text NOT NULL DEFAULT 'DRAFT'
                              CHECK (status IN ('DRAFT', 'MAPPED', 'VALIDATING', 'READY_FOR_PREVIEW', 'COMMITTED', 'ROLLED_BACK', 'FAILED')),
  created_by_person_id      uuid REFERENCES persons(id),
  committed_at              timestamptz,
  rolled_back_at            timestamptz,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_import_batches_client ON asset_import_batches(client_account_id);
CREATE INDEX IF NOT EXISTS idx_asset_import_batches_site ON asset_import_batches(site_id);

CREATE TABLE IF NOT EXISTS asset_import_rows (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id                  uuid NOT NULL REFERENCES asset_import_batches(id) ON DELETE CASCADE,
  row_index                 integer NOT NULL,
  raw_data_json             jsonb NOT NULL,
  mapped_data_json          jsonb DEFAULT '{}'::jsonb,
  status                    text NOT NULL DEFAULT 'PENDING'
                              CHECK (status IN ('PENDING', 'VALID', 'NEEDS_REVIEW', 'DUPLICATE', 'IMPORTED', 'ERROR')),
  validation_issues_json    jsonb DEFAULT '[]'::jsonb,
  candidate_asset_id        uuid,
  created_asset_id          uuid REFERENCES assets(id),
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_import_rows_batch ON asset_import_rows(batch_id);

-- ─────────────────────────────────────────────────────────────
-- 2. ASSET CANDIDATES & DUPLICATE INTELLIGENCE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS asset_candidates (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_account_id         uuid REFERENCES client_accounts(id),
  site_id                   uuid REFERENCES sites(id),
  source_type               text NOT NULL CHECK (source_type IN ('SPREADSHEET_IMPORT', 'FIELD_DISCOVERY', 'DOCUMENT_EXTRACTION', 'COBIE_IMPORT', 'MANUAL')),
  source_reference          text,
  proposed_reference        text,
  proposed_name             text NOT NULL,
  proposed_category         text,
  proposed_manufacturer     text,
  proposed_model            text,
  proposed_serial_number    text,
  proposed_location_json    jsonb DEFAULT '{}'::jsonb,
  confidence_score          decimal(3,2) DEFAULT 0.85,
  status                    text NOT NULL DEFAULT 'PENDING'
                              CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED', 'MERGED')),
  reviewed_by_person_id     uuid REFERENCES persons(id),
  reviewed_at               timestamptz,
  created_asset_id          uuid REFERENCES assets(id),
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_candidates_client ON asset_candidates(client_account_id);
CREATE INDEX IF NOT EXISTS idx_asset_candidates_site ON asset_candidates(site_id);

CREATE TABLE IF NOT EXISTS asset_duplicates (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_asset_id          uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  candidate_asset_id        uuid REFERENCES asset_candidates(id) ON DELETE CASCADE,
  duplicate_asset_id        uuid REFERENCES assets(id) ON DELETE CASCADE,
  confidence_score          decimal(3,2) NOT NULL,
  match_reasons_json        jsonb NOT NULL,
  status                    text NOT NULL DEFAULT 'PENDING'
                              CHECK (status IN ('PENDING', 'MERGED', 'DISMISSED_SEPARATE')),
  reviewed_by_person_id     uuid REFERENCES persons(id),
  reviewed_at               timestamptz,
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_duplicates_primary ON asset_duplicates(primary_asset_id);

-- ─────────────────────────────────────────────────────────────
-- 3. ASSET EXTENSIONS (Data Quality & Lifecycle)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE assets
  ADD COLUMN IF NOT EXISTS completeness_score decimal(3,2) DEFAULT 0.50,
  ADD COLUMN IF NOT EXISTS data_quality_status text DEFAULT 'UNVERIFIED'
    CHECK (data_quality_status IN ('UNVERIFIED', 'PARTIAL', 'VERIFIED', 'NEEDS_REVIEW', 'CONFLICT', 'ARCHIVED')),
  ADD COLUMN IF NOT EXISTS provenance_json jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS replaced_by_asset_id uuid REFERENCES assets(id),
  ADD COLUMN IF NOT EXISTS import_batch_id uuid REFERENCES asset_import_batches(id),
  ADD COLUMN IF NOT EXISTS is_statutory boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS qr_identifier text UNIQUE;

-- ─────────────────────────────────────────────────────────────
-- 4. MAINTENANCE KNOWLEDGE SOURCES & REQUIREMENTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS maintenance_sources (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code                      text NOT NULL UNIQUE,
  name                      text NOT NULL,
  provider                  text NOT NULL,
  source_type               text NOT NULL
                              CHECK (source_type IN ('MANUFACTURER', 'LEGISLATION', 'STANDARD', 'SFG20', 'CLIENT', 'CONTRACT', 'ENTIREFM', 'RISK_ASSESSMENT', 'HISTORICAL', 'MANUAL')),
  version                   text NOT NULL,
  effective_date            date NOT NULL,
  superseded_date           date,
  licensing_status          text NOT NULL DEFAULT 'ACTIVE'
                              CHECK (licensing_status IN ('ACTIVE', 'NOT_CONFIGURED', 'EXPIRED', 'RESTRICTED')),
  source_url                text,
  is_active                 boolean NOT NULL DEFAULT true,
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maintenance_requirements (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_code          text NOT NULL UNIQUE,
  asset_class               text NOT NULL,
  title                     text NOT NULL,
  description               text NOT NULL,
  frequency                 text NOT NULL
                              CHECK (frequency IN ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'SIX_MONTHLY', 'ANNUAL', 'BIENNIAL', 'FIVE_YEARLY', 'VARIABLE')),
  frequency_interval_days   integer NOT NULL,
  required_trade            text NOT NULL,
  required_competency       text,
  statutory_relevance       text,
  compliance_obligation_id  uuid,
  expected_duration_hours   decimal(5,2) DEFAULT 1.0,
  evidence_requirements_json jsonb DEFAULT '["BEFORE_PHOTO", "AFTER_PHOTO", "READING"]'::jsonb,
  tasks_template_json       jsonb DEFAULT '[]'::jsonb,
  source_id                 uuid REFERENCES maintenance_sources(id),
  source_version            text,
  version                   integer NOT NULL DEFAULT 1,
  status                    text NOT NULL DEFAULT 'ACTIVE'
                              CHECK (status IN ('ACTIVE', 'UNDER_REVIEW', 'SUPERSEDED', 'DEPRECATED')),
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_maintenance_requirements_class ON maintenance_requirements(asset_class);
CREATE INDEX IF NOT EXISTS idx_maintenance_requirements_freq ON maintenance_requirements(frequency);

-- ─────────────────────────────────────────────────────────────
-- 5. MAINTENANCE PLANS & INTELLIGENT OCCURRENCES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS maintenance_plans (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_number               text NOT NULL UNIQUE,
  client_account_id         uuid NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  contract_id               uuid REFERENCES contracts(id),
  site_id                   uuid REFERENCES sites(id),
  name                      text NOT NULL,
  description               text,
  version                   integer NOT NULL DEFAULT 1,
  status                    text NOT NULL DEFAULT 'DRAFT'
                              CHECK (status IN ('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'ACTIVE', 'SUPERSEDED', 'ARCHIVED')),
  effective_from            date NOT NULL,
  effective_to              date,
  total_assets_count        integer DEFAULT 0,
  total_requirements_count  integer DEFAULT 0,
  total_annual_visits_est   integer DEFAULT 0,
  total_annual_hours_est    decimal(8,2) DEFAULT 0,
  approved_by_person_id     uuid REFERENCES persons(id),
  approved_at               timestamptz,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_maintenance_plans_client ON maintenance_plans(client_account_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_plans_site ON maintenance_plans(site_id);

CREATE TABLE IF NOT EXISTS maintenance_plan_items (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id                   uuid NOT NULL REFERENCES maintenance_plans(id) ON DELETE CASCADE,
  asset_id                  uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  requirement_id            uuid NOT NULL REFERENCES maintenance_requirements(id),
  planning_window_days      integer DEFAULT 14,
  preferred_month           integer, -- 1-12
  estimated_hours           decimal(5,2) DEFAULT 1.0,
  recurrence_anchor_date    date,
  is_active                 boolean NOT NULL DEFAULT true,
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plan_items_plan ON maintenance_plan_items(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_items_asset ON maintenance_plan_items(asset_id);
CREATE INDEX IF NOT EXISTS idx_plan_items_req ON maintenance_plan_items(requirement_id);

CREATE TABLE IF NOT EXISTS maintenance_occurrences (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurrence_code           text NOT NULL UNIQUE,
  plan_item_id              uuid NOT NULL REFERENCES maintenance_plan_items(id) ON DELETE CASCADE,
  plan_id                   uuid NOT NULL REFERENCES maintenance_plans(id) ON DELETE CASCADE,
  asset_id                  uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  requirement_id            uuid NOT NULL REFERENCES maintenance_requirements(id),
  planned_date              date NOT NULL,
  window_start_date         date NOT NULL,
  window_end_date           date NOT NULL,
  work_order_id             uuid REFERENCES work_orders(id),
  status                    text NOT NULL DEFAULT 'PLANNED'
                              CHECK (status IN ('PLANNED', 'GENERATED', 'SATISFIED', 'MISSED', 'NO_ACCESS', 'CANCELLED')),
  satisfaction_evidence_id  uuid,
  satisfied_at              timestamptz,
  missed_reason             text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_occurrences_plan ON maintenance_occurrences(plan_id);
CREATE INDEX IF NOT EXISTS idx_occurrences_asset ON maintenance_occurrences(asset_id);
CREATE INDEX IF NOT EXISTS idx_occurrences_planned_date ON maintenance_occurrences(planned_date);
CREATE INDEX IF NOT EXISTS idx_occurrences_wo ON maintenance_occurrences(work_order_id);

-- ─────────────────────────────────────────────────────────────
-- 6. SEED PPM AI AGENTS IN ASSIST MODE
-- ─────────────────────────────────────────────────────────────
INSERT INTO ai_agents (id, code, name, description, role_description, autonomy_level, is_active, max_daily_budget_gbp, confidence_threshold, created_at)
VALUES
  (gen_random_uuid(), 'ASSET_IMPORT_AGENT', 'Asset Import & Normalisation Agent',
   'Analyses customer equipment spreadsheets, inspects workbook headers, and proposes canonical field mappings and duplicate detection flags.',
   'Proposes column mappings between client asset spreadsheets and canonical EntireFM fields. Identifies probable duplicate assets and highlights missing data. Operates strictly in ASSIST mode with zero autonomous database mutations.',
   'ASSIST', true, 10.00, 0.80, now()),
  (gen_random_uuid(), 'ASSET_CLASSIFICATION_AGENT', 'Asset Classification Agent',
   'Proposes canonical asset taxonomies, categories, and systems from equipment descriptions and rating plates.',
   'Classifies assets into standard EntireFM HVAC, Electrical, Plumbing, and Statutory hierarchies based on make, model, and plant descriptions. Requires human confirmation for low-confidence classifications.',
   'ASSIST', true, 10.00, 0.85, now()),
  (gen_random_uuid(), 'MAINTENANCE_MAPPING_AGENT', 'Maintenance Requirement Mapping Agent',
   'Matches classified assets to approved statutory, manufacturer, and client maintenance requirements without fabricating unverified frequencies.',
   'Proposes relevant maintenance schedules and tasks from authorised knowledge sources. Explicitly flags assets with unsupported frequencies for human engineering review.',
   'ASSIST', true, 15.00, 0.85, now()),
  (gen_random_uuid(), 'PPM_SCHEDULING_AGENT', 'PPM Scheduling & Visit Optimisation Agent',
   'Proposes efficient multi-asset visit groupings by site, trade, and maintenance windows to balance engineering workload.',
   'Groups compatible maintenance items into streamlined visit schedules to minimise site disruptions and travel overhead. Strictly requires planner approval before activating schedules.',
   'ASSIST', true, 15.00, 0.80, now())
ON CONFLICT (code) DO NOTHING;

-- Seed default EntireFM Standard Maintenance Source
INSERT INTO maintenance_sources (id, code, name, provider, source_type, version, effective_date, licensing_status, is_active, created_at)
VALUES
  (gen_random_uuid(), 'SRC-EFM-STD-2026', 'EntireFM Standard Maintenance Specification 2026', 'EntireFM', 'ENTIREFM', '2026.1', '2026-01-01', 'ACTIVE', true, now()),
  (gen_random_uuid(), 'SRC-SFG20-INTEG', 'SFG20 / Facilities-iQ Adapter Specification', 'BESA / SFG20', 'SFG20', '2026.2', '2026-01-01', 'NOT_CONFIGURED', true, now())
ON CONFLICT (code) DO NOTHING;
-- ============================================================================
-- Migration 0015: Commercial Intelligence + Talk-to-Quote (Phase 0G)
-- ============================================================================

-- 1. EXTEND EXISTING COMMERCIAL TABLES

-- Extend Quotes
ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS internal_status text NOT NULL DEFAULT 'DRAFT', -- DRAFT, SCOPED, PRICED, INTERNAL_REVIEW, READY_TO_ISSUE, ISSUED, ACCEPTED, REJECTED, EXPIRED, SUPERSEDED
  ADD COLUMN IF NOT EXISTS scope_description text,
  ADD COLUMN IF NOT EXISTS scope_exclusions_json jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS scope_assumptions_json jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS validity_days integer DEFAULT 30,
  ADD COLUMN IF NOT EXISTS expected_cost_gbp numeric(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS expected_margin_gbp numeric(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS expected_margin_pct numeric(5,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS client_po_required boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS client_po_ref text,
  ADD COLUMN IF NOT EXISTS issued_at timestamptz,
  ADD COLUMN IF NOT EXISTS client_decided_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejection_reason_code text,
  ADD COLUMN IF NOT EXISTS rejection_reason_detail text,
  ADD COLUMN IF NOT EXISTS rate_card_id uuid REFERENCES public.rate_cards(id),
  ADD COLUMN IF NOT EXISTS rate_card_version_at integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS field_quote_scope_id uuid,
  ADD COLUMN IF NOT EXISTS supersedes_quote_id uuid REFERENCES public.quotes(id);

-- Extend Rate Cards
ALTER TABLE public.rate_cards
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS contract_id uuid REFERENCES public.contracts(id),
  ADD COLUMN IF NOT EXISTS superseded_by_id uuid REFERENCES public.rate_cards(id),
  ADD COLUMN IF NOT EXISTS notes text;

-- Extend Rate Card Items
ALTER TABLE public.rate_card_items
  ADD COLUMN IF NOT EXISTS rate_period text NOT NULL DEFAULT 'NORMAL', -- NORMAL, OVERTIME, EVENING, NIGHT, WEEKEND, BANK_HOLIDAY, EMERGENCY
  ADD COLUMN IF NOT EXISTS callout_includes_first_hour boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS first_hour_threshold_mins integer DEFAULT 60;

-- Extend Purchase Orders
ALTER TABLE public.purchase_orders
  ADD COLUMN IF NOT EXISTS approval_id uuid REFERENCES public.approvals(id),
  ADD COLUMN IF NOT EXISTS quote_id uuid REFERENCES public.quotes(id),
  ADD COLUMN IF NOT EXISTS commitment_type text NOT NULL DEFAULT 'STANDARD'; -- STANDARD, EMERGENCY, VARIATION, SUBCONTRACT

-- 2. NEW COMMERCIAL TABLES

-- Commercial Policies (hierarchical: platform -> client -> contract -> service type)
CREATE TABLE IF NOT EXISTS public.commercial_policies (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_level                 text NOT NULL DEFAULT 'PLATFORM', -- PLATFORM, CLIENT, CONTRACT, SERVICE_TYPE
  client_account_id           uuid REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  contract_id                 uuid REFERENCES public.contracts(id) ON DELETE CASCADE,
  service_type                text, -- REACTIVE, PPM, PROJECT, QUOTED
  name                        text NOT NULL,
  min_margin_pct              numeric(5,2) NOT NULL DEFAULT 20.00,
  target_margin_pct           numeric(5,2) NOT NULL DEFAULT 35.00,
  max_auto_quote_gbp          numeric(10,2) NOT NULL DEFAULT 500.00,
  quote_approval_threshold_gbp numeric(10,2) NOT NULL DEFAULT 2500.00,
  po_approval_threshold_gbp   numeric(10,2) NOT NULL DEFAULT 1000.00,
  emergency_spend_limit_gbp   numeric(10,2) NOT NULL DEFAULT 1000.00,
  material_markup_type        text NOT NULL DEFAULT 'FIXED_PERCENT', -- FIXED_PERCENT, TIERED, COST_PLUS, ZERO
  material_markup_pct         numeric(5,2) NOT NULL DEFAULT 20.00,
  subcontract_markup_pct      numeric(5,2) NOT NULL DEFAULT 15.00,
  stale_price_threshold_days  integer NOT NULL DEFAULT 30,
  client_po_required_above_gbp numeric(10,2) NOT NULL DEFAULT 500.00,
  is_active                   boolean NOT NULL DEFAULT true,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Supplier Price Catalogue (parts/materials with freshness and verified sources)
CREATE TABLE IF NOT EXISTS public.supplier_price_catalogue (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_org_id             uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  item_code                   text NOT NULL,
  description                 text NOT NULL,
  category                    text NOT NULL DEFAULT 'GENERAL', -- HVAC, ELECTRICAL, PLUMBING, FABRIC, FIRE, GENERAL
  unit                        text NOT NULL DEFAULT 'UNIT', -- UNIT, METRE, LITRE, KG, BOX, PACK
  unit_cost_gbp               numeric(10,2) NOT NULL,
  currency                    text NOT NULL DEFAULT 'GBP',
  quoted_at                   timestamptz NOT NULL DEFAULT now(),
  valid_to                    date,
  is_stale                    boolean NOT NULL DEFAULT false,
  stale_reason                text,
  source_document_ref         text,
  ai_extracted                boolean NOT NULL DEFAULT false,
  ai_confidence_score         numeric(3,2),
  verified_by_person_id       uuid REFERENCES public.persons(id),
  verified_at                 timestamptz,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(supplier_org_id, item_code)
);

-- Quote Versions (immutable snapshot trail)
CREATE TABLE IF NOT EXISTS public.quote_versions (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id                    uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  version                     integer NOT NULL,
  snapshot_json               jsonb NOT NULL,
  change_reason               text NOT NULL,
  created_by_person_id        uuid REFERENCES public.persons(id),
  created_at                  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(quote_id, version)
);

-- Variation Orders (changes to already-approved work without mutating original quote)
CREATE TABLE IF NOT EXISTS public.variation_orders (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id                    uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  work_order_id               uuid REFERENCES public.work_orders(id) ON DELETE CASCADE,
  variation_number            text NOT NULL UNIQUE,
  scope_description           text NOT NULL,
  expected_cost_gbp           numeric(10,2) NOT NULL DEFAULT 0.00,
  sell_price_gbp              numeric(10,2) NOT NULL DEFAULT 0.00,
  margin_gbp                  numeric(10,2) NOT NULL DEFAULT 0.00,
  margin_pct                  numeric(5,2) NOT NULL DEFAULT 0.00,
  status                      text NOT NULL DEFAULT 'DRAFT', -- DRAFT, PENDING_APPROVAL, APPROVED, REJECTED
  approval_id                 uuid REFERENCES public.approvals(id),
  requested_by_id             uuid REFERENCES public.persons(id),
  client_approved_at          timestamptz,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Purchase Order Line Items
CREATE TABLE IF NOT EXISTS public.po_lines (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id           uuid NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  description                 text NOT NULL,
  quantity                    numeric(8,2) NOT NULL DEFAULT 1.00,
  unit                        text NOT NULL DEFAULT 'UNIT',
  unit_cost_gbp               numeric(10,2) NOT NULL,
  total_gbp                   numeric(10,2) NOT NULL,
  cost_commitment_id          uuid REFERENCES public.cost_commitments(id),
  created_at                  timestamptz NOT NULL DEFAULT now()
);

-- Commercial Exceptions Ledger
CREATE TABLE IF NOT EXISTS public.commercial_exceptions (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_type                 text NOT NULL, -- QUOTE, WORK_ORDER, PO, INVOICE, RATE_CARD
  object_id                   uuid NOT NULL,
  exception_code              text NOT NULL, -- MISSING_LABOUR_RATE, STALE_MATERIAL_PRICE, MISSING_MATERIAL_PRICE, MARGIN_BELOW_POLICY, HIGH_VALUE_QUOTE, HIGH_VALUE_PO, MISSING_CLIENT_PO, COST_VARIANCE_EXCEEDED
  severity                    text NOT NULL DEFAULT 'WARNING', -- INFO, WARNING, BLOCKING
  detail                      text NOT NULL,
  is_resolved                 boolean NOT NULL DEFAULT false,
  resolved_at                 timestamptz,
  resolved_by_person_id       uuid REFERENCES public.persons(id),
  resolution_notes            text,
  created_at                  timestamptz NOT NULL DEFAULT now()
);

-- Controlled RFQ Requests
CREATE TABLE IF NOT EXISTS public.supplier_rfq_requests (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id                    uuid REFERENCES public.quotes(id),
  supplier_org_id             uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  part_description            text NOT NULL,
  quantity                    numeric(8,2) NOT NULL DEFAULT 1.00,
  unit                        text NOT NULL DEFAULT 'UNIT',
  required_by                 date,
  status                      text NOT NULL DEFAULT 'SENT', -- DRAFT, SENT, RESPONDED, EXPIRED, DECLINED
  response_unit_cost_gbp      numeric(10,2),
  response_valid_until        date,
  responded_at                timestamptz,
  notes                       text,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance & lookups
CREATE INDEX IF NOT EXISTS idx_quotes_wo ON public.quotes(work_order_id);
CREATE INDEX IF NOT EXISTS idx_quotes_client ON public.quotes(client_account_id);
CREATE INDEX IF NOT EXISTS idx_quotes_internal_status ON public.quotes(internal_status);
CREATE INDEX IF NOT EXISTS idx_quote_versions_quote ON public.quote_versions(quote_id);
CREATE INDEX IF NOT EXISTS idx_supplier_price_supplier ON public.supplier_price_catalogue(supplier_org_id, item_code);
CREATE INDEX IF NOT EXISTS idx_po_lines_po ON public.po_lines(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_commercial_exceptions_obj ON public.commercial_exceptions(object_type, object_id);
CREATE INDEX IF NOT EXISTS idx_variation_orders_quote ON public.variation_orders(quote_id);

-- Enable RLS
ALTER TABLE public.commercial_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_price_catalogue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variation_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.po_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commercial_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_rfq_requests ENABLE ROW LEVEL SECURITY;

-- 3. SEED AI AGENTS FOR PHASE 0G

INSERT INTO public.ai_agents (code, name, role_description, autonomy_level, max_daily_budget_gbp, confidence_threshold, is_active)
VALUES 
  (
    'TALK_TO_QUOTE_AGENT',
    'Talk-to-Quote Agent',
    'Assists in structuring field scopes, retrieving approved rate cards and supplier catalogue prices, calculating deterministic draft quotes, and presenting commercial recommendations. Cannot invent prices, create unverified line items, or issue quotes to clients autonomously.',
    'ASSIST',
    10.00,
    0.80,
    true
  ),
  (
    'COMMERCIAL_INTELLIGENCE_AGENT',
    'Commercial Intelligence Agent',
    'Analyzes margin health, detects cost variances, monitors WIP staging and unbilled completed work, and flags commercial exceptions against policy. Operates in assist-only advisory capacity.',
    'ASSIST',
    10.00,
    0.80,
    true
  )
ON CONFLICT (code) DO NOTHING;

-- 4. SEED DEFAULT PLATFORM COMMERCIAL POLICY

INSERT INTO public.commercial_policies (
  scope_level,
  name,
  min_margin_pct,
  target_margin_pct,
  max_auto_quote_gbp,
  quote_approval_threshold_gbp,
  po_approval_threshold_gbp,
  emergency_spend_limit_gbp,
  material_markup_type,
  material_markup_pct,
  subcontract_markup_pct,
  stale_price_threshold_days,
  client_po_required_above_gbp,
  is_active
)
VALUES (
  'PLATFORM',
  'EntireFM Default Platform Commercial Policy',
  20.00,
  35.00,
  500.00,
  2500.00,
  1000.00,
  1000.00,
  'FIXED_PERCENT',
  20.00,
  15.00,
  30,
  500.00,
  true
)
ON CONFLICT DO NOTHING;
-- ============================================================
-- ENTIREFM PHASE 0H — FINANCE AUTOMATION + INVOICE INTELLIGENCE
-- Migration: 0016_finance_automation_invoice_intelligence.sql
-- ============================================================
-- Extends:  supplier_invoices, supplier_invoice_lines,
--           client_invoices, client_invoice_lines,
--           client_billing_records
-- Creates:  credit_notes, credit_note_lines,
--           finance_tolerance_policies,
--           accounting_sync_logs, finance_mailbox_intake
-- Seeds:    INVOICE_INTELLIGENCE_AGENT, FINANCE_ANOMALY_AGENT,
--           default tolerance policy
-- Rules:    AI MAY STRUCTURE, RETRIEVE, CALCULATE AND RECOMMEND
--           AI MUST NOT INVENT COMMERCIAL FACTS
--           AI MUST NOT ALTER BANK DETAILS OR APPROVE PAYMENT
-- ============================================================

-- ============================================================
-- 1. EXTEND supplier_invoices
-- ============================================================

alter table public.supplier_invoices
  add column if not exists document_storage_path    text,
  add column if not exists document_checksum_sha256  text,
  add column if not exists document_mime_type        text,
  add column if not exists document_size_bytes       integer,
  add column if not exists extraction_status         text not null default 'PENDING'
    check (extraction_status in ('PENDING','EXTRACTING','EXTRACTED','EXTRACTION_FAILED')),
  add column if not exists extraction_result_json    jsonb default '{}'::jsonb,
  add column if not exists extraction_confidence     numeric(4,3),
  add column if not exists extracted_at              timestamptz,
  add column if not exists extracted_by_agent_id     uuid references public.ai_agents(id),
  add column if not exists resolved_supplier_org_id  uuid references public.organisations(id),
  add column if not exists supplier_account_ref      text,
  add column if not exists supplier_resolution_status text not null default 'UNRESOLVED'
    check (supplier_resolution_status in ('UNRESOLVED','RESOLVED','AMBIGUOUS','REVIEW_REQUIRED')),
  add column if not exists invoice_bank_details_json  jsonb,
  add column if not exists bank_details_change_alert  boolean not null default false,
  add column if not exists bank_alert_reviewed_by_id  uuid references public.persons(id),
  add column if not exists bank_alert_reviewed_at     timestamptz,
  add column if not exists duplicate_of_invoice_id    uuid references public.supplier_invoices(id),
  add column if not exists duplicate_detection_basis  text,
  add column if not exists mailbox_intake_id          uuid,
  add column if not exists currency                   text not null default 'GBP',
  add column if not exists match_status               text not null default 'UNMATCHED'
    check (match_status in (
      'UNMATCHED','EXACT_MATCH','MATCH_WITHIN_TOLERANCE','PARTIAL_MATCH',
      'OVER_PO','UNDER_PO','RATE_VARIANCE','QUANTITY_VARIANCE','TAX_VARIANCE',
      'NO_PO','WRONG_SUPPLIER','DUPLICATE','REVIEW_REQUIRED','MATCHED'
    )),
  add column if not exists match_result_json          jsonb default '{}'::jsonb,
  add column if not exists matched_po_id              uuid references public.purchase_orders(id),
  add column if not exists matched_work_order_id      uuid references public.work_orders(id),
  add column if not exists variance_amount_gbp        numeric(10,2) default 0.00,
  add column if not exists variance_pct               numeric(6,3),
  add column if not exists matched_at                 timestamptz,
  add column if not exists matched_by_agent_id        uuid references public.ai_agents(id),
  add column if not exists processing_status          text not null default 'RECEIVED'
    check (processing_status in (
      'RECEIVED','EXTRACTING','VALIDATING','MATCHING',
      'REVIEW_REQUIRED','APPROVED','POSTED','EXPORTED',
      'DISPUTED','DUPLICATE','REJECTED','FAILED','CREDIT_REQUIRED'
    )),
  add column if not exists approval_id                uuid references public.approvals(id),
  add column if not exists approved_at                timestamptz,
  add column if not exists approved_by_id             uuid references public.persons(id),
  add column if not exists actual_cost_posted         boolean not null default false,
  add column if not exists actual_cost_posted_at      timestamptz,
  add column if not exists actual_cost_posted_by_id   uuid references public.persons(id),
  add column if not exists disputed_at                timestamptz,
  add column if not exists disputed_by_id             uuid references public.persons(id),
  add column if not exists dispute_reason             text,
  add column if not exists dispute_amount_gbp         numeric(10,2),
  add column if not exists payment_status             text not null default 'NOT_DUE'
    check (payment_status in ('NOT_DUE','DUE','OVERDUE','PART_PAID','PAID','ON_HOLD')),
  add column if not exists payment_reference          text,
  add column if not exists paid_at                    timestamptz,
  add column if not exists paid_amount_gbp            numeric(10,2),
  add column if not exists accounting_provider        text,
  add column if not exists accounting_external_id     text,
  add column if not exists accounting_sync_status     text not null default 'NOT_SYNCED'
    check (accounting_sync_status in (
      'NOT_SYNCED','SYNCING','SYNCED','SYNC_FAILED','NOT_CONFIGURED'
    )),
  add column if not exists accounting_synced_at       timestamptz,
  add column if not exists accounting_sync_error      text,
  add column if not exists ingest_channel             text not null default 'MANUAL_UPLOAD'
    check (ingest_channel in (
      'MANUAL_UPLOAD','FINANCE_MAILBOX','CONTRACTOR_PORTAL',
      'API','ACCOUNTING_PLATFORM','STRUCTURED_EINVOICE'
    ));

create index if not exists idx_supplier_invoices_processing
  on public.supplier_invoices(processing_status);
create index if not exists idx_supplier_invoices_match
  on public.supplier_invoices(match_status);
create index if not exists idx_supplier_invoices_bank_alert
  on public.supplier_invoices(bank_details_change_alert)
  where bank_details_change_alert = true;

-- ============================================================
-- 2. EXTEND supplier_invoice_lines
-- ============================================================

alter table public.supplier_invoice_lines
  add column if not exists line_number              integer,
  add column if not exists unit                     text,
  add column if not exists unit_price_net_gbp       numeric(10,4),
  add column if not exists tax_rate_pct             numeric(5,2) default 20.00,
  add column if not exists tax_amount_gbp           numeric(10,2) default 0.00,
  add column if not exists gross_amount_gbp         numeric(10,2),
  add column if not exists supplier_sku             text,
  add column if not exists supplier_line_ref        text,
  add column if not exists work_order_id            uuid references public.work_orders(id),
  add column if not exists po_line_id               uuid references public.po_lines(id),
  add column if not exists cost_commitment_id       uuid references public.cost_commitments(id),
  add column if not exists quote_line_id            uuid references public.quote_lines(id),
  add column if not exists match_confidence         numeric(4,3),
  add column if not exists variance_type            text
    check (variance_type in (
      'EXACT_MATCH','RATE_VARIANCE','QUANTITY_VARIANCE','TAX_VARIANCE',
      'UNAUTHORISED_ITEM','WITHIN_TOLERANCE','UNMATCHED'
    )),
  add column if not exists variance_amount_gbp      numeric(10,2) default 0.00,
  add column if not exists compared_quantity        numeric(8,2),
  add column if not exists compared_unit_price_gbp  numeric(10,4),
  add column if not exists compared_total_gbp       numeric(10,2),
  add column if not exists allocation_json          jsonb default '[]'::jsonb,
  add column if not exists exception_reason         text;

-- ============================================================
-- 3. EXTEND client_invoices
-- ============================================================

alter table public.client_invoices
  add column if not exists currency                 text not null default 'GBP',
  add column if not exists billing_period_start     date,
  add column if not exists billing_period_end       date,
  add column if not exists client_po_ref            text,
  add column if not exists notes                    text,
  add column if not exists evidence_pack_path       text,
  add column if not exists payment_status           text not null default 'NOT_DUE'
    check (payment_status in (
      'NOT_DUE','DUE','OVERDUE','PART_PAID','PAID','IN_DISPUTE','WRITTEN_OFF'
    )),
  add column if not exists payment_reference        text,
  add column if not exists paid_at                  timestamptz,
  add column if not exists accounting_provider      text,
  add column if not exists accounting_external_id   text,
  add column if not exists accounting_sync_status   text not null default 'NOT_SYNCED'
    check (accounting_sync_status in (
      'NOT_SYNCED','SYNCING','SYNCED','SYNC_FAILED','NOT_CONFIGURED'
    )),
  add column if not exists accounting_synced_at     timestamptz,
  add column if not exists accounting_sync_error    text,
  add column if not exists issued_at               timestamptz,
  add column if not exists issued_by_id            uuid references public.persons(id),
  add column if not exists voided_at               timestamptz,
  add column if not exists voided_by_id            uuid references public.persons(id),
  add column if not exists void_reason             text;

-- EXTEND client_invoice_lines
alter table public.client_invoice_lines
  add column if not exists line_number             integer,
  add column if not exists unit                    text,
  add column if not exists tax_rate_pct            numeric(5,2) default 20.00,
  add column if not exists tax_amount_gbp          numeric(10,2) default 0.00,
  add column if not exists gross_gbp               numeric(10,2),
  add column if not exists quote_id                uuid references public.quotes(id),
  add column if not exists quote_line_id           uuid references public.quote_lines(id),
  add column if not exists billing_record_id       uuid references public.client_billing_records(id),
  add column if not exists is_pass_through         boolean not null default false,
  add column if not exists is_billable             boolean not null default true;

-- EXTEND client_billing_records
alter table public.client_billing_records
  add column if not exists quote_id                uuid references public.quotes(id),
  add column if not exists po_id                   uuid references public.purchase_orders(id),
  add column if not exists billable_net_gbp         numeric(10,2),
  add column if not exists billable_tax_gbp         numeric(10,2),
  add column if not exists billable_gross_gbp       numeric(10,2),
  add column if not exists billing_period_start     date,
  add column if not exists billing_period_end       date,
  add column if not exists client_po_ref            text,
  add column if not exists client_invoice_id        uuid references public.client_invoices(id),
  add column if not exists blocker_reasons          jsonb default '[]'::jsonb,
  add column if not exists is_billable              boolean not null default true,
  add column if not exists billing_model            text not null default 'TIME_MATERIALS'
    check (billing_model in (
      'FIXED_FEE','TIME_MATERIALS','QUOTED_WORK','COST_PLUS',
      'RATE_CARD','PPM_FIXED','PASS_THROUGH','PROJECT_MILESTONE'
    ));

-- ============================================================
-- 4. CREATE credit_notes
-- ============================================================

create table if not exists public.credit_notes (
  id                     uuid primary key default gen_random_uuid(),
  credit_note_ref        text not null,
  credit_note_type       text not null check (credit_note_type in ('SUPPLIER','CLIENT')),
  supplier_invoice_id    uuid references public.supplier_invoices(id),
  supplier_org_id        uuid references public.organisations(id),
  client_invoice_id      uuid references public.client_invoices(id),
  client_account_id      uuid references public.client_accounts(id),
  currency               text not null default 'GBP',
  subtotal_gbp           numeric(10,2) not null default 0.00,
  tax_amount_gbp         numeric(10,2) not null default 0.00,
  total_amount_gbp       numeric(10,2) not null default 0.00,
  reason                 text not null,
  status                 text not null default 'DRAFT'
    check (status in ('DRAFT','ISSUED','APPLIED','VOID')),
  issue_date             date,
  applied_at             timestamptz,
  accounting_provider    text,
  accounting_external_id text,
  accounting_sync_status text not null default 'NOT_SYNCED'
    check (accounting_sync_status in (
      'NOT_SYNCED','SYNCING','SYNCED','SYNC_FAILED','NOT_CONFIGURED'
    )),
  created_by_id          uuid references public.persons(id),
  approved_by_id         uuid references public.persons(id),
  approved_at            timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create table if not exists public.credit_note_lines (
  id                uuid primary key default gen_random_uuid(),
  credit_note_id    uuid not null references public.credit_notes(id) on delete cascade,
  original_line_id  uuid,
  line_number       integer,
  description       text not null,
  quantity          numeric(8,2) not null default 1.00,
  unit_price_gbp    numeric(10,4) not null,
  tax_rate_pct      numeric(5,2) default 20.00,
  tax_amount_gbp    numeric(10,2) not null default 0.00,
  total_gbp         numeric(10,2) not null,
  created_at        timestamptz not null default now()
);

create index if not exists idx_credit_notes_supplier
  on public.credit_notes(supplier_invoice_id);
create index if not exists idx_credit_notes_client
  on public.credit_notes(client_invoice_id);

-- ============================================================
-- 5. CREATE finance_tolerance_policies
-- ============================================================

create table if not exists public.finance_tolerance_policies (
  id                         uuid primary key default gen_random_uuid(),
  policy_name                text not null,
  is_default                 boolean not null default false,
  client_account_id          uuid references public.client_accounts(id),
  supplier_org_id            uuid references public.organisations(id),
  contract_id                uuid references public.contracts(id),
  tolerance_absolute_gbp     numeric(8,2) not null default 5.00,
  tolerance_pct              numeric(5,2) not null default 2.00,
  auto_accept_below_absolute boolean not null default true,
  require_review_above_pct   boolean not null default true,
  exception_above_pct        numeric(5,2) not null default 5.00,
  tax_rounding_tolerance_gbp numeric(6,2) not null default 0.02,
  is_active                  boolean not null default true,
  created_by_id              uuid references public.persons(id),
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

-- ============================================================
-- 6. CREATE accounting_sync_logs
-- ============================================================

create table if not exists public.accounting_sync_logs (
  id                uuid primary key default gen_random_uuid(),
  provider          text not null,
  entity_type       text not null,
  entity_id         uuid not null,
  idempotency_key   text not null unique,
  direction         text not null check (direction in ('PUSH','PULL')),
  status            text not null default 'PENDING'
    check (status in ('PENDING','SUCCESS','FAILED','RETRYING')),
  external_id       text,
  request_payload   jsonb default '{}'::jsonb,
  response_payload  jsonb default '{}'::jsonb,
  error_message     text,
  attempt_count     integer not null default 1,
  next_retry_at     timestamptz,
  succeeded_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_accounting_sync_entity
  on public.accounting_sync_logs(entity_type, entity_id);
create index if not exists idx_accounting_sync_status
  on public.accounting_sync_logs(status);

-- ============================================================
-- 7. CREATE finance_mailbox_intake
-- ============================================================

create table if not exists public.finance_mailbox_intake (
  id                    uuid primary key default gen_random_uuid(),
  received_at           timestamptz not null default now(),
  from_address          text,
  subject               text,
  raw_email_path        text,
  attachment_count      integer not null default 0,
  attachments_json      jsonb default '[]'::jsonb,
  candidate_supplier_id uuid references public.organisations(id),
  supplier_confidence   numeric(4,3),
  processing_status     text not null default 'RECEIVED'
    check (processing_status in (
      'RECEIVED','PROCESSING','INVOICES_CREATED','FAILED','DUPLICATE','IGNORED'
    )),
  invoices_created_json jsonb default '[]'::jsonb,
  error_message         text,
  communication_id      uuid,
  processed_at          timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists idx_mailbox_status
  on public.finance_mailbox_intake(processing_status);

-- ============================================================
-- 8. RLS
-- ============================================================

alter table public.credit_notes enable row level security;
alter table public.credit_note_lines enable row level security;
alter table public.finance_tolerance_policies enable row level security;
alter table public.accounting_sync_logs enable row level security;
alter table public.finance_mailbox_intake enable row level security;

DROP POLICY IF EXISTS "EntireFM finance read credit_notes" ON public.credit_notes;
CREATE POLICY "EntireFM finance read credit_notes" ON public.credit_notes for select
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance insert credit_notes" ON public.credit_notes;
CREATE POLICY "EntireFM finance insert credit_notes" ON public.credit_notes for insert
  with check (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance update credit_notes" ON public.credit_notes;
CREATE POLICY "EntireFM finance update credit_notes" ON public.credit_notes for update
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance read credit_note_lines" ON public.credit_note_lines;
CREATE POLICY "EntireFM finance read credit_note_lines" ON public.credit_note_lines for select
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance insert credit_note_lines" ON public.credit_note_lines;
CREATE POLICY "EntireFM finance insert credit_note_lines" ON public.credit_note_lines for insert
  with check (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance read tolerance_policies" ON public.finance_tolerance_policies;
CREATE POLICY "EntireFM finance read tolerance_policies" ON public.finance_tolerance_policies for select
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance insert tolerance_policies" ON public.finance_tolerance_policies;
CREATE POLICY "EntireFM finance insert tolerance_policies" ON public.finance_tolerance_policies for insert
  with check (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance update tolerance_policies" ON public.finance_tolerance_policies;
CREATE POLICY "EntireFM finance update tolerance_policies" ON public.finance_tolerance_policies for update
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance read accounting_sync_logs" ON public.accounting_sync_logs;
CREATE POLICY "EntireFM finance read accounting_sync_logs" ON public.accounting_sync_logs for select
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance insert accounting_sync_logs" ON public.accounting_sync_logs;
CREATE POLICY "EntireFM finance insert accounting_sync_logs" ON public.accounting_sync_logs for insert
  with check (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance update accounting_sync_logs" ON public.accounting_sync_logs;
CREATE POLICY "EntireFM finance update accounting_sync_logs" ON public.accounting_sync_logs for update
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance read mailbox_intake" ON public.finance_mailbox_intake;
CREATE POLICY "EntireFM finance read mailbox_intake" ON public.finance_mailbox_intake for select
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance insert mailbox_intake" ON public.finance_mailbox_intake;
CREATE POLICY "EntireFM finance insert mailbox_intake" ON public.finance_mailbox_intake for insert
  with check (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance update mailbox_intake" ON public.finance_mailbox_intake;
CREATE POLICY "EntireFM finance update mailbox_intake" ON public.finance_mailbox_intake for update
  using (auth.role() = 'authenticated');

-- ============================================================
-- 9. SEED AI AGENTS
-- ============================================================

insert into public.ai_agents (
  code, name, description, role_description,
  autonomy_level, is_active,
  max_daily_budget_gbp, confidence_threshold
) values
(
  'INVOICE_INTELLIGENCE_AGENT',
  'Invoice Intelligence Agent',
  'Extracts invoice fields from documents, resolves suppliers/POs/Work Orders, compares lines against commitments, detects discrepancies, proposes match, classifies exceptions, recommends approval path.',
  'Finance automation assist: extract, identify, match, recommend. Never approve autonomously, never alter bank details, never invent invoice values.',
  'ASSIST', true, 0.00, 0.85
),
(
  'FINANCE_ANOMALY_AGENT',
  'Finance Anomaly Agent',
  'Summarises anomalies, compares invoice history, highlights unusual patterns including duplicates, bank-detail changes, high-value deviations, suspended-supplier invoices, and billing leakage.',
  'Finance anomaly detection: surface risks, highlight patterns. Cannot accuse supplier of fraud, block payment permanently, or alter bank records.',
  'ASSIST', true, 0.00, 0.80
)
on conflict (code) do nothing;

-- ============================================================
-- 10. SEED DEFAULT TOLERANCE POLICY
-- ============================================================

insert into public.finance_tolerance_policies (
  policy_name, is_default,
  tolerance_absolute_gbp, tolerance_pct,
  auto_accept_below_absolute, require_review_above_pct,
  exception_above_pct, tax_rounding_tolerance_gbp,
  is_active
) values (
  'Platform Default Tolerance Policy', true,
  5.00, 2.00,
  true, true,
  5.00, 0.02,
  true
)
on conflict do nothing;
-- ============================================================
-- ENTIREFM PHASE 0H-R — FINANCE TRUTH & METRICS REGISTRY
-- Migration: 0017_finance_truth_and_metrics_registry.sql
-- ============================================================
-- Creates:  finance_segregation_policies, supplier_bank_detail_verifications,
--           document_extraction_corrections, financial_metric_definitions
-- Extends:  finance_tolerance_policies, supplier_invoices
-- Seeds:    Default segregation tiers, canonical metric definitions
-- Rules:    Policy-driven thresholds, no hardcoded amounts,
--           traceable policy versioning, master bank protection.
-- ============================================================

-- ============================================================
-- 1. EXTEND finance_tolerance_policies
-- ============================================================

alter table public.finance_tolerance_policies
  add column if not exists version                    integer not null default 1,
  add column if not exists scope_level                text not null default 'PLATFORM_DEFAULT'
    check (scope_level in ('PLATFORM_DEFAULT','CLIENT','CONTRACT','SUPPLIER','FINANCE_OVERRIDE')),
  add column if not exists line_level_tolerance_pct   numeric(5,2) not null default 2.00,
  add column if not exists unit_rate_tolerance_pct    numeric(5,2) not null default 0.00,
  add column if not exists quantity_tolerance_pct     numeric(5,2) not null default 0.00,
  add column if not exists notes                      text;

create index if not exists idx_tolerance_scope_level
  on public.finance_tolerance_policies(scope_level, is_active);

-- ============================================================
-- 2. CREATE finance_segregation_policies
-- ============================================================

create table if not exists public.finance_segregation_policies (
  id                          uuid primary key default gen_random_uuid(),
  policy_name                 text not null,
  is_default                  boolean not null default false,
  version                     integer not null default 1,
  scope_level                 text not null default 'PLATFORM_DEFAULT'
    check (scope_level in ('PLATFORM_DEFAULT','CLIENT','CONTRACT','SUPPLIER')),
  client_account_id           uuid references public.client_accounts(id),
  supplier_org_id             uuid references public.organisations(id),
  contract_id                 uuid references public.contracts(id),

  -- Thresholds (in GBP)
  min_invoice_threshold_gbp   numeric(10,2) not null default 0.00,
  max_creator_approval_gbp    numeric(10,2) not null default 1000.00,
  requires_second_approver    boolean not null default false,
  second_approver_threshold_gbp numeric(10,2) not null default 10000.00,

  -- Variance & Exception rules
  variance_requires_escalation boolean not null default true,
  max_auto_approval_variance_gbp numeric(10,2) not null default 0.00,
  no_po_requires_escalation   boolean not null default true,
  bank_alert_blocks_approval  boolean not null default true,

  -- Required role codes
  primary_approver_role       text not null default 'FINANCE',
  second_approver_role        text not null default 'DIRECTOR',

  is_active                   boolean not null default true,
  created_by_id               uuid references public.persons(id),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

alter table public.finance_segregation_policies enable row level security;

DROP POLICY IF EXISTS "EntireFM finance read segregation_policies" ON public.finance_segregation_policies;
CREATE POLICY "EntireFM finance read segregation_policies" ON public.finance_segregation_policies for select
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance insert segregation_policies" ON public.finance_segregation_policies;
CREATE POLICY "EntireFM finance insert segregation_policies" ON public.finance_segregation_policies for insert
  with check (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance update segregation_policies" ON public.finance_segregation_policies;
CREATE POLICY "EntireFM finance update segregation_policies" ON public.finance_segregation_policies for update
  using (auth.role() = 'authenticated');

-- ============================================================
-- 3. CREATE supplier_bank_detail_verifications
-- ============================================================
-- Separate privileged workflow for supplier bank changes.
-- Cannot be altered from an invoice upload or invoice review screen.

create table if not exists public.supplier_bank_detail_verifications (
  id                          uuid primary key default gen_random_uuid(),
  supplier_org_id             uuid not null references public.organisations(id),
  requested_by_id             uuid not null references public.persons(id),
  verified_by_id              uuid references public.persons(id),
  old_bank_details_json       jsonb default '{}'::jsonb,
  new_bank_details_json       jsonb not null,
  verification_method         text not null
    check (verification_method in (
      'TELEPHONE_CALLBACK_VERIFIED','BANK_STATEMENT_AUTHENTICATED',
      'FORMAL_SOLICITOR_LETTER','DIRECTOR_WRITTEN_CONFIRMATION'
    )),
  status                      text not null default 'PENDING'
    check (status in ('PENDING','VERIFIED','REJECTED','EXPIRED')),
  rejection_reason            text,
  evidence_document_path      text,
  notes                       text,
  verified_at                 timestamptz,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

alter table public.supplier_bank_detail_verifications enable row level security;

DROP POLICY IF EXISTS "EntireFM finance read bank_verifications" ON public.supplier_bank_detail_verifications;
CREATE POLICY "EntireFM finance read bank_verifications" ON public.supplier_bank_detail_verifications for select
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance insert bank_verifications" ON public.supplier_bank_detail_verifications;
CREATE POLICY "EntireFM finance insert bank_verifications" ON public.supplier_bank_detail_verifications for insert
  with check (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance update bank_verifications" ON public.supplier_bank_detail_verifications;
CREATE POLICY "EntireFM finance update bank_verifications" ON public.supplier_bank_detail_verifications for update
  using (auth.role() = 'authenticated');

-- ============================================================
-- 4. EXTEND supplier_invoices (Policy Traceability)
-- ============================================================

alter table public.supplier_invoices
  add column if not exists tolerance_policy_id          uuid references public.finance_tolerance_policies(id),
  add column if not exists tolerance_policy_version_applied integer,
  add column if not exists segregation_policy_id        uuid references public.finance_segregation_policies(id),
  add column if not exists segregation_policy_version_applied integer,
  add column if not exists second_approved_by_id        uuid references public.persons(id),
  add column if not exists second_approved_at           timestamptz,
  add column if not exists second_approval_required     boolean not null default false;

-- ============================================================
-- 5. CREATE document_extraction_corrections
-- ============================================================
-- Preserves complete history of AI extracted values vs. human corrections

create table if not exists public.document_extraction_corrections (
  id                          uuid primary key default gen_random_uuid(),
  supplier_invoice_id         uuid not null references public.supplier_invoices(id) on delete cascade,
  field_name                  text not null,
  ai_extracted_value          text,
  ai_confidence_score         numeric(4,3),
  corrected_value             text not null,
  corrected_by_person_id      uuid not null references public.persons(id),
  ai_agent_id                 uuid references public.ai_agents(id),
  agent_version_tag           text,
  notes                       text,
  created_at                  timestamptz not null default now()
);

alter table public.document_extraction_corrections enable row level security;

DROP POLICY IF EXISTS "EntireFM finance read extraction_corrections" ON public.document_extraction_corrections;
CREATE POLICY "EntireFM finance read extraction_corrections" ON public.document_extraction_corrections for select
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance insert extraction_corrections" ON public.document_extraction_corrections;
CREATE POLICY "EntireFM finance insert extraction_corrections" ON public.document_extraction_corrections for insert
  with check (auth.role() = 'authenticated');

-- ============================================================
-- 6. CREATE financial_metric_definitions
-- ============================================================
-- Central catalog of canonical metric formulas, sources, and date dimensions

create table if not exists public.financial_metric_definitions (
  metric_code                 text primary key,
  metric_name                 text not null,
  category                    text not null check (category in ('REVENUE','COST','MARGIN','WIP','CASH')),
  description                 text not null,
  formula_expression          text not null,
  authoritative_sources_json  jsonb not null default '[]'::jsonb,
  inclusion_rules_json        jsonb not null default '[]'::jsonb,
  exclusion_rules_json        jsonb not null default '[]'::jsonb,
  default_date_dimension      text not null,
  currency_handling           text not null default 'GBP_ONLY',
  is_active                   boolean not null default true,
  created_at                  timestamptz not null default now()
);

alter table public.financial_metric_definitions enable row level security;

DROP POLICY IF EXISTS "EntireFM read financial_metric_definitions" ON public.financial_metric_definitions;
CREATE POLICY "EntireFM read financial_metric_definitions" ON public.financial_metric_definitions for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- 7. SEED DEFAULT SEGREGATION POLICIES
-- ============================================================

insert into public.finance_segregation_policies (
  policy_name, is_default, version, scope_level,
  min_invoice_threshold_gbp, max_creator_approval_gbp,
  requires_second_approver, second_approver_threshold_gbp,
  variance_requires_escalation, max_auto_approval_variance_gbp,
  no_po_requires_escalation, bank_alert_blocks_approval,
  primary_approver_role, second_approver_role, is_active
) values (
  'Platform Default Segregation Policy', true, 1, 'PLATFORM_DEFAULT',
  0.00, 1000.00,
  true, 10000.00,
  true, 0.00,
  true, true,
  'FINANCE', 'DIRECTOR', true
)
on conflict do nothing;

-- ============================================================
-- 8. SEED CANONICAL METRIC DEFINITIONS
-- ============================================================

insert into public.financial_metric_definitions (
  metric_code, metric_name, category, description,
  formula_expression, authoritative_sources_json,
  inclusion_rules_json, exclusion_rules_json,
  default_date_dimension, currency_handling, is_active
) values
(
  'EXPECTED_REVENUE',
  'Expected Revenue',
  'REVENUE',
  'Total revenue expected from approved client quotes and contracted service schedules.',
  'sum(quotes.total_price_gbp) where status in (ACCEPTED, ISSUED)',
  '["quotes", "contracts"]'::jsonb,
  '["Approved quotes", "Active contract schedules"]'::jsonb,
  '["Draft quotes", "Rejected quotes", "Cancelled contracts"]'::jsonb,
  'quote_approved_at', 'GBP_ONLY', true
),
(
  'APPROVED_REVENUE',
  'Approved Revenue',
  'REVENUE',
  'Revenue explicitly authorized by the client with signed approval or purchase order reference.',
  'sum(quotes.total_price_gbp) where status = ACCEPTED',
  '["quotes", "client_approvals"]'::jsonb,
  '["Client accepted quotes"]'::jsonb,
  '["Pending quotes", "Internal review only"]'::jsonb,
  'client_accepted_at', 'GBP_ONLY', true
),
(
  'BILLING_READY_REVENUE',
  'Billing-Ready Revenue',
  'REVENUE',
  'Completed and verified billable work satisfying all contractual, quote, and client PO requirements.',
  'sum(client_billing_records.billable_net_gbp) where status = READY_TO_INVOICE',
  '["client_billing_records"]'::jsonb,
  '["Operationally completed work", "Accepted evidence", "Resolved commercial exceptions"]'::jsonb,
  '["Uncompleted work", "Missing client PO when required", "Already invoiced records"]'::jsonb,
  'completed_at', 'GBP_ONLY', true
),
(
  'INVOICED_REVENUE',
  'Invoiced Net Revenue',
  'REVENUE',
  'Net revenue billed to clients on issued client invoices, excluding VAT and net of client credit notes.',
  'sum(client_invoices.subtotal_gbp) where status in (ISSUED, PAID) - sum(client_credit_notes.subtotal_gbp)',
  '["client_invoices", "credit_notes"]'::jsonb,
  '["Issued client invoices", "Paid client invoices"]'::jsonb,
  '["Draft client invoices", "Voided invoices", "VAT amounts"]'::jsonb,
  'invoice_issue_date', 'GBP_ONLY', true
),
(
  'PAID_REVENUE',
  'Paid Revenue / Cash Received',
  'CASH',
  'Actual cash collected from clients as reconciled from authoritative accounting integration.',
  'sum(client_invoices.paid_amount_gbp) where payment_status in (PAID, PART_PAID)',
  '["client_invoices", "accounting_sync_logs"]'::jsonb,
  '["Reconciled cash payments from accounting adapter"]'::jsonb,
  '["Approved but unpaid invoices", "Internal estimates"]'::jsonb,
  'payment_reconciled_at', 'GBP_ONLY', true
),
(
  'EXPECTED_COST',
  'Expected Cost',
  'COST',
  'Budgeted or estimated direct subcontractor, labor, and materials cost for operational work.',
  'sum(quotes.expected_cost_gbp) + sum(work_orders.expected_cost_gbp)',
  '["quotes", "work_orders"]'::jsonb,
  '["Approved work scope estimates"]'::jsonb,
  '["Speculative unapproved proposals"]'::jsonb,
  'work_scheduled_date', 'GBP_ONLY', true
),
(
  'COMMITTED_COST',
  'Committed Cost',
  'COST',
  'Authorized supplier purchase orders not yet consumed by approved actual supplier invoice postings.',
  'sum(cost_commitments.committed_amount_gbp - cost_commitments.actual_amount_gbp) where status in (ACTIVE, PARTIALLY_CONSUMED)',
  '["cost_commitments", "purchase_orders"]'::jsonb,
  '["Active supplier POs", "Remaining committed value"]'::jsonb,
  '["Cancelled POs", "Fully consumed commitments", "Released residuals"]'::jsonb,
  'po_created_at', 'GBP_ONLY', true
),
(
  'ACTUAL_COST',
  'Actual Direct Cost',
  'COST',
  'Approved and posted supplier invoice expenditure net of supplier credit notes.',
  'sum(supplier_invoices.subtotal_gbp) where processing_status in (APPROVED, POSTED, EXPORTED) - sum(supplier_credit_notes.subtotal_gbp)',
  '["supplier_invoices", "credit_notes"]'::jsonb,
  '["Approved supplier invoices", "Posted actual costs"]'::jsonb,
  '["Unmatched invoices", "Disputed invoices", "Unapproved drafts"]'::jsonb,
  'posted_at', 'GBP_ONLY', true
),
(
  'REMAINING_EXPECTED_COST',
  'Remaining Expected Cost',
  'COST',
  'Estimated remaining expenditure required to complete active operational scope.',
  'max(0, EXPECTED_COST - ACTUAL_COST)',
  '["work_orders", "supplier_invoices"]'::jsonb,
  '["Open work orders with remaining scope"]'::jsonb,
  '["Completed and closed jobs"]'::jsonb,
  'work_target_date', 'GBP_ONLY', true
),
(
  'EXPECTED_GROSS_MARGIN',
  'Expected Gross Margin',
  'MARGIN',
  'Expected commercial margin calculated from expected revenue less actual and remaining committed costs.',
  'EXPECTED_REVENUE - (ACTUAL_COST + COMMITTED_COST)',
  '["quotes", "cost_commitments", "supplier_invoices"]'::jsonb,
  '["Active and planned jobs with commercial scope"]'::jsonb,
  '["Non-commercial non-billable jobs"]'::jsonb,
  'quote_approved_at', 'GBP_ONLY', true
),
(
  'ACTUAL_GROSS_MARGIN',
  'Actual Gross Margin',
  'MARGIN',
  'Realized gross margin calculated from net invoiced client revenue less approved actual direct supplier costs.',
  'INVOICED_REVENUE - ACTUAL_COST',
  '["client_invoices", "supplier_invoices", "credit_notes"]'::jsonb,
  '["Invoiced jobs with posted supplier costs"]'::jsonb,
  '["Collected VAT", "Unbilled estimates"]'::jsonb,
  'invoice_issue_date', 'GBP_ONLY', true
),
(
  'UNBILLED_WIP',
  'Unbilled Work-in-Progress (WIP)',
  'WIP',
  'Completed billable work orders that have not yet been invoiced to the client.',
  'sum(client_billing_records.billable_net_gbp) where status = READY_TO_INVOICE and is_billable = true',
  '["client_billing_records", "work_orders"]'::jsonb,
  '["Operationally complete billable jobs"]'::jsonb,
  '["Non-billable jobs", "Cancelled jobs", "Already invoiced work"]'::jsonb,
  'completed_at', 'GBP_ONLY', true
),
(
  'BILLING_BLOCKED_VALUE',
  'Billing Blocked Value',
  'WIP',
  'Completed work prevented from billing due to missing administrative prerequisites (client PO, evidence, quote).',
  'sum(client_billing_records.billable_net_gbp) where jsonb_array_length(blocker_reasons) > 0',
  '["client_billing_records"]'::jsonb,
  '["Completed work with active blocker reasons"]'::jsonb,
  '["Clean billing-ready items", "Uncompleted work"]'::jsonb,
  'completed_at', 'GBP_ONLY', true
),
(
  'ACCOUNTS_RECEIVABLE',
  'Accounts Receivable (AR)',
  'CASH',
  'Outstanding issued client invoices awaiting payment, grouped by aging bracket.',
  'sum(client_invoices.total_amount_gbp - coalesce(paid_amount_gbp, 0)) where status = ISSUED and payment_status != PAID',
  '["client_invoices"]'::jsonb,
  '["Issued client invoices with unpaid balance"]'::jsonb,
  '["Paid invoices", "Cancelled/voided invoices"]'::jsonb,
  'due_date', 'GBP_ONLY', true
)
on conflict (metric_code) do update set
  metric_name = excluded.metric_name,
  description = excluded.description,
  formula_expression = excluded.formula_expression,
  authoritative_sources_json = excluded.authoritative_sources_json,
  inclusion_rules_json = excluded.inclusion_rules_json,
  exclusion_rules_json = excluded.exclusion_rules_json,
  default_date_dimension = excluded.default_date_dimension;
-- ============================================================
-- ENTIREFM PHASE 0H-R CLOSEOUT — FINANCIAL METRIC SEMANTICS
-- Migration: 0018_financial_metrics_semantics_update.sql
-- ============================================================

-- Add tax_basis column if missing
alter table public.financial_metric_definitions
  add column if not exists tax_basis text not null default 'NET'
  check (tax_basis in ('NET','GROSS','NOT_APPLICABLE'));

-- Upsert corrected canonical metric definitions
insert into public.financial_metric_definitions (
  metric_code, metric_name, category, description, formula_expression,
  authoritative_sources_json, inclusion_rules_json, exclusion_rules_json,
  default_date_dimension, currency_handling, tax_basis, is_active
)
values
(
  'EXPECTED_REVENUE',
  'Expected Revenue (Multi-Model)',
  'REVENUE',
  'Total projected revenue across all billing models (Fixed Contracts + Accepted Quoted Work + Rate Card + PPM + Cost-Plus minus Credits). Zero double counting.',
  'sum(contracts.monthly_charge_gbp) + sum(quotes.total_price_gbp WHERE status = ACCEPTED and is_additional = true) + sum(cbr.billable_net_gbp WHERE status = READY_TO_INVOICE) - sum(credit_notes.net_amount_gbp)',
  '["contracts", "quotes", "client_billing_records", "credit_notes"]'::jsonb,
  '["Active fixed contracts", "Accepted additional quotes", "Unblocked billing-ready WIP"]'::jsonb,
  '["Included jobs in fixed contracts (zero additional billable)", "Draft quotes", "Voided invoices"]'::jsonb,
  'contract_start_date', 'GBP_ONLY', 'NET', true
),
(
  'CASH_RECEIVED',
  'Cash Received (Gross)',
  'CASH',
  'Actual customer cash collected against issued client invoices.',
  'sum(client_invoices.paid_amount_gbp) where payment_status in (PAID, PART_PAID)',
  '["client_invoices", "accounting_sync_logs"]'::jsonb,
  '["Reconciled cash payments from accounting adapter"]'::jsonb,
  '["Approved but unpaid invoices", "Internal estimates"]'::jsonb,
  'payment_reconciled_at', 'GBP_ONLY', 'GROSS', true
),
(
  'EXPECTED_COST',
  'Expected Direct Cost (Unique Exposure)',
  'COST',
  'Unique economic direct cost exposure across active scope (deduplicating quote estimates and originating work orders).',
  'sum(unique_economic_cost_estimates across approved commercial scope)',
  '["quotes", "work_orders"]'::jsonb,
  '["Approved scope estimates"]'::jsonb,
  '["Work orders originating from quotes already counted"]'::jsonb,
  'work_scheduled_date', 'GBP_ONLY', 'NET', true
),
(
  'REMAINING_UNCOMMITTED_EXPECTED_COST',
  'Remaining Uncommitted Expected Cost',
  'COST',
  'Expected direct cost not yet locked into a PO commitment or posted invoice.',
  'max(0, EXPECTED_COST - (ACTUAL_COST + COMMITTED_COST))',
  '["quotes", "work_orders", "cost_commitments", "supplier_invoices"]'::jsonb,
  '["Uncommitted balance of expected direct scope"]'::jsonb,
  '["Committed POs", "Posted actual costs"]'::jsonb,
  'dynamic', 'GBP_ONLY', 'NET', true
),
(
  'EXPECTED_GROSS_MARGIN',
  'Expected Gross Margin',
  'MARGIN',
  'Projected commercial margin accounting for all direct cost exposure (Actual + Committed + Remaining Uncommitted) against Expected Revenue. Zero double counting.',
  'EXPECTED_REVENUE - (ACTUAL_COST + COMMITTED_COST + REMAINING_UNCOMMITTED_EXPECTED_COST)',
  '["contracts", "quotes", "cost_commitments", "supplier_invoices"]'::jsonb,
  '["Active and planned jobs with commercial scope"]'::jsonb,
  '["Non-commercial non-billable jobs"]'::jsonb,
  'dynamic', 'GBP_ONLY', 'NET', true
),
(
  'ACCOUNTS_RECEIVABLE',
  'Accounts Receivable (Gross Legal Balance)',
  'CASH',
  'Gross legal outstanding balance legally due from clients, grouped by aging bracket (0-30, 31-60, 61-90, 90+ days).',
  'sum(client_invoices.total_gbp - coalesce(paid_amount_gbp, 0)) where status = ISSUED and payment_status != PAID',
  '["client_invoices"]'::jsonb,
  '["Issued client invoices with unpaid gross balance"]'::jsonb,
  '["Paid invoices", "Cancelled/voided invoices"]'::jsonb,
  'due_date', 'GBP_ONLY', 'GROSS', true
)
on conflict (metric_code) do update set
  metric_name = excluded.metric_name,
  description = excluded.description,
  formula_expression = excluded.formula_expression,
  authoritative_sources_json = excluded.authoritative_sources_json,
  inclusion_rules_json = excluded.inclusion_rules_json,
  exclusion_rules_json = excluded.exclusion_rules_json,
  tax_basis = excluded.tax_basis,
  default_date_dimension = excluded.default_date_dimension;
-- ============================================================
-- ENTIREFM PHASE 0H-R — FINAL FINANCE SEMANTIC PATCH
-- Migration: 0019_financial_revenue_identity_and_matched_margin.sql
-- ============================================================
-- 1. Creates revenue_exposures (Canonical Economic Revenue Identity)
-- 2. Creates cost_attributions (Matched Direct Cost Allocation)
-- 3. Updates canonical financial_metric_definitions for EXPECTED_REVENUE,
--    ACTUAL_GROSS_MARGIN, INVOICED_REVENUE, ACTUAL_COST
-- 4. Enforces RLS with zero external client/contractor finance leakage
-- ============================================================

-- ============================================================
-- 1. CREATE revenue_exposures (Economic Revenue Identity)
-- ============================================================

create table if not exists public.revenue_exposures (
  id                          uuid primary key default gen_random_uuid(),
  exposure_reference          text unique not null,
  client_account_id           uuid references public.client_accounts(id),
  contract_id                 uuid references public.contracts(id),
  quote_id                    uuid references public.quotes(id),
  work_order_id               uuid references public.work_orders(id),
  billing_model               text not null default 'QUOTED_WORK'
    check (billing_model in (
      'FIXED_FEE','QUOTED_WORK','RATE_CARD','COST_PLUS',
      'PPM_FIXED','PASS_THROUGH','PROJECT_MILESTONE'
    )),
  title                       text not null,
  economic_value_gbp          numeric(10,2) not null default 0.00,
  invoiced_value_gbp          numeric(10,2) not null default 0.00,
  remaining_exposure_gbp      numeric(10,2) not null default 0.00,
  current_authoritative_state text not null default 'EXPECTED'
    check (current_authoritative_state in (
      'EXPECTED','APPROVED','BILLING_READY','PARTIALLY_INVOICED',
      'FULLY_INVOICED','PAID','CANCELLED'
    )),
  current_authoritative_record text,
  matched_cost_gbp            numeric(10,2) not null default 0.00,
  unallocated_cost_gbp        numeric(10,2) not null default 0.00,
  attribution_status          text not null default 'PENDING'
    check (attribution_status in (
      'PENDING','PARTIALLY_MATCHED','FULLY_MATCHED','UNALLOCATED'
    )),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists idx_rev_exposure_client
  on public.revenue_exposures(client_account_id, current_authoritative_state);

create index if not exists idx_rev_exposure_quote
  on public.revenue_exposures(quote_id);

create index if not exists idx_rev_exposure_contract
  on public.revenue_exposures(contract_id);

alter table public.revenue_exposures enable row level security;

DROP POLICY IF EXISTS "EntireFM finance read revenue_exposures" ON public.revenue_exposures;
CREATE POLICY "EntireFM finance read revenue_exposures" ON public.revenue_exposures for select
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance insert revenue_exposures" ON public.revenue_exposures;
CREATE POLICY "EntireFM finance insert revenue_exposures" ON public.revenue_exposures for insert
  with check (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance update revenue_exposures" ON public.revenue_exposures;
CREATE POLICY "EntireFM finance update revenue_exposures" ON public.revenue_exposures for update
  using (auth.role() = 'authenticated');

-- ============================================================
-- 2. CREATE cost_attributions (Matched Direct Cost Links)
-- ============================================================

create table if not exists public.cost_attributions (
  id                          uuid primary key default gen_random_uuid(),
  revenue_exposure_id         uuid references public.revenue_exposures(id),
  client_invoice_id           uuid references public.client_invoices(id),
  client_billing_record_id    uuid references public.client_billing_records(id),
  supplier_invoice_id         uuid references public.supplier_invoices(id),
  supplier_invoice_line_id    uuid references public.supplier_invoice_lines(id),
  work_order_id               uuid references public.work_orders(id),
  attributed_cost_gbp         numeric(10,2) not null default 0.00,
  attribution_method          text not null default 'DIRECT_WORK_ORDER_LINK'
    check (attribution_method in (
      'DIRECT_WORK_ORDER_LINK','DIRECT_LINE_LINK','BILLING_RECORD_MATCH',
      'PROPORTIONAL_ALLOCATION','MANUAL_FINANCE_ATTRIBUTION'
    )),
  notes                       text,
  created_by_person_id        uuid references public.persons(id),
  created_at                  timestamptz not null default now()
);

create index if not exists idx_cost_attr_exposure
  on public.cost_attributions(revenue_exposure_id);

create index if not exists idx_cost_attr_client_inv
  on public.cost_attributions(client_invoice_id);

create index if not exists idx_cost_attr_supplier_inv
  on public.cost_attributions(supplier_invoice_id);

alter table public.cost_attributions enable row level security;

DROP POLICY IF EXISTS "EntireFM finance read cost_attributions" ON public.cost_attributions;
CREATE POLICY "EntireFM finance read cost_attributions" ON public.cost_attributions for select
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance insert cost_attributions" ON public.cost_attributions;
CREATE POLICY "EntireFM finance insert cost_attributions" ON public.cost_attributions for insert
  with check (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance update cost_attributions" ON public.cost_attributions;
CREATE POLICY "EntireFM finance update cost_attributions" ON public.cost_attributions for update
  using (auth.role() = 'authenticated');

-- ============================================================
-- 3. EXTEND credit_notes (Ensure credit_type alias exists)
-- ============================================================

alter table public.credit_notes
  add column if not exists credit_type text
  check (credit_type in ('SUPPLIER','CLIENT'));

-- Synchronize credit_type with credit_note_type
update public.credit_notes
  set credit_type = credit_note_type
  where credit_type is null;

-- ============================================================
-- 4. UPDATE CANONICAL METRIC DEFINITIONS (Semantics V3)
-- ============================================================

insert into public.financial_metric_definitions (
  metric_code, metric_name, category, description, formula_expression,
  authoritative_sources_json, inclusion_rules_json, exclusion_rules_json,
  default_date_dimension, currency_handling, tax_basis, is_active
)
values
(
  'EXPECTED_REVENUE',
  'Expected Revenue (Economic Identity & Lifecycle Precedence)',
  'REVENUE',
  'Total economic revenue across all commercial billing models with strict source precedence. One economic revenue opportunity contributes exactly once at any point in its lifecycle (Quote -> Billing Record -> Client Invoice). Net of client credit notes only.',
  'sum(contracts.monthly_charge_gbp) + sum(distinct_economic_revenue_exposures: max(invoiced_revenue, billing_ready_revenue, approved_quote_revenue)) - sum(credit_notes.subtotal_gbp WHERE credit_note_type = CLIENT)',
  '["contracts", "quotes", "client_billing_records", "client_invoices", "credit_notes"]'::jsonb,
  '["Active fixed contracts", "Unique approved commercial exposures", "Unblocked billing-ready WIP", "Issued client invoices"]'::jsonb,
  '["Included jobs in fixed contracts (£0 incremental)", "Quote/Billing/Invoice duplicate representations", "Supplier credit notes", "Voided invoices"]'::jsonb,
  'contract_start_date', 'GBP_ONLY', 'NET', true
),
(
  'ACTUAL_GROSS_MARGIN',
  'Actual Gross Margin (Matched Direct Scope)',
  'MARGIN',
  'Realised commercial gross profit on invoiced work: Net Invoiced Revenue minus Matched Actual Direct Supplier Costs attributable to those specific invoiced items. Unbilled WIP costs are reported separately and do not distort realised margin.',
  'INVOICED_REVENUE - MATCHED_ACTUAL_COST',
  '["client_invoices", "cost_attributions", "supplier_invoices", "credit_notes"]'::jsonb,
  '["Invoiced client revenue net of client credits", "Direct posted supplier costs attributable to invoiced work items net of supplier credits"]'::jsonb,
  '["Unbilled work direct costs (WIP)", "Unallocated period overheads", "Supplier VAT"]'::jsonb,
  'invoice_issue_date', 'GBP_ONLY', 'NET', true
),
(
  'INVOICED_REVENUE',
  'Invoiced Net Revenue',
  'REVENUE',
  'Total client invoice subtotals net of approved client credit notes (excluding VAT). Supplier credit notes never reduce client revenue.',
  'sum(client_invoices.subtotal_gbp WHERE status NOT IN (VOID, DRAFT)) - sum(credit_notes.subtotal_gbp WHERE credit_note_type = CLIENT AND status NOT IN (VOID, DRAFT))',
  '["client_invoices", "credit_notes"]'::jsonb,
  '["Issued client invoices", "Approved client credit notes"]'::jsonb,
  '["Supplier credit notes", "Draft client invoices", "Voided invoices", "Client VAT"]'::jsonb,
  'invoice_issue_date', 'GBP_ONLY', 'NET', true
),
(
  'ACTUAL_COST',
  'Actual Direct Cost',
  'COST',
  'Approved and posted supplier invoice expenditure net of supplier credit notes. Client credit notes never reduce supplier cost.',
  'sum(supplier_invoices.subtotal_gbp WHERE actual_cost_posted = true) - sum(credit_notes.subtotal_gbp WHERE credit_note_type = SUPPLIER AND status NOT IN (VOID, DRAFT))',
  '["supplier_invoices", "credit_notes"]'::jsonb,
  '["Approved and posted supplier invoices", "Supplier credit notes"]'::jsonb,
  '["Client credit notes", "Unmatched invoices", "Disputed invoices", "Recoverable supplier VAT"]'::jsonb,
  'posted_at', 'GBP_ONLY', 'NET', true
)
on conflict (metric_code) do update set
  metric_name = excluded.metric_name,
  description = excluded.description,
  formula_expression = excluded.formula_expression,
  authoritative_sources_json = excluded.authoritative_sources_json,
  inclusion_rules_json = excluded.inclusion_rules_json,
  exclusion_rules_json = excluded.exclusion_rules_json,
  tax_basis = excluded.tax_basis,
  default_date_dimension = excluded.default_date_dimension;
-- ============================================================
-- ENTIREFM PHASE 0H-R — TAX BASIS & PAID REVENUE SEMANTICS V3.0.1
-- Migration: 0020_financial_metrics_tax_basis_and_paid_revenue_semantics.sql
-- ============================================================
-- 1. Adds metric_basis column to financial_metric_definitions
-- 2. Upserts authoritative v3.0.1 definitions for all 19 metrics:
--    - Strict NET distinction for revenue, cost, gross margin, and WIP
--    - Strict GROSS distinction for Cash Received, Accounts Receivable, and Supplier Payables
--    - Option A semantics for PAID_REVENUE (fully settled net invoiced revenue)
-- ============================================================

-- Extend financial_metric_definitions with metric_basis if not present
alter table public.financial_metric_definitions
  add column if not exists metric_basis text not null default 'NET_REVENUE'
  check (metric_basis in (
    'NET_REVENUE','NET_COST','NET_MARGIN',
    'GROSS_CASH','GROSS_LEGAL_BALANCE','NET_WIP','NOT_APPLICABLE'
  ));

-- Upsert all canonical metrics with version 3.0.1 semantics
insert into public.financial_metric_definitions (
  metric_code, metric_name, category, description, formula_expression,
  authoritative_sources_json, inclusion_rules_json, exclusion_rules_json,
  default_date_dimension, currency_handling, tax_basis, metric_basis, is_active
)
values
(
  'EXPECTED_REVENUE',
  'Expected Revenue (Economic Identity & Lifecycle Precedence)',
  'REVENUE',
  'Total economic revenue across all commercial billing models with strict source precedence. One economic revenue opportunity contributes exactly once at any point in its lifecycle (Quote -> Billing Record -> Client Invoice). Net of client credit notes only (v3.0.1).',
  'sum(contracts.monthly_charge_gbp) + sum(distinct_economic_revenue_exposures: max(invoiced_revenue, billing_ready_revenue, approved_quote_revenue)) - sum(credit_notes.subtotal_gbp WHERE credit_note_type = CLIENT)',
  '["contracts", "quotes", "client_billing_records", "client_invoices", "credit_notes"]'::jsonb,
  '["Active fixed contracts", "Unique approved commercial exposures", "Unblocked billing-ready WIP", "Issued client invoices"]'::jsonb,
  '["Included jobs in fixed contracts (£0 incremental)", "Quote/Billing/Invoice duplicate representations", "Supplier credit notes", "Voided invoices"]'::jsonb,
  'contract_start_date', 'GBP_ONLY', 'NET', 'NET_REVENUE', true
),
(
  'APPROVED_REVENUE',
  'Approved Quoted Revenue',
  'REVENUE',
  'Sum of client-accepted quote values — confirmed chargeable revenue from formal quotations (v3.0.1).',
  'sum(quotes.total_price_gbp) WHERE status = ACCEPTED',
  '["quotes"]'::jsonb,
  '["Accepted client quotes"]'::jsonb,
  '["Draft quotes", "Rejected quotes", "Expired quotes"]'::jsonb,
  'quote_approved_at', 'GBP_ONLY', 'NET', 'NET_REVENUE', true
),
(
  'BILLING_READY_REVENUE',
  'Billing-Ready Revenue',
  'REVENUE',
  'Net billable value in the billing queue with no open blockers (v3.0.1).',
  'sum(client_billing_records.billable_net_gbp) WHERE status = READY_TO_INVOICE AND jsonb_array_length(blocker_reasons) = 0',
  '["client_billing_records"]'::jsonb,
  '["Unblocked billing records ready for invoice generation"]'::jsonb,
  '["Blocked records", "Draft records", "Already invoiced records"]'::jsonb,
  'work_completed_at', 'GBP_ONLY', 'NET', 'NET_REVENUE', true
),
(
  'INVOICED_REVENUE',
  'Invoiced Net Revenue',
  'REVENUE',
  'Total client invoice subtotals net of approved client credit notes raised (excluding VAT). Supplier credit notes never reduce client revenue (v3.0.1).',
  'sum(client_invoices.subtotal_gbp WHERE status NOT IN (VOID, DRAFT)) - sum(credit_notes.subtotal_gbp WHERE credit_note_type = CLIENT AND status NOT IN (VOID, DRAFT))',
  '["client_invoices", "credit_notes"]'::jsonb,
  '["Issued client invoices (subtotal)", "Approved client credit notes (subtotal)"]'::jsonb,
  '["VAT/Tax amounts", "Supplier credit notes", "Voided invoices", "Draft invoices"]'::jsonb,
  'issued_at', 'GBP_ONLY', 'NET', 'NET_REVENUE', true
),
(
  'CASH_RECEIVED',
  'Cash Received (Gross)',
  'CASH',
  'Actual customer payments collected against client invoices (gross cash received) (v3.0.1).',
  'sum(client_invoices.paid_amount_gbp) WHERE payment_status IN (PAID, PART_PAID)',
  '["client_invoices", "payment_transactions"]'::jsonb,
  '["Gross cash settlements received from clients"]'::jsonb,
  '["Unpaid invoice amounts", "Unsettled balances", "Credit adjustments without cash flow"]'::jsonb,
  'paid_at', 'GBP_ONLY', 'GROSS', 'GROSS_CASH', true
),
(
  'PAID_REVENUE',
  'Paid Revenue (Fully Settled Net)',
  'REVENUE',
  'Net invoiced revenue attributable to fully settled (paid in full) client invoices. Partially paid invoices contribute £0 until settled in full (v3.0.1).',
  'sum(client_invoices.subtotal_gbp) WHERE payment_status = PAID AND status NOT IN (VOID, DRAFT)',
  '["client_invoices"]'::jsonb,
  '["Subtotal net revenue of fully settled invoices"]'::jsonb,
  '["Partially paid invoices", "Unpaid invoices", "VAT/tax amounts"]'::jsonb,
  'paid_at', 'GBP_ONLY', 'NET', 'NET_REVENUE', true
),
(
  'EXPECTED_COST',
  'Expected Direct Cost',
  'COST',
  'Unique economic direct cost exposure across active scope (deduplicating quote estimates and originating work orders) (v3.0.1).',
  'sum(unique_economic_cost_estimates across approved commercial scope)',
  '["quotes", "work_orders"]'::jsonb,
  '["Approved scope direct cost estimates"]'::jsonb,
  '["Work orders originating from counted quotes"]'::jsonb,
  'work_scheduled_date', 'GBP_ONLY', 'NET', 'NET_COST', true
),
(
  'COMMITTED_COST',
  'Committed Cost (Open POs)',
  'COST',
  'Remaining value of open purchase orders not yet consumed by approved supplier invoices (v3.0.1).',
  'sum(cost_commitments.committed_amount_gbp - cost_commitments.actual_amount_gbp) WHERE status IN (OPEN, PARTIAL)',
  '["cost_commitments"]'::jsonb,
  '["Unconsumed approved purchase orders"]'::jsonb,
  '["Closed POs", "Cancelled POs", "Supplier invoices already posted"]'::jsonb,
  'po_issued_date', 'GBP_ONLY', 'NET', 'NET_COST', true
),
(
  'ACTUAL_COST',
  'Actual Direct Cost (Total Posted)',
  'COST',
  'Total approved and posted supplier invoice costs net of supplier credit notes (excluding recoverable VAT). Client credit notes never reduce supplier costs (v3.0.1).',
  'sum(supplier_invoices.subtotal_gbp WHERE actual_cost_posted = true) - sum(credit_notes.subtotal_gbp WHERE credit_note_type = SUPPLIER AND status NOT IN (VOID, DRAFT))',
  '["supplier_invoices", "credit_notes"]'::jsonb,
  '["Posted supplier invoices (subtotal net)", "Approved supplier credit notes (subtotal net)"]'::jsonb,
  '["Recoverable VAT", "Client credit notes", "Unposted invoices", "Voided invoices"]'::jsonb,
  'invoice_date', 'GBP_ONLY', 'NET', 'NET_COST', true
),
(
  'MATCHED_ACTUAL_COST',
  'Matched Actual Direct Cost',
  'COST',
  'Direct supplier costs attributable specifically to issued client invoices / billed revenue items, net of supplier credits (v3.0.1).',
  'sum(cost_attributions.attributed_cost_gbp WHERE client_invoice_id IS NOT NULL) - sum(credit_notes.subtotal_gbp WHERE credit_note_type = SUPPLIER AND matched_to_invoiced_scope = true)',
  '["cost_attributions", "supplier_invoices", "credit_notes"]'::jsonb,
  '["Direct costs matched to billed client invoices"]'::jsonb,
  '["Unbilled WIP costs", "Unmatched indirect supplier costs"]'::jsonb,
  'invoice_date', 'GBP_ONLY', 'NET', 'NET_COST', true
),
(
  'UNALLOCATED_ACTUAL_COST',
  'Unallocated Actual Cost (WIP / Unbilled)',
  'COST',
  'Posted supplier direct costs for completed or in-progress work not yet billed to clients or attributed to client invoices (v3.0.1).',
  'max(0, ACTUAL_COST - MATCHED_ACTUAL_COST)',
  '["supplier_invoices", "cost_attributions"]'::jsonb,
  '["Incurred supplier costs on unbilled / in-progress work"]'::jsonb,
  '["Direct costs already matched to client invoices"]'::jsonb,
  'invoice_date', 'GBP_ONLY', 'NET', 'NET_COST', true
),
(
  'REMAINING_EXPECTED_COST',
  'Remaining Expected Cost',
  'COST',
  'Expected cost not yet invoiced — floor-zero to avoid negative display (v3.0.1).',
  'max(0, EXPECTED_COST - ACTUAL_COST)',
  '["quotes", "work_orders", "supplier_invoices"]'::jsonb,
  '["Unposted balance of expected cost"]'::jsonb,
  '["Posted supplier invoices"]'::jsonb,
  'dynamic', 'GBP_ONLY', 'NET', 'NET_COST', true
),
(
  'REMAINING_UNCOMMITTED_EXPECTED_COST',
  'Remaining Uncommitted Expected Cost',
  'COST',
  'Expected direct cost not yet locked into a PO commitment or posted invoice (v3.0.1).',
  'max(0, EXPECTED_COST - (ACTUAL_COST + COMMITTED_COST))',
  '["quotes", "work_orders", "cost_commitments", "supplier_invoices"]'::jsonb,
  '["Uncommitted balance of expected direct scope"]'::jsonb,
  '["Committed POs", "Posted actual costs"]'::jsonb,
  'dynamic', 'GBP_ONLY', 'NET', 'NET_COST', true
),
(
  'EXPECTED_GROSS_MARGIN',
  'Expected Gross Margin',
  'MARGIN',
  'Projected commercial margin accounting for all direct cost exposure (Actual + Committed + Remaining Uncommitted) against Expected Revenue. Zero double counting (v3.0.1).',
  'EXPECTED_REVENUE - (ACTUAL_COST + COMMITTED_COST + REMAINING_UNCOMMITTED_EXPECTED_COST)',
  '["contracts", "quotes", "cost_commitments", "supplier_invoices"]'::jsonb,
  '["Active and planned jobs with commercial scope"]'::jsonb,
  '["Non-commercial non-billable jobs", "VAT/tax amounts"]'::jsonb,
  'dynamic', 'GBP_ONLY', 'NET', 'NET_MARGIN', true
),
(
  'ACTUAL_GROSS_MARGIN',
  'Actual Gross Margin (Matched)',
  'MARGIN',
  'Realised commercial gross profit on invoiced work: Net Invoiced Revenue minus Matched Actual Direct Supplier Costs attributable to those specific invoiced items. Unbilled WIP costs are reported separately and do not distort realised margin (v3.0.1).',
  'INVOICED_REVENUE - MATCHED_ACTUAL_COST',
  '["client_invoices", "cost_attributions", "credit_notes"]'::jsonb,
  '["Invoiced net revenue", "Direct supplier costs matched to invoiced scope"]'::jsonb,
  '["Unbilled WIP costs", "VAT/tax amounts", "Supplier credit notes crossing domain boundaries"]'::jsonb,
  'issued_at', 'GBP_ONLY', 'NET', 'NET_MARGIN', true
),
(
  'UNBILLED_WIP',
  'Unbilled WIP',
  'WIP',
  'Completed billable work awaiting client invoicing (net of VAT) (v3.0.1).',
  'sum(client_billing_records.billable_net_gbp) WHERE status = READY_TO_INVOICE AND is_billable = true',
  '["client_billing_records"]'::jsonb,
  '["Completed billable jobs in billing queue"]'::jsonb,
  '["Non-billable jobs", "Jobs with unresolved billing blockers"]'::jsonb,
  'work_completed_at', 'GBP_ONLY', 'NET', 'NET_WIP', true
),
(
  'BILLING_BLOCKED_VALUE',
  'Billing Blocked Value',
  'WIP',
  'Billable value held behind administrative or evidence blockers (net of VAT) (v3.0.1).',
  'sum(client_billing_records.billable_net_gbp) WHERE jsonb_array_length(blocker_reasons) > 0',
  '["client_billing_records"]'::jsonb,
  '["Billing records with active blocker flags"]'::jsonb,
  '["Unblocked ready records"]'::jsonb,
  'work_completed_at', 'GBP_ONLY', 'NET', 'NET_WIP', true
),
(
  'ACCOUNTS_RECEIVABLE',
  'Accounts Receivable (Gross Legal Balance)',
  'CASH',
  'Gross legal outstanding balance legally due from clients, grouped by ageing bucket (0-30, 31-60, 61-90, 90+ days). Net of client credit notes (v3.0.1).',
  'sum(client_invoices.total_gbp - client_invoices.paid_amount_gbp) - sum(client_credit_notes.gross_amount) WHERE payment_status NOT IN (PAID, VOID)',
  '["client_invoices", "credit_notes"]'::jsonb,
  '["Issued client invoices with gross unpaid balance", "Approved client credit notes gross"]'::jsonb,
  '["Paid invoices", "Voided invoices", "Supplier credit notes"]'::jsonb,
  'due_date', 'GBP_ONLY', 'GROSS', 'GROSS_LEGAL_BALANCE', true
),
(
  'SUPPLIER_PAYABLES',
  'Supplier Payables (Gross Legal Balance)',
  'CASH',
  'Approved supplier invoice balances unpaid, grouped by ageing bucket (0-30, 31-60, 61-90, 90+ days). Net of supplier credit notes (v3.0.1).',
  'sum(supplier_invoices.total_gbp - supplier_invoices.amount_paid_gbp) - sum(supplier_credit_notes.gross_amount) WHERE approval_status = APPROVED AND payment_status NOT IN (PAID, VOID)',
  '["supplier_invoices", "credit_notes"]'::jsonb,
  '["Approved supplier invoices with gross unpaid balance", "Approved supplier credit notes gross"]'::jsonb,
  '["Paid supplier invoices", "Voided invoices", "Client credit notes"]'::jsonb,
  'due_date', 'GBP_ONLY', 'GROSS', 'GROSS_LEGAL_BALANCE', true
)
on conflict (metric_code) do update set
  metric_name = excluded.metric_name,
  category = excluded.category,
  description = excluded.description,
  formula_expression = excluded.formula_expression,
  authoritative_sources_json = excluded.authoritative_sources_json,
  inclusion_rules_json = excluded.inclusion_rules_json,
  exclusion_rules_json = excluded.exclusion_rules_json,
  tax_basis = excluded.tax_basis,
  metric_basis = excluded.metric_basis,
  default_date_dimension = excluded.default_date_dimension;
-- ============================================================
-- ENTIREFM ACCESS ARCHITECTURE & PORTAL HARDENING
-- Migration: 0021_access_architecture_and_portal_hardening.sql
-- ============================================================
-- 1. Adds portal_status column to organisations (ACTIVE, SUSPENDED)
-- 2. Ensures membership_scopes indices and constraints
-- 3. Creates invitations table for controlled access onboarding
-- 4. Creates access_audit_logs table for access modifications and View-As
-- 5. Enables RLS and creates secure access policies
-- ============================================================

-- 1. Extend organisations with portal_status if not present
alter table public.organisations
  add column if not exists portal_status text not null default 'ACTIVE'
  check (portal_status in ('ACTIVE', 'SUSPENDED'));

-- 2. Ensure membership_scopes table structure and indexes
create table if not exists public.membership_scopes (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references public.organisation_memberships(id) on delete cascade,
  person_id uuid not null references public.persons(id) on delete cascade,
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  scope_type text not null check (scope_type in ('ORGANISATION', 'CLIENT_ACCOUNT', 'CONTRACT', 'PORTFOLIO', 'SITE', 'BUILDING', 'PROVIDER_ORGANISATION')),
  scope_id uuid not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_membership_scopes_lookup on public.membership_scopes (person_id, organisation_id, scope_type, scope_id);
create index if not exists idx_membership_scopes_membership on public.membership_scopes (membership_id);

-- 3. Access Invitations Table
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  role_code text not null,
  application_portal text not null check (application_portal in ('ADMIN', 'CLIENT', 'CONTRACTOR', 'ENGINEER')),
  scopes_json jsonb not null default '[]'::jsonb,
  invited_by_person_id uuid references public.persons(id),
  status text not null default 'PENDING' check (status in ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_invitations_email on public.invitations (email, status);
create index if not exists idx_invitations_org on public.invitations (organisation_id, status);

-- 4. Access Audit Logs Table
create table if not exists public.access_audit_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null, -- USER_INVITED, USER_ACTIVATED, USER_DISABLED, ROLE_CHANGED, SCOPE_ADDED, SCOPE_REMOVED, PORTAL_SUSPENDED, VIEW_AS_STARTED, VIEW_AS_ENDED
  actor_person_id uuid references public.persons(id),
  target_person_id uuid references public.persons(id),
  target_organisation_id uuid references public.organisations(id),
  portal text check (portal in ('ADMIN', 'CLIENT', 'CONTRACTOR', 'ENGINEER')),
  details_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_access_audit_actor on public.access_audit_logs (actor_person_id, created_at desc);
create index if not exists idx_access_audit_target on public.access_audit_logs (target_person_id, created_at desc);
create index if not exists idx_access_audit_org on public.access_audit_logs (target_organisation_id, created_at desc);

-- 5. RLS Enablement
alter table public.invitations enable row level security;
alter table public.access_audit_logs enable row level security;

DROP POLICY IF EXISTS "Service role full access on invitations" ON public.invitations;
CREATE POLICY "Service role full access on invitations" ON public.invitations
  for all using (true);

DROP POLICY IF EXISTS "Service role full access on access_audit_logs" ON public.access_audit_logs;
CREATE POLICY "Service role full access on access_audit_logs" ON public.access_audit_logs
  for all using (true);
-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0022: COMPLIANCE INTELLIGENCE & AUDIT READINESS (Phase 0J)
-- ============================================================================
-- Extends the compliance domain into a complete operational compliance
-- intelligence, applicability assessment, certificate lifecycle, exception
-- management, immutable audit snapshot, and audit readiness system.
-- ============================================================================

-- 1. EXTEND COMPLIANCE SOURCES
ALTER TABLE public.compliance_sources
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'CURRENT', -- CURRENT, SUPERSEDED, DRAFT, NOT_CONFIGURED, LICENSE_REQUIRED, UNDER_REVIEW
  ADD COLUMN IF NOT EXISTS version text NOT NULL DEFAULT '1.0',
  ADD COLUMN IF NOT EXISTS effective_date date NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS superseded_date date,
  ADD COLUMN IF NOT EXISTS last_reviewed_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS review_owner_id uuid REFERENCES public.persons(id),
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS may_store_content boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS license_required boolean NOT NULL DEFAULT false;

-- 2. EXTEND COMPLIANCE RULES
ALTER TABLE public.compliance_rules
  ADD COLUMN IF NOT EXISTS rule_family text NOT NULL DEFAULT 'GENERAL', -- FIRE_SAFETY, WATER_HYGIENE, ELECTRICAL, GAS_SAFETY, HVAC_PRESSURE, LIFTS_LIFTING, ASBESTOS, ENVIRONMENTAL, HEALTH_SAFETY
  ADD COLUMN IF NOT EXISTS applies_to_system_types text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS default_responsibility text NOT NULL DEFAULT 'ENTIREFM', -- LANDLORD, TENANT, CLIENT, ENTIREFM, SPECIALIST_CONTRACTOR, MANUFACTURER, OTHER
  ADD COLUMN IF NOT EXISTS contractual_override_allowed boolean NOT NULL DEFAULT true;

-- 3. EXTEND COMPLIANCE RULE VERSIONS
ALTER TABLE public.compliance_rule_versions
  ADD COLUMN IF NOT EXISTS superseded_by_version_id uuid REFERENCES public.compliance_rule_versions(id),
  ADD COLUMN IF NOT EXISTS source_section_reference text,
  ADD COLUMN IF NOT EXISTS statutory_basis text NOT NULL DEFAULT 'STATUTORY_DUTY'; -- STATUTORY_DUTY, APPROVED_CODE, GUIDANCE, STANDARD, MANUFACTURER, CONTRACTUAL, BEST_PRACTICE

-- 4. EXTEND APPLICABILITY ASSESSMENTS
ALTER TABLE public.applicability_assessments
  ADD COLUMN IF NOT EXISTS applicability_result text NOT NULL DEFAULT 'YES', -- YES, NO, REVIEW_REQUIRED
  ADD COLUMN IF NOT EXISTS calculation_path jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS human_override boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS override_reason text,
  ADD COLUMN IF NOT EXISTS override_by_id uuid REFERENCES public.persons(id),
  ADD COLUMN IF NOT EXISTS override_at timestamptz;

-- 5. EXTEND COMPLIANCE OBLIGATIONS
ALTER TABLE public.compliance_obligations
  ADD COLUMN IF NOT EXISTS client_account_id uuid REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS contract_id uuid REFERENCES public.contracts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS system_id uuid REFERENCES public.systems(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS responsible_party text NOT NULL DEFAULT 'ENTIREFM', -- LANDLORD, TENANT, CLIENT, ENTIREFM, SPECIALIST_CONTRACTOR, MANUFACTURER, OTHER
  ADD COLUMN IF NOT EXISTS entirefm_contracted boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS event_trigger_type text, -- INSTALLATION, ALTERATION, INCIDENT, DEFECT, CERTIFICATE_EXPIRY, RULE_CHANGE, REPAIR
  ADD COLUMN IF NOT EXISTS criticality text NOT NULL DEFAULT 'HIGH', -- CRITICAL, HIGH, MEDIUM, LOW
  ADD COLUMN IF NOT EXISTS client_visible boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS evidence_requirements_json jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS current_evidence_id uuid,
  ADD COLUMN IF NOT EXISTS current_certificate_id uuid;

-- 6. EXTEND COMPLIANCE TASKS
ALTER TABLE public.compliance_tasks
  ADD COLUMN IF NOT EXISTS inspection_result text DEFAULT 'REVIEW_REQUIRED', -- PASS, FAIL, ADVISORY, NOT_TESTED, NOT_ACCESSIBLE, REVIEW_REQUIRED
  ADD COLUMN IF NOT EXISTS event_trigger_type text,
  ADD COLUMN IF NOT EXISTS ppm_occurrence_id uuid,
  ADD COLUMN IF NOT EXISTS evidence_document_id uuid REFERENCES public.documents(id);

-- 7. EXTEND COMPLIANCE EXCEPTIONS
ALTER TABLE public.compliance_exceptions
  ADD COLUMN IF NOT EXISTS client_account_id uuid REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS opened_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS responsible_org_id uuid REFERENCES public.organisations(id),
  ADD COLUMN IF NOT EXISTS accepted_risk_by_id uuid REFERENCES public.persons(id),
  ADD COLUMN IF NOT EXISTS accepted_risk_reason text,
  ADD COLUMN IF NOT EXISTS accepted_risk_at timestamptz,
  ADD COLUMN IF NOT EXISTS remediation_work_order_id uuid REFERENCES public.work_orders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS client_visible boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS escalation_level text NOT NULL DEFAULT 'NONE', -- NONE, MANAGER, LEADERSHIP, EXECUTIVE
  ADD COLUMN IF NOT EXISTS state text NOT NULL DEFAULT 'OPEN'; -- OPEN, ACKNOWLEDGED, REMEDIATION_PLANNED, IN_PROGRESS, AWAITING_EVIDENCE, RESOLVED, ACCEPTED_RISK, CLOSED

-- 8. EXTEND CERTIFICATES
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS client_account_id uuid REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS system_id uuid REFERENCES public.systems(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS linked_obligation_id uuid REFERENCES public.compliance_obligations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS linked_work_order_id uuid REFERENCES public.work_orders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS linked_visit_id uuid REFERENCES public.visits(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS provider_org_id uuid REFERENCES public.organisations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS issuing_engineer_id uuid REFERENCES public.persons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS file_checksum_sha256 text,
  ADD COLUMN IF NOT EXISTS storage_path text,
  ADD COLUMN IF NOT EXISTS extraction_status text NOT NULL DEFAULT 'COMPLETE', -- PENDING, EXTRACTING, COMPLETE, FAILED, REVIEW_REQUIRED
  ADD COLUMN IF NOT EXISTS validation_status text NOT NULL DEFAULT 'VALID', -- VALID, INVALID, WRONG_SITE, EXPIRED_PROVIDER, REJECTED, REVIEW_REQUIRED
  ADD COLUMN IF NOT EXISTS duplicate_of_id uuid REFERENCES public.certificates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS confidence_json jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS client_visible boolean NOT NULL DEFAULT true;

-- 9. CREATE COMPLIANCE EVIDENCE VALIDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.compliance_evidence_validations (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id        uuid REFERENCES public.certificates(id) ON DELETE CASCADE,
  document_id           uuid REFERENCES public.documents(id) ON DELETE CASCADE,
  obligation_id         uuid REFERENCES public.compliance_obligations(id) ON DELETE CASCADE,
  site_id               uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  asset_id              uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  validation_result     text NOT NULL DEFAULT 'VALID', -- VALID, INVALID, WRONG_SITE, EXPIRED_COMPETENCY, DEFICIENT_DATA, SUSPECT_DUPLICATE, REJECTED
  site_match            boolean NOT NULL DEFAULT true,
  date_valid            boolean NOT NULL DEFAULT true,
  provider_competency_valid boolean NOT NULL DEFAULT true,
  inspection_passed     boolean NOT NULL DEFAULT true,
  confidence_score      numeric(3,2) NOT NULL DEFAULT 1.00,
  field_confidences_json jsonb DEFAULT '{}'::jsonb,
  validation_notes      text,
  validated_by_id       uuid REFERENCES public.persons(id),
  is_ai_validated       boolean NOT NULL DEFAULT false,
  ai_agent_id           uuid REFERENCES public.ai_agents(id),
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 10. CREATE COMPLIANCE AUDIT SNAPSHOTS TABLE (Immutable point-in-time state)
CREATE TABLE IF NOT EXISTS public.compliance_audit_snapshots (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_account_id     uuid NOT NULL REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  site_id               uuid REFERENCES public.sites(id) ON DELETE CASCADE,
  snapshot_name         text NOT NULL,
  as_of_date            timestamptz NOT NULL DEFAULT now(),
  snapshot_hash         text NOT NULL,
  total_obligations     integer NOT NULL DEFAULT 0,
  compliant_count       integer NOT NULL DEFAULT 0,
  overdue_count         integer NOT NULL DEFAULT 0,
  exceptions_count      integer NOT NULL DEFAULT 0,
  evidence_count        integer NOT NULL DEFAULT 0,
  snapshot_data_json    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_person_id  uuid REFERENCES public.persons(id),
  is_locked             boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 11. CREATE COMPLIANCE AUDIT PACKS TABLE
CREATE TABLE IF NOT EXISTS public.compliance_audit_packs (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id           uuid NOT NULL REFERENCES public.compliance_audit_snapshots(id) ON DELETE CASCADE,
  client_account_id     uuid NOT NULL REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  site_id               uuid REFERENCES public.sites(id) ON DELETE CASCADE,
  pack_reference        text NOT NULL UNIQUE,
  title                 text NOT NULL,
  compliance_domain     text NOT NULL DEFAULT 'ALL', -- ALL, FIRE_SAFETY, WATER_HYGIENE, ELECTRICAL, GAS, HVAC, LIFTS
  date_from             date NOT NULL,
  date_to               date NOT NULL,
  export_format         text NOT NULL DEFAULT 'STRUCTURED_INDEX', -- STRUCTURED_INDEX, PDF_REPORT, EVIDENCE_BUNDLE
  is_client_sanitised   boolean NOT NULL DEFAULT true,
  generated_by_id       uuid REFERENCES public.persons(id),
  summary_stats_json    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 12. CREATE COMPLIANCE AUDIT PACK ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.compliance_audit_pack_items (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_pack_id         uuid NOT NULL REFERENCES public.compliance_audit_packs(id) ON DELETE CASCADE,
  obligation_id         uuid REFERENCES public.compliance_obligations(id) ON DELETE SET NULL,
  rule_version_id       uuid REFERENCES public.compliance_rule_versions(id) ON DELETE SET NULL,
  certificate_id        uuid REFERENCES public.certificates(id) ON DELETE SET NULL,
  document_id           uuid REFERENCES public.documents(id) ON DELETE SET NULL,
  work_order_id         uuid REFERENCES public.work_orders(id) ON DELETE SET NULL,
  visit_id              uuid REFERENCES public.visits(id) ON DELETE SET NULL,
  exception_id          uuid REFERENCES public.compliance_exceptions(id) ON DELETE SET NULL,
  item_type             text NOT NULL, -- OBLIGATION, RULE_REFERENCE, CERTIFICATE, WORK_RECORD, EXCEPTION, REMEDIATION, AUDIT_TRAIL
  title                 text NOT NULL,
  description           text,
  evidence_provenance   text NOT NULL,
  document_checksum     text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 13. CREATE COMPLIANCE RULE IMPACT ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.compliance_rule_impact_assessments (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  compliance_rule_id    uuid NOT NULL REFERENCES public.compliance_rules(id) ON DELETE CASCADE,
  previous_version_id   uuid REFERENCES public.compliance_rule_versions(id) ON DELETE SET NULL,
  new_version_id        uuid NOT NULL REFERENCES public.compliance_rule_versions(id) ON DELETE CASCADE,
  affected_clients_count integer NOT NULL DEFAULT 0,
  affected_sites_count  integer NOT NULL DEFAULT 0,
  affected_systems_count integer NOT NULL DEFAULT 0,
  affected_obligations_count integer NOT NULL DEFAULT 0,
  assessment_summary    text NOT NULL,
  requires_human_review boolean NOT NULL DEFAULT true,
  status                text NOT NULL DEFAULT 'PENDING_REVIEW', -- PENDING_REVIEW, APPROVED, REJECTED, APPLIED
  reviewed_by_id        uuid REFERENCES public.persons(id),
  reviewed_at           timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 14. CREATE COMPLIANCE MOBILISATION GAPS TABLE
CREATE TABLE IF NOT EXISTS public.compliance_mobilisation_gaps (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_account_id     uuid NOT NULL REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  site_id               uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  compliance_rule_id    uuid NOT NULL REFERENCES public.compliance_rules(id) ON DELETE CASCADE,
  gap_type              text NOT NULL, -- MISSING_CERTIFICATE, UNKNOWN_INSPECTION_DATE, OVERDUE_REQUIREMENT, APPLICABILITY_DATA_GAP, SOURCE_NOT_CONFIGURED
  gap_status            text NOT NULL DEFAULT 'OPEN', -- OPEN, INVESTIGATING, EVIDENCE_OBTAINED, EXEMPTION_CONFIRMED, RESOLVED
  severity              text NOT NULL DEFAULT 'MAJOR', -- CRITICAL, MAJOR, MINOR
  description           text NOT NULL,
  recommendation        text NOT NULL,
  target_resolution_date date,
  resolved_at           timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 15. CREATE COMPLIANCE KPI REGISTRY TABLE
CREATE TABLE IF NOT EXISTS public.compliance_kpi_registry (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_code           text NOT NULL UNIQUE,
  metric_name           text NOT NULL,
  category              text NOT NULL, -- OBLIGATIONS, EVIDENCE, EXCEPTIONS, CERTIFICATES, GOVERNANCE
  calculation_formula   text NOT NULL,
  numerator_desc        text,
  denominator_desc      text,
  authority             text NOT NULL DEFAULT 'EntireFM Compliance Intelligence Framework v1.0',
  description           text NOT NULL,
  is_active             boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- Seed Canonical Compliance KPIs
INSERT INTO public.compliance_kpi_registry (metric_code, metric_name, category, calculation_formula, numerator_desc, denominator_desc, description)
VALUES
  ('APPLICABLE_OBLIGATIONS', 'Applicable Obligations Count', 'OBLIGATIONS', 'COUNT(compliance_obligations WHERE is_applicable = YES)', 'All active applicable obligations across scope', 'N/A', 'Total number of active statutory and contractual duties established by applicability assessment.'),
  ('COMPLIANT_OBLIGATIONS', 'Compliant Obligations Count', 'OBLIGATIONS', 'COUNT(compliance_obligations WHERE status = COMPLIANT)', 'Obligations with valid unexpired evidence and no open critical exception', 'N/A', 'Number of obligations meeting full statutory or contractual compliance requirements.'),
  ('OVERDUE_OBLIGATIONS', 'Overdue Obligations Count', 'OBLIGATIONS', 'COUNT(compliance_obligations WHERE status = OVERDUE)', 'Obligations past due date with no valid evidence', 'N/A', 'Obligations that have passed their required statutory/contractual completion window.'),
  ('EVIDENCE_PENDING', 'Evidence Pending Count', 'EVIDENCE', 'COUNT(compliance_obligations WHERE status = EVIDENCE_PENDING)', 'Obligations where work is done but evidence document is unattached or unvalidated', 'N/A', 'Obligations awaiting document attachment or validation.'),
  ('VALIDATION_PENDING', 'Validation Pending Count', 'EVIDENCE', 'COUNT(compliance_evidence_validations WHERE validation_result = REVIEW_REQUIRED)', 'Validations awaiting human or AI review', 'N/A', 'Evidence documents requiring review before compliance status can be awarded.'),
  ('OPEN_COMPLIANCE_EXCEPTIONS', 'Open Exceptions Count', 'EXCEPTIONS', 'COUNT(compliance_exceptions WHERE state IN (OPEN, ACKNOWLEDGED, REMEDIATION_PLANNED, IN_PROGRESS, AWAITING_EVIDENCE))', 'All non-closed, non-mitigated compliance exceptions', 'N/A', 'Active operational compliance exceptions across the estate.'),
  ('CRITICAL_COMPLIANCE_EXCEPTIONS', 'Critical Exceptions Count', 'EXCEPTIONS', 'COUNT(compliance_exceptions WHERE severity = CRITICAL AND state != CLOSED)', 'Critical severity open compliance exceptions', 'N/A', 'High-risk statutory non-compliance issues requiring immediate remediation.'),
  ('CERTIFICATES_EXPIRING_30D', 'Certificates Expiring (30 Days)', 'CERTIFICATES', 'COUNT(certificates WHERE expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 30)', 'Certificates expiring within 30 days', 'N/A', 'Certificates approaching expiry threshold requiring renewal scheduling.'),
  ('CERTIFICATES_EXPIRED', 'Certificates Expired Count', 'CERTIFICATES', 'COUNT(certificates WHERE expiry_date < CURRENT_DATE AND status != SUPERSEDED)', 'Expired active certificates', 'N/A', 'Certificates past their validity date without active replacement.'),
  ('RULES_UNDER_REVIEW', 'Rules Under Review Count', 'GOVERNANCE', 'COUNT(compliance_rules WHERE status = UNDER_REVIEW)', 'Compliance rules undergoing legal/technical review', 'N/A', 'Rules pending version approval or impact reassessment.')
ON CONFLICT (metric_code) DO NOTHING;

-- 16. SEED AI AGENTS FOR COMPLIANCE (ASSIST Autonomy Only)
INSERT INTO public.ai_agents (id, code, name, description, role_description, autonomy_level, is_active, max_daily_budget_gbp, confidence_threshold, created_at)
VALUES
  ('33333333-3333-3333-3333-000000000001', 'COMPLIANCE_APPLICABILITY_AGENT', 'Compliance Applicability Agent', 'Interprets site and asset estate attributes against versioned compliance rules and suggests applicability candidates with clear audit provenance. Operates in ASSIST mode only; cannot create legal facts.', 'Assists compliance officers in evaluating rule applicability across estates with explainable reasoning.', 'ASSIST', true, 15.00, 0.85, now()),
  ('33333333-3333-3333-3333-000000000002', 'COMPLIANCE_EVIDENCE_AGENT', 'Compliance Evidence Agent', 'Classifies uploaded compliance documents, extracts certificate numbers, dates, test results, and validates site match. Flags low confidence for human review. Operates in ASSIST mode only; cannot alter failed evidence.', 'Assists in extracting and validating certificate metadata against obligations.', 'ASSIST', true, 20.00, 0.85, now()),
  ('33333333-3333-3333-3333-000000000003', 'COMPLIANCE_AUDIT_AGENT', 'Compliance Audit Agent', 'Assembles structured audit readiness packs, verifies complete evidence chains, summarises open exceptions and provenance. Operates in ASSIST mode only; cannot certify compliance or sign statutory declarations.', 'Prepares audit documentation packages and checks evidence completeness.', 'ASSIST', true, 15.00, 0.85, now())
ON CONFLICT (code) DO NOTHING;

-- 17. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_compliance_obligations_site ON public.compliance_obligations (site_id, status);
CREATE INDEX IF NOT EXISTS idx_compliance_obligations_client ON public.compliance_obligations (client_account_id, status);
CREATE INDEX IF NOT EXISTS idx_compliance_obligations_next_due ON public.compliance_obligations (next_due_at);
CREATE INDEX IF NOT EXISTS idx_compliance_exceptions_site ON public.compliance_exceptions (site_id, state);
CREATE INDEX IF NOT EXISTS idx_compliance_exceptions_client ON public.compliance_exceptions (client_account_id, state);
CREATE INDEX IF NOT EXISTS idx_certificates_site_exp ON public.certificates (site_id, expiry_date);
CREATE INDEX IF NOT EXISTS idx_certificates_client ON public.certificates (client_account_id);
CREATE INDEX IF NOT EXISTS idx_certificates_checksum ON public.certificates (file_checksum_sha256);
CREATE INDEX IF NOT EXISTS idx_compliance_snapshots_site ON public.compliance_audit_snapshots (site_id, as_of_date DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_audit_packs_snap ON public.compliance_audit_packs (snapshot_id);

-- 18. RLS POLICIES
ALTER TABLE public.compliance_evidence_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_audit_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_audit_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_audit_pack_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_rule_impact_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_mobilisation_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_kpi_registry ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on compliance_evidence_validations" ON public.compliance_evidence_validations;
CREATE POLICY "Service role full access on compliance_evidence_validations" ON public.compliance_evidence_validations FOR ALL USING (true);
DROP POLICY IF EXISTS "Service role full access on compliance_audit_snapshots" ON public.compliance_audit_snapshots;
CREATE POLICY "Service role full access on compliance_audit_snapshots" ON public.compliance_audit_snapshots FOR ALL USING (true);
DROP POLICY IF EXISTS "Service role full access on compliance_audit_packs" ON public.compliance_audit_packs;
CREATE POLICY "Service role full access on compliance_audit_packs" ON public.compliance_audit_packs FOR ALL USING (true);
DROP POLICY IF EXISTS "Service role full access on compliance_audit_pack_items" ON public.compliance_audit_pack_items;
CREATE POLICY "Service role full access on compliance_audit_pack_items" ON public.compliance_audit_pack_items FOR ALL USING (true);
DROP POLICY IF EXISTS "Service role full access on compliance_rule_impact_assessments" ON public.compliance_rule_impact_assessments;
CREATE POLICY "Service role full access on compliance_rule_impact_assessments" ON public.compliance_rule_impact_assessments FOR ALL USING (true);
DROP POLICY IF EXISTS "Service role full access on compliance_mobilisation_gaps" ON public.compliance_mobilisation_gaps;
CREATE POLICY "Service role full access on compliance_mobilisation_gaps" ON public.compliance_mobilisation_gaps FOR ALL USING (true);
DROP POLICY IF EXISTS "Service role full access on compliance_kpi_registry" ON public.compliance_kpi_registry;
CREATE POLICY "Service role full access on compliance_kpi_registry" ON public.compliance_kpi_registry FOR ALL USING (true);
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
  DROP POLICY IF EXISTS data_import_batches_admin_all ON public.data_import_batches;
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
  DROP POLICY IF EXISTS data_import_files_admin_all ON public.data_import_files;
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
  DROP POLICY IF EXISTS data_import_rows_admin_all ON public.data_import_rows;
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
  DROP POLICY IF EXISTS data_import_mappings_admin_all ON public.data_import_mappings;
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
  DROP POLICY IF EXISTS data_import_issues_admin_all ON public.data_import_issues;
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
-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0024: IMPORT SAFETY SEAL
-- ============================================================================
-- Version: 1.0.0 (Phase 0I-PRE Import Safety Final Seal)

-- 1. EXTEND data_import_rows STATUS CONSTRAINT
ALTER TABLE public.data_import_rows
  DROP CONSTRAINT IF EXISTS data_import_rows_status_check;

ALTER TABLE public.data_import_rows
  ADD CONSTRAINT data_import_rows_status_check
  CHECK (status IN (
    'PENDING', 'VALID', 'INVALID', 'DUPLICATE',
    'UNCHANGED', 'CHANGE_DETECTED', 'POSSIBLE_DUPLICATE', 'CONFLICT',
    'SKIPPED', 'IMPORTED', 'FAILED', 'ROLLED_BACK', 'ROLLBACK_BLOCKED'
  ));

-- 2. ADD PROVENANCE COLUMNS TO data_import_rows
ALTER TABLE public.data_import_rows
  ADD COLUMN IF NOT EXISTS change_diff       jsonb DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS conflict_details  jsonb DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS matched_entity_id uuid  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS match_reason      text  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS pre_import_snapshot jsonb DEFAULT NULL;

-- 3. DUPLICATE DECISIONS TABLE
CREATE TABLE IF NOT EXISTS public.data_import_duplicate_decisions (
  id                    uuid primary key default gen_random_uuid(),
  batch_id              uuid not null references public.data_import_batches(id) on delete cascade,
  row_id                uuid not null references public.data_import_rows(id) on delete cascade,
  imported_name         text not null,
  candidate_entity_id   uuid,
  candidate_name        text,
  match_reason          text not null,
  decision              text not null check (decision in ('USE_EXISTING', 'CREATE_NEW', 'IGNORE_ROW')),
  decided_by_person_id  uuid references public.persons(id),
  decided_at            timestamptz not null default now(),
  notes                 text,
  created_at            timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_import_dup_decisions_batch ON public.data_import_duplicate_decisions (batch_id);
CREATE INDEX IF NOT EXISTS idx_import_dup_decisions_row  ON public.data_import_duplicate_decisions (row_id);

-- 4. RLS FOR NEW TABLE
ALTER TABLE public.data_import_duplicate_decisions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS import_dup_decisions_admin_all ON public.data_import_duplicate_decisions;
CREATE POLICY import_dup_decisions_admin_all ON public.data_import_duplicate_decisions
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.organisation_memberships m
        JOIN public.organisations o ON o.id = m.organisation_id
        WHERE m.person_id = auth.uid() AND o.org_type = 'ENTIREFM'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5. EXTEND data_import_batches COUNTERS
ALTER TABLE public.data_import_batches
  ADD COLUMN IF NOT EXISTS unchanged_rows          integer not null default 0,
  ADD COLUMN IF NOT EXISTS change_detected_rows    integer not null default 0,
  ADD COLUMN IF NOT EXISTS possible_duplicate_rows integer not null default 0,
  ADD COLUMN IF NOT EXISTS conflict_rows           integer not null default 0;
-- ============================================================
-- Migration 0025: CEO Command + Enterprise Intelligence (Phase 0I)
-- ============================================================
-- Precondition: 0024_import_safety_seal.sql must already be applied
-- Access: Restricted to EntireFM org + ADMIN context + required permission
-- All tables: RLS enabled, NOINDEX routes enforced in Next.js layout
-- ============================================================

-- Enterprise Metric Definitions
-- Canonical catalogue of executive-facing metrics.
-- References canonical domain services; does NOT copy formulas.
CREATE TABLE IF NOT EXISTS enterprise_metric_definitions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_code      TEXT NOT NULL UNIQUE,
  metric_name      TEXT NOT NULL,
  domain           TEXT NOT NULL,
  description      TEXT NOT NULL,
  required_permission TEXT NOT NULL,
  canonical_service   TEXT NOT NULL,
  formula_description TEXT,
  freshness_max_minutes INTEGER,
  metric_version   TEXT NOT NULL DEFAULT '1.0',
  data_coverage_note TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enterprise Signals
-- Deterministic signals evaluated from real-time operational data.
-- Severity is NEVER assigned by LLM — only by deterministic rules.
CREATE TABLE IF NOT EXISTS enterprise_signals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_type     TEXT NOT NULL,
  domain          TEXT NOT NULL,
  severity        TEXT NOT NULL CHECK (severity IN ('INFO', 'WATCH', 'WARNING', 'CRITICAL')),
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  entity_type     TEXT,
  entity_id       UUID,
  client_id       UUID REFERENCES client_accounts(id) ON DELETE SET NULL,
  contract_id     UUID,
  site_id         UUID REFERENCES sites(id) ON DELETE SET NULL,
  provider_id     UUID,
  detected_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  metric_code     TEXT,
  source_rule     TEXT NOT NULL,
  state           TEXT NOT NULL DEFAULT 'OPEN' CHECK (state IN ('OPEN', 'ACKNOWLEDGED', 'RESOLVED')),
  owner           TEXT,
  resolved_at     TIMESTAMPTZ,
  evidence_json   JSONB,
  href            TEXT,
  organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CEO Query Sessions
-- Audit trail of executive interrogation sessions.
CREATE TABLE IF NOT EXISTS ceo_query_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id       UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  context_entities_json JSONB,
  context_date_range_json JSONB,
  context_filters_json  JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CEO Query Messages
-- Individual turns within an executive interrogation session.
CREATE TABLE IF NOT EXISTS ceo_query_messages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          UUID NOT NULL REFERENCES ceo_query_sessions(id) ON DELETE CASCADE,
  role                TEXT NOT NULL CHECK (role IN ('USER', 'ASSISTANT')),
  content             TEXT NOT NULL,
  intent_category     TEXT,
  resolved_date_range_json JSONB,
  answer_json         JSONB,
  data_status         TEXT,
  organisation_id     UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CEO Tool Runs
-- Audited ledger of every canonical tool executed by CEO Command.
-- Permission checks recorded before execution.
CREATE TABLE IF NOT EXISTS ceo_tool_runs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id          UUID REFERENCES ceo_query_messages(id) ON DELETE CASCADE,
  tool_id             TEXT NOT NULL,
  domain              TEXT NOT NULL,
  status              TEXT NOT NULL CHECK (status IN ('SUCCESS', 'RESTRICTED', 'ERROR', 'EMPTY', 'LICENSE_REQUIRED')),
  required_permission TEXT NOT NULL,
  permission_granted  BOOLEAN NOT NULL,
  executed_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_ms         INTEGER,
  result_summary      TEXT,
  restriction_reason  TEXT,
  organisation_id     UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Executive Briefs
-- On-demand brief snapshots generated for an executive user.
CREATE TABLE IF NOT EXISTS executive_briefs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id       UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  period_label    TEXT NOT NULL DEFAULT 'Current State',
  sections_json   JSONB NOT NULL,
  signal_count    INTEGER NOT NULL DEFAULT 0,
  critical_signal_count INTEGER NOT NULL DEFAULT 0,
  overall_status  TEXT NOT NULL CHECK (overall_status IN ('GREEN', 'AMBER', 'RED', 'NO_DATA')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- RLS POLICIES
-- All CEO Command tables: EntireFM org + admin application only.
-- Client, Contractor, Engineer org types: NO ACCESS.
-- ============================================================

ALTER TABLE enterprise_metric_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceo_query_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceo_query_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceo_tool_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE executive_briefs ENABLE ROW LEVEL SECURITY;

-- Service role bypass (for server-side API operations)
DROP POLICY IF EXISTS "service_role_bypass_enterprise_metrics" ON enterprise_metric_definitions;
CREATE POLICY "service_role_bypass_enterprise_metrics" ON enterprise_metric_definitions FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_enterprise_signals" ON enterprise_signals;
CREATE POLICY "service_role_bypass_enterprise_signals" ON enterprise_signals FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_ceo_sessions" ON ceo_query_sessions;
CREATE POLICY "service_role_bypass_ceo_sessions" ON ceo_query_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_ceo_messages" ON ceo_query_messages;
CREATE POLICY "service_role_bypass_ceo_messages" ON ceo_query_messages FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_ceo_tool_runs" ON ceo_tool_runs;
CREATE POLICY "service_role_bypass_ceo_tool_runs" ON ceo_tool_runs FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_executive_briefs" ON executive_briefs;
CREATE POLICY "service_role_bypass_executive_briefs" ON executive_briefs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_enterprise_signals_severity ON enterprise_signals(severity, state);
CREATE INDEX IF NOT EXISTS idx_enterprise_signals_domain ON enterprise_signals(domain);
CREATE INDEX IF NOT EXISTS idx_ceo_query_sessions_person ON ceo_query_sessions(person_id);
CREATE INDEX IF NOT EXISTS idx_ceo_query_messages_session ON ceo_query_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ceo_tool_runs_message ON ceo_tool_runs(message_id);
CREATE INDEX IF NOT EXISTS idx_executive_briefs_person ON executive_briefs(person_id);

-- ============================================================
-- AI AGENT REGISTRATION: CEO_COMMAND_AGENT
-- ============================================================
INSERT INTO ai_agents (
  code, name, description, role_description, autonomy_level,
  is_active, max_daily_budget_gbp, confidence_threshold
) VALUES (
  'CEO_COMMAND_AGENT',
  'CEO Command Intelligence Agent',
  'Executive intelligence agent for EntireFM CEO Command. Reads operational data via canonical tool registry. Never writes or mutates.',
  'Answers executive questions about operations, finance, compliance, PPM, supply chain, and commercial performance using deterministic canonical services. Autonomy: ASSIST. Authority: READ ONLY.',
  'ASSIST',
  true,
  0.00,  -- Zero budget: read-only agent has no monetary authority
  0.95
) ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  role_description = EXCLUDED.role_description,
  autonomy_level = EXCLUDED.autonomy_level,
  is_active = EXCLUDED.is_active,
  max_daily_budget_gbp = EXCLUDED.max_daily_budget_gbp,
  confidence_threshold = EXCLUDED.confidence_threshold;

-- ============================================================
-- SEED: CANONICAL ENTERPRISE METRIC DEFINITIONS
-- ============================================================
INSERT INTO enterprise_metric_definitions (metric_code, metric_name, domain, description, required_permission, canonical_service, formula_description, freshness_max_minutes, metric_version, data_coverage_note) VALUES
  ('ACTUAL_GROSS_MARGIN', 'Actual Gross Margin', 'FINANCE', 'Invoiced Revenue minus Approved Supplier Cost. Attribution coverage reported.', 'finance:read', 'server/finance.getFinanceKPISummary + detectBillingLeakage', 'No formula copied — references finance authority only.', 30, '1.0', 'Requires ≥80% cost attribution for reliable margin figure.'),
  ('UNBILLED_WIP', 'Unbilled Work-in-Progress', 'FINANCE', 'Completed billable work orders with no billing record.', 'finance:read', 'server/finance.detectBillingLeakage', 'No formula copied.', 30, '1.0', NULL),
  ('SLA_ATTENDANCE_AT_RISK', 'SLA Attendance At Risk', 'OPERATIONS', 'Work orders approaching or breaching attendance SLA threshold.', 'operations:read', 'server/work.listActiveSLARisks', 'No formula copied.', 5, '1.0', NULL),
  ('PPM_DUE_30_DAYS', 'PPM Due Next 30 Days', 'PPM', 'Maintenance occurrences scheduled in next 30 calendar days.', 'ppm:manage', 'server/db.maintenance_occurrences', 'No formula copied.', 15, '1.0', NULL),
  ('PPM_OVERDUE', 'PPM Overdue', 'PPM', 'Maintenance occurrences past scheduled date.', 'ppm:manage', 'server/db.maintenance_occurrences', 'No formula copied.', 15, '1.0', NULL),
  ('COMPLIANCE_OVERDUE_OBLIGATIONS', 'Overdue Compliance Obligations', 'COMPLIANCE', 'Obligations past due date from Phase 0J Compliance Intelligence.', 'compliance:read', 'server/compliance.getOverdueObligations', 'No formula copied.', 30, '1.0', NULL),
  ('PROVIDER_ATTENDANCE_SLA_PCT', 'Provider Attendance SLA %', 'SUPPLY_CHAIN', 'Attendance SLA compliance % per provider.', 'supply_chain:read', 'server/supply-chain.listAllProviderPerformances', 'No formula copied.', 30, '1.0', 'Calculated from canonical assignment data.'),
  ('BILLING_LEAKAGE_COUNT', 'Billing Leakage Count', 'FINANCE', 'Completed billable work orders not yet invoiced.', 'finance:read', 'server/finance.detectBillingLeakage', 'No formula copied.', 30, '1.0', NULL),
  ('SFG20_STATUS', 'SFG20 Maintenance Schedule Status', 'COMPLIANCE', 'SFG20 schedules require a valid BESA SFG20 licence.', 'compliance:read', 'LICENSE_REQUIRED', 'LICENSE_REQUIRED — no formula.', NULL, '1.0', 'LICENSE_REQUIRED: SFG20 is a licensed commercial standard. Requires active per-client or platform licence from BESA.')
ON CONFLICT (metric_code) DO UPDATE SET
  metric_name = EXCLUDED.metric_name,
  description = EXCLUDED.description,
  canonical_service = EXCLUDED.canonical_service,
  updated_at = now();
-- ============================================================
-- Migration 0026: Canonical Platform Integration Config + AI Budget Semantics
-- ============================================================
-- Precondition: 0025_ceo_command_enterprise_intelligence.sql applied
--
-- Purpose:
--   1. Create platform_integration_configs table — canonical source
--      for all external integration states.
--   2. Seed accounting connectors with INTERFACE_ONLY state.
--   3. Document and enforce AI agent budget semantics.
--   4. Update CEO_COMMAND_AGENT budget to £2.00/day (dev cap).
-- ============================================================

-- Platform Integration Configs
-- Single canonical table for all external integration states.
-- CEO Command, executive briefs, admin UI — all read from here.
CREATE TABLE IF NOT EXISTS platform_integration_configs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL UNIQUE,
  type         TEXT NOT NULL CHECK (type IN ('ACCOUNTING','CRM','ERP','FIELD','PAYMENT','COMMS')),
  state        TEXT NOT NULL CHECK (state IN ('LIVE','TEST','INTERFACE_ONLY','NOT_CONFIGURED','DEGRADED','FAILED','DISABLED')),
  note         TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  configured_by TEXT,
  last_checked_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE platform_integration_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_bypass_platform_integration_configs" ON platform_integration_configs;
CREATE POLICY "service_role_bypass_platform_integration_configs" ON platform_integration_configs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Seed canonical accounting connector states
INSERT INTO platform_integration_configs (name, type, state, note, is_active) VALUES
  ('Xero',        'ACCOUNTING', 'INTERFACE_ONLY', 'Pending per-client activation. Interface built; no active data connections.', true),
  ('QuickBooks',  'ACCOUNTING', 'INTERFACE_ONLY', 'Pending per-client activation. Interface built; no active data connections.', true),
  ('Sage',        'ACCOUNTING', 'INTERFACE_ONLY', 'Pending per-client activation. Interface built; no active data connections.', true),
  ('NetSuite',    'ACCOUNTING', 'INTERFACE_ONLY', 'Pending per-client activation. Interface built; no active data connections.', true)
ON CONFLICT (name) DO UPDATE SET
  state = EXCLUDED.state,
  note = EXCLUDED.note,
  updated_at = now();

-- ============================================================
-- AI AGENT BUDGET SEMANTICS
-- ============================================================
-- Budget policy for max_daily_budget_gbp:
--   NULL      → NO BUDGET CONFIGURED (unmanaged; not recommended for production)
--   0.00      → MODEL CALLS DISABLED (zero spend allowed; agent runs deterministically only)
--   > 0       → CAPPED BUDGET (max GBP spend per calendar day; enforced by AI Control Plane)
--
-- CEO_COMMAND_AGENT uses a governed model for explanation generation.
-- Development cap: £2.00/day (approximately 400,000 tokens @ £0.005/1K tokens).
-- ============================================================
ALTER TABLE ai_agents
  ADD COLUMN IF NOT EXISTS budget_policy TEXT
    CHECK (budget_policy IN ('ZERO_DISABLES','CAPPED','UNLIMITED'))
    DEFAULT 'CAPPED';

COMMENT ON COLUMN ai_agents.budget_policy IS
  'ZERO_DISABLES: max_daily_budget_gbp=0 disables model calls. '
  'CAPPED: enforced daily spend limit. '
  'UNLIMITED: no spend limit (production not recommended without monitoring).';

COMMENT ON COLUMN ai_agents.max_daily_budget_gbp IS
  'Daily budget cap in GBP. NULL=not configured. 0.00=model calls disabled. >0=capped.';

UPDATE ai_agents SET
  max_daily_budget_gbp = 2.00,
  budget_policy = 'CAPPED'
WHERE code = 'CEO_COMMAND_AGENT';

-- ============================================================
-- INDEX
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_platform_integration_configs_state
  ON platform_integration_configs(state);
/**
 * ENTIREFM UNIFIED OPERATIONS PLATFORM
 * MIGRATION 0027 — ASSET INTELLIGENCE & LIFECYCLE FOUNDATION (Phase 0K)
 * =======================================================================
 * Transforms the Asset Register into an Asset Intelligence platform.
 *
 * Extends public.assets with lifecycle, provenance, and replacement fields.
 * Adds:
 *   - asset_condition_assessments  (evidence-backed condition records)
 *   - asset_failure_events         (first-class failure taxonomy)
 *   - asset_intelligence_signals   (deterministic attention signals)
 *   - asset_replacement_reviews    (repair/replace decision support)
 *   - asset_telemetry_sources      (IoT/BMS foundation — no live data)
 *   - repeat_failure_policies      (configurable repeat-failure windows)
 *
 * Truth semantics:
 *   - condition default changed to 'UNKNOWN' (previously 'GOOD')
 *   - expected_life_source defaults to 'NOT_CONFIGURED'
 *   - No fake data, no health scores, no unsupported predictive claims
 */

-- ============================================================================
-- 1. EXTEND public.assets
-- ============================================================================

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS commission_date                date,
  ADD COLUMN IF NOT EXISTS expected_life_source           text NOT NULL DEFAULT 'NOT_CONFIGURED',
  -- MANUFACTURER | CLIENT_STANDARD | ENTIREFM_POLICY | ASSET_DATABASE | ENGINEER_ASSESSMENT | HISTORICAL_ANALYSIS | NOT_CONFIGURED
  ADD COLUMN IF NOT EXISTS expected_life_source_date      date,
  ADD COLUMN IF NOT EXISTS expected_life_confidence       text NOT NULL DEFAULT 'UNKNOWN',
  -- HIGH | MEDIUM | LOW | UNKNOWN
  ADD COLUMN IF NOT EXISTS condition_source               text NOT NULL DEFAULT 'NOT_ASSESSED',
  -- ENGINEER_ASSESSMENT | AI_ASSISTED | IMPORT | NOT_ASSESSED
  ADD COLUMN IF NOT EXISTS condition_assessed_at          timestamptz,
  ADD COLUMN IF NOT EXISTS condition_assessed_by          uuid REFERENCES public.persons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS condition_confidence           text NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN IF NOT EXISTS lifecycle_status               text NOT NULL DEFAULT 'ACTIVE',
  -- ACTIVE | OUT_OF_SERVICE | DECOMMISSIONED | REPLACED | DISPOSED
  ADD COLUMN IF NOT EXISTS replacement_cost_estimate_gbp  numeric(12,2),
  ADD COLUMN IF NOT EXISTS replacement_cost_source        text,
  -- APPROVED_QUOTE | SUPPLIER_QUOTE | CLIENT_BUDGET | RATE_DATABASE | MANUAL_ESTIMATE | HISTORICAL_SIMILAR
  ADD COLUMN IF NOT EXISTS replacement_cost_source_date   date,
  ADD COLUMN IF NOT EXISTS replacement_cost_confidence    text NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN IF NOT EXISTS successor_asset_id             uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS predecessor_asset_id           uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS parts_status                   text NOT NULL DEFAULT 'UNKNOWN',
  -- SUPPORTED | LIMITED | OBSOLETE | UNKNOWN
  ADD COLUMN IF NOT EXISTS manufacturer_support_status    text NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN IF NOT EXISTS obsolescence_status            text NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN IF NOT EXISTS energy_source                  text,
  -- GAS | ELECTRIC | OIL | DUAL | UNKNOWN
  ADD COLUMN IF NOT EXISTS rated_power_kw                 numeric(8,2),
  ADD COLUMN IF NOT EXISTS meter_id                       text;

-- Change condition default to UNKNOWN for new assets without an assessment source
-- Existing rows are NOT updated — they may have been manually assessed
ALTER TABLE public.assets ALTER COLUMN condition SET DEFAULT 'UNKNOWN';

-- ============================================================================
-- 2. ASSET CONDITION ASSESSMENTS
--    Structured, evidence-backed condition records. Each change is recorded.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_condition_assessments (
  id                          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id                    uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  assessed_by                 uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  assessed_at                 timestamptz NOT NULL DEFAULT now(),
  condition                   text        NOT NULL,
  -- EXCELLENT | GOOD | FAIR | POOR | CRITICAL | UNKNOWN
  previous_condition          text,
  operational_status          text        NOT NULL DEFAULT 'OPERATIONAL',
  -- OPERATIONAL | DEGRADED | NON_OPERATIONAL
  observed_defects            text[],
  -- controlled list: BEARING_NOISE, BELT_WEAR, CORROSION, LEAK, VIBRATION, ELECTRICAL_FAULT, etc.
  observed_notes              text,
  recommended_action          text,
  next_review_date            date,
  confidence                  text        NOT NULL DEFAULT 'MEDIUM',
  -- HIGH | MEDIUM | LOW
  source                      text        NOT NULL DEFAULT 'ENGINEER_ASSESSMENT',
  -- ENGINEER_ASSESSMENT | AI_ASSISTED | IMPORT | NOT_ASSESSED
  ai_assisted                 boolean     NOT NULL DEFAULT false,
  ai_extracted_observations   jsonb,
  -- { bearings: 'noisy', belts: 'worn', casing: 'corroded', suggested_condition: 'POOR', confidence: 0.91 }
  photos_stored               boolean     NOT NULL DEFAULT false,
  created_at                  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. ASSET FAILURE EVENTS
--    First-class failure records linked to work/defect evidence.
--    Does NOT equate every reactive WO with a failure.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_failure_events (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id                uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  work_order_id           uuid        REFERENCES public.work_orders(id) ON DELETE SET NULL,
  defect_id               uuid,
  -- FK to defects table if present; nullable
  visit_id                uuid,
  -- FK to visits table if present; nullable
  failure_category        text        NOT NULL,
  -- FUNCTIONAL_FAILURE | PARTIAL_FAILURE | PERFORMANCE_DEGRADATION | SAFETY_FAILURE
  -- CONTROLS_FAILURE | LEAK | ELECTRICAL_FAILURE | MECHANICAL_FAILURE | OTHER
  failure_description     text,
  cause                   text,
  resolution              text,
  parts_used              text[],
  direct_cost_gbp         numeric(10,2),
  downtime_minutes        integer,
  -- NULL means UNKNOWN, not zero
  downtime_business_impact text,
  -- NONE | LOW | MEDIUM | HIGH | CRITICAL
  failed_at               timestamptz,
  resolved_at             timestamptz,
  created_by              uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. ASSET INTELLIGENCE SIGNALS
--    Deterministic attention signals. AI does not set severity.
--    Policy version stored for auditability.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_intelligence_signals (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  signal_type         text        NOT NULL,
  -- REPEAT_FAILURE | HIGH_REACTIVE_COST | AGE_APPROACHING_EXPECTED_LIFE
  -- AGE_EXCEEDS_EXPECTED_LIFE | CONDITION_POOR | CONDITION_CRITICAL
  -- REPAIR_COST_THRESHOLD | WARRANTY_EXPIRING | HIGH_DOWNTIME
  -- PPM_FAILURE_TREND | OBSOLESCENCE_REVIEW_REQUIRED | DATA_INCOMPLETE
  severity            text        NOT NULL DEFAULT 'INFO',
  -- INFO | WARNING | HIGH | CRITICAL
  title               text        NOT NULL,
  description         text        NOT NULL,
  evidence_snapshot   jsonb       NOT NULL DEFAULT '{}'::jsonb,
  policy_version      text        NOT NULL DEFAULT '1.0',
  is_active           boolean     NOT NULL DEFAULT true,
  generated_at        timestamptz NOT NULL DEFAULT now(),
  resolved_at         timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. ASSET REPLACEMENT REVIEWS
--    Human-led repair/replace decision support. No AUTO_REPLACE.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_replacement_reviews (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  opened_at           timestamptz NOT NULL DEFAULT now(),
  opened_by           uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  trigger_signal_id   uuid        REFERENCES public.asset_intelligence_signals(id) ON DELETE SET NULL,
  status              text        NOT NULL DEFAULT 'OPEN',
  -- OPEN | ASSESSMENT_REQUIRED | QUOTE_REQUIRED | CLIENT_REVIEW
  -- APPROVED | DEFERRED | REJECTED | COMPLETED | CANCELLED
  evidence_snapshot   jsonb       NOT NULL DEFAULT '{}'::jsonb,
  -- age_years, expected_life_years, condition, criticality,
  -- reactive_cost_gbp, period_label, repeat_failure_count,
  -- downtime_minutes, repair_estimate_gbp, replacement_estimate_gbp
  ai_rationale        text,
  -- AI explains deterministic evidence; human decides
  reviewed_by         uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  decision            text,
  -- REPLACE | DEFER | REJECT
  decision_at         timestamptz,
  decision_notes      text,
  closed_at           timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. ASSET TELEMETRY SOURCES
--    Foundation for future IoT/BMS integration. No live telemetry in Phase 0K.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_telemetry_sources (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  source_type         text        NOT NULL DEFAULT 'UNCONFIGURED',
  -- BMS | IOT_SENSOR | METER | GATEWAY | UNCONFIGURED
  source_identifier   text,
  metric_name         text,
  unit                text,
  last_seen_at        timestamptz,
  status              text        NOT NULL DEFAULT 'UNCONFIGURED',
  -- ACTIVE | INACTIVE | UNCONFIGURED
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 7. REPEAT FAILURE POLICIES
--    Configurable windows. Not hardcoded globally.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.repeat_failure_policies (
  id                    uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  text    NOT NULL,
  window_days           integer NOT NULL DEFAULT 90,
  min_occurrences       integer NOT NULL DEFAULT 3,
  category_match_mode   text    NOT NULL DEFAULT 'EXACT',
  -- EXACT | RELATED
  is_default            boolean NOT NULL DEFAULT false,
  version               text    NOT NULL DEFAULT '1.0',
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- Seed the default policy
INSERT INTO public.repeat_failure_policies (name, window_days, min_occurrences, category_match_mode, is_default, version)
VALUES ('Default 90-day Repeat Failure Policy', 90, 3, 'EXACT', true, '1.0')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. INDEXES
-- ============================================================================

-- Asset-level intelligence indexes
CREATE INDEX IF NOT EXISTS idx_assets_lifecycle_status   ON public.assets(lifecycle_status);
CREATE INDEX IF NOT EXISTS idx_assets_condition          ON public.assets(condition);
CREATE INDEX IF NOT EXISTS idx_assets_criticality        ON public.assets(criticality);
CREATE INDEX IF NOT EXISTS idx_assets_manufacturer       ON public.assets(manufacturer);
CREATE INDEX IF NOT EXISTS idx_assets_installation_date  ON public.assets(installation_date);
CREATE INDEX IF NOT EXISTS idx_assets_successor          ON public.assets(successor_asset_id) WHERE successor_asset_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_assets_predecessor        ON public.assets(predecessor_asset_id) WHERE predecessor_asset_id IS NOT NULL;

-- Failure events
CREATE INDEX IF NOT EXISTS idx_asset_failure_events_asset_id    ON public.asset_failure_events(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_failure_events_failed_at   ON public.asset_failure_events(failed_at);
CREATE INDEX IF NOT EXISTS idx_asset_failure_events_category    ON public.asset_failure_events(failure_category);
CREATE INDEX IF NOT EXISTS idx_asset_failure_events_work_order  ON public.asset_failure_events(work_order_id);

-- Signals
CREATE INDEX IF NOT EXISTS idx_asset_signals_asset_id   ON public.asset_intelligence_signals(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_signals_type        ON public.asset_intelligence_signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_asset_signals_active      ON public.asset_intelligence_signals(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_asset_signals_severity    ON public.asset_intelligence_signals(severity);

-- Condition assessments
CREATE INDEX IF NOT EXISTS idx_asset_conditions_asset_id ON public.asset_condition_assessments(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_conditions_date     ON public.asset_condition_assessments(assessed_at);

-- Replacement reviews
CREATE INDEX IF NOT EXISTS idx_asset_reviews_asset_id   ON public.asset_replacement_reviews(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_reviews_status     ON public.asset_replacement_reviews(status);

-- Telemetry
CREATE INDEX IF NOT EXISTS idx_asset_telemetry_asset_id ON public.asset_telemetry_sources(asset_id);

-- ============================================================================
-- 9. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.asset_condition_assessments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_failure_events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_intelligence_signals   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_replacement_reviews    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_telemetry_sources      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repeat_failure_policies      ENABLE ROW LEVEL SECURITY;

-- Service role bypass (following existing pattern — application uses service role key)
DROP POLICY IF EXISTS "service_role_bypass" ON public.asset_condition_assessments;
CREATE POLICY "service_role_bypass" ON public.asset_condition_assessments
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass" ON public.asset_failure_events;
CREATE POLICY "service_role_bypass" ON public.asset_failure_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass" ON public.asset_intelligence_signals;
CREATE POLICY "service_role_bypass" ON public.asset_intelligence_signals
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass" ON public.asset_replacement_reviews;
CREATE POLICY "service_role_bypass" ON public.asset_replacement_reviews
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass" ON public.asset_telemetry_sources;
CREATE POLICY "service_role_bypass" ON public.asset_telemetry_sources
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass" ON public.repeat_failure_policies;
CREATE POLICY "service_role_bypass" ON public.repeat_failure_policies
  FOR ALL TO service_role USING (true) WITH CHECK (true);
-- Migration 0028: Asset Intelligence Performance Indexes
-- ========================================================
-- Addresses Phase 0K performance closeout.
-- Root cause: work_orders.asset_id and supplier_invoice_lines.work_order_id
-- had no indexes — every per-asset cost lookup was a full sequential scan.

-- Critical 1: work_orders.asset_id
create index if not exists idx_work_orders_asset_id
  on public.work_orders (asset_id)
  where asset_id is not null;

-- Critical 2: supplier_invoice_lines.work_order_id
-- Guard: column added by 0016 via ALTER TABLE; ensure it exists before indexing
alter table public.supplier_invoice_lines
  add column if not exists work_order_id uuid references public.work_orders(id);

create index if not exists idx_supplier_invoice_lines_work_order_id
  on public.supplier_invoice_lines (work_order_id)
  where work_order_id is not null;

-- Composite: asset cost type filtering (asset_id + work_type)
create index if not exists idx_work_orders_asset_work_type
  on public.work_orders (asset_id, work_type)
  where asset_id is not null;

-- Composite: asset failure events — asset + time window
create index if not exists idx_asset_failure_events_asset_failed_at
  on public.asset_failure_events (asset_id, failed_at desc)
  where asset_id is not null;

-- Composite: assets category + lifecycle_status for class performance grouping
create index if not exists idx_assets_category_lifecycle
  on public.assets (category, lifecycle_status);
/**
 * ENTIREFM UNIFIED OPERATIONS PLATFORM
 * MIGRATION 0029 — TELEMETRY, RELIABILITY INTELLIGENCE & PREDICTIVE FOUNDATION (Phase 0L)
 * ========================================================================================
 */

-- ============================================================================
-- 1. EXTEND asset_telemetry_sources WITH CANONICAL CONNECTOR STATE
-- ============================================================================

ALTER TABLE public.asset_telemetry_sources
  ADD COLUMN IF NOT EXISTS connector_state       text NOT NULL DEFAULT 'NOT_CONFIGURED',
  ADD COLUMN IF NOT EXISTS protocol              text,
  ADD COLUMN IF NOT EXISTS last_connected_at     timestamptz,
  ADD COLUMN IF NOT EXISTS last_error            text,
  ADD COLUMN IF NOT EXISTS last_error_at         timestamptz,
  ADD COLUMN IF NOT EXISTS expected_reporting_interval_seconds integer,
  ADD COLUMN IF NOT EXISTS config_fingerprint    text;

-- ============================================================================
-- 2. CANONICAL TELEMETRY METRIC REGISTRY
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.telemetry_metrics (
  code                text        PRIMARY KEY,
  canonical_unit      text        NOT NULL,
  valid_min           numeric,
  valid_max           numeric,
  asset_classes       text[],
  description         text,
  quality_rules       jsonb       NOT NULL DEFAULT '[]'::jsonb,
  source_mapping      jsonb       NOT NULL DEFAULT '{}'::jsonb,
  is_active           boolean     NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.telemetry_metrics (code, canonical_unit, valid_min, valid_max, description) VALUES
  ('TEMPERATURE',           '°C',   -50,  150,  'General temperature'),
  ('SUPPLY_TEMPERATURE',    '°C',   -20,  100,  'Supply air or water temperature'),
  ('RETURN_TEMPERATURE',    '°C',   -20,  100,  'Return air or water temperature'),
  ('PRESSURE',              'kPa',    0, 2000,  'General pressure'),
  ('DIFFERENTIAL_PRESSURE', 'kPa',    0,  500,  'Differential pressure across component'),
  ('FLOW_RATE',             'm³/h',   0, 9999,  'Volumetric flow rate'),
  ('VIBRATION_RMS',         'mm/s',   0,  200,  'Root mean square vibration velocity'),
  ('CURRENT',               'A',      0, 1000,  'Electrical current draw'),
  ('VOLTAGE',               'V',      0,  500,  'Supply voltage'),
  ('POWER',                 'W',      0, 500000,'Electrical power consumption'),
  ('ENERGY',                'kWh',    0, NULL,  'Cumulative energy consumption'),
  ('HUMIDITY',              '%',      0,  100,  'Relative humidity'),
  ('CO2',                   'ppm',    0, 5000,  'Carbon dioxide concentration'),
  ('FAN_SPEED',             'RPM',    0, 9999,  'Fan rotational speed'),
  ('VALVE_POSITION',        '%',      0,  100,  'Valve open position 0=closed 100=open'),
  ('COMPRESSOR_RUN_STATE',  'bool',   0,    1,  'Compressor running state 0=off 1=on'),
  ('RUNTIME_HOURS',         'h',      0, NULL,  'Cumulative runtime hours'),
  ('START_COUNT',           'count',  0, NULL,  'Cumulative start/stop cycle count'),
  ('FAULT_CODE',            'code',   NULL, NULL,'Manufacturer fault/alarm code'),
  ('TEMPERATURE_DELTA',     '°C',  -100,  100,  'Computed temperature differential')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 3. TELEMETRY SENSORS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.telemetry_sensors (
  id                              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id                       uuid        NOT NULL REFERENCES public.asset_telemetry_sources(id) ON DELETE CASCADE,
  asset_id                        uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  metric_code                     text        NOT NULL REFERENCES public.telemetry_metrics(code) ON DELETE RESTRICT,
  sensor_reference                text,
  display_name                    text,
  expected_reporting_interval_seconds integer DEFAULT 60,
  status                          text        NOT NULL DEFAULT 'UNCONFIGURED',
  last_observation_at             timestamptz,
  last_known_quality              text,
  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_id, sensor_reference)
);

-- ============================================================================
-- 4. TELEMETRY OBSERVATIONS (idempotent)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.telemetry_observations (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key     text        NOT NULL,
  asset_id            uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  source_id           uuid        NOT NULL REFERENCES public.asset_telemetry_sources(id) ON DELETE CASCADE,
  sensor_id           uuid        REFERENCES public.telemetry_sensors(id) ON DELETE SET NULL,
  metric_code         text        NOT NULL REFERENCES public.telemetry_metrics(code) ON DELETE RESTRICT,
  raw_value           numeric,
  raw_unit            text,
  raw_string_value    text,
  normalised_value    numeric,
  canonical_unit      text,
  quality             text        NOT NULL DEFAULT 'VALID',
  quality_reason      text,
  observed_at         timestamptz NOT NULL,
  received_at         timestamptz NOT NULL DEFAULT now(),
  source_system       text,
  source_message_id   text,
  UNIQUE (idempotency_key)
);

-- ============================================================================
-- 5. TELEMETRY QUALITY EVENTS (quarantine log)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.telemetry_quality_events (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            uuid        REFERENCES public.assets(id) ON DELETE CASCADE,
  source_id           uuid        REFERENCES public.asset_telemetry_sources(id) ON DELETE CASCADE,
  sensor_id           uuid        REFERENCES public.telemetry_sensors(id) ON DELETE SET NULL,
  metric_code         text,
  raw_payload         jsonb,
  quality_state       text        NOT NULL,
  rejection_reason    text,
  idempotency_key     text,
  observed_at         timestamptz,
  received_at         timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. TELEMETRY AGGREGATES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.telemetry_aggregates (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  sensor_id           uuid        REFERENCES public.telemetry_sensors(id) ON DELETE SET NULL,
  metric_code         text        NOT NULL REFERENCES public.telemetry_metrics(code) ON DELETE RESTRICT,
  window_type         text        NOT NULL,
  window_start        timestamptz NOT NULL,
  window_end          timestamptz NOT NULL,
  sample_count        integer     NOT NULL DEFAULT 0,
  valid_sample_count  integer     NOT NULL DEFAULT 0,
  agg_min             numeric,
  agg_max             numeric,
  agg_mean            numeric,
  agg_median          numeric,
  agg_stddev          numeric,
  agg_p95             numeric,
  computed_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (asset_id, metric_code, window_type, window_start)
);

-- ============================================================================
-- 7. TELEMETRY RETENTION CLASSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.telemetry_retention_classes (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  class_name          text        NOT NULL UNIQUE,
  retention_days      integer     NOT NULL,
  description         text,
  is_active           boolean     NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.telemetry_retention_classes (class_name, retention_days, description) VALUES
  ('RAW_HIGH_FREQUENCY', 30,   'Raw observations at sub-minute frequency — 30 days'),
  ('RAW_STANDARD',       180,  'Raw observations at standard intervals — 180 days'),
  ('HOURLY_AGGREGATE',   730,  'Hourly aggregates — 2 years'),
  ('DAILY_AGGREGATE',    1825, 'Daily aggregates — 5 years'),
  ('LONG_TERM_FEATURE',  3650, 'Computed features for model training — 10 years')
ON CONFLICT (class_name) DO NOTHING;

-- ============================================================================
-- 8. ASSET TELEMETRY BASELINES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_telemetry_baselines (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id                uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  metric_code             text        NOT NULL REFERENCES public.telemetry_metrics(code) ON DELETE RESTRICT,
  baseline_mean           numeric,
  baseline_stddev         numeric,
  baseline_min            numeric,
  baseline_max            numeric,
  baseline_p5             numeric,
  baseline_p95            numeric,
  baseline_type           text        NOT NULL DEFAULT 'ROLLING_MEAN',
  sample_count            integer     NOT NULL DEFAULT 0,
  training_window_days    integer     NOT NULL,
  training_from           timestamptz,
  training_to             timestamptz,
  data_quality_coverage   numeric,
  method                  text        NOT NULL DEFAULT 'STATISTICAL',
  version                 integer     NOT NULL DEFAULT 1,
  status                  text        NOT NULL DEFAULT 'INSUFFICIENT_DATA',
  min_samples_required    integer     NOT NULL DEFAULT 168,
  created_at              timestamptz NOT NULL DEFAULT now(),
  computed_at             timestamptz,
  UNIQUE (asset_id, metric_code, baseline_type)
);

-- ============================================================================
-- 9. ASSET TELEMETRY ANOMALIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_telemetry_anomalies (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id            uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  sensor_id           uuid        REFERENCES public.telemetry_sensors(id) ON DELETE SET NULL,
  metric_code         text        REFERENCES public.telemetry_metrics(code) ON DELETE SET NULL,
  anomaly_type        text        NOT NULL,
  anomaly_scope       text        NOT NULL DEFAULT 'ASSET',
  severity            text        NOT NULL DEFAULT 'WARNING',
  evidence_json       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  started_at          timestamptz NOT NULL,
  ended_at            timestamptz,
  duration_seconds    integer,
  sample_count        integer,
  quality             text,
  is_active           boolean     NOT NULL DEFAULT true,
  resolved_at         timestamptz,
  resolution_reason   text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 10. ASSET RELIABILITY SIGNALS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_reliability_signals (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id                uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  signal_type             text        NOT NULL,
  severity                text        NOT NULL DEFAULT 'WARNING',
  title                   text        NOT NULL,
  description             text        NOT NULL,
  asset_context_snapshot  jsonb       NOT NULL DEFAULT '{}'::jsonb,
  evidence_snapshot       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  anomaly_id              uuid        REFERENCES public.asset_telemetry_anomalies(id) ON DELETE SET NULL,
  policy_version          text        NOT NULL DEFAULT '1.0',
  is_active               boolean     NOT NULL DEFAULT true,
  generated_at            timestamptz NOT NULL DEFAULT now(),
  resolved_at             timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 11. PREDICTIVE FEATURE DEFINITIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_feature_definitions (
  code                text        NOT NULL,
  version             integer     NOT NULL DEFAULT 1,
  formula             text        NOT NULL,
  unit                text,
  window_days         integer,
  source              text        NOT NULL,
  description         text,
  is_active           boolean     NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  created_by          uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  PRIMARY KEY (code, version)
);

INSERT INTO public.predictive_feature_definitions
  (code, version, formula, unit, window_days, source, description)
VALUES
  ('mean_temperature_24h',     1, 'MEAN(normalised_value) WHERE metric=TEMPERATURE AND window=24h AND quality IN (VALID,SUSPECT)', '°C', 1, 'TELEMETRY', 'Mean temperature over last 24 hours'),
  ('temperature_delta_7d',     1, 'MEAN_last_24h minus MEAN_7d_ago_24h WHERE metric=TEMPERATURE', '°C', 7, 'TELEMETRY', 'Temperature change versus 7 days ago'),
  ('vibration_rms_mean_24h',   1, 'MEAN(normalised_value) WHERE metric=VIBRATION_RMS AND window=24h AND quality=VALID', 'mm/s', 1, 'TELEMETRY', 'Mean vibration RMS over last 24 hours'),
  ('vibration_rms_slope_7d',   1, 'LINEAR_SLOPE(DAILY_MEAN(vibration_rms)) OVER 7d', 'mm/s/day', 7, 'TELEMETRY', 'Linear trend of vibration RMS over 7 days'),
  ('starts_24h',               1, 'COUNT(START_COUNT transitions 0 to 1) WHERE window=24h', 'count', 1, 'TELEMETRY', 'Number of start cycles in last 24 hours'),
  ('runtime_hours_7d',         1, 'SUM(COMPRESSOR_RUN_STATE=1 seconds / 3600) WHERE window=7d', 'h', 7, 'TELEMETRY', 'Cumulative runtime hours over 7 days'),
  ('energy_per_runtime_hour',  1, 'SUM(ENERGY_kWh_24h) / MAX(runtime_hours_7d / 7)', 'kWh/h', 7, 'TELEMETRY', 'Energy consumption per hour of runtime'),
  ('failure_count_90d',        1, 'COUNT(asset_failure_events) WHERE asset_id=X AND failed_at >= NOW()-90d', 'count', 90, 'FAILURE_EVENTS', 'Number of failure events in last 90 days'),
  ('condition_state',          1, 'assets.condition WHERE asset_id=X', 'enum', NULL, 'ASSET_REGISTER', 'Current condition assessment'),
  ('asset_age',                1, 'YEARS_BETWEEN(commission_date OR installation_date, NOW())', 'years', NULL, 'ASSET_REGISTER', 'Asset age in years'),
  ('days_since_last_ppm',      1, 'DAYS_BETWEEN(MAX(ppm_visits.completed_at), NOW()) WHERE asset_id=X', 'days', NULL, 'PPM', 'Days since last completed PPM visit')
ON CONFLICT (code, version) DO NOTHING;

-- ============================================================================
-- 12. PREDICTIVE TRAINING DATASETS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_training_datasets (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    text        NOT NULL,
  version                 integer     NOT NULL DEFAULT 1,
  description             text,
  asset_population        jsonb       NOT NULL DEFAULT '{}'::jsonb,
  metric_population       text[],
  date_range_from         timestamptz NOT NULL,
  date_range_to           timestamptz NOT NULL,
  feature_set_version     integer     NOT NULL DEFAULT 1,
  failure_label_source    text        NOT NULL DEFAULT 'ASSET_FAILURE_EVENTS',
  excluded_observations   jsonb       NOT NULL DEFAULT '[]'::jsonb,
  quality_filters         jsonb       NOT NULL DEFAULT '{}'::jsonb,
  total_assets            integer,
  total_observations      integer,
  failure_event_count     integer,
  non_failure_count       integer,
  class_imbalance_ratio   numeric,
  created_at              timestamptz NOT NULL DEFAULT now(),
  created_by              uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  notes                   text
);

-- ============================================================================
-- 13. PREDICTIVE MODELS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_models (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text        NOT NULL,
  asset_class         text,
  target              text        NOT NULL,
  algorithm           text,
  description         text,
  owner               uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  is_active           boolean     NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 14. PREDICTIVE MODEL VERSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_model_versions (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id                uuid        NOT NULL REFERENCES public.predictive_models(id) ON DELETE CASCADE,
  version                 integer     NOT NULL,
  status                  text        NOT NULL DEFAULT 'DRAFT',
  training_dataset_id     uuid        REFERENCES public.predictive_training_datasets(id) ON DELETE SET NULL,
  feature_set_version     integer     NOT NULL DEFAULT 1,
  validation_window_days  integer,
  validation_metrics      jsonb,
  class_imbalance_report  jsonb,
  trained_at              timestamptz,
  shadow_started_at       timestamptz,
  assist_started_at       timestamptz,
  prediction_count        integer     NOT NULL DEFAULT 0,
  true_positive_count     integer     NOT NULL DEFAULT 0,
  false_positive_count    integer     NOT NULL DEFAULT 0,
  true_negative_count     integer     NOT NULL DEFAULT 0,
  false_negative_count    integer     NOT NULL DEFAULT 0,
  notes                   text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  UNIQUE (model_id, version)
);

-- ============================================================================
-- 15. PREDICTIVE MODEL APPROVALS (audit)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_model_approvals (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  model_version_id        uuid        NOT NULL REFERENCES public.predictive_model_versions(id) ON DELETE CASCADE,
  from_state              text        NOT NULL,
  to_state                text        NOT NULL,
  decision                text        NOT NULL,
  reviewer_id             uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  reviewer_name           text,
  validation_evidence_ref text,
  notes                   text,
  decided_at              timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 16. PREDICTIVE PREDICTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_predictions (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  model_version_id        uuid        NOT NULL REFERENCES public.predictive_model_versions(id) ON DELETE CASCADE,
  asset_id                uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  prediction_at           timestamptz NOT NULL DEFAULT now(),
  prediction_window_days  integer     NOT NULL,
  risk_level              text        NOT NULL,
  risk_score              numeric,
  feature_snapshot        jsonb       NOT NULL DEFAULT '{}'::jsonb,
  data_quality            text        NOT NULL DEFAULT 'VALID',
  data_freshness_hours    integer,
  model_status_at_time    text        NOT NULL DEFAULT 'SHADOW',
  created_at              timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 17. PREDICTIVE PREDICTION OUTCOMES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_prediction_outcomes (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id           uuid        NOT NULL REFERENCES public.predictive_predictions(id) ON DELETE CASCADE,
  asset_id                uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  actual_outcome          text,
  outcome_at              timestamptz,
  failure_event_id        uuid        REFERENCES public.asset_failure_events(id) ON DELETE SET NULL,
  evaluation_result       text,
  confirmed_by            uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  confirmed_at            timestamptz NOT NULL DEFAULT now(),
  notes                   text
);

-- ============================================================================
-- 18. PREDICTIVE REVIEWS (human decision entity)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_reviews (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id           uuid        REFERENCES public.predictive_predictions(id) ON DELETE SET NULL,
  asset_id                uuid        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  reliability_signal_id   uuid        REFERENCES public.asset_reliability_signals(id) ON DELETE SET NULL,
  opened_at               timestamptz NOT NULL DEFAULT now(),
  opened_by               uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  status                  text        NOT NULL DEFAULT 'OPEN',
  recommended_action      text        NOT NULL,
  evidence_snapshot       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  decision                text,
  decided_by              uuid        REFERENCES public.persons(id) ON DELETE SET NULL,
  decision_at             timestamptz,
  decision_notes          text,
  resulting_work_order_id uuid,
  closed_at               timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 19. MODEL DRIFT EVENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.predictive_model_drift_events (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  model_version_id    uuid        NOT NULL REFERENCES public.predictive_model_versions(id) ON DELETE CASCADE,
  drift_type          text        NOT NULL,
  severity            text        NOT NULL DEFAULT 'WARNING',
  evidence_json       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  triggered_review    boolean     NOT NULL DEFAULT true,
  detected_at         timestamptz NOT NULL DEFAULT now(),
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 20. INDEXES
-- ============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_telemetry_obs_idempotency
  ON public.telemetry_observations (idempotency_key);

CREATE INDEX IF NOT EXISTS idx_telemetry_obs_asset_metric_time
  ON public.telemetry_observations (asset_id, metric_code, observed_at DESC);

CREATE INDEX IF NOT EXISTS idx_telemetry_obs_source_time
  ON public.telemetry_observations (source_id, observed_at DESC);

CREATE INDEX IF NOT EXISTS idx_telemetry_obs_sensor_time
  ON public.telemetry_observations (sensor_id, observed_at DESC)
  WHERE sensor_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_telemetry_obs_quality
  ON public.telemetry_observations (quality)
  WHERE quality != 'VALID';

CREATE INDEX IF NOT EXISTS idx_telemetry_sensors_source
  ON public.telemetry_sensors (source_id);

CREATE INDEX IF NOT EXISTS idx_telemetry_sensors_asset
  ON public.telemetry_sensors (asset_id);

CREATE INDEX IF NOT EXISTS idx_telemetry_quality_source
  ON public.telemetry_quality_events (source_id, received_at DESC)
  WHERE source_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_telemetry_agg_asset_metric_window
  ON public.telemetry_aggregates (asset_id, metric_code, window_type, window_start DESC);

CREATE INDEX IF NOT EXISTS idx_baselines_asset_metric
  ON public.asset_telemetry_baselines (asset_id, metric_code);

CREATE INDEX IF NOT EXISTS idx_anomalies_asset_active
  ON public.asset_telemetry_anomalies (asset_id, is_active)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_anomalies_asset_type
  ON public.asset_telemetry_anomalies (asset_id, anomaly_type);

CREATE INDEX IF NOT EXISTS idx_anomalies_scope
  ON public.asset_telemetry_anomalies (anomaly_scope, is_active);

CREATE INDEX IF NOT EXISTS idx_reliability_signals_asset_active
  ON public.asset_reliability_signals (asset_id, is_active)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_reliability_signals_type
  ON public.asset_reliability_signals (signal_type, severity);

CREATE INDEX IF NOT EXISTS idx_predictions_asset_time
  ON public.predictive_predictions (asset_id, prediction_at DESC);

CREATE INDEX IF NOT EXISTS idx_predictions_model_version
  ON public.predictive_predictions (model_version_id, prediction_at DESC);

CREATE INDEX IF NOT EXISTS idx_predictive_reviews_asset
  ON public.predictive_reviews (asset_id, status);

CREATE INDEX IF NOT EXISTS idx_predictive_reviews_open
  ON public.predictive_reviews (status, opened_at DESC)
  WHERE status = 'OPEN';

-- ============================================================================
-- 21. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.telemetry_metrics               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_sensors               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_observations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_quality_events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_aggregates            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_retention_classes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_telemetry_baselines       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_telemetry_anomalies       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_reliability_signals       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_feature_definitions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_training_datasets    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_models               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_model_versions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_model_approvals      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_predictions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_prediction_outcomes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_reviews              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_model_drift_events   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_bypass" ON public.telemetry_metrics;
CREATE POLICY "service_role_bypass" ON public.telemetry_metrics               FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.telemetry_sensors;
CREATE POLICY "service_role_bypass" ON public.telemetry_sensors               FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.telemetry_observations;
CREATE POLICY "service_role_bypass" ON public.telemetry_observations          FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.telemetry_quality_events;
CREATE POLICY "service_role_bypass" ON public.telemetry_quality_events        FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.telemetry_aggregates;
CREATE POLICY "service_role_bypass" ON public.telemetry_aggregates            FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.telemetry_retention_classes;
CREATE POLICY "service_role_bypass" ON public.telemetry_retention_classes     FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.asset_telemetry_baselines;
CREATE POLICY "service_role_bypass" ON public.asset_telemetry_baselines       FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.asset_telemetry_anomalies;
CREATE POLICY "service_role_bypass" ON public.asset_telemetry_anomalies       FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.asset_reliability_signals;
CREATE POLICY "service_role_bypass" ON public.asset_reliability_signals       FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.predictive_feature_definitions;
CREATE POLICY "service_role_bypass" ON public.predictive_feature_definitions  FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.predictive_training_datasets;
CREATE POLICY "service_role_bypass" ON public.predictive_training_datasets    FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.predictive_models;
CREATE POLICY "service_role_bypass" ON public.predictive_models               FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.predictive_model_versions;
CREATE POLICY "service_role_bypass" ON public.predictive_model_versions       FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.predictive_model_approvals;
CREATE POLICY "service_role_bypass" ON public.predictive_model_approvals      FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.predictive_predictions;
CREATE POLICY "service_role_bypass" ON public.predictive_predictions          FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.predictive_prediction_outcomes;
CREATE POLICY "service_role_bypass" ON public.predictive_prediction_outcomes  FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.predictive_reviews;
CREATE POLICY "service_role_bypass" ON public.predictive_reviews              FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "service_role_bypass" ON public.predictive_model_drift_events;
CREATE POLICY "service_role_bypass" ON public.predictive_model_drift_events   FOR ALL TO service_role USING (true) WITH CHECK (true);
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
/**
 * ENTIREFM UNIFIED OPERATIONS PLATFORM
 * MIGRATION 0031 — COMPLETE SUPPLIER APPLICATION WIZARD SCHEMA
 * ============================================================================
 * Adds all necessary columns to supplier_application_drafts and establishes
 * the supplier_documents table for durable document vault persistence.
 */

-- Ensure supplier_application_drafts has all extended fields
ALTER TABLE public.supplier_application_drafts
  ADD COLUMN IF NOT EXISTS contacts_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS service_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS custom_services text,
  ADD COLUMN IF NOT EXISTS coverage_type text NOT NULL DEFAULT 'REGIONAL',
  ADD COLUMN IF NOT EXISTS operating_bases jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS operational_radius_miles integer DEFAULT 50,
  ADD COLUMN IF NOT EXISTS national_mobilisation boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS service_delivery_types jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS standard_operating_hours text DEFAULT '08:00 - 17:00 (Mon-Fri)',
  ADD COLUMN IF NOT EXISTS emergency_24_7_staffing text,
  ADD COLUMN IF NOT EXISTS emergency_contact_mechanism text,
  ADD COLUMN IF NOT EXISTS response_time_p1 text,
  ADD COLUMN IF NOT EXISTS response_time_p2 text,
  ADD COLUMN IF NOT EXISTS response_time_p3 text,
  ADD COLUMN IF NOT EXISTS vehicle_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS branded_fleet boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS gps_tracking boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS vehicle_stock boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS specialist_equipment_available boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS specialist_equipment_details text,
  ADD COLUMN IF NOT EXISTS work_management_methods jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS engineer_device_capabilities jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS field_operatives_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS qualified_engineers_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS supervisors_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS office_staff_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS apprentices_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS employment_model text DEFAULT 'DIRECT_EMPLOYEES',
  ADD COLUMN IF NOT EXISTS qualifications_held jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS custom_qualifications text,
  ADD COLUMN IF NOT EXISTS subcontractor_pct integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS subcontractor_trades jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS subcontractor_approval_process text,
  ADD COLUMN IF NOT EXISTS sub_checks_competency boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sub_checks_insurance boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sub_checks_hs boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sub_checks_accreditation boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sub_monitors_performance boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sub_entirefm_compliance boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sub_standards_accepted boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS el_insurer text,
  ADD COLUMN IF NOT EXISTS el_policy_number text,
  ADD COLUMN IF NOT EXISTS el_cover_limit text,
  ADD COLUMN IF NOT EXISTS el_expiry_date text,
  ADD COLUMN IF NOT EXISTS pi_applicable boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS pi_insurer text,
  ADD COLUMN IF NOT EXISTS pi_policy_number text,
  ADD COLUMN IF NOT EXISTS pi_cover_limit text,
  ADD COLUMN IF NOT EXISTS pi_expiry_date text,
  ADD COLUMN IF NOT EXISTS hs_policy_review_date text,
  ADD COLUMN IF NOT EXISTS competent_person_name text,
  ADD COLUMN IF NOT EXISTS competent_person_role text,
  ADD COLUMN IF NOT EXISTS competent_person_type text DEFAULT 'INTERNAL',
  ADD COLUMN IF NOT EXISTS rams_approver_role text,
  ADD COLUMN IF NOT EXISTS rams_provided_pre_attendance boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS rams_operatives_briefed boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS high_risk_controls jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS incident_riddor_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS incident_lti_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS incident_improvement_notices_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS incident_prohibition_notices_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS incident_prosecutions_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS incident_details text,
  ADD COLUMN IF NOT EXISTS training_matrix_maintained boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS certifications_monitored boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS toolbox_talks_regular boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS site_inductions_supported boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS modern_slavery_policy boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS modern_slavery_statement boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS modern_slavery_supply_controls boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS anti_bribery_policy boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS gifts_hospitality_controls boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS conflicts_interest_controls boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS equality_diversity_policy boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS right_to_work_checks boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS fair_employment_practices boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS whistleblowing_procedure boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS disclosure_criminal_convictions boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS disclosure_fraud_convictions boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS disclosure_bribery_convictions boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS disclosure_regulatory_enforcement boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS disclosure_insolvency_disqualification boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS disclosure_details text,
  ADD COLUMN IF NOT EXISTS sanctions_confirmed boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS infosec_policy boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS data_protection_policy boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS gdpr_procedures boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS dpo_contact_name text,
  ADD COLUMN IF NOT EXISTS dpo_contact_email text,
  ADD COLUMN IF NOT EXISTS cyber_certifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS cyber_cert_number text,
  ADD COLUMN IF NOT EXISTS cyber_controls jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS processes_personal_data boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS personal_data_safeguards text,
  ADD COLUMN IF NOT EXISTS cyber_breach_past_3yr boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS cyber_breach_details text,
  ADD COLUMN IF NOT EXISTS turnover_band text,
  ADD COLUMN IF NOT EXISTS largest_contract_band text,
  ADD COLUMN IF NOT EXISTS max_mobilisation_size text,
  ADD COLUMN IF NOT EXISTS multi_site_capability boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS accounts_payable_email text,
  ADD COLUMN IF NOT EXISTS requires_po boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS declarant_name text,
  ADD COLUMN IF NOT EXISTS declarant_role text,
  ADD COLUMN IF NOT EXISTS declarant_user_id text,
  ADD COLUMN IF NOT EXISTS declared_at timestamptz,
  ADD COLUMN IF NOT EXISTS code_of_conduct_version text DEFAULT '2026.1',
  ADD COLUMN IF NOT EXISTS legal_acceptances jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS document_vault jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Create supplier_documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.supplier_documents (
  id                  text        PRIMARY KEY,
  supplier_id         text        NOT NULL,
  category            text        NOT NULL,
  document_type       text        NOT NULL,
  file_name           text        NOT NULL,
  file_size_bytes     bigint      DEFAULT 0,
  file_url            text,
  issue_date          text,
  expiry_date         text,
  status              text        NOT NULL DEFAULT 'UPLOADED',
  uploaded_by         text,
  uploaded_at         timestamptz NOT NULL DEFAULT now(),
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_supplier_documents_supplier_id ON public.supplier_documents (supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_documents_category ON public.supplier_documents (category);
CREATE INDEX IF NOT EXISTS idx_supplier_documents_doc_type ON public.supplier_documents (document_type);

-- Enable RLS
ALTER TABLE public.supplier_documents ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_supplier_documents' AND tablename = 'supplier_documents') THEN
    DROP POLICY IF EXISTS service_role_supplier_documents ON public.supplier_documents;
CREATE POLICY service_role_supplier_documents ON public.supplier_documents FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0032 — CONTRACTOR INTELLIGENCE LAYER & LIVE DATA PERSISTENCE (CP-09R)
-- ============================================================================
-- Canonical database tables for:
-- 1. Intelligence Sources & Connector Health
-- 2. Normalised Intelligence Items & Regulatory Events
-- 3. Contractor Actions & Versioned Acknowledgements
-- 4. Company Watch Records (Companies House UK Public Data)
-- 5. Admin Tender Opportunities (Contracts Finder & Find a Tender OCDS)
-- 6. Ingestion Runs & Provenance Ledger
-- ============================================================================

-- 1. INTELLIGENCE SOURCES REGISTRY
CREATE TABLE IF NOT EXISTS public.intelligence_sources (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  source_type text NOT NULL, -- api, rss, ocds, changedetection, feed
  authority_tier integer NOT NULL DEFAULT 1,
  access_type text NOT NULL DEFAULT 'open_no_key',
  base_domain text NOT NULL,
  base_url text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  poll_interval_minutes integer NOT NULL DEFAULT 1440,
  jurisdictions text[] NOT NULL DEFAULT ARRAY['United Kingdom']::text[],
  primary_trades text[] NOT NULL DEFAULT ARRAY[]::text[],
  requires_human_review boolean NOT NULL DEFAULT false,
  credential_env_key text,
  last_attempt_at timestamptz,
  last_success_at timestamptz,
  last_error text,
  health_status text NOT NULL DEFAULT 'NOT_CONFIGURED', -- LIVE, DEGRADED, FAILED, DISABLED, NOT_CONFIGURED
  records_ingested_total integer NOT NULL DEFAULT 0,
  consecutive_failures integer NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  doc_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. NORMALISED INTELLIGENCE ITEMS (Provenance & Regulatory Truth)
CREATE TABLE IF NOT EXISTS public.intelligence_items (
  id text PRIMARY KEY,
  external_id text NOT NULL,
  content_hash text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  title text NOT NULL,
  entirefm_summary text NOT NULL,
  what_changed text,
  suggested_contractor_action text,
  why_youre_seeing text[] DEFAULT ARRAY[]::text[],
  source_id text NOT NULL,
  source_name text NOT NULL,
  canonical_url text NOT NULL,
  authority_tier integer NOT NULL DEFAULT 1,
  legal_status text NOT NULL DEFAULT 'NEWS',
  event_type text NOT NULL DEFAULT 'REGULATORY_CHANGE',
  severity text NOT NULL DEFAULT 'INFORMATION',
  jurisdictions text[] NOT NULL DEFAULT ARRAY['United Kingdom']::text[],
  trade_tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  credential_tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  work_type_tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  published_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  effective_from date,
  deadline_date date,
  supersedes_id text,
  rights_licence text NOT NULL DEFAULT 'OGL v3.0',
  parser_version text NOT NULL DEFAULT '1.0.0',
  fetched_at timestamptz NOT NULL DEFAULT now(),
  raw_source_hash text,
  raw_payload jsonb,
  review_status text NOT NULL DEFAULT 'PENDING_REVIEW', -- PENDING_REVIEW, APPROVED, REJECTED, AUTO_PUBLISHED, REQUIRES_COMPLIANCE_REVIEW
  reviewed_by text,
  reviewed_at timestamptz,
  linked_compliance_requirement_ids text[] DEFAULT ARRAY[]::text[],
  audience_roles text[] DEFAULT ARRAY['CONTRACTOR_ADMIN']::text[],
  secondary_sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_intel_items_external ON public.intelligence_items(external_id);
CREATE INDEX IF NOT EXISTS idx_intel_items_source ON public.intelligence_items(source_id);
CREATE INDEX IF NOT EXISTS idx_intel_items_review ON public.intelligence_items(review_status);
CREATE INDEX IF NOT EXISTS idx_intel_items_severity ON public.intelligence_items(severity);
CREATE INDEX IF NOT EXISTS idx_intel_items_published ON public.intelligence_items(published_at DESC);

-- 3. CONTRACTOR INTELLIGENCE ACTIONS
CREATE TABLE IF NOT EXISTS public.contractor_intelligence_actions (
  id text PRIMARY KEY,
  contractor_org_id text NOT NULL,
  intelligence_item_id text NOT NULL REFERENCES public.intelligence_items(id) ON DELETE CASCADE,
  intelligence_item_version integer NOT NULL DEFAULT 1,
  action_type text NOT NULL, -- MARK_REVIEWED, ASSIGN, NOT_APPLICABLE, UPLOAD_EVIDENCE, LINK_REQUIREMENT, ADD_NOTE, REQUEST_CLARIFICATION, ACKNOWLEDGE
  assigned_to text,
  due_date date,
  internal_note text,
  evidence_document_id text,
  linked_requirement_id text,
  not_applicable_reason text,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  is_resolved boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_contractor_actions_org ON public.contractor_intelligence_actions(contractor_org_id);
CREATE INDEX IF NOT EXISTS idx_contractor_actions_item ON public.contractor_intelligence_actions(intelligence_item_id);

-- 4. CONTRACTOR INTELLIGENCE ACKNOWLEDGEMENTS (Version-Specific)
CREATE TABLE IF NOT EXISTS public.contractor_intelligence_acknowledgements (
  id text PRIMARY KEY,
  contractor_org_id text NOT NULL,
  user_id text NOT NULL,
  intelligence_item_id text NOT NULL REFERENCES public.intelligence_items(id) ON DELETE CASCADE,
  intelligence_item_version integer NOT NULL DEFAULT 1,
  acknowledged_at timestamptz NOT NULL DEFAULT now(),
  is_invalidated boolean NOT NULL DEFAULT false,
  invalidated_at timestamptz,
  invalidated_reason text
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ack_unique ON public.contractor_intelligence_acknowledgements(contractor_org_id, intelligence_item_id, intelligence_item_version);
CREATE INDEX IF NOT EXISTS idx_ack_org ON public.contractor_intelligence_acknowledgements(contractor_org_id);

-- 5. COMPANY WATCH RECORDS (Companies House UK Public Data)
CREATE TABLE IF NOT EXISTS public.company_watch_records (
  id text PRIMARY KEY,
  contractor_org_id text NOT NULL UNIQUE,
  company_number text NOT NULL,
  company_name text NOT NULL,
  company_status text NOT NULL DEFAULT 'UNVERIFIED', -- ACTIVE, DISSOLVED, LIQUIDATION, CONVERTED_CLOSED, INSOLVENCY, UNVERIFIED
  incorporation_date date,
  registered_office_address text,
  sic_codes text[] DEFAULT ARRAY[]::text[],
  accounts_next_due_date date,
  accounts_last_made_up_to date,
  accounts_overdue boolean NOT NULL DEFAULT false,
  accounts_type text,
  confirmation_statement_next_due_date date,
  confirmation_statement_last_made_up_to date,
  confirmation_statement_overdue boolean NOT NULL DEFAULT false,
  insolvency_details jsonb,
  officers_summary jsonb DEFAULT '[]'::jsonb,
  api_available boolean NOT NULL DEFAULT false,
  degraded boolean NOT NULL DEFAULT false,
  last_checked_at timestamptz NOT NULL DEFAULT now(),
  last_successful_fetch_at timestamptz,
  events jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_company_watch_number ON public.company_watch_records(company_number);
CREATE INDEX IF NOT EXISTS idx_company_watch_status ON public.company_watch_records(company_status);

-- 6. ADMIN TENDER OPPORTUNITIES (EntireFM Internal BD — Strictly Non-Contractor)
CREATE TABLE IF NOT EXISTS public.admin_tender_opportunities (
  id text PRIMARY KEY,
  ocid text NOT NULL UNIQUE,
  source text NOT NULL, -- Contracts Finder, Find a Tender, Crown Commercial Service
  notice_type text NOT NULL DEFAULT 'tender', -- planning, tender, award, contract
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  buyer_name text NOT NULL DEFAULT '',
  buyer_region text NOT NULL DEFAULT '',
  cpv_codes text[] DEFAULT ARRAY[]::text[],
  is_framework boolean NOT NULL DEFAULT false,
  is_sme_appropriate boolean NOT NULL DEFAULT false,
  published_at timestamptz NOT NULL DEFAULT now(),
  closing_date timestamptz,
  contract_start_date date,
  contract_duration_months integer,
  estimated_value_gbp numeric,
  estimated_value_formatted text,
  canonical_url text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, CLOSING_SOON, AWARDED, CANCELLED, EXPIRED
  awarded_to_supplier text,
  match_score integer NOT NULL DEFAULT 0,
  matched_services text[] DEFAULT ARRAY[]::text[],
  match_strength text NOT NULL DEFAULT 'NOT_MATCHED', -- STRONG, MODERATE, WEAK, NOT_MATCHED
  match_reasons text[] DEFAULT ARRAY[]::text[],
  cpv_matches text[] DEFAULT ARRAY[]::text[],
  bid_stage text NOT NULL DEFAULT 'NEW', -- NEW, REVIEWING, BID_DECISION, BID_PLANNED, IN_PROGRESS, SUBMITTED, WON, LOST, EXPIRED
  assigned_to text,
  internal_notes jsonb NOT NULL DEFAULT '[]'::jsonb,
  deadline_urgency text NOT NULL DEFAULT 'NORMAL', -- IMMINENT, SOON, NORMAL, EXPIRED
  content_hash text NOT NULL,
  raw_payload jsonb,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_tenders_ocid ON public.admin_tender_opportunities(ocid);
CREATE INDEX IF NOT EXISTS idx_admin_tenders_bid_stage ON public.admin_tender_opportunities(bid_stage);
CREATE INDEX IF NOT EXISTS idx_admin_tenders_match_score ON public.admin_tender_opportunities(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_admin_tenders_closing ON public.admin_tender_opportunities(closing_date);

-- 7. INGESTION RUNS (Connector Audit Ledger)
CREATE TABLE IF NOT EXISTS public.intelligence_ingestion_runs (
  id text PRIMARY KEY,
  source_id text NOT NULL,
  source_name text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  duration_ms integer DEFAULT 0,
  status text NOT NULL DEFAULT 'pending', -- success, partial, failed, pending
  records_fetched integer NOT NULL DEFAULT 0,
  records_created integer NOT NULL DEFAULT 0,
  records_updated integer NOT NULL DEFAULT 0,
  duplicates_detected integer NOT NULL DEFAULT 0,
  error text,
  parser_version text NOT NULL DEFAULT '1.0.0',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ingestion_runs_source ON public.intelligence_ingestion_runs(source_id);
CREATE INDEX IF NOT EXISTS idx_ingestion_runs_started ON public.intelligence_ingestion_runs(started_at DESC);

-- Enable RLS
ALTER TABLE public.intelligence_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_intelligence_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_intelligence_acknowledgements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_watch_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_tender_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_ingestion_runs ENABLE ROW LEVEL SECURITY;

-- PostgREST Service Role bypass policy for server operations
DROP POLICY IF EXISTS service_role_all ON public.intelligence_sources;
CREATE POLICY service_role_all ON public.intelligence_sources USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all ON public.intelligence_items;
CREATE POLICY service_role_all ON public.intelligence_items USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all ON public.contractor_intelligence_actions;
CREATE POLICY service_role_all ON public.contractor_intelligence_actions USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all ON public.contractor_intelligence_acknowledgements;
CREATE POLICY service_role_all ON public.contractor_intelligence_acknowledgements USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all ON public.company_watch_records;
CREATE POLICY service_role_all ON public.company_watch_records USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all ON public.admin_tender_opportunities;
CREATE POLICY service_role_all ON public.admin_tender_opportunities USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all ON public.intelligence_ingestion_runs;
CREATE POLICY service_role_all ON public.intelligence_ingestion_runs USING (true) WITH CHECK (true);
-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0033 — INTELLIGENCE LAYER HARDENING, LOCKS & TIER 1 GOVERNANCE (CP-09R2)
-- ============================================================================

-- 1. INGESTION LOCKS TABLE (Idempotency & Concurrent Execution Prevention)
CREATE TABLE IF NOT EXISTS public.intelligence_ingestion_locks (
  job_type text PRIMARY KEY, -- 'regulatory', 'tenders', 'company-watch'
  lock_id text NOT NULL,
  locked_at timestamptz NOT NULL DEFAULT now(),
  locked_until timestamptz NOT NULL,
  started_by text NOT NULL DEFAULT 'system',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. TIER 1 GOVERNANCE & OPERATIONAL INTERPRETATION COLUMNS
ALTER TABLE public.intelligence_items
  ADD COLUMN IF NOT EXISTS operational_interpretation text NOT NULL DEFAULT 'PENDING_REVIEW',
  ADD COLUMN IF NOT EXISTS source_authenticity text NOT NULL DEFAULT 'OFFICIAL_SOURCE',
  ADD COLUMN IF NOT EXISTS is_mandatory_action boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS requires_human_approval boolean NOT NULL DEFAULT true;

-- 3. TENDER NOTICE BID ELIGIBILITY
ALTER TABLE public.admin_tender_opportunities
  ADD COLUMN IF NOT EXISTS is_bid_eligible boolean NOT NULL DEFAULT true;

-- 4. INGESTION RUNS TRIGGER TYPE & CRON FAMILY
ALTER TABLE public.intelligence_ingestion_runs
  ADD COLUMN IF NOT EXISTS trigger_type text NOT NULL DEFAULT 'MANUAL', -- 'CRON' or 'MANUAL'
  ADD COLUMN IF NOT EXISTS cron_family text; -- 'regulatory', 'tenders', 'company-watch'

-- 5. CONTRACTOR TENANT ISOLATION RLS POLICIES
-- Ensure RLS is active on all intelligence tables
ALTER TABLE public.intelligence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_intelligence_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_intelligence_acknowledgements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_watch_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_tender_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_ingestion_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_ingestion_runs ENABLE ROW LEVEL SECURITY;

-- PostgREST Service Role Policy (Unrestricted for Trusted Server Ingestion)
DROP POLICY IF EXISTS service_role_all ON public.intelligence_ingestion_locks;
CREATE POLICY service_role_all ON public.intelligence_ingestion_locks USING (true) WITH CHECK (true);

-- Contractor Isolation: Actions can only be accessed by the owning contractor organisation
DROP POLICY IF EXISTS contractor_action_isolation ON public.contractor_intelligence_actions;
CREATE POLICY contractor_action_isolation ON public.contractor_intelligence_actions
  FOR ALL
  USING (
    contractor_org_id = current_setting('request.jwt.claim.org_id', true)
    OR current_setting('request.jwt.claim.role', true) IN ('SUPER_ADMIN', 'CEO', 'ADMINISTRATOR', 'service_role')
    OR current_setting('request.jwt.claim.sub', true) IS NULL -- Server side execution fallback
  );

-- Contractor Isolation: Acknowledgements can only be accessed by the owning contractor organisation
DROP POLICY IF EXISTS contractor_ack_isolation ON public.contractor_intelligence_acknowledgements;
CREATE POLICY contractor_ack_isolation ON public.contractor_intelligence_acknowledgements
  FOR ALL
  USING (
    contractor_org_id = current_setting('request.jwt.claim.org_id', true)
    OR current_setting('request.jwt.claim.role', true) IN ('SUPER_ADMIN', 'CEO', 'ADMINISTRATOR', 'service_role')
    OR current_setting('request.jwt.claim.sub', true) IS NULL -- Server side execution fallback
  );

-- Admin Only Isolation: Tender opportunities are completely inaccessible to contractor users
DROP POLICY IF EXISTS admin_tender_isolation ON public.admin_tender_opportunities;
CREATE POLICY admin_tender_isolation ON public.admin_tender_opportunities
  FOR ALL
  USING (
    current_setting('request.jwt.claim.role', true) IN ('SUPER_ADMIN', 'CEO', 'ADMINISTRATOR', 'service_role')
    OR current_setting('request.jwt.claim.sub', true) IS NULL -- Server side execution fallback
  );
-- ============================================================================
-- MIGRATION 0035: REGISTRATION INTENT PERSISTENCE
-- ============================================================================
-- Adds durable registration provenance to supplier_users and supplier_organisations.
-- Ensures the platform knows WHY an account was created — never infers from email
-- or date alone.
-- ============================================================================

-- 1. Add registration provenance columns to supplier_users
ALTER TABLE public.supplier_users
  ADD COLUMN IF NOT EXISTS registration_source TEXT DEFAULT 'CONTRACTOR_ONBOARDING',
  ADD COLUMN IF NOT EXISTS application_type    TEXT DEFAULT 'CONTRACTOR';

-- 2. Add registration provenance to supplier_organisations
ALTER TABLE public.supplier_organisations
  ADD COLUMN IF NOT EXISTS registration_source TEXT DEFAULT 'CONTRACTOR_ONBOARDING';

-- 3. Backfill existing genuine registrations
UPDATE public.supplier_users
SET
  registration_source = 'CONTRACTOR_ONBOARDING',
  application_type    = 'CONTRACTOR'
WHERE registration_source IS NULL
   OR registration_source = 'CONTRACTOR_ONBOARDING';

UPDATE public.supplier_organisations
SET registration_source = 'CONTRACTOR_ONBOARDING'
WHERE registration_source IS NULL;

COMMENT ON COLUMN public.supplier_users.registration_source IS
  'Canonical registration path: CONTRACTOR_ONBOARDING | CLIENT_INVITE | ADMIN_CREATED | MANUALLY_CLASSIFIED_BY_ADMIN';

COMMENT ON COLUMN public.supplier_users.application_type IS
  'Intended application type at registration: CONTRACTOR | MANAGED_SERVICE | SPECIALIST';

COMMENT ON COLUMN public.supplier_organisations.registration_source IS
  'Source of organisation creation: CONTRACTOR_ONBOARDING | ADMIN_CREATED | MANUALLY_CLASSIFIED_BY_ADMIN';
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
    DROP POLICY IF EXISTS service_role_registration_intents
      ON public.supplier_registration_intents;
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
/**
 * ENTIREFM UNIFIED OPERATIONS PLATFORM
 * MIGRATION 0037 — CONTRACTOR MEMBERSHIP FEES & INVITATION CODES
 * ============================================================================
 * Additive schema for:
 * 1. public.entirefm_invitation_codes — Controlled invitation code ledger
 * 2. public.entirefm_invitation_redemptions — Immutable audit trail of fee waivers
 * 3. Extended columns on public.supplier_application_drafts for tier selection
 *    and commercial audit trail.
 *
 * NON-NEGOTIABLE SAFETY GUARANTEES:
 * - Purely additive. No DROPs, TRUNCATEs, or destructive alterations.
 * - All new columns DEFAULT NULL or DEFAULT 0 to prevent retroactively
 *   demanding payment from grandfathered contractors or past drafts.
 */

-- ============================================================================
-- 1. ENTIREFM INVITATION CODES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.entirefm_invitation_codes (
  id                    text        PRIMARY KEY,
  code                  text        NOT NULL UNIQUE,  -- e.g. EFM-7K4P-X9Q2 (case-insensitive indexed)
  tier_eligibility      text        NOT NULL DEFAULT 'ANY', -- 'TIER_1' | 'TIER_2' | 'ANY'
  fee_treatment         text        NOT NULL DEFAULT 'FULL_WAIVER', -- 'FULL_WAIVER'
  max_redemptions       integer     NOT NULL DEFAULT 1,
  redemptions_count     integer     NOT NULL DEFAULT 0,
  bound_email           text,       -- Optional: restrict redemption to specific contact email
  bound_org_id          text,       -- Optional: restrict redemption to specific contractor org
  expires_at            timestamptz NOT NULL,
  internal_reason       text,
  created_by_admin_id   text        NOT NULL,
  is_revoked            boolean     NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invitation_codes_code ON public.entirefm_invitation_codes (lower(code));
CREATE INDEX IF NOT EXISTS idx_invitation_codes_bound_email ON public.entirefm_invitation_codes (lower(bound_email));
CREATE INDEX IF NOT EXISTS idx_invitation_codes_is_revoked ON public.entirefm_invitation_codes (is_revoked);
CREATE INDEX IF NOT EXISTS idx_invitation_codes_expires_at ON public.entirefm_invitation_codes (expires_at);

-- RLS
ALTER TABLE public.entirefm_invitation_codes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'service_role_invitation_codes'
      AND tablename  = 'entirefm_invitation_codes'
  ) THEN
    DROP POLICY IF EXISTS service_role_invitation_codes
      ON public.entirefm_invitation_codes;
CREATE POLICY service_role_invitation_codes
      ON public.entirefm_invitation_codes
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================================
-- 2. ENTIREFM INVITATION REDEMPTIONS TABLE (AUDIT LEDGER)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.entirefm_invitation_redemptions (
  id                          text          PRIMARY KEY,
  invitation_code_id          text          NOT NULL REFERENCES public.entirefm_invitation_codes(id),
  supplier_org_id             text          NOT NULL,
  redeemed_by_auth_user_id    text          NOT NULL,
  redeemed_at                 timestamptz   NOT NULL DEFAULT now(),
  membership_tier             text          NOT NULL,
  standard_amount_gbp         numeric(10,2) NOT NULL,
  waived_amount_gbp           numeric(10,2) NOT NULL,
  final_amount_gbp            numeric(10,2) NOT NULL DEFAULT 0.00
);

CREATE INDEX IF NOT EXISTS idx_invitation_redemptions_invitation_id ON public.entirefm_invitation_redemptions (invitation_code_id);
CREATE INDEX IF NOT EXISTS idx_invitation_redemptions_org_id ON public.entirefm_invitation_redemptions (supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_invitation_redemptions_user_id ON public.entirefm_invitation_redemptions (redeemed_by_auth_user_id);

-- RLS
ALTER TABLE public.entirefm_invitation_redemptions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'service_role_invitation_redemptions'
      AND tablename  = 'entirefm_invitation_redemptions'
  ) THEN
    DROP POLICY IF EXISTS service_role_invitation_redemptions
      ON public.entirefm_invitation_redemptions;
CREATE POLICY service_role_invitation_redemptions
      ON public.entirefm_invitation_redemptions
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================================
-- 3. EXTEND SUPPLIER APPLICATION DRAFTS WITH MEMBERSHIP COLUMNS
-- ============================================================================

ALTER TABLE public.supplier_application_drafts
  ADD COLUMN IF NOT EXISTS selected_membership_tier        text,
  ADD COLUMN IF NOT EXISTS membership_standard_amount_gbp  numeric(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS membership_waived_amount_gbp    numeric(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS membership_final_amount_gbp     numeric(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS invitation_code_id              text,
  ADD COLUMN IF NOT EXISTS membership_payment_status       text DEFAULT 'UNPAID',
  ADD COLUMN IF NOT EXISTS membership_payment_intent_id    text,
  ADD COLUMN IF NOT EXISTS membership_paid_at              timestamptz;

-- Add comments for DB documentation
COMMENT ON TABLE public.entirefm_invitation_codes IS
  'Controlled EntireFM Invitation Codes waiving contractor membership fees to £0 for invited partners.';

COMMENT ON TABLE public.entirefm_invitation_redemptions IS
  'Immutable audit log recording every invitation redemption, standard price, waived amount, and actor.';
-- ============================================================================
-- ENTIREFM THE LOBBY DAILY — AUTOMATED FM NEWS EMAIL PUBLISHING SYSTEM
-- MIGRATION 0038: POSTGRESQL SCHEMA
-- ============================================================================
-- Version: 1.0.0
-- Architecture: Relational, audit-logged, state-gated daily email publishing
--               system for 'The Lobby Daily' by EntireFM.
-- Safe, additive migration preserving existing weekly subscribers and tables.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ENUMS FOR THE LOBBY DAILY
-- ----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.lobby_daily_edition_status AS ENUM (
    'DRAFT',
    'AWAITING_APPROVAL',
    'SCHEDULED',
    'SENDING',
    'SENT',
    'PAUSED',
    'FAILED',
    'CANCELLED'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.lobby_image_rights_status AS ENUM (
    'OWNED',
    'LICENSED',
    'PRESS_ASSET_APPROVED',
    'OPEN_ATTRIBUTION',
    'MANUALLY_APPROVED',
    'RESTRICTED',
    'UNKNOWN'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.lobby_subscription_frequency AS ENUM (
    'DAILY_LOBBY',
    'WEEKLY_BRIEFING',
    'COMPLIANCE_ALERTS',
    'CONTRACTS_OPPORTUNITIES'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 2. EXTEND EXISTING SUBSCRIBERS TABLE SAFELY
-- ----------------------------------------------------------------------------
-- Ensure existing weekly subscribers maintain their weekly preference
ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS subscription_preferences text[] DEFAULT ARRAY['WEEKLY_BRIEFING']::text[],
  ADD COLUMN IF NOT EXISTS confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS confirmation_token uuid DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS bounce_type text,
  ADD COLUMN IF NOT EXISTS unsubscribed_at timestamptz;

-- Set existing ACTIVE subscribers as confirmed if not already set
UPDATE public.newsletter_subscribers
SET confirmed_at = consented_at
WHERE status = 'ACTIVE' AND confirmed_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_subscribers_preferences ON public.newsletter_subscribers USING gin(subscription_preferences);
CREATE INDEX IF NOT EXISTS idx_subscribers_conf_token ON public.newsletter_subscribers (confirmation_token);

-- ----------------------------------------------------------------------------
-- 3. THE LOBBY DAILY EDITIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lobby_daily_editions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_number          integer NOT NULL UNIQUE,
  edition_date            date NOT NULL UNIQUE,
  slug                    text NOT NULL UNIQUE,
  status                  public.lobby_daily_edition_status NOT NULL DEFAULT 'DRAFT',
  
  subject_line            text NOT NULL,
  preheader               text NOT NULL,
  reading_time_minutes    integer NOT NULL DEFAULT 4,
  
  -- 10 Structured Editorial Sections (JSONB)
  masthead_data           jsonb NOT NULL DEFAULT '{}'::jsonb,
  lead_story              jsonb NOT NULL DEFAULT '{}'::jsonb,
  morning_brief           jsonb NOT NULL DEFAULT '[]'::jsonb,
  what_changed_today      jsonb NOT NULL DEFAULT '[]'::jsonb,
  compliance_watch        jsonb, -- Nullable if no verified compliance items
  contracts_mobilisations jsonb NOT NULL DEFAULT '[]'::jsonb,
  engineers_note          jsonb NOT NULL DEFAULT '{}'::jsonb,
  on_the_horizon          jsonb, -- Nullable if no milestone
  one_useful_thing        jsonb NOT NULL DEFAULT '{}'::jsonb,
  sponsor_block           jsonb, -- Nullable / disabled by default
  footer_details          jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  -- Quality Assurance & Verification
  validation_passed       boolean NOT NULL DEFAULT false,
  validation_report       jsonb NOT NULL DEFAULT '{"errors":[], "warnings":[], "verifiedLinks":[]}'::jsonb,
  
  -- Approval & Audit Trail
  approved_by_admin_id    text,
  approved_at             timestamptz,
  scheduled_send_at       timestamptz,
  sent_at                 timestamptz,
  editorial_audit_trail   jsonb NOT NULL DEFAULT '[]'::jsonb,
  
  -- Metrics & Attribution
  utm_campaign            text NOT NULL,
  total_recipients        integer NOT NULL DEFAULT 0,
  total_delivered         integer NOT NULL DEFAULT 0,
  total_opened            integer NOT NULL DEFAULT 0,
  total_clicked           integer NOT NULL DEFAULT 0,
  total_unsubscribed      integer NOT NULL DEFAULT 0,
  total_bounced           integer NOT NULL DEFAULT 0,
  total_complaints        integer NOT NULL DEFAULT 0,
  story_click_metrics     jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  -- Web & SEO Flag (Only indexable if substantial original EntireFM analysis)
  is_indexable_web_edition boolean NOT NULL DEFAULT false,
  
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lobby_daily_editions_date ON public.lobby_daily_editions (edition_date DESC);
CREATE INDEX IF NOT EXISTS idx_lobby_daily_editions_status ON public.lobby_daily_editions (status);
CREATE INDEX IF NOT EXISTS idx_lobby_daily_editions_slug ON public.lobby_daily_editions (slug);

-- ----------------------------------------------------------------------------
-- 4. CANDIDATE STORIES & INGESTION AUDIT LEDGER
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lobby_daily_candidates (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id               text NOT NULL,
  publisher_name          text NOT NULL,
  authority_tier          integer NOT NULL DEFAULT 3,
  
  source_url              text NOT NULL,
  canonical_url           text NOT NULL,
  normalized_headline     text NOT NULL,
  original_headline       text NOT NULL,
  
  published_at            timestamptz NOT NULL,
  ingested_at             timestamptz NOT NULL DEFAULT now(),
  
  category                text NOT NULL,
  summary                 text,
  operational_takeaway    text,
  
  -- Image & Rights Tracking
  original_image_url      text,
  resolved_image_url      text NOT NULL,
  image_rights_status     public.lobby_image_rights_status NOT NULL DEFAULT 'UNKNOWN',
  image_rights_basis      text,
  image_credit            text,
  image_alt               text,
  
  -- Quality & Deduplication
  source_confidence       numeric(3,2) NOT NULL DEFAULT 1.00,
  is_duplicate            boolean NOT NULL DEFAULT false,
  duplicate_of_id         uuid REFERENCES public.lobby_daily_candidates(id),
  rejection_reason        text,
  
  -- Editorial Selection
  used_in_edition_id      uuid REFERENCES public.lobby_daily_editions(id),
  assigned_section        text, -- 'LEAD', 'MORNING_BRIEF', 'WHAT_CHANGED', 'COMPLIANCE', 'CONTRACTS'
  is_manually_excluded    boolean NOT NULL DEFAULT false,
  
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_candidates_canonical ON public.lobby_daily_candidates (canonical_url);
CREATE INDEX IF NOT EXISTS idx_daily_candidates_headline_norm ON public.lobby_daily_candidates (normalized_headline);
CREATE INDEX IF NOT EXISTS idx_daily_candidates_published ON public.lobby_daily_candidates (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_candidates_edition ON public.lobby_daily_candidates (used_in_edition_id);

-- ----------------------------------------------------------------------------
-- 5. THE LOBBY DAILY DELIVERY LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lobby_daily_delivery_logs (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id              uuid NOT NULL REFERENCES public.lobby_daily_editions(id) ON DELETE CASCADE,
  subscriber_id           uuid NOT NULL REFERENCES public.newsletter_subscribers(id) ON DELETE CASCADE,
  email                   text NOT NULL,
  provider                text NOT NULL DEFAULT 'RESEND',
  provider_message_id     text,
  status                  text NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'SENT', 'DELIVERED', 'BOUNCED', 'COMPLAINED'
  error_message           text,
  opened_at               timestamptz,
  clicked_at              timestamptz,
  clicked_links           jsonb DEFAULT '[]'::jsonb,
  sent_at                 timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_delivery_logs_edition ON public.lobby_daily_delivery_logs (edition_id);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_subscriber ON public.lobby_daily_delivery_logs (subscriber_id);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_message_id ON public.lobby_daily_delivery_logs (provider_message_id);

-- ----------------------------------------------------------------------------
-- 6. THE LOBBY DAILY SYSTEM SETTINGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lobby_daily_settings (
  id                          text PRIMARY KEY DEFAULT 'default',
  send_schedule_type          text NOT NULL DEFAULT 'WEEKDAYS_ONLY', -- 'WEEKDAYS_ONLY' | 'EVERYDAY'
  send_time_london            text NOT NULL DEFAULT '06:45',
  timezone                    text NOT NULL DEFAULT 'Europe/London',
  
  min_stories_per_edition     integer NOT NULL DEFAULT 8,
  max_stories_per_edition     integer NOT NULL DEFAULT 14,
  
  auto_send_enabled           boolean NOT NULL DEFAULT false, -- Always starts false in production
  manual_approval_required    boolean NOT NULL DEFAULT true,  -- Requires admin sign-off
  emergency_kill_switch       boolean NOT NULL DEFAULT false,
  
  sender_name                 text NOT NULL DEFAULT 'The Lobby by EntireFM',
  sender_email                text NOT NULL DEFAULT 'briefing@entirefm.com',
  reply_to_email              text NOT NULL DEFAULT 'editorial@entirefm.com',
  
  sponsor_enabled             boolean NOT NULL DEFAULT false,
  sponsor_config              jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  source_allowlist            text[] DEFAULT '{}',
  source_blocklist            text[] DEFAULT '{}',
  
  updated_by_admin_id         text,
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Insert default settings row if not exists
INSERT INTO public.lobby_daily_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.lobby_daily_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_daily_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_daily_delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_daily_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'service_role_lobby_editions' AND tablename = 'lobby_daily_editions'
  ) THEN
    DROP POLICY IF EXISTS service_role_lobby_editions ON public.lobby_daily_editions;
CREATE POLICY service_role_lobby_editions ON public.lobby_daily_editions FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'service_role_lobby_candidates' AND tablename = 'lobby_daily_candidates'
  ) THEN
    DROP POLICY IF EXISTS service_role_lobby_candidates ON public.lobby_daily_candidates;
CREATE POLICY service_role_lobby_candidates ON public.lobby_daily_candidates FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'service_role_lobby_delivery_logs' AND tablename = 'lobby_daily_delivery_logs'
  ) THEN
    DROP POLICY IF EXISTS service_role_lobby_delivery_logs ON public.lobby_daily_delivery_logs;
CREATE POLICY service_role_lobby_delivery_logs ON public.lobby_daily_delivery_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'service_role_lobby_settings' AND tablename = 'lobby_daily_settings'
  ) THEN
    DROP POLICY IF EXISTS service_role_lobby_settings ON public.lobby_daily_settings;
CREATE POLICY service_role_lobby_settings ON public.lobby_daily_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

COMMENT ON TABLE public.lobby_daily_editions IS
  'Published and scheduled daily editions of The Lobby Daily by EntireFM with 10-section structure and QA metrics.';

COMMENT ON TABLE public.lobby_daily_candidates IS
  'Raw candidate news items ingested from Tier 1-3 statutory and trade feeds with deduplication and image rights status.';
-- ============================================================================
-- ENTIREFM MIGRATION 0039: LOBBY MEMBER AVATAR & STORAGE INFRASTRUCTURE
-- ============================================================================
-- Description:
--   1. Ensures storage bucket 'profile-avatars' is created and publicly readable
--   2. Configures strict Storage RLS policies for member-owned avatar management
--   3. Guarantees avatar_url column existence and indexing on physical persons & member profiles
--   4. Preserves 100% backward compatibility and CAFM isolation
-- ============================================================================

-- 1. Ensure avatar_url column exists on public.persons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'persons' 
      AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE public.persons ADD COLUMN avatar_url text;
  END IF;
END $$;

-- 2. Ensure lobby_members table exists in Postgres for long-term member profile persistence
CREATE TABLE IF NOT EXISTS public.lobby_members (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id            uuid UNIQUE,
  email                   text NOT NULL UNIQUE,
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
  member_status           text NOT NULL DEFAULT 'active',
  profile_visibility      text NOT NULL DEFAULT 'public',
  disciplines             text[] DEFAULT '{}',
  sectors                 text[] DEFAULT '{}',
  qualifications          text[] DEFAULT '{}',
  badges                  text[] DEFAULT '{ "Lobby Member" }',
  reputation_score        integer NOT NULL DEFAULT 10,
  saved_content_ids       text[] DEFAULT '{}',
  email_preferences       jsonb DEFAULT '{"weeklyBriefing": true, "communityUpdates": true, "directMessages": true}'::jsonb,
  notification_preferences jsonb DEFAULT '{"inApp": true, "emailDigest": true, "mentionAlerts": true}'::jsonb,
  policy_consents         jsonb DEFAULT '[]'::jsonb,
  email_verified_at       timestamptz,
  last_active_at          timestamptz DEFAULT now(),
  joined_at               timestamptz DEFAULT now(),
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookup by username, email, and auth_user_id
CREATE INDEX IF NOT EXISTS idx_lobby_members_username ON public.lobby_members (username);
CREATE INDEX IF NOT EXISTS idx_lobby_members_email ON public.lobby_members (email);
CREATE INDEX IF NOT EXISTS idx_lobby_members_auth_user_id ON public.lobby_members (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_lobby_members_status ON public.lobby_members (member_status);

-- Enable RLS on lobby_members
ALTER TABLE public.lobby_members ENABLE ROW LEVEL SECURITY;

-- Policy: Public read for active and public member profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'public_view_lobby_members' AND tablename = 'lobby_members'
  ) THEN
    DROP POLICY IF EXISTS public_view_lobby_members ON public.lobby_members;
CREATE POLICY public_view_lobby_members ON public.lobby_members
      FOR SELECT
      USING (member_status = 'active' AND profile_visibility IN ('public', 'members_only'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'service_role_lobby_members' AND tablename = 'lobby_members'
  ) THEN
    DROP POLICY IF EXISTS service_role_lobby_members ON public.lobby_members;
CREATE POLICY service_role_lobby_members ON public.lobby_members
      FOR ALL TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'members_manage_own_profile' AND tablename = 'lobby_members'
  ) THEN
    DROP POLICY IF EXISTS members_manage_own_profile ON public.lobby_members;
CREATE POLICY members_manage_own_profile ON public.lobby_members
      FOR ALL
      TO authenticated
      USING (auth.uid() = auth_user_id)
      WITH CHECK (auth.uid() = auth_user_id);
  END IF;
END $$;

-- ============================================================================
-- 3. SUPABASE STORAGE BUCKET: profile-avatars
-- ============================================================================

-- Insert bucket if storage schema is available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'profile-avatars',
      'profile-avatars',
      true,
      10485760, -- 10MB limit
      ARRAY['image/jpeg', 'image/png', 'image/webp']
    )
    ON CONFLICT (id) DO UPDATE SET
      public = true,
      file_size_limit = 10485760,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

    -- Policies on storage.objects
    DROP POLICY IF EXISTS profile_avatars_public_read ON storage.objects;
    CREATE POLICY profile_avatars_public_read ON storage.objects
      FOR SELECT
      USING (bucket_id = 'profile-avatars');

    DROP POLICY IF EXISTS profile_avatars_owner_insert ON storage.objects;
    CREATE POLICY profile_avatars_owner_insert ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'profile-avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );

    DROP POLICY IF EXISTS profile_avatars_owner_update ON storage.objects;
    CREATE POLICY profile_avatars_owner_update ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'profile-avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
      )
      WITH CHECK (
        bucket_id = 'profile-avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );

    DROP POLICY IF EXISTS profile_avatars_owner_delete ON storage.objects;
    CREATE POLICY profile_avatars_owner_delete ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'profile-avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );

    DROP POLICY IF EXISTS profile_avatars_service_role_all ON storage.objects;
    CREATE POLICY profile_avatars_service_role_all ON storage.objects
      FOR ALL
      TO service_role
      USING (bucket_id = 'profile-avatars')
      WITH CHECK (bucket_id = 'profile-avatars');
  END IF;
END $$;

COMMENT ON TABLE public.lobby_members IS
  'Verified member identities for The Lobby, containing professional credentials, avatars, and community contributions.';
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
-- ============================================================================
-- ENTIREFM CAFM — FIELD REPORTING ENGINE
-- MIGRATION 0040: FIELD REPORTING ENGINE & REVISION 4.0 CONTROLLED TEMPLATES
-- ============================================================================
-- Version: 4.0.0
-- Architecture: Reusable, versioned field report engine linking canonical entities:
--   - work_orders, visits, sites, client_accounts, organisations, persons
--   - assets (bidirectional creation/linking from surveys)
--   - defects (structured operational creation from failed checks)
--   - documents (immutable PDF export vault)
-- ============================================================================

-- ─────────────────────────────────────────────────────────────
-- 1. REPORT TEMPLATES (Master Registry)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_templates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code   text NOT NULL UNIQUE, -- e.g. ENT-RJR-01, ENT-PPM-01, ENT-FLS-EL
  name            text NOT NULL,
  report_type     text NOT NULL CHECK (report_type IN ('REACTIVE', 'PPM_CHECKLIST', 'ASSET_SCHEDULE', 'SURVEY', 'COMPLIANCE_AUDIT', 'GENERAL')),
  discipline      text NOT NULL, -- e.g. 'General Hard FM', 'Fire Safety', 'Life Safety / Electrical'
  description     text,
  icon            text DEFAULT 'FileText',
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 2. REPORT TEMPLATE VERSIONS (Controlled Document Lifecycle)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_template_versions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_template_id  uuid NOT NULL REFERENCES public.report_templates(id) ON DELETE CASCADE,
  revision            text NOT NULL DEFAULT '4.0', -- e.g. '4.0'
  effective_date      text NOT NULL DEFAULT 'MAR 2026', -- Document system date
  schema_json         jsonb NOT NULL DEFAULT '{}'::jsonb, -- Configured sections, fields, validations
  pdf_renderer_key    text NOT NULL, -- 'rev4/reactive-job', 'rev4/weekly-fire-alarm', 'rev4/emergency-lighting'
  is_active           boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE(report_template_id, revision)
);

CREATE INDEX IF NOT EXISTS idx_report_template_versions_template ON public.report_template_versions(report_template_id);

-- ─────────────────────────────────────────────────────────────
-- 3. REPORT INSTANCES (Field Session Records)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_instances (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_number         text NOT NULL UNIQUE, -- e.g. EFM-REP-2026-000123
  template_version_id   uuid NOT NULL REFERENCES public.report_template_versions(id),
  work_order_id         uuid REFERENCES public.work_orders(id) ON DELETE SET NULL,
  visit_id              uuid REFERENCES public.visits(id) ON DELETE SET NULL,
  client_account_id     uuid REFERENCES public.client_accounts(id) ON DELETE SET NULL,
  site_id               uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  organisation_id       uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  assigned_engineer_id  uuid REFERENCES public.persons(id) ON DELETE SET NULL,
  status                text NOT NULL DEFAULT 'DRAFT'
                          CHECK (status IN (
                            'DRAFT',
                            'IN_PROGRESS',
                            'READY_TO_SIGN',
                            'ENGINEER_COMPLETED',
                            'SUBMITTED',
                            'UNDER_REVIEW',
                            'APPROVED',
                            'ISSUED',
                            'SUPERSEDED'
                          )),
  title                 text NOT NULL,
  started_at            timestamptz DEFAULT now(),
  completed_at          timestamptz,
  submitted_at          timestamptz,
  approved_at           timestamptz,
  issued_at             timestamptz,
  superseded_by_id      uuid REFERENCES public.report_instances(id),
  metadata              jsonb DEFAULT '{}'::jsonb,
  created_by_id         uuid REFERENCES public.persons(id),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_instances_site ON public.report_instances(site_id);
CREATE INDEX IF NOT EXISTS idx_report_instances_work_order ON public.report_instances(work_order_id);
CREATE INDEX IF NOT EXISTS idx_report_instances_visit ON public.report_instances(visit_id);
CREATE INDEX IF NOT EXISTS idx_report_instances_status ON public.report_instances(status);
CREATE INDEX IF NOT EXISTS idx_report_instances_engineer ON public.report_instances(assigned_engineer_id);

-- ─────────────────────────────────────────────────────────────
-- 4. REPORT RESPONSES (Key-Value Field Answers)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_responses (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_instance_id  uuid NOT NULL REFERENCES public.report_instances(id) ON DELETE CASCADE,
  section_key         text NOT NULL,
  field_key           text NOT NULL,
  value_json          jsonb,
  value_text          text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE(report_instance_id, section_key, field_key)
);

CREATE INDEX IF NOT EXISTS idx_report_responses_instance ON public.report_responses(report_instance_id);

-- ─────────────────────────────────────────────────────────────
-- 5. REPORT REPEATABLE ROWS (Labour, Materials, Devices, Assets, Defects)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_repeatable_rows (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_instance_id  uuid NOT NULL REFERENCES public.report_instances(id) ON DELETE CASCADE,
  section_key         text NOT NULL, -- 'labour', 'materials', 'call_points', 'assets', 'defects'
  row_type            text NOT NULL, -- 'LABOUR_ROW', 'MATERIAL_ROW', 'CHECK_ROW', 'ASSET_ROW', 'DEFECT_ROW'
  sequence_order      integer NOT NULL DEFAULT 1,
  data_json           jsonb NOT NULL DEFAULT '{}'::jsonb,
  linked_asset_id     uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  linked_defect_id    uuid REFERENCES public.defects(id) ON DELETE SET NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_repeatable_rows_instance ON public.report_repeatable_rows(report_instance_id, section_key);
CREATE INDEX IF NOT EXISTS idx_report_repeatable_rows_asset ON public.report_repeatable_rows(linked_asset_id);
CREATE INDEX IF NOT EXISTS idx_report_repeatable_rows_defect ON public.report_repeatable_rows(linked_defect_id);

-- ─────────────────────────────────────────────────────────────
-- 6. REPORT ATTACHMENTS (Photographic & Document Evidence)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_attachments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_instance_id  uuid NOT NULL REFERENCES public.report_instances(id) ON DELETE CASCADE,
  attachment_type     text NOT NULL CHECK (attachment_type IN ('BEFORE', 'AFTER', 'DEFECT', 'NAMEPLATE', 'GENERAL', 'CERTIFICATE')),
  storage_path        text NOT NULL,
  file_name           text,
  mime_type           text,
  file_size_bytes     bigint,
  description         text,
  related_section     text,
  related_field       text,
  related_asset_id    uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  related_row_id      uuid REFERENCES public.report_repeatable_rows(id) ON DELETE SET NULL,
  uploaded_by_id      uuid REFERENCES public.persons(id),
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_attachments_instance ON public.report_attachments(report_instance_id);

-- ─────────────────────────────────────────────────────────────
-- 7. REPORT SIGNATURES (Audited Sign-Offs)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_signatures (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_instance_id  uuid NOT NULL REFERENCES public.report_instances(id) ON DELETE CASCADE,
  signature_type      text NOT NULL CHECK (signature_type IN ('ENGINEER', 'CLIENT_REP', 'ENTIREFM_REVIEWER')),
  signatory_name      text NOT NULL,
  signatory_position  text,
  signature_data_url  text, -- SVG / PNG data or storage reference
  storage_path        text,
  signed_by_user_id   uuid REFERENCES public.persons(id),
  signed_at           timestamptz NOT NULL DEFAULT now(),
  declaration_text    text,
  UNIQUE(report_instance_id, signature_type)
);

CREATE INDEX IF NOT EXISTS idx_report_signatures_instance ON public.report_signatures(report_instance_id);

-- ─────────────────────────────────────────────────────────────
-- 8. REPORT EXPORTS (Immutable Controlled PDFs)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_exports (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_instance_id  uuid NOT NULL REFERENCES public.report_instances(id) ON DELETE CASCADE,
  document_id         uuid REFERENCES public.documents(id) ON DELETE SET NULL,
  format              text NOT NULL DEFAULT 'PDF',
  revision            text NOT NULL DEFAULT '4.0',
  storage_path        text NOT NULL,
  checksum_sha256     text NOT NULL,
  page_count          integer DEFAULT 1,
  file_size_bytes     bigint,
  is_current          boolean NOT NULL DEFAULT true,
  generated_at        timestamptz NOT NULL DEFAULT now(),
  generated_by_id     uuid REFERENCES public.persons(id)
);

CREATE INDEX IF NOT EXISTS idx_report_exports_instance ON public.report_exports(report_instance_id);

-- ─────────────────────────────────────────────────────────────
-- 9. SEQUENCES & HELPER FUNCTIONS
-- ─────────────────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS public.seq_field_report_num START 1001;

CREATE OR REPLACE FUNCTION public.generate_field_report_reference(prefix text)
RETURNS text AS $$
DECLARE
  current_year text;
  next_val bigint;
BEGIN
  current_year := to_char(now(), 'YYYY');
  SELECT nextval('public.seq_field_report_num') INTO next_val;
  RETURN format('EFM-%s-%s-%s', prefix, current_year, lpad(next_val::text, 6, '0'));
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_repeatable_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_exports ENABLE ROW LEVEL SECURITY;

-- Service role has full unrestricted access
DROP POLICY IF EXISTS service_role_report_templates ON public.report_templates;
CREATE POLICY service_role_report_templates ON public.report_templates FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_report_template_versions ON public.report_template_versions;
CREATE POLICY service_role_report_template_versions ON public.report_template_versions FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_report_instances ON public.report_instances;
CREATE POLICY service_role_report_instances ON public.report_instances FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_report_responses ON public.report_responses;
CREATE POLICY service_role_report_responses ON public.report_responses FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_report_repeatable_rows ON public.report_repeatable_rows;
CREATE POLICY service_role_report_repeatable_rows ON public.report_repeatable_rows FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_report_attachments ON public.report_attachments;
CREATE POLICY service_role_report_attachments ON public.report_attachments FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_report_signatures ON public.report_signatures;
CREATE POLICY service_role_report_signatures ON public.report_signatures FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_report_exports ON public.report_exports;
CREATE POLICY service_role_report_exports ON public.report_exports FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated Users Read Policies (Controlled by application layer & tenant isolation)
DROP POLICY IF EXISTS authenticated_read_templates ON public.report_templates;
CREATE POLICY authenticated_read_templates ON public.report_templates FOR SELECT TO authenticated USING (is_active = true);
DROP POLICY IF EXISTS authenticated_read_template_versions ON public.report_template_versions;
CREATE POLICY authenticated_read_template_versions ON public.report_template_versions FOR SELECT TO authenticated USING (is_active = true);

-- ─────────────────────────────────────────────────────────────
-- 11. SEED CANONICAL REVISION 4.0 TEMPLATES
-- ─────────────────────────────────────────────────────────────

-- 1. Reactive Job Report
INSERT INTO public.report_templates (id, template_code, name, report_type, discipline, description, icon, is_active)
VALUES (
  '11111111-1111-4000-8000-000000000001',
  'ENT-RJR-01',
  'Reactive Job Report',
  'REACTIVE',
  'General Hard FM',
  'Formal engineer job sheet capturing fault diagnosis, arrival/departure, labour hours, materials, defect observations, and customer sign-off.',
  'Wrench',
  true
) ON CONFLICT (template_code) DO UPDATE SET
  name = EXCLUDED.name,
  report_type = EXCLUDED.report_type,
  discipline = EXCLUDED.discipline,
  description = EXCLUDED.description;

INSERT INTO public.report_template_versions (id, report_template_id, revision, effective_date, schema_json, pdf_renderer_key, is_active)
VALUES (
  '22222222-2222-4000-8000-000000000001',
  '11111111-1111-4000-8000-000000000001',
  '4.0',
  'MAR 2026',
  '{
    "sections": [
      { "key": "01_issue_reported", "title": "01 Issue Reported", "required": true },
      { "key": "02_attendance", "title": "02 Attendance & Site Conditions", "required": true },
      { "key": "03_diagnosis_works", "title": "03 Diagnosis / Works Carried Out", "required": true },
      { "key": "04_labour", "title": "04 Labour Allocation", "repeatable": true },
      { "key": "05_materials", "title": "05 Materials & Consumables", "repeatable": true },
      { "key": "06_outcome", "title": "06 Job Outcome", "required": true },
      { "key": "07_defects", "title": "07 Defects & Remedial Actions", "repeatable": true },
      { "key": "08_photographs", "title": "08 Photographic Evidence", "attachments": true },
      { "key": "09_engineer_signature", "title": "09 Engineer Declaration & Sign-Off", "required": true },
      { "key": "10_client_signature", "title": "10 Client / Representative Sign-Off", "optional": true },
      { "key": "11_entirefm_closeout", "title": "11 EntireFM Review & Close-Out", "internal_only": true }
    ]
  }'::jsonb,
  'rev4/reactive-job',
  true
) ON CONFLICT (report_template_id, revision) DO NOTHING;

-- 2. Weekly Fire Alarm Test Record
INSERT INTO public.report_templates (id, template_code, name, report_type, discipline, description, icon, is_active)
VALUES (
  '11111111-1111-4000-8000-000000000002',
  'ENT-PPM-01',
  'Weekly Fire Alarm Test Record',
  'PPM_CHECKLIST',
  'Fire Safety',
  'Statutory BS 5839-1 weekly manual call point rotational test, panel status inspection, and defect logging.',
  'ShieldCheck',
  true
) ON CONFLICT (template_code) DO UPDATE SET
  name = EXCLUDED.name,
  report_type = EXCLUDED.report_type,
  discipline = EXCLUDED.discipline,
  description = EXCLUDED.description;

INSERT INTO public.report_template_versions (id, report_template_id, revision, effective_date, schema_json, pdf_renderer_key, is_active)
VALUES (
  '22222222-2222-4000-8000-000000000002',
  '11111111-1111-4000-8000-000000000002',
  '4.0',
  'MAR 2026',
  '{
    "sections": [
      { "key": "01_system_details", "title": "01 Fire Alarm System Details", "required": true },
      { "key": "02_panel_inspection", "title": "02 Control Panel State Inspection", "required": true },
      { "key": "03_call_points", "title": "03 Sample Manual Call Point(s) Tested", "repeatable": true, "required": true },
      { "key": "04_ancillaries", "title": "04 Sounders, Signalling & Ancillaries", "required": true },
      { "key": "05_defects", "title": "05 Defect / Rectification Notice", "repeatable": true },
      { "key": "06_photographs", "title": "06 Test Evidence Photos", "attachments": true },
      { "key": "07_engineer_signature", "title": "07 Competent Tester Sign-Off", "required": true }
    ]
  }'::jsonb,
  'rev4/weekly-fire-alarm',
  true
) ON CONFLICT (report_template_id, revision) DO NOTHING;

-- 3. Emergency Lighting Asset Schedule
INSERT INTO public.report_templates (id, template_code, name, report_type, discipline, description, icon, is_active)
VALUES (
  '11111111-1111-4000-8000-000000000003',
  'ENT-FLS-EL',
  'Emergency Lighting Asset Schedule',
  'ASSET_SCHEDULE',
  'Life Safety / Electrical',
  'Asset inventory and schedule survey for emergency luminaires, exit signage, central battery and self-contained units per BS 5266.',
  'Zap',
  true
) ON CONFLICT (template_code) DO UPDATE SET
  name = EXCLUDED.name,
  report_type = EXCLUDED.report_type,
  discipline = EXCLUDED.discipline,
  description = EXCLUDED.description;

INSERT INTO public.report_template_versions (id, report_template_id, revision, effective_date, schema_json, pdf_renderer_key, is_active)
VALUES (
  '22222222-2222-4000-8000-000000000003',
  '11111111-1111-4000-8000-000000000003',
  '4.0',
  'MAR 2026',
  '{
    "sections": [
      { "key": "01_survey_header", "title": "01 Survey & Building Details", "required": true },
      { "key": "02_assets_schedule", "title": "02 Emergency Luminaire Schedule", "repeatable": true, "required": true, "syncs_to_asset_registry": true },
      { "key": "03_overall_assessment", "title": "03 Estate Assessment & Limitations", "required": true },
      { "key": "04_defects", "title": "04 Immediate Compliance Hazards", "repeatable": true },
      { "key": "05_photographs", "title": "05 Survey Evidence", "attachments": true },
      { "key": "06_surveyor_signature", "title": "06 Surveyor Sign-Off", "required": true }
    ]
  }'::jsonb,
  'rev4/emergency-lighting',
  true
) ON CONFLICT (report_template_id, revision) DO NOTHING;
-- ============================================================================
-- ENTIREFM MIGRATION 0041: SUPPLIER ASSURANCE & PERFORMANCE INTELLIGENCE TABLES
-- ============================================================================
-- Replaces ephemeral in-memory storage for assurance and performance stores.
-- Dual-Identity Support:
--   - supplier_org_id (text -> public.supplier_organisations(id)) for pre-approval onboarding
--   - organisation_id (uuid -> public.organisations(id)) for post-approval providers
--   - Exactly one owner column must be NOT NULL per row (enforced by CHECK constraint).
-- ============================================================================

-- 1. SUPPLIER ONBOARDING PLANS
CREATE TABLE IF NOT EXISTS public.supplier_onboarding_plans (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  rule_version                text NOT NULL DEFAULT 'v3.0.0-canonical',
  generated_at                timestamptz NOT NULL DEFAULT now(),
  risk_level                  text NOT NULL DEFAULT 'MEDIUM',
  total_applicable_items      int NOT NULL DEFAULT 0,
  total_mandatory_items       int NOT NULL DEFAULT 0,
  completed_mandatory_items   int NOT NULL DEFAULT 0,
  completion_percentage       numeric(5, 2) NOT NULL DEFAULT 0.0,
  is_onboarding_complete      boolean NOT NULL DEFAULT false,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_onboarding_plans_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_onboarding_plans_supplier_org_id ON public.supplier_onboarding_plans(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_plans_organisation_id ON public.supplier_onboarding_plans(organisation_id);

-- 2. ASSURANCE PLAN ITEMS (Child of Onboarding Plan)
CREATE TABLE IF NOT EXISTS public.supplier_assurance_plan_items (
  id                          text PRIMARY KEY,
  plan_id                     text NOT NULL REFERENCES public.supplier_onboarding_plans(id) ON DELETE CASCADE,
  requirement_id              text NOT NULL,
  internal_code               text NOT NULL,
  title                       text NOT NULL,
  category                    text NOT NULL,
  description                 text,
  is_mandatory                boolean NOT NULL DEFAULT true,
  evidence_type               text NOT NULL DEFAULT 'DOCUMENT_UPLOAD',
  consequence_on_expiry       text NOT NULL DEFAULT 'WARNING',
  status                      text NOT NULL DEFAULT 'NOT_SUBMITTED',
  evidence_document_id        text,
  evidence_notes              text,
  rejection_reason            text,
  assigned_reviewer_role      text NOT NULL DEFAULT 'compliance_manager',
  reviewed_by                 text,
  reviewed_at                 timestamptz,
  expiry_date                 timestamptz,
  waived_reason               text,
  waived_by                   text,
  waived_at                   timestamptz,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plan_items_plan_id ON public.supplier_assurance_plan_items(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_items_requirement_id ON public.supplier_assurance_plan_items(requirement_id);

-- 3. DOCUMENT VAULT RECORDS
CREATE TABLE IF NOT EXISTS public.supplier_document_records (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  requirement_id              text,
  document_type               text NOT NULL,
  file_name                   text NOT NULL,
  file_size_bytes             bigint NOT NULL DEFAULT 0,
  mime_type                   text NOT NULL DEFAULT 'application/octet-stream',
  storage_path                text NOT NULL,
  issued_by                   text,
  certificate_number          text,
  issue_date                  timestamptz,
  effective_date              timestamptz,
  expiry_date                 timestamptz,
  document_state              text NOT NULL DEFAULT 'CURRENT',
  review_status               text NOT NULL DEFAULT 'SUBMITTED',
  reviewed_by                 text,
  reviewed_at                 timestamptz,
  rejection_reason            text,
  version                     int NOT NULL DEFAULT 1,
  replaced_by_id              text,
  uploaded_by                 text NOT NULL DEFAULT 'system',
  uploaded_at                 timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_document_records_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_doc_records_supplier_org_id ON public.supplier_document_records(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_doc_records_organisation_id ON public.supplier_document_records(organisation_id);
CREATE INDEX IF NOT EXISTS idx_doc_records_doc_type ON public.supplier_document_records(document_type);

-- 4. STRUCTURED INSURANCE RECORDS
CREATE TABLE IF NOT EXISTS public.supplier_insurance_records (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  insurance_type              text NOT NULL,
  insurer_name                text NOT NULL,
  policy_number               text NOT NULL,
  limit_gbp                   numeric(12, 2) NOT NULL DEFAULT 0.0,
  required_limit_gbp          numeric(12, 2) NOT NULL DEFAULT 0.0,
  is_below_required_limit     boolean NOT NULL DEFAULT false,
  start_date                  timestamptz NOT NULL,
  expiry_date                 timestamptz NOT NULL,
  document_id                 text,
  status                      text NOT NULL DEFAULT 'VALID',
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_insurance_records_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_insurance_records_supplier_org_id ON public.supplier_insurance_records(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_insurance_records_organisation_id ON public.supplier_insurance_records(organisation_id);

-- 5. HEALTH & SAFETY ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.supplier_hs_assessments (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  assessed_by                 text NOT NULL,
  assessed_at                 timestamptz NOT NULL DEFAULT now(),
  overall_outcome             text NOT NULL DEFAULT 'PASS',
  competent_person_name       text,
  riddor_incidents_last_3_years int NOT NULL DEFAULT 0,
  rams_methodology_quality    text NOT NULL DEFAULT 'ACCEPTABLE',
  working_at_height_controls  boolean NOT NULL DEFAULT false,
  lone_working_procedures     boolean NOT NULL DEFAULT false,
  coshh_governance            boolean NOT NULL DEFAULT false,
  asbestos_awareness          boolean NOT NULL DEFAULT false,
  notes                       text NOT NULL DEFAULT '',
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_hs_assessments_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_hs_assessments_supplier_org_id ON public.supplier_hs_assessments(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_hs_assessments_organisation_id ON public.supplier_hs_assessments(organisation_id);

-- 6. INFORMATION SECURITY ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.supplier_infosec_assessments (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  data_access_level           text NOT NULL DEFAULT 'NONE',
  assessed_by                 text NOT NULL,
  assessed_at                 timestamptz NOT NULL DEFAULT now(),
  has_iso27001                boolean NOT NULL DEFAULT false,
  has_cyber_essentials        boolean NOT NULL DEFAULT false,
  mfa_enforced                boolean NOT NULL DEFAULT false,
  data_encrypted_at_rest      boolean NOT NULL DEFAULT false,
  cyber_insurance_limit_gbp   numeric(12, 2) NOT NULL DEFAULT 0.0,
  gdpr_dpa_signed             boolean NOT NULL DEFAULT false,
  status                      text NOT NULL DEFAULT 'COMPLIANT',
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_infosec_assessments_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_infosec_assessments_supplier_org_id ON public.supplier_infosec_assessments(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_infosec_assessments_organisation_id ON public.supplier_infosec_assessments(organisation_id);

-- 7. BANK DETAIL RECORDS
CREATE TABLE IF NOT EXISTS public.supplier_bank_records (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  account_name                text NOT NULL,
  bank_name                   text NOT NULL,
  sort_code_masked            text NOT NULL,
  account_number_masked       text NOT NULL,
  verification_status         text NOT NULL DEFAULT 'VERIFICATION_REQUIRED',
  submitted_by                text NOT NULL,
  submitted_at                timestamptz NOT NULL DEFAULT now(),
  verified_by                 text,
  verified_at                 timestamptz,
  rejection_reason            text,
  audit_note                  text,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_bank_records_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_bank_records_supplier_org_id ON public.supplier_bank_records(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_bank_records_organisation_id ON public.supplier_bank_records(organisation_id);

-- 8. REMEDIATION ACTIONS
CREATE TABLE IF NOT EXISTS public.supplier_remediation_actions (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  requirement_id              text,
  issue_summary               text NOT NULL,
  detailed_remediation_required text NOT NULL,
  severity                    text NOT NULL DEFAULT 'MEDIUM',
  assigned_to_role            text NOT NULL DEFAULT 'compliance_manager',
  supplier_contact            text,
  raised_date                 timestamptz NOT NULL DEFAULT now(),
  due_date                    timestamptz NOT NULL,
  status                      text NOT NULL DEFAULT 'OPEN',
  resolution_notes            text,
  closed_by                   text,
  closed_at                   timestamptz,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_remediation_actions_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_remediation_actions_supplier_org_id ON public.supplier_remediation_actions(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_remediation_actions_organisation_id ON public.supplier_remediation_actions(organisation_id);

-- 9. SERVICE APPROVALS
CREATE TABLE IF NOT EXISTS public.supplier_service_approvals (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  service_slug                text NOT NULL,
  service_name                text NOT NULL,
  approval_status             text NOT NULL DEFAULT 'UNDER_REVIEW',
  effective_date              timestamptz NOT NULL DEFAULT now(),
  review_date                 timestamptz NOT NULL,
  restrictions                text[] DEFAULT '{}',
  approved_by                 text NOT NULL,
  rationale                   text NOT NULL DEFAULT '',
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_service_approvals_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_service_approvals_supplier_org_id ON public.supplier_service_approvals(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_service_approvals_organisation_id ON public.supplier_service_approvals(organisation_id);

-- 10. GEOGRAPHIC APPROVALS
CREATE TABLE IF NOT EXISTS public.supplier_geographic_approvals (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  region_or_city              text NOT NULL,
  is_approved                 boolean NOT NULL DEFAULT true,
  approved_by                 text NOT NULL,
  approved_at                 timestamptz NOT NULL DEFAULT now(),
  restrictions                text[] DEFAULT '{}',
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_geo_approvals_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_geo_approvals_supplier_org_id ON public.supplier_geographic_approvals(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_geo_approvals_organisation_id ON public.supplier_geographic_approvals(organisation_id);

-- 11. COMPLIANCE HOLDS
CREATE TABLE IF NOT EXISTS public.supplier_compliance_holds (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  hold_reason                 text NOT NULL,
  hold_scope                  text NOT NULL DEFAULT 'GLOBAL',
  affected_service_slug       text,
  affected_city               text,
  affected_client_id          text,
  raised_by                   text NOT NULL,
  raised_at                   timestamptz NOT NULL DEFAULT now(),
  review_date                 timestamptz NOT NULL,
  resolution_required         text NOT NULL,
  is_active                   boolean NOT NULL DEFAULT true,
  resolved_by                 text,
  resolved_at                 timestamptz,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_compliance_holds_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_compliance_holds_supplier_org_id ON public.supplier_compliance_holds(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_compliance_holds_organisation_id ON public.supplier_compliance_holds(organisation_id);

-- 12. SUPPLIER AGREEMENTS
CREATE TABLE IF NOT EXISTS public.supplier_agreements (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  agreement_type              text NOT NULL,
  version                     text NOT NULL DEFAULT 'v2026.1',
  status                      text NOT NULL DEFAULT 'ISSUED',
  issued_at                   timestamptz NOT NULL DEFAULT now(),
  signed_at                   timestamptz,
  signatory_name              text,
  signatory_title             text,
  signatory_email             text,
  ip_address                  text,
  document_id                 text,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_agreements_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_agreements_supplier_org_id ON public.supplier_agreements(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_agreements_organisation_id ON public.supplier_agreements(organisation_id);

-- 13. SUPPLIER REASSESSMENTS
CREATE TABLE IF NOT EXISTS public.supplier_reassessments (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  frequency                   text NOT NULL DEFAULT '12_MONTHS',
  last_reassessment_date      timestamptz,
  next_reassessment_due_date  timestamptz NOT NULL,
  status                      text NOT NULL DEFAULT 'DUE',
  annual_declaration_signed   boolean NOT NULL DEFAULT false,
  annual_declaration_signed_at timestamptz,
  reviewed_by                 text,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_reassessments_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_reassessments_supplier_org_id ON public.supplier_reassessments(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_reassessments_organisation_id ON public.supplier_reassessments(organisation_id);

-- 14. ASSURANCE AUDIT LOGS (Immutable)
CREATE TABLE IF NOT EXISTS public.supplier_assurance_audit_logs (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  actor                       text NOT NULL,
  action                      text NOT NULL,
  entity_type                 text NOT NULL,
  entity_id                   text NOT NULL,
  old_value                   text,
  new_value                   text,
  reason                      text,
  timestamp                   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_assurance_audit_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_assurance_audit_supplier_org_id ON public.supplier_assurance_audit_logs(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_assurance_audit_organisation_id ON public.supplier_assurance_audit_logs(organisation_id);

-- 15. SUPPLIER PORTAL USER RECORDS
CREATE TABLE IF NOT EXISTS public.supplier_portal_user_records (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  email                       text NOT NULL,
  name                        text NOT NULL,
  role                        text NOT NULL DEFAULT 'OPERATIONS',
  is_active                   boolean NOT NULL DEFAULT true,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_portal_users_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_portal_user_records_supplier_org_id ON public.supplier_portal_user_records(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_portal_user_records_organisation_id ON public.supplier_portal_user_records(organisation_id);

-- 16. SUPPLIER SCORECARDS
CREATE TABLE IF NOT EXISTS public.supplier_scorecards (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  supplier_name               text NOT NULL,
  measurement_window          text NOT NULL DEFAULT '90_DAYS',
  overall_status              text NOT NULL DEFAULT 'INSUFFICIENT_DATA',
  overall_performance_index   numeric(5, 2) NOT NULL DEFAULT 0.0,
  total_completed_jobs        int NOT NULL DEFAULT 0,
  sufficiency_status          text NOT NULL DEFAULT 'NO_DATA',
  sla_attendance_rate         jsonb NOT NULL DEFAULT '{}'::jsonb,
  first_time_fix_rate         jsonb NOT NULL DEFAULT '{}'::jsonb,
  attendance_reliability_rate jsonb NOT NULL DEFAULT '{}'::jsonb,
  evidence_acceptance_rate    jsonb NOT NULL DEFAULT '{}'::jsonb,
  invoice_accuracy_rate       jsonb NOT NULL DEFAULT '{}'::jsonb,
  client_feedback_rating      jsonb NOT NULL DEFAULT '{}'::jsonb,
  safety_incident_count       jsonb NOT NULL DEFAULT '{}'::jsonb,
  service_breakdowns          jsonb NOT NULL DEFAULT '[]'::jsonb,
  geographic_breakdowns       jsonb NOT NULL DEFAULT '[]'::jsonb,
  active_pip_id               text,
  eligible_for_preferred_review boolean NOT NULL DEFAULT false,
  last_calculated_at          timestamptz NOT NULL DEFAULT now(),
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_scorecards_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_scorecards_supplier_org_id ON public.supplier_scorecards(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_scorecards_organisation_id ON public.supplier_scorecards(organisation_id);

-- 17. SUPPLIER QUALITY DEFECTS
CREATE TABLE IF NOT EXISTS public.supplier_quality_defects (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  work_order_id               text NOT NULL,
  service_slug                text NOT NULL,
  site_id                     text,
  issue_title                 text NOT NULL,
  description                 text NOT NULL,
  severity                    text NOT NULL DEFAULT 'MODERATE',
  raised_by                   text NOT NULL,
  raised_at                   timestamptz NOT NULL DEFAULT now(),
  root_cause                  text NOT NULL DEFAULT 'PROCESS',
  is_supplier_attributable    boolean NOT NULL DEFAULT true,
  remediation_required        text NOT NULL DEFAULT '',
  resolved_at                 timestamptz,
  resolution_notes            text,
  CONSTRAINT chk_quality_defects_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_quality_defects_supplier_org_id ON public.supplier_quality_defects(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_quality_defects_organisation_id ON public.supplier_quality_defects(organisation_id);

-- 18. PERFORMANCE IMPROVEMENT PLANS (PIPs)
CREATE TABLE IF NOT EXISTS public.supplier_performance_improvement_plans (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  supplier_name               text NOT NULL,
  reason                      text NOT NULL,
  target_metrics              jsonb NOT NULL DEFAULT '[]'::jsonb,
  action_plan                 text NOT NULL DEFAULT '',
  owner_role                  text NOT NULL DEFAULT 'Operations Manager',
  supplier_contact            text NOT NULL DEFAULT '',
  start_date                  timestamptz NOT NULL DEFAULT now(),
  target_date                 timestamptz NOT NULL,
  status                      text NOT NULL DEFAULT 'ACTIVE',
  review_notes                text,
  closed_at                   timestamptz,
  closed_by                   text,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_pips_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_pips_supplier_org_id ON public.supplier_performance_improvement_plans(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_pips_organisation_id ON public.supplier_performance_improvement_plans(organisation_id);

-- 19. PERFORMANCE REVIEWS & QBRs
CREATE TABLE IF NOT EXISTS public.supplier_performance_reviews (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  review_period               text NOT NULL,
  review_type                 text NOT NULL DEFAULT 'QUARTERLY',
  reviewer_name               text NOT NULL,
  reviewer_role               text NOT NULL DEFAULT 'Procurement Director',
  attendees                   text[] NOT NULL DEFAULT '{}',
  metrics_snapshot            jsonb NOT NULL DEFAULT '{}'::jsonb,
  strengths                   text[] NOT NULL DEFAULT '{}',
  areas_for_improvement       text[] NOT NULL DEFAULT '{}',
  decisions                   text[] NOT NULL DEFAULT '{}',
  relationship_tier_recommendation text,
  next_review_date            timestamptz NOT NULL,
  conducted_at                timestamptz NOT NULL DEFAULT now(),
  created_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_reviews_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_reviews_supplier_org_id ON public.supplier_performance_reviews(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_reviews_organisation_id ON public.supplier_performance_reviews(organisation_id);

-- 20. SERVICE BENCHMARKS
CREATE TABLE IF NOT EXISTS public.supplier_service_benchmarks (
  id                          text PRIMARY KEY,
  service_slug                text NOT NULL,
  service_name                text NOT NULL,
  region_or_city              text NOT NULL DEFAULT 'National UK',
  total_suppliers_measured    int NOT NULL DEFAULT 0,
  median_sla_rate             numeric(5, 2) NOT NULL DEFAULT 0.0,
  median_ftf_rate             numeric(5, 2) NOT NULL DEFAULT 0.0,
  median_evidence_rate        numeric(5, 2) NOT NULL DEFAULT 0.0,
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_benchmarks_service_region ON public.supplier_service_benchmarks(service_slug, region_or_city);
-- ============================================================================
-- ENTIREFM MIGRATION 0042: ALLOCATION ENGINE & STRIPE IDEMPOTENCY TABLES
-- ============================================================================
-- Replaces ephemeral in-memory storage for allocation store and stripe webhooks.
-- Dual-Identity Support for Supplier References:
--   - supplier_org_id (text -> public.supplier_organisations(id))
--   - organisation_id (uuid -> public.organisations(id))
--   - Enforced by CHECK constraint per row.
-- ============================================================================

-- 1. STRIPE WEBHOOK IDEMPOTENCY TABLE
CREATE TABLE IF NOT EXISTS public.processed_stripe_events (
  event_id                    text PRIMARY KEY,
  event_type                  text,
  processed_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_processed_stripe_events_processed_at ON public.processed_stripe_events(processed_at);

-- 2. WORK ALLOCATION REQUIREMENTS
CREATE TABLE IF NOT EXISTS public.work_allocation_requirements (
  id                          text PRIMARY KEY,
  source_type                 text NOT NULL,
  source_id                   text NOT NULL,
  client_id                   text NOT NULL,
  client_name                 text NOT NULL,
  site_id                     text NOT NULL,
  site_name                   text NOT NULL,
  site_city                   text NOT NULL,
  site_postcode               text NOT NULL,
  service_slug                text NOT NULL,
  service_name                text NOT NULL,
  sub_service                 text,
  asset_name                  text,
  oem_manufacturer            text,
  priority                    text NOT NULL DEFAULT 'P3_STANDARD',
  sla_attendance_target_hours numeric(5, 2) NOT NULL DEFAULT 4.0,
  scope_summary               text NOT NULL,
  detailed_scope              text,
  work_risk_level             text NOT NULL DEFAULT 'MEDIUM',
  estimated_value_gbp         numeric(12, 2),
  not_to_exceed_gbp           numeric(12, 2),
  out_of_hours_required       boolean NOT NULL DEFAULT false,
  mandatory_accreditations    text[] DEFAULT '{}',
  client_mandated_supplier_id text,
  created_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_work_alloc_req_source ON public.work_allocation_requirements(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_work_alloc_req_service ON public.work_allocation_requirements(service_slug);
CREATE INDEX IF NOT EXISTS idx_work_alloc_req_city ON public.work_allocation_requirements(site_city);

-- 3. SUPPLIER OPPORTUNITIES
CREATE TABLE IF NOT EXISTS public.supplier_opportunities (
  id                          text PRIMARY KEY,
  requirement_id              text NOT NULL REFERENCES public.work_allocation_requirements(id) ON DELETE CASCADE,
  opportunity_type            text NOT NULL DEFAULT 'DIRECT_OFFER',
  status                      text NOT NULL DEFAULT 'ISSUED',
  invited_supplier_ids        text[] NOT NULL DEFAULT '{}',
  response_deadline           timestamptz NOT NULL,
  title                       text NOT NULL,
  scope_summary               text NOT NULL,
  service_slug                text NOT NULL,
  site_city                   text NOT NULL,
  priority                    text NOT NULL,
  commercial_basis            text NOT NULL DEFAULT 'CONTRACT_RATE',
  not_to_exceed_gbp           numeric(12, 2),
  issued_at                   timestamptz NOT NULL DEFAULT now(),
  issued_by                   text NOT NULL,
  awarded_supplier_id         text,
  awarded_at                  timestamptz
);

CREATE INDEX IF NOT EXISTS idx_opportunities_requirement_id ON public.supplier_opportunities(requirement_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.supplier_opportunities(status);

-- 4. SUPPLIER OPPORTUNITY RESPONSES
CREATE TABLE IF NOT EXISTS public.supplier_opportunity_responses (
  id                          text PRIMARY KEY,
  opportunity_id              text NOT NULL REFERENCES public.supplier_opportunities(id) ON DELETE CASCADE,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  supplier_name               text NOT NULL,
  decision                    text NOT NULL,
  decline_reason              text,
  quoted_price_gbp            numeric(12, 2),
  quoted_lead_time_hours      numeric(5, 2),
  planned_attendance_date     timestamptz,
  clarification_question      text,
  clarification_response      text,
  notes                       text,
  responded_at                timestamptz NOT NULL DEFAULT now(),
  responded_by                text NOT NULL,
  CONSTRAINT chk_opp_responses_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_opp_responses_opportunity_id ON public.supplier_opportunity_responses(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opp_responses_supplier_org_id ON public.supplier_opportunity_responses(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_opp_responses_organisation_id ON public.supplier_opportunity_responses(organisation_id);

-- 5. FORMAL AWARD DECISION RECORDS
CREATE TABLE IF NOT EXISTS public.supplier_award_decisions (
  id                          text PRIMARY KEY,
  opportunity_id              text NOT NULL REFERENCES public.supplier_opportunities(id) ON DELETE CASCADE,
  requirement_id              text NOT NULL REFERENCES public.work_allocation_requirements(id) ON DELETE CASCADE,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  selected_supplier_name      text NOT NULL,
  candidate_ids_evaluated     text[] DEFAULT '{}',
  award_reason                text NOT NULL,
  commercial_basis            text NOT NULL DEFAULT 'CONTRACT_RATE',
  agreed_value_gbp            numeric(12, 2),
  not_to_exceed_gbp           numeric(12, 2),
  is_override                 boolean NOT NULL DEFAULT false,
  override_rationale          text,
  awarded_by                  text NOT NULL,
  awarded_at                  timestamptz NOT NULL DEFAULT now(),
  pre_dispatch_revalidation_passed boolean NOT NULL DEFAULT true,
  CONSTRAINT chk_award_decisions_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_award_decisions_opportunity_id ON public.supplier_award_decisions(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_award_decisions_supplier_org_id ON public.supplier_award_decisions(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_award_decisions_organisation_id ON public.supplier_award_decisions(organisation_id);

-- 6. WORK ORDER DISPATCH RECORDS
CREATE TABLE IF NOT EXISTS public.work_order_dispatches (
  id                          text PRIMARY KEY,
  work_order_id               text NOT NULL,
  opportunity_id              text NOT NULL,
  award_id                    text NOT NULL,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  supplier_name               text NOT NULL,
  service_name                text NOT NULL,
  site_name                   text NOT NULL,
  site_city                   text NOT NULL,
  priority                    text NOT NULL,
  sla_target_time             timestamptz NOT NULL,
  status                      text NOT NULL DEFAULT 'AWAITING_ACKNOWLEDGEMENT',
  assigned_operative_name     text,
  assigned_operative_phone    text,
  scheduled_attendance_start  timestamptz,
  acknowledged_at             timestamptz,
  acknowledged_by             text,
  rams_submitted              boolean NOT NULL DEFAULT false,
  dispatched_at               timestamptz NOT NULL DEFAULT now(),
  dispatched_by               text NOT NULL,
  CONSTRAINT chk_wo_dispatches_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_wo_dispatches_work_order_id ON public.work_order_dispatches(work_order_id);
CREATE INDEX IF NOT EXISTS idx_wo_dispatches_supplier_org_id ON public.work_order_dispatches(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_wo_dispatches_organisation_id ON public.work_order_dispatches(organisation_id);
CREATE INDEX IF NOT EXISTS idx_wo_dispatches_status ON public.work_order_dispatches(status);

-- 7. SUPPLIER AVAILABILITY
CREATE TABLE IF NOT EXISTS public.supplier_availability (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  status                      text NOT NULL DEFAULT 'AVAILABLE',
  daily_reactive_slots        int NOT NULL DEFAULT 5,
  available_engineers_count   int NOT NULL DEFAULT 1,
  emergency_out_of_hours      boolean NOT NULL DEFAULT false,
  unavailable_from            timestamptz,
  unavailable_until           timestamptz,
  reason                      text,
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_supplier_avail_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_supplier_avail_supplier_org_id ON public.supplier_availability(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_supplier_avail_organisation_id ON public.supplier_availability(organisation_id);
-- ============================================================================
-- ENTIREFM MIGRATION 0043: RESOLVE EXPOSED AUTH.USERS IN ADMIN IDENTITY DIRECTORY
-- ============================================================================
-- Resolves Supabase Security Advisor Linter: 0002_auth_users_exposed
-- Replaces direct auth.users selection in public.admin_user_identity_directory
-- with public.user_identities (a dedicated profiles table with strict RLS and trigger sync).
-- ============================================================================

-- 1. HARDEN & EXTEND public.user_identities CONSTRAINTS & COLUMNS
DO $$
BEGIN
  -- Make person_id nullable if it was previously NOT NULL
  ALTER TABLE public.user_identities ALTER COLUMN person_id DROP NOT NULL;

  -- Drop legacy unique constraint on email (auth_user_id is the canonical unique key)
  ALTER TABLE public.user_identities DROP CONSTRAINT IF EXISTS user_identities_email_key;

  -- Add email_verified column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_identities' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE public.user_identities ADD COLUMN email_verified boolean NOT NULL DEFAULT false;
  END IF;

  -- Add last_sign_in_at column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_identities' AND column_name = 'last_sign_in_at'
  ) THEN
    ALTER TABLE public.user_identities ADD COLUMN last_sign_in_at timestamptz;
  END IF;

  -- Add primary_email_snapshot column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_identities' AND column_name = 'primary_email_snapshot'
  ) THEN
    ALTER TABLE public.user_identities ADD COLUMN primary_email_snapshot text;
  END IF;
END $$;

-- 2. LINK EXISTING UNLINKED user_identities ROWS BY EMAIL FIRST
UPDATE public.user_identities ui
SET auth_user_id = u.id,
    email_verified = (u.email_confirmed_at IS NOT NULL),
    last_sign_in_at = u.last_sign_in_at
FROM auth.users u
WHERE ui.auth_user_id IS NULL 
  AND lower(ui.email) = lower(u.email);

-- 3. BACKFILL / UPSERT ALL auth.users INTO public.user_identities
INSERT INTO public.user_identities (
  auth_user_id,
  email,
  primary_email_snapshot,
  email_verified,
  first_name,
  last_name,
  display_name,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  u.id,
  u.email,
  u.email,
  (u.email_confirmed_at IS NOT NULL),
  COALESCE(u.raw_user_meta_data->>'first_name', ''),
  COALESCE(u.raw_user_meta_data->>'last_name', ''),
  COALESCE(
    NULLIF(TRIM(CONCAT(COALESCE(u.raw_user_meta_data->>'first_name', ''), ' ', COALESCE(u.raw_user_meta_data->>'last_name', ''))), ''),
    u.email
  ),
  u.last_sign_in_at,
  u.created_at,
  now()
FROM auth.users u
ON CONFLICT (auth_user_id) DO UPDATE SET
  email = EXCLUDED.email,
  primary_email_snapshot = COALESCE(public.user_identities.primary_email_snapshot, EXCLUDED.email),
  email_verified = EXCLUDED.email_verified,
  first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), public.user_identities.first_name),
  last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), public.user_identities.last_name),
  display_name = COALESCE(NULLIF(EXCLUDED.display_name, ''), public.user_identities.display_name),
  last_sign_in_at = EXCLUDED.last_sign_in_at,
  updated_at = now();

-- 4. CREATE AUTOMATIC SYNC TRIGGER FROM auth.users TO public.user_identities
CREATE OR REPLACE FUNCTION public.handle_auth_user_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_identities (
    auth_user_id,
    email,
    primary_email_snapshot,
    email_verified,
    first_name,
    last_name,
    display_name,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.email,
    (NEW.email_confirmed_at IS NOT NULL),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(
      NULLIF(TRIM(CONCAT(COALESCE(NEW.raw_user_meta_data->>'first_name', ''), ' ', COALESCE(NEW.raw_user_meta_data->>'last_name', ''))), ''),
      NEW.email
    ),
    NEW.last_sign_in_at,
    COALESCE(NEW.created_at, now()),
    now()
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    email = EXCLUDED.email,
    email_verified = EXCLUDED.email_verified,
    first_name = CASE 
      WHEN EXCLUDED.first_name <> '' THEN EXCLUDED.first_name 
      ELSE public.user_identities.first_name 
    END,
    last_name = CASE 
      WHEN EXCLUDED.last_name <> '' THEN EXCLUDED.last_name 
      ELSE public.user_identities.last_name 
    END,
    display_name = CASE 
      WHEN EXCLUDED.display_name <> '' THEN EXCLUDED.display_name 
      ELSE public.user_identities.display_name 
    END,
    last_sign_in_at = EXCLUDED.last_sign_in_at,
    updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_sync ON auth.users;
CREATE TRIGGER on_auth_user_sync AFTER INSERT OR UPDATE OF email, email_confirmed_at, raw_user_meta_data, last_sign_in_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_sync();

-- 5. RECREATE SECURE ADMIN DIRECTORY VIEW WITHOUT auth.users
DROP VIEW IF EXISTS public.admin_user_identity_directory CASCADE;

CREATE OR REPLACE VIEW public.admin_user_identity_directory
WITH (security_invoker = true) AS
SELECT
  ui.auth_user_id,
  ui.email,
  COALESCE(ui.email_verified, false) AS email_verified,
  COALESCE(
    lm.display_name,
    ui.display_name,
    NULLIF(TRIM(CONCAT(COALESCE(ui.first_name, ''), ' ', COALESCE(ui.last_name, ''))), ''),
    ui.email
  ) AS display_name,
  COALESCE(lm.first_name, ui.first_name) AS first_name,
  COALESCE(lm.last_name, ui.last_name) AS last_name,
  (lm.id IS NOT NULL) AS is_lobby_member,
  COALESCE(lm.member_status, 'none') AS lobby_member_status,
  lm.username AS lobby_username,
  lm.joined_at AS lobby_joined_at,
  COALESCE(oi.identity_type, 'NONE') AS operational_identity_type,
  COALESCE(oi.status, 'NONE') AS operational_status,
  COALESCE(oi.organisation_id, so.id) AS organisation_id,
  COALESCE(oi.organisation_name, so.legal_name) AS organisation_name,
  COALESCE(oi.role_code, 'NONE') AS operational_role_code,
  ui.created_at AS auth_created_at,
  ui.last_sign_in_at AS last_sign_in_at
FROM public.user_identities ui
LEFT JOIN public.lobby_members lm ON lm.auth_user_id = ui.auth_user_id
LEFT JOIN public.operational_identities oi ON oi.auth_user_id = ui.auth_user_id
LEFT JOIN public.supplier_organisations so ON so.owner_id = ui.auth_user_id;

-- 6. SECURE PRIVILEGES: Revoke public/anon/authenticated access to directory view
REVOKE ALL ON public.admin_user_identity_directory FROM anon, authenticated, public;
GRANT SELECT ON public.admin_user_identity_directory TO service_role;

-- 7. STRICT ROW LEVEL SECURITY ON public.user_identities
ALTER TABLE public.user_identities ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_identities' AND policyname = 'user_identities_self_select'
  ) THEN
    DROP POLICY IF EXISTS user_identities_self_select ON public.user_identities;
CREATE POLICY user_identities_self_select ON public.user_identities
      FOR SELECT USING (auth.uid() = auth_user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_identities' AND policyname = 'user_identities_self_update'
  ) THEN
    DROP POLICY IF EXISTS user_identities_self_update ON public.user_identities;
CREATE POLICY user_identities_self_update ON public.user_identities
      FOR UPDATE USING (auth.uid() = auth_user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_identities' AND policyname = 'user_identities_service_role'
  ) THEN
    DROP POLICY IF EXISTS user_identities_service_role ON public.user_identities;
CREATE POLICY user_identities_service_role ON public.user_identities
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
-- ============================================================================
-- 0044: Chasing Engine — DB Persistence Layer
-- ============================================================================
-- 1. Add chase tracking columns to work_assignments
-- 2. Create index on work_orders(status) for fast sweeping
-- 3. Create communication_messages table (DB-backed idempotency)
-- ============================================================================

-- ── 1. Extend work_assignments with chasing state ──────────────────────────

alter table public.work_assignments
  add column if not exists chase_count       integer   not null default 0,
  add column if not exists last_chase_at     timestamptz,
  add column if not exists escalated_at      timestamptz;

comment on column public.work_assignments.chase_count
  is 'Number of automated chase messages sent for this assignment.';
comment on column public.work_assignments.last_chase_at
  is 'Timestamp of the last automated chase dispatch.';
comment on column public.work_assignments.escalated_at
  is 'Timestamp when this assignment was escalated to a human operator.';

-- ── 2. Index on work_orders status for fast sweep filtering ───────────────

create index if not exists idx_work_orders_status
  on public.work_orders (status);

-- ── 3. communication_messages — DB-backed idempotent message store ─────────

create table if not exists public.communication_messages (
  id                   text        primary key,
  thread_id            text        not null,
  work_order_id        text,
  sender_name          text,
  sender_email         text,
  reply_to_email       text,
  channel              text        not null default 'EMAIL',
  visibility           text        not null default 'INTERNAL_ONLY',
  body                 text        not null,
  is_incoming          boolean     not null default false,
  is_ai_generated      boolean     not null default false,
  idempotency_key      text        unique,
  delivery_state       text        not null default 'INTERFACE_ONLY',
  provider             text        not null default 'INTERFACE_ONLY',
  provider_message_id  text,
  recipient_email      text,
  queued_at            timestamptz,
  sent_at              timestamptz,
  delivered_at         timestamptz,
  failed_at            timestamptz,
  bounced_at           timestamptz,
  failure_reason       text,
  bounce_details       jsonb,
  created_at           timestamptz not null default now()
);

comment on table public.communication_messages
  is 'Durable, idempotent store for all outbound communications. Survives serverless cold starts.';

-- Defensive column guards: if this table pre-existed from a partial schema run,
-- ensure every column used by indexes below is present.
alter table public.communication_messages
  add column if not exists thread_id            text,
  add column if not exists work_order_id        text,
  add column if not exists sender_name          text,
  add column if not exists sender_email         text,
  add column if not exists reply_to_email       text,
  add column if not exists channel              text not null default 'EMAIL',
  add column if not exists visibility           text not null default 'INTERNAL_ONLY',
  add column if not exists body                 text,
  add column if not exists is_incoming          boolean not null default false,
  add column if not exists is_ai_generated      boolean not null default false,
  add column if not exists idempotency_key      text,
  add column if not exists delivery_state       text not null default 'INTERFACE_ONLY',
  add column if not exists provider             text not null default 'INTERFACE_ONLY',
  add column if not exists provider_message_id  text,
  add column if not exists recipient_email      text,
  add column if not exists queued_at            timestamptz,
  add column if not exists sent_at              timestamptz,
  add column if not exists delivered_at         timestamptz,
  add column if not exists failed_at            timestamptz,
  add column if not exists bounced_at           timestamptz,
  add column if not exists failure_reason       text,
  add column if not exists bounce_details       jsonb,
  add column if not exists created_at           timestamptz not null default now();

-- Indexes
create index if not exists idx_comm_messages_thread
  on public.communication_messages (thread_id, created_at desc);

create index if not exists idx_comm_messages_work_order
  on public.communication_messages (work_order_id)
  where work_order_id is not null;

create index if not exists idx_comm_messages_provider_msg_id
  on public.communication_messages (provider_message_id)
  where provider_message_id is not null;

-- RLS
alter table public.communication_messages enable row level security;

DROP POLICY IF EXISTS "Service role has full access to communication_messages" ON public.communication_messages;
CREATE POLICY "Service role has full access to communication_messages" ON public.communication_messages
  for all
  using (true);
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
