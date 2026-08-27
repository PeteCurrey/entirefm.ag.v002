'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, MapPin } from 'lucide-react';
import type { FromTheFieldItem } from '@/data/lobby/types';

interface FromTheFieldProps {
  data: FromTheFieldItem;
}

export function FromTheField({ data }: FromTheFieldProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <article className="group relative overflow-hidden rounded-sm bg-[#080C14] text-white">
      <div className="grid lg:grid-cols-[1.35fr_1fr] items-stretch min-h-[520px]">
        {/* Large Visual Photography Plate */}
        <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-full overflow-hidden">
          <Image
            src={data.imageSrc || '/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp'}
            alt={data.imageAlt || 'Commercial plant defect site inspection'}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-all duration-700 ease-out brightness-85 group-hover:brightness-95 group-hover:scale-[1.02]"
            priority={false}
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-transparent to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#080C14]" />

          {/* Badge over image */}
          <div className="absolute top-6 left-6 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-black/70 backdrop-blur-md text-white text-[11px] font-mono tracking-widest uppercase border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              FROM THE FIELD · SITE DIAGNOSTIC
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 z-10 p-4 rounded-sm bg-black/75 backdrop-blur-md border border-white/10 text-xs font-light text-white/90 space-y-1 max-w-md">
            <div className="flex items-center gap-1.5 text-white/60 text-[11px] font-mono">
              <MapPin className="w-3.5 h-3.5 text-brand-electric shrink-0" />
              <span>{data.locationContext}</span>
            </div>
            <p className="text-[12px] font-normal text-white">{data.environmentType}</p>
          </div>
        </div>

        {/* Narrative & Inspection Challenge */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 bg-[#080C14]">
          <div className="space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric block">
              CAN YOU SPOT THE DEFECT?
            </span>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-white leading-tight">
              {data.challengeTitle}
            </h3>

            <p className="text-sm font-light text-white/75 leading-relaxed pt-2">
              {data.observation}
            </p>
          </div>

          {/* Interactive Inspection Reveal */}
          <div className="border-t border-white/10 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                ENGINEERING FINDINGS
              </span>
              <button
                type="button"
                onClick={() => setRevealed(!revealed)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-sm bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{revealed ? 'Hide Diagnosis' : 'Reveal Defect & Remedy'}</span>
              </button>
            </div>

            {revealed ? (
              <div className="space-y-4 pt-3 transition-all duration-500">
                <div className="border-l-2 border-amber-400 pl-3.5 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">
                    Observed Problem
                  </span>
                  <p className="text-xs sm:text-sm font-light text-white/90 leading-relaxed">
                    {data.lessonLearned}
                  </p>
                </div>

                <div className="border-l-2 border-emerald-400 pl-3.5 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">
                    Remedial Closeout
                  </span>
                  <p className="text-xs sm:text-sm font-light text-white/90 leading-relaxed">
                    {data.remedialAction}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs font-light text-white/40 italic">
                Inspect the rooftop condenser isolation configuration above, then reveal our diagnostic team's physical finding.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
