'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Clock, Bookmark, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { LeadBriefing as LeadBriefingType } from '@/data/lobby/types';

interface LeadBriefingProps {
  data: LeadBriefingType;
}

export function LeadBriefing({ data }: LeadBriefingProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="border border-brand-edge bg-white rounded-sm p-6 sm:p-8 lg:p-10 shadow-subtle hover:border-brand-electric/40 transition-all duration-300">
      {/* Editorial Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-edge pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-brand-electric/10 text-brand-electric text-[11px] font-medium tracking-wide uppercase">
            {data.franchise}
          </span>
          <span className="text-xs text-brand-silver font-light">· {data.publishedAt}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-brand-silver font-light">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {data.readingTime}
          </span>
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            className="inline-flex items-center gap-1 text-brand-slate hover:text-brand-electric transition-colors"
            aria-label={saved ? 'Remove bookmark' : 'Save briefing'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-brand-electric text-brand-electric' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Headline & Standfirst */}
      <div className="space-y-4">
        <h3 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-extralight text-brand-graphite leading-[1.12] tracking-tight">
          {data.title}
        </h3>

        <p className="text-base sm:text-lg font-light text-brand-slate leading-relaxed text-pretty">
          {data.standfirst}
        </p>
      </div>

      {/* Key Analysis / Takeaways Box */}
      <div className="my-8 rounded-sm bg-brand-surface border-l-2 border-brand-electric p-5 sm:p-6 space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-brand-slate">
          Key Operational Directives:
        </p>
        <ul className="space-y-2.5">
          {data.keyTakeaways.map((takeaway, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm font-light text-brand-graphite leading-snug">
              <CheckCircle2 className="w-4 h-4 text-brand-electric shrink-0 mt-0.5" />
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-brand-edge">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-brand-graphite text-white flex items-center justify-center text-xs font-light">
            EFM
          </div>
          <div>
            <p className="text-xs font-normal text-brand-graphite">{data.author.name}</p>
            <p className="text-[11px] font-light text-brand-silver">{data.author.role}</p>
          </div>
        </div>

        <Link
          href={data.fullBriefingUrl || '/compliance'}
          className="btn-primary text-xs sm:text-sm py-2.5 px-5"
        >
          Read the full briefing
          <ArrowRight className="w-4 h-4 btn-arrow" />
        </Link>
      </div>
    </div>
  );
}
