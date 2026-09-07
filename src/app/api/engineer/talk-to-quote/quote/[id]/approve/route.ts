/**
 * TALK TO QUOTE — QUOTE APPROVAL / DEPLOYMENT ENDPOINT
 * ====================================================
 * Updates quote status to READY_TO_ISSUE or ISSUED and logs audit event.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { id } = await params;

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const { deployToClient = false, notes } = body;
  const newStatus = deployToClient ? 'ISSUED' : 'INTERNAL_REVIEW';

  try {
    const { data: quotes } = await dbQuery<any[]>(`quotes?id=eq.${encodeURIComponent(id)}&limit=1`);
    if (!quotes || quotes.length === 0) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    await dbQuery(`quotes?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: {
        internal_status: newStatus,
        status: newStatus,
        approved_at: new Date().toISOString(),
        issued_at: deployToClient ? new Date().toISOString() : null,
        rejection_reason_detail: notes || null,
        updated_at: new Date().toISOString(),
      },
    });

    await recordAuditEvent({
      event_type: deployToClient ? 'QUOTE_ISSUED' : 'QUOTE_SUBMITTED_FOR_REVIEW',
      object_type: 'quotes',
      object_id: id,
      actor_id: session.personId,
      after_state: { status: newStatus, deployToClient, notes },
    });

    return NextResponse.json({
      success: true,
      status: newStatus,
      message: deployToClient ? 'Quote deployed and issued to client' : 'Quote submitted for Commercial Operations review',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
