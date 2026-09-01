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

create policy "Service role has full access to communication_messages"
  on public.communication_messages
  for all
  using (true);
