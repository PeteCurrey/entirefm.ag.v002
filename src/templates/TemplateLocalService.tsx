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
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
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

  // Resolve service-specific or city-specific photography
  const cityImages = (locationImages.cities as Record<string, any>)[citySlug]?.images || [];
  const heroImage = cityImages.length > 0
    ? cityImages[0].src
    : '/images/editorial/entirefm-client-review-2000w.webp';
  const heroImageAlt = cityImages.length > 0
    ? cityImages[0].alt
    : `${content.h1} delivered by EntireFM in ${city}`;

  const heroFacts = [
    { label: 'Direct Service Delivery', value: 'Certified Operatives' },
    { label: 'Compliance & RAMS', value: '100% Risk Assessed' },
    { label: `${city} Coverage`, value: 'All Commercial Zones' },
  ];

  const snapshotPriorities = [
    { title: 'Specialist Service Delivery', subtitle: `Certified technicians and dedicated equipment deployed in ${city}`, iconName: 'commercialCleaning' as const },
    { title: 'Site-Specific RAMS & COSHH', subtitle: 'Method statements and safety protocols filed prior to attendance', iconName: 'complianceAudit' as const },
    { title: 'Flexible Working Windows', subtitle: 'Out-of-hours, night-shift, and weekend attendance preventing disruption', iconName: 'twentyFourSevenOps' as const },
    { title: 'Integrated FM Advantage', subtitle: 'Easily combined with M&E, PPM and total building maintenance', iconName: 'integratedServices' as const },
  ];

  const caseStudies = listPublishedCaseStudies();

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
        <ServiceHero
          eyebrow={`SPECIALIST LOCAL SERVICE // ${city.toUpperCase()}`}
          title={content.h1}
          highlightedTitle={city}
          intro={content.heroIntro || `Professional ${content.h1.toLowerCase()} across ${city} and regional commercial corridors. Direct delivery, trained operatives, and complete compliance documentation.`}
          imageSrc={heroImage}
          imageAlt={heroImageAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: `Request a ${city} Quote`, href: '#enquiry' }}
          secondaryCta={{ label: 'Verify Site Postcode', href: '#coverage-lookup' }}
          serviceFacts={heroFacts}
        />

        {/* 2. TRUST / ACCREDITATIONS BAR */}
        <TrustBar />

        {/* 3. LOCAL SNAPSHOT STRIP */}
        <SectorSnapshot
          leadText={`Direct, high-standard delivery of ${content.h1.toLowerCase()} engineered to protect commercial presentation, hygiene, and asset integrity across ${city}.`}
          priorities={snapshotPriorities}
        />

        {/* 4. SERVICE STANDARDS & METHODOLOGY */}
        <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <div className="max-w-3xl mb-14">
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                  SERVICE STANDARDS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Specialist Service Delivery Across {city}
              </h2>
              <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                How EntireFM ensures consistent quality, safety, and accountability:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Directly Employed & Trained Operatives',
                  desc: `Uniformed, background-checked personnel equipped with professional equipment and trained to high industry standards.`,
                  tag: 'Quality Control',
                },
                {
                  title: 'RAMS & COSHH Compliance',
                  desc: 'Comprehensive risk assessments, method statements, and chemical data sheets submitted prior to every attendance.',
                  tag: 'Health & Safety',
                },
                {
                  title: 'Auditable Digital Sign-Off',
                  desc: 'Photographic before-and-after evidence packs and digital service sheets uploaded directly to your client portal.',
                  tag: 'Digital Evidence',
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-sm p-7 shadow-sm flex flex-col justify-between hover:border-brand-pink/40 hover:shadow-md transition-all group"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-pink font-semibold block mb-2">
                      {card.tag}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-pink-dark transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>EntireFM Verified Standard</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. EDITORIAL SECTIONS (PRESERVING DEEP SEO CONTENT) */}
        {content.sections && content.sections.length > 0 && (
          <section className="py-20 bg-white border-b border-slate-200">
            <div className="container-custom">
              <div className="max-w-3xl mb-12">
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                    SCOPE &amp; SPECIFICATION
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {content.h1} — Detailed Information
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-600">
                  Tailored specifications for commercial, industrial, and retail environments across {city}.
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

        {/* 6. SERVICES WE DELIVER IN THIS CITY */}
        <LocationServiceGrid city={city} />

        {/* 7. SECTORS SUPPORTED IN THIS CITY */}
        <LocationSectorGrid city={city} sectors={cityData?.sectors} />

        {/* 8. DIGITAL CAFM PLATFORM SECTION */}
        <TechnologyCafmSection
          eyebrow={`DIGITAL VERIFICATION // ${city.toUpperCase()}`}
          title={`Photographic Proof & Compliance Records in ${city}`}
          subtitle={`Every completed task is time-stamped and logged with photographic proof in our CAFM portal.`}
        />

        {/* 9. WHY CHOOSE ENTIREFM IN THIS LOCATION */}
        <WhyChooseLocationGrid city={city} />

        {/* 10. WHERE WE WORK / DISTRICTS GRID */}
        {cityData && cityData.districts && cityData.districts.length > 0 && (
          <LocationCoverageGrid
            city={city}
            region={cityData.region}
            districts={cityData.districts}
            travelPattern={cityData.travelPattern}
          />
        )}

        {/* 11. INTERACTIVE POSTCODE COVERAGE CHECKER */}
        <section id="coverage-lookup" className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <PostcodeCoverageLookup initialCity={city} />
          </div>
        </section>

        {/* 12. VERIFIED CASE STUDIES */}
        {caseStudies.length > 0 && (
          <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
            <div className="container-custom space-y-12">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                    VERIFIED EVIDENCE
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

        {/* 13. ACCREDITATIONS CAROUSEL */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="container-custom">
            <AccreditationRail />
          </div>
        </section>

        {/* 14. FAQS ACCORDION */}
        {faqs.length > 0 && (
          <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
            <div className="container-custom max-w-4xl space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                    EXPERT GUIDANCE
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {content.h1} in {city} — FAQs
                </h2>
              </div>
              <FAQAccordion faqs={faqs} />
            </div>
          </section>
        )}

        {/* 15. STRUCTURED LOCAL EXPLORE LINKS BLOCK */}
        <LocationExploreBlock city={city} />

        {/* 16. PROPOSAL & CONVERSION SECTION */}
        <ServiceConversionSection
          serviceName={content.h1}
          headline={`Request a Quotation for ${content.h1} in ${city}`}
          subheadline={`Contact EntireFM for competitive, high-specification service delivery across ${city} and regional transport corridors.`}
          badgeText={`${city.toUpperCase()} SERVICE ENQUIRY`}
          ctaButtonText={`Request ${city} Quotation`}
          directDeskNote={`Connecting directly with our ${city} operations desk.`}
        />
      </main>

      <Footer />
    </div>
  );
}
