/**
 * ENTIREFM CEO COMMAND — EXECUTIVE BRIEF GENERATOR (Phase 0I)
 * ============================================================
 * On-demand executive brief. Sections are populated from canonical
 * domain services. Empty domains are stated concisely as NO_DATA.
 */

import type { EvidenceItem, DataStatus } from './types';
import { dbQuery } from '../db/client';
import { evaluateEnterpriseSignals } from './signals';
import { getComplianceKPIs, getOverdueObligations, listComplianceExceptions } from '../compliance';
import { getFinanceKPISummary, detectBillingLeakage } from '../finance';
import { listActiveSLARisks } from '../work';
import { listAIRuns } from '../ai';
import { getPlatformIntegrationStates, summariseIntegrations } from '../platform/integrations';

export interface BriefSection {
  title: string;
  status: DataStatus;
  summary: string;
  items: Array<{ label: string; value: string | number; unit?: string; status?: DataStatus }>;
  evidence: EvidenceItem[];
}

export interface ExecutiveBrief {
  generated_at: string;
  period_label: string;
  sections: BriefSection[];
  signal_count: number;
  critical_signal_count: number;
  overall_status: 'GREEN' | 'AMBER' | 'RED' | 'NO_DATA';
}

async function getCount(table: string, filter?: string): Promise<number> {
  try {
    const q = filter ? `${table}?${filter}&select=id` : `${table}?select=id`;
    const { data } = await dbQuery<any[]>(q);
    return data?.length || 0;
  } catch { return 0; }
}

export async function generateExecutiveBrief(): Promise<ExecutiveBrief> {
  const now = new Date().toISOString();
  const sections: BriefSection[] = [];

  // Gather signals
  let signals: Awaited<ReturnType<typeof evaluateEnterpriseSignals>> = [];
  try { signals = await evaluateEnterpriseSignals(); } catch {}
  const criticalCount = signals.filter(s => s.severity === 'CRITICAL').length;

  // ─── OPERATIONS ───────────────────────────────────────────
  try {
    const [openWOs, slaRisks] = await Promise.all([
      getCount('work_orders', 'status=in.(OPEN,IN_PROGRESS,ASSIGNED)'),
      listActiveSLARisks().then(r => r.length).catch(() => 0),
    ]);
    sections.push({
      title: 'Operations',
      status: openWOs > 0 ? 'LIVE' : 'ZERO',
      summary: openWOs === 0 ? 'No open work orders.' : `${openWOs} open work orders. ${slaRisks} SLA risk${slaRisks === 1 ? '' : 's'} detected.`,
      items: [
        { label: 'Open Work Orders', value: openWOs, status: openWOs > 0 ? 'LIVE' : 'ZERO' },
        { label: 'SLA Risks', value: slaRisks, status: slaRisks > 0 ? 'LIVE' : 'ZERO' },
      ],
      evidence: [{ label: 'Source', value: 'work_orders', data_status: 'LIVE', source_service: 'server/work.listWorkOrders', computed_at: now }],
    });
  } catch {
    sections.push({ title: 'Operations', status: 'NO_DATA', summary: 'Operations data unavailable.', items: [], evidence: [] });
  }

  // ─── CLIENTS ─────────────────────────────────────────────
  try {
    const clientCount = await getCount('client_accounts');
    const siteCount = await getCount('sites');
    sections.push({
      title: 'Clients & Estate',
      status: clientCount > 0 ? 'LIVE' : 'ZERO',
      summary: clientCount === 0 ? 'No client accounts. Operational data not yet imported.' : `${clientCount} client account${clientCount === 1 ? '' : 's'} across ${siteCount} site${siteCount === 1 ? '' : 's'}.`,
      items: [
        { label: 'Client Accounts', value: clientCount, status: clientCount > 0 ? 'LIVE' : 'ZERO' },
        { label: 'Managed Sites', value: siteCount, status: siteCount > 0 ? 'LIVE' : 'ZERO' },
      ],
      evidence: [{ label: 'Source', value: 'client_accounts, sites', data_status: 'LIVE', source_service: 'server/db', computed_at: now }],
    });
  } catch {
    sections.push({ title: 'Clients & Estate', status: 'NO_DATA', summary: 'Client data unavailable.', items: [], evidence: [] });
  }

  // ─── PPM ─────────────────────────────────────────────────
  try {
    const today = new Date().toISOString().split('T')[0];
    const in30 = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    const [dueSoon, overdue] = await Promise.all([
      getCount('maintenance_occurrences', `status=eq.SCHEDULED&scheduled_date=gte.${today}&scheduled_date=lte.${in30}`),
      getCount('maintenance_occurrences', `status=eq.SCHEDULED&scheduled_date=lt.${today}`),
    ]);
    sections.push({
      title: 'Planned Maintenance',
      status: (dueSoon + overdue) > 0 ? 'LIVE' : 'ZERO',
      summary: (dueSoon + overdue) === 0 ? 'No PPM records. PPM plans not yet created.' : `${dueSoon} PPM occurrence${dueSoon === 1 ? '' : 's'} due in next 30 days. ${overdue} overdue.`,
      items: [
        { label: 'Due (next 30 days)', value: dueSoon, status: dueSoon > 0 ? 'LIVE' : 'ZERO' },
        { label: 'Overdue', value: overdue, status: overdue > 0 ? 'LIVE' : 'ZERO' },
      ],
      evidence: [{ label: 'Source', value: 'maintenance_occurrences', data_status: 'LIVE', source_service: 'server/db', computed_at: now }],
    });
  } catch {
    sections.push({ title: 'Planned Maintenance', status: 'NO_DATA', summary: 'PPM data unavailable.', items: [], evidence: [] });
  }

  // ─── COMPLIANCE ──────────────────────────────────────────
  try {
    const kpis = await getComplianceKPIs();
    const overdue = await getOverdueObligations();
    const hasComplianceData = (kpis.totalObligations || 0) > 0 || overdue.length > 0 || (kpis.openExceptionCount || 0) > 0;
    sections.push({
      title: 'Compliance',
      status: hasComplianceData ? 'LIVE' : 'NO_DATA',
      summary: !hasComplianceData
        ? 'No compliance obligations recorded. Compliance data not yet imported.'
        : overdue.length === 0
          ? `${kpis.totalObligations || 0} obligation${kpis.totalObligations === 1 ? '' : 's'} tracked. No overdue items.`
          : `${overdue.length} obligation${overdue.length === 1 ? '' : 's'} overdue. ${kpis.openExceptionCount || 0} exception${kpis.openExceptionCount === 1 ? '' : 's'} open.`,
      items: [
        { label: 'Total Obligations', value: kpis.totalObligations || 0, status: (kpis.totalObligations || 0) > 0 ? 'LIVE' : 'NO_DATA' },
        { label: 'Overdue', value: overdue.length, status: overdue.length > 0 ? 'LIVE' : 'ZERO' },
        { label: 'Open Exceptions', value: kpis.openExceptionCount || 0, status: (kpis.openExceptionCount || 0) > 0 ? 'LIVE' : 'ZERO' },
      ],
      evidence: [{ label: 'Source', value: 'Compliance Intelligence', data_status: hasComplianceData ? 'LIVE' : 'NO_DATA', source_service: 'server/compliance.getComplianceKPIs', computed_at: now }],
    });
  } catch {
    sections.push({ title: 'Compliance', status: 'NO_DATA', summary: 'Compliance data unavailable.', items: [], evidence: [] });
  }

  // ─── COMMERCIAL / FINANCE ─────────────────────────────────
  try {
    const kpi = await getFinanceKPISummary();
    const leakage = await detectBillingLeakage();
    const hasFinanceData = kpi.billingReadyCount > 0 || kpi.supplierInvoicesAwaitingReview > 0 ||
      leakage.length > 0 || kpi.clientOutstandingValue > 0 || kpi.bankDetailAlerts > 0 ||
      kpi.financeExceptionCount > 0 || kpi.unbilledCompletedCount > 0;
    sections.push({
      title: 'Commercial & Finance',
      status: hasFinanceData ? 'LIVE' : 'NO_DATA',
      summary: !hasFinanceData
        ? 'No financial records exist. Finance data not yet imported.'
        : `${kpi.billingReadyCount} billing-ready. ${kpi.supplierInvoicesAwaitingReview} supplier invoice${kpi.supplierInvoicesAwaitingReview === 1 ? '' : 's'} awaiting review. ${leakage.length} billing leakage item${leakage.length === 1 ? '' : 's'}. Outstanding receivables: £${kpi.clientOutstandingValue.toFixed(2)}.`,
      items: [
        { label: 'Billing Ready', value: kpi.billingReadyCount, status: kpi.billingReadyCount > 0 ? 'LIVE' : 'ZERO' },
        { label: 'Supplier Invoices Awaiting Review', value: kpi.supplierInvoicesAwaitingReview, status: kpi.supplierInvoicesAwaitingReview > 0 ? 'LIVE' : 'ZERO' },
        { label: 'Billing Leakage', value: leakage.length, status: leakage.length > 0 ? 'LIVE' : 'ZERO' },
        { label: 'Outstanding Receivables (£)', value: kpi.clientOutstandingValue.toFixed(2), status: kpi.clientOutstandingValue > 0 ? 'LIVE' : 'NO_DATA' },
        { label: 'Bank Detail Alerts', value: kpi.bankDetailAlerts, status: kpi.bankDetailAlerts > 0 ? 'LIVE' : 'ZERO' },
      ],
      evidence: [{ label: 'Source', value: 'Finance Automation', data_status: hasFinanceData ? 'LIVE' : 'NO_DATA', source_service: 'server/finance.getFinanceKPISummary', computed_at: now }],
    });
  } catch {
    sections.push({ title: 'Commercial & Finance', status: 'NO_DATA', summary: 'Finance data unavailable.', items: [], evidence: [] });
  }


  // ─── AI / AUTOMATION ─────────────────────────────────────
  try {
    const runs = await listAIRuns(20);
    const failed = runs.filter(r => r.status === 'FAILED').length;
    const completed = runs.filter(r => r.status === 'COMPLETED').length;
    sections.push({
      title: 'AI & Automation',
      status: runs.length > 0 ? 'LIVE' : 'NOT_CONFIGURED',
      summary: runs.length === 0 ? 'No AI agent activity recorded.' : `${runs.length} recent AI runs. ${completed} completed, ${failed} failed.`,
      items: [
        { label: 'Recent AI Runs', value: runs.length, status: runs.length > 0 ? 'LIVE' : 'ZERO' },
        { label: 'Completed', value: completed },
        { label: 'Failed', value: failed, status: failed > 0 ? 'LIVE' : 'ZERO' },
      ],
      evidence: [{ label: 'Source', value: 'AI Control Plane', data_status: 'LIVE', source_service: 'server/ai.listAIRuns', computed_at: now }],
    });
  } catch {
    sections.push({ title: 'AI & Automation', status: 'NO_DATA', summary: 'AI Control Plane data unavailable.', items: [], evidence: [] });
  }

  // ─── PLATFORM HEALTH ─────────────────────────────────────
  // Read from canonical integration state service — not hardcoded
  const platformIntegrations = await getPlatformIntegrationStates();
  const hasLiveIntegration = platformIntegrations.some(i => i.state === 'LIVE');
  const allIfOnly = platformIntegrations.every(i => i.state === 'INTERFACE_ONLY' || i.state === 'NOT_CONFIGURED');
  const hasDegraded = platformIntegrations.some(i => i.state === 'DEGRADED' || i.state === 'FAILED');
  const platformStatus: DataStatus = hasDegraded ? 'LIVE' : (hasLiveIntegration ? 'LIVE' : 'NOT_CONFIGURED');
  const platformSummary = summariseIntegrations(platformIntegrations);
  sections.push({
    title: 'Platform Health',
    status: platformStatus,
    summary: platformSummary,
    items: platformIntegrations.map(i => ({ label: i.name, value: i.state, status: i.state === 'LIVE' ? 'LIVE' as DataStatus : 'NOT_CONFIGURED' as DataStatus })),
    evidence: [{ label: 'Connector State Authority', value: 'Canonical Platform Integration Registry (DB)', data_status: 'LIVE', source_service: 'server/platform/integrations.getPlatformIntegrationStates', computed_at: now }],
  });

  const allZero = sections.every(s => s.status === 'ZERO' || s.status === 'NO_DATA' || s.status === 'NOT_CONFIGURED');
  const hasRed = criticalCount > 0;
  const hasAmber = signals.some(s => s.severity === 'WARNING');
  const overallStatus = allZero ? 'NO_DATA' : hasRed ? 'RED' : hasAmber ? 'AMBER' : 'GREEN';

  return {
    generated_at: now,
    period_label: 'Current State',
    sections,
    signal_count: signals.length,
    critical_signal_count: criticalCount,
    overall_status: overallStatus,
  };
}
