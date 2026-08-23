import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { clientPoRef } = body;

    if (!clientPoRef) {
      return NextResponse.json({ error: 'clientPoRef is required' }, { status: 400 });
    }

    const { error } = await dbQuery(`quotes?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        client_po_ref: clientPoRef,
      }),
    });

    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 400 });
    }

    await recordAuditEvent({
      event_type: 'CLIENT_PO_SUBMITTED',
      object_type: 'quotes',
      object_id: id,
      actor_id: session.personId,
      after_state: { client_po_ref: clientPoRef },
    });

    return NextResponse.json({ success: true, message: 'Client Purchase Order reference recorded' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
