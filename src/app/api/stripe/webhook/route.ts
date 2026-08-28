import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe/client';
import {
  getSupplierOnboardingDraft,
  recordAssurancePayment,
  submitSupplierOnboardingApplication,
} from '@/server/suppliers/store';
import { supplierRfiStore } from '@/server/suppliers/rfi-store';
import { CANONICAL_PUBLIC_PRICING } from '@/config/supplier-data';

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

  // Idempotency check
  if (supplierRfiStore.processedWebhookEvents.has(event.id)) {
    return NextResponse.json({ received: true, idempotent: true });
  }
  supplierRfiStore.processedWebhookEvents.add(event.id);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object;
        const supplierId = session.metadata?.supplier_id || session.client_reference_id;
        const applicationRef = session.metadata?.application_ref;

        if (supplierId) {
          const isMembership = session.metadata?.payment_type === 'MEMBERSHIP';
          const tier = session.metadata?.membership_tier;

          if (isMembership) {
            const { getApplicationDraft, saveApplicationDraft } = await import('@/server/suppliers/supplier-auth-store');
            const authDraft = await getApplicationDraft(supplierId);
            if (authDraft) {
              authDraft.membershipPaymentStatus = 'PAID';
              authDraft.membershipPaymentIntentId = session.payment_intent || session.id;
              authDraft.membershipPaidAt = new Date().toISOString();
              authDraft.lifecycleStatus = 'UNDER_REVIEW';
              authDraft.submittedAt = new Date().toISOString();
              authDraft.updatedAt = new Date().toISOString();
              await saveApplicationDraft(supplierId, authDraft);
            }
          }

          // Record commercial payment transaction
          await recordAssurancePayment(supplierId, 'CARD', {
            transactionRef: session.payment_intent || session.id,
          });

          // Formally submit application into EntireFM assurance queue
          await submitSupplierOnboardingApplication(supplierId);

          // Update status to UNDER_REVIEW
          const draft = await getSupplierOnboardingDraft(supplierId);
          draft.status = 'UNDER_REVIEW';
        }
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object;
        const supplierId = session.metadata?.supplier_id || session.client_reference_id;
        if (supplierId) {
          const draft = await getSupplierOnboardingDraft(supplierId);
          draft.status = 'AWAITING_PAYMENT';
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
