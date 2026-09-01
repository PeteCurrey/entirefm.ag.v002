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
