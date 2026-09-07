/**
 * ENTIREFM XERO PAYMENT RECONCILIATION SERVICE
 * =============================================
 * Pulls verified payment state from Xero and reconciles it back to EntireCAFM invoices.
 *
 * Critical rule: Payment status in EntireCAFM is DERIVED from verified Xero data only.
 * The frontend cannot arbitrarily mark an invoice as paid — only confirmed Xero data propagates.
 */

import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';
import { XeroClient } from './client';
import { getActiveConnection } from './oauth';
import { XeroAuthError } from './errors';
import type { XeroInvoice } from './types';

export interface PaymentReconciliationResult {
  invoiceId: string;
  xeroInvoiceId: string;
  newPaymentStatus: string;
  previousPaymentStatus: string;
  amountPaid?: number;
  amountDue?: number;
  paymentReference?: string;
  paidAt?: string;
  updated: boolean;
}

/**
 * Reconciles payment state for a single EntireCAFM invoice against verified Xero data.
 */
export async function reconcileInvoicePayment(params: {
  invoiceId: string;
  xeroClient?: XeroClient;
  actorPersonId?: string;
}): Promise<PaymentReconciliationResult> {
  // 1. Load CAFM invoice
  const { data: invoices } = await dbQuery<any[]>(
    `client_invoices?id=eq.${encodeURIComponent(params.invoiceId)}&select=*&limit=1`
  );

  if (!invoices || invoices.length === 0) {
    throw new Error(`Invoice ${params.invoiceId} not found.`);
  }

  const invoice = invoices[0];

  if (!invoice.xero_invoice_id) {
    return {
      invoiceId: params.invoiceId,
      xeroInvoiceId: '',
      newPaymentStatus: invoice.payment_status,
      previousPaymentStatus: invoice.payment_status,
      updated: false,
    };
  }

  // 2. Obtain Xero client
  let client = params.xeroClient;
  if (!client) {
    const connection = await getActiveConnection();
    if (!connection) throw new XeroAuthError('No active Xero connection found.');
    client = new XeroClient(connection);
  }

  // 3. Fetch Xero invoice payment status
  const xeroRes = await client.get<{ Invoices: XeroInvoice[] }>(
    `Invoices/${encodeURIComponent(invoice.xero_invoice_id)}`
  );

  if (!xeroRes?.Invoices || xeroRes.Invoices.length === 0) {
    return {
      invoiceId: params.invoiceId,
      xeroInvoiceId: invoice.xero_invoice_id,
      newPaymentStatus: invoice.payment_status,
      previousPaymentStatus: invoice.payment_status,
      updated: false,
    };
  }

  const xeroInvoice = xeroRes.Invoices[0];
  const amountDue = xeroInvoice.AmountDue ?? null;
  const amountPaid = xeroInvoice.AmountPaid ?? null;
  const total = xeroInvoice.Total ?? null;

  // 4. Derive accurate CAFM payment status from Xero data
  let newPaymentStatus: string = invoice.payment_status;
  let paidAt: string | undefined = undefined;
  let paymentReference: string | undefined = undefined;
  let isOverpaid = false;
  let overpaymentAmount = 0;

  // Extract most recent payment details if present
  if (xeroInvoice.Payments && xeroInvoice.Payments.length > 0) {
    const sorted = [...xeroInvoice.Payments].sort(
      (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()
    );
    paidAt = sorted[0].Date ? new Date(sorted[0].Date).toISOString() : new Date().toISOString();
    paymentReference = sorted[0].Reference;
  }

  if (xeroInvoice.Status === 'VOIDED' || xeroInvoice.Status === 'DELETED') {
    // Voided or deleted in Xero: keep status or flag for review
    newPaymentStatus = invoice.payment_status;
  } else if (amountDue !== null && amountDue <= 0 && amountPaid !== null && amountPaid > 0) {
    // Fully paid
    newPaymentStatus = 'PAID';
    if (total !== null && amountPaid > total) {
      isOverpaid = true;
      overpaymentAmount = Math.round((amountPaid - total) * 100) / 100;
    }
  } else if (amountPaid !== null && amountPaid > 0 && amountDue !== null && amountDue > 0) {
    // Partially paid
    newPaymentStatus = 'PART_PAID';
  } else if (xeroInvoice.Status === 'AUTHORISED') {
    // Still outstanding — determine if overdue
    const dueDate = invoice.due_date ? new Date(invoice.due_date) : null;
    if (dueDate && dueDate.getTime() < Date.now()) {
      newPaymentStatus = 'OVERDUE';
    } else {
      newPaymentStatus = 'DUE';
    }
  }

  // 5. Check if any financial or status values changed
  const previousPaymentStatus = invoice.payment_status;
  const previousPaidAmount = Number(invoice.paid_amount_gbp) || 0;
  const currentPaidAmount = amountPaid !== null ? amountPaid : previousPaidAmount;
  const amountChanged = Math.abs(currentPaidAmount - previousPaidAmount) > 0.009;
  const statusChanged = newPaymentStatus !== previousPaymentStatus;
  const updated = statusChanged || amountChanged;

  if (updated) {
    const patchBody: Record<string, any> = {
      payment_status: newPaymentStatus,
      accounting_provider: 'XERO',
      updated_at: new Date().toISOString(),
    };

    if (amountPaid !== null) {
      patchBody.paid_amount_gbp = amountPaid;
    }

    if (newPaymentStatus === 'PAID') {
      patchBody.paid_at = paidAt || new Date().toISOString();
      patchBody.payment_reference = paymentReference || null;
    } else if (newPaymentStatus === 'PART_PAID') {
      patchBody.payment_reference = paymentReference || null;
    }

    await dbQuery(`client_invoices?id=eq.${encodeURIComponent(params.invoiceId)}`, {
      method: 'PATCH',
      body: patchBody,
    });

    await recordAuditEvent({
      event_type: isOverpaid ? 'XERO_PAYMENT_OVERPAID' : 'XERO_PAYMENT_SYNCED',
      actor_id: params.actorPersonId,
      actor_type: 'SYSTEM',
      object_type: 'client_invoices',
      object_id: params.invoiceId,
      before_state: {
        payment_status: previousPaymentStatus,
        paid_amount_gbp: previousPaidAmount,
      },
      after_state: {
        payment_status: newPaymentStatus,
        xero_invoice_id: invoice.xero_invoice_id,
        amount_paid: amountPaid,
        amount_due: amountDue,
        total,
        is_overpaid: isOverpaid,
        overpayment_amount: overpaymentAmount,
        paid_at: paidAt,
        payment_reference: paymentReference,
      },
      is_ai: false,
    });
  }

  return {
    invoiceId: params.invoiceId,
    xeroInvoiceId: invoice.xero_invoice_id,
    newPaymentStatus,
    previousPaymentStatus,
    amountPaid: amountPaid ?? undefined,
    amountDue: amountDue ?? undefined,
    paymentReference,
    paidAt,
    updated,
  };
}

/**
 * Reconciles payment state for all SYNCED client invoices that are not yet fully PAID.
 */
export async function reconcileAllPayments(params: {
  xeroClient?: XeroClient;
}): Promise<{ reconciled: number; updated: number; errors: string[] }> {
  const { data: pendingInvoices } = await dbQuery<any[]>(
    `client_invoices?xero_invoice_id=not.is.null&payment_status=in.(NOT_DUE,DUE,OVERDUE,PART_PAID)&select=id&limit=200`
  );

  if (!pendingInvoices || pendingInvoices.length === 0) {
    return { reconciled: 0, updated: 0, errors: [] };
  }

  let client = params.xeroClient;
  if (!client) {
    const connection = await getActiveConnection();
    if (!connection) throw new XeroAuthError('No active Xero connection found.');
    client = new XeroClient(connection);
  }

  let updatedCount = 0;
  const errors: string[] = [];

  for (const inv of pendingInvoices) {
    try {
      const result = await reconcileInvoicePayment({ invoiceId: inv.id, xeroClient: client });
      if (result.updated) updatedCount++;
    } catch (err: any) {
      const msg = err?.safeMessage || err?.message || `Unknown error reconciling invoice ${inv.id}`;
      console.error(`[XERO_PAYMENT_RECONCILE_ERROR] Invoice ${inv.id}:`, msg);
      errors.push(msg);
    }
  }

  return {
    reconciled: pendingInvoices.length,
    updated: updatedCount,
    errors,
  };
}
