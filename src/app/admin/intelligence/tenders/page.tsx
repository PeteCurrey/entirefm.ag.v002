import { Metadata } from 'next';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import { getEntireFMTenderRadar } from '@/server/intelligence/intelligence-engine';
import { AdminTenderRadarClient } from '@/components/admin/intelligence/AdminTenderRadarClient';

export const metadata: Metadata = {
  title: 'EntireFM Tender Radar & Bid Pipeline | EntireFM Admin',
  description: 'Public sector procurement notices matched to EntireFM core service capabilities.',
};

export const dynamic = 'force-dynamic';

export default async function AdminTendersPage() {
  const session = await getCurrentSession();
  requireAdminSession(session);

  const tenders = await getEntireFMTenderRadar();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdminTenderRadarClient initialTenders={tenders} />
    </div>
  );
}
