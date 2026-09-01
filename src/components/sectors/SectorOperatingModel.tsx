'use client';

import React from 'react';
import type { SectorOperatingStep } from '@/data/sectors/archetypes';

export interface SectorOperatingModelProps {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  steps: SectorOperatingStep[];
}

export function SectorOperatingModel({
  eyebrow = 'DELIVERY METHODOLOGY',
  headline,
  subheadline,
  steps,
}: SectorOperatingModelProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-slate-950 text-white border-b border-slate-800 relative overflow-hidden">
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
          <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
            {subheadline}
          </p>
        </div>

        {/* 5-Phase Horizontal Timeline Strip */}
        <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-800/90 border-y border-slate-800/90">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="py-8 md:py-10 md:px-6 first:pl-0 last:pr-0 space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-pink font-light">
                  PHASE // {s.step}
                </span>
              </div>

              <h3 className="text-base font-light text-white tracking-tight leading-snug group-hover:text-brand-pink-light transition-colors">
                {s.title}
              </h3>

              <p className="text-xs sm:text-[13px] text-slate-400 font-light leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
