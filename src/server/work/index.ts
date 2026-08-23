/**
 * ENTIREFM WORK DOMAIN MODULE (Phase 0B CAFM Operations Core)
 * ==========================================================
 * Canonical Work Model:
 * ServiceRequest -> WorkOrder -> Assignment -> Visit -> Task -> CompletionEvidence -> Billing
 * Includes: SLA Engine, Evidence Gate Validation, Reference Formatting, and Triage Workflow.
 */

import { dbQuery } from '../db/client';
import { recordAuditEvent } from '../audit';
import { UserSession } from '../identity';

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

export type ServiceRequestStatus =
  | 'NEW'
  | 'TRIAGED'
  | 'ACCEPTED'
  | 'CONVERTED_TO_WORK'
  | 'RESOLVED'
  | 'CANCELLED';

export interface PriorityDefinition {
  id: string;
  code: WorkPriority;
  label: string;
  severity_level: number;
  target_response_mins: number;
  target_attendance_mins: number;
  target_resolution_hours: number;
  operating_hours: string; // '24_7' | 'BUSINESS_HOURS'
  escalation_rule_json?: Record<string, any>;
  is_active: boolean;
}

export const CANONICAL_PRIORITIES: Record<WorkPriority, PriorityDefinition> = {
  P1_CRITICAL: {
    id: 'p1',
    code: 'P1_CRITICAL',
    label: 'P1 - Emergency / Critical Hazard',
    severity_level: 1,
    target_response_mins: 15,
    target_attendance_mins: 120, // 2 hours
    target_resolution_hours: 4,
    operating_hours: '24_7',
    is_active: true,
  },
  P2_HIGH: {
    id: 'p2',
    code: 'P2_HIGH',
    label: 'P2 - High / Urgent Operational Impact',
    severity_level: 2,
    target_response_mins: 30,
    target_attendance_mins: 240, // 4 hours
    target_resolution_hours: 12,
    operating_hours: '24_7',
    is_active: true,
  },
  P3_MEDIUM: {
    id: 'p3',
    code: 'P3_MEDIUM',
    label: 'P3 - Medium / Routine Maintenance',
    severity_level: 3,
    target_response_mins: 60,
    target_attendance_mins: 1440, // 24 hours
    target_resolution_hours: 48,
    operating_hours: 'BUSINESS_HOURS',
    is_active: true,
  },
  P4_LOW: {
    id: 'p4',
    code: 'P4_LOW',
    label: 'P4 - Low / Minor Rectification',
    severity_level: 4,
    target_response_mins: 120,
    target_attendance_mins: 2880, // 48 hours
    target_resolution_hours: 120, // 5 days
    operating_hours: 'BUSINESS_HOURS',
    is_active: true,
  },
  P5_SCHEDULED: {
    id: 'p5',
    code: 'P5_SCHEDULED',
    label: 'P5 - Scheduled / Planned Maintenance',
    severity_level: 5,
    target_response_mins: 480,
    target_attendance_mins: 10080, // 7 days
    target_resolution_hours: 336, // 14 days
    operating_hours: 'BUSINESS_HOURS',
    is_active: true,
  },
};

export interface ServiceRequest {
  id: string;
  reference: string;
  organisation_id: string;
  client_account_id?: string;
  site_id: string;
  building_id?: string;
  space_id?: string;
  asset_id?: string;
  title: string;
  description: string;
  category: string;
  priority: WorkPriority;
  status: ServiceRequestStatus;
  source: 'MANUAL' | 'PHONE' | 'EMAIL' | 'PORTAL' | 'AI_HELPDESK';
  requester_name?: string;
  requester_email?: string;
  requester_phone?: string;
  trade_id?: string;
  safety_hazard?: boolean;
  triage_notes?: string;
  triaged_by_id?: string;
  triaged_at?: string;
  converted_work_order_id?: string;
  created_at: string;
  organisation?: { name: string };
  site?: { name: string; site_code: string; address_line1?: string; postcode?: string };
  asset?: { name: string; asset_reference: string };
}

export interface WorkOrder {
  id: string;
  work_order_number: string;
  service_request_id?: string;
  organisation_id: string;
  site_id: string;
  building_id?: string;
  space_id?: string;
  asset_id?: string;
  contract_id?: string;
  trade_id?: string;
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
  sla_attendance_due_at?: string;
  sla_resolution_due_at?: string;
  actual_start_at?: string;
  actual_completion_at?: string;
  lead_engineer_id?: string;
  billing_status: 'UNBILLED' | 'WIP' | 'READY_TO_INVOICE' | 'INVOICED';
  total_cost_gbp?: number;
  total_revenue_gbp?: number;
  created_at: string;
  organisation?: { name: string };
  site?: { name: string; site_code: string; postcode?: string };
  asset?: { name: string; asset_reference: string };
  provider_organisation?: { name: string; code: string };
}

export interface WorkAssignment {
  id: string;
  work_order_id: string;
  visit_id?: string;
  provider_org_id: string;
  provider_resource_id?: string;
  status: 'OFFERED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  source: 'MANUAL' | 'AI_DISPATCH' | 'AUTO_ESCALATION';
  ranking_context?: Record<string, any>;
  reason?: string;
  rejection_reason?: string;
  assigned_at: string;
  accepted_at?: string;
  rejected_at?: string;
  cancelled_at?: string;
  completed_at?: string;
  is_ai_assigned: boolean;
  provider_organisation?: { name: string; code: string };
  provider_resource?: { first_name: string; last_name: string };
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
  status: 'PLANNED' | 'CONFIRMED' | 'EN_ROUTE' | 'ON_SITE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_ACCESS';
  travel_time_minutes?: number;
  site_notes?: string;
  created_at: string;
  assigned_resource?: { first_name: string; last_name: string };
}

export interface Task {
  id: string;
  visit_id?: string;
  work_order_id: string;
  title: string;
  description?: string;
  is_mandatory: boolean;
  sequence_order: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'NOT_APPLICABLE';
  completed_at?: string;
  completed_by_id?: string;
  completion_notes?: string;
  evidence_required?: string;
  created_at: string;
}

export interface EvidenceRequirement {
  id: string;
  client_account_id?: string;
  contract_id?: string;
  trade_id?: string;
  asset_category?: string;
  work_type?: string;
  requirement_type: string;
  description: string;
  is_mandatory: boolean;
}

export interface CompletionEvidence {
  id: string;
  work_order_id: string;
  visit_id?: string;
  task_id?: string;
  asset_id?: string;
  evidence_req_id?: string;
  document_id?: string;
  evidence_type: string;
  evidence_payload?: Record<string, any>;
  validation_state: 'PENDING' | 'AI_VALIDATED' | 'HUMAN_VERIFIED' | 'REJECTED';
  ai_validation_json?: Record<string, any>;
  human_verifier_id?: string;
  human_verified_at?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface SLACalculation {
  priority: WorkPriority;
  responseDueAt: Date;
  attendanceDueAt: Date;
  resolutionDueAt: Date;
  status: 'ON_TRACK' | 'WARNING' | 'AT_RISK' | 'BREACHED' | 'COMPLETED';
  remainingMinutes: number;
}

/**
 * Generate human-readable operational reference code
 */
export function generateReferenceNumber(prefix: string, sequenceNum: number): string {
  const year = new Date().getFullYear();
  const numStr = sequenceNum.toString().padStart(6, '0');
  return `EFM-${prefix}-${year}-${numStr}`;
}

/**
 * Calculate SLA target dates and operational risk state
 */
export function calculateSlaTargets(
  priority: WorkPriority,
  createdAt: Date = new Date()
): { responseDueAt: Date; attendanceDueAt: Date; resolutionDueAt: Date } {
  const cfg = CANONICAL_PRIORITIES[priority] || CANONICAL_PRIORITIES.P3_MEDIUM;
  
  const responseDueAt = new Date(createdAt.getTime() + cfg.target_response_mins * 60 * 1000);
  const attendanceDueAt = new Date(createdAt.getTime() + cfg.target_attendance_mins * 60 * 1000);
  const resolutionDueAt = new Date(createdAt.getTime() + cfg.target_resolution_hours * 60 * 60 * 1000);

  return { responseDueAt, attendanceDueAt, resolutionDueAt };
}

/**
 * Compute SLA Operational status and remaining time
 */
export function computeSlaStatus(
  resolutionDueAt: Date | string | undefined,
  isCompleted = false
): { status: 'ON_TRACK' | 'WARNING' | 'AT_RISK' | 'BREACHED' | 'COMPLETED'; remainingMinutes: number } {
  if (isCompleted) {
    return { status: 'COMPLETED', remainingMinutes: 0 };
  }
  if (!resolutionDueAt) {
    return { status: 'ON_TRACK', remainingMinutes: 99999 };
  }

  const targetTime = new Date(resolutionDueAt).getTime();
  const now = Date.now();
  const remainingMinutes = Math.round((targetTime - now) / (1000 * 60));

  if (remainingMinutes <= 0) {
    return { status: 'BREACHED', remainingMinutes };
  }
  if (remainingMinutes <= 60) {
    return { status: 'AT_RISK', remainingMinutes };
  }
  if (remainingMinutes <= 180) {
    return { status: 'WARNING', remainingMinutes };
  }
  return { status: 'ON_TRACK', remainingMinutes };
}

/**
 * Valid state transitions for Work Orders
 */
const VALID_WORK_ORDER_TRANSITIONS: Record<WorkStatus, WorkStatus[]> = {
  DRAFT: ['ISSUED', 'CANCELLED'],
  ISSUED: ['ACCEPTED', 'SCHEDULED', 'CANCELLED'],
  ACCEPTED: ['SCHEDULED', 'IN_PROGRESS', 'ON_HOLD', 'CANCELLED'],
  SCHEDULED: ['IN_PROGRESS', 'ON_HOLD', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'ON_HOLD', 'CANCELLED'],
  ON_HOLD: ['IN_PROGRESS', 'SCHEDULED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

export function validateWorkOrderStatusTransition(
  currentStatus: WorkStatus,
  targetStatus: WorkStatus
): { valid: boolean; error?: string } {
  if (currentStatus === targetStatus) return { valid: true };
  const allowed = VALID_WORK_ORDER_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    return {
      valid: false,
      error: `Invalid transition from '${currentStatus}' to '${targetStatus}'. Allowed: [${allowed.join(', ')}]`,
    };
  }
  return { valid: true };
}

/**
 * Evidence Gate Validation before allowing Work Order completion
 */
export async function validateEvidenceGate(
  workOrderId: string,
  managerOverride = false
): Promise<{ allowed: boolean; blockingReasons: string[] }> {
  const blockingReasons: string[] = [];

  // Check pending tasks
  const { data: tasks } = await dbQuery<Task[]>(
    `tasks?work_order_id=eq.${encodeURIComponent(workOrderId)}&select=*`
  );
  const pendingMandatoryTasks = (tasks || []).filter(
    (t) => t.is_mandatory && t.status !== 'COMPLETED' && t.status !== 'NOT_APPLICABLE'
  );
  if (pendingMandatoryTasks.length > 0) {
    blockingReasons.push(`${pendingMandatoryTasks.length} mandatory task(s) are incomplete.`);
  }

  // Check evidence records
  const { data: evidences } = await dbQuery<CompletionEvidence[]>(
    `completion_evidences?work_order_id=eq.${encodeURIComponent(workOrderId)}&select=*`
  );
  const rejectedEvidence = (evidences || []).filter((e) => e.validation_state === 'REJECTED');
  if (rejectedEvidence.length > 0) {
    blockingReasons.push(`${rejectedEvidence.length} submitted evidence item(s) were rejected.`);
  }

  if (blockingReasons.length > 0 && !managerOverride) {
    return { allowed: false, blockingReasons };
  }

  return { allowed: true, blockingReasons: [] };
}

/**
 * List Service Requests with filters
 */
export async function listServiceRequests(filters?: {
  status?: ServiceRequestStatus;
  priority?: WorkPriority;
  siteId?: string;
  limit?: number;
}): Promise<ServiceRequest[]> {
  let endpoint =
    'service_requests?select=*,organisation:organisations(name),site:sites(name,site_code),asset:assets(name,asset_reference)&order=created_at.desc';
  if (filters?.status) endpoint += `&status=eq.${encodeURIComponent(filters.status)}`;
  if (filters?.priority) endpoint += `&priority=eq.${encodeURIComponent(filters.priority)}`;
  if (filters?.siteId) endpoint += `&site_id=eq.${encodeURIComponent(filters.siteId)}`;
  if (filters?.limit) endpoint += `&limit=${filters.limit}`;
  const { data } = await dbQuery<ServiceRequest[]>(endpoint);
  return data || [];
}

/**
 * List Work Orders with filters
 */
export async function listWorkOrders(filters?: {
  status?: WorkStatus;
  priority?: WorkPriority;
  siteId?: string;
  limit?: number;
}): Promise<WorkOrder[]> {
  let endpoint =
    'work_orders?select=*,organisation:organisations(name),site:sites(name,site_code),asset:assets(name,asset_reference),provider_organisation:organisations(name,code)&order=created_at.desc';
  if (filters?.status) endpoint += `&status=eq.${encodeURIComponent(filters.status)}`;
  if (filters?.priority) endpoint += `&priority=eq.${encodeURIComponent(filters.priority)}`;
  if (filters?.siteId) endpoint += `&site_id=eq.${encodeURIComponent(filters.siteId)}`;
  if (filters?.limit) endpoint += `&limit=${filters.limit}`;
  const { data } = await dbQuery<WorkOrder[]>(endpoint);
  return data || [];
}

/**
 * List Assignments for a Work Order
 */
export async function listAssignments(workOrderId: string): Promise<WorkAssignment[]> {
  const { data } = await dbQuery<WorkAssignment[]>(
    `work_assignments?work_order_id=eq.${encodeURIComponent(workOrderId)}&select=*,provider_organisation:organisations(name,code)&order=assigned_at.desc`
  );
  return data || [];
}

/**
 * List Visits for a Work Order
 */
export async function listVisits(workOrderId?: string): Promise<Visit[]> {
  let endpoint = 'visits?select=*,assigned_resource:persons(first_name,last_name)&order=scheduled_start_at.asc';
  if (workOrderId) endpoint += `&work_order_id=eq.${encodeURIComponent(workOrderId)}`;
  const { data } = await dbQuery<Visit[]>(endpoint);
  return data || [];
}

/**
 * List Tasks for a Work Order
 */
export async function listTasks(workOrderId: string): Promise<Task[]> {
  const { data } = await dbQuery<Task[]>(
    `tasks?work_order_id=eq.${encodeURIComponent(workOrderId)}&select=*&order=sequence_order.asc`
  );
  return data || [];
}

/**
 * List Active SLA Risks
 */
export async function listActiveSLARisks(): Promise<WorkOrder[]> {
  const { data } = await dbQuery<WorkOrder[]>(
    `work_orders?status=not.in.(COMPLETED,CANCELLED)&sla_resolution_due_at=not.is.null&select=*,organisation:organisations(name),site:sites(name,site_code)&order=sla_resolution_due_at.asc&limit=20`
  );
  return data || [];
}
