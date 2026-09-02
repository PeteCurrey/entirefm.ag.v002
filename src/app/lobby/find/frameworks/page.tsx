import type { Metadata } from 'next';
import { TemplateLobbyFind } from '@/templates/lobby/TemplateLobbyFind';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'FM Procurement Frameworks (CCS RM6264 & NHS SBS) | FIND — EntireFM',
  description:
    'Comprehensive directory of UK public-sector buying vehicles, Crown Commercial Service facilities management lots, and health trust frameworks.',
  keywords: [
    'FM frameworks',
    'CCS RM6264 lots',
    'NHS SBS hard FM',
    'public procurement frameworks UK',
  ],
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find/frameworks`,
  },
  openGraph: {
    title: 'FM Procurement Frameworks | FIND — EntireFM',
    description:
      'Directory of UK public-sector buying vehicles and Crown Commercial Service facilities management lots.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/find/frameworks`,
    type: 'website',
  },
};

export default function FindFrameworksPage() {
  return <TemplateLobbyFind initialCategory="FRAMEWORKS" />;
}
