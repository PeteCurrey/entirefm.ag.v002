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
