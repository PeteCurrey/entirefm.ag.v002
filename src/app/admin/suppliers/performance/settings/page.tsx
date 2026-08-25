import React from 'react';
import { Settings } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function PerformanceSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          CONFIGURATION
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Performance Metric Thresholds &amp; Weights
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Configure SLA target thresholds, data sufficiency minimums, and preferred-partner qualification criteria.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-4 text-xs font-mono">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200 font-sans">
          Configured Baseline Thresholds
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span>SLA Attendance Target</span>
            <span className="font-bold text-slate-900">90.0%</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span>First-Time Fix (FTF) Target</span>
            <span className="font-bold text-slate-900">80.0%</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span>Minimum Sample Size for Reportability</span>
            <span className="font-bold text-slate-900">5 Completed Jobs</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span>Service Report First-Time Approval Target</span>
            <span className="font-bold text-slate-900">90.0%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
