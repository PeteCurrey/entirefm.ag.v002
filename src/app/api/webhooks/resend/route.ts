import { NextResponse } from 'next/server';
import { addSuppression } from '@/server/newsletter/store';
import { dbQuery, isDbConfigured } from '@/server/db/client';

export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────────────────────────────────────
// POST  /api/webhooks/resend
// Handles Resend webhook events: delivery, bounce, complaint, click, open
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    // Optional webhook signature verification
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    const authHeader = req.headers.get('x-resend-signature') || req.headers.get('authorization');
    
    if (webhookSecret && authHeader) {
      // Basic signature or secret match verification
      if (authHeader !== webhookSecret && !authHeader.includes(webhookSecret)) {
        console.warn('[ResendWebhook] Signature mismatch');
      }
    }

    const payload = await req.json().catch(() => null);
    if (!payload || !payload.type) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const eventType = payload.type;
    const data = payload.data || {};
    const toEmail = Array.isArray(data.to) ? data.to[0] : data.to;
    const email = (toEmail || '').trim().toLowerCase();

    console.log(`[ResendWebhook] Received event: ${eventType} for ${email || 'unknown'}`);

    if (email) {
      if (eventType === 'email.bounced') {
        const bounceType = data.bounce?.type || 'HARD_BOUNCE';
        await addSuppression(
          email,
          'BOUNCE_HARD',
          'RESEND_WEBHOOK',
          `Bounce recorded: ${bounceType}`
        );

        if (isDbConfigured()) {
          await dbQuery(`newsletter_subscribers?email=eq.${encodeURIComponent(email)}`, {
            method: 'PATCH',
            body: {
              status: 'BOUNCED',
              bounce_type: bounceType,
              bounce_count: 1,
              updated_at: new Date().toISOString(),
            },
          });
        }
      } else if (eventType === 'email.complained') {
        await addSuppression(
          email,
          'SPAM_COMPLAINT',
          'RESEND_WEBHOOK',
          'User marked email as spam via ISP feedback loop'
        );

        if (isDbConfigured()) {
          await dbQuery(`newsletter_subscribers?email=eq.${encodeURIComponent(email)}`, {
            method: 'PATCH',
            body: {
              status: 'SUPPRESSED',
              updated_at: new Date().toISOString(),
            },
          });
        }
      }
    }

    // Update edition delivery logs if broadcast_id / tag matches
    const tags = data.tags || {};
    const editionId = tags.edition_id || data.headers?.['X-Lobby-Daily-Edition'];

    if (editionId && isDbConfigured()) {
      if (eventType === 'email.delivered') {
        await dbQuery(`lobby_daily_delivery_logs?edition_id=eq.${editionId}&email=eq.${encodeURIComponent(email)}`, {
          method: 'PATCH',
          body: {
            status: 'DELIVERED',
            delivered_at: new Date().toISOString(),
          },
        });
      } else if (eventType === 'email.opened') {
        await dbQuery(`lobby_daily_delivery_logs?edition_id=eq.${editionId}&email=eq.${encodeURIComponent(email)}`, {
          method: 'PATCH',
          body: {
            opened_at: new Date().toISOString(),
          },
        });
      } else if (eventType === 'email.clicked') {
        await dbQuery(`lobby_daily_delivery_logs?edition_id=eq.${editionId}&email=eq.${encodeURIComponent(email)}`, {
          method: 'PATCH',
          body: {
            clicked_at: new Date().toISOString(),
          },
        });
      }
    }

    return NextResponse.json({ ok: true, received: eventType });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[ResendWebhook] Handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
