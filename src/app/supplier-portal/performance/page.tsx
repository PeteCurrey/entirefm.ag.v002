import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Activity, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

export default function SupplierPortalPerformancePage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-slate-400">
                ENTIRECAFM // PERFORMANCE SCORECARD
              </span>
              <h1 className="text-2xl font-extralight text-slate-900 mt-1">
                Operational Performance Transparency
              </h1>
            </div>

            <span className="inline-block text-xs font-mono font-light px-3 py-1 bg-emerald-100 text-emerald-900 rounded-sm">
              PERFORMANCE STATUS: EXCELLENT
            </span>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">SLA ATTENDANCE</span>
              <div className="text-2xl font-mono font-light text-emerald-600">94.8%</div>
              <span className="text-[10.5px] text-slate-500 font-mono">Above Network Median (91.2%)</span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">FIRST-TIME FIX</span>
              <div className="text-2xl font-mono font-light text-slate-900">88.5%</div>
              <span className="text-[10.5px] text-slate-500 font-mono">Single Visit Resolution</span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">REPORT ACCURACY</span>
              <div className="text-2xl font-mono font-light text-slate-900">96.0%</div>
              <span className="text-[10.5px] text-slate-500 font-mono">First-Time Approved Reports</span>
            </div>
          </div>

          {/* Educational Note on Metric Transparency */}
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-brand-pink" />
              <h3 className="text-xs font-normal uppercase tracking-wider text-slate-900">
                How EntireFM Measures Supplier Performance
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-light leading-relaxed">
              Performance is calculated strictly from operational job timestamps, verified CAFM service reports, and client feedback. Delays resulting from client access restrictions, parts authorization, or third parties are excluded from your SLA metrics.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
