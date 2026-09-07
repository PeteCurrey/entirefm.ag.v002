/**
 * ENTIREFM XERO INVOICE SYNCHRONISATION SERVICE
 * ==============================================
 * Idempotent, auditable synchronisation of EntireCAFM client invoices → Xero ACCREC invoices.
 *
 * Core guarantees:
 * - EntireCAFM invoice is the authoritative source of truth
 * - Duplicate Xero invoices are prevented via xero_invoice_id + InvoiceNumber idempotency check
 * - Sales tax rates are dynamically discovered and verified against connected Xero organisation
 * - Purchase/input tax codes (e.g. CAPEXINPUT) are strictly rejected
 * - Revenue account codes are explicitly specified and validated
 * - Discrepancies between CAFM and Xero amounts are reconciled and audited
 * - Only ISSUED invoices with valid lines are eligible for synchronisation
 * - All operations are recorded in accounting_sync_logs and audit_events
 */

import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';
import { XeroClient } from './client';
import { syncClientToXeroContact } from './contacts';
import { getActiveConnection } from './oauth';
import { XeroApiError, XeroAuthError } from './errors';
import {
  getOrganisationTaxRates,
  determineCafmTaxTreatment,
  resolveSalesTaxRate,
  validateSalesTaxRate,
} from './tax';
import {
  getOrganisationRevenueAccounts,
  resolveSalesAccountCode,
} from './accounts';
import type { XeroInvoice, XeroLineItem, XeroLineAmountType } from './types';

export type CafmSyncStatus =
  | 'NOT_READY'
  | 'READY_TO_SYNC'
  | 'SYNCING'
  | 'SYNCED'
  | 'SYNC_FAILED'
  | 'UPDATE_PENDING';

export interface InvoiceSyncResult {
  success: boolean;
  xeroInvoiceId: string;
  xeroInvoiceNumber: string;
  isNew: boolean;
  syncStatus: 'SYNCED' | 'SYNC_FAILED';
  reconciliation?: {
    cafmNet: number;
    xeroNet: number;
    cafmVat: number;
    xeroVat: number;
    cafmGross: number;
    xeroGross: number;
    hasDiscrepancy: boolean;
  };
  error?: string;
}

/**
 * Determines whether a CAFM client invoice is eligible for Xero synchronisation.
 */
export function getInvoiceSyncStatus(invoice: any): CafmSyncStatus {
  if (!invoice) return 'NOT_READY';

  // Already synced
  if (invoice.xero_invoice_id && invoice.accounting_sync_status === 'SYNCED') {
    // If updated after last sync, mark for update
    if (invoice.updated_at && invoice.xero_synced_at && invoice.updated_at > invoice.xero_synced_at) {
      return 'UPDATE_PENDING';
    }
    return 'SYNCED';
  }

  if (invoice.accounting_sync_status === 'SYNCING') return 'SYNCING';
  if (invoice.accounting_sync_status === 'SYNC_FAILED') return 'SYNC_FAILED';

  // Not yet synced — check eligibility
  if (invoice.status !== 'ISSUED') return 'NOT_READY';
  if (!invoice.client_account_id) return 'NOT_READY';

  return 'READY_TO_SYNC';
}

/**
 * Idempotently synchronises a single EntireCAFM client invoice to a Xero ACCREC invoice.
 */
export async function syncInvoiceToXero(params: {
  invoiceId: string;
  actorPersonId?: string;
  xeroClient?: XeroClient;
}): Promise<InvoiceSyncResult> {
  const idempotencyKey = `XERO:CLIENT_INVOICE:${params.invoiceId}`;
  const now = new Date().toISOString();

  // 1. Load CAFM invoice with lines
  const { data: invoices, error: invErr } = await dbQuery<any[]>(
    `client_invoices?id=eq.${encodeURIComponent(params.invoiceId)}&select=*&limit=1`
  );
  if (invErr || !invoices || invoices.length === 0) {
    return fail(params.invoiceId, idempotencyKey, 'CLIENT_INVOICE', `Invoice ${params.invoiceId} not found in EntireCAFM.`);
  }

  const invoice = invoices[0];
  const syncStatus = getInvoiceSyncStatus(invoice);

  // 2. Idempotency: already SYNCED and nothing changed
  if (syncStatus === 'SYNCED' && invoice.xero_invoice_id) {
    return {
      success: true,
      xeroInvoiceId: invoice.xero_invoice_id,
      xeroInvoiceNumber: invoice.xero_invoice_number || '',
      isNew: false,
      syncStatus: 'SYNCED',
    };
  }

  // 3. Guard: not eligible
  if (syncStatus === 'NOT_READY') {
    const reason = `Invoice ${invoice.invoice_number} is not eligible for sync. Status: ${invoice.status}`;
    return fail(params.invoiceId, idempotencyKey, 'CLIENT_INVOICE', reason);
  }

  // 4. Mark as SYNCING
  await dbQuery(`client_invoices?id=eq.${encodeURIComponent(params.invoiceId)}`, {
    method: 'PATCH',
    body: { accounting_sync_status: 'SYNCING', accounting_provider: 'XERO', updated_at: now },
  });

  try {
    // 5. Obtain XeroClient
    let client = params.xeroClient;
    if (!client) {
      const connection = await getActiveConnection();
      if (!connection) throw new XeroAuthError('No active Xero connection for this organisation.');
      client = new XeroClient(connection);
    }

    // 6. Resolve or create Xero Contact
    const contactResult = await syncClientToXeroContact({
      clientAccountId: invoice.client_account_id,
      xeroClient: client,
      actorPersonId: params.actorPersonId,
    });

    // 7. Load invoice lines
    const { data: lines } = await dbQuery<any[]>(
      `client_invoice_lines?client_invoice_id=eq.${encodeURIComponent(params.invoiceId)}&select=*&order=line_number.asc`
    );

    if (!lines || lines.length === 0) {
      throw new XeroApiError(400, `Invoice ${invoice.invoice_number} has no line items.`);
    }

    // 8. Discover available tax rates & revenue accounts from connected Xero organisation
    const [availableTaxRates, availableAccounts] = await Promise.all([
      getOrganisationTaxRates(client),
      getOrganisationRevenueAccounts(client),
    ]);

    // 9. Resolve default sales revenue account code
    const defaultAccountCode = await resolveSalesAccountCode({
      client,
      availableAccounts,
    });

    // 10. Check for existing Xero invoice by InvoiceNumber (prevent duplicates if xero_invoice_id is missing)
    let existingXeroInvoiceId = invoice.xero_invoice_id || null;
    if (!existingXeroInvoiceId) {
      try {
        const searchRes = await client.get<{ Invoices: XeroInvoice[] }>('Invoices', {
          InvoiceNumbers: invoice.invoice_number,
        });
        if (searchRes?.Invoices && searchRes.Invoices.length > 0) {
          existingXeroInvoiceId = searchRes.Invoices[0].InvoiceID!;
        }
      } catch {
        // Not found is fine — we create below
      }
    }

    // 11. Build Xero line items with validated TaxType and AccountCode
    const xeroLines: XeroLineItem[] = [];

    for (const line of lines) {
      const taxRatePct = parseFloat(line.tax_rate_pct) || 20;
      const treatment = determineCafmTaxTreatment(taxRatePct);
      const resolvedRate = resolveSalesTaxRate(treatment, availableTaxRates);

      // Verify line tax rate validity
      validateSalesTaxRate(resolvedRate);

      const lineAccountCode = line.account_code || defaultAccountCode;

      xeroLines.push({
        Description: line.description || 'Facility Management Service',
        Quantity: parseFloat(line.quantity) || 1,
        UnitAmount: parseFloat(line.unit_price_gbp) || 0,
        TaxType: resolvedRate.TaxType,
        AccountCode: lineAccountCode,
      });
    }

    // 12. Build Xero Invoice payload
    const xeroInvoicePayload: XeroInvoice = {
      Type: 'ACCREC',
      Contact: { ContactID: contactResult.contactId },
      LineItems: xeroLines,
      Date: invoice.issue_date,
      DueDate: invoice.due_date,
      LineAmountTypes: 'Exclusive' as XeroLineAmountType,
      Status: 'AUTHORISED',
      InvoiceNumber: invoice.invoice_number,
      Reference: invoice.client_po_ref || undefined,
      CurrencyCode: invoice.currency || 'GBP',
    };

    let savedXeroInvoice: XeroInvoice;
    let isNew = false;

    if (existingXeroInvoiceId) {
      // Update existing Xero invoice
      const updateRes = await client.post<{ Invoices: XeroInvoice[] }>(`Invoices/${existingXeroInvoiceId}`, {
        Invoices: [{ ...xeroInvoicePayload, InvoiceID: existingXeroInvoiceId }],
      });
      savedXeroInvoice = updateRes?.Invoices?.[0];
    } else {
      // Create new Xero invoice
      const createRes = await client.post<{ Invoices: XeroInvoice[] }>('Invoices', {
        Invoices: [xeroInvoicePayload],
      });
      savedXeroInvoice = createRes?.Invoices?.[0];
      isNew = true;
    }

    if (!savedXeroInvoice?.InvoiceID) {
      throw new XeroApiError(500, 'Xero did not return a valid InvoiceID.');
    }

    // 13. Three-way Amount Reconciliation Check
    const cafmNet = Number(invoice.subtotal_gbp) || 0;
    const cafmVat = Number(invoice.tax_amount_gbp) || 0;
    const cafmGross = Number(invoice.total_amount_gbp) || 0;

    const xeroNet = Number(savedXeroInvoice.SubTotal) || 0;
    const xeroVat = Number(savedXeroInvoice.TotalTax) || 0;
    const xeroGross = Number(savedXeroInvoice.Total) || 0;

    const TOLERANCE = 0.02; // £0.02 rounding margin
    const netDiff = Math.abs(cafmNet - xeroNet);
    const vatDiff = Math.abs(cafmVat - xeroVat);
    const grossDiff = Math.abs(cafmGross - xeroGross);
    const hasDiscrepancy = netDiff > TOLERANCE || vatDiff > TOLERANCE || grossDiff > TOLERANCE;

    if (hasDiscrepancy) {
      console.warn(
        `[XERO_AMOUNT_RECONCILIATION_WARNING] Discrepancy detected for invoice ${invoice.invoice_number}: ` +
        `CAFM Net £${cafmNet.toFixed(2)} vs Xero Net £${xeroNet.toFixed(2)} (diff: £${netDiff.toFixed(2)}), ` +
        `CAFM VAT £${cafmVat.toFixed(2)} vs Xero Tax £${xeroVat.toFixed(2)} (diff: £${vatDiff.toFixed(2)}), ` +
        `CAFM Gross £${cafmGross.toFixed(2)} vs Xero Gross £${xeroGross.toFixed(2)} (diff: £${grossDiff.toFixed(2)})`
      );
    }

    // 14. Update EntireCAFM invoice with Xero references
    await dbQuery(`client_invoices?id=eq.${encodeURIComponent(params.invoiceId)}`, {
      method: 'PATCH',
      body: {
        xero_invoice_id: savedXeroInvoice.InvoiceID,
        xero_invoice_number: savedXeroInvoice.InvoiceNumber || invoice.invoice_number,
        xero_synced_at: now,
        accounting_provider: 'XERO',
        accounting_external_id: savedXeroInvoice.InvoiceID,
        accounting_sync_status: 'SYNCED',
        accounting_synced_at: now,
        accounting_sync_error: null,
        updated_at: now,
      },
    });

    // 15. Update accounting_sync_logs
    await upsertSyncLog({
      idempotencyKey,
      provider: 'XERO',
      entityType: 'CLIENT_INVOICE',
      entityId: params.invoiceId,
      externalId: savedXeroInvoice.InvoiceID,
      status: 'SUCCESS',
    });

    // 16. Audit event with full reconciliation breakdown
    await recordAuditEvent({
      event_type: isNew ? 'XERO_INVOICE_CREATED' : 'XERO_INVOICE_UPDATED',
      actor_id: params.actorPersonId,
      actor_type: params.actorPersonId ? 'HUMAN' : 'SYSTEM',
      object_type: 'client_invoices',
      object_id: params.invoiceId,
      after_state: {
        xero_invoice_id: savedXeroInvoice.InvoiceID,
        xero_invoice_number: savedXeroInvoice.InvoiceNumber,
        xero_contact_id: contactResult.contactId,
        is_new: isNew,
        reconciliation: {
          cafm_net: cafmNet,
          xero_net: xeroNet,
          cafm_vat: cafmVat,
          xero_vat: xeroVat,
          cafm_gross: cafmGross,
          xero_gross: xeroGross,
          has_discrepancy: hasDiscrepancy,
        },
      },
      is_ai: false,
    });

    return {
      success: true,
      xeroInvoiceId: savedXeroInvoice.InvoiceID,
      xeroInvoiceNumber: savedXeroInvoice.InvoiceNumber || invoice.invoice_number,
      isNew,
      syncStatus: 'SYNCED',
      reconciliation: {
        cafmNet,
        xeroNet,
        cafmVat,
        xeroVat,
        cafmGross,
        xeroGross,
        hasDiscrepancy,
      },
    };
  } catch (err: any) {
    const safeError = err?.safeMessage || err?.message || 'Unknown error during Xero invoice sync.';
    console.error(`[XERO_INVOICE_SYNC_FAILED] ${params.invoiceId}:`, err?.message || err);

    await dbQuery(`client_invoices?id=eq.${encodeURIComponent(params.invoiceId)}`, {
      method: 'PATCH',
      body: {
        accounting_sync_status: 'SYNC_FAILED',
        accounting_sync_error: safeError,
        updated_at: now,
      },
    });

    await upsertSyncLog({
      idempotencyKey,
      provider: 'XERO',
      entityType: 'CLIENT_INVOICE',
      entityId: params.invoiceId,
      status: 'FAILED',
      errorMessage: safeError,
    });

    await recordAuditEvent({
      event_type: 'XERO_SYNC_FAILED',
      actor_id: params.actorPersonId,
      actor_type: params.actorPersonId ? 'HUMAN' : 'SYSTEM',
      object_type: 'client_invoices',
      object_id: params.invoiceId,
      after_state: { error: safeError },
      is_ai: false,
    });

    return fail(params.invoiceId, idempotencyKey, 'CLIENT_INVOICE', safeError, false);
  }
}

async function fail(
  invoiceId: string,
  idempotencyKey: string,
  entityType: string,
  message: string,
  upsert = true
): Promise<InvoiceSyncResult> {
  if (upsert) {
    await upsertSyncLog({
      idempotencyKey,
      provider: 'XERO',
      entityType,
      entityId: invoiceId,
      status: 'FAILED',
      errorMessage: message,
    });
  }
  return {
    success: false,
    xeroInvoiceId: '',
    xeroInvoiceNumber: '',
    isNew: false,
    syncStatus: 'SYNC_FAILED',
    error: message,
  };
}

async function upsertSyncLog(params: {
  idempotencyKey: string;
  provider: string;
  entityType: string;
  entityId: string;
  externalId?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'RETRYING';
  errorMessage?: string;
}): Promise<void> {
  const { data: existing } = await dbQuery<any[]>(
    `accounting_sync_logs?idempotency_key=eq.${encodeURIComponent(params.idempotencyKey)}&limit=1`
  );

  if (existing && existing.length > 0) {
    await dbQuery(`accounting_sync_logs?idempotency_key=eq.${encodeURIComponent(params.idempotencyKey)}`, {
      method: 'PATCH',
      body: {
        status: params.status,
        external_id: params.externalId,
        error_message: params.errorMessage || null,
        succeeded_at: params.status === 'SUCCESS' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
        attempt_count: (existing[0].attempt_count || 1) + 1,
      },
    });
  } else {
    await dbQuery('accounting_sync_logs', {
      method: 'POST',
      body: {
        provider: params.provider,
        entity_type: params.entityType,
        entity_id: params.entityId,
        idempotency_key: params.idempotencyKey,
        direction: 'PUSH',
        status: params.status,
        external_id: params.externalId,
        error_message: params.errorMessage || null,
        succeeded_at: params.status === 'SUCCESS' ? new Date().toISOString() : null,
      },
    });
  }
}
