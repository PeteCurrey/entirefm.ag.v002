/**
 * API ROUTE: /api/contractor/branding
 * ===================================
 * Manages contractor branding profiles for white-label independent trade tools.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getContractorBrandProfile, saveContractorBrandProfile } from '@/server/contractor/branding-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orgId = req.nextUrl.searchParams.get('org_id') || session.orgId;
    const profile = await getContractorBrandProfile(orgId, session);

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    console.error('[API_BRANDING_GET_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = await saveContractorBrandProfile(
      {
        ...body,
        organisation_id: body.organisation_id || session.orgId,
      },
      session
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save branding profile' }, { status: 400 });
    }

    return NextResponse.json({ success: true, profile: result.profile });
  } catch (err: any) {
    console.error('[API_BRANDING_POST_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
