'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceScopeStrip } from '@/components/services/ServiceScopeStrip';
import { ServiceEditorialIntro } from '@/components/services/ServiceEditorialIntro';
import { VisualCapabilityExperience } from '@/components/services/VisualCapabilityExperience';
import { IndustrialEnvironmentsGallery } from '@/components/services/IndustrialEnvironmentsGallery';
import { SupportedAssetsGrid } from '@/components/services/SupportedAssetsGrid';
import { ServiceDeliveryProcess } from '@/components/services/ServiceDeliveryProcess';
import { PlannedVsReactiveSplit } from '@/components/services/PlannedVsReactiveSplit';
import { ServiceSectorsGrid } from '@/components/services/ServiceSectorsGrid';
import { TechnologyCafmSection } from '@/components/services/TechnologyCafmSection';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import type { TemplateProps } from '../types';

export function ServiceIndustrialCleaning({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Industrial Cleaning', url: '/industrial-cleaning' },
  ];

  const scopePillars = [
    {
      label: 'FACTORY FLOORS',
      sublabel: 'Ride-On Scrubbing & Degrease',
      iconName: 'commercialCleaning' as const,
    },
    {
      label: 'HIGH LEVEL',
      sublabel: 'Girders, Purlins & Cranes',
      iconName: 'maintenanceTools' as const,
    },
    {
      label: 'SHUTDOWN CLEANS',
      sublabel: 'Planned Holiday Overhauls',
      iconName: 'complianceAudit' as const,
    },
    {
      label: 'EXTERNAL CLADDING',
      sublabel: 'Docks & Pressure Wash',
      iconName: 'nationwideCoverage' as const,
    },
  ];

  const capabilities = [
    {
      name: 'Factory Floor Degreasing & Machine Scrubbing',
      description: 'Heavy-duty ride-on scrubbing, chemical oil/grease emulsification, epoxy floor restoration, and walkway line demarcation for active assembly lines.',
      tag: 'Heavy Floors',
      imageSrc: '/images/editorial/entirefm-site-arrival-2000w.webp',
      imageAlt: 'EntireFM industrial team and vehicle at a commercial manufacturing plant',
      keyPoints: [
        'Epoxy resin-safe alkaline and solvent degreasing',
        'Forklift tire mark and hydraulic fluid removal',
        'Anti-slip testing and certified floor sealing',
        'Chemical bund cleaning and spill containment',
      ],
      isFeatured: true,
      href: '/industrial-cleaning',
    },
    {
      name: 'High-Level Girders, Trusses & Crane Tracks',
      description: 'Specialist dust and combustible lint extraction from overhead steelwork, roof trusses, crane rails, busbars, and high-bay lighting without disrupting production.',
      tag: 'High-Level Access',
      imageSrc: '/images/editorial/entirefm-rooftop-plant-night-2000w.webp',
      imageAlt: 'EntireFM team working at height in industrial environment',
      keyPoints: [
        'IPAF 3a/3b scissor and articulated boom operators',
        'ATEX-certified explosion-proof vacuum systems',
        'Overhead crane gantry and busbar de-dusting',
      ],
      href: '/working-at-height-rope-access-bmu',
    },
    {
      name: 'Factory Shutdown Maintenance Windows',
      description: 'Concentrated 24/7 industrial cleaning overhauls scheduled during summer/Christmas plant closures, bank holidays, and retooling shutdowns.',
      tag: 'Shutdown Care',
      imageSrc: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
      imageAlt: 'EntireFM team carrying out concentrated plant maintenance',
      keyPoints: [
        'Complete machinery cell and robotic enclosure washdown',
        'Conveyor, chain, and roller residue stripping',
        'Dry ice blasting for sensitive electrical controls',
      ],
    },
    {
      name: 'Industrial Extraction & LEV Duct Cleaning',
      description: 'Deep internal degreasing of manufacturing extraction systems, local exhaust ventilation (LEV) ductwork, spray booths, and cyclone hoppers.',
      tag: 'LEV & Air',
      imageSrc: '/images/editorial/entirefm-hvac-plantroom-pumps-2000w.webp',
      imageAlt: 'EntireFM technicians servicing extraction ductwork',
      keyPoints: [
        'TR19 compliant internal ductwork degreasing',
        'Spray booth wall stripping and overspray removal',
        'Confined space certified entry protocols',
      ],
    },
    {
      name: 'External Cladding & Loading Bay Pressure Washing',
      description: 'Hot-water rotary surface washing of composite cladding panels, dock leveller pits, perimeter yards, and high-volume gutter clearance.',
      tag: 'Exterior Fabric',
      imageSrc: '/images/editorial/entirefm-entirefm-premises-vans-2000w.webp',
      imageAlt: 'EntireFM fleet equipped with hot-water pressure washers',
      keyPoints: [
        'High-flow rotary surface pressure cleaners',
        'Loading dock shelter and bumper chemical wash',
        'Industrial gutter vacuuming and camera inspections',
      ],
      href: '/pressure-washing',
    },
    {
      name: 'Silo, Tank & Confined Space Decontamination',
      description: 'Certified entry teams equipped with gas detectors, breathing apparatus, and recovery harnesses for deep sanitisation of industrial storage vessels.',
      tag: 'Confined Space',
      imageSrc: '/images/editorial/entirefm-headquarters-exterior-2000w.webp',
      imageAlt: 'EntireFM specialist safety equipment and fleet',
      keyPoints: [
        'City & Guilds confined space trained operatives',
        'Continuous 4-gas atmosphere monitoring',
        'Safe waste containment and transfer documentation',
      ],
    },
  ];

  const assetCategories = [
    {
      title: 'Manufacturing & Plant Assets',
      subtitle: 'Production & Machinery',
      iconName: 'commercialCleaning' as const,
      assets: [
        'Robotic Cells & Automated Assembly Lines',
        'CNC Enclosures, Presses & Stamping Beds',
        'Conveyor Networks, Belts & Rollers',
        'Chemical Bunds & Secondary Containment',
        'Machine Sump Pits & Coolant Reservoirs',
      ],
    },
    {
      title: 'High-Level Structural Fabric',
      subtitle: 'Overhead & Structural Steel',
      iconName: 'maintenanceTools' as const,
      assets: [
        'Overhead Crane Rails & Gantries',
        'Structural Steel Trusses & Purlins',
        'High-Bay LED Light Fittings & Cable Trays',
        'Roof Vents, Skylights & Louvres',
        'HV/LV Busbar Trunking Networks',
      ],
    },
    {
      title: 'Logistics & External Infrastructure',
      subtitle: 'Warehousing & Perimeter',
      iconName: 'nationwideCoverage' as const,
      assets: [
        'Narrow Aisle High-Density Pallet Racking',
        'Dock Levellers & Hydraulic Scissor Pits',
        'External Cladding Panels & Gutter Runs',
        'Trailer Parking Yards & Concrete Aprons',
        'Interceptors, Gullies & Oil Drainage',
      ],
    },
  ];

  const relatedLinks = (content.relatedRoutes || ['/cleaning-services', '/contract-cleaning', '/pressure-washing', '/working-at-height-rope-access-bmu']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: 'Specialist Cleaning Discipline',
    description: `Explore EntireFM capabilities for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
  }));

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: 'Do your industrial cleaning teams work during active production hours?',
          answer: 'Yes. We operate flexible shifts including night shifts, weekends, and scheduled shutdown periods to complete heavy cleaning without disrupting active production lines or logistics workflows.',
        },
        {
          question: 'What health, safety, and compliance standards govern your industrial operations?',
          answer: 'All projects are executed under site-specific Risk Assessments and Method Statements (RAMS), COSHH chemical safety dossiers, Lock-Out/Tag-Out (LOTO) protocols, and IPAF/PASMA access certifications.',
        },
        {
          question: 'How do you clean high-level overhead steelwork in active warehouses?',
          answer: 'We utilize electric zero-emission scissor lifts, articulated boom lifts, and ATEX-rated high-reach vacuum lances to clean purlins and crane tracks safely from ground or basket level.',
        },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* 1. CINEMATIC HERO */}
        <ServiceHero
          eyebrow="HEAVY MANUFACTURING & PLANT HYGIENE"
          title="Industrial Cleaning & Factory Decontamination"
          highlightedTitle="Services"
          intro="Heavy-duty facilities management and decontamination support tailored to manufacturing plants, factories, and industrial processing estates. Maximizing production uptime and maintaining rigorous health and safety compliance."
          imageSrc="/images/editorial/entirefm-external-distribution-dusk-2000w.webp"
          imageAlt="EntireFM industrial cleaning team at an industrial manufacturing plant"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Request an Industrial Survey', href: '#enquiry' }}
          serviceFacts={[
            { label: 'Site-specific RAMS & COSHH dossiers', value: 'Safety Certified' },
            { label: 'IPAF 3a/3b & IRATA access trained', value: 'High-Level Access' },
            { label: '24/7 holiday & weekend delivery', value: 'Shutdown Overhauls' },
          ]}
        />

        {/* 2. SCOPE STRIP */}
        <ServiceScopeStrip pillars={scopePillars} />

        {/* 3. EDITORIAL INTRO */}
        <ServiceEditorialIntro
          eyebrow="INDUSTRIAL HEALTH & SAFETY"
          heading="Engineered for Heavy Manufacturing and Continuous Production"
          subheading="Specialist decontamination, degreasing, and high-level cleaning that maintains audit standards without halting active production."
          paragraphs={[
            'Industrial environments present unique health, safety, and operational challenges. Unplanned plant stoppages result in massive financial losses. EntireFM provides rigorous PPM schedules, machinery interface maintenance, and strict adherence to industrial safety standards.',
            'Our industrial teams deploy heavy-duty ride-on scrubbing machinery, ATEX-rated explosion-proof extraction systems, and specialist access booms to clean high-level purlins, crane gantries, and deep production pits.',
          ]}
          bullets={[
            'Strict Lock-Out / Tag-Out (LOTO) and permit-to-work safety execution',
            'Concentrated holiday shutdown and weekend deep-clean maintenance windows',
            'ATEX compliant extraction for combustible dust and heavy overspray',
            'Comprehensive COSHH dossiers and environmental waste disposal manifests',
          ]}
          imageSrc="/images/editorial/entirefm-rooftop-plant-night-2000w.webp"
          imageAlt="EntireFM industrial team working at height in commercial plant"
          imageCaption="High-Level Access Cleaning & Heavy Industrial Decontamination"
          sideBadge={{ figure: 'IPAF & COSHH', label: 'Safety Governance' }}
        />

        {/* 4. VISUAL CAPABILITY EXPERIENCE */}
        <VisualCapabilityExperience
          eyebrow="INDUSTRIAL CAPABILITIES"
          title="Heavy-Duty Cleaning & Plant Care Solutions"
          subtitle="Engineered for manufacturing facilities, logistics hubs, and high-bay industrial warehouses."
          capabilities={capabilities}
        />

        {/* 5. UNIQUE FEATURE: INDUSTRIAL ENVIRONMENTS WE CLEAN */}
        <IndustrialEnvironmentsGallery />

        {/* 6. SUPPORTED ASSETS */}
        <SupportedAssetsGrid
          eyebrow="ENVIRONMENT SCOPE"
          title="Plant Equipment & Environments We Decontaminate"
          subtitle="Specialist methods tailored to heavy machinery, structural steelwork, and logistics yards."
          categories={assetCategories}
        />

        {/* 7. DELIVERY PROCESS */}
        <ServiceDeliveryProcess
          eyebrow="OPERATIONAL FRAMEWORK"
          title="How Our Industrial Cleaning Service Operates"
          subtitle="A structured 5-step process from initial site hazards survey to photographic sign-off and waste transfer manifests."
        />

        {/* 8. PLANNED VS REACTIVE */}
        <PlannedVsReactiveSplit
          eyebrow="DELIVERY BALANCE"
          title="Routine Plant Hygiene vs Shutdown Deep Cleans"
          subtitle="Maintaining continuous factory floor hygiene while executing concentrated heavy overhauls during shutdowns."
        />

        {/* 9. SECTORS */}
        <ServiceSectorsGrid
          eyebrow="SECTOR APPLICATION"
          title="Industrial Sectors We Support"
          subtitle="Serving automotive assembly, food production, chemical manufacturing, and national distribution centres."
        />

        {/* 10. TECHNOLOGY & CAFM */}
        <TechnologyCafmSection
          eyebrow="EVIDENCE & REPORTING"
          title="Digital RAMS, COSHH Dossiers & Sign-Off Proof"
          subtitle="Instant access to method statements, before/after photography, and waste disposal certificates in EntireCAFM."
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
                  INDUSTRIAL CLEANING FAQS
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
                SPECIALIST SERVICES
              </span>
              <h2 className="text-2xl font-bold text-brand-graphite">
                Explore Connected Specialist Solutions
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>

        {/* 14. CONVERSION CLOSE */}
        <ServiceConversionSection
          serviceName="Industrial Cleaning"
          headline="Request an Industrial Cleaning Survey & Quotation"
          subheadline="Consult with our industrial operations managers for site audits, method statements, risk assessments, and fixed-price contract quotations."
          ctaButtonText="Submit Industrial Survey Request"
          directDeskNote="Direct line to industrial operations managers and mobile crews."
        />
      </main>

      <Footer />
    </div>
  );
}
