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
import type { TemplateProps } from './types';

export function TemplateCoreService({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: content.h1, url: route.path },
  ];

  const serviceMedia = getServiceMedia(route.path);

  // Dynamic Scope Pillars based on service type
  const scopePillars = [
    {
      label: 'STATUTORY AUDIT',
      sublabel: 'Evidenced Compliance',
      iconName: 'complianceAudit' as const,
    },
    {
      label: 'PLANNED PPM',
      sublabel: 'SFG20 Maintenance Regimes',
      iconName: 'maintenanceTools' as const,
    },
    {
      label: 'REACTIVE DESK',
      sublabel: '24/7 Rapid Helpdesk',
      iconName: 'twentyFourSevenOps' as const,
    },
    {
      label: 'CAFM PORTAL',
      sublabel: 'Digital Audit Archival',
      iconName: 'dataInsights' as const,
    },
  ];

  const rawCapabilities = (content.capabilities && content.capabilities.length > 0)
    ? content.capabilities
    : [
        {
          name: 'Statutory Compliance & Testing',
          description: 'Comprehensive periodic inspections and certification ensuring full regulatory compliance.',
          tag: 'Compliance',
        },
        {
          name: 'Planned Preventative Maintenance (PPM)',
          description: 'Scheduled maintenance routines aligned to SFG20 engineering standards to protect assets.',
          tag: 'SFG20',
        },
        {
          name: 'Reactive Triage & Emergency Breakdown',
          description: 'Rapid engineer dispatch and technical triage to restore building operations swiftly.',
          tag: '24/7 Response',
        },
        {
          name: 'Asset Register & Condition Surveys',
          description: 'Digital cataloguing, barcoding, and forward lifecycle capital planning for building plant.',
          tag: 'Asset Care',
        },
      ];

  const visualCapabilities = rawCapabilities.map((cap, idx) => {
    const assignedCap = serviceMedia.capabilities && serviceMedia.capabilities[idx];
    return {
      name: cap.name,
      description: cap.description,
      tag: cap.tag || 'Specialist Scope',
      imageSrc: assignedCap?.imageSrc || serviceMedia.supporting01 || serviceMedia.card || serviceMedia.hero,
      imageAlt: assignedCap?.imageAlt || `EntireFM ${cap.name} engineering delivery`,
      isFeatured: idx === 0,
    };
  });

  const assetCategories = [
    {
      title: 'Primary Building Plant',
      subtitle: 'Core Hard FM Assets',
      iconName: 'powerElectrical' as const,
      assets: [
        'Main Switchgear & Distribution Boards',
        'Commercial Boilers & Circulation Pumps',
        'Air Handling Units (AHUs) & Ductwork',
        'VRV / VRF Air Conditioning Plant',
        'Emergency Battery Lighting Arrays',
      ],
    },
    {
      title: 'Compliance & Safety Systems',
      subtitle: 'Statutory Certification',
      iconName: 'complianceAudit' as const,
      assets: [
        'Periodic Electrical Inspection (EICR)',
        'Gas Safety CP12 Plant Inspections',
        'Fire Alarm Panels & Smoke Vents',
        'Water Hygiene & Legionella Monitoring',
        'Refrigerant F-Gas Log Records',
      ],
    },
    {
      title: 'Fabric & Building Access',
      subtitle: 'Envelope & Automation',
      iconName: 'securityCctv' as const,
      assets: [
        'Automated Security Gates & Turnstiles',
        'Access Control Keycards & Intercoms',
        'Fire Doors & Intumescent Seals',
        'Roof Gutters & Surface Drainage Pumps',
        'Commercial External Lighting',
      ],
    },
  ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `What is included in EntireFM’s ${content.h1} contract?`,
          answer: `Our ${content.h1} contracts cover planned maintenance, statutory inspections, dedicated account management, digital logbook records, and out-of-hours reactive callout support.`,
        },
        {
          question: 'How do you guarantee statutory compliance across our estate?',
          answer: 'All periodic tests and inspections are scheduled in EntireCAFM. Digital certificates are archived in real-time, providing immediate audit readiness for health, safety, and insurance reviews.',
        },
      ];

  const relatedLinks = (content.relatedRoutes || ['/services', '/ppm', '/mechanical-electrical', '/contact-us']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: 'Related Solution',
    description: `Explore EntireFM capabilities for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
  }));

  const firstSection = content.sections && content.sections.length > 0 ? content.sections[0] : null;
  const introParagraphs = firstSection
    ? [firstSection.body]
    : [
        `EntireFM delivers professional, self-delivered commercial ${content.h1.toLowerCase()} tailored to the operational demands of corporate offices, industrial facilities, and multi-site portfolios nationwide.`,
        'We combine certified mobile engineers, structured SFG20 preventative maintenance routines, and real-time digital CAFM reporting to guarantee complete asset availability and statutory compliance.',
      ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* 1. CINEMATIC HERO */}
        <ServiceHero
          eyebrow={content.eyebrow || 'HARD FM & BUILDING ENGINEERING'}
          title={content.h1}
          intro={content.heroIntro || content.metaDescription}
          imageSrc={serviceMedia.hero}
          imageAlt={serviceMedia.heroAlt || `EntireFM ${content.h1} engineering delivery`}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Request a Proposal', href: '#enquiry' }}
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
          eyebrow="TECHNICAL EXCELLENCE"
          heading={firstSection?.heading || `Professional Commercial ${content.h1}`}
          subheading="Preserving asset lifespan, tenant safety, and statutory compliance through direct engineering delivery."
          paragraphs={introParagraphs}
          bullets={firstSection?.bullets || [
            'Full statutory compliance management with digital certification in EntireCAFM',
            'Direct engineering delivery model reducing sub-contractor markups',
            'Assigned mobile engineering fleet and dedicated technical contract manager',
            'Asset condition registers and forward lifecycle capital planning',
          ]}
          imageSrc="/images/editorial/entirefm-switchroom-survey-2000w.webp"
          imageAlt={`EntireFM ${content.h1} engineers on site`}
          imageCaption="On-Site Asset Auditing & Technical Governance"
          // BESA membership is TO_VERIFY, so it cannot be rendered. SFG20 is the
          // standard we actually work to and BESA is merely its publisher, so
          // naming the standard says the true thing.
          sideBadge={{ figure: 'SFG20 Aligned', label: 'Technical Standards' }}
        />

        {/* 4. VISUAL CAPABILITY EXPERIENCE */}
        <VisualCapabilityExperience
          eyebrow="TECHNICAL SCOPE"
          title={`Specialist ${content.h1} Capabilities`}
          subtitle="Delivering comprehensive asset care, statutory testing, and preventative maintenance."
          capabilities={visualCapabilities}
        />

        {/* 5. SUPPORTED ASSETS */}
        <SupportedAssetsGrid
          eyebrow="EQUIPMENT REGISTER"
          title="Plant & Assets Maintained"
          subtitle="Comprehensive maintenance regimes tailored to commercial building services."
          categories={assetCategories}
        />

        {/* 6. DELIVERY PROCESS */}
        <ServiceDeliveryProcess
          eyebrow="OPERATIONAL FRAMEWORK"
          title="Our 5-Stage Contract Delivery Process"
          subtitle="A structured, transparent operational roadmap from asset survey to live digital governance."
        />

        {/* 7. PLANNED VS REACTIVE */}
        <PlannedVsReactiveSplit
          eyebrow="DELIVERY BALANCE"
          title="Planned Preventative Care vs Emergency Breakdown"
          subtitle="Protecting asset life through scheduled maintenance while maintaining 24/7 emergency repair support."
        />

        {/* 8. SECTORS */}
        <ServiceSectorsGrid
          eyebrow="SECTOR APPLICATION"
          title="Sectors & Environments We Support"
          subtitle="Delivering robust services across corporate offices, industrial manufacturing, logistics, and retail."
        />

        {/* 9. TECHNOLOGY & CAFM */}
        <TechnologyCafmSection
          eyebrow="DIGITAL ASSET GOVERNANCE"
          title="Real-Time CAFM & Digital Compliance Reporting"
          subtitle="Every inspection, test certificate, and reactive work order is archived in EntireCAFM."
        />

        {/* 10. TRUST BAR */}
        <TrustBar />

        {/* 11. SERVICE FAQS */}
        <section className="py-20 sm:py-28 bg-brand-surface border-b border-brand-edge">
          <div className="container-custom max-w-4xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                  TECHNICAL & COMMERCIAL FAQS
                </span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-brand-graphite">
                Frequently Asked Questions
              </h2>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        {/* 12. RELATED SERVICES */}
        <section className="py-20 bg-white border-b border-brand-edge">
          <div className="container-custom">
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-pink block mb-1">
                CONNECTED CAPABILITIES
              </span>
              <h2 className="text-2xl font-bold text-brand-graphite">
                Explore Related Engineering Solutions
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>

        {/* 13. CONVERSION CLOSE */}
        <ServiceConversionSection
          serviceName={content.service || content.h1}
          headline={`Request a Proposal for ${content.h1}`}
          subheadline="Consult with our engineering directors. We provide comprehensive asset dilapidation surveys, PPM contract pricing, and bespoke SLA proposals."
          ctaButtonText={`Submit ${content.h1} Enquiry`}
          directDeskNote="Direct line to technical operations directors and central dispatch."
        />
      </main>

      <Footer />
    </div>
  );
}
