/**
 * PAGE SCHEMA RESOLVER
 * ====================
 * Maps a route + content record to the JSON-LD @graph for that page.
 *
 * One place decides what schema each page archetype gets, so templates only
 * have to render <JsonLd graph={buildPageGraph(route, content)} />.
 */

import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';
import {
  buildGraph,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateWebPageSchema,
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateArticleSchema,
} from './structured-data';

/** Route types that describe a service EntireFM sells. */
const SERVICE_LIKE = new Set([
  'service',
  'location',
  'geographic-service',
  'sector',
  'hub',
]);

function breadcrumbsFor(route: RouteRecord, content: ContentRecord) {
  if (content.breadcrumbs?.length) {
    return content.breadcrumbs.map((b) => ({ name: b.name, url: b.url }));
  }
  return [
    { name: 'Home', url: '/' },
    { name: content.h1, url: route.path },
  ];
}

export function buildPageGraph(route: RouteRecord, content: ContentRecord) {
  const path = route.path;
  const isArticle = route.routeType === 'post' || path.startsWith('/post/');

  const nodes: Array<Record<string, unknown> | null> = [
    generateOrganizationSchema(),
    generateWebSiteSchema(),
    generateWebPageSchema({
      name: content.h1,
      description: content.metaDescription,
      path,
      primaryImage: content.heroImage,
    }),
    generateBreadcrumbSchema(breadcrumbsFor(route, content)),
  ];

  if (isArticle) {
    nodes.push(
      generateArticleSchema({
        headline: content.h1,
        description: content.metaDescription,
        path,
        // Preserved historic dates only — absent rather than invented.
        datePublished: (content.customData?.datePublished as string) ?? undefined,
        dateModified: (content.customData?.dateModified as string) ?? undefined,
        image: content.heroImage,
      })
    );
  } else if (SERVICE_LIKE.has(route.routeType)) {
    nodes.push(
      generateServiceSchema({
        name: content.h1,
        description: content.metaDescription,
        path,
        city: content.location ?? null,
        serviceType: content.service ?? 'Facilities Management',
        offers: content.capabilities?.map((c) => ({
          name: c.name,
          description: c.description,
        })),
      })
    );
  }

  if (content.faqs?.length) {
    nodes.push(generateFAQSchema(content.faqs, path));
  }

  return buildGraph(nodes);
}
