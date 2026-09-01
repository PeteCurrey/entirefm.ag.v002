/**
 * CLIENT WORK ORDER SIGN-OFF API — /api/clients/work-orders/[id]/sign-off
 * =======================================================================
 * Allows authenticated clients to formally sign off completed work orders,
 * transition status to CLOSED, record satisfaction notes, and record audit event.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized — please sign in' }, { status: 401 });
    }

    const isInternal = session.orgType === 'ENTIREFM' || !!session.viewAsContext?.isViewAs;
    if (session.orgType !== 'CLIENT' && !isInternal) {
      return NextResponse.json({ error: 'Forbidden — only client authorizers can sign off work' }, { status: 403 });
    }

    const { id: workOrderId } = await params;
    const body = await req.json().catch(() => ({}));
    const { satisfaction_rating, notes } = body;

    // Verify work order exists and belongs to client organisation
    const { data: wos } = await dbQuery<any[]>(
      `work_orders?id=eq.${encodeURIComponent(workOrderId)}&select=id,work_order_number,status,organisation_id,site_id`
    );

    const workOrder = wos?.[0];
    if (!workOrder) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
    }

    if (!isInternal && workOrder.organisation_id !== session.orgId) {
      return NextResponse.json({ error: 'Forbidden — work order belongs to another organisation' }, { status: 403 });
    }

    const now = new Date().toISOString();

    // Update canonical status to CLOSED / SIGNED_OFF
    await dbQuery(`work_orders?id=eq.${encodeURIComponent(workOrderId)}`, {
      method: 'PATCH',
      body: {
        status: 'CLOSED',
        closed_at: now,
        client_sign_off_at: now,
        client_sign_off_by_person_id: session.personId || null,
        client_sign_off_notes: notes || null,
        updated_at: now,
      },
    });

    // Record activity in work activities
    await dbQuery(`work_activities`, {
      method: 'POST',
      body: {
        work_order_id: workOrderId,
        actor_person_id: session.personId || null,
        activity_type: 'CLIENT_SIGN_OFF',
        message: `Client satisfaction sign-off registered by ${session.name} (${session.role}). Work order successfully closed.${notes ? ` Notes: "${notes}"` : ''}`,
        metadata: {
          satisfaction_rating: satisfaction_rating || 5,
          signed_off_at: now,
        },
      },
    });

    // Audit log entry
    await recordAuditEvent({
      object_type: 'WORK_ORDER',
      object_id: workOrderId,
      event_type: 'WORK_ORDER_CLIENT_SIGN_OFF',
      actor_id: session.personId,
      actor_type: 'HUMAN',
      organisation_id: session.orgId,
      reason: 'Client satisfaction sign-off and closure',
      after_state: {
        status: 'CLOSED',
        closed_at: now,
        satisfaction_rating: satisfaction_rating || 5,
      },
    });

    return NextResponse.json({
      success: true,
      work_order_id: workOrderId,
      status: 'CLOSED',
      message: `Work Order ${workOrder.work_order_number} has been signed off and closed.`,
    });
  } catch (err: any) {
    console.error('[CLIENT_SIGN_OFF_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
