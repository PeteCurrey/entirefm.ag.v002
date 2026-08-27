import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldAlert, Building2 } from 'lucide-react';
import type { ComplianceWatchItem } from '@/data/lobby/types';

interface ComplianceWatchProps {
  data: ComplianceWatchItem;
}

export function ComplianceWatch({ data }: ComplianceWatchProps) {
  const isHighUrgency = data.urgency.toUpperCase() === 'HIGH';

  return (
    <aside className="group relative w-full h-full min-h-[500px] overflow-hidden rounded-sm flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-brand-void border border-white/10">
      <Image
        src="/images/editorial/entirefm-distribution-board-testing-1200w.webp"
        alt={data.regulationTitle}
        fill
        className="object-cover brightness-[0.45] transition-all duration-700 group-hover:scale-[1.02] group-hover:brightness-[0.55]"
        sizes="(max-width: 768px) 100vw, 45vw"
        priority
      />

      {/* Deep gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/90" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        <div className="space-y-5">
          {/* Statute + Urgency Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold block">
                {data.statute}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-white/50 font-mono">
                <Building2 className="w-3 h-3 text-white/40" />
                <span>{data.governingBody}</span>
              </div>
            </div>

            {isHighUrgency && (
              <span className="shrink-0 inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-[10px] font-mono px-2.5 py-1 rounded-sm uppercase tracking-wider border border-rose-500/30">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                High Priority
              </span>
            )}
          </div>

          {/* Regulation Title */}
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extralight text-white leading-tight">
            {data.regulationTitle}
          </h3>

          {/* 3 Intelligence Data Points */}
          <div className="space-y-4 pt-2">
            <div className="border-l-2 border-white/20 pl-3.5 space-y-1">
              <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-white/45">
                What Changed
              </span>
              <p className="text-sm font-light text-white/85 leading-relaxed">
                {data.whatChanged}
              </p>
            </div>

            <div className="border-l-2 border-white/20 pl-3.5 space-y-1">
              <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-white/45">
                Who It Affects
              </span>
              <p className="text-sm font-light text-white/85 leading-relaxed">
                {data.whoItAffects}
              </p>
            </div>

            <div className="border-l-2 border-emerald-400 pl-3.5 space-y-1">
              <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-400">
                Required Duty-Holder Action
              </span>
              <p className="text-sm font-light text-white/90 leading-relaxed">
                {data.whatYouNeedToDo}
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA & Timing */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 mt-auto">
          <Link
            href={data.sourceDocUrl || '/lobby/compliance'}
            className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-emerald-400 transition-colors group/link"
          >
            <span>View compliance intelligence</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>

          <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-950/40 px-2.5 py-1 rounded-sm border border-emerald-500/20">
            {data.effectiveDate || data.whenItMatters}
          </span>
        </div>
      </div>
    </aside>
  );
}
