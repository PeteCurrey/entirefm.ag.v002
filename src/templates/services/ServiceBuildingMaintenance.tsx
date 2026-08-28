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

export function ServiceBuildingMaintenance({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: content.h1, url: route.path },
  ];

  const serviceMedia = getServiceMedia(route.path);

  const scopePillars = [
    {
      label: 'BUILDING FABRIC',
      sublabel: 'Roofs, Cladding & Glazing',
      iconName: 'commercialBuildings' as const,
    },
    {
      label: 'STRUCTURAL CARE',
      sublabel: 'Condition & Dilapidations',
      iconName: 'maintenanceTools' as const,
    },
    {
      label: 'PLANNED PPM',
      sublabel: 'SFG20 Fabric Standards',
      iconName: 'complianceAudit' as const,
    },
    {
      label: 'REACTIVE FABRIC',
      sublabel: '24/7 Multi-Trade Response',
      iconName: 'twentyFourSevenOps' as const,
    },
  ];

  const capabilities = [
    {
      name: 'Commercial Building Envelope & Roof Maintenance',
      description: 'Systematic maintenance of flat roofs, standing seam cladding, gutters, rainwater downpipes, flashings, and structural expansion joints across commercial properties.',
      tag: 'Envelope & Roofing',
      imageSrc: '/images/editorial/entirefm-headquarters-exterior-2000w.webp',
      imageAlt: 'EntireFM commercial building maintenance team inspecting headquarters exterior envelope',
      keyPoints: [
        'Quarterly gutter clearance, hopper vacuuming, and downpipe unblocking',
        'Single-ply membrane, felt, and liquid roof coating leak investigations',
        'Composite cladding panel repairs, resealing, and powder-coat restoration',
        'Structural glazing seal renewal and curtain wall thermal barrier checks',
      ],
      isFeatured: true,
      href: '/building-maintenance',
    },
    {
      name: 'Internal Building Fabric & Multi-Trade PPM',
      description: 'Carpentry, fire door maintenance, suspended ceiling repairs, raised access flooring adjustments, plastering, and commercial redecoration programmes.',
      tag: 'Internal Fabric PPM',
      imageSrc: '/images/editorial/entirefm-corporate-corridor-2000w.webp',
      imageAlt: 'EntireFM building maintenance multi-trade technicians in commercial corporate facility',
      keyPoints: [
        'Certified fire door inspections (gap tolerances, drop seals, intumescent strips)',
        'Raised access floor void maintenance and floor tile realignment',
        'Suspended acoustic ceiling tile replacement and grid leveling',
        'High-specification corporate painting, decorating, and wall protection',
      ],
      href: '/building-maintenance',
    },
    {
      name: 'Building Condition Surveys & Forward Capital Planning',
      description: 'Chartered building surveyors conducting detailed condition assessments, lifecycle dilapidation forecasts, and forward planned maintenance (PPM) schedules.',
      tag: 'Condition Surveys',
      imageSrc: '/images/locations/derby/facilities-management-derby-rooftop-survey-1600w.webp',
      imageAlt: 'EntireFM senior technical surveyor evaluating building fabric and plant condition',
      keyPoints: [
        'Detailed RICS-aligned building fabric condition surveys and defect logs',
        'Forward 5-to-10-year capital expenditure (CapEx) replacement forecasting',
        'Thermal imaging drone building envelope heat loss and moisture surveys',
        'Schedule of Condition documentation for landlord and tenant leasing',
      ],
      href: '/building-inspecting-testing',
    },
    {
      name: '24/7 Multi-Trade Reactive Fabric Triage',
      description: 'Emergency multi-trade response resolving water ingress, structural snags, damaged security glazing, broken doors, and ceiling collapse hazards.',
      tag: '24/7 Reactive Desk',
      imageSrc: '/images/editorial/entirefm-entirefm-premises-vans-2000w.webp',
      imageAlt: 'EntireFM rapid response multi-trade mobile fleet stationed for emergency callouts',
      keyPoints: [
        '24/7 national helpdesk coordinating directly employed multi-trade mobile vans',
        'Emergency boarding up, temporary weatherproofing, and glass securing',
        'Rapid water ingress containment and dehumidification deployment',
        'Digital timestamped photographic job sign-off in EntireCAFM',
      ],
      href: '/24-7-fm-support',
    },
  ];

  const assetCategories = [
    {
      title: 'External Building Envelope',
      subtitle: 'Roofs, Walls & Glazing',
      iconName: 'commercialBuildings' as const,
      assets: [
        'Single-Ply & Felt Flat Roofing Systems',
        'Architectural Composite Cladding Panels',
        'Curtain Wall Glazing & Structural Atriums',
        'Rainwater Gutters, Hoppers & Downpipes',
        'Structural Expansion Joints & Sealants',
      ],
    },
    {
      title: 'Internal Fabric & Finishes',
      subtitle: 'Doors, Floors & Walls',
      iconName: 'maintenanceTools' as const,
      assets: [
        'FD30 & FD60 Certified Fire Door Assemblies',
        'Raised Access Flooring (RAF) Void Networks',
        'Suspended Acoustic Ceiling Grids & Tiles',
        'Commercial Ironmongery & Panic Hardware',
        'Drylining & Partition Wall Systems',
      ],
    },
    {
      title: 'Inspection & Survey Technology',
      subtitle: 'Condition & Compliance Tools',
      iconName: 'complianceAudit' as const,
      assets: [
        'High-Resolution Thermal Imaging Cameras',
        'Electronic Moisture & Damp Probes',
        'Digital Asset Condition Barcoding',
        '3D Laser Scanning & Drone Photogrammetry',
        'EntireCAFM 10-Year Forward CapEx Models',
      ],
    },
  ];

  const deliverySteps = [
    {
      number: '01',
      title: 'Baseline Fabric Condition Survey',
      description: 'Comprehensive physical and drone survey cataloguing roof condition, fire door compliance, cladding integrity, and internal finishes.',
    },
    {
      number: '02',
      title: 'SFG20 Fabric Maintenance Schedule',
      description: 'Configuring periodic gutter clearing, fire door gap checks, roof inspections, and scheduled redecoration windows in EntireCAFM.',
    },
    {
      number: '03',
      title: 'Direct Multi-Trade Engineering',
      description: 'Directly employed carpenters, roofers, decorators, and building fabric technicians deliver scheduled works with minimal disruption.',
    },
    {
      number: '04',
      title: 'Digital Lifecycle Tracking in CAFM',
      description: 'Every inspection report, condition photograph, and CapEx forecast is archived digitally in your client portal.',
    },
  ];

  const faqs = content.faqs && content.faqs.length > 0 ? content.faqs : [
    {
      question: 'How frequently should commercial building roofs and rainwater goods be inspected?',
      answer: 'Commercial roofs and rainwater goods should be inspected and cleared at least twice annually (typically in late spring and late autumn after leaf fall), with additional inspections following severe weather events to prevent water ingress.',
    },
    {
      question: 'What standards do you apply to commercial fire door maintenance?',
      answer: 'Our certified technicians inspect fire doors against BS 8214 and the Fire Safety (England) Regulations 2022, measuring perimeter gap tolerances (2–4mm), intumescent and cold-smoke seals, latch operation, and door closer closing forces.',
    },
    {
      question: 'Can you provide forward 5-year and 10-year capital expenditure (CapEx) forecasts for our building?',
      answer: 'Yes. Our building condition surveys generate detailed 5-to-10-year forward CapEx forecasts in EntireCAFM, itemising upcoming roof renewals, cladding repairs, and internal refurbishment budgets.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-void text-brand-mist selection:bg-brand-pink/20 selection:text-brand-pink">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO SECTION */}
        <ServiceHero
          eyebrow="COMMERCIAL BUILDING FABRIC & SURVEYING"
          title="Commercial Building Maintenance &"
          highlightedTitle="Fabric Engineering"
          intro="Proactive building envelope care, structural condition surveys, roof maintenance, fire door certification, and 24/7 multi-trade reactive repairs protecting commercial estates nationwide."
          imageSrc={serviceMedia.hero}
          imageAlt={serviceMedia.heroAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Request Fabric Survey', href: '#enquiry' }}
          secondaryCta={{ label: 'Speak with Building Surveyor', href: '#contact-routes' }}
          serviceFacts={[
            { label: 'Maintenance Standard', value: 'SFG20 Fabric Aligned' },
            { label: 'Fire Door Safety', value: 'BS 8214 Certified' },
            { label: 'Survey Standard', value: 'RICS Aligned Reports' },
          ]}
        />

        {/* 2. TRUST ACCREDITATIONS BAR */}
        <TrustBar />

        {/* 3. FOUR-PILLAR SCOPE STRIP */}
        <ServiceScopeStrip pillars={scopePillars} />

        {/* 4. EDITORIAL INTRO */}
        <ServiceEditorialIntro
          eyebrow="COMPREHENSIVE BUILDING FABRIC LIFECYCLE"
          heading="Preserving Structural Integrity, Preventing Water Ingress & Enhancing Asset Value"
          subheading="Building fabric represents the physical envelope and internal infrastructure of your property asset. Neglected fabric maintenance leads to catastrophic water ingress, tenant disputes, and premature capital depreciation."
          paragraphs={[
            'From bi-annual flat roof maintenance and drone thermal envelope surveys to certified fire door inspections and multi-trade reactive triage, our teams protect every square metre of your property.',
            'All condition reports and defect records are digitized in EntireCAFM, providing managing agents with clear data for service charge reconciliation and forward CapEx planning.',
          ]}
          bullets={[
            '100% directly employed multi-trade workforce (carpenters, roofers, decorators)',
            'SFG20-aligned planned preventative fabric and building envelope regimes',
            'BS 8214 certified fire door inspections and gap tolerance audits',
            '24/7 rapid emergency boarding, glazing, and water ingress containment',
          ]}
          imageSrc="/images/editorial/entirefm-headquarters-exterior-2000w.webp"
          imageAlt="EntireFM building maintenance team inspecting commercial headquarters"
          imageCaption="Commercial Building Fabric & Envelope Maintenance"
          sideBadge={{ figure: 'SFG20 & RICS', label: 'Fabric Standards' }}
        />

        {/* 5. VISUAL CAPABILITY EXPERIENCE */}
        <VisualCapabilityExperience
          eyebrow="CORE BUILDING FABRIC DISCIPLINES"
          title="Comprehensive Building Fabric & Structural Services"
          subtitle="From external roofing and cladding to internal acoustic ceilings, fire doors, and forward CapEx forecasting."
          capabilities={capabilities}
        />

        {/* 6. SUPPORTED ASSETS TAXONOMY */}
        <SupportedAssetsGrid
          eyebrow="MAINTAINED FABRIC TAXONOMY"
          title="Building Fabric Components & Envelope Assets"
          subtitle="Our specialist multi-trade technicians and surveyors inspect, repair, and maintain all internal and external fabric elements across commercial properties."
          categories={assetCategories}
        />

        {/* 7. DELIVERY PROCESS */}
        <ServiceDeliveryProcess
          eyebrow="OPERATIONAL LIFECYCLE"
          title="How We Mobilise & Maintain Building Fabric"
          subtitle="A structured four-step methodology ensuring complete fabric visibility, scheduled maintenance accuracy, and immediate emergency triage."
        />

        {/* 8. PLANNED VS REACTIVE MAINTENANCE SPLIT */}
        <PlannedVsReactiveSplit
          eyebrow="FABRIC PPM STRATEGY"
          title="Proactive Envelope Care Prevents Catastrophic Water Damage"
          subtitle="Regular bi-annual roof clearance and seal inspections reduce emergency water leak callouts by up to 82%."
          plannedItems={[
            'Bi-annual flat roof membrane inspection, seam checks, and gutter clearance',
            '6-monthly certified fire door assembly gap and intumescent seal audits',
            'Annual building envelope cladding sealant and expansion joint surveys',
            'Scheduled cyclical commercial internal redecoration and painting',
            'Periodic raised access floor leveling and acoustic ceiling tile maintenance',
          ]}
          reactiveItems={[
            '24/7 emergency response for roof water ingress and ceiling leaks',
            'Urgent boarding up and securing of shattered architectural glazing',
            'Emergency temporary structural shoring and safety barrier erection',
            'Rapid lock, closer, and panic hardware repair for failed fire egress doors',
          ]}
        />

        {/* 9. RELEVANT SECTORS GRID */}
        <ServiceSectorsGrid
          eyebrow="SECTOR EXPERTISE"
          title="Commercial Sectors We Protect"
          subtitle="Delivering tailored building fabric care for Grade-A corporate offices, retail parks, industrial warehouses, and residential high-rises."
        />

        {/* 10. ENTIRECAFM DIGITAL PORTAL SHOWCASE */}
        <TechnologyCafmSection
          eyebrow="DIGITAL FABRIC GOVERNANCE"
          title="Real-Time Building Condition & CapEx in EntireCAFM"
          subtitle="Eliminate disparate paper reports. Track roof surveys, fire door compliance logs, and forward 10-year capital budgets directly from your portal."
        />

        {/* 11. FAQ ACCORDION */}
        <section className="py-16 sm:py-24 bg-brand-graphite border-t border-brand-edge-dark">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="mb-10 text-center">
                <span className="text-[10.5px] font-mono uppercase tracking-widest text-brand-electric-bright block mb-2">
                  FREQUENTLY ASKED QUESTIONS
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-white">
                  Building Maintenance & Fabric Guidance
                </h2>
              </div>
              <FAQAccordion faqs={faqs} />
            </div>
          </div>
        </section>

        {/* 12. RELATED INTERNAL LINKS */}
        <RelatedLinks
          title="Related Building Engineering & FM Services"
          links={[
            { title: 'Working at Height & BMU', path: '/working-at-height-rope-access-bmu', description: 'Rope access, BMU cradles, and high-rise envelope care' },
            { title: 'Drone Building Inspections', path: '/aerial-drone-building-inspection', description: 'Thermal drone roof surveys and 3D digital twins' },
            { title: 'Mechanical & Electrical (M&E)', path: '/mechanical-electrical', description: 'Hard FM engineering and plant room maintenance' },
            { title: 'Statutory Compliance Centre', path: '/compliance', description: 'Complete UK building compliance guidance' },
          ]}
        />

        {/* 13. COMMERCIAL PROPOSAL & SURVEY CTA */}
        <ServiceConversionSection
          serviceName="Commercial Building Maintenance & Fabric Services"
          headline="Discuss Your Building Fabric & Surveying Requirements"
          subheadline="Consult directly with our building surveyors and fabric maintenance directors. We provide comprehensive condition surveys, SFG20 PPM schedules, and transparent CapEx forecasting."
          ctaButtonText="Submit Fabric Enquiry"
          directDeskNote="Direct line to building surveyors and 24/7 reactive fabric triage."
        />

      </main>

      <Footer />
    </div>
  );
}
