/**
 * DYNAMIC CATCH-ALL ROUTE — [[...slug]]/page.tsx
 * ================================================
 * Resolves every registered route through the route registry.
 * Unknown routes return a genuine 404 — not a generic fallback.
 *
 * Phase 02: Structural skeleton only.
 * - Returns HTTP 200 for every registered route
 * - Returns 404 for any unregistered path
 * - Each page shows its own route metadata and content status
 * - No visual design at this stage
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALL_ROUTES, getRoute } from '@/lib/routes/route-registry';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { getInternalLinks } from '@/lib/internal-linking/link-map';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Generate static params for all registered routes.
 * This ensures every route is pre-rendered at build time.
 */
export async function generateStaticParams() {
  // Exclude homepage (handled by /page.tsx)
  return ALL_ROUTES
    .filter(r => r.path !== '/')
    .map(r => ({
      slug: r.path.replace(/^\//, '').split('/'),
    }));
}

/**
 * Generate metadata for each route from the registry.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = slug ? `/${slug.join('/')}` : '/';
  const route = getRoute(path);

  if (!route) {
    return {
      title: 'Page Not Found | Entire FM',
      robots: { index: false, follow: false },
    };
  }

  return generateRouteMetadata(path, {
    title: `${path} | Entire FM`,
    description: `Entire FM facilities management service page. Content specification in progress.`,
  });
}

/**
 * Page component: resolves path against route registry.
 * Unknown paths → 404. Known paths → structural skeleton page.
 */
export default async function RegistryPage({ params }: PageProps) {
  const { slug } = await params;
  const path = slug ? `/${slug.join('/')}` : '/';

  const route = getRoute(path);

  // Unknown route — genuine 404
  if (!route) {
    notFound();
  }

  const relatedLinks = getInternalLinks(path);

  return (
    <main>
      {/* Structural skeleton — Phase 02 */}
      <h1>
        {path}
      </h1>

      <dl>
        <dt>Route Type</dt>
        <dd>{route.routeType}</dd>

        <dt>Provenance</dt>
        <dd>{route.routeProvenance}</dd>

        <dt>Historic</dt>
        <dd>{route.historic ? 'Yes' : 'No'}</dd>

        <dt>Protected</dt>
        <dd>{route.protected ? 'Yes — may not redirect or canonicalise elsewhere' : 'No'}</dd>

        <dt>Canonical</dt>
        <dd>Self — {path}</dd>

        <dt>Sitemap Group</dt>
        <dd>{route.sitemapGroup}</dd>

        <dt>Priority</dt>
        <dd>{route.priority}</dd>

        <dt>Content Status</dt>
        <dd>{route.contentStatus}</dd>

        <dt>Historic Sources</dt>
        <dd>
          {route.historicSources.length > 0
            ? route.historicSources.join(', ')
            : 'None (new growth route)'}
        </dd>

        {route.location && (
          <>
            <dt>Location</dt>
            <dd>{route.location}</dd>
          </>
        )}
      </dl>

      {relatedLinks.length > 0 && (
        <nav aria-label="Related pages">
          <h2>Related Pages</h2>
          <ul>
            {relatedLinks.map(link => (
              <li key={link.path}>
                <a href={link.path}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Dev-only notice */}
      {process.env.NODE_ENV !== 'production' && (
        <aside style={{ marginTop: '2rem', padding: '1rem', border: '2px dashed #999', background: '#f9f9f9', fontSize: '0.85rem' }}>
          <strong>Phase 02 — Architecture Skeleton</strong>
          <p>Content status: <strong>{route.contentStatus}</strong></p>
          <p>This page returns HTTP 200 and is self-canonical. Content will be written in Phase 03+.</p>
          {route.g1_url && <p>G1 source: <a href={route.g1_url}>{route.g1_url}</a></p>}
          {route.g2_url && <p>G2 source: <a href={route.g2_url}>{route.g2_url}</a></p>}
        </aside>
      )}
    </main>
  );
}
