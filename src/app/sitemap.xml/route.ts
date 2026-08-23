/**
 * TRUE SITEMAP INDEX ROUTE HANDLER — /sitemap.xml
 * ================================================
 * Generates an authentic <sitemapindex> pointing to segmented child sitemaps.
 * Uses PRODUCTION_CANONICAL_HOST from src/config/site.ts as the single authority.
 */

import { NextResponse } from 'next/server';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

const SITEMAP_GROUPS = [
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
] as const;

export async function GET() {
  const sitemaps = SITEMAP_GROUPS.map(
    group => `  <sitemap>
    <loc>${PRODUCTION_CANONICAL_HOST}/sitemaps/${group}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
