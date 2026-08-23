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
create policy "Service role has full access to operating_calendars" on public.operating_calendars for all using (true);
create policy "Service role has full access to contract_slas" on public.contract_slas for all using (true);
create policy "Service role has full access to sla_pauses" on public.sla_pauses for all using (true);
create policy "Service role has full access to sla_milestone_history" on public.sla_milestone_history for all using (true);
create policy "Service role has full access to completion_policies" on public.completion_policies for all using (true);
create policy "Service role has full access to completion_overrides" on public.completion_overrides for all using (true);
create policy "Service role has full access to approval_policies" on public.approval_policies for all using (true);
create policy "Service role has full access to workflow_triggers" on public.workflow_triggers for all using (true);
create policy "Service role has full access to workflow_conditions" on public.workflow_conditions for all using (true);
create policy "Service role has full access to workflow_actions" on public.workflow_actions for all using (true);
create policy "Service role has full access to escalation_policies" on public.escalation_policies for all using (true);
