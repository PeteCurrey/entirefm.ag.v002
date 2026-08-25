import React from 'react';
import { listPerformanceImprovementPlans } from '@/server/suppliers/performance-store';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function ImprovementPlansPage() {
  const pips = await listPerformanceImprovementPlans();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
            ESCALATION &amp; RECOVERY
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Supplier Performance Improvement Plans (PIPs)
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Structured corrective programs with measurable target dates and progress milestones.
          </p>
        </div>

        <CsvExportButton
          data={pips.map((p) => ({
            id: p.id,
            supplier_id: p.supplier_id,
            name: p.supplier_name,
            status: p.status,
            reason: p.reason,
            target_date: p.target_date,
          }))}
          filename="entirefm-supplier-pips.csv"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-4">
        {pips.length === 0 ? (
          <p className="py-8 text-center text-slate-500 text-xs font-sans">
            No active supplier Performance Improvement Plans.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 font-mono text-xs">
            {pips.map((p) => (
              <div key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-light text-slate-900 font-sans text-sm">{p.supplier_name}</div>
                  <p className="text-slate-600 font-sans">{p.reason}</p>
                  <span className="text-slate-400 text-[10.5px]">Owner: {p.owner_role} &middot; Target Date: {p.target_date}</span>
                </div>
                <span className="text-amber-800 bg-amber-100 font-light px-2.5 py-1 rounded text-xs self-start sm:self-auto">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
