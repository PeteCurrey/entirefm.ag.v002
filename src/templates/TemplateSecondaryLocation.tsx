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
import { ArrowRight, CheckCircle2, ShieldCheck, FileCheck2, Wrench, Layers, AlertCircle } from 'lucide-react';
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

  // Resolve secondary city-specific photography from approved manifest (rooftop / survey / plantroom)
  const cityImages = (locationImages.cities as Record<string, any>)[citySlug]?.images || [];
  const heroImage = cityImages.length > 1
    ? cityImages[1].src
    : cityImages.length > 0
    ? cityImages[0].src
    : '/images/editorial/entirefm-switchroom-survey-2000w.webp';
  const heroImageAlt = cityImages.length > 1
    ? cityImages[1].alt
    : `EntireFM planned preventative maintenance and asset surveys in ${city}`;

  const heroFacts = [
    { label: 'SFG20 Maintenance Schedules', value: 'Manufacturer Aligned' },
    { label: 'Statutory Compliance Vault', value: '100% Digital Audit' },
    { label: 'Asset Condition Surveys', value: 'Lifecycle Planning' },
  ];

  const snapshotPriorities = [
    { title: 'SFG20 Preventative Regimes', subtitle: `Asset-led maintenance schedules protecting warranty and life in ${city}`, iconName: 'maintenanceTools' as const },
    { title: 'Statutory Testing Certification', subtitle: 'EICR, Gas CP12, Fire alarms, TMV & Legionella logs archived digitally', iconName: 'complianceAudit' as const },
    { title: 'Condition Surveys & Baseline', subtitle: 'Every contract mobilised from a physical verified site asset survey', iconName: 'dataInsights' as const },
    { title: 'Contracted Reactive Backup', subtitle: '24/7 emergency dispatch for contracted planned maintenance estates', iconName: 'twentyFourSevenOps' as const },
  ];

  const caseStudies = listPublishedCaseStudies();

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `How does EntireFM structure planned preventative maintenance (PPM) in ${city}?`,
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. CINEMATIC PPM HERO */}
        <ServiceHero
          eyebrow={`PLANNED MAINTENANCE & COMPLIANCE // ${city.toUpperCase()}`}
          title={content.h1}
          highlightedTitle="Planned Preventative Maintenance"
          intro={content.heroIntro || `Asset reliability and statutory safety in ${city}. Built from verified physical surveys, SFG20 maintenance regimes, and auditable digital compliance.`}
          imageSrc={heroImage}
          imageAlt={heroImageAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: `Arrange a ${city} Asset Survey`, href: '#enquiry' }}
          secondaryCta={{ label: 'Verify Site Postcode', href: '#coverage-lookup' }}
          serviceFacts={heroFacts}
        />

        {/* 2. TRUST / ACCREDITATIONS BAR */}
        <TrustBar />

        {/* 3. LOCAL SNAPSHOT STRIP */}
        <SectorSnapshot
          leadText={`Preventative facilities maintenance engineered to eliminate unplanned downtime, guarantee statutory safety, and protect building asset value across ${city}.`}
          priorities={snapshotPriorities}
        />

        {/* 4. PPM OPERATIONAL FRAMEWORK */}
        <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <div className="max-w-3xl mb-14">
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                  THE PPM ENGINEERING METHODOLOGY
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                How Planned Maintenance Works in {city}
              </h2>
              <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                From initial barcode asset tagging to SFG20 task execution and instant certification archival:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Site Asset Survey', desc: `Every HVAC unit, switchboard, pump and fire asset in your ${city} building is catalogued and condition-graded.` },
                { step: '02', title: 'SFG20 Task Mapping', desc: 'Maintenance frequencies aligned to statutory requirements, manufacturer guidelines, and operating access hours.' },
                { step: '03', title: 'Direct Engineer Execution', desc: 'Directly employed certified technicians carry out planned servicing, electrical testing, and filter changes.' },
                { step: '04', title: 'Digital Audit Archival', desc: 'Test certificates, remedial recommendations, and timestamped logs uploaded directly to your CAFM dashboard.' },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-sm p-6 flex flex-col justify-between hover:border-brand-pink/40 hover:shadow-md transition-all group"
                >
                  <div>
                    <span className="text-2xl font-black font-mono text-brand-pink/80 group-hover:text-brand-pink transition-colors">
                      {s.step}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2 mb-2 group-hover:text-brand-pink-dark transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Phase {s.step} Process
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
                    STATUTORY COMPLIANCE &amp; SCOPES
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Planned Facilities Governance Across {city}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-600">
                  Structured maintenance schedules protecting electrical systems, heating, cooling, life safety, and building fabric.
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
          eyebrow={`CAFM & COMPLIANCE // ${city.toUpperCase()}`}
          title={`Digital Asset Registers & Live Statutory Compliance in ${city}`}
          subtitle={`Audit-proof compliance records for fire, electrical, HVAC, gas, and water hygiene accessible 24/7 from any device.`}
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
                    EXPERT GUIDANCE
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Planned Maintenance &amp; Compliance in {city} — FAQs
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
          serviceName={`Planned Preventative Maintenance ${city}`}
          headline={`Schedule a Professional Asset Survey in ${city}`}
          subheadline={`Our senior engineers audit your plantroom, electrical distribution, and HVAC systems to build an SFG20-compliant maintenance matrix.`}
          badgeText={`${city.toUpperCase()} PPM CONSULTATION`}
          ctaButtonText={`Request ${city} PPM Proposal`}
          directDeskNote={`Connecting directly with our ${city} engineering team.`}
        />
      </main>

      <Footer />
    </div>
  );
}
