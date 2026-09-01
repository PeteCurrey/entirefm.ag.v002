'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceScopeStrip } from '@/components/services/ServiceScopeStrip';
import { ServiceEditorialIntro } from '@/components/services/ServiceEditorialIntro';
import { VisualCapabilityExperience } from '@/components/services/VisualCapabilityExperience';
import { SupportedAssetsGrid } from '@/components/services/SupportedAssetsGrid';
import { ServiceDeliveryProcess } from '@/components/services/ServiceDeliveryProcess';
import { PlannedVsReactiveSplit } from '@/components/services/PlannedVsReactiveSplit';
import { ServiceSectorsGrid } from '@/components/services/ServiceSectorsGrid';
import { TechnologyCafmSection } from '@/components/services/TechnologyCafmSection';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { getServiceMedia } from '@/config/media-registry';
import type { TemplateProps } from '../types';

export function ServiceCraneHire({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: content.h1, url: route.path },
  ];

  const serviceMedia = getServiceMedia(route.path);

  const scopePillars = [
    {
      label: 'CPA CONTRACT LIFT',
      sublabel: 'Full Turnkey Liability',
      iconName: 'maintenanceTools' as const,
    },
    {
      label: 'APPOINTED PERSON',
      sublabel: 'CPCS Appointed Person Lift Plan',
      iconName: 'complianceAudit' as const,
    },
    {
      label: 'ROOFTOP PLANT',
      sublabel: 'HVAC & Chiller Rigging',
      iconName: 'powerElectrical' as const,
    },
    {
      label: 'NATIONWIDE FLEET',
      sublabel: 'Böcker & Truck Cranes',
      iconName: 'nationwideCoverage' as const,
    },
  ];

  const capabilities = [
    {
      name: 'Full CPA Contract Lifting & Turnkey Project Management',
      description: 'Comprehensive CPA Contract Lifting solutions where EntireFM assumes complete legal and operational responsibility, supplying the Appointed Person (AP), Lift Supervisor, Slinger Signallers, crane, and all specialized rigging tackle.',
      tag: 'CPA Contract Lifting',
      imageSrc: '/images/locations/sheffield/facilities-management-sheffield-rooftop-plant-checks-1600w.webp',
      imageAlt: 'EntireFM contract lifting team coordinating rooftop plant crane lift',
      keyPoints: [
        'EntireFM takes 100% legal responsibility and full insurance liability under CPA terms',
        'CPCS-certified Appointed Person formulating 3D CAD lift plans and method statements (RAMS)',
        'Full road closure applications, council permits, and traffic management coordination',
        'Certified Crane Supervisors, Slinger Signallers, and rigging specialists on site',
      ],
      isFeatured: true,
      href: '/mobile-crane-hire',
    },
    {
      name: 'Böcker Aluminium Mobile Cranes & Compact Access',
      description: 'Ultra-compact, lightweight Böcker aluminium trailer and truck-mounted cranes designed for restricted city-centre sites, pedestrian zones, and fragile sub-surface ground loadings.',
      tag: 'Böcker Aluminium Cranes',
      imageSrc: '/images/locations/sheffield/facilities-management-sheffield-industrial-unit-1600w.webp',
      imageAlt: 'Böcker compact mobile crane operating on commercial property site',
      keyPoints: [
        'Lightweight aluminium boom technology reaching heights up to 44m',
        'Extremely low outrigger ground loadings ideal for basements and paved courtyards',
        'Zero-emission electric hybrid drive options for indoor or residential operations',
        'Rapid outrigger setup and tight turning circles for confined access lanes',
      ],
      href: '/bocker-crane-hire',
    },
    {
      name: 'Rooftop Plant Replacement & Heavy Mechanical Rigging',
      description: 'Specialist precision lifting of commercial rooftop chillers, air handling units (AHUs), cooling towers, boiler plant, and steelwork over occupied multi-storey buildings.',
      tag: 'Plant Room Rigging',
      imageSrc: '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
      imageAlt: 'EntireFM rooftop HVAC plant deck installation and chiller crane rigging',
      keyPoints: [
        'Complex dual-crane tandem lifts and blind-lift radio coordination',
        'Certified spreader beams, modular lifting frames, and calibrated load cells',
        'Out-of-hours weekend crane lifts to prevent tenant or traffic disruption',
        'Full mechanical decommissioning, disconnection, and scrap removal',
      ],
      href: '/hvac-contractor',
    },
    {
      name: 'Truck-Mounted Mobile Cranes & All-Terrain Hire',
      description: 'Heavy truck-mounted mobile telescopic cranes and compact city cranes up to 100t capacity delivering rapid deployment for structural steel and mechanical lifts.',
      tag: 'Truck Mount Cranes',
      imageSrc: '/images/locations/derby/facilities-management-derby-industrial-estate-1600w.webp',
      imageAlt: 'Truck mounted mobile crane positioned for commercial roof access',
      keyPoints: [
        'All-terrain mobile cranes ready for quick highway transit and site setup',
        'Variable outrigger base positioning (VarioBase) for tight site footprints',
        'Certified LOLER documentation and statutory 6-monthly thorough examination certificates',
      ],
      href: '/truck-mount-crane-hire',
    },
  ];

  const assetCategories = [
    {
      title: 'Mobile Crane Fleet',
      subtitle: 'Specialist Lifting Machinery',
      iconName: 'maintenanceTools' as const,
      assets: [
        'Böcker Aluminium Mobile Trailer Cranes (30–44m)',
        'Compact City Cranes (13t–40t capacity)',
        'All-Terrain Telescopic Mobile Cranes (40t–100t)',
        'Truck-Mounted Heavy Boom Lorry Loaders (Hiab)',
        'Hybrid Electric Emission-Free Lifting Units',
      ],
    },
    {
      title: 'Certified Rigging Tackle & Hardware',
      subtitle: 'Lifting Accessories & Safety',
      iconName: 'complianceAudit' as const,
      assets: [
        'Modular Spreader Beams & Lifting Beams',
        'Grade 100 Chain Slings & Wire Rope Grommets',
        'Heavy-Duty Outrigger Mats & Ground Spreader Pads',
        'Wireless Calibrated Telemetry Load Cells',
        'Radio Communication Headsets for Blind Lifts',
      ],
    },
    {
      title: 'Safety Documentation & Permits',
      subtitle: 'Statutory Lifting Compliance',
      iconName: 'dataInsights' as const,
      assets: [
        'BS 7121 CPCS Appointed Person Lift Plans',
        'Comprehensive 3D CAD Lift Modeling & Radius Charts',
        'Local Authority Section 50 Road Closure Permits',
        'LOLER 1998 Thorough Examination Certificates',
        'Full CPA Contract Lift Comprehensive Insurance',
      ],
    },
  ];

  const deliverySteps = [
    {
      number: '01',
      title: 'Site Survey & Ground Loading Assessment',
      description: 'Our CPCS Appointed Person surveys the site, measuring lift radiuses, underground services, outrigger loadings, and access restrictions.',
    },
    {
      number: '02',
      title: '3D CAD Lift Plan & Authority Permits',
      description: 'Formulating the engineered lift plan, risk assessment (RAMS), method statement, and obtaining necessary council road closure permits.',
    },
    {
      number: '03',
      title: 'Turnkey CPA Lift Execution',
      description: 'Our fully accredited team (Appointed Person, Lift Supervisor, Slinger Signallers, and Operator) executes the lift with full insurance coverage.',
    },
    {
      number: '04',
      title: 'Digital Handover & LOLER Archive',
      description: 'Completion sign-off, photographic evidence, and plant commissioning records published directly to EntireCAFM.',
    },
  ];

  const faqs = content.faqs && content.faqs.length > 0 ? content.faqs : [
    {
      question: 'What is the difference between CPA Standard Crane Hire and a CPA Contract Lift?',
      answer: 'Under CPA Standard Hire, the customer must supply their own Appointed Person, formulate the lift plan, provide qualified slinger signallers, and hold full crane and load insurance. Under a CPA Contract Lift, EntireFM supplies everything (Appointed Person, lift plan, supervisor, slingers, crane, tackle, and comprehensive insurance), taking 100% legal responsibility for the entire lifting operation.',
    },
    {
      question: 'What standards govern crane lifting operations in the UK?',
      answer: 'All lifting operations are strictly executed in accordance with BS 7121 (Code of Practice for Safe Use of Cranes) and the Lifting Operations and Lifting Equipment Regulations 1998 (LOLER).',
    },
    {
      question: 'Can you handle council road closures and traffic management permits?',
      answer: 'Yes. As part of our turnkey CPA Contract Lift service, EntireFM prepares and submits all Section 50 highway licence applications, arranges bus route diversions, and deploys Chapter 8 compliant traffic management and pedestrian barriers.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-void text-brand-mist selection:bg-brand-pink/20 selection:text-brand-pink">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO SECTION */}
        <ServiceHero
          eyebrow="CONTRACT LIFTING & HEAVY PLANT RIGGING"
          title="Mobile Crane Hire & CPA Contract"
          highlightedTitle="Lifting Services"
          intro="Turnkey CPA Contract Lifting, CPCS Appointed Person lift planning, Böcker aluminium compact cranes, and rooftop mechanical plant replacement across the UK."
          imageSrc={serviceMedia.hero}
          imageAlt={serviceMedia.heroAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Request Lift Consultation', href: '#enquiry' }}
          secondaryCta={{ label: 'Speak with Appointed Person', href: '#contact-routes' }}
          serviceFacts={[
            { label: 'Lifting Standard', value: 'BS 7121 & LOLER Aligned' },
            { label: 'Contract Option', value: 'Full Turnkey CPA Lift' },
            { label: 'Insurance', value: 'Comprehensive Goods Lifted' },
          ]}
        />

        {/* 2. TRUST ACCREDITATIONS BAR */}
        <TrustBar />

        {/* 3. FOUR-PILLAR SCOPE STRIP */}
        <ServiceScopeStrip pillars={scopePillars} />

        {/* 4. EDITORIAL INTRO */}
        <ServiceEditorialIntro
          eyebrow="SAFETY-CRITICAL LIFTING OPERATIONS"
          heading="Flawless Engineering Precision, Complete Legal Compliance & Zero-Risk Execution"
          subheading="Replacing rooftop chillers, air handling units, or installing structural steelwork over active commercial properties carries immense operational and legal risk. EntireFM eliminates this burden through full-service CPA Contract Lifting."
          paragraphs={[
            'Under our contract lift model, our CPCS-certified Appointed Person takes total legal responsibility for the lifting operation—calculating crane outrigger ground loadings, producing 3D CAD lift plans, managing council road closures, and supplying certified rigging personnel.',
            'Every lift is executed under comprehensive insurance cover, ensuring your estate and stakeholders are completely protected.',
          ]}
          bullets={[
            '100% turnkey CPA Contract Lift liability assumed by EntireFM',
            'CPCS-certified Appointed Person 3D CAD lift plans and method statements (RAMS)',
            'Section 50 local authority road closures and traffic management managed in-house',
            'Full LOLER 1998 thorough examination certificates archived in EntireCAFM',
          ]}
          imageSrc="/images/editorial/entirefm-hvac-plant-deck-2000w.webp"
          imageAlt="EntireFM rooftop HVAC plant deck crane lift and rigging"
          imageCaption="CPA Contract Lift Rigging & Rooftop Plant Replacement"
          sideBadge={{ figure: 'BS 7121 & LOLER', label: 'Lifting Standards' }}
        />

        {/* 5. VISUAL CAPABILITY EXPERIENCE */}
        <VisualCapabilityExperience
          eyebrow="CRANE HIRE & CONTRACT LIFT DISCIPLINES"
          title="Comprehensive Lifting & Rigging Services"
          subtitle="From lightweight Böcker aluminium cranes for city centres to 100t all-terrain cranes and rooftop HVAC plant replacements."
          capabilities={capabilities}
        />

        {/* 6. SUPPORTED ASSETS TAXONOMY */}
        <SupportedAssetsGrid
          eyebrow="FLEET & RIGGING TAXONOMY"
          title="Specialist Crane Fleet & Rigging Equipment"
          subtitle="Our fleet of compact aluminium and all-terrain mobile cranes is equipped with certified rigging gear for complex architectural and mechanical lifts."
          categories={assetCategories}
        />

        {/* 7. DELIVERY PROCESS */}
        <ServiceDeliveryProcess
          eyebrow="LIFT PLANNING METHODOLOGY"
          title="Our 4-Stage Safe Lifting Process"
          subtitle="From physical site and ground pressure surveys to engineered 3D CAD lift plans and turnkey on-site execution."
        />

        {/* 8. PLANNED VS REACTIVE MAINTENANCE SPLIT */}
        <PlannedVsReactiveSplit
          eyebrow="LIFTING SOLUTIONS"
          title="CPA Contract Lift vs Standard Crane Hire"
          subtitle="Understand why 92% of facilities managers choose our turnkey CPA Contract Lift service for complete peace of mind."
          plannedItems={[
            'Turnkey CPA Contract Lift: EntireFM provides AP, lift plan, supervisor & slingers',
            'Full legal liability and comprehensive insurance cover for goods lifted',
            'Council road closure permits, traffic management & pedestrian diversions handled',
            'All certified rigging tackle, modular spreader beams & outrigger mats supplied',
            '3D CAD engineered drawing calculating exact radii, boom angles & wind limits',
          ]}
          reactiveItems={[
            'Emergency 24/7 crane deployment for dangerous building fabric or plant failure',
            'Urgent weekend replacement of critical data centre or hospital cooling chillers',
            'Storm damage structural lifting and high-level debris extraction',
            'Rapid plant decommissioning following catastrophic mechanical burnout',
          ]}
        />

        {/* 9. RELEVANT SECTORS GRID */}
        <ServiceSectorsGrid
          eyebrow="SECTORS SUPPORTED"
          title="Commercial Sectors We Support"
          subtitle="Delivering precision contract lifting for commercial office developments, hospital plant rooms, industrial manufacturing sites, and shopping centres."
        />

        {/* 10. ENTIRECAFM DIGITAL PORTAL SHOWCASE */}
        <TechnologyCafmSection
          eyebrow="DIGITAL LIFTING GOVERNANCE"
          title="Real-Time Lift Documentation in EntireCAFM"
          subtitle="Access all RAMS, CPCS certifications, LOLER inspection certificates, and road closure permits directly from your client dashboard."
        />

        {/* 11. FAQ ACCORDION */}
        <section className="py-16 sm:py-24 bg-brand-graphite border-t border-brand-edge-dark">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="mb-10 text-center">
                <span className="text-[10.5px] font-medium uppercase tracking-widest text-brand-electric-bright block mb-2">
                  LIFTING GUIDANCE
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-white">
                  Crane Hire & Contract Lifting Guidance
                </h2>
              </div>
              <FAQAccordion faqs={faqs} />
            </div>
          </div>
        </section>

        {/* 12. RELATED INTERNAL LINKS */}
        <RelatedLinks
          title="Related Building Engineering & Specialist Services"
          links={[
            { title: 'Commercial HVAC & Air Conditioning', path: '/hvac-contractor', description: 'Chillers, AHUs, and rooftop plant maintenance' },
            { title: 'Working at Height & BMU', path: '/working-at-height-rope-access-bmu', description: 'Rope access and high-level façade engineering' },
            { title: 'Mechanical & Electrical (M&E)', path: '/mechanical-electrical', description: 'Hard FM engineering and plant room care' },
            { title: 'Drone Building Inspections', path: '/aerial-drone-building-inspection', description: 'Aerial drone surveying and high-level inspection' },
          ]}
        />

        {/* 13. COMMERCIAL PROPOSAL & SURVEY CTA */}
        <ServiceConversionSection
          serviceName="Mobile Crane Hire & CPA Contract Lifting"
          headline="Discuss Your Lift Planning & Heavy Rigging Project"
          subheadline="Consult directly with our CPCS-certified Appointed Persons. We provide free site surveys, ground loading calculations, 3D CAD lift plans, and turnkey CPA contract lift pricing."
          ctaButtonText="Submit Crane Enquiry"
          directDeskNote="Direct line to Appointed Persons and lifting project directors."
        />

      </main>

      <Footer />
    </div>
  );
}
