/**
 * POST /api/integrations/xero/webhooks
 * Reserved Xero webhook endpoint for real-time synchronization (Phase 1 Readiness).
 *
 * Requirements:
 * - Validates incoming Xero HMAC-SHA256 signature using `x-xero-signature` header and XERO_WEBHOOK_KEY.
 * - Handles Xero's empty-event "Intent to Receive" validation request and returns 200.
 * - Persists all incoming events to xero_webhook_events with idempotency and replay protection.
 * - Dispatches events to tenant-isolated handlers.
 * - Returns 401 on signature mismatch so Xero knows delivery was rejected.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateWebhookRequest, processWebhookPayload } from '@/lib/integrations/xero';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const signatureHeader = req.headers.get('x-xero-signature');
  let rawBody = '';

  try {
    rawBody = await req.text();
  } catch (err) {
    return new NextResponse('Bad request: unable to read body', { status: 400 });
  }

  // 1. Signature / Validation Check
  let validationResult: { isValidationPing: boolean };
  try {
    validationResult = await validateWebhookRequest({ rawBody, signatureHeader });
  } catch (err: any) {
    const status = err?.statusCode || 401;
    console.warn('[XERO_WEBHOOK_REJECTED]', err?.message || err);
    return new NextResponse(err?.message || 'Unauthorized', { status });
  }

  // If Xero intent verification ping (empty events), return 200 immediately with empty body
  if (validationResult.isValidationPing) {
    return new NextResponse(null, { status: 200 });
  }

  // 2. Process payload
  try {
    const result = await processWebhookPayload(rawBody);
    return NextResponse.json({
      received: result.receivedCount,
      processed: result.processedCount,
      ignored: result.ignoredCount,
      failed: result.failedCount,
    });
  } catch (err: any) {
    console.error('[XERO_WEBHOOK_PROCESS_ERROR]', err);
    // Even on processing errors, return 200 if successfully ingested to prevent aggressive Xero retries
    // while the internal error is recorded in xero_webhook_events table
    return NextResponse.json({ accepted: true, note: 'Processed with errors' }, { status: 200 });
  }
}
