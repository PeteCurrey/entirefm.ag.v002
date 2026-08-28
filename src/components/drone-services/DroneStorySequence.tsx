'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Camera, 
  Search, 
  ListFilter, 
  Wrench, 
  CheckCircle2, 
  Database,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface StoryStage {
  id: string;
  stepNumber: string;
  title: string;
  shortLabel: string;
  tagline: string;
  stateDescription: string;
  badge: string;
  icon: React.ElementType;
  hudTelemetry: {
    label: string;
    value: string;
  }[];
  highlightOverlay: {
    markerX: number; // percentage
    markerY: number; // percentage
    label: string;
    priority?: 'P1' | 'P2' | 'P3';
    statusText: string;
    trade?: string;
  };
  remedialFact: string;
}

const STORY_STAGES: StoryStage[] = [
  {
    id: 'capture',
    stepNumber: '01',
    title: 'Drone Capture',
    shortLabel: 'Capture',
    tagline: 'Safe, ultra-high-resolution aerial baseline',
    stateDescription: 'Specialist UAV conducts autonomous grid flight over building envelope and roof scape without scaffolding, cranes or road closures.',
    badge: 'STAGE 01 · DATA CAPTURE',
    icon: Camera,
    hudTelemetry: [
      { label: 'OPTICAL SENSOR', value: '48MP RGB / GSD 0.42cm' },
      { label: 'POSITIONING', value: 'RTK Sub-Centimetre Fixed' },
      { label: 'FLIGHT PATTERN', value: 'Automated Photogrammetric Grid' },
      { label: 'INITIAL ACCESS RISK', value: 'Zero Scaffolding / Zero Height Risk' },
    ],
    highlightOverlay: {
      markerX: 48,
      markerY: 38,
      label: 'Survey Grid: Roof Zone B',
      statusText: 'Raw High-Resolution Capture Complete',
    },
    remedialFact: 'Replaces costly scaffolding and MEWP hire for initial structural audits.',
  },
  {
    id: 'identify',
    stepNumber: '02',
    title: 'Defect Identified',
    shortLabel: 'Identify',
    tagline: 'Precision diagnostic anomaly isolation',
    stateDescription: 'FM surveyors and thermographers isolate membrane tears, valley silt accumulation, thermal bridges, and perished facade seals.',
    badge: 'STAGE 02 · DIAGNOSTIC TRIAGE',
    icon: Search,
    hudTelemetry: [
      { label: 'DEFECT TYPE', value: 'Membrane Delamination & Lap Separation' },
      { label: 'ESTIMATED AREA', value: '2.4 Metres Seam Length' },
      { label: 'LOCATION GRID', value: 'Grid B-4 / North Upstand Flashing' },
      { label: 'EVIDENCE', value: '48MP Optical + FLIR Delta-T (+4.8°C)' },
    ],
    highlightOverlay: {
      markerX: 48,
      markerY: 38,
      label: 'Anomaly DEF-2026-084 Detected',
      priority: 'P1',
      statusText: 'Active Waterproofing Seam Failure',
    },
    remedialFact: 'Every observation is georeferenced to an exact architectural coordinate.',
  },
  {
    id: 'prioritise',
    stepNumber: '03',
    title: 'Prioritised',
    shortLabel: 'Prioritise',
    tagline: 'Structured RAG risk grading',
    stateDescription: 'Anomalies receive definitive risk scoring based on internal leak risk, structural severity, and capital replacement urgency.',
    badge: 'STAGE 03 · RAG RISK GRADING',
    icon: ListFilter,
    hudTelemetry: [
      { label: 'SEVERITY RATING', value: 'Priority 1 (High Leak Urgency)' },
      { label: 'INGRESS RISK', value: 'Imminent (Direct Chiller Plant Bay)' },
      { label: 'SLA TARGET', value: 'Remediation within 48 Hours' },
      { label: 'COST MITIGATION', value: 'Prevents Internal Ceiling Collapse' },
    ],
    highlightOverlay: {
      markerX: 48,
      markerY: 38,
      label: 'PRIORITY 1: IMMEDIATE ACTION',
      priority: 'P1',
      statusText: 'RAG Red · Urgent Work Order Scheduled',
    },
    remedialFact: 'Eliminates guesswork: property managers know exactly what to fix first.',
  },
  {
    id: 'remediate',
    stepNumber: '04',
    title: 'Physical Remediation',
    shortLabel: 'Remediate',
    tagline: 'Self-delivered trade execution',
    stateDescription: 'EntireFM dispatches in-house roofing technicians or IRATA rope access engineers to execute targeted hot-air weld repairs.',
    badge: 'STAGE 04 · TRADE DEPLOYMENT',
    icon: Wrench,
    hudTelemetry: [
      { label: 'TRADE DISPATCHED', value: 'Specialist Roofing / Rope Access' },
      { label: 'WORK ORDER NO.', value: 'WO-2026-9142 (EntireFM Hard Services)' },
      { label: 'MATERIALS', value: 'Sarnafil EPDM Membrane + PU Sealant' },
      { label: 'ACCESS METHOD', value: 'Targeted Harness / Zero Scaffolding' },
    ],
    highlightOverlay: {
      markerX: 48,
      markerY: 38,
      label: 'Engineer On-Site: Hot-Air Weld Repair',
      trade: 'EntireFM Specialist Roofing',
      statusText: 'Physical Repair in Progress',
    },
    remedialFact: 'One single accountable engineering partner from flight to physical fix.',
  },
  {
    id: 'verify',
    stepNumber: '05',
    title: 'Verification Flight',
    shortLabel: 'Verify',
    tagline: 'Post-work photographic signoff',
    stateDescription: 'Secondary drone inspection or high-resolution closeout photography confirms that the repair meets manufacturer and engineering standards.',
    badge: 'STAGE 05 · QA VERIFICATION',
    icon: CheckCircle2,
    hudTelemetry: [
      { label: 'QA STATUS', value: '100% Weather-Tight Signoff Passed' },
      { label: 'POST-WORK CAPTURE', value: 'Timestamped Photographic Proof' },
      { label: 'WARRANTY VALIDATION', value: '10-Year Membrane Seal Guarantee' },
      { label: 'CLIENT REPORT', value: 'Before & After Audit Dossier' },
    ],
    highlightOverlay: {
      markerX: 48,
      markerY: 38,
      label: 'QA VERIFIED: REPAIR COMPLETE',
      statusText: 'Post-Remedial Flight Inspection Passed',
    },
    remedialFact: 'Unambiguous photographic proof for insurers, landlords, and audit boards.',
  },
  {
    id: 'record',
    stepNumber: '06',
    title: 'EntireCAFM Asset History',
    shortLabel: 'Record',
    tagline: 'Auditable digital lifecycle history',
    stateDescription: 'The defect ticket, aerial imagery, repair log, and warranty certificate resolve permanently into the building register in EntireCAFM.',
    badge: 'STAGE 06 · CAFM LIFECYCLE',
    icon: Database,
    hudTelemetry: [
      { label: 'CAFM ASSET ID', value: 'AST-ROOF-ZONE-B-04' },
      { label: 'LIFECYCLE STATUS', value: 'Defect Resolved / Condition: Good' },
      { label: 'COMPLIANCE AUDIT', value: 'Archived to Permanent Register' },
      { label: 'NEXT PPM CADENCE', value: 'Q4 Pre-Winter Aerial Scan' },
    ],
    highlightOverlay: {
      markerX: 48,
      markerY: 38,
      label: 'RECORDED IN ENTIRECAFM',
      statusText: 'Permanent Asset Health History Logged',
    },
    remedialFact: 'Turns single flight photos into multi-year property intelligence.',
  },
];

export function DroneStorySequence() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const current = STORY_STAGES[activeIdx];
  const CurrentIcon = current.icon;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % STORY_STAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <section 
      id="aerial-to-repair"
      aria-label="The EntireFM Aerial-to-Repair Lifecycle"
      className="py-24 bg-brand-void text-white relative overflow-hidden border-b border-brand-edge-dark"
    >
      {/* Background Ambience */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10 space-y-12">
        {/* Section Heading & Core Value Proposition */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15">
              <Sparkles className="h-3.5 w-3.5 text-brand-pink" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white font-light">
                THE ENTIREFM CORE PROPOSITION
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-[-0.03em] text-white leading-tight">
              The Aerial-to-Repair Lifecycle: <br />
              <span className="bg-gradient-to-r from-white via-slate-200 to-hero-pink bg-clip-text text-transparent font-light">
                From Flight to Verified Fix
              </span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              EntireFM is not merely a drone operator delivering disconnected photography. We connect aerial inspection directly into self-delivered engineering trades, statutory verification, and EntireCAFM asset history.
            </p>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-brand-carbon border border-brand-edge-dark text-slate-300 hover:text-white hover:border-brand-pink/50 transition-colors"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-brand-pink" />
                  <span>PAUSE SEQUENCE</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-brand-electric-bright" />
                  <span>PLAY SEQUENCE</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveIdx(0)}
              title="Reset to Stage 01"
              aria-label="Reset sequence to Stage 01"
              className="p-2 rounded-sm bg-brand-carbon border border-brand-edge-dark text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Step Progression Ribbon (Interactive Scrub Bar) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          {STORY_STAGES.map((stage, idx) => {
            const isCurrent = activeIdx === idx;
            const isPassed = activeIdx > idx;
            const Icon = stage.icon;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => {
                  setActiveIdx(idx);
                  setIsAutoPlaying(false);
                }}
                className={`p-3.5 rounded-sm text-left transition-all duration-300 relative border flex flex-col justify-between min-h-[96px] ${
                  isCurrent 
                    ? 'bg-brand-carbon border-brand-pink shadow-glow-pink' 
                    : isPassed
                    ? 'bg-brand-carbon/60 border-white/20 text-slate-300'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05] hover:border-white/25'
                }`}
              >
                {/* Active Top Progress Bar */}
                <div 
                  className={`absolute top-0 left-0 right-0 h-[2px] transition-colors ${
                    isCurrent ? 'bg-gradient-to-r from-brand-pink to-brand-magenta' : isPassed ? 'bg-brand-electric/60' : 'bg-transparent'
                  }`} 
                />

                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[10.5px] font-medium ${isCurrent ? 'text-brand-pink' : 'text-slate-400'}`}>
                    {stage.stepNumber}
                  </span>
                  <Icon className={`h-3.5 w-3.5 ${isCurrent ? 'text-brand-pink' : 'text-slate-500'}`} />
                </div>

                <div>
                  <h3 className={`text-xs sm:text-sm font-light tracking-wide ${isCurrent ? 'text-white font-normal' : 'text-slate-300'}`}>
                    {stage.shortLabel}
                  </h3>
                  <span className="text-[10px] text-slate-500 line-clamp-1">
                    {stage.tagline}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Anchored Cinematic Stage Workspace (Visual Commercial Building Scene) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-sm bg-brand-carbon border border-brand-edge-dark overflow-hidden shadow-elevated">
          {/* Left / Main: Anchored Commercial Building Scene with State Overlays */}
          <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] bg-brand-void flex items-center justify-center overflow-hidden">
            {/* Stable High-Resolution Commercial Asset Base Image */}
            <Image
              src="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
              alt="Commercial roofscape during EntireFM aerial survey"
              fill
              className="object-cover object-center transition-all duration-700 filter brightness-[0.85] contrast-[1.08]"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            {/* Stage-specific Visual Lens / Shader Simulation */}
            <div 
              className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                activeIdx === 0 
                  ? 'bg-brand-electric/10 mix-blend-overlay opacity-60' 
                  : activeIdx === 1
                  ? 'bg-amber-500/10 mix-blend-overlay opacity-80'
                  : activeIdx === 2
                  ? 'bg-rose-500/15 mix-blend-overlay opacity-90'
                  : activeIdx === 3
                  ? 'bg-brand-electric/20 mix-blend-color-dodge opacity-70'
                  : activeIdx === 4
                  ? 'bg-emerald-500/15 mix-blend-overlay opacity-80'
                  : 'bg-indigo-950/40 mix-blend-multiply opacity-90'
              }`}
            />

            {/* Subtle Viewfinder Crosshairs & Grid Overlays */}
            <div 
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Dynamic Stage Marker Pinned Spatially over Roof Membrane Bay */}
            <div 
              style={{
                top: `${current.highlightOverlay.markerY}%`,
                left: `${current.highlightOverlay.markerX}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-500"
            >
              {/* Pulsing Target Ring */}
              <div className="relative flex items-center justify-center">
                <span 
                  className={`absolute h-14 w-14 rounded-full animate-ping opacity-40 ${
                    activeIdx === 0 ? 'bg-brand-electric' :
                    activeIdx === 1 ? 'bg-amber-400' :
                    activeIdx === 2 ? 'bg-rose-500' :
                    activeIdx === 3 ? 'bg-brand-pink' :
                    activeIdx === 4 ? 'bg-emerald-400' :
                    'bg-indigo-400'
                  }`} 
                />
                <span 
                  className={`h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow-elevated ${
                    activeIdx === 0 ? 'bg-brand-electric' :
                    activeIdx === 1 ? 'bg-amber-500' :
                    activeIdx === 2 ? 'bg-rose-600' :
                    activeIdx === 3 ? 'bg-brand-pink' :
                    activeIdx === 4 ? 'bg-emerald-500' :
                    'bg-indigo-500'
                  }`}
                >
                  <CurrentIcon className="h-3 w-3 text-white" />
                </span>
              </div>

              {/* Technical Marker Tag */}
              <div className="mt-3 -translate-x-1/2 left-1/2 absolute w-60 rounded-sm bg-brand-void/95 border border-brand-edge-dark p-2.5 backdrop-blur-md text-left shadow-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-semibold text-brand-pink uppercase tracking-widest">
                    STAGE {current.stepNumber}
                  </span>
                  {current.highlightOverlay.priority && (
                    <span className="px-1.5 py-0.2 rounded-sm bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-mono font-bold">
                      {current.highlightOverlay.priority}
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-medium text-white line-clamp-1">
                  {current.highlightOverlay.label}
                </div>
                <div className="text-[10px] text-slate-300 font-mono">
                  {current.highlightOverlay.statusText}
                </div>
              </div>
            </div>

            {/* Bottom HUD Bar in Viewport */}
            <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between px-3.5 py-2 rounded-sm bg-brand-void/90 border border-white/10 backdrop-blur-md text-[10.5px] font-mono text-slate-300">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SPATIAL ASSET: ROOF ZONE B · GRID 4
              </span>
              <span className="text-brand-pink">{current.badge}</span>
            </div>
          </div>

          {/* Right: Technical Explanation & Trade Action Panel */}
          <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Stage Eyebrow & Headline */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-pink font-mono text-xs uppercase tracking-wider font-light">
                  <CurrentIcon className="h-4 w-4" />
                  <span>{current.badge}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
                  {current.title}
                </h3>

                <p className="text-sm font-light text-slate-300 leading-relaxed pt-1">
                  {current.stateDescription}
                </p>
              </div>

              {/* Dynamic Telemetry Matrix */}
              <div className="rounded-sm bg-brand-void/60 border border-brand-edge-dark p-4 space-y-2.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-light">
                  Operational Parameters &amp; Outputs
                </span>
                <div className="space-y-2">
                  {current.hudTelemetry.map((item, tIdx) => (
                    <div key={tIdx} className="flex justify-between items-center text-xs font-mono py-1 border-b border-white/[0.04] last:border-none">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="text-slate-200 font-medium text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* EntireFM Strategic Value Note */}
              <div className="p-3.5 rounded-sm bg-brand-pink/10 border border-brand-pink/25 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-brand-pink shrink-0 mt-0.5" />
                <p className="text-xs text-pink-100/90 leading-relaxed font-light">
                  <strong className="font-normal text-white">EntireFM Advantage: </strong>
                  {current.remedialFact}
                </p>
              </div>
            </div>

            {/* Stepper Navigation Footer */}
            <div className="pt-6 border-t border-brand-edge-dark flex items-center justify-between">
              <button
                type="button"
                disabled={activeIdx === 0}
                onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
                className="text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                ← Previous Stage
              </button>

              <span className="font-mono text-xs text-slate-500">
                {activeIdx + 1} / {STORY_STAGES.length}
              </span>

              <button
                type="button"
                onClick={() => setActiveIdx((prev) => (prev + 1) % STORY_STAGES.length)}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-brand-pink hover:text-brand-pink-light transition-colors"
              >
                <span>{activeIdx === STORY_STAGES.length - 1 ? 'Restart Cycle' : 'Next Stage'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Indexable Semantic SEO Body (Accessible to Screen Readers & Web Crawlers) */}
        <div className="sr-only">
          <h3>Detailed EntireFM Aerial Asset Intelligence Process</h3>
          <ol>
            {STORY_STAGES.map((s) => (
              <li key={s.id}>
                <h4>{s.stepNumber} {s.title}: {s.tagline}</h4>
                <p>{s.stateDescription}</p>
                <p>{s.remedialFact}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
