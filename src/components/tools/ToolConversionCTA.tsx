'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, ShieldCheck } from 'lucide-react';

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
    <section className="mt-12 pt-8 border-t border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            Next Steps / Operational Delivery
          </span>
          <h3 className="text-xl font-bold text-white mt-1">
            {heading}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            {subheading}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href={primaryActionHref}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-[3px] bg-[#0c1527] hover:bg-[#111e38] text-white text-xs font-bold tracking-wider uppercase border border-slate-700 transition-colors"
          >
            <span>{primaryActionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FF3E9D]" />
          </Link>

          <Link
            href={secondaryActionHref}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-[3px] text-slate-400 hover:text-white text-xs font-semibold transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{secondaryActionLabel}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
