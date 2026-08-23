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
