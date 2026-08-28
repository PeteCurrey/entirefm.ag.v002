'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceScopeStrip } from '@/components/services/ServiceScopeStrip';
import { ServiceEditorialIntro } from '@/components/services/ServiceEditorialIntro';
import { VisualCapabilityExperience } from '@/components/services/VisualCapabilityExperience';
import { CleaningDeliveryModel } from '@/components/services/CleaningDeliveryModel';
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

export function ServiceCleaningSuite({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: content.h1, url: route.path },
  ];

  const serviceMedia = getServiceMedia(route.path);

  const scopePillars = [
    {
      label: 'DAILY CARE',
      sublabel: 'Daytime Janitorial & Washrooms',
      iconName: 'commercialCleaning' as const,
    },
    {
      label: 'DEEP CLEANS',
      sublabel: 'Evening Machine Scrubbing',
      iconName: 'maintenanceTools' as const,
    },
    {
      label: 'SPECIALIST',
      sublabel: 'Window, Pressure & Extraction',
      iconName: 'nationwideCoverage' as const,
    },
    {
      label: 'ATP AUDITS',
      sublabel: 'Digital Quality Governance',
      iconName: 'dataInsights' as const,
    },
  ];

  const capabilities = [
    {
      name: 'Corporate Contract Cleaning & Workspace Presentation',
      description: 'Daily office cleaning programmes delivering spotless reception areas, meeting suites, open-plan workspaces, and washroom facilities aligned to active business occupancy schedules.',
      tag: 'Contract Cleaning',
      imageSrc: '/images/locations/birmingham/facilities-management-birmingham-city-centre-offices-1600w.webp',
      imageAlt: 'EntireFM professional contract cleaning in Grade-A corporate office',
      keyPoints: [
        'Microfibre cloth and HEPA-vacuum workstation sanitisation routines',
        'Colour-coded BICSc cross-contamination prevention protocols',
        'Washroom deep-clean and consumable management (soap, paper, air fresheners)',
        'Flexible scheduling — pre-open, evenings, or weekend blended models',
      ],
      isFeatured: true,
      href: '/contract-cleaning',
    },
    {
      name: 'Specialist Window & High-Reach External Façade Cleaning',
      description: 'High-performance Pure Water Fed Pole systems (60ft+), commercial reach and wash units, and cherry picker window cleaning across multi-storey commercial developments.',
      tag: 'Window Cleaning',
      imageSrc: '/images/locations/london/facilities-management-london-engineers-st-pauls-1600w.webp',
      imageAlt: 'EntireFM commercial high-reach window cleaning overlooking city skyline',
      keyPoints: [
        'Pure DI/RO water fed carbon fibre pole washing (residue-free)',
        'IPAF cherry picker and scissor lift elevating work platform access',
        'Bi-annual glazed curtain wall, atrium, and skylight clean programmes',
      ],
      href: '/window-cleaning',
    },
    {
      name: 'Industrial & Specialist Cleaning Operations',
      description: 'Heavy-duty industrial cleaning for logistics, manufacturing, and food production facilities using purpose-built ride-on scrubber dryers, hot water pressure washers, and high-reach vacuums.',
      tag: 'Industrial Cleaning',
      imageSrc: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
      imageAlt: 'EntireFM industrial cleaning operations at commercial distribution facility',
      keyPoints: [
        'Ride-on scrubber dryers on high-bay warehouse concrete floors',
        'Hot water pressure washing of racking systems, dock levellers, and bays',
        'Hygiene deep-cleans aligned to BRC and food safety audit standards',
      ],
      href: '/industrial-cleaning',
    },
    {
      name: 'Clinical & Medical Environment Sanitisation',
      description: 'Hospital-grade cleaning and infection control for medical centres, GP practices, laboratory cleanrooms, and pharmaceutical manufacturing, using virucidal agents and electrostatic fogging.',
      tag: 'Medical Cleaning',
      imageSrc: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
      imageAlt: 'EntireFM specialist clinical cleaning and infection control operations',
      keyPoints: [
        'EN14476 virucidal broad-spectrum disinfectants on all clinical surfaces',
        'ULV electrostatic aerosol fogging for air-borne pathogen reduction',
        'Strict four-colour BICSc microfibre zone isolation protocol',
      ],
      href: '/medical-cleaning',
    },
  ];

  const assetCategories = [
    {
      title: 'Cleaning Machinery & Equipment',
      subtitle: 'Deployed Specialist Plant',
      iconName: 'commercialCleaning' as const,
      assets: [
        'Ride-On Diesel & Battery Scrubber Dryers',
        'Industrial Hot Water Pressure Washers (200 bar)',
        'HEPA Backpack & Canister Vacuum Units',
        'Carbon Fibre Water Fed Pole Systems (60ft+)',
        'ULV Electrostatic Misting Foggers',
      ],
    },
    {
      title: 'COSHH Compliant Chemicals & Consumables',
      subtitle: 'Products & Hygiene Management',
      iconName: 'complianceAudit' as const,
      assets: [
        'Neutral pH Washroom Sanitisers & Descalers',
        'EN14476 & EN13727 Certified Disinfectants',
        'Colour-Coded BICSc Microfibre System',
        'Toilet Tissue, Soap & Paper Dispensers',
        'Clinical Waste Bags & Sharps Containers',
      ],
    },
    {
      title: 'Quality Governance & Compliance Tools',
      subtitle: 'Audit Technology',
      iconName: 'dataInsights' as const,
      assets: [
        'ATP Bioluminescence Swab Testing Kits',
        'Digital Supervisor QA Scoring Tablets',
        'EntireCAFM Shift Sign-Off Mobile App',
        'Before & After Photo Documentation',
        'COSHH Data Sheet Safety Vault Access',
      ],
    },
  ];

  const deliverySteps = [
    {
      number: '01',
      title: 'Estate Cleaning Survey & Frequency Mapping',
      description: 'Detailed area-by-area survey establishing footfall, risk zones, surface types, and required cleaning frequencies for each area.',
    },
    {
      number: '02',
      title: 'Bespoke Specification & COSHH Assessment',
      description: 'COSHH-compliant method statements, colour-coded zone specifications, and supervisor rotas configured before mobilisation.',
    },
    {
      number: '03',
      title: 'Mobilisation & Supervised Operatives',
      description: 'Uniformed, DBS-checked operatives supported by site supervisors and regional quality managers ensuring daily consistency.',
    },
    {
      number: '04',
      title: 'Digital ATP Audit & Client Reporting',
      description: 'Monthly ATP bioluminescence swab scoring, photographic KPI reports, and SLA compliance certificates published to EntireCAFM.',
    },
  ];

  const faqs = content.faqs && content.faqs.length > 0 ? content.faqs : [
    {
      question: 'Are your cleaning operatives DBS checked and employed directly?',
      answer: 'Yes. All client-facing cleaning operatives are directly employed by EntireFM, fully DBS checked, uniformed, COSHH trained, and supported by dedicated site supervisors and regional quality managers.',
    },
    {
      question: 'Can you accommodate out-of-hours or weekend cleaning to avoid disruption?',
      answer: 'EntireFM offers flexible cleaning scheduling including early morning pre-open starts, evening post-close deep cleans, and weekend specialist cleaning to minimise operational disruption.',
    },
    {
      question: 'How do you measure and evidence quality against the agreed SLA?',
      answer: 'Monthly ATP bioluminescence surface hygiene audits are conducted by supervisors, with photographic and scored reports published instantly to the client\'s EntireCAFM portal for full transparency.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-void text-brand-mist selection:bg-brand-pink/20 selection:text-brand-pink">
      <Header />

      <main id="main" className="flex-grow">
        <ServiceHero
          eyebrow="PROFESSIONAL COMMERCIAL CLEANING"
          title="Commercial & Specialist Cleaning"
          highlightedTitle="Services"
          intro="Multi-disciplinary commercial cleaning from daily contract office care and industrial scrubbing to specialist window cleaning and clinical infection control across UK estates."
          imageSrc={serviceMedia.hero}
          imageAlt={serviceMedia.heroAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Request a Cleaning Survey', href: '#enquiry' }}
          secondaryCta={{ label: 'Discuss Your Specification', href: '#contact-routes' }}
          serviceFacts={[
            { label: 'Quality Standard', value: 'BICSc Certified' },
            { label: 'Operatives', value: 'Directly Employed' },
            { label: 'Auditing', value: 'ATP Bioluminescence' },
          ]}
        />

        <TrustBar />

        <ServiceScopeStrip pillars={scopePillars} />

        {/* 4. EDITORIAL INTRO */}
        <ServiceEditorialIntro
          eyebrow="STRUCTURED MULTI-SHIFT DELIVERY"
          heading="Precision Cleaning Programmes That Protect Assets, Hygiene & First Impressions"
          subheading="Commercial cleaning is not a commodity. The quality of your estate's presentation and hygiene directly affects tenant satisfaction, compliance scores, and brand perception."
          paragraphs={[
            'Our multi-shift delivery model pairs daytime responsive janitorial teams with post-close machine scrubbing programmes and periodic specialist interventions.',
            'Every operative is directly employed, COSHH trained, and supported by supervisors using monthly ATP bioluminescence testing to evidence quality against your service level agreement.',
          ]}
          bullets={[
            '100% directly employed, uniformed, and DBS-checked cleaning operatives',
            'Strict BICSc colour-coded microfibre cross-contamination prevention',
            'Monthly ATP bioluminescence surface swab audit scoring in EntireCAFM',
            'Flexible scheduling: early morning, daytime janitorial, evening deep cleans',
          ]}
          imageSrc="/images/locations/birmingham/facilities-management-birmingham-city-centre-offices-1600w.webp"
          imageAlt="EntireFM commercial office contract cleaning team"
          imageCaption="Multi-Shift Commercial Cleaning & Hygiene Delivery"
          sideBadge={{ figure: 'BICSc & ISO 14001', label: 'Hygiene Standards' }}
        />

        {/* 5. VISUAL CAPABILITY EXPERIENCE */}
        <VisualCapabilityExperience
          eyebrow="CLEANING SERVICE DISCIPLINES"
          title="A Comprehensive Suite of Commercial Cleaning Services"
          subtitle="From daily office maintenance and retail hygiene to industrial deep cleans and clinical infection control, EntireFM covers the full spectrum."
          capabilities={capabilities}
        />

        {/* 6. SIGNATURE TECHNICAL DIAGRAM: CLEANING DELIVERY MODEL */}
        <CleaningDeliveryModel />

        {/* 7. SUPPORTED ASSETS TAXONOMY */}
        <SupportedAssetsGrid
          eyebrow="EQUIPMENT & STANDARDS TAXONOMY"
          title="Professional Cleaning Equipment & Compliance Framework"
          subtitle="Purpose-built cleaning machinery, industry-standard chemicals, and rigorous quality governance tools deployed across every contract."
          categories={assetCategories}
        />

        {/* 8. DELIVERY PROCESS */}
        <ServiceDeliveryProcess
          eyebrow="MOBILISATION METHODOLOGY"
          title="From Site Survey to Seamless Delivery"
          subtitle="Our structured mobilisation process ensures consistency, compliance, and measurable quality from day one."
        />

        {/* 9. PLANNED VS REACTIVE MAINTENANCE SPLIT */}
        <PlannedVsReactiveSplit
          eyebrow="CONTRACT STRUCTURE"
          title="Scheduled Programmes Supported by Rapid Reactive Response"
          subtitle="Proactive daily care prevents hygiene deterioration while our reactive desk handles emergencies and accidental incidents instantly."
          plannedItems={[
            'Daily morning/evening contract cleaning rotas',
            'Monthly deep-cleans of kitchens, washrooms, and high-touchpoint areas',
            'Quarterly window and external glazing cleaning programmes',
            'Bi-annual industrial scrubbing and floor treatment visits',
            'Annual carpet hot-water extraction and floor restoration programmes',
          ]}
          reactiveItems={[
            'Same-day spill and biohazard clearance response',
            'Emergency flood clean-up and sanitisation triage',
            'Ad-hoc deep cleans following pest control treatments',
            'Post-construction builders clean and sparkle finish commissioning',
          ]}
        />

        {/* 10. RELEVANT SECTORS GRID */}
        <ServiceSectorsGrid
          eyebrow="SECTOR EXPERTISE"
          title="Commercial Sectors We Serve"
          subtitle="From Grade-A offices and retail parks to NHS facilities and distribution centres, our cleaning teams are trained for sector-specific requirements."
        />

        {/* 11. ENTIRECAFM DIGITAL PORTAL SHOWCASE */}
        <TechnologyCafmSection
          eyebrow="DIGITAL QUALITY MANAGEMENT"
          title="Real-Time Cleaning Compliance in EntireCAFM"
          subtitle="Replace paper shift sheets with live digital supervisor reports, ATP scores, and photographic evidence all accessible from your portal."
        />

        {/* 12. FAQ ACCORDION */}
        <section className="py-16 sm:py-24 bg-brand-graphite border-t border-brand-edge-dark">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="mb-10 text-center">
                <span className="text-[10.5px] font-mono uppercase tracking-widest text-brand-electric-bright block mb-2">
                  FREQUENTLY ASKED QUESTIONS
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-white">
                  Commercial Cleaning Guidance
                </h2>
              </div>
              <FAQAccordion faqs={faqs} />
            </div>
          </div>
        </section>

        {/* 13. RELATED INTERNAL LINKS */}
        <RelatedLinks
          title="Related Soft FM & Facilities Services"
          links={[
            { title: 'Window Cleaning', path: '/window-cleaning', description: 'Commercial high-reach and water-fed pole window cleaning' },
            { title: 'Grounds Maintenance', path: '/grounds-maintenance', description: 'Commercial estates grounds and external realm management' },
            { title: 'Washroom Management', path: '/washroom-management', description: 'Washroom supplies, hygiene consumables and sanitisation' },
            { title: 'Soft FM Services', path: '/soft-services', description: 'Integrated soft facilities management services' },
          ]}
        />

        {/* 14. COMMERCIAL PROPOSAL & SURVEY CTA */}
        <ServiceConversionSection
          serviceName="Commercial Cleaning Services"
          headline="Request a Cleaning Survey & Quotation"
          subheadline="Consult directly with our commercial cleaning operations directors. We provide free site surveys, colour-coded BICSc specifications, and transparent SLA pricing."
          ctaButtonText="Request Cleaning Proposal"
          directDeskNote="Direct line to cleaning operations managers and 24/7 reactive dispatch."
        />

      </main>

      <Footer />
    </div>
  );
}
