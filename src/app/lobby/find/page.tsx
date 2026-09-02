import type { Metadata } from 'next';
import { TemplateLobbyFind } from '@/templates/lobby/TemplateLobbyFind';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'FIND · FM Opportunities & Professional Directory | The Lobby — EntireFM',
  description:
    'Dedicated UK facilities management jobs board, commercial tenders, procurement frameworks, verified trade contractors, and professional property services directory.',
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find`,
  },
  openGraph: {
    title: 'FIND · FM Opportunities & Professional Directory | The Lobby — EntireFM',
    description:
      'Dedicated UK facilities management jobs board, commercial tenders, procurement frameworks, and verified trade contractors.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/find`,
    type: 'website',
  },
};

export default function LobbyFindPage() {
  return <TemplateLobbyFind />;
}
