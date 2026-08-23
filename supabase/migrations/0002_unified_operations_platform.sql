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
