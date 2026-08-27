import React from 'react';
import { dbQuery } from '@/server/db/client';
import { listContractorOperatives } from '@/server/contractor/workforce-service';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { AdminWorkforceClient } from '@/components/admin/AdminWorkforceClient';

export const dynamic = 'force-dynamic';

export default async function AdminSupplyChainWorkforcePage() {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    redirect('/admin/login');
  }

  // Query all active suppliers and provider resources
  const [suppliersRes, resourcesRes] = await Promise.all([
    dbQuery<any[]>('organisations?type=in.(CONTRACTOR,SUPPLIER)&select=id,name,code'),
    dbQuery<any[]>('provider_resources?select=*,person:persons(*),provider_organisation:organisations(name,code)&order=created_at.desc&limit=100'),
  ]);

  const suppliers = suppliersRes.data || [];
  const resources = resourcesRes.data || [];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
            SUPPLY CHAIN WORKFORCE &amp; COMPETENCY DIRECTORY
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Operative Intelligence &amp; Vetting
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Network-wide directory of contractor field operatives, verified trade certifications, EntireFM site approvals, and trade coverage.
          </p>
        </div>
      </div>

      <AdminWorkforceClient
        suppliers={suppliers}
        initialResources={resources}
      />
    </div>
  );
}
