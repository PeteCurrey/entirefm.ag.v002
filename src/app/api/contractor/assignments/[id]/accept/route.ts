/**
 * CONTRACTOR ASSIGNMENT ACCEPT API — /api/contractor/assignments/[id]/accept (Phase 0M Addendum)
 * ==============================================================================================
 * Updates assignment status to ACCEPTED and advances WorkOrder status to IN_PROGRESS / SCHEDULED.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const isViewAs = !!session.viewAsContext?.isViewAs;
    if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: assignmentId } = await params;

    // 1. Fetch assignment
    const { data: assignments } = await dbQuery<any[]>(
      `work_order_assignments?id=eq.${encodeURIComponent(assignmentId)}&select=*,work_order:work_orders(*)`
    );
    const assignment = assignments?.[0];

    // If assignment table has no match or is legacy, check work_orders by ID
    let workOrderId = assignment?.work_order_id;
    if (!assignment) {
      const { data: woList } = await dbQuery<any[]>(
        `work_orders?id=eq.${encodeURIComponent(assignmentId)}&select=id,work_order_number,status`
      );
      if (woList && woList.length > 0) {
        workOrderId = woList[0].id;
      }
    }

    // 2. Update assignment status
    try {
      await dbQuery(`work_order_assignments?id=eq.${encodeURIComponent(assignmentId)}`, {
        method: 'PATCH',
        body: {
          status: 'ACCEPTED',
          responded_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
    } catch {}

    // 3. Update work order status
    if (workOrderId) {
      await dbQuery(`work_orders?id=eq.${encodeURIComponent(workOrderId)}`, {
        method: 'PATCH',
        body: {
          status: 'IN_PROGRESS',
          updated_at: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      assignment_id: assignmentId,
      status: 'ACCEPTED',
      message: 'Assignment accepted. Please allocate an operative or schedule attendance.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
