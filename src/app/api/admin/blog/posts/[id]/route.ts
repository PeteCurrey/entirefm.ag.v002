import { NextRequest, NextResponse } from 'next/server';
import { getBlogPost, saveBlogPost, updatePostStatus } from '@/server/blog/posts';

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const post = await getBlogPost(id);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = await req.json();
    if (body._action === 'STATUS') {
      const post = await updatePostStatus(id, body.status, body.scheduledAt, 'admin');
      return NextResponse.json(post);
    }
    const post = await saveBlogPost({ ...body, id }, 'admin');
    return NextResponse.json(post);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
