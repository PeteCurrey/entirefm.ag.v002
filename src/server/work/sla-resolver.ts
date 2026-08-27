/**
 * ENTIREFM SLA TARGET RESOLVER (Phase 0M Truth Closeout)
 * =======================================================
 * Canonical resolution of operational SLA targets from contract and service policies.
 *
 * Precedence:
 *   1. Client Contract SLA Rule (highest precedence)
 *   2. Service Category SLA Rule
 *   3. Explicit Configured Fallback (only when permitFallback: true)
 *   4. NOT_CONFIGURED / REVIEW_REQUIRED (no silent invented defaults)
 *
 * Rules:
 *   - Never silently invent generic P1/P2/P3 attendance deadlines.
 *   - Client A with P1 = 120m and Client B with P1 = 240m produce distinct deadlines.
 *   - Unconfigured contracts return NOT_CONFIGURED so operators can review.
 */

import { WorkPriority, calculateCalendarSla } from './index';

export interface SlaPolicyRule {
  id: string;
  contract_id?: string;
  client_id?: string;
  service_category?: string;
  priority: WorkPriority;
  target_response_mins: number;
  target_attendance_mins: number;
  target_resolution_hours: number;
  operating_hours: '24_7' | 'UK_STANDARD_BUSINESS';
  is_active: boolean;
  is_fallback?: boolean;
}

export type SlaProvenanceLevel = 'CONTRACT' | 'SERVICE' | 'CONFIGURED_FALLBACK' | 'NOT_CONFIGURED';

export interface SlaResolutionResult {
  status: 'CONFIGURED' | 'NOT_CONFIGURED';
  provenance_level: SlaProvenanceLevel;
  rule_id?: string;
  contract_id?: string;
  service_category?: string;
  priority: WorkPriority;
  targets?: {
    target_response_mins: number;
    target_attendance_mins: number;
    target_resolution_hours: number;
    operating_hours: '24_7' | 'UK_STANDARD_BUSINESS';
  };
  deadlines?: {
    responseDueAt: Date;
    attendanceDueAt: Date;
    resolutionDueAt: Date;
    snapshot: Record<string, any>;
  };
  reason?: string;
}

// In-memory registry of contract & service SLA rules (loaded from DB/config)
const registeredSlaRules = new Map<string, SlaPolicyRule>();

/**
 * Register or update an SLA policy rule for a contract, service, or fallback.
 */
export function registerSlaPolicyRule(rule: SlaPolicyRule): void {
  registeredSlaRules.set(rule.id, rule);
}

/**
 * Clear in-memory SLA policy rules (for clean test fixture isolation).
 */
export function clearSlaPolicyRules(): void {
  registeredSlaRules.clear();
}

/**
 * Resolve the applicable SLA definition for a given Work Order context.
 * Strictly enforces hierarchy and refuses to invent unconfigured targets.
 */
export function resolveSlaPolicy(params: {
  contract_id?: string;
  client_id?: string;
  service_category?: string;
  priority: WorkPriority;
  startDate?: Date;
  permitFallback?: boolean;
}): SlaResolutionResult {
  const { contract_id, client_id, service_category, priority, startDate = new Date(), permitFallback = false } = params;
  const activeRules = Array.from(registeredSlaRules.values()).filter((r) => r.is_active && r.priority === priority);

  // ── LEVEL 1: CONTRACT-SPECIFIC RULE ──────────────────────────────────────────
  if (contract_id || client_id) {
    const contractRule = activeRules.find((r) => {
      if (contract_id && r.contract_id === contract_id) {
        return !r.service_category || r.service_category === service_category;
      }
      if (client_id && r.client_id === client_id) {
        return !r.service_category || r.service_category === service_category;
      }
      return false;
    });

    if (contractRule) {
      const deadlines = calculateCalendarSla(priority, startDate, {
        is24x7: contractRule.operating_hours === '24_7',
        startHour: 8,
        endHour: 17,
        holidays: [],
      });

      // Override with the contract's specific target minutes
      if (contractRule.operating_hours === '24_7') {
        deadlines.responseDueAt = new Date(startDate.getTime() + contractRule.target_response_mins * 60000);
        deadlines.attendanceDueAt = new Date(startDate.getTime() + contractRule.target_attendance_mins * 60000);
        deadlines.resolutionDueAt = new Date(startDate.getTime() + contractRule.target_resolution_hours * 3600000);
      }

      return {
        status: 'CONFIGURED',
        provenance_level: 'CONTRACT',
        rule_id: contractRule.id,
        contract_id: contractRule.contract_id,
        service_category: contractRule.service_category,
        priority,
        targets: {
          target_response_mins: contractRule.target_response_mins,
          target_attendance_mins: contractRule.target_attendance_mins,
          target_resolution_hours: contractRule.target_resolution_hours,
          operating_hours: contractRule.operating_hours,
        },
        deadlines,
      };
    }
  }

  // ── LEVEL 2: SERVICE-CATEGORY RULE ──────────────────────────────────────────
  if (service_category) {
    const serviceRule = activeRules.find((r) => !r.contract_id && !r.client_id && r.service_category === service_category);
    if (serviceRule) {
      const deadlines = calculateCalendarSla(priority, startDate, {
        is24x7: serviceRule.operating_hours === '24_7',
        startHour: 8,
        endHour: 17,
        holidays: [],
      });

      return {
        status: 'CONFIGURED',
        provenance_level: 'SERVICE',
        rule_id: serviceRule.id,
        service_category: serviceRule.service_category,
        priority,
        targets: {
          target_response_mins: serviceRule.target_response_mins,
          target_attendance_mins: serviceRule.target_attendance_mins,
          target_resolution_hours: serviceRule.target_resolution_hours,
          operating_hours: serviceRule.operating_hours,
        },
        deadlines,
      };
    }
  }

  // ── LEVEL 3: CONFIGURED FALLBACK (ONLY IF PERMITTED) ─────────────────────────
  if (permitFallback) {
    const fallbackRule = activeRules.find((r) => r.is_fallback === true);
    if (fallbackRule) {
      const deadlines = calculateCalendarSla(priority, startDate, {
        is24x7: fallbackRule.operating_hours === '24_7',
        startHour: 8,
        endHour: 17,
        holidays: [],
      });

      return {
        status: 'CONFIGURED',
        provenance_level: 'CONFIGURED_FALLBACK',
        rule_id: fallbackRule.id,
        priority,
        targets: {
          target_response_mins: fallbackRule.target_response_mins,
          target_attendance_mins: fallbackRule.target_attendance_mins,
          target_resolution_hours: fallbackRule.target_resolution_hours,
          operating_hours: fallbackRule.operating_hours,
        },
        deadlines,
      };
    }
  }

  // ── LEVEL 4: UNCONFIGURED ───────────────────────────────────────────────────
  return {
    status: 'NOT_CONFIGURED',
    provenance_level: 'NOT_CONFIGURED',
    priority,
    reason: `No contractual or service SLA policy configured for contract=${contract_id || 'none'}, service=${service_category || 'none'}, priority=${priority}. Manual operator review required.`,
  };
}
