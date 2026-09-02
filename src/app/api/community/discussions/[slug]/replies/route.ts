import { NextResponse } from 'next/server';
import { getDiscussionBySlug, getDiscussionReplies, createDiscussionReply } from '@/server/community/community-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { getMemberById } from '@/server/member/member-store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const discussion = await getDiscussionBySlug(slug);
  if (!discussion) {
    return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
  }
  const replies = await getDiscussionReplies(discussion.id);
  return NextResponse.json({ replies });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required to post replies' }, { status: 401 });
  }

  const member = await getMemberById(session.memberId);
  if (!member || member.member_status !== 'active') {
    return NextResponse.json({ error: 'Account restricted or inactive' }, { status: 403 });
  }

  const { slug } = await params;
  const discussion = await getDiscussionBySlug(slug);
  if (!discussion) {
    return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { body: replyBody, parentReplyId, replyToMemberName } = body;

    if (!replyBody || replyBody.trim().length < 5) {
      return NextResponse.json({ error: 'Reply must be at least 5 characters' }, { status: 400 });
    }

    const reply = await createDiscussionReply({
      discussionId: discussion.id,
      body: replyBody,
      authorMemberId: member.id,
      authorName: member.display_name,
      authorHeadline: member.headline,
      authorCompany: member.company,
      authorAvatarUrl: member.avatar_url,
      authorBadge: member.badges[0] || 'Member',
      parentReplyId,
      replyToMemberName,
      isEntireFMOfficial: member.id === 'mem-00000000-0000-4000-8000-000000000001',
    });

    return NextResponse.json({ reply }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
