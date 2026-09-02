import type { Metadata } from 'next';
import { TemplateLobbyFind } from '@/templates/lobby/TemplateLobbyFind';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'FM Salary Benchmarks & Employment Market Intelligence | FIND — EntireFM',
  description:
    'Sourced UK regional baseline salary guidelines across junior, mid-level, and senior tiers for facilities managers, building services engineers, and compliance leads.',
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find/salary`,
  },
  openGraph: {
    title: 'FM Salary Benchmarks & Employment Market Intelligence | FIND — EntireFM',
    description:
      'Sourced UK facilities management salary benchmarks and employment market intelligence.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/find/salary`,
    type: 'website',
  },
};

export default function FindSalaryPage() {
  return <TemplateLobbyFind initialTab="SALARY" />;
}
