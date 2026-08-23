/**
 * ENTIREFM COMMERCIAL DOMAIN MODULE (Phase 0B-R Operational Hardening)
 * ====================================================================
 * End-to-End WIP, Committed Cost, Actual Cost, Margin Visibility, Commercial Exceptions,
 * Dynamic Approval Policies, and Quote Provenance.
 */

import { dbQuery } from '../db/client';

export type QuoteSourceType =
  | 'MANUAL'
  | 'FIELD_VOICE'
  | 'FIELD_PHOTO'
  | 'ENGINEER_NOTE'
  | 'DEFECT'
  | 'SERVICE_REQUEST'
  | 'WORK_ORDER'
  | 'RATE_CARD'
  | 'SUPPLIER_PRICE'
  | 'HISTORICAL_QUOTE'
  | 'AI';

export interface CommercialSummary {
  quotedRevenueGbp: number;
  approvedRevenueGbp: number;
  billingReadyRevenueGbp: number;
  committedCostGbp: number;
  actualCostGbp: number;
  estimatedRemainingCostGbp: number;
  expectedMarginGbp: number;
  expectedMarginPct: number;
  commercialExceptions: string[];
}

export interface ApprovalPolicy {
  id: string;
  object_type: string;
  min_amount_gbp: number;
  max_amount_gbp?: number;
  required_role: string;
  risk_category: string;
  is_active: boolean;
}

export interface ApprovalRecord {
  id: string;
  object_type: 'QUOTE' | 'PO' | 'COST_VARIATION' | 'SUPPLIER_ONBOARDING' | 'AI_EXCEPTION' | 'INVOICE' | 'COMPLETION_OVERRIDE';
  object_id: string;
  approval_type: string;
  requested_by_id?: string;
  requested_at: string;
  approver_person_id?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  decision_notes?: string;
  threshold_amount_gbp?: number;
  decided_at?: string;
  created_at: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  work_order_id?: string;
  client_account_id: string;
  status: 'DRAFT' | 'INTERNAL_REVIEW' | 'READY_TO_ISSUE' | 'ISSUED' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  subtotal_gbp: number;
  tax_amount_gbp: number;
  total_amount_gbp: number;
  submitted_at?: string;
  approved_at?: string;
  valid_until?: string;
  created_at: string;
}

/**
 * Calculates true commercial WIP and margins for a Work Order
 */
export function calculateCommercialWip(params: {
  approvedRevenue: number;
  committedCost: number;
  actualCost: number;
  hasClientPo: boolean;
  minMarginFloorPct?: number;
}): CommercialSummary {
  const minFloor = params.minMarginFloorPct ?? 25; // 25% standard target margin
  const totalCost = Math.max(params.committedCost, params.actualCost);
  const expectedMarginGbp = Math.max(0, params.approvedRevenue - totalCost);
  const expectedMarginPct = params.approvedRevenue > 0 ? (expectedMarginGbp / params.approvedRevenue) * 100 : 0;

  const exceptions: string[] = [];
  if (!params.hasClientPo && params.approvedRevenue > 0) {
    exceptions.push('Commercial Exception: Missing Client Purchase Order number.');
  }
  if (params.actualCost > params.committedCost && params.committedCost > 0) {
    exceptions.push(`Commercial Exception: Actual supplier cost (£${params.actualCost}) exceeded committed cost (£${params.committedCost}).`);
  }
  if (params.approvedRevenue > 0 && expectedMarginPct < minFloor) {
    exceptions.push(`Commercial Exception: Expected margin (${expectedMarginPct.toFixed(1)}%) is below target floor (${minFloor}%).`);
  }

  return {
    quotedRevenueGbp: params.approvedRevenue,
    approvedRevenueGbp: params.approvedRevenue,
    billingReadyRevenueGbp: params.approvedRevenue,
    committedCostGbp: params.committedCost,
    actualCostGbp: params.actualCost,
    estimatedRemainingCostGbp: Math.max(0, params.committedCost - params.actualCost),
    expectedMarginGbp,
    expectedMarginPct: Math.round(expectedMarginPct),
    commercialExceptions: exceptions,
  };
}

/**
 * Evaluates required approval role based on dynamic policy hierarchy
 */
export function evaluateRequiredApprover(
  amountGbp: number,
  objectType: 'QUOTE' | 'PO' | 'COST_VARIATION' | 'COMPLETION_OVERRIDE'
): { requiredRole: string; requiresClientApproval: boolean } {
  if (objectType === 'COMPLETION_OVERRIDE') {
    return { requiredRole: 'OPERATIONS_MANAGER', requiresClientApproval: false };
  }
  if (amountGbp <= 1000) {
    return { requiredRole: 'OPERATIONS_MANAGER', requiresClientApproval: false };
  }
  if (amountGbp <= 5000) {
    return { requiredRole: 'DIRECTOR', requiresClientApproval: false };
  }
  return { requiredRole: 'CEO', requiresClientApproval: true };
}

export async function listQuotes(status?: string): Promise<Quote[]> {
  let endpoint = 'quotes?select=*&order=created_at.desc';
  if (status) endpoint += `&status=eq.${encodeURIComponent(status)}`;
  const { data } = await dbQuery<Quote[]>(endpoint);
  return data || [];
}

export async function listPendingApprovals(): Promise<ApprovalRecord[]> {
  const { data } = await dbQuery<ApprovalRecord[]>(
    'approvals?status=eq.PENDING&select=*&order=requested_at.desc'
  );
  return data || [];
}
