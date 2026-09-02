import type { Metadata } from 'next';
import { TemplateLobbyConnect } from '@/templates/lobby/TemplateLobbyConnect';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'CONNECT · Professional FM Interaction & Roundtables | The Lobby — EntireFM',
  description:
    'Structured, signal-rich professional interaction for UK facilities management directors, building engineers, and estates teams. Ask The Lobby research desk, roundtables, and live rooms.',
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/connect`,
  },
  openGraph: {
    title: 'CONNECT · Professional FM Interaction & Roundtables | The Lobby — EntireFM',
    description:
      'Structured, signal-rich professional interaction for UK facilities management directors, building engineers, and estates teams.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/connect`,
    type: 'website',
  },
};

export default function LobbyConnectPage() {
  return <TemplateLobbyConnect />;
}
