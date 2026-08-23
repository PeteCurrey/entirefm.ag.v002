/**
 * METADATA GENERATION
 * ===================
 * Generates Next.js Metadata objects for any route in the registry.
 *
 * CANONICAL URLS: Always use PRODUCTION_CANONICAL_HOST from src/config/site.ts.
 * Do NOT derive canonical host from NEXT_PUBLIC_SITE_URL env var — that can
 * be overridden to a staging/preview URL, leaking wrong canonicals.
 *
 * INDEXING GATE: Uses canIndexStaticBuild() from src/lib/indexing.ts.
 * All three conditions must be met for any page to emit index, follow.
 */

import type { Metadata } from 'next';
import type { RouteRecord } from '../routes/route-schema';
import { getRoute } from '../routes/route-registry';
import { loadContentRecord } from '@/content';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';
import { canIndexStaticBuild } from '@/lib/indexing';
import { isIndexableByTier } from '@/config/indexation';

/**
 * Build the canonical URL for a route.
 * Always uses the hard-coded production host — never env var.
 */
function getCanonicalUrl(path: string): string {
  return `${PRODUCTION_CANONICAL_HOST}${path === '/' ? '' : path}`;
}

/**
 * Generate robots directives for a route.
 * Non-production or un-gated: strictly noindex, nofollow.
 * Production gated: follows route.indexable configuration.
 */
function getRobots(route: RouteRecord): Metadata['robots'] {
  if (!canIndexStaticBuild()) {
    return {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    };
  }

  // Two gates must both pass. The registry says whether a route is eligible at
  // all; the indexation tier says whether it is differentiated enough yet.
  //
  // `follow` stays true even when a page is held: the page is live, linked and
  // passes equity onward. Only the invitation to index is withheld.
  const eligible = route.indexable && isIndexableByTier(route.path);

  return {
    index: eligible,
    follow: route.indexable,
    googleBot: {
      index: eligible,
      follow: route.indexable,
    },
  };
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
  // loadContentRecord, not the raw registry — bespoke Tier 1 city records
  // supersede the generated ones and must drive metadata too.
  const content = loadContentRecord(path);

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
    // `absolute` bypasses the root layout's '%s | Entire FM' template.
    // Content titles already carry the brand, and letting the template also
    // apply produced a doubled '| Entire FM | Entire FM' suffix sitewide.
    title: { absolute: title },
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
  metadataBase: new URL(PRODUCTION_CANONICAL_HOST),
  title: {
    default: 'Entire FM | Total Facilities Management',
    template: '%s | Entire FM',
  },
  description:
    'Entire FM provides integrated Hard FM, Soft FM, cleaning, PPM, and specialist facilities management services across the UK.',
  robots: canIndexStaticBuild()
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    siteName: 'Entire FM',
    type: 'website',
    locale: 'en_GB',
  },
};
