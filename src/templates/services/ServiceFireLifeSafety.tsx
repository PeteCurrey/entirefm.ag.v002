'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceScopeStrip } from '@/components/services/ServiceScopeStrip';
import { ServiceEditorialIntro } from '@/components/services/ServiceEditorialIntro';
import { VisualCapabilityExperience } from '@/components/services/VisualCapabilityExperience';
import { FireSafetyMatrix } from '@/components/services/FireSafetyMatrix';
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

export function ServiceFireLifeSafety({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: content.h1, url: route.path },
  ];

  const serviceMedia = getServiceMedia(route.path);

  const scopePillars = [
    {
      label: 'FIRE ALARMS',
      sublabel: 'BS 5839 Detection & Testing',
      iconName: 'complianceAudit' as const,
    },
    {
      label: 'EMERGENCY LIGHTS',
      sublabel: '3-Hour Battery Discharge',
      iconName: 'powerElectrical' as const,
    },
    {
      label: 'PASSIVE FIRE',
      sublabel: 'Dampers & Compartmentation',
      iconName: 'maintenanceTools' as const,
    },
    {
      label: 'GOLDEN THREAD',
      sublabel: 'Digital CAFM Logbooks',
      iconName: 'dataInsights' as const,
    },
  ];

  const capabilities = [
    {
      name: 'Addressable Fire Alarm Testing & Maintenance',
      description: 'Systematic testing of optical smoke sensors, heat detectors, manual call points, sounder beacon arrays, aspirating systems (VESDA), and cause-and-effect interface relays.',
      tag: 'BS 5839-1 Compliance',
      imageSrc: '/images/editorial/entirefm-access-control-install-2000w.webp',
      imageAlt: 'EntireFM engineer testing commercial addressable fire alarm panel',
      keyPoints: [
        'Weekly testing rota and quarterly 25% periodic maintenance inspections',
        '100% annual device verification and sound level (dBA) compliance audits',
        'Auxiliary relay interface testing (automatic doors, gas shut-off, plant shutdown)',
        'Full cause-and-effect matrix validation with managing agent sign-off',
      ],
      isFeatured: true,
      href: '/fire-emergency-systems',
    },
    {
      name: 'Statutory 3-Hour Emergency Lighting Discharge Audits',
      description: 'Monthly functional flicker tests and annual 3-hour full duration battery discharge testing across all maintained and non-maintained luminaires, illuminated exit signs, and central battery units.',
      tag: 'BS 5266-1 Life Safety',
      imageSrc: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
      imageAlt: 'EntireFM engineer testing emergency lighting luminaire battery circuits',
      keyPoints: [
        'Monthly key-switch functional testing across all emergency circuits',
        'Annual statutory 3-hour discharge audit with lux level verification',
        'Immediate luminaire battery and LED gear tray remedial replacement',
        'Digital test logbook generation meeting enforcing authority standards',
      ],
      href: '/emergency-light-testing',
    },
    {
      name: 'Fire Damper Drop Testing & HVAC Smoke Containment',
      description: 'Physical inspection and drop testing of HVAC fusible link and motorized fire dampers in fire barrier walls, clearing debris and testing microswitch feedback to the building management system.',
      tag: 'BS 9999 Passive Fire',
      imageSrc: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
      imageAlt: 'EntireFM technician inspecting commercial ventilation ductwork and motorized fire damper',
      keyPoints: [
        'Physical drop testing and thermal fusible link condition assessment',
        'Internal ductwork photographic inspection and access hatch verification',
        'BMS alarm telemetry feedback and motor actuator reset testing',
      ],
      href: '/fire-emergency-systems',
    },
    {
      name: 'Dry Riser Testing & Gaseous Suppression Plant',
      description: 'Hydrostatic pressure testing of dry risers to 12 bar, flow rate testing on wet risers, and annual cylinder weight checks for server room gaseous fire suppression systems.',
      tag: 'BS 9990 & BS EN 15004',
      imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
      imageAlt: 'EntireFM engineers inspecting critical plant suppression and distribution infrastructure',
      keyPoints: [
        '12-bar hydrostatic pressure testing of dry riser inlet and landing valves',
        'FM-200, Novec 1230 & Inergen gaseous cylinder weight verification',
        'Room integrity fan testing for gaseous enclosure hold times',
      ],
      href: '/compliance',
    },
  ];

  const assetCategories = [
    {
      title: 'Active Detection & Alerting',
      subtitle: 'Alarm Panels & Sensors',
      iconName: 'complianceAudit' as const,
      assets: [
        'Addressable Fire Alarm Control Panels (FACP)',
        'Optical Smoke & Thermal Heat Detectors',
        'Aspirating Smoke Detection (VESDA Pipework)',
        'Manual Call Points (Break Glass Units)',
        'Voice Alarm & Sounder Beacon Networks',
      ],
    },
    {
      title: 'Egress & Emergency Lighting',
      subtitle: 'Illumination & Evacuation',
      iconName: 'powerElectrical' as const,
      assets: [
        'Maintained & Non-Maintained Emergency Luminaires',
        'Illuminated Exit Box Signage',
        'Central Battery Inverter Units (CBU)',
        'Automatic Test Systems (DALI Emergency)',
        'Photoluminescent Wayfinding Strips',
      ],
    },
    {
      title: 'Passive Fire & Suppression',
      subtitle: 'Containment & Extinguishing',
      iconName: 'maintenanceTools' as const,
      assets: [
        'Motorized & Fusible Link Fire Dampers',
        'Dry & Wet Fire Riser Inlets and Landing Valves',
        'Gaseous Fire Suppression (Novec / FM200)',
        'Automatic Opening Vents (AOV Smoke Shafts)',
        'Fire Extinguishers & Fire Blankets',
      ],
    },
  ];

  const deliverySteps = [
    {
      number: '01',
      title: 'Comprehensive Estate Life-Safety Audit',
      description: 'Full physical asset count of all alarm loops, sensors, emergency luminaires, dampers, risers, and extinguishers.',
    },
    {
      number: '02',
      title: 'Statutory Inspection Matrix Build',
      description: 'Configuration of weekly bell tests, monthly emergency flicker checks, quarterly alarm services, and annual 3-hr discharge audits in EntireCAFM.',
    },
    {
      number: '03',
      title: 'Certified Engineering Execution',
      description: 'Directly employed, BAFE-aligned technicians execute precision testing with calibrated diagnostic gear and photographic evidence.',
    },
    {
      number: '04',
      title: 'Digital Golden Thread Archive',
      description: 'All certificates, lux readings, and remedial actions are timestamped and published instantly to your online compliance register.',
    },
  ];

  const faqs = content.faqs && content.faqs.length > 0 ? content.faqs : [
    {
      question: 'What are the legal obligations under the Regulatory Reform (Fire Safety) Order 2005?',
      answer: 'The Designated Responsible Person is legally required to ensure fire safety equipment (alarms, emergency lighting, fire doors, dampers, and extinguishers) is maintained in efficient working order and good repair by a competent person, with contemporaneous records kept for inspection by the Fire & Rescue Service.',
    },
    {
      question: 'How often does commercial emergency lighting require full 3-hour discharge testing?',
      answer: 'In accordance with BS 5266-1, emergency lighting requires a monthly functional test (simulating mains power failure for a short period) and a full 3-hour continuous discharge audit once every 12 months to verify battery capacity along all designated escape routes.',
    },
    {
      question: 'How do you support Building Safety Act 2022 Golden Thread requirements?',
      answer: 'All fire safety assets, test dates, engineer signatures, and remediation actions are digitized in EntireCAFM, providing a continuous, tamper-evident Golden Thread compliance record accessible to building safety regulators and insurers.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-void text-brand-mist selection:bg-brand-pink/20 selection:text-brand-pink">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO SECTION */}
        <ServiceHero
          eyebrow="LIFE SAFETY & STATUTORY PROTECTION"
          title="Fire Alarm, Emergency Lighting &"
          highlightedTitle="Life Safety Systems"
          intro="Zero-tolerance life safety engineering, addressable fire alarm maintenance, 3-hour emergency lighting discharge testing, and digital compliance registers aligned with the Building Safety Act."
          imageSrc={serviceMedia.hero}
          imageAlt={serviceMedia.heroAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Request Life Safety Audit', href: '#enquiry' }}
          secondaryCta={{ label: 'Speak with Fire Specialist', href: '#contact-routes' }}
          serviceFacts={[
            { label: 'Alarm Code', value: 'BS 5839-1 Aligned' },
            { label: 'Lighting Code', value: 'BS 5266-1 Compliant' },
            { label: 'Compliance Register', value: 'Digital Golden Thread' },
          ]}
        />

        {/* 2. TRUST ACCREDITATIONS BAR */}
        <TrustBar />

        {/* 3. FOUR-PILLAR SCOPE STRIP */}
        <ServiceScopeStrip pillars={scopePillars} />

        {/* 4. EDITORIAL INTRO */}
        <ServiceEditorialIntro
          eyebrow="ZERO-TOLERANCE STATUTORY GOVERNANCE"
          heading="Uncompromising Life-Safety Engineering Protecting Occupants, Assets & Duty Holders"
          subheading="Fire detection and emergency lighting represent statutory non-negotiables. Under the Regulatory Reform (Fire Safety) Order and the Building Safety Act 2022, building owners and managing agents bear strict personal liability for compliant life-safety systems."
          paragraphs={[
            'EntireFM provides complete life-safety lifecycle care. From weekly bell tests and quarterly addressable loop inspections to annual 3-hour battery discharge audits, fire damper drop tests, and dry riser hydrostatic pressure certification.',
            'Every test is logged electronically in EntireCAFM, ensuring your statutory compliance dossier is always inspection-ready.',
          ]}
          bullets={[
            '100% certified statutory testing timestamped with qualified engineer sign-off',
            'Full 3-hour duration emergency lighting discharge testing to BS 5266-1',
            '24/7 emergency dispatch for panel faults, sensor isolations, and resets',
            'Digital Golden Thread compliance register archived directly in CAFM',
          ]}
          imageSrc="/images/editorial/entirefm-switchroom-survey-2000w.webp"
          imageAlt="EntireFM fire alarm and emergency systems inspection"
          imageCaption="Addressable Fire Alarm & Life Safety Panel Testing"
          sideBadge={{ figure: 'BS 5839 & 5266', label: 'Safety Standards' }}
        />

        {/* 5. VISUAL CAPABILITY EXPERIENCE */}
        <VisualCapabilityExperience
          eyebrow="CORE LIFE-SAFETY DISCIPLINES"
          title="Comprehensive Fire & Emergency Systems Maintenance"
          subtitle="Strict adherence to British Standards (BS 5839, BS 5266, BS 9999, BS 9990) delivering robust protection and audit certainty."
          capabilities={capabilities}
        />

        {/* 6. SIGNATURE TECHNICAL DIAGRAM: THE FIRE SAFETY & LIFE SAFETY MATRIX */}
        <FireSafetyMatrix />

        {/* 7. SUPPORTED ASSETS TAXONOMY */}
        <SupportedAssetsGrid
          eyebrow="MAINTAINED ASSET TAXONOMY"
          title="Fire & Life Safety Equipment Covered"
          subtitle="Our specialist engineers inspect, test, and maintain the complete active and passive fire protection infrastructure across your commercial estate."
          categories={assetCategories}
        />

        {/* 8. DELIVERY PROCESS */}
        <ServiceDeliveryProcess
          eyebrow="STATUTORY METHODOLOGY"
          title="Our Fire Compliance Lifecycle"
          subtitle="From baseline asset register compilation to automated recurring testing rotas and real-time digital certificate archiving."
        />

        {/* 9. PLANNED VS REACTIVE MAINTENANCE SPLIT */}
        <PlannedVsReactiveSplit
          eyebrow="COMPLIANCE STRATEGY"
          title="Systematic Scheduled Testing Prevents Catastrophic System Failures"
          subtitle="Proactive quarterly loop impedance testing and battery replacement ensures 100% luminaire and detector availability."
          plannedItems={[
            'Weekly fire alarm bell testing & call point rotation log',
            'Monthly emergency lighting functional flicker tests',
            'Quarterly 25% addressable detector and sounder loop servicing',
            'Annual full 3-hour emergency lighting discharge test with lux readings',
            'Annual fire damper physical drop test and microswitch verification',
            'Annual dry riser hydrostatic 12-bar pressure certification',
          ]}
          reactiveItems={[
            '24/7 emergency engineer dispatch for fire alarm panel fault beeps',
            'Rapid resolution of earth faults and open-circuit loop breaks',
            'Post-incident investigation, head replacement, and panel reset',
            'Emergency luminaire replacement following failed discharge tests',
          ]}
        />

        {/* 10. RELEVANT SECTORS GRID */}
        <ServiceSectorsGrid
          eyebrow="SECTOR COVERAGE"
          title="Estates & Environments We Protect"
          subtitle="Delivering fire and life-safety compliance tailored to high-occupancy corporate offices, retail complexes, residential high-rises, and industrial plants."
        />

        {/* 11. ENTIRECAFM DIGITAL PORTAL SHOWCASE */}
        <TechnologyCafmSection
          eyebrow="DIGITAL COMPLIANCE DOSSIER"
          title="Instant Fire Logbooks & Audit Records in EntireCAFM"
          subtitle="Never search for a misplaced paper logbook. All test results, certificates, and remedial job sheets are accessible 24/7 in your client portal."
        />

        {/* 12. FAQ ACCORDION */}
        <section className="py-16 sm:py-24 bg-brand-graphite border-t border-brand-edge-dark">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="mb-10 text-center">
                <span className="text-[10.5px] font-mono uppercase tracking-widest text-hero-pink block mb-2">
                  STATUTORY CLARITY
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-white">
                  Fire & Life Safety Guidance
                </h2>
              </div>
              <FAQAccordion faqs={faqs} />
            </div>
          </div>
        </section>

        {/* 13. RELATED INTERNAL LINKS */}
        <RelatedLinks
          title="Related Engineering & Compliance Services"
          links={[
            { title: 'Mechanical & Electrical (M&E)', path: '/mechanical-electrical', description: 'Hard FM engineering and building maintenance' },
            { title: 'Statutory Compliance Centre', path: '/compliance', description: 'Full overview of UK statutory compliance mandates' },
            { title: 'Commercial Plumbing & Gas', path: '/plumbing-gas', description: 'Gas Safe CP12 and boiler heating plant servicing' },
            { title: 'Working at Height & BMU', path: '/working-at-height-rope-access-bmu', description: 'Façade access, fall arrest, and height safety' },
          ]}
        />

        {/* 14. COMMERCIAL PROPOSAL & SURVEY CTA */}
        <ServiceConversionSection
          serviceName="Fire & Life Safety Systems"
          headline="Discuss Your Fire Safety Compliance"
          subheadline="Consult directly with our certified fire safety directors. We provide comprehensive gap analyses, BS 5839/5266 testing schedules, and transparent pricing."
          ctaButtonText="Submit Fire Safety Enquiry"
          directDeskNote="Direct line to fire safety compliance directors and 24/7 emergency dispatch."
        />
      </main>

      <Footer />
    </div>
  );
}
