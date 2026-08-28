'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Crosshair, 
  Layers, 
  Flame, 
  Building2, 
  Sun, 
  Wrench, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  AlertTriangle,
  FileCheck2,
  Tag,
  MapPin,
  Camera,
  Maximize2
} from 'lucide-react';

interface InspectionHotspot {
  id: string;
  obsNumber: string;
  name: string;
  category: 'Roof Membrane' | 'Gutter & Drainage' | 'Flashing & Upstand' | 'Parapet & Coping' | 'Façade Joint' | 'Rooftop Plant' | 'Solar PV' | 'Drainage Outlet';
  x: number; // percentage
  y: number; // percentage
  priority: 'P1' | 'P2' | 'P3';
  priorityLabel: 'Critical' | 'Urgent' | 'Advisory';
  location: string;
  sensorCapture: string;
  observationSummary: string;
  recommendedAction: string;
  trade: string;
  cafmAction: string;
  riskFactor: string;
  estimatedTurnaround: string;
}

const HOTSPOTS: InspectionHotspot[] = [
  {
    id: 'hotspot-1',
    obsNumber: 'OBS-01',
    name: 'Single-Ply Roof Membrane Delamination',
    category: 'Roof Membrane',
    x: 28,
    y: 36,
    priority: 'P1',
    priorityLabel: 'Critical',
    location: 'Roof Zone B / Bay 3 / Grid 4-E',
    sensorCapture: '48MP Optical RGB + Radiometric Moisture Delta-T (+5.2°C)',
    observationSummary: 'High-level thermal signature indicates trapped moisture beneath single-ply EPDM membrane lap seam. Visible 1.8m delamination seam lifting under wind suction.',
    recommendedAction: 'Hot-air weld repair with Sarnafil reinforcing patch, mechanical fastener check, and perimeter polyurethane reseal.',
    trade: 'EntireFM Specialist Roofing / Rope Access',
    cafmAction: 'Create Remedial Work Order · WO-2026-9142',
    riskFactor: 'Active internal leak risk over critical server room / switchgear below.',
    estimatedTurnaround: '24–48 Hours',
  },
  {
    id: 'hotspot-2',
    obsNumber: 'OBS-02',
    name: 'Valley Gutter Heavy Silt & Vegetation Blockage',
    category: 'Gutter & Drainage',
    x: 68,
    y: 24,
    priority: 'P2',
    priorityLabel: 'Urgent',
    location: 'Central Valley Gutter / Chute 2-A',
    sensorCapture: '48MP High-Definition Optical RGB',
    observationSummary: 'Vegetative growth (moss and weed rooting) and 45mm silt buildup obstructing free rainwater drainage to north downpipe hoppers.',
    recommendedAction: 'High-reach commercial gutter vacuum clearance, weed root extraction, downpipe flush, and bio-wash treatment.',
    trade: 'EntireFM Specialist Cleaning & Drainage',
    cafmAction: 'Schedule Gutter Vacuum Clearance · WO-2026-9148',
    riskFactor: 'Potential rainwater overflow surcharging into roof light upstands during heavy rainfall.',
    estimatedTurnaround: '3–5 Working Days',
  },
  {
    id: 'hotspot-3',
    obsNumber: 'OBS-03',
    name: 'Perished Flashing at HVAC Chiller Plinth',
    category: 'Flashing & Upstand',
    x: 76,
    y: 65,
    priority: 'P2',
    priorityLabel: 'Urgent',
    location: 'Rooftop Plant Deck / Chiller 02 Plinth',
    sensorCapture: '48MP RGB Close-Up Telephoto Audit',
    observationSummary: 'Aged Code 4 lead flashing cracked along vibration crease line. Polyurethane counter-flashing sealant split and pulled away from concrete plinth.',
    recommendedAction: 'Dress new Code 4 lead apron flashing, mechanically secure stainless steel retention straps, and apply high-modulus silicone seal.',
    trade: 'EntireFM Building Maintenance & M&E Services',
    cafmAction: 'Generate Plinth Remediation Task · WO-2026-9155',
    riskFactor: 'Capillary water ingress entering plant room ceiling void below.',
    estimatedTurnaround: '48–72 Hours',
  },
  {
    id: 'hotspot-4',
    obsNumber: 'OBS-04',
    name: 'Parapet Coping Joint Degradation & Splay Defect',
    category: 'Parapet & Coping',
    x: 18,
    y: 62,
    priority: 'P3',
    priorityLabel: 'Advisory',
    location: 'South-West Perimeter Parapet / Grid 1-A',
    sensorCapture: '48MP RGB Orthophoto Mapping',
    observationSummary: 'Mortar breakdown in two aluminum coping stone butt joints with mild splay deflection caused by seasonal thermal expansion.',
    recommendedAction: 'Rake out failed joint sealant, insert backing foam rod, and install flexible expansion joint caps.',
    trade: 'EntireFM Building Fabric & Masonry Services',
    cafmAction: 'Log to 6-Month CapEx Maintenance Plan',
    riskFactor: 'Gradual water migration into brick cavity over multi-year freeze-thaw cycles.',
    estimatedTurnaround: 'Scheduled in Next Planned PPM',
  },
  {
    id: 'hotspot-5',
    obsNumber: 'OBS-05',
    name: 'Vertical Façade Mastic Expansion Joint Failure',
    category: 'Façade Joint',
    x: 44,
    y: 84,
    priority: 'P1',
    priorityLabel: 'Critical',
    location: 'South Façade / Elevation 03 / Floors 4–6',
    sensorCapture: 'Telephoto Zoom RGB Optical Capture',
    observationSummary: 'Complete adhesive failure of structural silicone sealant along 4-storey curtain wall vertical expansion joint with visible weather seal gap.',
    recommendedAction: 'Deploy two-man IRATA rope access crew for mastic cutout, substrate primer preparation, and renewal with Dowsil 791 silicone.',
    trade: 'EntireFM IRATA Rope Access & Facades',
    cafmAction: 'Urgent Rope Access Work Order · WO-2026-9160',
    riskFactor: 'Direct driving rain ingress into tenant office perimeter cladding panels.',
    estimatedTurnaround: '48 Hours',
  },
  {
    id: 'hotspot-6',
    obsNumber: 'OBS-06',
    name: 'Rooftop AHU Condenser Coil Soiling & Casing Rust',
    category: 'Rooftop Plant',
    x: 84,
    y: 42,
    priority: 'P2',
    priorityLabel: 'Urgent',
    location: 'Rooftop Plant Deck / AHU Unit 01',
    sensorCapture: 'Optical RGB + FLIR Thermal Dissipation Map',
    observationSummary: 'Heavy atmospheric particulate coating on condenser aluminium fins causing elevated thermal head pressure and localized galvanised casing surface corrosion.',
    recommendedAction: 'Low-pressure coil chemical wash, fin comb realignment, and zinc-rich anti-corrosion barrier coating.',
    trade: 'EntireFM Mechanical & HVAC Services',
    cafmAction: 'Issue M&E HVAC Service Ticket · WO-2026-9166',
    riskFactor: '14% loss in chiller thermodynamic efficiency and elevated compressor wear.',
    estimatedTurnaround: 'Within 5 Working Days',
  },
  {
    id: 'hotspot-7',
    obsNumber: 'OBS-07',
    name: 'Solar PV String Diode Hotspot Anomaly',
    category: 'Solar PV',
    x: 52,
    y: 18,
    priority: 'P2',
    priorityLabel: 'Urgent',
    location: 'Solar Array Zone North / String 14 / Panel 08',
    sensorCapture: 'Calibrated Radiometric Infrared (FLIR 640T) under 750W/m² Irradiance',
    observationSummary: 'Delta-T anomaly of +24.6°C across two photovoltaic cells indicating bypass diode failure and internal substring short circuit.',
    recommendedAction: 'Isolate string, test open-circuit voltage (Voc), and replace defective 450W monocrystalline PV panel module.',
    trade: 'EntireFM NICEIC Approved Solar Engineers',
    cafmAction: 'Dispatch Solar Electrical Team · WO-2026-9172',
    riskFactor: 'System yield drop of 8.5% and localized thermal fire risk under high solar irradiance.',
    estimatedTurnaround: '72 Hours',
  },
  {
    id: 'hotspot-8',
    obsNumber: 'OBS-08',
    name: 'Parapet Scupper Drain Grate Displacement',
    category: 'Drainage Outlet',
    x: 88,
    y: 80,
    priority: 'P3',
    priorityLabel: 'Advisory',
    location: 'East Parapet Downpipe Outlet 04',
    sensorCapture: 'High-Resolution 48MP Optical Scan',
    observationSummary: 'Cast iron leaf guard dome displaced by high wind, leaving 110mm rainwater outlet vulnerable to debris ingress.',
    recommendedAction: 'Re-seat leaf guard dome and mechanically clamp with stainless steel securing ring.',
    trade: 'EntireFM Building Maintenance Services',
    cafmAction: 'Add to Quarterly Gutter Sweep Checklist',
    riskFactor: 'Risk of leaves entering subsurface stormwater pipes during autumn storm.',
    estimatedTurnaround: 'Scheduled in Next Routine Sweep',
  },
];

export function DroneInteractiveInspection() {
  const [selectedObs, setSelectedObs] = useState<InspectionHotspot>(HOTSPOTS[0]);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Roof Membrane', 'Gutter & Drainage', 'Flashing & Upstand', 'Façade Joint', 'Rooftop Plant', 'Solar PV'];

  const filteredHotspots = filterCategory === 'All' 
    ? HOTSPOTS 
    : HOTSPOTS.filter(h => h.category.toLowerCase().includes(filterCategory.toLowerCase()) || filterCategory.toLowerCase().includes(h.category.toLowerCase()));

  return (
    <section 
      id="interactive-inspection"
      aria-label="Interactive Commercial Building Inspection Platform"
      className="py-24 bg-brand-void text-white relative overflow-hidden border-b border-brand-edge-dark"
    >
      <div className="container-custom relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15">
              <Crosshair className="h-3.5 w-3.5 text-brand-pink" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white font-light">
                INTERACTIVE ASSET INSPECTOR
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
              Interactive Building Inspection: <br />
              <span className="text-hero-pink font-light">
                Pinpoint Defects Across Every Asset
              </span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              Explore how EntireFM commercial drone surveys georeference real building observations. Select any hotspot marker across the building fabric to inspect diagnostic findings, RAG priorities, and self-delivered repair actions.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-colors ${
                  filterCategory === cat
                    ? 'bg-brand-pink text-white font-medium'
                    : 'bg-brand-carbon border border-brand-edge-dark text-slate-300 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* The Interactive Inspection Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Inspection Viewport (High-Resolution Aerial Asset Scene with Interactive Markers) */}
          <div className="lg:col-span-7 rounded-sm bg-brand-carbon border border-brand-edge-dark overflow-hidden relative min-h-[420px] sm:min-h-[500px] lg:min-h-[600px] flex items-center justify-center shadow-elevated group">
            {/* High-Resolution Commercial Asset Image */}
            <Image
              src="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
              alt="High-resolution aerial commercial building survey view for interactive defect inspection"
              fill
              className="object-cover object-center filter brightness-[0.88] contrast-[1.05]"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            {/* Viewport HUD Overlays */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-sm bg-brand-void/90 border border-white/10 backdrop-blur-md font-mono text-[10.5px] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE SURVEY GRID: ZONE B · 48MP RESOLUTION</span>
            </div>

            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-sm bg-brand-void/90 border border-white/10 backdrop-blur-md font-mono text-[10.5px] text-slate-300">
              <Camera className="h-3.5 w-3.5 text-brand-electric-bright" />
              <span>{filteredHotspots.length} DEFECTS PINNED</span>
            </div>

            {/* Spatial Hotspot Markers */}
            {filteredHotspots.map((spot) => {
              const isSelected = selectedObs.id === spot.id;
              const isP1 = spot.priority === 'P1';
              const isP2 = spot.priority === 'P2';

              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setSelectedObs(spot)}
                  aria-label={`Select observation ${spot.obsNumber}: ${spot.name}`}
                  style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group/marker transition-all duration-300 cursor-pointer ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  {/* Pulsing ring for selected or P1 items */}
                  {(isSelected || isP1) && (
                    <span 
                      className={`absolute -inset-2 rounded-full animate-ping opacity-60 pointer-events-none ${
                        isP1 ? 'bg-rose-500' : isP2 ? 'bg-amber-400' : 'bg-brand-electric'
                      }`} 
                    />
                  )}

                  {/* Marker Body */}
                  <div 
                    className={`h-7 w-7 rounded-full flex items-center justify-center font-mono text-[10.5px] font-bold shadow-elevated border-2 transition-all ${
                      isSelected
                        ? 'bg-white text-brand-void border-brand-pink ring-4 ring-brand-pink/30'
                        : isP1
                        ? 'bg-rose-600 text-white border-rose-300'
                        : isP2
                        ? 'bg-amber-500 text-white border-amber-200'
                        : 'bg-brand-electric text-white border-blue-200'
                    }`}
                  >
                    {spot.obsNumber.replace('OBS-', '')}
                  </div>

                  {/* Hover Mini Tooltip */}
                  <div className="hidden group-hover/marker:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-sm bg-brand-void border border-brand-edge-dark text-[10px] text-left text-white shadow-2xl z-40 pointer-events-none">
                    <span className="font-mono text-brand-pink block font-bold">{spot.obsNumber} · {spot.priority}</span>
                    <span className="line-clamp-1 font-medium">{spot.name}</span>
                  </div>
                </button>
              );
            })}

            {/* Bottom Legend */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-sm bg-brand-void/90 border border-white/10 backdrop-blur-md text-[11px] font-mono">
              <div className="flex items-center gap-4 text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
                  P1 Critical
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  P2 Urgent
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-electric" />
                  P3 Advisory
                </span>
              </div>

              <span className="text-slate-400 text-[10px]">
                Click any marker to load technical diagnosis
              </span>
            </div>
          </div>

          {/* Right Technical Inspection Dossier Panel */}
          <div className="lg:col-span-5 rounded-sm bg-brand-carbon border border-brand-edge-dark p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-elevated">
            <div className="space-y-5">
              {/* Header: Observation ID & Priority Badge */}
              <div className="flex items-center justify-between border-b border-brand-edge-dark pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-brand-pink font-semibold uppercase tracking-wider">
                    {selectedObs.obsNumber}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">/</span>
                  <span className="text-slate-300 font-mono text-xs">
                    {selectedObs.category}
                  </span>
                </div>

                <div className={`px-2.5 py-1 rounded-sm text-[10.5px] font-mono font-bold flex items-center gap-1.5 border ${
                  selectedObs.priority === 'P1'
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                    : selectedObs.priority === 'P2'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                    : 'bg-blue-500/15 text-blue-300 border-blue-500/40'
                }`}>
                  <AlertTriangle className="h-3 w-3" />
                  <span>{selectedObs.priority} ({selectedObs.priorityLabel})</span>
                </div>
              </div>

              {/* Defect Title */}
              <div className="space-y-1">
                <h3 className="text-xl font-light text-white tracking-tight">
                  {selectedObs.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <MapPin className="h-3.5 w-3.5 text-brand-electric-bright shrink-0" />
                  <span>{selectedObs.location}</span>
                </div>
              </div>

              {/* Diagnostic Observation Details */}
              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 rounded-sm bg-brand-void/70 border border-brand-edge-dark space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                    Diagnostic Analysis &amp; Sensor Capture
                  </span>
                  <p className="font-sans text-xs text-slate-200 leading-relaxed font-light">
                    {selectedObs.observationSummary}
                  </p>
                  <span className="text-[10px] text-brand-electric-bright block pt-1">
                    Sensor: {selectedObs.sensorCapture}
                  </span>
                </div>

                {/* Risk Implication */}
                <div className="p-3.5 rounded-sm bg-rose-950/20 border border-rose-900/30 text-rose-200 text-xs">
                  <strong className="font-sans text-[11px] uppercase tracking-wider block text-rose-300">
                    Operational Risk Factor
                  </strong>
                  <p className="font-sans font-light text-slate-200 mt-1 leading-relaxed">
                    {selectedObs.riskFactor}
                  </p>
                </div>

                {/* EntireFM Engineering Action & Trade */}
                <div className="p-3.5 rounded-sm bg-brand-pink/10 border border-brand-pink/30 space-y-2">
                  <span className="text-[10px] text-brand-pink uppercase tracking-widest block font-bold">
                    Recommended Engineering Scope
                  </span>
                  <p className="font-sans text-xs text-white leading-relaxed font-normal">
                    {selectedObs.recommendedAction}
                  </p>
                  <div className="pt-2 border-t border-brand-pink/20 flex flex-wrap justify-between items-center text-[11px]">
                    <span className="text-slate-300">
                      <strong>Self-Delivered Trade:</strong> {selectedObs.trade}
                    </span>
                    <span className="text-brand-pink-light">
                      SLA: {selectedObs.estimatedTurnaround}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct EntireCAFM Work Order Action CTA */}
            <div className="pt-4 border-t border-brand-edge-dark space-y-3">
              <Link
                href="/tools/drone-inspection-planner"
                className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-brand-pink to-brand-magenta py-3 px-4 text-xs font-medium text-white shadow-elevated hover:shadow-glow-pink transition-all group"
              >
                <span>{selectedObs.cafmAction}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="text-[10.5px] font-mono text-center text-slate-400">
                Direct integration with EntireFM maintenance &amp; rope access operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
