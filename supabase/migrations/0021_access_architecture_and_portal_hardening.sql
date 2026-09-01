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
