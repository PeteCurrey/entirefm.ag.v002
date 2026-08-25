'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Layers, 
  Flame, 
  Building2, 
  Map, 
  Box, 
  CalendarClock, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Maximize2,
  Sliders,
  ShieldCheck
} from 'lucide-react';

interface DefectMarker {
  id: number;
  x: number; // percentage
  y: number; // percentage
  title: string;
  type: string;
  severity: 'Critical' | 'Urgent' | 'Advisory';
  recommendation: string;
}

const ROOF_DEFECTS: DefectMarker[] = [
  {
    id: 1,
    x: 28,
    y: 35,
    title: 'Single-Ply Membrane Lap Delamination',
    type: 'Waterproofing Breach',
    severity: 'Critical',
    recommendation: 'Targeted hot-air weld patch & perimeter mastic reseal via rope access technician.',
  },
  {
    id: 2,
    x: 65,
    y: 22,
    title: 'Valley Gutter Silt & Vegetation Blockage',
    type: 'Rainwater Drainage',
    severity: 'Urgent',
    recommendation: 'Commercial gutter vacuum clearance & downpipe flush before rainfall surcharge.',
  },
  {
    id: 3,
    x: 74,
    y: 68,
    title: 'Perished Lead Flashing at HVAC Plinth',
    type: 'Perimeter Flashing',
    severity: 'Urgent',
    recommendation: 'Dress new Code 4 lead flashing and renew polyurethane upstand seal.',
  },
  {
    id: 4,
    x: 42,
    y: 75,
    title: 'Standing Water Ponding (Depression)',
    type: 'Drainage Gradient',
    severity: 'Advisory',
    recommendation: 'Monitor during quarterly PPM; assess insulation fall taper for future CapEx.',
  },
];

export function DroneSampleOutputs() {
  const [activeTab, setActiveTab] = useState<'roof' | 'thermal' | 'facade' | 'ortho' | 'pointcloud' | 'construction'>('roof');
  const [selectedDefect, setSelectedDefect] = useState<DefectMarker>(ROOF_DEFECTS[0]);
  const [thermalMode, setThermalMode] = useState<'thermal' | 'optical'>('thermal');
  const [constructionMilestone, setConstructionMilestone] = useState<'groundworks' | 'framing' | 'envelope'>('envelope');

  return (
    <section className="py-24 bg-white border-b border-slate-200" id="technical-deliverables">
      <div className="container-custom space-y-14">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-pink">
              ENGINEERING DELIVERABLES
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
            Sample Technical Output Visualisations
          </h2>

          <p className="text-base text-slate-600 leading-relaxed font-light">
            Explore how raw aerial survey data is processed into structured, georeferenced engineering deliverables for property managers and building surveyors.
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'roof', label: 'Roof Defect Map', icon: Layers },
            { id: 'thermal', label: 'Thermal Anomaly Heatmap', icon: Flame },
            { id: 'facade', label: 'Façade Elevation Zoning', icon: Building2 },
            { id: 'ortho', label: '2D Orthomosaic GIS', icon: Map },
            { id: 'pointcloud', label: '3D Reality Mesh / Point Cloud', icon: Box },
            { id: 'construction', label: 'Construction Progress Timeline', icon: CalendarClock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#0B1220] text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-pink' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ROOF DEFECT MAP */}
        {/* ========================================================================= */}
        {activeTab === 'roof' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visualizer Frame with Interactive Marker Pins */}
            <div className="lg:col-span-8 bg-[#0B1220] rounded-[14px] p-4 sm:p-6 border border-slate-200 shadow-elevated relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-white text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>SAMPLE DATASET: Commercial Logistics Roofscape (GSD: 3.2mm/px)</span>
                </div>
                <span className="text-slate-400">Interactive Marker Pins Active</span>
              </div>

              {/* Viewport Image Frame */}
              <div className="relative h-[380px] sm:h-[480px] rounded-[8px] overflow-hidden bg-slate-900 border border-white/10">
                <Image
                  src="/images/editorial/entirefm-hvac-plant-deck-2000w.webp"
                  alt="High-resolution aerial roof survey with defect markers"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
                <div className="absolute inset-0 bg-slate-950/20" />

                {/* Numbered Defect Marker Pins */}
                {ROOF_DEFECTS.map((defect) => {
                  const isSelected = selectedDefect.id === defect.id;
                  return (
                    <button
                      key={defect.id}
                      type="button"
                      onClick={() => setSelectedDefect(defect)}
                      style={{ left: `${defect.x}%`, top: `${defect.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'w-9 h-9 bg-brand-pink text-white ring-4 ring-brand-pink/40 z-20 scale-110 shadow-lg'
                          : 'w-7 h-7 bg-red-600/90 hover:bg-red-500 text-white ring-2 ring-white/80 z-10'
                      }`}
                      aria-label={`Select defect ${defect.id}: ${defect.title}`}
                    >
                      <span className="font-mono text-xs font-bold">{defect.id}</span>
                    </button>
                  );
                })}
              </div>

              {/* Viewport Footer Bar */}
              <div className="pt-3 mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Coordinates: 53.4808° N, 2.2426° W (RTK Calibrated)</span>
                <span>Click pin marker to inspect defect record</span>
              </div>
            </div>

            {/* Selected Defect Detail Card */}
            <div className="lg:col-span-4 p-6 rounded-[14px] bg-[#FAF9FB] border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand-pink bg-brand-pink/10 px-2.5 py-1 rounded-sm">
                  OBSERVATION #{selectedDefect.id}
                </span>
                <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${
                  selectedDefect.severity === 'Critical'
                    ? 'bg-red-100 text-red-700'
                    : selectedDefect.severity === 'Urgent'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {selectedDefect.severity} Priority
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedDefect.title}
                </h3>
                <span className="text-xs font-mono text-slate-500 mt-1 block">
                  Category: {selectedDefect.type}
                </span>
              </div>

              <div className="p-4 rounded-sm bg-white border border-slate-200 space-y-1.5">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block">
                  EntireFM Actionable Remediation
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedDefect.recommendation}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>CAFM Work Order Automatically Scoped</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Trade Allocation: Rope Access / Roofing</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: THERMAL ANOMALY HEATMAP */}
        {/* ========================================================================= */}
        {activeTab === 'thermal' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-[#0B1220] rounded-[14px] p-4 sm:p-6 border border-slate-200 shadow-elevated space-y-4">
              <div className="flex items-center justify-between text-white text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>FLIR Radiometric Infrared Layer (Delta-T: 6.8°C Anomaly Detected)</span>
                </div>

                <div className="flex items-center gap-1 bg-white/10 rounded-sm p-1">
                  <button
                    type="button"
                    onClick={() => setThermalMode('thermal')}
                    className={`px-3 py-1 rounded-sm text-[11px] font-bold transition-colors ${
                      thermalMode === 'thermal' ? 'bg-brand-pink text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Thermal (Ironbow)
                  </button>
                  <button
                    type="button"
                    onClick={() => setThermalMode('optical')}
                    className={`px-3 py-1 rounded-sm text-[11px] font-bold transition-colors ${
                      thermalMode === 'optical' ? 'bg-brand-pink text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Optical (RGB)
                  </button>
                </div>
              </div>

              {/* Thermal Viewport */}
              <div className="relative h-[380px] sm:h-[460px] rounded-[8px] overflow-hidden bg-slate-900 border border-white/10">
                <Image
                  src={thermalMode === 'thermal' 
                    ? '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp' 
                    : '/images/editorial/entirefm-hvac-rooftop-condensers-2560w.webp'}
                  alt="Radiometric thermal drone survey visualization"
                  fill
                  className="object-cover transition-opacity duration-500"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />

                {/* Radiometric Palette Scale Overlay */}
                <div className="absolute right-4 bottom-4 top-4 w-6 bg-gradient-to-t from-indigo-950 via-purple-700 via-amber-500 to-yellow-200 rounded-sm border border-white/40 flex flex-col justify-between p-1 text-[9px] font-mono text-white text-right select-none shadow-md">
                  <span>+18°C</span>
                  <span>+12°C</span>
                  <span>+6°C</span>
                  <span>0°C</span>
                </div>

                {/* Thermal Anomaly Callout Box */}
                <div className="absolute top-1/4 left-1/3 p-3 rounded-sm bg-black/80 backdrop-blur-md border border-amber-500 text-white space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono text-[11px]">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Zone T-04: Sub-Membrane Saturated Insulation</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Surface Temp: 14.2°C (Ambient Delta-T +5.4°C retention)
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-[14px] bg-[#FAF9FB] border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-brand-pink" />
                <h3 className="text-lg font-bold text-slate-900">
                  Radiometric Diagnostics
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                By capturing thermal signatures during post-sunset cooling, EntireFM identifies trapped moisture within flat roof insulation slabs before water breaches the structural ceiling.
              </p>

              <div className="space-y-3 pt-2 border-t border-slate-200 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-sm space-y-1">
                  <strong className="text-slate-900 block font-semibold">1. Diagnostic Identification</strong>
                  <p className="text-slate-600">Saturated insulation retains stored daytime solar heat, appearing as an illuminated warm thermal mass.</p>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-sm space-y-1">
                  <strong className="text-slate-900 block font-semibold">2. Targeted Remediation</strong>
                  <p className="text-slate-600">Avoids full roof replacement by stripping and replacing only the isolated damp insulation core.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FAÇADE ELEVATION ZONING */}
        {/* ========================================================================= */}
        {activeTab === 'facade' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-[#0B1220] rounded-[14px] p-4 sm:p-6 border border-slate-200 shadow-elevated space-y-4">
              <div className="flex items-center justify-between text-white text-xs font-mono border-b border-white/10 pb-3">
                <span>VERTICAL FAÇADE SURVEY: North Elevation (Grid Lines 01–12)</span>
                <span className="text-brand-pink">Resolution: 1.8mm/px</span>
              </div>

              <div className="relative h-[380px] sm:h-[460px] rounded-[8px] overflow-hidden bg-slate-900 border border-white/10">
                <Image
                  src="/images/editorial/entirefm-hero-headquarters-2560w.webp"
                  alt="Façade elevation survey grid with defect zoning"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
                {/* Elevation Overlay Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 border border-brand-pink/30 pointer-events-none">
                  <div className="border border-white/15 p-2 text-[10px] font-mono text-white/70">Zone A1 (Fl. 8–10)</div>
                  <div className="border border-white/15 p-2 text-[10px] font-mono text-white/70">Zone A2 (Fl. 8–10)</div>
                  <div className="border border-white/15 p-2 text-[10px] font-mono text-white/70">Zone A3 (Fl. 8–10)</div>
                  <div className="border border-white/15 p-2 text-[10px] font-mono text-white/70">Zone A4 (Fl. 8–10)</div>
                  <div className="border border-white/15 p-2 text-[10px] font-mono text-white/70">Zone B1 (Fl. 4–7)</div>
                  <div className="border border-brand-pink/80 bg-brand-pink/10 p-2 text-[10px] font-mono text-brand-pink font-bold">
                    Zone B2: Mastic Delamination
                  </div>
                  <div className="border border-white/15 p-2 text-[10px] font-mono text-white/70">Zone B3 (Fl. 4–7)</div>
                  <div className="border border-white/15 p-2 text-[10px] font-mono text-white/70">Zone B4 (Fl. 4–7)</div>
                  <div className="border border-white/15 p-2 text-[10px] font-mono text-white/70">Zone C1 (Fl. 1–3)</div>
                  <div className="border border-white/15 p-2 text-[10px] font-mono text-white/70">Zone C2 (Fl. 1–3)</div>
                  <div className="border border-white/15 p-2 text-[10px] font-mono text-white/70">Zone C3 (Fl. 1–3)</div>
                  <div className="border border-white/15 p-2 text-[10px] font-mono text-white/70">Zone C4 (Fl. 1–3)</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-[14px] bg-[#FAF9FB] border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-pink" />
                <h3 className="text-lg font-bold text-slate-900">
                  Elevation Defect Indexing
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Vertical facade surveys are indexed by elevation, bay number, and floor level so rope access teams or cradle operators can navigate directly to the defect coordinate.
              </p>

              <div className="p-4 rounded-sm bg-white border border-slate-200 space-y-2 text-xs">
                <span className="font-mono font-bold text-slate-900 block">Zoned Defect Log:</span>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• <strong>Zone B2:</strong> Vertical expansion silicone debonding (Bay 5–6)</li>
                  <li>• <strong>Zone A3:</strong> Louvre panel fixing vibration looseness</li>
                  <li>• <strong>Zone C1:</strong> Spalling render at podium soffit interface</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: 2D ORTHOMOSAIC GIS */}
        {/* ========================================================================= */}
        {activeTab === 'ortho' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-[#0B1220] rounded-[14px] p-4 sm:p-6 border border-slate-200 shadow-elevated space-y-4">
              <div className="flex items-center justify-between text-white text-xs font-mono border-b border-white/10 pb-3">
                <span>ESTATE ORTHOMOSAIC: 2D Georeferenced GeoTIFF (WGS84 / British National Grid)</span>
                <span className="text-emerald-400">RTK Calibrated (15mm Accuracy)</span>
              </div>

              <div className="relative h-[380px] sm:h-[460px] rounded-[8px] overflow-hidden bg-slate-900 border border-white/10">
                <Image
                  src="/images/editorial/entirefm-totem-headquarters-2000w.webp"
                  alt="2D aerial orthomosaic mapping survey"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />

                {/* Map Scale & Compass Overlay */}
                <div className="absolute bottom-4 left-4 p-2.5 rounded-sm bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] space-y-1">
                  <div>Scale: 1:250 (0 —— 10m —— 20m)</div>
                  <div>GSD: 1.4 cm/px | Ground Control Points: 8 Verified</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-[14px] bg-[#FAF9FB] border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-brand-pink" />
                <h3 className="text-lg font-bold text-slate-900">
                  Survey-Grade Orthomosaics
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Stitched from hundreds of overlapping nadir photographs with perspective distortion removed. Ideal for masterplanning, boundary validation, and CAD/GIS integration.
              </p>

              <div className="p-4 rounded-sm bg-white border border-slate-200 space-y-2 text-xs">
                <span className="font-mono font-bold text-slate-900 block">Export Formats:</span>
                <p className="text-slate-600">GeoTIFF, ECW, DXF Contours, Shapefile (SHP), LandXML digital surface models.</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: 3D REALITY MESH & POINT CLOUD */}
        {/* ========================================================================= */}
        {activeTab === 'pointcloud' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-[#0B1220] rounded-[14px] p-4 sm:p-6 border border-slate-200 shadow-elevated space-y-4">
              <div className="flex items-center justify-between text-white text-xs font-mono border-b border-white/10 pb-3">
                <span>3D REALITY CAPTURE: Textured Photogrammetric Mesh (12.4M Triangles)</span>
                <span className="text-brand-pink">Point Density: 4,200 pts/m²</span>
              </div>

              <div className="relative h-[380px] sm:h-[460px] rounded-[8px] overflow-hidden bg-slate-950 border border-white/10 flex items-center justify-center">
                <Image
                  src="/images/editorial/entirefm-distribution-board-testing-2000w.webp"
                  alt="3D Reality mesh digital twin model"
                  fill
                  className="object-cover opacity-75"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />

                {/* 3D Wireframe / HUD Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 flex flex-col justify-between p-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-mono text-[11px] w-fit">
                    <Box className="w-3.5 h-3.5 text-brand-pink" />
                    <span>Interactive 3D Digital Twin Simulation</span>
                  </div>

                  <div className="p-4 rounded-sm bg-black/80 border border-white/20 text-white font-mono text-xs max-w-sm space-y-1">
                    <div className="text-brand-pink font-bold">Virtual Measurement Tool:</div>
                    <div className="text-slate-300">Deck Area: 1,842.6 m² | Ridge Height: 24.8m</div>
                    <div className="text-slate-400 text-[10px]">Direct BIM Export (LAS, LAZ, OBJ, RCP)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-[14px] bg-[#FAF9FB] border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-brand-pink" />
                <h3 className="text-lg font-bold text-slate-900">
                  Persistent 3D Asset Record
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Create a persistent, millimeter-accurate spatial model of your building. Measure dimensions, calculate roof slopes, and review plant assets remotely without site visits.
              </p>

              <div className="p-4 rounded-sm bg-white border border-slate-200 space-y-2 text-xs">
                <span className="font-mono font-bold text-slate-900 block">BIM / CAFM Use Cases:</span>
                <p className="text-slate-600">Revit as-built drafting, clash detection for new plant retrofits, and landlord dilapidation baseline comparisons.</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: CONSTRUCTION PROGRESS TIMELINE */}
        {/* ========================================================================= */}
        {activeTab === 'construction' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-[#0B1220] rounded-[14px] p-4 sm:p-6 border border-slate-200 shadow-elevated space-y-4">
              <div className="flex items-center justify-between text-white text-xs font-mono border-b border-white/10 pb-3">
                <span>CONSTRUCTION TIMELINE: Milestone Comparison (GPS-Locked Waypoint Mission)</span>

                <div className="flex items-center gap-1 bg-white/10 rounded-sm p-1">
                  <button
                    type="button"
                    onClick={() => setConstructionMilestone('groundworks')}
                    className={`px-2.5 py-1 rounded-sm text-[10.5px] font-bold transition-colors ${
                      constructionMilestone === 'groundworks' ? 'bg-brand-pink text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Month 02 (Groundworks)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConstructionMilestone('framing')}
                    className={`px-2.5 py-1 rounded-sm text-[10.5px] font-bold transition-colors ${
                      constructionMilestone === 'framing' ? 'bg-brand-pink text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Month 06 (Steel Framing)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConstructionMilestone('envelope')}
                    className={`px-2.5 py-1 rounded-sm text-[10.5px] font-bold transition-colors ${
                      constructionMilestone === 'envelope' ? 'bg-brand-pink text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Month 10 (Envelope Close)
                  </button>
                </div>
              </div>

              <div className="relative h-[380px] sm:h-[460px] rounded-[8px] overflow-hidden bg-slate-900 border border-white/10">
                <Image
                  src={
                    constructionMilestone === 'groundworks'
                      ? '/images/editorial/entirefm-site-arrival-2000w.webp'
                      : constructionMilestone === 'framing'
                      ? '/images/editorial/entirefm-industrial-unit-1600w.webp'
                      : '/images/editorial/entirefm-headquarters-exterior-2000w.webp'
                  }
                  alt="Construction progress aerial monitoring comparison"
                  fill
                  className="object-cover transition-opacity duration-500"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />

                <div className="absolute bottom-4 left-4 p-3 rounded-sm bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-xs space-y-1">
                  <div className="text-brand-pink font-bold uppercase">
                    Milestone: {constructionMilestone}
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Subcontractor Verification: 100% Cladding &amp; Glazing Weather-tight Signoff
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-[14px] bg-[#FAF9FB] border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-brand-pink" />
                <h3 className="text-lg font-bold text-slate-900">
                  Repeat Waypoint Alignment
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                By locking exact flight altitudes and gimbal coordinates, recurring flights produce indisputable visual archives that protect developers and main contractors against milestone delay disputes.
              </p>

              <div className="p-4 rounded-sm bg-white border border-slate-200 space-y-2 text-xs">
                <span className="font-mono font-bold text-slate-900 block">Stakeholder Reporting:</span>
                <p className="text-slate-600">Monthly PDF progress dashboards, cloud web viewer links, and 4K time-lapse video reels for investors and board presentations.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
