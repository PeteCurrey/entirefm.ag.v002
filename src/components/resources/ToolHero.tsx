'use client';

import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export type ToolAccent = 'pink' | 'blue' | 'emerald' | 'amber' | 'violet' | 'cyan';

interface ToolHeroProps {
  breadcrumbs: { name: string; url: string }[];
  eyebrow: string;
  title: string;
  description: string;
  timeEstimate: string;
  deliverables: string[];
  accent?: ToolAccent;
  icon: React.ComponentType<{ className?: string }>;
}

export function ToolHero({
  breadcrumbs,
  eyebrow,
  title,
  description,
  timeEstimate,
  deliverables,
  accent = 'pink',
  icon: Icon,
}: ToolHeroProps) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 border-b border-brand-edge-dark bg-[#060A14] text-white font-sans print:hidden">
      <div className="container-custom relative">
        <Breadcrumbs items={breadcrumbs} className="mb-8 text-xs text-slate-400 font-light" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: copy */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm bg-white/10 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-brand-pink" />
              <span className="text-xs font-medium uppercase tracking-widest text-white/90">
                {eyebrow}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white font-extralight tracking-tight leading-[1.08]">
              {title}
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-slate-200 max-w-2xl font-light">
              {description}
            </p>

            {/* Time estimate pill */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium bg-brand-pink/10 border border-brand-pink/30 text-brand-pink">
                <Clock className="h-3.5 w-3.5" />
                {timeEstimate}
              </span>
              <span className="text-xs text-slate-400 font-light">· Free Tool · No Registration Required</span>
            </div>
          </div>

          {/* Right: deliverables card */}
          <div className="lg:col-span-5">
            <div className="bg-brand-carbon border border-brand-edge-dark rounded-sm p-6 sm:p-8 space-y-4 shadow-elevated">
              <span className="text-[11px] uppercase tracking-widest text-brand-pink font-medium block">
                Deliverable Outputs
              </span>
              <ul className="space-y-3">
                {deliverables.map((d, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 font-light">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-brand-edge-dark flex items-center gap-2 text-xs text-slate-400 font-light">
                <ArrowRight className="h-3.5 w-3.5 text-brand-pink" />
                <span>Interact with the tool below to generate your report</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
