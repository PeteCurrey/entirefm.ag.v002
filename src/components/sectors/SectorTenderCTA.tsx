'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, FileCheck2 } from 'lucide-react';

export interface SectorTenderCTAProps {
  eyebrow?: string;
  headline?: string;
  subline?: string;
  buttonText?: string;
  href?: string;
}

export function SectorTenderCTA({
  eyebrow = 'PROCUREMENT & TENDER PLANNING',
  headline = 'Structuring an FM Invitation to Tender (ITT) for Your Estate?',
  subline = 'Use our free interactive Tender Brief Generator to specify plant assets, maintenance frequencies, access windows, and contracted SLA KPIs.',
  buttonText = 'Open Tender Brief Generator',
  href = '/tools/tender-brief',
}: SectorTenderCTAProps) {
  return (
    <section className="py-16 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-custom">
        <div className="bg-slate-950 text-white rounded-sm p-8 sm:p-12 border border-slate-800 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-light">
                {eyebrow}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
              {headline}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              {subline}
            </p>
          </div>

          <Link
            href={href}
            className="inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-wider text-slate-950 bg-white hover:bg-slate-100 px-6 py-3.5 rounded-sm shadow-sm transition-all whitespace-nowrap active:scale-[0.99]"
          >
            <FileCheck2 className="w-4 h-4 text-brand-pink" />
            <span>{buttonText}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-900" />
          </Link>
        </div>
      </div>
    </section>
  );
}
