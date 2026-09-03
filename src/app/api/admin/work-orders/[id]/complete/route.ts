import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { completeWorkOrder } from '@/server/work';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Empty body allowed
    }

    const workOrder = await completeWorkOrder({
      work_order_id: id,
      completion_notes: body.completion_notes,
      actual_cost_gbp: body.actual_cost_gbp,
      actual_revenue_gbp: body.actual_revenue_gbp,
    });

    return NextResponse.json({
      success: true,
      workOrder,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
