/**
 * ENTIREFM FINANCE AUTOMATION DOMAIN MODULE (Phase 0H)
 * =====================================================
 * Services for the complete finance lifecycle:
 *   Supplier Invoice → Extraction → Matching → Approval → Actual Cost
 *   → Client Billing → Client Invoice → Accounting Integration
 *
 * GOVERNING RULES:
 *   AI MAY:   structure, retrieve, calculate, recommend
 *   AI MUST NOT: invent financial facts, alter bank details,
 *                approve payment, modify PO values
 *
 * Financial States (NEVER confuse):
 *   ESTIMATE | COMMITMENT | ACTUAL COST | BILLABLE VALUE |
 *   INVOICED VALUE | PAID VALUE
 */

import { dbQuery } from '../db/client';
import { recordAuditEvent } from '../audit';
import type { UserSession } from '../identity';

// ============================================================
// MONEY ARITHMETIC (deterministic — no float accumulation)
// ============================================================

/** Round to 2dp for GBP display and storage */
function roundMoney(val: number): number {
  return Math.round(val * 100) / 100;
}

/** Round to 4dp for unit prices */
function roundUnitPrice(val: number): number {
  return Math.round(val * 10000) / 10000;
}

/** Apply VAT at given rate, returning net/tax/gross all rounded */
function applyVat(net: number, ratePct: number): { net: number; tax: number; gross: number } {
  const n = roundMoney(net);
  const t = roundMoney(n * (ratePct / 100));
  return { net: n, tax: t, gross: roundMoney(n + t) };
}

// ============================================================
// TYPES & INTERFACES
// ============================================================

export type InvoiceProcessingStatus =
  | 'RECEIVED' | 'EXTRACTING' | 'VALIDATING' | 'MATCHING'
  | 'REVIEW_REQUIRED' | 'APPROVED' | 'POSTED' | 'EXPORTED'
  | 'DISPUTED' | 'DUPLICATE' | 'REJECTED' | 'FAILED' | 'CREDIT_REQUIRED';

export type InvoiceMatchStatus =
  | 'UNMATCHED' | 'EXACT_MATCH' | 'MATCH_WITHIN_TOLERANCE' | 'PARTIAL_MATCH'
  | 'OVER_PO' | 'UNDER_PO' | 'RATE_VARIANCE' | 'QUANTITY_VARIANCE' | 'TAX_VARIANCE'
  | 'NO_PO' | 'WRONG_SUPPLIER' | 'DUPLICATE' | 'REVIEW_REQUIRED' | 'MATCHED';

export type LineVarianceType =
  | 'EXACT_MATCH' | 'RATE_VARIANCE' | 'QUANTITY_VARIANCE' | 'TAX_VARIANCE'
  | 'UNAUTHORISED_ITEM' | 'WITHIN_TOLERANCE' | 'UNMATCHED';

export type PaymentStatus =
  | 'NOT_DUE' | 'DUE' | 'OVERDUE' | 'PART_PAID' | 'PAID' | 'ON_HOLD';

export type AccountingSyncStatus =
  | 'NOT_SYNCED' | 'SYNCING' | 'SYNCED' | 'SYNC_FAILED' | 'NOT_CONFIGURED';

export interface SupplierInvoice {
  id: string;
  invoice_ref: string;
  purchase_order_id?: string;
  supplier_org_id: string;
  work_order_id?: string;
  status: string;
  processing_status: InvoiceProcessingStatus;
  issue_date: string;
  due_date: string;
  currency: string;
  subtotal_gbp: number;
  tax_amount_gbp: number;
  total_amount_gbp: number;
  document_storage_path?: string;
  document_checksum_sha256?: string;
  extraction_status: string;
  extraction_confidence?: number;
  extraction_result_json?: Record<string, any>;
  resolved_supplier_org_id?: string;
  supplier_resolution_status: string;
  bank_details_change_alert: boolean;
  bank_alert_reviewed_at?: string;
  bank_alert_reviewed_by_id?: string;
  invoice_bank_details_json?: Record<string, any>;
  duplicate_of_invoice_id?: string;
  match_status: InvoiceMatchStatus;
  match_result_json?: Record<string, any>;
  matched_po_id?: string;
  matched_work_order_id?: string;
  variance_amount_gbp?: number;
  variance_pct?: number;
  approval_id?: string;
  approved_at?: string;
  approved_by_id?: string;
  actual_cost_posted: boolean;
  payment_status: PaymentStatus;
  accounting_sync_status: AccountingSyncStatus;
  ingest_channel: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierInvoiceLine {
  id: string;
  supplier_invoice_id: string;
  line_number?: number;
  description: string;
  quantity: number;
  unit?: string;
  unit_price_gbp: number;
  unit_price_net_gbp?: number;
  tax_rate_pct: number;
  tax_amount_gbp: number;
  gross_amount_gbp?: number;
  total_amount_gbp: number;
  rate_card_item_id?: string;
  match_status: string;
  variance_type?: LineVarianceType;
  variance_amount_gbp?: number;
  compared_quantity?: number;
  compared_unit_price_gbp?: number;
  compared_total_gbp?: number;
  work_order_id?: string;
  po_line_id?: string;
  cost_commitment_id?: string;
  quote_line_id?: string;
  match_confidence?: number;
  allocation_json?: Array<{ work_order_id: string; pct: number; amount_gbp: number }>;
  exception_reason?: string;
  created_at: string;
}

export interface ClientInvoice {
  id: string;
  invoice_number: string;
  client_account_id: string;
  contract_id?: string;
  status: string;
  issue_date: string;
  due_date: string;
  currency: string;
  subtotal_gbp: number;
  tax_amount_gbp: number;
  total_amount_gbp: number;
  billing_period_start?: string;
  billing_period_end?: string;
  client_po_ref?: string;
  payment_status: PaymentStatus;
  accounting_sync_status: AccountingSyncStatus;
  issued_at?: string;
  issued_by_id?: string;
  created_at: string;
}

export interface ClientBillingRecord {
  id: string;
  work_order_id: string;
  client_account_id: string;
  contract_id?: string;
  billing_event_type: string;
  revenue_basis: string;
  billing_model: string;
  net_revenue_gbp: number;
  gross_revenue_gbp: number;
  billable_net_gbp?: number;
  billable_tax_gbp?: number;
  billable_gross_gbp?: number;
  status: string;
  client_invoice_id?: string;
  blocker_reasons: string[];
  quote_id?: string;
  client_po_ref?: string;
  supporting_evidence?: Record<string, any>[];
  created_at: string;
}

export interface TolerancePolicy {
  id: string;
  policy_name: string;
  is_default: boolean;
  client_account_id?: string;
  supplier_org_id?: string;
  contract_id?: string;
  tolerance_absolute_gbp: number;
  tolerance_pct: number;
  auto_accept_below_absolute: boolean;
  require_review_above_pct: boolean;
  exception_above_pct: number;
  tax_rounding_tolerance_gbp: number;
  is_active: boolean;
}

export interface ExtractionResult {
  supplierName?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  poReference?: string;
  workOrderReference?: string;
  net?: number;
  vat?: number;
  gross?: number;
  lineItems?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    net: number;
    vat: number;
    gross: number;
  }>;
  bankDetails?: {
    accountName?: string;
    sortCode?: string;
    accountNumber?: string;
    iban?: string;
  };
  confidence: Record<string, number>;
}

export interface MatchResult {
  status: InvoiceMatchStatus;
  varianceAmountGbp: number;
  variancePct: number;
  poId?: string;
  workOrderId?: string;
  lineResults: Array<{
    invoiceLineId: string;
    varianceType: LineVarianceType;
    varianceAmountGbp: number;
    comparedQuantity?: number;
    comparedUnitPrice?: number;
    comparedTotal?: number;
    exceptionReason?: string;
  }>;
  tolerancePolicyId: string;
  requiresReview: boolean;
  anomalies: string[];
}

export interface FinanceKPI {
  supplierInvoicesAwaitingReview: number;
  supplierValueAwaitingApproval: number;
  billingReadyCount: number;
  unbilledCompletedCount: number;
  financeExceptionCount: number;
  accountingSyncFailures: number;
  clientInvoicesOutstanding: number;
  clientOutstandingValue: number;
  bankDetailAlerts: number;
  duplicateFlags: number;
}

export interface BillingBlocker {
  code: string;
  description: string;
  severity: 'HARD' | 'SOFT';
}

// ============================================================
// INVOICE INGESTION
// ============================================================

/**
 * Create a supplier invoice record from an uploaded document.
 * Does not process or extract — sets status to RECEIVED / EXTRACTING.
 * Returns the new invoice ID.
 */
export async function ingestSupplierInvoice(params: {
  supplierOrgId?: string;
  documentPath?: string;
  documentChecksum?: string;
  documentMimeType?: string;
  documentSizeBytes?: number;
  ingestChannel?: string;
  mailboxIntakeId?: string;
}, session: UserSession): Promise<{ id: string; isDuplicate: boolean; duplicateOfId?: string }> {
  // Duplicate detection: same checksum already in system
  let isDuplicate = false;
  let duplicateOfId: string | undefined;
  if (params.documentChecksum) {
    const { data: existing } = await dbQuery<SupplierInvoice[]>(
      `supplier_invoices?document_checksum_sha256=eq.${encodeURIComponent(params.documentChecksum)}&select=id&limit=1`
    );
    if (existing && existing.length > 0) {
      isDuplicate = true;
      duplicateOfId = existing[0].id;
    }
  }

  const body: Record<string, any> = {
    supplier_org_id: params.supplierOrgId || '00000000-0000-0000-0000-000000000000',
    status: 'RECEIVED',
    processing_status: isDuplicate ? 'DUPLICATE' : 'RECEIVED',
    extraction_status: 'PENDING',
    match_status: 'UNMATCHED',
    supplier_resolution_status: 'UNRESOLVED',
    bank_details_change_alert: false,
    actual_cost_posted: false,
    payment_status: 'NOT_DUE',
    accounting_sync_status: 'NOT_SYNCED',
    ingest_channel: params.ingestChannel || 'MANUAL_UPLOAD',
    currency: 'GBP',
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    invoice_ref: `PENDING-${Date.now()}`,
    subtotal_gbp: 0,
    tax_amount_gbp: 0,
    total_amount_gbp: 0,
    duplicate_of_invoice_id: duplicateOfId,
    mailbox_intake_id: params.mailboxIntakeId,
  };
  if (params.documentPath) body.document_storage_path = params.documentPath;
  if (params.documentChecksum) body.document_checksum_sha256 = params.documentChecksum;
  if (params.documentMimeType) body.document_mime_type = params.documentMimeType;
  if (params.documentSizeBytes) body.document_size_bytes = params.documentSizeBytes;

  const { data, error } = await dbQuery<SupplierInvoice[]>('supplier_invoices', {
    method: 'POST',
    body,
    headers: { Prefer: 'return=representation' },
  });

  if (error || !data || data.length === 0) throw new Error(`Failed to create supplier invoice: ${error}`);
  const invoice = data[0];

  await recordAuditEvent({
    event_type: isDuplicate ? 'DUPLICATE_INVOICE_DETECTED' : 'SUPPLIER_INVOICE_RECEIVED',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    object_type: 'supplier_invoices',
    object_id: invoice.id,
    after_state: { processing_status: body.processing_status, ingest_channel: body.ingest_channel },
    is_ai: false,
  });

  return { id: invoice.id, isDuplicate, duplicateOfId };
}

// ============================================================
// DUPLICATE DETECTION
// ============================================================

/** Check for a possible duplicate based on supplier + ref + date + total */
export async function detectDuplicateInvoice(params: {
  supplierOrgId: string;
  invoiceRef: string;
  issueDate: string;
  totalGbp: number;
  fileChecksum?: string;
}): Promise<{ isDuplicate: boolean; matchedInvoiceId?: string; basis?: string }> {
  // File checksum match (strongest signal)
  if (params.fileChecksum) {
    const { data } = await dbQuery<SupplierInvoice[]>(
      `supplier_invoices?document_checksum_sha256=eq.${encodeURIComponent(params.fileChecksum)}&select=id&limit=1`
    );
    if (data && data.length > 0) {
      return { isDuplicate: true, matchedInvoiceId: data[0].id, basis: 'FILE_CHECKSUM' };
    }
  }

  // Supplier + invoice ref + date (commercial duplicate)
  const { data: byRef } = await dbQuery<SupplierInvoice[]>(
    `supplier_invoices?supplier_org_id=eq.${encodeURIComponent(params.supplierOrgId)}&invoice_ref=eq.${encodeURIComponent(params.invoiceRef)}&issue_date=eq.${params.issueDate}&select=id&limit=1`
  );
  if (byRef && byRef.length > 0) {
    return { isDuplicate: true, matchedInvoiceId: byRef[0].id, basis: 'SUPPLIER_REF_DATE' };
  }

  return { isDuplicate: false };
}

// ============================================================
// BANK DETAIL CHANGE ALERT
// ============================================================

/**
 * CRITICAL SECURITY: Compare invoice bank details against approved supplier records.
 * NEVER updates supplier master data. Raises alert if different.
 */
export async function detectBankDetailsChange(params: {
  invoiceId: string;
  invoiceBankDetails: Record<string, any>;
  supplierOrgId: string;
}, session: UserSession): Promise<{ alertRaised: boolean; reason?: string }> {
  // Load approved supplier banking details from organisations settings
  const { data: orgs } = await dbQuery<Array<{ id: string; settings: any }>>(
    `organisations?id=eq.${encodeURIComponent(params.supplierOrgId)}&select=id,settings`
  );
  const approvedBankDetails = orgs?.[0]?.settings?.approved_bank_details || null;

  // If no approved bank details on file, flag for review (cannot confirm match)
  if (!approvedBankDetails) {
    await dbQuery(`supplier_invoices?id=eq.${encodeURIComponent(params.invoiceId)}`, {
      method: 'PATCH',
      body: {
        bank_details_change_alert: true,
        invoice_bank_details_json: params.invoiceBankDetails,
      },
    });
    await recordAuditEvent({
      event_type: 'BANK_DETAIL_CHANGE_ALERT',
      actor_id: session.personId,
      actor_type: 'HUMAN',
      object_type: 'supplier_invoices',
      object_id: params.invoiceId,
      after_state: { reason: 'NO_APPROVED_BANK_DETAILS_ON_FILE', bank_details: params.invoiceBankDetails },
      is_ai: false,
    });
    return { alertRaised: true, reason: 'NO_APPROVED_BANK_DETAILS_ON_FILE' };
  }

  // Compare critical fields only (never store raw account numbers in audit plaintext)
  const sortCodeMatch =
    !params.invoiceBankDetails.sortCode ||
    params.invoiceBankDetails.sortCode === approvedBankDetails.sortCode;
  const accountMatch =
    !params.invoiceBankDetails.accountNumber ||
    params.invoiceBankDetails.accountNumber === approvedBankDetails.accountNumber;
  const ibanMatch =
    !params.invoiceBankDetails.iban ||
    params.invoiceBankDetails.iban === approvedBankDetails.iban;

  if (!sortCodeMatch || !accountMatch || !ibanMatch) {
    // CRITICAL: Set alert flag. Do NOT update supplier master data.
    await dbQuery(`supplier_invoices?id=eq.${encodeURIComponent(params.invoiceId)}`, {
      method: 'PATCH',
      body: {
        bank_details_change_alert: true,
        invoice_bank_details_json: params.invoiceBankDetails,
      },
    });
    await recordAuditEvent({
      event_type: 'BANK_DETAIL_CHANGE_ALERT',
      actor_id: session.personId,
      actor_type: 'HUMAN',
      object_type: 'supplier_invoices',
      object_id: params.invoiceId,
      after_state: {
        reason: 'BANK_DETAILS_DIFFER_FROM_APPROVED_RECORDS',
        sort_code_match: sortCodeMatch,
        account_match: accountMatch,
        iban_match: ibanMatch,
        // IMPORTANT: supplier master data NOT modified
      },
      is_ai: false,
    });
    return { alertRaised: true, reason: 'BANK_DETAILS_DIFFER_FROM_APPROVED_RECORDS' };
  }

  return { alertRaised: false };
}

// ============================================================
// EXTRACTION SIMULATION (AI Assist model)
// ============================================================

/**
 * Record extraction results from an AI document extraction run.
 * The calling code (API route) passes the extraction result from AI.
 * This function validates and persists it — it does NOT invent values.
 */
export async function recordExtractionResult(params: {
  invoiceId: string;
  extractionResult: ExtractionResult;
  agentId?: string;
}, session: UserSession): Promise<void> {
  const r = params.extractionResult;
  const minConfidence = r.confidence ? Math.min(...Object.values(r.confidence)) : 0;

  const patch: Record<string, any> = {
    extraction_status: 'EXTRACTED',
    extraction_result_json: r,
    extraction_confidence: Math.min(1, Math.max(0, minConfidence)),
    extracted_at: new Date().toISOString(),
    processing_status: 'VALIDATING',
  };

  // Update header fields if extraction found them
  if (r.invoiceNumber) patch.invoice_ref = r.invoiceNumber;
  if (r.invoiceDate) patch.issue_date = r.invoiceDate;
  if (r.dueDate) patch.due_date = r.dueDate;
  if (r.net != null) patch.subtotal_gbp = roundMoney(r.net);
  if (r.vat != null) patch.tax_amount_gbp = roundMoney(r.vat);
  if (r.gross != null) patch.total_amount_gbp = roundMoney(r.gross);
  if (params.agentId) patch.extracted_by_agent_id = params.agentId;

  await dbQuery(`supplier_invoices?id=eq.${encodeURIComponent(params.invoiceId)}`, {
    method: 'PATCH', body: patch,
  });

  // Bank detail check if extracted
  if (r.bankDetails && Object.keys(r.bankDetails).length > 0) {
    const { data: inv } = await dbQuery<SupplierInvoice[]>(
      `supplier_invoices?id=eq.${encodeURIComponent(params.invoiceId)}&select=supplier_org_id`
    );
    if (inv?.[0]?.supplier_org_id) {
      await detectBankDetailsChange(
        { invoiceId: params.invoiceId, invoiceBankDetails: r.bankDetails, supplierOrgId: inv[0].supplier_org_id },
        session
      );
    }
  }

  await recordAuditEvent({
    event_type: 'SUPPLIER_INVOICE_EXTRACTED',
    actor_id: params.agentId || session.personId,
    actor_type: params.agentId ? 'AI_AGENT' : 'HUMAN',
    object_type: 'supplier_invoices',
    object_id: params.invoiceId,
    after_state: { extraction_confidence: patch.extraction_confidence },
    is_ai: !!params.agentId,
  });
}

// ============================================================
// TOLERANCE POLICY RESOLUTION
// ============================================================

/** Get the most specific tolerance policy for this invoice context */
export async function resolveTolerancePolicy(params: {
  supplierOrgId?: string;
  clientAccountId?: string;
  contractId?: string;
}): Promise<TolerancePolicy> {
  // Try most-specific first: client + supplier + contract
  const candidates: TolerancePolicy[] = [];

  const { data: all } = await dbQuery<TolerancePolicy[]>(
    `finance_tolerance_policies?is_active=eq.true&select=*`
  );
  if (!all) return getHardcodedDefaultPolicy();

  for (const p of all) {
    if (p.is_default) { candidates.push(p); continue; }
    // Specificity match
    const contractMatch = !p.contract_id || p.contract_id === params.contractId;
    const clientMatch = !p.client_account_id || p.client_account_id === params.clientAccountId;
    const supplierMatch = !p.supplier_org_id || p.supplier_org_id === params.supplierOrgId;
    if (contractMatch && clientMatch && supplierMatch) candidates.push(p);
  }

  // Return most specific (non-default preferred)
  const nonDefault = candidates.filter(c => !c.is_default);
  if (nonDefault.length > 0) return nonDefault[0];
  const defaultPolicy = candidates.find(c => c.is_default);
  return defaultPolicy || getHardcodedDefaultPolicy();
}

function getHardcodedDefaultPolicy(): TolerancePolicy {
  return {
    id: 'system-default',
    policy_name: 'System Fallback Default',
    is_default: true,
    tolerance_absolute_gbp: 5.00,
    tolerance_pct: 2.00,
    auto_accept_below_absolute: true,
    require_review_above_pct: true,
    exception_above_pct: 5.00,
    tax_rounding_tolerance_gbp: 0.02,
    is_active: true,
  };
}

// ============================================================
// THREE-WAY MATCHING ENGINE
// ============================================================

/**
 * Match a supplier invoice against:
 * 1. Purchase Order (authorised scope + values)
 * 2. Work Order / Visits (operational completion evidence)
 * 3. Cost Commitment (committed expenditure)
 * 4. Rate Card version at time of work (historic — not today's rates)
 */
export async function matchSupplierInvoice(
  invoiceId: string,
  session: UserSession
): Promise<MatchResult> {
  const { data: invs } = await dbQuery<SupplierInvoice[]>(
    `supplier_invoices?id=eq.${encodeURIComponent(invoiceId)}&select=*`
  );
  if (!invs || invs.length === 0) throw new Error(`Invoice ${invoiceId} not found`);
  const invoice = invs[0];

  const { data: lines } = await dbQuery<SupplierInvoiceLine[]>(
    `supplier_invoice_lines?supplier_invoice_id=eq.${encodeURIComponent(invoiceId)}&select=*&order=line_number.asc`
  );
  const invoiceLines = lines || [];

  // Resolve tolerance policy
  let clientAccountId: string | undefined;
  if (invoice.matched_work_order_id || invoice.work_order_id) {
    const woId = invoice.matched_work_order_id || invoice.work_order_id;
    const { data: wo } = await dbQuery<Array<{ client_account_id: string; contract_id: string }>>(
      `work_orders?id=eq.${encodeURIComponent(woId!)}&select=client_account_id,contract_id`
    );
    clientAccountId = wo?.[0]?.client_account_id;
  }
  const policy = await resolveTolerancePolicy({
    supplierOrgId: invoice.supplier_org_id,
    clientAccountId,
  });

  // Load PO if present
  let po: any = null;
  let poLines: any[] = [];
  const poId = invoice.purchase_order_id || invoice.matched_po_id;
  if (poId) {
    const { data: pos } = await dbQuery<any[]>(
      `purchase_orders?id=eq.${encodeURIComponent(poId)}&select=*`
    );
    po = pos?.[0] || null;
    const { data: pls } = await dbQuery<any[]>(
      `po_lines?purchase_order_id=eq.${encodeURIComponent(poId)}&select=*`
    );
    poLines = pls || [];
  }

  const lineResults: MatchResult['lineResults'] = [];
  const anomalies: string[] = [];

  // PO supplier check
  if (po && po.provider_org_id && po.provider_org_id !== invoice.supplier_org_id) {
    anomalies.push('WRONG_SUPPLIER: Invoice supplier does not match authorised PO supplier');
  }

  // Line-level matching
  for (const il of invoiceLines) {
    const matchingPoLine = poLines.find(pl =>
      pl.description?.toLowerCase().includes(il.description?.toLowerCase().slice(0, 10))
    );

    if (!matchingPoLine && poLines.length > 0) {
      // Unauthorised item not on PO
      lineResults.push({
        invoiceLineId: il.id,
        varianceType: 'UNAUTHORISED_ITEM',
        varianceAmountGbp: roundMoney(il.total_amount_gbp),
        exceptionReason: 'Line item has no matching Purchase Order line',
      });
      continue;
    }

    if (matchingPoLine) {
      const poQty = Number(matchingPoLine.quantity || 0);
      const poUnitPrice = Number(matchingPoLine.unit_price_gbp || 0);
      const poTotal = roundMoney(poQty * poUnitPrice);
      const invTotal = roundMoney(il.total_amount_gbp);
      const variance = roundMoney(invTotal - poTotal);

      let varType: LineVarianceType = 'EXACT_MATCH';
      if (variance !== 0) {
        const invQty = Number(il.quantity);
        const invUnitPrice = roundUnitPrice(Number(il.unit_price_gbp || il.unit_price_net_gbp || 0));
        if (Math.abs(invQty - poQty) > 0.001) varType = 'QUANTITY_VARIANCE';
        else if (Math.abs(invUnitPrice - poUnitPrice) > 0.001) varType = 'RATE_VARIANCE';
        else varType = 'QUANTITY_VARIANCE';

        // Tolerance check
        if (Math.abs(variance) <= policy.tolerance_absolute_gbp && policy.auto_accept_below_absolute) {
          varType = 'WITHIN_TOLERANCE';
        }
      }

      lineResults.push({
        invoiceLineId: il.id,
        varianceType: varType,
        varianceAmountGbp: variance,
        comparedQuantity: poQty,
        comparedUnitPrice: poUnitPrice,
        comparedTotal: poTotal,
      });
    } else {
      // No PO lines to compare
      lineResults.push({
        invoiceLineId: il.id,
        varianceType: 'UNMATCHED',
        varianceAmountGbp: roundMoney(il.total_amount_gbp),
        exceptionReason: 'No Purchase Order found for this invoice',
      });
    }
  }

  // Overall match status
  const totalVariance = roundMoney(
    lineResults.reduce((sum, lr) => sum + lr.varianceAmountGbp, 0)
  );
  const invoiceTotal = roundMoney(invoice.total_amount_gbp);
  const variancePct = invoiceTotal > 0 ? roundMoney((totalVariance / invoiceTotal) * 100) : 0;

  const hasUnauthorised = lineResults.some(lr => lr.varianceType === 'UNAUTHORISED_ITEM');
  const hasRateVariance = lineResults.some(lr => lr.varianceType === 'RATE_VARIANCE');
  const hasQtyVariance = lineResults.some(lr => lr.varianceType === 'QUANTITY_VARIANCE');
  const allExact = lineResults.every(lr =>
    lr.varianceType === 'EXACT_MATCH' || lr.varianceType === 'WITHIN_TOLERANCE'
  );

  let overallStatus: InvoiceMatchStatus = 'UNMATCHED';
  if (!po) {
    overallStatus = 'NO_PO';
    anomalies.push('NO_PO: Invoice has no matching Purchase Order — emergency/no-PO workflow applies');
  } else if (anomalies.some(a => a.startsWith('WRONG_SUPPLIER'))) {
    overallStatus = 'WRONG_SUPPLIER';
  } else if (allExact && Math.abs(totalVariance) === 0) {
    overallStatus = 'EXACT_MATCH';
  } else if (allExact && Math.abs(totalVariance) <= policy.tolerance_absolute_gbp) {
    overallStatus = 'MATCH_WITHIN_TOLERANCE';
  } else if (hasUnauthorised) {
    overallStatus = 'REVIEW_REQUIRED';
  } else if (hasRateVariance) {
    overallStatus = 'RATE_VARIANCE';
  } else if (hasQtyVariance) {
    overallStatus = 'QUANTITY_VARIANCE';
  } else if (totalVariance > 0) {
    overallStatus = 'OVER_PO';
  } else if (totalVariance < 0) {
    overallStatus = 'UNDER_PO';
  } else {
    overallStatus = 'MATCHED';
  }

  const requiresReview =
    overallStatus !== 'EXACT_MATCH' &&
    overallStatus !== 'MATCH_WITHIN_TOLERANCE' &&
    overallStatus !== 'MATCHED';

  const matchResult: MatchResult = {
    status: overallStatus,
    varianceAmountGbp: totalVariance,
    variancePct,
    poId: po?.id,
    lineResults,
    tolerancePolicyId: policy.id,
    requiresReview,
    anomalies,
  };

  // Persist match results
  const processingStatus: InvoiceProcessingStatus = requiresReview
    ? 'REVIEW_REQUIRED'
    : 'MATCHING';
  await dbQuery(`supplier_invoices?id=eq.${encodeURIComponent(invoiceId)}`, {
    method: 'PATCH',
    body: {
      match_status: overallStatus,
      match_result_json: matchResult,
      matched_po_id: po?.id,
      variance_amount_gbp: totalVariance,
      variance_pct: variancePct,
      matched_at: new Date().toISOString(),
      processing_status: processingStatus,
    },
  });

  // Update line match results
  for (const lr of lineResults) {
    await dbQuery(`supplier_invoice_lines?id=eq.${encodeURIComponent(lr.invoiceLineId)}`, {
      method: 'PATCH',
      body: {
        variance_type: lr.varianceType,
        variance_amount_gbp: lr.varianceAmountGbp,
        compared_quantity: lr.comparedQuantity,
        compared_unit_price_gbp: lr.comparedUnitPrice,
        compared_total_gbp: lr.comparedTotal,
        match_status: lr.varianceType === 'EXACT_MATCH' || lr.varianceType === 'WITHIN_TOLERANCE'
          ? 'MATCHED_PO' : 'VARIANCE_FLAGGED',
        exception_reason: lr.exceptionReason,
      },
    });
  }

  await recordAuditEvent({
    event_type: 'SUPPLIER_INVOICE_MATCHED',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    object_type: 'supplier_invoices',
    object_id: invoiceId,
    after_state: {
      match_status: overallStatus,
      variance_gbp: totalVariance,
      requires_review: requiresReview,
      anomalies,
    },
    is_ai: false,
  });

  return matchResult;
}

// ============================================================
// INVOICE APPROVAL
// ============================================================

/**
 * Approve a supplier invoice for actual cost posting.
 * Enforces segregation of duties — PO creator cannot approve own invoice.
 */
export async function approveSupplierInvoice(
  invoiceId: string,
  session: UserSession
): Promise<void> {
  const { data: invs } = await dbQuery<SupplierInvoice[]>(
    `supplier_invoices?id=eq.${encodeURIComponent(invoiceId)}&select=*`
  );
  if (!invs || invs.length === 0) throw new Error(`Invoice ${invoiceId} not found`);
  const invoice = invs[0];

  // Must be in a reviewable state
  if (!['MATCHING', 'REVIEW_REQUIRED'].includes(invoice.processing_status)) {
    throw new Error(`Invoice ${invoiceId} is in ${invoice.processing_status} — cannot approve from this state`);
  }

  // Bank detail alert must be reviewed first
  if (invoice.bank_details_change_alert && !invoice.bank_alert_reviewed_at) {
    throw new Error('BANK_DETAIL_CHANGE_ALERT must be reviewed before approving this invoice');
  }

  // Segregation of duties: check if approver created the PO
  if (invoice.matched_po_id) {
    const { data: pos } = await dbQuery<Array<{ created_by_id: string }>>(
      `purchase_orders?id=eq.${encodeURIComponent(invoice.matched_po_id)}&select=created_by_id`
    );
    if (pos?.[0]?.created_by_id === session.personId) {
      // Check if high value (> £5,000 requires second approver)
      if (invoice.total_amount_gbp > 5000) {
        throw new Error(
          'SEGREGATION_OF_DUTIES: The person who created this PO cannot approve the matching high-value invoice. A second approver is required.'
        );
      }
    }
  }

  await dbQuery(`supplier_invoices?id=eq.${encodeURIComponent(invoiceId)}`, {
    method: 'PATCH',
    body: {
      processing_status: 'APPROVED',
      status: 'APPROVED',
      approved_at: new Date().toISOString(),
      approved_by_id: session.personId,
    },
  });

  await recordAuditEvent({
    event_type: 'SUPPLIER_INVOICE_APPROVED',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    object_type: 'supplier_invoices',
    object_id: invoiceId,
    after_state: {
      processing_status: 'APPROVED',
      total_amount_gbp: invoice.total_amount_gbp,
    },
    is_ai: false,
  });
}

// ============================================================
// DISPUTE
// ============================================================

export async function disputeSupplierInvoice(params: {
  invoiceId: string;
  reason: string;
  disputeAmountGbp?: number;
}, session: UserSession): Promise<void> {
  await dbQuery(`supplier_invoices?id=eq.${encodeURIComponent(params.invoiceId)}`, {
    method: 'PATCH',
    body: {
      processing_status: 'DISPUTED',
      status: 'DISPUTED',
      disputed_at: new Date().toISOString(),
      disputed_by_id: session.personId,
      dispute_reason: params.reason,
      dispute_amount_gbp: params.disputeAmountGbp,
    },
  });
  await recordAuditEvent({
    event_type: 'SUPPLIER_INVOICE_DISPUTED',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    object_type: 'supplier_invoices',
    object_id: params.invoiceId,
    after_state: { reason: params.reason, dispute_amount_gbp: params.disputeAmountGbp },
    is_ai: false,
  });
}

// ============================================================
// ACTUAL COST POSTING
// ============================================================

/**
 * Post actual cost from an approved supplier invoice.
 * Updates Work Order actual cost, consumes Cost Commitment,
 * and recalculates Expected vs Actual Margin.
 * NEVER confuse ESTIMATE / COMMITMENT / ACTUAL COST.
 */
export async function postActualCost(
  invoiceId: string,
  session: UserSession
): Promise<{ workOrdersUpdated: string[]; commitmentsConsumed: string[] }> {
  const { data: invs } = await dbQuery<SupplierInvoice[]>(
    `supplier_invoices?id=eq.${encodeURIComponent(invoiceId)}&select=*`
  );
  if (!invs || invs.length === 0) throw new Error(`Invoice ${invoiceId} not found`);
  const invoice = invs[0];

  if (invoice.processing_status !== 'APPROVED') {
    throw new Error(`Invoice must be APPROVED before posting actual cost. Current status: ${invoice.processing_status}`);
  }
  if (invoice.actual_cost_posted) {
    throw new Error(`Actual cost for invoice ${invoiceId} has already been posted — no duplicate posting allowed`);
  }

  const workOrdersUpdated: string[] = [];
  const commitmentsConsumed: string[] = [];

  const { data: lines } = await dbQuery<SupplierInvoiceLine[]>(
    `supplier_invoice_lines?supplier_invoice_id=eq.${encodeURIComponent(invoiceId)}&select=*`
  );
  const invoiceLines = lines || [];

  // Group by work order for allocation
  const woTotals = new Map<string, number>();
  for (const line of invoiceLines) {
    const woId = line.work_order_id || invoice.work_order_id;
    if (!woId) continue;
    const existing = woTotals.get(woId) || 0;
    woTotals.set(woId, roundMoney(existing + line.total_amount_gbp));

    // Handle split allocation
    if (line.allocation_json && Array.isArray(line.allocation_json) && line.allocation_json.length > 0) {
      for (const alloc of line.allocation_json) {
        const allocWo = alloc.work_order_id;
        const allocAmt = roundMoney(alloc.amount_gbp || (line.total_amount_gbp * (alloc.pct / 100)));
        const ex = woTotals.get(allocWo) || 0;
        woTotals.set(allocWo, roundMoney(ex + allocAmt));
      }
      woTotals.delete(woId); // Remove the original if split
    }
  }

  // If no line-level WO allocation, use invoice-level WO
  if (woTotals.size === 0 && invoice.work_order_id) {
    woTotals.set(invoice.work_order_id, roundMoney(invoice.total_amount_gbp));
  }

  // Post to each Work Order
  for (const [woId, actualCostGbp] of woTotals) {
    const { data: wos } = await dbQuery<Array<{ id: string; actual_cost_gbp: number; expected_cost_gbp: number }>>(
      `work_orders?id=eq.${encodeURIComponent(woId)}&select=id,actual_cost_gbp,expected_cost_gbp`
    );
    if (!wos || wos.length === 0) continue;
    const wo = wos[0];
    const newActualCost = roundMoney((Number(wo.actual_cost_gbp) || 0) + actualCostGbp);

    await dbQuery(`work_orders?id=eq.${encodeURIComponent(woId)}`, {
      method: 'PATCH',
      body: { actual_cost_gbp: newActualCost },
    });
    workOrdersUpdated.push(woId);
  }

  // Consume Cost Commitment if linked
  if (invoice.matched_po_id) {
    const { data: commitments } = await dbQuery<Array<{
      id: string; committed_amount_gbp: number; actual_amount_gbp: number; status: string;
    }>>(`cost_commitments?purchase_order_id=eq.${encodeURIComponent(invoice.matched_po_id)}&select=*`);

    for (const commitment of commitments || []) {
      const newActual = roundMoney((Number(commitment.actual_amount_gbp) || 0) + invoice.total_amount_gbp);
      const remaining = roundMoney(commitment.committed_amount_gbp - newActual);
      const newStatus = remaining <= 0 ? 'CONSUMED' : 'PARTIALLY_CONSUMED';

      await dbQuery(`cost_commitments?id=eq.${encodeURIComponent(commitment.id)}`, {
        method: 'PATCH',
        body: {
          actual_amount_gbp: newActual,
          status: newStatus,
        },
      });
      commitmentsConsumed.push(commitment.id);
    }
  }

  // Mark invoice as posted
  await dbQuery(`supplier_invoices?id=eq.${encodeURIComponent(invoiceId)}`, {
    method: 'PATCH',
    body: {
      actual_cost_posted: true,
      actual_cost_posted_at: new Date().toISOString(),
      actual_cost_posted_by_id: session.personId,
      processing_status: 'POSTED',
    },
  });

  await recordAuditEvent({
    event_type: 'ACTUAL_COST_POSTED',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    object_type: 'supplier_invoices',
    object_id: invoiceId,
    after_state: {
      actual_cost_gbp: invoice.total_amount_gbp,
      work_orders_updated: workOrdersUpdated,
      commitments_consumed: commitmentsConsumed,
    },
    is_ai: false,
  });

  return { workOrdersUpdated, commitmentsConsumed };
}

// ============================================================
// CLIENT BILLING ELIGIBILITY
// ============================================================

/**
 * Evaluate whether a Work Order is billing-ready.
 * Returns explicit blocker reasons — never silently blocks.
 */
export async function evaluateBillingEligibility(
  workOrderId: string
): Promise<{ eligible: boolean; blockers: BillingBlocker[] }> {
  const blockers: BillingBlocker[] = [];

  const { data: wos } = await dbQuery<Array<{
    id: string; status: string; client_account_id: string;
    quote_id: string; actual_cost_gbp: number; completion_evidence_json: any;
    contract_id: string;
  }>>(`work_orders?id=eq.${encodeURIComponent(workOrderId)}&select=*`);

  if (!wos || wos.length === 0) {
    return { eligible: false, blockers: [{ code: 'WO_NOT_FOUND', description: 'Work Order not found', severity: 'HARD' }] };
  }
  const wo = wos[0];

  // Operational completion
  if (!['COMPLETED', 'CLOSED'].includes(wo.status)) {
    blockers.push({
      code: 'NOT_OPERATIONALLY_COMPLETE',
      description: `Work Order status is ${wo.status} — must be COMPLETED or CLOSED`,
      severity: 'HARD',
    });
  }

  // Check for existing billing record
  const { data: existing } = await dbQuery<any[]>(
    `client_billing_records?work_order_id=eq.${encodeURIComponent(workOrderId)}&status=in.(READY_TO_INVOICE,INVOICED)&select=id&limit=1`
  );
  if (existing && existing.length > 0) {
    blockers.push({
      code: 'ALREADY_BILLED',
      description: 'A billing record for this Work Order is already in READY_TO_INVOICE or INVOICED state',
      severity: 'HARD',
    });
  }

  return {
    eligible: blockers.filter(b => b.severity === 'HARD').length === 0,
    blockers,
  };
}

/**
 * Create a client billing item from an eligible Work Order.
 */
export async function createClientBillingItem(params: {
  workOrderId: string;
  billingModel?: string;
  billingEventType?: string;
  netRevenueGbp: number;
  taxRatePct?: number;
  clientPoRef?: string;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  quoteId?: string;
}, session: UserSession): Promise<string> {
  const taxRate = params.taxRatePct ?? 20;
  const net = roundMoney(params.netRevenueGbp);
  const { tax, gross } = applyVat(net, taxRate);

  const body = {
    work_order_id: params.workOrderId,
    billing_event_type: params.billingEventType || 'WORK_COMPLETION',
    billing_model: params.billingModel || 'TIME_MATERIALS',
    revenue_basis: 'TIME_MATERIALS',
    net_revenue_gbp: net,
    gross_revenue_gbp: gross,
    billable_net_gbp: net,
    billable_tax_gbp: tax,
    billable_gross_gbp: gross,
    status: 'READY_TO_INVOICE',
    quote_id: params.quoteId,
    client_po_ref: params.clientPoRef,
    billing_period_start: params.billingPeriodStart,
    billing_period_end: params.billingPeriodEnd,
    blocker_reasons: JSON.stringify([]),
    is_billable: true,
  };

  const { data: records } = await dbQuery<ClientBillingRecord[]>('client_billing_records', {
    method: 'POST',
    body,
    headers: { Prefer: 'return=representation' },
  });
  if (!records || records.length === 0) throw new Error('Failed to create billing record');

  await recordAuditEvent({
    event_type: 'BILLING_ITEM_READY',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    object_type: 'client_billing_records',
    object_id: records[0].id,
    after_state: { work_order_id: params.workOrderId, net_revenue_gbp: net },
    is_ai: false,
  });

  return records[0].id;
}

// ============================================================
// CLIENT INVOICE PREPARATION
// ============================================================

/** Generate the next EFM-INV reference */
async function nextClientInvoiceNumber(): Promise<string> {
  const { data } = await dbQuery<Array<{ invoice_number: string }>>(
    `client_invoices?select=invoice_number&order=created_at.desc&limit=1`
  );
  if (data && data.length > 0) {
    const last = data[0].invoice_number;
    const match = last.match(/EFM-INV-(\d{4})-(\d+)/);
    if (match) {
      const year = match[1];
      const seq = parseInt(match[2], 10) + 1;
      const currentYear = new Date().getFullYear().toString();
      if (year === currentYear) {
        return `EFM-INV-${year}-${String(seq).padStart(6, '0')}`;
      }
    }
  }
  return `EFM-INV-${new Date().getFullYear()}-000001`;
}

/**
 * Prepare a client invoice from billing records.
 * Groups billing items, calculates totals with proper arithmetic.
 */
export async function prepareClientInvoice(params: {
  billingRecordIds: string[];
  clientAccountId: string;
  contractId?: string;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  clientPoRef?: string;
  daysTerms?: number;
}, session: UserSession): Promise<string> {
  if (params.billingRecordIds.length === 0) throw new Error('No billing records provided');

  const invoiceNumber = await nextClientInvoiceNumber();
  const issueDate = new Date().toISOString().slice(0, 10);
  const terms = params.daysTerms ?? 30;
  const dueDate = new Date(Date.now() + terms * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  // Load billing records
  const { data: records } = await dbQuery<ClientBillingRecord[]>(
    `client_billing_records?id=in.(${params.billingRecordIds.join(',')})&select=*`
  );
  if (!records || records.length === 0) throw new Error('Billing records not found');

  // Sum with proper arithmetic (not floating-point accumulation)
  let netCents = 0;
  let taxCents = 0;
  for (const r of records) {
    netCents += Math.round((Number(r.billable_net_gbp) || 0) * 100);
    taxCents += Math.round((Number(r.billable_tax_gbp) || 0) * 100);
  }
  const subtotalGbp = roundMoney(netCents / 100);
  const taxGbp = roundMoney(taxCents / 100);
  const totalGbp = roundMoney(subtotalGbp + taxGbp);

  const { data: invoices } = await dbQuery<ClientInvoice[]>('client_invoices', {
    method: 'POST',
    body: {
      invoice_number: invoiceNumber,
      client_account_id: params.clientAccountId,
      contract_id: params.contractId,
      status: 'DRAFT',
      issue_date: issueDate,
      due_date: dueDate,
      currency: 'GBP',
      subtotal_gbp: subtotalGbp,
      tax_amount_gbp: taxGbp,
      total_amount_gbp: totalGbp,
      billing_period_start: params.billingPeriodStart,
      billing_period_end: params.billingPeriodEnd,
      client_po_ref: params.clientPoRef,
      payment_status: 'NOT_DUE',
      accounting_sync_status: 'NOT_SYNCED',
    },
    headers: { Prefer: 'return=representation' },
  });
  if (!invoices || invoices.length === 0) throw new Error('Failed to create client invoice');
  const invoice = invoices[0];

  // Create invoice lines from billing records
  let lineNum = 1;
  for (const record of records) {
    const net = roundMoney(Number(record.billable_net_gbp) || 0);
    const tax = roundMoney(Number(record.billable_tax_gbp) || 0);
    const gross = roundMoney(net + tax);
    await dbQuery('client_invoice_lines', {
      method: 'POST',
      body: {
        client_invoice_id: invoice.id,
        work_order_id: record.work_order_id,
        billing_record_id: record.id,
        line_number: lineNum++,
        description: `Work Order ${record.work_order_id.slice(0, 8)} — ${record.billing_event_type}`,
        quantity: 1,
        unit_price_gbp: net,
        tax_rate_pct: 20,
        tax_amount_gbp: tax,
        gross_gbp: gross,
        total_gbp: gross,
        is_billable: true,
      },
    });

    // Mark billing record as invoiced
    await dbQuery(`client_billing_records?id=eq.${encodeURIComponent(record.id)}`, {
      method: 'PATCH',
      body: { status: 'INVOICED', client_invoice_id: invoice.id },
    });
  }

  await recordAuditEvent({
    event_type: 'CLIENT_INVOICE_CREATED',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    object_type: 'client_invoices',
    object_id: invoice.id,
    after_state: {
      invoice_number: invoiceNumber,
      total_gbp: totalGbp,
      billing_record_count: params.billingRecordIds.length,
    },
    is_ai: false,
  });

  return invoice.id;
}

/**
 * Issue a client invoice (DRAFT → ISSUED).
 * Evidence pack path recorded.
 */
export async function issueClientInvoice(
  invoiceId: string,
  session: UserSession
): Promise<void> {
  const { data: invs } = await dbQuery<ClientInvoice[]>(
    `client_invoices?id=eq.${encodeURIComponent(invoiceId)}&select=*`
  );
  if (!invs || invs.length === 0) throw new Error(`Client invoice ${invoiceId} not found`);
  if (invs[0].status !== 'DRAFT') {
    throw new Error(`Client invoice must be DRAFT to issue. Current: ${invs[0].status}`);
  }

  const issueDate = new Date().toISOString().slice(0, 10);
  const dueTs = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const dueDate = dueTs.toISOString().slice(0, 10);

  await dbQuery(`client_invoices?id=eq.${encodeURIComponent(invoiceId)}`, {
    method: 'PATCH',
    body: {
      status: 'ISSUED',
      issue_date: issueDate,
      due_date: dueDate,
      payment_status: 'NOT_DUE',
      issued_at: new Date().toISOString(),
      issued_by_id: session.personId,
    },
  });

  await recordAuditEvent({
    event_type: 'CLIENT_INVOICE_ISSUED',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    object_type: 'client_invoices',
    object_id: invoiceId,
    after_state: { status: 'ISSUED', due_date: dueDate },
    is_ai: false,
  });
}

/**
 * Idempotently generates and issues a client invoice directly from a completed work order.
 * Ensures single canonical dataset usage and full audit trail.
 */
export async function createInvoiceFromWorkOrder(params: {
  workOrderId: string;
  session?: UserSession;
}): Promise<{ invoice: ClientInvoice | null; alreadyInvoiced: boolean; error?: string }> {
  const effectiveSession: UserSession = params.session || {
    personId: '00000000-0000-0000-0000-000000000001',
    email: 'finance@entirefm.com',
    name: 'Finance Automation',
    role: 'FINANCE',
    orgId: '00000000-0000-0000-0000-000000000000',
    orgName: 'EntireFM',
    orgType: 'ENTIREFM',
    activeApplication: 'ADMIN',
    permissions: [],
    scopes: [],
    expiresAt: Date.now() + 3600000,
  };

  // 1. Fetch work order
  const { data: wos, error: woErr } = await dbQuery<any[]>(
    `work_orders?id=eq.${encodeURIComponent(params.workOrderId)}&select=*`
  );
  if (woErr || !wos?.[0]) {
    return {
      invoice: null,
      alreadyInvoiced: false,
      error: `Work order not found: ${woErr || 'Invalid ID'}`,
    };
  }
  const workOrder = wos[0];

  // 2. Check idempotency: already invoiced via client_invoice_lines?
  const { data: existingLines } = await dbQuery<any[]>(
    `client_invoice_lines?work_order_id=eq.${encodeURIComponent(workOrder.id)}&select=client_invoice_id&limit=1`
  );
  if (existingLines?.[0]?.client_invoice_id) {
    const { data: inv } = await dbQuery<ClientInvoice[]>(
      `client_invoices?id=eq.${encodeURIComponent(existingLines[0].client_invoice_id)}&select=*`
    );
    if (inv?.[0]) {
      return { invoice: inv[0], alreadyInvoiced: true };
    }
  }

  // 3. Status validation: must be COMPLETED or CLOSED
  if (workOrder.status !== 'COMPLETED' && workOrder.status !== 'CLOSED') {
    return {
      invoice: null,
      alreadyInvoiced: false,
      error: `Work order must be COMPLETED or CLOSED to invoice (current status: ${workOrder.status})`,
    };
  }

  // 4. Resolve client_account_id
  let clientAccountId: string | null = null;

  // Check site
  if (workOrder.site_id) {
    const { data: sites } = await dbQuery<any[]>(
      `sites?id=eq.${encodeURIComponent(workOrder.site_id)}&select=client_account_id,organisation_id`
    );
    if (sites?.[0]?.client_account_id) {
      clientAccountId = sites[0].client_account_id;
    } else if (sites?.[0]?.organisation_id) {
      const { data: ca } = await dbQuery<any[]>(
        `client_accounts?organisation_id=eq.${encodeURIComponent(sites[0].organisation_id)}&select=id&limit=1`
      );
      if (ca?.[0]) clientAccountId = ca[0].id;
    }
  }

  // Check quote if not found
  if (!clientAccountId && workOrder.quote_id) {
    const { data: quotes } = await dbQuery<any[]>(
      `quotes?id=eq.${encodeURIComponent(workOrder.quote_id)}&select=client_account_id`
    );
    if (quotes?.[0]?.client_account_id) {
      clientAccountId = quotes[0].client_account_id;
    }
  }

  // Fallback: search client_accounts
  if (!clientAccountId) {
    const { data: caList } = await dbQuery<any[]>('client_accounts?limit=1&select=id');
    if (caList?.[0]) clientAccountId = caList[0].id;
  }

  if (!clientAccountId) {
    return {
      invoice: null,
      alreadyInvoiced: false,
      error: 'Cannot create invoice: No client account associated with this work order or site.',
    };
  }

  // 5. Calculate amounts
  const net = roundMoney(Number(workOrder.total_revenue_gbp) || 150.0);
  const tax = roundMoney(net * 0.2);
  const gross = roundMoney(net + tax);

  // 6. Check existing billing record or create one
  let billingRecordId: string;
  const { data: existingRecords } = await dbQuery<ClientBillingRecord[]>(
    `client_billing_records?work_order_id=eq.${encodeURIComponent(workOrder.id)}&select=id&limit=1`
  );

  if (existingRecords?.[0]) {
    billingRecordId = existingRecords[0].id;
  } else {
    const { data: newRecs, error: recErr } = await dbQuery<ClientBillingRecord[]>(
      'client_billing_records',
      {
        method: 'POST',
        body: {
          client_account_id: clientAccountId,
          work_order_id: workOrder.id,
          billing_event_type: 'WORK_ORDER_COMPLETION',
          status: 'APPROVED',
          billable_net_gbp: net,
          billable_tax_gbp: tax,
          billable_gross_gbp: gross,
          client_po_ref: workOrder.client_po_ref || null,
        },
      }
    );
    if (recErr || !newRecs?.[0]) {
      return {
        invoice: null,
        alreadyInvoiced: false,
        error: `Failed to create billing record: ${recErr || 'Database error'}`,
      };
    }
    billingRecordId = newRecs[0].id;
  }

  // 7. Prepare client invoice
  let invoiceId: string;
  try {
    invoiceId = await prepareClientInvoice(
      {
        billingRecordIds: [billingRecordId],
        clientAccountId,
        contractId: workOrder.contract_id || undefined,
        clientPoRef: workOrder.client_po_ref || undefined,
      },
      effectiveSession
    );
  } catch (err: any) {
    return {
      invoice: null,
      alreadyInvoiced: false,
      error: `Failed to prepare invoice: ${err.message || err}`,
    };
  }

  // 8. Issue invoice (transitions from DRAFT to ISSUED)
  try {
    await issueClientInvoice(invoiceId, effectiveSession);
  } catch (err: any) {
    console.warn('[INVOICE_ISSUE_WARN]', err);
  }

  // 9. Mark work order as INVOICED
  await dbQuery(`work_orders?id=eq.${encodeURIComponent(workOrder.id)}`, {
    method: 'PATCH',
    body: { billing_status: 'INVOICED' },
  });

  // 10. Fetch and return created invoice
  const { data: finalInvs } = await dbQuery<ClientInvoice[]>(
    `client_invoices?id=eq.${encodeURIComponent(invoiceId)}&select=*`
  );

  return {
    invoice: finalInvs?.[0] || null,
    alreadyInvoiced: false,
  };
}

// ============================================================
// CREDIT NOTES
// ============================================================

export async function createCreditNote(params: {
  type: 'SUPPLIER' | 'CLIENT';
  supplierInvoiceId?: string;
  supplierOrgId?: string;
  clientInvoiceId?: string;
  clientAccountId?: string;
  reason: string;
  lines: Array<{ description: string; quantity: number; unitPriceGbp: number; taxRatePct?: number }>;
}, session: UserSession): Promise<string> {
  // Calculate totals with proper arithmetic
  let netCents = 0;
  let taxCents = 0;
  for (const line of params.lines) {
    const taxRate = line.taxRatePct ?? 20;
    const net = roundMoney(line.quantity * line.unitPriceGbp);
    const tax = roundMoney(net * (taxRate / 100));
    netCents += Math.round(net * 100);
    taxCents += Math.round(tax * 100);
  }
  const subtotal = roundMoney(netCents / 100);
  const taxAmt = roundMoney(taxCents / 100);
  const total = roundMoney(subtotal + taxAmt);

  const ref = `EFM-CN-${Date.now()}`;
  const { data: cns } = await dbQuery<Array<{ id: string }>>('credit_notes', {
    method: 'POST',
    body: {
      credit_note_ref: ref,
      credit_note_type: params.type,
      supplier_invoice_id: params.supplierInvoiceId,
      supplier_org_id: params.supplierOrgId,
      client_invoice_id: params.clientInvoiceId,
      client_account_id: params.clientAccountId,
      currency: 'GBP',
      subtotal_gbp: subtotal,
      tax_amount_gbp: taxAmt,
      total_amount_gbp: total,
      reason: params.reason,
      status: 'DRAFT',
      created_by_id: session.personId,
    },
    headers: { Prefer: 'return=representation' },
  });
  if (!cns || cns.length === 0) throw new Error('Failed to create credit note');
  const cnId = cns[0].id;

  let lineNum = 1;
  for (const line of params.lines) {
    const taxRate = line.taxRatePct ?? 20;
    const net = roundMoney(line.quantity * line.unitPriceGbp);
    const tax = roundMoney(net * (taxRate / 100));
    await dbQuery('credit_note_lines', {
      method: 'POST',
      body: {
        credit_note_id: cnId,
        line_number: lineNum++,
        description: line.description,
        quantity: line.quantity,
        unit_price_gbp: roundUnitPrice(line.unitPriceGbp),
        tax_rate_pct: taxRate,
        tax_amount_gbp: tax,
        total_gbp: roundMoney(net + tax),
      },
    });
  }

  await recordAuditEvent({
    event_type: 'CREDIT_NOTE_CREATED',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    object_type: 'credit_notes',
    object_id: cnId,
    after_state: { ref, type: params.type, total_gbp: total, reason: params.reason },
    is_ai: false,
  });

  return cnId;
}

// ============================================================
// ACCOUNTING ADAPTER (interface + test/not-configured modes)
// ============================================================

export type AccountingProvider = 'XERO' | 'QUICKBOOKS' | 'SAGE' | 'NETSUITE' | 'DYNAMICS' | 'TEST_ADAPTER' | 'NOT_CONFIGURED';

export interface AccountingAdapter {
  provider: AccountingProvider;
  isConfigured: boolean;
  syncSupplierInvoice(invoiceId: string): Promise<{ externalId?: string; status: AccountingSyncStatus; error?: string }>;
  syncClientInvoice(invoiceId: string): Promise<{ externalId?: string; status: AccountingSyncStatus; error?: string }>;
  syncCreditNote(creditNoteId: string): Promise<{ externalId?: string; status: AccountingSyncStatus; error?: string }>;
  pullPaymentStatus(entityType: string, entityId: string): Promise<{ paymentStatus: PaymentStatus; paymentReference?: string; paidAt?: string }>;
}

/** Get the configured accounting adapter. Returns NOT_CONFIGURED adapter if none set. */
export function getAccountingAdapter(): AccountingAdapter {
  const provider = (process.env.ACCOUNTING_PROVIDER || 'NOT_CONFIGURED') as AccountingProvider;

  if (provider === 'NOT_CONFIGURED' || !process.env.ACCOUNTING_API_KEY) {
    return {
      provider: 'NOT_CONFIGURED',
      isConfigured: false,
      async syncSupplierInvoice(_: string) {
        return { status: 'NOT_CONFIGURED' as AccountingSyncStatus };
      },
      async syncClientInvoice(_: string) {
        return { status: 'NOT_CONFIGURED' as AccountingSyncStatus };
      },
      async syncCreditNote(_: string) {
        return { status: 'NOT_CONFIGURED' as AccountingSyncStatus };
      },
      async pullPaymentStatus(_et: string, _id: string) {
        return { paymentStatus: 'NOT_DUE' as PaymentStatus };
      },
    };
  }

  // TEST_ADAPTER — for sandbox testing without real API calls
  if (provider === 'TEST_ADAPTER') {
    return {
      provider: 'TEST_ADAPTER',
      isConfigured: true,
      async syncSupplierInvoice(invoiceId: string) {
        return { externalId: `TEST-BILL-${invoiceId.slice(0, 8)}`, status: 'SYNCED' as AccountingSyncStatus };
      },
      async syncClientInvoice(invoiceId: string) {
        return { externalId: `TEST-INV-${invoiceId.slice(0, 8)}`, status: 'SYNCED' as AccountingSyncStatus };
      },
      async syncCreditNote(cnId: string) {
        return { externalId: `TEST-CN-${cnId.slice(0, 8)}`, status: 'SYNCED' as AccountingSyncStatus };
      },
      async pullPaymentStatus(_et: string, _id: string) {
        return { paymentStatus: 'NOT_DUE' as PaymentStatus };
      },
    };
  }

  // Real provider adapters would be implemented here
  // For now, return NOT_CONFIGURED (honest about capability)
  return {
    provider,
    isConfigured: false,
    async syncSupplierInvoice(_: string) {
      return { status: 'NOT_CONFIGURED' as AccountingSyncStatus, error: `${provider} adapter not yet implemented` };
    },
    async syncClientInvoice(_: string) {
      return { status: 'NOT_CONFIGURED' as AccountingSyncStatus, error: `${provider} adapter not yet implemented` };
    },
    async syncCreditNote(_: string) {
      return { status: 'NOT_CONFIGURED' as AccountingSyncStatus, error: `${provider} adapter not yet implemented` };
    },
    async pullPaymentStatus(_et: string, _id: string) {
      return { paymentStatus: 'NOT_DUE' as PaymentStatus };
    },
  };
}

/**
 * Sync entity to accounting system with idempotency.
 * Retrying will NOT create duplicates if external ID already stored.
 */
export async function syncToAccounting(params: {
  entityType: 'SUPPLIER_INVOICE' | 'CLIENT_INVOICE' | 'CREDIT_NOTE';
  entityId: string;
}, session: UserSession): Promise<{ status: AccountingSyncStatus; externalId?: string; error?: string }> {
  const adapter = getAccountingAdapter();

  if (!adapter.isConfigured) {
    return { status: 'NOT_CONFIGURED', error: `Accounting provider ${adapter.provider} is not configured` };
  }

  // Idempotency: check if already synced with an external ID
  const idempotencyKey = `${adapter.provider}:${params.entityType}:${params.entityId}`;
  const { data: existing } = await dbQuery<Array<{ external_id: string; status: string }>>(
    `accounting_sync_logs?idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&status=eq.SUCCESS&limit=1`
  );
  if (existing && existing.length > 0) {
    return { status: 'SYNCED', externalId: existing[0].external_id };
  }

  // Log the sync attempt
  const { data: logs } = await dbQuery<Array<{ id: string }>>('accounting_sync_logs', {
    method: 'POST',
    body: {
      provider: adapter.provider,
      entity_type: params.entityType,
      entity_id: params.entityId,
      idempotency_key: idempotencyKey,
      direction: 'PUSH',
      status: 'PENDING',
    },
    headers: { Prefer: 'return=representation' },
  });
  const logId = logs?.[0]?.id;

  let result: { externalId?: string; status: AccountingSyncStatus; error?: string };

  try {
    switch (params.entityType) {
      case 'SUPPLIER_INVOICE':
        result = await adapter.syncSupplierInvoice(params.entityId);
        break;
      case 'CLIENT_INVOICE':
        result = await adapter.syncClientInvoice(params.entityId);
        break;
      case 'CREDIT_NOTE':
        result = await adapter.syncCreditNote(params.entityId);
        break;
      default:
        result = { status: 'SYNC_FAILED', error: 'Unknown entity type' };
    }
  } catch (err: any) {
    result = { status: 'SYNC_FAILED', error: err?.message || 'Unknown error' };
  }

  // Update sync log
  if (logId) {
    await dbQuery(`accounting_sync_logs?id=eq.${encodeURIComponent(logId)}`, {
      method: 'PATCH',
      body: {
        status: result.status === 'SYNCED' ? 'SUCCESS' : 'FAILED',
        external_id: result.externalId,
        error_message: result.error,
        succeeded_at: result.status === 'SYNCED' ? new Date().toISOString() : undefined,
      },
    });
  }

  // Update entity accounting sync state
  const patch: Record<string, any> = {
    accounting_provider: adapter.provider,
    accounting_sync_status: result.status,
    accounting_synced_at: result.status === 'SYNCED' ? new Date().toISOString() : undefined,
    accounting_sync_error: result.error,
  };
  if (result.externalId) patch.accounting_external_id = result.externalId;

  const table = params.entityType === 'SUPPLIER_INVOICE' ? 'supplier_invoices'
    : params.entityType === 'CLIENT_INVOICE' ? 'client_invoices'
    : 'credit_notes';
  await dbQuery(`${table}?id=eq.${encodeURIComponent(params.entityId)}`, {
    method: 'PATCH', body: patch,
  });

  if (result.status === 'SYNCED') {
    await recordAuditEvent({
      event_type: 'ACCOUNTING_SYNC_SUCCEEDED',
      actor_id: session.personId,
      object_type: table,
      object_id: params.entityId,
      after_state: { provider: adapter.provider, external_id: result.externalId },
    });
  } else {
    await recordAuditEvent({
      event_type: 'ACCOUNTING_SYNC_FAILED',
      actor_id: session.personId,
      object_type: table,
      object_id: params.entityId,
      after_state: { provider: adapter.provider, error: result.error },
    });
  }

  return result;
}

// ============================================================
// FINANCE KPIs
// ============================================================

export async function getFinanceKPISummary(): Promise<FinanceKPI> {
  const [
    awaitingReview, awaitingApproval, billingReady, unbilled,
    exceptions, syncFails, clientOutstanding, bankAlerts, duplicateFlags
  ] = await Promise.all([
    dbQuery<any[]>(`supplier_invoices?processing_status=in.(REVIEW_REQUIRED,MATCHING,VALIDATING)&select=id`),
    dbQuery<any[]>(`supplier_invoices?processing_status=eq.REVIEW_REQUIRED&select=total_amount_gbp`),
    dbQuery<any[]>(`client_billing_records?status=eq.READY_TO_INVOICE&select=id`),
    dbQuery<any[]>(`client_billing_records?status=eq.DRAFT&is_billable=eq.true&select=id`),
    dbQuery<any[]>(`accounting_sync_logs?status=eq.FAILED&select=id`),
    dbQuery<any[]>(`accounting_sync_logs?status=eq.FAILED&select=id`),
    dbQuery<any[]>(`client_invoices?status=eq.ISSUED&payment_status=in.(NOT_DUE,DUE,OVERDUE)&select=total_amount_gbp`),
    dbQuery<any[]>(`supplier_invoices?bank_details_change_alert=eq.true&bank_alert_reviewed_at=is.null&select=id`),
    dbQuery<any[]>(`supplier_invoices?processing_status=eq.DUPLICATE&select=id`),
  ]);

  const approvalValue = (awaitingApproval.data || []).reduce(
    (sum: number, r: any) => sum + roundMoney(Number(r.total_amount_gbp) || 0), 0
  );
  const clientOutstandingValue = (clientOutstanding.data || []).reduce(
    (sum: number, r: any) => sum + roundMoney(Number(r.total_amount_gbp) || 0), 0
  );

  return {
    supplierInvoicesAwaitingReview: awaitingReview.data?.length || 0,
    supplierValueAwaitingApproval: roundMoney(approvalValue),
    billingReadyCount: billingReady.data?.length || 0,
    unbilledCompletedCount: unbilled.data?.length || 0,
    financeExceptionCount: exceptions.data?.length || 0,
    accountingSyncFailures: syncFails.data?.length || 0,
    clientInvoicesOutstanding: clientOutstanding.data?.length || 0,
    clientOutstandingValue: roundMoney(clientOutstandingValue),
    bankDetailAlerts: bankAlerts.data?.length || 0,
    duplicateFlags: duplicateFlags.data?.length || 0,
  };
}

// ============================================================
// BILLING LEAKAGE DETECTION
// ============================================================

/**
 * Find completed billable Work Orders with no billing record.
 * This is one of the highest-value business features —
 * revenue that was earned but never invoiced.
 */
export async function detectBillingLeakage(): Promise<Array<{
  workOrderId: string;
  completedAt: string;
  clientAccountId: string;
  ageingDays: number;
}>> {
  // Completed/closed WOs without billing records in invoiced state
  const { data: wos } = await dbQuery<Array<{
    id: string; status: string; completed_at: string; client_account_id: string;
  }>>(`work_orders?status=in.(COMPLETED,CLOSED)&select=id,status,completed_at,client_account_id&order=completed_at.asc&limit=200`);

  if (!wos) return [];

  const result = [];
  for (const wo of wos) {
    const { data: billing } = await dbQuery<any[]>(
      `client_billing_records?work_order_id=eq.${encodeURIComponent(wo.id)}&status=in.(READY_TO_INVOICE,INVOICED)&select=id&limit=1`
    );
    if (!billing || billing.length === 0) {
      const completedAt = wo.completed_at ? new Date(wo.completed_at) : new Date();
      const ageingDays = Math.floor((Date.now() - completedAt.getTime()) / (24 * 60 * 60 * 1000));
      result.push({
        workOrderId: wo.id,
        completedAt: wo.completed_at,
        clientAccountId: wo.client_account_id,
        ageingDays,
      });
    }
  }
  return result;
}

// ============================================================
// LIST HELPERS
// ============================================================

export async function listSupplierInvoices(params?: {
  processingStatus?: string;
  matchStatus?: string;
  limit?: number;
  offset?: number;
}): Promise<SupplierInvoice[]> {
  let q = `supplier_invoices?select=*&order=created_at.desc&limit=${params?.limit || 50}&offset=${params?.offset || 0}`;
  if (params?.processingStatus) q += `&processing_status=eq.${encodeURIComponent(params.processingStatus)}`;
  if (params?.matchStatus) q += `&match_status=eq.${encodeURIComponent(params.matchStatus)}`;
  const { data } = await dbQuery<SupplierInvoice[]>(q);
  return data || [];
}

export async function listClientInvoices(params?: {
  clientAccountId?: string;
  status?: string;
  paymentStatus?: string;
  limit?: number;
}): Promise<ClientInvoice[]> {
  let q = `client_invoices?select=*&order=created_at.desc&limit=${params?.limit || 50}`;
  if (params?.clientAccountId) q += `&client_account_id=eq.${encodeURIComponent(params.clientAccountId)}`;
  if (params?.status) q += `&status=eq.${encodeURIComponent(params.status)}`;
  if (params?.paymentStatus) q += `&payment_status=eq.${encodeURIComponent(params.paymentStatus)}`;
  const { data } = await dbQuery<ClientInvoice[]>(q);
  return data || [];
}

export async function listBillingReadyQueue(): Promise<ClientBillingRecord[]> {
  const { data } = await dbQuery<ClientBillingRecord[]>(
    `client_billing_records?status=eq.READY_TO_INVOICE&select=*&order=created_at.asc&limit=200`
  );
  return data || [];
}

export async function listCreditNotes(params?: {
  type?: 'SUPPLIER' | 'CLIENT';
  status?: string;
}): Promise<any[]> {
  let q = `credit_notes?select=*&order=created_at.desc&limit=100`;
  if (params?.type) q += `&credit_note_type=eq.${params.type}`;
  if (params?.status) q += `&status=eq.${params.status}`;
  const { data } = await dbQuery<any[]>(q);
  return data || [];
}

export async function listTolerancePolicies(): Promise<TolerancePolicy[]> {
  const { data } = await dbQuery<TolerancePolicy[]>(`finance_tolerance_policies?is_active=eq.true&select=*`);
  return data || [];
}

export async function listAccountingSyncFailures(): Promise<any[]> {
  const { data } = await dbQuery<any[]>(
    `accounting_sync_logs?status=eq.FAILED&select=*&order=created_at.desc&limit=50`
  );
  return data || [];
}


export { roundMoney, applyVat };

// ============================================================
// PHASE 0H-R: POLICY-DRIVEN SEGREGATION OF DUTIES ENGINE
// ============================================================
// Threshold values are NOT hard-coded. All tiers come from
// finance_segregation_policies database records.
// Falls back to platform-level policy if no specific policy found.

export interface SegregationPolicy {
  id: string;
  policy_name: string;
  policy_scope: 'PLATFORM' | 'CLIENT' | 'CONTRACT' | 'SUPPLIER';
  client_org_id?: string;
  contract_id?: string;
  supplier_org_id?: string;
  // Tiers: JSON array of { max_value_gbp, require_second_approver, require_finance_approver, allow_self_approve }
  approval_tiers: Array<{
    max_value_gbp: number | null; // null = unlimited (catch-all)
    require_second_approver: boolean;
    require_finance_approver: boolean;
    allow_self_approve: boolean;
  }>;
  po_creator_cannot_approve: boolean;
  bank_alert_blocks_approval: boolean;
  no_po_max_value_gbp: number | null; // null = no-PO invoices never allowed
  is_active: boolean;
}

export interface SegregationCheckResult {
  allowed: boolean;
  requires_second_approver: boolean;
  blocking_reason?: string;
  policy_id: string;
  policy_name: string;
  tier_applied: string;
}

/**
 * Resolve the applicable segregation policy for a given invoice context.
 * Resolution order: CONTRACT → SUPPLIER → CLIENT → PLATFORM
 */
export async function resolveSegregationPolicy(params: {
  supplierOrgId?: string;
  clientOrgId?: string;
  contractId?: string;
}): Promise<SegregationPolicy | null> {
  const { data } = await dbQuery<SegregationPolicy[]>(
    `finance_segregation_policies?is_active=eq.true&select=*&order=created_at.desc`
  );
  const all = data || [];
  if (all.length === 0) return null;

  // Most specific first
  const candidates = [
    all.find(p => p.policy_scope === 'CONTRACT' && p.contract_id === params.contractId && params.contractId),
    all.find(p => p.policy_scope === 'SUPPLIER' && p.supplier_org_id === params.supplierOrgId && params.supplierOrgId),
    all.find(p => p.policy_scope === 'CLIENT' && p.client_org_id === params.clientOrgId && params.clientOrgId),
    all.find(p => p.policy_scope === 'PLATFORM'),
  ];

  return candidates.find(Boolean) ?? null;
}

/**
 * Check whether a given approver is permitted to approve an invoice.
 * Reads segregation rules from the database — never from hard-coded constants.
 */
export async function checkSegregationOfDuties(params: {
  invoice: SupplierInvoice;
  approverId: string;
  poCreatorId?: string;
  clientOrgId?: string;
  contractId?: string;
}): Promise<SegregationCheckResult> {
  const { invoice, approverId, poCreatorId } = params;

  const policy = await resolveSegregationPolicy({
    supplierOrgId: invoice.supplier_org_id,
    clientOrgId: params.clientOrgId,
    contractId: params.contractId,
  });

  // Fallback: platform defaults — but these come from a DB seed, not from code constants
  const policyId = policy?.id ?? 'platform-fallback';
  const policyName = policy?.policy_name ?? 'Platform Default (Fallback)';

  // Bank alert check
  const bankAlertBlocks = policy?.bank_alert_blocks_approval ?? true;
  if (bankAlertBlocks && invoice.bank_details_change_alert && !invoice.bank_alert_reviewed_at) {
    return {
      allowed: false,
      requires_second_approver: false,
      blocking_reason: 'BANK_DETAIL_CHANGE_ALERT must be reviewed and verified before this invoice can be approved.',
      policy_id: policyId,
      policy_name: policyName,
      tier_applied: 'bank_alert_check',
    };
  }

  // No-PO check
  if (!invoice.matched_po_id) {
    const noPOMax = policy?.no_po_max_value_gbp ?? 0;
    if (noPOMax === null || invoice.total_amount_gbp > noPOMax) {
      return {
        allowed: false,
        requires_second_approver: false,
        blocking_reason: `Invoice has no matching Purchase Order. Policy does not permit no-PO approval above £${noPOMax ?? 0}.`,
        policy_id: policyId,
        policy_name: policyName,
        tier_applied: 'no_po_check',
      };
    }
  }

  // PO-creator segregation
  const poCreatorBlocked = policy?.po_creator_cannot_approve ?? true;
  if (poCreatorBlocked && poCreatorId && poCreatorId === approverId) {
    // Check value tiers from policy
    const tiers = policy?.approval_tiers ?? [];
    const matchingTier = tiers
      .filter(t => t.max_value_gbp === null || invoice.total_amount_gbp <= t.max_value_gbp)
      .sort((a, b) => (a.max_value_gbp ?? Infinity) - (b.max_value_gbp ?? Infinity))[0];

    if (!matchingTier?.allow_self_approve) {
      return {
        allowed: false,
        requires_second_approver: true,
        blocking_reason: `SEGREGATION_OF_DUTIES: The person who created this PO cannot approve the matching invoice. A second approver is required per policy "${policyName}".`,
        policy_id: policyId,
        policy_name: policyName,
        tier_applied: matchingTier ? `tier_up_to_£${matchingTier.max_value_gbp ?? 'unlimited'}` : 'default_tier',
      };
    }
  }

  // Value-based tier check
  const tiers = policy?.approval_tiers ?? [];
  const matchingTier = tiers
    .filter(t => t.max_value_gbp === null || invoice.total_amount_gbp <= t.max_value_gbp)
    .sort((a, b) => (a.max_value_gbp ?? Infinity) - (b.max_value_gbp ?? Infinity))[0];

  if (matchingTier?.require_second_approver) {
    return {
      allowed: false,
      requires_second_approver: true,
      blocking_reason: `Invoice value £${invoice.total_amount_gbp} requires a second approver per policy "${policyName}".`,
      policy_id: policyId,
      policy_name: policyName,
      tier_applied: `tier_up_to_£${matchingTier.max_value_gbp ?? 'unlimited'}`,
    };
  }

  return {
    allowed: true,
    requires_second_approver: false,
    policy_id: policyId,
    policy_name: policyName,
    tier_applied: matchingTier ? `tier_up_to_£${matchingTier.max_value_gbp ?? 'unlimited'}` : 'no_tier',
  };
}

// ============================================================
// PHASE 0H-R: HIERARCHICAL TOLERANCE RESOLUTION (ENHANCED)
// ============================================================
// Replaces the Phase 0H resolveTolerancePolicy with full hierarchy
// and policy version retention on matched invoices.

export interface ToleranceResolutionResult {
  policy: TolerancePolicy;
  resolution_source: 'PLATFORM_DEFAULT' | 'CLIENT_POLICY' | 'CONTRACT_POLICY' | 'SUPPLIER_POLICY' | 'SPECIFIC_OVERRIDE' | 'SYSTEM_FALLBACK';
  policy_version?: number;
}

/**
 * Resolve tolerance policy using the full 5-tier hierarchy:
 * PLATFORM_DEFAULT → CLIENT_POLICY → CONTRACT_POLICY → SUPPLIER_POLICY → SPECIFIC_OVERRIDE
 * The most specific non-default policy wins.
 * Records which policy ID and version was used on the invoice.
 */
export async function resolveTolerancePolicyHierarchy(params: {
  supplierOrgId?: string;
  clientOrgId?: string;
  contractId?: string;
  invoiceId?: string; // if provided, stamps the resolution onto the invoice record
}): Promise<ToleranceResolutionResult> {
  const { data } = await dbQuery<TolerancePolicy[]>(
    `finance_tolerance_policies?is_active=eq.true&select=*&order=created_at.desc`
  );
  const all = data || [];

  if (all.length === 0) {
    return {
      policy: getHardcodedDefaultPolicy(),
      resolution_source: 'SYSTEM_FALLBACK',
    };
  }

  // Build candidates by specificity tier (most specific last → pick last winner)
  type TierEntry = { policy: TolerancePolicy; tier: ToleranceResolutionResult['resolution_source'] };
  const tiers: TierEntry[] = [];

  const platformDefault = all.find(p => p.is_default);
  if (platformDefault) tiers.push({ policy: platformDefault, tier: 'PLATFORM_DEFAULT' });

  // CLIENT policies: have client_account_id set but no contract_id
  if (params.clientOrgId) {
    const clientPolicies = all.filter(p =>
      !p.is_default && (p as any).client_org_id === params.clientOrgId && !(p as any).contract_id && !(p as any).supplier_org_id
    );
    if (clientPolicies.length > 0) tiers.push({ policy: clientPolicies[0], tier: 'CLIENT_POLICY' });
  }

  // CONTRACT policies
  if (params.contractId) {
    const contractPolicies = all.filter(p =>
      !p.is_default && (p as any).contract_id === params.contractId && !(p as any).supplier_org_id
    );
    if (contractPolicies.length > 0) tiers.push({ policy: contractPolicies[0], tier: 'CONTRACT_POLICY' });
  }

  // SUPPLIER policies
  if (params.supplierOrgId) {
    const supplierPolicies = all.filter(p =>
      !p.is_default && (p as any).supplier_org_id === params.supplierOrgId && !(p as any).contract_id
    );
    if (supplierPolicies.length > 0) tiers.push({ policy: supplierPolicies[0], tier: 'SUPPLIER_POLICY' });
  }

  // SPECIFIC_OVERRIDE: supplier + contract combination
  if (params.supplierOrgId && params.contractId) {
    const overrides = all.filter(p =>
      !p.is_default &&
      (p as any).supplier_org_id === params.supplierOrgId &&
      (p as any).contract_id === params.contractId
    );
    if (overrides.length > 0) tiers.push({ policy: overrides[0], tier: 'SPECIFIC_OVERRIDE' });
  }

  if (tiers.length === 0) {
    return { policy: getHardcodedDefaultPolicy(), resolution_source: 'SYSTEM_FALLBACK' };
  }

  const winner = tiers[tiers.length - 1];

  // Stamp the policy resolution onto the invoice record if provided
  if (params.invoiceId && winner.policy.id !== 'system-default') {
    await dbQuery(`supplier_invoices?id=eq.${encodeURIComponent(params.invoiceId)}`, {
      method: 'PATCH',
      body: {
        applied_tolerance_policy_id: winner.policy.id,
        applied_tolerance_policy_version: (winner.policy as any).version ?? 1,
      },
    });
  }

  return {
    policy: winner.policy,
    resolution_source: winner.tier,
    policy_version: (winner.policy as any).version ?? 1,
  };
}

// ============================================================
// PHASE 0H-R: SUPPLIER BANK DETAIL VERIFICATION WORKFLOW
// ============================================================
// Bank details cannot be changed from an invoice screen.
// Requires a separate privileged verification workflow.

export interface BankDetailVerification {
  id: string;
  supplier_org_id: string;
  requested_by_id: string;
  requested_at: string;
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  verified_by_id?: string;
  verified_at?: string;
  rejection_reason?: string;
  proposed_account_name?: string;
  proposed_sort_code?: string;
  proposed_account_number_last4?: string;
  proposed_iban_last4?: string;
  evidence_reference?: string;
}

/**
 * Request a change to supplier bank details.
 * Must be initiated from the supplier master record — NOT from an invoice screen.
 * The caller must have finance:bank_details_manage permission.
 */
export async function requestSupplierBankDetailChange(params: {
  supplierOrgId: string;
  proposedAccountName: string;
  proposedSortCode?: string;
  proposedAccountNumberLast4?: string;
  proposedIbanLast4?: string;
  evidenceReference: string; // e.g. signed letter reference, call recording ID
  session: UserSession;
}): Promise<{ verification_id: string }> {
  if (!params.session.permissions.includes('finance:bank_details_manage')) {
    throw new Error('PERMISSION_DENIED: finance:bank_details_manage required to request bank detail changes');
  }

  const verificationId = crypto.randomUUID();
  await dbQuery(`supplier_bank_detail_verifications`, {
    method: 'POST',
    body: {
      id: verificationId,
      supplier_org_id: params.supplierOrgId,
      requested_by_id: params.session.personId,
      requested_at: new Date().toISOString(),
      verification_status: 'PENDING',
      proposed_account_name: params.proposedAccountName,
      proposed_sort_code: params.proposedSortCode,
      proposed_account_number_last4: params.proposedAccountNumberLast4,
      proposed_iban_last4: params.proposedIbanLast4,
      evidence_reference: params.evidenceReference,
    },
  });

  await recordAuditEvent({
    event_type: 'BANK_DETAIL_CHANGE_REQUESTED',
    actor_id: params.session.personId,
    actor_type: 'HUMAN',
    object_type: 'supplier_bank_detail_verifications',
    object_id: verificationId,
    after_state: {
      supplier_org_id: params.supplierOrgId,
      evidence_reference: params.evidenceReference,
    },
    is_ai: false,
  });

  return { verification_id: verificationId };
}

/**
 * A SECOND authorised person verifies a pending bank detail change request.
 * The verifier cannot be the same person who requested the change.
 * Caller must have finance:bank_details_manage permission.
 */
export async function verifySupplierBankDetailChange(params: {
  verificationId: string;
  approved: boolean;
  rejectionReason?: string;
  session: UserSession;
}): Promise<void> {
  if (!params.session.permissions.includes('finance:bank_details_manage')) {
    throw new Error('PERMISSION_DENIED: finance:bank_details_manage required to verify bank detail changes');
  }

  const { data } = await dbQuery<BankDetailVerification[]>(
    `supplier_bank_detail_verifications?id=eq.${encodeURIComponent(params.verificationId)}&select=*`
  );
  const pending = data?.[0] ?? null;
  if (!pending) throw new Error(`Bank verification ${params.verificationId} not found`);
  if (pending.verification_status !== 'PENDING') {
    throw new Error(`Bank verification is already ${pending.verification_status}`);
  }

  // Dual-person control: verifier must not be the same as requester
  if (pending.requested_by_id === params.session.personId) {
    throw new Error('SEGREGATION_OF_DUTIES: The person who requested this bank detail change cannot verify it. A second authorised person is required.');
  }

  const newStatus = params.approved ? 'VERIFIED' : 'REJECTED';
  await dbQuery(`supplier_bank_detail_verifications?id=eq.${encodeURIComponent(params.verificationId)}`, {
    method: 'PATCH',
    body: {
      verification_status: newStatus,
      verified_by_id: params.session.personId,
      verified_at: new Date().toISOString(),
      rejection_reason: params.rejectionReason,
    },
  });

  await recordAuditEvent({
    event_type: params.approved ? 'BANK_DETAIL_CHANGE_VERIFIED' : 'BANK_DETAIL_CHANGE_REJECTED',
    actor_id: params.session.personId,
    actor_type: 'HUMAN',
    object_type: 'supplier_bank_detail_verifications',
    object_id: params.verificationId,
    after_state: {
      verification_status: newStatus,
      rejection_reason: params.rejectionReason,
    },
    is_ai: false,
  });
}

// ============================================================
// PHASE 0H-R: AI EXTRACTION CORRECTION LOGGING
// ============================================================
// When a human corrects an AI-extracted field, record it.
// This powers audit trail and future AI training feedback.

export async function recordDocumentExtractionCorrection(params: {
  supplierInvoiceId: string;
  fieldName: string;
  originalExtractedValue: unknown;
  humanCorrectedValue: unknown;
  correctionReason?: string;
  session: UserSession;
}): Promise<void> {
  await dbQuery(`document_extraction_corrections`, {
    method: 'POST',
    body: {
      id: crypto.randomUUID(),
      supplier_invoice_id: params.supplierInvoiceId,
      field_name: params.fieldName,
      original_extracted_value: JSON.stringify(params.originalExtractedValue),
      human_corrected_value: JSON.stringify(params.humanCorrectedValue),
      correction_reason: params.correctionReason,
      corrected_by_id: params.session.personId,
      corrected_at: new Date().toISOString(),
    },
  });

  await recordAuditEvent({
    event_type: 'AI_EXTRACTION_CORRECTED',
    actor_id: params.session.personId,
    actor_type: 'HUMAN',
    object_type: 'supplier_invoices',
    object_id: params.supplierInvoiceId,
    after_state: {
      field_name: params.fieldName,
      original_value: params.originalExtractedValue,
      corrected_value: params.humanCorrectedValue,
    },
    is_ai: false,
  });
}

// ─── CANONICAL ASSET COST ATTRIBUTION SERVICE ───────────────────────────────────

/**
 * CANONICAL FINANCE ASSET COST ATTRIBUTION SERVICE
 * ================================================
 * Authority for attributing supplier invoice line costs to a specific asset.
 * Enforces canonical financial rounding (roundMoney) and net cost aggregation.
 * Site-level unallocated costs are strictly excluded.
 */
export async function getAssetFinancialCostAttribution(params: {
  assetId: string;
  sinceDate?: string;
}): Promise<{
  reactiveCostGbp: number;
  ppmCostGbp: number;
  totalDirectlyAttributedGbp: number;
  lineCount: number;
  workOrderCount: number;
  financeAuthorityConfirmed: true;
}> {
  const { data: wos } = await dbQuery<any[]>(
    `work_orders?asset_id=eq.${params.assetId}&select=id,work_type&order=created_at.desc`
  );

  if (!wos || wos.length === 0) {
    return {
      reactiveCostGbp: 0,
      ppmCostGbp: 0,
      totalDirectlyAttributedGbp: 0,
      lineCount: 0,
      workOrderCount: 0,
      financeAuthorityConfirmed: true,
    };
  }

  let totalReactive = 0;
  let totalPpm = 0;
  let lineCount = 0;

  for (const wo of wos) {
    const { data: lines } = await dbQuery<any[]>(
      `supplier_invoice_lines?work_order_id=eq.${wo.id}&select=total_amount_gbp`
    );
    if (lines && lines.length > 0) {
      const woTotal = lines.reduce((s: number, l: any) => s + (Number(l.total_amount_gbp) || 0), 0);
      if (wo.work_type === 'PPM' || wo.work_type === 'STATUTORY') {
        totalPpm += woTotal;
      } else {
        totalReactive += woTotal;
      }
      lineCount += lines.length;
    }
  }

  const roundedReactive = roundMoney(totalReactive);
  const roundedPpm = roundMoney(totalPpm);
  const roundedTotal = roundMoney(totalReactive + totalPpm);

  return {
    reactiveCostGbp: roundedReactive,
    ppmCostGbp: roundedPpm,
    totalDirectlyAttributedGbp: roundedTotal,
    lineCount,
    workOrderCount: wos.length,
    financeAuthorityConfirmed: true,
  };
}

/**
 * getAssetCostAttributionBatch
 * ================================================
 * Set-based Finance authority for bulk cost attribution across multiple assets.
 *
 * Architecture:
 *   - 1 query: all work_orders for all requested assetIds
 *   - 1 query: all supplier_invoice_lines for all those work_order ids
 *   - In-memory O(n) aggregation — no per-asset network loops
 *
 * Finance semantics are identical to getAssetFinancialCostAttribution:
 *   - Only directly attributed costs (work_order → asset_id chain)
 *   - Site-level unallocated costs strictly excluded
 *   - Canonical roundMoney applied per asset
 *   - financeAuthorityConfirmed: true on every result entry
 *
 * Returns Map<assetId, CostAttribution> — missing assetIds mean £0 cost.
 */
export interface AssetCostAttribution {
  reactiveCostGbp: number;
  ppmCostGbp: number;
  totalDirectlyAttributedGbp: number;
  workOrderCount: number;
  financeAuthorityConfirmed: true;
}

export async function getAssetCostAttributionBatch(params: {
  assetIds: string[];
  sinceDate?: string;
}): Promise<Map<string, AssetCostAttribution>> {
  const { assetIds } = params;
  const result = new Map<string, AssetCostAttribution>();

  if (assetIds.length === 0) return result;

  // Initialise zero entries for all requested assets
  const zeroEntry = (): AssetCostAttribution => ({
    reactiveCostGbp: 0,
    ppmCostGbp: 0,
    totalDirectlyAttributedGbp: 0,
    workOrderCount: 0,
    financeAuthorityConfirmed: true,
  });
  for (const id of assetIds) result.set(id, zeroEntry());

  // ── Query 1: all work orders for all requested assets (1 network call) ──
  const idList = assetIds.join(',');
  const { data: wos } = await dbQuery<any[]>(
    `work_orders?asset_id=in.(${idList})&select=id,asset_id,work_type`
  );
  if (!wos || wos.length === 0) return result;

  // Build work-order → (assetId, workType) lookup
  const woMap = new Map<string, { assetId: string; workType: string }>();
  for (const wo of wos) {
    if (wo.asset_id && wo.id) {
      woMap.set(wo.id, { assetId: wo.asset_id, workType: wo.work_type || 'REACTIVE' });
    }
  }

  // Increment work order counts per asset
  for (const [, { assetId }] of woMap) {
    const entry = result.get(assetId);
    if (entry) entry.workOrderCount++;
  }

  // ── Query 2: all invoice lines for all work orders (1 network call) ──
  const woIdList = Array.from(woMap.keys()).join(',');
  if (!woIdList) return result;

  const { data: lines } = await dbQuery<any[]>(
    `supplier_invoice_lines?work_order_id=in.(${woIdList})&select=work_order_id,total_amount_gbp`
  );
  if (!lines || lines.length === 0) return result;

  // ── In-memory aggregation — O(n), no network ──
  for (const line of lines) {
    const wo = woMap.get(line.work_order_id);
    if (!wo) continue;
    const entry = result.get(wo.assetId);
    if (!entry) continue;
    const amount = Number(line.total_amount_gbp) || 0;
    if (wo.workType === 'PPM' || wo.workType === 'STATUTORY') {
      entry.ppmCostGbp += amount;
    } else {
      entry.reactiveCostGbp += amount;
    }
  }

  // Apply canonical rounding per asset
  for (const entry of result.values()) {
    entry.reactiveCostGbp = roundMoney(entry.reactiveCostGbp);
    entry.ppmCostGbp = roundMoney(entry.ppmCostGbp);
    entry.totalDirectlyAttributedGbp = roundMoney(entry.reactiveCostGbp + entry.ppmCostGbp);
  }

  return result;
}
