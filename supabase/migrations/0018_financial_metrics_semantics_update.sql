-- ============================================================
-- ENTIREFM PHASE 0H-R CLOSEOUT — FINANCIAL METRIC SEMANTICS
-- Migration: 0018_financial_metrics_semantics_update.sql
-- ============================================================

-- Add tax_basis column if missing
alter table public.financial_metric_definitions
  add column if not exists tax_basis text not null default 'NET'
  check (tax_basis in ('NET','GROSS','NOT_APPLICABLE'));

-- Upsert corrected canonical metric definitions
insert into public.financial_metric_definitions (
  metric_code, metric_name, category, description, formula_expression,
  authoritative_sources_json, inclusion_rules_json, exclusion_rules_json,
  default_date_dimension, currency_handling, tax_basis, is_active
)
values
(
  'EXPECTED_REVENUE',
  'Expected Revenue (Multi-Model)',
  'REVENUE',
  'Total projected revenue across all billing models (Fixed Contracts + Accepted Quoted Work + Rate Card + PPM + Cost-Plus minus Credits). Zero double counting.',
  'sum(contracts.monthly_charge_gbp) + sum(quotes.total_price_gbp WHERE status = ACCEPTED and is_additional = true) + sum(cbr.billable_net_gbp WHERE status = READY_TO_INVOICE) - sum(credit_notes.net_amount_gbp)',
  '["contracts", "quotes", "client_billing_records", "credit_notes"]'::jsonb,
  '["Active fixed contracts", "Accepted additional quotes", "Unblocked billing-ready WIP"]'::jsonb,
  '["Included jobs in fixed contracts (zero additional billable)", "Draft quotes", "Voided invoices"]'::jsonb,
  'contract_start_date', 'GBP_ONLY', 'NET', true
),
(
  'CASH_RECEIVED',
  'Cash Received (Gross)',
  'CASH',
  'Actual customer cash collected against issued client invoices.',
  'sum(client_invoices.paid_amount_gbp) where payment_status in (PAID, PART_PAID)',
  '["client_invoices", "accounting_sync_logs"]'::jsonb,
  '["Reconciled cash payments from accounting adapter"]'::jsonb,
  '["Approved but unpaid invoices", "Internal estimates"]'::jsonb,
  'payment_reconciled_at', 'GBP_ONLY', 'GROSS', true
),
(
  'EXPECTED_COST',
  'Expected Direct Cost (Unique Exposure)',
  'COST',
  'Unique economic direct cost exposure across active scope (deduplicating quote estimates and originating work orders).',
  'sum(unique_economic_cost_estimates across approved commercial scope)',
  '["quotes", "work_orders"]'::jsonb,
  '["Approved scope estimates"]'::jsonb,
  '["Work orders originating from quotes already counted"]'::jsonb,
  'work_scheduled_date', 'GBP_ONLY', 'NET', true
),
(
  'REMAINING_UNCOMMITTED_EXPECTED_COST',
  'Remaining Uncommitted Expected Cost',
  'COST',
  'Expected direct cost not yet locked into a PO commitment or posted invoice.',
  'max(0, EXPECTED_COST - (ACTUAL_COST + COMMITTED_COST))',
  '["quotes", "work_orders", "cost_commitments", "supplier_invoices"]'::jsonb,
  '["Uncommitted balance of expected direct scope"]'::jsonb,
  '["Committed POs", "Posted actual costs"]'::jsonb,
  'dynamic', 'GBP_ONLY', 'NET', true
),
(
  'EXPECTED_GROSS_MARGIN',
  'Expected Gross Margin',
  'MARGIN',
  'Projected commercial margin accounting for all direct cost exposure (Actual + Committed + Remaining Uncommitted) against Expected Revenue. Zero double counting.',
  'EXPECTED_REVENUE - (ACTUAL_COST + COMMITTED_COST + REMAINING_UNCOMMITTED_EXPECTED_COST)',
  '["contracts", "quotes", "cost_commitments", "supplier_invoices"]'::jsonb,
  '["Active and planned jobs with commercial scope"]'::jsonb,
  '["Non-commercial non-billable jobs"]'::jsonb,
  'dynamic', 'GBP_ONLY', 'NET', true
),
(
  'ACCOUNTS_RECEIVABLE',
  'Accounts Receivable (Gross Legal Balance)',
  'CASH',
  'Gross legal outstanding balance legally due from clients, grouped by aging bracket (0-30, 31-60, 61-90, 90+ days).',
  'sum(client_invoices.total_gbp - coalesce(paid_amount_gbp, 0)) where status = ISSUED and payment_status != PAID',
  '["client_invoices"]'::jsonb,
  '["Issued client invoices with unpaid gross balance"]'::jsonb,
  '["Paid invoices", "Cancelled/voided invoices"]'::jsonb,
  'due_date', 'GBP_ONLY', 'GROSS', true
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
