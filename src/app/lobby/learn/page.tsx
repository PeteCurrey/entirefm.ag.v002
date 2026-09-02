import type { Metadata } from 'next';
import { TemplateLobbyLearn } from '@/templates/lobby/TemplateLobbyLearn';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'LEARN · FM Knowledge & Professional Development | The Lobby — EntireFM',
  description:
    'Practical guides, technical briefings, playbooks, and professional development resources for UK facilities management and property professionals.',
  keywords: [
    'FM professional development',
    'facilities management learning',
    'FM knowledge',
    'FM guides',
    'PPM guide',
    'FM compliance guide',
    'facilities management training UK',
  ],
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/learn`,
  },
  openGraph: {
    title: 'LEARN · FM Knowledge & Professional Development | The Lobby — EntireFM',
    description:
      'Practical guides, technical briefings, playbooks, and professional development resources for UK FM professionals.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/learn`,
    type: 'website',
  },
};

export default function LobbyLearnPage() {
  return <TemplateLobbyLearn />;
}
