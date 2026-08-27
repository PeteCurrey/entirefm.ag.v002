import { NextResponse } from 'next/server';
import { blockMember } from '@/server/messages/message-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';

export async function POST(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { targetMemberId } = body;
  if (!targetMemberId) {
    return NextResponse.json({ error: 'targetMemberId required' }, { status: 400 });
  }

  blockMember(session.memberId, targetMemberId);
  return NextResponse.json({ success: true, blockedMemberId: targetMemberId });
}
