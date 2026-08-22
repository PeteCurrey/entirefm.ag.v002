/**
 * ROUTE REGISTRY LOADER
 * =====================
 * The single access point for all route data in the application.
 * All routing, sitemap generation, metadata, and content resolution
 * must go through this module — never import route-registry.json directly.
 */

import type { RouteRecord, ContentStatus, RouteType, SitemapGroup } from './route-schema';

// We use a require here so this works in both Node scripts and Next.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const registryData = require('../../../config/route-registry.json') as {
  routes: RouteRecord[];
  counts: {
    total: number;
    LEGACY_VERIFIED: number;
    LEGACY_PROTECTED_BY_DIRECTIVE: number;
    NEW_GROWTH: number;
    protected: number;
    historic: number;
  };
};

/** All routes in the registry */
export const ALL_ROUTES: RouteRecord[] = registryData.routes;

/** Registry-level counts */
export const ROUTE_COUNTS = registryData.counts;

/** Fast lookup: path → RouteRecord */
const routeMap = new Map<string, RouteRecord>();
for (const r of ALL_ROUTES) {
  routeMap.set(r.path, r);
  try {
    routeMap.set(decodeURIComponent(r.path), r);
    routeMap.set(encodeURI(r.path), r);
  } catch {}
}

/** Lookup a single route by exact path (or decoded/encoded variant) */
export function getRoute(path: string): RouteRecord | undefined {
  if (routeMap.has(path)) return routeMap.get(path);
  try {
    const decoded = decodeURIComponent(path);
    if (routeMap.has(decoded)) return routeMap.get(decoded);
    const encoded = encodeURI(path);
    if (routeMap.has(encoded)) return routeMap.get(encoded);
  } catch {}
  return undefined;
}

/** All protected routes */
export const PROTECTED_ROUTES: RouteRecord[] = ALL_ROUTES.filter(r => r.protected);

/** Set of all protected paths for fast membership testing */
export const PROTECTED_PATHS: ReadonlySet<string> = new Set(
  PROTECTED_ROUTES.map(r => r.path)
);

/** All indexable routes (suitable for sitemap inclusion) */
export const INDEXABLE_ROUTES: RouteRecord[] = ALL_ROUTES.filter(r => r.indexable);

/** Routes grouped by sitemapGroup */
export function getRoutesByGroup(group: SitemapGroup): RouteRecord[] {
  return ALL_ROUTES.filter(r => r.sitemapGroup === group);
}

/** Routes grouped by routeType */
export function getRoutesByType(type: RouteType): RouteRecord[] {
  return ALL_ROUTES.filter(r => r.routeType === type);
}

/** Routes filtered by content status */
export function getRoutesByContentStatus(status: ContentStatus): RouteRecord[] {
  return ALL_ROUTES.filter(r => r.contentStatus === status);
}

/** All route paths (for generating static params in Next.js) */
export function getAllPaths(): string[] {
  return ALL_ROUTES.map(r => r.path);
}

/**
 * Check whether a given path is a known route.
 * Unknown paths should return a genuine 404 — not a generic fallback page.
 */
export function isKnownRoute(path: string): boolean {
  return routeMap.has(path);
}

/**
 * Check whether a given path is a protected route.
 * Protected routes may not be redirected, removed, merged, or canonicalised elsewhere.
 */
export function isProtectedRoute(path: string): boolean {
  return PROTECTED_PATHS.has(path);
}
