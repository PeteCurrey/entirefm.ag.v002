import type { Metadata } from 'next';
import { TemplateLobbyConnect } from '@/templates/lobby/TemplateLobbyConnect';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'CONNECT · The Professional Common Room for FM | The Lobby — EntireFM',
  description:
    'Practical questions. Experienced practitioners. Better answers. Sourced UK facilities management discussions, technical consensus, live rooms, and grounded research desk inquiries without vanity metrics.',
  keywords: [
    'facilities management community',
    'FM professional discussions',
    'UK building engineering roundtables',
    'statutory compliance consensus',
    'Building Safety Act duty-holders',
    'FM contract mobilisation forum',
    'technical plant troubleshooting',
  ],
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/connect`,
  },
  openGraph: {
    title: 'CONNECT · The Professional Common Room for FM | The Lobby — EntireFM',
    description:
      'Practical questions. Experienced practitioners. Better answers. Structured professional exchange for UK facilities managers and estates leaders.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/connect`,
    type: 'website',
  },
};

export default function LobbyConnectPage() {
  return <TemplateLobbyConnect />;
}
