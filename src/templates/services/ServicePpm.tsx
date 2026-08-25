'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceScopeStrip } from '@/components/services/ServiceScopeStrip';
import { ServiceEditorialIntro } from '@/components/services/ServiceEditorialIntro';
import { VisualCapabilityExperience } from '@/components/services/VisualCapabilityExperience';
import { MaintenanceCycleTimeline } from '@/components/services/MaintenanceCycleTimeline';
import { SupportedAssetsGrid } from '@/components/services/SupportedAssetsGrid';
import { ServiceDeliveryProcess } from '@/components/services/ServiceDeliveryProcess';
import { PlannedVsReactiveSplit } from '@/components/services/PlannedVsReactiveSplit';
import { ServiceSectorsGrid } from '@/components/services/ServiceSectorsGrid';
import { TechnologyCafmSection } from '@/components/services/TechnologyCafmSection';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import type { TemplateProps } from '../types';

export function ServicePpm({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Planned Preventative Maintenance', url: '/ppm' },
  ];

  const scopePillars = [
    {
      label: 'ASSET AUDITING',
      sublabel: 'QR Tagging & Registers',
      iconName: 'dataInsights' as const,
    },
    {
      label: 'SFG20 REGIMES',
      sublabel: 'Standardised Task Lists',
      iconName: 'maintenanceTools' as const,
    },
    {
      label: 'STATUTORY CARE',
      sublabel: 'Audit-Ready Certificates',
      iconName: 'complianceAudit' as const,
    },
    {
      label: 'CAPEX FORECASTS',
      sublabel: 'Lifecycle Replacement',
      iconName: 'proposalReporting' as const,
    },
  ];

  const capabilities = [
    {
      name: 'SFG20-Aligned Maintenance Schedules',
      description: 'Task schedules based strictly on industry-recognised engineering standards for mechanical, electrical, and fabric assets, tailored to building operating hours.',
      tag: 'SFG20 Regimes',
      imageSrc: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
      imageAlt: 'EntireFM engineer conducting scheduled PPM testing',
      keyPoints: [
        'Over 1,200 standard maintenance task specifications',
        'Balanced 52-week preventative engineering calendar',
        'Manufacturer-specified warranty preservation tasks',
        'Seasonal operational adjustments for HVAC and heating plant',
      ],
      isFeatured: true,
      href: '/ppm',
    },
    {
      name: 'Digital Asset Tagging & CAFM Tracking',
      description: 'Every equipment asset is physically barcode/QR tagged and tracked in EntireCAFM with full service history, technician notes, and serial numbers.',
      tag: 'Asset Register',
      imageSrc: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
      imageAlt: 'EntireFM engineer recording digital asset tags',
      keyPoints: [
        'Complete asset condition and age register creation',
        'Physical on-site QR scanning to verify technician attendance',
        'Instant mobile access to historical maintenance records',
      ],
      href: '/hard-services',
    },
    {
      name: 'Statutory Health & Safety Certification',
      description: 'Mandatory periodic execution and cloud archival of electrical EICRs, gas safety certificates, fire alarm tests, and water hygiene records.',
      tag: 'Compliance',
      imageSrc: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
      imageAlt: 'EntireFM engineer issuing statutory electrical certification',
      keyPoints: [
        'Guaranteed adherence to UK statutory inspection intervals',
        'Immediate defect identification and remediation pathways',
        'Searchable digital certificate repository for HSE audits',
      ],
      href: '/compliance',
    },
    {
      name: 'Forward Lifecycle & Capital Planning',
      description: 'Forward-looking condition reports highlighting upcoming end-of-life plant replacement needs, preventing unbudgeted capital shocks for landlords.',
      tag: 'CapEx Planning',
      imageSrc: '/images/locations/manchester/facilities-management-manchester-rooftop-plant-engineers-1600w.webp',
      imageAlt: 'EntireFM technical engineers assessing asset condition for capital planning',
      keyPoints: [
        '3-to-5 year forward capital expenditure modeling',
        'Total cost of ownership (TCO) asset health analysis',
        'Energy efficiency plant upgrade recommendations',
      ],
    },
    {
      name: 'Commercial Building Fabric Care',
      description: 'Scheduled inspections of roof membranes, gutters, automated doors, external sealants, and fire doors to protect structural integrity.',
      tag: 'Fabric Care',
      imageSrc: '/images/locations/derby/facilities-management-derby-rooftop-survey-1600w.webp',
      imageAlt: 'EntireFM technicians surveying commercial building fabric and roof assets',
      keyPoints: [
        'Bi-annual gutter clearance and downpipe flushing',
        'Fire door gap, intumescent seal, and closer audits',
        'Window sealant and expansion joint inspections',
      ],
    },
    {
      name: 'Environmental & Energy Optimization',
      description: 'Quarterly sensor calibration, BMS setback profile audits, and combustion efficiency tuning to minimize tenant utility costs.',
      tag: 'Energy Tuning',
      imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
      imageAlt: 'EntireFM manager reviewing building energy metrics with client',
      keyPoints: [
        'BMS temperature sensor calibration & timeclock verification',
        'VFD and motor inverter efficiency profiling',
        'Energy dilapidation surveys and TM44 compliance',
      ],
    },
  ];

  const assetCategories = [
    {
      title: 'Electrical & Life Safety Assets',
      subtitle: 'Periodic Testing & Certification',
      iconName: 'powerElectrical' as const,
      assets: [
        'Main LV Switchgear & Sub-Boards (EICR)',
        '3-Hour Emergency Lighting Discharge Systems',
        'Fire Alarm Panels, Detectors & Call Points',
        'Automatic Opening Smoke Vents (AOV)',
        'Lightning Protection & Surge Arrestors',
      ],
    },
    {
      title: 'Mechanical & Climate Infrastructure',
      subtitle: 'Heating, Cooling & Water',
      iconName: 'maintenanceTools' as const,
      assets: [
        'Commercial Condensing Boilers & Gas Trains',
        'Chillers & VRV/VRF Multi-Split AC Systems',
        'Air Handling Units, Coils & Fan Belts',
        'Water Booster Pumps & Pressurisation Units',
        'Calorifiers, TMVs & Legionella Sentinel Points',
      ],
    },
    {
      title: 'Building Fabric & Security Assets',
      subtitle: 'Envelope & Perimeter Control',
      iconName: 'securityCctv' as const,
      assets: [
        'Automated Barriers, Gates & Turnstiles',
        'Access Control Readers & Electronic Maglocks',
        'Fire Doors, Closers & Emergency Exits',
        'Roof Membranes, Gutters & Drainage Pumps',
        'High-Bay Lighting & Exterior Floodlights',
      ],
    },
  ];

  const relatedLinks = (content.relatedRoutes || ['/mechanical-electrical', '/hvac-contractor', '/hard-services', '/compliance']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: 'Related Maintenance Scope',
    description: `Explore EntireFM capabilities for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
  }));

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: 'What assets should be included in a commercial PPM schedule?',
          answer: 'A comprehensive commercial PPM schedule covers HVAC, heating, electrical switchboards, emergency lighting, fire safety, water hygiene, automated doors, drainage pumps, and external roof/gutter fabric.',
        },
        {
          question: 'How do you determine the required maintenance frequency for each asset?',
          answer: 'We align task frequencies strictly to SFG20 industry engineering guidelines, manufacturer recommendations, statutory UK legislation, and site-specific equipment operational intensity.',
        },
        {
          question: 'How does EntireFM provide evidence that PPM visits were completed?',
          answer: 'Our mobile engineers scan digital QR barcodes placed physically on each plant item upon arrival, recording digital timestamps, check results, photographic evidence, and signed job sheets directly to your CAFM dashboard.',
        },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* 1. CINEMATIC HERO */}
        <ServiceHero
          eyebrow="STRATEGIC ASSET MANAGEMENT"
          title="Planned Preventative Maintenance"
          highlightedTitle="(PPM) Contracts"
          intro="Structured Planned Preventative Maintenance (PPM) engineered to preserve building fabric, extend mechanical plant lifespan, and guarantee statutory compliance across your commercial estate."
          imageSrc="/images/editorial/entirefm-client-review-2000w.webp"
          imageAlt="EntireFM contract manager reviewing planned preventative maintenance schedule"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Review Your PPM Programme', href: '#enquiry' }}
          serviceFacts={[
            { label: 'Industry standard maintenance task library', value: 'SFG20 Aligned' },
            { label: '100% digital audit certificate logging', value: 'Zero Compliance Gaps' },
            { label: 'Forward 3-5 year capital asset forecasting', value: 'CapEx Protection' },
          ]}
        />

        {/* 2. SCOPE STRIP */}
        <ServiceScopeStrip pillars={scopePillars} />

        {/* 3. EDITORIAL INTRO */}
        <ServiceEditorialIntro
          eyebrow="PROACTIVE ASSET CARE"
          heading="Eliminate Costly Failures with Structured Maintenance"
          subheading="Transitioning estates from unpredictable emergency breakdowns to planned, budgeted maintenance."
          paragraphs={[
            'Unplanned plant breakdowns disrupt business operations, alienate tenants, and cost significantly more than structured maintenance. EntireFM builds bespoke PPM schedules tailored to your building usage, equipment age, and statutory obligations.',
            'Every asset on your estate is tagged with a digital QR code, mapped to SFG20 engineering maintenance tasks, and tracked in real-time through the EntireCAFM portal to guarantee full statutory and operational governance.',
          ]}
          bullets={[
            'Bespoke 52-week maintenance calendars preventing equipment breakdowns',
            'Full statutory compliance certification archived in real-time',
            'Physical QR barcode asset verification guaranteeing engineer attendance',
            'Lifecycle degradation tracking and forward capital replacement advice',
          ]}
          imageSrc="/images/editorial/entirefm-switchroom-survey-2000w.webp"
          imageAlt="EntireFM engineers surveying commercial plant equipment"
          imageCaption="Asset Audit & Preventative Schedule Orchestration"
          sideBadge={{ figure: 'SFG20 Aligned', label: 'Maintenance Standard' }}
        />

        {/* 4. VISUAL CAPABILITY EXPERIENCE */}
        <VisualCapabilityExperience
          eyebrow="PPM DISCIPLINES"
          title="Strategic Asset Protection Across All Disciplines"
          subtitle="Combining engineering rigor with digital CAFM transparency to protect long-term property value."
          capabilities={capabilities}
        />

        {/* 5. UNIQUE FEATURE: THE MAINTENANCE CYCLE */}
        <MaintenanceCycleTimeline />

        {/* 6. SUPPORTED ASSETS */}
        <SupportedAssetsGrid
          eyebrow="ASSET COVERAGE"
          title="Plant & Building Equipment We Maintain"
          subtitle="Standardised maintenance task specifications across all hard FM and public health assets."
          categories={assetCategories}
        />

        {/* 7. DELIVERY PROCESS */}
        <ServiceDeliveryProcess
          eyebrow="OPERATIONAL FRAMEWORK"
          title="How Our PPM Contract Delivery Works"
          subtitle="A structured 5-step process from physical asset discovery to monthly executive compliance reporting."
        />

        {/* 8. PLANNED VS REACTIVE */}
        <PlannedVsReactiveSplit
          eyebrow="DELIVERY BALANCE"
          title="Planned Asset Longevity vs Emergency Cover"
          subtitle="Investing in proactive maintenance routines to eliminate 80%+ of avoidable plant breakdowns."
        />

        {/* 9. SECTORS */}
        <ServiceSectorsGrid
          eyebrow="SECTOR APPLICATION"
          title="Sectors Requiring PPM Contracts"
          subtitle="Supporting commercial offices, multi-site property portfolios, manufacturing plants, and education campuses."
        />

        {/* 10. TECHNOLOGY & CAFM */}
        <TechnologyCafmSection
          eyebrow="CAFM & EVIDENCE"
          title="Digital Asset Registry & Real-Time PPM Dashboards"
          subtitle="Complete transparency with QR-verified job completion notes and instant compliance certificate access."
        />

        {/* 11. TRUST BAR */}
        <TrustBar />

        {/* 12. SERVICE FAQS */}
        <section className="py-20 sm:py-28 bg-brand-surface border-b border-brand-edge">
          <div className="container-custom max-w-4xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                  PPM & COMPLIANCE FAQS
                </span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-brand-graphite">
                Frequently Asked Questions
              </h2>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        {/* 13. RELATED SERVICES */}
        <section className="py-20 bg-white border-b border-brand-edge">
          <div className="container-custom">
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-pink block mb-1">
                HARD FM SOLUTIONS
              </span>
              <h2 className="text-2xl font-bold text-brand-graphite">
                Explore Connected Asset Services
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>

        {/* 14. CONVERSION CLOSE */}
        <ServiceConversionSection
          serviceName="Planned Preventative Maintenance (PPM)"
          headline="Review Your Maintenance Programme & Pricing"
          subheadline="Consult with our engineering directors to benchmark your current PPM schedules, evaluate compliance status, and receive a competitive contract proposal."
          ctaButtonText="Submit PPM Review Request"
          directDeskNote="Direct line to PPM account directors and contract mobilisation team."
        />
      </main>

      <Footer />
    </div>
  );
}
