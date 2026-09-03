-- ============================================================================
-- ENTIREFM ENQUIRY & LEAD SYSTEM ANTI-SPAM & ABUSE HARDENING
-- Migration: 0056_enquiry_lead_security_hardening.sql
-- ============================================================================
-- 1. Extend LEADS table with anti-spam, Turnstile, and rate-limiting telemetry
-- 2. Explicit DENY RLS policies for anonymous and authenticated public roles
-- 3. Dedicated view for administrative review of quarantined and suspicious leads
-- ============================================================================

-- 1. Schema Extensions for Anti-Spam & Abuse Defense
alter table if exists public.leads
  add column if not exists spam_score integer default 0,
  add column if not exists spam_flags text[] default '{}',
  add column if not exists spam_status text default 'CLEAN' check (spam_status in ('CLEAN', 'NEEDS_REVIEW', 'SPAM_SUSPECTED', 'CONFIRMED_SPAM', 'CONFIRMED_GENUINE')),
  add column if not exists submission_ip text default null,
  add column if not exists submission_duration_ms integer default null,
  add column if not exists turnstile_verified boolean default false,
  add column if not exists duplicate_of text default null,
  add column if not exists notification_dispatched boolean default false;

-- Create indexes for fast filtering and quarantine views
create index if not exists leads_spam_status_idx on public.leads (spam_status);
create index if not exists leads_spam_score_idx on public.leads (spam_score);
create index if not exists leads_turnstile_verified_idx on public.leads (turnstile_verified);
create index if not exists leads_duplicate_of_idx on public.leads (duplicate_of);

-- 2. Row Level Security Hardening
-- Ensure RLS is active
alter table public.leads enable row level security;

-- Drop any previous conflicting policies on leads
drop policy if exists "leads_deny_anon_insert" on public.leads;
drop policy if exists "leads_deny_anon_select" on public.leads;
drop policy if exists "leads_deny_anon_update" on public.leads;
drop policy if exists "leads_deny_anon_delete" on public.leads;
drop policy if exists "leads_service_role_all" on public.leads;

-- Explicitly DENY all direct public / authenticated operations on leads.
-- All enquiry insertions and updates MUST flow through our server-side API with service role credentials.
create policy "leads_deny_anon_insert"
  on public.leads
  for insert
  to anon, authenticated
  with check (false);

create policy "leads_deny_anon_select"
  on public.leads
  for select
  to anon, authenticated
  using (false);

create policy "leads_deny_anon_update"
  on public.leads
  for update
  to anon, authenticated
  using (false);

create policy "leads_deny_anon_delete"
  on public.leads
  for delete
  to anon, authenticated
  using (false);

-- 3. Staff & Administrative View for Suspicious Leads
-- Enables staff to safely inspect flagged or quarantined enquiries without risking accidental lead loss
create or replace view public.admin_suspicious_leads as
select
  id,
  enquiry_id,
  received_at,
  name,
  email,
  phone,
  company,
  service,
  location,
  message,
  conversion_page,
  landing_page,
  spam_score,
  spam_flags,
  spam_status,
  turnstile_verified,
  duplicate_of,
  notification_dispatched,
  status
from public.leads
where spam_status in ('NEEDS_REVIEW', 'SPAM_SUSPECTED', 'CONFIRMED_SPAM')
   or spam_score >= 50
order by received_at desc;

-- Revoke view access from public/anon
revoke all on public.admin_suspicious_leads from public, anon, authenticated;
grant select, update on public.admin_suspicious_leads to service_role;
