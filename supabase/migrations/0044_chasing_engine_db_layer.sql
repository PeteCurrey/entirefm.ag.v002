-- ============================================================================
-- 0044: Chasing Engine — DB Persistence Layer
-- ============================================================================
-- 1. Add chase tracking columns to work_assignments
-- 2. Create index on work_orders(status) for fast sweeping
-- 3. Create communication_messages table (DB-backed idempotency)
-- ============================================================================

-- ── 1. Extend work_assignments with chasing state ──────────────────────────

alter table public.work_assignments
  add column if not exists chase_count       integer   not null default 0,
  add column if not exists last_chase_at     timestamptz,
  add column if not exists escalated_at      timestamptz;

comment on column public.work_assignments.chase_count
  is 'Number of automated chase messages sent for this assignment.';
comment on column public.work_assignments.last_chase_at
  is 'Timestamp of the last automated chase dispatch.';
comment on column public.work_assignments.escalated_at
  is 'Timestamp when this assignment was escalated to a human operator.';

-- ── 2. Index on work_orders status for fast sweep filtering ───────────────

create index if not exists idx_work_orders_status
  on public.work_orders (status);

-- ── 3. communication_messages — DB-backed idempotent message store ─────────

create table if not exists public.communication_messages (
  id                   text        primary key,
  thread_id            text        not null,
  work_order_id        text,
  sender_name          text,
  sender_email         text,
  reply_to_email       text,
  channel              text        not null default 'EMAIL',
  visibility           text        not null default 'INTERNAL_ONLY',
  body                 text        not null,
  is_incoming          boolean     not null default false,
  is_ai_generated      boolean     not null default false,
  idempotency_key      text        unique,
  delivery_state       text        not null default 'INTERFACE_ONLY',
  provider             text        not null default 'INTERFACE_ONLY',
  provider_message_id  text,
  recipient_email      text,
  queued_at            timestamptz,
  sent_at              timestamptz,
  delivered_at         timestamptz,
  failed_at            timestamptz,
  bounced_at           timestamptz,
  failure_reason       text,
  bounce_details       jsonb,
  created_at           timestamptz not null default now()
);

comment on table public.communication_messages
  is 'Durable, idempotent store for all outbound communications. Survives serverless cold starts.';

-- Defensive column guards: if this table pre-existed from a partial schema run,
-- ensure every column used by indexes below is present.
alter table public.communication_messages
  add column if not exists thread_id            text,
  add column if not exists work_order_id        text,
  add column if not exists sender_name          text,
  add column if not exists sender_email         text,
  add column if not exists reply_to_email       text,
  add column if not exists channel              text not null default 'EMAIL',
  add column if not exists visibility           text not null default 'INTERNAL_ONLY',
  add column if not exists body                 text,
  add column if not exists is_incoming          boolean not null default false,
  add column if not exists is_ai_generated      boolean not null default false,
  add column if not exists idempotency_key      text,
  add column if not exists delivery_state       text not null default 'INTERFACE_ONLY',
  add column if not exists provider             text not null default 'INTERFACE_ONLY',
  add column if not exists provider_message_id  text,
  add column if not exists recipient_email      text,
  add column if not exists queued_at            timestamptz,
  add column if not exists sent_at              timestamptz,
  add column if not exists delivered_at         timestamptz,
  add column if not exists failed_at            timestamptz,
  add column if not exists bounced_at           timestamptz,
  add column if not exists failure_reason       text,
  add column if not exists bounce_details       jsonb,
  add column if not exists created_at           timestamptz not null default now();

-- Indexes
create index if not exists idx_comm_messages_thread
  on public.communication_messages (thread_id, created_at desc);

create index if not exists idx_comm_messages_work_order
  on public.communication_messages (work_order_id)
  where work_order_id is not null;

create index if not exists idx_comm_messages_provider_msg_id
  on public.communication_messages (provider_message_id)
  where provider_message_id is not null;

-- RLS
alter table public.communication_messages enable row level security;

DROP POLICY IF EXISTS "Service role has full access to communication_messages" ON public.communication_messages;
CREATE POLICY "Service role has full access to communication_messages" ON public.communication_messages
  for all
  using (true);
