import { NextResponse } from 'next/server';
import { getDiscussionBySlug } from '@/server/community/community-store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const discussion = getDiscussionBySlug(slug);
  if (!discussion) {
    return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
  }
  return NextResponse.json({ discussion });
}
