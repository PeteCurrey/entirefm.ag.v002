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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production' && SITE_URL !== '';

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION) {
    // Block all crawlers in non-production environments
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      // No sitemap in non-production
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
