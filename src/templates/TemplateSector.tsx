'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { SectorCinematicHero } from '@/components/sectors/SectorCinematicHero';
import { SectorOperationalReality } from '@/components/sectors/SectorOperationalReality';
import { SectorSystemsNavigator } from '@/components/sectors/SectorSystemsNavigator';
import { SectorRiskCasebook } from '@/components/sectors/SectorRiskCasebook';
import { SectorEstateAnatomy } from '@/components/sectors/SectorEstateAnatomy';
import { SectorOperatingModel } from '@/components/sectors/SectorOperatingModel';
import { SectorCAFMShowcase } from '@/components/sectors/SectorCAFMShowcase';
import { SectorEvidence } from '@/components/sectors/SectorEvidence';
import { SectorTenderCTA } from '@/components/sectors/SectorTenderCTA';
import { SectorFAQ } from '@/components/sectors/SectorFAQ';
import { SectorRelatedServices } from '@/components/sectors/SectorRelatedServices';
import { SectorFinalCTA } from '@/components/sectors/SectorFinalCTA';
import { resolveSectorArchetype } from '@/data/sectors/archetypes';
import { listPublishedCaseStudies } from '@/server/trust/case-studies';
import type { TemplateProps } from './types';

export function TemplateSector({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Sectors', url: '/sectors' },
    { name: content.h1, url: route.path },
  ];

  // Resolve sector archetype profile
  const archetype = resolveSectorArchetype(route.path);
  const caseStudies = listPublishedCaseStudies();

  // Filter case studies relevant to this sector if possible, otherwise use published list
  const filteredCaseStudies = caseStudies.filter((cs) =>
    cs.sector.toLowerCase().includes(archetype.name.toLowerCase().split(' ')[0]) ||
    archetype.name.toLowerCase().includes(cs.sector.toLowerCase())
  );
  const displayCaseStudies = filteredCaseStudies.length > 0 ? filteredCaseStudies : caseStudies;

  // Sector content components with fallbacks preserving existing SEO data
  const faqs = content.faqs && content.faqs.length > 0 ? content.faqs : [
    {
      question: `How does EntireFM structure facilities management for ${archetype.name} estates?`,
      answer: `We deliver dedicated Hard and Soft FM structured around site-specific access windows, production schedules, or trading hours, backed by SFG20 preventative maintenance routines and complete digital compliance certification in EntireCAFM.`,
    },
    {
      question: 'How do you handle out-of-hours or emergency breakdowns?',
      answer: 'Our central 24/7 operations desk coordinates directly employed mobile engineers with contracted response SLAs tailored to your critical plant priorities.',
    },
    {
      question: 'Can you consolidate existing multi-supplier contracts into a single agreement?',
      answer: 'Yes. EntireFM acts as a single-source facilities management partner, self-delivering core M&E, HVAC, building maintenance, and cleaning under one consolidated SLA and transparent monthly reporting framework.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-brand-pink/20 selection:text-brand-pink">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. SECTOR CINEMATIC HERO (Full-Viewport / High-Impact Photography) */}
        <SectorCinematicHero
          eyebrow={archetype.heroBadge}
          headline={archetype.heroHeadline}
          subline={archetype.heroSubline}
          imageSrc={archetype.heroImage}
          imageAlt={archetype.heroImageAlt}
          breadcrumbs={breadcrumbs}
          facts={archetype.heroFacts}
          primaryCta={{ label: 'Discuss Your Estate', href: '#enquiry' }}
        />

        {/* 2. TRUST / ACCREDITATIONS BAR */}
        <TrustBar />

        {/* 3. SIGNATURE OPERATIONAL REALITY SECTION (60/40 Editorial Split) */}
        <SectorOperationalReality
          statement={archetype.operationalStatement}
          leadText={archetype.operationalLead}
          imageSrc={archetype.realityImage}
          imageAlt={archetype.realityImageAlt}
          imageCaption={archetype.realityImageCaption}
          realities={archetype.operationalRealities}
        />

        {/* 4. ESTATE DISCIPLINES & SYSTEMS NAVIGATOR (Interactive Discipline Browser) */}
        <SectorSystemsNavigator
          eyebrow="ESTATE DISCIPLINES & SCOPES"
          headline={archetype.systemsHeadline}
          subheadline={archetype.systemsSubline}
          groups={archetype.systemGroups}
          fallbackImage={archetype.heroImage}
        />

        {/* 5. OPERATIONAL RISK & MITIGATION CASEBOOK (Technical Consultancy Format) */}
        <SectorRiskCasebook
          eyebrow="OPERATIONAL RISK & MITIGATION CASEBOOK"
          headline={archetype.challengesHeadline}
          subheadline={archetype.challengesSubline}
          challenges={archetype.challenges}
        />

        {/* 6. ESTATE ANATOMY BREAKDOWN (Visual Touchpoints) */}
        {archetype.anatomy && (
          <SectorEstateAnatomy
            eyebrow="ESTATE ANATOMY"
            headline={archetype.anatomy.headline}
            subline={archetype.anatomy.subline}
            imageSrc={archetype.anatomy.imageSrc}
            imageAlt={archetype.anatomy.imageAlt}
            callouts={archetype.anatomy.callouts}
          />
        )}

        {/* 7. VISUAL OPERATING MODEL (5-Phase Horizontal Timeline) */}
        <SectorOperatingModel
          eyebrow="DELIVERY METHODOLOGY"
          headline={archetype.operatingModelHeadline}
          subheadline={archetype.operatingModelSubline}
          steps={archetype.operatingSteps}
        />

        {/* 8. ENTIRECAFM DIGITAL PLATFORM SHOWCASE (Real Product Interface) */}
        <SectorCAFMShowcase
          eyebrow={archetype.technologyFocus.badge}
          headline={archetype.technologyFocus.title}
          subline={archetype.technologyFocus.description}
          features={archetype.technologyFocus.features}
        />

        {/* 9. VERIFIED CASE STUDY PROOF */}
        <SectorEvidence
          eyebrow="VERIFIED OPERATIONAL EVIDENCE"
          headline="Demonstrated Engineering Delivery & Compliance Governance"
          subline="Operational performance, statutory audit readiness, and asset lifecycle optimization across UK commercial facilities."
          caseStudies={displayCaseStudies}
        />

        {/* 10. TENDER / PROCUREMENT BRIEF TOOL ADVISORY */}
        <SectorTenderCTA
          eyebrow="PROCUREMENT & TENDER PLANNING"
          headline="Structuring an FM Invitation to Tender (ITT) for Your Estate?"
          subline="Use our free interactive Tender Brief Generator to specify plant assets, maintenance frequencies, access windows, and contracted SLA KPIs."
          buttonText="Open Tender Brief Generator"
          href="/tools/tender-brief"
        />

        {/* 11. SECTOR FAQS (Clean Understated Accordion) */}
        <SectorFAQ
          eyebrow="EXPERT GUIDANCE"
          headline={`Frequently Asked Questions — ${archetype.name}`}
          subline="Clear answers on contract mobilisation, access windows, statutory compliance, and operational governance."
          faqs={faqs}
        />

        {/* 12. RELATED SERVICES DISCIPLINE LINKS */}
        <SectorRelatedServices
          services={archetype.relatedServiceSlugs}
          allSectorsHref="/sectors"
        />

        {/* 13. SECTOR-SPECIFIC CONVERSION & PROPOSAL SECTION */}
        <SectorFinalCTA
          serviceName={content.h1}
          headline={archetype.conversionCta.headline}
          subline={archetype.conversionCta.subheadline}
          imageSrc={archetype.heroImage}
        />
      </main>

      <Footer />
    </div>
  );
}
