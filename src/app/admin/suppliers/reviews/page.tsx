import React from 'react';
import Link from 'next/link';
import { listSupplierOrganisations } from '@/server/suppliers/store';
import { getSupplierOnboardingPlan } from '@/server/suppliers/assurance-store';
import { FileCheck, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AssuranceReviewsQueuePage() {
  const suppliers = await listSupplierOrganisations();
  const plans = await Promise.all(suppliers.map((s) => getSupplierOnboardingPlan(s.id)));

  const pendingItems: Array<{ supplier: any; item: any }> = [];
  suppliers.forEach((s, idx) => {
    const plan = plans[idx];
    if (plan) {
      plan.items.filter((i) => i.status === 'SUBMITTED' || i.status === 'UNDER_REVIEW').forEach((item) => {
        pendingItems.push({ supplier: s, item });
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            INTERNAL DUE DILIGENCE
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Assurance Review Queue
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Technical, H&amp;S, Information Security, and Financial evidence items submitted by suppliers awaiting validation.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1.5 rounded bg-amber-100 text-amber-900">
          {pendingItems.length} Items Awaiting Review
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        {pendingItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-light">
            All submitted assurance items have been reviewed and validated.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingItems.map(({ supplier, item }) => (
              <div key={item.id} className="p-5 hover:bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Supplier: <span className="font-bold text-slate-800">{supplier.legal_name}</span> &middot; Assigned to: {item.assigned_reviewer_role}
                  </div>
                </div>

                <Link href={`/admin/suppliers/${supplier.id}`} className="btn-primary text-xs py-1.5 px-3 self-start sm:self-auto">
                  Review Evidence &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
