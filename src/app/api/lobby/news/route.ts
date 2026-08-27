import { NextRequest, NextResponse } from 'next/server';
import { getNewsArticles, getLeadNewsStory, getLatestNewsStream } from '@/server/news/news-store';
import type { NewsCategory } from '@/server/news/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as NewsCategory | null;
    const topic = searchParams.get('topic') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 20;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;

    const { articles, total } = getNewsArticles({
      category: category || undefined,
      topic,
      search,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      articles,
      total,
      limit,
      offset,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
