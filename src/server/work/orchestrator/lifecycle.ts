/**
 * ENTIREFM JOB LIFECYCLE ORCHESTRATOR ENGINE (Phase 0M Addendum)
 * ===============================================================
 * Central state machine deriving operational truth, client-safe projections,
 * continuous SLA status, completion validation, and billing readiness handoff.
 *
 * Rules:
 *   - NEVER MISLEAD THE CLIENT: Projections strictly follow authenticated operational truth
 *   - COMPLETED ≠ BILLABLE: Finance prerequisites must be satisfied independently
 *   - Continuous SLA calculation throughout job lifetime
 */

import {
  ActionOwner,
  ClientStatusProjection,
  JobLifecycleStage,
  JobOrchestrationSnapshot,
  SLAState,
} from './types';
import { evaluateCompletionReadiness } from './completion';
import { evaluateBillingReadiness } from './billing';
import { evaluateJobChase } from './chasing';

export interface RawWorkOrderState {
  id: string;
  work_order_number: string;
  title: string;
  priority: string;
  trade: string;
  status: string; // OPEN, ISSUED, IN_PROGRESS, COMPLETED, CLOSED, CANCELLED
  billing_status?: string;
  site_id?: string;
  site_name?: string;
  client_id?: string;
  client_name?: string;
  provider_organisation_id?: string;
  provider_organisation_name?: string;
  assigned_engineer_id?: string;
  assigned_engineer_name?: string;
  sla_response_due_at?: string;
  sla_attendance_due_at?: string;
  sla_resolution_due_at?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  total_revenue_gbp?: number;
  total_cost_gbp?: number;
}

export interface RawLifecycleArtifacts {
  assignment?: {
    id: string;
    status: string; // OFFERED, ACCEPTED, REJECTED, EXPIRED
    assigned_at: string;
    responded_at?: string;
    chase_count?: number;
    last_chase_at?: string;
  };
  visit?: {
    id: string;
    status: string; // SCHEDULED, EN_ROUTE, ON_SITE, IN_PROGRESS, COMPLETED, NO_ACCESS
    journey_started_at?: string;
    arrived_at?: string;
    completed_at?: string;
    has_no_access?: boolean;
    requires_return_visit?: boolean;
    awaiting_parts?: boolean;
  };
  evidence?: {
    has_before_photo?: boolean;
    has_after_photo?: boolean;
    has_required_readings?: boolean;
    missing_items?: string[];
  };
  serviceReport?: {
    id?: string;
    has_summary?: boolean;
    status?: string;
  };
  quotes?: Array<{
    id: string;
    status: string; // DRAFT, ISSUED, PENDING_APPROVAL, APPROVED, REJECTED
    total_price_gbp?: number;
    created_at?: string;
  }>;
  purchaseOrder?: {
    id: string;
    po_number: string;
    status: string;
    total_amount_gbp?: number;
  };
  supplierInvoice?: {
    id: string;
    invoice_number: string;
    status: string;
    net_amount_gbp?: number;
    is_matched?: boolean;
    has_variance?: boolean;
  };
}

// ─── DERIVE LIFECYCLE STAGE & ACTION OWNER ───────────────────────────────────

export function deriveLifecycleStage(
  wo: RawWorkOrderState,
  artifacts: RawLifecycleArtifacts
): {
  stage: JobLifecycleStage;
  clientStatus: ClientStatusProjection;
  actionOwner: ActionOwner;
  nextRequiredAction: string;
  actionDueAt: string;
} {
  const visit = artifacts.visit;
  const assignment = artifacts.assignment;
  const quotes = artifacts.quotes || [];

  // 1. Cancelled
  if (wo.status === 'CANCELLED') {
    return {
      stage: 'CANCELLED',
      clientStatus: 'CLOSED',
      actionOwner: 'HELPDESK',
      nextRequiredAction: 'Job cancelled — zero further action required',
      actionDueAt: wo.updated_at,
    };
  }

  // 2. Completed / Billed
  if (wo.billing_status === 'BILLED') {
    return {
      stage: 'BILLED',
      clientStatus: 'CLOSED',
      actionOwner: 'FINANCE',
      nextRequiredAction: 'Client invoice issued and archived in accounting records',
      actionDueAt: wo.updated_at,
    };
  }

  // 3. Operational Work Complete
  if (
    (wo.status === 'COMPLETED' || wo.status === 'CLOSED' || visit?.status === 'COMPLETED') &&
    !visit?.requires_return_visit
  ) {
    return {
      stage: 'COMPLETED',
      clientStatus: 'COMPLETED',
      actionOwner: 'FINANCE',
      nextRequiredAction: 'Perform final completion evidence validation and finance billing handoff',
      actionDueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    };
  }

  // 4. Return Visit Required (checked AFTER completion — return visit flag prevents premature closure)
  if (visit?.requires_return_visit) {
    return {
      stage: 'RETURN_VISIT_REQUIRED',
      clientStatus: 'RETURN_VISIT_REQUIRED',
      actionOwner: 'CONTRACTOR',
      nextRequiredAction: 'Schedule secondary specialist attendance on site',
      actionDueAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    };
  }

  // 5. Awaiting Client Quote Approval
  const pendingQuote = quotes.find(
    (q) => q.status === 'DRAFT' || q.status === 'ISSUED' || q.status === 'PENDING_APPROVAL'
  );
  if (pendingQuote) {
    return {
      stage: 'AWAITING_CLIENT_APPROVAL',
      clientStatus: 'AWAITING_YOUR_APPROVAL',
      actionOwner: 'CLIENT',
      nextRequiredAction: 'Review and approve remedial quotation in Client Portal',
      actionDueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    };
  }

  // 6. Awaiting Parts
  if (visit?.awaiting_parts) {
    return {
      stage: 'AWAITING_PARTS',
      clientStatus: 'AWAITING_PARTS',
      actionOwner: 'CONTRACTOR',
      nextRequiredAction: 'Confirm parts delivery ETA and schedule return attendance',
      actionDueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    };
  }

  // 7. Engineer on Site
  if (visit?.status === 'ON_SITE' || visit?.status === 'IN_PROGRESS') {
    return {
      stage: 'ON_SITE',
      clientStatus: 'ENGINEER_ON_SITE',
      actionOwner: 'ENGINEER',
      nextRequiredAction: 'Complete on-site engineering tasks and capture mandatory evidence',
      actionDueAt: wo.sla_resolution_due_at || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    };
  }

  // 8. Engineer En Route
  if (visit?.status === 'EN_ROUTE') {
    return {
      stage: 'EN_ROUTE',
      clientStatus: 'ENGINEER_EN_ROUTE',
      actionOwner: 'ENGINEER',
      nextRequiredAction: 'Arrive at client site and record arrival timestamp in mobile app',
      actionDueAt: wo.sla_attendance_due_at || new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    };
  }

  // 9. Assignment Acknowledged / Accepted
  if (assignment?.status === 'ACCEPTED' || wo.status === 'IN_PROGRESS') {
    return {
      stage: 'ACKNOWLEDGED',
      clientStatus: wo.assigned_engineer_name ? 'ENGINEER_ASSIGNED' : 'CONTRACTOR_ASSIGNED',
      actionOwner: 'CONTRACTOR',
      nextRequiredAction: 'Allocate field operative and confirm attendance window',
      actionDueAt: wo.sla_attendance_due_at || new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    };
  }

  // 10. Assigned (Awaiting Acknowledgement)
  if (wo.provider_organisation_id || assignment?.status === 'OFFERED') {
    return {
      stage: 'ASSIGNED',
      clientStatus: 'ATTENDANCE_BEING_ARRANGED',
      actionOwner: 'CONTRACTOR',
      nextRequiredAction: 'Acknowledge work order and accept attendance obligation',
      actionDueAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
  }

  // 11. Initial Intake / Triaged
  return {
    stage: 'TRIAGED',
    clientStatus: 'BEING_REVIEWED',
    actionOwner: 'HELPDESK',
    nextRequiredAction: 'Select eligible contractor partner or assign internal engineer',
    actionDueAt: wo.sla_response_due_at || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };
}

// ─── CONTINUOUS SLA EVALUATION ────────────────────────────────────────────────

export function evaluateContinuousSLA(
  resolutionDueAtIso?: string,
  currentTimeMs: number = Date.now()
): { sla_state: SLAState; minutes_remaining: number } {
  if (!resolutionDueAtIso) {
    return { sla_state: 'ON_TRACK', minutes_remaining: 1440 };
  }

  const dueMs = new Date(resolutionDueAtIso).getTime();
  const diffMins = Math.round((dueMs - currentTimeMs) / 60000);

  if (diffMins < 0) {
    return { sla_state: 'BREACHED', minutes_remaining: diffMins };
  }

  // At risk if less than 2 hours remaining (or less than 25% of window)
  if (diffMins <= 120) {
    return { sla_state: 'AT_RISK', minutes_remaining: diffMins };
  }

  return { sla_state: 'ON_TRACK', minutes_remaining: diffMins };
}

// ─── FULL JOB ORCHESTRATION SNAPSHOT ──────────────────────────────────────────

export function deriveJobOrchestrationSnapshot(
  wo: RawWorkOrderState,
  artifacts: RawLifecycleArtifacts,
  currentTimeMs: number = Date.now()
): JobOrchestrationSnapshot {
  const lifecycle = deriveLifecycleStage(wo, artifacts);
  const sla = evaluateContinuousSLA(wo.sla_resolution_due_at, currentTimeMs);

  const completionGate = evaluateCompletionReadiness({
    workOrder: {
      id: wo.id,
      status: wo.status,
      work_type: 'REACTIVE',
      priority: wo.priority,
    },
    visit: artifacts.visit,
    evidence: artifacts.evidence,
    serviceReport: artifacts.serviceReport,
    quotes: artifacts.quotes,
  });

  const billingReadiness = evaluateBillingReadiness({
    workOrder: {
      id: wo.id,
      work_order_number: wo.work_order_number,
      client_id: wo.client_id,
      site_id: wo.site_id,
      status: wo.status,
      work_type: 'REACTIVE',
      total_revenue_gbp: wo.total_revenue_gbp,
      total_cost_gbp: wo.total_cost_gbp,
      billing_status: wo.billing_status,
      completed_at: wo.completed_at,
    },
    completionGate,
    purchaseOrder: artifacts.purchaseOrder,
    supplierInvoice: artifacts.supplierInvoice,
  });

  const chaseDecision = evaluateJobChase(
    {
      work_order_id: wo.id,
      work_order_number: wo.work_order_number,
      priority: wo.priority,
      stage: lifecycle.stage,
      assigned_at: artifacts.assignment?.assigned_at,
      accepted_at: artifacts.assignment?.responded_at,
      arrived_at: artifacts.visit?.arrived_at,
      quote_issued_at: artifacts.quotes?.[0]?.created_at,
      completed_at: wo.completed_at,
      current_chase_count: artifacts.assignment?.chase_count || 0,
      last_chase_at: artifacts.assignment?.last_chase_at,
    },
    currentTimeMs
  );

  return {
    work_order_id: wo.id,
    work_order_number: wo.work_order_number,
    title: wo.title,
    priority: wo.priority,
    trade: wo.trade,
    site_id: wo.site_id,
    site_name: wo.site_name,
    client_id: wo.client_id,
    client_name: wo.client_name,
    assigned_provider_id: wo.provider_organisation_id,
    assigned_provider_name: wo.provider_organisation_name,
    assigned_engineer_id: wo.assigned_engineer_id,
    assigned_engineer_name: wo.assigned_engineer_name,
    current_stage: lifecycle.stage,
    client_status: lifecycle.clientStatus,
    next_required_action: lifecycle.nextRequiredAction,
    action_owner: lifecycle.actionOwner,
    action_due_at: lifecycle.actionDueAt,
    sla_state: sla.sla_state,
    sla_resolution_due_at: wo.sla_resolution_due_at || new Date().toISOString(),
    sla_minutes_remaining: sla.minutes_remaining,
    chase_state: {
      is_chase_due: chaseDecision.is_chase_due,
      chase_type: chaseDecision.chase_type,
      attempt_count: chaseDecision.attempt_number,
      last_chase_at: artifacts.assignment?.last_chase_at,
    },
    evidence_state: completionGate.mandatory_evidence_passed
      ? 'VERIFIED'
      : artifacts.evidence?.missing_items?.length
      ? 'PARTIAL'
      : 'NOT_SUBMITTED',
    completion_gate: completionGate,
    billing_readiness: billingReadiness,
    timeline: [
      {
        timestamp: wo.created_at,
        source: 'CLIENT',
        visibility: 'CLIENT_VISIBLE',
        title: 'Issue Reported & Work Order Created',
        detail: wo.title,
      },
      ...(wo.provider_organisation_name
        ? [
            {
              timestamp: artifacts.assignment?.assigned_at || wo.created_at,
              source: 'HELPDESK' as const,
              visibility: 'CLIENT_VISIBLE' as const,
              title: `Assigned to Approved Partner ${wo.provider_organisation_name}`,
            },
          ]
        : []),
      ...(artifacts.visit?.arrived_at
        ? [
            {
              timestamp: artifacts.visit.arrived_at,
              source: 'ENGINEER' as const,
              visibility: 'CLIENT_VISIBLE' as const,
              title: 'Operative Arrived On Site',
            },
          ]
        : []),
      ...(wo.completed_at
        ? [
            {
              timestamp: wo.completed_at,
              source: 'ENGINEER' as const,
              visibility: 'CLIENT_VISIBLE' as const,
              title: 'Operational Work Completed',
            },
          ]
        : []),
    ],
  };
}
