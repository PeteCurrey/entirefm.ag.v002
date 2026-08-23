-- ============================================================
-- ENTIREFM PHASE 0H — FINANCE AUTOMATION + INVOICE INTELLIGENCE
-- Migration: 0016_finance_automation_invoice_intelligence.sql
-- ============================================================
-- Extends:  supplier_invoices, supplier_invoice_lines,
--           client_invoices, client_invoice_lines,
--           client_billing_records
-- Creates:  credit_notes, credit_note_lines,
--           finance_tolerance_policies,
--           accounting_sync_logs, finance_mailbox_intake
-- Seeds:    INVOICE_INTELLIGENCE_AGENT, FINANCE_ANOMALY_AGENT,
--           default tolerance policy
-- Rules:    AI MAY STRUCTURE, RETRIEVE, CALCULATE AND RECOMMEND
--           AI MUST NOT INVENT COMMERCIAL FACTS
--           AI MUST NOT ALTER BANK DETAILS OR APPROVE PAYMENT
-- ============================================================

-- ============================================================
-- 1. EXTEND supplier_invoices
-- ============================================================

alter table public.supplier_invoices
  add column if not exists document_storage_path    text,
  add column if not exists document_checksum_sha256  text,
  add column if not exists document_mime_type        text,
  add column if not exists document_size_bytes       integer,
  add column if not exists extraction_status         text not null default 'PENDING'
    check (extraction_status in ('PENDING','EXTRACTING','EXTRACTED','EXTRACTION_FAILED')),
  add column if not exists extraction_result_json    jsonb default '{}'::jsonb,
  add column if not exists extraction_confidence     numeric(4,3),
  add column if not exists extracted_at              timestamptz,
  add column if not exists extracted_by_agent_id     uuid references public.ai_agents(id),
  add column if not exists resolved_supplier_org_id  uuid references public.organisations(id),
  add column if not exists supplier_account_ref      text,
  add column if not exists supplier_resolution_status text not null default 'UNRESOLVED'
    check (supplier_resolution_status in ('UNRESOLVED','RESOLVED','AMBIGUOUS','REVIEW_REQUIRED')),
  add column if not exists invoice_bank_details_json  jsonb,
  add column if not exists bank_details_change_alert  boolean not null default false,
  add column if not exists bank_alert_reviewed_by_id  uuid references public.persons(id),
  add column if not exists bank_alert_reviewed_at     timestamptz,
  add column if not exists duplicate_of_invoice_id    uuid references public.supplier_invoices(id),
  add column if not exists duplicate_detection_basis  text,
  add column if not exists mailbox_intake_id          uuid,
  add column if not exists currency                   text not null default 'GBP',
  add column if not exists match_status               text not null default 'UNMATCHED'
    check (match_status in (
      'UNMATCHED','EXACT_MATCH','MATCH_WITHIN_TOLERANCE','PARTIAL_MATCH',
      'OVER_PO','UNDER_PO','RATE_VARIANCE','QUANTITY_VARIANCE','TAX_VARIANCE',
      'NO_PO','WRONG_SUPPLIER','DUPLICATE','REVIEW_REQUIRED','MATCHED'
    )),
  add column if not exists match_result_json          jsonb default '{}'::jsonb,
  add column if not exists matched_po_id              uuid references public.purchase_orders(id),
  add column if not exists matched_work_order_id      uuid references public.work_orders(id),
  add column if not exists variance_amount_gbp        numeric(10,2) default 0.00,
  add column if not exists variance_pct               numeric(6,3),
  add column if not exists matched_at                 timestamptz,
  add column if not exists matched_by_agent_id        uuid references public.ai_agents(id),
  add column if not exists processing_status          text not null default 'RECEIVED'
    check (processing_status in (
      'RECEIVED','EXTRACTING','VALIDATING','MATCHING',
      'REVIEW_REQUIRED','APPROVED','POSTED','EXPORTED',
      'DISPUTED','DUPLICATE','REJECTED','FAILED','CREDIT_REQUIRED'
    )),
  add column if not exists approval_id                uuid references public.approvals(id),
  add column if not exists approved_at                timestamptz,
  add column if not exists approved_by_id             uuid references public.persons(id),
  add column if not exists actual_cost_posted         boolean not null default false,
  add column if not exists actual_cost_posted_at      timestamptz,
  add column if not exists actual_cost_posted_by_id   uuid references public.persons(id),
  add column if not exists disputed_at                timestamptz,
  add column if not exists disputed_by_id             uuid references public.persons(id),
  add column if not exists dispute_reason             text,
  add column if not exists dispute_amount_gbp         numeric(10,2),
  add column if not exists payment_status             text not null default 'NOT_DUE'
    check (payment_status in ('NOT_DUE','DUE','OVERDUE','PART_PAID','PAID','ON_HOLD')),
  add column if not exists payment_reference          text,
  add column if not exists paid_at                    timestamptz,
  add column if not exists paid_amount_gbp            numeric(10,2),
  add column if not exists accounting_provider        text,
  add column if not exists accounting_external_id     text,
  add column if not exists accounting_sync_status     text not null default 'NOT_SYNCED'
    check (accounting_sync_status in (
      'NOT_SYNCED','SYNCING','SYNCED','SYNC_FAILED','NOT_CONFIGURED'
    )),
  add column if not exists accounting_synced_at       timestamptz,
  add column if not exists accounting_sync_error      text,
  add column if not exists ingest_channel             text not null default 'MANUAL_UPLOAD'
    check (ingest_channel in (
      'MANUAL_UPLOAD','FINANCE_MAILBOX','CONTRACTOR_PORTAL',
      'API','ACCOUNTING_PLATFORM','STRUCTURED_EINVOICE'
    ));

create index if not exists idx_supplier_invoices_processing
  on public.supplier_invoices(processing_status);
create index if not exists idx_supplier_invoices_match
  on public.supplier_invoices(match_status);
create index if not exists idx_supplier_invoices_bank_alert
  on public.supplier_invoices(bank_details_change_alert)
  where bank_details_change_alert = true;

-- ============================================================
-- 2. EXTEND supplier_invoice_lines
-- ============================================================

alter table public.supplier_invoice_lines
  add column if not exists line_number              integer,
  add column if not exists unit                     text,
  add column if not exists unit_price_net_gbp       numeric(10,4),
  add column if not exists tax_rate_pct             numeric(5,2) default 20.00,
  add column if not exists tax_amount_gbp           numeric(10,2) default 0.00,
  add column if not exists gross_amount_gbp         numeric(10,2),
  add column if not exists supplier_sku             text,
  add column if not exists supplier_line_ref        text,
  add column if not exists work_order_id            uuid references public.work_orders(id),
  add column if not exists po_line_id               uuid references public.po_lines(id),
  add column if not exists cost_commitment_id       uuid references public.cost_commitments(id),
  add column if not exists quote_line_id            uuid references public.quote_lines(id),
  add column if not exists match_confidence         numeric(4,3),
  add column if not exists variance_type            text
    check (variance_type in (
      'EXACT_MATCH','RATE_VARIANCE','QUANTITY_VARIANCE','TAX_VARIANCE',
      'UNAUTHORISED_ITEM','WITHIN_TOLERANCE','UNMATCHED'
    )),
  add column if not exists variance_amount_gbp      numeric(10,2) default 0.00,
  add column if not exists compared_quantity        numeric(8,2),
  add column if not exists compared_unit_price_gbp  numeric(10,4),
  add column if not exists compared_total_gbp       numeric(10,2),
  add column if not exists allocation_json          jsonb default '[]'::jsonb,
  add column if not exists exception_reason         text;

-- ============================================================
-- 3. EXTEND client_invoices
-- ============================================================

alter table public.client_invoices
  add column if not exists currency                 text not null default 'GBP',
  add column if not exists billing_period_start     date,
  add column if not exists billing_period_end       date,
  add column if not exists client_po_ref            text,
  add column if not exists notes                    text,
  add column if not exists evidence_pack_path       text,
  add column if not exists payment_status           text not null default 'NOT_DUE'
    check (payment_status in (
      'NOT_DUE','DUE','OVERDUE','PART_PAID','PAID','IN_DISPUTE','WRITTEN_OFF'
    )),
  add column if not exists payment_reference        text,
  add column if not exists paid_at                  timestamptz,
  add column if not exists accounting_provider      text,
  add column if not exists accounting_external_id   text,
  add column if not exists accounting_sync_status   text not null default 'NOT_SYNCED'
    check (accounting_sync_status in (
      'NOT_SYNCED','SYNCING','SYNCED','SYNC_FAILED','NOT_CONFIGURED'
    )),
  add column if not exists accounting_synced_at     timestamptz,
  add column if not exists accounting_sync_error    text,
  add column if not exists issued_at               timestamptz,
  add column if not exists issued_by_id            uuid references public.persons(id),
  add column if not exists voided_at               timestamptz,
  add column if not exists voided_by_id            uuid references public.persons(id),
  add column if not exists void_reason             text;

-- EXTEND client_invoice_lines
alter table public.client_invoice_lines
  add column if not exists line_number             integer,
  add column if not exists unit                    text,
  add column if not exists tax_rate_pct            numeric(5,2) default 20.00,
  add column if not exists tax_amount_gbp          numeric(10,2) default 0.00,
  add column if not exists gross_gbp               numeric(10,2),
  add column if not exists quote_id                uuid references public.quotes(id),
  add column if not exists quote_line_id           uuid references public.quote_lines(id),
  add column if not exists billing_record_id       uuid references public.client_billing_records(id),
  add column if not exists is_pass_through         boolean not null default false,
  add column if not exists is_billable             boolean not null default true;

-- EXTEND client_billing_records
alter table public.client_billing_records
  add column if not exists quote_id                uuid references public.quotes(id),
  add column if not exists po_id                   uuid references public.purchase_orders(id),
  add column if not exists billable_net_gbp         numeric(10,2),
  add column if not exists billable_tax_gbp         numeric(10,2),
  add column if not exists billable_gross_gbp       numeric(10,2),
  add column if not exists billing_period_start     date,
  add column if not exists billing_period_end       date,
  add column if not exists client_po_ref            text,
  add column if not exists client_invoice_id        uuid references public.client_invoices(id),
  add column if not exists blocker_reasons          jsonb default '[]'::jsonb,
  add column if not exists is_billable              boolean not null default true,
  add column if not exists billing_model            text not null default 'TIME_MATERIALS'
    check (billing_model in (
      'FIXED_FEE','TIME_MATERIALS','QUOTED_WORK','COST_PLUS',
      'RATE_CARD','PPM_FIXED','PASS_THROUGH','PROJECT_MILESTONE'
    ));

-- ============================================================
-- 4. CREATE credit_notes
-- ============================================================

create table if not exists public.credit_notes (
  id                     uuid primary key default gen_random_uuid(),
  credit_note_ref        text not null,
  credit_note_type       text not null check (credit_note_type in ('SUPPLIER','CLIENT')),
  supplier_invoice_id    uuid references public.supplier_invoices(id),
  supplier_org_id        uuid references public.organisations(id),
  client_invoice_id      uuid references public.client_invoices(id),
  client_account_id      uuid references public.client_accounts(id),
  currency               text not null default 'GBP',
  subtotal_gbp           numeric(10,2) not null default 0.00,
  tax_amount_gbp         numeric(10,2) not null default 0.00,
  total_amount_gbp       numeric(10,2) not null default 0.00,
  reason                 text not null,
  status                 text not null default 'DRAFT'
    check (status in ('DRAFT','ISSUED','APPLIED','VOID')),
  issue_date             date,
  applied_at             timestamptz,
  accounting_provider    text,
  accounting_external_id text,
  accounting_sync_status text not null default 'NOT_SYNCED'
    check (accounting_sync_status in (
      'NOT_SYNCED','SYNCING','SYNCED','SYNC_FAILED','NOT_CONFIGURED'
    )),
  created_by_id          uuid references public.persons(id),
  approved_by_id         uuid references public.persons(id),
  approved_at            timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create table if not exists public.credit_note_lines (
  id                uuid primary key default gen_random_uuid(),
  credit_note_id    uuid not null references public.credit_notes(id) on delete cascade,
  original_line_id  uuid,
  line_number       integer,
  description       text not null,
  quantity          numeric(8,2) not null default 1.00,
  unit_price_gbp    numeric(10,4) not null,
  tax_rate_pct      numeric(5,2) default 20.00,
  tax_amount_gbp    numeric(10,2) not null default 0.00,
  total_gbp         numeric(10,2) not null,
  created_at        timestamptz not null default now()
);

create index if not exists idx_credit_notes_supplier
  on public.credit_notes(supplier_invoice_id);
create index if not exists idx_credit_notes_client
  on public.credit_notes(client_invoice_id);

-- ============================================================
-- 5. CREATE finance_tolerance_policies
-- ============================================================

create table if not exists public.finance_tolerance_policies (
  id                         uuid primary key default gen_random_uuid(),
  policy_name                text not null,
  is_default                 boolean not null default false,
  client_account_id          uuid references public.client_accounts(id),
  supplier_org_id            uuid references public.organisations(id),
  contract_id                uuid references public.contracts(id),
  tolerance_absolute_gbp     numeric(8,2) not null default 5.00,
  tolerance_pct              numeric(5,2) not null default 2.00,
  auto_accept_below_absolute boolean not null default true,
  require_review_above_pct   boolean not null default true,
  exception_above_pct        numeric(5,2) not null default 5.00,
  tax_rounding_tolerance_gbp numeric(6,2) not null default 0.02,
  is_active                  boolean not null default true,
  created_by_id              uuid references public.persons(id),
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

-- ============================================================
-- 6. CREATE accounting_sync_logs
-- ============================================================

create table if not exists public.accounting_sync_logs (
  id                uuid primary key default gen_random_uuid(),
  provider          text not null,
  entity_type       text not null,
  entity_id         uuid not null,
  idempotency_key   text not null unique,
  direction         text not null check (direction in ('PUSH','PULL')),
  status            text not null default 'PENDING'
    check (status in ('PENDING','SUCCESS','FAILED','RETRYING')),
  external_id       text,
  request_payload   jsonb default '{}'::jsonb,
  response_payload  jsonb default '{}'::jsonb,
  error_message     text,
  attempt_count     integer not null default 1,
  next_retry_at     timestamptz,
  succeeded_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_accounting_sync_entity
  on public.accounting_sync_logs(entity_type, entity_id);
create index if not exists idx_accounting_sync_status
  on public.accounting_sync_logs(status);

-- ============================================================
-- 7. CREATE finance_mailbox_intake
-- ============================================================

create table if not exists public.finance_mailbox_intake (
  id                    uuid primary key default gen_random_uuid(),
  received_at           timestamptz not null default now(),
  from_address          text,
  subject               text,
  raw_email_path        text,
  attachment_count      integer not null default 0,
  attachments_json      jsonb default '[]'::jsonb,
  candidate_supplier_id uuid references public.organisations(id),
  supplier_confidence   numeric(4,3),
  processing_status     text not null default 'RECEIVED'
    check (processing_status in (
      'RECEIVED','PROCESSING','INVOICES_CREATED','FAILED','DUPLICATE','IGNORED'
    )),
  invoices_created_json jsonb default '[]'::jsonb,
  error_message         text,
  communication_id      uuid,
  processed_at          timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists idx_mailbox_status
  on public.finance_mailbox_intake(processing_status);

-- ============================================================
-- 8. RLS
-- ============================================================

alter table public.credit_notes enable row level security;
alter table public.credit_note_lines enable row level security;
alter table public.finance_tolerance_policies enable row level security;
alter table public.accounting_sync_logs enable row level security;
alter table public.finance_mailbox_intake enable row level security;

create policy "EntireFM finance read credit_notes"
  on public.credit_notes for select
  using (auth.role() = 'authenticated');

create policy "EntireFM finance insert credit_notes"
  on public.credit_notes for insert
  with check (auth.role() = 'authenticated');

create policy "EntireFM finance update credit_notes"
  on public.credit_notes for update
  using (auth.role() = 'authenticated');

create policy "EntireFM finance read credit_note_lines"
  on public.credit_note_lines for select
  using (auth.role() = 'authenticated');

create policy "EntireFM finance insert credit_note_lines"
  on public.credit_note_lines for insert
  with check (auth.role() = 'authenticated');

create policy "EntireFM finance read tolerance_policies"
  on public.finance_tolerance_policies for select
  using (auth.role() = 'authenticated');

create policy "EntireFM finance insert tolerance_policies"
  on public.finance_tolerance_policies for insert
  with check (auth.role() = 'authenticated');

create policy "EntireFM finance update tolerance_policies"
  on public.finance_tolerance_policies for update
  using (auth.role() = 'authenticated');

create policy "EntireFM finance read accounting_sync_logs"
  on public.accounting_sync_logs for select
  using (auth.role() = 'authenticated');

create policy "EntireFM finance insert accounting_sync_logs"
  on public.accounting_sync_logs for insert
  with check (auth.role() = 'authenticated');

create policy "EntireFM finance update accounting_sync_logs"
  on public.accounting_sync_logs for update
  using (auth.role() = 'authenticated');

create policy "EntireFM finance read mailbox_intake"
  on public.finance_mailbox_intake for select
  using (auth.role() = 'authenticated');

create policy "EntireFM finance insert mailbox_intake"
  on public.finance_mailbox_intake for insert
  with check (auth.role() = 'authenticated');

create policy "EntireFM finance update mailbox_intake"
  on public.finance_mailbox_intake for update
  using (auth.role() = 'authenticated');

-- ============================================================
-- 9. SEED AI AGENTS
-- ============================================================

insert into public.ai_agents (
  code, name, description, role_description,
  autonomy_level, is_active,
  max_daily_budget_gbp, confidence_threshold
) values
(
  'INVOICE_INTELLIGENCE_AGENT',
  'Invoice Intelligence Agent',
  'Extracts invoice fields from documents, resolves suppliers/POs/Work Orders, compares lines against commitments, detects discrepancies, proposes match, classifies exceptions, recommends approval path.',
  'Finance automation assist: extract, identify, match, recommend. Never approve autonomously, never alter bank details, never invent invoice values.',
  'ASSIST', true, 0.00, 0.85
),
(
  'FINANCE_ANOMALY_AGENT',
  'Finance Anomaly Agent',
  'Summarises anomalies, compares invoice history, highlights unusual patterns including duplicates, bank-detail changes, high-value deviations, suspended-supplier invoices, and billing leakage.',
  'Finance anomaly detection: surface risks, highlight patterns. Cannot accuse supplier of fraud, block payment permanently, or alter bank records.',
  'ASSIST', true, 0.00, 0.80
)
on conflict (code) do nothing;

-- ============================================================
-- 10. SEED DEFAULT TOLERANCE POLICY
-- ============================================================

insert into public.finance_tolerance_policies (
  policy_name, is_default,
  tolerance_absolute_gbp, tolerance_pct,
  auto_accept_below_absolute, require_review_above_pct,
  exception_above_pct, tax_rounding_tolerance_gbp,
  is_active
) values (
  'Platform Default Tolerance Policy', true,
  5.00, 2.00,
  true, true,
  5.00, 0.02,
  true
)
on conflict do nothing;
