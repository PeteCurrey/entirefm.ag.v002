'use client';

/**
 * CLIENT COMPONENT: EstatePerformanceClient
 * =========================================
 * Comprehensive Estate Performance Analytics dashboard with period selectors,
 * interactive KPI metrics, visual trend charts, and downloadable monthly reports.
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Coins,
  Wrench,
  MapPin,
  Building,
  FileText,
} from 'lucide-react';
import { EstatePerformanceReport, AnalyticsPeriod } from '@/server/analytics/estate-performance-service';
import { MonthlyEstateReportPdf } from '@/components/analytics/MonthlyEstateReportPdf';

interface EstatePerformanceClientProps {
  initialReport: EstatePerformanceReport;
  sessionUser: {
    id: string;
    name: string;
    role: string;
    orgName: string;
  };
}

export function EstatePerformanceClient({
  initialReport,
  sessionUser,
}: EstatePerformanceClientProps) {
  const [report, setReport] = useState<EstatePerformanceReport>(initialReport);
  const [period, setPeriod] = useState<AnalyticsPeriod>('THIS_MONTH');
  const [isLoading, setIsLoading] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const handlePeriodChange = async (newPeriod: AnalyticsPeriod) => {
    setPeriod(newPeriod);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/client/performance?period=${newPeriod}`);
      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          setReport(data.report);
        }
      }
    } catch (err) {
      console.warn('[PERFORMANCE_FETCH_ERR]', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ─── ACTION HEADER ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-medium">
              ESTATE REPORTING &bull; SERVICE DELIVERY
            </span>
          </div>
          <h1 className="text-2xl font-light text-white tracking-tight">Estate Activity &amp; Reporting</h1>
          <p className="text-xs text-brand-mist/70">
            Work order activity, planned maintenance delivery, compliance status, and service spend for {sessionUser.orgName}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Period Selector Tabs */}
          <div className="flex rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-0.5 text-xs">
            {[
              { id: 'THIS_MONTH', label: 'This Month' },
              { id: 'PREVIOUS_MONTH', label: 'Last Month' },
              { id: 'QUARTER', label: 'Quarter' },
              { id: 'YTD', label: 'YTD' },
              { id: 'ROLLING_12M', label: '12M' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handlePeriodChange(p.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  period === p.id
                    ? 'bg-brand-electric text-white font-medium shadow-sm'
                    : 'text-brand-mist/60 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowPdfModal(true)}
            className="px-4 py-2 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all flex items-center gap-1.5 shadow-md shadow-brand-electric/20"
          >
            <FileText className="w-3.5 h-3.5" /> View Monthly Report
          </button>
        </div>
      </div>

      {/* ─── HEADLINE KPI SCORECARD ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total WOs */}
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-mist/50">Total Work Orders</span>
          <p className="text-2xl font-light text-white">{report.totalWorkOrders}</p>
          <span className="text-[10.5px] text-brand-mist/40 block">
            {report.reactiveJobsCount} Reactive &bull; {report.ppmJobsCount} PPM
          </span>
        </div>

        {/* SLA Achievement */}
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-mist/50">SLA Achievement</span>
          <p className="text-2xl font-light text-brand-electric-bright">{report.slaAchievementPct}%</p>
          <span className="text-[10.5px] text-brand-mist/40 block">
            {report.slaBreachPct}% Breached
          </span>
        </div>

        {/* Statutory Compliance */}
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-mist/50">Compliance</span>
          <p className="text-2xl font-light text-emerald-400">{report.statutoryCompliancePct}%</p>
          <span className="text-[10.5px] text-emerald-400/60 block">Audit ready</span>
        </div>

        {/* First Time Fix */}
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-mist/50">First-Time Fix</span>
          <p className="text-2xl font-light text-white">{report.firstTimeFixPct}%</p>
          <span className="text-[10.5px] text-brand-mist/40 block">Repeat: {report.repeatCalloutPct}%</span>
        </div>

        {/* PPM Completion */}
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-mist/50">PPM Completion</span>
          <p className="text-2xl font-light text-cyan-400">{report.ppmCompletionPct}%</p>
          <span className="text-[10.5px] text-brand-mist/40 block">Scheduled routines</span>
        </div>

        {/* Estate Spend */}
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-mist/50">Estate Spend</span>
          <p className="text-2xl font-light text-purple-300">£{Math.round(report.totalEstateSpendGbp)}</p>
          <span className="text-[10.5px] text-brand-mist/40 block">
            £{Math.round(report.reactiveSpendGbp)} React &bull; £{Math.round(report.ppmSpendGbp)} PPM
          </span>
        </div>
      </div>

      {/* ─── TREND CHARTS SECTION ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Order Volume & SLA Trend */}
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-electric" /> Work Order Volume &amp; SLA Adherence Trend
            </h3>
            <span className="text-[11px] text-brand-mist/50">6-Month Rolling</span>
          </div>

          <div className="space-y-3 pt-2">
            {report.monthlyTrends.map((t) => (
              <div key={t.monthLabel} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-brand-mist/70">
                  <span className="font-medium text-white">{t.monthLabel}</span>
                  <span>{t.totalWos} Jobs &bull; <span className="text-brand-electric-bright font-semibold">{t.slaPct}% SLA</span></span>
                </div>
                <div className="h-2 w-full bg-brand-void rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${t.slaPct}%` }}
                    className="h-full bg-brand-electric rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reactive vs PPM Spend Distribution */}
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-brand-electric" /> Reactive vs Planned Spend Ratio
            </h3>
            <span className="text-[11px] text-brand-mist/50">{report.periodLabel}</span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-brand-void/80 border border-brand-edge-dark flex items-center justify-between">
              <div>
                <span className="text-xs text-brand-mist/60 block">Reactive Maintenance</span>
                <span className="text-lg font-semibold text-white">£{report.reactiveSpendGbp.toFixed(2)}</span>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                {report.totalEstateSpendGbp > 0 ? Math.round((report.reactiveSpendGbp / report.totalEstateSpendGbp) * 100) : 0}% of budget
              </span>
            </div>

            <div className="p-4 rounded-xl bg-brand-void/80 border border-brand-edge-dark flex items-center justify-between">
              <div>
                <span className="text-xs text-brand-mist/60 block">Planned Preventive (PPM)</span>
                <span className="text-lg font-semibold text-white">£{report.ppmSpendGbp.toFixed(2)}</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                {report.totalEstateSpendGbp > 0 ? Math.round((report.ppmSpendGbp / report.totalEstateSpendGbp) * 100) : 0}% of budget
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── ESTATE BREAKDOWN TABLES ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Breakdown */}
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-brand-edge-dark flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-brand-electric" /> Performance by Site
            </h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="border-b border-brand-edge-dark bg-brand-void/80 text-brand-mist/60 text-[11px] uppercase">
              <tr>
                <th className="px-4 py-3">Site Name</th>
                <th className="px-4 py-3">Work Orders</th>
                <th className="px-4 py-3">SLA Adherence</th>
                <th className="px-4 py-3 text-right">Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
              {report.siteBreakdown.map((s) => (
                <tr key={s.siteName} className="hover:bg-brand-void/30 transition-colors">
                  <td className="px-4 py-3 text-white font-normal">{s.siteName}</td>
                  <td className="px-4 py-3">{s.totalWos}</td>
                  <td className="px-4 py-3 font-semibold text-brand-electric-bright">{s.slaPct}%</td>
                  <td className="px-4 py-3 text-right font-mono">£{s.spendGbp.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Trade & Asset Category Breakdown */}
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-brand-edge-dark flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4 text-brand-electric" /> Breakdown by Service / Category
            </h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="border-b border-brand-edge-dark bg-brand-void/80 text-brand-mist/60 text-[11px] uppercase">
              <tr>
                <th className="px-4 py-3">Asset Category</th>
                <th className="px-4 py-3">Jobs Logged</th>
                <th className="px-4 py-3 text-right">Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
              {report.assetCategoryBreakdown.map((c) => (
                <tr key={c.category} className="hover:bg-brand-void/30 transition-colors">
                  <td className="px-4 py-3 text-white font-normal">{c.category}</td>
                  <td className="px-4 py-3">{c.count}</td>
                  <td className="px-4 py-3 text-right font-mono">£{c.spendGbp.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Modal */}
      {showPdfModal && (
        <MonthlyEstateReportPdf
          report={report}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
}
