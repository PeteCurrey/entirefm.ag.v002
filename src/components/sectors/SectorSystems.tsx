'use client';

import React from 'react';
import { CheckCircle2, Wrench, ArrowRight } from 'lucide-react';
import type { SectorSystemGroup } from '@/data/sectors/archetypes';

export interface SectorSystemsProps {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  groups: SectorSystemGroup[];
}

export function SectorSystems({
  eyebrow = 'ESTATE DISCIPLINES & SCOPE',
  headline,
  subheadline,
  groups,
}: SectorSystemsProps) {
  if (!groups || groups.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="container-custom">
        {/* Header */}
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

        {/* 4-Group Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((group, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200/90 rounded-sm p-6 flex flex-col justify-between hover:border-brand-pink/40 hover:bg-white hover:shadow-md transition-all duration-300 group"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-brand-pink/10 text-brand-pink font-light text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-[11px] font-light uppercase tracking-wider text-brand-pink truncate">
                    {group.category}
                  </span>
                </div>

                <h3 className="text-base font-light text-slate-900 mb-2 leading-snug group-hover:text-brand-pink-dark transition-colors">
                  {group.headline}
                </h3>

                {/* Items list */}
                <ul className="mt-4 space-y-2.5 pt-3 border-t border-slate-200/70">
                  {group.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom footer badge */}
              <div className="mt-6 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-normal">
                <span>Self-Delivered</span>
                <span className="text-emerald-600 font-light font-sans">SFG20 Care</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
