import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPathBySlug } from '@/server/academy/academy-store';
import { TemplateLearningPath } from '@/templates/academy/TemplateLearningPath';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const dynamic = 'force-dynamic';

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
    title: `${path.title} | LEARN · EntireFM Academy`,
    description: path.description,
    alternates: {
      canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/learn/academy/${path.slug}`,
    },
  };
}

export default async function LobbyLearnAcademyPathPage(
  props: { params: Promise<{ pathSlug: string }> }
) {
  const { pathSlug } = await props.params;
  const path = await getPathBySlug(pathSlug);

  if (!path || path.status !== 'published') {
    notFound();
  }

  return <TemplateLearningPath initialPath={path} />;
}
