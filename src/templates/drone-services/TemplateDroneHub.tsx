'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { DroneProcessFlow } from '@/components/drone-services/DroneProcessFlow';
import { DronePackagesSection } from '@/components/drone-services/DronePackagesSection';
import { DronePpmSection } from '@/components/drone-services/DronePpmSection';
import { DroneCafmWorkflow } from '@/components/drone-services/DroneCafmWorkflow';
import { DroneSampleOutputs } from '@/components/drone-services/DroneSampleOutputs';
import { DroneComplianceSection } from '@/components/drone-services/DroneComplianceSection';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { 
  Camera, 
  Layers, 
  Building2, 
  Flame, 
  Sun, 
  Map, 
  Construction, 
  CloudLightning, 
  Box, 
  Boxes, 
  Video, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  ArrowUpRight,
  ShieldCheck,
  Building,
  Factory,
  Truck,
  GraduationCap,
  Store
} from 'lucide-react';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';

interface TemplateDroneHubProps {
  route: RouteRecord;
  content: ContentRecord;
}

const DRONE_SERVICES_LIST = [
  {
    title: 'Drone Inspections',
    href: '/services/drone-services/drone-inspections',
    icon: Camera,
    badge: 'OPTICAL AUDIT',
    tagline: 'High-Level Visual & Structural Surveys',
    desc: 'High-resolution optical inspections of high-level building fabric, rooftop plant, towers, and inaccessible structures without scaffolding.',
    deliverable: '48MP/8K Imagery & Defect Report',
  },
  {
    title: 'Roof & Gutter Inspections',
    href: '/services/drone-services/roof-inspections',
    icon: Layers,
    badge: 'WATERPROOFING',
    tagline: 'Flat, Pitched, Valleys & Drainage Goods',
    desc: 'Comprehensive condition audits of waterproofing membranes, box gutters, parapets, lead flashings, and plant plinths.',
    deliverable: 'Orthomosaic & Drainage Logbook',
  },
  {
    title: 'Façade & Building Envelope',
    href: '/services/drone-services/building-envelope-inspections',
    icon: Building2,
    badge: 'EXTERNAL ENVELOPE',
    tagline: 'Cladding, Glazing & Rain-Screens',
    desc: 'Vertical envelope surveys checking cladding panels, curtain walling caps, perished mastic seals, and masonry spalling.',
    deliverable: 'Elevation Defect Grid Map',
  },
  {
    title: 'Thermal Drone Surveys',
    href: '/services/drone-services/thermal-imaging',
    icon: Flame,
    badge: 'RADIOMETRIC',
    tagline: 'Heat Loss & Moisture Entrapment',
    desc: 'Calibrated FLIR thermal surveys detecting trapped water in flat roof insulation, thermal bridging, and HVAC heat loss.',
    deliverable: 'Delta-T Radiometric Heatmap',
  },
  {
    title: 'Solar PV Inspections',
    href: '/services/drone-services/solar-pv-inspections',
    icon: Sun,
    badge: 'RENEWABLES',
    tagline: 'Hotspots, Bypass Diodes & Yield Audits',
    desc: 'Thermographic panel scanning detecting defective cells, string failures, soiling, and micro-cracks under IEC 62446-3 standards.',
    deliverable: 'Hotspot Anomaly Register',
  },
  {
    title: 'Surveying & Mapping',
    href: '/services/drone-services/surveying-mapping',
    icon: Map,
    badge: 'GEOSPATIAL',
    tagline: '2D Orthomosaics, DEMs & GIS Vectors',
    desc: 'Millimetre-accurate 2D aerial mapping and topographic models calibrated with RTK positioning for CAD and GIS.',
    deliverable: 'GeoTIFF & DXF Contours',
  },
  {
    title: 'Construction Monitoring',
    href: '/services/drone-services/construction-monitoring',
    icon: Construction,
    badge: 'PROGRESS TRACKING',
    tagline: 'Scheduled Repeat Milestone Capture',
    desc: 'GPS-locked repeat flights recording progress from groundworks to handover, generating dispute and investor archives.',
    deliverable: 'Monthly Progress Comparison',
  },
  {
    title: 'Emergency & Insurance Surveys',
    href: '/services/drone-services/emergency-insurance-surveys',
    icon: CloudLightning,
    badge: 'INCIDENT RESPONSE',
    tagline: 'Storm Damage & Make-Safe Triage',
    desc: 'Rapid visual inspection of unstable structures and storm damage to formulate make-safe scopes and insurance loss reports.',
    deliverable: 'Loss Adjuster Evidence Pack',
  },
  {
    title: 'Digital Twin & 3D Reality Capture',
    href: '/services/drone-services/digital-twin-3d-capture',
    icon: Box,
    badge: 'REALITY CAPTURE',
    tagline: 'Point Clouds & Photogrammetric 3D Meshes',
    desc: 'Persistent spatial 3D building models for remote stakeholder inspection, virtual measurements, and BIM integration.',
    deliverable: '3D Mesh & LAS Point Cloud',
  },
  {
    title: 'Volumetric Surveys',
    href: '/services/drone-services/volumetric-surveys',
    icon: Boxes,
    badge: 'QUANTIFICATION',
    tagline: 'Stockpiles & Cut/Fill Earthworks',
    desc: 'Rapid 3D volumetric measurement of material stockpiles, aggregates, bulk minerals, and excavation cut/fill balances.',
    deliverable: 'Cubic Metre Volume Report',
  },
  {
    title: 'Aerial Photography & Video',
    href: '/services/drone-services/aerial-photography-video',
    icon: Video,
    badge: 'ESTATE MEDIA',
    tagline: '4K/6K Property & Portfolio Media',
    desc: 'Cinematic commercial drone photography and videography for property marketing, investor reporting, and completed projects.',
    deliverable: '4K/6K RAW Media Suite',
  },
];

const SECTORS = [
  {
    title: 'Commercial Offices & Towers',
    icon: Building,
    desc: 'Multi-storey curtain walling, high-rise facade condition, and rooftop chiller plant audits with zero ground disruption.',
  },
  {
    title: 'Logistics & Warehousing',
    icon: Truck,
    desc: 'Vast low-pitch metal roofs, high-capacity valley gutters, and perimeter yard security and boundary inspections.',
  },
  {
    title: 'Industrial & Manufacturing',
    icon: Factory,
    desc: 'Process chimneys, pipe bridges, boiler flues, and structural gantries surveyed without hazardous shutdowns.',
  },
  {
    title: 'Retail Parks & Shopping Centres',
    icon: Store,
    desc: 'Glazed canopies, parapet gutters, tenant roof penetrations, and external customer car parks inspected out-of-hours.',
  },
  {
    title: 'Healthcare & Education Campuses',
    icon: GraduationCap,
    desc: 'Multi-building estate condition mapping, flat roof surveys, and heating distribution duct thermography.',
  },
  {
    title: 'Construction & Development',
    icon: Construction,
    desc: 'Groundworks cut/fill analysis, monthly milestone photography, and envelope weather-tightness verification.',
  },
];

export function TemplateDroneHub({ route, content }: TemplateDroneHubProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative min-h-[640px] lg:min-h-[740px] flex items-center bg-[#0B1220] overflow-hidden pt-28 pb-16">
          {/* Blue-Hour Commercial Rooftop Drone Photography */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
              alt="EntireFM commercial drone aerial inspection operating over commercial building roofscape at blue hour"
              fill
              priority
              className="object-cover object-center opacity-60 scale-105 transition-transform duration-1000 ease-out"
              sizes="100vw"
            />
            {/* Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/70 to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/85 to-transparent" />
          </div>

          <div className="container-custom relative z-10">
            <div className="max-w-3xl space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-white/90 font-semibold">
                  AERIAL ASSET INTELLIGENCE &amp; SURVEYING
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.1]">
                Drone Inspection, <br />
                <span className="font-bold text-hero-pink">
                  Surveying &amp; Asset Intelligence
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl">
                Commercial drone services for buildings, estates, infrastructure and construction — integrated directly with EntireFM maintenance, compliance and physical repair delivery.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/tools/drone-inspection-planner"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-magenta px-7 py-3.5 text-sm font-semibold text-white shadow-elevated hover:shadow-pink-500/25 transition-all hover:scale-[1.02]"
                >
                  <span>Plan a Drone Inspection</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#services-family"
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/10 backdrop-blur-md px-6 py-3.5 text-sm font-medium text-white hover:bg-white/20 transition-all"
                >
                  <span>Explore Drone Services</span>
                </a>
              </div>

              {/* Subtle Trust Strip (No invented client logos) */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-white/70">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Commercial Properties
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Logistics &amp; Warehouses
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Industrial Sites
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Construction
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Infrastructure
                </span>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. THE CORE DIFFERENTIATOR (INSPECT → REMEDIATE → RECORD) */}
        {/* ========================================================================= */}
        <DroneProcessFlow />

        {/* ========================================================================= */}
        {/* 3. DRONE SERVICES FAMILY (11 SUB-SERVICE CARDS) */}
        {/* ========================================================================= */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200" id="services-family">
          <div className="container-custom space-y-16">
            <div className="max-w-3xl space-y-3.5">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-pink">
                  SERVICE FAMILY
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Complete Aerial Asset Intelligence Capabilities
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                Eleven specialized commercial drone services engineered for facilities directors, asset managers, and construction teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DRONE_SERVICES_LIST.map((srv, idx) => {
                const Icon = srv.icon;
                return (
                  <Link
                    key={idx}
                    href={srv.href}
                    className="p-7 bg-white border border-slate-200 rounded-[14px] shadow-sm hover:border-brand-pink hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-[10px] bg-slate-50 border border-slate-200 flex items-center justify-center text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors shadow-subtle">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-mono text-[9px] uppercase font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-[4px]">
                          {srv.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-pink transition-colors">
                          {srv.title}
                        </h3>
                        <p className="text-xs font-semibold text-brand-pink mt-0.5">
                          {srv.tagline}
                        </p>
                        <p className="mt-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                          {srv.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <span className="text-[10.5px] font-mono text-slate-500 block">
                          <strong className="text-slate-800">Deliverable:</strong> {srv.deliverable}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-pink group-hover:text-brand-pink-dark">
                      <span>Explore Service Details</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. DRONE INSPECTION PACKAGES */}
        {/* ========================================================================= */}
        <DronePackagesSection />

        {/* ========================================================================= */}
        {/* 5. DRONE PPM INTEGRATION */}
        {/* ========================================================================= */}
        <DronePpmSection />

        {/* ========================================================================= */}
        {/* 6. ENTIRECAFM INTEGRATION */}
        {/* ========================================================================= */}
        <DroneCafmWorkflow />

        {/* ========================================================================= */}
        {/* 7. SAMPLE TECHNICAL OUTPUTS */}
        {/* ========================================================================= */}
        <DroneSampleOutputs />

        {/* ========================================================================= */}
        {/* 8. COMPLIANCE & SAFETY GOVERNANCE */}
        {/* ========================================================================= */}
        <DroneComplianceSection />

        {/* ========================================================================= */}
        {/* 9. RELEVANT SECTORS */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-pink">
                  SECTOR APPLICATIONS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Commercial Environments We Support
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Tailored flight profiles and reporting methodologies suited to complex commercial, industrial, and institutional real estate portfolios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SECTORS.map((sec, idx) => {
                const Icon = sec.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-[12px] bg-[#FAF9FB] border border-slate-200 space-y-3 hover:border-brand-pink transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-sm bg-white border border-slate-200 flex items-center justify-center text-brand-pink shadow-subtle">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{sec.title}</h3>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. TECHNICAL FAQS */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-10">
            <div className="text-center space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-pink">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Commercial Drone Services FAQ
              </h2>
              <p className="text-sm text-slate-600">
                Authoritative technical details on regulations, weather thresholds, deliverables, and EntireFM remedial execution.
              </p>
            </div>

            <FAQAccordion faqs={content.faqs || []} />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. CONVERSION SECTION */}
        {/* ========================================================================= */}
        <ServiceConversionSection
          serviceName="Drone Services"
          headline="Plan a Commercial Drone Survey"
          subheadline="Provide brief estate details below to receive a tailored drone inspection scope, flight feasibility review, or multi-site PPM quotation."
          badgeText="AERIAL ASSET CONSULTATION"
          ctaButtonText="Request Drone Survey Scope"
          directDeskNote="Speak directly with our aviation operations lead or regional technical director."
        />
      </main>

      <Footer />
    </div>
  );
}
