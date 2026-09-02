'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Cpu, 
  FileCheck, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const HIERARCHY_STEPS = [
  {
    step: '01',
    level: 'PORTFOLIO LEVEL',
    title: 'National Estate Visibility',
    scope: '42 Managed UK Facilities &bull; 3,846 Assets',
    description:
      'National strategic visibility across all managed facilities: aggregate SLA performance (96.2%), statutory compliance posture (98.4%), live operational incidents, and total committed works WIP (£185k).',
    image: '/images/client-portal/entirecafm-dashboard-live.png',
    caption: 'National Portfolio Command View — Aggregate Operational Health',
    keyPoints: [
      'Multi-region portfolio aggregation across corporate, retail, and industrial estates',
      'Real-time SLA health matrix with instant drill-down to regional clusters',
      'Unified statutory compliance reporting across all UK property assets',
    ],
    icon: Building2,
  },
  {
    step: '02',
    level: 'FACILITY LEVEL',
    title: 'Building-Level Operational Control',
    scope: 'Victoria House &bull; London NW1',
    description:
      'Slide out specific property telemetry instantly without losing national portfolio context: 3 open reactive tickets, 2 on-site verified engineers, building access protocols, and SLA countdowns.',
    image: '/images/client-portal/entirecafm-site-drawer.png',
    caption: 'Victoria House Commercial Complex — Quick Inspection Drawer',
    keyPoints: [
      'Single-click facility drawer revealing site-specific risk posture',
      'Live engineer GPS check-in logs and active permit-to-work statuses',
      'Direct contact with dedicated EntireFM Regional Operations Manager',
    ],
    icon: MapPin,
  },
  {
    step: '03',
    level: 'PHYSICAL ENVIRONMENT',
    title: 'Spatial Canvas & Floorplans (Site 360)',
    scope: '8,450 m² GIA &bull; 48 Telemetry Nodes',
    description:
      'High-resolution spatial photography and floorplan overlays showing plantroom zones, tenant floor boundaries, emergency shut-off valves, and live IoT vibration and thermal sensor feeds.',
    image: '/images/client-portal/entirecafm-site-360-workspace.png',
    caption: 'Site 360 Workspace — Physical Asset Canvas & Sensor Telemetry',
    keyPoints: [
      'Interactive spatial plantroom layouts and photographic reality capture',
      '48 live IoT wireless sensor nodes tracking pump vibration and pipe temperatures',
      'Clear zoning for fire compartments, risers, and high-voltage switchrooms',
    ],
    icon: Layers,
  },
  {
    step: '04',
    level: 'PLANTROOM ASSET',
    title: 'Every Maintainable Asset Connected',
    scope: 'Asset ID: CH-01-VH &bull; Daikin Centrifugal Chiller',
    description:
      'Every chiller, boiler, pump, AHU, and distribution board holds a complete digital birth certificate: manufacturer specs, serial numbers, warranty terms, historical maintenance ledgers, and live telemetry curves.',
    image: '/images/client-portal/entirecafm-site-360-workspace.png',
    caption: 'Asset Ledger: Complete maintenance history, parts provenance, and warranty data',
    keyPoints: [
      'Empirical asset run-hours, failure frequency, and lifecycle condition scores',
      'Direct link to manufacturer OEM warranty terms and genuine parts catalog',
      'Complete chronological service history since initial building commissioning',
    ],
    icon: Cpu,
  },
  {
    step: '05',
    level: 'ACTION & GOVERNANCE',
    title: 'PPM Autopilot, Work Orders & Evidence',
    scope: 'SFG20 Statutory Compliance &bull; Milestone Sign-Off',
    description:
      'Autonomous SFG20 maintenance scheduling, reactive work order dispatch, dynamic risk assessments, before/after photographic proof, and immutable statutory compliance certificate deposits.',
    image: '/images/client-portal/entirecafm-ppm-autopilot.png',
    caption: 'PPM Autopilot Desk — SFG20 Statutory Orchestration & Sign-Off',
    keyPoints: [
      'Automated SFG20 task generation and mobile engineer dispatch',
      'Point-of-work before/after photos and digital customer signature',
      'Instant deposit of verified EICR, Gas CP12, and water logbook certificates',
    ],
    icon: FileCheck,
  },
];

export function InformationHierarchySequence() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = HIERARCHY_STEPS[activeStepIndex];
  const StepIcon = activeStep.icon;

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="eyebrow eyebrow-light">THE PHYSICAL HIERARCHY</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
            From National Estate to Plantroom Asset
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Transition directly between high-level portfolio governance and individual physical plantroom components without switching systems or losing operational context.
          </p>
        </div>

        {/* 5-Step Horizontal Hierarchy Rail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {HIERARCHY_STEPS.map((step, idx) => {
            const isSelected = idx === activeStepIndex;
            const Icon = step.icon;
            return (
              <button
                key={step.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`text-left rounded-sm border p-5 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-pink bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-[#FAF9FB] text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-normal uppercase tracking-wider ${
                      isSelected ? 'text-brand-pink' : 'text-slate-400'
                    }`}
                  >
                    LEVEL {step.step}
                  </span>
                  <div
                    className={`p-1.5 rounded-xs ${
                      isSelected ? 'bg-brand-pink text-white' : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-light leading-snug line-clamp-1 mb-1">
                    {step.title}
                  </h3>
                  <span
                    className={`text-[11px] font-light truncate block ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {step.level}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Hierarchy Detail Deck */}
        <div className="rounded-sm border border-slate-200 bg-[#FAF9FB] p-8 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Explanatory Context */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-sm bg-slate-900 text-brand-pink flex items-center justify-center">
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <span className="text-[10.5px] font-normal uppercase tracking-wider text-brand-pink font-semibold">
                    {activeStep.level}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
                  {activeStep.title}
                </h3>
                <div
                  className="text-xs text-slate-500 font-light"
                  dangerouslySetInnerHTML={{ __html: activeStep.scope }}
                />
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-light leading-relaxed">
                {activeStep.description}
              </p>

              {/* Key Capabilities */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block">
                  OPERATIONAL CAPABILITIES
                </span>
                <ul className="space-y-2">
                  {activeStep.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-[12.5px] text-slate-700 font-light">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step Navigation Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="rounded-sm border border-slate-200 bg-white px-3.5 py-2 text-xs font-light text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  &larr; Previous Level
                </button>
                <button
                  disabled={activeStepIndex === HIERARCHY_STEPS.length - 1}
                  onClick={() =>
                    setActiveStepIndex((prev) =>
                      Math.min(HIERARCHY_STEPS.length - 1, prev + 1)
                    )
                  }
                  className="btn-primary text-xs py-2 px-4 disabled:opacity-40 disabled:pointer-events-none"
                >
                  Next Level &rarr;
                </button>
              </div>
            </div>

            {/* Right: High-Res Real Screenshot Presentation */}
            <div className="lg:col-span-7 space-y-2">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-slate-200 bg-slate-900 shadow-md">
                <Image
                  src={activeStep.image}
                  alt={activeStep.caption}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-top"
                />
              </div>
              <p className="text-[11.5px] text-slate-500 font-light italic text-right">
                {activeStep.caption}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
