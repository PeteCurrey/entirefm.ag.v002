import { NextResponse } from 'next/server';
import { listBlogPosts, saveBlogPost } from '@/server/blog/posts';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await listBlogPosts({
      status: searchParams.get('status') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      search: searchParams.get('search') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const post = await saveBlogPost(body, 'admin');
    return NextResponse.json(post, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
