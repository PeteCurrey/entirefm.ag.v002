import React from 'react';
import { getAllocationAnalytics } from '@/server/allocation/allocation-store';
import { TrendingUp, PieChart, Clock, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AllocationAnalyticsPage() {
  const analytics = await getAllocationAnalytics();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          OPERATIONAL EFFICIENCY &amp; CONCENTRATION
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Supplier Allocation Analytics &amp; Decline Insights
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Measuring allocation cycle time, opportunity acceptance rates, and supplier concentration resilience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Concentration */}
        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200 font-sans">
            Supplier Allocation Share
          </h3>
          <div className="space-y-3 font-normal text-xs">
            {analytics.supplier_allocation_share.map((s) => (
              <div key={s.supplier_name} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900 font-sans">{s.supplier_name}</span>
                  <span className="text-slate-600">{s.share_percentage}% ({s.awarded_jobs_count} Jobs)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-pink" style={{ width: `${s.share_percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decline Reasons Breakdown */}
        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200 font-sans">
            Supplier Decline Reasons Breakdown
          </h3>
          <div className="divide-y divide-slate-100 font-normal text-xs">
            {Object.entries(analytics.decline_reasons_breakdown).map(([reason, count]) => (
              <div key={reason} className="py-2.5 flex justify-between">
                <span className="text-slate-700">{reason.replace(/_/g, ' ')}</span>
                <span className="font-bold text-slate-900">{count} Incidents</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
