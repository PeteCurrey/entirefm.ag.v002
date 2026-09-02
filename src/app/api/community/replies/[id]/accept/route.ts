import { NextResponse } from 'next/server';
import { markAcceptedAnswer } from '@/server/community/community-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { id: replyId } = await params;
  const body = await request.json().catch(() => ({}));
  const { discussionId } = body;

  if (!discussionId) {
    return NextResponse.json({ error: 'discussionId is required' }, { status: 400 });
  }

  try {
    const result = await markAcceptedAnswer(discussionId, replyId, session.memberId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error marking accepted answer' }, { status: 403 });
  }
}
