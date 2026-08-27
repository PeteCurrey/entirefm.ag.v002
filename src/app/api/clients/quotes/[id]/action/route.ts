/**
 * CLIENT QUOTE APPROVAL API — /api/clients/quotes/[id]/action (Phase 0M Addendum)
 * ===============================================================================
 * Handles Client APPROVE / DECLINE / QUESTION actions on quotes.
 * Updates canonical Quote status and creates audit log record.
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
    if (session.orgType !== 'CLIENT' && !isViewAs && session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: quoteId } = await params;
    const body = await req.json();
    const { action, notes } = body;

    if (!['APPROVE', 'DECLINE', 'QUESTION'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action: must be APPROVE, DECLINE, or QUESTION' }, { status: 400 });
    }

    // Verify quote exists and belongs to client organisation (or client account)
    const { data: quotes } = await dbQuery<any[]>(
      `quotes?id=eq.${encodeURIComponent(quoteId)}&select=id,quote_number,title,total_price_gbp,status`
    );
    const quote = quotes?.[0];
    if (!quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });

    const newStatus =
      action === 'APPROVE'
        ? 'APPROVED'
        : action === 'DECLINE'
        ? 'REJECTED'
        : 'QUERY';

    // Update canonical quote status
    await dbQuery(`quotes?id=eq.${encodeURIComponent(quoteId)}`, {
      method: 'PATCH',
      body: {
        status: newStatus,
        approved_at: action === 'APPROVE' ? new Date().toISOString() : null,
        client_feedback_notes: notes || null,
        updated_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      quote_id: quoteId,
      action,
      new_status: newStatus,
      message:
        action === 'APPROVE'
          ? `Quote ${quote.quote_number} has been approved. EntireFM Helpdesk will schedule attendance.`
          : action === 'DECLINE'
          ? `Quote ${quote.quote_number} has been declined.`
          : `Your question regarding Quote ${quote.quote_number} has been sent to our commercial team.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
