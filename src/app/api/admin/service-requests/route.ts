import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listServiceRequests, createServiceRequest } from '@/server/work';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') as any) || undefined;
    const priority = (searchParams.get('priority') as any) || undefined;
    const siteId = searchParams.get('siteId') || undefined;
    const requests = await listServiceRequests({ status, priority, siteId });
    return NextResponse.json({ success: true, requests });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      site_id,
      title,
      description,
      category,
      priority,
      source,
      client_account_id,
      building_id,
      space_id,
      asset_id,
      requester_name,
      requester_email,
      trade_id,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'title and description are required.' },
        { status: 400 }
      );
    }

    // Resolve site_id: use provided value or fall back to first site
    let resolvedSiteId = site_id;
    if (!resolvedSiteId) {
      const { listSites } = await import('@/server/estate');
      const sites = await listSites({ limit: 1 } as any);
      resolvedSiteId = sites[0]?.id;
    }

    if (!resolvedSiteId) {
      return NextResponse.json(
        { success: false, error: 'No sites available. Register a site first before logging a service request.' },
        { status: 400 }
      );
    }

    const sr = await createServiceRequest({
      site_id: resolvedSiteId,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      source,
      client_account_id,
      building_id,
      space_id,
      asset_id,
      requester_name,
      requester_email,
      trade_id,
    });

    return NextResponse.json({ success: true, serviceRequest: sr, request: sr }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
