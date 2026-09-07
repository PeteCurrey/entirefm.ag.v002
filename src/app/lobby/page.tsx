import type { Metadata } from 'next';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { TemplateLobby } from '@/templates/lobby/TemplateLobby';

export const metadata: Metadata = generateRouteMetadata('/lobby', {
  title: 'The Lobby | FM Intelligence, Compliance & Engineering | EntireFM',
  description:
    'The daily briefing room for UK facilities management professionals: regulatory updates, engineering notes, compliance watch, practical tools, Q&A, and industry intelligence.',
});

// Revalidate every 15 minutes so the briefing wire reflects the latest
// approved intelligence items without requiring a full rebuild.
export const revalidate = 900;

export default function LobbyPage() {
  return <TemplateLobby />;
}
