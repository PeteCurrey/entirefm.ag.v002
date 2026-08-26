import React from 'react';
import { getCurrentSession } from '@/server/identity';
import type { Metadata } from 'next';
import { listSupplierRfis } from '@/server/suppliers/rfi-store';
import { SupplierRfiActionCentreClient } from '@/components/supplier-portal/SupplierRfiActionCentreClient';

export const metadata: Metadata = {
  title: 'Compliance Actions & Clarifications | EntireFM Supplier Portal',
  description: 'Respond to EntireFM assurance clarification requests, upload requested evidence, and track review status.',
};

export default async function SupplierPortalActionCentrePage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const rfis = orgId ? await listSupplierRfis(orgId) : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            SUPPLIER ASSURANCE &bull; CLARIFICATION CENTRE
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Requests For Information (RFI)
          </h1>
          <p className="text-xs text-slate-500 font-light mt-1">
            Submit requested policy schedules, trade credentials, or operational clarifications directly to the EntireFM assurance desk.
          </p>
        </div>
      </div>

      <SupplierRfiActionCentreClient initialRfis={rfis} supplierId={orgId} />
    </div>
  );
}
