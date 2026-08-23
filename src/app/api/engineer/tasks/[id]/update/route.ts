import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
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
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { status, notes } = body;
  if (!status) {
    return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  }

  const patch: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (notes !== undefined) patch.notes = notes;
  if (status === 'COMPLETED') patch.completed_at = new Date().toISOString();

  const { error } = await dbQuery<any>(`work_order_tasks?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });

  if (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }

  await recordAuditEvent({
    event_type: 'TASK_COMPLETED',
    object_type: 'work_order_tasks',
    object_id: id,
    actor_id: session.personId,
    after_state: patch,
  });

  return NextResponse.json({ success: true });
}
