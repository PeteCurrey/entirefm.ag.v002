/**
 * GET /api/lobby/me/research
 * ===========================
 * Lists private saved Ask The Lobby research reports for the authenticated Member.
 */

import { NextResponse } from 'next/server';
import { requireActiveMemberSession } from '@/server/member/member-session';
import { getSavedResearchByMember } from '@/server/ask/saved-research-store';

export async function GET(request: Request) {
  try {
    const { session, error, status } = requireActiveMemberSession(request);
    if (!session) {
      return NextResponse.json({ error: error || 'Authentication required' }, { status });
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || undefined;
    const search = searchParams.get('q') || undefined;

    const items = await getSavedResearchByMember(session.memberId, { mode, search });

    return NextResponse.json({
      success: true,
      items,
      count: items.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch saved research' },
      { status: 500 }
    );
  }
}
