/**
 * SITEMAP INDEX — /sitemap.xml
 * =============================
 * Returns a sitemap index pointing to group-specific sitemaps.
 * Generated from /config/route-registry.json — do not hand-maintain.
 *
 * Sitemap groups:
 *   /sitemaps/core.xml
 *   /sitemaps/hard-fm.xml
 *   /sitemaps/soft-fm.xml
 *   /sitemaps/cleaning.xml
 *   /sitemaps/maintenance.xml
 *   /sitemaps/specialist-services.xml
 *   /sitemaps/sectors.xml
 *   /sitemaps/locations.xml
 *   /sitemaps/local-services.xml
 *   /sitemaps/insights.xml
 *   /sitemaps/company.xml
 *
 * Non-production: returns empty sitemap (crawling blocked by robots.ts).
 */

import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production' && SITE_URL !== '';

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

export default function sitemap(): MetadataRoute.Sitemap {
  if (!IS_PRODUCTION || !SITE_URL) {
    // Return empty sitemap in non-production
    return [];
  }

  // Return the index entries pointing to grouped sitemaps
  // Next.js does not natively support sitemap index, so we return
  // all URLs directly. The grouping is enforced in /sitemaps/[group]/route.ts
  // This file is the root entry point; individual group files are at /sitemaps/*
  return SITEMAP_GROUPS.map(group => ({
    url: `${SITE_URL}/sitemaps/${group}.xml`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));
}
