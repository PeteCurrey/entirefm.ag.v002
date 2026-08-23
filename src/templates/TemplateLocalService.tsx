import React from 'react';
import { Header } from '@/components/layout/Header';
import { PageHero } from '@/components/hero/PageHero';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { DiagonalStatement } from '@/components/content/DiagonalStatement';
import { FullBleedFeature } from '@/components/content/FullBleedFeature';
import { HorizontalRail } from '@/components/content/HorizontalRail';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { 
  LocationServiceGrid, 
  LocationSectorGrid, 
  LocationCoverageGrid, 
  WhyChooseLocationGrid 
} from '@/components/content/LocationSectionViews';
import { TIER1_CITIES } from '@/content/locations/tier1-cities';
import type { TemplateProps } from './types';

export function TemplateLocalService({ route, content }: TemplateProps) {
  const city = content.location || 'Regional';
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const cityData = TIER1_CITIES[citySlug];

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: content.h1, url: route.path },
  ];

  const heroFacts = [
    { figure: 'Specialist', label: `Direct delivery for ${content.h1}` },
    { figure: 'Coverage', label: `Covering all commercial districts in ${city}` },
    { figure: 'Compliance', label: 'Certified technicians, COSHH & RAMS documentation' },
  ];

  const servicePoints = [
    `Specialist equipment and certified operatives deployed across ${city}`,
    'Full risk assessment (RAMS) and COSHH compliance for every attendance',
    'Out-of-hours and scheduled service windows preventing business disruption',
    `Seamless integration into wider ${city} facilities management contracts`,
  ];

  const railItems = [
    {
      imageKey: 'distribution-board-testing',
      eyebrow: 'Specialist Service',
      title: `${content.h1} in ${city}`,
      body: `Delivering high-specification service standards for commercial, industrial and managed residential estates across ${city}.`,
      href: route.path,
    },
    {
      imageKey: 'rooftop-plant-night',
      eyebrow: 'Integrated Hard FM',
      title: `Mechanical & Electrical in ${city}`,
      body: 'HVAC, power distribution, lighting and statutory testing coordinated under one contract.',
      href: '/mechanical-electrical',
    },
    {
      imageKey: 'switchroom-survey',
      eyebrow: 'Compliance Surveys',
      title: `Planned maintenance in ${city}`,
      body: 'SFG20 maintenance routines, asset condition surveys and compliance calendars.',
      href: '/ppm',
    },
    {
      imageKey: 'headquarters-exterior',
      eyebrow: 'Soft FM',
      title: `Commercial cleaning & hygiene in ${city}`,
      body: 'Daily contract cleaning, janitorial supplies, window cleaning and deep sanitisation.',
      href: '/cleaning-services',
    },
  ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `How quickly can EntireFM deliver ${content.h1} in ${city}?`,
          answer: `We provide flexible scheduling across ${city}, including scheduled periodic visits, planned weekend/night work, and rapid dispatch for urgent commercial requirements.`,
        },
        {
          question: `Are your technicians fully certified and insured?`,
          answer: `Yes. All operatives are trained, certified, and fully insured. Detailed Site-Specific Risk Assessments (RAMS) and COSHH data sheets are supplied prior to commencing any work.`,
        },
        {
          question: `Can this service be combined into a total facilities contract?`,
          answer: `Yes. While we deliver individual specialist services, combining them with M&E, planned maintenance, and cleaning under one EntireFM agreement provides significant cost and management efficiencies.`,
        },
      ];

  const relatedLinks = (content.relatedRoutes || ['/locations', '/services', '/ppm', '/contact-us']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: `${city} Service`,
    description: `Explore EntireFM capabilities for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
  }));

  const districts = cityData?.districts || [
    { name: `${city} Central Commercial Core`, note: 'High-density commercial offices, retail and multi-tenant estates.' },
    { name: `${city} Industrial & Business Parks`, note: 'Manufacturing, warehousing, trade counters and logistics facilities.' },
    { name: `${city} Regional Corridors`, note: 'Arterial transport routes and neighbouring commercial centres.' },
    { name: `${city} Public Realm & Civic Estates`, note: 'Education, healthcare and public-sector property portfolios.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main id="main" className="flex-grow">
        {/* 1. LOCATION-SPECIFIC HERO */}
        <PageHero
          eyebrow={content.eyebrow || `Specialist Service · ${city}`}
          title={content.h1}
          intro={content.heroIntro || content.metaDescription}
          path={route.path}
          imageSrc={content.heroImage}
          imageAlt={content.heroImage ? `EntireFM ${content.h1} operations in ${city}` : undefined}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: `Request a ${city} service quote`, href: '#enquiry' }}
          facts={heroFacts}
        />

        {/* 2. LOCAL TRUST / CAPABILITY STRIP */}
        <TrustBar />

        {/* 3. LOCAL SERVICE IN [LOCATION] — DIAGONAL STATEMENT */}
        <DiagonalStatement
          eyebrow={`Specialist Capability · ${city}`}
          title={`${content.h1}.`}
          titleAccent="Professional and dependable."
          body={
            `EntireFM provides dedicated ${content.h1.toLowerCase()} across ${city}, utilising industry-grade equipment, certified operatives, and robust health and safety protocols to ensure outstanding results for your commercial property.`
          }
          points={servicePoints}
          leftLabel={`${city} Service Delivery`}
          rightLabel="Quality Assurance & RAMS"
          leftImageKey="distribution-board-testing"
          rightImageKey="rooftop-plant-night"
          href="/services"
          cta="All services"
        />

        {/* 4. SERVICES WE PROVIDE IN [LOCATION] */}
        <LocationServiceGrid city={city} />

        {/* 5. SECTORS WE SUPPORT IN [LOCATION] */}
        <LocationSectorGrid city={city} sectors={cityData?.sectors} />

        {/* 6. LOCAL / REGIONAL OPERATING CONTEXT — FULL BLEED FEATURE */}
        <FullBleedFeature
          imageKey="switchgear-inspection"
          eyebrow={`Service Excellence · ${city}`}
          title={`High-specification standards for ${city} properties`}
          body={`Whether maintaining clinical hygiene standards, industrial warehouse floors, or prime office presentation, our ${city} teams deliver consistent quality with zero disruption to daily trading.`}
          points={[
            'Certified operatives and site-specific RAMS',
            'Flexible scheduling including evening and weekend attendance',
            'Full compliance with British standards and environmental guidelines',
            'Transparent pricing with detailed photographic completion reports',
          ]}
          href="/contact-us"
          cta="Request a quote"
        />

        {/* 7. RELEVANT SPECIALIST SERVICES — HORIZONTAL CAPABILITY RAIL */}
        <HorizontalRail
          eyebrow="Capability Rail"
          title={`Complementary facilities services in ${city}`}
          intro="Explore our complete range of commercial building maintenance and engineering services."
          items={railItems}
        />

        {/* 8. NEARBY AREAS / SERVICE COVERAGE */}
        <LocationCoverageGrid
          city={city}
          region={cityData?.region}
          districts={districts}
          travelPattern={cityData?.travelPattern}
        />

        {/* 9. ACCREDITATIONS & COMPLIANCE */}
        <section className="py-14 bg-white border-t border-brand-edge">
          <div className="container-wide">
            <AccreditationRail />
          </div>
        </section>

        {/* 10. WHY BUSINESSES IN [LOCATION] USE ENTIREFM */}
        <WhyChooseLocationGrid city={city} />

        {/* 11. LOCATION-SPECIFIC FAQ */}
        <section className="section-padding bg-brand-surface border-t border-brand-edge">
          <div className="container-custom max-w-4xl">
            <div className="mb-10 text-center">
              <span className="badge-technical">Service FAQs</span>
              <h2 className="text-display-md text-brand-graphite mt-3">
                {content.h1} — Frequently Asked Questions
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Key operational details and delivery standards in {city}.
              </p>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        {/* 12. STRONG LOCATION-SPECIFIC CONVERSION SECTION */}
        <ProposalSection
          defaultLocation={city}
          headline={`Request a Service Proposal for ${city}`}
          subheadline={`Contact our operations team for a tailored quote or site survey in ${city}.`}
        />

        {/* 13. RELATED LOCATION / SERVICE LINKS */}
        <section className="section-padding bg-white border-t border-brand-edge">
          <div className="container-wide">
            <div className="max-w-2xl mb-8">
              <span className="badge-technical">Regional Network</span>
              <h2 className="text-display-sm text-brand-graphite mt-2">
                Explore Local Services & Regional Coverage
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
