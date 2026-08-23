/**
 * ENTIREFM OPERATIONAL MOBILISATION DOMAIN MODULE (Phase 6)
 * =========================================================
 * Connects Won Commercial Contracts to Canonical EntireCAFM Operational Models.
 */

import { dbQuery } from '../db/client';

export type MobilisationStatus =
  | 'AWAITING_HANDOFF'
  | 'HANDOFF_REVIEW'
  | 'PLANNING'
  | 'IN_PROGRESS'
  | 'AT_RISK'
  | 'GO_LIVE_REVIEW'
  | 'READY'
  | 'LIVE_STABILISATION'
  | 'COMPLETE'
  | 'CANCELLED';

export type DomainReadinessState = 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'READY';

export interface MobilisationTask {
  id: string;
  mobilisation_id: string;
  phase_number: number;
  phase_name: string;
  title: string;
  description?: string;
  owner: string;
  department: string;
  due_date: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  status:
    | 'NOT_STARTED'
    | 'IN_PROGRESS'
    | 'BLOCKED'
    | 'AWAITING_CLIENT'
    | 'AWAITING_SUPPLIER'
    | 'REVIEW'
    | 'COMPLETE'
    | 'NOT_APPLICABLE';
  is_blocking: boolean;
  dependency_task_id?: string;
  evidence_required?: string;
  created_at: string;
  completed_at?: string;
}

export interface MobilisationRisk {
  id: string;
  mobilisation_id: string;
  risk_title: string;
  category: 'ASSET_DATA' | 'COMPLIANCE' | 'SUPPLY_CHAIN' | 'CLIENT_ACCESS' | 'TIMELINE' | 'TECHNICAL';
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  owner: string;
  mitigation_plan: string;
  status: 'OPEN' | 'MITIGATED' | 'ACCEPTED' | 'CLOSED';
  created_at: string;
}

export interface MobilisationRecord {
  id: string;
  opportunity_id?: string;
  client_account_id?: string;
  contract_id?: string;
  name: string;
  client_name: string;
  commercial_owner: string;
  operations_owner: string;
  status: MobilisationStatus;
  template_type: string;
  target_go_live_date: string;
  actual_go_live_date?: string;
  contract_term_months: number;
  annual_contract_value_gbp?: number;

  // Domain Readiness States
  domain_commercial_handoff: DomainReadinessState;
  domain_estate_discovery: DomainReadinessState;
  domain_asset_baseline: DomainReadinessState;
  domain_compliance_baseline: DomainReadinessState;
  domain_ppm_development: DomainReadinessState;
  domain_supply_chain: DomainReadinessState;
  domain_helpdesk_sla: DomainReadinessState;
  domain_client_portal: DomainReadinessState;
  domain_reporting: DomainReadinessState;
  domain_billing_readiness: DomainReadinessState;
  domain_go_live_review: DomainReadinessState;

  handoff_submitted_by?: string;
  handoff_submitted_at?: string;
  handoff_accepted_by?: string;
  handoff_accepted_at?: string;
  handoff_notes?: string;

  created_at: string;
  updated_at: string;
}

export interface MobilisationDashboardMetrics {
  awaitingHandoffCount: number;
  activeMobilisationsCount: number;
  atRiskCount: number;
  tasksOverdueCount: number;
  readyForGoLiveCount: number;
  goLivesThisMonthCount: number;
  completedThisQuarterCount: number;
}

// In-Memory Fallback
class MobilisationMemoryStore {
  public mobilisations: Map<string, MobilisationRecord> = new Map();
  public tasks: Map<string, MobilisationTask> = new Map();
  public risks: Map<string, MobilisationRisk> = new Map();
}

export const mobMemoryStore = new MobilisationMemoryStore();

function isDbConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * List all mobilisations
 */
export async function listMobilisations(status?: MobilisationStatus): Promise<MobilisationRecord[]> {
  let list = Array.from(mobMemoryStore.mobilisations.values());

  if (isDbConfigured()) {
    let q = 'mobilisations?select=*&order=target_go_live_date.asc';
    if (status) q += `&status=eq.${status}`;
    const { data } = await dbQuery<any[]>(q);
    if (data) {
      list = data.map((r) => ({
        id: r.id,
        opportunity_id: r.opportunity_id,
        client_account_id: r.client_account_id,
        contract_id: r.contract_id,
        name: r.name,
        client_name: r.client_name,
        commercial_owner: r.commercial_owner,
        operations_owner: r.operations_owner,
        status: r.status,
        template_type: r.template_type,
        target_go_live_date: r.target_go_live_date,
        actual_go_live_date: r.actual_go_live_date,
        contract_term_months: r.contract_term_months || 12,
        annual_contract_value_gbp: r.annual_contract_value_gbp ? Number(r.annual_contract_value_gbp) : undefined,
        domain_commercial_handoff: r.domain_commercial_handoff || 'IN_PROGRESS',
        domain_estate_discovery: r.domain_estate_discovery || 'NOT_STARTED',
        domain_asset_baseline: r.domain_asset_baseline || 'NOT_STARTED',
        domain_compliance_baseline: r.domain_compliance_baseline || 'NOT_STARTED',
        domain_ppm_development: r.domain_ppm_development || 'NOT_STARTED',
        domain_supply_chain: r.domain_supply_chain || 'NOT_STARTED',
        domain_helpdesk_sla: r.domain_helpdesk_sla || 'NOT_STARTED',
        domain_client_portal: r.domain_client_portal || 'NOT_STARTED',
        domain_reporting: r.domain_reporting || 'NOT_STARTED',
        domain_billing_readiness: r.domain_billing_readiness || 'NOT_STARTED',
        domain_go_live_review: r.domain_go_live_review || 'NOT_STARTED',
        handoff_submitted_by: r.handoff_submitted_by,
        handoff_submitted_at: r.handoff_submitted_at,
        handoff_accepted_by: r.handoff_accepted_by,
        handoff_accepted_at: r.handoff_accepted_at,
        handoff_notes: r.handoff_notes,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
  }

  if (status) {
    list = list.filter((m) => m.status === status);
  }

  return list;
}

/**
 * Fetch mobilisation by ID
 */
export async function getMobilisationById(id: string): Promise<MobilisationRecord | null> {
  const mem = mobMemoryStore.mobilisations.get(id);
  if (mem) return mem;

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(`mobilisations?id=eq.${id}&select=*`);
    if (data && data.length > 0) {
      const r = data[0];
      return {
        id: r.id,
        opportunity_id: r.opportunity_id,
        client_account_id: r.client_account_id,
        contract_id: r.contract_id,
        name: r.name,
        client_name: r.client_name,
        commercial_owner: r.commercial_owner,
        operations_owner: r.operations_owner,
        status: r.status,
        template_type: r.template_type,
        target_go_live_date: r.target_go_live_date,
        actual_go_live_date: r.actual_go_live_date,
        contract_term_months: r.contract_term_months || 12,
        annual_contract_value_gbp: r.annual_contract_value_gbp ? Number(r.annual_contract_value_gbp) : undefined,
        domain_commercial_handoff: r.domain_commercial_handoff || 'IN_PROGRESS',
        domain_estate_discovery: r.domain_estate_discovery || 'NOT_STARTED',
        domain_asset_baseline: r.domain_asset_baseline || 'NOT_STARTED',
        domain_compliance_baseline: r.domain_compliance_baseline || 'NOT_STARTED',
        domain_ppm_development: r.domain_ppm_development || 'NOT_STARTED',
        domain_supply_chain: r.domain_supply_chain || 'NOT_STARTED',
        domain_helpdesk_sla: r.domain_helpdesk_sla || 'NOT_STARTED',
        domain_client_portal: r.domain_client_portal || 'NOT_STARTED',
        domain_reporting: r.domain_reporting || 'NOT_STARTED',
        domain_billing_readiness: r.domain_billing_readiness || 'NOT_STARTED',
        domain_go_live_review: r.domain_go_live_review || 'NOT_STARTED',
        handoff_submitted_by: r.handoff_submitted_by,
        handoff_submitted_at: r.handoff_submitted_at,
        handoff_accepted_by: r.handoff_accepted_by,
        handoff_accepted_at: r.handoff_accepted_at,
        handoff_notes: r.handoff_notes,
        created_at: r.created_at,
        updated_at: r.updated_at,
      };
    }
  }

  return null;
}

/**
 * Trigger mobilisation from Won Commercial Opportunity
 */
export async function createMobilisationFromWonOpportunity(params: {
  opportunityId: string;
  companyName: string;
  serviceScope: string;
  annualValueGbp?: number;
  targetGoLiveDate?: string;
  commercialOwner?: string;
  templateType?: string;
}): Promise<MobilisationRecord> {
  const id = `mob-${Date.now()}`;
  const targetDate = params.targetGoLiveDate || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0];

  const record: MobilisationRecord = {
    id,
    opportunity_id: params.opportunityId,
    name: `${params.companyName} — FM Mobilisation`,
    client_name: params.companyName,
    commercial_owner: params.commercialOwner || 'Commercial Lead',
    operations_owner: 'Unassigned (Awaiting Operations Acceptance)',
    status: 'AWAITING_HANDOFF',
    template_type: params.templateType || 'TOTAL_FM',
    target_go_live_date: targetDate,
    contract_term_months: 12,
    annual_contract_value_gbp: params.annualValueGbp,
    domain_commercial_handoff: 'IN_PROGRESS',
    domain_estate_discovery: 'NOT_STARTED',
    domain_asset_baseline: 'NOT_STARTED',
    domain_compliance_baseline: 'NOT_STARTED',
    domain_ppm_development: 'NOT_STARTED',
    domain_supply_chain: 'NOT_STARTED',
    domain_helpdesk_sla: 'NOT_STARTED',
    domain_client_portal: 'NOT_STARTED',
    domain_reporting: 'NOT_STARTED',
    domain_billing_readiness: 'NOT_STARTED',
    domain_go_live_review: 'NOT_STARTED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mobMemoryStore.mobilisations.set(id, record);

  if (isDbConfigured()) {
    await dbQuery('mobilisations', {
      method: 'POST',
      body: {
        id: record.id,
        opportunity_id: record.opportunity_id,
        name: record.name,
        client_name: record.client_name,
        commercial_owner: record.commercial_owner,
        operations_owner: record.operations_owner,
        status: record.status,
        template_type: record.template_type,
        target_go_live_date: record.target_go_live_date,
        annual_contract_value_gbp: record.annual_contract_value_gbp,
        domain_commercial_handoff: record.domain_commercial_handoff,
      },
    });
  }

  // Populate Standard 12-Phase Mobilisation Tasks
  await populateStandardMobilisationTasks(id);

  return record;
}

/**
 * Populate standard 12-phase mobilisation task framework
 */
export async function populateStandardMobilisationTasks(mobilisationId: string): Promise<void> {
  const standardTasks = [
    { phase: 1, name: '01. Commercial Handoff', title: 'Submit Commercial Handoff Dossier', blocking: true },
    { phase: 2, name: '02. Client & Contract Setup', title: 'Verify Legal Entity & Authorised Signatories', blocking: true },
    { phase: 3, name: '03. Estate Discovery', title: 'Conduct Site Access & Keyholder Audit', blocking: true },
    { phase: 4, name: '04. Asset Baseline', title: 'Ingest & Validate Mechanical / Electrical Asset Register', blocking: true },
    { phase: 5, name: '05. Compliance Baseline', title: 'Perform Statutory Compliance Gap Audit (Fire, Water, Gas, F-Gas)', blocking: true },
    { phase: 6, name: '06. PPM Development', title: 'Build SFG20 Annual Planned Maintenance Matrix', blocking: true },
    { phase: 7, name: '07. Supply Chain Setup', title: 'Confirm Subcontractor & Specialist Coverage Matrix', blocking: true },
    { phase: 8, name: '08. Helpdesk & SLA Setup', title: 'Configure 24/7 Priority Routing & SLA Clocks in EntireCAFM', blocking: true },
    { phase: 9, name: '09. Client Portal Setup', title: 'Configure Client User Roles & Prepare Portal Access', blocking: false },
    { phase: 10, name: '10. Reporting & Governance', title: 'Set Up Monthly Contract Review & KPI Reports', blocking: false },
    { phase: 11, name: '11. Go-Live Readiness Review', title: 'Execute Formal Go-Live Readiness Review Gate', blocking: true },
    { phase: 12, name: '12. Go Live & Stabilisation', title: 'Activate Operational State & Initiate 30-Day Stabilisation', blocking: true },
  ];

  for (const t of standardTasks) {
    const taskId = `task-${Date.now()}-${t.phase}`;
    const taskRecord: MobilisationTask = {
      id: taskId,
      mobilisation_id: mobilisationId,
      phase_number: t.phase,
      phase_name: t.name,
      title: t.title,
      owner: 'Operations Mobilisation Manager',
      department: 'OPERATIONS',
      due_date: new Date(Date.now() + 86400000 * (t.phase * 2)).toISOString(),
      priority: t.blocking ? 'HIGH' : 'NORMAL',
      status: t.phase === 1 ? 'IN_PROGRESS' : 'NOT_STARTED',
      is_blocking: t.blocking,
      created_at: new Date().toISOString(),
    };

    mobMemoryStore.tasks.set(taskId, taskRecord);

    if (isDbConfigured()) {
      await dbQuery('mobilisation_tasks', {
        method: 'POST',
        body: taskRecord,
      });
    }
  }
}

/**
 * List tasks for a mobilisation
 */
export async function listMobilisationTasks(mobilisationId: string): Promise<MobilisationTask[]> {
  let list = Array.from(mobMemoryStore.tasks.values()).filter((t) => t.mobilisation_id === mobilisationId);

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(
      `mobilisation_tasks?mobilisation_id=eq.${mobilisationId}&select=*&order=phase_number.asc`
    );
    if (data) {
      list = data.map((r) => ({
        id: r.id,
        mobilisation_id: r.mobilisation_id,
        phase_number: r.phase_number,
        phase_name: r.phase_name,
        title: r.title,
        description: r.description,
        owner: r.owner,
        department: r.department,
        due_date: r.due_date,
        priority: r.priority,
        status: r.status,
        is_blocking: r.is_blocking,
        dependency_task_id: r.dependency_task_id,
        evidence_required: r.evidence_required,
        created_at: r.created_at,
        completed_at: r.completed_at,
      }));
    }
  }

  return list;
}

/**
 * Get Mobilisation Dashboard KPI Metrics
 */
export async function getMobilisationDashboardMetrics(): Promise<MobilisationDashboardMetrics> {
  const mobs = await listMobilisations();
  const allTasks = Array.from(mobMemoryStore.tasks.values());

  const now = new Date();
  const overdue = allTasks.filter((t) => new Date(t.due_date) < now && t.status !== 'COMPLETE');

  return {
    awaitingHandoffCount: mobs.filter((m) => m.status === 'AWAITING_HANDOFF').length,
    activeMobilisationsCount: mobs.filter((m) => m.status === 'IN_PROGRESS' || m.status === 'PLANNING').length,
    atRiskCount: mobs.filter((m) => m.status === 'AT_RISK').length,
    tasksOverdueCount: overdue.length,
    readyForGoLiveCount: mobs.filter((m) => m.status === 'GO_LIVE_REVIEW' || m.status === 'READY').length,
    goLivesThisMonthCount: mobs.filter((m) => m.status === 'LIVE_STABILISATION').length,
    completedThisQuarterCount: mobs.filter((m) => m.status === 'COMPLETE').length,
  };
}
