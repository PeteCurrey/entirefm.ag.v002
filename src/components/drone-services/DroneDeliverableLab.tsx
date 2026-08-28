'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Layers, 
  Flame, 
  Building2, 
  Map, 
  Box, 
  Construction, 
  Crosshair, 
  Download, 
  Info,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  Maximize2
} from 'lucide-react';

interface LabView {
  id: 'roof' | 'thermal' | 'facade' | 'ortho' | 'pointcloud' | 'construction';
  title: string;
  badge: string;
  icon: React.ElementType;
  headline: string;
  description: string;
  exportFormats: string[];
  deliverableSpecs: {
    label: string;
    value: string;
  }[];
  interactiveHotspots: {
    id: number;
    x: number;
    y: number;
    title: string;
    priority: 'P1' | 'P2' | 'P3';
    diagnosis: string;
    action: string;
  }[];
  baseImage: string;
}

const LAB_VIEWS: LabView[] = [
  {
    id: 'roof',
    title: 'Roof Defect Map',
    badge: 'WATERPROOFING ANOMALIES',
    icon: Layers,
    headline: 'High-Resolution Georeferenced Roof Condition & Defect Map',
    description: 'Sub-centimetre orthomosaic mapping overlaid with vector boundary polygons, identifying single-ply lap delamination, standing water ponding, lead flashing splits, and valley gutter silt buildup.',
    exportFormats: ['GeoTIFF (High-Res)', 'Annotated PDF Defect Log', 'DXF Vector CAD Overlay', 'EntireCAFM CSV'],
    deliverableSpecs: [
      { label: 'Ground Sampling Distance (GSD)', value: '0.42 cm/pixel' },
      { label: 'Spatial Coordinate System', value: 'OSGB36 / British National Grid' },
      { label: 'Defect Severity Index', value: 'RAG Priority 1–3 Aligned' },
      { label: 'Asset Linking', value: 'SFG20 Maintenance Register Sync' },
    ],
    interactiveHotspots: [
      {
        id: 1,
        x: 32,
        y: 40,
        title: 'Single-Ply Membrane Lap Separation (1.8m)',
        priority: 'P1',
        diagnosis: 'Delaminated seam edge caused by high wind suction and thermal expansion.',
        action: 'Hot-air weld repair with reinforcing patch and perimeter polyurethane seal.',
      },
      {
        id: 2,
        x: 72,
        y: 28,
        title: 'Valley Gutter Silt & Moss Obstruction',
        priority: 'P2',
        diagnosis: 'Accumulated silt (40mm deep) causing rainwater backup into eaves.',
        action: 'Commercial high-reach gutter vacuum clearance and downpipe flush.',
      },
      {
        id: 3,
        x: 64,
        y: 68,
        title: 'HVAC Plinth Counter-Flashing Crack',
        priority: 'P2',
        diagnosis: 'Aged Code 4 lead flashing cracked along mechanical vibration line.',
        action: 'Dress new Code 4 lead apron flashing with high-modulus sealant.',
      },
    ],
    baseImage: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
  },
  {
    id: 'thermal',
    title: 'Radiometric Thermal Anomaly',
    badge: 'QUANTITATIVE DELTA-T',
    icon: Flame,
    headline: 'Calibrated FLIR Infrared Insulation Moisture & Heat Loss Heatmap',
    description: 'Radiometric infrared thermography conducted during optimal delta-T windows, pinpointing sub-membrane trapped water saturation, insulation thermal degradation, and photovoltaic electrical shorts.',
    exportFormats: ['FLIR Radiometric JPG', 'CSV Temperature Matrix', 'Delta-T Thermal Report (PDF)', 'CAD Moisture Map'],
    deliverableSpecs: [
      { label: 'Thermal Detector Resolution', value: '640 × 512 Radiometric VOx' },
      { label: 'Thermal Sensitivity (NETD)', value: '<30 mK @ 30°C' },
      { label: 'Spectral Range', value: '7.5–14 µm (Long-Wave Infrared)' },
      { label: 'Standards Compliance', value: 'BS EN 13187 / IEC 62446-3' },
    ],
    interactiveHotspots: [
      {
        id: 4,
        x: 48,
        y: 35,
        title: 'Sub-Membrane Insulation Moisture Saturation',
        priority: 'P1',
        diagnosis: 'Delta-T +6.8°C thermal retention signature confirming wet PIR insulation core.',
        action: 'Core sampling validation and targeted replacement of saturated insulation board.',
      },
      {
        id: 5,
        x: 78,
        y: 60,
        title: 'HVAC Chiller Compressor Thermal Head Pressure',
        priority: 'P2',
        diagnosis: 'Elevated surface temperature (+18.4°C) due to soiled condenser fins.',
        action: 'Low-pressure chemical coil wash and fin realignment.',
      },
    ],
    baseImage: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
  },
  {
    id: 'facade',
    title: 'Façade Zoning & Joint Map',
    badge: 'VERTICAL ELEVATION',
    icon: Building2,
    headline: 'Multi-Storey Vertical Envelope Anomaly Grid & Mastic Survey',
    description: 'High-resolution vertical elevation inspection mapping curtain wall glazing gaskets, rain-screen panel alignment, degraded mastic expansion joints, and masonry spalling.',
    exportFormats: ['High-Res Elevation Ortho (PDF)', 'Façade Defect CAD Grid', 'Rope Access Remedial Scope', 'Work Order Log'],
    deliverableSpecs: [
      { label: 'Inspection Technique', value: 'Automated Vertical Waypoint Scan' },
      { label: 'Camera Sensor', value: '48MP Telephoto Zoom' },
      { label: 'Defect Positioning', value: 'Elevation Grid / Floor Level Ref' },
      { label: 'Remedial Trade', value: 'IRATA 2-Man Rope Access / BMU' },
    ],
    interactiveHotspots: [
      {
        id: 6,
        x: 42,
        y: 52,
        title: 'Vertical Mastic Expansion Joint Failure (Floors 5–7)',
        priority: 'P1',
        diagnosis: 'Complete adhesive breakdown of structural silicone along 6.2m vertical joint.',
        action: 'Rope access mastic cutout, primer application, and Dowsil 791 silicone renewal.',
      },
    ],
    baseImage: '/images/editorial/entirefm-hero-headquarters-2560w.webp',
  },
  {
    id: 'ortho',
    title: '2D RTK Orthomosaic',
    badge: 'GEOSPATIAL TOPOGRAPHY',
    icon: Map,
    headline: 'Millimetre-Accurate Georeferenced Estate Master 2D Orthophoto',
    description: 'Survey-grade photogrammetry calibrated with RTK positioning and Ground Control Points (GCPs) for seamless import into AutoCAD, MicroStation, ArcGIS, and QGIS.',
    exportFormats: ['GeoTIFF (Full Ortho)', 'ECW Compressed Image', 'DXF / DWG Contours (0.5m)', 'SHP Shapefiles'],
    deliverableSpecs: [
      { label: 'Horizontal Precision (RMSE)', value: '±8 mm (RTK Fixed)' },
      { label: 'Vertical Precision (RMSE)', value: '±12 mm' },
      { label: 'Coordinate System', value: 'EPSG:27700 (British National Grid)' },
      { label: 'CAD Export Compatibility', value: 'AutoCAD 2018–2026 / Revit BIM' },
    ],
    interactiveHotspots: [
      {
        id: 7,
        x: 55,
        y: 50,
        title: 'Geodetic Baseline Survey Coordinate Point 04',
        priority: 'P3',
        diagnosis: 'Survey station locked to Ordnance Survey Newlyn (ODN) vertical datum.',
        action: 'Permanent spatial reference point for future PPM comparative flights.',
      },
    ],
    baseImage: '/images/editorial/entirefm-london-aerial-poster-2560w.webp',
  },
  {
    id: 'pointcloud',
    title: '3D Point Cloud & Mesh',
    badge: 'SPATIAL REALITY MESH',
    icon: Box,
    headline: 'Dense Photogrammetric 3D Point Cloud & Reality Mesh Model',
    description: 'Millions of georeferenced spatial 3D points creating an accurate digital twin for remote dimensional measurements, structural clearances, and BIM integration.',
    exportFormats: ['LAS / LAZ Point Cloud', 'OBJ / MTL Reality Mesh', 'glTF / USDZ Web Model', 'DWG 3D Solid'],
    deliverableSpecs: [
      { label: 'Point Cloud Density', value: '>450 points / m²' },
      { label: 'Mesh Triangle Count', value: '12.4 Million Polygons' },
      { label: 'Dimensional Accuracy', value: '±15 mm across 100m span' },
      { label: 'Viewer Support', value: 'EntireCAFM Web 3D / Autodesk Cloud' },
    ],
    interactiveHotspots: [
      {
        id: 8,
        x: 50,
        y: 45,
        title: 'Rooftop Chiller Plant Deck Volumetric Envelope',
        priority: 'P2',
        diagnosis: '3D spatial clearance verified against MEP plant replacement schematics.',
        action: 'Dimensional baseline for future crane lift and plant replacement planning.',
      },
    ],
    baseImage: '/images/editorial/entirefm-manchester-castlefield-night-2560w.webp',
  },
  {
    id: 'construction',
    title: 'Construction Milestone Timeline',
    badge: 'PROJECT PROGRESS',
    icon: Construction,
    headline: 'Automated GPS-Locked Repeat Waypoint Milestone Tracking',
    description: 'Recurring monthly flight capture from identical 3D flight coordinates, providing transparent progress archives, dispute resolution evidence, and cut/fill earthwork volumes.',
    exportFormats: ['Monthly Progress PDF', 'Time-Lapse Video (4K)', 'Cut/Fill Volume Matrix', 'Subcontractor Audit Log'],
    deliverableSpecs: [
      { label: 'Flight Repeat Accuracy', value: '±10 cm GPS Waypoint Lock' },
      { label: 'Comparison Cadence', value: 'Monthly / Bi-Weekly Milestones' },
      { label: 'Earthworks Calculation', value: 'Digital Terrain Model (DTM) Cut/Fill' },
      { label: 'Audit Archiving', value: 'Multi-Year Permanent Project Vault' },
    ],
    interactiveHotspots: [
      {
        id: 9,
        x: 60,
        y: 40,
        title: 'Phase 02 Structural Steel Envelope Enclosure',
        priority: 'P3',
        diagnosis: 'Milestone completion verified against master project programme.',
        action: 'Subcontractor interim valuation payment signoff logged in CAFM.',
      },
    ],
    baseImage: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
  },
];

export function DroneDeliverableLab() {
  const [activeTabId, setActiveTabId] = useState<LabView['id']>('roof');
  const currentView = LAB_VIEWS.find(v => v.id === activeTabId) || LAB_VIEWS[0];
  const [selectedHotspot, setSelectedHotspot] = useState(currentView.interactiveHotspots[0]);

  const handleTabChange = (id: LabView['id']) => {
    setActiveTabId(id);
    const newView = LAB_VIEWS.find(v => v.id === id) || LAB_VIEWS[0];
    setSelectedHotspot(newView.interactiveHotspots[0]);
  };

  return (
    <section 
      id="deliverable-lab"
      aria-label="Technical Visualisation Laboratory"
      className="py-24 bg-brand-void text-white relative overflow-hidden border-b border-brand-edge-dark"
    >
      <div className="container-custom relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15">
              <FileCode2 className="h-3.5 w-3.5 text-brand-pink" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white font-light">
                ENGINEERING DELIVERABLE LABORATORY
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
              Sample Technical Output Visualisations: <br />
              <span className="text-hero-pink font-light">
                From Raw Telemetry to Engineering Formats
              </span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              Inspect actual commercial deliverables produced across EntireFM aerial surveys. Explore interactive defect registers, thermal delta-T datasets, CAD orthomosaics, and 3D point cloud exports.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {LAB_VIEWS.map((tab) => {
            const isSelected = activeTabId === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`p-3.5 rounded-sm text-left transition-all duration-300 relative border flex flex-col justify-between min-h-[90px] group ${
                  isSelected
                    ? 'bg-brand-carbon border-brand-pink shadow-glow-pink'
                    : 'bg-brand-carbon/40 border-brand-edge-dark hover:border-white/25 hover:bg-brand-carbon/80'
                }`}
              >
                <div 
                  className={`absolute top-0 left-0 right-0 h-[2px] transition-colors ${
                    isSelected ? 'bg-gradient-to-r from-brand-pink to-brand-magenta' : 'bg-transparent'
                  }`} 
                />

                <div className="flex items-center justify-between">
                  <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-brand-pink' : 'text-slate-400'}`} />
                  <span className="font-mono text-[9px] text-slate-500 uppercase">{tab.badge.split(' ')[0]}</span>
                </div>

                <div className={`text-xs font-light tracking-wide ${isSelected ? 'text-white font-normal' : 'text-slate-300'}`}>
                  {tab.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Major Visualisation Lab Workspace */}
        <div className="rounded-sm bg-brand-carbon border border-brand-edge-dark overflow-hidden shadow-elevated grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Main Visual Deliverable Viewport */}
          <div className="lg:col-span-8 relative min-h-[420px] sm:min-h-[500px] lg:min-h-[600px] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-brand-edge-dark select-none">
            <Image
              src={currentView.baseImage}
              alt={currentView.headline}
              fill
              className="object-cover object-center filter brightness-[0.85] contrast-[1.08] transition-all duration-700"
              sizes="(max-width: 1024px) 100vw, 65vw"
            />

            {/* Simulated Technical Overlay Shader */}
            {activeTabId === 'thermal' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-[#020024] via-[#4d0c75] to-[#f47e17] mix-blend-color opacity-90 pointer-events-none" />
            )}

            {activeTabId === 'ortho' && (
              <div 
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, #00d2ff 1px, transparent 1px), linear-gradient(to bottom, #00d2ff 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }}
              />
            )}

            {/* Interactive Deliverable Hotspot Pins */}
            {currentView.interactiveHotspots.map((spot) => {
              const isSelected = selectedHotspot?.id === spot.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setSelectedHotspot(spot)}
                  style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                  aria-label={`Inspect ${spot.title}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-transform duration-300 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-brand-pink/60 animate-ping pointer-events-none" />
                    )}
                    <div 
                      className={`h-7 w-7 rounded-full flex items-center justify-center font-mono text-[11px] font-bold shadow-2xl border-2 transition-all ${
                        isSelected
                          ? 'bg-white text-brand-void border-brand-pink ring-2 ring-brand-pink'
                          : 'bg-brand-pink text-white border-white'
                      }`}
                    >
                      {spot.id}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Viewport Top Bar */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-sm bg-brand-void/90 border border-white/10 backdrop-blur-md font-mono text-[10.5px] text-slate-300">
              <Crosshair className="h-3.5 w-3.5 text-brand-pink" />
              <span>OUTPUT VIEW: {currentView.title.toUpperCase()}</span>
            </div>

            {/* Viewport Bottom Bar */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between px-4 py-2 rounded-sm bg-brand-void/90 border border-white/10 backdrop-blur-md font-mono text-[10.5px] text-slate-300">
              <span>{currentView.interactiveHotspots.length} INSPECTION PINS ACTIVE</span>
              <span className="text-brand-pink">AUDIT SPECIFICATION READY</span>
            </div>
          </div>

          {/* Right Deliverable Specification & Inspection Dossier */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Header */}
              <div className="space-y-1 border-b border-brand-edge-dark pb-3">
                <span className="font-mono text-[10.5px] text-brand-pink font-semibold uppercase tracking-widest block">
                  {currentView.badge}
                </span>
                <h3 className="text-lg font-light text-white leading-snug">
                  {currentView.headline}
                </h3>
              </div>

              {/* Selected Hotspot Detail */}
              {selectedHotspot && (
                <div className="p-4 rounded-sm bg-brand-void/80 border border-brand-pink/30 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-pink font-bold">PIN {selectedHotspot.id} · {selectedHotspot.priority}</span>
                    <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded text-[10px]">Active Anomaly</span>
                  </div>
                  <div className="text-white font-sans text-xs font-medium">{selectedHotspot.title}</div>
                  <p className="font-sans text-[11.5px] text-slate-300 font-light leading-relaxed">
                    {selectedHotspot.diagnosis}
                  </p>
                  <div className="pt-2 border-t border-white/[0.06] text-[10.5px] text-slate-400">
                    <strong className="text-brand-pink">Scope: </strong>{selectedHotspot.action}
                  </div>
                </div>
              )}

              {/* Deliverable Technical Specifications Matrix */}
              <div className="space-y-2 font-mono text-xs">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
                  Sensor &amp; Geospatial Specifications
                </span>
                <div className="space-y-1.5 p-3 rounded-sm bg-brand-void/50 border border-brand-edge-dark">
                  {currentView.deliverableSpecs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex justify-between items-center text-[11px] py-0.5 border-b border-white/[0.04] last:border-none">
                      <span className="text-slate-400">{spec.label}:</span>
                      <span className="text-white font-medium text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Formats Checklist */}
              <div className="space-y-1.5 font-mono text-xs">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
                  Exportable CAD / GIS File Formats
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentView.exportFormats.map((fmt, fIdx) => (
                    <span key={fIdx} className="px-2 py-1 rounded-sm bg-white/5 border border-white/10 text-[10.5px] text-brand-mist">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-brand-edge-dark space-y-2">
              <Link
                href="/tools/drone-inspection-planner"
                className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-brand-pink to-brand-magenta py-3 px-4 text-xs font-medium text-white shadow-elevated hover:shadow-glow-pink transition-all group"
              >
                <span>Request Sample Deliverable Dossier</span>
                <Download className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
