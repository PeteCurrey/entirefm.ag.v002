/**
 * DYNAMIC CATCH-ALL ROUTE — [...slug]/page.tsx
 * ============================================
 * Resolves every registered route through the route registry and renders
 * the corresponding approved design-system template.
 * Unknown routes return a genuine 404.
 *
 * ENCODED PATH HANDLING (Phase 09R.3):
 * Next.js decodes percent-encoded characters in the slug array before this
 * handler receives them. e.g. a request to:
 *   /facilities-management-for/education-%26-schools-facilities-management
 * arrives as slug = ['facilities-management-for', 'education-&-schools-facilities-management']
 *
 * The registry stores these routes with their original encoded form (%26, %2C).
 * resolveSlugPath() tries the decoded form first (covers normal routes), then
 * re-encodes known historic punctuation characters to find encoded registry keys.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALL_ROUTES, getRoute } from '@/lib/routes/route-registry';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { resolvePageTemplate } from '@/templates';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Convert slug array → candidate registry path.
 * Tries: decoded path, then re-encodes & → %26 and , → %2C for historic encoded routes.
 */
function resolveSlugPath(slug: string[]): string {
  const decoded = `/${slug.join('/')}`;
  // Fast path: most routes resolve with the decoded form
  if (getRoute(decoded)) return decoded;
  // Re-encode known historic punctuation that Next.js silently decodes
  const reEncoded = `/${slug
    .map(segment =>
      segment
        .replace(/&/g, '%26')
        .replace(/,/g, '%2C')
    )
    .join('/')}`;
  return reEncoded;
}

export async function generateStaticParams() {
  return ALL_ROUTES
    .filter(r => r.path !== '/')
    .map(r => ({
      // Split path into segments preserving encoded characters (%26, %2C etc.)
      // so Next.js generates the static file at the encoded URL.
      slug: r.path.replace(/^\//, '').split('/'),
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = slug ? resolveSlugPath(slug) : '/';
  const route = getRoute(path);

  if (!route) {
    return {
      title: 'Page Not Found | Entire FM',
      robots: { index: false, follow: false },
    };
  }

  return generateRouteMetadata(path);
}

export default async function RegistryPage({ params }: PageProps) {
  const { slug } = await params;
  const path = slug ? resolveSlugPath(slug) : '/';

  const route = getRoute(path);

  if (!route) {
    notFound();
  }

  return resolvePageTemplate(route);
}

