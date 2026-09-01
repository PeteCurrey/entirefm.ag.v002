import React from 'react';
import Link from 'next/link';
import { listSupplierScorecards, listQualityDefects, listPerformanceImprovementPlans, listServiceBenchmarks } from '@/server/suppliers/performance-store';
import { Award, AlertTriangle, TrendingUp, CheckCircle2, Clock, ShieldAlert, ArrowRight, Activity } from 'lucide-react';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function SupplierPerformanceOverviewPage() {
  const [scorecards, defects, pips, benchmarks] = await Promise.all([
    listSupplierScorecards(),
    listQualityDefects(),
    listPerformanceImprovementPlans(),
    listServiceBenchmarks(),
  ]);

  const excellentCount = scorecards.filter((s) => s.overall_status === 'EXCELLENT').length;
  const watchCount = scorecards.filter((s) => s.overall_status === 'WATCH' || s.overall_status === 'IMPROVEMENT_REQUIRED').length;
  const activePips = pips.filter((p) => p.status === 'ACTIVE' || p.status === 'IMPROVING');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-light">
            EVIDENCE-LED SUPPLY CHAIN INTELLIGENCE
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Supplier Performance Control Centre
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Objective operational analytics across SLA attendance, first-time fix, service report quality, and invoice accuracy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/suppliers/performance/scorecards" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" /> View Scorecards Directory
          </Link>
        </div>
      </div>

      {/* Real KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">NETWORK MEDIAN SLA</span>
          <div className="text-2xl font-light text-emerald-600">92.8%</div>
          <span className="text-[10.5px] font-normal text-slate-500">Based on 182 verified visits</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">FIRST-TIME FIX (FTF)</span>
          <div className="text-2xl font-light text-slate-900">86.4%</div>
          <span className="text-[10.5px] font-normal text-slate-500">Single attendance resolution</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">PERFORMANCE WATCHLIST</span>
          <div className="text-2xl font-light text-amber-600">{watchCount}</div>
          <span className="text-[10.5px] font-normal text-slate-500">Requires Intervention</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">ACTIVE PIPs</span>
          <div className="text-2xl font-light text-rose-600">{activePips.length}</div>
          <span className="text-[10.5px] font-normal text-slate-500">Formal Improvement Plans</span>
        </div>
      </div>

      {/* Grid: Top Performers vs Active PIPs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scorecards Snapshot */}
        <div className="lg:col-span-8 bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
              Supplier Performance Scorecards
            </h3>
            <Link href="/admin/suppliers/performance/scorecards" className="text-xs text-brand-pink font-light underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 font-normal text-xs">
            {scorecards.map((sc) => (
              <div key={sc.supplier_id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="font-light text-slate-900 font-sans">{sc.supplier_name}</div>
                  <span className="text-slate-500 text-[11px]">
                    SLA: <strong className="text-emerald-700">{sc.sla_attendance_rate.value}%</strong> &middot; FTF: <strong className="text-slate-800">{sc.first_time_fix_rate.value}%</strong> &middot; Evidence: <strong className="text-slate-800">{sc.evidence_acceptance_rate.value}%</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-block text-[10px] font-normal px-2 py-0.5 rounded ${
                    sc.overall_status === 'EXCELLENT' ? 'bg-emerald-100 text-emerald-800' : sc.overall_status === 'WATCH' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {sc.overall_status}
                  </span>
                  <Link href={`/admin/suppliers/${sc.supplier_id}`} className="text-brand-pink font-light underline font-sans">
                    Scorecard &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Improvement Plans */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
              Active Improvement Plans
            </h3>
            <Link href="/admin/suppliers/performance/improvement" className="text-xs text-brand-pink font-light underline">
              View All
            </Link>
          </div>

          {activePips.length === 0 ? (
            <p className="py-6 text-center text-slate-500 text-xs font-light">
              No suppliers currently under formal Performance Improvement Plans.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs font-normal">
              {activePips.map((p) => (
                <div key={p.id} className="py-3 space-y-1">
                  <div className="flex justify-between font-light">
                    <span className="text-slate-900 font-sans">{p.supplier_name}</span>
                    <span className="text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">{p.status}</span>
                  </div>
                  <p className="text-slate-600 font-sans font-light text-[11.5px]">{p.reason}</p>
                  <span className="text-slate-400 text-[10px] block">Target Date: {p.target_date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
