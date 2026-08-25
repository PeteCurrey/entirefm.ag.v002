import React from 'react';
import { listServiceApprovals, listGeographicApprovals } from '@/server/suppliers/assurance-store';
import { CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ScopedApprovalsPage() {
  const [serviceApprovals, geoApprovals] = await Promise.all([
    listServiceApprovals(),
    listGeographicApprovals(),
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          GRANULAR OPERATIONAL SCOPE
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Scoped Service &amp; Geographic Approvals
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Enforce multi-dimensional authorization: suppliers must be approved per discipline and per geographical region.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Approvals */}
        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200">
            Active Service-Specific Approvals ({serviceApprovals.length})
          </h3>

          <div className="divide-y divide-slate-100 font-mono text-xs">
            {serviceApprovals.map((sa) => (
              <div key={sa.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 font-sans">{sa.service_name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {sa.approval_status}
                  </span>
                </div>
                <div className="text-slate-500">Supplier: {sa.supplier_id} &middot; Approved by: {sa.approved_by}</div>
                <p className="text-slate-600 font-sans font-light italic">{sa.rationale}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Approvals */}
        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200">
            Active Regional Approvals ({geoApprovals.length})
          </h3>

          <div className="divide-y divide-slate-100 font-mono text-xs">
            {geoApprovals.map((ga) => (
              <div key={ga.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 font-sans">{ga.region_or_city}</span>
                  <span className="text-slate-500 block">Supplier: {ga.supplier_id}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  AUTHORISED
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
