import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import type { ComplianceWatchItem } from '@/data/lobby/types';

interface ComplianceWatchProps {
  data: ComplianceWatchItem;
}

export function ComplianceWatch({ data }: ComplianceWatchProps) {
  const isHighUrgency = data.urgency.toUpperCase() === 'HIGH';

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* ── MAIN COMPLIANCE CARD ── */}
      <aside className="group relative w-full flex-1 min-h-[400px] overflow-hidden rounded-sm flex flex-col justify-between p-6 sm:p-8">
        <Image
          src="/images/editorial/entirefm-distribution-board-testing-1200w.webp"
          alt={data.regulationTitle}
          fill
          className="object-cover brightness-[0.55] transition-all duration-500 group-hover:scale-[1.02] group-hover:brightness-[0.65]"
          sizes="(max-width: 768px) 100vw, 45vw"
          priority
        />

        {/* Strong left-to-dark gradient so text is fully legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85" />

        {/* Content — full width, no inner width constraint */}
        <div className="relative z-10 flex flex-col h-full gap-6">

          {/* Top: statute label + urgency badge */}
          <div className="flex items-start justify-between gap-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 leading-snug max-w-[70%]">
              {data.statute}
            </p>
            {isHighUrgency && (
              <span className="shrink-0 inline-flex items-center gap-1 bg-rose-500/25 text-rose-300 text-[10px] px-2 py-1 rounded-sm uppercase tracking-wider border border-rose-500/30">
                <ShieldAlert className="w-3 h-3" />
                High Priority
              </span>
            )}
          </div>

          {/* Regulation title */}
          <h3 className="text-xl sm:text-2xl font-light text-white leading-snug">
            {data.regulationTitle}
          </h3>

          {/* Three intelligence columns — stacked on narrow, 3-col on wider */}
          <div className="grid grid-cols-1 gap-4 pt-2">
            <div className="space-y-1.5 border-l-2 border-white/20 pl-3">
              <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-white/50">
                What Changed
              </span>
              <p className="text-sm font-light text-white/85 leading-relaxed line-clamp-3">
                {data.whatChanged}
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-white/20 pl-3">
              <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-white/50">
                Who It Affects
              </span>
              <p className="text-sm font-light text-white/85 leading-relaxed line-clamp-2">
                {data.whoItAffects}
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-emerald-500/50 pl-3">
              <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-400/80">
                Required Action
              </span>
              <p className="text-sm font-light text-white/85 leading-relaxed line-clamp-2">
                {data.whatYouNeedToDo}
              </p>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-auto pt-5 border-t border-white/10 flex items-center justify-between">
            <Link
              href={data.sourceDocUrl || '/lobby/compliance'}
              className="inline-flex items-center gap-2 text-sm font-light text-white hover:text-emerald-400 transition-colors group/link"
            >
              View compliance intelligence
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
            <span className="text-[11px] text-white/40 font-mono">
              {data.effectiveDate || data.whenItMatters}
            </span>
          </div>
        </div>
      </aside>

      {/* ── BELOW CARD: Governing Body / Enforcement summary strip ── */}
      <div className="rounded-sm bg-white/[0.04] border border-white/10 px-5 py-4 grid grid-cols-2 gap-4">
        <div className="min-w-0">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5">
            Governing Body
          </span>
          <p className="text-sm font-light text-white leading-snug break-words">
            {data.governingBody}
          </p>
        </div>
        <div className="min-w-0 border-l border-white/10 pl-4">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5">
            Enforcement
          </span>
          <p className="text-sm font-light text-white leading-snug break-words">
            {data.whenItMatters}
          </p>
        </div>
      </div>
    </div>
  );
}

