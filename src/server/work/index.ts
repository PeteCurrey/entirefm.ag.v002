/**
 * ENTIREFM WORK DOMAIN MODULE (Phase 0B-R Operational Hardening)
 * =============================================================
 * Hardened Operational State Machines, Disposition States, Completed vs Closed distinction,
 * Hierarchical SLA Engine with Operating Calendars & Pause/Resume, and Evidence Gate Policy.
 */

import { dbQuery } from '../db/client';
import { recordAuditEvent } from '../audit';
import { UserSession } from '../identity';
import { validateInternalEngineer } from './engineers';

export type WorkStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'ISSUED'
  | 'ACCEPTED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETION_PENDING'
  | 'COMPLETED'
  | 'CLOSED'
  | 'CANCELLED';

export type WorkDispositionState =
  | 'NONE'
  | 'AWAITING_CONTRACTOR'
  | 'AWAITING_ENGINEER'
  | 'AWAITING_PARTS'
  | 'AWAITING_QUOTE'
  | 'AWAITING_CLIENT_APPROVAL'
  | 'AWAITING_ACCESS'
  | 'RETURN_VISIT_REQUIRED'
  | 'NO_ACCESS'
  | 'ON_HOLD'
  | 'ESCALATED';

export type WorkPriority = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW' | 'P5_SCHEDULED';

export type ServiceRequestStatus =
  | 'NEW'
  | 'TRIAGE'
  | 'ACCEPTED'
  | 'CONVERTED'
  | 'RESOLVED'
  | 'REJECTED'
  | 'DUPLICATE'
  | 'CANCELLED';

export type AssignmentStatus =
  | 'DRAFT'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'SUPERSEDED'
  | 'COMPLETED';

export type VisitStatus =
  | 'PLANNED'
  | 'CONFIRMED'
  | 'EN_ROUTE'
  | 'ON_SITE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_ACCESS'
  | 'ABORTED';

export type TaskStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'NOT_APPLICABLE'
  | 'BLOCKED'
  | 'FAILED';

export type DefectStatus =
  | 'OPEN'
  | 'UNDER_REVIEW'
  | 'ACTION_REQUIRED'
  | 'MONITORING'
  | 'RESOLVED'
  | 'DISMISSED'
  | 'SUPERSEDED';

export interface PriorityDefinition {
  id: string;
  code: WorkPriority;
  label: string;
  severity_level: number;
  target_response_mins: number;
  target_attendance_mins: number;
  target_resolution_hours: number;
  operating_hours: string; // '24_7' | 'UK_STANDARD_BUSINESS'
  warning_pct: number;
  at_risk_pct: number;
  is_active: boolean;
}

export const CANONICAL_PRIORITIES: Record<WorkPriority, PriorityDefinition> = {
  P1_CRITICAL: {
    id: 'p1',
    code: 'P1_CRITICAL',
    label: 'P1 - Critical / Emergency Hazard',
    severity_level: 1,
    target_response_mins: 15,
    target_attendance_mins: 120,
    target_resolution_hours: 4,
    operating_hours: '24_7',
    warning_pct: 50,
    at_risk_pct: 25,
    is_active: true,
  },
  P2_HIGH: {
    id: 'p2',
    code: 'P2_HIGH',
    label: 'P2 - High / Urgent Operational Impact',
    severity_level: 2,
    target_response_mins: 30,
    target_attendance_mins: 240,
    target_resolution_hours: 12,
    operating_hours: '24_7',
    warning_pct: 50,
    at_risk_pct: 25,
    is_active: true,
  },
  P3_MEDIUM: {
    id: 'p3',
    code: 'P3_MEDIUM',
    label: 'P3 - Medium / Routine Maintenance',
    severity_level: 3,
    target_response_mins: 60,
    target_attendance_mins: 1440,
    target_resolution_hours: 48,
    operating_hours: 'UK_STANDARD_BUSINESS',
    warning_pct: 50,
    at_risk_pct: 25,
    is_active: true,
  },
  P4_LOW: {
    id: 'p4',
    code: 'P4_LOW',
    label: 'P4 - Low / Minor Rectification',
    severity_level: 4,
    target_response_mins: 120,
    target_attendance_mins: 2880,
    target_resolution_hours: 120,
    operating_hours: 'UK_STANDARD_BUSINESS',
    warning_pct: 50,
    at_risk_pct: 25,
    is_active: true,
  },
  P5_SCHEDULED: {
    id: 'p5',
    code: 'P5_SCHEDULED',
    label: 'P5 - Scheduled / Planned Maintenance',
    severity_level: 5,
    target_response_mins: 480,
    target_attendance_mins: 10080,
    target_resolution_hours: 336,
    operating_hours: 'UK_STANDARD_BUSINESS',
    warning_pct: 50,
    at_risk_pct: 25,
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
  trade_id?: string;
  safety_hazard?: boolean;
  triage_notes?: string;
  converted_work_order_id?: string;
  created_at: string;
  organisation?: { name: string };
  site?: { name: string; site_code: string; postcode?: string };
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
  disposition_state: WorkDispositionState;
  hold_reason?: string;
  target_start_at?: string;
  target_completion_at?: string;
  sla_response_due_at?: string;
  sla_attendance_due_at?: string;
  sla_resolution_due_at?: string;
  actual_start_at?: string;
  actual_completion_at?: string;
  closed_at?: string;
  closed_by_id?: string;
  closure_notes?: string;
  lead_engineer_id?: string;
  quote_id?: string;
  billing_status: 'UNBILLED' | 'WIP' | 'READY_TO_INVOICE' | 'INVOICED';
  total_cost_gbp?: number;
  total_revenue_gbp?: number;
  sla_snapshot?: Record<string, any>;
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
  status: AssignmentStatus;
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
  status: VisitStatus;
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
  status: TaskStatus;
  completed_at?: string;
  completion_notes?: string;
  evidence_required?: string;
  created_at: string;
}

export interface SLAPauseRecord {
  id: string;
  work_order_id: string;
  pause_reason: string;
  started_at: string;
  resumed_at?: string;
  total_paused_minutes: number;
  authorized_by_id?: string;
  notes?: string;
}

export interface SLAMilestoneHistory {
  id: string;
  work_order_id: string;
  milestone_type: 'RESPONSE' | 'ACCEPTANCE' | 'ATTENDANCE' | 'MAKE_SAFE' | 'RESOLUTION' | 'COMPLETION_REPORT';
  target_at: string;
  achieved_at?: string;
  is_breached: boolean;
  variance_minutes: number;
  exception_reason?: string;
}

// --------------------------------------------------------------------------
// 1. STATE MACHINE TRANSITION VALIDATORS
// --------------------------------------------------------------------------

const VALID_WORK_ORDER_TRANSITIONS: Record<WorkStatus, WorkStatus[]> = {
  DRAFT: ['OPEN', 'ISSUED', 'CANCELLED'],
  OPEN: ['ISSUED', 'ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'CANCELLED'],
  ISSUED: ['ACCEPTED', 'OPEN', 'SCHEDULED', 'CANCELLED'],
  ACCEPTED: ['SCHEDULED', 'IN_PROGRESS', 'OPEN', 'CANCELLED'],
  SCHEDULED: ['IN_PROGRESS', 'OPEN', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETION_PENDING', 'COMPLETED', 'OPEN', 'CANCELLED'],
  COMPLETION_PENDING: ['COMPLETED', 'IN_PROGRESS', 'CANCELLED'],
  COMPLETED: ['CLOSED'], // Must go to CLOSED via formal close check
  CLOSED: [],           // Terminal state
  CANCELLED: [],        // Terminal state
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
      error: `Invalid transition from '${currentStatus}' to '${targetStatus}'. Allowed transitions: [${allowed.join(', ')}]`,
    };
  }
  return { valid: true };
}

export function validateServiceRequestTransition(
  currentStatus: ServiceRequestStatus,
  targetStatus: ServiceRequestStatus
): { valid: boolean; error?: string } {
  if (currentStatus === targetStatus) return { valid: true };
  const allowedMap: Record<ServiceRequestStatus, ServiceRequestStatus[]> = {
    NEW: ['TRIAGE', 'ACCEPTED', 'REJECTED', 'DUPLICATE', 'CANCELLED'],
    TRIAGE: ['ACCEPTED', 'REJECTED', 'DUPLICATE', 'CANCELLED'],
    ACCEPTED: ['CONVERTED', 'CANCELLED'],
    CONVERTED: ['RESOLVED', 'CANCELLED'],
    RESOLVED: [],
    REJECTED: [],
    DUPLICATE: [],
    CANCELLED: [],
  };
  const allowed = allowedMap[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    return {
      valid: false,
      error: `Invalid Service Request transition: '${currentStatus}' -> '${targetStatus}'`,
    };
  }
  return { valid: true };
}

export function validateAssignmentTransition(
  currentStatus: AssignmentStatus,
  targetStatus: AssignmentStatus
): { valid: boolean; error?: string } {
  if (currentStatus === targetStatus) return { valid: true };
  const allowedMap: Record<AssignmentStatus, AssignmentStatus[]> = {
    DRAFT: ['OFFERED', 'CANCELLED'],
    OFFERED: ['ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED', 'SUPERSEDED'],
    ACCEPTED: ['COMPLETED', 'CANCELLED', 'SUPERSEDED'],
    REJECTED: ['SUPERSEDED'],
    EXPIRED: ['SUPERSEDED'],
    CANCELLED: ['SUPERSEDED'],
    SUPERSEDED: [],
    COMPLETED: [],
  };
  const allowed = allowedMap[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    return {
      valid: false,
      error: `Invalid Assignment transition: '${currentStatus}' -> '${targetStatus}'`,
    };
  }
  return { valid: true };
}

export function validateVisitTransition(
  currentStatus: VisitStatus,
  targetStatus: VisitStatus
): { valid: boolean; error?: string } {
  if (currentStatus === targetStatus) return { valid: true };
  const allowedMap: Record<VisitStatus, VisitStatus[]> = {
    PLANNED: ['CONFIRMED', 'CANCELLED', 'ABORTED'],
    CONFIRMED: ['EN_ROUTE', 'ON_SITE', 'CANCELLED', 'NO_ACCESS', 'ABORTED'],
    EN_ROUTE: ['ON_SITE', 'CANCELLED', 'NO_ACCESS', 'ABORTED'],
    ON_SITE: ['IN_PROGRESS', 'NO_ACCESS', 'ABORTED', 'CANCELLED'],
    IN_PROGRESS: ['COMPLETED', 'NO_ACCESS', 'ABORTED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
    NO_ACCESS: ['PLANNED'], // Rescheduling
    ABORTED: ['PLANNED'],   // Rescheduling
  };
  const allowed = allowedMap[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    return {
      valid: false,
      error: `Invalid Visit transition: '${currentStatus}' -> '${targetStatus}'`,
    };
  }
  return { valid: true };
}

export function validateDefectTransition(
  currentStatus: DefectStatus,
  targetStatus: DefectStatus
): { valid: boolean; error?: string } {
  if (currentStatus === targetStatus) return { valid: true };
  const allowedMap: Record<DefectStatus, DefectStatus[]> = {
    OPEN: ['UNDER_REVIEW', 'ACTION_REQUIRED', 'MONITORING', 'DISMISSED'],
    UNDER_REVIEW: ['ACTION_REQUIRED', 'MONITORING', 'RESOLVED', 'DISMISSED'],
    ACTION_REQUIRED: ['RESOLVED', 'MONITORING', 'SUPERSEDED'],
    MONITORING: ['ACTION_REQUIRED', 'RESOLVED', 'DISMISSED'],
    RESOLVED: [],
    DISMISSED: [],
    SUPERSEDED: [],
  };
  const allowed = allowedMap[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    return {
      valid: false,
      error: `Invalid Defect transition: '${currentStatus}' -> '${targetStatus}'`,
    };
  }
  return { valid: true };
}

// --------------------------------------------------------------------------
// 2. WORK ORDER CLOSURE VALIDATOR
// --------------------------------------------------------------------------

/**
 * Validates that a COMPLETED Work Order satisfies all commercial & operational requirements before becoming CLOSED.
 */
export async function validateWorkOrderClosure(
  workOrderId: string
): Promise<{ canClose: boolean; unresolvedReasons: string[] }> {
  const unresolvedReasons: string[] = [];

  // 1. Verify Work Order is currently in COMPLETED status
  const { data: orders } = await dbQuery<WorkOrder[]>(
    `work_orders?id=eq.${encodeURIComponent(workOrderId)}&select=*`
  );
  if (!orders || orders.length === 0) {
    return { canClose: false, unresolvedReasons: ['Work Order not found'] };
  }
  const wo = orders[0];
  if (wo.status !== 'COMPLETED') {
    unresolvedReasons.push(`Work order must be in 'COMPLETED' state before closing (current: ${wo.status}).`);
  }

  // 2. Check for unresolved critical defects
  const { data: defects } = await dbQuery<any[]>(
    `defects?work_order_id=eq.${encodeURIComponent(workOrderId)}&current_state=eq.OPEN&severity=eq.CRITICAL&select=*`
  );
  if (defects && defects.length > 0) {
    unresolvedReasons.push(`${defects.length} critical defect(s) remain open and must be resolved or separated.`);
  }

  // 3. Check billing readiness
  if (wo.billing_status === 'UNBILLED') {
    unresolvedReasons.push('Billing readiness record is missing or commercial review is pending.');
  }

  return {
    canClose: unresolvedReasons.length === 0,
    unresolvedReasons,
  };
}

// --------------------------------------------------------------------------
// 3. HIERARCHICAL SLA & OPERATING CALENDAR ENGINE
// --------------------------------------------------------------------------

/**
 * Calculates target dates using business hours, weekends, and holiday exclusions.
 */
export function calculateCalendarSla(
  priority: WorkPriority,
  startDate: Date = new Date(),
  customHours?: { is24x7: boolean; startHour: number; endHour: number; holidays: string[] }
): { responseDueAt: Date; attendanceDueAt: Date; resolutionDueAt: Date; snapshot: Record<string, any> } {
  const cfg = CANONICAL_PRIORITIES[priority] || CANONICAL_PRIORITIES.P3_MEDIUM;
  const is24x7 = customHours ? customHours.is24x7 : cfg.operating_hours === '24_7';

  if (is24x7) {
    const responseDueAt = new Date(startDate.getTime() + cfg.target_response_mins * 60 * 1000);
    const attendanceDueAt = new Date(startDate.getTime() + cfg.target_attendance_mins * 60 * 1000);
    const resolutionDueAt = new Date(startDate.getTime() + cfg.target_resolution_hours * 60 * 60 * 1000);

    return {
      responseDueAt,
      attendanceDueAt,
      resolutionDueAt,
      snapshot: {
        priority,
        operating_calendar: '24_7',
        target_response_mins: cfg.target_response_mins,
        target_attendance_mins: cfg.target_attendance_mins,
        target_resolution_hours: cfg.target_resolution_hours,
        calculated_at: new Date().toISOString(),
      },
    };
  }

  // Business Hours calculation (e.g. 08:00 to 17:00 Mon-Fri excluding weekends and bank holidays)
  const startHour = customHours?.startHour ?? 8;
  const endHour = customHours?.endHour ?? 17;
  const businessHoursPerDay = endHour - startHour;
  const holidays = customHours?.holidays ?? [
    '2026-01-01', // New Year
    '2026-04-03', // Good Friday
    '2026-04-06', // Easter Monday
    '2026-05-04', // Early May
    '2026-05-25', // Spring Bank Holiday
    '2026-08-31', // Summer Bank Holiday
    '2026-12-25', // Christmas
    '2026-12-28', // Boxing Day substitute
  ];

  function addBusinessMinutes(start: Date, minutesToAdd: number): Date {
    let current = new Date(start);
    let remainingMinutes = minutesToAdd;

    while (remainingMinutes > 0) {
      const dateStr = current.toISOString().slice(0, 10);
      const day = current.getDay(); // 0 is Sunday, 6 is Saturday
      const isWeekend = day === 0 || day === 6;
      const isHoliday = holidays.includes(dateStr);

      if (isWeekend || isHoliday) {
        // Advance to next day at startHour
        current.setDate(current.getDate() + 1);
        current.setHours(startHour, 0, 0, 0);
        continue;
      }

      const currentHour = current.getHours();
      if (currentHour < startHour) {
        current.setHours(startHour, 0, 0, 0);
      } else if (currentHour >= endHour) {
        current.setDate(current.getDate() + 1);
        current.setHours(startHour, 0, 0, 0);
        continue;
      }

      const endOfDay = new Date(current);
      endOfDay.setHours(endHour, 0, 0, 0);
      const minutesAvailableToday = Math.max(0, Math.floor((endOfDay.getTime() - current.getTime()) / 60000));

      if (remainingMinutes <= minutesAvailableToday) {
        current = new Date(current.getTime() + remainingMinutes * 60000);
        remainingMinutes = 0;
      } else {
        remainingMinutes -= minutesAvailableToday;
        current.setDate(current.getDate() + 1);
        current.setHours(startHour, 0, 0, 0);
      }
    }

    return current;
  }

  const responseDueAt = addBusinessMinutes(startDate, cfg.target_response_mins);
  const attendanceDueAt = addBusinessMinutes(startDate, cfg.target_attendance_mins);
  const resolutionDueAt = addBusinessMinutes(startDate, Math.round(cfg.target_resolution_hours * 60));

  return {
    responseDueAt,
    attendanceDueAt,
    resolutionDueAt,
    snapshot: {
      priority,
      operating_calendar: 'UK_STANDARD_BUSINESS',
      target_response_mins: cfg.target_response_mins,
      target_attendance_mins: cfg.target_attendance_mins,
      target_resolution_hours: cfg.target_resolution_hours,
      business_start_hour: startHour,
      business_end_hour: endHour,
      calculated_at: new Date().toISOString(),
    },
  };
}

export const calculateSlaTargets = calculateCalendarSla;

/**
 * SLA Status Computation with proportional percentage thresholds
 */
export function computeSlaStatus(
  resolutionDueAt: Date | string | undefined,
  isCompleted = false,
  totalTargetMinutes = 2880, // Default 48h
  warningPct = 50,
  atRiskPct = 25
): { status: 'ON_TRACK' | 'WARNING' | 'AT_RISK' | 'BREACHED' | 'COMPLETED'; remainingMinutes: number; percentRemaining: number } {
  if (isCompleted) {
    return { status: 'COMPLETED', remainingMinutes: 0, percentRemaining: 100 };
  }
  if (!resolutionDueAt) {
    return { status: 'ON_TRACK', remainingMinutes: 99999, percentRemaining: 100 };
  }

  const targetTime = new Date(resolutionDueAt).getTime();
  const now = Date.now();
  const remainingMinutes = Math.round((targetTime - now) / (1000 * 60));
  const percentRemaining = Math.max(0, Math.round((remainingMinutes / totalTargetMinutes) * 100));

  if (remainingMinutes <= 0) {
    return { status: 'BREACHED', remainingMinutes, percentRemaining: 0 };
  }
  if (percentRemaining <= atRiskPct || remainingMinutes <= 60) {
    return { status: 'AT_RISK', remainingMinutes, percentRemaining };
  }
  if (percentRemaining <= warningPct || remainingMinutes <= 180) {
    return { status: 'WARNING', remainingMinutes, percentRemaining };
  }
  return { status: 'ON_TRACK', remainingMinutes, percentRemaining };
}

// --------------------------------------------------------------------------
// 4. POLICY-DRIVEN EVIDENCE GATES & OVERRIDES
// --------------------------------------------------------------------------

export interface CompletionPolicyRule {
  requireBeforePhoto?: boolean;
  requireAfterPhoto?: boolean;
  requireEngineerNotes?: boolean;
  requireClientSignature?: boolean;
  requireCertUpload?: boolean;
  isSafetyCritical?: boolean;
}

export async function validateEvidenceGate(
  workOrderId: string,
  managerOverride = false,
  overrideReason?: string,
  overridingPersonId?: string
): Promise<{ allowed: boolean; blockingReasons: string[]; overrideApplied?: boolean }> {
  const blockingReasons: string[] = [];

  // 1. Check incomplete tasks
  const { data: tasks } = await dbQuery<Task[]>(
    `tasks?work_order_id=eq.${encodeURIComponent(workOrderId)}&select=*`
  );
  const pendingMandatoryTasks = (tasks || []).filter(
    (t) => t.is_mandatory && t.status !== 'COMPLETED' && t.status !== 'NOT_APPLICABLE'
  );
  if (pendingMandatoryTasks.length > 0) {
    blockingReasons.push(`${pendingMandatoryTasks.length} mandatory task(s) are incomplete.`);
  }

  // 2. Check submitted evidence
  const { data: evidences } = await dbQuery<any[]>(
    `completion_evidences?work_order_id=eq.${encodeURIComponent(workOrderId)}&select=*`
  );
  const rejectedEvidence = (evidences || []).filter((e) => e.validation_state === 'REJECTED');
  if (rejectedEvidence.length > 0) {
    blockingReasons.push(`${rejectedEvidence.length} submitted evidence item(s) were rejected.`);
  }

  // If there are blocking reasons and override is requested
  if (blockingReasons.length > 0) {
    if (managerOverride && overridingPersonId && overrideReason) {
      // Record audited override
      await dbQuery('completion_overrides', {
        method: 'POST',
        body: {
          work_order_id: workOrderId,
          violated_rule: blockingReasons.join('; '),
          reason: overrideReason,
          overridden_by_id: overridingPersonId,
        },
      });

      await recordAuditEvent({
        event_type: 'COMPLETION_GATE_OVERRIDDEN',
        object_type: 'WORK_ORDER',
        object_id: workOrderId,
        actor_id: overridingPersonId,
        reason: overrideReason,
      });

      return { allowed: true, blockingReasons: [], overrideApplied: true };
    }
    return { allowed: false, blockingReasons };
  }

  return { allowed: true, blockingReasons: [] };
}

// --------------------------------------------------------------------------
// 5. QUERY HELPERS
// --------------------------------------------------------------------------

export function generateReferenceNumber(prefix: string, sequenceNum: number): string {
  const year = new Date().getFullYear();
  const numStr = sequenceNum.toString().padStart(6, '0');
  return `EFM-${prefix}-${year}-${numStr}`;
}

export async function listServiceRequests(filters?: {
  status?: ServiceRequestStatus;
  priority?: WorkPriority;
  siteId?: string;
  limit?: number;
}): Promise<ServiceRequest[]> {
  let endpoint =
    'service_requests?select=*,organisation:organisations(name),site:sites(name,site_code,postcode),asset:assets(name,asset_reference)&order=created_at.desc';
  if (filters?.status) endpoint += `&status=eq.${encodeURIComponent(filters.status)}`;
  if (filters?.priority) endpoint += `&priority=eq.${encodeURIComponent(filters.priority)}`;
  if (filters?.siteId) endpoint += `&site_id=eq.${encodeURIComponent(filters.siteId)}`;
  if (filters?.limit) endpoint += `&limit=${filters.limit}`;
  const { data } = await dbQuery<ServiceRequest[]>(endpoint);
  return data || [];
}

export async function listWorkOrders(filters?: {
  status?: WorkStatus;
  priority?: WorkPriority;
  siteId?: string;
  quoteId?: string;
  leadEngineerId?: string;
  clientAccountId?: string;
  disposition?: WorkDispositionState;
  limit?: number;
}): Promise<WorkOrder[]> {
  let endpoint =
    'work_orders?select=*,organisation:organisations(name),site:sites(name,site_code,postcode),asset:assets(name,asset_reference),provider_organisation:organisations(name,code)&order=created_at.desc';
  if (filters?.status) endpoint += `&status=eq.${encodeURIComponent(filters.status)}`;
  if (filters?.priority) endpoint += `&priority=eq.${encodeURIComponent(filters.priority)}`;
  if (filters?.siteId) endpoint += `&site_id=eq.${encodeURIComponent(filters.siteId)}`;
  if (filters?.quoteId) endpoint += `&quote_id=eq.${encodeURIComponent(filters.quoteId)}`;
  if (filters?.leadEngineerId) endpoint += `&lead_engineer_id=eq.${encodeURIComponent(filters.leadEngineerId)}`;
  if (filters?.disposition) endpoint += `&disposition_state=eq.${encodeURIComponent(filters.disposition)}`;

  if (filters?.clientAccountId) {
    const { data: clientSites } = await dbQuery<any[]>(
      `sites?client_account_id=eq.${encodeURIComponent(filters.clientAccountId)}&select=id`
    );
    const siteIds = (clientSites || []).map((s) => s.id);
    if (siteIds.length === 0) return [];
    endpoint += `&site_id=in.(${siteIds.join(',')})`;
  }

  if (filters?.limit) endpoint += `&limit=${filters.limit}`;
  const { data } = await dbQuery<WorkOrder[]>(endpoint);
  return data || [];
}

export async function listAssignments(workOrderId: string): Promise<WorkAssignment[]> {
  const { data } = await dbQuery<WorkAssignment[]>(
    `work_assignments?work_order_id=eq.${encodeURIComponent(workOrderId)}&select=*,provider_organisation:organisations(name,code)&order=assigned_at.desc`
  );
  return data || [];
}

export async function listVisits(workOrderId?: string): Promise<Visit[]> {
  let endpoint = 'visits?select=*,assigned_resource:persons(first_name,last_name)&order=scheduled_start_at.asc';
  if (workOrderId) endpoint += `&work_order_id=eq.${encodeURIComponent(workOrderId)}`;
  const { data } = await dbQuery<Visit[]>(endpoint);
  return data || [];
}

export async function listTasks(workOrderId: string): Promise<Task[]> {
  const { data } = await dbQuery<Task[]>(
    `tasks?work_order_id=eq.${encodeURIComponent(workOrderId)}&select=*&order=sequence_order.asc`
  );
  return data || [];
}

export async function listActiveSLARisks(): Promise<WorkOrder[]> {
  const { data } = await dbQuery<WorkOrder[]>(
    `work_orders?status=not.in.(COMPLETED,CLOSED,CANCELLED)&sla_resolution_due_at=not.is.null&select=*,organisation:organisations(name),site:sites(name,site_code)&order=sla_resolution_due_at.asc&limit=20`
  );
  return data || [];
}

/**
 * Generate canonical Service Request reference: EFM-SR-YYYY-NNNNNN
 */
export function generateServiceRequestReference(): string {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 900000) + 100000);
  return `EFM-SR-${year}-${rand}`;
}

/**
 * Generate canonical Work Order reference: EFM-WO-YYYY-NNNNNN
 */
export function generateWorkOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 900000) + 100000);
  return `EFM-WO-${year}-${rand}`;
}

export async function createServiceRequest(params: {
  site_id: string;
  title: string;
  description: string;
  category?: string;
  priority?: WorkPriority;
  source?: 'MANUAL' | 'PHONE' | 'EMAIL' | 'PORTAL' | 'AI_HELPDESK';
  organisation_id?: string;
  client_account_id?: string;
  building_id?: string;
  space_id?: string;
  asset_id?: string;
  requester_name?: string;
  requester_email?: string;
  trade_id?: string;
}): Promise<ServiceRequest> {
  let orgId = params.organisation_id;
  if (!orgId) {
    const { data: siteData } = await dbQuery<any[]>(`sites?id=eq.${encodeURIComponent(params.site_id)}&select=organisation_id`);
    orgId = siteData?.[0]?.organisation_id;
  }
  if (!orgId) {
    const { data: orgs } = await dbQuery<any[]>('organisations?limit=1');
    orgId = orgs?.[0]?.id;
  }

  const ref = generateServiceRequestReference();

  const { data, error } = await dbQuery<ServiceRequest[]>('service_requests', {
    method: 'POST',
    body: {
      organisation_id: orgId,
      reference: ref,
      site_id: params.site_id,
      client_account_id: params.client_account_id || null,
      building_id: params.building_id || null,
      space_id: params.space_id || null,
      asset_id: params.asset_id || null,
      title: params.title,
      description: params.description,
      category: params.category || 'GENERAL_MAINTENANCE',
      priority: params.priority || 'P3_MEDIUM',
      status: 'NEW',
      source: params.source || 'MANUAL',
      requester_name: params.requester_name || null,
      requester_email: params.requester_email || null,
      trade_id: params.trade_id || null,
    },
  });

  if (error || !data?.[0]) {
    throw new Error(`Failed to create service request: ${error || 'Unknown error'}`);
  }

  return data[0];
}

export async function createWorkOrder(params: {
  site_id: string;
  title: string;
  description: string;
  work_type?: 'REACTIVE' | 'PPM' | 'STATUTORY' | 'QUOTED' | 'PROJECT';
  priority?: WorkPriority;
  service_request_id?: string;
  quote_id?: string;
  organisation_id?: string;
  building_id?: string;
  space_id?: string;
  asset_id?: string;
  contract_id?: string;
  trade_id?: string;
  provider_organisation_id?: string;
  target_start_at?: string;
  target_completion_at?: string;
  total_revenue_gbp?: number;
  total_cost_gbp?: number;
}): Promise<WorkOrder> {
  let orgId = params.organisation_id;
  if (!orgId) {
    const { data: siteData } = await dbQuery<any[]>(`sites?id=eq.${encodeURIComponent(params.site_id)}&select=organisation_id`);
    orgId = siteData?.[0]?.organisation_id;
  }
  if (!orgId) {
    const { data: orgs } = await dbQuery<any[]>('organisations?limit=1');
    orgId = orgs?.[0]?.id;
  }

  const priority = params.priority || 'P3_MEDIUM';
  const priorityDef = CANONICAL_PRIORITIES[priority];
  const now = new Date();
  const slaResponseDue = new Date(now.getTime() + priorityDef.target_response_mins * 60000).toISOString();
  const slaAttendanceDue = new Date(now.getTime() + priorityDef.target_attendance_mins * 60000).toISOString();
  const slaResolutionDue = new Date(now.getTime() + priorityDef.target_resolution_hours * 3600000).toISOString();

  const woNumber = generateWorkOrderNumber();

  const { data, error } = await dbQuery<WorkOrder[]>('work_orders', {
    method: 'POST',
    body: {
      organisation_id: orgId,
      work_order_number: woNumber,
      service_request_id: params.service_request_id || null,
      quote_id: params.quote_id || null,
      site_id: params.site_id,
      building_id: params.building_id || null,
      space_id: params.space_id || null,
      asset_id: params.asset_id || null,
      contract_id: params.contract_id || null,
      trade_id: params.trade_id || null,
      provider_organisation_id: params.provider_organisation_id || null,
      title: params.title,
      description: params.description,
      work_type: params.work_type || 'REACTIVE',
      priority,
      status: 'OPEN',
      disposition_state: params.provider_organisation_id ? 'AWAITING_CONTRACTOR' : 'NONE',
      target_start_at: params.target_start_at || now.toISOString(),
      target_completion_at: params.target_completion_at || slaResolutionDue,
      sla_response_due_at: slaResponseDue,
      sla_attendance_due_at: slaAttendanceDue,
      sla_resolution_due_at: slaResolutionDue,
      billing_status: 'UNBILLED',
      total_revenue_gbp: params.total_revenue_gbp || null,
      total_cost_gbp: params.total_cost_gbp || null,
    },
  });

  if (error || !data?.[0]) {
    throw new Error(`Failed to create work order: ${error || 'Unknown error'}`);
  }

  // If created from a service request, mark request as CONVERTED
  if (params.service_request_id) {
    await dbQuery(`service_requests?id=eq.${encodeURIComponent(params.service_request_id)}`, {
      method: 'PATCH',
      body: {
        status: 'CONVERTED',
        converted_work_order_id: data[0].id,
      },
    });
  }

  return data[0];
}

export async function getWorkOrder(id: string): Promise<WorkOrder | null> {
  const { data } = await dbQuery<WorkOrder[]>(
    `work_orders?id=eq.${encodeURIComponent(id)}&select=*,organisation:organisations(name),site:sites(name,site_code,postcode,address_line1),asset:assets(name,asset_reference),provider_organisation:organisations(name,code),lead_engineer:persons(first_name,last_name,email)&limit=1`
  );
  return data?.[0] || null;
}

export async function createWorkAssignment(params: {
  work_order_id: string;
  provider_org_id: string;
  provider_resource_id?: string;
  source?: 'MANUAL' | 'AI_DISPATCH' | 'AUTO_ESCALATION';
}): Promise<WorkAssignment> {
  const { data, error } = await dbQuery<WorkAssignment[]>('work_assignments', {
    method: 'POST',
    body: {
      work_order_id: params.work_order_id,
      provider_org_id: params.provider_org_id,
      provider_resource_id: params.provider_resource_id || null,
      status: 'ACCEPTED',
      source: params.source || 'MANUAL',
      assigned_at: new Date().toISOString(),
      accepted_at: new Date().toISOString(),
    },
  });

  if (error || !data?.[0]) {
    throw new Error(`Failed to create work assignment: ${error || 'Unknown error'}`);
  }

  // Update work order status and provider
  await dbQuery(`work_orders?id=eq.${encodeURIComponent(params.work_order_id)}`, {
    method: 'PATCH',
    body: {
      status: 'ISSUED',
      provider_organisation_id: params.provider_org_id,
      disposition_state: 'NONE',
    },
  });

  return data[0];
}

export async function createVisit(params: {
  work_order_id: string;
  assigned_resource_id?: string;
  scheduled_start_at?: string;
  scheduled_end_at?: string;
}): Promise<Visit> {
  const now = new Date();
  const scheduledStart = params.scheduled_start_at || now.toISOString();
  const scheduledEnd = params.scheduled_end_at || new Date(now.getTime() + 7200000).toISOString();

  const { data, error } = await dbQuery<Visit[]>('visits', {
    method: 'POST',
    body: {
      work_order_id: params.work_order_id,
      assigned_resource_id: params.assigned_resource_id || null,
      status: 'CONFIRMED',
      scheduled_start_at: scheduledStart,
      scheduled_end_at: scheduledEnd,
    },
  });

  if (error || !data?.[0]) {
    throw new Error(`Failed to create visit: ${error || 'Unknown error'}`);
  }

  return data[0];
}

export async function updateVisitStatus(params: {
  visit_id: string;
  status: VisitStatus;
  notes?: string;
}): Promise<Visit> {
  const body: Record<string, any> = { status: params.status };
  const now = new Date().toISOString();

  if (params.status === 'EN_ROUTE') body.journey_started_at = now;
  if (params.status === 'ON_SITE' || params.status === 'IN_PROGRESS') {
    body.arrived_at = now;
    body.work_started_at = now;
  }
  if (params.status === 'COMPLETED') body.completed_at = now;

  const { data, error } = await dbQuery<Visit[]>(`visits?id=eq.${encodeURIComponent(params.visit_id)}`, {
    method: 'PATCH',
    body,
  });

  if (error || !data?.[0]) {
    throw new Error(`Failed to update visit status: ${error || 'Unknown error'}`);
  }

  return data[0];
}

export async function createDefect(params: {
  asset_id?: string;
  work_order_id?: string;
  title: string;
  description: string;
  severity?: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'ADVISORY';
  remedial_action_required?: string;
  estimated_cost_gbp?: number;
}): Promise<any> {
  const { data, error } = await dbQuery<any[]>('defects', {
    method: 'POST',
    body: {
      asset_id: params.asset_id || null,
      work_order_id: params.work_order_id || null,
      title: params.title,
      description: params.description,
      severity: params.severity || 'MAJOR',
      status: 'OPEN',
      remedial_action_required: params.remedial_action_required || null,
      estimated_cost_gbp: params.estimated_cost_gbp || null,
    },
  });

  if (error || !data?.[0]) {
    throw new Error(`Failed to create defect: ${error || 'Unknown error'}`);
  }

  return data[0];
}

export async function completeWorkOrder(params: {
  work_order_id: string;
  completion_notes?: string;
  actual_cost_gbp?: number;
  actual_revenue_gbp?: number;
}): Promise<WorkOrder> {
  const now = new Date().toISOString();
  const { data, error } = await dbQuery<WorkOrder[]>(`work_orders?id=eq.${encodeURIComponent(params.work_order_id)}`, {
    method: 'PATCH',
    body: {
      status: 'COMPLETED',
      disposition_state: 'NONE',
      actual_completion_at: now,
      closure_notes: params.completion_notes || 'Work completed in accordance with service specification.',
      total_cost_gbp: params.actual_cost_gbp || null,
      total_revenue_gbp: params.actual_revenue_gbp || null,
      billing_status: 'READY_TO_INVOICE',
    },
  });

  if (error || !data?.[0]) {
    throw new Error(`Failed to complete work order: ${error || 'Unknown error'}`);
  }

  return data[0];
}

/**
 * Assigns an internal EntireFM engineer to a work order.
 * Validates engineer identity against canonical persons + organisation_memberships,
 * updates lead_engineer_id, schedules a visit, and records audit trail.
 */
export async function assignWorkOrderInternalEngineer(params: {
  work_order_id: string;
  engineer_person_id: string;
  scheduled_start_at?: string;
  scheduled_end_at?: string;
  session?: UserSession;
}): Promise<{ workOrder: WorkOrder; visit: Visit }> {
  // 1. Validate engineer is an active EntireFM team member with eligible role
  const engineer = await validateInternalEngineer(params.engineer_person_id);
  if (!engineer) {
    throw new Error(
      'Invalid or ineligible internal engineer. Must be an active EntireFM internal team member.'
    );
  }

  // 2. Update work order with lead_engineer_id and status SCHEDULED
  const { data: woData, error: woError } = await dbQuery<WorkOrder[]>(
    `work_orders?id=eq.${encodeURIComponent(params.work_order_id)}`,
    {
      method: 'PATCH',
      body: {
        lead_engineer_id: params.engineer_person_id,
        status: 'SCHEDULED',
        disposition_state: 'NONE',
      },
    }
  );

  if (woError || !woData?.[0]) {
    throw new Error(`Failed to assign engineer to work order: ${woError || 'Database error'}`);
  }

  // 3. Create or update visit for this work order and engineer
  const now = new Date();
  const scheduledStart = params.scheduled_start_at || now.toISOString();
  const scheduledEnd =
    params.scheduled_end_at || new Date(now.getTime() + 7200000).toISOString();

  const { data: existingVisits } = await dbQuery<Visit[]>(
    `visits?work_order_id=eq.${encodeURIComponent(params.work_order_id)}&order=created_at.desc&limit=1`
  );

  let visit: Visit;
  if (existingVisits && existingVisits.length > 0) {
    const { data: updatedVisit, error: vErr } = await dbQuery<Visit[]>(
      `visits?id=eq.${encodeURIComponent(existingVisits[0].id)}`,
      {
        method: 'PATCH',
        body: {
          assigned_resource_id: params.engineer_person_id,
          status: 'CONFIRMED',
          scheduled_start_at: scheduledStart,
          scheduled_end_at: scheduledEnd,
        },
      }
    );
    if (vErr || !updatedVisit?.[0]) {
      throw new Error(`Failed to update visit: ${vErr || 'Database error'}`);
    }
    visit = updatedVisit[0];
  } else {
    visit = await createVisit({
      work_order_id: params.work_order_id,
      assigned_resource_id: params.engineer_person_id,
      scheduled_start_at: scheduledStart,
      scheduled_end_at: scheduledEnd,
    });
  }

  // 4. Record audit event
  await recordAuditEvent({
    event_type: 'WORK_ORDER_ASSIGNED_INTERNAL_ENGINEER',
    object_type: 'work_order',
    object_id: params.work_order_id,
    actor_id: params.session?.personId,
    actor_type: params.session ? 'HUMAN' : 'SYSTEM',
    after_state: {
      lead_engineer_id: params.engineer_person_id,
      engineer_name: `${engineer.first_name} ${engineer.last_name}`,
      visit_id: visit.id,
    },
    reason: `Assigned internal engineer ${engineer.first_name} ${engineer.last_name}`,
    source: 'OPERATIONS',
  });

  return { workOrder: woData[0], visit };
}

/**
 * Assigns an external contractor organisation to a work order.
 * Creates canonical work_assignment and logs audit trail.
 */
export async function assignWorkOrderContractor(params: {
  work_order_id: string;
  contractor_org_id: string;
  session?: UserSession;
}): Promise<WorkAssignment> {
  const assignment = await createWorkAssignment({
    work_order_id: params.work_order_id,
    provider_org_id: params.contractor_org_id,
    source: 'MANUAL',
  });

  await recordAuditEvent({
    event_type: 'WORK_ORDER_ASSIGNED_CONTRACTOR',
    object_type: 'work_order',
    object_id: params.work_order_id,
    actor_id: params.session?.personId,
    actor_type: params.session ? 'HUMAN' : 'SYSTEM',
    after_state: {
      provider_org_id: params.contractor_org_id,
      assignment_id: assignment.id,
    },
    reason: `Assigned external contractor organisation ${params.contractor_org_id}`,
    source: 'OPERATIONS',
  });

  return assignment;
}

export * from './engineers';
export * from './sla-resolver';

