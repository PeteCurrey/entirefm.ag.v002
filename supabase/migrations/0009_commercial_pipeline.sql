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
