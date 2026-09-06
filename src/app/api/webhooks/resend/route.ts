import { NextResponse } from 'next/server';
import { addSuppression } from '@/server/newsletter/store';
import { dbQuery, isDbConfigured } from '@/server/db/client';
import {
  verifyResendWebhookSignature,
  processResendWebhookEvent,
  type ResendWebhookPayload,
} from '@/server/communications';

export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────────────────────────────────────
// POST  /api/webhooks/resend
//
// Handles all Resend webhook events for:
//   1. Transactional emails (work order communications, dispatch, quotes, etc.)
//      → routed through processResendWebhookEvent() for authoritative state tracking
//   2. Newsletter bounce/complaint suppression (existing behaviour preserved)
//   3. Lobby Daily edition delivery log updates (existing behaviour preserved)
//
// Signature verification is MANDATORY. Missing or invalid signatures are
// rejected with 401 — they are not logged and continued.
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  // ── Step 1: Read raw body as text BEFORE any parsing (required for HMAC) ──
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: 'Failed to read request body' }, { status: 400 });
  }

  if (!rawBody || rawBody.length === 0) {
    return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
  }

  // ── Step 2: Hard signature verification ────────────────────────────────────
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');

  const isValid = verifyResendWebhookSignature(rawBody, {
    'svix-id': svixId,
    'svix-timestamp': svixTimestamp,
    'svix-signature': svixSignature,
  });

  if (!isValid) {
    console.warn('[ResendWebhook] Signature verification failed — request rejected', {
      hasSvixId: !!svixId,
      hasSvixTimestamp: !!svixTimestamp,
      hasSvixSignature: !!svixSignature,
    });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Step 3: Parse JSON payload ─────────────────────────────────────────────
  let payload: ResendWebhookPayload & { data?: { bounce?: { type?: string } } };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (!payload || !payload.type) {
    return NextResponse.json({ error: 'Invalid payload — missing type' }, { status: 400 });
  }

  const eventType = payload.type;
  const data = payload.data || ({} as any);
  const toField = Array.isArray(data.to) ? data.to[0] : data.to;
  const email = (toField || '').trim().toLowerCase();

  // The svix-id is the stable per-event identifier Resend uses.
  const webhookEventId = svixId ?? undefined;

  console.log(`[ResendWebhook] Verified event: ${eventType} for ${email || 'unknown'} (svix-id: ${webhookEventId})`);

  // ── Step 4: Route transactional events through the domain processor ────────
  let transactionalResult: Awaited<ReturnType<typeof processResendWebhookEvent>> | null = null;

  const TRANSACTIONAL_EVENT_TYPES: ResendWebhookPayload['type'][] = [
    'email.sent',
    'email.delivered',
    'email.delivery_delayed',
    'email.bounced',
    'email.failed',
    'email.complained',
    'email.suppressed',
  ];

  if (TRANSACTIONAL_EVENT_TYPES.includes(eventType) && data.id) {
    try {
      transactionalResult = await processResendWebhookEvent(payload, webhookEventId);
    } catch (err: unknown) {
      console.error('[ResendWebhook] processResendWebhookEvent error:', err);
    }
  }

  // ── Step 5: Newsletter suppression (preserve existing behaviour) ───────────
  if (email && isDbConfigured()) {
    if (eventType === 'email.bounced') {
      const bounceType = data.bounce?.type || data.bounce_type || 'HARD_BOUNCE';
      try {
        await addSuppression(email, 'BOUNCE_HARD', 'RESEND_WEBHOOK', `Bounce recorded: ${bounceType}`);
        await dbQuery(`newsletter_subscribers?email=eq.${encodeURIComponent(email)}`, {
          method: 'PATCH',
          body: {
            status: 'BOUNCED',
            bounce_type: bounceType,
            bounce_count: 1,
            updated_at: new Date().toISOString(),
          },
        });
      } catch (err: unknown) {
        console.error('[ResendWebhook] Newsletter bounce suppression error:', err);
      }
    } else if (eventType === 'email.complained') {
      try {
        await addSuppression(email, 'SPAM_COMPLAINT', 'RESEND_WEBHOOK', 'User marked email as spam via ISP feedback loop');
        await dbQuery(`newsletter_subscribers?email=eq.${encodeURIComponent(email)}`, {
          method: 'PATCH',
          body: {
            status: 'SUPPRESSED',
            updated_at: new Date().toISOString(),
          },
        });
      } catch (err: unknown) {
        console.error('[ResendWebhook] Newsletter complaint suppression error:', err);
      }
    }
  }

  // ── Step 6: Lobby Daily edition delivery log updates (preserve existing) ───
  const tags = data.tags || {};
  const editionId = tags.edition_id || data.headers?.['X-Lobby-Daily-Edition'];

  if (editionId && isDbConfigured() && email) {
    try {
      if (eventType === 'email.delivered') {
        await dbQuery(`lobby_daily_delivery_logs?edition_id=eq.${editionId}&email=eq.${encodeURIComponent(email)}`, {
          method: 'PATCH',
          body: { status: 'DELIVERED', delivered_at: new Date().toISOString() },
        });
      } else if (eventType === 'email.opened') {
        await dbQuery(`lobby_daily_delivery_logs?edition_id=eq.${editionId}&email=eq.${encodeURIComponent(email)}`, {
          method: 'PATCH',
          body: { opened_at: new Date().toISOString() },
        });
      } else if (eventType === 'email.clicked') {
        await dbQuery(`lobby_daily_delivery_logs?edition_id=eq.${editionId}&email=eq.${encodeURIComponent(email)}`, {
          method: 'PATCH',
          body: { clicked_at: new Date().toISOString() },
        });
      }
    } catch (err: unknown) {
      console.error('[ResendWebhook] Lobby Daily log update error:', err);
    }
  }

  return NextResponse.json({
    ok: true,
    received: eventType,
    transactional: transactionalResult
      ? {
          processed: transactionalResult.processed,
          is_duplicate: transactionalResult.is_duplicate,
          state_regression_skipped: transactionalResult.state_regression_skipped ?? false,
          delivery_state: transactionalResult.delivery_state,
          message_id: transactionalResult.message_id,
        }
      : null,
  });
}
