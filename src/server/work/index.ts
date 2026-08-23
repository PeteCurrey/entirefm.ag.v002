/**
 * ENTIREFM WORK DOMAIN MODULE
 * ============================
 * Canonical Work Model:
 * ServiceRequest -> WorkOrder -> Visit -> Task
 * Supports SLAs, Milestones, Escalations, and Audited State Changes.
 */

import { dbQuery } from '../db/client';
import { recordAuditEvent } from '../audit';

export type WorkStatus =
  | 'DRAFT'
  | 'ISSUED'
  | 'ACCEPTED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED';

export type WorkPriority = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW' | 'P5_SCHEDULED';

export interface ServiceRequest {
  id: string;
  reference: string;
  organisation_id: string;
  site_id: string;
  title: string;
  description: string;
  category: string;
  priority: WorkPriority;
  status: string;
  source: string;
  created_at: string;
  organisation?: { name: string };
  site?: { name: string; site_code: string };
}

export interface WorkOrder {
  id: string;
  work_order_number: string;
  service_request_id?: string;
  organisation_id: string;
  site_id: string;
  building_id?: string;
  asset_id?: string;
  contract_id?: string;
  sla_id?: string;
  provider_organisation_id?: string;
  title: string;
  description: string;
  work_type: 'REACTIVE' | 'PPM' | 'STATUTORY' | 'QUOTED' | 'PROJECT';
  priority: WorkPriority;
  status: WorkStatus;
  hold_reason?: string;
  target_start_at?: string;
  target_completion_at?: string;
  sla_response_due_at?: string;
  sla_resolution_due_at?: string;
  actual_start_at?: string;
  actual_completion_at?: string;
  lead_engineer_id?: string;
  billing_status: 'UNBILLED' | 'WIP' | 'READY_TO_INVOICE' | 'INVOICED';
  total_cost_gbp?: number;
  total_revenue_gbp?: number;
  created_at: string;
  organisation?: { name: string };
  site?: { name: string; site_code: string };
  asset?: { name: string; asset_reference: string };
}

export interface Visit {
  id: string;
  work_order_id: string;
  visit_number: number;
  assigned_resource_id?: string;
  scheduled_start_at?: string;
  scheduled_end_at?: string;
  actual_check_in_at?: string;
  actual_check_out_at?: string;
  status: string;
  travel_time_minutes?: number;
  site_notes?: string;
  created_at: string;
}

export async function listWorkOrders(filters?: {
  status?: WorkStatus;
  priority?: WorkPriority;
  siteId?: string;
  limit?: number;
}): Promise<WorkOrder[]> {
  let endpoint = 'work_orders?select=*,organisation:organisations(name),site:sites(name,site_code),asset:assets(name,asset_reference)&order=created_at.desc';
  if (filters?.status) endpoint += `&status=eq.${encodeURIComponent(filters.status)}`;
  if (filters?.priority) endpoint += `&priority=eq.${encodeURIComponent(filters.priority)}`;
  if (filters?.siteId) endpoint += `&site_id=eq.${encodeURIComponent(filters.siteId)}`;
  if (filters?.limit) endpoint += `&limit=${filters.limit}`;
  const { data } = await dbQuery<WorkOrder[]>(endpoint);
  return data || [];
}

export async function getWorkOrderById(id: string): Promise<WorkOrder | null> {
  const { data } = await dbQuery<WorkOrder[]>(
    `work_orders?id=eq.${encodeURIComponent(id)}&select=*,organisation:organisations(name),site:sites(name,site_code),asset:assets(name,asset_reference)`
  );
  return data && data.length > 0 ? data[0] : null;
}

export async function listServiceRequests(limit = 100): Promise<ServiceRequest[]> {
  const { data } = await dbQuery<ServiceRequest[]>(
    `service_requests?select=*,organisation:organisations(name),site:sites(name,site_code)&order=created_at.desc&limit=${limit}`
  );
  return data || [];
}

export async function listActiveSLARisks(): Promise<WorkOrder[]> {
  // Queries active work orders where SLA resolution target is near or breached
  const { data } = await dbQuery<WorkOrder[]>(
    `work_orders?status=not.in.(COMPLETED,CANCELLED)&sla_resolution_due_at=not.is.null&select=*,organisation:organisations(name),site:sites(name,site_code)&order=sla_resolution_due_at.asc&limit=20`
  );
  return data || [];
}
