/**
 * ENTIREFM STRIPE CLIENT & CHECKOUT INFRASTRUCTURE
 * =================================================
 * Secure server-side Stripe SDK initialization and helpers for
 * supplier assurance review payments and Partner Network commercial operations.
 */

import Stripe from 'stripe';
import { CANONICAL_PUBLIC_PRICING, CONTRACTOR_MEMBERSHIP_TIERS } from '@/config/supplier-data';

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
        name: 'EntireFM Partner Network',
        version: '2.0.0',
      },
    });
  }

  return stripeClientInstance;
}

export interface CreateSupplierAssuranceCheckoutParams {
  supplierId: string;
  applicationRef: string;
  companyName: string;
  contactEmail: string;
  successUrl: string;
  cancelUrl: string;
  idempotencyKey?: string;
}

/**
 * Creates a Stripe Checkout Session for Initial Supplier Assurance Review
 * Strictly resolves canonical server-side pricing (£350 + 20% VAT = £420.00).
 */
export async function createSupplierAssuranceCheckoutSession(
  params: CreateSupplierAssuranceCheckoutParams
): Promise<{ url: string | null; sessionId: string }> {
  const stripe = getStripeClient();
  const pricing = CANONICAL_PUBLIC_PRICING.INITIAL_ASSURANCE_REVIEW;

  const totalAmountPence = Math.round(pricing.priceGbp * (1 + pricing.vatRate) * 100);

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
              name: pricing.name,
              description:
                'Administration and independent technical review of applicable company, insurance, H&S, and trade qualifications.',
              metadata: {
                canonical_product_id: pricing.id,
                billing_frequency: pricing.billingFrequency,
              },
            },
            unit_amount: totalAmountPence,
          },
          quantity: 1,
        },
      ],
      metadata: {
        supplier_id: params.supplierId,
        application_ref: params.applicationRef,
        commercial_product_id: pricing.id,
        net_amount_gbp: pricing.priceGbp.toString(),
        vat_amount_gbp: (pricing.priceGbp * pricing.vatRate).toString(),
        total_amount_gbp: (pricing.priceGbp * (1 + pricing.vatRate)).toString(),
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

export interface CreateContractorMembershipCheckoutParams {
  supplierId: string;
  applicationRef: string;
  companyName: string;
  contactEmail: string;
  tier: 'TIER_1' | 'TIER_2';
  successUrl: string;
  cancelUrl: string;
  idempotencyKey?: string;
}

/**
 * Creates a Stripe Checkout Session for Contractor Network Membership (£295 / £695 + 20% VAT).
 * Price is resolved strictly on the server from CONTRACTOR_MEMBERSHIP_TIERS.
 */
export async function createContractorMembershipCheckoutSession(
  params: CreateContractorMembershipCheckoutParams
): Promise<{ url: string | null; sessionId: string }> {
  const stripe = getStripeClient();
  const tierConfig = CONTRACTOR_MEMBERSHIP_TIERS[params.tier] || CONTRACTOR_MEMBERSHIP_TIERS.TIER_1;

  const totalAmountPence = Math.round(tierConfig.priceGbp * (1 + tierConfig.vatRate) * 100);

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
              name: tierConfig.name,
              description: tierConfig.description,
              metadata: {
                canonical_product_id: tierConfig.id,
                internal_id: tierConfig.internalId,
                tier_code: params.tier,
                billing_frequency: tierConfig.billingFrequency,
              },
            },
            unit_amount: totalAmountPence,
          },
          quantity: 1,
        },
      ],
      metadata: {
        payment_type: 'MEMBERSHIP',
        supplier_id: params.supplierId,
        application_ref: params.applicationRef,
        membership_tier: params.tier,
        commercial_product_id: tierConfig.id,
        net_amount_gbp: tierConfig.priceGbp.toString(),
        vat_amount_gbp: (tierConfig.priceGbp * tierConfig.vatRate).toString(),
        total_amount_gbp: (tierConfig.priceGbp * (1 + tierConfig.vatRate)).toString(),
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
