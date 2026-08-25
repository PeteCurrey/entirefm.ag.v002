'use client';

import React from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Clock, FileCheck2, Shield, Sparkles } from 'lucide-react';

export interface ToolShellProps {
  breadcrumbs: { name: string; url: string }[];
  title: string;
  eyebrow?: string;
  purpose: string;
  timeEstimate: string;
  outputs: string[];
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

export function ToolShell({
  breadcrumbs,
  title,
  eyebrow = 'ENTIREFM / FM INTELLIGENCE',
  purpose,
  timeEstimate,
  outputs,
  children,
}: ToolShellProps) {
  return (
    <div className="relative w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-brand-electric/15 selection:text-brand-graphite">
      {/* 1. BRANDED CORPORATE DARK HERO FRAMING */}
      <header className="relative z-20 bg-[#0B1220] border-b border-brand-edge-dark overflow-hidden">
        {/* Subtle architectural ambient gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 60% at 50% -20%, rgba(37, 99, 235, 0.35), transparent 70%),
              radial-gradient(ellipse 50% 50% at 85% 30%, rgba(124, 58, 237, 0.2), transparent 60%)
            `,
          }}
        />

        {/* Hairline blueprint grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <Breadcrumbs items={breadcrumbs} className="text-xs text-slate-400" />
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-electric animate-pulse" />
              <span className="tracking-wider uppercase">{eyebrow}</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-white leading-[1.15]">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-2.5 leading-relaxed font-normal">
                {purpose}
              </p>
            </div>

            {/* Structured Executive Metadata Pills */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300 shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10">
                <Clock className="w-3.5 h-3.5 text-brand-electric" />
                <span className="font-semibold text-white">{timeEstimate}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>No Registration</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-brand-electric/15 border border-brand-electric/30 text-white">
                <FileCheck2 className="w-3.5 h-3.5 text-brand-electric" />
                <span className="font-medium">{outputs.join(' + ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transition gradient rule from dark hero to light workspace */}
        <div className="h-[2px] w-full bg-gradient-to-r from-brand-electric via-brand-violet to-brand-pink opacity-80" />
      </header>

      {/* 2. MAIN LIGHT-DOMINANT EDITORIAL WORKSPACE */}
      <main className="relative z-10 flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>
    </div>
  );
}
