import { NextResponse } from 'next/server';
import { toggleHelpfulReaction } from '@/server/community/community-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required to mark responses helpful' }, { status: 401 });
  }

  const { id: replyId } = await params;
  try {
    const result = await toggleHelpfulReaction(replyId, session.memberId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating reaction' }, { status: 400 });
  }
}
