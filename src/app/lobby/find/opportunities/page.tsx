import type { Metadata } from 'next';
import { TemplateLobbyFind } from '@/templates/lobby/TemplateLobbyFind';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'Commercial FM Opportunities & Partnerships | FIND — EntireFM',
  description:
    'Commercial partnerships, regional supply-chain opportunities, specialist subcontract tenders, and industry appointments.',
  keywords: [
    'FM opportunities',
    'facilities management partnerships',
    'subcontract opportunities UK',
    'commercial FM tenders',
  ],
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find/opportunities`,
  },
  openGraph: {
    title: 'Commercial FM Opportunities & Partnerships | FIND — EntireFM',
    description:
      'Commercial partnerships, regional supply-chain opportunities, and specialist subcontract tenders.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/find/opportunities`,
    type: 'website',
  },
};

export default function FindOpportunitiesPage() {
  return <TemplateLobbyFind initialCategory="OPPORTUNITIES" />;
}
