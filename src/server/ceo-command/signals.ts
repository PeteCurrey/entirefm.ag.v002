/**
 * ENTIREFM CEO COMMAND — ENTERPRISE SIGNALS ENGINE (Phase 0I)
 * =============================================================
 * Deterministic signal evaluation. Signals are derived from
 * real-time operational data via canonical services.
 * The LLM never assigns severity — the rules do.
 */

import type { EnterpriseSignal } from './types';
import { dbQuery } from '../db/client';
import { listActiveSLARisks } from '../work';
import { getOverdueObligations, listComplianceExceptions, getExpiringCertificates } from '../compliance';
import { detectBillingLeakage, getFinanceKPISummary } from '../finance';

export async function evaluateEnterpriseSignals(): Promise<EnterpriseSignal[]> {
  const signals: EnterpriseSignal[] = [];
  const now = new Date().toISOString();

  try {
    // ─── SLA Risk Signals ────────────────────────────────────
    const slaRisks = await listActiveSLARisks();
    for (const wo of slaRisks.slice(0, 20)) {
      const slaField = (wo as any).sla_resolution_target_at || (wo as any).sla_attendance_target_at;
      const targetAt = slaField ? new Date(slaField) : null;
      const minsRemaining = targetAt ? Math.round((targetAt.getTime() - Date.now()) / 60000) : null;
      const severity = minsRemaining !== null && minsRemaining < 0 ? 'CRITICAL' : 'WARNING';
      signals.push({
        signal_type: 'SLA_AT_RISK',
        domain: 'OPERATIONS',
        severity,
        title: `Work order SLA ${severity === 'CRITICAL' ? 'breached' : 'at risk'}`,
        description: `Work order ${(wo as any).reference || wo.id} SLA ${severity === 'CRITICAL' ? 'has been breached' : 'is approaching threshold'}.`,
        entity_type: 'WORK_ORDER',
        entity_id: wo.id,
        detected_at: now,
        metric_code: 'SLA_RESOLUTION_STATUS',
        source_rule: 'ops.sla.active_risks:threshold',
        state: 'OPEN',
        href: `/admin/operations/work-orders/${wo.id}`,
      });
    }
  } catch (_) { /* operational data empty */ }

  try {
    // ─── Compliance Exception Signals ────────────────────────
    const exceptions = await listComplianceExceptions();
    const critical = exceptions.filter((e: any) => e.severity === 'CRITICAL' && e.state === 'OPEN');
    for (const exc of critical.slice(0, 10)) {
      signals.push({
        signal_type: 'COMPLIANCE_EXCEPTION_CRITICAL',
        domain: 'COMPLIANCE',
        severity: 'CRITICAL',
        title: 'Critical compliance exception open',
        description: `${exc.exception_type}: ${exc.reason || 'Open critical compliance exception requires action.'}`,
        entity_type: 'COMPLIANCE_EXCEPTION',
        entity_id: exc.id,
        site_id: exc.site_id,
        detected_at: now,
        source_rule: 'compliance.exceptions.list:severity=CRITICAL',
        state: 'OPEN',
        href: `/admin/command/alerts-exceptions`,
      });
    }
  } catch (_) { /* compliance data empty */ }

  try {
    // ─── Overdue Compliance Obligations ──────────────────────
    const overdue = await getOverdueObligations();
    if (overdue.length > 0) {
      signals.push({
        signal_type: 'COMPLIANCE_OBLIGATIONS_OVERDUE',
        domain: 'COMPLIANCE',
        severity: overdue.length > 5 ? 'WARNING' : 'WATCH',
        title: `${overdue.length} compliance obligation${overdue.length === 1 ? '' : 's'} overdue`,
        description: `${overdue.length} compliance obligations have passed their due date and require attention.`,
        detected_at: now,
        source_rule: 'compliance.obligations.overdue',
        state: 'OPEN',
        href: `/admin/compliance/obligations`,
      });
    }
  } catch (_) { /* compliance data empty */ }

  try {
    // ─── Expiring Certificates ────────────────────────────────
    const expiring = await getExpiringCertificates(30);
    if (expiring.length > 0) {
      signals.push({
        signal_type: 'CERTIFICATES_EXPIRING',
        domain: 'COMPLIANCE',
        severity: expiring.length > 3 ? 'WARNING' : 'WATCH',
        title: `${expiring.length} certificate${expiring.length === 1 ? '' : 's'} expiring within 30 days`,
        description: `${expiring.length} compliance certificates will expire in the next 30 days.`,
        detected_at: now,
        source_rule: 'compliance.certificates.expiring:window=30',
        state: 'OPEN',
        href: `/admin/compliance/certificates`,
      });
    }
  } catch (_) { /* compliance data empty */ }

  try {
    // ─── Billing Leakage Signals ─────────────────────────────
    const leakage = await detectBillingLeakage();
    const oldLeakage = leakage.filter(l => l.ageingDays >= 14);
    if (oldLeakage.length > 0) {
      signals.push({
        signal_type: 'BILLING_LEAKAGE_DETECTED',
        domain: 'FINANCE',
        severity: oldLeakage.length > 10 ? 'WARNING' : 'WATCH',
        title: `${oldLeakage.length} completed work order${oldLeakage.length === 1 ? '' : 's'} not yet invoiced (≥14 days)`,
        description: `${oldLeakage.length} completed billable work orders have no corresponding billing record after 14+ days.`,
        detected_at: now,
        metric_code: 'BILLING_LEAKAGE_COUNT',
        source_rule: 'finance.billing_leakage:ageing_days>=14',
        state: 'OPEN',
        href: `/admin/finance/billing`,
      });
    }
  } catch (_) { /* finance data empty */ }

  try {
    // ─── Finance Exception Signals ────────────────────────────
    const finKpi = await getFinanceKPISummary();
    if (finKpi.bankDetailAlerts > 0) {
      signals.push({
        signal_type: 'BANK_DETAIL_ALERT',
        domain: 'FINANCE',
        severity: 'CRITICAL',
        title: `${finKpi.bankDetailAlerts} unreviewed supplier bank detail change alert${finKpi.bankDetailAlerts === 1 ? '' : 's'}`,
        description: 'Supplier bank details changed and have not been reviewed. These must be verified before payment.',
        detected_at: now,
        metric_code: 'BANK_DETAIL_ALERTS',
        source_rule: 'finance.kpi_summary:bank_detail_alerts>0',
        state: 'OPEN',
        href: `/admin/finance/supplier-invoices`,
      });
    }
    if (finKpi.accountingSyncFailures > 0) {
      signals.push({
        signal_type: 'ACCOUNTING_SYNC_FAILURE',
        domain: 'PLATFORM_HEALTH',
        severity: 'WARNING',
        title: `${finKpi.accountingSyncFailures} accounting sync failure${finKpi.accountingSyncFailures === 1 ? '' : 's'}`,
        description: 'Accounting synchronisation failures detected. Records may not be reflected in the connected accounting system.',
        detected_at: now,
        source_rule: 'finance.kpi_summary:accounting_sync_failures>0',
        state: 'OPEN',
        href: `/admin/finance/accounting`,
      });
    }
  } catch (_) { /* finance data empty */ }

  try {
    // ─── Overdue PPM Signals ─────────────────────────────────
    const { data: overduePpm } = await dbQuery<any[]>(
      `maintenance_occurrences?status=eq.SCHEDULED&scheduled_date=lt.${new Date().toISOString().split('T')[0]}&select=id,scheduled_date,site_id&limit=200`
    );
    if (overduePpm && overduePpm.length > 0) {
      signals.push({
        signal_type: 'PPM_OVERDUE',
        domain: 'PPM',
        severity: overduePpm.length > 20 ? 'WARNING' : 'WATCH',
        title: `${overduePpm.length} PPM occurrence${overduePpm.length === 1 ? '' : 's'} overdue`,
        description: `${overduePpm.length} scheduled PPM occurrences have passed their scheduled date without completion.`,
        detected_at: now,
        source_rule: 'ppm.occurrences.overdue',
        state: 'OPEN',
        href: `/admin/planned-maintenance/schedule`,
      });
    }
  } catch (_) { /* ppm data empty */ }

  // Sort: CRITICAL first, then WARNING, WATCH, INFO
  const severityOrder: Record<string, number> = { CRITICAL: 0, WARNING: 1, WATCH: 2, INFO: 3 };
  signals.sort((a, b) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3));

  return signals;
}
