'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  Building2, 
  Layers, 
  Flame, 
  Map, 
  Construction, 
  Box, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Compass,
  Zap,
  Activity,
  HardHat
} from 'lucide-react';
import { GaussianSplatViewer } from '../GaussianSplatViewer';

/* ─────────────────────────────────────────────────────────────────────────────
   01. GENERAL DRONE INSPECTIONS PROOF: SELECTABLE STRUCTURAL BUILDING ZONES
───────────────────────────────────────────────────────────────────────────── */
export function ProofDroneInspections() {
  const [activeZone, setActiveZone] = useState<number>(0);
  const zones = [
    { name: 'Commercial Roof Deck', defect: 'Single-ply membrane tears, standing water ponding, perished flashing seals', resolution: '48MP Optical Zoom', rag: 'Advisory' },
    { name: 'Vertical Façade & Cladding', defect: 'Loose rain-screen rivets, curtain wall mastic shrinkage, cracked glazing', resolution: 'Sub-millimetre Detail', rag: 'Critical' },
    { name: 'High-Level Plant & Chillers', defect: 'AHU vibration mount failure, pipework insulation erosion, condenser blockage', resolution: 'Close-Quarter Flight', rag: 'Routine' },
    { name: 'Parapet Copings & Gutters', defect: 'Mortar loss, silt build-up, downpipe sump blockages, masonry spalling', resolution: 'Nadir & Oblique Scan', rag: 'Urgent' },
  ];

  return (
    <div className="rounded-sm overflow-hidden bg-brand-carbon border border-white/15 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-brand-pink uppercase tracking-widest block">INTERACTIVE PROOF</span>
          <h3 className="text-xl font-light text-white">Commercial Building Multi-Zone Optical Inspection</h3>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-sm border border-white/10">
          UAV PAYLOAD: 48MP ZOOM OPTICS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 relative aspect-[16/10] rounded-sm overflow-hidden bg-slate-950 border border-white/10">
          <Image
            src="/images/drone/inspection_poster.png"
            alt="Commercial drone inspection of building zones"
            fill
            className="object-cover object-center filter brightness-[0.85] contrast-[1.05]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white bg-black/60 backdrop-blur-md p-3 rounded-sm border border-white/15">
            <span>TARGET: {zones[activeZone].name}</span>
            <span className="text-brand-pink">{zones[activeZone].resolution}</span>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">SELECT BUILDING ZONE:</span>
          {zones.map((z, idx) => (
            <button
              key={idx}
              onClick={() => setActiveZone(idx)}
              className={`w-full text-left p-4 rounded-sm border transition-all text-xs space-y-1 ${
                activeZone === idx
                  ? 'bg-brand-void border-brand-pink text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span>{z.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm ${
                  z.rag === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  z.rag === 'Urgent' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>{z.rag}</span>
              </div>
              <p className="text-slate-400 font-light text-[11px] leading-relaxed">{z.defect}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   02. ROOF & GUTTER INSPECTIONS PROOF: INTERACTIVE ROOF DEFECT PLAN
───────────────────────────────────────────────────────────────────────────── */
export function ProofRoofInspections() {
  const [selectedPin, setSelectedPin] = useState<number>(0);
  const pins = [
    { title: 'Single-Ply Lap Seam', issue: 'Split weld seam with moisture capillary draw', fix: 'EntireFM Roofing patch & heat-weld remediation', rag: 'Critical' },
    { title: 'Internal Valley Gutter', issue: 'Standing water surcharge and 40mm organic silt build-up', fix: 'Gutter vacuum clearance & corrosion inhibitor', rag: 'Urgent' },
    { title: 'HVAC Chiller Plinth', issue: 'Cracked lead penetration flashing around refrigeration risers', fix: 'Lead dressing renewal & polyurethane sealant', rag: 'Advisory' },
    { title: 'Parapet Coping Stone', issue: 'Fractured mortar joint and loose fixing clip on high elevation', fix: 'Masonry repointing & mechanical re-fixing', rag: 'Urgent' },
  ];

  return (
    <div className="rounded-sm overflow-hidden bg-brand-carbon border border-white/15 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-brand-pink uppercase tracking-widest block">INTERACTIVE PROOF</span>
          <h3 className="text-xl font-light text-white">Commercial Flat Roof &amp; Valley Gutter Condition Audit</h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-sm border border-emerald-500/20">
          ZERO SCAFFOLDING REQUIRED
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 relative aspect-[16/10] rounded-sm overflow-hidden bg-slate-950 border border-white/10">
          <Image
            src="/images/drone/nav/inspection.png"
            alt="High resolution commercial roof orthomosaic map"
            fill
            className="object-cover object-center filter brightness-[0.9] contrast-[1.05]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 bg-brand-void/90 backdrop-blur-md p-4 rounded-sm border border-white/15 space-y-1 text-xs">
            <div className="flex items-center justify-between text-white font-mono">
              <span className="text-brand-pink font-semibold">{pins[selectedPin].title}</span>
              <span className="text-amber-400">{pins[selectedPin].rag} Defect</span>
            </div>
            <p className="text-slate-300 font-light">{pins[selectedPin].issue}</p>
            <div className="pt-2 border-t border-white/10 text-[11px] text-emerald-400 font-mono">
              REMEDIAL ACTION: {pins[selectedPin].fix}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">AUDIT LOCATIONS:</span>
          {pins.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPin(idx)}
              className={`w-full text-left p-4 rounded-sm border transition-all text-xs space-y-1 ${
                selectedPin === idx
                  ? 'bg-brand-void border-brand-pink text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="font-semibold text-white">{p.title}</div>
              <p className="text-slate-400 font-light text-[11px]">{p.issue}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   03. FAÇADE & ENVELOPE PROOF: VERTICAL ELEVATION DEFECT MAPPING
───────────────────────────────────────────────────────────────────────────── */
export function ProofFacadeEnvelope() {
  const [activeElevation, setActiveElevation] = useState<string>('North Elevation');
  return (
    <div className="rounded-sm overflow-hidden bg-brand-carbon border border-white/15 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-brand-pink uppercase tracking-widest block">INTERACTIVE PROOF</span>
          <h3 className="text-xl font-light text-white">Multi-Storey Vertical Elevation Defect Mapping</h3>
        </div>
        <div className="flex items-center gap-2">
          {['North Elevation', 'South Elevation'].map((el) => (
            <button
              key={el}
              onClick={() => setActiveElevation(el)}
              className={`px-3 py-1 rounded-sm text-xs font-mono transition-all border ${
                activeElevation === el ? 'bg-brand-pink border-brand-pink text-white' : 'bg-white/5 border-white/10 text-slate-300'
              }`}
            >
              {el}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 relative h-[380px] sm:h-[440px] rounded-sm overflow-hidden bg-slate-950 border border-white/10">
          <Image
            src="/images/editorial/building-safety-facade-inspection.jpg"
            alt="Multi-storey vertical façade and curtain wall inspection"
            fill
            className="object-cover object-center filter brightness-[0.85] contrast-[1.05]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-white bg-black/70 backdrop-blur-md p-3 rounded-sm border border-white/15">
            <span>ELEVATION: {activeElevation.toUpperCase()}</span>
            <div className="text-brand-pink text-[11px]">4K OPTICAL CAPTURE · IRATA REPAIR READY</div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4 text-xs">
          <div className="p-4 rounded-sm bg-white/5 border border-white/10 space-y-1">
            <span className="font-mono text-brand-pink uppercase tracking-widest text-[10px] font-semibold">FLOORS 08–12: CURTAIN WALLING</span>
            <h4 className="font-semibold text-white text-sm">Glazing Gasket &amp; Pressure Plate Audit</h4>
            <p className="text-slate-300 font-light">Perished EPDM rubber gasket shrinkage identified along vertical mullions, allowing wind-driven moisture into perimeter transoms.</p>
          </div>

          <div className="p-4 rounded-sm bg-white/5 border border-white/10 space-y-1">
            <span className="font-mono text-amber-400 uppercase tracking-widest text-[10px] font-semibold">FLOORS 03–07: RAIN-SCREEN CLADDING</span>
            <h4 className="font-semibold text-white text-sm">Mastic Expansion Joints &amp; Panel Fixings</h4>
            <p className="text-slate-300 font-light">Adhesive failure and silicone split along horizontal expansion joints. Zero loose rivet fixings detected across windward corner panels.</p>
          </div>

          <div className="p-4 rounded-sm bg-brand-void border border-brand-pink/40 space-y-1 text-slate-200">
            <span className="font-mono text-emerald-400 uppercase tracking-widest text-[10px] font-semibold">REMEDIATION DELIVERY: ENTIREFM ROPE ACCESS</span>
            <p className="text-[11px] font-light">Directly-employed IRATA technicians dispatched to exact elevation coordinates for resealing and panel replacement without scaffolding.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   04. THERMAL IMAGING PROOF: RGB ↔ FLIR RADIOMETRIC REVEAL
───────────────────────────────────────────────────────────────────────────── */
export function ProofThermalImaging() {
  const [sliderPos, setSliderPos] = useState<number>(50);

  return (
    <div className="rounded-sm overflow-hidden bg-brand-carbon border border-white/15 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-brand-pink uppercase tracking-widest block">INTERACTIVE PROOF</span>
          <h3 className="text-xl font-light text-white">Radiometric FLIR Thermal Delta-T Reveal</h3>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-sm border border-white/10">
          DRAG SLIDER TO REVEAL THERMAL MOISTURE
        </span>
      </div>

      <div className="relative h-[360px] sm:h-[440px] w-full rounded-sm overflow-hidden bg-slate-950 cursor-ew-resize select-none border border-white/15 shadow-2xl">
        {/* RGB Optical Base */}
        <div className="absolute inset-0">
          <Image
            src="/images/editorial/entirefm-hvac-rooftop-condensers-2560w.webp"
            alt="Visible RGB rooftop condensers"
            fill
            className="object-cover object-center filter brightness-[0.85] contrast-[1.05]"
            sizes="100vw"
          />
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-sm bg-black/70 backdrop-blur-md border border-white/15 text-xs font-mono text-white">
            VISIBLE SPECTRUM (RGB)
          </div>
        </div>

        {/* Thermal Layer (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <Image
            src="/images/editorial/entirefm-hvac-thermal-survey-2000w.webp"
            alt="Radiometric thermal rooftop survey"
            fill
            className="object-cover object-center filter brightness-[1.0] contrast-[1.15]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#020024] via-[#5c0e8a] to-[#ff7b00] mix-blend-color opacity-85 pointer-events-none" />
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-sm bg-brand-void/90 backdrop-blur-md border border-brand-pink/40 text-xs font-mono text-brand-pink">
            FLIR RADIOMETRIC THERMAL (DELTA-T)
          </div>
        </div>

        {/* Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-brand-pink shadow-glow pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-brand-void border-2 border-brand-pink flex items-center justify-center text-white text-xs font-bold">
            ↔
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono text-slate-300">
        <div className="p-3 rounded-sm bg-white/5 border border-white/10">
          <span className="text-brand-pink block font-bold">DELTA-T: +4.2°C</span>
          <span className="text-slate-400 font-light">Sub-membrane water entrapment retaining daytime solar heat</span>
        </div>
        <div className="p-3 rounded-sm bg-white/5 border border-white/10">
          <span className="text-amber-400 block font-bold">CALIBRATION: RADIOMETRIC</span>
          <span className="text-slate-400 font-light">Pixel-by-pixel temperature metadata for engineering review</span>
        </div>
        <div className="p-3 rounded-sm bg-white/5 border border-white/10">
          <span className="text-emerald-400 block font-bold">REMEDIATION: TARGETED</span>
          <span className="text-slate-400 font-light">Isolates wet insulation sections without full roof replacement</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   05. SOLAR PV INSPECTIONS PROOF: PANEL-ARRAY HEATMAP SCANNER
───────────────────────────────────────────────────────────────────────────── */
export function ProofSolarPv() {
  const [activeAnomaly, setActiveAnomaly] = useState<number>(0);
  const anomalies = [
    { title: 'Bypass Diode Failure', desc: 'Open-circuit diode causing one-third of the panel to overheat, reducing string output by 33%.', severity: 'Critical', yieldLoss: '-8.5% String Loss' },
    { title: 'Localised Cell Hotspot', desc: 'Semiconductor short circuit exhibiting high thermal delta with localized fire risk.', severity: 'Critical', yieldLoss: '-4.2% Panel Loss' },
    { title: 'String-Level Inverter Imbalance', desc: 'Disconnected or high-resistance series connector reducing generation across 24 modules.', severity: 'Urgent', yieldLoss: '-100% String Loss' },
    { title: 'Surface Soiling & Silt', desc: 'Vegetation buildup and dust accumulation reducing irradiance absorption.', severity: 'Routine', yieldLoss: '-3.1% Array Loss' },
  ];

  return (
    <div className="rounded-sm overflow-hidden bg-brand-carbon border border-white/15 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-brand-pink uppercase tracking-widest block">INTERACTIVE PROOF</span>
          <h3 className="text-xl font-light text-white">Commercial Solar PV Array Thermographic Scan</h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-sm border border-emerald-500/20">
          IEC 62446-3 COMPLIANT SURVEY
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 relative aspect-[16/10] rounded-sm overflow-hidden bg-slate-950 border border-white/10">
          <Image
            src="/images/drone/nav/thermal.png"
            alt="Solar PV farm drone radiometric thermal inspection"
            fill
            className="object-cover object-center filter brightness-[0.9] contrast-[1.05]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 bg-brand-void/90 backdrop-blur-md p-3.5 rounded-sm border border-white/15 text-xs">
            <div className="flex items-center justify-between font-mono">
              <span className="text-brand-pink font-semibold">{anomalies[activeAnomaly].title}</span>
              <span className="text-amber-400 font-bold">{anomalies[activeAnomaly].yieldLoss}</span>
            </div>
            <p className="text-slate-300 font-light text-[11px] pt-1">{anomalies[activeAnomaly].desc}</p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">IDENTIFIED ANOMALIES:</span>
          {anomalies.map((a, idx) => (
            <button
              key={idx}
              onClick={() => setActiveAnomaly(idx)}
              className={`w-full text-left p-3.5 rounded-sm border transition-all text-xs space-y-1 ${
                activeAnomaly === idx
                  ? 'bg-brand-void border-brand-pink text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span>{a.title}</span>
                <span className="text-[10px] font-mono text-brand-pink">{a.yieldLoss}</span>
              </div>
              <p className="text-slate-400 font-light text-[11px]">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   06. SURVEYING & MAPPING PROOF: 4-STAGE GEOSPATIAL PIPELINE
───────────────────────────────────────────────────────────────────────────── */
export function ProofSurveyingMapping() {
  const [stage, setStage] = useState<number>(1);
  const stages = [
    { num: '01', title: 'Raw Flight Photogrammetry', desc: 'Thousands of high-overlap nadir photos captured with RTK satellite positioning.' },
    { num: '02', title: '2D Orthomosaic Map', desc: 'Georeferenced, distortion-free orthophoto aligned to British National Grid (OSGB36).' },
    { num: '03', title: 'Digital Elevation Model', desc: 'Topographic contour layers and slope gradient elevation vectors.' },
    { num: '04', title: 'CAD / GIS Vector Export', desc: 'Layered DXF/DWG files ready for civil engineers, architects, and CAFM.' },
  ];

  return (
    <div className="rounded-sm overflow-hidden bg-brand-carbon border border-white/15 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-brand-pink uppercase tracking-widest block">INTERACTIVE PROOF</span>
          <h3 className="text-xl font-light text-white">From Airspace Capture to Survey-Grade GIS Spatial Data</h3>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-sm border border-cyan-500/20">
          RTK SUB-CENTIMETRE ACCURACY
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 relative aspect-[16/10] rounded-sm overflow-hidden bg-slate-950 border border-white/10">
          <Image
            src="/images/drone/surveying_poster.png"
            alt="Survey-grade drone mapping and orthomosaic capture"
            fill
            className="object-cover object-center filter brightness-[0.85] contrast-[1.05]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 bg-brand-void/90 backdrop-blur-md p-3.5 rounded-sm border border-white/15 text-xs font-mono text-white">
            <span className="text-brand-pink">STAGE {stages[stage].num}: {stages[stage].title.toUpperCase()}</span>
            <p className="text-slate-300 font-light text-[11px] font-sans pt-1">{stages[stage].desc}</p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">DATA CONVERSION STAGES:</span>
          {stages.map((st, idx) => (
            <button
              key={idx}
              onClick={() => setStage(idx)}
              className={`w-full text-left p-3.5 rounded-sm border transition-all text-xs space-y-1 ${
                stage === idx
                  ? 'bg-brand-void border-brand-pink text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                <span className="font-mono text-brand-pink">{st.num}</span>
                <span>{st.title}</span>
              </div>
              <p className="text-slate-400 font-light text-[11px]">{st.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   07. CONSTRUCTION MONITORING PROOF: CHRONOLOGICAL MILESTONE TIMELINE
───────────────────────────────────────────────────────────────────────────── */
export function ProofConstructionTimeline() {
  const [activePhase, setActivePhase] = useState<number>(1);
  const phases = [
    { phase: 'Month 01: Groundworks & Piling', desc: 'Earthworks cut/fill volumetrics, boundary verification, piling rig positioning.', metric: '100% Earthworks Baseline' },
    { phase: 'Month 03: Structural Frame', desc: 'Steel frame erection verification, concrete floor slab curing, crane clearway checks.', metric: 'Steelwork Erected' },
    { phase: 'Month 06: Envelope & Cladding', desc: 'Curtain wall installation, roof membrane sealing, weather-tightness milestone.', metric: 'Building Envelope Sealed' },
    { phase: 'Month 09: Final Handover & Snagging', desc: 'External finishes, car park relining, landscaping handover to EntireFM Total FM.', metric: 'FM Mobilisation Ready' },
  ];

  return (
    <div className="rounded-sm overflow-hidden bg-brand-carbon border border-white/15 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-brand-pink uppercase tracking-widest block">INTERACTIVE PROOF</span>
          <h3 className="text-xl font-light text-white">Repeat GPS-Locked Construction Milestone Documentation</h3>
        </div>
        <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-sm border border-amber-500/20">
          AUTONOMOUS REPEAT WAYPOINTS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 relative aspect-[16/10] rounded-sm overflow-hidden bg-slate-950 border border-white/10">
          <Image
            src="/images/drone/construction_poster.png"
            alt="Construction drone monitoring and milestone tracking"
            fill
            className="object-cover object-center filter brightness-[0.85] contrast-[1.05]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 bg-brand-void/90 backdrop-blur-md p-3.5 rounded-sm border border-white/15 text-xs">
            <span className="font-mono text-brand-pink font-semibold block">{phases[activePhase].phase}</span>
            <p className="text-slate-300 font-light text-[11px] pt-1">{phases[activePhase].desc}</p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">DEVELOPMENT TIMELINE:</span>
          {phases.map((ph, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhase(idx)}
              className={`w-full text-left p-3.5 rounded-sm border transition-all text-xs space-y-1 ${
                activePhase === idx
                  ? 'bg-brand-void border-brand-pink text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span>{ph.phase.split(':')[0]}</span>
                <span className="font-mono text-[10px] text-amber-400">{ph.metric}</span>
              </div>
              <p className="text-slate-400 font-light text-[11px]">{ph.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   08. DIGITAL TWIN & 3D CAPTURE PROOF: GAUSSIAN SPLAT & POINT CLOUD MODELS
───────────────────────────────────────────────────────────────────────────── */
export function ProofDigitalTwin3D() {
  return (
    <div className="rounded-sm overflow-hidden bg-brand-carbon border border-white/15 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-brand-pink uppercase tracking-widest block">INTERACTIVE PROOF</span>
          <h3 className="text-xl font-light text-white">3D Gaussian Splatting &amp; Navigable Spatial Twin</h3>
        </div>
        <span className="text-xs font-mono text-brand-pink bg-brand-pink/10 px-3 py-1 rounded-sm border border-brand-pink/20">
          540,274 SPATIAL SPLATS
        </span>
      </div>

      <div className="w-full">
        <GaussianSplatViewer
          splatUrl="/assets/gaussian-splats/04_05_2026.ksplat"
          splatCount={540274}
          title="LIVE 3D DIGITAL TWIN · GAUSSIAN SPLAT"
          subtitle="Directly Navigable Radiance Field · Polycam Capture"
          initialCameraPosition={[0, 3.5, 6.5]}
          initialCameraLookAt={[0, 0.8, 0]}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   09. VOLUMETRIC SURVEYS PROOF: STOCKPILE & CUT/FILL CALCULATION
───────────────────────────────────────────────────────────────────────────── */
export function ProofVolumetricSurveys() {
  return (
    <div className="rounded-sm overflow-hidden bg-brand-carbon border border-white/15 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-brand-pink uppercase tracking-widest block">INTERACTIVE PROOF</span>
          <h3 className="text-xl font-light text-white">3D Earthworks Cut/Fill &amp; Stockpile Volume Calculation</h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-sm border border-emerald-500/20">
          ±1.2% VOLUMETRIC PRECISION
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 relative aspect-[16/10] rounded-sm overflow-hidden bg-slate-950 border border-white/10">
          <Image
            src="/images/drone/nav/surveying.png"
            alt="Stockpile and volumetric terrain survey"
            fill
            className="object-cover object-center filter brightness-[0.85] contrast-[1.05]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 bg-brand-void/90 backdrop-blur-md p-3.5 rounded-sm border border-white/15 text-xs font-mono text-white">
            <span className="text-brand-pink block">VOLUME COMPUTATION: 14,820 m³</span>
            <span className="text-slate-300 font-light text-[11px]">CALCULATED DENSITY: 1.65 t/m³ · TONNAGE: 24,453 TONNES</span>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3 text-xs">
          <div className="p-4 rounded-sm bg-white/5 border border-white/10 space-y-1">
            <span className="font-mono text-brand-pink uppercase tracking-widest text-[10px]">APPLICATION 01</span>
            <h4 className="font-semibold text-white">Bulk Material &amp; Aggregate Stockpiles</h4>
            <p className="text-slate-300 font-light">Eliminate high-risk physical climbing on shifting heaps. Precise laser-calibrated aerial photogrammetry generates certified tonnage audits.</p>
          </div>
          <div className="p-4 rounded-sm bg-white/5 border border-white/10 space-y-1">
            <span className="font-mono text-amber-400 uppercase tracking-widest text-[10px]">APPLICATION 02</span>
            <h4 className="font-semibold text-white">Civil Earthworks Cut / Fill Balance</h4>
            <p className="text-slate-300 font-light">Compare design CAD surfaces against current excavation levels to calculate exact import/export volumes, preventing subcontractor overcharging.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   10. AERIAL PHOTOGRAPHY & 6K FILM PROOF: ARCHITECTURAL CINEMATOGRAPHY
───────────────────────────────────────────────────────────────────────────── */
export function ProofAerialPhotography() {
  return (
    <div className="rounded-sm overflow-hidden bg-brand-carbon border border-white/15 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-brand-pink uppercase tracking-widest block">CINEMATIC SHOWCASE</span>
          <h3 className="text-xl font-light text-white">6K Broadcast Architectural Cinematography</h3>
        </div>
        <span className="text-xs font-mono text-brand-pink bg-brand-pink/10 px-3 py-1 rounded-sm border border-brand-pink/20">
          PRORES 422 HQ / RAW 48MP
        </span>
      </div>

      <div className="relative aspect-[16/9] rounded-sm overflow-hidden bg-slate-950 border border-white/10 shadow-2xl">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/drone/photography_poster.png"
          className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.05]"
        >
          <source src="/video/drone/photography.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-white bg-black/60 backdrop-blur-md p-3 rounded-sm border border-white/15">
          <span>COMMERCIAL REAL ESTATE &amp; PORTFOLIO MARKETING</span>
          <span className="text-brand-pink">COLOR GRADED 4K/6K MASTERS</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   11. EMERGENCY & INSURANCE SURVEYS PROOF: RAPID DAMAGE EVIDENCE DOSSIER
───────────────────────────────────────────────────────────────────────────── */
export function ProofEmergencyInsurance() {
  return (
    <div className="rounded-sm overflow-hidden bg-brand-carbon border border-white/15 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-brand-pink uppercase tracking-widest block">INTERACTIVE PROOF</span>
          <h3 className="text-xl font-light text-white">Rapid Storm Damage Triage &amp; Insurer Evidence Dossier</h3>
        </div>
        <span className="text-xs font-mono text-red-400 bg-red-500/10 px-3 py-1 rounded-sm border border-red-500/20">
          RAPID EMERGENCY RESPONSE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 relative aspect-[16/10] rounded-sm overflow-hidden bg-slate-950 border border-white/10">
          <Image
            src="/images/editorial/entirefm-external-distribution-dusk-2000w.webp"
            alt="Emergency commercial roof storm damage survey"
            fill
            className="object-cover object-center filter brightness-[0.85] contrast-[1.05]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 bg-brand-void/90 backdrop-blur-md p-3.5 rounded-sm border border-white/15 text-xs">
            <span className="font-mono text-red-400 font-semibold block">EVIDENCE BUNDLE: METADATA &amp; GPS-TIMESTAMPED</span>
            <p className="text-slate-300 font-light text-[11px] pt-1">Safe remote visual access into structurally unsafe building areas prior to physical scaffolding.</p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3 text-xs">
          <div className="p-4 rounded-sm bg-white/5 border border-white/10 space-y-1">
            <span className="font-mono text-brand-pink uppercase tracking-widest text-[10px]">STEP 01</span>
            <h4 className="font-semibold text-white">Safe High-Speed Aerial Triage</h4>
            <p className="text-slate-300 font-light">Inspect dislodged roof sheets, shattered skylights, and collapsed gutters from a safe standoff distance without putting staff onto fragile roofs.</p>
          </div>
          <div className="p-4 rounded-sm bg-white/5 border border-white/10 space-y-1">
            <span className="font-mono text-emerald-400 uppercase tracking-widest text-[10px]">STEP 02</span>
            <h4 className="font-semibold text-white">EntireFM 24/7 Emergency Make-Safe</h4>
            <p className="text-slate-300 font-light">Direct dispatch of roofing and fabric engineers to secure temporary tarpaulins, remove dangerous cladding, and prepare permanent repair quotes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
