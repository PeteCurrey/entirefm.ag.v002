import type { Metadata } from 'next';
import { TemplateLobbyFind } from '@/templates/lobby/TemplateLobbyFind';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'Professional FM Opportunities & Advisory Appointments | FIND — EntireFM',
  description:
    'Professional opportunities beyond permanent employment: interim management, advisory appointments, apprenticeships, and industry contribution roles.',
  keywords: [
    'interim FM jobs',
    'facilities management advisory',
    'FM apprenticeships',
    'interim mobilisation manager',
  ],
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find/opportunities`,
  },
  openGraph: {
    title: 'Professional FM Opportunities & Advisory Appointments | FIND — EntireFM',
    description:
      'Interim management, advisory appointments, apprenticeships, and industry contribution roles.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/find/opportunities`,
    type: 'website',
  },
};

export default function FindOpportunitiesPage() {
  return <TemplateLobbyFind initialTab="OPPORTUNITIES" />;
}
