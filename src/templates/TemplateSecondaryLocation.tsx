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

export function TemplateSecondaryLocation({ route, content }: TemplateProps) {
  const city = content.location || 'Regional';
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const cityData = TIER1_CITIES[citySlug];

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: content.h1, url: route.path },
  ];

  const heroFacts = [
    { figure: 'SFG20', label: `Standardized maintenance task schedules for ${city} assets` },
    { figure: 'Compliance', label: '100% auditable digital certificates & testing logs' },
    { figure: 'Planning', label: 'Asset surveys driving planned preventative PPM' },
  ];

  const ppmPoints = [
    `Complete site asset surveys establishing actual equipment condition in ${city}`,
    'Digital compliance calendars tracking electrical, gas, fire, and water regimes',
    'SFG20 task definitions preventing premature plant and fabric failure',
    `Transparent cost reporting and lifecycle planning for ${city} commercial portfolios`,
  ];

  const railItems = [
    {
      imageKey: 'switchroom-survey',
      eyebrow: 'Asset Management',
      title: `Asset condition surveys in ${city}`,
      body: 'Comprehensive surveys cataloguing every HVAC unit, distribution board, emergency light and boiler with condition scoring.',
      href: '/ppm',
    },
    {
      imageKey: 'distribution-board-testing',
      eyebrow: 'Electrical Compliance',
      title: `Periodic fixed wire testing & EICR across ${city}`,
      body: 'Statutory 5-year electrical inspection and testing with immediate remedial repairs and digital certification.',
      href: '/mechanical-electrical',
    },
    {
      imageKey: 'rooftop-plant-night',
      eyebrow: 'HVAC Regimes',
      title: `Chiller, boiler and AHU servicing in ${city}`,
      body: 'Seasonal maintenance, filter changes, coil cleaning and F-Gas leak testing protecting energy efficiency and air quality.',
      href: '/hvac-contractor',
    },
    {
      imageKey: 'switchgear-inspection',
      eyebrow: 'Fire & Life Safety',
      title: `Fire alarm and emergency lighting regimes in ${city}`,
      body: 'Weekly, monthly and annual statutory testing schedules meeting BS 5839 and BS 5266 compliance standards.',
      href: '/fire-emergency-systems',
    },
  ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `How does EntireFM structure planned preventative maintenance in ${city}?`,
          answer: `We conduct a thorough initial site asset survey, mapping all mechanical, electrical, plumbing and fabric elements into our CAFM system. Maintenance routines are scheduled in strict alignment with SFG20 industry standards to protect warranty, compliance, and asset life.`,
        },
        {
          question: `How are statutory compliance records managed and accessed?`,
          answer: `All test certificates, service sheets, remedial quotes, and engineer sign-offs are uploaded to our digital client portal. You have 24/7 access to auditable records for insurance, fire authority, and health & safety inspections across your ${city} property.`,
        },
        {
          question: `Can you assist with building mobilisation and outgoing supplier handover?`,
          answer: `Yes. Mobilisation begins with asset verification rather than arbitrary contract dates. We audit existing asset registers, flag immediate compliance gaps, and run a structured handover so no statutory testing lapses during the transition.`,
        },
        {
          question: `What emergency engineering backup supports the planned maintenance contract?`,
          answer: `Contracted planned maintenance clients in ${city} benefit from 24/7 emergency dispatch with agreed priority SLA response times for critical power, heating, cooling, or flood incidents.`,
        },
      ];

  const relatedLinks = (content.relatedRoutes || ['/locations', '/ppm', '/hard-services', '/contact-us']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: `${city} Planned FM`,
    description: `Explore EntireFM capabilities and statutory maintenance specifications for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
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
          eyebrow={content.eyebrow || `Planned FM & Compliance · ${city}`}
          title={content.h1}
          intro={content.heroIntro || content.metaDescription}
          path={route.path}
          imageSrc={content.heroImage}
          imageAlt={content.heroImage ? `EntireFM planned maintenance engineering in ${city}` : undefined}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: `Request a ${city} maintenance proposal`, href: '#enquiry' }}
          facts={heroFacts}
        />

        {/* 2. LOCAL TRUST / CAPABILITY STRIP */}
        <TrustBar />

        {/* 3. PLANNED FM IN [LOCATION] — DIAGONAL STATEMENT */}
        <DiagonalStatement
          eyebrow={`Planned Maintenance · ${city}`}
          title={`Asset reliability in ${city}.`}
          titleAccent="Built on verified surveys."
          body={
            `EntireFM provides structured planned preventative maintenance (PPM) and statutory compliance management across commercial, industrial and public-sector estates in ${city}. Our engineering programmes protect plant longevity and eliminate compliance blindspots.`
          }
          points={ppmPoints}
          leftLabel={`${city} Asset Verification`}
          rightLabel="SFG20 Maintenance Schedules"
          leftImageKey="switchroom-survey"
          rightImageKey="distribution-board-testing"
          href="/ppm"
          cta="Explore PPM standards"
        />

        {/* 4. SERVICES WE PROVIDE IN [LOCATION] */}
        <LocationServiceGrid city={city} />

        {/* 5. SECTORS WE SUPPORT IN [LOCATION] */}
        <LocationSectorGrid city={city} sectors={cityData?.sectors} />

        {/* 6. LOCAL / REGIONAL OPERATING CONTEXT — FULL BLEED FEATURE */}
        <FullBleedFeature
          imageKey="rooftop-plant-night"
          eyebrow={`Statutory Assurance · ${city}`}
          title={`Total compliance visibility across your ${city} estate`}
          body={`From high-voltage switchgear testing to Legionella risk monitoring and TM44 air conditioning assessments, EntireFM ensures commercial properties in ${city} remain strictly compliant with UK building regulations and health & safety law.`}
          points={[
            'Single digital compliance dashboard and calendar',
            'Full remedial works tracking with transparent quotes',
            'Qualified engineers certified for Gas Safe, F-Gas and electrical works',
            'Documented audit trail for insurers and local authorities',
          ]}
          href="/compliance"
          cta="Compliance framework"
        />

        {/* 7. RELEVANT SPECIALIST SERVICES — HORIZONTAL CAPABILITY RAIL */}
        <HorizontalRail
          eyebrow="Compliance Regimes"
          title={`Technical maintenance disciplines across ${city}`}
          intro="Systematic testing and preventative servicing schedules protecting property value and occupant safety."
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
              <span className="badge-technical">Compliance FAQs</span>
              <h2 className="text-display-md text-brand-graphite mt-3">
                {city} Planned Maintenance — Common Questions
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Understanding asset surveys, SFG20 schedules and statutory testing in {city}.
              </p>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        {/* 12. STRONG LOCATION-SPECIFIC CONVERSION SECTION */}
        <ProposalSection
          defaultLocation={city}
          headline={`Request a Maintenance Proposal for ${city}`}
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
