'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ToolConversionCTAProps {
  toolName: string;
  heading?: string;
  subheading?: string;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
}

export function ToolConversionCTA({
  toolName,
  heading = 'Require formal on-site asset verification?',
  subheading = 'EntireFM provides physical asset surveys, statutory logbooks, and verified planned maintenance regimes across UK commercial portfolios.',
  primaryActionLabel = 'Request Engineering Survey',
  primaryActionHref = '/contact-us#enquiry',
  secondaryActionLabel = 'Speak with Technical Operations',
  secondaryActionHref = '/contact-us',
}: ToolConversionCTAProps) {
  return (
    <section className="mt-12 rounded-sm border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-electric" />
            <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase font-light">
              Next Steps / Operational Delivery
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extralight text-slate-900">
            {heading}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {subheading}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href={primaryActionHref}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-brand-graphite hover:bg-slate-800 text-white text-xs font-normal tracking-wider uppercase shadow-sm transition-all duration-200 hover:shadow"
          >
            <span>{primaryActionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-electric-bright" />
          </Link>

          <Link
            href={secondaryActionHref}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-sm bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-normal transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <span>{secondaryActionLabel}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
