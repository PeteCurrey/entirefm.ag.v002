'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, HelpCircle, CheckCircle2, MapPin, Layers, Wrench } from 'lucide-react';
import type { FromTheFieldItem } from '@/data/lobby/types';

interface FromTheFieldProps {
  data: FromTheFieldItem;
}

export function FromTheField({ data }: FromTheFieldProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <article className="border border-brand-edge-dark bg-brand-void text-white rounded-sm overflow-hidden shadow-elevated">
      <div className="grid lg:grid-cols-[1.2fr_1fr]">
        {/* Large Visual Photography Plate */}
        <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-full overflow-hidden bg-brand-carbon">
          <Image
            src={data.imageSrc}
            alt={data.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition-transform duration-700 ease-brand hover:scale-105"
            priority={false}
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-void via-transparent to-brand-void/30" />

          {/* Badge over image */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-brand-void/90 text-white text-[11px] font-medium tracking-wide uppercase backdrop-blur-md border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
              FROM THE FIELD · Operational Lesson
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10 p-4 rounded-sm bg-brand-void/85 backdrop-blur-md border border-white/10 text-xs font-light text-brand-mist/90 space-y-1">
            <div className="flex items-center gap-1.5 text-brand-mist/60 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-brand-electric-bright shrink-0" />
              <span>{data.locationContext}</span>
            </div>
            <p className="text-[12px] font-normal text-white">{data.environmentType}</p>
          </div>
        </div>

        {/* Narrative & Inspection Challenge */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-brand-mist/60 font-mono">
              <Layers className="w-3.5 h-3.5 text-brand-electric-bright" />
              <span>CASE ID: {data.id.toUpperCase()}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extralight text-white leading-tight tracking-tight">
              {data.challengeTitle}
            </h3>

            <p className="text-sm sm:text-[15px] font-light text-brand-mist/80 leading-relaxed">
              {data.observation}
            </p>
          </div>

          {/* Interactive Inspection Reveal */}
          <div className="border border-white/10 rounded-sm bg-brand-carbon p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-electric-bright">
                Operational Diagnosis
              </span>
              <button
                type="button"
                onClick={() => setRevealed(!revealed)}
                className="inline-flex items-center gap-1.5 text-xs font-normal px-3 py-1.5 rounded-sm bg-brand-electric/20 text-brand-electric-bright border border-brand-electric/40 hover:bg-brand-electric hover:text-white transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{revealed ? 'Hide Diagnosis' : 'Reveal Defect & Remedy'}</span>
              </button>
            </div>

            {revealed ? (
              <div className="space-y-3 pt-2 animate-rise border-t border-white/[0.08]">
                <div>
                  <span className="text-[10.5px] font-medium uppercase tracking-wider text-amber-400 block mb-1">
                    The Problem:
                  </span>
                  <p className="text-xs sm:text-[13px] font-light text-brand-mist/90 leading-relaxed">
                    {data.lessonLearned}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-[10.5px] font-medium uppercase tracking-wider text-emerald-400 block mb-1">
                    Remedial Closeout:
                  </span>
                  <p className="text-xs sm:text-[13px] font-light text-brand-mist/90 leading-relaxed">
                    {data.remedialAction}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs font-light text-brand-mist/50 italic">
                Click "Reveal Defect & Remedy" to review our engineer’s physical diagnostic findings and remedial action.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
