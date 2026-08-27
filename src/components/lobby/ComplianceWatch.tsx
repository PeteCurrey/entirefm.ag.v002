import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { ComplianceWatchItem } from '@/data/lobby/types';

interface ComplianceWatchProps {
  data: ComplianceWatchItem;
}

export function ComplianceWatch({ data }: ComplianceWatchProps) {
  const isHighUrgency = data.urgency.toUpperCase() === 'HIGH';

  return (
    <aside className="group relative w-full h-full min-h-[480px] overflow-hidden rounded-sm flex flex-col justify-center p-6 sm:p-10 lg:p-12">
      <Image
        src="/images/editorial/entirefm-distribution-board-testing-1200w.webp"
        alt={data.regulationTitle}
        fill
        className="object-cover brightness-75 transition-all duration-500 group-hover:scale-[1.02]"
        sizes="(max-width: 768px) 100vw, 100vw"
        priority
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/70 to-black/30" />
      
      <div className="relative z-10 w-full md:w-[55%] flex flex-col h-full justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-medium">
              {data.statute}
            </span>
            {isHighUrgency && (
              <span className="bg-rose-500/20 text-rose-300 text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wide">
                High Priority
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-light text-white leading-tight">
            {data.regulationTitle}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="space-y-1.5">
              <span className="block text-[9px] uppercase tracking-[0.18em] text-white/40">
                What Changed
              </span>
              <p className="text-xs text-white/80 font-light line-clamp-4">
                {data.whatChanged}
              </p>
            </div>
            
            <div className="space-y-1.5">
              <span className="block text-[9px] uppercase tracking-[0.18em] text-white/40">
                Who It Affects
              </span>
              <p className="text-xs text-white/80 font-light line-clamp-3">
                {data.whoItAffects}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="block text-[9px] uppercase tracking-[0.18em] text-white/40">
                Action
              </span>
              <p className="text-xs text-white/80 font-light line-clamp-3">
                {data.whatYouNeedToDo}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
          <Link
            href={data.sourceDocUrl || '/compliance'}
            className="inline-flex items-center gap-2 text-sm font-light text-white transition-colors hover:text-emerald-400 group/link"
          >
            View compliance intelligence
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
          
          <span className="text-[11px] font-light text-white/40">
            Effective: {data.whenItMatters}
          </span>
        </div>
      </div>
    </aside>
  );
}
