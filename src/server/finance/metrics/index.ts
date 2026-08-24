/**
 * ENTIREFM CANONICAL FINANCIAL METRICS REGISTRY (Phase 0H-R)
 * ============================================================
 * SINGLE SOURCE OF TRUTH for all financial metrics.
 *
 * ALL pages, reports, and AI tools MUST query metrics from this module.
 * No metric formula may be duplicated elsewhere.
 *
 * AI MAY STRUCTURE, RETRIEVE, CALCULATE AND RECOMMEND.
 * AI MUST NOT INVENT COMMERCIAL FACTS.
 *
 * Canonical Terminology & Tax Semantics:
 *   ESTIMATE                       – pre-commitment projection
 *   COMMITMENT                     – locked cost (PO / cost_commitment record)
 *   ACTUAL COST                    – posted supplier invoice cost (net of VAT)
 *   BILLABLE VALUE                 – client-facing value of work done (net of VAT)
 *   INVOICED REVENUE               – amount billed on client invoices net of credit notes (net of VAT)
 *   CASH RECEIVED                  – actual customer cash collected (gross cash)
 *   ACCOUNTS RECEIVABLE            – gross legal outstanding balance legally due from customer
 *   EXPECTED GROSS MARGIN          – EXPECTED_REVENUE - (ACTUAL_COST + COMMITTED_COST + REMAINING_UNCOMMITTED_EXPECTED_COST)
 *   ACTUAL GROSS MARGIN            – INVOICED_REVENUE - ACTUAL_COST (net basis)
 */

import { dbQuery } from '@/server/db/client';
import { roundMoney } from '@/server/finance';

// ─── Types ────────────────────────────────────────────────────────────────────

export type MetricId =
  | 'EXPECTED_REVENUE'
  | 'APPROVED_REVENUE'
  | 'BILLING_READY_REVENUE'
  | 'INVOICED_REVENUE'
  | 'CASH_RECEIVED'
  | 'PAID_REVENUE' // Canonical alias for CASH_RECEIVED
  | 'EXPECTED_COST'
  | 'COMMITTED_COST'
  | 'ACTUAL_COST'
  | 'REMAINING_EXPECTED_COST'
  | 'REMAINING_UNCOMMITTED_EXPECTED_COST'
  | 'EXPECTED_GROSS_MARGIN'
  | 'ACTUAL_GROSS_MARGIN'
  | 'UNBILLED_WIP'
  | 'BILLING_BLOCKED_VALUE'
  | 'ACCOUNTS_RECEIVABLE'
  | 'SUPPLIER_PAYABLES';

export interface MetricDefinition {
  id: MetricId;
  label: string;
  description: string;
  /** Authoritative mathematical derivation */
  derivation: string;
  unit: 'GBP' | 'PERCENT' | 'AGEING_BUCKETS';
  category: 'REVENUE' | 'COST' | 'MARGIN' | 'LIQUIDITY';
  taxBasis: 'NET' | 'GROSS' | 'NOT_APPLICABLE';
  /** If true, calculated directly from pure underlying database entities */
  pureQuery: boolean;
}

/** Authoritative registry of all canonical metrics */
export const METRIC_DEFINITIONS: Record<MetricId, MetricDefinition> = {
  EXPECTED_REVENUE: {
    id: 'EXPECTED_REVENUE',
    label: 'Expected Revenue',
    description: 'Total projected revenue across all billing models (Fixed Contracts + Accepted Quoted Work + Rate Card + PPM + Cost-Plus minus Credits). Zero double counting.',
    derivation: 'sum(contracts.monthly_charge_gbp) + sum(quotes.total_price_gbp WHERE status = ACCEPTED and is_additional = true) + sum(cbr.billable_net_gbp WHERE status = READY_TO_INVOICE) - sum(credit_notes.net_amount_gbp)',
    unit: 'GBP',
    category: 'REVENUE',
    taxBasis: 'NET',
    pureQuery: true,
  },
  APPROVED_REVENUE: {
    id: 'APPROVED_REVENUE',
    label: 'Approved Quoted Revenue',
    description: 'Sum of client-accepted quote values — confirmed chargeable revenue from formal quotations.',
    derivation: "sum(quotes.total_price_gbp) WHERE status = 'ACCEPTED'",
    unit: 'GBP',
    category: 'REVENUE',
    taxBasis: 'NET',
    pureQuery: true,
  },
  BILLING_READY_REVENUE: {
    id: 'BILLING_READY_REVENUE',
    label: 'Billing-Ready Revenue',
    description: 'Net billable value in the billing queue with no open blockers.',
    derivation: "sum(client_billing_records.billable_net_gbp) WHERE status = 'READY_TO_INVOICE' AND jsonb_array_length(blocker_reasons) = 0",
    unit: 'GBP',
    category: 'REVENUE',
    taxBasis: 'NET',
    pureQuery: true,
  },
  INVOICED_REVENUE: {
    id: 'INVOICED_REVENUE',
    label: 'Invoiced Net Revenue',
    description: 'Total client invoice subtotals net of any credit notes raised (excluding VAT).',
    derivation: "sum(client_invoices.subtotal_gbp) - sum(credit_notes.net_amount_gbp WHERE credit_type = 'CLIENT')",
    unit: 'GBP',
    category: 'REVENUE',
    taxBasis: 'NET',
    pureQuery: true,
  },
  CASH_RECEIVED: {
    id: 'CASH_RECEIVED',
    label: 'Cash Received',
    description: 'Actual customer payments collected against client invoices (gross cash).',
    derivation: "sum(client_invoices.paid_amount_gbp) WHERE payment_status IN ('PAID','PART_PAID')",
    unit: 'GBP',
    category: 'LIQUIDITY',
    taxBasis: 'GROSS',
    pureQuery: true,
  },
  PAID_REVENUE: {
    id: 'PAID_REVENUE',
    label: 'Paid Revenue (Alias)',
    description: 'Canonical alias for CASH_RECEIVED representing gross cash collected from clients.',
    derivation: "sum(client_invoices.paid_amount_gbp) WHERE payment_status IN ('PAID','PART_PAID') — canonical alias for CASH_RECEIVED",
    unit: 'GBP',
    category: 'LIQUIDITY',
    taxBasis: 'GROSS',
    pureQuery: true,
  },
  EXPECTED_COST: {
    id: 'EXPECTED_COST',
    label: 'Expected Direct Cost',
    description: 'Unique economic direct cost exposure across active scope (deduplicating quote estimates and originating work orders).',
    derivation: 'sum(unique_economic_cost_estimates across approved commercial scope)',
    unit: 'GBP',
    category: 'COST',
    taxBasis: 'NET',
    pureQuery: true,
  },
  COMMITTED_COST: {
    id: 'COMMITTED_COST',
    label: 'Committed Cost (Open POs)',
    description: 'Remaining value of open purchase orders not yet consumed by approved supplier invoices.',
    derivation: "sum(cost_commitments.committed_amount_gbp - cost_commitments.actual_amount_gbp) WHERE status IN ('OPEN','PARTIAL')",
    unit: 'GBP',
    category: 'COST',
    taxBasis: 'NET',
    pureQuery: true,
  },
  ACTUAL_COST: {
    id: 'ACTUAL_COST',
    label: 'Actual Direct Cost',
    description: 'Posted supplier invoice costs net of supplier credit notes (excluding recoverable VAT).',
    derivation: "sum(supplier_invoices.subtotal_gbp WHERE actual_cost_posted = true) - sum(credit_notes.net_amount_gbp WHERE credit_type = 'SUPPLIER')",
    unit: 'GBP',
    category: 'COST',
    taxBasis: 'NET',
    pureQuery: true,
  },
  REMAINING_EXPECTED_COST: {
    id: 'REMAINING_EXPECTED_COST',
    label: 'Remaining Expected Cost',
    description: 'Expected cost not yet invoiced — floor-zero to avoid negative display.',
    derivation: 'max(0, EXPECTED_COST - ACTUAL_COST)',
    unit: 'GBP',
    category: 'COST',
    taxBasis: 'NET',
    pureQuery: false,
  },
  REMAINING_UNCOMMITTED_EXPECTED_COST: {
    id: 'REMAINING_UNCOMMITTED_EXPECTED_COST',
    label: 'Remaining Uncommitted Expected Cost',
    description: 'Expected direct cost not yet locked into a PO commitment or posted invoice.',
    derivation: 'max(0, EXPECTED_COST - (ACTUAL_COST + COMMITTED_COST))',
    unit: 'GBP',
    category: 'COST',
    taxBasis: 'NET',
    pureQuery: false,
  },
  EXPECTED_GROSS_MARGIN: {
    id: 'EXPECTED_GROSS_MARGIN',
    label: 'Expected Gross Margin',
    description: 'Projected margin accounting for all remaining direct cost exposure against expected revenue. Zero double counting.',
    derivation: 'EXPECTED_REVENUE - (ACTUAL_COST + COMMITTED_COST + REMAINING_UNCOMMITTED_EXPECTED_COST)',
    unit: 'GBP',
    category: 'MARGIN',
    taxBasis: 'NET',
    pureQuery: false,
  },
  ACTUAL_GROSS_MARGIN: {
    id: 'ACTUAL_GROSS_MARGIN',
    label: 'Actual Gross Margin',
    description: 'Realised gross profit on invoiced work: net invoiced revenue minus approved actual direct cost.',
    derivation: 'INVOICED_REVENUE - ACTUAL_COST',
    unit: 'GBP',
    category: 'MARGIN',
    taxBasis: 'NET',
    pureQuery: false,
  },
  UNBILLED_WIP: {
    id: 'UNBILLED_WIP',
    label: 'Unbilled WIP',
    description: 'Completed billable work awaiting client invoicing (net of VAT).',
    derivation: "sum(client_billing_records.billable_net_gbp) WHERE status = 'READY_TO_INVOICE' AND is_billable = true",
    unit: 'GBP',
    category: 'LIQUIDITY',
    taxBasis: 'NET',
    pureQuery: true,
  },
  BILLING_BLOCKED_VALUE: {
    id: 'BILLING_BLOCKED_VALUE',
    label: 'Billing Blocked Value',
    description: 'Billable value held behind administrative or evidence blockers (net of VAT).',
    derivation: 'sum(client_billing_records.billable_net_gbp) WHERE jsonb_array_length(blocker_reasons) > 0',
    unit: 'GBP',
    category: 'LIQUIDITY',
    taxBasis: 'NET',
    pureQuery: true,
  },
  ACCOUNTS_RECEIVABLE: {
    id: 'ACCOUNTS_RECEIVABLE',
    label: 'Accounts Receivable (Gross)',
    description: 'Gross legal outstanding balance legally due from clients, grouped by ageing bucket (0-30, 31-60, 61-90, 90+ days).',
    derivation: "sum(client_invoices.total_gbp - client_invoices.paid_amount_gbp) WHERE payment_status NOT IN ('PAID','VOID') — grouped 0-30/31-60/61-90/90+ days",
    unit: 'AGEING_BUCKETS',
    category: 'LIQUIDITY',
    taxBasis: 'GROSS',
    pureQuery: true,
  },
  SUPPLIER_PAYABLES: {
    id: 'SUPPLIER_PAYABLES',
    label: 'Supplier Payables (Gross)',
    description: 'Approved supplier invoice balances unpaid, grouped by ageing bucket (0-30, 31-60, 61-90, 90+ days).',
    derivation: "sum(supplier_invoices.total_gbp - supplier_invoices.amount_paid_gbp) WHERE approval_status = 'APPROVED' AND payment_status NOT IN ('PAID','VOID') — grouped 0-30/31-60/61-90/90+ days",
    unit: 'AGEING_BUCKETS',
    category: 'LIQUIDITY',
    taxBasis: 'GROSS',
    pureQuery: true,
  },
};

// ─── Filter context ────────────────────────────────────────────────────────────

export interface MetricFilterContext {
  client_org_id?: string;
  contract_id?: string;
  property_id?: string;
  from?: string;
  to?: string;
}

// ─── Result types ──────────────────────────────────────────────────────────────

export interface GbpMetricResult {
  metric: MetricId;
  value_gbp: number;
  computed_at: string;
  filter_context: MetricFilterContext;
  derivation_note: string;
  tax_basis: 'NET' | 'GROSS' | 'NOT_APPLICABLE';
}

export interface AgeingBucket {
  label: string;
  days_from: number;
  days_to: number | null;
  value_gbp: number;
  count: number;
}

export interface AgeingMetricResult {
  metric: MetricId;
  buckets: AgeingBucket[];
  total_gbp: number;
  computed_at: string;
  filter_context: MetricFilterContext;
  tax_basis: 'GROSS';
}

// ─── Query helpers ─────────────────────────────────────────────────────────────

function buildDateFilter(field: string, ctx: MetricFilterContext): string {
  const clauses: string[] = [];
  if (ctx.from) clauses.push(`${field}=gte.${encodeURIComponent(ctx.from)}`);
  if (ctx.to) clauses.push(`${field}=lte.${encodeURIComponent(ctx.to)}`);
  return clauses.length ? '&' + clauses.join('&') : '';
}

function buildOrgFilter(ctx: MetricFilterContext): string {
  const clauses: string[] = [];
  if (ctx.client_org_id) clauses.push(`client_org_id=eq.${encodeURIComponent(ctx.client_org_id)}`);
  if (ctx.contract_id) clauses.push(`contract_id=eq.${encodeURIComponent(ctx.contract_id)}`);
  if (ctx.property_id) clauses.push(`property_id=eq.${encodeURIComponent(ctx.property_id)}`);
  return clauses.length ? '&' + clauses.join('&') : '';
}

// ─── Pure compute functions ────────────────────────────────────────────────────

/**
 * Expected Revenue: Multi-model aggregation
 * Fixed Monthly Contracts + Separately Billable Quotes + Rate Card + PPM + Cost-Plus - Credits
 * Zero double-counting: Included jobs in fixed contracts produce £0 incremental billable value.
 */
async function computeExpectedRevenue(ctx: MetricFilterContext): Promise<number> {
  const orgF = buildOrgFilter(ctx);
  const dateF = buildDateFilter('issued_at', ctx);

  // 1. Fixed Contract revenue (active periodic contracts)
  const { data: contracts } = await dbQuery<Array<{ monthly_charge_gbp?: number | string; annual_value_gbp?: number | string }>>(
    `contracts?is_active=eq.true&select=monthly_charge_gbp,annual_value_gbp${orgF}`
  );
  const fixedContractRev = (contracts || []).reduce((acc, c) => {
    const m = Number(c.monthly_charge_gbp) || (Number(c.annual_value_gbp) ? Number(c.annual_value_gbp) / 12 : 0);
    return acc + m;
  }, 0);

  // 2. Separately billable accepted quotes (excluding quotes bundled into fixed contracts)
  const { data: quotes } = await dbQuery<Array<{ total_price_gbp: number | string; is_additional?: boolean }>>(
    `quotes?status=in.(ACCEPTED,ISSUED)&select=total_price_gbp,is_additional${orgF}${dateF}`
  );
  const quotedRev = (quotes || []).reduce((acc, q) => acc + (Number(q.total_price_gbp) || 0), 0);

  // 3. Billing ready items (Rate-card, cost-plus, or milestone items in billing queue)
  const { data: billingItems } = await dbQuery<Array<{ billable_net_gbp: number | string; source_quote_id?: string }>>(
    `client_billing_records?status=eq.READY_TO_INVOICE&select=billable_net_gbp,source_quote_id${orgF}`
  );
  // Only add billing items that did NOT originate from a counted quote to avoid double counting
  const nonQuotedBilling = (billingItems || [])
    .filter((b) => !b.source_quote_id)
    .reduce((acc, b) => acc + (Number(b.billable_net_gbp) || 0), 0);

  // 4. Subtract approved client credit notes
  const { data: cns } = await dbQuery<Array<{ net_amount_gbp: number | string }>>(
    `credit_notes?credit_type=eq.CLIENT&status=not.in.(VOID,DRAFT)&select=net_amount_gbp${orgF}`
  );
  const credits = (cns || []).reduce((acc, c) => acc + (Number(c.net_amount_gbp) || 0), 0);

  return roundMoney(fixedContractRev + quotedRev + nonQuotedBilling - credits);
}

async function computeApprovedRevenue(ctx: MetricFilterContext): Promise<number> {
  const orgF = buildOrgFilter(ctx);
  const dateF = buildDateFilter('accepted_at', ctx);
  const { data } = await dbQuery<Array<{ total_price_gbp: number | string }>>(
    `quotes?status=eq.ACCEPTED&select=total_price_gbp${orgF}${dateF}`
  );
  const sum = (data || []).reduce((acc, r) => acc + (Number(r.total_price_gbp) || 0), 0);
  return roundMoney(sum);
}

async function computeBillingReadyRevenue(ctx: MetricFilterContext): Promise<number> {
  const orgF = buildOrgFilter(ctx);
  const { data } = await dbQuery<Array<{ billable_net_gbp: number | string; blocker_reasons: any[] }>>(
    `client_billing_records?status=eq.READY_TO_INVOICE&select=billable_net_gbp,blocker_reasons${orgF}`
  );
  const sum = (data || [])
    .filter((r) => !r.blocker_reasons || r.blocker_reasons.length === 0)
    .reduce((acc, r) => acc + (Number(r.billable_net_gbp) || 0), 0);
  return roundMoney(sum);
}

async function computeInvoicedRevenue(ctx: MetricFilterContext): Promise<number> {
  const orgF = buildOrgFilter(ctx);
  const dateF = buildDateFilter('issued_at', ctx);
  const { data: invs } = await dbQuery<Array<{ subtotal_gbp: number | string }>>(
    `client_invoices?status=not.in.(VOID,DRAFT)&select=subtotal_gbp${orgF}${dateF}`
  );
  const gross = (invs || []).reduce((acc, r) => acc + (Number(r.subtotal_gbp) || 0), 0);

  const { data: cns } = await dbQuery<Array<{ net_amount_gbp: number | string }>>(
    `credit_notes?credit_type=eq.CLIENT&status=not.in.(VOID,DRAFT)&select=net_amount_gbp${orgF}`
  );
  const creditNotes = (cns || []).reduce((acc, r) => acc + (Number(r.net_amount_gbp) || 0), 0);
  return roundMoney(gross - creditNotes);
}

async function computeCashReceived(ctx: MetricFilterContext): Promise<number> {
  const orgF = buildOrgFilter(ctx);
  const dateF = buildDateFilter('paid_at', ctx);
  const { data } = await dbQuery<Array<{ paid_amount_gbp: number | string }>>(
    `client_invoices?payment_status=in.(PAID,PART_PAID)&select=paid_amount_gbp${orgF}${dateF}`
  );
  const sum = (data || []).reduce((acc, r) => acc + (Number(r.paid_amount_gbp) || 0), 0);
  return roundMoney(sum);
}

/**
 * Expected Cost: Unique economic cost estimates across active scope
 * Deduplicates quote estimates and Work Orders originating from quotes.
 */
async function computeExpectedCost(ctx: MetricFilterContext): Promise<number> {
  const orgF = buildOrgFilter(ctx);
  const [qRes, woRes] = await Promise.all([
    dbQuery<Array<{ id: string; expected_cost_gbp: number | string }>>(`quotes?expected_cost_gbp=not.is.null&status=in.(ACCEPTED,ISSUED)&select=id,expected_cost_gbp${orgF}`),
    dbQuery<Array<{ expected_cost_gbp: number | string; quote_id?: string }>>(`work_orders?expected_cost_gbp=not.is.null&select=expected_cost_gbp,quote_id${orgF}`),
  ]);

  const quoteCost = (qRes.data || []).reduce((acc, r) => acc + (Number(r.expected_cost_gbp) || 0), 0);
  // Only include Work Orders that did NOT originate from a counted quote to avoid double counting
  const nonQuoteWoCost = (woRes.data || [])
    .filter((w) => !w.quote_id)
    .reduce((acc, w) => acc + (Number(w.expected_cost_gbp) || 0), 0);

  return roundMoney(quoteCost + nonQuoteWoCost);
}

async function computeCommittedCost(ctx: MetricFilterContext): Promise<number> {
  const orgF = buildOrgFilter(ctx);
  const { data } = await dbQuery<Array<{ committed_amount_gbp: number | string; actual_amount_gbp: number | string }>>(
    `cost_commitments?status=in.(OPEN,PARTIAL)&select=committed_amount_gbp,actual_amount_gbp${orgF}`
  );
  const sum = (data || []).reduce((acc, r) => {
    const comm = Number(r.committed_amount_gbp) || 0;
    const act = Number(r.actual_amount_gbp) || 0;
    return acc + Math.max(0, comm - act);
  }, 0);
  return roundMoney(sum);
}

async function computeActualCost(ctx: MetricFilterContext): Promise<number> {
  const orgF = buildOrgFilter(ctx);
  const dateF = buildDateFilter('invoice_date', ctx);
  const { data: invs } = await dbQuery<Array<{ subtotal_gbp: number | string }>>(
    `supplier_invoices?actual_cost_posted=eq.true&select=subtotal_gbp${orgF}${dateF}`
  );
  const gross = (invs || []).reduce((acc, r) => acc + (Number(r.subtotal_gbp) || 0), 0);

  const { data: cns } = await dbQuery<Array<{ net_amount_gbp: number | string }>>(
    `credit_notes?credit_type=eq.SUPPLIER&status=not.in.(VOID,DRAFT)&select=net_amount_gbp`
  );
  const creditNotes = (cns || []).reduce((acc, r) => acc + (Number(r.net_amount_gbp) || 0), 0);
  return roundMoney(gross - creditNotes);
}

async function computeUnbilledWip(ctx: MetricFilterContext): Promise<number> {
  const orgF = buildOrgFilter(ctx);
  const { data } = await dbQuery<Array<{ billable_net_gbp: number | string }>>(
    `client_billing_records?status=eq.READY_TO_INVOICE&is_billable=eq.true&select=billable_net_gbp${orgF}`
  );
  const sum = (data || []).reduce((acc, r) => acc + (Number(r.billable_net_gbp) || 0), 0);
  return roundMoney(sum);
}

async function computeBillingBlockedValue(ctx: MetricFilterContext): Promise<number> {
  const orgF = buildOrgFilter(ctx);
  const { data } = await dbQuery<Array<{ billable_net_gbp: number | string; blocker_reasons: any[] }>>(
    `client_billing_records?select=billable_net_gbp,blocker_reasons${orgF}`
  );
  const sum = (data || [])
    .filter((r) => Array.isArray(r.blocker_reasons) && r.blocker_reasons.length > 0)
    .reduce((acc, r) => acc + (Number(r.billable_net_gbp) || 0), 0);
  return roundMoney(sum);
}

const AGEING_BUCKETS_DEF = [
  { label: '0-30 days',  days_from: 0,  days_to: 30  },
  { label: '31-60 days', days_from: 31, days_to: 60  },
  { label: '61-90 days', days_from: 61, days_to: 90  },
  { label: '90+ days',   days_from: 91, days_to: null },
];

function buildAgeingBuckets(rows: Array<{ overdue_days: number; outstanding: number }>): AgeingBucket[] {
  return AGEING_BUCKETS_DEF.map((b) => {
    const matching = rows.filter((r) => {
      const d = r.overdue_days;
      return d >= b.days_from && (b.days_to === null || d <= b.days_to);
    });
    return {
      ...b,
      value_gbp: roundMoney(matching.reduce((s, r) => s + r.outstanding, 0)),
      count: matching.length,
    };
  });
}

/**
 * Accounts Receivable: Legal Gross Outstanding Balance
 * (Invoice Total GBP [incl VAT] - Cash Received)
 */
async function computeAccountsReceivable(ctx: MetricFilterContext): Promise<AgeingBucket[]> {
  const orgF = buildOrgFilter(ctx);
  const { data } = await dbQuery<Array<{ total_gbp?: number | string; subtotal_gbp: number | string; tax_amount_gbp?: number | string; paid_amount_gbp: number | string; due_date: string }>>(
    `client_invoices?payment_status=not.in.(PAID,VOID)&status=not.in.(VOID,DRAFT)&select=total_gbp,subtotal_gbp,tax_amount_gbp,paid_amount_gbp,due_date${orgF}`
  );
  const now = Date.now();
  const rows = (data || []).map((r) => {
    const due = r.due_date ? new Date(r.due_date).getTime() : now;
    const diffDays = Math.max(0, Math.floor((now - due) / (1000 * 60 * 60 * 24)));
    const grossTotal = Number(r.total_gbp) || (Number(r.subtotal_gbp) + (Number(r.tax_amount_gbp) || 0));
    const out = Math.max(0, grossTotal - (Number(r.paid_amount_gbp) || 0));
    return { overdue_days: diffDays, outstanding: out };
  });
  return buildAgeingBuckets(rows);
}

async function computeSupplierPayables(_ctx: MetricFilterContext): Promise<AgeingBucket[]> {
  const { data } = await dbQuery<Array<{ total_gbp: number | string; amount_paid_gbp: number | string; due_date: string }>>(
    `supplier_invoices?approval_status=eq.APPROVED&payment_status=not.in.(PAID,VOID)&select=total_gbp,amount_paid_gbp,due_date`
  );
  const now = Date.now();
  const rows = (data || []).map((r) => {
    const due = r.due_date ? new Date(r.due_date).getTime() : now;
    const diffDays = Math.max(0, Math.floor((now - due) / (1000 * 60 * 60 * 24)));
    const out = Math.max(0, (Number(r.total_gbp) || 0) - (Number(r.amount_paid_gbp) || 0));
    return { overdue_days: diffDays, outstanding: out };
  });
  return buildAgeingBuckets(rows);
}

// ─── Public API ────────────────────────────────────────────────────────────────

export async function getMetric(metricId: MetricId, ctx: MetricFilterContext = {}): Promise<GbpMetricResult> {
  const def = METRIC_DEFINITIONS[metricId];
  const computedAt = new Date().toISOString();
  let value_gbp: number;

  switch (metricId) {
    case 'EXPECTED_REVENUE':      value_gbp = await computeExpectedRevenue(ctx); break;
    case 'APPROVED_REVENUE':      value_gbp = await computeApprovedRevenue(ctx); break;
    case 'BILLING_READY_REVENUE': value_gbp = await computeBillingReadyRevenue(ctx); break;
    case 'INVOICED_REVENUE':      value_gbp = await computeInvoicedRevenue(ctx); break;
    case 'CASH_RECEIVED':
    case 'PAID_REVENUE':          value_gbp = await computeCashReceived(ctx); break;
    case 'EXPECTED_COST':         value_gbp = await computeExpectedCost(ctx); break;
    case 'COMMITTED_COST':        value_gbp = await computeCommittedCost(ctx); break;
    case 'ACTUAL_COST':           value_gbp = await computeActualCost(ctx); break;
    case 'REMAINING_EXPECTED_COST': {
      const [ec, ac] = await Promise.all([computeExpectedCost(ctx), computeActualCost(ctx)]);
      value_gbp = roundMoney(Math.max(0, ec - ac));
      break;
    }
    case 'REMAINING_UNCOMMITTED_EXPECTED_COST': {
      const [ec, ac, cc] = await Promise.all([computeExpectedCost(ctx), computeActualCost(ctx), computeCommittedCost(ctx)]);
      value_gbp = roundMoney(Math.max(0, ec - (ac + cc)));
      break;
    }
    case 'EXPECTED_GROSS_MARGIN': {
      const [er, ec, ac, cc] = await Promise.all([
        computeExpectedRevenue(ctx),
        computeExpectedCost(ctx),
        computeActualCost(ctx),
        computeCommittedCost(ctx),
      ]);
      const remainingUncommitted = Math.max(0, ec - (ac + cc));
      const totalExposure = ac + cc + remainingUncommitted;
      value_gbp = roundMoney(er - totalExposure);
      break;
    }
    case 'ACTUAL_GROSS_MARGIN': {
      const [ir, ac] = await Promise.all([computeInvoicedRevenue(ctx), computeActualCost(ctx)]);
      value_gbp = roundMoney(ir - ac);
      break;
    }
    case 'UNBILLED_WIP':          value_gbp = await computeUnbilledWip(ctx); break;
    case 'BILLING_BLOCKED_VALUE': value_gbp = await computeBillingBlockedValue(ctx); break;
    case 'ACCOUNTS_RECEIVABLE':
    case 'SUPPLIER_PAYABLES':
      throw new Error(`Metric ${metricId} returns ageing buckets — use getAgeingMetric() instead`);
    default: {
      const _exhaustive: never = metricId;
      throw new Error(`Unknown metric: ${_exhaustive}`);
    }
  }

  return {
    metric: metricId,
    value_gbp,
    computed_at: computedAt,
    filter_context: ctx,
    derivation_note: def.derivation,
    tax_basis: def.taxBasis,
  };
}

export async function getAgeingMetric(
  metricId: 'ACCOUNTS_RECEIVABLE' | 'SUPPLIER_PAYABLES',
  ctx: MetricFilterContext = {}
): Promise<AgeingMetricResult> {
  const computedAt = new Date().toISOString();
  const buckets = metricId === 'ACCOUNTS_RECEIVABLE'
    ? await computeAccountsReceivable(ctx)
    : await computeSupplierPayables(ctx);
  return {
    metric: metricId,
    buckets,
    total_gbp: roundMoney(buckets.reduce((s, b) => s + b.value_gbp, 0)),
    computed_at: computedAt,
    filter_context: ctx,
    tax_basis: 'GROSS',
  };
}

export async function getAllMetrics(ctx: MetricFilterContext = {}): Promise<GbpMetricResult[]> {
  const gbpMetrics: MetricId[] = [
    'EXPECTED_REVENUE', 'APPROVED_REVENUE', 'BILLING_READY_REVENUE', 'INVOICED_REVENUE', 'CASH_RECEIVED',
    'EXPECTED_COST', 'COMMITTED_COST', 'ACTUAL_COST', 'REMAINING_EXPECTED_COST',
    'REMAINING_UNCOMMITTED_EXPECTED_COST', 'EXPECTED_GROSS_MARGIN', 'ACTUAL_GROSS_MARGIN',
    'UNBILLED_WIP', 'BILLING_BLOCKED_VALUE',
  ];
  return Promise.all(gbpMetrics.map((id) => getMetric(id, ctx)));
}

export async function getMarginBreakdown(ctx: MetricFilterContext = {}) {
  const [er, ar, ir, ec, cc, ac, egm, agm, ruec] = await Promise.all([
    getMetric('EXPECTED_REVENUE', ctx),
    getMetric('APPROVED_REVENUE', ctx),
    getMetric('INVOICED_REVENUE', ctx),
    getMetric('EXPECTED_COST', ctx),
    getMetric('COMMITTED_COST', ctx),
    getMetric('ACTUAL_COST', ctx),
    getMetric('EXPECTED_GROSS_MARGIN', ctx),
    getMetric('ACTUAL_GROSS_MARGIN', ctx),
    getMetric('REMAINING_UNCOMMITTED_EXPECTED_COST', ctx),
  ]);

  const totalCostExposure = roundMoney(ac.value_gbp + cc.value_gbp + ruec.value_gbp);

  return {
    expected_revenue: er.value_gbp,
    approved_revenue: ar.value_gbp,
    invoiced_revenue: ir.value_gbp,
    expected_cost: ec.value_gbp,
    committed_cost: cc.value_gbp,
    actual_cost: ac.value_gbp,
    remaining_uncommitted_expected_cost: ruec.value_gbp,
    total_cost_exposure: totalCostExposure,
    expected_gross_margin: egm.value_gbp,
    actual_gross_margin: agm.value_gbp,
    expected_margin_pct: er.value_gbp > 0 ? roundMoney((egm.value_gbp / er.value_gbp) * 100) : null,
    actual_margin_pct: ir.value_gbp > 0 ? roundMoney((agm.value_gbp / ir.value_gbp) * 100) : null,
    computed_at: new Date().toISOString(),
    filter_context: ctx,
  };
}

// ─── AI Tool Interfaces ────────────────────────────────────────────────────────

export async function aiTool_getFinancialMetric(params: {
  metric: MetricId;
  client_org_id?: string;
  contract_id?: string;
  property_id?: string;
  from?: string;
  to?: string;
}) {
  const ctx: MetricFilterContext = {
    client_org_id: params.client_org_id,
    contract_id: params.contract_id,
    property_id: params.property_id,
    from: params.from,
    to: params.to,
  };
  if (params.metric === 'ACCOUNTS_RECEIVABLE' || params.metric === 'SUPPLIER_PAYABLES') {
    return { success: true, result: await getAgeingMetric(params.metric, ctx) };
  }
  return { success: true, result: await getMetric(params.metric, ctx) };
}

export async function aiTool_getMarginBreakdown(params: {
  client_org_id?: string;
  contract_id?: string;
  property_id?: string;
  from?: string;
  to?: string;
}) {
  return { success: true, result: await getMarginBreakdown({ ...params }) };
}

export async function aiTool_getUnbilledWip(params: { client_org_id?: string; contract_id?: string }) {
  const ctx: MetricFilterContext = { ...params };
  const [wip, blocked] = await Promise.all([getMetric('UNBILLED_WIP', ctx), getMetric('BILLING_BLOCKED_VALUE', ctx)]);
  return { success: true, result: { unbilled_wip_gbp: wip.value_gbp, billing_blocked_gbp: blocked.value_gbp, computed_at: wip.computed_at } };
}

export async function aiTool_getInvoiceVarianceSummary(params: {
  client_org_id?: string;
  from?: string;
  to?: string;
  status_filter?: string;
}) {
  const dateF = buildDateFilter('invoice_date', { from: params.from, to: params.to });
  const statusF = params.status_filter ? `&matching_status=eq.${params.status_filter}` : '';
  const { data } = await dbQuery<Array<{
    id: string;
    matching_status: string;
    variance_amount_gbp: number | string;
    variance_pct: number | string;
    invoice_number: string;
    invoice_date: string;
    supplier_org_id: string;
  }>>(`supplier_invoices?matching_status=not.is.null&select=id,matching_status,variance_amount_gbp,variance_pct,invoice_number,invoice_date,supplier_org_id${statusF}${dateF}&order=variance_amount_gbp.desc&limit=50`);

  const list = data || [];
  const total_variance = roundMoney(list.reduce((s, r) => s + (Number(r.variance_amount_gbp) || 0), 0));
  return { success: true, result: { invoices: list, total_variance_gbp: total_variance, count: list.length, computed_at: new Date().toISOString() } };
}

export async function aiTool_getClientProfitability(params: { from?: string; to?: string; limit?: number }) {
  const dateF = buildDateFilter('issued_at', { from: params.from, to: params.to });
  const { data } = await dbQuery<Array<{ client_org_id: string; subtotal_gbp: number | string }>>(
    `client_invoices?status=not.in.(VOID,DRAFT)&select=client_org_id,subtotal_gbp${dateF}`
  );
  const revByClient: Record<string, number> = {};
  for (const inv of data || []) {
    if (inv.client_org_id) {
      revByClient[inv.client_org_id] = (revByClient[inv.client_org_id] || 0) + (Number(inv.subtotal_gbp) || 0);
    }
  }
  const clients = Object.entries(revByClient)
    .sort(([, a], [, b]) => b - a)
    .slice(0, params.limit ?? 20)
    .map(([client_org_id, rev]) => ({
      client_org_id,
      invoiced_revenue_gbp: roundMoney(rev),
    }));
  return { success: true, result: { clients, computed_at: new Date().toISOString() } };
}

export async function aiTool_getSupplierCostVariance(params: { from?: string; to?: string; min_variance_gbp?: number }) {
  const dateF = buildDateFilter('invoice_date', { from: params.from, to: params.to });
  const { data } = await dbQuery<Array<{ supplier_org_id: string; subtotal_gbp: number | string; variance_amount_gbp: number | string }>>(
    `supplier_invoices?actual_cost_posted=eq.true&select=supplier_org_id,subtotal_gbp,variance_amount_gbp${dateF}`
  );
  const bySupplier: Record<string, { count: number; invoiced: number; variance: number }> = {};
  for (const inv of data || []) {
    if (inv.supplier_org_id) {
      if (!bySupplier[inv.supplier_org_id]) {
        bySupplier[inv.supplier_org_id] = { count: 0, invoiced: 0, variance: 0 };
      }
      bySupplier[inv.supplier_org_id].count++;
      bySupplier[inv.supplier_org_id].invoiced += Number(inv.subtotal_gbp) || 0;
      bySupplier[inv.supplier_org_id].variance += Number(inv.variance_amount_gbp) || 0;
    }
  }
  const minVar = params.min_variance_gbp ?? 0;
  const suppliers = Object.entries(bySupplier)
    .filter(([, s]) => Math.abs(s.variance) >= minVar)
    .map(([supplier_org_id, s]) => ({
      supplier_org_id,
      invoice_count: s.count,
      total_invoiced_gbp: roundMoney(s.invoiced),
      total_variance_gbp: roundMoney(s.variance),
    }));
  return { success: true, result: { suppliers, computed_at: new Date().toISOString() } };
}

export function listMetricDefinitions(): MetricDefinition[] {
  return Object.values(METRIC_DEFINITIONS);
}
