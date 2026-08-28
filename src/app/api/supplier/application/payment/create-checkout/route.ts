import { NextRequest, NextResponse } from 'next/server';
import { getSupplierOnboardingDraft, saveSupplierOnboardingDraft } from '@/server/suppliers/store';
import {
  getApplicationDraft,
  saveApplicationDraft,
} from '@/server/suppliers/supplier-auth-store';
import {
  createContractorMembershipCheckoutSession,
  createSupplierAssuranceCheckoutSession,
} from '@/lib/stripe/client';
import {
  CONTRACTOR_MEMBERSHIP_TIERS,
  MembershipTierCode,
} from '@/config/supplier-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { supplierId, orgId, tier, paymentType = 'MEMBERSHIP' } = body;
    const targetId = orgId || supplierId;

    if (!targetId) {
      return NextResponse.json({ error: 'supplierId or orgId is required' }, { status: 400 });
    }

    // Try finding draft in supplier-auth-store first, then fallback to supplier store
    const authDraft = await getApplicationDraft(targetId);
    const storeDraft = await getSupplierOnboardingDraft(targetId);

    const legalCompanyName =
      authDraft?.legalCompanyName || storeDraft?.legal_company_name || 'Contractor Partner';
    const companyNumber = authDraft?.companyNumber || storeDraft?.company_number || '';
    const applicationRef =
      authDraft?.applicationReference || storeDraft?.application_reference || `SUP-${Date.now()}`;
    const contactEmail =
      authDraft?.primaryContactEmail ||
      authDraft?.generalEmail ||
      storeDraft?.general_email ||
      'finance@supplier.example.co.uk';

    // 1. Zero-Value Checkout Bypass Check:
    // If the membership fee was already waived by a valid EntireFM Invitation Code, bypass Stripe completely!
    if (
      authDraft?.membershipPaymentStatus === 'WAIVED' ||
      authDraft?.membershipPaymentStatus === 'PAID' ||
      storeDraft?.assurance_payment?.status === 'WAIVED' ||
      storeDraft?.assurance_payment?.status === 'PAID'
    ) {
      return NextResponse.json({
        zeroValueBypass: true,
        alreadyPaidOrWaived: true,
        status: authDraft?.membershipPaymentStatus || storeDraft?.assurance_payment?.status || 'WAIVED',
        applicationRef,
        message: 'Membership fee is fully waived or settled. Zero payment required.',
      });
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    const successUrl = `${baseUrl}/supplier-portal/application/payment/success?session_id={CHECKOUT_SESSION_ID}&supplierId=${encodeURIComponent(targetId)}`;
    const cancelUrl = `${baseUrl}/supplier-portal/onboarding?cancelled=1`;

    const selectedTier: MembershipTierCode =
      (tier as MembershipTierCode) ||
      authDraft?.selectedMembershipTier ||
      'TIER_1';

    const tierConfig =
      CONTRACTOR_MEMBERSHIP_TIERS[selectedTier] || CONTRACTOR_MEMBERSHIP_TIERS.TIER_1;

    // Create Stripe Session for Membership Payment
    const checkout = await createContractorMembershipCheckoutSession({
      supplierId: targetId,
      applicationRef,
      companyName: legalCompanyName,
      contactEmail,
      tier: selectedTier,
      successUrl,
      cancelUrl,
      idempotencyKey: `checkout_${targetId}_${selectedTier}_${Date.now()}`,
    });

    if (authDraft) {
      authDraft.selectedMembershipTier = selectedTier;
      authDraft.membershipStandardAmountGbp = tierConfig.priceGbp;
      authDraft.membershipFinalAmountGbp = tierConfig.priceGbp;
      authDraft.membershipPaymentStatus = 'UNPAID';
      authDraft.updatedAt = new Date().toISOString();
      await saveApplicationDraft(targetId, authDraft);
    }

    if (storeDraft) {
      storeDraft.status = 'AWAITING_PAYMENT';
      storeDraft.updated_at = new Date().toISOString();
      await saveSupplierOnboardingDraft(targetId, storeDraft);
    }

    return NextResponse.json({
      checkoutUrl: checkout.url,
      sessionId: checkout.sessionId,
      applicationRef,
      tier: selectedTier,
      canonicalPriceGbp: tierConfig.priceGbp,
      totalAmountIncVatGbp: tierConfig.priceGbp * (1 + tierConfig.vatRate),
    });
  } catch (error: any) {
    console.error('Error creating Stripe Checkout Session:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize Stripe payment session' },
      { status: 500 }
    );
  }
}
