'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, PhoneCall } from 'lucide-react';

interface ConversionBridgeProps {
  headline: string;
  body: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  accent?: 'pink' | 'blue' | 'emerald' | 'amber' | 'violet';
}

export function ResultsConversionBridge({
  headline,
  body,
  ctaPrimary,
  ctaSecondary,
  accent = 'pink',
}: ConversionBridgeProps) {
  return (
    <div className="relative overflow-hidden rounded-sm border border-brand-edge-dark bg-brand-carbon p-8 sm:p-10 font-sans print:hidden">
      <div className="relative flex flex-col lg:flex-row lg:items-center gap-8 justify-between">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
            <span className="text-[11px] uppercase tracking-widest text-brand-pink font-medium">
              Operational Next Steps
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-light text-white leading-snug tracking-tight">{headline}</h3>
          <p className="text-sm text-slate-300 font-light leading-relaxed">{body}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <Link
            href={ctaPrimary.href}
            className="inline-flex items-center gap-2 bg-brand-pink hover:bg-brand-pink/90 text-white text-sm font-medium px-6 py-3.5 rounded-sm transition-all hover:scale-[1.02] shadow-elevated whitespace-nowrap"
          >
            <span>{ctaPrimary.label}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          {ctaSecondary && (
            <Link
              href={ctaSecondary.href}
              className="inline-flex items-center gap-2 border border-white/20 bg-white/10 hover:bg-white/20 text-white text-sm font-normal px-5 py-3.5 rounded-sm transition-all"
            >
              <span>{ctaSecondary.label}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
