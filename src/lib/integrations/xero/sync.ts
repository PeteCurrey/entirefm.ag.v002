/**
 * ENTIREFM XERO SYNC ORCHESTRATOR
 * ================================
 * Coordinates full synchronisation runs: contacts → invoices → payment reconciliation.
 * Provides per-run statistics and writes a master sync log entry.
 *
 * Sync strategy:
 * - Only ISSUED invoices are eligible for invoice sync
 * - Contacts are created/updated before invoice sync (invoices depend on contact IDs)
 * - Payment reconciliation runs after invoice sync
 * - All individual operations are idempotent — re-running a sync is always safe
 * - Errors in individual records are captured, not thrown (partial success is valid)
 */

import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';
import { XeroClient } from './client';
import { getActiveConnection } from './oauth';
import { syncClientToXeroContact } from './contacts';
import { syncInvoiceToXero } from './invoices';
import { reconcileAllPayments } from './payments';
import { XeroAuthError } from './errors';
import type { XeroSyncResult } from './types';

export interface SyncRunOptions {
  actorPersonId?: string;
  /** Limit to a single invoice ID (single-record sync) */
  singleInvoiceId?: string;
  /** Skip contact sync pass if contacts are already up to date */
  skipContactSync?: boolean;
  /** Skip payment reconciliation pass */
  skipPaymentReconciliation?: boolean;
}

/**
 * Runs a full (or limited) Xero synchronisation pass.
 * Returns a structured result report suitable for the API response and audit log.
 */
export async function runXeroSync(options: SyncRunOptions = {}): Promise<XeroSyncResult> {
  const startedAt = new Date();

  // 1. Validate active Xero connection
  const connection = await getActiveConnection();
  if (!connection) {
    throw new XeroAuthError('No active Xero connection. OAuth authorisation required before sync.');
  }

  const xeroClient = new XeroClient(connection);

  const result: XeroSyncResult = {
    success: false,
    syncedAt: startedAt.toISOString(),
    contactsProcessed: 0,
    contactsCreated: 0,
    contactsUpdated: 0,
    invoicesProcessed: 0,
    invoicesSynced: 0,
    invoicesFailed: 0,
    paymentsReconciled: 0,
    paymentsUpdated: 0,
    errors: [],
  };

  // 2. SINGLE INVOICE MODE
  if (options.singleInvoiceId) {
    try {
      const invResult = await syncInvoiceToXero({
        invoiceId: options.singleInvoiceId,
        xeroClient,
        actorPersonId: options.actorPersonId,
      });

      result.invoicesProcessed = 1;
      if (invResult.success) {
        result.invoicesSynced = 1;
      } else {
        result.invoicesFailed = 1;
        if (invResult.error) result.errors.push(invResult.error);
      }

      result.success = invResult.success;
    } catch (err: any) {
      const msg = err?.safeMessage || err?.message || 'Unknown sync error.';
      result.invoicesFailed = 1;
      result.errors.push(msg);
      result.success = false;
    }

    await emitSyncAuditEvent(result, options.actorPersonId);
    return result;
  }

  // 3. FULL SYNC MODE

  // 3a. Contact sync pass — resolve/create Xero contacts for all client accounts
  if (!options.skipContactSync) {
    const { data: clientAccounts } = await dbQuery<any[]>(
      `client_accounts?status=eq.ACTIVE&select=id&limit=500`
    );

    if (clientAccounts && clientAccounts.length > 0) {
      for (const account of clientAccounts) {
        try {
          const contactResult = await syncClientToXeroContact({
            clientAccountId: account.id,
            xeroClient,
            actorPersonId: options.actorPersonId,
          });
          result.contactsProcessed++;
          if (contactResult.isNew) result.contactsCreated++;
          else result.contactsUpdated++;
        } catch (err: any) {
          const msg = err?.safeMessage || err?.message || `Contact sync failed for ${account.id}`;
          console.error(`[XERO_SYNC_CONTACT_ERROR] ${account.id}:`, msg);
          result.errors.push(msg);
        }
      }
    }
  }

  // 3b. Invoice sync pass — sync all ISSUED invoices not yet SYNCED (or UPDATE_PENDING)
  const { data: eligibleInvoices } = await dbQuery<any[]>(
    `client_invoices?status=eq.ISSUED&accounting_sync_status=in.(NOT_SYNCED,SYNC_FAILED,UPDATE_PENDING)&select=id&limit=200`
  );

  if (eligibleInvoices && eligibleInvoices.length > 0) {
    for (const invoice of eligibleInvoices) {
      try {
        const invResult = await syncInvoiceToXero({
          invoiceId: invoice.id,
          xeroClient,
          actorPersonId: options.actorPersonId,
        });
        result.invoicesProcessed++;
        if (invResult.success) {
          result.invoicesSynced++;
        } else {
          result.invoicesFailed++;
          if (invResult.error) result.errors.push(invResult.error);
        }
      } catch (err: any) {
        const msg = err?.safeMessage || err?.message || `Invoice sync failed: ${invoice.id}`;
        console.error(`[XERO_SYNC_INVOICE_ERROR] ${invoice.id}:`, msg);
        result.invoicesProcessed++;
        result.invoicesFailed++;
        result.errors.push(msg);
      }
    }
  }

  // 3c. Payment reconciliation pass
  if (!options.skipPaymentReconciliation) {
    try {
      const payResult = await reconcileAllPayments({ xeroClient });
      result.paymentsReconciled = payResult.reconciled;
      result.paymentsUpdated = payResult.updated;
      if (payResult.errors.length > 0) {
        result.errors.push(...payResult.errors);
      }
    } catch (err: any) {
      const msg = err?.safeMessage || err?.message || 'Payment reconciliation pass failed.';
      console.error('[XERO_SYNC_PAYMENT_RECONCILE_ERROR]:', msg);
      result.errors.push(msg);
    }
  }

  result.success = result.invoicesFailed === 0 && result.errors.length === 0;
  result.syncedAt = startedAt.toISOString();

  await emitSyncAuditEvent(result, options.actorPersonId);

  return result;
}

async function emitSyncAuditEvent(result: XeroSyncResult, actorPersonId?: string): Promise<void> {
  try {
    await recordAuditEvent({
      event_type: 'XERO_SYNC_COMPLETED',
      actor_id: actorPersonId,
      actor_type: actorPersonId ? 'HUMAN' : 'SYSTEM',
      object_type: 'xero_integration',
      object_id: 'xero_sync_run',
      after_state: {
        success: result.success,
        invoices_synced: result.invoicesSynced,
        invoices_failed: result.invoicesFailed,
        payments_updated: result.paymentsUpdated,
        error_count: result.errors.length,
      },
      is_ai: false,
    });
  } catch (err) {
    console.error('[XERO_SYNC] Failed to write sync audit event:', err);
  }
}
