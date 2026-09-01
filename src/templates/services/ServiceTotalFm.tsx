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

export function ServiceTotalFm({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: content.h1, url: route.path },
  ];

  const serviceMedia = getServiceMedia(route.path);

  const scopePillars = [
    {
      label: 'TOTAL HARD FM',
      sublabel: 'M&E, HVAC & Fabric Care',
      iconName: 'powerElectrical' as const,
    },
    {
      label: 'INTEGRATED SOFT FM',
      sublabel: 'Cleaning, Security & Grounds',
      iconName: 'commercialCleaning' as const,
    },
    {
      label: '24/7 HELPDESK',
      sublabel: 'National Operations Center',
      iconName: 'twentyFourSevenOps' as const,
    },
    {
      label: 'ENTIRECAFM',
      sublabel: 'Consolidated SLA Governance',
      iconName: 'dataInsights' as const,
    },
  ];

  const capabilities = [
    {
      name: 'Single-Source Integrated Facilities Management (Total FM)',
      description: 'Consolidating disparate vendor contracts into one unified, self-delivered facilities management partnership. Seamlessly blending Hard FM engineering with Soft FM service delivery under one accountable SLA.',
      tag: 'Total FM Delivery',
      imageSrc: '/images/editorial/entirefm-hero-headquarters-2560w.webp',
      imageAlt: 'EntireFM national facilities management headquarters and operations coordination center',
      keyPoints: [
        'Consolidated single-source SLA reducing contract administration overhead by 35%',
        'Dedicated Key Account Manager and regional engineering supervisors',
        'Transparent unified monthly billing and digital service charge breakdowns',
        'Direct self-delivery model eliminating sub-contractor margin stacking',
      ],
      isFeatured: true,
      href: '/facilities-management-services',
    },
    {
      name: '24/7 National Operations Helpdesk & Rapid Mobile Triage',
      description: 'Round-the-clock facilities support desk staffed by experienced technical coordinators, orchestrating directly employed mobile engineering and trade teams across the UK.',
      tag: '24/7 Operations Desk',
      imageSrc: '/images/editorial/entirefm-entirefm-premises-vans-2000w.webp',
      imageAlt: 'EntireFM mobile engineering fleet stationed 24/7 for nationwide response',
      keyPoints: [
        '24/7/365 single telephone and digital helpdesk dispatch channel',
        'Contracted emergency attendance SLAs (2hr / 4hr priority response)',
        'GPS mobile engineer tracking and live automated customer ETA notifications',
        'Digital job sheet completion with photographic proof and client sign-off',
      ],
      href: '/24-7-fm-support',
    },
    {
      name: 'Technical Hard Facilities Management & Building Engineering',
      description: 'Comprehensive engineering stewardship: statutory electrical testing (EICR), HVAC chillers, commercial boilers, fire life-safety systems, and SFG20 planned preventative regimes.',
      tag: 'Hard FM Engineering',
      imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
      imageAlt: 'EntireFM engineer testing commercial electrical switchgear and building infrastructure',
      keyPoints: [
        'SFG20-aligned maintenance schedules configured for all maintainable plant items',
        'Statutory Gas Safe CP12, F-Gas, L8, and BS 7671 certification',
        'Predictive thermographic surveys and plant vibration diagnostic testing',
        'Forward 10-year capital lifecycle asset replacement planning',
      ],
      href: '/hard-services',
    },
    {
      name: 'Integrated Soft Facilities Management & Workplace Hospitality',
      description: 'High-specification contract cleaning, washroom hygiene, front-of-house concierge reception, automated security gates, and four-season grounds maintenance.',
      tag: 'Soft FM Services',
      imageSrc: '/images/locations/birmingham/facilities-management-birmingham-city-centre-offices-1600w.webp',
      imageAlt: 'EntireFM soft services and corporate contract cleaning in modern commercial building',
      keyPoints: [
        'BICSc colour-coded commercial office and industrial cleaning programmes',
        'SIA-licensed corporate security concierge and automated barrier maintenance',
        'Proactive automated winter gritting and grounds landscaping management',
        'Washroom consumable inventory management and sanitary services',
      ],
      href: '/soft-services',
    },
  ];

  const assetCategories = [
    {
      title: 'Hard FM Engineering Systems',
      subtitle: 'Mechanical, Electrical & Fabric',
      iconName: 'powerElectrical' as const,
      assets: [
        'Main Switchboards & Sub-Distribution Panels',
        'Commercial Boilers, Chillers & AHU Systems',
        'Addressable Fire Alarms & Emergency Lighting',
        'Building Management System (BMS) Controls',
        'Roofing, Cladding & Fire Door Assemblies',
      ],
    },
    {
      title: 'Soft FM & Workplace Services',
      subtitle: 'Hygiene, Security & Grounds',
      iconName: 'commercialCleaning' as const,
      assets: [
        'Contract Office & Industrial Cleaning',
        'Reception Concierge & SIA Security Patrols',
        'Automated Perimeter Gates & ANPR Barriers',
        'Four-Season Landscaping & Tree Care',
        'Automated Winter Gritting & Snow Removal',
      ],
    },
    {
      title: 'Governance & CAFM Technology',
      subtitle: 'Compliance & SLA Tracking',
      iconName: 'dataInsights' as const,
      assets: [
        'EntireCAFM Client Portal Dashboard',
        'Digital Statutory Compliance Certificate Vault',
        'Real-Time 24/7 Reactive Ticket Tracking',
        '10-Year Forward CapEx Financial Models',
        'Consolidated Monthly SLA Performance Scoring',
      ],
    },
  ];

  const deliverySteps = [
    {
      number: '01',
      title: 'Estate Asset & Vendor Consolidation Audit',
      description: 'We survey all building plant, review existing vendor agreements, and formulate a single unified asset register in EntireCAFM.',
    },
    {
      number: '02',
      title: 'Tailored SLA & SFG20 Regime Build',
      description: 'Customising statutory maintenance frequencies, access windows, KPI scorecards, and emergency response escalation matrices.',
    },
    {
      number: '03',
      title: 'Direct Engineering Mobilisation',
      description: 'Directly employed mobile engineers and dedicated soft FM teams mobilise under the leadership of your Key Account Manager.',
    },
    {
      number: '04',
      title: 'Continuous Governance & CAFM Transparency',
      description: 'Real-time digital ticket tracking, monthly executive reviews, and instant statutory compliance certificate availability.',
    },
  ];

  const faqs = content.faqs && content.faqs.length > 0 ? content.faqs : [
    {
      question: 'What is the commercial benefit of consolidating Hard and Soft FM under EntireFM?',
      answer: 'Consolidating with EntireFM provides single-source accountability, eliminates multi-contractor margin stacking, simplifies invoice processing to a single monthly schedule, and gives property managers total visibility through one digital CAFM portal.',
    },
    {
      question: 'Does EntireFM directly employ engineers or subcontract service delivery?',
      answer: 'EntireFM operates a direct self-delivery model. Our M&E engineers, gas technicians, cleaning operatives, and grounds teams are directly employed, uniformed, and background vetted, ensuring strict quality control and consistent service standards.',
    },
    {
      question: 'How does your 24/7 helpdesk handle out-of-hours emergencies?',
      answer: 'Our central operations desk operates 24/7/365. Emergency calls are answered immediately by technical coordinators who dispatch directly employed mobile engineers under contracted response SLAs (typically 2–4 hours) with real-time GPS tracking.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-void text-brand-mist selection:bg-brand-pink/20 selection:text-brand-pink">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO SECTION */}
        <ServiceHero
          eyebrow="INTEGRATED FACILITIES MANAGEMENT"
          title="Total Facilities Management Services &"
          highlightedTitle="24/7 Operations"
          intro="Single-source national facilities management delivering hard building engineering, soft facilities services, and round-the-clock emergency helpdesk triage under one transparent, accountable partnership."
          imageSrc={serviceMedia.hero}
          imageAlt={serviceMedia.heroAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Discuss Your Estate', href: '#enquiry' }}
          secondaryCta={{ label: 'Request FM Proposal', href: '#contact-routes' }}
          serviceFacts={[
            { label: 'Delivery Model', value: 'Direct Self-Delivery' },
            { label: 'Operations Desk', value: '24/7/365 Nationwide' },
            { label: 'Management Portal', value: 'EntireCAFM Certified' },
          ]}
        />

        {/* 2. TRUST ACCREDITATIONS BAR */}
        <TrustBar />

        {/* 3. FOUR-PILLAR SCOPE STRIP */}
        <ServiceScopeStrip pillars={scopePillars} />

        {/* 4. EDITORIAL INTRO */}
        <ServiceEditorialIntro
          eyebrow="SINGLE-SOURCE ACCOUNTABILITY"
          heading="Transforming Facilities Management from Fragmented Contractors to Strategic Partnership"
          subheading="Managing separate contractors for M&E, HVAC, cleaning, fire safety, security, and grounds creates administrative friction, finger-pointing during failures, and hidden margin stacking. EntireFM replaces fragmented supply chains with one unified, self-delivered Total FM partnership."
          paragraphs={[
            'Under our integrated model, your estate benefits from a dedicated Key Account Manager, directly employed technical engineers, and 24/7 helpdesk dispatch.',
            'Every maintenance task, statutory certificate, and reactive callout is tracked in real time through EntireCAFM, providing managing agents and corporate property directors with absolute audit certainty and operational peace of mind.',
          ]}
          bullets={[
            'Consolidated single-source SLA reducing contract administration overhead by 35%',
            'Dedicated Key Account Manager and regional engineering supervisors',
            'Transparent unified monthly billing and digital service charge breakdowns',
            'Direct self-delivery model eliminating sub-contractor margin stacking',
          ]}
          imageSrc="/images/editorial/entirefm-hero-headquarters-2560w.webp"
          imageAlt="EntireFM national facilities management headquarters and operations coordination center"
          imageCaption="Single-Source Total Facilities Management Delivery"
          sideBadge={{ figure: 'Total FM & CAFM', label: 'Service Model' }}
        />

        {/* 5. VISUAL CAPABILITY EXPERIENCE */}
        <VisualCapabilityExperience
          eyebrow="INTEGRATED FM CAPABILITIES"
          title="Comprehensive Total Facilities Management Services"
          subtitle="From statutory hard engineering and compliance audits to daily contract cleaning, security concierge, and 24/7 helpdesk support."
          capabilities={capabilities}
        />

        {/* 6. SUPPORTED ASSETS TAXONOMY */}
        <SupportedAssetsGrid
          eyebrow="ESTATE ASSET TAXONOMY"
          title="Complete Hard & Soft Facilities Scope"
          subtitle="Our integrated teams maintain the entire physical, mechanical, electrical, and operational infrastructure of your commercial property portfolio."
          categories={assetCategories}
        />

        {/* 7. DELIVERY PROCESS */}
        <ServiceDeliveryProcess
          eyebrow="INTEGRATION METHODOLOGY"
          title="How We Mobilise Total FM Contracts"
          subtitle="A proven four-stage transition process ensuring seamless contract handover, zero day-one disruption, and instant CAFM compliance visibility."
        />

        {/* 8. PLANNED VS REACTIVE MAINTENANCE SPLIT */}
        <PlannedVsReactiveSplit
          eyebrow="TOTAL FM GOVERNANCE"
          title="Proactive Stewardship Balanced with Rapid 24/7 Reactive Power"
          subtitle="SFG20 planned maintenance eliminates preventable plant breakdowns while our national operations desk guarantees emergency attendance."
          plannedItems={[
            'Consolidated SFG20 annual preventative maintenance schedule',
            'Statutory compliance inspections (Gas CP12, EICR, F-Gas, L8, Fire)',
            'Daily scheduled contract cleaning and washroom replenishment rotas',
            'Bi-annual automated gate safety and access control maintenance',
            'Seasonal grounds care, tree risk audits, and proactive winter gritting',
          ]}
          reactiveItems={[
            '24/7/365 emergency technical helpdesk with priority SLA dispatch',
            'Urgent repair of critical HVAC, boiler, plumbing, or power outages',
            'Same-day biohazard sanitisation and accidental spill clearance',
            'Emergency security barrier, gate, and access control repair',
          ]}
        />

        {/* 9. RELEVANT SECTORS GRID */}
        <ServiceSectorsGrid
          eyebrow="SECTORS SUPPORTED"
          title="Commercial Sectors We Manage"
          subtitle="Delivering Total FM partnerships across multi-tenant corporate offices, retail portfolios, logistics hubs, healthcare facilities, and industrial estates."
        />

        {/* 10. ENTIRECAFM DIGITAL PORTAL SHOWCASE */}
        <TechnologyCafmSection
          eyebrow="CONSOLIDATED DIGITAL GOVERNANCE"
          title="Complete Estate Visibility in EntireCAFM"
          subtitle="Control your entire facilities management contract through one intuitive dashboard—from live work orders to statutory compliance scores."
        />

        {/* 11. FAQ ACCORDION */}
        <section className="py-16 sm:py-24 bg-brand-graphite border-t border-brand-edge-dark">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="mb-10 text-center">
                <span className="text-[10.5px] font-medium uppercase tracking-widest text-brand-electric-bright block mb-2">
                  FREQUENTLY ASKED QUESTIONS
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-white">
                  Total Facilities Management Guidance
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
            { title: 'Mechanical & Electrical (M&E)', path: '/mechanical-electrical', description: 'Hard FM engineering and building maintenance' },
            { title: 'Commercial HVAC & Air Conditioning', path: '/hvac-contractor', description: 'Chillers, AHUs, VRV/VRF cooling and ventilation' },
            { title: 'Commercial Cleaning Services', path: '/commercial-cleaning', description: 'Daily contract office and industrial cleaning' },
            { title: 'Statutory Compliance Centre', path: '/compliance', description: 'Complete UK building compliance guidance' },
          ]}
        />

        {/* 13. COMMERCIAL PROPOSAL & SURVEY CTA */}
        <ServiceConversionSection
          serviceName="Total Facilities Management Services"
          headline="Discuss a Total FM Partnership for Your Estate"
          subheadline="Consult directly with our executive facilities directors. We provide comprehensive portfolio asset surveys, consolidated SLA design, and transparent monthly pricing."
          ctaButtonText="Submit Total FM Enquiry"
          directDeskNote="Direct line to Key Account Directors and 24/7 central helpdesk."
        />

      </main>

      <Footer />
    </div>
  );
}
