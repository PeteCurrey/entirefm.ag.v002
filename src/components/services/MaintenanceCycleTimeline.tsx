'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { QrCode, ShieldAlert, CalendarCheck2, Wrench, FileCheck, Layers, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';

interface CycleStage {
  step: string;
  name: string;
  headline: string;
  summary: string;
  deliverables: string[];
  icon: typeof QrCode;
  imageSrc: string;
  imageAlt: string;
}

const CYCLE_STAGES: CycleStage[] = [
  {
    step: '01',
    name: 'Asset Audit & QR Tagging',
    headline: 'Physical Asset Discovery & Barcode Cataloguing',
    summary: 'Every mechanical, electrical, and public health asset is physically audited on site, assigned a unique digital QR/barcode tag, and indexed by manufacturer, serial number, age, location, and condition.',
    deliverables: ['Live Digital Asset Condition Register', 'QR Code Asset Identity Badges', 'Baseline Degradation Assessment'],
    icon: QrCode,
    imageSrc: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
    imageAlt: 'EntireFM engineer conducting asset survey and digital tagging',
  },
  {
    step: '02',
    name: 'Criticality & Risk Scoring',
    headline: 'SFG20 Standardisation & Priority Weighting',
    summary: 'Assets are mapped against industry SFG20 maintenance standards and assigned criticality ratings based on business impact, tenant safety, and statutory obligations.',
    deliverables: ['SFG20 Task Specification Matrix', 'Asset Criticality Hierarchy (P1-P4)', 'Statutory Compliance Baseline Review'],
    icon: ShieldAlert,
    imageSrc: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
    imageAlt: 'EntireFM engineers surveying critical plant equipment risk',
  },
  {
    step: '03',
    name: 'PPM Schedule Generation',
    headline: 'Strategic Preventative Calendar Orchestration',
    summary: 'Creation of a balanced annual PPM calendar specifying exact monthly, quarterly, semi-annual, and annual service routines designed to prevent equipment failure and avoid operational clashes.',
    deliverables: ['52-Week Master Maintenance Schedule', 'Statutory Due-Date Milestone Tracker', 'Mobilisation Resource Plan'],
    icon: CalendarCheck2,
    imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
    imageAlt: 'EntireFM contract manager reviewing planned maintenance schedules',
  },
  {
    step: '04',
    name: 'Engineering Execution',
    headline: 'Scheduled Multi-Skilled Technician Visits',
    summary: 'Directly employed mobile engineers execute planned task lists, carrying out physical inspections, filter swaps, lubrication, thermal surveys, and statutory safety tests.',
    deliverables: ['On-Site Engineering Execution', 'Digital Timesheets & Job Completion Notes', 'Real-Time CAFM Work Order Updates'],
    icon: Wrench,
    imageSrc: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
    imageAlt: 'EntireFM engineer performing on-site planned maintenance testing',
  },
  {
    step: '05',
    name: 'Remedial Defect Rectification',
    headline: 'Proactive Fault Triage & First-Time Fix Focus',
    summary: 'Minor defects identified during routine inspections are quoted and repaired proactively before escalating into catastrophic equipment breakdowns.',
    deliverables: ['Early-Warning Defect Notifications', 'Transparent Remedial Quotations', 'Fast-Track Contractor Parts Dispatch'],
    icon: Layers,
    imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    imageAlt: 'EntireFM engineer conducting remedial switchboard repairs',
  },
  {
    step: '06',
    name: 'Compliance Archival',
    headline: 'Digital Logbooks & Audit-Ready Certification',
    summary: 'All test certificates, gas safety records, EICR reports, and inspection sign-offs are archived directly into the EntireCAFM portal, accessible for statutory building audits 24/7.',
    deliverables: ['Real-Time Statutory Compliance Dashboard', 'Searchable Digital Certificate Archive', 'Insurance & HSE Audit Readiness'],
    icon: FileCheck,
    imageSrc: '/images/editorial/entirefm-hero-headquarters-2560w.webp',
    imageAlt: 'EntireFM central operations and CAFM compliance logging desk',
  },
  {
    step: '07',
    name: 'Lifecycle Capital Planning',
    headline: 'Forward-Looking Asset Replacement Advisory',
    summary: 'Annual condition scoring and lifecycle degradation analytics highlight equipment nearing end-of-life, enabling facilities managers to budget capital expenditure with confidence.',
    deliverables: ['Forward 3-to-5 Year CapEx Replacement Forecasts', 'Total Cost of Ownership (TCO) Analysis', 'Energy Efficiency Upgrade Recommendations'],
    icon: TrendingUp,
    imageSrc: '/images/editorial/entirefm-headquarters-exterior-2000w.webp',
    imageAlt: 'EntireFM commercial operations and strategic estate planning facility',
  },
];

export function MaintenanceCycleTimeline() {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const activeStage = CYCLE_STAGES[activeStageIndex];

  return (
    <section className="py-20 sm:py-28 bg-brand-graphite text-white relative overflow-hidden border-b border-brand-edge-dark">
      <div
        aria-hidden="true"
        className="facet-rule pointer-events-none absolute inset-0 opacity-25"
      />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink-light">
              PPM LIFECYCLE METHODOLOGY
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
            The 7-Stage Planned Maintenance Cycle
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            From initial asset barcode audits and SFG20 scheduling to digital compliance logbooks and capital lifecycle planning — how EntireFM protects your estate.
          </p>
        </div>

        {/* Timeline Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-8">
          {CYCLE_STAGES.map((stg, idx) => {
            const isActive = idx === activeStageIndex;
            return (
              <button
                key={stg.step}
                type="button"
                onClick={() => setActiveStageIndex(idx)}
                className={`p-3.5 rounded-sm border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-carbon border-brand-pink text-white shadow-glow'
                    : 'bg-brand-graphite/80 border-brand-edge-dark text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-mono font-medium ${
                      isActive ? 'text-brand-pink' : 'text-slate-500'
                    }`}
                  >
                    {stg.step}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? 'bg-brand-pink animate-ping' : 'bg-transparent'
                    }`}
                  />
                </div>
                <strong className="text-xs font-normal block leading-snug line-clamp-2">
                  {stg.name}
                </strong>
              </button>
            );
          })}
        </div>

        {/* Active Stage Feature Card */}
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-sm overflow-hidden shadow-elevated grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Image */}
          <div className="lg:col-span-6 relative h-72 sm:h-96 lg:h-auto min-h-[22rem]">
            <Image
              src={activeStage.imageSrc}
              alt={activeStage.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-carbon via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-brand-carbon/60" />
            <div className="absolute top-4 left-4 bg-brand-graphite/90 text-brand-pink-light border border-brand-edge-dark px-3 py-1 text-xs font-mono font-normal rounded-sm backdrop-blur-md">
              STAGE {activeStage.step}: {activeStage.name}
            </div>
          </div>

          {/* Right Column: Stage Description & Deliverables */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <span className="text-xs font-normal uppercase tracking-wider text-brand-pink block mb-2">
                STRUCTURED MAINTENANCE GOVERNANCE
              </span>
              <h3 className="text-2xl sm:text-3xl font-light text-white mb-3">
                {activeStage.headline}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
                {activeStage.summary}
              </p>

              <div className="space-y-2.5 pt-4 border-t border-brand-edge-dark">
                <span className="text-xs font-normal text-slate-400 uppercase tracking-wider block mb-2">
                  Key Operational Deliverables
                </span>
                {activeStage.deliverables.map((del, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-brand-edge-dark flex items-center justify-between text-xs text-slate-400">
              <span>Standard: SFG20 Aligned</span>
              <button
                type="button"
                onClick={() => setActiveStageIndex((activeStageIndex + 1) % CYCLE_STAGES.length)}
                className="text-brand-pink hover:text-brand-pink-light font-light inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Stage ({CYCLE_STAGES[(activeStageIndex + 1) % CYCLE_STAGES.length].name})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
