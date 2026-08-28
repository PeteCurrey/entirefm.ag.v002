'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const LIFECYCLE_STEPS = [
  {
    step: '01',
    name: 'INSPECT',
    tagline: 'High-Resolution Capture',
    description: 'Rapid aerial deployment surveying roofs, façades, plant decks, and estate boundaries without scaffolding, MEWPs, or working-at-height risk.',
  },
  {
    step: '02',
    name: 'IDENTIFY',
    tagline: 'Defect Diagnosis',
    description: 'Specialist surveyor analysis isolating membrane splits, joint failures, thermal heat loss, and drainage blockages into structured RAG observations.',
  },
  {
    step: '03',
    name: 'REPAIR',
    tagline: 'Self-Delivered Trades',
    description: 'Direct dispatch of EntireFM qualified trades: commercial roofers, rope-access technicians, HVAC engineers, and mastic specialists.',
  },
  {
    step: '04',
    name: 'VERIFY',
    tagline: 'Secondary Flight QA',
    description: 'Post-remedial drone flight confirming completed workmanship, correct sealant profiles, and watertight integrity before signoff.',
  },
  {
    step: '05',
    name: 'RECORD',
    tagline: 'EntireCAFM Logbook',
    description: 'Immutable photographic and spatial evidence permanently logged against the building asset register for statutory compliance and insurer audits.',
  },
];

export function DroneCoreProposition() {
  return (
    <section 
      aria-label="Core Engineering Differentiator"
      className="py-24 sm:py-32 bg-white text-slate-900 overflow-hidden border-b border-slate-200"
    >
      <div className="container-custom space-y-20">
        
        {/* Editorial Narrative Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-brand-pink text-xs uppercase tracking-[0.2em] font-semibold">
              <span className="w-6 h-px bg-brand-pink" />
              <span>THE ENTIREFM DIFFERENTIATOR</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-slate-900 leading-[1.1]">
              We don&apos;t just find the problem. <br />
              <span className="font-normal text-slate-950">
                We fix it.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 space-y-4 text-slate-600 text-base sm:text-lg font-light leading-relaxed">
            <p>
              Most drone companies deliver high-resolution imagery and leave the client to work out what to do next.
            </p>
            <p className="text-slate-900 font-normal">
              EntireFM is a commercial facilities and engineering company. We inspect the asset, formulate the remedial scope, mobilise the appropriate trade specialists, execute the repair, and verify the completed work.
            </p>
          </div>
        </div>

        {/* 5-Step Process Timeline - Premium Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-10 pt-12 border-t border-slate-200">
          {LIFECYCLE_STEPS.map((item, idx) => (
            <div key={idx} className="space-y-4 group">
              <div className="flex items-baseline justify-between border-b border-slate-200 pb-3 group-hover:border-brand-pink transition-colors">
                <span className="text-xs font-mono text-slate-400 font-light">
                  {item.step}
                </span>
                <span className="text-sm font-semibold tracking-wider text-slate-900">
                  {item.name}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-brand-pink">
                  {item.tagline}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Real Commercial Estate Context Visual */}
        <div className="relative rounded-sm overflow-hidden bg-slate-900 text-white min-h-[380px] lg:min-h-[440px] flex items-end p-8 sm:p-12">
          <Image
            src="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
            alt="EntireFM commercial building aerial survey and physical maintenance"
            fill
            className="object-cover object-center filter brightness-[0.75] contrast-[1.05]"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-brand-pink font-semibold">
              COMPLETE ASSET STEWARDSHIP
            </span>
            <h3 className="text-2xl sm:text-3xl font-light text-white leading-tight">
              One operational partner from high-level flight to physical boots on the roof.
            </h3>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              No third-party handover delays, no fragmented reporting, and no disputes over remedial scope. We own the full lifecycle from discovery to permanent maintenance record.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
