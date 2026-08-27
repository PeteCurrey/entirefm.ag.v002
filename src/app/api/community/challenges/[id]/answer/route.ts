import { NextResponse } from 'next/server';
import { submitChallengeAnswer } from '@/server/community/community-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required to answer the Lobby Question' }, { status: 401 });
  }

  const { id: challengeId } = await params;
  const body = await request.json().catch(() => ({}));
  const { selectedOptionId } = body;

  if (!selectedOptionId) {
    return NextResponse.json({ error: 'Option selection is required' }, { status: 400 });
  }

  try {
    const result = submitChallengeAnswer(challengeId, session.memberId, selectedOptionId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error submitting answer' }, { status: 400 });
  }
}
