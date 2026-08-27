import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { listRamsRecords } from '@/server/contractor/rams-service';
import { AdminRamsReviewClient } from '@/components/admin/AdminRamsReviewClient';

export const dynamic = 'force-dynamic';

export default async function AdminSupplyChainRamsPage() {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    redirect('/admin/login');
  }

  const ramsList = await listRamsRecords('', session);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
            SUPPLY CHAIN SAFETY GOVERNANCE &bull; CP-05
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Contractor RAMS Review Queue
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Central compliance verification queue for contractor Risk Assessments and Method Statements prior to site attendance.
          </p>
        </div>
      </div>

      <AdminRamsReviewClient initialRamsList={ramsList} />
    </div>
  );
}
