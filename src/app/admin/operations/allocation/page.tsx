import React from 'react';
import Link from 'next/link';
import {
  listWorkAllocationRequirements,
  listSupplierOpportunities,
  listAwardDecisions,
  listDispatches,
  getAllocationAnalytics,
} from '@/server/allocation/allocation-store';
import {
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  Building2,
  Award,
} from 'lucide-react';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function AllocationControlDashboardPage() {
  const [requirements, opportunities, awards, dispatches, analytics] = await Promise.all([
    listWorkAllocationRequirements(),
    listSupplierOpportunities(),
    listAwardDecisions(),
    listDispatches(),
    getAllocationAnalytics(),
  ]);

  const awaitingResponses = opportunities.filter((o) => o.status === 'ISSUED').length;
  const awaitingAck = dispatches.filter((d) => d.status === 'AWAITING_ACKNOWLEDGEMENT').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            CAFM DISPATCH &amp; INTELLIGENT ALLOCATION
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Supplier Allocation Control Centre
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Governed procurement workflow: Work Requirements &rarr; Hard Eligibility Gates &rarr; Explainable Suitability &rarr; Opportunities &rarr; Human Awards &rarr; Dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/operations/allocation/candidates" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 font-sans">
            <ShieldCheck className="h-3.5 w-3.5" /> Candidate Dry-Run Tool
          </Link>
        </div>
      </div>

      {/* Primary KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">ACTIVE REQUIREMENTS</span>
          <div className="text-2xl font-mono font-bold text-slate-900">{requirements.length}</div>
          <span className="text-[10.5px] font-mono text-slate-500">Live operational requests</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">AWAITING SUPPLIER RESPONSES</span>
          <div className="text-2xl font-mono font-bold text-amber-600">{awaitingResponses}</div>
          <span className="text-[10.5px] font-mono text-slate-500">Issued opportunities</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">AVG TIME TO AWARD</span>
          <div className="text-2xl font-mono font-bold text-emerald-600">{analytics.average_time_to_award_minutes}m</div>
          <span className="text-[10.5px] font-mono text-slate-500">Decision velocity</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">AWAITING ACKNOWLEDGEMENT</span>
          <div className="text-2xl font-mono font-bold text-rose-600">{awaitingAck}</div>
          <span className="text-[10.5px] font-mono text-slate-500">Dispatched work orders</span>
        </div>
      </div>

      {/* Grid: Open Requirements vs Live Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Work Requirements */}
        <div className="lg:col-span-8 bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Work Requirements Awaiting Allocation
            </h3>
            <Link href="/admin/operations/allocation/candidates" className="text-xs font-mono text-brand-pink font-semibold underline font-sans">
              Match Candidates &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100 font-mono text-xs">
            {requirements.map((r) => (
              <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-sans">{r.site_name} &middot; {r.site_city}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">{r.priority}</span>
                  </div>
                  <p className="text-slate-600 font-sans text-[11.5px]">{r.scope_summary}</p>
                  <span className="text-slate-400 text-[10px]">
                    Client: {r.client_name} &middot; Service: {r.service_name} &middot; SLA: {r.sla_attendance_target_hours}h
                  </span>
                </div>

                <Link
                  href={`/admin/operations/allocation/candidates?reqId=${r.id}`}
                  className="btn-primary text-[10.5px] py-1 px-3 self-start sm:self-auto font-sans"
                >
                  Evaluate Suppliers &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Live Opportunities Snapshot */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Live Opportunities
            </h3>
            <Link href="/admin/operations/allocation/opportunities" className="text-xs font-mono text-brand-pink font-semibold underline font-sans">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 font-mono text-xs">
            {opportunities.map((o) => (
              <div key={o.id} className="py-3 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900 font-sans">{o.title}</span>
                  <span className="text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">{o.status}</span>
                </div>
                <p className="text-slate-500 font-sans text-[11px]">{o.scope_summary}</p>
                <span className="text-slate-400 text-[10px] block">Type: {o.opportunity_type.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
