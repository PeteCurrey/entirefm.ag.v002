'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { SectorChallenge } from '@/data/sectors/archetypes';

export interface SectorRiskCasebookProps {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  challenges: SectorChallenge[];
}

export function SectorRiskCasebook({
  eyebrow = 'OPERATIONAL RISK & MITIGATION CASEBOOK',
  headline,
  subheadline,
  challenges,
}: SectorRiskCasebookProps) {
  if (!challenges || challenges.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-18 space-y-3.5">
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
            {subheadline}
          </p>
        </div>

        {/* Technical Consultancy Casebook Layout — Clean Dividers & Contrast */}
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {challenges.map((c, idx) => {
            const numStr = String(idx + 1).padStart(2, '0');
            return (
              <div
                key={idx}
                className="py-10 first:pt-8 last:pb-8 group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                  {/* Column 1: Number & Title */}
                  <div className="lg:col-span-4 space-y-2">
                    <span className="font-mono text-xs text-brand-pink block font-medium">
                      CASE // {numStr}
                    </span>
                    <h3 className="text-xl font-light text-slate-900 tracking-tight leading-snug">
                      {c.title}
                    </h3>
                    {c.statutoryStandard && (
                      <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-pink shrink-0" />
                        <span className="truncate">{c.statutoryStandard}</span>
                      </div>
                    )}
                  </div>

                  {/* Column 2: Operational Consequence */}
                  <div className="lg:col-span-4 space-y-2 bg-[#FAF9FB] p-5 rounded-sm border border-slate-100">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-rose-700 font-light flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      Operational Consequence
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 font-light leading-relaxed">
                      {c.problem}
                    </p>
                  </div>

                  {/* Column 3: EntireFM Engineering Mitigation */}
                  <div className="lg:col-span-4 space-y-2 bg-slate-900 text-white p-5 rounded-sm border border-slate-800">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-emerald-400 font-light flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      EntireFM Engineered Response
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      {c.solution}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
