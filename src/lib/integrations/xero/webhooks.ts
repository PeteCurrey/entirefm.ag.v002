/**
 * ENTIREFM XERO WEBHOOK HANDLER (PHASE 1 READINESS)
 * ==================================================
 * This module provides the complete webhook processing infrastructure for Xero webhooks.
 * The endpoint /api/integrations/xero/webhooks is RESERVED and ACTIVE.
 *
 * PHASE 1 STATUS:
 * - The integration operates correctly WITHOUT webhooks using explicit/scheduled API sync.
 * - The webhook endpoint accepts and validates Xero's "intent to receive" validation request.
 * - Real webhook events are ingested, deduplicated, persisted, and processed.
 * - The UI does NOT claim webhook sync is active.
 *
 * ACTIVATING WEBHOOKS (Future Phase 2):
 * In the Xero Developer Portal, under your application configuration:
 * 1. Navigate to Application → Webhooks
 * 2. Set the Webhook endpoint URL: https://www.entirefm.com/api/integrations/xero/webhooks
 * 3. Enable event subscriptions for: INVOICE (Create, Update), CONTACT (Create, Update)
 * 4. Copy the generated Webhook Key into your server environment as XERO_WEBHOOK_KEY
 * 5. Xero will send a validation POST with {"events":[],"firstEventSequence":0,"lastEventSequence":0,"entropy":"..."}
 *    The endpoint returns HTTP 200 with empty body to acknowledge — already implemented below.
 *
 * Security:
 * - Signature verification uses HMAC-SHA256 with constant-time comparison
 * - Each event carries a unique idempotency_key preventing replay attacks
 * - Events are persisted in xero_webhook_events regardless of processing outcome
 *
 * @see https://developer.xero.com/documentation/guides/webhooks/overview/
 */

import { dbQuery } from '@/server/db/client';
import { verifyXeroWebhookSignature } from './crypto';
import { getActiveConnection } from './oauth';
import { XeroClient } from './client';
import { reconcileInvoicePayment } from './payments';
import { syncClientToXeroContact } from './contacts';
import { XeroWebhookError } from './errors';
import type { XeroWebhookPayload, XeroWebhookEvent, XeroWebhookProcessingResult } from './types';

/**
 * Validates the incoming Xero webhook request signature.
 * Returns true if signature is valid, false if signature is missing but payload is empty (validation ping).
 * Throws XeroWebhookError if signature is present but invalid.
 */
export async function validateWebhookRequest(params: {
  rawBody: string;
  signatureHeader: string | null;
}): Promise<{ isValidationPing: boolean }> {
  let parsed: any;
  try {
    parsed = JSON.parse(params.rawBody);
  } catch {
    throw new XeroWebhookError('Webhook body is not valid JSON.');
  }

  // Xero "intent to receive" validation: empty events array, no signature required to proceed
  const isValidationPing = Array.isArray(parsed?.events) && parsed.events.length === 0;

  if (!params.signatureHeader && isValidationPing) {
    // This is a Xero webhook validation ping — always respond 200
    return { isValidationPing: true };
  }

  if (!process.env.XERO_WEBHOOK_KEY) {
    // XERO_WEBHOOK_KEY not configured — cannot verify signature
    // Log warning but do NOT expose this detail in the response
    console.warn('[XERO_WEBHOOK] XERO_WEBHOOK_KEY is not configured. Webhook signature cannot be verified.');
    throw new XeroWebhookError('Webhook authentication not configured.', 401);
  }

  const isValid = verifyXeroWebhookSignature(params.rawBody, params.signatureHeader, process.env.XERO_WEBHOOK_KEY);

  if (!isValid) {
    throw new XeroWebhookError('Webhook signature verification failed.', 401);
  }

  return { isValidationPing };
}

/**
 * Processes an authenticated Xero webhook payload.
 * Deduplicates events, persists them, and triggers appropriate synchronisation.
 */
export async function processWebhookPayload(
  rawBody: string
): Promise<XeroWebhookProcessingResult> {
  let payload: XeroWebhookPayload;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    throw new XeroWebhookError('Cannot parse webhook payload JSON.');
  }

  const events = payload.events || [];
  const result: XeroWebhookProcessingResult = {
    accepted: true,
    receivedCount: events.length,
    processedCount: 0,
    ignoredCount: 0,
    failedCount: 0,
    errors: [],
  };

  for (const event of events) {
    const idempotencyKey = buildEventIdempotencyKey(event, payload.lastEventSequence);

    try {
      // Check for duplicate processing
      const { data: existing } = await dbQuery<any[]>(
        `xero_webhook_events?idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&limit=1`
      );

      if (existing && existing.length > 0 && existing[0].status !== 'FAILED') {
        result.ignoredCount++;
        continue;
      }

      // Persist event record
      const { data: savedEvents } = await dbQuery<any[]>('xero_webhook_events', {
        method: 'POST',
        body: {
          event_signature: idempotencyKey,
          xero_tenant_id: event.tenantId,
          event_category: event.eventCategory,
          event_type: event.eventType,
          resource_id: event.resourceId,
          event_date_utc: event.eventDateUtc,
          idempotency_key: idempotencyKey,
          status: 'PROCESSING',
          raw_payload: event,
          attempt_count: 1,
        },
        headers: { Prefer: 'return=representation' },
      });

      const webhookEventId = savedEvents?.[0]?.id;

      // Dispatch event to appropriate handler
      await dispatchWebhookEvent(event);

      // Mark as processed
      if (webhookEventId) {
        await dbQuery(`xero_webhook_events?id=eq.${encodeURIComponent(webhookEventId)}`, {
          method: 'PATCH',
          body: { status: 'PROCESSED', processed_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        });
      }

      result.processedCount++;
    } catch (err: any) {
      const errMsg = err?.safeMessage || err?.message || 'Unknown webhook processing error';
      console.error(`[XERO_WEBHOOK_PROCESSING_ERROR] Event ${idempotencyKey}:`, errMsg);

      // Attempt to mark event as failed for retry visibility
      try {
        await dbQuery(`xero_webhook_events?idempotency_key=eq.${encodeURIComponent(idempotencyKey)}`, {
          method: 'PATCH',
          body: { status: 'FAILED', error_message: errMsg, updated_at: new Date().toISOString() },
        });
      } catch {}

      result.failedCount++;
      result.errors.push(errMsg);
    }
  }

  return result;
}

/**
 * Routes a single Xero webhook event to the correct EntireCAFM handler.
 */
async function dispatchWebhookEvent(event: XeroWebhookEvent): Promise<void> {
  // Resolve connection by Xero tenant ID
  const { data: connections } = await dbQuery<any[]>(
    `xero_connections?xero_tenant_id=eq.${encodeURIComponent(event.tenantId)}&status=eq.CONNECTED&is_active=eq.true&limit=1`
  );

  if (!connections || connections.length === 0) {
    console.warn(`[XERO_WEBHOOK] No active CAFM connection for Xero tenant ${event.tenantId}. Event ignored.`);
    return;
  }

  const xeroClient = new XeroClient(connections[0]);

  if (event.eventCategory === 'INVOICE') {
    await handleInvoiceWebhookEvent(event, xeroClient);
  } else if (event.eventCategory === 'CONTACT') {
    await handleContactWebhookEvent(event, xeroClient);
  }
  // Future: PAYMENT, CREDITNOTE, etc.
}

/**
 * Handles an INVOICE CREATE or UPDATE webhook event.
 * Finds the matching CAFM invoice and reconciles payment state.
 */
async function handleInvoiceWebhookEvent(event: XeroWebhookEvent, xeroClient: XeroClient): Promise<void> {
  const { data: cafmInvoices } = await dbQuery<any[]>(
    `client_invoices?xero_invoice_id=eq.${encodeURIComponent(event.resourceId)}&select=id&limit=1`
  );

  if (!cafmInvoices || cafmInvoices.length === 0) {
    // This may be a Xero invoice not yet mapped to a CAFM invoice — safe to ignore
    return;
  }

  const cafmInvoiceId = cafmInvoices[0].id;
  await reconcileInvoicePayment({ invoiceId: cafmInvoiceId, xeroClient });
}

/**
 * Handles a CONTACT CREATE or UPDATE webhook event.
 * Updates the xero_contact_id reference if the contact matches a CAFM client account.
 */
async function handleContactWebhookEvent(event: XeroWebhookEvent, _xeroClient: XeroClient): Promise<void> {
  // Check if we have a client account already pointing to this contact
  const { data: existing } = await dbQuery<any[]>(
    `client_accounts?xero_contact_id=eq.${encodeURIComponent(event.resourceId)}&select=id&limit=1`
  );

  if (existing && existing.length > 0) {
    // Already mapped — synchronisation of details can be triggered on next manual/scheduled sync
    return;
  }
  // Unknown contact — no mapping action needed in Phase 1
}

function buildEventIdempotencyKey(event: XeroWebhookEvent, sequence: number): string {
  return `xero_wh:${event.tenantId}:${event.eventCategory}:${event.resourceId}:${event.eventType}:${sequence}`;
}
