import { NextResponse } from 'next/server';
import { updateParticipantStatus } from '@/server/messages/message-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { id: convId } = await params;
  const body = await request.json().catch(() => ({}));
  const { action } = body; // 'accepted' | 'declined' | 'blocked'

  if (!['accepted', 'declined', 'blocked'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  try {
    const conversation = await updateParticipantStatus(convId, session.memberId, action);
    return NextResponse.json({ conversation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating status' }, { status: 400 });
  }
}
