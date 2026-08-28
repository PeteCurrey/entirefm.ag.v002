'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Layers, 
  Building2, 
  Flame, 
  CloudLightning, 
  Construction, 
  CalendarClock, 
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Package,
  Boxes
} from 'lucide-react';

interface CommercialPackage {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  icon: React.ElementType;
  objective: string;
  captureMethodology: string;
  deliverables: string[];
  recommendedCadence: string;
  typicalAssetType: string;
  image: string;
}

const PACKAGES: CommercialPackage[] = [
  {
    id: 'roof',
    name: 'Roof Condition Mission',
    tagline: 'Waterproofing, membrane integrity & drainage review',
    badge: 'WATERPROOFING AUDIT',
    icon: Layers,
    objective: 'Safely evaluate 100% of flat and pitched roof surfaces, valley gutters, parapets, lead flashings, and plant plinths to identify water-ingress risks before internal ceiling breaches occur.',
    captureMethodology: 'Automated 48MP photogrammetric grid flight with RTK positioning + oblique telephoto defect inspection around roof penetrations and gutter outlets.',
    deliverables: [
      'Millimetre-scale 2D orthomosaic roof map (GeoTIFF / PDF)',
      'Annotated defect condition register with RAG priorities',
      'Valley gutter & drainage flow capacity assessment',
      'Direct hard FM repair quotation & EntireCAFM logging',
    ],
    recommendedCadence: 'Biannual (Pre-Winter & Post-Storm Season)',
    typicalAssetType: 'Logistics distribution warehouses, retail sheds, corporate HQs, industrial manufacturing facilities',
    image: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
  },
  {
    id: 'envelope',
    name: 'Building Envelope Mission',
    tagline: 'Multi-storey façade, cladding & curtain walling audit',
    badge: 'VERTICAL ENVELOPE',
    icon: Building2,
    objective: 'Complete vertical envelope audit inspecting rain-screen cladding, curtain wall gaskets, mastic expansion joints, window seals, and high-level masonry without scaffolding or cranes.',
    captureMethodology: 'Close-proximity vertical waypoint facade scans with 3D obstacle avoidance and high-resolution optical telephoto zoom cameras.',
    deliverables: [
      'Façade elevation anomaly grid maps with CAD overlays',
      'Mastic expansion joint degradation register',
      'Glazing gasket & panel alignment review',
      'Targeted IRATA rope access & BMU remedial scopes',
    ],
    recommendedCadence: 'Annual Strategic PPM or Pre-Lease Dilapidations',
    typicalAssetType: 'City commercial towers, multi-tenant corporate offices, institutional real estate portfolios',
    image: '/images/editorial/entirefm-hero-headquarters-2560w.webp',
  },
  {
    id: 'energy',
    name: 'Energy Intelligence Mission',
    tagline: 'Radiometric thermography & solar PV string audit',
    badge: 'THERMOGRAPHY & RENEWABLES',
    icon: Flame,
    objective: 'Quantify building envelope thermal bridging, discover trapped water in flat roof insulation, and evaluate photovoltaic electrical output under IEC 62446-3 thermographic standards.',
    captureMethodology: 'Calibrated FLIR 640T radiometric thermal imaging conducted during optimal solar transition or night-time delta-T windows.',
    deliverables: [
      'Calibrated delta-T radiometric temperature heatmap',
      'Sub-membrane roof insulation moisture map',
      'Photovoltaic string hotspot & diode defect register',
      'Quantified energy remediation and yield recovery plan',
    ],
    recommendedCadence: 'Annual Strategic Energy Scan (Autumn / Night)',
    typicalAssetType: 'Commercial rooftop solar PV arrays, temperature-controlled warehouses, ESG-targeted portfolios',
    image: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
  },
  {
    id: 'estate',
    name: 'Estate Condition Mission',
    tagline: 'Multi-building portfolio baseline & infrastructure review',
    badge: 'PORTFOLIO REVIEWS',
    icon: Building2,
    objective: 'Unified aerial baseline across multi-building estates covering all roofs, facades, access roads, boundary fencing, drainage paths, and external lighting.',
    captureMethodology: 'Wide-area high-altitude photogrammetric survey with ground control points and multi-building GIS integration.',
    deliverables: [
      'Estate master 2D orthomosaic and 3D terrain model',
      'Standardized RAG condition score across all buildings',
      'Centralized asset register synchronization in EntireCAFM',
      '5-Year Capital Expenditure (CapEx) maintenance forecast',
    ],
    recommendedCadence: 'Annual / Portfolio Strategy Review',
    typicalAssetType: 'Business parks, university campuses, NHS hospital trusts, retail shopping centres',
    image: '/images/editorial/entirefm-london-aerial-poster-2560w.webp',
  },
  {
    id: 'storm',
    name: 'Storm Response Mission',
    tagline: 'Rapid post-incident damage & insurance loss adjust triage',
    badge: 'URGENT INCIDENT TRIAGE',
    icon: CloudLightning,
    objective: 'Urgent deployment following severe storms, high winds, fire, or impact damage to safely evaluate structural integrity, formulate make-safe scopes, and compile insurer evidence.',
    captureMethodology: 'Rapid-deployment commercial UAV flight with immediate on-site data ingestion and urgent hazard geotagging.',
    deliverables: [
      'Loss adjuster certified damage evidence pack',
      'Same-day make-safe scope of works & safety cordon map',
      'High-resolution geotagged photographic evidence bundle',
      'Emergency roofing & rope access trade dispatch',
    ],
    recommendedCadence: 'Reactive Emergency Attendance (24–48 Hours)',
    typicalAssetType: 'Property management firms, commercial landlords, insurance underwriters following storm events',
    image: '/images/editorial/entirefm-manchester-castlefield-night-2560w.webp',
  },
  {
    id: 'construction',
    name: 'Construction Monitoring Mission',
    tagline: 'Automated repeat milestone capture & cut/fill volumes',
    badge: 'DEVELOPMENT ARCHIVE',
    icon: Construction,
    objective: 'Track site evolution from groundworks to handover using automated GPS-locked waypoint flights, providing dispute-proof subcontractor progress and earthworks cut/fill analysis.',
    captureMethodology: 'Automated repeat waypoint flights with RTK centimetre positioning for identical spatial milestone comparisons.',
    deliverables: [
      'Monthly georeferenced orthomosaic progress overlays',
      'Earthworks stockpile cut/fill volumetric balance reports',
      'Interactive time-lapse milestone viewer for investors',
      'Subcontractor completion signoff verification archive',
    ],
    recommendedCadence: 'Monthly or Bi-Weekly Project Milestones',
    typicalAssetType: 'New commercial developments, logistics park extensions, major refurbishment projects',
    image: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
  },
];

export function DronePackagesSelector() {
  const [activePackageId, setActivePackageId] = useState<string>('roof');
  const current = PACKAGES.find(p => p.id === activePackageId) || PACKAGES[0];
  const CurrentIcon = current.icon;

  return (
    <section 
      id="packages"
      aria-label="Commercial Drone Inspection Missions and Packages"
      className="py-24 bg-brand-void text-white relative overflow-hidden border-b border-brand-edge-dark"
    >
      <div className="container-custom relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15">
              <Package className="h-3.5 w-3.5 text-brand-pink" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white font-light">
                COMMERCIAL MISSION SCOPES
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
              Outcome-Led Drone Packages: <br />
              <span className="text-hero-pink font-light">
                Tailored for Asset Directors &amp; FM Teams
              </span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              We structure aerial operations into defined, outcome-driven missions. Select a mission profile below to inspect methodology, deliverables, and recommended maintenance cadences.
            </p>
          </div>
        </div>

        {/* Horizontal Mission Selector Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PACKAGES.map((pkg) => {
            const isSelected = activePackageId === pkg.id;
            const Icon = pkg.icon;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setActivePackageId(pkg.id)}
                className={`p-4 rounded-sm text-left transition-all duration-300 relative border flex flex-col justify-between min-h-[105px] group ${
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
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-brand-pink' : 'text-slate-400'}`} />
                  <span className="font-mono text-[9.5px] text-slate-500 uppercase">{pkg.id.toUpperCase()}</span>
                </div>

                <div>
                  <h3 className={`text-xs sm:text-sm font-light leading-snug ${isSelected ? 'text-white font-normal' : 'text-slate-300'}`}>
                    {pkg.name}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Major Dynamic Mission Canvas */}
        <div className="rounded-sm bg-brand-carbon border border-brand-edge-dark overflow-hidden shadow-elevated grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Column: Visual Media Backdrop */}
          <div className="lg:col-span-5 relative min-h-[320px] sm:min-h-[400px] lg:min-h-full flex items-center justify-center overflow-hidden">
            <Image
              src={current.image}
              alt={current.name}
              fill
              className="object-cover object-center filter brightness-[0.75] contrast-[1.1] transition-all duration-700"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-carbon via-transparent to-brand-carbon/60" />

            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-sm bg-brand-void/90 border border-white/10 backdrop-blur-md space-y-1">
              <span className="font-mono text-[10px] text-brand-pink uppercase tracking-widest block font-bold">
                {current.badge}
              </span>
              <div className="text-xs text-white font-medium">
                Cadence: {current.recommendedCadence}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Asset: {current.typicalAssetType}
              </div>
            </div>
          </div>

          {/* Right Column: Mission Specification & Deliverables */}
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2 border-b border-brand-edge-dark pb-4">
                <div className="flex items-center gap-2 text-brand-pink font-mono text-xs uppercase tracking-wider font-semibold">
                  <CurrentIcon className="h-4 w-4" />
                  <span>{current.badge}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
                  {current.name}
                </h3>
                <p className="text-sm text-slate-300 font-light leading-relaxed">
                  {current.objective}
                </p>
              </div>

              {/* Capture Methodology */}
              <div className="p-4 rounded-sm bg-brand-void/70 border border-brand-edge-dark space-y-1.5 font-mono text-xs">
                <span className="text-[10.5px] text-brand-electric-bright uppercase tracking-wider font-bold block">
                  Capture Methodology &amp; Flight Protocol
                </span>
                <p className="font-sans text-xs text-slate-200 leading-relaxed font-light">
                  {current.captureMethodology}
                </p>
              </div>

              {/* Deliverables Checklist */}
              <div className="space-y-2.5">
                <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider block font-medium">
                  Verified Mission Deliverables:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {current.deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="p-3 rounded-sm bg-brand-void/40 border border-white/[0.06] flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="h-4 w-4 text-brand-pink shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-brand-edge-dark flex flex-wrap items-center justify-between gap-4">
              <div className="font-mono text-xs text-slate-400">
                <span>Integrated with </span>
                <strong className="text-white font-normal">EntireFM Hard Services &amp; CAFM</strong>
              </div>

              <Link
                href="/tools/drone-inspection-planner"
                className="inline-flex items-center gap-2 rounded-sm bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-magenta px-6 py-3 text-xs font-medium text-white shadow-elevated hover:shadow-glow-pink transition-all group"
              >
                <span>Request Scope for this Mission</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
