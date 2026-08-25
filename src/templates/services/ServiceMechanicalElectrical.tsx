'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceScopeStrip } from '@/components/services/ServiceScopeStrip';
import { ServiceEditorialIntro } from '@/components/services/ServiceEditorialIntro';
import { VisualCapabilityExperience } from '@/components/services/VisualCapabilityExperience';
import { BuildingSystemsMap } from '@/components/services/BuildingSystemsMap';
import { SupportedAssetsGrid } from '@/components/services/SupportedAssetsGrid';
import { ServiceDeliveryProcess } from '@/components/services/ServiceDeliveryProcess';
import { PlannedVsReactiveSplit } from '@/components/services/PlannedVsReactiveSplit';
import { ServiceSectorsGrid } from '@/components/services/ServiceSectorsGrid';
import { TechnologyCafmSection } from '@/components/services/TechnologyCafmSection';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import type { TemplateProps } from '../types';

export function ServiceMechanicalElectrical({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Mechanical & Electrical', url: '/mechanical-electrical' },
  ];

  const scopePillars = [
    {
      label: 'ELECTRICAL',
      sublabel: 'HV/LV Switchgear & Power',
      iconName: 'powerElectrical' as const,
    },
    {
      label: 'MECHANICAL',
      sublabel: 'HVAC, Boilers & Pumps',
      iconName: 'maintenanceTools' as const,
    },
    {
      label: 'PLANNED PPM',
      sublabel: 'SFG20 & Statutory Care',
      iconName: 'complianceAudit' as const,
    },
    {
      label: 'REACTIVE DESK',
      sublabel: '24/7 Priority Breakdown',
      iconName: 'twentyFourSevenOps' as const,
    },
  ];

  const capabilities = [
    {
      name: 'Electrical Distribution & Switchgear',
      description: 'Periodic inspection, thermal imaging thermography, load balancing, and statutory testing of main LV switchboards, busbars, and sub-distribution panels.',
      tag: 'Power & Switchgear',
      imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
      imageAlt: 'EntireFM engineer testing commercial switchgear',
      keyPoints: [
        'Main LV switchboard and panelboard servicing',
        'Infrared thermal imaging to detect hot spots before failure',
        'Periodic EICR electrical installation condition reports',
        'Power factor correction (PFC) & sub-metering telemetry',
      ],
      isFeatured: true,
      href: '/mechanical-electrical',
    },
    {
      name: 'Commercial Boilers, Heating & Gas Plant',
      description: 'Comprehensive servicing of commercial condensing boilers, gas train interlocks, expansion vessels, calorifiers, and circulation pump sets.',
      tag: 'Heating Plant',
      imageSrc: '/images/editorial/entirefm-hvac-plantroom-pumps-2000w.webp',
      imageAlt: 'EntireFM engineers servicing plantroom pumps and boilers',
      keyPoints: [
        'Commercial boiler descaling and burner tuning',
        'Pressurisation booster set and pump maintenance',
        'Gas safety CP12 certification and valve interlocks',
      ],
      href: '/plumbing-gas',
    },
    {
      name: 'Commercial HVAC & Air Handling',
      description: 'Air handling unit (AHU) filter swaps, drive belt adjustments, DX chiller servicing, and VRV/VRF air conditioning diagnostics.',
      tag: 'HVAC & Cooling',
      imageSrc: '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
      imageAlt: 'EntireFM engineers on rooftop plant deck',
      keyPoints: [
        'Quarterly AHU filter and coil sanitisation',
        'F-Gas compliant refrigerant leak detection',
        'Chiller compressor oil and vibration diagnostics',
      ],
      href: '/hvac-contractor',
    },
    {
      name: 'Emergency Lighting Testing & Audits',
      description: 'Monthly flick tests, statutory 3-hour annual battery discharge audits, luminaire replacements, and digital logbook records.',
      tag: 'Life Safety',
      imageSrc: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
      imageAlt: 'EntireFM engineer conducting emergency lighting tests',
      keyPoints: [
        'BS 5266-1 compliant annual discharge auditing',
        'Battery replacement and luminaire repairs',
        'Automated digital compliance logging',
      ],
      href: '/safety-critical-emergency-systems',
    },
    {
      name: 'Access Control & Automation Systems',
      description: 'Maintenance and repair of electronic keycards, speedlanes, automated security gates, barriers, and intercom systems.',
      tag: 'Access & Security',
      imageSrc: '/images/editorial/entirefm-access-control-install-2000w.webp',
      imageAlt: 'EntireFM engineer installing access control system',
      keyPoints: [
        'Contactless access reader maintenance',
        'Automated vehicle barrier safety checks',
        'Maglock and emergency exit door releases',
      ],
      href: '/gates-barriers',
    },
    {
      name: 'EV Charging & Modern Infrastructure',
      description: 'Commercial workplace EV charging point installations, scheduled maintenance, cable testing, and energy load management.',
      tag: 'Infrastructure',
      imageSrc: '/images/editorial/entirefm-ev-charging-2000w.webp',
      imageAlt: 'EntireFM engineer servicing commercial EV charging point',
      keyPoints: [
        'Workplace charging station health checks',
        'Earth loop impedance and RCD trip testing',
        'Load management and software updates',
      ],
    },
  ];

  const assetCategories = [
    {
      title: 'Electrical Infrastructure',
      subtitle: 'Distribution & Power Quality',
      iconName: 'powerElectrical' as const,
      assets: [
        'Main LV Switchboards & Busbars',
        'Sub-distribution Boards & MCBs/RCBOs',
        'Power Factor Correction Units',
        'Uninterruptible Power Supplies (UPS)',
        'Building Lighting & DALI Controls',
      ],
    },
    {
      title: 'Mechanical & Climate Plant',
      subtitle: 'Heating, Cooling & Air Quality',
      iconName: 'maintenanceTools' as const,
      assets: [
        'Air Handling Units (AHUs) & Ductwork',
        'VRV/VRF Multi-Split AC Systems',
        'Air-Cooled & Water-Cooled Chillers',
        'Commercial Condensing Gas Boilers',
        'Pressurisation Booster Pump Sets',
      ],
    },
    {
      title: 'Statutory Safety & Security',
      subtitle: 'Life Safety & Physical Access',
      iconName: 'securityCctv' as const,
      assets: [
        '3-Hour Emergency Lighting Networks',
        'Fire Damper & AOV Smoke Vents',
        'Access Control Keycards & Barriers',
        'Water Hygiene Calorifiers & TMVs',
        'Local Exhaust Ventilation (LEV)',
      ],
    },
  ];

  const relatedLinks = (content.relatedRoutes || ['/ppm', '/hvac-contractor', '/plumbing-gas', '/safety-critical-emergency-systems']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: 'Related M&E Discipline',
    description: `Explore EntireFM's technical capabilities for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
  }));

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: 'What is included in an EntireFM Mechanical & Electrical (M&E) contract?',
          answer: 'Our M&E contracts cover electrical distribution, emergency lighting, commercial gas, heating plant, air conditioning, ventilation, water hygiene, access control, and dedicated reactive callout support.',
        },
        {
          question: 'How do you ensure our commercial building complies with UK statutory regulations?',
          answer: 'Our certified engineers conduct required periodic inspections (EICR, gas safety certificates, emergency lighting discharge audits, F-Gas leak checks) and archive digital compliance certificates directly into your CAFM portal.',
        },
        {
          question: 'Do you offer emergency response for critical M&E asset failures?',
          answer: 'Yes. Our central operations desk coordinates multi-skilled mobile engineer dispatch for contracted commercial estates nationwide.',
        },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* 1. CINEMATIC HERO */}
        <ServiceHero
          eyebrow="HARD FM & BUILDING ENGINEERING"
          title="Mechanical & Electrical (M&E) Engineering"
          highlightedTitle="for Commercial Estates"
          intro="Complete M&E lifecycle management. We design, maintain, and certify mission-critical mechanical and electrical infrastructure across corporate offices, industrial plants, and multi-site portfolios nationwide."
          imageSrc="/images/editorial/entirefm-switchgear-inspection-2000w.webp"
          imageAlt="EntireFM engineer testing commercial electrical switchgear"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Request an M&E Proposal', href: '#enquiry' }}
          serviceFacts={[
            { label: 'Direct engineering accountability', value: 'Single-Source Model' },
            { label: 'Digital audit certification in CAFM', value: 'Statutory Governance' },
            { label: 'Mobile technical fleet dispatch', value: 'UK Nationwide' },
          ]}
        />

        {/* 2. SCOPE STRIP */}
        <ServiceScopeStrip pillars={scopePillars} />

        {/* 3. EDITORIAL INTRO */}
        <ServiceEditorialIntro
          eyebrow="ENGINEERING GOVERNANCE"
          heading="Total Mechanical & Electrical Asset Lifecycle Care"
          subheading="Protecting asset longevity, occupant comfort, and statutory safety through direct technical delivery."
          paragraphs={[
            'EntireFM acts as the primary M&E contractor for commercial property owners, institutional landlords, and facilities directors. Our multi-skilled engineering teams take complete responsibility for building services, ensuring continuous operational availability, statutory safety certification, and optimized energy efficiency.',
            'From primary HV/LV electrical distribution boards and lighting controls to plantroom boilers, air handling units, and automated building access, we eliminate multi-contractor friction by holding the complete engineering scope under one clear service level agreement.',
          ]}
          bullets={[
            'Full statutory compliance management with digital certification via our CAFM portal',
            'Direct engineering delivery model reducing sub-contractor markups and response delays',
            'Dedicated contract managers and assigned mobile engineering fleet',
            'Comprehensive dilapidation surveys and asset condition registers for capital planning',
          ]}
          imageSrc="/images/editorial/entirefm-switchroom-survey-2000w.webp"
          imageAlt="EntireFM engineers surveying commercial plantroom switchgear"
          imageCaption="Multi-Trade Engineering Delivery & Plant Room Auditing"
          sideBadge={{ figure: 'BS 7671 & SFG20', label: 'Technical Standards' }}
        />

        {/* 4. VISUAL CAPABILITY EXPERIENCE */}
        <VisualCapabilityExperience
          eyebrow="SPECIALIST M&E DISCIPLINES"
          title="Engineered Services Across the Building Fabric"
          subtitle="Combining mechanical, electrical, and public health expertise into a cohesive operational service."
          capabilities={capabilities}
        />

        {/* 5. UNIQUE FEATURE: BUILDING SYSTEMS MAP */}
        <BuildingSystemsMap />

        {/* 6. SUPPORTED ASSETS */}
        <SupportedAssetsGrid
          eyebrow="INFRASTRUCTURE SCOPE"
          title="Plant & Equipment We Maintain"
          subtitle="Comprehensive maintenance regimes tailored to commercial building services and mission-critical assets."
          categories={assetCategories}
        />

        {/* 7. DELIVERY PROCESS */}
        <ServiceDeliveryProcess
          eyebrow="OPERATIONAL FRAMEWORK"
          title="How Our M&E Contract Delivery Works"
          subtitle="A structured 5-step process from initial asset barcode audits to monthly statutory compliance governance."
        />

        {/* 8. PLANNED VS REACTIVE */}
        <PlannedVsReactiveSplit
          eyebrow="DELIVERY BALANCE"
          title="Planned Preventative Maintenance vs Emergency Support"
          subtitle="Balancing planned SFG20 routines to protect asset life with rapid reactive engineering when plant fails."
        />

        {/* 9. SECTORS */}
        <ServiceSectorsGrid
          eyebrow="SECTOR APPLICATION"
          title="M&E Across Commercial Environments"
          subtitle="Delivering robust building engineering across corporate offices, heavy manufacturing, logistics, and retail estates."
        />

        {/* 10. TECHNOLOGY & CAFM */}
        <TechnologyCafmSection
          eyebrow="CAFM & ASSET TELEMETRY"
          title="Real-Time M&E Asset Intelligence & Certification"
          subtitle="Every switchboard check, boiler service, and emergency lighting test is barcoded and archived in our CAFM portal."
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
                  COMMERCIAL & TECHNICAL FAQS
                </span>
              </div>
              <h2 className="text-3xl font-light tracking-tight text-brand-graphite">
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
                COMPREHENSIVE HARD SERVICES
              </span>
              <h2 className="text-2xl font-bold text-brand-graphite">
                Explore Related Engineering Capabilities
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>

        {/* 14. CONVERSION CLOSE */}
        <ServiceConversionSection
          serviceName="Mechanical & Electrical (M&E)"
          headline="Discuss Your M&E Engineering Requirement"
          subheadline="Consult directly with our technical engineering directors. We provide comprehensive asset condition dilapidation surveys, PPM contract scopes, and transparent SLA pricing."
          ctaButtonText="Submit M&E Enquiry"
          directDeskNote="Direct line to M&E technical directors and central dispatch."
        />
      </main>

      <Footer />
    </div>
  );
}
