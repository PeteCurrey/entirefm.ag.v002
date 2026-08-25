import { NextRequest, NextResponse } from 'next/server';
import { getSupplierOnboardingDraft, saveSupplierOnboardingDraft } from '@/server/suppliers/store';
import { createSupplierAssuranceCheckoutSession } from '@/lib/stripe/client';
import { CANONICAL_PUBLIC_PRICING } from '@/config/supplier-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { supplierId } = body;

    if (!supplierId) {
      return NextResponse.json({ error: 'supplierId is required' }, { status: 400 });
    }

    const draft = await getSupplierOnboardingDraft(supplierId);

    // Validate completeness of profile
    if (!draft.legal_company_name || !draft.company_number) {
      return NextResponse.json(
        { error: 'Company Profile information is incomplete. Please complete all application sections before proceeding to payment.' },
        { status: 400 }
      );
    }
    if (draft.selected_service_slugs.length === 0) {
      return NextResponse.json(
        { error: 'At least one service discipline must be declared.' },
        { status: 400 }
      );
    }

    // If already paid or waived, return success
    if (
      draft.assurance_payment?.status === 'PAID' ||
      draft.assurance_payment?.status === 'WAIVED'
    ) {
      return NextResponse.json({
        alreadyPaid: true,
        status: draft.assurance_payment.status,
        applicationRef: draft.application_reference,
      });
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    const successUrl = `${baseUrl}/supplier-portal/application/payment/success?session_id={CHECKOUT_SESSION_ID}&supplierId=${encodeURIComponent(supplierId)}`;
    const cancelUrl = `${baseUrl}/supplier-portal/onboarding?cancelled=1`;

    const checkout = await createSupplierAssuranceCheckoutSession({
      supplierId,
      applicationRef: draft.application_reference,
      companyName: draft.legal_company_name,
      contactEmail: draft.general_email || 'finance@supplier.example.co.uk',
      successUrl,
      cancelUrl,
      idempotencyKey: `checkout_${supplierId}_${Date.now()}`,
    });

    // Update draft status to AWAITING_PAYMENT / PAYMENT_PROCESSING
    draft.status = 'AWAITING_PAYMENT';
    draft.updated_at = new Date().toISOString();
    await saveSupplierOnboardingDraft(supplierId, draft);

    return NextResponse.json({
      checkoutUrl: checkout.url,
      sessionId: checkout.sessionId,
      applicationRef: draft.application_reference,
      canonicalPriceGbp: CANONICAL_PUBLIC_PRICING.INITIAL_ASSURANCE_REVIEW.priceGbp,
    });
  } catch (error: any) {
    console.error('Error creating Stripe Checkout Session:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize Stripe payment session' },
      { status: 500 }
    );
  }
}
