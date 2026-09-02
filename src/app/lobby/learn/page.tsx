import type { Metadata } from 'next';
import { TemplateLobbyLearn } from '@/templates/lobby/TemplateLobbyLearn';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'LEARN · Professional Development & FM Education | The Lobby — EntireFM',
  description:
    'Authoritative 10-minute technical briefings, verifiable CPD activity logs, engineering masterclasses, and practical facilities management education for UK professionals.',
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/learn`,
  },
  openGraph: {
    title: 'LEARN · Professional Development & FM Education | The Lobby — EntireFM',
    description:
      'Authoritative 10-minute technical briefings, verifiable CPD activity logs, and engineering masterclasses.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/learn`,
    type: 'website',
  },
};

export default function LobbyLearnPage() {
  return <TemplateLobbyLearn />;
}
