'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, CheckCircle2, RefreshCw } from 'lucide-react';

const SEASONS = [
  {
    season: 'SPRING',
    month: 'April Survey',
    focus: 'Post-Winter Freeze-Thaw Audit',
    deliverable: 'Membrane lap seam expansion checks, valley gutter clearance, and masonry spalling review after seasonal frost cycles.',
    image: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
  },
  {
    season: 'SUMMER',
    month: 'July Survey',
    focus: 'Solar PV & Thermal Stress Check',
    deliverable: 'Radiometric inspection of rooftop solar arrays during peak irradiance and inspection of vegetation growth in high-level parapets.',
    image: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
  },
  {
    season: 'AUTUMN',
    month: 'October Survey',
    focus: 'Pre-Winter Envelope Preparation',
    deliverable: 'Comprehensive gutter silt vacuum audit, rainwater outlet inspection, and building envelope mastic joint weather-tightness verification.',
    image: '/images/editorial/entirefm-hero-headquarters-2560w.webp',
  },
  {
    season: 'WINTER',
    month: 'January Survey',
    focus: 'Cold-Bridge & Insulation Thermography',
    deliverable: 'Sub-zero building envelope thermography identifying heating loss, missing cavity insulation, and mechanical plant thermal efficiency.',
    image: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
  },
];

export function DronePpmSeasons() {
  const [activeSeasonIdx, setActiveSeasonIdx] = useState(0);
  const currentSeason = SEASONS[activeSeasonIdx];

  return (
    <section 
      aria-label="Planned Preventative Maintenance Aerial Cadence"
      className="py-24 sm:py-32 bg-white text-slate-900 overflow-hidden border-b border-slate-200"
    >
      <div className="container-custom space-y-16">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-brand-pink text-xs uppercase tracking-[0.2em] font-semibold">
              <RefreshCw className="h-4 w-4" />
              <span>LONGITUDINAL ASSET MONITORING</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-slate-900 leading-[1.1]">
              One flight is a snapshot. <br />
              <span className="font-normal text-slate-950">
                Repeat flights show change.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 space-y-4 text-slate-600 text-base sm:text-lg font-light leading-relaxed">
            <p>
              By aligning recurring drone surveys with your SFG20 planned preventative maintenance programme, subtle building movements, gradual silt accumulation, and early waterproofing failures are detected years before internal leaks occur.
            </p>
          </div>
        </div>

        {/* 4-Season Editorial Interactive Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-200 pb-4">
          {SEASONS.map((s, idx) => {
            const isSelected = activeSeasonIdx === idx;
            return (
              <button
                key={s.season}
                type="button"
                onClick={() => setActiveSeasonIdx(idx)}
                className={`text-left p-4 rounded-sm transition-all border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className={isSelected ? 'text-brand-pink' : 'text-slate-400'}>{s.season}</span>
                  <span className="text-[10px] opacity-70">{s.month}</span>
                </div>
                <div className="text-sm font-medium leading-snug">
                  {s.focus}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Seasonal Focus Visual Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 p-8 sm:p-12 rounded-sm border border-slate-200">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-brand-pink font-semibold">
                {currentSeason.season} CADENCE · {currentSeason.month.toUpperCase()}
              </span>
              <h3 className="text-2xl sm:text-3xl font-light text-slate-900 leading-tight">
                {currentSeason.focus}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
              {currentSeason.deliverable}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Automatically synchronised with EntireCAFM asset history logbook</span>
            </div>
          </div>

          <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[380px] rounded-sm overflow-hidden bg-slate-950 shadow-md">
            <Image
              src={currentSeason.image}
              alt={currentSeason.focus}
              fill
              className="object-cover object-center filter brightness-[0.85] contrast-[1.05] transition-all duration-500"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
