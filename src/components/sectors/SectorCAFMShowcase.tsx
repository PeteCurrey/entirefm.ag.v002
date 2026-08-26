'use client';

import React from 'react';
import Image from 'next/image';
import { Database, QrCode, FileCheck2, Activity, ShieldCheck } from 'lucide-react';

export interface SectorCAFMShowcaseProps {
  eyebrow?: string;
  headline?: string;
  subline?: string;
  features?: Array<{ title: string; desc: string }>;
}

export function SectorCAFMShowcase({
  eyebrow = 'ENTIRECAFM DIGITAL PLATFORM',
  headline = 'Every site. Every asset. One operational record.',
  subline = 'Statutory compliance, asset health, and work order dispatch visible in real time across your entire estate.',
  features = [
    {
      title: 'Digital Asset Register',
      desc: 'Every plant item barcoded, geo-tagged, and mapped against SFG20 statutory maintenance frequencies.',
    },
    {
      title: 'Statutory Certification Vault',
      desc: 'EICRs, Gas Safety CP12s, F-Gas leak logs, and water hygiene test results archived with instant landlord access.',
    },
    {
      title: 'Live Work Order Triage',
      desc: 'Real-time job dispatch tracking from central helpdesk triage through mobile engineer attendance to photo sign-off.',
    },
    {
      title: 'Contracted SLA & KPI Analytics',
      desc: 'Transparent executive reporting detailing first-time fix rates, response times, and compliance percentage.',
    },
  ],
}: SectorCAFMShowcaseProps) {
  return (
    <section className="py-20 sm:py-28 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-18 space-y-3.5">
          <div className="inline-flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
            <span className="text-xs font-light uppercase tracking-[0.2em] text-slate-400">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
            {headline}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            {subline}
          </p>
        </div>

        {/* Browser Mockup Frame with Real Product Screenshot */}
        <div className="rounded-sm border border-slate-700/80 bg-slate-950/90 shadow-2xl overflow-hidden mb-14">
          {/* Browser Header Bar */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="text-[11px] font-mono text-slate-500 ml-2 font-light">
                entirecafm.com // estate-operations-live
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE TELEMETRY</span>
            </div>
          </div>

          {/* Screenshot Container */}
          <div className="relative aspect-[16/9] sm:aspect-[21/10] w-full bg-slate-950">
            <Image
              src="/images/client-portal/entirecafm-dashboard-live.png"
              alt="EntireCAFM live operational dashboard and compliance tracking"
              fill
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* Structured 4-Pillar Features Strip (Clean Typography & Hairlines) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 border-t border-slate-800 pt-10">
          {features.map((feat, idx) => (
            <div key={idx} className="pt-6 sm:pt-0 sm:px-6 first:pl-0 space-y-2">
              <span className="font-mono text-xs text-brand-pink block font-light">
                0{idx + 1} //
              </span>
              <h3 className="text-base font-light text-white tracking-tight">
                {feat.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-400 font-light leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
