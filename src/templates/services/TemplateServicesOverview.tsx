'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ServiceHero } from '@/components/services/ServiceHero';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';

import { ServiceNavigator } from '@/components/services/interactive/ServiceNavigator';
import { ServiceUniverse } from '@/components/services/interactive/ServiceUniverse';
import { FeaturedServiceExplorer } from '@/components/services/interactive/FeaturedServiceExplorer';
import { TotalFmSystemDiagram } from '@/components/services/interactive/TotalFmSystemDiagram';
import { OperationalJourney } from '@/components/services/interactive/OperationalJourney';
import { ComplianceCommandSection } from '@/components/services/interactive/ComplianceCommandSection';
import { SpecialistCapabilityMosaic } from '@/components/services/interactive/SpecialistCapabilityMosaic';
import { CuratedServiceDirectory } from '@/components/services/interactive/CuratedServiceDirectory';
import { NationwideDeliverySection } from '@/components/services/interactive/NationwideDeliverySection';

interface TemplateServicesOverviewProps {
  route: RouteRecord;
  content: ContentRecord;
}

export function TemplateServicesOverview({ route, content }: TemplateServicesOverviewProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ── SECTION 01: CINEMATIC HERO (Existing on-brand hero retained) ── */}
        <ServiceHero
          eyebrow="COMMERCIAL ESTATE OPERATIONS"
          title="Commercial Facilities Management &"
          highlightedTitle="Engineering Services"
          intro="Entire Facilities Management delivers single-source Hard & Soft FM for commercial property owners, landlords, and managing agents nationwide. Certified engineering fleets, 52-week planned maintenance calendars, and complete compliance transparency."
          imageSrc="/images/editorial/entirefm-switchgear-inspection-2000w.webp"
          imageAlt="EntireFM engineer conducting maintenance inspection on commercial distribution switchgear"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Explore Service Scope', href: '#service-navigator' }}
          secondaryCta={{ label: 'Request a Proposal', href: '#enquiry' }}
          serviceFacts={[
            { label: 'Engineering Delivery', value: '100% Direct Certified' },
            { label: 'Statutory Verification', value: '10 Regimes in CAFM' },
            { label: 'Emergency Attendance', value: '24/7 Operations Desk' },
          ]}
        />

        {/* Brand Trust Bar */}
        <TrustBar />

        {/* ── SECTION 02: INTERACTIVE SERVICE NAVIGATOR ── */}
        <ServiceNavigator />

        {/* ── SECTION 03 & 04: THE SERVICE UNIVERSE (5 Families + Sticky Nav) ── */}
        <ServiceUniverse />

        {/* ── SECTION 08: FEATURED SERVICE EXPLORER (Configurator View) ── */}
        <FeaturedServiceExplorer />

        {/* ── SECTION 09: TOTAL FM SYSTEM ARCHITECTURE (Deep Dark Break) ── */}
        <TotalFmSystemDiagram />

        {/* ── SECTION 10: OPERATIONAL JOURNEY (From Asset to Action) ── */}
        <OperationalJourney />

        {/* ── SECTION 11: COMPLIANCE COMMAND REGISTER ── */}
        <ComplianceCommandSection />

        {/* Accreditations Trust Rail */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="container-custom">
            <AccreditationRail />
          </div>
        </section>

        {/* ── SECTION 12: SPECIALIST CAPABILITY MOSAIC ── */}
        <SpecialistCapabilityMosaic />

        {/* ── SECTION 13: CURATED ALL SERVICES DIRECTORY (Replaces Text Dump) ── */}
        <CuratedServiceDirectory />

        {/* ── SECTION 14: NATIONWIDE DELIVERY & REGIONAL NETWORK ── */}
        <NationwideDeliverySection />

        {/* ── SECTION 15: COMMERCIAL PROPOSAL CLOSE ── */}
        <div id="enquiry">
          <ProposalSection
            headline="Build your facilities management scope"
            subheadline="Tell us what you operate. We'll formulate the planned maintenance model, statutory compliance regime, and reactive SLA framework around your estate."
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
