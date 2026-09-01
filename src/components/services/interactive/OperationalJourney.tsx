'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ClipboardCheck, 
  Layers, 
  Wrench, 
  FileCheck2, 
  TrendingUp,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface JourneyStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  imageSrc: string;
  imageAlt: string;
}

const STEPS: JourneyStep[] = [
  {
    number: '01',
    title: 'Survey & Audit',
    subtitle: 'Estate Discovery & Asset Tagging',
    description: 'Our senior engineering assessors conduct a forensic on-site condition audit. We barcode-tag maintainable plant, record serial numbers, map circuit distribution, and identify historic compliance deficits.',
    deliverables: [
      'Barcoded physical asset tagging',
      'Make, model, serial & condition logging',
      'Statutory compliance gap analysis',
    ],
    imageSrc: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
    imageAlt: 'EntireFM engineer conducting physical asset audit and barcoding in commercial plant room',
  },
  {
    number: '02',
    title: 'Build & Mobilise',
    subtitle: '52-Week PPM & CAFM Onboarding',
    description: 'We construct an SFG20-aligned maintenance matrix tailored to your operating hours. Every maintainable asset is uploaded to EntireCAFM with statutory test intervals, risk assessments, and assigned technician skill sets.',
    deliverables: [
      'SFG20-aligned 52-week maintenance calendar',
      'EntireCAFM client portal configuration',
      'Agreed site priority SLAs (2hr / 4hr / Next-Day)',
    ],
    imageSrc: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
    imageAlt: 'EntireFM mobilising planned preventative maintenance schedule for commercial building',
  },
  {
    number: '03',
    title: 'Maintain & Protect',
    subtitle: 'Direct Engineering & Reactive Cover',
    description: 'Scheduled maintenance tasks are executed by certified mobile engineers. When unforeseen faults arise, our 24/7 central desk dispatches multi-skilled technicians with verified site asset histories.',
    deliverables: [
      'Multi-skilled mobile engineering visits',
      '24/7 UK helpdesk priority emergency dispatch',
      'First-time fix van stocks & rapid parts supply',
    ],
    imageSrc: '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
    imageAlt: 'EntireFM mobile engineers carrying out preventative servicing on commercial rooftop plant',
  },
  {
    number: '04',
    title: 'Evidence & Archive',
    subtitle: 'Digital Compliance Certification',
    description: 'Engineers submit electronic worksheets and calibration test sheets directly from site. Certificates (EICR, Gas Safety, F-Gas, Legionella) are archived against the asset record in EntireCAFM within 24 hours.',
    deliverables: [
      'Real-time job sheets & date-stamped photo proof',
      'Instant digital statutory certificate repository',
      'Insurer and landlord audit-ready exports',
    ],
    imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
    imageAlt: 'Digital compliance certificates and asset records reviewed in client portal',
  },
  {
    number: '05',
    title: 'Optimise & Advise',
    subtitle: 'Lifecycle Data & Capital Planning',
    description: 'We aggregate service history and breakdown frequency to advise property directors on plant end-of-life replacement, energy reduction, and forward capital expenditure (CapEx) forecasting.',
    deliverables: [
      'Monthly RICS-aligned SLA & spend reporting',
      'Asset lifecycle degradation tracking',
      'Proactive CapEx forward budget recommendations',
    ],
    imageSrc: '/images/editorial/entirefm-headquarters-exterior-2000w.webp',
    imageAlt: 'EntireFM operations review meeting delivering commercial asset lifecycle insights',
  },
];

export function OperationalJourney() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = STEPS[activeStepIndex];

  return (
    <section id="operational-journey" className="relative bg-[#FAF9FB] border-b border-slate-200 py-20 sm:py-28">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
              FROM ASSET TO ACTION
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 leading-[1.15]">
            How EntireFM delivers facilities management
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Our structured 5-stage operating methodology converts raw physical assets into disciplined planned maintenance, verified compliance, and lower lifetime operating costs.
          </p>
        </div>

        {/* Step Progression Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-10">
          {STEPS.map((step, idx) => {
            const isSelected = idx === activeStepIndex;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStepIndex(idx)}
                className={`text-left p-4 rounded-sm border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-brand-pink shadow-md text-slate-900'
                    : 'bg-white/60 border-slate-200 text-slate-500 hover:bg-white hover:text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-normal text-xs${isSelected ? 'text-brand-pink font-semibold' : 'text-slate-400'}`}>
                    {step.number}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />}
                </div>
                <div className="text-sm font-medium tracking-tight truncate">
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase Panel */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left / Editorial Step Content */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-normal text-brand-pink mb-2">
                  <span>STAGE {activeStep.number}</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-500 uppercase">{activeStep.subtitle}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-light text-slate-900">
                  {activeStep.title}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                {activeStep.description}
              </p>

              {/* Step Deliverables */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <span className="text-xs uppercase tracking-wider text-slate-400 block font-light">
                  Standard Operational Deliverables:
                </span>
                <div className="space-y-2">
                  {activeStep.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-normal">
                      <CheckCircle2 className="w-4 h-4 text-brand-pink shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => setActiveStepIndex((prev) => (prev + 1) % STEPS.length)}
                  className="btn-outline text-xs py-2.5 px-4"
                >
                  <span>Next Stage ({STEPS[(activeStepIndex + 1) % STEPS.length].title})</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>

            {/* Right / Photographic Panel */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-slate-200 shadow-sm group">
                <Image
                  key={activeStep.imageSrc}
                  src={activeStep.imageSrc}
                  alt={activeStep.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs font-medium uppercase tracking-wider text-brand-pink-light">
                    {activeStep.subtitle}
                  </span>
                  <span className="text-xl font-normal text-white/40">
                    {activeStep.number}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
