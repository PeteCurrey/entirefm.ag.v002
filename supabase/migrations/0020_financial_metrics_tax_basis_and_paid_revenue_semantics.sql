-- ============================================================
-- ENTIREFM PHASE 0H-R — TAX BASIS & PAID REVENUE SEMANTICS V3.0.1
-- Migration: 0020_financial_metrics_tax_basis_and_paid_revenue_semantics.sql
-- ============================================================
-- 1. Adds metric_basis column to financial_metric_definitions
-- 2. Upserts authoritative v3.0.1 definitions for all 19 metrics:
--    - Strict NET distinction for revenue, cost, gross margin, and WIP
--    - Strict GROSS distinction for Cash Received, Accounts Receivable, and Supplier Payables
--    - Option A semantics for PAID_REVENUE (fully settled net invoiced revenue)
-- ============================================================

-- Extend financial_metric_definitions with metric_basis if not present
alter table public.financial_metric_definitions
  add column if not exists metric_basis text not null default 'NET_REVENUE'
  check (metric_basis in (
    'NET_REVENUE','NET_COST','NET_MARGIN',
    'GROSS_CASH','GROSS_LEGAL_BALANCE','NET_WIP','NOT_APPLICABLE'
  ));

-- Upsert all canonical metrics with version 3.0.1 semantics
insert into public.financial_metric_definitions (
  metric_code, metric_name, category, description, formula_expression,
  authoritative_sources_json, inclusion_rules_json, exclusion_rules_json,
  default_date_dimension, currency_handling, tax_basis, metric_basis, is_active
)
values
(
  'EXPECTED_REVENUE',
  'Expected Revenue (Economic Identity & Lifecycle Precedence)',
  'REVENUE',
  'Total economic revenue across all commercial billing models with strict source precedence. One economic revenue opportunity contributes exactly once at any point in its lifecycle (Quote -> Billing Record -> Client Invoice). Net of client credit notes only (v3.0.1).',
  'sum(contracts.monthly_charge_gbp) + sum(distinct_economic_revenue_exposures: max(invoiced_revenue, billing_ready_revenue, approved_quote_revenue)) - sum(credit_notes.subtotal_gbp WHERE credit_note_type = CLIENT)',
  '["contracts", "quotes", "client_billing_records", "client_invoices", "credit_notes"]'::jsonb,
  '["Active fixed contracts", "Unique approved commercial exposures", "Unblocked billing-ready WIP", "Issued client invoices"]'::jsonb,
  '["Included jobs in fixed contracts (£0 incremental)", "Quote/Billing/Invoice duplicate representations", "Supplier credit notes", "Voided invoices"]'::jsonb,
  'contract_start_date', 'GBP_ONLY', 'NET', 'NET_REVENUE', true
),
(
  'APPROVED_REVENUE',
  'Approved Quoted Revenue',
  'REVENUE',
  'Sum of client-accepted quote values — confirmed chargeable revenue from formal quotations (v3.0.1).',
  'sum(quotes.total_price_gbp) WHERE status = ACCEPTED',
  '["quotes"]'::jsonb,
  '["Accepted client quotes"]'::jsonb,
  '["Draft quotes", "Rejected quotes", "Expired quotes"]'::jsonb,
  'quote_approved_at', 'GBP_ONLY', 'NET', 'NET_REVENUE', true
),
(
  'BILLING_READY_REVENUE',
  'Billing-Ready Revenue',
  'REVENUE',
  'Net billable value in the billing queue with no open blockers (v3.0.1).',
  'sum(client_billing_records.billable_net_gbp) WHERE status = READY_TO_INVOICE AND jsonb_array_length(blocker_reasons) = 0',
  '["client_billing_records"]'::jsonb,
  '["Unblocked billing records ready for invoice generation"]'::jsonb,
  '["Blocked records", "Draft records", "Already invoiced records"]'::jsonb,
  'work_completed_at', 'GBP_ONLY', 'NET', 'NET_REVENUE', true
),
(
  'INVOICED_REVENUE',
  'Invoiced Net Revenue',
  'REVENUE',
  'Total client invoice subtotals net of approved client credit notes raised (excluding VAT). Supplier credit notes never reduce client revenue (v3.0.1).',
  'sum(client_invoices.subtotal_gbp WHERE status NOT IN (VOID, DRAFT)) - sum(credit_notes.subtotal_gbp WHERE credit_note_type = CLIENT AND status NOT IN (VOID, DRAFT))',
  '["client_invoices", "credit_notes"]'::jsonb,
  '["Issued client invoices (subtotal)", "Approved client credit notes (subtotal)"]'::jsonb,
  '["VAT/Tax amounts", "Supplier credit notes", "Voided invoices", "Draft invoices"]'::jsonb,
  'issued_at', 'GBP_ONLY', 'NET', 'NET_REVENUE', true
),
(
  'CASH_RECEIVED',
  'Cash Received (Gross)',
  'CASH',
  'Actual customer payments collected against client invoices (gross cash received) (v3.0.1).',
  'sum(client_invoices.paid_amount_gbp) WHERE payment_status IN (PAID, PART_PAID)',
  '["client_invoices", "payment_transactions"]'::jsonb,
  '["Gross cash settlements received from clients"]'::jsonb,
  '["Unpaid invoice amounts", "Unsettled balances", "Credit adjustments without cash flow"]'::jsonb,
  'paid_at', 'GBP_ONLY', 'GROSS', 'GROSS_CASH', true
),
(
  'PAID_REVENUE',
  'Paid Revenue (Fully Settled Net)',
  'REVENUE',
  'Net invoiced revenue attributable to fully settled (paid in full) client invoices. Partially paid invoices contribute £0 until settled in full (v3.0.1).',
  'sum(client_invoices.subtotal_gbp) WHERE payment_status = PAID AND status NOT IN (VOID, DRAFT)',
  '["client_invoices"]'::jsonb,
  '["Subtotal net revenue of fully settled invoices"]'::jsonb,
  '["Partially paid invoices", "Unpaid invoices", "VAT/tax amounts"]'::jsonb,
  'paid_at', 'GBP_ONLY', 'NET', 'NET_REVENUE', true
),
(
  'EXPECTED_COST',
  'Expected Direct Cost',
  'COST',
  'Unique economic direct cost exposure across active scope (deduplicating quote estimates and originating work orders) (v3.0.1).',
  'sum(unique_economic_cost_estimates across approved commercial scope)',
  '["quotes", "work_orders"]'::jsonb,
  '["Approved scope direct cost estimates"]'::jsonb,
  '["Work orders originating from counted quotes"]'::jsonb,
  'work_scheduled_date', 'GBP_ONLY', 'NET', 'NET_COST', true
),
(
  'COMMITTED_COST',
  'Committed Cost (Open POs)',
  'COST',
  'Remaining value of open purchase orders not yet consumed by approved supplier invoices (v3.0.1).',
  'sum(cost_commitments.committed_amount_gbp - cost_commitments.actual_amount_gbp) WHERE status IN (OPEN, PARTIAL)',
  '["cost_commitments"]'::jsonb,
  '["Unconsumed approved purchase orders"]'::jsonb,
  '["Closed POs", "Cancelled POs", "Supplier invoices already posted"]'::jsonb,
  'po_issued_date', 'GBP_ONLY', 'NET', 'NET_COST', true
),
(
  'ACTUAL_COST',
  'Actual Direct Cost (Total Posted)',
  'COST',
  'Total approved and posted supplier invoice costs net of supplier credit notes (excluding recoverable VAT). Client credit notes never reduce supplier costs (v3.0.1).',
  'sum(supplier_invoices.subtotal_gbp WHERE actual_cost_posted = true) - sum(credit_notes.subtotal_gbp WHERE credit_note_type = SUPPLIER AND status NOT IN (VOID, DRAFT))',
  '["supplier_invoices", "credit_notes"]'::jsonb,
  '["Posted supplier invoices (subtotal net)", "Approved supplier credit notes (subtotal net)"]'::jsonb,
  '["Recoverable VAT", "Client credit notes", "Unposted invoices", "Voided invoices"]'::jsonb,
  'invoice_date', 'GBP_ONLY', 'NET', 'NET_COST', true
),
(
  'MATCHED_ACTUAL_COST',
  'Matched Actual Direct Cost',
  'COST',
  'Direct supplier costs attributable specifically to issued client invoices / billed revenue items, net of supplier credits (v3.0.1).',
  'sum(cost_attributions.attributed_cost_gbp WHERE client_invoice_id IS NOT NULL) - sum(credit_notes.subtotal_gbp WHERE credit_note_type = SUPPLIER AND matched_to_invoiced_scope = true)',
  '["cost_attributions", "supplier_invoices", "credit_notes"]'::jsonb,
  '["Direct costs matched to billed client invoices"]'::jsonb,
  '["Unbilled WIP costs", "Unmatched indirect supplier costs"]'::jsonb,
  'invoice_date', 'GBP_ONLY', 'NET', 'NET_COST', true
),
(
  'UNALLOCATED_ACTUAL_COST',
  'Unallocated Actual Cost (WIP / Unbilled)',
  'COST',
  'Posted supplier direct costs for completed or in-progress work not yet billed to clients or attributed to client invoices (v3.0.1).',
  'max(0, ACTUAL_COST - MATCHED_ACTUAL_COST)',
  '["supplier_invoices", "cost_attributions"]'::jsonb,
  '["Incurred supplier costs on unbilled / in-progress work"]'::jsonb,
  '["Direct costs already matched to client invoices"]'::jsonb,
  'invoice_date', 'GBP_ONLY', 'NET', 'NET_COST', true
),
(
  'REMAINING_EXPECTED_COST',
  'Remaining Expected Cost',
  'COST',
  'Expected cost not yet invoiced — floor-zero to avoid negative display (v3.0.1).',
  'max(0, EXPECTED_COST - ACTUAL_COST)',
  '["quotes", "work_orders", "supplier_invoices"]'::jsonb,
  '["Unposted balance of expected cost"]'::jsonb,
  '["Posted supplier invoices"]'::jsonb,
  'dynamic', 'GBP_ONLY', 'NET', 'NET_COST', true
),
(
  'REMAINING_UNCOMMITTED_EXPECTED_COST',
  'Remaining Uncommitted Expected Cost',
  'COST',
  'Expected direct cost not yet locked into a PO commitment or posted invoice (v3.0.1).',
  'max(0, EXPECTED_COST - (ACTUAL_COST + COMMITTED_COST))',
  '["quotes", "work_orders", "cost_commitments", "supplier_invoices"]'::jsonb,
  '["Uncommitted balance of expected direct scope"]'::jsonb,
  '["Committed POs", "Posted actual costs"]'::jsonb,
  'dynamic', 'GBP_ONLY', 'NET', 'NET_COST', true
),
(
  'EXPECTED_GROSS_MARGIN',
  'Expected Gross Margin',
  'MARGIN',
  'Projected commercial margin accounting for all direct cost exposure (Actual + Committed + Remaining Uncommitted) against Expected Revenue. Zero double counting (v3.0.1).',
  'EXPECTED_REVENUE - (ACTUAL_COST + COMMITTED_COST + REMAINING_UNCOMMITTED_EXPECTED_COST)',
  '["contracts", "quotes", "cost_commitments", "supplier_invoices"]'::jsonb,
  '["Active and planned jobs with commercial scope"]'::jsonb,
  '["Non-commercial non-billable jobs", "VAT/tax amounts"]'::jsonb,
  'dynamic', 'GBP_ONLY', 'NET', 'NET_MARGIN', true
),
(
  'ACTUAL_GROSS_MARGIN',
  'Actual Gross Margin (Matched)',
  'MARGIN',
  'Realised commercial gross profit on invoiced work: Net Invoiced Revenue minus Matched Actual Direct Supplier Costs attributable to those specific invoiced items. Unbilled WIP costs are reported separately and do not distort realised margin (v3.0.1).',
  'INVOICED_REVENUE - MATCHED_ACTUAL_COST',
  '["client_invoices", "cost_attributions", "credit_notes"]'::jsonb,
  '["Invoiced net revenue", "Direct supplier costs matched to invoiced scope"]'::jsonb,
  '["Unbilled WIP costs", "VAT/tax amounts", "Supplier credit notes crossing domain boundaries"]'::jsonb,
  'issued_at', 'GBP_ONLY', 'NET', 'NET_MARGIN', true
),
(
  'UNBILLED_WIP',
  'Unbilled WIP',
  'WIP',
  'Completed billable work awaiting client invoicing (net of VAT) (v3.0.1).',
  'sum(client_billing_records.billable_net_gbp) WHERE status = READY_TO_INVOICE AND is_billable = true',
  '["client_billing_records"]'::jsonb,
  '["Completed billable jobs in billing queue"]'::jsonb,
  '["Non-billable jobs", "Jobs with unresolved billing blockers"]'::jsonb,
  'work_completed_at', 'GBP_ONLY', 'NET', 'NET_WIP', true
),
(
  'BILLING_BLOCKED_VALUE',
  'Billing Blocked Value',
  'WIP',
  'Billable value held behind administrative or evidence blockers (net of VAT) (v3.0.1).',
  'sum(client_billing_records.billable_net_gbp) WHERE jsonb_array_length(blocker_reasons) > 0',
  '["client_billing_records"]'::jsonb,
  '["Billing records with active blocker flags"]'::jsonb,
  '["Unblocked ready records"]'::jsonb,
  'work_completed_at', 'GBP_ONLY', 'NET', 'NET_WIP', true
),
(
  'ACCOUNTS_RECEIVABLE',
  'Accounts Receivable (Gross Legal Balance)',
  'CASH',
  'Gross legal outstanding balance legally due from clients, grouped by ageing bucket (0-30, 31-60, 61-90, 90+ days). Net of client credit notes (v3.0.1).',
  'sum(client_invoices.total_gbp - client_invoices.paid_amount_gbp) - sum(client_credit_notes.gross_amount) WHERE payment_status NOT IN (PAID, VOID)',
  '["client_invoices", "credit_notes"]'::jsonb,
  '["Issued client invoices with gross unpaid balance", "Approved client credit notes gross"]'::jsonb,
  '["Paid invoices", "Voided invoices", "Supplier credit notes"]'::jsonb,
  'due_date', 'GBP_ONLY', 'GROSS', 'GROSS_LEGAL_BALANCE', true
),
(
  'SUPPLIER_PAYABLES',
  'Supplier Payables (Gross Legal Balance)',
  'CASH',
  'Approved supplier invoice balances unpaid, grouped by ageing bucket (0-30, 31-60, 61-90, 90+ days). Net of supplier credit notes (v3.0.1).',
  'sum(supplier_invoices.total_gbp - supplier_invoices.amount_paid_gbp) - sum(supplier_credit_notes.gross_amount) WHERE approval_status = APPROVED AND payment_status NOT IN (PAID, VOID)',
  '["supplier_invoices", "credit_notes"]'::jsonb,
  '["Approved supplier invoices with gross unpaid balance", "Approved supplier credit notes gross"]'::jsonb,
  '["Paid supplier invoices", "Voided invoices", "Client credit notes"]'::jsonb,
  'due_date', 'GBP_ONLY', 'GROSS', 'GROSS_LEGAL_BALANCE', true
)
on conflict (metric_code) do update set
  metric_name = excluded.metric_name,
  category = excluded.category,
  description = excluded.description,
  formula_expression = excluded.formula_expression,
  authoritative_sources_json = excluded.authoritative_sources_json,
  inclusion_rules_json = excluded.inclusion_rules_json,
  exclusion_rules_json = excluded.exclusion_rules_json,
  tax_basis = excluded.tax_basis,
  metric_basis = excluded.metric_basis,
  default_date_dimension = excluded.default_date_dimension;
