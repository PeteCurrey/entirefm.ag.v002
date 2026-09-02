import type { Metadata } from 'next';
import { TemplateLobbyDo } from '@/templates/lobby/TemplateLobbyDo';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'DO · Practical FM Toolbox & Workbench | The Lobby — EntireFM',
  description:
    'Practical FM tools, calculators, generators, contractor checklists, and AI utilities designed to make everyday facilities and property management work faster and easier.',
  keywords: [
    'facilities management tools',
    'FM calculators',
    'PPM schedule builder',
    'FM tender generator',
    'FM procurement templates',
    'statutory compliance checker',
    'contractor compliance checklists',
    'plant asset scanner',
    'SFG20 maintenance matrix',
  ],
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/do`,
  },
  openGraph: {
    title: 'DO · Practical FM Toolbox & Workbench | The Lobby — EntireFM',
    description:
      'Practical FM tools, calculators, generators, contractor checklists, and AI utilities designed to make everyday facilities management work faster.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/do`,
    type: 'website',
  },
};

export default function LobbyDoPage() {
  return <TemplateLobbyDo />;
}
