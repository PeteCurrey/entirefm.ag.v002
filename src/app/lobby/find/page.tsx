import type { Metadata } from 'next';
import { TemplateLobbyFind } from '@/templates/lobby/TemplateLobbyFind';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'FIND · FM Roles, Career Progression & Opportunities | The Lobby — EntireFM',
  description:
    'Dedicated UK facilities management career platform: verified professional vacancies, role specifications, progression pathways, and sourced salary benchmarks.',
  keywords: [
    'facilities management careers',
    'FM jobs UK',
    'facilities manager career path',
    'building services engineer jobs',
    'FM salary survey',
    'facilities management progression',
  ],
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find`,
  },
  openGraph: {
    title: 'FIND · FM Roles, Career Progression & Opportunities | The Lobby — EntireFM',
    description:
      'Professional career intelligence for UK facilities and estates management professionals.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/find`,
    type: 'website',
  },
};

export default function LobbyFindPage() {
  return <TemplateLobbyFind initialTab="ALL" />;
}
