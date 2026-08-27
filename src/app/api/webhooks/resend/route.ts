/**
 * RESEND TRANSACTIONAL EMAIL WEBHOOK ENDPOINT — /api/webhooks/resend (Phase 0M)
 * ==============================================================================
 * Ingests authenticated Resend lifecycle events:
 *   - email.sent
 *   - email.delivered
 *   - email.delivery_delayed
 *   - email.bounced
 *   - email.failed
 *   - email.complained
 *   - email.suppressed
 *
 * Enforces Svix cryptographic signature verification and idempotent processing.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  processResendWebhookEvent,
  verifyResendWebhookSignature,
  ResendWebhookPayload,
} from '@/server/communications';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const headers = {
      'svix-id': req.headers.get('svix-id'),
      'svix-timestamp': req.headers.get('svix-timestamp'),
      'svix-signature': req.headers.get('svix-signature'),
    };

    // 1. Authenticate webhook signature
    const isValid = verifyResendWebhookSignature(rawBody, headers);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    let payload: ResendWebhookPayload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    // 2. Process webhook event with idempotency
    const result = await processResendWebhookEvent(payload, headers['svix-id'] || undefined);

    return NextResponse.json({
      success: true,
      processed: result.processed,
      is_duplicate: result.is_duplicate,
      delivery_state: result.delivery_state,
      provider_message_id: result.provider_message_id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
