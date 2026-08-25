import React from 'react';
import { listQualityDefects } from '@/server/suppliers/performance-store';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function QualityDefectsPage() {
  const defects = await listQualityDefects();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
            WORKMANSHIP &amp; DEFECT LOGS
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Supplier Quality Defect Log
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Supplier-attributable quality failures, snagging items, and rework tracking.
          </p>
        </div>

        <CsvExportButton
          data={defects.map((d) => ({
            id: d.id,
            supplier_id: d.supplier_id,
            work_order_id: d.work_order_id,
            severity: d.severity,
            issue: d.issue_title,
            root_cause: d.root_cause,
          }))}
          filename="entirefm-quality-defects.csv"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden p-6 space-y-4">
        {defects.length === 0 ? (
          <p className="py-8 text-center text-slate-500 text-xs font-sans">
            No supplier quality defects logged. High workmanship standards maintained.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 font-mono text-xs">
            {defects.map((d) => (
              <div key={d.id} className="py-3 space-y-1">
                <div className="flex justify-between font-light">
                  <span className="text-slate-900 font-sans">{d.issue_title}</span>
                  <span className="text-rose-700">{d.severity}</span>
                </div>
                <p className="text-slate-600 font-sans">{d.description}</p>
                <span className="text-slate-400 text-[10px]">Root Cause: {d.root_cause} &middot; WO: {d.work_order_id}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
