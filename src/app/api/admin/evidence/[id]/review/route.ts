import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { rejectEvidence } from '@/server/field';
import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { id } = await context.params;
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { status, reason, visitId } = body;
  if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: 'Valid review status required (APPROVED | REJECTED)' }, { status: 400 });
  }

  if (status === 'REJECTED') {
    if (!reason || !visitId) {
      return NextResponse.json({ error: 'Rejection reason and visitId are required' }, { status: 400 });
    }
    const result = await rejectEvidence(id, visitId, reason, session);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, status: 'REJECTED' });
  }

  // Approved
  await dbQuery<any>('evidence_reviews', {
    method: 'POST',
    body: JSON.stringify({
      evidence_id: id,
      visit_id: visitId || null,
      reviewer_person_id: session.personId,
      review_status: 'APPROVED',
    }),
  });

  await recordAuditEvent({
    event_type: 'EVIDENCE_APPROVED',
    object_type: 'evidence_reviews',
    object_id: id,
    actor_id: session.personId,
    after_state: { evidenceId: id, review_status: 'APPROVED' },
  });

  return NextResponse.json({ success: true, status: 'APPROVED' });
}
