import type { Metadata } from 'next';
import { TemplateLobbyLearnGuides } from '@/templates/lobby/TemplateLobbyLearnGuides';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'FM Guides & Knowledge Library | LEARN · EntireFM',
  description: 'Practical guides, technical briefings, and explainers for UK facilities management professionals. Professionally written and regularly reviewed.',
  alternates: { canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/learn/guides` },
  openGraph: {
    title: 'FM Guides & Knowledge Library | LEARN · EntireFM',
    description: 'Practical FM guides, technical briefings, and explainers for UK facilities professionals.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/learn/guides`,
    type: 'website',
  },
};

export default function LearnGuidesPage() {
  return <TemplateLobbyLearnGuides />;
}
