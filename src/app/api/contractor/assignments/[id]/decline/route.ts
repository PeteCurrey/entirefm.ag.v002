/**
 * CONTRACTOR ASSIGNMENT DECLINE API — /api/contractor/assignments/[id]/decline (Phase 0M Addendum)
 * ==============================================================================================
 * Records decline reason, updates assignment status, and triggers Helpdesk Re-dispatch Loop.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { handleContractorDecline } from '@/server/ai/dispatch/orchestrator';

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
    const body = await req.json();
    const { reason, notes } = body;

    if (!reason) {
      return NextResponse.json({ error: 'Decline reason is required' }, { status: 400 });
    }

    // 1. Fetch assignment and linked work order
    const { data: assignments } = await dbQuery<any[]>(
      `work_order_assignments?id=eq.${encodeURIComponent(assignmentId)}&select=*,work_order:work_orders(*,site:sites(*))`
    );
    const assignment = assignments?.[0];

    // Update assignment status to REJECTED
    try {
      await dbQuery(`work_order_assignments?id=eq.${encodeURIComponent(assignmentId)}`, {
        method: 'PATCH',
        body: {
          status: 'REJECTED',
          rejection_reason: reason,
          notes: notes || null,
          responded_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
    } catch {}

    // 2. Trigger Autonomous Re-dispatch Loop if linked work order found
    const wo = assignment?.work_order;
    let redispatchResult = null;

    if (wo) {
      try {
        redispatchResult = await handleContractorDecline({
          work_order_id: wo.id,
          work_order_number: wo.work_order_number,
          title: wo.title,
          trade: wo.trade || 'PLUMBING',
          priority: wo.priority || 'P3_MEDIUM',
          site_id: wo.site_id,
          site_name: wo.site?.name,
          site_city: wo.site?.city,
          declining_supplier_id: session.orgId,
          declining_supplier_name: session.orgName,
          decline_reason: `${reason}${notes ? `: ${notes}` : ''}`,
        });
      } catch (e: any) {
        console.warn('[CONTRACTOR_DECLINE_LOOP] Re-dispatch loop notice:', e?.message);
      }
    }

    return NextResponse.json({
      success: true,
      assignment_id: assignmentId,
      status: 'REJECTED',
      redispatch_status: redispatchResult?.status || 'REASSIGNMENT_QUEUED',
      message: 'Assignment declined. The EntireFM Helpdesk has been notified to reallocate the work order.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
