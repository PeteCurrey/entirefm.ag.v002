import { NextResponse } from 'next/server';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { getMemberById, toggleSavedContent } from '@/server/member/member-store';

export async function GET(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const member = await getMemberById(session.memberId);
  if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

  return NextResponse.json({ savedContentIds: member.saved_content_ids || [] });
}

export async function POST(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { contentId } = body;
  if (!contentId) {
    return NextResponse.json({ error: 'contentId is required' }, { status: 400 });
  }

  const result = await toggleSavedContent(session.memberId, contentId);
  if (!result) return NextResponse.json({ error: 'Failed to update saved content' }, { status: 400 });

  return NextResponse.json({
    savedContentIds: result.savedIds,
    isSaved: result.saved,
  });
}
