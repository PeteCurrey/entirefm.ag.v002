/**
 * ENTIREFM LIVE WORK ORDER TRIAGE SERVICE
 * =======================================
 * Real-time operational triage, canonical lifecycle resolution,
 * multi-dimensional SLA radar, and client authorization scoping.
 */

import { dbQuery } from '@/server/db/client';
import { UserSession } from '@/server/identity';
import { computeSlaStatus } from '@/server/work';

export interface SlaRadarStatus {
  status: 'ON_TRACK' | 'WARNING' | 'AT_RISK' | 'BREACHED' | 'COMPLETED';
  remainingMinutes: number;
  minutesRemaining?: number;
  percentRemaining: number;
}

export type CanonicalTriageBucket =
  | 'NEW'
  | 'NEEDS_TRIAGE'
  | 'ASSIGNED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'AWAITING'
  | 'COMPLETED';

export interface WorkOrderTriageItem {
  id: string;
  work_order_number: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  disposition_state?: string;
  canonical_bucket: CanonicalTriageBucket;
  
  // Site & Asset
  site_id: string;
  site_name: string;
  site_code?: string;
  asset_id?: string;
  asset_reference?: string;
  asset_name?: string;

  // Contractor & Operative
  provider_org_id?: string;
  provider_name?: string;
  lead_engineer_name?: string;

  // Timestamps & SLA
  created_at: string;
  target_start_at?: string;
  target_completion_at?: string;
  sla_response_due_at?: string;
  sla_resolution_due_at?: string;
  actual_start_at?: string;
  actual_completion_at?: string;
  
  // Computed SLA radar
  sla_status: SlaRadarStatus;
  is_awaiting_client: boolean;
  is_awaiting_quote: boolean;
  is_awaiting_parts: boolean;
  quote_amount_gbp?: number;
}

/**
 * Resolves a work order's raw status and disposition into the operational triage bucket.
 */
export function resolveTriageBucket(status: string, disposition?: string): CanonicalTriageBucket {
  const s = (status || '').toUpperCase();
  const d = (disposition || '').toUpperCase();

  if (s === 'COMPLETION_PENDING' || s === 'COMPLETED' || s === 'CLOSED' || s === 'QA') return 'COMPLETED';
  if (s === 'ON_HOLD' || s === 'AWAITING' || d.startsWith('AWAITING') || d === 'RETURN_VISIT_REQUIRED') return 'AWAITING';
  if (s === 'ON_SITE' || s === 'IN_PROGRESS') return 'IN_PROGRESS';
  if (s === 'ACCEPTED' || s === 'SCHEDULED' || s === 'EN_ROUTE') return 'SCHEDULED';
  if (s === 'ISSUED' || s === 'OFFERED' || s === 'ASSIGNED') return 'ASSIGNED';
  if (s === 'OPEN' || s === 'TRIAGE' || s === 'NEEDS_TRIAGE') return 'NEEDS_TRIAGE';
  if (s === 'DRAFT' || s === 'SUBMITTED' || s === 'REPORTED') return 'NEW';

  return 'NEW';
}

/**
 * Fetches all scoped work orders for client or contractor with real-time SLA radar calculations.
 */
export async function getLiveTriageWorkOrders(session: UserSession): Promise<WorkOrderTriageItem[]> {
  const isInternal = session.orgType === 'ENTIREFM' || session.viewAsContext?.isViewAs;
  const isClient = session.orgType === 'CLIENT';
  const isContractor = session.orgType === 'CONTRACTOR';

  let filter = '';
  if (isClient && !isInternal) {
    const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);
    const siteFilter = siteScopes.length > 0 ? `&site_id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';
    filter = `&organisation_id=eq.${encodeURIComponent(session.orgId)}${siteFilter}`;
  } else if (isContractor && !isInternal) {
    filter = `&provider_organisation_id=eq.${encodeURIComponent(session.orgId)}`;
  }

  const { data: wos, error } = await dbQuery<any[]>(
    `work_orders?select=id,work_order_number,title,description,priority,status,hold_reason,created_at,target_start_at,target_completion_at,sla_response_due_at,sla_resolution_due_at,actual_start_at,actual_completion_at,site:sites(id,name,site_code),asset:assets(id,asset_reference,name),provider:organisations!work_orders_provider_organisation_id_fkey(id,name),lead_engineer:persons!work_orders_lead_engineer_id_fkey(first_name,last_name)${filter}&order=created_at.desc&limit=150`
  );

  if (error || !wos) {
    console.error('[TRIAGE_QUERY_ERROR]', error);
    return [];
  }

  // Also query pending quotes to flag quote approval needs
  const { data: quotes } = await dbQuery<any[]>(
    `quotes?status=in.(ISSUED,PENDING_APPROVAL)&select=id,work_order_id,total_price_gbp`
  );
  const quoteMap = new Map<string, number>();
  (quotes || []).forEach((q) => {
    if (q.work_order_id) quoteMap.set(q.work_order_id, Number(q.total_price_gbp));
  });

  return wos.map((wo) => {
    const isCompleted = ['COMPLETED', 'CLOSED'].includes(wo.status);
    const targetDate = wo.sla_resolution_due_at ? new Date(wo.sla_resolution_due_at) : (wo.target_completion_at ? new Date(wo.target_completion_at) : undefined);
    const slaStatus = computeSlaStatus(targetDate, isCompleted);
    const bucket = resolveTriageBucket(wo.status, wo.hold_reason);

    const isAwaitingQuote = !!quoteMap.has(wo.id) || (wo.hold_reason && wo.hold_reason.includes('QUOTE'));
    const isAwaitingClient = isAwaitingQuote || (wo.hold_reason && wo.hold_reason.includes('CLIENT'));
    const isAwaitingParts = wo.hold_reason && wo.hold_reason.includes('PARTS');

    return {
      id: wo.id,
      work_order_number: wo.work_order_number,
      title: wo.title,
      description: wo.description || '',
      priority: wo.priority || 'P3_MEDIUM',
      status: wo.status,
      disposition_state: wo.hold_reason,
      canonical_bucket: bucket,
      site_id: wo.site?.id || '',
      site_name: wo.site?.name || 'Unassigned Site',
      site_code: wo.site?.site_code,
      asset_id: wo.asset?.id,
      asset_reference: wo.asset?.asset_reference,
      asset_name: wo.asset?.name,
      provider_org_id: wo.provider?.id,
      provider_name: wo.provider?.name,
      lead_engineer_name: wo.lead_engineer ? `${wo.lead_engineer.first_name} ${wo.lead_engineer.last_name}` : undefined,
      created_at: wo.created_at,
      target_start_at: wo.target_start_at,
      target_completion_at: wo.target_completion_at,
      sla_response_due_at: wo.sla_response_due_at,
      sla_resolution_due_at: wo.sla_resolution_due_at,
      actual_start_at: wo.actual_start_at,
      sla_status: {
        ...slaStatus,
        minutesRemaining: slaStatus.remainingMinutes,
      },
      is_awaiting_client: !!isAwaitingClient,
      is_awaiting_quote: !!isAwaitingQuote,
      is_awaiting_parts: !!isAwaitingParts,
      quote_amount_gbp: quoteMap.get(wo.id),
    };
  });
}
