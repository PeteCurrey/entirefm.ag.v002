'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { SectorChallenge } from '@/data/sectors/archetypes';

export interface SectorChallengesProps {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  challenges: SectorChallenge[];
}

export function SectorChallenges({
  eyebrow = 'OPERATIONAL REALITIES & MITIGATION',
  headline,
  subheadline,
  challenges,
}: SectorChallengesProps) {
  if (!challenges || challenges.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
            {headline}
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            {subheadline}
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {challenges.map((c, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-sm p-7 sm:p-8 shadow-sm flex flex-col justify-between group hover:border-brand-pink/40 hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Title with number */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-sm bg-slate-100 text-slate-700 font-normal text-xs flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-brand-pink/10 group-hover:text-brand-pink transition-colors">
                    0{idx + 1}
                  </div>
                  <h3 className="text-lg font-light text-slate-900 group-hover:text-brand-pink-dark transition-colors">
                    {c.title}
                  </h3>
                </div>

                {/* Problem Statement */}
                <div className="p-4 rounded-sm bg-rose-50/60 border border-rose-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-700 text-[11px] uppercase tracking-wider font-light">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Operational Vulnerability</span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                    {c.problem}
                  </p>
                </div>

                {/* EntireFM Engineered Solution */}
                <div className="p-4 rounded-sm bg-emerald-50/60 border border-emerald-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-700 text-[11px] uppercase tracking-wider font-light">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>EntireFM Engineered Solution</span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                    {c.solution}
                  </p>
                </div>
              </div>

              {/* Statutory Standard Footer */}
              {c.statutoryStandard && (
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-normal">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-pink shrink-0" />
                  <span className="truncate">{c.statutoryStandard}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
