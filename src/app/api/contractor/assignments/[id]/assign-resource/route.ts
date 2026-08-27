import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';
import { getContractorOperativeById } from '@/server/contractor/workforce-service';
import { evaluateOperativeEligibility } from '@/server/contractor/operative-eligibility-engine';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const { id: assignmentId } = await params;
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { engineerPersonId, overrideReason } = body;
  if (!engineerPersonId) {
    return NextResponse.json({ error: 'engineerPersonId is required' }, { status: 400 });
  }

  // 1. Fetch assignment and work order details
  const { data: assignments } = await dbQuery<any[]>(
    `work_assignments?id=eq.${encodeURIComponent(assignmentId)}&select=*,work_order:work_orders(*)`
  );

  if (!assignments || assignments.length === 0) {
    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
  }

  const assignment = assignments[0];
  const workOrder = assignment.work_order || {};

  // Check tenant boundary
  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== assignment.provider_org_id) {
    return NextResponse.json({ error: 'FORBIDDEN: You may only assign resources to your own jobs' }, { status: 403 });
  }

  // 2. Fetch Operative Profile
  const operative = await getContractorOperativeById(engineerPersonId, session);
  if (!operative) {
    return NextResponse.json({ error: 'Operative does not exist in your workforce roster' }, { status: 400 });
  }

  // 3. Evaluate multi-layer eligibility
  const reqTrade = workOrder.trade || 'GENERAL_MAINTENANCE';
  const evaluation = await evaluateOperativeEligibility(
    operative,
    {
      workOrderId: workOrder.id || assignment.work_order_id,
      workOrderNumber: workOrder.work_order_number,
      title: workOrder.title || 'Work Order',
      trade: reqTrade,
      isEmergencyP1: workOrder.priority === 'P1_EMERGENCY',
    },
    session
  );

  // If hard blocked or soft blocked without admin override
  if (!evaluation.isEligible) {
    const isAdmin = session.orgType === 'ENTIREFM';
    if (!isAdmin) {
      return NextResponse.json(
        {
          error: 'Operative is not eligible for this work order',
          evaluation,
        },
        { status: 400 }
      );
    }

    if (!overrideReason || !overrideReason.trim()) {
      return NextResponse.json(
        {
          error: 'Override reason is required for exceptional assignment',
          evaluation,
        },
        { status: 400 }
      );
    }
  }

  const now = new Date().toISOString();

  // 4. Update assignment
  await dbQuery(`work_assignments?id=eq.${assignmentId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      assigned_person_id: operative.personId,
      status: assignment.status === 'OFFERED' ? 'ACCEPTED' : assignment.status,
      updated_at: now,
    }),
  });

  // 5. Update corresponding visit if exists
  if (assignment.visit_id) {
    await dbQuery(`visits?id=eq.${assignment.visit_id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        engineer_person_id: operative.personId,
        updated_at: now,
      }),
    });
  }

  // 6. Record audit event
  await recordAuditEvent({
    event_type: overrideReason ? 'ASSIGNMENT_OVERRIDE_AUTHORISED' : 'OPERATIVE_ASSIGNED_TO_WORK_ORDER',
    object_type: 'work_assignments',
    object_id: assignmentId,
    actor_id: session.personId,
    after_state: {
      assignedOperativeName: operative.fullName,
      assignedPersonId: operative.personId,
      workOrderId: workOrder.id,
      eligibilityStatus: evaluation.status,
      overrideReason: overrideReason || null,
    },
  });

  return NextResponse.json({
    success: true,
    operativeName: operative.fullName,
    eligibilityStatus: evaluation.status,
  });
}
