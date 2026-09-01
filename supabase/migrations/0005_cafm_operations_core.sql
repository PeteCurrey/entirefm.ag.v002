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
