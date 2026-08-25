'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  Search, 
  ListFilter, 
  Wrench, 
  CheckCircle2, 
  Database,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ProcessStep {
  number: string;
  title: string;
  tagline: string;
  icon: React.ElementType;
  description: string;
  technicalOutputs: string[];
  fmAction: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Inspect',
    tagline: 'Safe, low-impact aerial capture',
    icon: Camera,
    description: 'Specialist commercial inspection UAVs capture inaccessible high-level assets, fragile roofscapes, and vertical facades safely without scaffolding, MEWPs, or road closures.',
    technicalOutputs: ['Ultra-high-res 48MP/8K optical imagery', 'Radiometric thermal datasets (FLIR)', 'Georeferenced GPS & RTK positioning'],
    fmAction: 'Eliminates upfront access equipment costs and eliminates working-at-height risk during initial assessment.',
  },
  {
    number: '02',
    title: 'Identify',
    tagline: 'Defect detection & diagnostic isolation',
    icon: Search,
    description: 'Technical FM surveyors and thermographers analyze the imagery, isolating defects, surface cracks, moisture entrapment, perished seals, and plant anomalies.',
    technicalOutputs: ['Pixel-level anomaly identification', 'Delta-T radiometric thermal profiling', 'High-resolution defect coordinate mapping'],
    fmAction: 'Pins every defect to an exact asset elevation, floor level, or roof bay coordinate.',
  },
  {
    number: '03',
    title: 'Prioritise',
    tagline: 'Structured RAG risk grading',
    icon: ListFilter,
    description: 'Observations are categorized into structured maintenance priorities based on water-ingress risk, life-safety implications, and building fabric urgency.',
    technicalOutputs: ['Priority 1 (Immediate / Make-Safe)', 'Priority 2 (Scheduled PPM Remedial)', 'Priority 3 (Advisory / CapEx Plan)'],
    fmAction: 'Prevents minor observations from escalating into catastrophic internal leaks or structural failures.',
  },
  {
    number: '04',
    title: 'Remediate',
    tagline: 'Direct self-delivered trade execution',
    icon: Wrench,
    description: 'EntireFM coordinates and executes the required remedial work through our self-delivered engineering, roofing, rope access, and BMU maintenance teams.',
    technicalOutputs: ['Targeted rope access / cradle deployment', 'Mastic joint & flashing repair', 'M&E plant, gutter & cladding maintenance'],
    fmAction: 'No disconnect between survey findings and physical contractor procurement—one accountable provider.',
  },
  {
    number: '05',
    title: 'Verify',
    tagline: 'Post-work photographic signoff',
    icon: CheckCircle2,
    description: 'Following remedial works, follow-up photographic evidence or secondary flight verification confirms that defects have been resolved to engineering standards.',
    technicalOutputs: ['Before & after comparison evidence', 'Technician engineering signoff sheets', 'Statutory compliance verification'],
    fmAction: 'Guarantees proof of completion for managing agents, landlords, and insurance underwriters.',
  },
  {
    number: '06',
    title: 'Record',
    tagline: 'Auditable digital asset history',
    icon: Database,
    description: 'Inspection data, defect coordinates, and completion records are catalogued against the property register in EntireCAFM for longitudinal asset health tracking.',
    technicalOutputs: ['Timestamped digital asset logbook', 'Multi-year condition trend benchmarking', 'Audit-ready compliance export'],
    fmAction: 'Transforms one-off aerial photos into persistent capital planning and building lifecycle intelligence.',
  },
];

export function DroneProcessFlow() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const current = PROCESS_STEPS[activeStep];
  const CurrentIcon = current.icon;

  return (
    <section className="py-24 bg-[#0B1220] text-white relative overflow-hidden border-b border-brand-edge-dark">
      {/* Background Architectural Grid Accent */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="container-custom relative z-10 space-y-14">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15">
            <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-white font-semibold">
              THE COMMERCIAL PROPOSITION
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
            From aerial intelligence <br />
            <span className="font-bold text-hero-pink">
              to completed maintenance
            </span>
          </h2>

          <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
            EntireFM does not simply fly drones and hand over disconnected photos. We operate an end-to-end engineering workflow that turns aerial data into verified physical remediation.
          </p>
        </div>

        {/* Desktop Horizontal Step Navigation */}
        <div className="hidden lg:grid grid-cols-6 gap-3 pt-2">
          {PROCESS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`text-left p-5 rounded-sm border transition-all duration-300 relative group flex flex-col justify-between min-h-[140px] ${
                  isSelected
                    ? 'bg-white/10 border-brand-pink shadow-glow-sm'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]'
                }`}
              >
                {/* Active Indicator Top Line */}
                <div 
                  className={`absolute top-0 left-0 right-0 h-1 rounded-t-sm transition-colors ${
                    isSelected ? 'bg-gradient-to-r from-brand-pink to-brand-magenta' : 'bg-transparent'
                  }`} 
                />

                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold ${isSelected ? 'text-brand-pink' : 'text-slate-400'}`}>
                    STEP {step.number}
                  </span>
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-brand-pink' : 'text-slate-500 group-hover:text-slate-300'}`} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-brand-pink-light transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[11.5px] text-slate-400 mt-1 line-clamp-1">
                    {step.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Showcase (Desktop) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 p-8 rounded-sm bg-brand-carbon border border-brand-edge-dark shadow-elevated relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Description & Strategy */}
          <div className="col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-sm bg-brand-pink/15 border border-brand-pink/30 flex items-center justify-center text-brand-pink">
                <CurrentIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-xs text-brand-pink font-bold uppercase tracking-wider block">
                  STAGE {current.number} OF 06
                </span>
                <h3 className="text-2xl font-bold text-white">
                  {current.title} — {current.tagline}
                </h3>
              </div>
            </div>

            <p className="text-base text-slate-300 leading-relaxed">
              {current.description}
            </p>

            <div className="p-4 rounded-sm bg-brand-graphite border border-brand-edge-dark">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-brand-electric-bright shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                    EntireFM Operational Advantage
                  </span>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {current.fmAction}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Technical Deliverable Items */}
          <div className="col-span-5 flex flex-col justify-between border-l border-brand-edge-dark pl-8">
            <div className="space-y-4">
              <span className="eyebrow eyebrow-dark block">Key Technical Deliverables</span>
              <ul className="space-y-3">
                {current.technicalOutputs.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-pink mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-brand-edge-dark flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">
                Cycle: Inspect → Remediate → Record
              </span>
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev + 1) % PROCESS_STEPS.length)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-pink hover:text-brand-pink-light transition-colors"
              >
                <span>Next Stage</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Vertical Sequence */}
        <div className="grid grid-cols-1 gap-6 lg:hidden">
          {PROCESS_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="p-6 rounded-sm bg-brand-carbon border border-brand-edge-dark space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-brand-pink/15 border border-brand-pink/30 flex items-center justify-center text-brand-pink shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-brand-pink block">
                      STAGE {step.number}
                    </span>
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>

                <div className="pt-3 border-t border-brand-edge-dark space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    Technical Outputs:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {step.technicalOutputs.map((out, oIdx) => (
                      <li key={oIdx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-pink mt-1.5 shrink-0" />
                        <span>{out}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
