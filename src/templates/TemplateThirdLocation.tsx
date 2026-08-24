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

export function TemplateThirdLocation({ route, content }: TemplateProps) {
  const city = content.location || 'Regional';
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const cityData = TIER1_CITIES[citySlug];
  const contact = getRegionalContact(city);

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: content.h1, url: route.path },
  ];

  // Resolve third city-specific photography from approved manifest (commercial estate / corporate corridor)
  const cityImages = (locationImages.cities as Record<string, any>)[citySlug]?.images || [];
  const heroImage = cityImages.length > 2
    ? cityImages[2].src
    : cityImages.length > 0
    ? cityImages[0].src
    : '/images/editorial/entirefm-corporate-corridor-2000w.webp';
  const heroImageAlt = cityImages.length > 2
    ? cityImages[2].alt
    : `EntireFM commercial facilities management and property estate maintenance in ${city}`;

  const editorialImage = cityImages.length > 1
    ? cityImages[1].src
    : '/images/editorial/entirefm-switchroom-survey-2000w.webp';
  const editorialImageAlt = cityImages.length > 1
    ? cityImages[1].alt
    : `EntireFM engineers conducting estate surveys in ${city}`;

  const proofPills = [
    { figure: 'Multi-Tenant Care', label: 'Commercial Portfolio Management' },
    { figure: 'Service Charges', label: 'Transparent Digital Proof Packs' },
    { figure: 'Single Scope', label: 'Hard & Soft FM Accountability' },
    { figure: 'Contracted SLAs', label: '24/7 Priority Emergency Attendance' },
  ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `How does EntireFM support commercial landlords and managing agents in ${city}?`,
          answer: `We provide an integrated FM service covering common-parts M&E, statutory compliance, contract cleaning, grounds maintenance, and out-of-hours reactive cover. Our digital CAFM platform delivers transparent service-charge breakdown by site.`,
        },
        {
          question: `Can you manage facilities across multiple disparate buildings in ${city}?`,
          answer: `Yes. We specialise in multi-site estate management. Mobile engineering units and dedicated contract managers service properties across all commercial corridors in ${city} under unified service level agreements.`,
        },
        {
          question: `How are tenant reactive requests handled?`,
          answer: `Tenants and property managers can log jobs via our 24/7 digital helpdesk or direct telephone hotline. Jobs are dispatched to mobile engineers with live tracking and real-time status updates.`,
        },
        {
          question: `Do you provide energy auditing and sustainability reporting?`,
          answer: `Yes. We support MEES and EPC improvement programmes, monitoring plant efficiency, recommending LED/HVAC upgrades, and providing data for ESG and service charge reporting.`,
        },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. CINEMATIC CITY HERO WITH REGIONAL EMAIL & PROOF PILLS */}
        <GeoHero
          city={city}
          h1={content.h1}
          highlightedTitle="Commercial Property Management"
          intro={content.heroIntro || `Strategic facilities management partnership for commercial landlords, chartered surveyors, and managing agents across ${city}. Single-source accountability for Hard & Soft FM.`}
          imageSrc={heroImage}
          imageAlt={heroImageAlt}
          breadcrumbs={breadcrumbs}
          contact={contact}
          proofPills={proofPills}
        />

        {/* 2. TRUST & ACCREDITATION BARS */}
        <TrustBar />
        <AccreditationRail />

        {/* 3. OPERATIONAL SNAPSHOT STRIP */}
        <GeoOperationalStrip city={city} />

        {/* 4. ASYMMETRICAL EDITORIAL STORY (CANARY WHARF / ULEZ / LOCAL REALITIES) */}
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
