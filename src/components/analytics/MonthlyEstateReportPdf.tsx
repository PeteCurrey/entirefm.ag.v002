'use client';

/**
 * CLIENT COMPONENT: MonthlyEstateReportPdf
 * ========================================
 * Print-ready executive monthly estate performance report.
 * Formatted for A4 presentation and browser PDF export.
 */

import React from 'react';
import { EstatePerformanceReport } from '@/server/analytics/estate-performance-service';
import { ShieldCheck, CheckCircle2, AlertTriangle, TrendingUp, Printer } from 'lucide-react';

interface MonthlyEstateReportPdfProps {
  report: EstatePerformanceReport;
  onClose: () => void;
}

export function MonthlyEstateReportPdf({ report, onClose }: MonthlyEstateReportPdfProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-brand-void/90 backdrop-blur-md z-50 overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
      {/* Floating Toolbar */}
      <div className="no-print max-w-4xl w-full flex items-center justify-between mb-4 bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 shadow-xl">
        <div>
          <h2 className="text-sm font-medium text-white">Monthly Estate Performance Report</h2>
          <p className="text-xs text-brand-mist/60">{report.periodLabel} · {report.orgName}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-brand-edge-dark text-xs text-brand-mist hover:text-white"
          >
            Close Preview
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 flex items-center gap-1.5 shadow-md shadow-brand-electric/20"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* ─── A4 PRINTABLE DOCUMENT CONTAINER ─────────────────────────────── */}
      <div className="printable-report max-w-4xl w-full bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl space-y-8 font-sans">
        {/* Report Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div>
            <div className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              ENTIRE<span className="text-sky-600">FM</span>
              <span className="text-xs uppercase tracking-widest font-semibold text-slate-500 ml-3">
                CAFM PERFORMANCE REPORT
              </span>
            </div>
            <h1 className="text-2xl font-light text-slate-900 mt-2">{report.orgName}</h1>
            <p className="text-xs text-slate-500">
              Period: <span className="font-semibold text-slate-800">{report.periodLabel}</span> · Generated: {new Date().toLocaleDateString('en-GB')}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1 rounded-lg text-xs font-bold">
              SLA Adherence: {report.slaAchievementPct}%
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Executive Summary</h2>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {report.executiveSummary}
          </div>
        </div>

        {/* KPI Scorecard Grid */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly KPI Scorecard</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-slate-500 block text-[11px]">Total Work Orders</span>
              <span className="text-xl font-bold text-slate-900">{report.totalWorkOrders}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{report.reactiveJobsCount} Reactive · {report.ppmJobsCount} PPM</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-slate-500 block text-[11px]">SLA Achievement</span>
              <span className="text-xl font-bold text-sky-700">{report.slaAchievementPct}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{report.slaBreachPct}% SLA Breached</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-slate-500 block text-[11px]">Statutory Compliance</span>
              <span className="text-xl font-bold text-emerald-700">{report.statutoryCompliancePct}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Audit Ready</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-slate-500 block text-[11px]">First-Time Fix</span>
              <span className="text-xl font-bold text-slate-900">{report.firstTimeFixPct}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Repeat Callout: {report.repeatCalloutPct}%</span>
            </div>
          </div>
        </div>

        {/* Site Breakdown Table */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Site Performance Breakdown</h2>
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 text-[11px] uppercase font-semibold">
              <tr>
                <th className="px-4 py-2.5">Site Name</th>
                <th className="px-4 py-2.5">Work Orders</th>
                <th className="px-4 py-2.5">SLA %</th>
                <th className="px-4 py-2.5 text-right">Spend (£)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {report.siteBreakdown.map((s) => (
                <tr key={s.siteName}>
                  <td className="px-4 py-2.5 font-medium text-slate-900">{s.siteName}</td>
                  <td className="px-4 py-2.5">{s.totalWos}</td>
                  <td className="px-4 py-2.5 font-semibold text-sky-700">{s.slaPct}%</td>
                  <td className="px-4 py-2.5 text-right font-mono">£{s.spendGbp.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommendations & Strategic Actions */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Strategic Recommendations</h2>
          <ul className="space-y-2 text-xs text-slate-700">
            {report.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="font-bold text-sky-600 shrink-0">&bull;</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>EntireFM Facilities Management Platform &bull; www.entirefm.com</span>
          <span>Confidential &bull; Client Commercial Report</span>
        </div>
      </div>
    </div>
  );
}
