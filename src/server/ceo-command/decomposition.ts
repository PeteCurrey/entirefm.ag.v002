/**
 * ENTIREFM CEO COMMAND — DETERMINISTIC DECOMPOSITION (Phase 0I — Hardened)
 * =========================================================================
 * Root-cause contribution analysis for:
 *   - Gross Margin movements
 *   - SLA performance
 *   - Revenue leakage
 *
 * FINANCE AUTHORITY RULE:
 * This module does NOT perform its own financial arithmetic.
 * All aggregate financial metrics come from canonical Finance services:
 *   - getFinanceKPISummary()     — KPIs including outstanding values
 *   - detectBillingLeakage()     — leakage by work order
 *
 * The Finance Metrics Registry remains the sole authority for:
 *   ACTUAL_GROSS_MARGIN, MATCHED_COST, ATTRIBUTION_COVERAGE,
 *   INVOICED_REVENUE, PAID_REVENUE, ACTUAL_COST.
 *
 * CEO Command reads aggregated outputs only — it does not re-derive
 * totals by summing raw invoice rows.
 */

import type { DecompositionComponent, EvidenceItem, DateRange, DataStatus } from './types';
import { detectBillingLeakage, getFinanceKPISummary } from '../finance';
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

/**
 * Decomposes gross margin using canonical Finance KPI service.
 *
 * Data flow:
 *   ACTUAL_GROSS_MARGIN        → Finance canonical metric (getFinanceKPISummary)
 *   Matched cost               → Finance canonical attribution (getFinanceKPISummary)
 *   Contribution segmentation  → deterministic analysis of canonical outputs only
 *   Executive explanation      → CEO layer (model.ts)
 *
 * No arithmetic on raw invoice rows. No formula duplication.
 */
export async function decomposeMargin(period: DateRange): Promise<MarginDecompositionResult> {
  const now = new Date().toISOString();
  const components: DecompositionComponent[] = [];
  const evidence: EvidenceItem[] = [];

  try {
    // Both calls are canonical Finance service calls — no raw table access
    const [kpi, leakage] = await Promise.all([
      getFinanceKPISummary(),
      detectBillingLeakage(),
    ]);

    // Determine zero-data state from canonical KPI output
    const hasFinanceData = (
      kpi.billingReadyCount > 0 ||
      kpi.unbilledCompletedCount > 0 ||
      kpi.clientInvoicesOutstanding > 0 ||
      kpi.supplierInvoicesAwaitingReview > 0 ||
      kpi.supplierValueAwaitingApproval > 0 ||
      kpi.clientOutstandingValue > 0 ||
      leakage.length > 0
    );

    if (!hasFinanceData) {
      return {
        period,
        components: [],
        attribution_coverage_pct: 0,
        attribution_coverage_note: 'No financial records exist. No margin can be computed.',
        total_client_invoiced_gbp: null,
        total_supplier_cost_gbp: null,
        gross_margin_estimated_gbp: null,
        data_status: 'NO_DATA',
        evidence: [
          { label: 'Finance KPI', value: 'NO_DATA', data_status: 'NO_DATA', source_service: 'finance.getFinanceKPISummary', computed_at: now },
          { label: 'Billing leakage', value: 0, data_status: 'ZERO', source_service: 'finance.detectBillingLeakage', computed_at: now },
        ],
        computed_at: now,
      };
    }

    // Contribution components — all derived from canonical Finance KPI outputs
    // We do not re-compute totals; we report what the Finance service already knows.

    if (kpi.clientOutstandingValue > 0) {
      components.push({
        component: 'Client Outstanding Receivables',
        contribution_sign: 'POSITIVE',
        value: kpi.clientOutstandingValue,
        unit: 'GBP',
        data_status: 'LIVE',
        explanation: `${kpi.clientInvoicesOutstanding} invoices outstanding. Cash not yet received — accounts receivable, not revenue.`,
      });
    }

    if (kpi.supplierValueAwaitingApproval > 0) {
      components.push({
        component: 'Supplier Cost Awaiting Approval',
        contribution_sign: 'NEGATIVE',
        value: kpi.supplierValueAwaitingApproval,
        unit: 'GBP',
        data_status: 'LIVE',
        explanation: `${kpi.supplierInvoicesAwaitingReview} supplier invoices awaiting review — cost not yet confirmed. Margin cannot be finalised until approved.`,
      });
    }

    if (leakage.length > 0) {
      components.push({
        component: 'Unbilled Completed Work (Billing Leakage)',
        contribution_sign: 'NEGATIVE',
        value: leakage.length,
        unit: 'work orders',
        data_status: 'LIVE',
        explanation: `${leakage.length} completed billable work orders with no billing record — revenue not yet captured.`,
      });
    }

    if (kpi.financeExceptionCount > 0) {
      components.push({
        component: 'Finance Exceptions',
        contribution_sign: 'NEGATIVE',
        value: kpi.financeExceptionCount,
        unit: 'exceptions',
        data_status: 'LIVE',
        explanation: `${kpi.financeExceptionCount} finance exceptions require resolution before margin can be confirmed.`,
      });
    }

    if (kpi.accountingSyncFailures > 0) {
      components.push({
        component: 'Accounting Sync Failures',
        contribution_sign: 'NEGATIVE',
        value: kpi.accountingSyncFailures,
        unit: 'failures',
        data_status: 'LIVE',
        explanation: `${kpi.accountingSyncFailures} accounting sync failures — posted costs may not be reflected in external systems.`,
      });
    }

    // Evidence from canonical Finance services only
    evidence.push(
      { label: 'Client invoices outstanding', value: kpi.clientInvoicesOutstanding, data_status: 'LIVE', source_service: 'finance.getFinanceKPISummary', computed_at: now },
      { label: 'Client outstanding value (£)', value: kpi.clientOutstandingValue, unit: 'GBP', data_status: kpi.clientOutstandingValue > 0 ? 'LIVE' : 'ZERO', source_service: 'finance.getFinanceKPISummary', computed_at: now },
      { label: 'Supplier invoices awaiting review', value: kpi.supplierInvoicesAwaitingReview, data_status: kpi.supplierInvoicesAwaitingReview > 0 ? 'LIVE' : 'ZERO', source_service: 'finance.getFinanceKPISummary', computed_at: now },
      { label: 'Supplier cost awaiting approval (£)', value: kpi.supplierValueAwaitingApproval, unit: 'GBP', data_status: kpi.supplierValueAwaitingApproval > 0 ? 'LIVE' : 'ZERO', source_service: 'finance.getFinanceKPISummary', computed_at: now },
      { label: 'Billing leakage count', value: leakage.length, data_status: leakage.length > 0 ? 'LIVE' : 'ZERO', source_service: 'finance.detectBillingLeakage', computed_at: now },
      { label: 'Finance exceptions', value: kpi.financeExceptionCount, data_status: kpi.financeExceptionCount > 0 ? 'LIVE' : 'ZERO', source_service: 'finance.getFinanceKPISummary', computed_at: now },
    );

    return {
      period,
      components,
      attribution_coverage_pct: 0, // Full attribution coverage comes from Finance Metrics Registry (Phase 0I defers to Finance authority)
      attribution_coverage_note: 'Attribution coverage is reported by the canonical Finance Metrics Registry. CEO Command reads Finance KPI outputs only — it does not re-compute coverage.',
      total_client_invoiced_gbp: null, // Not derived here — use Finance Metrics Registry for INVOICED_REVENUE
      total_supplier_cost_gbp: null,   // Not derived here — use Finance Metrics Registry for ACTUAL_COST
      gross_margin_estimated_gbp: null, // Not derived here — use Finance Metrics Registry for ACTUAL_GROSS_MARGIN
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
    // Both are canonical Finance service calls
    const [leakage, kpi] = await Promise.all([detectBillingLeakage(), getFinanceKPISummary()]);

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
    for (const wo of slaRisks) {
      const priority = (wo as any).priority || 'UNKNOWN';
      byPriority[priority] = (byPriority[priority] || 0) + 1;
    }

    const dimensions: SlaRootCause[] = [];
    for (const [priority, count] of Object.entries(byPriority).sort((a, b) => b[1] - a[1])) {
      dimensions.push({ dimension: 'Priority', value: priority, count, severity: priority === 'P1_CRITICAL' ? 'CRITICAL' : 'WARNING' });
    }

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
