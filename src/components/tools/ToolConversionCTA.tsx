'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, PhoneCall, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';

export interface ToolConversionCTAProps {
  toolName: string;
  heading?: string;
  subheading?: string;
  primaryActionLabel?: string;
  primaryActionHref?: string;
}

export function ToolConversionCTA({
  toolName,
  heading = 'Turn this indicative model into a verified on-site programme',
  subheading = 'EntireFM conducts physical asset verification surveys, digital logbook audits, and statutory compliance reviews for commercial property portfolios nationwide.',
  primaryActionLabel = 'Request On-Site Asset Survey',
  primaryActionHref = '/contact-us#enquiry',
}: ToolConversionCTAProps) {
  return (
    <div className="mt-12 rounded-2xl bg-gradient-to-br from-[#0B1220] to-[#151D2E] border border-slate-800 p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-[#FF3E9D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15">
          <span className="h-2 w-2 rounded-full bg-[#FF3E9D] animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
            Next Practical Step
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
          {heading}
        </h3>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {subheading}
        </p>

        <div className="grid sm:grid-cols-3 gap-3 pt-2 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero obligation audit</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Fixed-cost proposal</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>EntireCAFM live portal</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link
            href={primaryActionHref}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF3E9D] via-[#ED3899] to-[#C026D3] text-white font-bold text-sm shadow-xl hover:scale-105 transition-all"
          >
            <span>{primaryActionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={CONTACT_CONFIG.mainPhone.href}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all"
          >
            <PhoneCall className="w-4 h-4 text-[#FF3E9D]" />
            <span>Speak to Operations: {CONTACT_CONFIG.mainPhone.display}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
