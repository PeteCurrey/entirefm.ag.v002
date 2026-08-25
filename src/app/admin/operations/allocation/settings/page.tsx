import React from 'react';
import { Settings } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AllocationSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          CONFIGURATION
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Allocation Policies &amp; Approval Thresholds
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Define financial Segregation of Duties limits, response window timeouts, and emergency cascade rules.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-4 text-xs font-mono">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200 font-sans">
          Procurement Financial Limits
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span>&lt; £500</span>
            <span className="font-bold text-slate-900">Operations Manager Approval</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span>£500 – £5,000</span>
            <span className="font-bold text-slate-900">Regional Director Approval</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span>&gt; £5,000</span>
            <span className="font-bold text-slate-900">Commercial Director Approval Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
