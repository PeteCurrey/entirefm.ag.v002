/**
 * SEGMENTED SITEMAP ROUTE HANDLER
 * =================================
 * Serves /sitemaps/[group].xml for each sitemap group.
 * Generated from /config/route-registry.json.
 * Uses PRODUCTION_CANONICAL_HOST from src/config/site.ts as the single authority.
 *
 * Example: GET /sitemaps/locations.xml returns all location routes.
 */

import { NextResponse } from 'next/server';
import { getRoutesByGroup } from '@/lib/routes/route-registry';
import type { SitemapGroup } from '@/lib/routes/route-schema';
import { isIndexableByTier } from '@/config/indexation';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';
import { canIndexStaticBuild } from '@/lib/indexing';

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
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ group: string }> }
) {
  const { group } = await params;

  if (!VALID_GROUPS.includes(group as SitemapGroup)) {
    return new NextResponse('Sitemap group not found', { status: 404 });
  }

  if (!canIndexStaticBuild()) {
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      {
        headers: { 'Content-Type': 'application/xml' },
      }
    );
  }

  // A sitemap is a request to index, so it must agree with the robots tag.
  // Pages held for differentiation stay live and internally linked, but are
  // not advertised for indexing.
  const routes = getRoutesByGroup(group as SitemapGroup).filter(
    r => r.indexable && isIndexableByTier(r.path)
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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
