import { generateLobbyRssXml } from '@/lib/lobby/repository';

export async function GET() {
  const rssXml = generateLobbyRssXml();

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
