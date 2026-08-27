/**
 * POST /api/lobby/ask/save
 * =========================
 * Saves a completed Ask The Lobby research snapshot to the Member's private research library.
 */

import { NextResponse } from 'next/server';
import { requireActiveMemberSession } from '@/server/member/member-session';
import { saveResearch } from '@/server/ask/saved-research-store';
import type { StructuredAskAnswer } from '@/server/ask/types';

export async function POST(request: Request) {
  try {
    const { session, error, status } = requireActiveMemberSession(request);
    if (!session) {
      return NextResponse.json({ error: error || 'Authentication required to save research' }, { status });
    }

    const body = await request.json().catch(() => ({}));
    const { answer } = body as { answer: StructuredAskAnswer };

    if (!answer || !answer.question || !answer.shortAnswer) {
      return NextResponse.json(
        { error: 'Valid answer snapshot required to save research' },
        { status: 400 }
      );
    }

    const savedRecord = await saveResearch(session.memberId, answer);

    return NextResponse.json({
      success: true,
      saved: true,
      record: savedRecord,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to save research snapshot' },
      { status: 500 }
    );
  }
}
