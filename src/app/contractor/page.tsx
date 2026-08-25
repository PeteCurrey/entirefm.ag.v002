import React from 'react';
import type { Metadata } from 'next';
import { listVisitsForProvider, listFieldOperatives } from '@/server/field/operations-store';
import { ContractorDispatcherClient } from '@/components/contractor/ContractorDispatcherClient';

export const metadata: Metadata = {
  title: 'Contractor Dispatch & Operations | EntireFM CAFM',
  description: 'Supplier operations workspace for work order dispatch, operative assignment with competency gating, and live field tracking.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorDashboardPage() {
  const providerOrgId = 'sup-test-01';
  const [visits, operatives] = await Promise.all([
    listVisitsForProvider(providerOrgId),
    listFieldOperatives(providerOrgId),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
          ENTIRECAFM &bull; SUPPLIER OPERATIONS &amp; DISPATCH
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Field Operations &amp; Team Dispatch
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Manage awarded work orders, verify operative competencies, assign jobs, and monitor live site attendance.
        </p>
      </div>

      <ContractorDispatcherClient
        initialVisits={visits}
        operatives={operatives}
        providerOrgId={providerOrgId}
      />
    </div>
  );
}
