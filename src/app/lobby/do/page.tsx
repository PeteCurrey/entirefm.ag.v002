import type { Metadata } from 'next';
import { TemplateLobbyDo } from '@/templates/lobby/TemplateLobbyDo';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'DO · Practical FM Toolbox | The Lobby — EntireFM',
  description:
    'Engineering-calibrated facilities management calculators, tender brief builders, SFG20 PPM schedule generators, asset scanners, inspection checklists, and verified templates.',
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/do`,
  },
  openGraph: {
    title: 'DO · Practical FM Toolbox | The Lobby — EntireFM',
    description:
      'Engineering-calibrated facilities management calculators, tender brief builders, SFG20 PPM schedule generators, and verified templates.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/do`,
    type: 'website',
  },
};

export default function LobbyDoPage() {
  return <TemplateLobbyDo />;
}
