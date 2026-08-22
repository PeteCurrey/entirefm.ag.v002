/**
 * METADATA GENERATION
 * ===================
 * Generates Next.js Metadata objects for any route in the registry.
 *
 * Rules:
 * - Protected routes always produce self-referencing canonical
 * - Non-production environments always produce noindex, nofollow
 * - Production indexing requires NEXT_PUBLIC_SITE_URL to be set
 * - Integrates with ContentRecord for unique, bespoke SEO titles & descriptions
 */

import type { Metadata } from 'next';
import type { RouteRecord } from '../routes/route-schema';
import { getRoute } from '../routes/route-registry';
import { getContentRecord } from '@/content/registry';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production' && SITE_URL !== '';

/**
 * Generate robots directives for a route.
 * NON-PRODUCTION: always noindex, nofollow.
 * PRODUCTION: follows route indexable flag.
 */
function getRobots(route: RouteRecord): Metadata['robots'] {
  if (!IS_PRODUCTION) {
    return {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    };
  }

  return {
    index: route.indexable,
    follow: route.indexable,
    googleBot: {
      index: route.indexable,
      follow: route.indexable,
    },
  };
}

/**
 * Build the canonical URL for a route.
 * Protected routes are always self-canonical.
 */
function getCanonicalUrl(path: string): string {
  if (!SITE_URL) return path;
  return `${SITE_URL}${path === '/' ? '' : path}`;
}

/**
 * Generate base metadata for any route in the registry.
 * Automatically looks up ContentRecord for unique title and metaDescription.
 */
export function generateRouteMetadata(
  path: string,
  overrides?: {
    title?: string;
    description?: string;
    openGraphTitle?: string;
    openGraphDescription?: string;
  }
): Metadata {
  const route = getRoute(path);
  const content = getContentRecord(path);

  // Fallback for unknown routes (404)
  if (!route) {
    return {
      title: 'Page Not Found | Entire FM',
      description: 'The requested page could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = getCanonicalUrl(path);
  const robots = getRobots(route);

  const title = overrides?.title ?? content?.title ?? `Page: ${path} | Entire FM`;
  const description =
    overrides?.description ??
    content?.metaDescription ??
    `Entire FM provides facilities management, mechanical and electrical engineering, and property maintenance services for ${path}.`;

  return {
    title,
    description,
    robots,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: overrides?.openGraphTitle ?? content?.title ?? title,
      description: overrides?.openGraphDescription ?? content?.metaDescription ?? description,
      url: canonicalUrl,
      siteName: 'Entire FM',
      type: 'website',
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: overrides?.openGraphTitle ?? content?.title ?? title,
      description: overrides?.openGraphDescription ?? content?.metaDescription ?? description,
    },
  };
}

/**
 * Site-wide default metadata (used by root layout).
 */
export const defaultMetadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  title: {
    default: 'Entire FM | Total Facilities Management',
    template: '%s | Entire FM',
  },
  description:
    'Entire FM provides integrated Hard FM, Soft FM, cleaning, PPM, and specialist facilities management services across the UK.',
  robots: IS_PRODUCTION
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    siteName: 'Entire FM',
    type: 'website',
    locale: 'en_GB',
  },
};
