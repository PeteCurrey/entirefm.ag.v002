import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { EngineersNoteItem } from '@/data/lobby/types';

interface EngineersNoteProps {
  data: EngineersNoteItem;
}

export function EngineersNote({ data }: EngineersNoteProps) {
  // Extract initials safely
  const initials = data.author.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <section className="relative overflow-hidden min-h-[520px] bg-[#0a0a0a] rounded-sm group flex flex-col lg:flex-row">
      {/* LEFT HALF - Image */}
      <div className="relative w-full lg:w-[60%] min-h-[300px] lg:min-h-[520px]">
        <Image
          src="/images/editorial/entirefm-hvac-plantroom-pumps-1200w.webp"
          alt="Engineer Note Background"
          fill
          className="object-cover opacity-75 group-hover:opacity-90 transition-opacity duration-700 ease-out"
        />
        {/* Gradient fade to dark for text legibility and blending */}
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 lg:via-transparent to-transparent lg:to-transparent lg:from-transparent lg:via-transparent lg:to-[#0a0a0a]" />
      </div>

      {/* RIGHT HALF - Content */}
      <div className="relative w-full lg:w-[40%] bg-[#0a0a0a] p-8 lg:p-12 flex flex-col justify-center z-10">
        <div className="mb-6 space-y-2">
          <span className="text-[9px] uppercase tracking-widest text-brand-electric block">
            {data.discipline}
          </span>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
            The Engineer's Note
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extralight text-white leading-snug">
            {data.title}
          </h3>
        </div>

        <p className="text-sm font-light text-white/70 line-clamp-3 mb-8">
          {data.leadParagraph}
        </p>

        {/* Practical Field Rule Box */}
        <div className="font-mono text-[11px] text-brand-electric border-l-2 border-brand-electric pl-4 my-6 leading-relaxed">
          {data.fieldRule}
        </div>

        <div className="mt-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-sm bg-brand-electric/10 text-brand-electric flex items-center justify-center text-xs font-mono">
              {initials}
            </div>
            <div>
              <p className="text-xs font-medium text-white">{data.author.name}</p>
              <p className="text-[10px] font-light text-white/50">{data.author.credentials}</p>
            </div>
          </div>

          <Link
            href="/mechanical-electrical"
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors group/link"
          >
            <span>Read the full Note &rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
