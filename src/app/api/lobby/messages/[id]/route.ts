import { NextResponse } from 'next/server';
import { getConversationById, getConversationMessages, sendDirectMessage } from '@/server/messages/message-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { getMemberById } from '@/server/member/member-store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { id: convId } = await params;
  try {
    const conversation = getConversationById(convId, session.memberId);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    const messages = getConversationMessages(convId, session.memberId);
    return NextResponse.json({ conversation, messages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 403 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const sender = await getMemberById(session.memberId);
  if (!sender || sender.member_status !== 'active') {
    return NextResponse.json({ error: 'Account restricted or inactive' }, { status: 403 });
  }

  const { id: convId } = await params;
  try {
    const body = await request.json();
    const { body: text } = body;
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Message body required' }, { status: 400 });
    }

    const message = sendDirectMessage(convId, sender.id, sender.display_name, text);
    return NextResponse.json({ message }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error sending message' }, { status: 400 });
  }
}
