-- ============================================================
-- ENTIREFM PHASE 0H-R — FINANCE TRUTH & METRICS REGISTRY
-- Migration: 0017_finance_truth_and_metrics_registry.sql
-- ============================================================
-- Creates:  finance_segregation_policies, supplier_bank_detail_verifications,
--           document_extraction_corrections, financial_metric_definitions
-- Extends:  finance_tolerance_policies, supplier_invoices
-- Seeds:    Default segregation tiers, canonical metric definitions
-- Rules:    Policy-driven thresholds, no hardcoded amounts,
--           traceable policy versioning, master bank protection.
-- ============================================================

-- ============================================================
-- 1. EXTEND finance_tolerance_policies
-- ============================================================

alter table public.finance_tolerance_policies
  add column if not exists version                    integer not null default 1,
  add column if not exists scope_level                text not null default 'PLATFORM_DEFAULT'
    check (scope_level in ('PLATFORM_DEFAULT','CLIENT','CONTRACT','SUPPLIER','FINANCE_OVERRIDE')),
  add column if not exists line_level_tolerance_pct   numeric(5,2) not null default 2.00,
  add column if not exists unit_rate_tolerance_pct    numeric(5,2) not null default 0.00,
  add column if not exists quantity_tolerance_pct     numeric(5,2) not null default 0.00,
  add column if not exists notes                      text;

create index if not exists idx_tolerance_scope_level
  on public.finance_tolerance_policies(scope_level, is_active);

-- ============================================================
-- 2. CREATE finance_segregation_policies
-- ============================================================

create table if not exists public.finance_segregation_policies (
  id                          uuid primary key default gen_random_uuid(),
  policy_name                 text not null,
  is_default                  boolean not null default false,
  version                     integer not null default 1,
  scope_level                 text not null default 'PLATFORM_DEFAULT'
    check (scope_level in ('PLATFORM_DEFAULT','CLIENT','CONTRACT','SUPPLIER')),
  client_account_id           uuid references public.client_accounts(id),
  supplier_org_id             uuid references public.organisations(id),
  contract_id                 uuid references public.contracts(id),

  -- Thresholds (in GBP)
  min_invoice_threshold_gbp   numeric(10,2) not null default 0.00,
  max_creator_approval_gbp    numeric(10,2) not null default 1000.00,
  requires_second_approver    boolean not null default false,
  second_approver_threshold_gbp numeric(10,2) not null default 10000.00,

  -- Variance & Exception rules
  variance_requires_escalation boolean not null default true,
  max_auto_approval_variance_gbp numeric(10,2) not null default 0.00,
  no_po_requires_escalation   boolean not null default true,
  bank_alert_blocks_approval  boolean not null default true,

  -- Required role codes
  primary_approver_role       text not null default 'FINANCE',
  second_approver_role        text not null default 'DIRECTOR',

  is_active                   boolean not null default true,
  created_by_id               uuid references public.persons(id),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

alter table public.finance_segregation_policies enable row level security;

create policy "EntireFM finance read segregation_policies"
  on public.finance_segregation_policies for select
  using (auth.role() = 'authenticated');

create policy "EntireFM finance insert segregation_policies"
  on public.finance_segregation_policies for insert
  with check (auth.role() = 'authenticated');

create policy "EntireFM finance update segregation_policies"
  on public.finance_segregation_policies for update
  using (auth.role() = 'authenticated');

-- ============================================================
-- 3. CREATE supplier_bank_detail_verifications
-- ============================================================
-- Separate privileged workflow for supplier bank changes.
-- Cannot be altered from an invoice upload or invoice review screen.

create table if not exists public.supplier_bank_detail_verifications (
  id                          uuid primary key default gen_random_uuid(),
  supplier_org_id             uuid not null references public.organisations(id),
  requested_by_id             uuid not null references public.persons(id),
  verified_by_id              uuid references public.persons(id),
  old_bank_details_json       jsonb default '{}'::jsonb,
  new_bank_details_json       jsonb not null,
  verification_method         text not null
    check (verification_method in (
      'TELEPHONE_CALLBACK_VERIFIED','BANK_STATEMENT_AUTHENTICATED',
      'FORMAL_SOLICITOR_LETTER','DIRECTOR_WRITTEN_CONFIRMATION'
    )),
  status                      text not null default 'PENDING'
    check (status in ('PENDING','VERIFIED','REJECTED','EXPIRED')),
  rejection_reason            text,
  evidence_document_path      text,
  notes                       text,
  verified_at                 timestamptz,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

alter table public.supplier_bank_detail_verifications enable row level security;

create policy "EntireFM finance read bank_verifications"
  on public.supplier_bank_detail_verifications for select
  using (auth.role() = 'authenticated');

create policy "EntireFM finance insert bank_verifications"
  on public.supplier_bank_detail_verifications for insert
  with check (auth.role() = 'authenticated');

create policy "EntireFM finance update bank_verifications"
  on public.supplier_bank_detail_verifications for update
  using (auth.role() = 'authenticated');

-- ============================================================
-- 4. EXTEND supplier_invoices (Policy Traceability)
-- ============================================================

alter table public.supplier_invoices
  add column if not exists tolerance_policy_id          uuid references public.finance_tolerance_policies(id),
  add column if not exists tolerance_policy_version_applied integer,
  add column if not exists segregation_policy_id        uuid references public.finance_segregation_policies(id),
  add column if not exists segregation_policy_version_applied integer,
  add column if not exists second_approved_by_id        uuid references public.persons(id),
  add column if not exists second_approved_at           timestamptz,
  add column if not exists second_approval_required     boolean not null default false;

-- ============================================================
-- 5. CREATE document_extraction_corrections
-- ============================================================
-- Preserves complete history of AI extracted values vs. human corrections

create table if not exists public.document_extraction_corrections (
  id                          uuid primary key default gen_random_uuid(),
  supplier_invoice_id         uuid not null references public.supplier_invoices(id) on delete cascade,
  field_name                  text not null,
  ai_extracted_value          text,
  ai_confidence_score         numeric(4,3),
  corrected_value             text not null,
  corrected_by_person_id      uuid not null references public.persons(id),
  ai_agent_id                 uuid references public.ai_agents(id),
  agent_version_tag           text,
  notes                       text,
  created_at                  timestamptz not null default now()
);

alter table public.document_extraction_corrections enable row level security;

create policy "EntireFM finance read extraction_corrections"
  on public.document_extraction_corrections for select
  using (auth.role() = 'authenticated');

create policy "EntireFM finance insert extraction_corrections"
  on public.document_extraction_corrections for insert
  with check (auth.role() = 'authenticated');

-- ============================================================
-- 6. CREATE financial_metric_definitions
-- ============================================================
-- Central catalog of canonical metric formulas, sources, and date dimensions

create table if not exists public.financial_metric_definitions (
  metric_code                 text primary key,
  metric_name                 text not null,
  category                    text not null check (category in ('REVENUE','COST','MARGIN','WIP','CASH')),
  description                 text not null,
  formula_expression          text not null,
  authoritative_sources_json  jsonb not null default '[]'::jsonb,
  inclusion_rules_json        jsonb not null default '[]'::jsonb,
  exclusion_rules_json        jsonb not null default '[]'::jsonb,
  default_date_dimension      text not null,
  currency_handling           text not null default 'GBP_ONLY',
  is_active                   boolean not null default true,
  created_at                  timestamptz not null default now()
);

alter table public.financial_metric_definitions enable row level security;

create policy "EntireFM read financial_metric_definitions"
  on public.financial_metric_definitions for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- 7. SEED DEFAULT SEGREGATION POLICIES
-- ============================================================

insert into public.finance_segregation_policies (
  policy_name, is_default, version, scope_level,
  min_invoice_threshold_gbp, max_creator_approval_gbp,
  requires_second_approver, second_approver_threshold_gbp,
  variance_requires_escalation, max_auto_approval_variance_gbp,
  no_po_requires_escalation, bank_alert_blocks_approval,
  primary_approver_role, second_approver_role, is_active
) values (
  'Platform Default Segregation Policy', true, 1, 'PLATFORM_DEFAULT',
  0.00, 1000.00,
  true, 10000.00,
  true, 0.00,
  true, true,
  'FINANCE', 'DIRECTOR', true
)
on conflict do nothing;

-- ============================================================
-- 8. SEED CANONICAL METRIC DEFINITIONS
-- ============================================================

insert into public.financial_metric_definitions (
  metric_code, metric_name, category, description,
  formula_expression, authoritative_sources_json,
  inclusion_rules_json, exclusion_rules_json,
  default_date_dimension, currency_handling, is_active
) values
(
  'EXPECTED_REVENUE',
  'Expected Revenue',
  'REVENUE',
  'Total revenue expected from approved client quotes and contracted service schedules.',
  'sum(quotes.total_price_gbp) where status in (ACCEPTED, ISSUED)',
  '["quotes", "contracts"]'::jsonb,
  '["Approved quotes", "Active contract schedules"]'::jsonb,
  '["Draft quotes", "Rejected quotes", "Cancelled contracts"]'::jsonb,
  'quote_approved_at', 'GBP_ONLY', true
),
(
  'APPROVED_REVENUE',
  'Approved Revenue',
  'REVENUE',
  'Revenue explicitly authorized by the client with signed approval or purchase order reference.',
  'sum(quotes.total_price_gbp) where status = ACCEPTED',
  '["quotes", "client_approvals"]'::jsonb,
  '["Client accepted quotes"]'::jsonb,
  '["Pending quotes", "Internal review only"]'::jsonb,
  'client_accepted_at', 'GBP_ONLY', true
),
(
  'BILLING_READY_REVENUE',
  'Billing-Ready Revenue',
  'REVENUE',
  'Completed and verified billable work satisfying all contractual, quote, and client PO requirements.',
  'sum(client_billing_records.billable_net_gbp) where status = READY_TO_INVOICE',
  '["client_billing_records"]'::jsonb,
  '["Operationally completed work", "Accepted evidence", "Resolved commercial exceptions"]'::jsonb,
  '["Uncompleted work", "Missing client PO when required", "Already invoiced records"]'::jsonb,
  'completed_at', 'GBP_ONLY', true
),
(
  'INVOICED_REVENUE',
  'Invoiced Net Revenue',
  'REVENUE',
  'Net revenue billed to clients on issued client invoices, excluding VAT and net of client credit notes.',
  'sum(client_invoices.subtotal_gbp) where status in (ISSUED, PAID) - sum(client_credit_notes.subtotal_gbp)',
  '["client_invoices", "credit_notes"]'::jsonb,
  '["Issued client invoices", "Paid client invoices"]'::jsonb,
  '["Draft client invoices", "Voided invoices", "VAT amounts"]'::jsonb,
  'invoice_issue_date', 'GBP_ONLY', true
),
(
  'PAID_REVENUE',
  'Paid Revenue / Cash Received',
  'CASH',
  'Actual cash collected from clients as reconciled from authoritative accounting integration.',
  'sum(client_invoices.paid_amount_gbp) where payment_status in (PAID, PART_PAID)',
  '["client_invoices", "accounting_sync_logs"]'::jsonb,
  '["Reconciled cash payments from accounting adapter"]'::jsonb,
  '["Approved but unpaid invoices", "Internal estimates"]'::jsonb,
  'payment_reconciled_at', 'GBP_ONLY', true
),
(
  'EXPECTED_COST',
  'Expected Cost',
  'COST',
  'Budgeted or estimated direct subcontractor, labor, and materials cost for operational work.',
  'sum(quotes.expected_cost_gbp) + sum(work_orders.expected_cost_gbp)',
  '["quotes", "work_orders"]'::jsonb,
  '["Approved work scope estimates"]'::jsonb,
  '["Speculative unapproved proposals"]'::jsonb,
  'work_scheduled_date', 'GBP_ONLY', true
),
(
  'COMMITTED_COST',
  'Committed Cost',
  'COST',
  'Authorized supplier purchase orders not yet consumed by approved actual supplier invoice postings.',
  'sum(cost_commitments.committed_amount_gbp - cost_commitments.actual_amount_gbp) where status in (ACTIVE, PARTIALLY_CONSUMED)',
  '["cost_commitments", "purchase_orders"]'::jsonb,
  '["Active supplier POs", "Remaining committed value"]'::jsonb,
  '["Cancelled POs", "Fully consumed commitments", "Released residuals"]'::jsonb,
  'po_created_at', 'GBP_ONLY', true
),
(
  'ACTUAL_COST',
  'Actual Direct Cost',
  'COST',
  'Approved and posted supplier invoice expenditure net of supplier credit notes.',
  'sum(supplier_invoices.subtotal_gbp) where processing_status in (APPROVED, POSTED, EXPORTED) - sum(supplier_credit_notes.subtotal_gbp)',
  '["supplier_invoices", "credit_notes"]'::jsonb,
  '["Approved supplier invoices", "Posted actual costs"]'::jsonb,
  '["Unmatched invoices", "Disputed invoices", "Unapproved drafts"]'::jsonb,
  'posted_at', 'GBP_ONLY', true
),
(
  'REMAINING_EXPECTED_COST',
  'Remaining Expected Cost',
  'COST',
  'Estimated remaining expenditure required to complete active operational scope.',
  'max(0, EXPECTED_COST - ACTUAL_COST)',
  '["work_orders", "supplier_invoices"]'::jsonb,
  '["Open work orders with remaining scope"]'::jsonb,
  '["Completed and closed jobs"]'::jsonb,
  'work_target_date', 'GBP_ONLY', true
),
(
  'EXPECTED_GROSS_MARGIN',
  'Expected Gross Margin',
  'MARGIN',
  'Expected commercial margin calculated from expected revenue less actual and remaining committed costs.',
  'EXPECTED_REVENUE - (ACTUAL_COST + COMMITTED_COST)',
  '["quotes", "cost_commitments", "supplier_invoices"]'::jsonb,
  '["Active and planned jobs with commercial scope"]'::jsonb,
  '["Non-commercial non-billable jobs"]'::jsonb,
  'quote_approved_at', 'GBP_ONLY', true
),
(
  'ACTUAL_GROSS_MARGIN',
  'Actual Gross Margin',
  'MARGIN',
  'Realized gross margin calculated from net invoiced client revenue less approved actual direct supplier costs.',
  'INVOICED_REVENUE - ACTUAL_COST',
  '["client_invoices", "supplier_invoices", "credit_notes"]'::jsonb,
  '["Invoiced jobs with posted supplier costs"]'::jsonb,
  '["Collected VAT", "Unbilled estimates"]'::jsonb,
  'invoice_issue_date', 'GBP_ONLY', true
),
(
  'UNBILLED_WIP',
  'Unbilled Work-in-Progress (WIP)',
  'WIP',
  'Completed billable work orders that have not yet been invoiced to the client.',
  'sum(client_billing_records.billable_net_gbp) where status = READY_TO_INVOICE and is_billable = true',
  '["client_billing_records", "work_orders"]'::jsonb,
  '["Operationally complete billable jobs"]'::jsonb,
  '["Non-billable jobs", "Cancelled jobs", "Already invoiced work"]'::jsonb,
  'completed_at', 'GBP_ONLY', true
),
(
  'BILLING_BLOCKED_VALUE',
  'Billing Blocked Value',
  'WIP',
  'Completed work prevented from billing due to missing administrative prerequisites (client PO, evidence, quote).',
  'sum(client_billing_records.billable_net_gbp) where jsonb_array_length(blocker_reasons) > 0',
  '["client_billing_records"]'::jsonb,
  '["Completed work with active blocker reasons"]'::jsonb,
  '["Clean billing-ready items", "Uncompleted work"]'::jsonb,
  'completed_at', 'GBP_ONLY', true
),
(
  'ACCOUNTS_RECEIVABLE',
  'Accounts Receivable (AR)',
  'CASH',
  'Outstanding issued client invoices awaiting payment, grouped by aging bracket.',
  'sum(client_invoices.total_amount_gbp - coalesce(paid_amount_gbp, 0)) where status = ISSUED and payment_status != PAID',
  '["client_invoices"]'::jsonb,
  '["Issued client invoices with unpaid balance"]'::jsonb,
  '["Paid invoices", "Cancelled/voided invoices"]'::jsonb,
  'due_date', 'GBP_ONLY', true
)
on conflict (metric_code) do update set
  metric_name = excluded.metric_name,
  description = excluded.description,
  formula_expression = excluded.formula_expression,
  authoritative_sources_json = excluded.authoritative_sources_json,
  inclusion_rules_json = excluded.inclusion_rules_json,
  exclusion_rules_json = excluded.exclusion_rules_json,
  default_date_dimension = excluded.default_date_dimension;
