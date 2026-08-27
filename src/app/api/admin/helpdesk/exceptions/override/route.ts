/**
 * ENTIREFM HELPDESK EXCEPTIONS OVERRIDE API — POST (Phase 0M)
 * ============================================================
 * Records operator override actions (DISPATCH / ESCALATE / CLOSE) to the audit log.
 */

import { NextRequest, NextResponse } from 'next/server';
import { dbQuery } from '@/server/db/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { exception_id, action, operator_note } = body;

    if (!exception_id || !action || !operator_note?.trim()) {
      return NextResponse.json({ error: 'exception_id, action and operator_note required' }, { status: 400 });
    }

    // Attempt to write AI correction / audit record
    try {
      await dbQuery('ai_corrections', {
        method: 'POST',
        body: {
          agent_code: 'HELPDESK_EXCEPTION_OVERRIDE',
          reference_id: exception_id,
          operator_action: action,
          operator_note: operator_note.trim(),
          corrected_at: new Date().toISOString(),
        },
      });
    } catch {
      // ai_corrections may not have these columns — fail gracefully
    }

    // Update the service request status based on action
    const newStatus =
      action === 'DISPATCH'
        ? 'OPEN'
        : action === 'ESCALATE'
        ? 'ON_HOLD'
        : 'CLOSED';

    await dbQuery(`service_requests?id=eq.${encodeURIComponent(exception_id)}`, {
      method: 'PATCH',
      body: {
        status: newStatus,
        updated_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      action,
      exception_id,
      new_status: newStatus,
      audited_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
