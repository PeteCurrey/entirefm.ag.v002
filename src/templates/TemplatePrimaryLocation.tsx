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

export function TemplatePrimaryLocation({ route, content }: TemplateProps) {
  const city = content.location || 'Regional';
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const cityData = TIER1_CITIES[citySlug];

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: content.h1, url: route.path },
  ];

  const heroFacts = [
    { figure: 'Coverage', label: `Mobile engineering across ${city} & regional corridors` },
    { figure: 'Response', label: 'Contracted out-of-hours coverage for critical sites' },
    { figure: 'Delivery', label: 'Single contract accountability for Hard & Soft FM' },
  ];

  const positioningPoints = [
    `Dedicated account management with direct technical escalation in ${city}`,
    'Every maintenance schedule built from a complete site asset survey',
    'Statutory testing, digital certificates and compliance records in one place',
    `Response times agreed contractually per site across ${city}`,
  ];

  const railItems = [
    {
      imageKey: 'switchgear-inspection',
      eyebrow: 'Electrical',
      title: `Fixed wire testing and distribution in ${city}`,
      body: 'Periodic inspection, EICR reporting and remedial works across HV and LV distribution with certificates filed directly to your digital asset register.',
      href: '/mechanical-electrical',
    },
    {
      imageKey: 'rooftop-plant-night',
      eyebrow: 'HVAC & Plant',
      title: `Rooftop plant and chiller maintenance in ${city}`,
      body: 'Chillers, air handling units and condensers maintained around occupancy hours, including scheduled out-of-hours works.',
      href: '/hvac-contractor',
    },
    {
      imageKey: 'switchroom-survey',
      eyebrow: 'Surveys',
      title: `Asset condition and compliance surveys across ${city}`,
      body: 'The asset survey that grounds your maintenance plan: identifying what is installed, its operating condition, and statutory testing requirements.',
      href: '/ppm',
    },
    {
      imageKey: 'access-control-install',
      eyebrow: 'Security & Access',
      title: `Access control and barrier maintenance in ${city}`,
      body: 'Installation, preventative maintenance and fire-interface testing ensuring every secure access point releases correctly during alarms.',
      href: '/access-control',
    },
  ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `What facilities management services does EntireFM provide in ${city}?`,
          answer: `EntireFM provides integrated Hard and Soft FM across ${city}, including planned preventative maintenance (PPM), mechanical and electrical engineering, HVAC, statutory compliance testing, commercial cleaning, and 24/7 reactive repairs under a single accountable contract.`,
        },
        {
          question: `How are emergency callout response times managed across ${city}?`,
          answer: `Emergency attendance times are agreed per site during contract mobilisation, defined by priority band and building criticality rather than promised as a blanket number. Critical safety and power failures receive immediate priority dispatch.`,
        },
        {
          question: `Can EntireFM manage multi-site portfolios in and around ${city}?`,
          answer: `Yes. Multi-site commercial estates are our core delivery model. Mobile engineering teams cover ${city} and regional transport corridors, providing consistent service standards, unified reporting, and centralized compliance management.`,
        },
        {
          question: `How do you handle statutory compliance and SFG20 maintenance?`,
          answer: `All site plant and assets are surveyed and logged into our CAFM platform. Maintenance schedules are aligned with SFG20 task standards, and test certificates for electrical, gas, fire, and water hygiene are accessible digitally at all times.`,
        },
      ];

  const relatedLinks = (content.relatedRoutes || ['/locations', '/services', '/ppm', '/contact-us']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: `${city} Network`,
    description: `Explore EntireFM capabilities and service specifications for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
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
          eyebrow={content.eyebrow || `Facilities Management · ${city}`}
          title={content.h1}
          intro={content.heroIntro || content.metaDescription}
          path={route.path}
          imageSrc={content.heroImage}
          imageAlt={content.heroImage ? `EntireFM facilities management operations in ${city}` : undefined}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: `Request a ${city} proposal`, href: '#enquiry' }}
          facts={heroFacts}
        />

        {/* 2. LOCAL TRUST / CAPABILITY STRIP */}
        <TrustBar />

        {/* 3. FACILITIES MANAGEMENT IN [LOCATION] — DIAGONAL STATEMENT */}
        <DiagonalStatement
          eyebrow={`Commercial FM · ${city}`}
          title={`Facilities management in ${city}.`}
          titleAccent="Under one accountable contract."
          body={
            cityData?.positioning ||
            `EntireFM delivers comprehensive facilities management across ${city}, consolidating mechanical & electrical engineering, planned maintenance, statutory compliance and specialist cleaning into a single transparent agreement.`
          }
          points={positioningPoints}
          leftLabel={`${city} Commercial Estates`}
          rightLabel="Direct Engineering Delivery"
          leftImageKey="manchester-castlefield-night"
          rightImageKey="rooftop-plant-night"
          href="/services"
          cta={`Explore ${city} services`}
        />

        {/* 4. SERVICES WE PROVIDE IN [LOCATION] */}
        <LocationServiceGrid city={city} />

        {/* 5. SECTORS WE SUPPORT IN [LOCATION] */}
        <LocationSectorGrid city={city} sectors={cityData?.sectors} />

        {/* 6. LOCAL / REGIONAL OPERATING CONTEXT — FULL BLEED FEATURE */}
        <FullBleedFeature
          imageKey="distribution-board-testing"
          eyebrow={`Operating Reality · ${city}`}
          title={`The engineering behind your ${city} estate`}
          body={`Commercial property in ${city} demands an FM provider that understands local operating constraints — from access permits and loading windows to out-of-hours plant maintenance and strict statutory safety compliance.`}
          points={[
            'Qualified engineers working to defined SFG20 specifications',
            'Full compliance evidence recorded against each building asset',
            'Planned maintenance scheduled to eliminate operational disruption',
            'Unified reporting across single sites or regional multi-site portfolios',
          ]}
          href="/mechanical-electrical"
          cta="Engineering capabilities"
        />

        {/* 7. RELEVANT SPECIALIST SERVICES — HORIZONTAL CAPABILITY RAIL */}
        <HorizontalRail
          eyebrow="Specialist Disciplines"
          title={`Specialist FM capabilities for ${city} sites`}
          intro="Deep technical engineering and specialist building services delivered across the region."
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
              <span className="badge-technical">Local Expertise</span>
              <h2 className="text-display-md text-brand-graphite mt-3">
                {city} Facilities Management — Frequently Asked Questions
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Key questions on contract consolidation, response times and statutory compliance in {city}.
              </p>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        {/* 12. STRONG LOCATION-SPECIFIC CONVERSION SECTION */}
        <ProposalSection
          defaultLocation={city}
          headline={`Request a Facilities Proposal for ${city}`}
          subheadline={`Speak with our engineering team about planned maintenance contracts, compliance audits or a site survey for your ${city} estate.`}
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
