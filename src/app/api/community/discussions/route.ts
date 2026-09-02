import { NextResponse } from 'next/server';
import { getDiscussions, createDiscussion } from '@/server/community/community-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { getMemberById } from '@/server/member/member-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const query = searchParams.get('q') || undefined;
  const filter = searchParams.get('filter') || undefined;
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const result = await getDiscussions({
    categorySlug: category,
    tag,
    query,
    unansweredOnly: filter === 'unanswered',
    featuredOnly: filter === 'featured',
    limit,
    offset,
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required to post discussions' }, { status: 401 });
  }

  const member = await getMemberById(session.memberId);
  if (!member || member.member_status !== 'active') {
    return NextResponse.json({ error: 'Account restricted or inactive' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, body: textBody, categorySlug, tags } = body;

    if (!title || title.trim().length < 5) {
      return NextResponse.json({ error: 'Title must be at least 5 characters' }, { status: 400 });
    }
    if (!textBody || textBody.trim().length < 20) {
      return NextResponse.json({ error: 'Body must be at least 20 characters' }, { status: 400 });
    }
    if (!categorySlug) {
      return NextResponse.json({ error: 'Category selection required' }, { status: 400 });
    }

    const discussion = await createDiscussion({
      title,
      body: textBody,
      categorySlug,
      tags: Array.isArray(tags) ? tags : [],
      authorMemberId: member.id,
      authorName: member.display_name,
      authorHeadline: member.headline,
      authorCompany: member.company,
      authorAvatarUrl: member.avatar_url,
      authorBadge: member.badges[0] || 'Member',
    });

    return NextResponse.json({ discussion }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
