'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, Clock, Eye, AlertTriangle, FileText, PoundSterling } from 'lucide-react';

export function CinematicControlSection() {
  const [activeStatementIndex, setActiveStatementIndex] = useState(0);

  const statements = [
    {
      title: 'Know what is open.',
      subtitle: 'Real-Time Work Order Triage',
      desc: 'Instant clarity on every active reactive ticket, emergency callout, and scheduled maintenance visit across all national sites without chasing email threads or account managers.',
      image: '/images/client-portal/entirecafm-dashboard-live.png',
      caption: 'Live Operations Feed: 127 active work orders categorized by severity and location.',
      icon: Eye,
    },
    {
      title: 'Know who is attending.',
      subtitle: 'Live Engineer GPS & Access Clearance',
      desc: 'See exactly which qualified technician is checked into the building, their trade accreditations (Gas Safe, NICEIC, F-Gas), emergency contact, and verified permit-to-work status.',
      image: '/images/client-portal/entirecafm-site-drawer.png',
      caption: 'Site Drawer: Real-time on-site engineer verification with dynamic safety RAMS.',
      icon: Clock,
    },
    {
      title: 'Know what is at risk.',
      subtitle: 'Proactive SLA Risk Triage',
      desc: 'EntireCAFM alerts contract directors before an SLA attendance window or statutory compliance interval is breached, enabling pre-emptive resource re-allocation.',
      image: '/images/client-portal/entirecafm-ppm-autopilot.png',
      caption: 'PPM Control: 98.4% statutory compliance with automated 60/30-day renewal alerts.',
      icon: AlertTriangle,
    },
    {
      title: 'Know what has been completed.',
      subtitle: 'Point-of-Work Photographic Validation',
      desc: 'Review high-resolution before/after photographs, gas combustion readings, water temperature logs, and tenant sign-offs attached immutably to the asset record.',
      image: '/images/client-portal/entirecafm-site-360-workspace.png',
      caption: 'Asset Record: Full historical maintenance ledger with time-stamped visual proof.',
      icon: CheckCircle2,
    },
    {
      title: 'Know what it cost.',
      subtitle: 'Transparent Commercial Control',
      desc: 'Pre-authorised spending limits, live works in progress (WIP) tracking, and line-item invoices matched electronically to verified job sheets with zero billing surprises.',
      image: '/images/client-portal/entirecafm-dashboard-live.png',
      caption: 'Commercial Ledger: £185k WIP visibility with automated quote sign-off gates.',
      icon: PoundSterling,
    },
    {
      title: 'Know where the evidence is.',
      subtitle: 'Auditable Digital Compliance Vault',
      desc: 'Every statutory EICR, gas safety CP12, LOLER lift certificate, and water hygiene logbook indexed by building, floor, and asset ready for instant insurer or HSE audit export.',
      image: '/images/client-portal/entirecafm-ppm-autopilot.png',
      caption: 'Compliance Vault: 16 statutory categories with instant PDF pack export.',
      icon: FileText,
    },
  ];

  const selected = statements[activeStatementIndex];
  const StatementIcon = selected.icon;

  return (
    <section className="py-24 bg-brand-graphite text-white border-t border-b border-brand-edge-dark relative overflow-hidden">
      {/* Subtle Glow Scrim */}
      <div 
        aria-hidden="true" 
        className="absolute -top-40 right-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute -bottom-40 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="container-wide relative z-10">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink block font-medium">
            EXECUTIVE CONTROL &amp; CERTAINTY
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
            Control without chasing the answer.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Estate directors and operations managers spend hours every week chasing updates, missing certificates, and disputed invoices. EntireCAFM delivers total certainty across six vital dimensions:
          </p>
        </div>

        {/* 6 Statements Grid with Interactive Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 6 Statement Buttons */}
          <div className="lg:col-span-5 space-y-2.5">
            {statements.map((st, idx) => {
              const isSelected = idx === activeStatementIndex;
              const Icon = st.icon;
              return (
                <button
                  key={st.title}
                  onClick={() => setActiveStatementIndex(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-sm border transition-all flex items-start justify-between gap-4 ${
                    isSelected
                      ? 'bg-slate-900 border-brand-pink text-white shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2 rounded-sm shrink-0 mt-0.5 ${
                        isSelected ? 'bg-brand-pink text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3
                        className={`text-base sm:text-lg font-light tracking-tight ${
                          isSelected ? 'text-white font-normal' : 'text-slate-300'
                        }`}
                      >
                        {st.title}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-light block mt-0.5">
                        {st.subtitle}
                      </span>
                    </div>
                  </div>

                  <span className={`text-xs font-light mt-1 shrink-0 ${isSelected ? 'text-brand-pink' : 'text-slate-600'}`}>
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Statement Deep Dive & Real Platform Inset */}
          <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-sm p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-slate-900 text-brand-pink flex items-center justify-center">
                  <StatementIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10.5px] font-normal uppercase tracking-wider text-brand-pink block">
                    OPERATIONAL CONTROL DIMENSION 0{activeStatementIndex + 1}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-light text-white mt-0.5">
                    {selected.title}
                  </h4>
                </div>
              </div>

              <div className="hidden sm:block text-right text-xs text-slate-400 font-light">
                EntireCAFM Live View
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              {selected.desc}
            </p>

            {/* Platform Screenshot Inset */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs border border-slate-800 bg-slate-900 shadow-inner">
              <Image
                src={selected.image}
                alt={selected.caption}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-400 font-light">
              <span>{selected.caption}</span>
              <Link
                href="/contact-us?subject=Book%20a%20Live%20Client%20Portal%20Demonstration"
                className="text-brand-pink hover:underline inline-flex items-center gap-1 font-light"
              >
                Inspect Live Platform <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
