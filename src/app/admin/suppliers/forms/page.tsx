import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { listSubmittedForms } from '@/server/contractor/digital-forms-engine';
import { AdminFormsReviewClient } from '@/components/admin/AdminFormsReviewClient';

export const dynamic = 'force-dynamic';

export default async function AdminSupplyChainFormsPage() {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    redirect('/admin/login');
  }

  const forms = await listSubmittedForms('', session);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-light">
            FIELD OPERATIONS GOVERNANCE &bull; CP-07
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Digital Forms &amp; Field Submissions Queue
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Real-time review and operational triage for commercial scope variations, defect notifications, RIDDOR safety escalations, and service reports.
          </p>
        </div>
      </div>

      <AdminFormsReviewClient initialForms={forms} />
    </div>
  );
}
