import React from 'react';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle, ArrowRight, Clock, FileText, CheckCircle2 } from 'lucide-react';
import type { ComplianceWatchItem } from '@/data/lobby/types';

interface ComplianceWatchProps {
  data: ComplianceWatchItem;
}

export function ComplianceWatch({ data }: ComplianceWatchProps) {
  return (
    <aside
      id="compliance-watch"
      className="border border-brand-edge-dark bg-brand-carbon text-white rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-elevated relative overflow-hidden h-full"
    >
      {/* Visual background texture */}
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-20" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-20 blur-3xl bg-amber-500"
      />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-amber-400">
              Compliance Watch
            </span>
          </div>

          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-normal bg-amber-500/15 text-amber-300 border border-amber-500/30">
            {data.urgency} PRIORITY
          </span>
        </div>

        {/* Title & Governing Body */}
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-mist/50 block mb-1">
            {data.statute} · {data.governingBody}
          </span>
          <h3 className="text-xl sm:text-2xl font-light text-white leading-snug">
            {data.regulationTitle}
          </h3>
        </div>

        {/* 4-Part Translation Grid */}
        <div className="space-y-4 pt-2">
          {/* 1. What Changed */}
          <div className="border-l-2 border-amber-500/60 pl-3.5 py-0.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-amber-400 block mb-1">
              01 · What Changed
            </span>
            <p className="text-xs sm:text-[13px] font-light text-brand-mist/85 leading-relaxed">
              {data.whatChanged}
            </p>
          </div>

          {/* 2. Who It Affects */}
          <div className="border-l-2 border-brand-electric pl-3.5 py-0.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-brand-electric-bright block mb-1">
              02 · Who It Affects
            </span>
            <p className="text-xs sm:text-[13px] font-light text-brand-mist/85 leading-relaxed">
              {data.whoItAffects}
            </p>
          </div>

          {/* 3. What You Need To Do */}
          <div className="border-l-2 border-emerald-400 pl-3.5 py-0.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-400 block mb-1">
              03 · What You Need To Do
            </span>
            <p className="text-xs sm:text-[13px] font-light text-brand-mist/85 leading-relaxed">
              {data.whatYouNeedToDo}
            </p>
          </div>

          {/* 4. When It Matters */}
          <div className="border-l-2 border-purple-400 pl-3.5 py-0.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-purple-300 block mb-1">
              04 · When It Matters
            </span>
            <p className="text-xs sm:text-[13px] font-light text-brand-mist/85 leading-relaxed">
              {data.whenItMatters}
            </p>
          </div>
        </div>
      </div>

      {/* Footer link to compliance centre */}
      <div className="relative z-10 pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between">
        <span className="text-[11px] font-light text-brand-mist/50">
          Source: EntireFM Statutory Register
        </span>
        <Link
          href={data.sourceDocUrl || '/compliance'}
          className="inline-flex items-center gap-1.5 text-xs font-normal text-amber-400 hover:text-white transition-colors"
        >
          <span>Statutory duties</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
