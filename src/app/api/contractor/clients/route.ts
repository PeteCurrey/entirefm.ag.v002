/**
 * API ROUTE: /api/contractor/clients
 * ==================================
 * Contractor independent customer management API.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listContractorClients, createContractorClient } from '@/server/contractor/independent-job-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orgId = req.nextUrl.searchParams.get('org_id') || session.orgId;
    const clients = await listContractorClients(orgId, session);

    return NextResponse.json({ success: true, clients });
  } catch (err: any) {
    console.error('[API_CLIENTS_GET_ERROR]', err);
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
    const result = await createContractorClient(
      {
        ...body,
        contractor_org_id: body.contractor_org_id || session.orgId,
      },
      session
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to create client' }, { status: 400 });
    }

    return NextResponse.json({ success: true, client: result.client });
  } catch (err: any) {
    console.error('[API_CLIENTS_POST_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
