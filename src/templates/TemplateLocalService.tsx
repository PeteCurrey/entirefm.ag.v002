'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { FullBleedFeature } from '@/components/content/FullBleedFeature';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { GeoHero } from '@/components/locations/GeoHero';
import { GeoOperationalStrip } from '@/components/locations/GeoOperationalStrip';
import { GeoEditorialStory } from '@/components/locations/GeoEditorialStory';
import { GeoCoverageTool } from '@/components/locations/GeoCoverageTool';
import { GeoDistrictVisualizer } from '@/components/locations/GeoDistrictVisualizer';
import { GeoServiceShowcase } from '@/components/locations/GeoServiceShowcase';
import { GeoSectorPanels } from '@/components/locations/GeoSectorPanels';
import { GeoCafmPreview } from '@/components/locations/GeoCafmPreview';
import { GeoCaseStudies } from '@/components/locations/GeoCaseStudies';
import { GeoDifferentiators } from '@/components/locations/GeoDifferentiators';
import { GeoCrossLinks } from '@/components/locations/GeoCrossLinks';
import { GeoConversionSection } from '@/components/locations/GeoConversionSection';
import { getRegionalContact } from '@/config/regional-contacts';
import { TIER1_CITIES } from '@/content/locations/tier1-cities';
import locationImages from '@/config/location-images.json';
import type { TemplateProps } from './types';

export function TemplateLocalService({ route, content }: TemplateProps) {
  const city = content.location || 'Regional';
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const cityData = TIER1_CITIES[citySlug];
  const contact = getRegionalContact(city);

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: content.h1, url: route.path },
  ];

  // Resolve service-specific or city-specific photography
  const cityImages = (locationImages.cities as Record<string, any>)[citySlug]?.images || [];
  const heroImage = cityImages.length > 0
    ? cityImages[0].src
    : '/images/editorial/entirefm-client-review-2000w.webp';
  const heroImageAlt = cityImages.length > 0
    ? cityImages[0].alt
    : `${content.h1} delivered by EntireFM in ${city}`;

  const editorialImage = cityImages.length > 1
    ? cityImages[1].src
    : '/images/editorial/entirefm-distribution-board-testing-2000w.webp';
  const editorialImageAlt = cityImages.length > 1
    ? cityImages[1].alt
    : `EntireFM specialists operating in ${city}`;

  const proofPills = [
    { figure: 'Direct Delivery', label: 'Certified In-House Operatives' },
    { figure: 'RAMS & COSHH', label: '100% Risk Assessed Safety' },
    { figure: 'Flexible Windows', label: 'Out-of-Hours & Night Attendance' },
    { figure: 'Total FM Fit', label: 'Integrates with M&E & PPM' },
  ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `How quickly can EntireFM mobilize ${content.h1} in ${city}?`,
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. CINEMATIC LOCAL SERVICE HERO */}
        <GeoHero
          city={city}
          h1={content.h1}
          highlightedTitle={city}
          intro={content.heroIntro || `Professional ${content.h1.toLowerCase()} across ${city} and regional commercial corridors. Direct delivery, trained operatives, and complete compliance documentation.`}
          imageSrc={heroImage}
          imageAlt={heroImageAlt}
          breadcrumbs={breadcrumbs}
          contact={contact}
          proofPills={proofPills}
        />

        {/* 2. TRUST & ACCREDITATIONS BAR */}
        <TrustBar />
        <AccreditationRail />

        {/* 3. LOCAL OPERATIONAL SNAPSHOT STRIP */}
        <GeoOperationalStrip city={city} />

        {/* 4. ASYMMETRICAL EDITORIAL STORY */}
        <GeoEditorialStory
          city={city}
          region={cityData?.region || `${city} Conurbation`}
          positioning={cityData?.positioning || `Specialist facilities service delivery structured around the operational realities of ${city} commercial property.`}
          operatingConditions={cityData?.operatingConditions}
          propertyStock={cityData?.propertyStock}
          imageSrc={editorialImage}
          imageAlt={editorialImageAlt}
        />

        {/* 5. FULL-BLEED ENGINEERING FEATURE BREAK */}
        <FullBleedFeature
          imageKey="distribution-board-testing"
          eyebrow="Specialist Services"
          title={`Direct Delivery & Safety Standards in ${city}`}
          body={`Every service is delivered by trained operatives working to rigorous Risk Assessments and Method Statements (RAMS), with complete digital records archived for safety auditing.`}
          points={[
            'Certified operatives and modern industrial equipment',
            'Full compliance and COSHH documentation supplied in advance',
            'Out-of-hours and weekend working windows',
            'Single-contract integration with wider Hard & Soft FM scopes',
          ]}
          href="/services"
          cta="Explore All Services"
        />

        {/* 6. RICH SERVICES SHOWCASE */}
        <GeoServiceShowcase city={city} />

        {/* 7. INTERACTIVE POSTCODE COVERAGE CHECKER */}
        <GeoCoverageTool city={city} />

        {/* 8. PHOTOGRAPHIC SECTOR PANELS */}
        <GeoSectorPanels city={city} sectors={cityData?.sectors} />

        {/* 9. DEEP DARK CAFM CLIENT PORTAL PREVIEW */}
        <GeoCafmPreview city={city} />

        {/* 10. DISTRICT & TRAVEL PATTERN VISUALIZER */}
        <GeoDistrictVisualizer
          city={city}
          region={cityData?.region || `${city} & Regional Travel Corridors`}
          districts={cityData?.districts}
          travelPattern={cityData?.travelPattern}
        />

        {/* 11. CASE STUDIES & OPERATIONAL PROOF */}
        <GeoCaseStudies city={city} />

        {/* 12. COMMERCIAL DIFFERENTIATORS (01 - 04) */}
        <GeoDifferentiators city={city} />

        {/* 13. EDITORIAL FAQ SECTION (PRESERVING FULL SEO CONTENT) */}
        <section className="section-padding bg-white border-b border-brand-edge">
          <div className="container-custom max-w-4xl">
            <FAQAccordion
              title={`${content.h1} in ${city} — FAQ`}
              subtitle={`Direct answers regarding delivery standards, scheduling, and risk assessments in ${city}.`}
              faqs={faqs}
            />
          </div>
        </section>


        {/* 14. REGIONAL KNOWLEDGE GRAPH CROSS-LINKS */}
        <GeoCrossLinks currentCity={city} />

        {/* 15. DEDICATED REGIONAL CONVERSION CLOSER */}
        <GeoConversionSection city={city} contact={contact} />
      </main>

      <Footer />
    </div>
  );
}
