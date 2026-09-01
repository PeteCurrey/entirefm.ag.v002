'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { CaseStudy } from '@/server/trust/case-studies';

export interface SectorEvidenceProps {
  eyebrow?: string;
  headline?: string;
  subline?: string;
  caseStudies: CaseStudy[];
}

export function SectorEvidence({
  eyebrow = 'VERIFIED OPERATIONAL EVIDENCE',
  headline = 'Demonstrated Engineering Delivery & Compliance Governance',
  subline = 'Operational performance, statutory audit readiness, and asset lifecycle optimization across UK commercial facilities.',
  caseStudies,
}: SectorEvidenceProps) {
  if (!caseStudies || caseStudies.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="container-custom space-y-14">
        {/* Header */}
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
            <span className="text-xs font-light uppercase tracking-[0.2em] text-slate-500">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
            {headline}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            {subline}
          </p>
        </div>

        {/* Editorial Case Studies Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.slice(0, 3).map((cs, idx) => (
            <div
              key={cs.id || idx}
              className="bg-[#FAF9FB] border border-slate-200 rounded-sm p-7 sm:p-8 flex flex-col justify-between space-y-6 hover:border-brand-pink/50 hover:bg-white transition-all duration-300 group shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-[11px] uppercase tracking-wider text-brand-pink font-light">
                    {cs.sector}
                  </span>
                  <span className="text-[11px] font-normal text-slate-500 bg-white px-2 py-0.5 rounded-sm border border-slate-200">
                    {cs.location}
                  </span>
                </div>

                <h3 className="text-lg font-light text-slate-900 tracking-tight leading-snug group-hover:text-brand-pink-dark transition-colors">
                  {cs.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                  {cs.challenge}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-light">
                  VERIFIED OUTCOME //
                </span>
                <p className="text-xs sm:text-[13px] text-emerald-800 font-normal leading-snug">
                  {cs.outcome}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
