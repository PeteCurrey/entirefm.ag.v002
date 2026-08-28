'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceScopeStrip } from '@/components/services/ServiceScopeStrip';
import { ServiceEditorialIntro } from '@/components/services/ServiceEditorialIntro';
import { VisualCapabilityExperience } from '@/components/services/VisualCapabilityExperience';
import { SecurityAccessInfrastructure } from '@/components/services/SecurityAccessInfrastructure';
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

export function ServiceSecurityAccess({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: content.h1, url: route.path },
  ];

  const serviceMedia = getServiceMedia(route.path);

  const scopePillars = [
    {
      label: 'PERIMETER GATES',
      sublabel: 'ANPR & Automated Barriers',
      iconName: 'securityCctv' as const,
    },
    {
      label: 'SPEEDLANES',
      sublabel: 'Biometrics & Turnstiles',
      iconName: 'maintenanceTools' as const,
    },
    {
      label: 'CCTV & PATROLS',
      sublabel: '24/7 SIA Keyholding',
      iconName: 'twentyFourSevenOps' as const,
    },
    {
      label: 'ENTIRECAFM',
      sublabel: 'Digital Access & Visitor Logs',
      iconName: 'dataInsights' as const,
    },
  ];

  const capabilities = [
    {
      name: 'Access Control & Biometric Speedlanes',
      description: 'Design, installation, commissioning, and maintenance of optical turnstiles, encrypted contactless card readers, QR visitor kiosks, and facial biometric terminals.',
      tag: 'Access Control',
      imageSrc: '/images/editorial/entirefm-reception-2000w.webp',
      imageAlt: 'Corporate Grade-A office reception with access control speedlanes and turnstiles',
      keyPoints: [
        'High-throughput optical glass speedlanes and barrier turnstiles',
        'Encrypted MIFARE DESFire EV3 contactless smartcard interfaces',
        'Touchless biometric facial recognition and QR visitor scanning',
        'BMS and fire alarm egress release interlock integration',
      ],
      isFeatured: true,
      href: '/access-control',
    },
    {
      name: 'Automated Security Gates, Rising Barriers & ANPR',
      description: 'Heavy-duty hydraulic and electromechanical vehicle barrier gates, sliding perimeter security gates, and automatic number plate recognition systems.',
      tag: 'Perimeter Gates & Barriers',
      imageSrc: '/images/editorial/entirefm-site-arrival-2000w.webp',
      imageAlt: 'EntireFM automated vehicle barrier and commercial security gates',
      keyPoints: [
        'Commercial rising arm barriers with high-intensity LED boom lights',
        'Cantilever automated sliding and swing gates to BS EN 12453',
        'Dual-lane ANPR camera integration with automated whitelist access',
        'Force testing and safety edge sensor verification audits',
      ],
      href: '/gates-barriers',
    },
    {
      name: 'Commercial IP CCTV & Remote AI Video Surveillance',
      description: 'High-definition 4K optical and thermal IP camera networks featuring deep-learning perimeter intrusion detection, night-vision infrared, and remote monitoring.',
      tag: 'CCTV & Analytics',
      imageSrc: '/images/locations/manchester/facilities-management-manchester-reception-front-of-house-1600w.webp',
      imageAlt: 'Corporate CCTV monitoring and security concierge in commercial building',
      keyPoints: [
        'Ultra-low-light 4K IP dome and bullet camera installations',
        'Perimeter line-crossing, loitering, and object classification AI',
        '24/7 Alarm Receiving Centre (ARC) remote video monitoring',
        'GDPR and BS EN 62676 compliant encrypted cloud and NVR storage',
      ],
      href: '/security-services',
    },
    {
      name: 'SIA Keyholding, Concierge & Mobile Patrol Response',
      description: 'SIA-licensed security officers, front-of-house corporate concierge, dedicated premises caretaking, and rapid mobile alarm response patrol vehicles.',
      tag: 'SIA Physical Security',
      imageSrc: '/images/editorial/entirefm-entirefm-premises-vans-2000w.webp',
      imageAlt: 'EntireFM security response vehicle fleet positioned for rapid response',
      keyPoints: [
        'Dedicated 24/7 keyholding and rapid emergency alarm response',
        'SIA-licensed corporate concierge and reception management',
        'On-site premises caretakers overseeing daily estate operations',
        'GPS-tracked mobile security patrols and electronic barcode tag checks',
      ],
      href: '/security-services',
    },
  ];

  const assetCategories = [
    {
      title: 'Pedestrian & Vehicle Access Hardware',
      subtitle: 'Physical Barriers & Gates',
      iconName: 'securityCctv' as const,
      assets: [
        'Optical Turnstiles & Glass Speedlanes',
        'Heavy-Duty Rising Arm Vehicle Barriers',
        'Automated Cantilever Sliding Gates',
        'Magnetic Locks (Maglocks) & Electric Strikes',
        'Underground Safety Loop Transducers',
      ],
    },
    {
      title: 'Electronic Detection & Surveillance',
      subtitle: 'Cameras & Alarm Systems',
      iconName: 'complianceAudit' as const,
      assets: [
        '4K IP Dome & Bullet CCTV Cameras',
        'High-Accuracy Dual-Lane ANPR Cameras',
        'Grade 3 Commercial Intruder Alarm Panels',
        'Dual-Tech PIR & Microwave Motion Detectors',
        'Dual-Path 4G/IP Monitored Signaling Transmitters',
      ],
    },
    {
      title: 'Digital Management & Verification',
      subtitle: 'CAFM Governance & Logs',
      iconName: 'dataInsights' as const,
      assets: [
        'Touchless QR Visitor Management Kiosks',
        'DESFire EV3 Keycards & Fobs',
        'Biometric Facial Recognition Readers',
        'Gate Force Safety Certification Meters',
        'Live Evacuation Roll-Call Cloud App',
      ],
    },
  ];

  const deliverySteps = [
    {
      number: '01',
      title: 'Physical Security & Gate Safety Audit',
      description: 'Comprehensive risk assessment of all entry points, gate impact forces to BS EN 12453, CCTV coverage angles, and intruder alarm grade alignment.',
    },
    {
      number: '02',
      title: 'Custom Protocol & CAFM Integration',
      description: 'Configuring access levels, ANPR whitelists, visitor badge workflows, and 24/7 ARC alarm escalation matrix inside EntireCAFM.',
    },
    {
      number: '03',
      title: 'Certified Maintenance & Patrol Delivery',
      description: 'Directly employed security engineers and SIA-licensed officers execute bi-annual gate servicing, CCTV lens alignments, and scheduled patrols.',
    },
    {
      number: '04',
      title: 'Digital Audit Archival & Compliance',
      description: 'Every force test certificate, alarm log, and patrol scan is timestamped and archived digitally for insurers and duty-holder audit proof.',
    },
  ];

  const faqs = content.faqs && content.faqs.length > 0 ? content.faqs : [
    {
      question: 'What are the statutory safety requirements for automated electric gates and barriers?',
      answer: 'Under the Machinery Directive and BS EN 12453, all powered gates and barriers must undergo semi-annual safety audits including calibrated impact force testing, photo-beam and safety edge verification, and maintenance logbook recording to prevent crushing injuries.',
    },
    {
      question: 'Are EntireFM security personnel and keyholding operatives SIA licensed?',
      answer: 'Yes. All EntireFM security officers, concierge staff, and mobile keyholding response operatives are directly employed, background vetted, and hold active Security Industry Authority (SIA) licences.',
    },
    {
      question: 'Can your access control systems integrate with fire alarm evacuation systems?',
      answer: 'Yes. All EntireFM access control installations include fail-safe integration with the estate fire alarm control panel, automatically releasing magnetic locks and dropping speedlane barriers upon alarm activation to ensure unobstructed evacuation.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-void text-brand-mist selection:bg-brand-pink/20 selection:text-brand-pink">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO SECTION */}
        <ServiceHero
          eyebrow="COMMERCIAL ESTATE PROTECTION"
          title="Security Services, Access Control &"
          highlightedTitle="Automated Gates"
          intro="Comprehensive commercial estate protection—from vehicle ANPR barriers and reception speedlanes to 4K IP CCTV surveillance, automated gate safety, and 24/7 SIA keyholding response across the UK."
          imageSrc={serviceMedia.hero}
          imageAlt={serviceMedia.heroAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Request Security Review', href: '#enquiry' }}
          secondaryCta={{ label: 'Speak with Specialist', href: '#contact-routes' }}
          serviceFacts={[
            { label: 'Gate Safety', value: 'BS EN 12453 Aligned' },
            { label: 'Personnel', value: 'SIA Licensed & Vetted' },
            { label: 'Response Protocol', value: '24/7 Keyholding Desk' },
          ]}
        />

        {/* 2. TRUST ACCREDITATIONS BAR */}
        <TrustBar />

        {/* 3. FOUR-PILLAR SCOPE STRIP */}
        <ServiceScopeStrip pillars={scopePillars} />

        {/* 4. EDITORIAL INTRO */}
        <ServiceEditorialIntro
          eyebrow="INTEGRATED PHYSICAL & ELECTRONIC SECURITY"
          heading="Uncompromising Estate Protection, Seamless Tenant Access & Absolute Safety Compliance"
          subheading="Modern commercial property demands security that is simultaneously robust and frictionless. EntireFM provides end-to-end security engineering that safeguards your assets, verifies visitor compliance, and ensures full statutory alignment with gate safety standards and SIA regulations."
          paragraphs={[
            'Our integrated model bridges physical barrier engineering, electronic access control, high-definition video analytics, and front-of-house concierge management.',
            'Every maintenance visit, force test result, and alarm attendance is recorded digitally in EntireCAFM, giving property managers real-time visibility over estate security status.',
          ]}
          bullets={[
            'Calibrated gate impact force testing to BS EN 12453 preventing entrapment',
            '100% directly employed, background-vetted, SIA-licensed security personnel',
            '24/7 national operations desk coordinating mobile keyholding response fleet',
            'Digital access logs and gate force certificates accessible in EntireCAFM',
          ]}
          imageSrc="/images/locations/manchester/facilities-management-manchester-reception-front-of-house-1600w.webp"
          imageAlt="Corporate security concierge and access control speedlanes"
          imageCaption="Integrated Access Control & Physical Security Management"
          sideBadge={{ figure: 'BS EN 12453 & SIA', label: 'Security Standards' }}
        />

        {/* 5. VISUAL CAPABILITY EXPERIENCE */}
        <VisualCapabilityExperience
          eyebrow="CORE SECURITY DISCIPLINES"
          title="Integrated Access, Surveillance & Physical Security Services"
          subtitle="From automated vehicle perimeter control to Grade-A reception speedlanes and remote CCTV monitoring."
          capabilities={capabilities}
        />

        {/* 6. SIGNATURE TECHNICAL DIAGRAM: PERIMETER-TO-PORTAL SECURITY INFRASTRUCTURE */}
        <SecurityAccessInfrastructure />

        {/* 7. SUPPORTED ASSETS TAXONOMY */}
        <SupportedAssetsGrid
          eyebrow="SECURITY ASSET TAXONOMY"
          title="Maintained Security Hardware & Systems"
          subtitle="Our specialist engineers inspect, calibrate, and maintain the complete spectrum of commercial access control, barrier, and surveillance assets."
          categories={assetCategories}
        />

        {/* 8. DELIVERY PROCESS */}
        <ServiceDeliveryProcess
          eyebrow="OPERATIONAL LIFECYCLE"
          title="How We Mobilise & Govern Estate Security"
          subtitle="A disciplined methodology spanning physical risk audits, gate force testing, system integration, and continuous digital monitoring."
        />

        {/* 9. PLANNED VS REACTIVE MAINTENANCE SPLIT */}
        <PlannedVsReactiveSplit
          eyebrow="SECURITY PPM STRATEGY"
          title="Scheduled Servicing Prevents Costly Gate Failures & Security Breaches"
          subtitle="Bi-annual gate servicing and regular CCTV lens calibration ensures uninterrupted perimeter protection and zero gate entrapment risk."
          plannedItems={[
            'Bi-annual automated gate safety inspection & calibrated force testing',
            'Quarterly access control reader, maglock, and power supply unit (PSU) checks',
            '6-monthly IP CCTV camera focus, lens cleaning, and recording verification',
            'Annual intruder alarm Grade 3 sensor walk-test and signaling checks',
            'Regular visitor management kiosk software updates and badge audits',
          ]}
          reactiveItems={[
            '24/7 emergency mobile engineer dispatch for barrier or gate failure',
            'Immediate response to intruder alarm activations by SIA patrol officers',
            'Urgent repair of damaged access readers or broken maglock releases',
            'Emergency manual release override assistance during power outages',
          ]}
        />

        {/* 10. RELEVANT SECTORS GRID */}
        <ServiceSectorsGrid
          eyebrow="SECTORS SERVED"
          title="Commercial Environments We Protect"
          subtitle="Tailored access control, gate automation, and security solutions for Grade-A offices, logistics parks, retail centres, and industrial estates."
        />

        {/* 11. ENTIRECAFM DIGITAL PORTAL SHOWCASE */}
        <TechnologyCafmSection
          eyebrow="DIGITAL SECURITY GOVERNANCE"
          title="Real-Time Security Records & Logs in EntireCAFM"
          subtitle="Manage your entire estate security posture from one digital interface—from gate safety certificates to live visitor headcounts."
        />

        {/* 12. FAQ ACCORDION */}
        <section className="py-16 sm:py-24 bg-brand-graphite border-t border-brand-edge-dark">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="mb-10 text-center">
                <span className="text-[10.5px] font-mono uppercase tracking-widest text-brand-electric-bright block mb-2">
                  SECURITY ADVISORY
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-white">
                  Commercial Security & Access Guidance
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
            { title: 'Mechanical & Electrical (M&E)', path: '/mechanical-electrical', description: 'Hard FM building engineering and power distribution' },
            { title: 'Fire & Life Safety Systems', path: '/fire-emergency-systems', description: 'BS 5839 alarms and emergency lighting testing' },
            { title: 'Building Maintenance', path: '/building-maintenance', description: 'Commercial building fabric and structural care' },
            { title: '24/7 FM Support Helpdesk', path: '/24-7-fm-support', description: 'National emergency facilities management operations' },
          ]}
        />

        {/* 14. COMMERCIAL PROPOSAL & SURVEY CTA */}
        <ServiceConversionSection
          serviceName="Security, Access Control & Barrier Systems"
          headline="Discuss Your Commercial Security Requirements"
          subheadline="Consult directly with our technical security specialists. We provide comprehensive gate safety audits, access control design, and transparent PPM pricing."
          ctaButtonText="Submit Security Enquiry"
          directDeskNote="Direct line to technical security managers and 24/7 keyholding dispatch."
        />

      </main>

      <Footer />
    </div>
  );
}
