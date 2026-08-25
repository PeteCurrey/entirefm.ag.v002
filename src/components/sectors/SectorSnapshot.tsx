'use client';

import React from 'react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import type { SectorPriority } from '@/data/sectors/archetypes';

export interface SectorSnapshotProps {
  leadText: string;
  priorities: SectorPriority[];
}

export function SectorSnapshot({ leadText, priorities }: SectorSnapshotProps) {
  if (!priorities || priorities.length === 0) return null;

  return (
    <section className="bg-slate-900 border-b border-slate-800 text-white relative z-20 shadow-subtle">
      {/* Top Lead Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-4">
        <div className="container-custom">
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-4xl">
            <span className="text-brand-pink-light font-light uppercase tracking-wider text-[11px] block sm:inline sm:mr-2">
              OPERATIONAL ENVIRONMENT //
            </span>
            {leadText}
          </p>
        </div>
      </div>

      {/* Priority Pillars */}
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
          {priorities.map((p, idx) => (
            <div
              key={idx}
              className="p-5 flex items-start gap-3.5 group hover:bg-slate-800/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-sm bg-slate-800/90 border border-slate-700/60 flex items-center justify-center shrink-0 p-1.5 group-hover:border-brand-pink/40 group-hover:scale-105 transition-all">
                <BrandIcon name={p.iconName} size={28} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-normal text-white uppercase tracking-wider block truncate group-hover:text-brand-pink-light transition-colors">
                  {p.title}
                </span>
                <span className="text-[11.5px] text-slate-400 block mt-1 leading-snug">
                  {p.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
