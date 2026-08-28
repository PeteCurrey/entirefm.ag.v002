'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  Layers, 
  Flame, 
  Camera, 
  Map, 
  Box, 
  Sliders, 
  Info, 
  CheckCircle2,
  AlertTriangle,
  Database,
  Crosshair
} from 'lucide-react';

type SpectrumMode = 'slider' | 'rgb' | 'thermal' | 'defect' | 'ortho' | 'cafm';

export function DroneMultiSpectrumView() {
  const [activeMode, setActiveMode] = useState<SpectrumMode>('slider');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

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
      id="multi-spectrum"
      aria-label="Multi-Spectrum Aerial Dataset Viewer"
      className="py-24 bg-brand-void text-white relative overflow-hidden border-b border-brand-edge-dark"
    >
      <div className="container-custom relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15">
              <Flame className="h-3.5 w-3.5 text-brand-pink" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white font-light">
                MULTI-SPECTRUM AERIAL INTELLIGENCE
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
              One Asset. <br />
              <span className="bg-gradient-to-r from-brand-electric-bright via-white to-hero-pink bg-clip-text text-transparent font-light">
                Five Layers of Engineering Truth.
              </span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              Drone inspection is not limited to standard visual photography. By capturing high-resolution optical, FLIR radiometric infrared, geospatial GIS vectors, and CAFM asset registers across the identical coordinate frame, EntireFM uncovers hidden building failures invisible to the naked eye.
            </p>
          </div>

          {/* Dataset Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'slider', label: 'RGB ↔ Thermal Reveal', icon: Sliders },
              { id: 'rgb', label: 'Optical (48MP)', icon: Camera },
              { id: 'thermal', label: 'FLIR Thermal (Delta-T)', icon: Flame },
              { id: 'defect', label: 'Defect Vector Map', icon: AlertTriangle },
              { id: 'ortho', label: 'RTK Orthomosaic', icon: Map },
              { id: 'cafm', label: 'EntireCAFM Layer', icon: Database },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveMode(m.id as SpectrumMode)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-mono transition-all ${
                    isSelected
                      ? 'bg-brand-pink text-white font-medium shadow-glow-pink'
                      : 'bg-brand-carbon border border-brand-edge-dark text-slate-300 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The Multi-Spectrum Interactive Workspace */}
        <div className="rounded-sm bg-brand-carbon border border-brand-edge-dark overflow-hidden shadow-elevated">
          {/* Main Visual Display Canvas */}
          <div 
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            className="relative w-full h-[400px] sm:h-[500px] lg:h-[620px] bg-brand-void select-none cursor-crosshair overflow-hidden"
          >
            {/* BASE LAYER 1: Optical RGB Image (Sheffield Commercial Rooftop Baseline) */}
            <div className="absolute inset-0 z-10">
              <Image
                src="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
                alt="High-resolution optical 48MP drone inspection baseline"
                fill
                className="object-cover object-center filter brightness-[0.88] contrast-[1.05]"
                sizes="100vw"
              />
            </div>

            {/* LAYER 2: Thermal Radiometric Simulation (revealed in Thermal or Slider modes) */}
            {(activeMode === 'thermal' || activeMode === 'slider') && (
              <div 
                className="absolute inset-0 z-20 overflow-hidden transition-all duration-75"
                style={{
                  clipPath: activeMode === 'slider' ? `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` : 'none'
                }}
              >
                {/* Thermal Color Map / Ironbow Simulation Shader Layer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#020024] via-[#4d0c75] to-[#f47e17] mix-blend-color opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0c0032] via-[#6a0d83] to-[#fcdd68] mix-blend-hard-light opacity-80" />
                
                {/* Simulated Thermal Moisture & Heat Loss Anomalies */}
                <div className="absolute top-[32%] left-[45%] w-48 h-32 rounded-full bg-[#fde047] blur-xl opacity-90 animate-pulse mix-blend-screen" />
                <div className="absolute top-[60%] left-[70%] w-36 h-28 rounded-full bg-[#f43f5e] blur-lg opacity-85 mix-blend-screen" />

                {/* Thermal Anomaly Pinned Spot Callouts */}
                <div className="absolute top-[38%] left-[54%] z-30 -translate-x-1/2 -translate-y-1/2 p-2 rounded-sm bg-black/90 border border-amber-400 text-[10px] font-mono text-amber-300 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-1 font-bold">
                    <Flame className="h-3 w-3 text-amber-400" />
                    <span>ANOMALY TH-01: +7.2°C DELTA-T</span>
                  </div>
                  <div className="text-white text-[9.5px]">Trapped Sub-Membrane Insulation Moisture</div>
                </div>

                <div className="absolute top-[64%] left-[76%] z-30 -translate-x-1/2 -translate-y-1/2 p-2 rounded-sm bg-black/90 border border-rose-400 text-[10px] font-mono text-rose-300 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-1 font-bold">
                    <Flame className="h-3 w-3 text-rose-400" />
                    <span>PLANT DELTA: +18.4°C</span>
                  </div>
                  <div className="text-white text-[9.5px]">HVAC Compressor Heat Dissipation</div>
                </div>
              </div>
            )}

            {/* LAYER 3: Defect Vector CAD Layer */}
            {activeMode === 'defect' && (
              <div className="absolute inset-0 z-20 pointer-events-none bg-brand-void/40 backdrop-blur-[1px]">
                {/* SVG CAD Defect Boundaries & Zone Polygons */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Roof Zone B Boundary */}
                  <polygon
                    points="240,160 620,130 780,380 340,420"
                    fill="rgba(237, 56, 153, 0.12)"
                    stroke="#ED3899"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                  />
                  <text x="360" y="160" fill="#ED3899" fontSize="12" fontFamily="monospace" fontWeight="bold">
                    ZONE B-4: MEMBRANE DELAMINATION (P1)
                  </text>

                  {/* Valley Gutter Drainage Vector */}
                  <line
                    x1="620"
                    y1="130"
                    x2="880"
                    y2="240"
                    stroke="#F59E0B"
                    strokeWidth="4"
                    strokeDasharray="8 4"
                  />
                  <text x="680" y="190" fill="#F59E0B" fontSize="11" fontFamily="monospace">
                    DRAINAGE RUNOFF SURCHARGE CHUTE
                  </text>
                </svg>

                <div className="absolute bottom-6 left-6 p-4 rounded-sm bg-brand-void/95 border border-brand-edge-dark text-xs font-mono space-y-1.5 shadow-2xl">
                  <span className="text-brand-pink font-bold uppercase tracking-wider block">CAD DEFECT VECTOR LAYER</span>
                  <div className="text-slate-300">Total Surveyed Area: 4,820 m²</div>
                  <div className="text-slate-300">Total Isolated Defects: 6 (2 P1 / 3 P2 / 1 P3)</div>
                </div>
              </div>
            )}

            {/* LAYER 4: Orthomosaic / Topographic GIS Contour Grid */}
            {activeMode === 'ortho' && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                <div 
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `linear-gradient(to right, #00d2ff 1px, transparent 1px), linear-gradient(to bottom, #00d2ff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                  }}
                />
                <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 50,200 Q 300,160 600,220 T 1100,180" fill="none" stroke="#00d2ff" strokeWidth="1" />
                  <path d="M 50,260 Q 320,210 620,270 T 1100,240" fill="none" stroke="#00d2ff" strokeWidth="1" />
                  <path d="M 50,320 Q 340,270 640,320 T 1100,300" fill="none" stroke="#00d2ff" strokeWidth="1" />
                </svg>

                <div className="absolute top-6 left-6 p-3 rounded-sm bg-brand-void/95 border border-brand-electric/40 text-xs font-mono space-y-1 text-slate-200">
                  <div className="text-brand-electric-bright font-bold">GEOSPATIAL RTK COORDINATE MODEL</div>
                  <div>GSD: 0.42 cm/pixel · Elevation Datum: Ordnance Survey Newlyn (ODN)</div>
                  <div>Export Formats: GeoTIFF, ECW, DXF Contours, LAS Point Cloud</div>
                </div>
              </div>
            )}

            {/* LAYER 5: EntireCAFM Asset Management Registry Layer */}
            {activeMode === 'cafm' && (
              <div className="absolute inset-0 z-20 pointer-events-none p-6 flex flex-col justify-between">
                <div className="flex flex-wrap gap-4">
                  <div className="p-3.5 rounded-sm bg-brand-void/95 border border-brand-pink text-xs font-mono text-white shadow-2xl max-w-sm space-y-1">
                    <div className="flex items-center justify-between text-brand-pink font-bold">
                      <span>ASSET: AST-ROOF-04</span>
                      <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded text-[10px]">OPEN WO: WO-9142</span>
                    </div>
                    <div>Single-Ply Waterproofing Membrane · Bay 3</div>
                    <div className="text-slate-400 text-[10px]">Assigned to: EntireFM Hard Services (Rope Access)</div>
                  </div>

                  <div className="p-3.5 rounded-sm bg-brand-void/95 border border-brand-electric text-xs font-mono text-white shadow-2xl max-w-sm space-y-1">
                    <div className="flex items-center justify-between text-brand-electric-bright font-bold">
                      <span>ASSET: AST-HVAC-CHILL-02</span>
                      <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[10px]">STATUS: PPM COMPLIANT</span>
                    </div>
                    <div>Daikin Rooftop Chiller Unit · Plinth 2</div>
                    <div className="text-slate-400 text-[10px]">Last Thermal Scan: Today · Delta-T: Normal</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-sm bg-brand-void/95 border border-brand-edge-dark text-xs font-mono text-slate-300 self-start">
                  <span className="text-brand-pink font-bold">CONNECTED OPERATING PLATFORM: </span>
                  Every aerial pixel maps directly into live EntireCAFM asset logbooks.
                </div>
              </div>
            )}

            {/* INTERACTIVE COMPARISON DRAG HANDLE (When in Slider Mode) */}
            {activeMode === 'slider' && (
              <div 
                style={{ left: `${sliderPos}%` }}
                className="absolute top-0 bottom-0 z-30 w-1 bg-white cursor-ew-resize group"
              >
                {/* Drag Bubble Handle */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-brand-void border-2 border-white shadow-2xl flex items-center justify-center text-white transition-transform group-hover:scale-110">
                  <Sliders className="h-4 w-4 text-brand-pink" />
                </div>

                {/* Left / Right Mode Labels */}
                <span className="absolute top-6 right-3 px-2 py-1 rounded-sm bg-black/80 text-[10px] font-mono text-white pointer-events-none uppercase tracking-wider">
                  48MP OPTICAL RGB
                </span>
                <span className="absolute top-6 left-3 px-2 py-1 rounded-sm bg-black/80 text-[10px] font-mono text-amber-400 pointer-events-none uppercase tracking-wider">
                  FLIR THERMAL RADIOMETRIC
                </span>
              </div>
            )}

            {/* Top Bar HUD Info Readout */}
            <div className="absolute top-4 left-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-sm bg-brand-void/90 border border-white/10 backdrop-blur-md text-[10.5px] font-mono text-slate-300">
              <Crosshair className="h-3.5 w-3.5 text-brand-pink" />
              <span>DATASET: {activeMode.toUpperCase()} · SPATIALLY REGISTERED MODEL</span>
            </div>
          </div>

          {/* Bottom Telemetry Parameter Bar */}
          <div className="p-6 bg-brand-carbon border-t border-brand-edge-dark grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-mono text-slate-300">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Optical Standard</span>
              <span className="text-white font-medium">48MP Hasselblad / Phase One 100MP</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Thermal Sensitivity</span>
              <span className="text-amber-400 font-medium">FLIR 640×512 Radiometric (&lt;30mK NETD)</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Geospatial Precision</span>
              <span className="text-brand-electric-bright font-medium">RTK / PPK ±8mm Horiz / ±12mm Vert</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Platform Sync</span>
              <span className="text-brand-pink font-medium">Real-Time EntireCAFM Work Orders</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
