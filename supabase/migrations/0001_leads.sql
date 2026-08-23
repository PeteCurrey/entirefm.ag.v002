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
