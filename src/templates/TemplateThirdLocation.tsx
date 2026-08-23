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

export function TemplateThirdLocation({ route, content }: TemplateProps) {
  const city = content.location || 'Regional';
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const cityData = TIER1_CITIES[citySlug];

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: content.h1, url: route.path },
  ];

  const heroFacts = [
    { figure: 'Portfolios', label: `Multi-tenant & multi-site estate management in ${city}` },
    { figure: 'Reporting', label: 'Itemized cost & service charge transparent billing' },
    { figure: 'Operations', label: 'Seamless contractor integration & concierge services' },
  ];

  const estatePoints = [
    `Single point of contact for managing agents and commercial landlords across ${city}`,
    'Transparent service charge accounting and site-by-site spend reporting',
    'Common-parts maintenance, front of house, security and daily janitorial',
    `Rapid emergency response across all ${city} commercial districts and business parks`,
  ];

  const railItems = [
    {
      imageKey: 'client-review',
      eyebrow: 'Portfolio Management',
      title: `Service charge reporting for ${city} estates`,
      body: 'Itemized maintenance, reactive repair and compliance spending reported per property to satisfy tenant and auditor scrutiny.',
      href: '/client-login',
    },
    {
      imageKey: 'access-control-install',
      eyebrow: 'Front of House & Security',
      title: `Access control and reception support in ${city}`,
      body: 'Concierge services, intercom systems, barrier maintenance and perimeter security tailored to multi-tenant commercial offices.',
      href: '/access-control',
    },
    {
      imageKey: 'switchroom-survey',
      eyebrow: 'Landlord & Tenant',
      title: `Common-parts M&E and fabric care across ${city}`,
      body: 'Maintaining shared HVAC risers, lift lobbies, stairwells and washrooms to prime commercial presentation standards.',
      href: '/building-maintenance',
    },
    {
      imageKey: 'distribution-board-testing',
      eyebrow: 'Statutory Safety',
      title: `Estate compliance certification in ${city}`,
      body: 'Centralized statutory certificates for landlord plant, emergency lighting and water hygiene available 24/7 on our portal.',
      href: '/compliance',
    },
  ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `How does EntireFM support managing agents and landlords in ${city}?`,
          answer: `We provide an integrated FM service covering common parts M&E, statutory compliance, contract cleaning, grounds maintenance, and out-of-hours reactive cover. Our digital CAFM platform delivers transparent service-charge breakdown by site.`,
        },
        {
          question: `Can you manage facilities across multiple disparate buildings in ${city}?`,
          answer: `Yes. We specialise in multi-site estate management. Mobile engineering units and dedicated contract managers service properties across all commercial corridors in ${city} under unified service level agreements.`,
        },
        {
          question: `How are tenant reactive requests handled?`,
          answer: `Tenants and property managers can log jobs via our 24/7 digital helpdesk or direct telephone hotline. Jobs are dispatched to mobile engineers with tracking and real-time status updates.`,
        },
        {
          question: `Do you provide energy auditing and sustainability reporting?`,
          answer: `Yes. We support MEES and EPC improvement programmes, monitoring plant efficiency, recommending LED/HVAC upgrades, and providing data for ESG and service charge reporting.`,
        },
      ];

  const relatedLinks = (content.relatedRoutes || ['/locations', '/commercial-facilities-management', '/ppm', '/contact-us']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: `${city} Commercial Estates`,
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
          eyebrow={content.eyebrow || `Commercial Estate FM · ${city}`}
          title={content.h1}
          intro={content.heroIntro || content.metaDescription}
          path={route.path}
          imageSrc={content.heroImage}
          imageAlt={content.heroImage ? `EntireFM commercial property management in ${city}` : undefined}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: `Request an estate proposal for ${city}`, href: '#enquiry' }}
          facts={heroFacts}
        />

        {/* 2. LOCAL TRUST / CAPABILITY STRIP */}
        <TrustBar />

        {/* 3. ESTATE FM IN [LOCATION] — DIAGONAL STATEMENT */}
        <DiagonalStatement
          eyebrow={`Estate Management · ${city}`}
          title={`Managing commercial portfolios in ${city}.`}
          titleAccent="Transparent and dependable."
          body={
            `EntireFM partners with commercial landlords, property directors, and managing agents across ${city}, delivering seamless common-parts maintenance, statutory compliance, daily cleaning, and tenant satisfaction.`
          }
          points={estatePoints}
          leftLabel={`${city} Portfolio Services`}
          rightLabel="Integrated FM Account"
          leftImageKey="manchester-castlefield-night"
          rightImageKey="switchgear-inspection"
          href="/commercial-facilities-management"
          cta="Commercial estate FM"
        />

        {/* 4. SERVICES WE PROVIDE IN [LOCATION] */}
        <LocationServiceGrid city={city} />

        {/* 5. SECTORS WE SUPPORT IN [LOCATION] */}
        <LocationSectorGrid city={city} sectors={cityData?.sectors} />

        {/* 6. LOCAL / REGIONAL OPERATING CONTEXT — FULL BLEED FEATURE */}
        <FullBleedFeature
          imageKey="headquarters-exterior"
          eyebrow={`Commercial Property · ${city}`}
          title={`Protecting asset value across ${city} business estates`}
          body={`Multi-tenant offices, retail developments and business parks require an FM partner that acts as an extension of the property management team — maintaining professional standards, controlling costs, and resolving reactive issues before they affect tenants.`}
          points={[
            'Dedicated property account manager and transparent escalation',
            'Full statutory testing and digital compliance certification',
            'Contracted cleaning, grounds maintenance and security',
            'Detailed service charge reporting with evidence',
          ]}
          href="/contact-us"
          cta="Request a proposal"
          align="centre"
        />

        {/* 7. RELEVANT SPECIALIST SERVICES — HORIZONTAL CAPABILITY RAIL */}
        <HorizontalRail
          eyebrow="Estate Disciplines"
          title={`Integrated property services across ${city}`}
          intro="Comprehensive Hard & Soft FM services designed for property managers and commercial landlords."
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
              <span className="badge-technical">Property Management FAQs</span>
              <h2 className="text-display-md text-brand-graphite mt-3">
                {city} Commercial Property FM — Common Questions
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Key questions for managing agents, landlords and commercial portfolio directors in {city}.
              </p>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        {/* 12. STRONG LOCATION-SPECIFIC CONVERSION SECTION */}
        <ProposalSection
          defaultLocation={city}
          headline={`Request an Estate Proposal for ${city}`}
          subheadline={`Speak with our team about single-site or portfolio facilities management contracts across ${city}.`}
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
