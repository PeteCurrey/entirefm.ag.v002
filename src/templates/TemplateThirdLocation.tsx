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
import { ArrowRight, CheckCircle2, ShieldCheck, Building2, Layers, AlertCircle } from 'lucide-react';
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

  // Resolve third city-specific photography from approved manifest (commercial estate / front of house / reception)
  const cityImages = (locationImages.cities as Record<string, any>)[citySlug]?.images || [];
  const heroImage = cityImages.length > 2
    ? cityImages[2].src
    : cityImages.length > 0
    ? cityImages[0].src
    : '/images/editorial/entirefm-corporate-corridor-2000w.webp';
  const heroImageAlt = cityImages.length > 2
    ? cityImages[2].alt
    : `EntireFM commercial facilities management and property estate maintenance in ${city}`;

  const heroFacts = [
    { label: 'Commercial Portfolio Management', value: 'Multi-Tenant Care' },
    { label: 'Service Charge Accounting', value: 'Itemised Proof Packs' },
    { label: 'Landlord & Tenant Demises', value: 'Clear Demarcation' },
  ];

  const snapshotPriorities = [
    { title: 'Commercial Portfolio Care', subtitle: `Multi-tenant office towers, retail parks and business parks across ${city}`, iconName: 'commercialBuildings' as const },
    { title: 'Transparent Service Charges', subtitle: 'Indisputable digital work order evidence packs and RICS cost allocation', iconName: 'proposalReporting' as const },
    { title: 'Front of House & Fabric', subtitle: 'Reception, concierge, security turnstiles, and daily janitorial care', iconName: 'commercialCleaning' as const },
    { title: 'Dedicated Account Manager', subtitle: 'One technical point of contact eliminating contractor finger-pointing', iconName: 'teamManagement' as const },
  ];

  const caseStudies = listPublishedCaseStudies();

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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. CINEMATIC COMMERCIAL ESTATE HERO */}
        <ServiceHero
          eyebrow={`COMMERCIAL FACILITIES & MANAGING AGENTS // ${city.toUpperCase()}`}
          title={content.h1}
          highlightedTitle="Commercial Property Management"
          intro={content.heroIntro || `Strategic facilities management partnership for commercial landlords, chartered surveyors, and managing agents across ${city}. Single-source accountability for Hard & Soft FM.`}
          imageSrc={heroImage}
          imageAlt={heroImageAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: `Discuss Your ${city} Portfolio`, href: '#enquiry' }}
          secondaryCta={{ label: 'Verify Site Postcode', href: '#coverage-lookup' }}
          serviceFacts={heroFacts}
        />

        {/* 2. TRUST / ACCREDITATIONS BAR */}
        <TrustBar />

        {/* 3. LOCAL SNAPSHOT STRIP */}
        <SectorSnapshot
          leadText={`Consolidated commercial facilities management engineered for multi-tenant offices, business parks, and managed commercial estates across ${city}.`}
          priorities={snapshotPriorities}
        />

        {/* 4. COMMERCIAL ESTATE VALUE PILLARS */}
        <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <div className="max-w-3xl mb-14">
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                  PORTFOLIO GOVERNANCE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Integrated Commercial Estate Management in {city}
              </h2>
              <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                Streamlining estate operations, protecting building asset value, and satisfying tenant expectations:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Common-Parts Maintenance & M&E',
                  desc: 'Maintaining shared chillers, central risers, life safety systems, and stairwells to high institutional standards.',
                  tag: 'Hard FM',
                },
                {
                  title: 'Service Charge Proof & Transparency',
                  desc: 'Indisputable work order evidence packs with photographic proof simplifying year-end tenant reconciliations.',
                  tag: 'RICS Aligned',
                },
                {
                  title: 'Front of House & Daily Hygiene',
                  desc: 'High-frequency janitorial care, pristine executive washrooms, window cleaning, and welcoming concierge presentation.',
                  tag: 'Soft Services',
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
                    <span>EntireFM Commercial Standard</span>
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
                    ESTATE MANAGEMENT
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Commercial Facilities Solutions Across {city}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-600">
                  Total facilities management for landlords, asset managers, and corporate occupiers across regional commercial estates.
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
          eyebrow={`DIGITAL ESTATE PORTAL // ${city.toUpperCase()}`}
          title={`Managing Agent & Landlord Portal for ${city} Properties`}
          subtitle={`Multi-demise access, live maintenance tickets, and complete compliance certification tracking from a single dashboard.`}
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
                    MANAGING AGENT GUIDANCE
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Commercial Property FM in {city} — FAQs
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
          serviceName={`Commercial Facilities Management ${city}`}
          headline={`Request a Commercial Estate Proposal for Your ${city} Property`}
          subheadline={`Consult directly with EntireFM commercial directors. We manage multi-tenant offices, business parks, and landlord common parts across ${city}.`}
          badgeText={`${city.toUpperCase()} COMMERCIAL FM`}
          ctaButtonText={`Request ${city} Proposal`}
          directDeskNote={`Connecting directly with our commercial managing agent desk.`}
        />
      </main>

      <Footer />
    </div>
  );
}
