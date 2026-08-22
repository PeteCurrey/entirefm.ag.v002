/**
 * ROBOTS.TXT
 * ===========
 * Development/staging environments: disallow all crawling.
 * Production: allow indexing only when all three gates pass.
 *
 * Gate authority: canIndexStaticBuild() from src/lib/indexing.ts
 * Canonical host: PRODUCTION_CANONICAL_HOST from src/config/site.ts
 *
 * A deployment at entirefmagv002.vercel.app always produces Disallow: /
 * because NEXT_PUBLIC_SITE_URL will not contain www.entirefm.com.
 */

import type { MetadataRoute } from 'next';
import { canIndexStaticBuild } from '@/lib/indexing';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  if (!canIndexStaticBuild()) {
    // Block all crawlers on staging, preview, and local environments
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/client-login/', '/helpdesk-registration', '/fm-supply-form'],
      },
    ],
    sitemap: `${PRODUCTION_CANONICAL_HOST}/sitemap.xml`,
    host: PRODUCTION_CANONICAL_HOST,
  };
}
