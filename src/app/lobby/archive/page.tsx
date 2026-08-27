import type { Metadata } from 'next';
import { TemplateLobbyArchive } from '@/templates/lobby/TemplateLobbyArchive';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';
import { canIndexStaticBuild } from '@/lib/indexing';

export const metadata: Metadata = {
  title: { absolute: 'The Lobby Archive | FM Intelligence & Briefings | EntireFM' },
  description:
    'Browse the full indexed archive of UK facilities management intelligence, compliance watch articles, engineering notes, and operational assets.',
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/archive`,
  },
  robots: {
    index: canIndexStaticBuild(),
    follow: canIndexStaticBuild(),
  },
};

export default function LobbyArchivePage() {
  return <TemplateLobbyArchive />;
}
