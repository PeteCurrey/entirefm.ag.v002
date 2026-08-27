import { Metadata } from 'next';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import {
  getItemsPendingReview,
  getAdminIntelligenceSummary,
  getEntireFMTenderRadar,
} from '@/server/intelligence/intelligence-engine';
import { AdminIntelligenceClient } from '@/components/admin/intelligence/AdminIntelligenceClient';

export const metadata: Metadata = {
  title: 'Admin Intelligence Centre & Tender Radar | EntireFM',
  description: 'Intelligence governance, human review queue, and public sector tender radar for EntireFM.',
};

export const dynamic = 'force-dynamic';

export default async function AdminIntelligencePage() {
  const session = await getCurrentSession();
  requireAdminSession(session);

  const [summary, pendingItems, tenders] = await Promise.all([
    getAdminIntelligenceSummary(),
    getItemsPendingReview(),
    getEntireFMTenderRadar({ minScore: 30 }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdminIntelligenceClient
        initialSummary={summary}
        initialPendingItems={pendingItems}
        initialTenderHighlights={tenders}
      />
    </div>
  );
}
