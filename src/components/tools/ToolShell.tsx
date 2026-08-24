'use client';

import React from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

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
    <div className="relative w-full bg-[#070b16] min-h-screen text-slate-100 flex flex-col selection:bg-[#FF3E9D]/30 selection:text-white overflow-hidden">
      {/* 1. ATMOSPHERIC BLUE-HOUR TOOL STAGE LIGHTING */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 90% 50% at 50% -10%, rgba(30, 58, 138, 0.45), transparent 75%),
            radial-gradient(ellipse 60% 40% at 85% 20%, rgba(255, 62, 157, 0.08), transparent 70%),
            radial-gradient(ellipse 50% 50% at 15% 50%, rgba(14, 165, 233, 0.07), transparent 65%)
          `,
        }}
      />

      {/* 2. SUBTLE ARCHITECTURAL BLUEPRINT GRID */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 3. REFINED BRAND TRANSITION EDGE LINE (WEBSITE -> DIGITAL TOOL) */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#0284C7] to-[#FF3E9D]/80 opacity-90 relative z-40" />

      {/* 4. CINEMATIC EDITORIAL APP HEADER */}
      <header className="relative z-30 border-b border-slate-800/80 bg-[#080e1c]/90 backdrop-blur-md sticky top-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4 mb-2.5">
            <Breadcrumbs items={breadcrumbs} className="text-xs text-slate-400" />
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7] animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                {eyebrow}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 pt-1">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-1.5 leading-relaxed">
                {purpose}
              </p>
            </div>

            {/* Restrained Editorial Metadata Strip */}
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono shrink-0 pb-1">
              <span className="text-slate-300 font-bold uppercase tracking-wider">{timeEstimate}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300">NO REGISTRATION</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-200 font-semibold">{outputs.join(' + ')}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 5. MAIN CONTENT STAGE WORKSPACE */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow flex flex-col justify-start">
        {children}
      </div>
    </div>
  );
}
