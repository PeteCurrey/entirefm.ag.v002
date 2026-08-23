import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { visitId, workOrderId, captureType, storagePath, description, assetId } = body;
  if (!visitId || !storagePath) {
    return NextResponse.json({ error: 'visitId and storagePath are required' }, { status: 400 });
  }

  const record = {
    work_order_id: workOrderId || null,
    visit_id: visitId,
    asset_id: assetId || null,
    evidence_type: captureType || 'PHOTO',
    storage_path: storagePath,
    description: description || null,
    uploaded_by_person_id: session.personId,
    captured_at: new Date().toISOString(),
  };

  const { data, error } = await dbQuery<any[]>('completion_evidences?select=id', {
    method: 'POST',
    body: JSON.stringify(record),
  });

  if (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }

  const id = data?.[0]?.id ?? 'evidence-' + Date.now();

  await recordAuditEvent({
    event_type: 'FIELD_CAPTURE_CREATED',
    object_type: 'completion_evidences',
    object_id: id,
    actor_id: session.personId,
    after_state: { visit_id: visitId, capture_type: captureType },
  });

  return NextResponse.json({ success: true, id });
}
