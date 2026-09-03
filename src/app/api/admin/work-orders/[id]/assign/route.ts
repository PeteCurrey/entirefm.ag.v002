import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { assignWorkOrderInternalEngineer, assignWorkOrderContractor } from '@/server/work';

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
    const body = await request.json();

    const { type, engineer_person_id, contractor_org_id, scheduled_start_at, scheduled_end_at } = body;

    if (type === 'INTERNAL' || engineer_person_id) {
      if (!engineer_person_id) {
        return NextResponse.json({ error: 'engineer_person_id is required for internal assignment' }, { status: 400 });
      }

      const result = await assignWorkOrderInternalEngineer({
        work_order_id: id,
        engineer_person_id,
        scheduled_start_at,
        scheduled_end_at,
        session,
      });

      return NextResponse.json({
        success: true,
        type: 'INTERNAL',
        workOrder: result.workOrder,
        visit: result.visit,
      });
    }

    if (type === 'CONTRACTOR' || contractor_org_id) {
      if (!contractor_org_id) {
        return NextResponse.json({ error: 'contractor_org_id is required for contractor assignment' }, { status: 400 });
      }

      const assignment = await assignWorkOrderContractor({
        work_order_id: id,
        contractor_org_id,
        session,
      });

      return NextResponse.json({
        success: true,
        type: 'CONTRACTOR',
        assignment,
      });
    }

    return NextResponse.json(
      { error: 'Either engineer_person_id or contractor_org_id must be provided' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
