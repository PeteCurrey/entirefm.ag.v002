import type { Metadata } from 'next';
import { TemplateLobbyFind } from '@/templates/lobby/TemplateLobbyFind';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'FM Career Progression Pathways | FIND — EntireFM',
  description:
    'Structured progression routes in UK facilities management across FM Operations, Technical M&E Engineering, Statutory Compliance, and Energy Management.',
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find/careers`,
  },
  openGraph: {
    title: 'FM Career Progression Pathways | FIND — EntireFM',
    description:
      'Structured progression routes across facilities operations, technical engineering, and statutory compliance.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/find/careers`,
    type: 'website',
  },
};

export default function FindCareersPage() {
  return <TemplateLobbyFind initialTab="CAREERS" />;
}
