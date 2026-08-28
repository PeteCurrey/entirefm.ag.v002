'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';

// Flagship Drone Experience Components (13 Sections)
import { DroneHeroCinematic } from '@/components/drone-services/DroneHeroCinematic';
import { DroneStorySequence } from '@/components/drone-services/DroneStorySequence';
import { DroneInteractiveInspection } from '@/components/drone-services/DroneInteractiveInspection';
import { DroneMultiSpectrumView } from '@/components/drone-services/DroneMultiSpectrumView';
import { Drone3DDigitalTwin } from '@/components/drone-services/Drone3DDigitalTwin';
import { DroneCapabilityChapters } from '@/components/drone-services/DroneCapabilityChapters';
import { DroneRemediationComparison } from '@/components/drone-services/DroneRemediationComparison';
import { DronePackagesSelector } from '@/components/drone-services/DronePackagesSelector';
import { DronePpmTimeline } from '@/components/drone-services/DronePpmTimeline';
import { DroneCafmPlatform } from '@/components/drone-services/DroneCafmPlatform';
import { DroneDeliverableLab } from '@/components/drone-services/DroneDeliverableLab';
import { DroneFlightGovernance } from '@/components/drone-services/DroneFlightGovernance';
import { DroneFinalHeroCta } from '@/components/drone-services/DroneFinalHeroCta';

import { 
  Building, 
  Factory, 
  Truck, 
  GraduationCap, 
  Store, 
  Construction,
  ShieldCheck
} from 'lucide-react';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';

interface TemplateDroneHubProps {
  route: RouteRecord;
  content: ContentRecord;
}

const SECTORS = [
  {
    title: 'Commercial Offices & Corporate Towers',
    icon: Building,
    desc: 'Multi-storey curtain walling, high-rise façade condition, and rooftop chiller plant audits with zero disruption to tenants or ground transport.',
  },
  {
    title: 'Logistics, Warehousing & Distribution',
    icon: Truck,
    desc: 'Vast low-pitch metal roofscapes, high-capacity valley gutters, and perimeter yard security and boundary inspections.',
  },
  {
    title: 'Industrial & Heavy Manufacturing',
    icon: Factory,
    desc: 'Process chimneys, pipe bridges, boiler flues, and structural gantries surveyed without hazardous facility shutdowns.',
  },
  {
    title: 'Retail Parks & Shopping Centres',
    icon: Store,
    desc: 'Glazed canopies, parapet gutters, tenant roof penetrations, and external customer car parks inspected out-of-hours.',
  },
  {
    title: 'Healthcare & University Campuses',
    icon: GraduationCap,
    desc: 'Multi-building estate condition mapping, flat roof surveys, and heating distribution duct thermography.',
  },
  {
    title: 'Construction & Real Estate Development',
    icon: Construction,
    desc: 'Groundworks cut/fill volume analysis, monthly milestone photography, and envelope weather-tightness verification.',
  },
];

export function TemplateDroneHub({ route, content }: TemplateDroneHubProps) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-void text-white selection:bg-brand-pink selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 01 — CINEMATIC FULL-VIEWPORT HERO */}
        {/* ========================================================================= */}
        <DroneHeroCinematic />

        {/* Global Trust Bar */}
        <TrustBar />

        {/* ========================================================================= */}
        {/* 02 — THE ENTIREFM AERIAL-TO-REPAIR STORY */}
        {/* ========================================================================= */}
        <DroneStorySequence />

        {/* ========================================================================= */}
        {/* 03 — INTERACTIVE BUILDING INSPECTION */}
        {/* ========================================================================= */}
        <DroneInteractiveInspection />

        {/* ========================================================================= */}
        {/* 04 — MULTI-SPECTRUM VIEW */}
        {/* ========================================================================= */}
        <DroneMultiSpectrumView />

        {/* ========================================================================= */}
        {/* 05 — IMMERSIVE 3D / GAUSSIAN SPLAT EXPERIENCE */}
        {/* ========================================================================= */}
        <Drone3DDigitalTwin />

        {/* ========================================================================= */}
        {/* 06 — CINEMATIC CAPABILITY CHAPTERS */}
        {/* ========================================================================= */}
        <DroneCapabilityChapters />

        {/* ========================================================================= */}
        {/* 07 — BEFORE → REMEDIATE → AFTER */}
        {/* ========================================================================= */}
        <DroneRemediationComparison />

        {/* ========================================================================= */}
        {/* 08 — COMMERCIAL DRONE PACKAGES */}
        {/* ========================================================================= */}
        <DronePackagesSelector />

        {/* ========================================================================= */}
        {/* 09 — DRONE PPM / CONDITION HISTORY */}
        {/* ========================================================================= */}
        <DronePpmTimeline />

        {/* ========================================================================= */}
        {/* 10 — ENTIRECAFM INTEGRATION */}
        {/* ========================================================================= */}
        <DroneCafmPlatform />

        {/* ========================================================================= */}
        {/* 11 — TECHNICAL DELIVERABLE LAB */}
        {/* ========================================================================= */}
        <DroneDeliverableLab />

        {/* ========================================================================= */}
        {/* 12 — FLIGHT OPERATIONS / GOVERNANCE */}
        {/* ========================================================================= */}
        <DroneFlightGovernance />

        {/* ========================================================================= */}
        {/* SECTOR APPLICATIONS */}
        {/* ========================================================================= */}
        <section className="py-20 bg-brand-carbon border-b border-brand-edge-dark">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="font-mono text-xs uppercase tracking-wider text-brand-pink font-medium">
                  SECTOR APPLICATIONS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white">
                Commercial Environments We Support
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
                Tailored flight profiles, risk assessments, and reporting methodologies engineered for complex commercial, industrial, logistics, and institutional real estate portfolios across the UK.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SECTORS.map((sec, idx) => {
                const Icon = sec.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-sm bg-brand-void/80 border border-brand-edge-dark space-y-3 hover:border-brand-pink transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-brand-pink/15 border border-brand-pink/30 flex items-center justify-center text-brand-pink">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-light text-white">{sec.title}</h3>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-light">
                      {sec.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TECHNICAL FAQS (Server-rendered & Indexable) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-brand-void border-b border-brand-edge-dark">
          <div className="container-custom max-w-4xl space-y-10">
            <div className="text-center space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-brand-pink font-medium">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-white">
                Commercial Drone Services FAQ
              </h2>
              <p className="text-sm text-slate-300 font-light max-w-2xl mx-auto">
                Authoritative technical details on UK CAA regulations, weather limits, engineering deliverables, and EntireFM physical remedial execution.
              </p>
            </div>

            <FAQAccordion faqs={content.faqs || []} />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 13 — FINAL HERO CTA */}
        {/* ========================================================================= */}
        <DroneFinalHeroCta />

        {/* ========================================================================= */}
        {/* CONVERSION SECTION */}
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
