/**
 * API ROUTE: /api/contractor/clients/[id]
 * =======================================
 * Retrieves full customer detail with linked jobs, sites, and documents.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getContractorClientDetail } from '@/server/contractor/independent-job-service';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: clientId } = await params;
    const orgId = req.nextUrl.searchParams.get('org_id') || session.orgId;

    const detail = await getContractorClientDetail(orgId, clientId, session);
    if (!detail) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, client: detail });
  } catch (err: any) {
    console.error('[API_CLIENT_DETAIL_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
