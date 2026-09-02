import type { Metadata } from 'next';
import { TemplateLobbyLearnAcademy } from '@/templates/lobby/TemplateLobbyLearnAcademy';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'EntireFM Academy | LEARN · EntireFM',
  description: 'The EntireFM Academy is in development. Structured professional development pathways and learning records for UK facilities management professionals — coming soon.',
  alternates: { canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/learn/academy` },
  openGraph: {
    title: 'EntireFM Academy | LEARN · EntireFM',
    description: 'Structured FM professional development pathways — in development.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/learn/academy`,
    type: 'website',
  },
};

export default function LearnAcademyPage() {
  return <TemplateLobbyLearnAcademy />;
}
