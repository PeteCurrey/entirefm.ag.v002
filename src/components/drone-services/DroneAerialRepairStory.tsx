'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Wrench } from 'lucide-react';

const STORY_STATES = [
  {
    id: 'discovery',
    number: '01',
    label: 'AERIAL DISCOVERY',
    title: 'Defect Isolated at Altitude',
    description: 'During a planned aerial survey, high-resolution optics isolate a torn single-ply membrane lap joint and water pooling around a rooftop chiller plinth.',
    image: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
    caption: 'High-altitude optical capture isolating split membrane seam without scaffolding.',
    pill: 'High-Res Aerial Scan',
  },
  {
    id: 'remediation',
    number: '02',
    label: 'PHYSICAL REMEDIATION',
    title: 'Specialist Trade Mobilised',
    description: 'EntireFM dispatches our self-delivered commercial roofing and mechanical engineering team directly to the exact spatial coordinate with the correct remedial materials.',
    image: '/images/editorial/entirefm-hvac-refrigerant-check-2000w.webp',
    caption: 'Qualified EntireFM engineers executing physical waterproofing and mechanical plinth remediation.',
    pill: 'Physical Trade Intervention',
  },
  {
    id: 'completion',
    number: '03',
    label: 'VERIFIED COMPLETION',
    title: 'Secondary Flight & CAFM Signoff',
    description: 'A secondary verification flight captures the finished, watertight repair. The before-and-after photographic evidence is signed off and logged in EntireCAFM.',
    image: '/images/editorial/entirefm-hero-headquarters-2560w.webp',
    caption: 'Completed, verified repair permanently archived against the statutory building record.',
    pill: 'Verified Asset Signoff',
  },
];

export function DroneAerialRepairStory() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = STORY_STATES[activeIdx];

  return (
    <section 
      aria-label="Aerial to Physical Repair Story"
      className="py-24 sm:py-32 bg-slate-50 text-slate-900 overflow-hidden border-b border-slate-200"
    >
      <div className="container-custom space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-brand-pink text-xs uppercase tracking-[0.2em] font-semibold">
            <span className="w-6 h-px bg-brand-pink" />
            <span>OPERATIONAL CONTINUITY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-slate-900 leading-[1.1]">
            The flight is only <br />
            <span className="font-normal text-slate-950">
              the beginning.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Data without trade execution is just a report. EntireFM turns aerial findings into physical engineering resolutions without third-party handovers.
          </p>
        </div>

        {/* 3-State Interactive Visual Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Step Navigation */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {STORY_STATES.map((item, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`w-full text-left p-6 rounded-sm transition-all duration-300 border ${
                      isActive
                        ? 'bg-white border-brand-pink shadow-md'
                        : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-medium text-slate-400">
                        STAGE {item.number}
                      </span>
                      <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                        isActive ? 'text-brand-pink' : 'text-slate-500'
                      }`}>
                        {item.pill}
                      </span>
                    </div>

                    <h3 className="text-base font-medium text-slate-900 mb-1">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="p-6 rounded-sm bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-medium text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Single-Source Accountability</span>
              </div>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                From initial flight to physical trade completion, you communicate with one dedicated EntireFM technical account lead.
              </p>
            </div>
          </div>

          {/* Right Large Physical Visual State */}
          <div className="lg:col-span-8 relative min-h-[460px] lg:min-h-[540px] rounded-sm overflow-hidden bg-slate-950 flex flex-col justify-end p-8 sm:p-12 shadow-lg">
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-cover object-center filter brightness-[0.80] contrast-[1.05] transition-all duration-700"
              sizes="(max-width: 1024px) 100vw, 65vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            <div className="relative z-10 max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-mono">
                <span>STAGE {current.number}</span>
                <span className="w-1 h-1 rounded-full bg-brand-pink" />
                <span>{current.label}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-light text-white leading-tight">
                {current.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {current.caption}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
