'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceScopeStrip } from '@/components/services/ServiceScopeStrip';
import { ServiceEditorialIntro } from '@/components/services/ServiceEditorialIntro';
import { VisualCapabilityExperience } from '@/components/services/VisualCapabilityExperience';
import { CommercialWaterLoop } from '@/components/services/CommercialWaterLoop';
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

export function ServicePlumbingGas({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Plumbing & Gas', url: '/plumbing-gas' },
  ];

  const serviceMedia = getServiceMedia(route.path);

  const scopePillars = [
    {
      label: 'BOILER PLANT',
      sublabel: 'Commercial Gas & CP12',
      iconName: 'powerElectrical' as const,
    },
    {
      label: 'PUMP SYSTEMS',
      sublabel: 'Booster Sets & Circulators',
      iconName: 'maintenanceTools' as const,
    },
    {
      label: 'L8 WATER HYGIENE',
      sublabel: 'Legionella & TMV Control',
      iconName: 'complianceAudit' as const,
    },
    {
      label: 'REACTIVE DESK',
      sublabel: '24/7 Leak & Burst Response',
      iconName: 'twentyFourSevenOps' as const,
    },
  ];

  const capabilities = [
    {
      name: 'Commercial Gas Boiler Servicing & CP12 Certification',
      description: 'Gas Safe registered engineers conducting combustion efficiency analysis, burner tuning, gas train solenoid testing, and statutory CP12 gas safety certification.',
      tag: 'Gas Safety CP12',
      imageSrc: '/images/editorial/entirefm-hvac-plantroom-pumps-2000w.webp',
      imageAlt: 'EntireFM Gas Safe engineers servicing commercial heating plant and boiler cascades',
      keyPoints: [
        'Annual statutory Gas Safety CP12 certification and digital archival',
        'Flue gas analysis, CO/CO2 ratio verification & burner tuning',
        'Automatic gas proving interlocks and emergency shut-off valves',
        'Commercial calorifier descaling and immersion heater maintenance',
      ],
      isFeatured: true,
      href: '/plumbing-gas',
    },
    {
      name: 'Multi-Stage Potable Water Booster Sets',
      description: 'Periodic maintenance of inverter-driven booster pumps, pressure vessel nitrogen pre-charge verification, non-return valves, and mechanical seal overhauls.',
      tag: 'Hydraulic Pressure',
      imageSrc: '/images/editorial/entirefm-plumbing-booster-set-2000w.webp',
      imageAlt: 'EntireFM commercial plumbing engineer servicing multi-stage booster pump set',
      keyPoints: [
        'Variable speed drive (VSD) inverter transducer calibration',
        'Membrane expansion vessel pressure testing and recharging',
        'Dry-run protection cut-off testing and duty-rotation verify',
      ],
      href: '/plumbing-gas',
    },
    {
      name: 'L8 Legionella Control & Statutory Water Sampling',
      description: 'Comprehensive ACoP L8 water risk management: monthly sentinel temperature profiling, quarterly showerhead descaling, tank inspections, and UKAS laboratory sampling.',
      tag: 'L8 Compliance',
      imageSrc: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
      imageAlt: 'EntireFM engineer recording digital water hygiene temperature telemetry',
      keyPoints: [
        'Monthly hot and cold sentinel tap temperature logging',
        'Cold Water Storage Tank (CWST) visual and sediment inspections',
        'UKAS accredited microbiological Legionella and TVC testing',
      ],
      href: '/compliance',
    },
    {
      name: 'RPZ Backflow Prevention & TMV Blending',
      description: 'Commissioning and annual testing of Type BA RPZ backflow preventers to protect municipal water mains, paired with Point-of-Use TMV fail-safe temperature testing.',
      tag: 'Water Safety',
      imageSrc: '/images/editorial/entirefm-plumbing-pressure-test-2000w.webp',
      imageAlt: 'EntireFM technician conducting hydrostatic pressure test on commercial pipework',
      keyPoints: [
        'Accredited RPZ valve annual calibration and WRAS sign-off',
        'TMV2 / TMV3 thermostatic mixing valve failsafe isolation tests',
        'Secondary hot water return temperature balancing (≥50°C)',
      ],
      href: '/compliance',
    },
  ];

  const assetCategories = [
    {
      title: 'Primary Heating & Gas Plant',
      subtitle: 'Thermal & Combustion Infrastructure',
      iconName: 'powerElectrical' as const,
      assets: [
        'Commercial Condensing Gas Boilers',
        'Domestic Hot Water (DHW) Calorifiers',
        'Plate Heat Exchangers (PHE)',
        'Gas Proving & Solenoid Shut-Off Valves',
        'Flue Systems & Dilution Fans',
      ],
    },
    {
      title: 'Water Pressure & Distribution',
      subtitle: 'Pumping & Hydraulic Networks',
      iconName: 'maintenanceTools' as const,
      assets: [
        'Cold Water Booster Pump Sets',
        'Pressurisation Expansion Units',
        'Secondary Hot Water Circulators',
        'Cold Water Storage Tanks (CWST)',
        'Submersible Sump Drainage Pumps',
      ],
    },
    {
      title: 'Statutory Safety & Blending',
      subtitle: 'Water Hygiene & Backflow Assets',
      iconName: 'complianceAudit' as const,
      assets: [
        'RPZ Backflow Preventer Valves',
        'Thermostatic Mixing Valves (TMVs)',
        'Chemical Dosing & Chlorination Units',
        'Trace Heating Cables & Thermostats',
        'Water Conditioning & Softener Plant',
      ],
    },
  ];

  const deliverySteps = [
    {
      number: '01',
      title: 'Baseline Asset & L8 Risk Audit',
      description: 'Comprehensive physical inventory of all boilers, pump sets, calorifiers, storage tanks, and sentinel outlets across your estate.',
    },
    {
      number: '02',
      title: 'SFG20 & Statutory Schedule Build',
      description: 'Automated scheduling of annual CP12 gas overhauls, quarterly pump services, and monthly L8 water hygiene inspections.',
    },
    {
      number: '03',
      title: 'Direct Gas Safe Engineer Delivery',
      description: 'Directly employed Gas Safe and WRAS-certified plumbing engineers execute scheduled servicing with calibrated diagnostic equipment.',
    },
    {
      number: '04',
      title: 'Digital EntireCAFM Certification',
      description: 'Immediate electronic generation of CP12 certificates, RPZ test sheets, and temperature logs accessible 24/7 in your client portal.',
    },
  ];

  const faqs = content.faqs && content.faqs.length > 0 ? content.faqs : [
    {
      question: 'What statutory qualifications do your commercial plumbing and gas engineers hold?',
      answer: 'All EntireFM gas engineers are directly employed and registered on the Gas Safe Register with commercial accreditations (including COCN1, CDGA1, CIGA1, and ICPN1). Our water hygiene technicians hold City & Guilds L8 and WRAS RPZ tester certifications.',
    },
    {
      question: 'How quickly can your engineers attend an emergency burst pipe or gas leak?',
      answer: 'Our national operations helpdesk operates 24/7/365. Contracted clients benefit from rapid emergency response SLAs (typically 2 to 4 hours) with dedicated mobile plumbing vans carrying isolation fittings and emergency extraction pumps.',
    },
    {
      question: 'How are water hygiene temperature logs and Gas Safety CP12 certificates stored?',
      answer: 'All certificates, combustion logs, and temperature readings are uploaded in real time to the EntireCAFM portal, providing building duty holders with timestamped, audit-ready compliance records.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-void text-brand-mist selection:bg-brand-pink/20 selection:text-brand-pink">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO SECTION */}
        <ServiceHero
          eyebrow="COMMERCIAL BUILDING ENGINEERING"
          title="Commercial Plumbing, Heating Plant &"
          highlightedTitle="Gas Services"
          intro="Proactive building engineering, Gas Safe CP12 compliance, booster pump maintenance, and rigorous L8 water hygiene management delivered across UK commercial, industrial, and multi-tenant estates."
          imageSrc={serviceMedia.hero}
          imageAlt={serviceMedia.heroAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Request a Plumbing Audit', href: '#enquiry' }}
          secondaryCta={{ label: 'Speak with an Engineer', href: '#contact-routes' }}
          serviceFacts={[
            { label: 'Gas Standard', value: 'Gas Safe Registered' },
            { label: 'Water Hygiene', value: 'ACoP L8 Aligned' },
            { label: 'Response SLA', value: '24/7 Emergency Desk' },
          ]}
        />

        {/* 2. TRUST ACCREDITATIONS BAR */}
        <TrustBar />

        {/* 3. FOUR-PILLAR SCOPE STRIP */}
        <ServiceScopeStrip pillars={scopePillars} />

        {/* 4. EDITORIAL INTRO */}
        <ServiceEditorialIntro
          eyebrow="CRITICAL WATER & HEATING INFRASTRUCTURE"
          heading="Uninterrupted Hydraulic Pressure, Safe Heating & Absolute Water Hygiene Compliance"
          subheading="Commercial plumbing and gas infrastructure represents both a critical operational dependency and a stringent statutory obligation. EntireFM delivers single-source mechanical care that preserves asset longevity and eliminates waterborne risk."
          paragraphs={[
            'Our directly employed engineering fleet manages the entire hydraulic lifecycle—from incoming mains and high-pressure booster sets to commercial boiler cascades, calorifiers, and point-of-use thermostatic mixing valves.',
            'Every inspection is logged contemporaneously in EntireCAFM, providing property managers and duty holders with clear, auditable compliance proof under HSE ACoP L8 and Gas Safety regulations.',
          ]}
          bullets={[
            '100% Gas Safe registered, directly employed commercial heating engineers',
            'Precise 60°C DHW thermal pasteurisation regimes suppressing Legionella bacteria',
            '24/7 central UK operations triage coordinating emergency mobile plumbing fleet',
            'Digital compliance certificates and temperature logs accessible 24/7 in CAFM',
          ]}
          imageSrc="/images/editorial/entirefm-hvac-plantroom-pumps-2000w.webp"
          imageAlt="EntireFM commercial plumbing and gas engineers in plant room"
          imageCaption="Commercial Boiler Cascades & Water Booster Set Servicing"
          sideBadge={{ figure: 'Gas Safe & L8', label: 'Technical Standards' }}
        />

        {/* 5. VISUAL CAPABILITY EXPERIENCE */}
        <VisualCapabilityExperience
          eyebrow="CORE ENGINEERING DISCIPLINES"
          title="Comprehensive Commercial Plumbing & Gas Services"
          subtitle="Structured preventative maintenance, emergency mechanical triage, and statutory certification delivered to SFG20 engineering standards."
          capabilities={capabilities}
        />

        {/* 6. SIGNATURE TECHNICAL DIAGRAM: THE COMMERCIAL WATER & HEATING LOOP */}
        <CommercialWaterLoop />

        {/* 7. SUPPORTED ASSETS INVENTORY */}
        <SupportedAssetsGrid
          eyebrow="MAINTAINED ASSET TAXONOMY"
          title="Mechanical Assets & Systems Covered"
          subtitle="From boiler rooms and cold water storage tanks to complex secondary circulation loops, our certified engineers maintain all critical plumbing plant."
          categories={assetCategories}
        />

        {/* 8. DELIVERY PROCESS */}
        <ServiceDeliveryProcess
          eyebrow="OPERATIONAL METHODOLOGY"
          title="How We Mobilise & Maintain Your Estate"
          subtitle="A disciplined, transparent delivery framework ensuring asset visibility, scheduled maintenance accuracy, and immediate emergency responsiveness."
        />

        {/* 9. PLANNED VS REACTIVE MAINTENANCE SPLIT */}
        <PlannedVsReactiveSplit
          eyebrow="PPM STRATEGY"
          title="Proactive SFG20 Care Eliminates Costly Emergency Breakdowns"
          subtitle="Preventative maintenance of circulation pumps, calorifiers, and expansion vessels reduces mechanical failure risk by up to 74%."
          plannedItems={[
            'Quarterly booster set mechanical seal & inverter inspection',
            'Annual Gas Safe CP12 commercial boiler servicing & combustion tune',
            'Monthly L8 sentinel tap temperature profiling & logbook sync',
            'Bi-annual TMV fail-safe testing & thermostatic recalibration',
            'Annual RPZ backflow preventer recalibration and WRAS sign-off',
          ]}
          reactiveItems={[
            '24/7 emergency dispatch for burst mains & catastrophic leaks',
            'Boiler lockout and heating failure rapid diagnostic triage',
            'Booster pump inverter fault resolution & standby pump cut-in',
            'Gas leak investigation & emergency solenoid isolation reset',
          ]}
        />

        {/* 10. RELEVANT SECTORS GRID */}
        <ServiceSectorsGrid
          eyebrow="SECTOR EXPERTISE"
          title="Commercial Sectors We Support"
          subtitle="Delivering tailored commercial plumbing and heating maintenance aligned to specific site access, hygiene, and trading requirements."
        />

        {/* 11. ENTIRECAFM DIGITAL PORTAL SHOWCASE */}
        <TechnologyCafmSection
          eyebrow="DIGITAL ASSET GOVERNANCE"
          title="Real-Time Water Hygiene & Gas Compliance in EntireCAFM"
          subtitle="Eliminate paper logbooks. Every temperature reading, CP12 certificate, and remedial action is timestamped and archived digitally."
        />

        {/* 12. FAQ ACCORDION */}
        <section className="py-16 sm:py-24 bg-brand-graphite border-t border-brand-edge-dark">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="mb-10 text-center">
                <span className="text-[10.5px] font-medium uppercase tracking-widest text-brand-electric-bright block mb-2">
                  FREQUENTLY ASKED QUESTIONS
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-white">
                  Commercial Plumbing & Gas Guidance
                </h2>
              </div>
              <FAQAccordion faqs={faqs} />
            </div>
          </div>
        </section>

        {/* 13. RELATED INTERNAL LINKS */}
        <RelatedLinks
          title="Related Building Engineering & FM Services"
          links={[
            { title: 'Mechanical & Electrical (M&E)', path: '/mechanical-electrical', description: 'Complete hard FM and building engineering services' },
            { title: 'Commercial HVAC & Air Conditioning', path: '/hvac-contractor', description: 'Chillers, AHUs, VRV/VRF cooling and ventilation care' },
            { title: 'Planned Preventative Maintenance (PPM)', path: '/ppm', description: 'SFG20 maintenance regimes protecting building assets' },
            { title: 'Statutory Compliance Centre', path: '/compliance', description: 'Comprehensive guidance on UK building compliance duties' },
          ]}
        />

        {/* 14. COMMERCIAL PROPOSAL & SURVEY CTA */}
        <ServiceConversionSection
          serviceName="Commercial Plumbing & Gas Engineering"
          headline="Discuss Your Plumbing & Gas Requirements"
          subheadline="Consult directly with our Gas Safe registered engineering directors. We provide comprehensive mechanical surveys, CP12 compliance audits, and transparent PPM pricing."
          ctaButtonText="Submit Plumbing Enquiry"
          directDeskNote="Direct line to Gas Safe technical managers and 24/7 emergency dispatch."
        />

      </main>

      <Footer />
    </div>
  );
}
