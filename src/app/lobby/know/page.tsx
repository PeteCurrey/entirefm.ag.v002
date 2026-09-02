import type { Metadata } from 'next';
import { TemplateLobbyKnow } from '@/templates/lobby/TemplateLobbyKnow';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'KNOW · FM Intelligence Centre | The Lobby — EntireFM',
  description:
    'Authoritative facilities management intelligence, Building Safety Act regulatory updates, market movements, contracts awarded, and grounded technical analysis for UK estates directors.',
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/know`,
  },
  openGraph: {
    title: 'KNOW · FM Intelligence Centre | The Lobby — EntireFM',
    description:
      'Authoritative facilities management intelligence, Building Safety Act regulatory updates, and market movements.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/know`,
    type: 'website',
  },
};

export default function LobbyKnowPage() {
  return <TemplateLobbyKnow />;
}
