import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, ArrowRight, Layers, FileText, BarChart3, Database } from 'lucide-react';

interface GeoCafmPreviewProps {
  city: string;
}

export function GeoCafmPreview({ city }: GeoCafmPreviewProps) {
  return (
    <section className="section-padding bg-brand-graphite text-white relative overflow-hidden border-b border-white/10">
      {/* Background facet grid */}
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-20" />
      <div
        aria-hidden="true"
        className="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-brand-electric/10 blur-3xl pointer-events-none"
      />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: CAFM Narrative */}
          <div className="lg:col-span-5 space-y-6" data-reveal>
            <div>
              <span className="eyebrow eyebrow-dark text-brand-pink-light">Digital Infrastructure</span>
              <h2 className="text-display-md text-white mt-3 leading-tight">
                Your {city} Estate. One Real-Time Operational View.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-brand-mist/80 leading-relaxed font-light">
              We eliminate compliance uncertainty and spreadsheet chaos. All {city} site assets, 52-week planned maintenance calendars, work orders, and statutory certificates are managed in real time through EntireCAFM.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-brand-mist">
                <CheckCircle2 className="h-4 w-4 text-brand-pink-light shrink-0 mt-0.5" />
                <span><strong>Live Compliance Scorecard:</strong> Real-time EICR, Gas CP12, F-Gas, Fire, and Legionella audit vault.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-brand-mist">
                <CheckCircle2 className="h-4 w-4 text-brand-pink-light shrink-0 mt-0.5" />
                <span><strong>SFG20 Asset Hierarchy:</strong> Barcoded assets with full service history and photographic completion evidence.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-brand-mist">
                <CheckCircle2 className="h-4 w-4 text-brand-pink-light shrink-0 mt-0.5" />
                <span><strong>Service Charge Proof Packs:</strong> Itemised job sheets and expenditure breakdowns for managing agents and tenants.</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link href="/client-portal" className="btn-hero-pink">
                Explore CAFM Client Portal
                <ArrowRight className="btn-arrow h-4 w-4" />
              </Link>
              <Link href="/client-login" className="btn-ghost-light">
                Existing Client Login
              </Link>
            </div>
          </div>

          {/* Right Column: Simulated CAFM Interactive Terminal */}
          <div className="lg:col-span-7" data-reveal>
            <div className="rounded-sm border border-white/15 bg-slate-900/90 shadow-2xl backdrop-blur-xl overflow-hidden">
              {/* Window Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-white/10 text-xs font-normal text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-light text-slate-200">EntireCAFM Enterprise // {city.toUpperCase()} DASHBOARD</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SYNCED LIVE</span>
                </div>
              </div>

              {/* Terminal Stats Summary */}
              <div className="grid grid-cols-3 gap-px bg-white/10 border-b border-white/10 text-center">
                <div className="bg-slate-900/90 p-4">
                  <span className="text-[10px] uppercase font-medium text-slate-400 block">Estate Compliance</span>
                  <span className="text-xl sm:text-2xl font-extralight text-emerald-400">100%</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">0 Overdue Tasks</span>
                </div>
                <div className="bg-slate-900/90 p-4">
                  <span className="text-[10px] uppercase font-medium text-slate-400 block">Active Work Orders</span>
                  <span className="text-xl sm:text-2xl font-extralight text-teal-400">14 Live</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{city} Area Units</span>
                </div>
                <div className="bg-slate-900/90 p-4">
                  <span className="text-[10px] uppercase font-medium text-slate-400 block">SLA Response Rate</span>
                  <span className="text-xl sm:text-2xl font-extralight text-brand-pink-light">99.4%</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Priority Band 1-3</span>
                </div>
              </div>

              {/* Simulated Live Feed Rows */}
              <div className="p-4 sm:p-5 space-y-3 font-normal text-xs">
                <p className="text-[11px] font-normal uppercase text-slate-400 tracking-wider">
                  Live Dispatch &amp; PPM Feed ({city} Regional Sector):
                </p>

                <div className="rounded-sm bg-slate-950/60 p-3 border border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <div>
                      <div className="font-light text-slate-200">WO-2026-8942 // Rooftop AHU-02 PPM Service</div>
                      <div className="text-[11px] text-slate-400">Fixed-speed belt check &amp; filter renewal | SFG20 Task M-04</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                    COMPLETE // CERT FILED
                  </span>
                </div>

                <div className="rounded-sm bg-slate-950/60 p-3 border border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                    <div>
                      <div className="font-light text-slate-200">WO-2026-8951 // Distribution Board DB-G01 EICR</div>
                      <div className="text-[11px] text-slate-400">Periodic fixed-wire inspection &amp; thermal scan | NICEIC Certified</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 shrink-0">
                    IN PROGRESS
                  </span>
                </div>

                <div className="rounded-sm bg-slate-950/60 p-3 border border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    <div>
                      <div className="font-light text-slate-200">WO-2026-8955 // Cold Water Storage Tank Sampling</div>
                      <div className="text-[11px] text-slate-400">Monthly temperature regime &amp; microbiological TVC testing</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                    SCHEDULED
                  </span>
                </div>
              </div>

              {/* Window Footer */}
              <div className="px-5 py-3 bg-slate-950/90 border-t border-white/10 flex items-center justify-between text-[11px] font-normal text-slate-400">
                <span>Encrypted AES-256 Vault // AWS London</span>
                <span className="text-brand-pink-light">Client Access Available 24/7/365</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
