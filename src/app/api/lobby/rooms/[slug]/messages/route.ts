import { NextResponse } from 'next/server';
import { getRoomBySlug, getRoomMessages, postRoomMessage } from '@/server/rooms/room-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { getMemberById } from '@/server/member/member-store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }
  const messages = getRoomMessages(slug);
  return NextResponse.json({ messages });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required to message in Rooms' }, { status: 401 });
  }

  const member = await getMemberById(session.memberId);
  if (!member || member.member_status !== 'active') {
    return NextResponse.json({ error: 'Account restricted or inactive' }, { status: 403 });
  }

  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { body: text, replyToMessageId, replyToSnippet } = body;

    if (!text || text.trim().length < 1) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const message = postRoomMessage({
      roomSlug: slug,
      authorMemberId: member.id,
      authorName: member.display_name,
      authorHeadline: member.headline,
      authorCompany: member.company,
      authorAvatarUrl: member.avatar_url,
      authorBadge: member.badges[0] || 'Member',
      isEntireFMOfficial: member.id === 'mem-00000000-0000-4000-8000-000000000001',
      body: text,
      replyToMessageId,
      replyToSnippet,
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
