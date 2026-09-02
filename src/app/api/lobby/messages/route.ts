import { NextResponse } from 'next/server';
import { getMemberConversations, startOrGetDirectConversation } from '@/server/messages/message-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { getMemberById } from '@/server/member/member-store';

export async function GET(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const conversations = await getMemberConversations(session.memberId);
  return NextResponse.json({ conversations });
}

export async function POST(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const sender = await getMemberById(session.memberId);
  if (!sender || sender.member_status !== 'active') {
    return NextResponse.json({ error: 'Account restricted or inactive' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { recipientMemberId, messageText } = body;

    if (!recipientMemberId || !messageText || messageText.trim().length === 0) {
      return NextResponse.json({ error: 'Recipient and message text required' }, { status: 400 });
    }

    const recipient = await getMemberById(recipientMemberId);
    if (!recipient) {
      return NextResponse.json({ error: 'Recipient member not found' }, { status: 404 });
    }

    const result = await startOrGetDirectConversation(
      { id: sender.id, name: sender.display_name, headline: sender.headline, company: sender.company, avatarUrl: sender.avatar_url },
      { id: recipient.id, name: recipient.display_name, headline: recipient.headline, company: recipient.company, avatarUrl: recipient.avatar_url },
      messageText
    );

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error creating message' }, { status: 400 });
  }
}
