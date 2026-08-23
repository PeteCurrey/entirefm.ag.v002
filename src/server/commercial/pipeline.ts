/**
 * ENTIREFM COMMERCIAL PIPELINE DOMAIN MODULE (Phase 5)
 * ====================================================
 * Full lifecycle management: Lead -> Qualification -> Discovery -> Site Survey -> Opportunity -> Proposal -> Won -> Mobilisation Handoff.
 */

import { dbQuery } from '../db/client';

export type PipelineStage =
  | 'QUALIFIED'
  | 'DISCOVERY'
  | 'SITE_SURVEY'
  | 'SCOPE_DEVELOPMENT'
  | 'PROPOSAL_PREPARATION'
  | 'PROPOSAL_SENT'
  | 'NEGOTIATION'
  | 'VERBAL_PREFERRED'
  | 'WON'
  | 'LOST';

export type CommercialTaskType =
  | 'FOLLOW_UP'
  | 'CALL'
  | 'EMAIL'
  | 'SITE_SURVEY'
  | 'PROPOSAL_DRAFT'
  | 'TENDER_REVIEW'
  | 'MOBILISATION';

export type CommercialPriority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';

export interface CommercialTask {
  id: string;
  lead_id?: string;
  opportunity_id?: string;
  title: string;
  task_type: CommercialTaskType;
  owner: string;
  due_date: string;
  priority: CommercialPriority;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  created_at: string;
  completed_at?: string;
}

export interface SiteSurvey {
  id: string;
  opportunity_id?: string;
  lead_id?: string;
  site_name: string;
  site_address: string;
  scheduled_at: string;
  surveyor_name: string;
  contact_name?: string;
  contact_phone?: string;
  survey_type: 'COMPREHENSIVE_FM' | 'HVAC_PLANT' | 'M_AND_E' | 'FABRIC' | 'STATUTORY_AUDIT';
  access_notes?: string;
  survey_status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'REPORT_PREPARED' | 'CANCELLED';
  findings_summary?: string;
  asset_count_identified?: number;
  key_risks?: string;
  created_at: string;
}

export interface CommercialActivity {
  id: string;
  lead_id?: string;
  opportunity_id?: string;
  activity_type: string;
  actor: string;
  summary: string;
  details?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface FullOpportunity {
  id: string;
  lead_id?: string;
  company: string;
  primary_contact?: string;
  contact_email?: string;
  contact_phone?: string;
  service: string;
  sector?: string;
  location: string;
  opportunity_name: string;
  scope_summary?: string;
  estimated_value_gbp: number | null;
  stage: PipelineStage;
  probability_pct: number;
  target_start_date?: string;
  decision_date?: string;
  tender_deadline?: string;
  competitor_incumbent?: string;
  is_tender: boolean;
  owner: string;
  next_action?: string;
  next_action_at?: string;
  last_activity_at: string;
  won_lost_reason?: string;
  mobilisation_status: 'PENDING_WIN' | 'HANDED_OFF' | 'MOBILISATION_STARTED' | 'CLIENT_CREATED' | 'OPERATIONAL_LIVE';
  mobilisation_notes?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface CommercialDashboardMetrics {
  newLeadsCount: number;
  unassignedLeadsCount: number;
  overdueTasksCount: number;
  qualifiedOpportunitiesCount: number;
  proposalsOutCount: number;
  surveysPendingCount: number;
  wonThisMonthCount: number;
  lostThisMonthCount: number;
  totalPipelineValueGbp: number;
  wonRevenueThisMonthGbp: number;
}

// In-Memory Fallback Store
class CommercialMemoryStore {
  public opportunities: Map<string, FullOpportunity> = new Map();
  public tasks: Map<string, CommercialTask> = new Map();
  public surveys: Map<string, SiteSurvey> = new Map();
  public activities: Map<string, CommercialActivity> = new Map();
}

export const commMemoryStore = new CommercialMemoryStore();

function isDbConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * List all commercial opportunities
 */
export async function listOpportunities(stage?: PipelineStage): Promise<FullOpportunity[]> {
  let list = Array.from(commMemoryStore.opportunities.values());

  if (isDbConfigured()) {
    let q = 'commercial_opportunities?select=*&order=created_at.desc';
    if (stage) q += `&stage=eq.${stage}`;
    const { data } = await dbQuery<any[]>(q);
    if (data) {
      list = data.map((r) => ({
        id: r.id,
        lead_id: r.lead_id,
        company: r.company,
        primary_contact: r.primary_contact,
        contact_email: r.contact_email,
        contact_phone: r.contact_phone,
        service: r.service,
        sector: r.sector,
        location: r.location,
        opportunity_name: r.opportunity_name || `${r.company} — ${r.service}`,
        scope_summary: r.scope_summary,
        estimated_value_gbp: r.estimated_value_gbp ? Number(r.estimated_value_gbp) : null,
        stage: r.stage || 'QUALIFIED',
        probability_pct: r.probability_pct ?? 50,
        target_start_date: r.target_start_date,
        decision_date: r.decision_date,
        tender_deadline: r.tender_deadline,
        competitor_incumbent: r.competitor_incumbent,
        is_tender: r.is_tender || false,
        owner: r.owner || 'Unassigned',
        next_action: r.next_action,
        next_action_at: r.next_action_at,
        last_activity_at: r.last_activity_at || r.created_at,
        won_lost_reason: r.won_lost_reason,
        mobilisation_status: r.mobilisation_status || 'PENDING_WIN',
        mobilisation_notes: r.mobilisation_notes,
        created_at: r.created_at,
        updated_at: r.updated_at,
        closed_at: r.closed_at,
      }));
    }
  }

  if (stage) {
    list = list.filter((o) => o.stage === stage);
  }

  return list;
}

/**
 * Fetch opportunity by ID
 */
export async function getOpportunityById(id: string): Promise<FullOpportunity | null> {
  const mem = commMemoryStore.opportunities.get(id);
  if (mem) return mem;

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(`commercial_opportunities?id=eq.${id}&select=*`);
    if (data && data.length > 0) {
      const r = data[0];
      return {
        id: r.id,
        lead_id: r.lead_id,
        company: r.company,
        primary_contact: r.primary_contact,
        contact_email: r.contact_email,
        contact_phone: r.contact_phone,
        service: r.service,
        sector: r.sector,
        location: r.location,
        opportunity_name: r.opportunity_name || `${r.company} — ${r.service}`,
        scope_summary: r.scope_summary,
        estimated_value_gbp: r.estimated_value_gbp ? Number(r.estimated_value_gbp) : null,
        stage: r.stage || 'QUALIFIED',
        probability_pct: r.probability_pct ?? 50,
        target_start_date: r.target_start_date,
        decision_date: r.decision_date,
        tender_deadline: r.tender_deadline,
        competitor_incumbent: r.competitor_incumbent,
        is_tender: r.is_tender || false,
        owner: r.owner || 'Unassigned',
        next_action: r.next_action,
        next_action_at: r.next_action_at,
        last_activity_at: r.last_activity_at || r.created_at,
        won_lost_reason: r.won_lost_reason,
        mobilisation_status: r.mobilisation_status || 'PENDING_WIN',
        mobilisation_notes: r.mobilisation_notes,
        created_at: r.created_at,
        updated_at: r.updated_at,
        closed_at: r.closed_at,
      };
    }
  }

  return null;
}

/**
 * Create or convert lead to opportunity
 */
export async function createOpportunity(opp: Partial<FullOpportunity>): Promise<FullOpportunity> {
  const id = opp.id || `opp-${Date.now()}`;
  const record: FullOpportunity = {
    id,
    lead_id: opp.lead_id,
    company: opp.company || 'Unknown Organisation',
    primary_contact: opp.primary_contact || '',
    contact_email: opp.contact_email || '',
    contact_phone: opp.contact_phone || '',
    service: opp.service || 'Total Facilities Management',
    sector: opp.sector || 'Commercial Property',
    location: opp.location || 'United Kingdom',
    opportunity_name: opp.opportunity_name || `${opp.company} — ${opp.service || 'FM'}`,
    scope_summary: opp.scope_summary || '',
    estimated_value_gbp: opp.estimated_value_gbp ?? null,
    stage: opp.stage || 'QUALIFIED',
    probability_pct: opp.probability_pct ?? 50,
    target_start_date: opp.target_start_date,
    decision_date: opp.decision_date,
    tender_deadline: opp.tender_deadline,
    competitor_incumbent: opp.competitor_incumbent,
    is_tender: opp.is_tender || false,
    owner: opp.owner || 'Unassigned',
    next_action: opp.next_action || 'Conduct discovery & requirements review',
    next_action_at: opp.next_action_at || new Date(Date.now() + 86400000 * 2).toISOString(),
    last_activity_at: new Date().toISOString(),
    won_lost_reason: opp.won_lost_reason,
    mobilisation_status: opp.mobilisation_status || 'PENDING_WIN',
    mobilisation_notes: opp.mobilisation_notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  commMemoryStore.opportunities.set(id, record);

  if (isDbConfigured()) {
    await dbQuery('commercial_opportunities', {
      method: 'POST',
      body: {
        id: record.id,
        lead_id: record.lead_id,
        company: record.company,
        primary_contact: record.primary_contact,
        contact_email: record.contact_email,
        contact_phone: record.contact_phone,
        service: record.service,
        sector: record.sector,
        location: record.location,
        opportunity_name: record.opportunity_name,
        scope_summary: record.scope_summary,
        estimated_value_gbp: record.estimated_value_gbp,
        stage: record.stage,
        probability_pct: record.probability_pct,
        target_start_date: record.target_start_date,
        decision_date: record.decision_date,
        tender_deadline: record.tender_deadline,
        competitor_incumbent: record.competitor_incumbent,
        is_tender: record.is_tender,
        owner: record.owner,
        next_action: record.next_action,
        next_action_at: record.next_action_at,
        mobilisation_status: record.mobilisation_status,
      },
    });
  }

  // Create initial task
  await createCommercialTask({
    opportunity_id: id,
    lead_id: opp.lead_id,
    title: 'Conduct initial discovery call & requirements validation',
    task_type: 'CALL',
    owner: record.owner,
    priority: 'HIGH',
    due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
  });

  return record;
}

/**
 * Update opportunity stage & trigger handoff if WON
 */
export async function updateOpportunityStage(
  id: string,
  stage: PipelineStage,
  notes?: string,
  lossReason?: string
): Promise<FullOpportunity | null> {
  const opp = await getOpportunityById(id);
  if (!opp) return null;

  opp.stage = stage;
  opp.updated_at = new Date().toISOString();
  opp.last_activity_at = opp.updated_at;

  if (stage === 'WON') {
    opp.closed_at = opp.updated_at;
    opp.mobilisation_status = 'HANDED_OFF';
    opp.mobilisation_notes = notes || 'Commercial win approved. Handed off to EntireCAFM Operations.';

    // Create Mobilisation Onboarding Task
    await createCommercialTask({
      opportunity_id: id,
      lead_id: opp.lead_id,
      title: `Mobilisation Setup: Onboard ${opp.company} into EntireCAFM (Contract & Site Setup)`,
      task_type: 'MOBILISATION',
      owner: 'Operations Director',
      priority: 'URGENT',
      due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
      notes: `Service scope: ${opp.service}. Location: ${opp.location}. Estimated value: £${opp.estimated_value_gbp || 0}.`,
    });
  } else if (stage === 'LOST') {
    opp.closed_at = opp.updated_at;
    opp.won_lost_reason = lossReason || notes || 'Unspecified';
  }

  commMemoryStore.opportunities.set(id, opp);

  if (isDbConfigured()) {
    await dbQuery(`commercial_opportunities?id=eq.${id}`, {
      method: 'PATCH',
      body: {
        stage: opp.stage,
        closed_at: opp.closed_at,
        won_lost_reason: opp.won_lost_reason,
        mobilisation_status: opp.mobilisation_status,
        mobilisation_notes: opp.mobilisation_notes,
        updated_at: opp.updated_at,
        last_activity_at: opp.last_activity_at,
      },
    });
  }

  return opp;
}

/**
 * List commercial tasks
 */
export async function listCommercialTasks(status?: string): Promise<CommercialTask[]> {
  let list = Array.from(commMemoryStore.tasks.values());

  if (isDbConfigured()) {
    let q = 'commercial_tasks?select=*&order=due_date.asc';
    if (status) q += `&status=eq.${status}`;
    const { data } = await dbQuery<any[]>(q);
    if (data) {
      list = data.map((r) => ({
        id: r.id,
        lead_id: r.lead_id,
        opportunity_id: r.opportunity_id,
        title: r.title,
        task_type: r.task_type || 'FOLLOW_UP',
        owner: r.owner || 'Unassigned',
        due_date: r.due_date,
        priority: r.priority || 'NORMAL',
        status: r.status || 'PENDING',
        notes: r.notes,
        created_at: r.created_at,
        completed_at: r.completed_at,
      }));
    }
  }

  if (status) {
    list = list.filter((t) => t.status === status);
  }

  return list;
}

/**
 * Create commercial task
 */
export async function createCommercialTask(task: Partial<CommercialTask>): Promise<CommercialTask> {
  const id = task.id || `task-${Date.now()}`;
  const record: CommercialTask = {
    id,
    lead_id: task.lead_id,
    opportunity_id: task.opportunity_id,
    title: task.title || 'Follow up on commercial opportunity',
    task_type: task.task_type || 'FOLLOW_UP',
    owner: task.owner || 'Unassigned',
    due_date: task.due_date || new Date(Date.now() + 86400000 * 2).toISOString(),
    priority: task.priority || 'NORMAL',
    status: task.status || 'PENDING',
    notes: task.notes || '',
    created_at: new Date().toISOString(),
  };

  commMemoryStore.tasks.set(id, record);

  if (isDbConfigured()) {
    await dbQuery('commercial_tasks', {
      method: 'POST',
      body: {
        id: record.id,
        lead_id: record.lead_id,
        opportunity_id: record.opportunity_id,
        title: record.title,
        task_type: record.task_type,
        owner: record.owner,
        due_date: record.due_date,
        priority: record.priority,
        status: record.status,
        notes: record.notes,
      },
    });
  }

  return record;
}

/**
 * List site surveys
 */
export async function listSiteSurveys(): Promise<SiteSurvey[]> {
  let list = Array.from(commMemoryStore.surveys.values());

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>('commercial_site_surveys?select=*&order=scheduled_at.asc');
    if (data) {
      list = data.map((r) => ({
        id: r.id,
        opportunity_id: r.opportunity_id,
        lead_id: r.lead_id,
        site_name: r.site_name,
        site_address: r.site_address,
        scheduled_at: r.scheduled_at,
        surveyor_name: r.surveyor_name,
        contact_name: r.contact_name,
        contact_phone: r.contact_phone,
        survey_type: r.survey_type,
        access_notes: r.access_notes,
        survey_status: r.survey_status,
        findings_summary: r.findings_summary,
        asset_count_identified: r.asset_count_identified,
        key_risks: r.key_risks,
        created_at: r.created_at,
      }));
    }
  }

  return list;
}

/**
 * Get Commercial Dashboard KPI Metrics
 */
export async function getCommercialDashboardMetrics(): Promise<CommercialDashboardMetrics> {
  const opps = await listOpportunities();
  const tasks = await listCommercialTasks('PENDING');
  const surveys = await listSiteSurveys();

  const now = new Date();
  const overdueTasks = tasks.filter((t) => new Date(t.due_date) < now);
  const qualified = opps.filter((o) => o.stage === 'QUALIFIED' || o.stage === 'DISCOVERY');
  const proposalsOut = opps.filter((o) => o.stage === 'PROPOSAL_SENT' || o.stage === 'NEGOTIATION');
  const won = opps.filter((o) => o.stage === 'WON');
  const lost = opps.filter((o) => o.stage === 'LOST');

  const pipeline = opps
    .filter((o) => o.stage !== 'WON' && o.stage !== 'LOST')
    .reduce((acc, o) => acc + (o.estimated_value_gbp || 0), 0);

  const wonRevenue = won.reduce((acc, o) => acc + (o.estimated_value_gbp || 0), 0);

  return {
    newLeadsCount: 0,
    unassignedLeadsCount: opps.filter((o) => o.owner === 'Unassigned').length,
    overdueTasksCount: overdueTasks.length,
    qualifiedOpportunitiesCount: qualified.length,
    proposalsOutCount: proposalsOut.length,
    surveysPendingCount: surveys.filter((s) => s.survey_status === 'SCHEDULED').length,
    wonThisMonthCount: won.length,
    lostThisMonthCount: lost.length,
    totalPipelineValueGbp: pipeline,
    wonRevenueThisMonthGbp: wonRevenue,
  };
}
