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
    <div className="w-full bg-[#080d1a] min-h-screen text-slate-100 flex flex-col selection:bg-[#FF3E9D]/30 selection:text-white">
      {/* Precision Editorial Header */}
      <header className="border-b border-slate-800 bg-[#09101f]/95 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between gap-4 mb-2">
            <Breadcrumbs items={breadcrumbs} className="text-xs text-slate-400" />
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
              {eyebrow}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 pt-1">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-1 leading-relaxed">
                {purpose}
              </p>
            </div>

            {/* Restrained Editorial Metadata Strip */}
            <div className="flex items-center gap-3 text-xs text-slate-300 font-mono shrink-0 pb-0.5">
              <span>{timeEstimate}</span>
              <span className="text-slate-500">|</span>
              <span>No registration</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-200">{outputs.join(' · ')}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        {children}
      </div>
    </div>
  );
}
