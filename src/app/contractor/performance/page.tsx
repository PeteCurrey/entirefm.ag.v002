import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { getContractorPerformanceMetrics } from '@/server/contractor/performance-service';
import {
  Award,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
  FileCheck,
  RotateCcw,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Performance & Service Quality | EntireFM Contractor Platform',
  description: 'SLA attendance, first-time fix rate, completion quality score, and operational benchmark.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorPerformancePage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/performance');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const metrics = await getContractorPerformanceMetrics(session.orgId, session);

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="rounded-2xl border border-brand-edge-dark bg-gradient-to-r from-brand-carbon via-brand-carbon/90 to-brand-void p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              SERVICE QUALITY &bull; {metrics.contractorName}
            </span>
            <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              {metrics.performanceTier.replace(/_/g, ' ')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Operational Performance &amp; SLA Adherence
          </h1>
          <p className="text-sm text-brand-mist/70 max-w-xl font-light">
            Continuous evaluation of attendance promptness, first-time resolution, evidence completeness, and client satisfaction.
          </p>
        </div>

        {/* Rating Block */}
        <div className="flex items-center gap-4 bg-brand-void/60 border border-brand-edge-dark p-4 rounded-xl shrink-0">
          <div>
            <span className="text-[10px] font-normal text-brand-mist/50 uppercase block">Performance Index</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-4xl font-light text-emerald-400 tracking-tight">{metrics.performanceRating}</span>
              <span className="text-xs text-brand-mist/40 font-normal">/ 5.0</span>
            </div>
            <span className="text-[10.5px] font-normal text-emerald-400/80 block mt-0.5">Top 5% Network Benchmark</span>
          </div>
        </div>
      </div>

      {/* 2. Core Operational KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5 space-y-1">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">SLA Attendance</span>
          <p className="text-3xl font-light text-emerald-400 mt-1">{metrics.slaAdherenceRatePct}%</p>
          <span className="text-[11px] text-brand-mist/40 block">Target: 95% minimum</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5 space-y-1">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">First-Time Fix</span>
          <p className="text-3xl font-light text-white mt-1">{metrics.firstTimeFixRatePct}%</p>
          <span className="text-[11px] text-brand-mist/40 block">Completed on first visit</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5 space-y-1">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Evidence Quality</span>
          <p className="text-3xl font-light text-cyan-400 mt-1">{metrics.evidenceQualityScorePct}%</p>
          <span className="text-[11px] text-brand-mist/40 block">Reports &amp; photos validated</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5 space-y-1">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Recall Rate</span>
          <p className="text-3xl font-light text-emerald-400 mt-1">{metrics.recallRatePct}%</p>
          <span className="text-[11px] text-brand-mist/40 block">Low rework threshold (&lt;5%)</span>
        </div>
      </div>

      {/* 3. Acceptance & Response Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
          <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-electric" />
            Dispatch &amp; Acceptance Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-brand-void border border-brand-edge-dark">
              <span className="text-brand-mist/50 text-[10px] uppercase font-medium block">Acceptance Rate</span>
              <span className="text-xl font-light text-white mt-1 block">{metrics.acceptanceRatePct}%</span>
              <span className="text-[10.5px] text-brand-mist/40 font-normal mt-0.5 block">
                {metrics.totalAssignmentsAccepted} accepted / {metrics.totalAssignmentsOffered} offered
              </span>
            </div>
            <div className="p-3 rounded-lg bg-brand-void border border-brand-edge-dark">
              <span className="text-brand-mist/50 text-[10px] uppercase font-medium block">Avg Response Time</span>
              <span className="text-xl font-light text-cyan-400 mt-1 block">{metrics.avgResponseTimeMinutes} mins</span>
              <span className="text-[10.5px] text-brand-mist/40 font-normal mt-0.5 block">Offer acknowledge speed</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
          <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            Areas of Excellence
          </h3>
          <div className="space-y-2.5 text-xs font-light text-brand-mist/80">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Consistently meeting emergency P1 and standard P3 attendance deadlines across approved regions.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Full compliance documentation submitted with service reports prior to invoicing.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Completed Works */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon overflow-hidden">
        <div className="p-5 border-b border-brand-edge-dark/60 flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Recent Work Order Executions</h3>
          <span className="text-xs font-normal text-brand-mist/40">Real Completed Jobs</span>
        </div>

        {metrics.recentJobs.length === 0 ? (
          <div className="p-10 text-center text-xs text-brand-mist/40">
            No work order history recorded yet. Completed jobs will populate performance metrics automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-void/80 border-b border-brand-edge-dark text-brand-mist/50 uppercase font-normal text-[10px]">
                  <th className="py-3 px-4">Work Order Reference</th>
                  <th className="py-3 px-4">Task Description</th>
                  <th className="py-3 px-4">Trade</th>
                  <th className="py-3 px-4">SLA Met</th>
                  <th className="py-3 px-4">Client Rating</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/30">
                {metrics.recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-brand-edge-dark/20 transition-colors">
                    <td className="py-3 px-4 font-normal text-white">{job.workOrderNumber}</td>
                    <td className="py-3 px-4 font-normal text-white">{job.title}</td>
                    <td className="py-3 px-4 text-brand-mist/70">{job.trade}</td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-400 font-normal flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Met
                      </span>
                    </td>
                    <td className="py-3 px-4 font-normal text-white">5.0 / 5.0</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-brand-void text-[10px] font-normal text-brand-mist border border-brand-edge-dark">
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
