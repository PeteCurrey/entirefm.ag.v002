'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { SectorOperatingStep } from '@/data/sectors/archetypes';

export interface SectorOperatingModelProps {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  steps: SectorOperatingStep[];
}

export function SectorOperatingModel({
  eyebrow = 'DELIVERY ARCHITECTURE',
  headline,
  subheadline,
  steps,
}: SectorOperatingModelProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-brand-graphite text-white relative overflow-hidden border-b border-brand-edge-dark">
      <div
        aria-hidden="true"
        className="facet-rule pointer-events-none absolute inset-0 opacity-25"
      />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-pink-light">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white leading-tight">
            {headline}
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {subheadline}
          </p>
        </div>

        {/* Operating Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6 relative">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-brand-carbon border border-brand-edge-dark rounded-sm p-6 flex flex-col justify-between group hover:border-brand-pink/40 hover:bg-slate-900 transition-all duration-300 relative"
            >
              <div>
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-brand-pink/80 group-hover:text-brand-pink-light transition-colors">
                    {s.step}
                  </span>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="hidden md:block w-4 h-4 text-slate-600 group-hover:text-brand-pink transition-colors" />
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-brand-pink-light transition-colors leading-snug">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {/* Bottom line */}
              <div className="mt-6 pt-3 border-t border-brand-edge-dark/60 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Phase {s.step} Execution
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
