/**
 * SEGMENTED SITEMAP ROUTE HANDLER
 * =================================
 * Serves /sitemaps/[group].xml for each sitemap group.
 * Generated from /config/route-registry.json.
 *
 * Example: GET /sitemaps/locations.xml returns all location routes.
 */

import { NextResponse } from 'next/server';
import { getRoutesByGroup } from '@/lib/routes/route-registry';
import type { SitemapGroup } from '@/lib/routes/route-schema';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production' && SITE_URL !== '';

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

  if (!IS_PRODUCTION || !SITE_URL) {
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      {
        headers: { 'Content-Type': 'application/xml' },
      }
    );
  }

  const routes = getRoutesByGroup(group as SitemapGroup).filter(r => r.indexable);

  const urls = routes
    .map(
      r => `
  <url>
    <loc>${SITE_URL}${r.path}</loc>
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
