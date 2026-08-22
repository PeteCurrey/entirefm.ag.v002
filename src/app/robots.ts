/**
 * ROBOTS.TXT
 * ===========
 * Development/staging environments: disallow all crawling.
 * Production: allow indexing only when NEXT_PUBLIC_SITE_URL is set.
 *
 * This is a defence-in-depth measure alongside the metadata robots directives.
 * Both mechanisms are active — neither is relied upon alone.
 */

import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.entirefm.com';
const ALLOW_INDEXING = 
  process.env.ALLOW_SEARCH_INDEXING === 'true' &&
  (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') &&
  SITE_URL.includes('www.entirefm.com');

export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) {
    // Block all crawlers in non-production or staging environments
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
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
