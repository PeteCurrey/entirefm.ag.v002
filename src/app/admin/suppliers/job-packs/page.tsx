import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { listJobPacks } from '@/server/contractor/job-pack-engine';
import { AdminJobPacksClient } from '@/components/admin/AdminJobPacksClient';

export const dynamic = 'force-dynamic';

export default async function AdminSupplyChainJobPacksPage() {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    redirect('/admin/login');
  }

  const jobPacks = await listJobPacks('', session);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-light">
            PRE-ATTENDANCE OPERATIONS &bull; CP-06
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Job Pack Readiness Control
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Real-time supply chain operational assurance: verified operative competencies, approved RAMS, site access clearance, and safety stop-work monitoring.
          </p>
        </div>
      </div>

      <AdminJobPacksClient initialJobPacks={jobPacks} />
    </div>
  );
}
