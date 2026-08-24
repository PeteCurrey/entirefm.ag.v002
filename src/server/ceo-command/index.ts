/**
 * ENTIREFM CEO COMMAND — DOMAIN INDEX (Phase 0I)
 * ================================================
 * Primary execution service for CEO Command + Enterprise Intelligence.
 * All access goes through this module.
 *
 * Execution pipeline:
 *   Question → Intent → Date Resolution → Authorization →
 *   Tool Plan → Canonical Services → Deterministic Analysis →
 *   Evidence → Answer
 */

import type {
  ExecutiveAnswer, ToolRun, EvidenceItem, ZeroDataSummary,
  CeoCommandDashboard, EnterpriseSignal, EnterpriseMetricDefinition,
  QueryIntentCategory, DataStatus,
} from './types';
import type { UserSession } from '../identity';
import { hasPermission } from '../identity';
import { classifyIntent, extractDateExpression, resolveDateRange, sanitiseExternalText, isWriteAttempt } from './intent';
import { evaluateEnterpriseSignals } from './signals';
import { decomposeMargin, analyseRevenueLeakage, analyseSlaRootCause } from './decomposition';
import { generateExecutiveBrief } from './executive-brief';
import { CEO_TOOL_REGISTRY } from './tools/registry';
import { dbQuery } from '../db/client';

import { listWorkOrders, listActiveSLARisks } from '../work';
import { getComplianceKPIs, getOverdueObligations, getUpcomingObligations, listComplianceExceptions, getExpiringCertificates, generateAuditSnapshot } from '../compliance';
import { getFinanceKPISummary, detectBillingLeakage, listClientInvoices, listSupplierInvoices } from '../finance';
import { listProviders, listAllProviderPerformances } from '../supply-chain';
import { listAIAgents, listAIRuns, listAIActions, listAIEscalations } from '../ai';
import type { ExecutiveBrief } from './executive-brief';

export { generateExecutiveBrief } from './executive-brief';
export { evaluateEnterpriseSignals } from './signals';
export { decomposeMargin, analyseRevenueLeakage, analyseSlaRootCause } from './decomposition';

// ============================================================
// ZERO DATA SUMMARY
// ============================================================
async function getZeroDataSummary(): Promise<ZeroDataSummary> {
  const countOf = async (table: string, filter?: string): Promise<number> => {
    try {
      const q = filter ? `${table}?${filter}&select=id` : `${table}?select=id`;
      const { data } = await dbQuery<any[]>(q);
      return data?.length || 0;
    } catch { return 0; }
  };
  const [clients, sites, contractors, openWOs, contracts, ppmPlans] = await Promise.all([
    countOf('client_accounts'),
    countOf('sites'),
    countOf('provider_organisations'),
    countOf('work_orders', 'status=in.(OPEN,IN_PROGRESS,ASSIGNED)'),
    countOf('contracts'),
    countOf('maintenance_plans', 'status=eq.ACTIVE'),
  ]);
  return {
    clients,
    sites,
    contractors,
    open_work_orders: openWOs,
    active_contracts: contracts,
    ppm_plans: ppmPlans,
    has_operational_data: clients > 0 || sites > 0 || openWOs > 0,
  };
}

// ============================================================
// PLATFORM INTEGRATIONS
// ============================================================
export function getPlatformIntegrations() {
  return [
    { name: 'Xero', type: 'ACCOUNTING', state: 'INTERFACE_ONLY', note: 'Pending per-client activation.' },
    { name: 'QuickBooks', type: 'ACCOUNTING', state: 'INTERFACE_ONLY', note: 'Pending per-client activation.' },
    { name: 'Sage', type: 'ACCOUNTING', state: 'INTERFACE_ONLY', note: 'Pending per-client activation.' },
    { name: 'NetSuite', type: 'ACCOUNTING', state: 'INTERFACE_ONLY', note: 'Pending per-client activation.' },
  ];
}

// ============================================================
// ENTERPRISE METRIC DEFINITIONS
// ============================================================
export function listEnterpriseMetrics(): EnterpriseMetricDefinition[] {
  return [
    { id: 'em-1', metric_code: 'ACTUAL_GROSS_MARGIN', metric_name: 'Actual Gross Margin', domain: 'FINANCE', description: 'Invoiced Revenue minus Approved Supplier Cost, net of matched cost attribution. Incomplete attribution reported.', required_permission: 'finance:read', canonical_service: 'server/finance.getFinanceKPISummary + detectBillingLeakage', formula_description: 'NONE — references finance authority. No formula copied into enterprise layer.', freshness_max_minutes: 30, metric_version: '1.0', data_coverage_note: 'Requires ≥80% cost attribution for reliable margin.', is_active: true },
    { id: 'em-2', metric_code: 'UNBILLED_WIP', metric_name: 'Unbilled WIP', domain: 'FINANCE', description: 'Completed billable work orders with no corresponding billing record.', required_permission: 'finance:read', canonical_service: 'server/finance.detectBillingLeakage', formula_description: 'NONE', metric_version: '1.0', is_active: true },
    { id: 'em-3', metric_code: 'SLA_ATTENDANCE_AT_RISK', metric_name: 'SLA Attendance At Risk', domain: 'OPERATIONS', description: 'Work orders at risk of missing attendance SLA target.', required_permission: 'operations:read', canonical_service: 'server/work.listActiveSLARisks', formula_description: 'NONE', metric_version: '1.0', is_active: true },
    { id: 'em-4', metric_code: 'PPM_DUE_30_DAYS', metric_name: 'PPM Due Next 30 Days', domain: 'PPM', description: 'Maintenance occurrences scheduled in the next 30 calendar days.', required_permission: 'ppm:manage', canonical_service: 'server/db.maintenance_occurrences', formula_description: 'NONE', metric_version: '1.0', is_active: true },
    { id: 'em-5', metric_code: 'PPM_OVERDUE', metric_name: 'PPM Overdue', domain: 'PPM', description: 'Maintenance occurrences past scheduled date with status SCHEDULED.', required_permission: 'ppm:manage', canonical_service: 'server/db.maintenance_occurrences', formula_description: 'NONE', metric_version: '1.0', is_active: true },
    { id: 'em-6', metric_code: 'COMPLIANCE_OVERDUE_OBLIGATIONS', metric_name: 'Overdue Compliance Obligations', domain: 'COMPLIANCE', description: 'Obligations past due date from Phase 0J Compliance Intelligence.', required_permission: 'compliance:read', canonical_service: 'server/compliance.getOverdueObligations', formula_description: 'NONE', metric_version: '1.0', is_active: true },
    { id: 'em-7', metric_code: 'PROVIDER_ATTENDANCE_SLA_PCT', metric_name: 'Provider Attendance SLA %', domain: 'SUPPLY_CHAIN', description: 'Attendance SLA compliance percentage per provider from canonical performance data.', required_permission: 'supply_chain:read', canonical_service: 'server/supply-chain.listAllProviderPerformances', formula_description: 'NONE', metric_version: '1.0', is_active: true },
    { id: 'em-8', metric_code: 'BILLING_LEAKAGE_COUNT', metric_name: 'Billing Leakage Count', domain: 'FINANCE', description: 'Count of completed billable work orders not yet invoiced.', required_permission: 'finance:read', canonical_service: 'server/finance.detectBillingLeakage', formula_description: 'NONE', metric_version: '1.0', is_active: true },
    { id: 'em-9', metric_code: 'SFG20_STATUS', metric_name: 'SFG20 Maintenance Schedule Status', domain: 'COMPLIANCE', description: 'SFG20 maintenance schedules require a valid SFG20 licence.', required_permission: 'compliance:read', canonical_service: 'LICENSE_REQUIRED', formula_description: 'NONE — licence required.', metric_version: '1.0', data_coverage_note: 'LICENSE_REQUIRED: SFG20 is a licensed standard. Access requires an active per-client or platform SFG20 licence.', is_active: true },
  ];
}

// ============================================================
// PERMISSION GATE
// ============================================================
function checkPermission(session: UserSession, permission: string): boolean {
  return hasPermission(session, permission as any);
}

// ============================================================
// CEO COMMAND DASHBOARD
// ============================================================
export async function getCeoCommandDashboard(session: UserSession): Promise<CeoCommandDashboard> {
  if (!hasPermission(session, 'enterprise_intelligence:view' as any)) {
    throw new Error('Permission denied: enterprise_intelligence:view required');
  }
  const [zeroData, signals] = await Promise.all([
    getZeroDataSummary(),
    evaluateEnterpriseSignals(),
  ]);

  const whatChanged: CeoCommandDashboard['what_changed'] = [];
  // Derive "what changed" from CRITICAL/WARNING signals detected since last 24h
  for (const sig of signals.filter(s => s.severity === 'CRITICAL' || s.severity === 'WARNING').slice(0, 10)) {
    whatChanged.push({
      type: sig.signal_type,
      description: sig.description,
      occurred_at: sig.detected_at,
      severity: sig.severity,
      href: sig.href,
    });
  }

  let needsDecisionCount = 0;
  try {
    const [finKpi, aiEscalations] = await Promise.all([
      checkPermission(session, 'finance:read') ? getFinanceKPISummary() : Promise.resolve(null),
      checkPermission(session, 'ai:control') ? listAIEscalations('PENDING') : Promise.resolve([]),
    ]);
    if (finKpi) needsDecisionCount += finKpi.supplierInvoicesAwaitingReview + (finKpi.bankDetailAlerts > 0 ? 1 : 0);
    needsDecisionCount += aiEscalations.length;
  } catch {}

  return {
    zero_data_summary: zeroData,
    signals,
    what_changed: whatChanged,
    needs_decision_count: needsDecisionCount,
    computed_at: new Date().toISOString(),
  };
}

// ============================================================
// EXECUTE CEO QUERY — Main Execution Pipeline
// ============================================================
export async function executeCeoQuery(params: {
  question: string;
  sessionContext?: {
    entities?: Array<{ type: string; id: string; label?: string }>;
    dateRange?: ReturnType<typeof resolveDateRange>;
    filters?: Record<string, string>;
  };
  session: UserSession;
}): Promise<ExecutiveAnswer> {
  const { question, sessionContext, session } = params;
  const computedAt = new Date().toISOString();
  const computed_at = computedAt;
  const toolRuns: ToolRun[] = [];
  const evidence: EvidenceItem[] = [];

  // Check base permission
  if (!hasPermission(session, 'enterprise_intelligence:view' as any)) {
    return {
      question,
      direct_answer: 'RESTRICTED — You do not have permission to access CEO Command (enterprise_intelligence:view required).',
      key_drivers: [],
      evidence: [],
      data_status: 'RESTRICTED',
      possible_actions: [],
      fact_vs_interpretation: { facts: [], calculations: [], interpretations: [], recommendations: [] },
      tool_runs: [],
      computed_at,
    };
  }

  // Write attempt guard
  if (isWriteAttempt(question)) {
    return {
      question,
      direct_answer: 'CEO Command is read-only. This action cannot be performed through CEO Command. Please use the relevant operational screen.',
      key_drivers: ['CEO Command operates in ASSIST / READ-ONLY mode.'],
      evidence: [],
      data_status: 'RESTRICTED',
      possible_actions: [{ label: 'Operations Control Centre', href: '/admin/operations', type: 'NAVIGATE' }],
      fact_vs_interpretation: { facts: ['CEO Command may retrieve, calculate, analyse, and recommend. It may NOT dispatch, approve, pay, suspend, modify, or communicate.'], calculations: [], interpretations: [], recommendations: [] },
      tool_runs: [],
      computed_at,
    };
  }

  const intent = classifyIntent(question);
  const dateExpr = extractDateExpression(question);
  const dateRange = sessionContext?.dateRange || resolveDateRange(dateExpr);

  // ─── Finance Queries ─────────────────────────────────────
  if (intent === 'FINANCE') {
    const hasFinance = checkPermission(session, 'finance:read');
    if (!hasFinance) {
      toolRuns.push({ tool_id: 'finance.kpi_summary', domain: 'FINANCE', status: 'RESTRICTED', required_permission: 'finance:read', permission_granted: false, executed_at: computedAt, restriction_reason: 'finance:read permission not granted.' });
      return {
        question, direct_answer: 'RESTRICTED — You do not have permission to view financial data. No financial figures have been retrieved or passed into this response.',
        key_drivers: [], evidence: [], data_status: 'RESTRICTED',
        possible_actions: [],
        fact_vs_interpretation: { facts: ['Authorization for financial data is checked before any tool execution. No data was accessed.'], calculations: [], interpretations: [], recommendations: [] },
        tool_runs: toolRuns, computed_at,
      };
    }

    const q = question.toLowerCase();
    const isMarginQuery = q.includes('margin') || q.includes('profit');
    const isLeakageQuery = q.includes('leakage') || q.includes('leak') || q.includes('unbilled');

    if (isMarginQuery) {
      const decomp = await decomposeMargin(dateRange);
      evidence.push(...decomp.evidence);
      const components = decomp.components;
      const driverText = components.map(c => `${c.component}: ${c.value !== null && c.value !== undefined ? `£${typeof c.value === 'number' ? c.value.toFixed(2) : c.value}` : 'N/A'} — ${c.explanation}`);
      const directAnswer = decomp.data_status === 'NO_DATA'
        ? 'There are currently no financial records in EntireCAFM. Gross margin cannot be calculated.'
        : `Estimated gross margin from invoiced revenue minus approved supplier cost: £${decomp.gross_margin_estimated_gbp?.toFixed(2) ?? 'N/A'}. Attribution coverage: ${decomp.attribution_coverage_pct}%. ${decomp.attribution_coverage_note}`;
      return { question, direct_answer: directAnswer, key_drivers: driverText, evidence, data_status: decomp.data_status, possible_actions: [{ label: 'Finance Command Centre', href: '/admin/finance', type: 'NAVIGATE' }], fact_vs_interpretation: { facts: [`Client invoiced: £${decomp.total_client_invoiced_gbp?.toFixed(2) ?? 'N/A'}`, `Approved supplier cost: £${decomp.total_supplier_cost_gbp?.toFixed(2) ?? 'N/A'}`, `Attribution coverage: ${decomp.attribution_coverage_pct}%`], calculations: ['Gross Margin = Invoiced Revenue − Approved Supplier Cost'], interpretations: [], recommendations: decomp.attribution_coverage_pct < 80 ? ['Improve cost attribution by matching supplier invoices to work orders to improve margin accuracy.'] : [] }, tool_runs: [{ tool_id: 'finance.kpi_summary', domain: 'FINANCE', status: decomp.data_status === 'NO_DATA' ? 'EMPTY' : 'SUCCESS', required_permission: 'finance:read', permission_granted: true, executed_at: computedAt }], computed_at };
    }

    if (isLeakageQuery) {
      const leakageResult = await analyseRevenueLeakage();
      for (const cat of leakageResult.categories) {
        evidence.push({ label: cat.category, value: cat.count, unit: 'records', data_status: cat.data_status, source_service: 'finance.detectBillingLeakage', computed_at });
      }
      const directAnswer = leakageResult.data_status === 'NO_DATA'
        ? 'No financial records exist. Revenue leakage cannot be assessed.'
        : leakageResult.total_items === 0
        ? 'No revenue leakage detected: all completed billable work orders have corresponding billing records.'
        : `${leakageResult.total_items} revenue leakage item${leakageResult.total_items === 1 ? '' : 's'} detected across ${leakageResult.categories.length} category${leakageResult.categories.length === 1 ? '' : 'ies'}.`;
      return { question, direct_answer: directAnswer, key_drivers: leakageResult.categories.map(c => `${c.category}: ${c.count} item${c.count === 1 ? '' : 's'} — ${c.description}`), evidence, data_status: leakageResult.data_status, possible_actions: leakageResult.categories.map(c => ({ label: c.category.replace(/_/g, ' '), href: c.href, type: 'NAVIGATE' as const })), fact_vs_interpretation: { facts: leakageResult.categories.map(c => `${c.count} record${c.count === 1 ? '' : 's'}: ${c.description}`), calculations: [], interpretations: [], recommendations: [] }, tool_runs: [{ tool_id: 'finance.billing_leakage', domain: 'FINANCE', status: leakageResult.data_status === 'NO_DATA' ? 'EMPTY' : 'SUCCESS', required_permission: 'finance:read', permission_granted: true, executed_at: computedAt }], computed_at };
    }

    // General finance query
    const kpi = await getFinanceKPISummary().catch(() => null);
    if (!kpi) return { question, direct_answer: 'No financial data available.', key_drivers: [], evidence: [], data_status: 'NO_DATA', possible_actions: [], fact_vs_interpretation: { facts: [], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [], computed_at };
    evidence.push({ label: 'Billing Ready', value: kpi.billingReadyCount, data_status: kpi.billingReadyCount > 0 ? 'LIVE' : 'ZERO', source_service: 'finance.getFinanceKPISummary', computed_at });
    evidence.push({ label: 'Supplier Invoices Awaiting Review', value: kpi.supplierInvoicesAwaitingReview, data_status: kpi.supplierInvoicesAwaitingReview > 0 ? 'LIVE' : 'ZERO', source_service: 'finance.getFinanceKPISummary', computed_at });
    evidence.push({ label: 'Outstanding Receivables', value: `£${kpi.clientOutstandingValue.toFixed(2)}`, data_status: kpi.clientOutstandingValue > 0 ? 'LIVE' : 'ZERO', source_service: 'finance.getFinanceKPISummary', computed_at });
    return { question, direct_answer: `Finance summary: ${kpi.billingReadyCount} billing-ready records, ${kpi.supplierInvoicesAwaitingReview} supplier invoices awaiting review, £${kpi.clientOutstandingValue.toFixed(2)} outstanding receivables.`, key_drivers: [], evidence, data_status: 'LIVE', possible_actions: [{ label: 'Finance Command Centre', href: '/admin/finance', type: 'NAVIGATE' }], fact_vs_interpretation: { facts: [`Billing ready: ${kpi.billingReadyCount}`, `Outstanding receivables: £${kpi.clientOutstandingValue.toFixed(2)}`], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [{ tool_id: 'finance.kpi_summary', domain: 'FINANCE', status: 'SUCCESS', required_permission: 'finance:read', permission_granted: true, executed_at: computedAt }], computed_at };
  }

  // ─── Compliance Queries ──────────────────────────────────
  if (intent === 'COMPLIANCE') {
    if (!checkPermission(session, 'compliance:read')) {
      return { question, direct_answer: 'RESTRICTED — You do not have compliance:read permission.', key_drivers: [], evidence: [], data_status: 'RESTRICTED', possible_actions: [], fact_vs_interpretation: { facts: [], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [], computed_at };
    }
    const q = question.toLowerCase();
    if (q.includes('sfg20')) {
      return { question, direct_answer: 'SFG20 maintenance schedules require a valid SFG20 licence (Building Engineering Services Association). EntireFM does not hold a platform-wide SFG20 licence. Access requires an active per-client or platform licence. No SFG20 schedules can be generated or retrieved without a valid licence.', key_drivers: ['SFG20 is a commercial licensed standard.', 'No schedule data available without licence.'], evidence: [{ label: 'SFG20 Status', value: 'LICENSE_REQUIRED', data_status: 'LICENSE_REQUIRED', source_service: 'CEO_TOOL_REGISTRY.compliance.sfg20' }], data_status: 'LICENSE_REQUIRED', possible_actions: [], fact_vs_interpretation: { facts: ['SFG20: LICENSE_REQUIRED'], calculations: [], interpretations: [], recommendations: ['Obtain SFG20 licence through BESA to access schedule data.'] }, tool_runs: [{ tool_id: 'compliance.sfg20', domain: 'COMPLIANCE', status: 'LICENSE_REQUIRED', required_permission: 'compliance:read', permission_granted: true, executed_at: computedAt, restriction_reason: 'SFG20 licence not held.' }], computed_at };
    }
    const [kpis, overdue, exceptions, expiring] = await Promise.all([
      getComplianceKPIs().catch(() => null),
      getOverdueObligations().catch(() => []),
      listComplianceExceptions().catch(() => []),
      getExpiringCertificates(30).catch(() => []),
    ]);
    const directAnswer = !kpis ? 'Compliance data unavailable.'
      : overdue.length === 0 && exceptions.length === 0
      ? `No overdue compliance obligations or exceptions. ${kpis.totalObligations || 0} obligation${kpis.totalObligations === 1 ? '' : 's'} tracked.`
      : `${overdue.length} obligation${overdue.length === 1 ? '' : 's'} overdue. ${exceptions.length} exception${exceptions.length === 1 ? '' : 's'} open. ${expiring.length} certificate${expiring.length === 1 ? '' : 's'} expiring within 30 days.`;
    evidence.push(
      { label: 'Overdue Obligations', value: overdue.length, data_status: overdue.length > 0 ? 'LIVE' : 'ZERO', source_service: 'compliance.getOverdueObligations', computed_at },
      { label: 'Open Exceptions', value: exceptions.length, data_status: exceptions.length > 0 ? 'LIVE' : 'ZERO', source_service: 'compliance.listComplianceExceptions', computed_at },
      { label: 'Expiring Certificates (30d)', value: expiring.length, data_status: expiring.length > 0 ? 'LIVE' : 'ZERO', source_service: 'compliance.getExpiringCertificates', computed_at },
    );
    return { question, direct_answer: directAnswer, key_drivers: overdue.length > 0 ? [`${overdue.length} obligation${overdue.length === 1 ? '' : 's'} overdue`, `${exceptions.length} exception${exceptions.length === 1 ? '' : 's'} open`] : [], evidence, data_status: kpis ? 'LIVE' : 'NO_DATA', possible_actions: [{ label: 'Compliance', href: '/admin/compliance', type: 'NAVIGATE' }], fact_vs_interpretation: { facts: [`Phase 0J Compliance Intelligence: ${kpis?.totalObligations || 0} total obligations tracked.`, 'Source types preserved: LEGISLATION, REGULATION, OFFICIAL_GUIDANCE, STANDARD, MANUFACTURER, INSURER, CONTRACT, CLIENT_POLICY, BEST_PRACTICE.'], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [{ tool_id: 'compliance.kpis', domain: 'COMPLIANCE', status: 'SUCCESS', required_permission: 'compliance:read', permission_granted: true, executed_at: computedAt }], computed_at };
  }

  // ─── Operations Queries ──────────────────────────────────
  if (intent === 'OPERATIONS') {
    if (!checkPermission(session, 'operations:read')) {
      return { question, direct_answer: 'RESTRICTED — operations:read permission required.', key_drivers: [], evidence: [], data_status: 'RESTRICTED', possible_actions: [], fact_vs_interpretation: { facts: [], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [], computed_at };
    }
    const q = question.toLowerCase();
    if (q.includes('sla') && (q.includes('why') || q.includes('root cause') || q.includes('worsen'))) {
      const slaResult = await analyseSlaRootCause();
      evidence.push({ label: 'SLA risks at risk', value: slaResult.total_at_risk, data_status: slaResult.data_status, source_service: 'work.listActiveSLARisks', computed_at });
      return { question, direct_answer: slaResult.data_status === 'NO_DATA' ? 'No SLA risk data found. No work orders at risk of SLA breach.' : `${slaResult.total_at_risk} work order${slaResult.total_at_risk === 1 ? '' : 's'} at risk. Breakdown by dimension:`, key_drivers: slaResult.dimensions.map(d => `${d.dimension}: ${d.value} — ${d.count} affected`), evidence, data_status: slaResult.data_status, possible_actions: [{ label: 'SLA Control', href: '/admin/operations/sla', type: 'NAVIGATE' }], fact_vs_interpretation: { facts: slaResult.dimensions.map(d => `${d.dimension} = ${d.value}: ${d.count} SLA risk${d.count === 1 ? '' : 's'}`), calculations: ['SLA risk = work order within breach threshold per canonical CANONICAL_PRIORITIES definition.'], interpretations: [], recommendations: [] }, tool_runs: [{ tool_id: 'ops.sla.active_risks', domain: 'OPERATIONS', status: slaResult.data_status === 'NO_DATA' ? 'EMPTY' : 'SUCCESS', required_permission: 'operations:read', permission_granted: true, executed_at: computedAt }], computed_at };
    }
    const wos = await listWorkOrders({ limit: 200 } as any).catch(() => []);
    const openWOs = (wos as any[]).filter((w: any) => ['OPEN', 'IN_PROGRESS', 'ASSIGNED'].includes(w.status));
    evidence.push({ label: 'Open Work Orders', value: openWOs.length, data_status: openWOs.length > 0 ? 'LIVE' : 'ZERO', source_service: 'work.listWorkOrders', computed_at });
    return { question, direct_answer: openWOs.length === 0 ? 'No open work orders in EntireCAFM.' : `${openWOs.length} open work order${openWOs.length === 1 ? '' : 's'} currently active.`, key_drivers: [], evidence, data_status: openWOs.length > 0 ? 'LIVE' : 'ZERO', possible_actions: [{ label: 'Operations Control Centre', href: '/admin/operations', type: 'NAVIGATE' }], fact_vs_interpretation: { facts: [`${openWOs.length} open work orders (OPEN, IN_PROGRESS, ASSIGNED)`], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [{ tool_id: 'ops.work_orders.list', domain: 'OPERATIONS', status: openWOs.length > 0 ? 'SUCCESS' : 'EMPTY', required_permission: 'operations:read', permission_granted: true, executed_at: computedAt }], computed_at };
  }

  // ─── PPM Queries ─────────────────────────────────────────
  if (intent === 'PPM') {
    if (!checkPermission(session, 'ppm:manage')) {
      return { question, direct_answer: 'RESTRICTED — ppm:manage permission required.', key_drivers: [], evidence: [], data_status: 'RESTRICTED', possible_actions: [], fact_vs_interpretation: { facts: [], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [], computed_at };
    }
    try {
      const today = new Date().toISOString().split('T')[0];
      const in30 = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
      const { data: dueSoon } = await dbQuery<any[]>(`maintenance_occurrences?status=eq.SCHEDULED&scheduled_date=gte.${today}&scheduled_date=lte.${in30}&select=id,scheduled_date,site_id&order=scheduled_date.asc&limit=200`);
      const { data: overdue } = await dbQuery<any[]>(`maintenance_occurrences?status=eq.SCHEDULED&scheduled_date=lt.${today}&select=id,scheduled_date,site_id&order=scheduled_date.asc&limit=200`);
      const dueCount = dueSoon?.length || 0;
      const overdueCount = overdue?.length || 0;
      evidence.push(
        { label: 'PPM Due (next 30 days)', value: dueCount, data_status: dueCount > 0 ? 'LIVE' : 'ZERO', source_service: 'server/db.maintenance_occurrences', computed_at, period: { label: 'Next 30 Days', from: today, to: in30, computed_at } },
        { label: 'PPM Overdue', value: overdueCount, data_status: overdueCount > 0 ? 'LIVE' : 'ZERO', source_service: 'server/db.maintenance_occurrences', computed_at },
      );
      const directAnswer = dueCount === 0 && overdueCount === 0
        ? 'No PPM occurrences due in the next 30 days and no overdue occurrences. PPM plans may not yet be created or no occurrences have been generated.'
        : `${dueCount} PPM occurrence${dueCount === 1 ? '' : 's'} due in the next 30 days. ${overdueCount} occurrence${overdueCount === 1 ? '' : 's'} overdue.`;
      return { question, direct_answer: directAnswer, key_drivers: [], evidence, data_status: (dueCount + overdueCount) > 0 ? 'LIVE' : 'ZERO', possible_actions: [{ label: 'PPM Schedule', href: '/admin/planned-maintenance/schedule', type: 'NAVIGATE' }], fact_vs_interpretation: { facts: [`${dueCount} PPM occurrences due (next 30 days)`, `${overdueCount} PPM occurrences overdue`, 'Data from actual maintenance_occurrences table. No inferred schedules.'], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [{ tool_id: 'ppm.occurrences.due', domain: 'PPM', status: (dueCount + overdueCount) > 0 ? 'SUCCESS' : 'EMPTY', required_permission: 'ppm:manage', permission_granted: true, executed_at: computedAt }], computed_at };
    } catch {
      return { question, direct_answer: 'PPM occurrence data unavailable. PPM plans may not yet have been created.', key_drivers: [], evidence: [], data_status: 'NO_DATA', possible_actions: [{ label: 'PPM Autopilot', href: '/admin/planned-maintenance/ppm-autopilot', type: 'NAVIGATE' }], fact_vs_interpretation: { facts: [], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [], computed_at };
    }
  }

  // ─── Supply Chain Queries ────────────────────────────────
  if (intent === 'SUPPLY_CHAIN') {
    if (!checkPermission(session, 'supply_chain:read')) {
      return { question, direct_answer: 'RESTRICTED — supply_chain:read permission required.', key_drivers: [], evidence: [], data_status: 'RESTRICTED', possible_actions: [], fact_vs_interpretation: { facts: [], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [], computed_at };
    }
    const perfRes = await listAllProviderPerformances(session).catch(() => ({ success: false, providers: [] }));
    const performances = (perfRes.providers || []).filter(Boolean);
    if (performances.length === 0) return { question, direct_answer: 'No provider performance data available. No contractors registered or no work order data to compute performance against.', key_drivers: [], evidence: [], data_status: 'NO_DATA', possible_actions: [{ label: 'Supply Chain', href: '/admin/supply-chain', type: 'NAVIGATE' }], fact_vs_interpretation: { facts: ['No contractor records in EntireCAFM.'], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [], computed_at };
    const worst = [...performances].sort((a: any, b: any) => (a.attendanceSlaPct || 100) - (b.attendanceSlaPct || 100)).slice(0, 5);
    evidence.push(...worst.map((p: any) => ({ label: p.providerName || p.providerOrgId, value: `${p.attendanceSlaPct ?? 'N/A'}%`, unit: 'attendance SLA', data_status: 'LIVE' as DataStatus, source_service: 'supply-chain.listAllProviderPerformances', computed_at })));
    return { question, direct_answer: `${performances.length} provider${performances.length === 1 ? '' : 's'} with performance data. Worst attendance SLA: ${worst[0] ? `${worst[0].providerName || worst[0].providerOrgId} at ${worst[0].attendanceSlaPct ?? 'N/A'}%` : 'N/A'}.`, key_drivers: worst.map((p: any) => `${p.providerName || p.providerOrgId}: ${p.attendanceSlaPct ?? 'N/A'}% attendance SLA, ${p.totalAssignments || 0} total assignments`), evidence, data_status: 'LIVE', possible_actions: [{ label: 'Supply Chain', href: '/admin/supply-chain', type: 'NAVIGATE' }], fact_vs_interpretation: { facts: worst.map((p: any) => `${p.providerName || p.providerOrgId}: ${p.attendanceSlaPct ?? 'N/A'}% SLA, ${p.totalAssignments || 0} total assignments`), calculations: ['Attendance SLA % from canonical provider performance records.'], interpretations: [], recommendations: [] }, tool_runs: [{ tool_id: 'supply_chain.providers.performance', domain: 'SUPPLY_CHAIN', status: 'SUCCESS', required_permission: 'supply_chain:read', permission_granted: true, executed_at: computedAt }], computed_at };

  }

  // ─── AI Activity Queries ─────────────────────────────────
  if (intent === 'AI_AUTOMATION') {
    if (!checkPermission(session, 'ai:control')) {
      return { question, direct_answer: 'RESTRICTED — ai:control permission required.', key_drivers: [], evidence: [], data_status: 'RESTRICTED', possible_actions: [], fact_vs_interpretation: { facts: [], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [], computed_at };
    }
    const runs = await listAIRuns(20).catch(() => []);
    const today = new Date().toISOString().split('T')[0];
    const todayRuns = runs.filter(r => r.started_at?.startsWith(today));
    const completed = todayRuns.filter(r => r.status === 'COMPLETED').length;
    const failed = todayRuns.filter(r => r.status === 'FAILED').length;
    const escalated = todayRuns.filter(r => r.status === 'ESCALATED').length;
    evidence.push({ label: 'AI Runs Today', value: todayRuns.length, data_status: todayRuns.length > 0 ? 'LIVE' : 'ZERO', source_service: 'ai.listAIRuns', computed_at });
    const directAnswer = todayRuns.length === 0 ? 'No AI automation activity recorded today.' : `${todayRuns.length} AI run${todayRuns.length === 1 ? '' : 's'} today: ${completed} completed, ${failed} failed, ${escalated} escalated.`;
    return { question, direct_answer: directAnswer, key_drivers: todayRuns.slice(0, 5).map(r => `${r.agent?.name || r.ai_agent_id}: ${r.status} (${r.trigger_event})`), evidence, data_status: todayRuns.length > 0 ? 'LIVE' : 'ZERO', possible_actions: [], fact_vs_interpretation: { facts: [`${todayRuns.length} AI runs today. COMPLETED: ${completed}. FAILED: ${failed}. ESCALATED: ${escalated}.`], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [{ tool_id: 'ai.runs', domain: 'AI_AUTOMATION', status: todayRuns.length > 0 ? 'SUCCESS' : 'EMPTY', required_permission: 'ai:control', permission_granted: true, executed_at: computedAt }], computed_at };
  }

  // ─── Platform Health Queries ─────────────────────────────
  if (intent === 'PLATFORM_HEALTH') {
    const integrations = getPlatformIntegrations();
    evidence.push(...integrations.map(i => ({ label: i.name, value: i.state, data_status: i.state === 'LIVE' ? 'LIVE' as DataStatus : 'NOT_CONFIGURED' as DataStatus, source_service: 'ceo-command.getPlatformIntegrations', computed_at })));
    return { question, direct_answer: 'Accounting connectors (Xero, QuickBooks, Sage, NetSuite) are currently INTERFACE_ONLY — they require explicit per-client activation. No other integrations configured.', key_drivers: integrations.map(i => `${i.name}: ${i.state}${i.note ? ` — ${i.note}` : ''}`), evidence, data_status: 'LIVE', possible_actions: [], fact_vs_interpretation: { facts: integrations.map(i => `${i.name}: ${i.state}`), calculations: [], interpretations: [], recommendations: ['Activate accounting connectors per-client as operational data is onboarded.'] }, tool_runs: [{ tool_id: 'platform.integrations', domain: 'PLATFORM_HEALTH', status: 'SUCCESS', required_permission: 'platform:admin', permission_granted: checkPermission(session, 'platform:admin'), executed_at: computedAt }], computed_at };
  }

  // ─── Executive Brief ─────────────────────────────────────
  if (intent === 'EXECUTIVE_BRIEF') {
    if (!checkPermission(session, 'enterprise_intelligence:brief_generate' as any)) {
      return { question, direct_answer: 'RESTRICTED — enterprise_intelligence:brief_generate permission required.', key_drivers: [], evidence: [], data_status: 'RESTRICTED', possible_actions: [], fact_vs_interpretation: { facts: [], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [], computed_at };
    }
    const brief = await generateExecutiveBrief();
    evidence.push({ label: 'Overall Status', value: brief.overall_status, data_status: 'LIVE', source_service: 'ceo-command.generateExecutiveBrief', computed_at: brief.generated_at });
    return { question, direct_answer: `Executive brief generated. Overall status: ${brief.overall_status}. ${brief.critical_signal_count} critical signal${brief.critical_signal_count === 1 ? '' : 's'}. ${brief.sections.length} domain sections.`, key_drivers: brief.sections.map(s => `${s.title}: ${s.summary}`), evidence, data_status: 'LIVE', possible_actions: [], fact_vs_interpretation: { facts: [], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [], computed_at };
  }

  // ─── Clients Query ───────────────────────────────────────
  if (intent === 'CLIENTS') {
    if (!checkPermission(session, 'estate:read')) {
      return { question, direct_answer: 'RESTRICTED — estate:read permission required.', key_drivers: [], evidence: [], data_status: 'RESTRICTED', possible_actions: [], fact_vs_interpretation: { facts: [], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [], computed_at };
    }
    const { data: clients } = await dbQuery<any[]>('client_accounts?select=id,name,status&order=name.asc&limit=200');
    if (!clients || clients.length === 0) {
      return { question, direct_answer: 'There are currently no client records in EntireCAFM, so client analysis cannot yet be performed.', key_drivers: [], evidence: [{ label: 'Client Accounts', value: 0, data_status: 'ZERO', source_service: 'client_accounts', computed_at }], data_status: 'ZERO', possible_actions: [{ label: 'Import Clients', href: '/admin/platform/imports', type: 'NAVIGATE' }], fact_vs_interpretation: { facts: ['0 client accounts in EntireCAFM.'], calculations: [], interpretations: [], recommendations: ['Use the Migration Centre to import client records from SimPRO or another source system.'] }, tool_runs: [], computed_at };
    }
    const active = clients.filter((c: any) => c.status === 'ACTIVE').length;
    evidence.push({ label: 'Client Accounts', value: clients.length, data_status: 'LIVE', source_service: 'client_accounts', computed_at });
    return { question, direct_answer: `${clients.length} client account${clients.length === 1 ? '' : 's'} in EntireCAFM (${active} active).`, key_drivers: [], evidence, data_status: 'LIVE', possible_actions: [{ label: 'Clients', href: '/admin/estate/clients', type: 'NAVIGATE' }], fact_vs_interpretation: { facts: [`${clients.length} client accounts. ${active} active.`], calculations: [], interpretations: [], recommendations: [] }, tool_runs: [], computed_at };
  }

  // ─── Default / Unknown ───────────────────────────────────
  const zeroData = await getZeroDataSummary();
  const noOp = !zeroData.has_operational_data;
  return {
    question,
    direct_answer: noOp
      ? 'EntireCAFM has no operational data loaded yet. Please import your operational data using the Migration Centre to enable CEO Command analytics.'
      : 'I was not able to classify this question clearly. Please try rephrasing or use a more specific question from the suggested examples.',
    key_drivers: noOp ? [`Clients: ${zeroData.clients}`, `Sites: ${zeroData.sites}`, `Open Work Orders: ${zeroData.open_work_orders}`] : [],
    evidence: [],
    data_status: noOp ? 'NO_DATA' : 'LIVE',
    possible_actions: noOp ? [{ label: 'Open Migration Centre', href: '/admin/platform/imports', type: 'NAVIGATE' }] : [{ label: 'CEO Command', href: '/admin/command', type: 'NAVIGATE' }],
    fact_vs_interpretation: { facts: [], calculations: [], interpretations: [], recommendations: [] },
    tool_runs: [],
    computed_at,
  };
}
