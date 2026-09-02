import type { Metadata } from 'next';
import { TemplateLobbyFind } from '@/templates/lobby/TemplateLobbyFind';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'Specialist Trade Contractors Directory | FIND — EntireFM',
  description:
    'Discover verified commercial trade contractors: Electrical (NICEIC), HVAC & Chillers (Refcom), Fire Safety (BAFE), Mechanical, Roofing, and Fabric Maintenance.',
  keywords: [
    'FM contractors',
    'facilities management contractors',
    'commercial electrical contractor',
    'commercial HVAC contractor',
    'building maintenance contractors',
    'specialist FM contractors UK',
  ],
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find/contractors`,
  },
  openGraph: {
    title: 'Specialist Trade Contractors Directory | FIND — EntireFM',
    description:
      'Discover verified commercial trade contractors across 10 specialist disciplines with audited statutory credentials.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/find/contractors`,
    type: 'website',
  },
};

export default function FindContractorsPage() {
  return <TemplateLobbyFind initialCategory="CONTRACTORS" />;
}
