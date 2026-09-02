import type { Metadata } from 'next';
import { TemplateLobbyFind } from '@/templates/lobby/TemplateLobbyFind';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'Chartered FM & Property Professionals | FIND — EntireFM',
  description:
    'Find chartered building surveyors (RICS), consulting M&E engineers (CIBSE), and fire safety specialists (IFE) for commercial estates.',
  keywords: [
    'FM consultants',
    'chartered building surveyor',
    'CIBSE consulting engineer',
    'fire safety consultant UK',
    'Building Safety Act specialist',
  ],
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find/professionals`,
  },
  openGraph: {
    title: 'Chartered FM & Property Professionals | FIND — EntireFM',
    description:
      'Find chartered building surveyors (RICS), consulting M&E engineers (CIBSE), and fire safety specialists (IFE).',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/find/professionals`,
    type: 'website',
  },
};

export default function FindProfessionalsPage() {
  return <TemplateLobbyFind initialCategory="PROFESSIONALS" />;
}
