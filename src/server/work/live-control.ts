/**
 * ENTIREFM LIVE CONTRACT CONTROL & EXCEPTION ENGINE (Phase 7)
 * ==========================================================
 * Multi-domain contract health telemetry, exception-first triage, SLA at-risk detection,
 * repeat issue pattern recognition, and client action management.
 */

import { dbQuery } from '../db/client';

export type HealthDomainState = 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'CRITICAL' | 'NO_DATA' | 'NOT_APPLICABLE';

export type ExceptionSeverity = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type ExceptionType =
  | 'SLA_AT_RISK'
  | 'SLA_BREACHED'
  | 'PPM_OVERDUE'
  | 'EVIDENCE_MISSING'
  | 'CRITICAL_DEFECT'
  | 'CONTRACTOR_GAP'
  | 'COST_OVERRUN'
  | 'REPEAT_FAILURE'
  | 'CLIENT_BOTTLENECK';

export interface OperationalException {
  id: string;
  contract_id?: string;
  site_id?: string;
  work_order_id?: string;
  asset_id?: string;
  exception_type: ExceptionType;
  severity: ExceptionSeverity;
  title: string;
  details?: string;
  underlying_records?: Record<string, any>;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'ACTION_ASSIGNED' | 'SNOOZED' | 'RESOLVED';
  owner: string;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_by?: string;
  resolved_at?: string;
  resolution_notes?: string;
  created_at: string;
}

export interface ClientAction {
  id: string;
  contract_id: string;
  site_id?: string;
  quote_id?: string;
  action_type: 'QUOTE_APPROVAL' | 'SITE_ACCESS' | 'PURCHASE_ORDER' | 'SHUTDOWN_APPROVAL' | 'COMPLIANCE_CERTIFICATE' | 'CONTACT_CONFIRMATION';
  title: string;
  description?: string;
  amount_gbp?: number;
  requested_at: string;
  due_date: string;
  status: 'AWAITING_CLIENT' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'OVERDUE';
  client_contact_name?: string;
  client_contact_email?: string;
  decision_notes?: string;
  decided_at?: string;
}

export interface ContractHealthSummary {
  contractId: string;
  clientName: string;
  contractName: string;
  contractReference: string;
  status: string;
  services: string[];
  sitesCount: number;
  operationalOwner: string;
  nextReportingDate?: string;
  
  // Health Domains
  domains: {
    serviceRequests: HealthDomainState;
    sla: HealthDomainState;
    ppm: HealthDomainState;
    compliance: HealthDomainState;
    defectsRemedials: HealthDomainState;
    supplyChain: HealthDomainState;
    clientActions: HealthDomainState;
    costs: HealthDomainState;
    reporting: HealthDomainState;
    dataQuality: HealthDomainState;
  };
  
  activeExceptionsCount: number;
  criticalExceptionsCount: number;
}

export interface LiveControlMetrics {
  criticalExceptionsCount: number;
  slaAtRiskCount: number;
  overduePpmCount: number;
  openCriticalDefectsCount: number;
  unapprovedRemedialsCount: number;
  clientActionsOverdueCount: number;
  contractorCoverageGapsCount: number;
  costExceptionsCount: number;
  healthyContractsCount: number;
  atRiskContractsCount: number;
}

// In-Memory Fallback Store
class LiveOperationsMemoryStore {
  public exceptions: Map<string, OperationalException> = new Map();
  public clientActions: Map<string, ClientAction> = new Map();
}

export const liveOpsMemoryStore = new LiveOperationsMemoryStore();

function isDbConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * List active operational exceptions
 */
export async function listOperationalExceptions(filter?: {
  status?: string;
  severity?: ExceptionSeverity;
  contractId?: string;
}): Promise<OperationalException[]> {
  let list = Array.from(liveOpsMemoryStore.exceptions.values());

  if (isDbConfigured()) {
    let q = 'operational_exceptions?select=*&order=created_at.desc';
    if (filter?.status) q += `&status=eq.${filter.status}`;
    if (filter?.severity) q += `&severity=eq.${filter.severity}`;
    if (filter?.contractId) q += `&contract_id=eq.${filter.contractId}`;
    
    const { data } = await dbQuery<any[]>(q);
    if (data) {
      list = data.map((r) => ({
        id: r.id,
        contract_id: r.contract_id,
        site_id: r.site_id,
        work_order_id: r.work_order_id,
        asset_id: r.asset_id,
        exception_type: r.exception_type,
        severity: r.severity || 'NORMAL',
        title: r.title,
        details: r.details,
        underlying_records: r.underlying_records,
        status: r.status || 'ACTIVE',
        owner: r.owner || 'Duty Operations Manager',
        acknowledged_by: r.acknowledged_by,
        acknowledged_at: r.acknowledged_at,
        resolved_by: r.resolved_by,
        resolved_at: r.resolved_at,
        resolution_notes: r.resolution_notes,
        created_at: r.created_at,
      }));
    }
  }

  if (filter?.status) {
    list = list.filter((e) => e.status === filter.status);
  }
  if (filter?.severity) {
    list = list.filter((e) => e.severity === filter.severity);
  }

  return list;
}

/**
 * Create or record operational exception
 */
export async function createOperationalException(exc: Partial<OperationalException>): Promise<OperationalException> {
  const id = exc.id || `exc-${Date.now()}`;
  const record: OperationalException = {
    id,
    contract_id: exc.contract_id,
    site_id: exc.site_id,
    work_order_id: exc.work_order_id,
    asset_id: exc.asset_id,
    exception_type: exc.exception_type || 'SLA_AT_RISK',
    severity: exc.severity || 'NORMAL',
    title: exc.title || 'Operational Exception Detected',
    details: exc.details || '',
    underlying_records: exc.underlying_records || {},
    status: exc.status || 'ACTIVE',
    owner: exc.owner || 'Duty Operations Manager',
    created_at: new Date().toISOString(),
  };

  liveOpsMemoryStore.exceptions.set(id, record);

  if (isDbConfigured()) {
    await dbQuery('operational_exceptions', {
      method: 'POST',
      body: record,
    });
  }

  return record;
}

/**
 * List pending client actions
 */
export async function listClientActions(contractId?: string): Promise<ClientAction[]> {
  let list = Array.from(liveOpsMemoryStore.clientActions.values());

  if (isDbConfigured()) {
    let q = 'client_actions?select=*&order=due_date.asc';
    if (contractId) q += `&contract_id=eq.${contractId}`;
    const { data } = await dbQuery<any[]>(q);
    if (data) {
      list = data.map((r) => ({
        id: r.id,
        contract_id: r.contract_id,
        site_id: r.site_id,
        quote_id: r.quote_id,
        action_type: r.action_type,
        title: r.title,
        description: r.description,
        amount_gbp: r.amount_gbp ? Number(r.amount_gbp) : undefined,
        requested_at: r.requested_at,
        due_date: r.due_date,
        status: r.status,
        client_contact_name: r.client_contact_name,
        client_contact_email: r.client_contact_email,
        decision_notes: r.decision_notes,
        decided_at: r.decided_at,
      }));
    }
  }

  return list;
}

/**
 * Get Live Control Centre High-Density KPI Metrics
 */
export async function getLiveControlMetrics(): Promise<LiveControlMetrics> {
  const exceptions = await listOperationalExceptions({ status: 'ACTIVE' });
  const clientActions = await listClientActions();
  const now = new Date();

  const overdueActions = clientActions.filter((a) => a.status === 'AWAITING_CLIENT' && new Date(a.due_date) < now);

  return {
    criticalExceptionsCount: exceptions.filter((e) => e.severity === 'CRITICAL').length,
    slaAtRiskCount: exceptions.filter((e) => e.exception_type === 'SLA_AT_RISK').length,
    overduePpmCount: exceptions.filter((e) => e.exception_type === 'PPM_OVERDUE').length,
    openCriticalDefectsCount: exceptions.filter((e) => e.exception_type === 'CRITICAL_DEFECT').length,
    unapprovedRemedialsCount: exceptions.filter((e) => e.exception_type === 'CLIENT_BOTTLENECK').length,
    clientActionsOverdueCount: overdueActions.length,
    contractorCoverageGapsCount: exceptions.filter((e) => e.exception_type === 'CONTRACTOR_GAP').length,
    costExceptionsCount: exceptions.filter((e) => e.exception_type === 'COST_OVERRUN').length,
    healthyContractsCount: 0,
    atRiskContractsCount: 0,
  };
}
