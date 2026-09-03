import { NextRequest, NextResponse } from 'next/server';
import {
  getApplicationDraft,
  saveApplicationDraft,
} from '@/server/suppliers/supplier-auth-store';
import { createMembershipCheckoutSession } from '@/lib/stripe/client';
import { SUPPLIER_MEMBERSHIP } from '@/config/supplier-membership';

/**
 * POST /api/supplier/application/payment/create-checkout
 *
 * Creates a Stripe Checkout Session for the EntireFM Supplier Membership (£95 + VAT / year).
 *
 * COMMERCIAL MODEL: One membership. One price. No tiers. Pricing is resolved
 * server-side only from the canonical config — never from client-supplied amounts.
 *
 * WAIVER / BYPASS GATE: If membershipPaymentStatus is already WAIVED or PAID
 * (set by an authorised invitation code or webhook confirmation), returns
 * { zeroValueBypass: true } without creating a Stripe session.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { supplierId, orgId } = body;
    const targetId = orgId || supplierId;

    if (!targetId) {
      return NextResponse.json({ error: 'supplierId or orgId is required' }, { status: 400 });
    }

    // Retrieve application draft from the canonical store
    const authDraft = await getApplicationDraft(targetId);

    const legalCompanyName = authDraft?.legalCompanyName || 'Supplier Applicant';
    const applicationRef = authDraft?.applicationReference || `EFM-${Date.now()}`;
    const contactEmail =
      authDraft?.primaryContactEmail ||
      authDraft?.generalEmail ||
      'finance@supplier.example.co.uk';

    // Zero-Value Bypass Gate —————————————————————————————————————————————————
    // Only bypass if payment status is already authoritative (WAIVED = authorised
    // invitation code; PAID = Stripe webhook confirmed). Client-side state is
    // never trusted.
    if (
      authDraft?.membershipPaymentStatus === 'WAIVED' ||
      authDraft?.membershipPaymentStatus === 'PAID'
    ) {
      return NextResponse.json({
        zeroValueBypass: true,
        alreadyPaidOrWaived: true,
        status: authDraft.membershipPaymentStatus,
        applicationRef,
        message: 'Membership fee is fully waived or settled. No payment required.',
      });
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    const successUrl = `${baseUrl}/supplier-portal/application/payment/success?session_id={CHECKOUT_SESSION_ID}&supplierId=${encodeURIComponent(targetId)}`;
    const cancelUrl = `${baseUrl}/supplier-portal/onboarding?cancelled=1`;

    // Create Stripe Session — canonical £95 + 20% VAT = £114 (resolved server-side)
    const checkout = await createMembershipCheckoutSession({
      supplierId: targetId,
      applicationRef,
      companyName: legalCompanyName,
      contactEmail,
      successUrl,
      cancelUrl,
      idempotencyKey: `checkout_mem_${targetId}_${Date.now()}`,
    });

    // Persist draft state BEFORE redirecting to Stripe (payment not yet confirmed)
    if (authDraft) {
      authDraft.membershipStandardAmountGbp = SUPPLIER_MEMBERSHIP.annualPriceExVat;
      authDraft.membershipFinalAmountGbp = SUPPLIER_MEMBERSHIP.annualPriceExVat;
      authDraft.membershipPaymentStatus = 'UNPAID';
      authDraft.updatedAt = new Date().toISOString();
      await saveApplicationDraft(targetId, authDraft);
    }

    return NextResponse.json({
      checkoutUrl: checkout.url,
      sessionId: checkout.sessionId,
      applicationRef,
      canonicalPriceExVatGbp: SUPPLIER_MEMBERSHIP.annualPriceExVat,
      vatAmountGbp: SUPPLIER_MEMBERSHIP.vatAmount,
      totalAmountIncVatGbp: SUPPLIER_MEMBERSHIP.totalPriceIncVat,
    });
  } catch (error: any) {
    console.error('Error creating Stripe Checkout Session:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize Stripe payment session' },
      { status: 500 }
    );
  }
}
