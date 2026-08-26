'use client';

import React from 'react';
import { 
  FileText, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export function MonthlyReportComparison() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-wide">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="eyebrow eyebrow-light">THE OPERATING PARADIGM</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
            The difference between reporting an estate and actually seeing it.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Most FM providers operate behind a curtain of delayed month-end PDF decks and aggregated spreadsheets. EntireFM provides live, continuous operational truth.
          </p>
        </div>

        {/* Side-by-side Architectural Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* LEFT: Traditional FM Reporting (The PDF / Spreadsheet) */}
          <div className="rounded-sm border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-light text-slate-900">
                      Traditional Monthly FM Reporting
                    </h3>
                    <span className="text-xs text-slate-400 font-light">
                      Static PDF Packs &bull; Disconnected Spreadsheets
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-slate-100 text-slate-600 text-[10px] sm:text-[11px] font-light">
                  Delayed Retrospective
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                Information is hand-compiled by account managers weeks after work was completed. Disconnected spreadsheets, subcontractor invoices, and lost email threads create operational blindspots.
              </p>

              <ul className="space-y-3.5 sm:space-y-4 pt-1 sm:pt-2">
                {[
                  {
                    title: '15–20 Day Reporting Lag',
                    desc: 'You only learn about failed equipment or missed PPM deadlines weeks after the event occurred.',
                  },
                  {
                    title: 'Disconnected Data Silos',
                    desc: 'Certificates in shared drives, job sheets in emails, and billing spreadsheets on finance desktops.',
                  },
                  {
                    title: 'Unflagged SLA Target Breaches',
                    desc: 'No real-time countdowns — SLA failures are reported as a historical statistic rather than prevented.',
                  },
                  {
                    title: 'Disputed Month-End Invoicing',
                    desc: 'Invoices lack time-stamped photographic proof or site sign-offs, creating payment friction.',
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs sm:text-[13px] text-slate-900 block font-normal">
                        {item.title}
                      </strong>
                      <span className="text-xs text-slate-500 font-light leading-relaxed">
                        {item.desc}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400 font-light">
              Outcome: Reactive management &bull; Zero point-in-time statutory certainty
            </div>
          </div>

          {/* RIGHT: EntireFM Live Operating Model */}
          <div className="rounded-sm border-2 border-slate-900 bg-slate-900 text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-pink">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-light text-white">
                      EntireFM Live Operating Model
                    </h3>
                    <span className="text-xs text-emerald-400 font-light flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Production Telemetry &bull; Continuous Feed
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-brand-pink/20 text-brand-pink border border-brand-pink/30 text-[10px] sm:text-[11px] font-light">
                  Live Platform
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                One continuous environment connecting the client console directly to field engineers, statutory asset logs, and financial ledgers in real time.
              </p>

              <ul className="space-y-3.5 sm:space-y-4 pt-1 sm:pt-2">
                {[
                  {
                    title: 'Point-in-Time Reality Today',
                    desc: 'See active jobs, engineer GPS check-ins, and SLA countdowns as they happen on your estate right now.',
                  },
                  {
                    title: 'End-to-End Operational Chain',
                    desc: 'Estate → Site → Space → Asset → Requirement → PPM → Work Order → Evidence → Compliance.',
                  },
                  {
                    title: 'Proactive SLA Risk Triage',
                    desc: 'EntireCAFM alerts our regional operations desks before an SLA attendance window is compromised.',
                  },
                  {
                    title: 'Canonical Proof & Milestone Invoicing',
                    desc: 'Time-stamped photos, gas combustion readings, and tenant sign-offs attached immutably to assets.',
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs sm:text-[13px] text-white block font-normal">
                        {item.title}
                      </strong>
                      <span className="text-xs text-slate-300 font-light leading-relaxed">
                        {item.desc}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-light">
              <span>Outcome: Absolute governance &bull; Audit certainty</span>
              <span className="text-emerald-400">98.4% Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
