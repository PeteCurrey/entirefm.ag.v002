/**
 * SEGMENTED SITEMAP ROUTE HANDLER
 * =================================
 * Serves /sitemaps/[group].xml for each sitemap group.
 * Generated deterministically from /config/route-registry.json.
 * Uses PRODUCTION_CANONICAL_HOST from src/config/site.ts as the single authority.
 *
 * Example: GET /sitemaps/locations.xml returns all location routes.
 */

import { NextResponse } from 'next/server';
import { getRoutesByGroup } from '@/lib/routes/route-registry';
import type { SitemapGroup } from '@/lib/routes/route-schema';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';
import { getAllPublishedLobbyArticles, getAllLobbyTopics } from '@/lib/lobby/repository';

const VALID_GROUPS: SitemapGroup[] = [
  'core',
  'hard-fm',
  'soft-fm',
  'cleaning',
  'maintenance',
  'specialist-services',
  'sectors',
  'locations',
  'local-services',
  'insights',
  'company',
  'glossary',
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ group: string }> }
) {
  const rawGroup = (await params).group;
  // Safely strip .xml extension — the sitemap index references /sitemaps/core.xml
  // but the [group] dynamic segment receives the full string including .xml
  const group = rawGroup.replace(/\.xml$/i, '');

  if (!VALID_GROUPS.includes(group as SitemapGroup)) {
    return new NextResponse('Sitemap group not found', { status: 404 });
  }

  const routes = getRoutesByGroup(group as SitemapGroup).filter(
    r => r.indexable
  );

  const urls = routes
    .map(
      r => `
  <url>
    <loc>${PRODUCTION_CANONICAL_HOST}${r.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${r.priority === 'P0' ? '1.0' : r.priority === 'P1' ? '0.8' : r.priority === 'P2' ? '0.6' : '0.4'}</priority>
  </url>`
    )
    .join('');

  let additionalUrls = '';
  if (group === 'insights') {
    const lobbyArticles = getAllPublishedLobbyArticles();
    const lobbyTopics = getAllLobbyTopics();

    additionalUrls = [
      `
  <url>
    <loc>${PRODUCTION_CANONICAL_HOST}/lobby/archive</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`,
      ...lobbyArticles.map(
        (a) => `
  <url>
    <loc>${PRODUCTION_CANONICAL_HOST}/lobby/${a.slug}</loc>
    <lastmod>${a.updatedAt || a.publishedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${a.featured ? '0.9' : '0.7'}</priority>
  </url>`
      ),
      ...lobbyTopics.map(
        (t) => `
  <url>
    <loc>${PRODUCTION_CANONICAL_HOST}/lobby/topic/${t.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
      ),
    ].join('');
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}${additionalUrls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
