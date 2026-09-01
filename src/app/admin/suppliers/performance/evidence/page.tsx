import React from 'react';
import { listSupplierScorecards } from '@/server/suppliers/performance-store';
import { FileCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EvidenceQualityPage() {
  const scorecards = await listSupplierScorecards();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-light">
          EVIDENCE GATING
        </span>
        <h1 className="text-2xl font-extralight text-slate-900 mt-1">
          Service Report &amp; Evidence Quality
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Percentage of digital service reports approved on first submission without missing photos or missing readings.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-4">
        <div className="divide-y divide-slate-100 font-normal text-xs">
          {scorecards.map((s) => (
            <div key={s.supplier_id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-light text-slate-900 font-sans">{s.supplier_name}</div>
                <span className="text-slate-500">Service Reports Evaluated: {s.evidence_acceptance_rate.sample_size}</span>
              </div>
              <div className="text-right">
                <span className="font-light text-slate-900 text-sm block">{s.evidence_acceptance_rate.value}%</span>
                <span className="text-[10px] text-slate-400 font-sans">First-Time Approved</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
