/**
 * SEO ARCHITECTURE TESTS
 * =======================
 * Build-time validation that every protected route satisfies all requirements.
 *
 * Tests:
 *  1. Every protected route is in the registry
 *  2. Every protected route has statusRequired = 200
 *  3. Every protected route is indexable
 *  4. Every protected route has canonical = self
 *  5. Every protected route has uniquePageRequired = true
 *  6. No protected route appears as a redirect source
 *  7. No duplicate paths in registry
 *  8. Registry schema validates
 *  9. Every protected route appears in a sitemap group
 * 10. Every historic route from legacy-url-registry.json exists in route-registry.json
 */

import * as fs from 'fs';
import * as path from 'path';

// Load registries directly (no module resolution needed for tests)
const REPO_ROOT = path.join(__dirname, '..', '..', '..');
const routeRegistry = JSON.parse(
  fs.readFileSync(path.join(REPO_ROOT, 'config', 'route-registry.json'), 'utf-8')
);
const legacyRegistry = JSON.parse(
  fs.readFileSync(path.join(REPO_ROOT, 'docs', 'seo', 'legacy-url-registry.json'), 'utf-8')
);
const redirectsRegistry = JSON.parse(
  fs.readFileSync(path.join(REPO_ROOT, 'config', 'redirects.json'), 'utf-8')
);

const routes: Array<{
  path: string;
  protected: boolean;
  indexable: boolean;
  statusRequired: number;
  canonical: string;
  uniquePageRequired: boolean;
  sitemapGroup: string;
  contentStatus: string;
  routeProvenance: string;
  historic: boolean;
}> = routeRegistry.routes;

const legacyPaths: string[] = legacyRegistry.map((r: { path: string }) => r.path);
const registryPaths = new Set(routes.map(r => r.path));
const protectedRoutes = routes.filter(r => r.protected);
const redirectSources: string[] = redirectsRegistry.redirects.map(
  (r: { source: string }) => r.source
);

const VALID_SITEMAP_GROUPS = new Set([
  'core', 'hard-fm', 'soft-fm', 'cleaning', 'maintenance',
  'specialist-services', 'sectors', 'locations', 'local-services',
  'insights', 'company',
]);

describe('SEO Architecture — Route Registry', () => {
  test('Route registry loads and has routes', () => {
    expect(routeRegistry.routes).toBeDefined();
    expect(routeRegistry.routes.length).toBeGreaterThan(0);
  });

  test('Route counts match expected minimums', () => {
    expect(routes.length).toBeGreaterThanOrEqual(229);
    expect(protectedRoutes.length).toBeGreaterThanOrEqual(229);
  });

  test('No duplicate paths exist in registry', () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const r of routes) {
      if (seen.has(r.path)) duplicates.push(r.path);
      seen.add(r.path);
    }
    expect(duplicates).toEqual([]);
  });

  test('All paths start with /', () => {
    const invalid = routes.filter(r => !r.path.startsWith('/'));
    expect(invalid.map(r => r.path)).toEqual([]);
  });
});

describe('SEO Architecture — Protected Route Requirements', () => {
  test('Every protected route has statusRequired = 200', () => {
    const failing = protectedRoutes.filter(r => r.statusRequired !== 200);
    expect(failing.map(r => r.path)).toEqual([]);
  });

  test('Every protected route is indexable', () => {
    const failing = protectedRoutes.filter(r => !r.indexable);
    expect(failing.map(r => r.path)).toEqual([]);
  });

  test('Every protected route has canonical = self', () => {
    const failing = protectedRoutes.filter(r => r.canonical !== 'self');
    expect(failing.map(r => r.path)).toEqual([]);
  });

  test('Every protected route has uniquePageRequired = true', () => {
    const failing = protectedRoutes.filter(r => !r.uniquePageRequired);
    expect(failing.map(r => r.path)).toEqual([]);
  });

  test('No protected route has contentStatus = SPEC_MISSING', () => {
    const failing = protectedRoutes.filter(r => r.contentStatus === 'SPEC_MISSING');
    expect(failing.map(r => r.path)).toEqual([]);
  });

  test('Every protected route has a valid sitemapGroup', () => {
    const failing = protectedRoutes.filter(r => !VALID_SITEMAP_GROUPS.has(r.sitemapGroup));
    expect(failing.map(r => ({ path: r.path, group: r.sitemapGroup }))).toEqual([]);
  });
});

describe('SEO Architecture — Redirect Validation', () => {
  test('No protected route appears as a redirect source', () => {
    const protectedPaths = new Set(protectedRoutes.map(r => r.path));
    const violations = redirectSources.filter(source => protectedPaths.has(source));
    expect(violations).toEqual([]);
  });

  test('Redirects registry loads correctly', () => {
    expect(redirectsRegistry.redirects).toBeDefined();
    expect(Array.isArray(redirectsRegistry.redirects)).toBe(true);
  });
});

describe('SEO Architecture — Legacy Parity', () => {
  test('Every path from legacy-url-registry.json exists in route-registry.json', () => {
    const missing = legacyPaths.filter((p: string) => !registryPaths.has(p));
    expect(missing).toEqual([]);
  });

  test('Registry contains at least as many routes as legacy registry', () => {
    expect(routes.length).toBeGreaterThanOrEqual(legacyPaths.length);
  });
});

describe('SEO Architecture — Provenance Classification', () => {
  test('All routes have a valid routeProvenance', () => {
    const valid = new Set(['LEGACY_VERIFIED', 'LEGACY_PROTECTED_BY_DIRECTIVE', 'NEW_GROWTH']);
    const invalid = routes.filter(r => !valid.has(r.routeProvenance));
    expect(invalid.map(r => ({ path: r.path, provenance: r.routeProvenance }))).toEqual([]);
  });

  test('Historic routes are not classified as NEW_GROWTH', () => {
    const violations = routes.filter(r => r.historic && r.routeProvenance === 'NEW_GROWTH');
    expect(violations.map(r => r.path)).toEqual([]);
  });
});

describe('SEO Architecture — Critical Routes Present', () => {
  const CRITICAL_ROUTES = [
    '/mechanical-electrical',
    '/hvac-contractor',
    '/ppm',
    '/hard-services',
    '/soft-services',
    '/industrial-cleaning',
    '/cleaning-services',
    '/fm-london',
    '/facilities-management-london',
    '/london-facilities-management',
    '/facilities-management-manchester',
    '/fm-manchester',
    '/facilities-management-birmingham',
    '/fm-birmingham',
    '/facilities-management-sheffield',
    '/fm-sheffield',
    '/facilities-management-lincoln',
    '/fm-lincoln',
    '/mechanical-electrical/emergency-light-testing',
    '/mechanical-electrical/access-control',
    '/mobile-crane-hire',
    '/plumbing-gas',
    '/fire-emergency-systems',
    '/safety-critical-emergency-systems',
  ];

  CRITICAL_ROUTES.forEach(route => {
    test(`Critical route exists: ${route}`, () => {
      expect(registryPaths.has(route)).toBe(true);
    });
  });
});
