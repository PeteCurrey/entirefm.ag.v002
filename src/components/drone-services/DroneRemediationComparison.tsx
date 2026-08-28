'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sliders, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  ArrowRight, 
  ShieldCheck,
  Camera,
  FileCheck2,
  Layers
} from 'lucide-react';

interface CaseComparison {
  id: string;
  title: string;
  category: string;
  detectedDefect: {
    title: string;
    description: string;
    priority: 'P1' | 'P2';
    sensor: string;
    location: string;
  };
  remedialAction: {
    trade: string;
    scope: string;
    workOrder: string;
    materials: string;
    accessType: string;
  };
  verifiedSignoff: {
    verificationFlight: string;
    qaSignoff: string;
    warranty: string;
    cafmRecord: string;
  };
}

const COMPARISON_CASES: CaseComparison[] = [
  {
    id: 'case-facade',
    title: 'High-Rise Façade Vertical Expansion Joint',
    category: 'FAÇADE & ROPE ACCESS',
    detectedDefect: {
      title: 'Perished Vertical Façade Mastic Seal',
      description: 'Ultra-high-resolution 48MP zoom scan identified 8.4m of degraded structural silicone with complete adhesive failure along Floor 5–7 curtain walling.',
      priority: 'P1',
      sensor: '48MP RGB Optical Telephoto',
      location: 'South Elevation / Grid 3-C / Floors 5–7',
    },
    remedialAction: {
      trade: 'EntireFM IRATA Rope Access Team',
      scope: 'Rake out failed sealant, prime aluminum and masonry substrates, install closed-cell backing rod, and tool Dowsil 791 weatherproof silicone.',
      workOrder: 'WO-2026-9160 (Hard Services)',
      materials: 'Dowsil 791 Structural Silicone + PE Backing Rod',
      accessType: 'Targeted Twin-Rope Rigging (Zero Scaffolding)',
    },
    verifiedSignoff: {
      verificationFlight: 'Post-work aerial telephoto verification passed 100%',
      qaSignoff: 'Lead Engineer Signed Off · Weather-Tight QA Certified',
      warranty: '10-Year Waterproof Seal Guarantee Issued',
      cafmRecord: 'AST-FAC-S03 Updated with Complete Photographic Evidence',
    },
  },
  {
    id: 'case-roof',
    title: 'Single-Ply Waterproofing Membrane Seam Breach',
    category: 'ROOF WATERPROOFING',
    detectedDefect: {
      title: 'Delaminated Lap Seam & Moisture Ingress',
      description: 'Thermal FLIR survey isolated +6.2°C thermal delta indicating trapped water under insulation. Optical drone scan revealed 1.8m delaminated overlap.',
      priority: 'P1',
      sensor: 'FLIR 640T Radiometric + 48MP RGB',
      location: 'Roof Zone B / Bay 4 / North Flashing Upstand',
    },
    remedialAction: {
      trade: 'EntireFM Specialist Roofing Division',
      scope: 'Cut back saturated insulation core, install new PIR board, hot-air weld reinforcing EPDM membrane patch, and seal edge upstand.',
      workOrder: 'WO-2026-9142 (Roofing Remedial)',
      materials: 'Sarnafil Single-Ply Membrane + PU Adhesive',
      accessType: 'Roof Safety Eyebolt Harness Deployment',
    },
    verifiedSignoff: {
      verificationFlight: 'Secondary thermal scan confirms zero moisture delta-T',
      qaSignoff: 'Roofing Technical Director Signoff Verified',
      warranty: '12-Year Material & Labour Guarantee Attached',
      cafmRecord: 'AST-ROOF-ZB Archived to EntireCAFM Asset Register',
    },
  },
  {
    id: 'case-gutter',
    title: 'Commercial Valley Gutter Blockage & Overflow',
    category: 'DRAINAGE & CLEANSING',
    detectedDefect: {
      title: 'Heavy Silt Surcharge & Rooted Vegetation',
      description: 'Aerial orthomosaic map identified 65mm silt buildup and vegetative rooting blocking primary downpipe outlet during seasonal rains.',
      priority: 'P2',
      sensor: 'High-Altitude 2D Orthomosaic Map',
      location: 'Central Industrial Valley Gutter / Chute 02',
    },
    remedialAction: {
      trade: 'EntireFM Specialist Cleaning Division',
      scope: 'Commercial vacuum extraction of 240kg silt/vegetation, pressure wash to bare metal, downpipe camera flush, and joint sealing.',
      workOrder: 'WO-2026-9148 (Specialist Cleansing)',
      materials: 'Anti-fungal Biocide Wash + Joint Sealant',
      accessType: 'Safe Gutter Crawl-Board Deployment',
    },
    verifiedSignoff: {
      verificationFlight: 'Post-clearance drone flight confirms 100% unimpeded flow',
      qaSignoff: 'Pre-Winter Drainage Clearance Signoff Logged',
      warranty: '6-Month Seasonal Clearance Guarantee',
      cafmRecord: 'Added to Quarterly Planned Preventative Schedule',
    },
  },
];

export function DroneRemediationComparison() {
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const currentCase = COMPARISON_CASES[activeCaseIdx];

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  return (
    <section 
      id="before-after"
      aria-label="Before Remediate After Comparison"
      className="py-24 bg-brand-void text-white relative overflow-hidden border-b border-brand-edge-dark"
    >
      <div className="container-custom relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15">
              <CheckCircle2 className="h-3.5 w-3.5 text-brand-pink" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white font-light">
                THE PHYSICAL REMEDIATION BRIDGE
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
              Before → Remediate → After: <br />
              <span className="text-hero-pink font-light">
                Why EntireFM is Not a Standalone Drone Company
              </span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              Anyone can fly a drone and hand over photos. EntireFM diagnoses the failure, assigns the right engineering trade, executes the physical repair, and verifies the completed work in EntireCAFM.
            </p>
          </div>

          {/* Case Study Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {COMPARISON_CASES.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setActiveCaseIdx(idx);
                  setSliderPos(50);
                }}
                className={`px-3 py-2 rounded-sm text-xs font-mono transition-colors ${
                  activeCaseIdx === idx
                    ? 'bg-brand-pink text-white font-medium shadow-glow-pink'
                    : 'bg-brand-carbon border border-brand-edge-dark text-slate-300 hover:border-white/30 hover:text-white'
                }`}
              >
                {c.category}
              </button>
            ))}
          </div>
        </div>

        {/* 3-State Visual Comparison Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Visual Slider: Drone Detected Defect (Left) vs Verified Completed Repair (Right) */}
          <div className="lg:col-span-7 rounded-sm bg-brand-carbon border border-brand-edge-dark overflow-hidden relative min-h-[400px] sm:min-h-[480px] lg:min-h-[560px] shadow-elevated select-none">
            <div 
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerMove={handlePointerMove}
              className="relative w-full h-full cursor-ew-resize overflow-hidden"
            >
              {/* BEFORE IMAGE (Drone Detected Defect) */}
              <div className="absolute inset-0 z-10">
                <Image
                  src="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
                  alt="Drone-detected building defect before repair"
                  fill
                  className="object-cover object-center filter brightness-[0.8] contrast-[1.1] grayscale-[30%]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                {/* Defect Overlay Tag */}
                <div className="absolute top-6 left-6 z-20 p-3 rounded-sm bg-brand-void/90 border border-rose-500/40 text-rose-300 font-mono text-xs shadow-2xl backdrop-blur-md space-y-1">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                    <span>DETECTED DEFECT ({currentCase.detectedDefect.priority})</span>
                  </div>
                  <div className="text-white text-[11px] font-medium font-sans">
                    {currentCase.detectedDefect.title}
                  </div>
                </div>
              </div>

              {/* AFTER IMAGE (Verified Completed Repair with Clip Path) */}
              <div 
                className="absolute inset-0 z-20 overflow-hidden"
                style={{
                  clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`
                }}
              >
                <Image
                  src="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
                  alt="Verified completed remedial repair"
                  fill
                  className="object-cover object-center filter brightness-[0.95] contrast-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                {/* Verification Tag */}
                <div className="absolute top-6 right-6 z-20 p-3 rounded-sm bg-brand-void/90 border border-emerald-500/40 text-emerald-300 font-mono text-xs shadow-2xl backdrop-blur-md space-y-1 text-right">
                  <div className="flex items-center justify-end gap-1.5 font-bold uppercase tracking-wider">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>VERIFIED COMPLETE</span>
                  </div>
                  <div className="text-white text-[11px] font-medium font-sans">
                    Physical Remediation QA Passed
                  </div>
                </div>
              </div>

              {/* DRAG HANDLE */}
              <div 
                style={{ left: `${sliderPos}%` }}
                className="absolute top-0 bottom-0 z-30 w-1 bg-white cursor-ew-resize"
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-brand-void border-2 border-white shadow-2xl flex items-center justify-center text-white">
                  <Sliders className="h-4 w-4 text-brand-pink" />
                </div>
              </div>

              {/* Bottom Telemetry HUD in Slider */}
              <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between px-4 py-2 rounded-sm bg-brand-void/90 border border-white/10 backdrop-blur-md font-mono text-[10.5px] text-slate-300">
                <span>DRAG SLIDER: DETECTED DEFECT ↔ VERIFIED REMEDIATION</span>
                <span className="text-brand-pink font-semibold">100% SELF-DELIVERED BY ENTIREFM</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3-Step Lifecycle Workflow Dossier */}
          <div className="lg:col-span-5 rounded-sm bg-brand-carbon border border-brand-edge-dark p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-elevated">
            <div className="space-y-5">
              {/* Heading */}
              <div className="border-b border-brand-edge-dark pb-3">
                <span className="font-mono text-[11px] text-brand-pink font-semibold uppercase tracking-widest block">
                  CASE DOSSIER · {currentCase.category}
                </span>
                <h3 className="text-xl font-light text-white tracking-tight mt-1">
                  {currentCase.title}
                </h3>
              </div>

              {/* STEP 1: DETECTED */}
              <div className="p-3.5 rounded-sm bg-brand-void/70 border border-brand-edge-dark space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-rose-400 font-bold">
                  <span>1. AERIAL DETECTION</span>
                  <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded text-[10px]">{currentCase.detectedDefect.priority}</span>
                </div>
                <p className="font-sans text-xs text-slate-300 leading-relaxed font-light">
                  {currentCase.detectedDefect.description}
                </p>
                <div className="text-[10px] text-slate-400">Sensor: {currentCase.detectedDefect.sensor}</div>
              </div>

              {/* STEP 2: REMEDIATED */}
              <div className="p-3.5 rounded-sm bg-brand-pink/10 border border-brand-pink/30 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-brand-pink font-bold">
                  <span>2. ENTIREFM REMEDIAL ACTION</span>
                  <span className="text-white text-[10px]">{currentCase.remedialAction.workOrder}</span>
                </div>
                <p className="font-sans text-xs text-white leading-relaxed font-normal">
                  {currentCase.remedialAction.scope}
                </p>
                <div className="text-[10.5px] text-pink-200">
                  <strong>Trade:</strong> {currentCase.remedialAction.trade} ({currentCase.remedialAction.accessType})
                </div>
              </div>

              {/* STEP 3: VERIFIED & RECORDED */}
              <div className="p-3.5 rounded-sm bg-emerald-950/30 border border-emerald-800/40 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>3. QA VERIFICATION &amp; CAFM SYNC</span>
                  <span className="text-emerald-300 text-[10px]">VERIFIED</span>
                </div>
                <p className="font-sans text-xs text-slate-200 leading-relaxed font-light">
                  {currentCase.verifiedSignoff.verificationFlight}
                </p>
                <div className="text-[10.5px] text-emerald-300">
                  <strong>EntireCAFM:</strong> {currentCase.verifiedSignoff.cafmRecord}
                </div>
              </div>
            </div>

            {/* CAFM Verification Seal */}
            <div className="p-3 rounded-sm bg-brand-void border border-brand-edge-dark flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-brand-pink" />
                Permanent Audit Trail
              </span>
              <span className="text-brand-pink font-bold">RECORDED IN ENTIRECAFM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
