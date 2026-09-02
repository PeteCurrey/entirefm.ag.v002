import type { Metadata } from 'next';
import { TemplateLobbyFind } from '@/templates/lobby/TemplateLobbyFind';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'FM Tenders & Public Sector Procurement | FIND — EntireFM',
  description:
    'Live UK commercial facilities management tenders, public-sector maintenance RFPs, and contract award intelligence from Find a Tender and Contracts Finder.',
  keywords: [
    'facilities management tenders',
    'FM tenders UK',
    'M&E maintenance contracts',
    'public sector FM tenders',
    'Find a Tender FM',
  ],
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find/tenders`,
  },
  openGraph: {
    title: 'FM Tenders & Public Sector Procurement | FIND — EntireFM',
    description:
      'Live UK commercial facilities management tenders and public-sector maintenance RFPs.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/find/tenders`,
    type: 'website',
  },
};

export default function FindTendersPage() {
  return <TemplateLobbyFind initialCategory="TENDERS" />;
}
