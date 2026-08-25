import React from 'react';
import { listSupplierScorecards } from '@/server/suppliers/performance-store';
import { Clock, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SlaPerformancePage() {
  const scorecards = await listSupplierScorecards();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          TIME-CRITICAL EXECUTION
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          SLA &amp; Attendance Reliability
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Measured on-time arrival against contract response windows, excluding client/parts delays.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-4">
        <div className="divide-y divide-slate-100 font-mono text-xs">
          {scorecards.map((s) => (
            <div key={s.supplier_id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 font-sans">{s.supplier_name}</div>
                <span className="text-slate-500">Sample Size: {s.sla_attendance_rate.sample_size} visits &middot; Target: 90%</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-700 text-sm block">{s.sla_attendance_rate.value}%</span>
                <span className="text-[10px] text-slate-400 font-sans">Trend: {s.sla_attendance_rate.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
