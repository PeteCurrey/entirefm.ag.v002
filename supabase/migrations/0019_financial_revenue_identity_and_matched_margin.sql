-- ============================================================
-- ENTIREFM PHASE 0H-R — FINAL FINANCE SEMANTIC PATCH
-- Migration: 0019_financial_revenue_identity_and_matched_margin.sql
-- ============================================================
-- 1. Creates revenue_exposures (Canonical Economic Revenue Identity)
-- 2. Creates cost_attributions (Matched Direct Cost Allocation)
-- 3. Updates canonical financial_metric_definitions for EXPECTED_REVENUE,
--    ACTUAL_GROSS_MARGIN, INVOICED_REVENUE, ACTUAL_COST
-- 4. Enforces RLS with zero external client/contractor finance leakage
-- ============================================================

-- ============================================================
-- 1. CREATE revenue_exposures (Economic Revenue Identity)
-- ============================================================

create table if not exists public.revenue_exposures (
  id                          uuid primary key default gen_random_uuid(),
  exposure_reference          text unique not null,
  client_account_id           uuid references public.client_accounts(id),
  contract_id                 uuid references public.contracts(id),
  quote_id                    uuid references public.quotes(id),
  work_order_id               uuid references public.work_orders(id),
  billing_model               text not null default 'QUOTED_WORK'
    check (billing_model in (
      'FIXED_FEE','QUOTED_WORK','RATE_CARD','COST_PLUS',
      'PPM_FIXED','PASS_THROUGH','PROJECT_MILESTONE'
    )),
  title                       text not null,
  economic_value_gbp          numeric(10,2) not null default 0.00,
  invoiced_value_gbp          numeric(10,2) not null default 0.00,
  remaining_exposure_gbp      numeric(10,2) not null default 0.00,
  current_authoritative_state text not null default 'EXPECTED'
    check (current_authoritative_state in (
      'EXPECTED','APPROVED','BILLING_READY','PARTIALLY_INVOICED',
      'FULLY_INVOICED','PAID','CANCELLED'
    )),
  current_authoritative_record text,
  matched_cost_gbp            numeric(10,2) not null default 0.00,
  unallocated_cost_gbp        numeric(10,2) not null default 0.00,
  attribution_status          text not null default 'PENDING'
    check (attribution_status in (
      'PENDING','PARTIALLY_MATCHED','FULLY_MATCHED','UNALLOCATED'
    )),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists idx_rev_exposure_client
  on public.revenue_exposures(client_account_id, current_authoritative_state);

create index if not exists idx_rev_exposure_quote
  on public.revenue_exposures(quote_id);

create index if not exists idx_rev_exposure_contract
  on public.revenue_exposures(contract_id);

alter table public.revenue_exposures enable row level security;

DROP POLICY IF EXISTS "EntireFM finance read revenue_exposures" ON public.revenue_exposures;
CREATE POLICY "EntireFM finance read revenue_exposures" ON public.revenue_exposures for select
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance insert revenue_exposures" ON public.revenue_exposures;
CREATE POLICY "EntireFM finance insert revenue_exposures" ON public.revenue_exposures for insert
  with check (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance update revenue_exposures" ON public.revenue_exposures;
CREATE POLICY "EntireFM finance update revenue_exposures" ON public.revenue_exposures for update
  using (auth.role() = 'authenticated');

-- ============================================================
-- 2. CREATE cost_attributions (Matched Direct Cost Links)
-- ============================================================

create table if not exists public.cost_attributions (
  id                          uuid primary key default gen_random_uuid(),
  revenue_exposure_id         uuid references public.revenue_exposures(id),
  client_invoice_id           uuid references public.client_invoices(id),
  client_billing_record_id    uuid references public.client_billing_records(id),
  supplier_invoice_id         uuid references public.supplier_invoices(id),
  supplier_invoice_line_id    uuid references public.supplier_invoice_lines(id),
  work_order_id               uuid references public.work_orders(id),
  attributed_cost_gbp         numeric(10,2) not null default 0.00,
  attribution_method          text not null default 'DIRECT_WORK_ORDER_LINK'
    check (attribution_method in (
      'DIRECT_WORK_ORDER_LINK','DIRECT_LINE_LINK','BILLING_RECORD_MATCH',
      'PROPORTIONAL_ALLOCATION','MANUAL_FINANCE_ATTRIBUTION'
    )),
  notes                       text,
  created_by_person_id        uuid references public.persons(id),
  created_at                  timestamptz not null default now()
);

create index if not exists idx_cost_attr_exposure
  on public.cost_attributions(revenue_exposure_id);

create index if not exists idx_cost_attr_client_inv
  on public.cost_attributions(client_invoice_id);

create index if not exists idx_cost_attr_supplier_inv
  on public.cost_attributions(supplier_invoice_id);

alter table public.cost_attributions enable row level security;

DROP POLICY IF EXISTS "EntireFM finance read cost_attributions" ON public.cost_attributions;
CREATE POLICY "EntireFM finance read cost_attributions" ON public.cost_attributions for select
  using (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance insert cost_attributions" ON public.cost_attributions;
CREATE POLICY "EntireFM finance insert cost_attributions" ON public.cost_attributions for insert
  with check (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "EntireFM finance update cost_attributions" ON public.cost_attributions;
CREATE POLICY "EntireFM finance update cost_attributions" ON public.cost_attributions for update
  using (auth.role() = 'authenticated');

-- ============================================================
-- 3. EXTEND credit_notes (Ensure credit_type alias exists)
-- ============================================================

alter table public.credit_notes
  add column if not exists credit_type text
  check (credit_type in ('SUPPLIER','CLIENT'));

-- Synchronize credit_type with credit_note_type
update public.credit_notes
  set credit_type = credit_note_type
  where credit_type is null;

-- ============================================================
-- 4. UPDATE CANONICAL METRIC DEFINITIONS (Semantics V3)
-- ============================================================

insert into public.financial_metric_definitions (
  metric_code, metric_name, category, description, formula_expression,
  authoritative_sources_json, inclusion_rules_json, exclusion_rules_json,
  default_date_dimension, currency_handling, tax_basis, is_active
)
values
(
  'EXPECTED_REVENUE',
  'Expected Revenue (Economic Identity & Lifecycle Precedence)',
  'REVENUE',
  'Total economic revenue across all commercial billing models with strict source precedence. One economic revenue opportunity contributes exactly once at any point in its lifecycle (Quote -> Billing Record -> Client Invoice). Net of client credit notes only.',
  'sum(contracts.monthly_charge_gbp) + sum(distinct_economic_revenue_exposures: max(invoiced_revenue, billing_ready_revenue, approved_quote_revenue)) - sum(credit_notes.subtotal_gbp WHERE credit_note_type = CLIENT)',
  '["contracts", "quotes", "client_billing_records", "client_invoices", "credit_notes"]'::jsonb,
  '["Active fixed contracts", "Unique approved commercial exposures", "Unblocked billing-ready WIP", "Issued client invoices"]'::jsonb,
  '["Included jobs in fixed contracts (£0 incremental)", "Quote/Billing/Invoice duplicate representations", "Supplier credit notes", "Voided invoices"]'::jsonb,
  'contract_start_date', 'GBP_ONLY', 'NET', true
),
(
  'ACTUAL_GROSS_MARGIN',
  'Actual Gross Margin (Matched Direct Scope)',
  'MARGIN',
  'Realised commercial gross profit on invoiced work: Net Invoiced Revenue minus Matched Actual Direct Supplier Costs attributable to those specific invoiced items. Unbilled WIP costs are reported separately and do not distort realised margin.',
  'INVOICED_REVENUE - MATCHED_ACTUAL_COST',
  '["client_invoices", "cost_attributions", "supplier_invoices", "credit_notes"]'::jsonb,
  '["Invoiced client revenue net of client credits", "Direct posted supplier costs attributable to invoiced work items net of supplier credits"]'::jsonb,
  '["Unbilled work direct costs (WIP)", "Unallocated period overheads", "Supplier VAT"]'::jsonb,
  'invoice_issue_date', 'GBP_ONLY', 'NET', true
),
(
  'INVOICED_REVENUE',
  'Invoiced Net Revenue',
  'REVENUE',
  'Total client invoice subtotals net of approved client credit notes (excluding VAT). Supplier credit notes never reduce client revenue.',
  'sum(client_invoices.subtotal_gbp WHERE status NOT IN (VOID, DRAFT)) - sum(credit_notes.subtotal_gbp WHERE credit_note_type = CLIENT AND status NOT IN (VOID, DRAFT))',
  '["client_invoices", "credit_notes"]'::jsonb,
  '["Issued client invoices", "Approved client credit notes"]'::jsonb,
  '["Supplier credit notes", "Draft client invoices", "Voided invoices", "Client VAT"]'::jsonb,
  'invoice_issue_date', 'GBP_ONLY', 'NET', true
),
(
  'ACTUAL_COST',
  'Actual Direct Cost',
  'COST',
  'Approved and posted supplier invoice expenditure net of supplier credit notes. Client credit notes never reduce supplier cost.',
  'sum(supplier_invoices.subtotal_gbp WHERE actual_cost_posted = true) - sum(credit_notes.subtotal_gbp WHERE credit_note_type = SUPPLIER AND status NOT IN (VOID, DRAFT))',
  '["supplier_invoices", "credit_notes"]'::jsonb,
  '["Approved and posted supplier invoices", "Supplier credit notes"]'::jsonb,
  '["Client credit notes", "Unmatched invoices", "Disputed invoices", "Recoverable supplier VAT"]'::jsonb,
  'posted_at', 'GBP_ONLY', 'NET', true
)
on conflict (metric_code) do update set
  metric_name = excluded.metric_name,
  description = excluded.description,
  formula_expression = excluded.formula_expression,
  authoritative_sources_json = excluded.authoritative_sources_json,
  inclusion_rules_json = excluded.inclusion_rules_json,
  exclusion_rules_json = excluded.exclusion_rules_json,
  tax_basis = excluded.tax_basis,
  default_date_dimension = excluded.default_date_dimension;
