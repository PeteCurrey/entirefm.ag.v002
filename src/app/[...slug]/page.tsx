/**
 * DYNAMIC CATCH-ALL ROUTE — [...slug]/page.tsx
 * ============================================
 * Resolves every registered route through the route registry and renders
 * the corresponding approved design-system template.
 * Unknown routes return a genuine 404.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALL_ROUTES, getRoute } from '@/lib/routes/route-registry';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { resolvePageTemplate } from '@/templates';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  return ALL_ROUTES
    .filter(r => r.path !== '/')
    .map(r => ({
      slug: r.path.replace(/^\//, '').split('/'),
    }));
}

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

  return generateRouteMetadata(path);
}

export default async function RegistryPage({ params }: PageProps) {
  const { slug } = await params;
  const path = slug ? `/${slug.join('/')}` : '/';

  const route = getRoute(path);

  if (!route) {
    notFound();
  }

  return resolvePageTemplate(route);
}
