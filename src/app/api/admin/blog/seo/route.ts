import { NextResponse } from 'next/server';
import { memoryStore } from '@/server/blog/store';
import { analyzePostSeo } from '@/server/blog/seo';

export async function GET() {
  const posts = Array.from(memoryStore.posts.values());
  const seoAudit = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: post.status,
    seoScore: post.seoScore,
    seoStatus: post.seoStatus,
    analysis: analyzePostSeo(post, posts.filter((p) => p.id !== post.id)),
  }));
  return NextResponse.json(seoAudit);
}

export async function POST(req: Request) {
  const { postId } = await req.json();
  const posts = Array.from(memoryStore.posts.values());
  const post = posts.find((p) => p.id === postId);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const analysis = analyzePostSeo(post, posts.filter((p) => p.id !== post.id));
  return NextResponse.json(analysis);
}
