import { NextRequest, NextResponse } from 'next/server';
import { atomicRedeemInvitationCode } from '@/server/invitations/invitation-codes';
import {
  getApplicationDraft,
  saveApplicationDraft,
} from '@/server/suppliers/supplier-auth-store';
import { MembershipTierCode } from '@/config/supplier-data';
import { getCurrentSession } from '@/server/identity';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invitationId, orgId, tier, email } = body;

    if (!invitationId || !orgId || !tier) {
      return NextResponse.json(
        { error: 'invitationId, orgId, and tier are required' },
        { status: 400 }
      );
    }

    const session = await getCurrentSession();
    const authUserId = session?.personId || session?.authUserId || 'supplier-auth';

    // 1. Perform atomic redemption
    const redemptionResult = await atomicRedeemInvitationCode({
      invitationId,
      supplierOrgId: orgId,
      authUserId,
      selectedTier: tier as MembershipTierCode,
      email: email || session?.email,
    });

    if (!redemptionResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: redemptionResult.error || 'Failed to redeem invitation code',
          errorCode: redemptionResult.errorCode,
        },
        { status: 400 }
      );
    }

    // 2. Update application draft with waiver audit values
    const draft = await getApplicationDraft(orgId);
    if (draft) {
      const red = redemptionResult.redemption!;
      draft.selectedMembershipTier = tier as MembershipTierCode;
      draft.invitationCodeId = invitationId;
      draft.membershipStandardAmountGbp = red.standardAmountGbp;
      draft.membershipWaivedAmountGbp = red.waivedAmountGbp;
      draft.membershipFinalAmountGbp = 0;
      draft.membershipPaymentStatus = 'WAIVED';
      draft.paymentMethod = 'WAIVER';
      draft.waiverReason = 'EntireFM Invitation Code';
      draft.updatedAt = new Date().toISOString();
      await saveApplicationDraft(orgId, draft);
    }

    return NextResponse.json({
      success: true,
      redemption: redemptionResult.redemption,
      message: 'Invitation code successfully applied. Membership fee waived to £0.00.',
    });
  } catch (err: any) {
    console.error('Error redeeming invitation code:', err);
    return NextResponse.json(
      { error: err.message || 'Server error redeeming invitation code' },
      { status: 500 }
    );
  }
}
