'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceScopeStrip } from '@/components/services/ServiceScopeStrip';
import { ServiceEditorialIntro } from '@/components/services/ServiceEditorialIntro';
import { VisualCapabilityExperience } from '@/components/services/VisualCapabilityExperience';
import { PlantToComfortJourney } from '@/components/services/PlantToComfortJourney';
import { SupportedAssetsGrid } from '@/components/services/SupportedAssetsGrid';
import { ServiceDeliveryProcess } from '@/components/services/ServiceDeliveryProcess';
import { PlannedVsReactiveSplit } from '@/components/services/PlannedVsReactiveSplit';
import { ServiceSectorsGrid } from '@/components/services/ServiceSectorsGrid';
import { TechnologyCafmSection } from '@/components/services/TechnologyCafmSection';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import type { TemplateProps } from '../types';

export function ServiceHvac({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'HVAC Contractor', url: '/hvac-contractor' },
  ];

  const scopePillars = [
    {
      label: 'COOLING & AC',
      sublabel: 'VRV/VRF & Chillers',
      iconName: 'maintenanceTools' as const,
    },
    {
      label: 'VENTILATION',
      sublabel: 'AHUs, Ductwork & LEV',
      iconName: 'complianceAudit' as const,
    },
    {
      label: 'HEATING PLANT',
      sublabel: 'Commercial Boilers & Pumps',
      iconName: 'powerElectrical' as const,
    },
    {
      label: 'F-GAS LOGS',
      sublabel: 'Statutory Refrigerant Care',
      iconName: 'dataInsights' as const,
    },
  ];

  const capabilities = [
    {
      name: 'VRV / VRF Air Conditioning Servicing',
      description: 'Comprehensive diagnostics, refrigerant leak testing, filter cleaning, condensate drainage clearing, and coil sanitisation for commercial multi-split systems.',
      tag: 'Air Conditioning',
      imageSrc: '/images/editorial/entirefm-hvac-cassette-service-2000w.webp',
      imageAlt: 'EntireFM engineer servicing ceiling cassette air conditioning',
      keyPoints: [
        'Quarterly filter sanitisation and coil chemical washing',
        'Electronic refrigerant leak detection and pressure testing',
        'Condensate pump, tray, and sensor decaling',
        'Inverter PCB diagnostics and communication testing',
      ],
      isFeatured: true,
      href: '/hvac-contractor',
    },
    {
      name: 'Air Handling Units (AHUs) & Ductwork',
      description: 'Filter replacements, drive belt tensioning, motor bearing lubrication, coil sanitisation, and static pressure balancing for central air handling systems.',
      tag: 'Ventilation',
      imageSrc: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
      imageAlt: 'EntireFM engineer conducting thermal survey on AHU ductwork',
      keyPoints: [
        'G4 pre-filter and F7/HEPA final filter replacements',
        'Drive belt tensioning and laser pulley alignment',
        'Fresh air and recirculation damper actuator checks',
      ],
      href: '/hard-services',
    },
    {
      name: 'Commercial Chillers & Cooling Plant',
      description: 'Preventative servicing for air-cooled and water-cooled chillers, compressor overhauls, glycol fluid analysis, and condenser fin cleaning.',
      tag: 'Chillers',
      imageSrc: '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
      imageAlt: 'EntireFM engineers inspecting rooftop chiller plant deck',
      keyPoints: [
        'Compressor oil analysis and vibration monitoring',
        'Evaporator and condenser tube descaling',
        'Glycol concentration and corrosion inhibitor testing',
      ],
    },
    {
      name: 'Commercial Boilers & Heating Plant',
      description: 'Servicing of commercial condensing boilers, burner combustion tuning, expansion vessel re-pressurisation, and circulation pump overhauls.',
      tag: 'Heating',
      imageSrc: '/images/editorial/entirefm-hvac-plantroom-pumps-2000w.webp',
      imageAlt: 'EntireFM engineers servicing heating pumps and pipework',
      keyPoints: [
        'Flue gas combustion analysis and burner calibration',
        'Commercial gas safety CP12 certification',
        'Pressurisation unit and expansion vessel checks',
      ],
      href: '/plumbing-gas',
    },
    {
      name: 'Refrigerant F-Gas Statutory Logging',
      description: 'Rigorous tracking of fluorinated greenhouse gases, electronic leak testing, and digital logbook maintenance satisfying UK F-Gas regulations.',
      tag: 'Compliance',
      imageSrc: '/images/editorial/entirefm-hvac-refrigerant-check-2000w.webp',
      imageAlt: 'EntireFM engineers testing HVAC refrigerant circuits',
      keyPoints: [
        'Certified F-Gas Category 1 engineers',
        'Mandatory periodic leak test scheduling by CO2 equivalent',
        'Complete digital refrigerant audit trail archived in CAFM',
      ],
    },
    {
      name: 'TM44 Air Conditioning Energy Assessments',
      description: 'Statutory energy inspections for air conditioning systems with rated output above 12kW, identifying efficiency improvements and compliance certs.',
      tag: 'Energy Auditing',
      imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
      imageAlt: 'EntireFM engineer reviewing HVAC energy telemetry with client',
      keyPoints: [
        'Legally required TM44 energy certification for UK premises',
        'Plant sizing vs heat load adequacy analysis',
        'Actionable recommendations to reduce energy bills',
      ],
    },
  ];

  const assetCategories = [
    {
      title: 'Cooling & Refrigeration Plant',
      subtitle: 'Chillers & Direct Expansion',
      iconName: 'maintenanceTools' as const,
      assets: [
        'Air-Cooled & Water-Cooled Chillers',
        'VRV & VRF Multi-Split Systems',
        'Server Room Close Control Units (CRAC)',
        'Rooftop Condenser Units & Coils',
        'Refrigerant Leak Detection Sensors',
      ],
    },
    {
      title: 'Air Handling & Ventilation',
      subtitle: 'Central Air & Duct Systems',
      iconName: 'complianceAudit' as const,
      assets: [
        'Air Handling Units (AHUs) & Filters',
        'Heat Recovery Units (HRV / MVHR)',
        'Local Exhaust Ventilation (LEV)',
        'Supply & Extract Axial/Centrifugal Fans',
        'Fire Damper & Smoke Extraction Vents',
      ],
    },
    {
      title: 'Heating & Water Services',
      subtitle: 'Commercial Plantrooms',
      iconName: 'powerElectrical' as const,
      assets: [
        'Commercial Gas Condensing Boilers',
        'Pressurisation Booster Pump Sets',
        'Circulation Pumps & Variable Speed Drives',
        'Hot Water Calorifiers & Plate Heat Exchangers',
        'BMS Environmental Actuator Valves',
      ],
    },
  ];

  const relatedLinks = (content.relatedRoutes || ['/mechanical-electrical', '/ppm', '/plumbing-gas', '/safety-critical-emergency-systems']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: 'Related Engineering Scope',
    description: `Explore EntireFM capabilities for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
  }));

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: 'What is refrigerant compliance and does my commercial building require it?',
          answer: 'Under UK regulations, commercial refrigeration or air conditioning equipment containing fluorinated greenhouse gases (F-Gases) above statutory thresholds requires regular leak checks and certified logbooks. We manage and archive this entirely.',
        },
        {
          question: 'How frequently should commercial air handling units (AHUs) be serviced?',
          answer: 'We recommend quarterly inspections for commercial AHUs to change filters, inspect drive belts, sanitize coils, and verify airflow volumes to ensure healthy indoor air quality.',
        },
        {
          question: 'Do you provide emergency breakdown support for critical server room cooling?',
          answer: 'Yes. Our central helpdesk provides rapid triage and engineer dispatch for mission-critical cooling failures across server rooms, data centres, and trading floors.',
        },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* 1. CINEMATIC HERO */}
        <ServiceHero
          eyebrow="CLIMATE & ENVIRONMENTAL ENGINEERING"
          title="Commercial HVAC Contractor"
          highlightedTitle="— Heating, Ventilation & AC"
          intro="Certified commercial climate engineering. We install, maintain, and certify commercial heating, chillers, air handling units, and VRV/VRF air conditioning systems for optimal air quality and statutory F-Gas compliance."
          imageSrc="/images/editorial/entirefm-hvac-rooftop-condensers-2560w.webp"
          imageAlt="EntireFM engineers inspecting commercial rooftop HVAC condensers at dusk"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Arrange an HVAC Review', href: '#enquiry' }}
          serviceFacts={[
            { label: 'Full refrigerant log management', value: 'F-Gas Intervals' },
            { label: 'Quarterly filter & coil sanitisation', value: 'Indoor Air Quality' },
            { label: 'Critical cooling plant support', value: 'Priority Triage' },
          ]}
        />

        {/* 2. SCOPE STRIP */}
        <ServiceScopeStrip pillars={scopePillars} />

        {/* 3. EDITORIAL INTRO */}
        <ServiceEditorialIntro
          eyebrow="INDOOR CLIMATE EXPERTISE"
          heading="Specialist Climate Engineering for Commercial Estates"
          subheading="Maintaining precise temperature control, high indoor air quality, and certified energy efficiency."
          paragraphs={[
            'Maintaining optimal indoor environmental quality, temperature stability, and energy efficiency requires specialist HVAC expertise. EntireFM provides planned preventative maintenance and reactive engineering for offices, retail centres, healthcare facilities, and industrial manufacturing plants.',
            'Our mobile engineers handle complete air conditioning, ventilation, and boiler room infrastructure — from routine quarterly filter changes and coil cleaning to complex chiller compressor overhauls and BMS control integration.',
          ]}
          bullets={[
            'Engineers equipped with electronic refrigerant recovery and leak detection equipment',
            'Planned filter and belt maintenance schedules preventing premature compressor and motor burnouts',
            'Integration with building management systems (BMS) for automated fault alerting and temperature profiling',
            'Emergency breakdown response for server room cooling and critical plant rooms',
          ]}
          imageSrc="/images/editorial/entirefm-hvac-plant-deck-2000w.webp"
          imageAlt="EntireFM engineers walking rooftop plant deck between air handling units"
          imageCaption="Air Handling Unit Maintenance & Rooftop Plant Diagnostics"
          sideBadge={{ figure: 'F-Gas & TM44', label: 'Compliance Standard' }}
        />

        {/* 4. VISUAL CAPABILITY EXPERIENCE */}
        <VisualCapabilityExperience
          eyebrow="CLIMATE CAPABILITIES"
          title="Engineered Heating, Cooling & Air Quality Solutions"
          subtitle="Comprehensive care for building climate systems to guarantee occupant comfort and statutory compliance."
          capabilities={capabilities}
        />

        {/* 5. UNIQUE FEATURE: FROM PLANT TO OCCUPANT COMFORT */}
        <PlantToComfortJourney />

        {/* 6. SUPPORTED ASSETS */}
        <SupportedAssetsGrid
          eyebrow="EQUIPMENT REGISTER"
          title="HVAC Plant & Climate Assets We Maintain"
          subtitle="Expert preventative servicing for all major commercial heating, cooling, and air handling equipment."
          categories={assetCategories}
        />

        {/* 7. DELIVERY PROCESS */}
        <ServiceDeliveryProcess
          eyebrow="OPERATIONAL FRAMEWORK"
          title="How Our HVAC Contract Delivery Works"
          subtitle="A structured 5-step process from initial asset register verification to quarterly F-Gas compliance logging."
        />

        {/* 8. PLANNED VS REACTIVE */}
        <PlannedVsReactiveSplit
          eyebrow="DELIVERY BALANCE"
          title="Preventative HVAC Care vs Emergency Repair"
          subtitle="Preventing costly compressor and fan burnouts through regular servicing while maintaining rapid breakdown cover."
        />

        {/* 9. SECTORS */}
        <ServiceSectorsGrid
          eyebrow="SECTOR APPLICATION"
          title="Where HVAC Performance Matters"
          subtitle="Delivering reliable climate control for corporate offices, distribution centres, retail malls, and clean manufacturing."
        />

        {/* 10. TECHNOLOGY & CAFM */}
        <TechnologyCafmSection
          eyebrow="CAFM & TELEMETRY"
          title="Digital F-Gas Tracking & HVAC Maintenance Records"
          subtitle="All leak test certificates, TM44 reports, and filter replacement timestamps are stored securely in our CAFM system."
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
                  HVAC & CLIMATE FAQS
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
                CONNECTED SERVICES
              </span>
              <h2 className="text-2xl font-bold text-brand-graphite">
                Explore Connected Engineering Capabilities
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>

        {/* 14. CONVERSION CLOSE */}
        <ServiceConversionSection
          serviceName="Commercial HVAC & Climate Control"
          headline="Arrange an HVAC Site Review & Contract Proposal"
          subheadline="Consult with our commercial HVAC engineering specialists. We provide asset condition surveys, F-Gas compliance reviews, and customized maintenance schedules."
          ctaButtonText="Submit HVAC Enquiry"
          directDeskNote="Direct line to HVAC project managers and technical dispatch."
        />
      </main>

      <Footer />
    </div>
  );
}
