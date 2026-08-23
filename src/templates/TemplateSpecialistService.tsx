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
import type { TemplateProps } from './types';

export function TemplateSpecialistService({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: content.h1, url: route.path },
  ];

  const scopePillars = [
    {
      label: 'CERTIFIED SAFETY',
      sublabel: 'RAMS & COSHH Assessed',
      iconName: 'riskCompliance' as const,
    },
    {
      label: 'ACCESS RIGOR',
      sublabel: 'IPAF & Specialized Plant',
      iconName: 'maintenanceTools' as const,
    },
    {
      label: 'SCHEDULED CARE',
      sublabel: 'Periodic Deep Cleans',
      iconName: 'commercialCleaning' as const,
    },
    {
      label: 'NATIONWIDE FLEET',
      sublabel: 'Rapid Mobilisation',
      iconName: 'nationwideCoverage' as const,
    },
  ];

  const defaultImages = [
    '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
    '/images/editorial/entirefm-rooftop-plant-night-2000w.webp',
    '/images/editorial/entirefm-site-arrival-2000w.webp',
    '/images/editorial/entirefm-entirefm-premises-vans-2000w.webp',
    '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
    '/images/editorial/entirefm-headquarters-exterior-2000w.webp',
  ];

  const rawCapabilities = (content.capabilities && content.capabilities.length > 0)
    ? content.capabilities
    : [
        {
          name: 'Specialist Machinery & Access',
          description: 'High-reach access platforms, heavy-duty pressure washing units, and certified operatives.',
          tag: 'Specialist Plant',
        },
        {
          name: 'Health & Safety Certified',
          description: 'Comprehensive risk assessments (RAMS), method statements, and strict environmental compliance.',
          tag: 'Safety & RAMS',
        },
        {
          name: 'Scheduled & Out-of-Hours Execution',
          description: 'Flexible delivery out-of-hours and on weekends to avoid interrupting active business operations.',
          tag: 'Zero Disruption',
        },
        {
          name: 'Digital Quality & Audit Sign-Off',
          description: 'Before-and-after photographic proof and audit sign-off archived in the EntireCAFM portal.',
          tag: 'Quality Proof',
        },
      ];

  const visualCapabilities = rawCapabilities.map((cap, idx) => ({
    name: cap.name,
    description: cap.description,
    tag: cap.tag || 'Specialist Scope',
    imageSrc: defaultImages[idx % defaultImages.length],
    imageAlt: `EntireFM ${cap.name} specialist delivery`,
    isFeatured: idx === 0,
  }));

  const assetCategories = [
    {
      title: 'Specialist Operations & Plant',
      subtitle: 'Machinery & Methods',
      iconName: 'commercialCleaning' as const,
      assets: [
        'High-Pressure Hot Water Washers',
        'Ride-On Industrial Scrubber-Dryers',
        'ATEX-Rated Explosion-Proof Extractors',
        'Chemical Degreasing & Stripping Kits',
        'Truck-Mounted Boom & Scissor Lifts',
      ],
    },
    {
      title: 'Safety & Compliance Framework',
      subtitle: 'Accreditations & Standards',
      iconName: 'riskCompliance' as const,
      assets: [
        'Site-Specific RAMS Risk Assessments',
        'COSHH Safety Data Sheets & Dossiers',
        'Lock-Out / Tag-Out (LOTO) Procedures',
        'IPAF 3a/3b & PASMA Tower Certifications',
        'Environmental Waste Disposal Manifests',
      ],
    },
    {
      title: 'Commercial Environments',
      subtitle: 'Facility Coverage',
      iconName: 'nationwideCoverage' as const,
      assets: [
        'Manufacturing Plants & Assembly Lines',
        'High-Bay Logistics Hubs & Warehouses',
        'Corporate Office Facades & Cladding',
        'Retail Parks & Public Footfall Zones',
        'Commercial Car Parks & Service Yards',
      ],
    },
  ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `What standards govern EntireFM’s ${content.h1}?`,
          answer: `All ${content.h1.toLowerCase()} operations adhere to UK statutory health and safety regulations, COSHH assessments, IPAF/PASMA access standards, and environmental waste disposal guidelines.`,
        },
        {
          question: 'Can operations be conducted outside normal business hours?',
          answer: 'Yes. We deliver specialist operations during night shifts, weekends, and planned holiday shutdown periods to eliminate operational disruption.',
        },
      ];

  const relatedLinks = (content.relatedRoutes || ['/services', '/industrial-cleaning', '/cleaning-services', '/contact-us']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: 'Specialist Service',
    description: `Explore EntireFM capabilities for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
  }));

  const firstSection = content.sections && content.sections.length > 0 ? content.sections[0] : null;
  const introParagraphs = firstSection
    ? [firstSection.body]
    : [
        `EntireFM delivers specialist ${content.h1.toLowerCase()} engineered for high-demand commercial, industrial, and logistics environments across the United Kingdom.`,
        'We combine heavy-duty access machinery, certified safety protocols, and rigorous quality assurance to deliver flawless operational results.',
      ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* 1. CINEMATIC HERO */}
        <ServiceHero
          eyebrow={content.eyebrow || 'SPECIALIST & INDUSTRIAL SERVICES'}
          title={content.h1}
          intro={content.heroIntro || content.metaDescription}
          imageSrc="/images/editorial/entirefm-external-distribution-dusk-2000w.webp"
          imageAlt={`EntireFM ${content.h1} specialist operations`}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Request a Proposal', href: '#enquiry' }}
          serviceFacts={[
            { label: 'Site-specific RAMS & COSHH dossiers', value: 'Safety Certified' },
            { label: 'IPAF & specialist plant trained', value: 'High-Level Access' },
            { label: 'Out-of-hours & weekend delivery', value: 'Zero Disruption' },
          ]}
        />

        {/* 2. SCOPE STRIP */}
        <ServiceScopeStrip pillars={scopePillars} />

        {/* 3. EDITORIAL INTRO */}
        <ServiceEditorialIntro
          eyebrow="SPECIALIST GOVERNANCE"
          heading={firstSection?.heading || `Expert Delivery for ${content.h1}`}
          subheading="Engineered for complex environments requiring specialized plant and strict safety procedures."
          paragraphs={introParagraphs}
          bullets={firstSection?.bullets || [
            'Site-specific RAMS and COSHH compliance dossiers',
            'Heavy-duty specialist plant and access equipment',
            'Direct delivery by trained, certified operatives',
            'Full digital photographic sign-off in EntireCAFM',
          ]}
          imageSrc="/images/editorial/entirefm-rooftop-plant-night-2000w.webp"
          imageAlt={`EntireFM ${content.h1} operatives on site`}
          imageCaption="Specialist Access & Health & Safety Governance"
          sideBadge={{ figure: 'IPAF & COSHH', label: 'Safety Standard' }}
        />

        {/* 4. VISUAL CAPABILITY EXPERIENCE */}
        <VisualCapabilityExperience
          eyebrow="SPECIALIST CAPABILITIES"
          title={`Specialist ${content.h1} Methodologies`}
          subtitle="Delivering advanced technical methods and access solutions across demanding estates."
          capabilities={visualCapabilities}
        />

        {/* 5. SUPPORTED ASSETS */}
        <SupportedAssetsGrid
          eyebrow="OPERATIONAL SCOPE"
          title="Equipment & Facilities Supported"
          subtitle="Engineered for manufacturing, logistics, and high-footfall commercial facilities."
          categories={assetCategories}
        />

        {/* 6. DELIVERY PROCESS */}
        <ServiceDeliveryProcess
          eyebrow="OPERATIONAL FRAMEWORK"
          title="Our 5-Stage Specialist Delivery Process"
          subtitle="A structured process from site hazard survey and RAMS creation to photographic sign-off."
        />

        {/* 7. PLANNED VS REACTIVE */}
        <PlannedVsReactiveSplit
          eyebrow="DELIVERY BALANCE"
          title="Scheduled Operations vs Rapid Response"
          subtitle="Maintaining routine commercial care while providing rapid response for urgent specialist requirements."
        />

        {/* 8. SECTORS */}
        <ServiceSectorsGrid
          eyebrow="SECTOR APPLICATION"
          title="Commercial Sectors We Support"
          subtitle="Delivering specialist solutions for industrial plants, logistics hubs, retail, and corporate real estate."
        />

        {/* 9. TECHNOLOGY & CAFM */}
        <TechnologyCafmSection
          eyebrow="DIGITAL ASSET GOVERNANCE"
          title="Real-Time CAFM & Digital Compliance Reporting"
          subtitle="Every project sign-off, RAMS dossier, and completion manifest is securely archived."
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
                  SPECIALIST & SAFETY FAQS
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
                SPECIALIST SCOPE
              </span>
              <h2 className="text-2xl font-bold text-brand-graphite">
                Explore Connected Specialist Capabilities
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>

        {/* 13. CONVERSION CLOSE */}
        <ServiceConversionSection
          serviceName={content.service || content.h1}
          headline={`Request a Proposal for ${content.h1}`}
          subheadline="Consult with our technical operations team for project surveys, RAMS method statements, and specialist contract pricing."
          ctaButtonText={`Submit ${content.h1} Enquiry`}
          directDeskNote="Direct line to specialist operations managers and mobile crews."
        />
      </main>

      <Footer />
    </div>
  );
}
