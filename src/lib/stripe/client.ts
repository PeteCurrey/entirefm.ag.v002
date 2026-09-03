/**
 * ENTIREFM STRIPE CLIENT & CHECKOUT INFRASTRUCTURE
 * =================================================
 * Secure server-side Stripe SDK initialization and helpers for
 * the EntireFM Supplier Membership annual payment (£95 + VAT = £114.00).
 *
 * COMMERCIAL MODEL: One membership. £95 + VAT / year.
 * All pricing is resolved from SUPPLIER_MEMBERSHIP — never from client input.
 */

import Stripe from 'stripe';
import { SUPPLIER_MEMBERSHIP } from '@/config/supplier-membership';

let stripeClientInstance: Stripe | null = null;

export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
  }

  if (!stripeClientInstance) {
    stripeClientInstance = new Stripe(secretKey, {
      apiVersion: '2025-02-24.acacia' as any,
      typescript: true,
      appInfo: {
        name: 'EntireFM Supplier Platform',
        version: '3.0.0',
      },
    });
  }

  return stripeClientInstance;
}

export interface CreateMembershipCheckoutParams {
  supplierId: string;
  applicationRef: string;
  companyName: string;
  contactEmail: string;
  successUrl: string;
  cancelUrl: string;
  idempotencyKey?: string;
}

/**
 * Creates a Stripe Checkout Session for the EntireFM Supplier Membership.
 *
 * CANONICAL PRICE: £95 + 20% VAT = £114.00 (11,400 pence).
 * This is resolved server-side only — never trust client-supplied amounts.
 */
export async function createMembershipCheckoutSession(
  params: CreateMembershipCheckoutParams
): Promise<{ url: string | null; sessionId: string }> {
  const stripe = getStripeClient();

  // All pricing is derived from the canonical server-side config only
  const totalAmountPence = SUPPLIER_MEMBERSHIP.totalPricePence; // 11400

  const session = await stripe.checkout.sessions.create(
    {
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: params.contactEmail,
      client_reference_id: params.supplierId,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: SUPPLIER_MEMBERSHIP.name,
              description: SUPPLIER_MEMBERSHIP.checkoutDescription,
              metadata: {
                canonical_product_id: SUPPLIER_MEMBERSHIP.internalId,
                billing_interval: SUPPLIER_MEMBERSHIP.billingInterval,
                net_amount_gbp: SUPPLIER_MEMBERSHIP.annualPriceExVat.toString(),
                vat_amount_gbp: SUPPLIER_MEMBERSHIP.vatAmount.toString(),
              },
            },
            unit_amount: totalAmountPence,
            tax_behavior: 'inclusive',
          },
          quantity: 1,
        },
      ],
      metadata: {
        payment_type: 'SUPPLIER_MEMBERSHIP',
        supplier_id: params.supplierId,
        application_ref: params.applicationRef,
        company_name: params.companyName,
        commercial_product_id: SUPPLIER_MEMBERSHIP.internalId,
        net_amount_gbp: SUPPLIER_MEMBERSHIP.annualPriceExVat.toString(),
        vat_amount_gbp: SUPPLIER_MEMBERSHIP.vatAmount.toString(),
        total_amount_gbp: SUPPLIER_MEMBERSHIP.totalPriceIncVat.toString(),
        membership_version: 'v3-single-95',
      },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    },
    params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : undefined
  );

  return {
    url: session.url,
    sessionId: session.id,
  };
}

/**
 * @deprecated Use createMembershipCheckoutSession instead.
 * Retained for reference during code cleanup — this function should be removed once
 * all callers have been migrated to the single membership model.
 *
 * Historical £295/£695 tier sessions must NOT be recreated with this function.
 * They remain as historical payment records only.
 */
export async function createContractorMembershipCheckoutSession(
  params: CreateMembershipCheckoutParams & { tier?: string }
): Promise<{ url: string | null; sessionId: string }> {
  // Redirect all calls to the canonical single-membership checkout session
  return createMembershipCheckoutSession(params);
}

/**
 * @deprecated The initial assurance review fee has been retired.
 * Retained as a stub to avoid breaking existing imports during migration.
 */
export async function createSupplierAssuranceCheckoutSession(
  params: CreateMembershipCheckoutParams
): Promise<{ url: string | null; sessionId: string }> {
  return createMembershipCheckoutSession(params);
}
