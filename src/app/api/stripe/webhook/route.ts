import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe/client';
import { dbQuery } from '@/server/db/client';
import {
  getApplicationDraft,
  saveApplicationDraft,
} from '@/server/suppliers/supplier-auth-store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const stripe = getStripeClient();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing stripe-signature or STRIPE_WEBHOOK_SECRET configuration' },
      { status: 400 }
    );
  }

  let event: any;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Idempotency check via processed_stripe_events table
  try {
    const { data: inserted, error: idempErr } = await dbQuery<any[]>('processed_stripe_events', {
      method: 'POST',
      body: { event_id: event.id, event_type: event.type },
      headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
    });
    if (!idempErr && (!inserted || inserted.length === 0)) {
      return NextResponse.json({ received: true, idempotent: true });
    }
  } catch (idempCatch) {
    console.warn('[STRIPE_WEBHOOK_IDEMPOTENCY_WARNING]', idempCatch);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object;
        const supplierId = session.metadata?.supplier_id || session.client_reference_id;

        if (supplierId) {
          const authDraft = await getApplicationDraft(supplierId);
          if (authDraft) {
            authDraft.membershipPaymentStatus = 'PAID';
            authDraft.membershipPaymentIntentId = session.payment_intent || session.id;
            authDraft.membershipPaidAt = new Date().toISOString();
            authDraft.lifecycleStatus = 'UNDER_REVIEW';
            authDraft.submittedAt = authDraft.submittedAt || new Date().toISOString();
            authDraft.updatedAt = new Date().toISOString();
            await saveApplicationDraft(supplierId, authDraft);
          }
        }
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object;
        const supplierId = session.metadata?.supplier_id || session.client_reference_id;
        if (supplierId) {
          const authDraft = await getApplicationDraft(supplierId);
          if (authDraft) {
            authDraft.membershipPaymentStatus = 'UNPAID';
            authDraft.updatedAt = new Date().toISOString();
            await saveApplicationDraft(supplierId, authDraft);
          }
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        console.log(`Charge refunded: ${charge.id}. Reconciling commercial ledger.`);
        break;
      }

      default:
        // Safely log and acknowledge other supported events
        break;
    }

    return NextResponse.json({ received: true, eventType: event.type });
  } catch (error: any) {
    console.error('Error processing Stripe webhook event:', error);
    return NextResponse.json(
      { error: 'Internal error processing webhook' },
      { status: 500 }
    );
  }
}
