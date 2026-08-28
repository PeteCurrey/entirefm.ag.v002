'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Camera, 
  Layers, 
  Flame, 
  Map, 
  Construction, 
  CloudLightning, 
  Box, 
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface CapabilityChapter {
  number: string;
  id: string;
  title: string;
  eyebrow: string;
  headline: string;
  description: string;
  backgroundImage: string;
  telemetryTags: string[];
  childServices: {
    title: string;
    href: string;
    tagline: string;
    deliverable: string;
  }[];
  primaryCtaText: string;
  primaryCtaHref: string;
}

const CAPABILITY_CHAPTERS: CapabilityChapter[] = [
  {
    number: '01',
    id: 'inspection',
    title: 'High-Level Asset Inspection',
    eyebrow: 'CHAPTER 01 · OPTICAL AUDITS',
    headline: 'High-Resolution Optical Audits for Inaccessible Building Fabric',
    description: 'Ultra-high-resolution aerial surveys capturing roof waterproofing membranes, multi-storey vertical facades, valley drainage chutes, coping stones, and rooftop mechanical plant decks without the expense, disruption, or safety risks of scaffolding.',
    backgroundImage: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
    telemetryTags: ['48MP / 8K RGB Optical', 'Zero Initial Scaffolding', 'Sub-Centimetre GSD', 'Rope Access Remedial Bridge'],
    childServices: [
      {
        title: 'Commercial Drone Inspections',
        href: '/services/drone-services/drone-inspections',
        tagline: 'High-level optical audits for roofs, towers & plant',
        deliverable: '48MP/8K Georeferenced Imagery & RAG Defect Register',
      },
      {
        title: 'Roof & Gutter Inspections',
        href: '/services/drone-services/roof-inspections',
        tagline: 'Flat roofs, box gutters, parapets & flashings',
        deliverable: 'Full Roof Orthomosaic & Drainage Logbook',
      },
      {
        title: 'Façade & Building Envelope',
        href: '/services/drone-services/building-envelope-inspections',
        tagline: 'Vertical envelope, cladding panels & mastic joints',
        deliverable: 'Façade Elevation Anomaly & Joint Map',
      },
    ],
    primaryCtaText: 'Explore High-Level Inspection Services',
    primaryCtaHref: '/services/drone-services/drone-inspections',
  },
  {
    number: '02',
    id: 'thermal-energy',
    title: 'Thermal & Energy Intelligence',
    eyebrow: 'CHAPTER 02 · RADIOMETRIC DIAGNOSTICS',
    headline: 'FLIR Radiometric Thermography & Photovoltaic String Audits',
    description: 'Calibrated radiometric infrared surveys detecting trapped moisture within flat roof insulation cores, quantitative building envelope heat loss, and sub-module hotspot failures in rooftop solar PV arrays under IEC 62446-3 standards.',
    backgroundImage: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
    telemetryTags: ['FLIR 640T Radiometric Sensor', '<30mK Thermal Sensitivity', 'IEC 62446-3 Compliant', 'Delta-T Moisture Profiling'],
    childServices: [
      {
        title: 'Thermal Drone Surveys',
        href: '/services/drone-services/thermal-imaging',
        tagline: 'Sub-membrane roof moisture & building heat loss',
        deliverable: 'Calibrated Delta-T Radiometric Heatmap',
      },
      {
        title: 'Solar PV Array Inspections',
        href: '/services/drone-services/solar-pv-inspections',
        tagline: 'String hotspots, bypass diodes & yield diagnostics',
        deliverable: 'IEC Standard Photovoltaic Anomaly Register',
      },
    ],
    primaryCtaText: 'Explore Thermal & Solar Capabilities',
    primaryCtaHref: '/services/drone-services/thermal-imaging',
  },
  {
    number: '03',
    id: 'surveying-mapping',
    title: 'Surveying, GIS & Geospatial Mapping',
    eyebrow: 'CHAPTER 03 · GEOSPATIAL ENGINEERING',
    headline: 'Millimetre-Accurate 2D Orthomosaics, DEMs & Volumetrics',
    description: 'Survey-grade aerial photogrammetry calibrated with RTK positioning and Ground Control Points (GCPs), generating georeferenced orthophotos, CAD contour maps, digital elevation models, and bulk stockpile cut/fill volumetric measurements.',
    backgroundImage: '/images/editorial/entirefm-london-aerial-poster-2560w.webp',
    telemetryTags: ['RTK / PPK Positioning', 'GeoTIFF / ECW / DXF CAD Exports', 'OSGB36 Coordinate Projections', 'Cubic Metre Cut/Fill Calculations'],
    childServices: [
      {
        title: 'Surveying & 2D Mapping',
        href: '/services/drone-services/surveying-mapping',
        tagline: 'Orthomosaics, DEM elevation models & GIS vectors',
        deliverable: 'Millimetre-Accurate GeoTIFF & DXF Contours',
      },
      {
        title: 'Volumetric Earthwork Surveys',
        href: '/services/drone-services/volumetric-surveys',
        tagline: 'Stockpile quantification & excavation balances',
        deliverable: 'Certified Cubic Metre Cut/Fill Volume Report',
      },
    ],
    primaryCtaText: 'Explore Aerial Surveying & Mapping',
    primaryCtaHref: '/services/drone-services/surveying-mapping',
  },
  {
    number: '04',
    id: 'construction',
    title: 'Construction & Development Intelligence',
    eyebrow: 'CHAPTER 04 · PROJECT MONITORING',
    headline: 'GPS-Locked Repeat Milestone Capture Across Project Lifecycles',
    description: 'Scheduled automated repeat flights capturing progress from earthworks and structural steel framing to external envelope completion and handover. Create auditable milestone timelines that mitigate subcontractor disputes.',
    backgroundImage: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
    telemetryTags: ['Automated GPS Waypoint Repeat', 'Monthly Progress Comparison', 'Investor & Bank Dossiers', 'Subcontractor Signoff Evidence'],
    childServices: [
      {
        title: 'Construction Progress Monitoring',
        href: '/services/drone-services/construction-monitoring',
        tagline: 'Repeat waypoint progress records from groundworks to handover',
        deliverable: 'Interactive Monthly Timeline & Milestone Archive',
      },
    ],
    primaryCtaText: 'Explore Construction Monitoring',
    primaryCtaHref: '/services/drone-services/construction-monitoring',
  },
  {
    number: '05',
    id: 'incident-evidence',
    title: 'Incident, Storm & Insurance Evidence',
    eyebrow: 'CHAPTER 05 · RAPID INCIDENT RESPONSE',
    headline: 'Emergency Damage Triage & Loss Adjuster Evidence Packs',
    description: 'Rapid commercial drone deployment following severe storm events, high wind damage, fire, or structural failure. Safely inspect unstable high-level structures, formulate immediate make-safe scopes, and compile insurer-grade dossiers.',
    backgroundImage: '/images/editorial/entirefm-manchester-castlefield-night-2560w.webp',
    telemetryTags: ['24–48h Rapid Attendance', 'Make-Safe Scoping', 'Loss Adjuster Evidence', 'Safe Access to Dangerous Structures'],
    childServices: [
      {
        title: 'Emergency & Insurance Surveys',
        href: '/services/drone-services/emergency-insurance-surveys',
        tagline: 'Storm damage inspection & rapid make-safe triage',
        deliverable: 'Certified Loss Adjuster Evidence Pack & Remedial Scope',
      },
    ],
    primaryCtaText: 'Explore Emergency Survey Services',
    primaryCtaHref: '/services/drone-services/emergency-insurance-surveys',
  },
  {
    number: '06',
    id: 'reality-capture',
    title: 'Reality Capture, 3D Models & Digital Twins',
    eyebrow: 'CHAPTER 06 · DIGITAL ASSET REVOLUTION',
    headline: 'Persistent 3D Point Clouds, Gaussian Splats & Estate Media',
    description: 'Transform physical estates into navigable, dimensionally accurate 3D spatial twins. Combine photogrammetric point clouds with cinematic 4K/6K property marketing media, connected directly to EntireCAFM lifecycle records.',
    backgroundImage: '/images/editorial/entirefm-hero-headquarters-2560w.webp',
    telemetryTags: ['LAS / LAZ Point Clouds', 'OBJ / glTF Reality Meshes', 'BIM Integration', '4K / 6K Cinematic Media Suite'],
    childServices: [
      {
        title: 'Digital Twin & 3D Reality Capture',
        href: '/services/drone-services/digital-twin-3d-capture',
        tagline: 'Point clouds, photogrammetric meshes & spatial twins',
        deliverable: 'Persistent 3D Reality Mesh & LAS Point Cloud',
      },
      {
        title: 'Aerial Photography & Video Media',
        href: '/services/drone-services/aerial-photography-video',
        tagline: 'Cinematic 4K/6K commercial property & portfolio media',
        deliverable: 'Full Colour-Graded 4K/6K RAW Media Suite',
      },
    ],
    primaryCtaText: 'Explore 3D Reality Capture & Twins',
    primaryCtaHref: '/services/drone-services/digital-twin-3d-capture',
  },
];

export function DroneCapabilityChapters() {
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const current = CAPABILITY_CHAPTERS[activeChapterIdx];

  return (
    <section 
      id="capabilities"
      aria-label="Commercial Drone Capability Chapters"
      className="py-24 bg-[#0B1220] text-white relative overflow-hidden border-b border-brand-edge-dark"
    >
      {/* Background Ambience */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />

      <div className="container-custom relative z-10 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15">
            <Layers className="h-3.5 w-3.5 text-brand-pink" />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white font-light">
              OPERATIONAL SCOPE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
            Cinematic Capability Chapters: <br />
            <span className="text-hero-pink font-light">
              Specialized Aerial Engineering Disciplines
            </span>
          </h2>

          <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-light">
            EntireFM structures commercial drone operations into six dedicated engineering chapters. Explore specialized technical capabilities and individual service deliverables.
          </p>
        </div>

        {/* Chapter Navigation Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          {CAPABILITY_CHAPTERS.map((ch, idx) => {
            const isSelected = activeChapterIdx === idx;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveChapterIdx(idx)}
                className={`p-4 rounded-sm text-left transition-all duration-300 relative border flex flex-col justify-between min-h-[110px] group ${
                  isSelected
                    ? 'bg-brand-carbon border-brand-pink shadow-glow-pink'
                    : 'bg-brand-carbon/40 border-brand-edge-dark hover:border-white/20 hover:bg-brand-carbon/70'
                }`}
              >
                {/* Active Indicator Top Line */}
                <div 
                  className={`absolute top-0 left-0 right-0 h-[2px] transition-colors ${
                    isSelected ? 'bg-gradient-to-r from-brand-pink to-brand-magenta' : 'bg-transparent'
                  }`} 
                />

                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-semibold ${isSelected ? 'text-brand-pink' : 'text-slate-400'}`}>
                    CHAPTER {ch.number}
                  </span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                    {ch.childServices.length} {ch.childServices.length === 1 ? 'SERVICE' : 'SERVICES'}
                  </span>
                </div>

                <div>
                  <h3 className={`text-xs sm:text-sm font-light leading-snug ${isSelected ? 'text-white font-normal' : 'text-slate-300 group-hover:text-white'}`}>
                    {ch.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Major Cinematic Editorial Chapter Canvas */}
        <div className="rounded-sm bg-brand-carbon border border-brand-edge-dark overflow-hidden shadow-elevated relative">
          {/* Background Cinematic Visual with Dynamic Overlays */}
          <div className="relative min-h-[500px] lg:min-h-[620px] flex items-stretch">
            {/* Background Photographic Base */}
            <div className="absolute inset-0 z-0">
              <Image
                src={current.backgroundImage}
                alt={current.headline}
                fill
                className="object-cover object-center filter brightness-[0.45] contrast-[1.1] transition-all duration-1000"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-carbon via-brand-carbon/80 to-brand-carbon/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-carbon via-brand-carbon/90 to-transparent" />
            </div>

            {/* Inner Content Grid */}
            <div className="relative z-10 w-full p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Chapter Narrative & Telemetry */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-brand-pink font-mono text-xs uppercase tracking-widest font-semibold">
                    <span>{current.eyebrow}</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl lg:text-[2.6rem] font-extralight text-white leading-[1.12] tracking-tight">
                    {current.headline}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light max-w-2xl">
                    {current.description}
                  </p>
                </div>

                {/* Restrained Telemetry Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {current.telemetryTags.map((tag, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="px-2.5 py-1 rounded-sm bg-brand-void/80 border border-white/15 font-mono text-[11px] text-brand-mist"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Primary Chapter Action */}
                <div className="pt-4">
                  <Link
                    href={current.primaryCtaHref}
                    className="inline-flex items-center gap-2.5 rounded-sm bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-magenta px-7 py-3.5 text-xs sm:text-sm font-medium text-white shadow-elevated hover:shadow-glow-pink hover:scale-[1.02] transition-all group"
                  >
                    <span>{current.primaryCtaText}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Individual Linked Child Services with Preserved URLs */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                    Included Service Routes ({current.childServices.length})
                  </span>
                  <span className="text-[10.5px] font-mono text-brand-pink">
                    Indexable Architecture
                  </span>
                </div>

                <div className="space-y-3">
                  {current.childServices.map((srv, sIdx) => (
                    <Link
                      key={sIdx}
                      href={srv.href}
                      className="block p-5 rounded-sm bg-brand-void/80 border border-brand-edge-dark hover:border-brand-pink hover:bg-brand-void transition-all duration-300 group/srv"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h4 className="text-base font-light text-white group-hover/srv:text-brand-pink transition-colors">
                            {srv.title}
                          </h4>
                          <p className="text-xs text-slate-300 font-light">
                            {srv.tagline}
                          </p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover/srv:text-brand-pink transition-colors shrink-0 mt-1" />
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Deliverable:</span>
                        <span className="text-brand-electric-bright font-medium text-right line-clamp-1">{srv.deliverable}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indexable All-Services Link Directory (Accessible Semantic Coverage) */}
        <div className="p-6 rounded-sm bg-brand-carbon/60 border border-brand-edge-dark flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Complete UK Drone Services Suite · 11 Verified Engineering Disciplines</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]">
            <Link href="/services/drone-services/drone-inspections" className="hover:text-brand-pink transition-colors">Drone Inspections</Link>
            <Link href="/services/drone-services/roof-inspections" className="hover:text-brand-pink transition-colors">Roof &amp; Gutters</Link>
            <Link href="/services/drone-services/building-envelope-inspections" className="hover:text-brand-pink transition-colors">Façade &amp; Envelope</Link>
            <Link href="/services/drone-services/thermal-imaging" className="hover:text-brand-pink transition-colors">Thermal Surveys</Link>
            <Link href="/services/drone-services/solar-pv-inspections" className="hover:text-brand-pink transition-colors">Solar PV</Link>
            <Link href="/services/drone-services/surveying-mapping" className="hover:text-brand-pink transition-colors">Mapping &amp; GIS</Link>
            <Link href="/services/drone-services/construction-monitoring" className="hover:text-brand-pink transition-colors">Construction</Link>
            <Link href="/services/drone-services/digital-twin-3d-capture" className="hover:text-brand-pink transition-colors">3D Digital Twin</Link>
            <Link href="/services/drone-services/volumetric-surveys" className="hover:text-brand-pink transition-colors">Volumetrics</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
