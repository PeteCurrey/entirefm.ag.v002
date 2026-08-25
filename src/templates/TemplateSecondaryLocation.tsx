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

export function TemplateSecondaryLocation({ route, content }: TemplateProps) {
  const city = content.location || 'Regional';
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const cityData = TIER1_CITIES[citySlug];
  const contact = getRegionalContact(city);

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: content.h1, url: route.path },
  ];

  // Resolve secondary city-specific photography from content record or approved manifest
  const cityImages = (locationImages.cities as Record<string, any>)[citySlug]?.images || [];
  const heroImage = (content.heroImage && content.heroImage !== '/branding/EntireFM Branding 001.png')
    ? content.heroImage
    : cityImages.length > 1
    ? cityImages[1].src
    : cityImages.length > 0
    ? cityImages[0].src
    : '/images/editorial/entirefm-switchroom-survey-2000w.webp';
  const heroImageAlt = cityImages.length > 1
    ? cityImages[1].alt
    : `EntireFM planned preventative maintenance and asset surveys in ${city}`;

  const editorialImage = cityImages.length > 0
    ? cityImages[0].src
    : '/images/editorial/entirefm-rooftop-plant-night-2000w.webp';
  const editorialImageAlt = cityImages.length > 0
    ? cityImages[0].alt
    : `EntireFM mobile engineering units operating across ${city}`;

  const proofPills = [
    { figure: 'SFG20 PPM', label: 'Asset Condition Schedules' },
    { figure: 'Statutory Vault', label: '100% Digital Compliance Audit' },
    { figure: 'Condition Surveys', label: 'Mobilisation Baseline & Asset Tagging' },
    { figure: 'Emergency Cover', label: 'Contracted 24/7 Priority Attendance' },
  ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `How does EntireFM structure planned preventative maintenance in ${city}?`,
          answer: `Every contract starts with an on-site asset condition survey. We barcode physical plant, register serial numbers in EntireCAFM, and assign SFG20 task definitions to create an indisputable 52-week compliance calendar.`,
        },
        {
          question: `What emergency response times apply to commercial estates in ${city}?`,
          answer: `Out-of-hours emergency attendance is agreed per site based on asset criticality and tenant occupancy. Assigned mobile engineering teams handle urgent HVAC, electrical, plumbing, and safety repairs.`,
        },
        {
          question: `How is statutory testing evidenced for audits?`,
          answer: `All fixed-wire EICR, gas safety CP12, fire alarm, and water hygiene certificates are filed directly against the physical asset in EntireCAFM with photo logs, accessible 24/7.`,
        },
        {
          question: `Can EntireFM take over facilities from an incumbent contractor in ${city}?`,
          answer: `Yes. Our structured mobilisation framework reviews existing compliance records, audits physical plant condition, identifies historic gaps, and smoothly transitions operations without certificate lapse.`,
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
          intro={content.heroIntro || `Planned preventative maintenance, Hard FM engineering, and statutory compliance management for commercial property across ${city}.`}
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
          imageKey="rooftop-plant-night"
          eyebrow="Direct Engineering"
          title={`The Technical Delivery Behind Your ${city} Contract`}
          body={`Facilities management is only as good as the engineering underneath it. Ours is delivered by qualified engineers working to defined SFG20 task specifications across ${city}, with the evidence recorded against the asset rather than against the invoice.`}
          points={[
            'Direct in-house engineers, defined task specifications',
            'Full statutory testing held on a single compliance calendar',
            'Live photographic proof filed against the physical asset',
            'Reactive repairs delivered under the same accountable contract',
          ]}
          href="/ppm"
          cta="Explore Planned Maintenance"
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
