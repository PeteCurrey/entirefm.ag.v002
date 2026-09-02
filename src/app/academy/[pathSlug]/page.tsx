import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPathBySlug } from '@/server/academy/academy-store';
import { TemplateLearningPath } from '@/templates/academy/TemplateLearningPath';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export async function generateMetadata(
  props: { params: Promise<{ pathSlug: string }> }
): Promise<Metadata> {
  const { pathSlug } = await props.params;
  const path = await getPathBySlug(pathSlug);

  if (!path) {
    return {
      title: 'Path Not Found | EntireFM Academy',
    };
  }

  return {
    title: `${path.title} | EntireFM Academy Certification`,
    description: path.description,
    alternates: {
      canonical: `${PRODUCTION_CANONICAL_HOST}/academy/${path.slug}`,
    },
    openGraph: {
      title: `${path.title} | EntireFM Academy`,
      description: path.description,
      url: `${PRODUCTION_CANONICAL_HOST}/academy/${path.slug}`,
      type: 'website',
    },
  };
}

export default async function AcademyPathPage(
  props: { params: Promise<{ pathSlug: string }> }
) {
  const { pathSlug } = await props.params;
  const path = await getPathBySlug(pathSlug);

  if (!path || path.status !== 'published') {
    notFound();
  }

  return <TemplateLearningPath initialPath={path} />;
}
