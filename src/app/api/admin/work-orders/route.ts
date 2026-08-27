import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listWorkOrders, createWorkOrder, createWorkAssignment, completeWorkOrder } from '@/server/work';

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
    const workOrders = await listWorkOrders({ status, priority, siteId });
    return NextResponse.json({ success: true, workOrders });
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
      work_type,
      priority,
      service_request_id,
      building_id,
      space_id,
      asset_id,
      contract_id,
      trade_id,
      provider_organisation_id,
      total_revenue_gbp,
      total_cost_gbp,
    } = body;

    if (!site_id || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'site_id, title, and description are required.' },
        { status: 400 }
      );
    }

    const wo = await createWorkOrder({
      site_id,
      title: title.trim(),
      description: description.trim(),
      work_type,
      priority,
      service_request_id,
      building_id,
      space_id,
      asset_id,
      contract_id,
      trade_id,
      provider_organisation_id,
      total_revenue_gbp: total_revenue_gbp ? Number(total_revenue_gbp) : undefined,
      total_cost_gbp: total_cost_gbp ? Number(total_cost_gbp) : undefined,
    });

    return NextResponse.json({ success: true, workOrder: wo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
