/**
 * ENTIREFM COMMERCIAL DOMAIN MODULE (Phase 0A-R Hardened)
 * =======================================================
 * Traceability from Quote -> Approval -> Cost Commitment -> Supplier Invoice -> Client Billing -> Invoices.
 * Full Quote Provenance supporting Talk-to-Quote & AI Pricing.
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

export interface QuoteProvenance {
  id: string;
  quote_id: string;
  quote_line_id?: string;
  source_type: QuoteSourceType;
  source_object_type?: string;
  source_object_id?: string;
  raw_source_payload?: Record<string, any>;
  pricing_rule_applied?: string;
  markup_percent?: number;
  is_ai_generated: boolean;
  ai_confidence_score?: number;
  assumptions_json?: string[];
  verified_by_id?: string;
  verified_at?: string;
  created_at: string;
}

export interface ApprovalRecord {
  id: string;
  object_type: 'QUOTE' | 'PO' | 'COST_VARIATION' | 'SUPPLIER_ONBOARDING' | 'AI_EXCEPTION' | 'INVOICE' | 'CONTRACT_CHANGE';
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

export interface CostCommitment {
  id: string;
  work_order_id: string;
  visit_id?: string;
  purchase_order_id?: string;
  provider_org_id?: string;
  quote_id?: string;
  budget_id?: string;
  description: string;
  committed_amount_gbp: number;
  actual_invoiced_gbp: number;
  status: 'COMMITTED' | 'INVOICED' | 'CANCELLED' | 'VARIANCE_EXCEEDED';
  created_at: string;
}

export interface ClientBillingRecord {
  id: string;
  work_order_id: string;
  client_account_id: string;
  contract_id?: string;
  billing_event_type: 'WORK_COMPLETION' | 'PPM_PERIODIC' | 'CALLOUT' | 'CAPEX_MILESTONE';
  revenue_basis: 'FIXED' | 'TIME_MATERIALS' | 'SCHEDULE_OF_RATES';
  net_revenue_gbp: number;
  gross_revenue_gbp: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'READY_TO_INVOICE' | 'INVOICED' | 'DISPUTED';
  supporting_evidence?: any[];
  exception_notes?: string;
  created_at: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  work_order_id?: string;
  client_account_id: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  subtotal_gbp: number;
  tax_amount_gbp: number;
  total_amount_gbp: number;
  submitted_at?: string;
  valid_until?: string;
  approved_at?: string;
  notes?: string;
  created_at: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  work_order_id?: string;
  supplier_org_id: string;
  status: 'DRAFT' | 'ISSUED' | 'ACCEPTED' | 'INVOICED' | 'CANCELLED';
  total_amount_gbp: number;
  issued_at?: string;
  created_at: string;
  supplier?: { name: string };
}

export interface ClientInvoice {
  id: string;
  invoice_number: string;
  client_account_id: string;
  contract_id?: string;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  issue_date: string;
  due_date: string;
  subtotal_gbp: number;
  tax_amount_gbp: number;
  total_amount_gbp: number;
  paid_at?: string;
  created_at: string;
}

export async function listQuotes(status?: string): Promise<Quote[]> {
  let endpoint = 'quotes?select=*&order=created_at.desc';
  if (status) endpoint += `&status=eq.${encodeURIComponent(status)}`;
  const { data } = await dbQuery<Quote[]>(endpoint);
  return data || [];
}

export async function getQuoteProvenance(quoteId: string): Promise<QuoteProvenance[]> {
  const { data } = await dbQuery<QuoteProvenance[]>(
    `quote_provenance?quote_id=eq.${encodeURIComponent(quoteId)}&select=*`
  );
  return data || [];
}

export async function listPendingApprovals(): Promise<ApprovalRecord[]> {
  const { data } = await dbQuery<ApprovalRecord[]>(
    'approvals?status=eq.PENDING&select=*&order=requested_at.desc'
  );
  return data || [];
}
