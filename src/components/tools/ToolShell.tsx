'use client';

import React from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Clock, Download, FileSpreadsheet, Calendar, Sparkles, ShieldCheck, LucideIcon } from 'lucide-react';

export interface ToolShellProps {
  breadcrumbs: { name: string; url: string }[];
  title: string;
  badge?: string;
  purpose: string;
  timeEstimate: string;
  outputs: string[];
  icon: LucideIcon;
  accentColor?: string; // e.g. '#FF3E9D'
  children: React.ReactNode;
}

export function ToolShell({
  breadcrumbs,
  title,
  badge = 'EntireFM Intelligence Toolkit',
  purpose,
  timeEstimate,
  outputs,
  icon: Icon,
  children,
}: ToolShellProps) {
  return (
    <div className="w-full bg-[#080d1a] min-h-screen text-slate-100 flex flex-col selection:bg-[#FF3E9D]/30 selection:text-white">
      {/* Header application command banner */}
      <div className="border-b border-slate-800/80 bg-[#0b1329]/90 backdrop-blur-md sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs items={breadcrumbs} className="mb-2.5 text-xs text-slate-400" />
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 flex items-center justify-center text-[#FF3E9D] shadow-inner shrink-0 mt-0.5 sm:mt-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    {title}
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#FF3E9D]/10 text-[#FF3E9D] border border-[#FF3E9D]/20">
                    {badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed max-w-2xl">
                  {purpose}
                </p>
              </div>
            </div>

            {/* Metadata badges: time & outputs */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start md:self-center">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{timeEstimate}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-medium">
                <Download className="w-3.5 h-3.5 text-[#FF3E9D]" />
                <span>{outputs.join(' · ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main interactive application workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </div>
    </div>
  );
}
