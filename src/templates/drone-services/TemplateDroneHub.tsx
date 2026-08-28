'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { DroneServiceFaq } from '@/components/drone-services/DroneServiceFaq';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';

// Cinematic & Editorial Drone Components
import { DroneHeroCinematic } from '@/components/drone-services/DroneHeroCinematic';
import { DroneCoreProposition } from '@/components/drone-services/DroneCoreProposition';
import { DroneRoofFilmSection } from '@/components/drone-services/DroneRoofFilmSection';
import { DroneAerialRepairStory } from '@/components/drone-services/DroneAerialRepairStory';
import { DroneEditorialChapters } from '@/components/drone-services/DroneEditorialChapters';
import { DroneThermalReveal } from '@/components/drone-services/DroneThermalReveal';
import { DroneGaussianSplatExperience } from '@/components/drone-services/DroneGaussianSplatExperience';
import { DroneDigitalTwinSection } from '@/components/drone-services/DroneDigitalTwinSection';
import { DroneServiceDirectory } from '@/components/drone-services/DroneServiceDirectory';
import { DronePpmSeasons } from '@/components/drone-services/DronePpmSeasons';
import { DroneCafmAction } from '@/components/drone-services/DroneCafmAction';
import { DronePeopleGovernance } from '@/components/drone-services/DronePeopleGovernance';
import { DroneFinalHeroCta } from '@/components/drone-services/DroneFinalHeroCta';

import { 
  Building, 
  Factory, 
  Truck, 
  GraduationCap, 
  Store, 
  Construction
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
    <div className="min-h-screen flex flex-col bg-brand-void text-slate-900 selection:bg-brand-pink selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 01 — DARK CINEMATIC HERO */}
        {/* ========================================================================= */}
        <DroneHeroCinematic />

        {/* Corporate Trust Bar */}
        <TrustBar />

        {/* ========================================================================= */}
        {/* 02 — LIGHT CORPORATE SECTION: CORE PROPOSITION */}
        {/* ========================================================================= */}
        <DroneCoreProposition />

        {/* ========================================================================= */}
        {/* 03 — FULL-BLEED ROOF INSPECTION FILM */}
        {/* ========================================================================= */}
        <DroneRoofFilmSection />

        {/* ========================================================================= */}
        {/* 04 — LIGHT EDITORIAL SECTION: AERIAL → REPAIR STORY */}
        {/* ========================================================================= */}
        <DroneAerialRepairStory />

        {/* ========================================================================= */}
        {/* 05 — DARK CINEMATIC CAPABILITY CHAPTERS */}
        {/* ========================================================================= */}
        <DroneEditorialChapters />

        {/* ========================================================================= */}
        {/* 06 — INTERACTIVE MULTI-SPECTRUM THERMAL REVEAL */}
        {/* ========================================================================= */}
        <DroneThermalReveal />

        {/* ========================================================================= */}
        {/* 07 — ENTIREFM 3D IMMERSIVE SPATIAL EXPERIENCE */}
        {/* ========================================================================= */}
        <DroneGaussianSplatExperience />

        {/* ========================================================================= */}
        {/* 08 — LIGHT CORPORATE: BUILDING DIGITAL TWIN */}
        {/* ========================================================================= */}
        <DroneDigitalTwinSection />

        {/* ========================================================================= */}
        {/* 09 — WHITE EDITORIAL SERVICE DIRECTORY (ALL 11 SUB-SERVICES) */}
        {/* ========================================================================= */}
        <DroneServiceDirectory />

        {/* ========================================================================= */}
        {/* 10 — LIGHT CORPORATE PPM TIMELINE (4 SEASONS) */}
        {/* ========================================================================= */}
        <DronePpmSeasons />

        {/* ========================================================================= */}
        {/* 11 — ENTIRECAFM OPERATIONAL PLATFORM */}
        {/* ========================================================================= */}
        <DroneCafmAction />

        {/* ========================================================================= */}
        {/* 12 — PEOPLE, FIELD TEAMS & CORPORATE GOVERNANCE */}
        {/* ========================================================================= */}
        <DronePeopleGovernance />

        {/* ========================================================================= */}
        {/* SECTOR APPLICATIONS */}
        {/* ========================================================================= */}
        <section className="py-24 bg-slate-50 border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-brand-pink text-xs uppercase tracking-[0.2em] font-semibold">
                <span className="w-6 h-px bg-brand-pink" />
                <span>SECTOR APPLICATIONS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900">
                Commercial Environments We Support
              </h2>
              <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
                Tailored flight profiles, risk assessments, and reporting methodologies engineered for complex commercial, industrial, logistics, and institutional real estate portfolios across the UK.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SECTORS.map((sec, idx) => {
                const Icon = sec.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-sm bg-white border border-slate-200 space-y-3 hover:border-brand-pink transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center text-brand-pink">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-medium text-slate-900">{sec.title}</h3>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-light">
                      {sec.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* AUTHORITATIVE FAQS (Server-Rendered & Semantic) */}
        {/* ========================================================================= */}
        {content.faqs && content.faqs.length > 0 && (
          <DroneServiceFaq
            eyebrow="COMMERCIAL DRONE FAQ"
            title="Frequently Asked Questions"
            intro="Authoritative technical details on UK CAA regulations, weather limits, engineering deliverables, and EntireFM physical remedial execution."
            faqs={content.faqs}
          />
        )}

        {/* ========================================================================= */}
        {/* 13 — FINAL CINEMATIC CTA */}
        {/* ========================================================================= */}
        <DroneFinalHeroCta />

        {/* ========================================================================= */}
        {/* CONVERSION CONSULTATION SECTION */}
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
