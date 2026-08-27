import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getIndustryAwardBySlug, getIndustryAwards } from '@/server/awards/awards-store';
import { TemplateAwardDetail } from '@/templates/awards/TemplateAwardDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const award = getIndustryAwardBySlug(slug);

  if (!award) {
    return { title: 'Award Not Found | The Lobby' };
  }

  return {
    title: `${award.name} | The Lobby Awards Desk`,
    description: award.description,
  };
}

export default async function AwardDetailPage({ params }: Props) {
  const { slug } = await params;
  const award = getIndustryAwardBySlug(slug);

  if (!award) {
    notFound();
  }

  const { awards: otherAwards } = getIndustryAwards({ limit: 4 });
  const filtered = otherAwards.filter((a) => a.slug !== award.slug);

  return (
    <TemplateAwardDetail
      award={award}
      otherAwards={filtered}
    />
  );
}
