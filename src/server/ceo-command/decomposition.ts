/**
 * ENTIREFM CEO COMMAND — DETERMINISTIC DECOMPOSITION (Phase 0I)
 * ==============================================================
 * Root-cause contribution analysis for:
 *   - Gross Margin movements
 *   - SLA performance
 *   - Revenue leakage
 *
 * These are deterministic, evidence-backed analyses.
 * The AI layer explains the measured contributors;
 * it does not invent causation from scratch.
 */

import type { DecompositionComponent, EvidenceItem, DateRange, DataStatus } from './types';
import { dbQuery } from '../db/client';
import { detectBillingLeakage, getFinanceKPISummary, listClientInvoices, listSupplierInvoices } from '../finance';
import { listActiveSLARisks } from '../work';
import { listAllProviderPerformances } from '../supply-chain';

// ============================================================
// GROSS MARGIN ROOT CAUSE
// ============================================================

export interface MarginDecompositionResult {
  period: DateRange;
  components: DecompositionComponent[];
  attribution_coverage_pct: number;
  attribution_coverage_note: string;
  total_client_invoiced_gbp: number | null;
  total_supplier_cost_gbp: number | null;
  gross_margin_estimated_gbp: number | null;
  data_status: DataStatus;
  evidence: EvidenceItem[];
  computed_at: string;
}

export async function decomposeMargin(period: DateRange): Promise<MarginDecompositionResult> {
  const now = new Date().toISOString();
  const components: DecompositionComponent[] = [];
  const evidence: EvidenceItem[] = [];

  try {
    const [clientInvoices, supplierInvoices, kpi, leakage] = await Promise.all([
      listClientInvoices({ limit: 500 }),
      listSupplierInvoices({ limit: 500 }),
      getFinanceKPISummary(),
      detectBillingLeakage(),
    ]);

    if (clientInvoices.length === 0 && supplierInvoices.length === 0) {
      return {
        period,
        components: [],
        attribution_coverage_pct: 0,
        attribution_coverage_note: 'No financial records exist. No margin can be computed.',
        total_client_invoiced_gbp: null,
        total_supplier_cost_gbp: null,
        gross_margin_estimated_gbp: null,
        data_status: 'NO_DATA',
        evidence: [{ label: 'Finance records', value: 0, data_status: 'NO_DATA', source_service: 'finance.listClientInvoices' }],
        computed_at: now,
      };
    }

    const totalClientIssued = clientInvoices.reduce((s: number, inv: any) => s + (Number(inv.total_amount_gbp) || 0), 0);
    const totalSupplierCost = supplierInvoices
      .filter((inv: any) => ['APPROVED', 'POSTED', 'EXPORTED'].includes(inv.processing_status))
      .reduce((s: number, inv: any) => s + (Number(inv.total_amount_gbp) || 0), 0);
    const matchedCost = supplierInvoices
      .filter((inv: any) => ['APPROVED', 'POSTED', 'EXPORTED'].includes(inv.processing_status) && inv.matched_work_order_id)
      .reduce((s: number, inv: any) => s + (Number(inv.total_amount_gbp) || 0), 0);
    const unmatchedCost = totalSupplierCost - matchedCost;
    const grossMarginEstimate = totalClientIssued - totalSupplierCost;
    const attributionCoverage = totalSupplierCost > 0 ? Math.round((matchedCost / totalSupplierCost) * 100) : 0;

    components.push(
      { component: 'Client Invoiced Revenue', contribution_sign: 'POSITIVE', value: Math.round(totalClientIssued * 100) / 100, unit: 'GBP', data_status: 'LIVE', explanation: 'Total value of issued client invoices.' },
      { component: 'Approved Supplier Cost', contribution_sign: 'NEGATIVE', value: Math.round(totalSupplierCost * 100) / 100, unit: 'GBP', data_status: 'LIVE', explanation: 'Total approved, posted, and exported supplier invoice costs.' },
      { component: 'Matched Actual Cost', contribution_sign: 'NEGATIVE', value: Math.round(matchedCost * 100) / 100, unit: 'GBP', data_status: matchedCost > 0 ? 'LIVE' : 'NO_DATA', explanation: 'Supplier costs matched to specific work orders via purchase orders.' },
      { component: 'Unallocated Actual Cost', contribution_sign: 'NEGATIVE', value: Math.round(unmatchedCost * 100) / 100, unit: 'GBP', data_status: unmatchedCost > 0 ? 'LIVE' : 'NO_DATA', explanation: 'Approved supplier costs not yet matched to a work order.' },
    );

    if (leakage.length > 0) {
      components.push({
        component: 'Unbilled Completed Work (Billing Leakage)',
        contribution_sign: 'NEGATIVE',
        value: leakage.length,
        unit: 'work orders',
        data_status: 'LIVE',
        explanation: `${leakage.length} completed billable work orders have no billing record — revenue not yet captured.`,
      });
    }

    if (kpi.clientInvoicesOutstanding > 0) {
      components.push({
        component: 'Outstanding Client Receivables',
        contribution_sign: 'NEUTRAL',
        value: Math.round(kpi.clientOutstandingValue * 100) / 100,
        unit: 'GBP',
        data_status: 'LIVE',
        explanation: `Invoiced revenue not yet received in cash (accounts receivable). Cash ≠ revenue.`,
      });
    }

    evidence.push(
      { label: 'Client invoices (total)', value: clientInvoices.length, data_status: 'LIVE', source_service: 'finance.listClientInvoices', computed_at: now },
      { label: 'Supplier invoices (approved/posted/exported)', value: supplierInvoices.filter((i: any) => ['APPROVED','POSTED','EXPORTED'].includes(i.processing_status)).length, data_status: 'LIVE', source_service: 'finance.listSupplierInvoices', computed_at: now },
      { label: 'Cost attribution coverage', value: attributionCoverage, unit: '%', data_status: attributionCoverage >= 80 ? 'LIVE' : 'STALE', source_service: 'finance.matchSupplierInvoice', computed_at: now },
      { label: 'Billing leakage count', value: leakage.length, data_status: leakage.length > 0 ? 'LIVE' : 'ZERO', source_service: 'finance.detectBillingLeakage', computed_at: now },
    );

    return {
      period,
      components,
      attribution_coverage_pct: attributionCoverage,
      attribution_coverage_note: attributionCoverage < 80 ? `Cost attribution coverage is ${attributionCoverage}%. Margin figures are indicative only — unmatched supplier costs reduce accuracy.` : `Cost attribution coverage is ${attributionCoverage}%.`,
      total_client_invoiced_gbp: Math.round(totalClientIssued * 100) / 100,
      total_supplier_cost_gbp: Math.round(totalSupplierCost * 100) / 100,
      gross_margin_estimated_gbp: Math.round(grossMarginEstimate * 100) / 100,
      data_status: 'LIVE',
      evidence,
      computed_at: now,
    };
  } catch (err) {
    return {
      period,
      components: [],
      attribution_coverage_pct: 0,
      attribution_coverage_note: 'Finance data unavailable.',
      total_client_invoiced_gbp: null,
      total_supplier_cost_gbp: null,
      gross_margin_estimated_gbp: null,
      data_status: 'NO_DATA',
      evidence: [{ label: 'Error', value: String(err), data_status: 'NO_DATA' }],
      computed_at: now,
    };
  }
}

// ============================================================
// REVENUE LEAKAGE ANALYSIS
// ============================================================

export interface LeakageCategory {
  category: string;
  count: number;
  description: string;
  data_status: DataStatus;
  href?: string;
}

export async function analyseRevenueLeakage(): Promise<{ categories: LeakageCategory[]; total_items: number; data_status: DataStatus; computed_at: string }> {
  const now = new Date().toISOString();
  const categories: LeakageCategory[] = [];

  try {
    const leakage = await detectBillingLeakage();
    const kpi = await getFinanceKPISummary();

    if (leakage.length === 0 && kpi.billingReadyCount === 0) {
      return { categories: [], total_items: 0, data_status: 'NO_DATA', computed_at: now };
    }

    if (leakage.length > 0) {
      const aged14 = leakage.filter(l => l.ageingDays >= 14);
      const aged7 = leakage.filter(l => l.ageingDays >= 7 && l.ageingDays < 14);
      if (aged14.length > 0) {
        categories.push({ category: 'COMPLETED_NOT_INVOICED_14D+', count: aged14.length, description: `${aged14.length} completed billable work orders not invoiced after 14+ days.`, data_status: 'LIVE', href: '/admin/finance/billing' });
      }
      if (aged7.length > 0) {
        categories.push({ category: 'COMPLETED_NOT_INVOICED_7_14D', count: aged7.length, description: `${aged7.length} completed billable work orders not invoiced (7–14 days).`, data_status: 'LIVE', href: '/admin/finance/billing' });
      }
    }

    if (kpi.billingReadyCount > 0) {
      categories.push({ category: 'BILLING_READY_QUEUE', count: kpi.billingReadyCount, description: `${kpi.billingReadyCount} records are billing-ready but not yet issued as invoices.`, data_status: 'LIVE', href: '/admin/finance/billing' });
    }

    if (kpi.supplierInvoicesAwaitingReview > 0) {
      categories.push({ category: 'SUPPLIER_INVOICE_BLOCKED', count: kpi.supplierInvoicesAwaitingReview, description: `${kpi.supplierInvoicesAwaitingReview} supplier invoices awaiting review — blocking cost matching and margin confirmation.`, data_status: 'LIVE', href: '/admin/finance/supplier-invoices' });
    }

    return { categories, total_items: categories.reduce((s, c) => s + c.count, 0), data_status: 'LIVE', computed_at: now };
  } catch {
    return { categories: [], total_items: 0, data_status: 'NO_DATA', computed_at: now };
  }
}

// ============================================================
// SLA ROOT CAUSE
// ============================================================

export interface SlaRootCause {
  dimension: string;
  value: string;
  count: number;
  severity: 'CRITICAL' | 'WARNING' | 'WATCH';
}

export async function analyseSlaRootCause(): Promise<{ dimensions: SlaRootCause[]; data_status: DataStatus; total_at_risk: number; computed_at: string }> {
  const now = new Date().toISOString();
  try {
    const slaRisks = await listActiveSLARisks();
    if (slaRisks.length === 0) return { dimensions: [], data_status: 'NO_DATA', total_at_risk: 0, computed_at: now };

    const byPriority: Record<string, number> = {};
    const byProvider: Record<string, number> = {};
    for (const wo of slaRisks) {
      const priority = (wo as any).priority || 'UNKNOWN';
      byPriority[priority] = (byPriority[priority] || 0) + 1;
    }

    const dimensions: SlaRootCause[] = [];
    for (const [priority, count] of Object.entries(byPriority).sort((a, b) => b[1] - a[1])) {
      dimensions.push({ dimension: 'Priority', value: priority, count, severity: priority === 'P1_CRITICAL' ? 'CRITICAL' : 'WARNING' });
    }

    // Provider dimension from canonical performance
    try {
      const mockSession: any = { orgType: 'ENTIREFM', role: 'ADMIN' };
      const perfRes = await listAllProviderPerformances(mockSession);
      for (const perf of perfRes.providers || []) {
        const slaBreachPct = 100 - (perf.attendanceSlaPct || 100);
        if (slaBreachPct > 20) {
          dimensions.push({ dimension: 'Provider', value: perf.providerName || perf.providerOrgId, count: Math.round((perf.jobsCompletedTotal || 0) * slaBreachPct / 100), severity: slaBreachPct > 40 ? 'CRITICAL' : 'WARNING' });
        }
      }
    } catch { /* supply chain data empty */ }


    return { dimensions, data_status: 'LIVE', total_at_risk: slaRisks.length, computed_at: now };
  } catch {
    return { dimensions: [], data_status: 'NO_DATA', total_at_risk: 0, computed_at: now };
  }
}
