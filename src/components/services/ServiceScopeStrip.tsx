'use client';

import React from 'react';
import { BrandIcon, BrandIconKey } from '@/components/ui/BrandIcon';

export interface ScopePillar {
  label: string;
  sublabel: string;
  iconName: BrandIconKey;
}

export function ServiceScopeStrip({ pillars }: { pillars: ScopePillar[] }) {
  if (!pillars || pillars.length === 0) return null;

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white relative z-20 shadow-subtle">
      <div className="container-custom">
        <div className={`grid grid-cols-2 md:grid-cols-${pillars.length} divide-y md:divide-y-0 md:divide-x divide-slate-800/80`}>
          {pillars.map((p, idx) => (
            <div key={idx} className="p-4 sm:p-5 flex items-center gap-3.5 group hover:bg-slate-800/40 transition-colors">
              <div className="w-10 h-10 rounded-sm bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0 p-1.5 group-hover:border-brand-pink/40 group-hover:scale-105 transition-all">
                <BrandIcon name={p.iconName} size={28} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white uppercase tracking-wider block truncate group-hover:text-brand-pink-light transition-colors">
                  {p.label}
                </span>
                <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                  {p.sublabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
