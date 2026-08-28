'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceScopeStrip } from '@/components/services/ServiceScopeStrip';
import { ServiceEditorialIntro } from '@/components/services/ServiceEditorialIntro';
import { VisualCapabilityExperience } from '@/components/services/VisualCapabilityExperience';
import { GroundsEstateVisualizer } from '@/components/services/GroundsEstateVisualizer';
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

export function ServiceGroundsMaintenance({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: content.h1, url: route.path },
  ];

  const serviceMedia = getServiceMedia(route.path);

  const scopePillars = [
    {
      label: 'HORTICULTURE',
      sublabel: 'Lawn Care & Shrub Curation',
      iconName: 'maintenanceTools' as const,
    },
    {
      label: 'TREE SURGERY',
      sublabel: 'BS 5837 Arboriculture',
      iconName: 'complianceAudit' as const,
    },
    {
      label: 'WINTER GRITTING',
      sublabel: 'Automated Met Office RST',
      iconName: 'nationwideCoverage' as const,
    },
    {
      label: 'BIODIVERSITY',
      sublabel: 'ESG & BREEAM Ecology',
      iconName: 'sustainableSolutions' as const,
    },
  ];

  const capabilities = [
    {
      name: 'Commercial Grounds Maintenance & Horticultural Care',
      description: 'Scheduled commercial ride-on mowing, lawn edge detailing, shrub pruning, herbaceous border cultivation, weed abatement, and seasonal flowerbed planting schemes.',
      tag: 'Commercial Grounds',
      imageSrc: '/images/editorial/entirefm-totem-headquarters-2000w.webp',
      imageAlt: 'EntireFM commercial business park grounds maintenance and landscaped estate',
      keyPoints: [
        'Commercial ride-on flail and rotary mowing for multi-acre corporate grounds',
        'Seasonal shrub pruning, deadheading, and bark mulch replenishment',
        'Certified PA1/PA6 herbicide application for weed eradication',
        'High-specification estate entrance and signage planting displays',
      ],
      isFeatured: true,
      href: '/grounds-maintenance',
    },
    {
      name: 'Tree Surgery & Certified Arboricultural Surveys',
      description: 'NPTC-certified tree surgeons conducting visual tree assessments (VTA), crown reduction, lifting, deadwood removal, and 24/7 storm damage emergency clearance.',
      tag: 'Tree Surgery',
      imageSrc: '/images/locations/sheffield/facilities-management-sheffield-rooftop-plant-checks-1600w.webp',
      imageAlt: 'EntireFM tree surgeon and grounds maintenance operative',
      keyPoints: [
        'BS 5837 arboricultural risk assessments and digital tree health registers',
        'Crown thinning, lifting, and deadwood extraction over pedestrian paths',
        'Sectional dismantling and precision felling in confined commercial spaces',
        '24/7 rapid response for storm-damaged and fallen tree clearance',
      ],
      href: '/grounds-maintenance',
    },
    {
      name: 'Automated Winter Gritting & Snow Clearance',
      description: 'Proactive winter risk mitigation utilizing automated Road Surface Temperature (RST) weather station feeds to salt estate roads, car parks, and footpaths before ice forms.',
      tag: 'Winter Maintenance',
      imageSrc: '/images/editorial/entirefm-entirefm-premises-vans-2000w.webp',
      imageAlt: 'EntireFM winter gritting fleet equipped with salt spreaders and snow ploughs',
      keyPoints: [
        'Automated Met Office RST telemetry triggering proactive evening gritting',
        'Marine-grade pure white salt preventing dirty internal floor residue',
        'Dedicated snow ploughing for HGV loading bays, yards, and roadways',
        'GPS-tracked spreading vehicles generating timestamped legal evidence logs',
      ],
      href: '/grounds-maintenance',
    },
    {
      name: 'Hard Landscaping, Interceptors & Drainage Maintenance',
      description: 'Petrol rotary pressure washing of block paving, commercial car park bay lining, bi-annual oil-water separator interceptor pumping, and stormwater gully vacuuming.',
      tag: 'Paving & Drainage',
      imageSrc: '/images/locations/derby/facilities-management-derby-cathedral-quarter-1600w.webp',
      imageAlt: 'EntireFM exterior commercial paving cleaning and high pressure surface washing',
      keyPoints: [
        'High-pressure rotary jet-washing for pedestrian walkways and courtyards',
        'Oil/water interceptor tank cleaning and Environment Agency duty of care notes',
        'Stormwater gully clearance and high-volume vacuum silt extraction',
        'Thermo-plastic car park bay lining and directional signage marking',
      ],
      href: '/grounds-maintenance',
    },
  ];

  const assetCategories = [
    {
      title: 'Horticultural Machinery & Plant',
      subtitle: 'Deployed Grounds Fleet',
      iconName: 'maintenanceTools' as const,
      assets: [
        'Commercial Zero-Turn Ride-On Mowers',
        'Heavy-Duty Flail & Rotary Cutters',
        'High-Reach Petrol Hedge Trimmers & Poles',
        'Wood Chippers & Arboricultural Winches',
        'Towable Winter Salt Spreaders & Snow Ploughs',
      ],
    },
    {
      title: 'Exterior Estate Infrastructure',
      subtitle: 'Maintained Boundaries & Realm',
      iconName: 'complianceAudit' as const,
      assets: [
        'Mature Trees & Woodland Belts',
        'Palisade & Mesh Perimeter Fencing',
        'Stormwater Gully Pots & Drainage Channels',
        'Oil/Water Separator Interceptor Tanks',
        'Block Paving, Flagstones & Tarmac Bays',
      ],
    },
    {
      title: 'Biodiversity & ESG Elements',
      subtitle: 'Environmental Enhancements',
      iconName: 'sustainableSolutions' as const,
      assets: [
        'Native Wildflower Pollinator Corridors',
        'Sedum Living Green Roof Systems',
        'Bird & Bat Habitat Nesting Boxes',
        'Sustainable Urban Drainage Systems (SuDS)',
        '100% Peat-Free Composts & Mulches',
      ],
    },
  ];

  const deliverySteps = [
    {
      number: '01',
      title: 'Estate Realm & Tree Survey',
      description: 'Comprehensive boundary mapping, tree hazard survey (BS 5837), and external asset tagging covering all external surfaces.',
    },
    {
      number: '02',
      title: 'Seasonal Schedule & Met Feed Setup',
      description: 'Establishing grass mowing frequencies, hedge trimming windows, and automated Road Surface Temperature (RST) winter gritting triggers in EntireCAFM.',
    },
    {
      number: '03',
      title: 'Direct Specialist Team Execution',
      description: 'Directly employed, uniformed horticulturalists and NPTC tree surgeons execute scheduled works with commercial-grade machinery.',
    },
    {
      number: '04',
      title: 'GPS Audit Logs & Weather Archive',
      description: 'Every gritting run, mowing visit, and tree certificate is logged digitally with timestamped GPS evidence for duty of care records.',
    },
  ];

  const faqs = content.faqs && content.faqs.length > 0 ? content.faqs : [
    {
      question: 'How do you determine when winter gritting is required on our site?',
      answer: 'We utilize automated Road Surface Temperature (RST) feeds directly from the Met Office. When forecast road surface temperatures drop to 0°C or below with anticipated frost or ice, our GPS-tracked gritting vehicles automatically deploy out-of-hours before morning staff and tenant arrival.',
    },
    {
      question: 'Are your tree surgeons qualified to carry out surveys and surgery?',
      answer: 'Yes. All EntireFM arborists are NPTC certified and perform tree hazard surveys to BS 5837 and surgery to BS 3998 standards, carrying full public liability and professional indemnity insurance.',
    },
    {
      question: 'Can EntireFM help improve our estate’s BREEAM / ESG biodiversity rating?',
      answer: 'Yes. We design and manage biodiversity enhancement plans including native wildflower meadow seeding, living roof maintenance, bird and bat box installations, and sustainable urban drainage maintenance to directly support your ESG targets.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-void text-brand-mist selection:bg-brand-pink/20 selection:text-brand-pink">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO SECTION */}
        <ServiceHero
          eyebrow="EXTERIOR REALM & GROUNDS GOVERNANCE"
          title="Commercial Grounds Maintenance,"
          highlightedTitle="Landscaping & Winter Care"
          intro="Year-round commercial grounds management, precision horticultural care, certified tree surgery, and automated winter gritting protecting estates, tenants, and duty holders nationwide."
          imageSrc={serviceMedia.hero}
          imageAlt={serviceMedia.heroAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Request Grounds Review', href: '#enquiry' }}
          secondaryCta={{ label: 'Speak with Specialist', href: '#contact-routes' }}
          serviceFacts={[
            { label: 'Grounds Standard', value: 'BALI & ISO 14001' },
            { label: 'Tree Safety', value: 'BS 5837 Arboriculture' },
            { label: 'Winter Protocol', value: 'Automated Met Office RST' },
          ]}
        />

        {/* 2. TRUST ACCREDITATIONS BAR */}
        <TrustBar />

        {/* 3. FOUR-PILLAR SCOPE STRIP */}
        <ServiceScopeStrip pillars={scopePillars} />

        {/* 4. EDITORIAL INTRO */}
        <ServiceEditorialIntro
          eyebrow="FOUR-SEASON ESTATE STEWARDSHIP"
          heading="Flawless First Impressions, Guaranteed Pedestrian Safety & ESG Environmental Excellence"
          subheading="The external realm of your commercial facility is the first asset your tenants, clients, and investors experience. EntireFM provides year-round grounds management that elevates estate presentation, mitigates slip-and-fall liabilities, and enhances local biodiversity."
          paragraphs={[
            'Our fleet delivers a complete four-season service: from precision summer turf cultivation and shrub bed curation to autumn leaf clearance, certified arboricultural risk management, and proactive winter gritting.',
            'Every gritting run and maintenance visit is timestamped with GPS evidence in EntireCAFM, giving property managers complete legal protection under the Occupiers\' Liability Act.',
          ]}
          bullets={[
            '100% GPS-tracked winter gritting fleet with automated Met Office RST feeds',
            'BS 5837 certified arboricultural tree hazard surveys and crown thinning',
            'Proactive automated 0°C RST salting runs before morning tenant arrival',
            'Full biodiversity and ESG enhancement plans supporting BREEAM ratings',
          ]}
          imageSrc="/images/editorial/entirefm-totem-headquarters-2000w.webp"
          imageAlt="EntireFM commercial grounds maintenance and landscaped business park"
          imageCaption="Four-Season Commercial Grounds & Winter Gritting Fleet"
          sideBadge={{ figure: 'BALI & ISO 14001', label: 'Grounds Standards' }}
        />

        {/* 5. VISUAL CAPABILITY EXPERIENCE */}
        <VisualCapabilityExperience
          eyebrow="CORE GROUNDS DISCIPLINES"
          title="Comprehensive Commercial Grounds & Landscaping Services"
          subtitle="From corporate business park lawns to industrial logistics yards, tree risk management, and automated winter response."
          capabilities={capabilities}
        />

        {/* 6. SIGNATURE TECHNICAL DIAGRAM: ESTATE GROUNDS & EXTERNAL REALM VISUALIZER */}
        <GroundsEstateVisualizer />

        {/* 7. SUPPORTED ASSETS TAXONOMY */}
        <SupportedAssetsGrid
          eyebrow="EXTERIOR ASSET TAXONOMY"
          title="Maintained Grounds & Boundary Assets"
          subtitle="Our specialist teams deploy commercial machinery and certified arborists to manage every aspect of your external property perimeter."
          categories={assetCategories}
        />

        {/* 8. DELIVERY PROCESS */}
        <ServiceDeliveryProcess
          eyebrow="OPERATIONAL METHODOLOGY"
          title="How We Mobilise & Manage Estate Grounds"
          subtitle="A structured four-season delivery framework ensuring immaculate summer aesthetics, proactive autumn leaf management, and zero winter freeze downtime."
        />

        {/* 9. PLANNED VS REACTIVE MAINTENANCE SPLIT */}
        <PlannedVsReactiveSplit
          eyebrow="SEASONAL PPM STRATEGY"
          title="Scheduled Care Protects Curb Appeal & Prevents Winter Closures"
          subtitle="Proactive automated salting and regular tree risk audits eliminate slip-and-fall claims and storm damage business disruption."
          plannedItems={[
            'Fortnightly summer lawn mowing, strimming, and border edging',
            'Monthly shrub bed cultivating, mulching, and weed abatement',
            'Annual BS 5837 tree hazard risk assessment and crown thinning',
            'Automated proactive winter gritting based on Met Office RST forecast',
            'Bi-annual car park gully vacuuming and oil/water interceptor servicing',
          ]}
          reactiveItems={[
            '24/7 emergency storm damage clearance for fallen branches and trees',
            'Emergency daytime salting during sudden unexpected snow squalls',
            'Urgent clearance of blocked stormwater gullies causing car park ponding',
            'Rapid repair of storm-damaged perimeter security fencing or gates',
          ]}
        />

        {/* 10. RELEVANT SECTORS GRID */}
        <ServiceSectorsGrid
          eyebrow="SECTORS SUPPORTED"
          title="Commercial Estates We Maintain"
          subtitle="Delivering professional grounds care and winter gritting across business parks, logistics hubs, retail parks, and educational campuses."
        />

        {/* 11. ENTIRECAFM DIGITAL PORTAL SHOWCASE */}
        <TechnologyCafmSection
          eyebrow="DIGITAL REALM GOVERNANCE"
          title="Real-Time Grounds & Winter Gritting Proof in EntireCAFM"
          subtitle="Access timestamped GPS gritting logs, photographic grounds audits, and certified tree hazard registers directly from your client portal."
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
                  Grounds & Winter Maintenance Guidance
                </h2>
              </div>
              <FAQAccordion faqs={faqs} />
            </div>
          </div>
        </section>

        {/* 13. RELATED INTERNAL LINKS */}
        <RelatedLinks
          title="Related External & Facilities Services"
          links={[
            { title: 'Commercial Cleaning Services', path: '/commercial-cleaning', description: 'Comprehensive commercial and contract cleaning' },
            { title: 'Building Maintenance', path: '/building-maintenance', description: 'Commercial building fabric and external envelope care' },
            { title: 'Working at Height & BMU', path: '/working-at-height-rope-access-bmu', description: 'High-level façade, gutter, and roof maintenance' },
            { title: 'Statutory Compliance Centre', path: '/compliance', description: 'Complete UK commercial property compliance guidance' },
          ]}
        />

        {/* 14. COMMERCIAL PROPOSAL & SURVEY CTA */}
        <ServiceConversionSection
          serviceName="Commercial Grounds Maintenance & Winter Gritting"
          headline="Discuss Your Estate Grounds & Winter Risk Plan"
          subheadline="Consult directly with our grounds and winter maintenance directors. We provide free estate surveys, Met Office RST gritting setups, and transparent seasonal pricing."
          ctaButtonText="Submit Grounds Enquiry"
          directDeskNote="Direct line to grounds operations managers and 24/7 winter gritting dispatch."
        />

      </main>

      <Footer />
    </div>
  );
}
