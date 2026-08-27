import { NextResponse } from 'next/server';
import { votePoll } from '@/server/community/community-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required to vote in The Pulse' }, { status: 401 });
  }

  const { id: pollId } = await params;
  const body = await request.json().catch(() => ({}));
  const { optionId } = body;

  if (!optionId) {
    return NextResponse.json({ error: 'Option selection is required' }, { status: 400 });
  }

  try {
    const updatedPoll = votePoll(pollId, session.memberId, optionId);
    return NextResponse.json({ poll: updatedPoll, voted: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error recording vote' }, { status: 400 });
  }
}
