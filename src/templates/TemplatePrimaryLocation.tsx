'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { SectorSnapshot } from '@/components/sectors/SectorSnapshot';
import { TechnologyCafmSection } from '@/components/services/TechnologyCafmSection';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { 
  LocationServiceGrid, 
  LocationSectorGrid, 
  LocationCoverageGrid, 
  WhyChooseLocationGrid 
} from '@/components/content/LocationSectionViews';
import { PostcodeCoverageLookup } from '@/components/locations/PostcodeCoverageLookup';
import { LocationExploreBlock } from '@/components/locations/LocationExploreBlock';
import { TIER1_CITIES } from '@/content/locations/tier1-cities';
import locationImages from '@/config/location-images.json';
import { listPublishedCaseStudies } from '@/server/trust/case-studies';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, FileCheck2, MapPin, Building, AlertCircle } from 'lucide-react';
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

  // Resolve city-specific photography from approved manifest
  const cityImages = (locationImages.cities as Record<string, any>)[citySlug]?.images || [];
  const heroImage = cityImages.length > 0
    ? cityImages[0].src
    : '/images/editorial/entirefm-headquarters-exterior-2000w.webp';
  const heroImageAlt = cityImages.length > 0
    ? cityImages[0].alt
    : `EntireFM commercial facilities management and engineering operations in ${city}`;

  const heroFacts = [
    { label: `${city} Mobile Operations`, value: 'Regional Delivery' },
    { label: 'Contracted Response SLAs', value: '24/7 Priority Cover' },
    { label: 'Single Accountable Provider', value: 'Hard & Soft FM' },
  ];

  const snapshotPriorities = [
    { title: 'Local Commercial Demands', subtitle: cityData?.positioning || `Tailored maintenance protocols for ${city} commercial estates`, iconName: 'commercialBuildings' as const },
    { title: 'Direct Mobile Engineering', subtitle: `M&E, HVAC, electrical & plumbing technicians deployed across ${city}`, iconName: 'maintenanceTools' as const },
    { title: 'Statutory Safety & SFG20', subtitle: 'Digital compliance certificates and testing logs accessible 24/7', iconName: 'complianceAudit' as const },
    { title: 'Contracted Response SLAs', subtitle: 'Priority dispatch agreed per site by building criticality', iconName: 'twentyFourSevenOps' as const },
  ];

  const caseStudies = listPublishedCaseStudies();

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
        <ServiceHero
          eyebrow={`FACILITIES MANAGEMENT // ${city.toUpperCase()}`}
          title={content.h1}
          highlightedTitle={city}
          intro={content.heroIntro || cityData?.positioning || content.metaDescription}
          imageSrc={heroImage}
          imageAlt={heroImageAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: `Request a ${city} FM Proposal`, href: '#enquiry' }}
          secondaryCta={{ label: 'Verify Site Postcode', href: '#coverage-lookup' }}
          serviceFacts={heroFacts}
        />

        {/* 2. TRUST / ACCREDITATIONS BAR */}
        <TrustBar />

        {/* 3. LOCAL SNAPSHOT STRIP */}
        <SectorSnapshot
          leadText={cityData?.positioning || `Engineering-led facilities management and planned maintenance structured around the operational realities of ${city} commercial property.`}
          priorities={snapshotPriorities}
        />

        {/* 4. CITY-SPECIFIC OPERATING REALITIES ("WHAT MAKES MAINTAINING PROPERTY HERE DIFFERENT?") */}
        {cityData && cityData.operatingConditions && cityData.operatingConditions.length > 0 && (
          <section className="py-20 sm:py-28 bg-[#FAF9FB] border-b border-slate-200">
            <div className="container-custom">
              <div className="max-w-3xl mb-14">
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                    LOCAL ESTATE KNOWLEDGE
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  What Makes Maintaining Commercial Property in {city} Different?
                </h2>
                <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                  Every UK city has distinct building stock, transport constraints, and regulatory pressures. Here is how EntireFM engineers navigate the physical realities of {city}:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cityData.operatingConditions.map((cond, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200/90 rounded-sm p-7 sm:p-8 shadow-sm flex flex-col justify-between hover:border-brand-pink/40 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-sm bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-brand-pink/10 group-hover:text-brand-pink transition-colors">
                          0{idx + 1}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-pink-dark transition-colors">
                          {cond.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-[13.5px] text-slate-600 leading-relaxed pt-2">
                        {cond.detail}
                      </p>
                    </div>

                    <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>EntireFM {city} Delivery Protocol</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. EDITORIAL SECTIONS (PRESERVING DEEP SEO CONTENT) */}
        {content.sections && content.sections.length > 0 && (
          <section className="py-20 bg-white border-b border-slate-200">
            <div className="container-custom">
              <div className="max-w-3xl mb-12">
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                    OPERATIONAL STRATEGY
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Facilities Management Engineering Across {city}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-600">
                  Structured Hard FM, planned maintenance, and statutory safety across regional commercial, industrial, and institutional property.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF9FB] p-8 rounded-sm border border-slate-200/90 space-y-4 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 leading-snug">{sec.heading}</h3>
                      <p className="mt-3 text-sm text-slate-700 leading-relaxed">{sec.body}</p>
                      {sec.bullets && sec.bullets.length > 0 && (
                        <ul className="space-y-2 pt-4 mt-4 border-t border-slate-200">
                          {sec.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. LOCAL PROPERTY STOCK / BUILDINGS WE MAINTAIN */}
        {cityData && cityData.propertyStock && cityData.propertyStock.length > 0 && (
          <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
            <div className="container-custom">
              <div className="max-w-3xl mb-12">
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                    COMMERCIAL PROPERTY TYPES
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Buildings We Maintain Across {city}
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                  From multi-tenant corporate towers to heavy industrial works and logistics hubs:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cityData.propertyStock.map((stock, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-white border border-slate-200/90 rounded-sm shadow-sm flex items-start gap-3.5 hover:border-brand-pink/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-sm bg-brand-pink/10 text-brand-pink flex items-center justify-center shrink-0 mt-0.5">
                      <Building className="w-4 h-4" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                      {stock}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. SERVICES WE DELIVER IN THIS CITY */}
        <LocationServiceGrid city={city} />

        {/* 8. SECTORS SUPPORTED IN THIS CITY */}
        <LocationSectorGrid city={city} sectors={cityData?.sectors} />

        {/* 9. DIGITAL CAFM PLATFORM SECTION */}
        <TechnologyCafmSection
          eyebrow={`DIGITAL OPERATIONS // ${city.toUpperCase()}`}
          title={`Your ${city} Estate — One Real-Time Operational View`}
          subtitle={`Centralized compliance registers, live engineer attendance tracking, and instant certification archives for ${city} property directors and managing agents.`}
        />

        {/* 10. WHY CHOOSE ENTIREFM IN THIS LOCATION */}
        <WhyChooseLocationGrid city={city} />

        {/* 11. WHERE WE WORK / DISTRICTS GRID */}
        {cityData && cityData.districts && cityData.districts.length > 0 && (
          <LocationCoverageGrid
            city={city}
            region={cityData.region}
            districts={cityData.districts}
            travelPattern={cityData.travelPattern}
          />
        )}

        {/* 12. INTERACTIVE POSTCODE COVERAGE CHECKER */}
        <section id="coverage-lookup" className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <PostcodeCoverageLookup initialCity={city} />
          </div>
        </section>

        {/* 13. VERIFIED CASE STUDIES */}
        {caseStudies.length > 0 && (
          <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
            <div className="container-custom space-y-12">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                    VERIFIED PROOF
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  Operational Project Proof &amp; Case Studies
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Demonstrated engineering delivery, statutory governance, and asset lifecycle optimization across UK commercial facilities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {caseStudies.slice(0, 3).map((cs) => (
                  <div
                    key={cs.id}
                    className="bg-white p-6 rounded-sm border border-slate-200/90 flex flex-col justify-between shadow-sm hover:border-brand-pink/40 hover:shadow-md transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-pink font-semibold">
                          {cs.sector}
                        </span>
                        <span className="text-[10px] font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-sm">
                          {cs.location}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-pink-dark transition-colors">
                        {cs.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {cs.challenge}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href="/case-studies"
                        className="text-xs font-bold text-slate-900 group-hover:text-brand-pink inline-flex items-center gap-1.5 uppercase tracking-wider transition-colors"
                      >
                        Read Summary <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 14. ACCREDITATIONS CAROUSEL */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="container-custom">
            <AccreditationRail />
          </div>
        </section>

        {/* 15. FAQS ACCORDION */}
        {faqs.length > 0 && (
          <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
            <div className="container-custom max-w-4xl space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                    FREQUENTLY ASKED QUESTIONS
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Facilities Management in {city} — Expert Guidance
                </h2>
              </div>
              <FAQAccordion faqs={faqs} />
            </div>
          </section>
        )}

        {/* 16. STRUCTURED LOCAL EXPLORE LINKS BLOCK */}
        <LocationExploreBlock city={city} />

        {/* 17. PROPOSAL & CONVERSION SECTION */}
        <ServiceConversionSection
          serviceName={`Facilities Management ${city}`}
          headline={`Request a Facilities Management Proposal for Your ${city} Estate`}
          subheadline={`Consult directly with EntireFM technical directors. We establish asset registers, custom SFG20 PPM schedules, and contracted SLAs tailored to your ${city} property.`}
          badgeText={`${city.toUpperCase()} CONSULTATION`}
          ctaButtonText={`Request ${city} Proposal`}
          directDeskNote={`Connecting directly with our ${city} and regional operations desk.`}
        />
      </main>

      <Footer />
    </div>
  );
}
