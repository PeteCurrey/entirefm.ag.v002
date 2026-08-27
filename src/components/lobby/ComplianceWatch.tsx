import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import type { ComplianceWatchItem } from '@/data/lobby/types';

interface ComplianceWatchProps {
  data: ComplianceWatchItem;
}

export function ComplianceWatch({ data }: ComplianceWatchProps) {
  return (
    <article className="flex flex-col justify-between h-full bg-[#181C24] text-white rounded-sm overflow-hidden p-8 sm:p-10 relative group">
      {/* Background Architectural Switchgear Plate with High Restraint */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data.imageUrl || "/images/editorial/entirefm-switchroom-survey-1200w.webp"}
          alt={data.imageAlt || data.regulationTitle}
          fill
          className="object-cover opacity-20 brightness-50 transition-opacity duration-700 group-hover:opacity-25"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181C24] via-[#181C24]/90 to-[#181C24]/80" />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
        {/* Header Label */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-medium">
              COMPLIANCE WATCH
            </span>
            <span className="text-xs text-white/50 font-mono">
              {data.effectiveDate || data.whenItMatters}
            </span>
          </div>

          <p className="text-xs font-mono text-white/60 uppercase tracking-wider">
            {data.statute}
          </p>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extralight text-white leading-snug pt-1">
            {data.regulationTitle}
          </h3>
        </div>

        {/* The Two Core Directives: What Changed + Action */}
        <div className="space-y-5 border-y border-white/10 py-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
              What Changed
            </span>
            <p className="text-sm font-light text-white/85 leading-relaxed">
              {data.whatChanged}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/90 block">
              Action Required
            </span>
            <p className="text-sm font-light text-white/90 leading-relaxed">
              {data.whatYouNeedToDo}
            </p>
          </div>
        </div>

        {/* Footer Authority & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="text-xs text-white/50 font-light">
            Enforced by <span className="text-white/80">{data.governingBody}</span>
          </div>

          <Link
            href={data.sourceDocUrl || '/lobby/compliance'}
            className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-white transition-colors group/link uppercase tracking-wider"
          >
            <span>View compliance intelligence</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
