import type { Metadata } from 'next';
import { TemplateLobbyKnow } from '@/templates/lobby/TemplateLobbyKnow';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'KNOW · FM Intelligence Centre | The Lobby — EntireFM',
  description:
    'Authoritative UK facilities management intelligence: real-time regulatory shifts, Building Safety Act 2022 duty-holder updates, commercial procurement movements, contracts awarded, and grounded technical defect analyses for estates leaders.',
  keywords: [
    'facilities management intelligence',
    'FM news UK',
    'Building Safety Act 2022 Part 4',
    'statutory compliance FM',
    'FM market intelligence',
    'FM contracts awarded',
    'commercial property engineering',
    'SFG20 planned maintenance updates',
  ],
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/know`,
  },
  openGraph: {
    title: 'KNOW · FM Intelligence Centre | The Lobby — EntireFM',
    description:
      'Authoritative facilities management intelligence: real-time regulatory shifts, Building Safety Act updates, commercial procurement movements, and technical defect analyses.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/know`,
    type: 'website',
  },
};

export default function LobbyKnowPage() {
  return <TemplateLobbyKnow />;
}
