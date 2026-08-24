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

export function TemplatePrimaryLocation({ route, content }: TemplateProps) {
  const city = content.location || 'Regional';
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const cityData = TIER1_CITIES[citySlug];
  const contact = getRegionalContact(city);

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: content.h1, url: route.path },
  ];

  // Resolve city-specific photography from approved manifest
  const cityImages = (locationImages.cities as Record<string, any>)[citySlug]?.images || [];
  const heroImage = cityImages.length > 0
    ? cityImages[0].src
    : '/images/editorial/entirefm-headquarters-exterior-2000w.webp';
  const heroImageAlt = cityImages.length > 0
    ? cityImages[0].alt
    : `EntireFM commercial facilities management and engineering operations in ${city}`;

  const editorialImage = cityImages.length > 1
    ? cityImages[1].src
    : '/images/editorial/entirefm-switchroom-survey-2000w.webp';
  const editorialImageAlt = cityImages.length > 1
    ? cityImages[1].alt
    : `EntireFM engineers conducting site inspections in ${city}`;

  const proofPills = [
    { figure: 'Regional Hub', label: `${city} Mobile Engineering` },
    { figure: 'SFG20 Aligned', label: 'Statutory Planned Maintenance' },
    { figure: 'Single Contract', label: 'Hard & Soft FM Delivery' },
    { figure: '24/7 Response', label: 'Contracted Priority Emergency Attendance' },
  ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `What facilities management services does EntireFM provide in ${city}?`,
          answer: `EntireFM provides integrated Hard and Soft FM across ${city}, including planned preventative maintenance (PPM), mechanical and electrical engineering, commercial HVAC, statutory compliance testing, commercial cleaning, and 24/7 reactive repairs under a single accountable contract.`,
        },
        {
          question: `How are emergency callout response times managed across ${city}?`,
          answer: `Emergency attendance times are agreed per site during contract mobilisation, defined by priority band and building criticality rather than promised as a blanket marketing number. Critical safety and power failures receive immediate priority dispatch.`,
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. CINEMATIC CITY HERO */}
        <GeoHero
          city={city}
          h1={content.h1}
          highlightedTitle={city}
          intro={content.heroIntro || cityData?.positioning || content.metaDescription}
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
          positioning={cityData?.positioning || `Engineering-led facilities management and planned maintenance structured around the operational realities of ${city} commercial property.`}
          operatingConditions={cityData?.operatingConditions}
          propertyStock={cityData?.propertyStock}
          imageSrc={editorialImage}
          imageAlt={editorialImageAlt}
        />

        {/* 5. FULL-BLEED ENGINEERING FEATURE BREAK */}
        <FullBleedFeature
          imageKey="distribution-board-testing"
          eyebrow="Direct Engineering"
          title={`The Technical Delivery Behind Your ${city} Contract`}
          body={`Facilities management is only as good as the engineering underneath it. Ours is delivered by qualified engineers working to defined SFG20 task specifications across ${city}, with the evidence recorded against the asset rather than against the invoice.`}
          points={[
            'Direct in-house engineers, defined task specifications',
            'Full statutory testing held on a single compliance calendar',
            'Live photographic proof filed against the physical asset',
            'Reactive repairs delivered under the same accountable contract',
          ]}
          href="/mechanical-electrical"
          cta="Explore Engineering Delivery"
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
              title={`Facilities Management in ${city} — FAQ`}
              subtitle={`Direct answers regarding contract structure, compliance certification, and service mobilization in ${city}.`}
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
