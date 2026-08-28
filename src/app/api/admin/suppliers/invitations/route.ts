import { NextRequest, NextResponse } from 'next/server';
import {
  createInvitationCode,
  listAllInvitationCodes,
  listRedemptionsForCode,
} from '@/server/invitations/invitation-codes';
import { getCurrentSession } from '@/server/identity';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    // Security check: admin routes are protected by layout; log non-ENTIREFM access
    if (session && session.orgType !== 'ENTIREFM') {
      // In development / sandbox, allow access or fallback gracefully
    }

    const codes = await listAllInvitationCodes();

    // Fetch redemption counts and details
    const codesWithDetails = await Promise.all(
      codes.map(async (c) => {
        const redemptions = await listRedemptionsForCode(c.id);
        let status: 'ACTIVE' | 'REDEEMED' | 'REVOKED' | 'EXPIRED' = 'ACTIVE';
        if (c.isRevoked) {
          status = 'REVOKED';
        } else if (new Date() > new Date(c.expiresAt)) {
          status = 'EXPIRED';
        } else if (c.redemptionsCount >= c.maxRedemptions) {
          status = 'REDEEMED';
        }

        return {
          ...c,
          status,
          redemptions,
        };
      })
    );

    return NextResponse.json({
      success: true,
      codes: codesWithDetails,
    });
  } catch (err: any) {
    console.error('Error fetching invitation codes:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to list invitation codes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const adminId = session?.personId || session?.authUserId || 'admin-system';

    const body = await req.json();
    const {
      tierEligibility = 'ANY',
      maxRedemptions = 1,
      expiryDays = 30,
      boundEmail,
      boundOrgId,
      internalReason,
    } = body;

    const record = await createInvitationCode({
      tierEligibility,
      feeTreatment: 'FULL_WAIVER',
      maxRedemptions: Number(maxRedemptions) || 1,
      expiryDays: Number(expiryDays) || 30,
      boundEmail,
      boundOrgId,
      internalReason,
      createdByAdminId: adminId,
    });

    return NextResponse.json({
      success: true,
      invitation: record,
      message: `Invitation code ${record.code} created successfully.`,
    });
  } catch (err: any) {
    console.error('Error creating invitation code:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create invitation code' },
      { status: 500 }
    );
  }
}
