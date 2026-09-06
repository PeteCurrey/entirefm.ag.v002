import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { listSupplierOpportunities } from '@/server/allocation/allocation-store';
import { OpportunitiesListClient } from '@/components/supplier-portal/OpportunitiesListClient';

export const dynamic = 'force-dynamic';

export default async function SupplierPortalOpportunitiesPage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const opps = orgId ? await listSupplierOpportunities(orgId) : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10.5px] font-light uppercase tracking-wider text-slate-400">
            ENTIRECAFM // WORK OPPORTUNITIES
          </span>
          <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
            Live Work Opportunities
          </h1>
        </div>

        <span className="text-xs font-medium px-3 py-1 bg-slate-900 text-white rounded-sm self-start sm:self-auto">
          {opps.length} ACTIVE OPPORTUNITIES
        </span>
      </div>

      <OpportunitiesListClient initialOpportunities={opps} contractorOrgId={orgId} />
    </div>
  );
}
