import { NextRequest, NextResponse } from 'next/server';
import { validateInvitationCode } from '@/server/invitations/invitation-codes';
import { MembershipTierCode } from '@/config/supplier-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, tier, email, orgId } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, message: 'Please enter a valid invitation code.' },
        { status: 400 }
      );
    }

    const result = await validateInvitationCode(code, {
      tier: tier as MembershipTierCode,
      email,
      orgId,
    });

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, reason: result.reason, message: result.message },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      invitationId: result.invitationId,
      code: result.code,
      tierEligibility: result.tierEligibility,
      standardAmountGbp: result.standardAmountGbp,
      waivedAmountGbp: result.waivedAmountGbp,
      finalAmountGbp: result.finalAmountGbp,
      expiresAt: result.expiresAt,
      message: 'Invitation code verified. Membership fee waived to £0.00.',
    });
  } catch (err: any) {
    console.error('Error validating invitation code:', err);
    return NextResponse.json(
      { valid: false, message: 'Failed to validate invitation code. Please try again.' },
      { status: 500 }
    );
  }
}
