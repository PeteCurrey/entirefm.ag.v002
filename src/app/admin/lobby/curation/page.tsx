import { Metadata } from 'next';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import { getLobbyHomepageCuration, checkCurationStaleness } from '@/lib/lobby/curation';
import { AdminCurationClient } from './AdminCurationClient';

export const metadata: Metadata = {
  title: 'Homepage Editorial Curation | Admin | EntireFM',
  description: 'Manage homepage feature slots, rotation schedules, and staleness monitoring for The Lobby.',
};

export const dynamic = 'force-dynamic';

export default async function AdminLobbyCurationPage() {
  const session = await getCurrentSession();
  requireAdminSession(session);

  const curation = await getLobbyHomepageCuration();
  const staleness = checkCurationStaleness(curation.updatedAt);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminCurationClient initialCuration={curation} initialStaleness={staleness} />
    </div>
  );
}
