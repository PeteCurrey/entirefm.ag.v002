/**
 * GET & DELETE /api/lobby/me/research/[id]
 * =========================================
 * Access or remove a single private saved research record.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { requireActiveMemberSession } from '@/server/member/member-session';
import { getSavedResearchById, deleteSavedResearch } from '@/server/ask/saved-research-store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error, status } = requireActiveMemberSession(request);
    if (!session) {
      return NextResponse.json({ error: error || 'Authentication required' }, { status });
    }

    const { id } = await params;
    const record = await getSavedResearchById(id, session.memberId);

    if (!record) {
      return NextResponse.json({ error: 'Research record not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      record,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Error fetching research' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error, status } = requireActiveMemberSession(request);
    if (!session) {
      return NextResponse.json({ error: error || 'Authentication required' }, { status });
    }

    const { id } = await params;
    const deleted = await deleteSavedResearch(id, session.memberId);

    if (!deleted) {
      return NextResponse.json({ error: 'Research record not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      deleted: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Error deleting research' }, { status: 500 });
  }
}
