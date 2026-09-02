import type { Metadata } from 'next';
import { TemplateLobbyCheck } from '@/templates/lobby/TemplateLobbyCheck';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'CHECK · FM Compliance Centre | The Lobby — EntireFM',
  description:
    'Authoritative UK facilities statutory compliance directory, mandatory inspection frequencies, evidence requirements, and interactive compliance tools for estates directors.',
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/check`,
  },
  openGraph: {
    title: 'CHECK · FM Compliance Centre | The Lobby — EntireFM',
    description:
      'Authoritative UK facilities statutory compliance directory, mandatory inspection frequencies, and evidence requirements.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/check`,
    type: 'website',
  },
};

export default function LobbyCheckPage() {
  return <TemplateLobbyCheck />;
}
