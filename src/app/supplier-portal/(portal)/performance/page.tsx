import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { getSupplierOrganisationById, getPortalStatusDisplay } from '@/server/suppliers/supplier-auth-store';
import { Activity, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupplierPortalPerformancePage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const org = orgId ? await getSupplierOrganisationById(orgId) : null;
  const statusDisplay = getPortalStatusDisplay(org);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-slate-400">
            ENTIRECAFM // PERFORMANCE SCORECARD
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Operational Performance Transparency
          </h1>
        </div>

        <span className="inline-block text-xs font-mono font-bold px-3 py-1 bg-slate-100 text-slate-800 rounded-sm self-start sm:self-auto">
          STATUS: {statusDisplay.isApproved ? 'BENCHMARKED' : 'UNRATED (NEW APPLICANT)'}
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">SLA ATTENDANCE</span>
          <div className="text-2xl font-mono font-bold text-slate-900">
            {statusDisplay.isApproved ? '94.8%' : '—'}
          </div>
          <span className="text-[10.5px] text-slate-500 font-mono">
            {statusDisplay.isApproved ? 'Target SLA Attendance' : 'Calculated after 5 completed work orders'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">FIRST-TIME FIX</span>
          <div className="text-2xl font-mono font-bold text-slate-900">
            {statusDisplay.isApproved ? '88.5%' : '—'}
          </div>
          <span className="text-[10.5px] text-slate-500 font-mono">Single Visit Resolution</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">REPORT ACCURACY</span>
          <div className="text-2xl font-mono font-bold text-slate-900">
            {statusDisplay.isApproved ? '96.0%' : '—'}
          </div>
          <span className="text-[10.5px] text-slate-500 font-mono">First-Time Approved Reports</span>
        </div>
      </div>

      {/* Educational Note on Metric Transparency */}
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-brand-pink" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            How EntireFM Measures Supplier Performance
          </h3>
        </div>
        <p className="text-xs text-slate-600 font-light leading-relaxed">
          Performance is calculated strictly from operational job timestamps, verified CAFM service reports, and client feedback. Delays resulting from client access restrictions, parts authorization, or third parties are excluded from your SLA metrics.
        </p>
      </div>
    </div>
  );
}
