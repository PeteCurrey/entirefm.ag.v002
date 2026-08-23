import { memoryStore } from '@/server/blog/store';
import { generateRssFeed } from '@/server/blog/rss';

export const dynamic = 'force-dynamic';

export async function GET() {
  const posts = Array.from(memoryStore.posts.values());
  const xml = generateRssFeed(posts);
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
