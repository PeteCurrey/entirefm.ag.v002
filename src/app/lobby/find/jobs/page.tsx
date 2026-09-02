import type { Metadata } from 'next';
import { TemplateLobbyFind } from '@/templates/lobby/TemplateLobbyFind';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'FM Jobs & Careers Directory | FIND — EntireFM',
  description:
    'Verified facilities management and property roles: Hard FM, M&E engineering, statutory building safety, and estates leadership across the UK.',
  keywords: [
    'facilities management jobs',
    'FM jobs UK',
    'hard FM jobs',
    'estates manager jobs',
    'building services engineer jobs',
    'building safety manager roles',
  ],
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find/jobs`,
  },
  openGraph: {
    title: 'FM Jobs & Careers Directory | FIND — EntireFM',
    description:
      'Verified facilities management and property roles across commercial estates and M&E engineering.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/find/jobs`,
    type: 'website',
  },
};

export default function FindJobsPage() {
  return <TemplateLobbyFind initialCategory="JOBS" />;
}
