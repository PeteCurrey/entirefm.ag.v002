import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Wrench } from 'lucide-react';
import type { EngineersNoteItem } from '@/data/lobby/types';

interface EngineersNoteProps {
  data: EngineersNoteItem;
}

export function EngineersNote({ data }: EngineersNoteProps) {
  return (
    <article className="relative overflow-hidden min-h-[500px] lg:min-h-[540px] bg-[#090C12] rounded-sm group flex flex-col lg:flex-row border border-white/5">
      {/* 65% Cinematic Technical Plant Subject */}
      <div className="relative w-full lg:w-[65%] min-h-[320px] lg:min-h-[540px] overflow-hidden">
        <Image
          src="/images/editorial/entirefm-hvac-plantroom-pumps-1200w.webp"
          alt={data.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
        {/* Soft edge blend to dark right panel */}
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-transparent to-[#090C12]" />

        <div className="absolute top-6 left-6 z-10">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10">
            THE ENGINEER’S NOTE · {data.discipline}
          </span>
        </div>
      </div>

      {/* 35% Editorial Reading Column */}
      <div className="relative w-full lg:w-[35%] bg-[#090C12] p-8 sm:p-10 lg:p-12 flex flex-col justify-between z-10 space-y-6">
        <div className="space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-brand-electric block">
            MECHANICAL DIAGNOSTIC
          </span>

          <h3 className="text-2xl sm:text-3xl font-extralight text-white leading-snug">
            {data.title}
          </h3>

          <p className="text-sm font-light text-white/75 leading-relaxed">
            {data.leadParagraph}
          </p>
        </div>

        {/* Practical Field Rule Callout */}
        <div className="border-l-2 border-brand-electric pl-4 py-1 space-y-1 bg-white/[0.02]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric block">
            Field Rule of Thumb
          </span>
          <p className="text-xs sm:text-sm font-light text-white/90 leading-relaxed italic">
            {data.fieldRule}
          </p>
        </div>

        {/* Author attribution & CTA */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-normal text-white">{data.author.name}</p>
            <p className="text-[11px] font-light text-white/50">{data.author.credentials}</p>
          </div>

          <Link
            href="/mechanical-electrical"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-electric hover:text-white transition-colors uppercase tracking-wider group/link"
          >
            <span>Full Note</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
