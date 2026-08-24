'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { SectorSnapshot } from '@/components/sectors/SectorSnapshot';
import { SectorChallenges } from '@/components/sectors/SectorChallenges';
import { SectorSystems } from '@/components/sectors/SectorSystems';
import { SectorOperatingModel } from '@/components/sectors/SectorOperatingModel';
import { TechnologyCafmSection } from '@/components/services/TechnologyCafmSection';
import { SectorRelatedServices } from '@/components/sectors/SectorRelatedServices';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { resolveSectorArchetype } from '@/data/sectors/archetypes';
import { listPublishedCaseStudies } from '@/server/trust/case-studies';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, FileCheck2, HelpCircle } from 'lucide-react';
import type { TemplateProps } from './types';

export function TemplateSector({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Sectors', url: '/sectors' },
    { name: content.h1, url: route.path },
  ];

  // Resolve sector archetype profile
  const archetype = resolveSectorArchetype(route.path);
  const caseStudies = listPublishedCaseStudies();

  // Sector content components with fallbacks preserving existing SEO data
  const rawCapabilities = content.capabilities || [];
  const faqs = content.faqs && content.faqs.length > 0 ? content.faqs : [
    {
      question: `How does EntireFM structure facilities management for ${archetype.name} estates?`,
      answer: `We deliver dedicated Hard and Soft FM structured around site-specific access windows, production schedules, or trading hours, backed by SFG20 preventative maintenance routines and complete digital compliance certification in EntireCAFM.`,
    },
    {
      question: 'How do you handle out-of-hours or emergency breakdowns?',
      answer: 'Our central 24/7 operations desk coordinates directly employed mobile engineers with contracted response SLAs tailored to your critical plant priorities.',
    },
    {
      question: 'Can you consolidate existing multi-supplier contracts into a single agreement?',
      answer: 'Yes. EntireFM frequently acts as the single-source facilities management partner, self-delivering core M&E, HVAC, building maintenance, and cleaning under one consolidated SLA and transparent monthly reporting framework.',
    },
  ];

  // Map related services
  const relatedServices = archetype.relatedServiceSlugs;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. SECTOR CINEMATIC HERO */}
        <ServiceHero
          eyebrow={archetype.heroBadge}
          title={content.h1}
          highlightedTitle={content.h1.includes('—') ? undefined : archetype.heroHighlightedTitle}
          intro={content.heroIntro || content.metaDescription}
          imageSrc={archetype.heroImage}
          imageAlt={archetype.heroImageAlt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Discuss Your Estate', href: '#enquiry' }}
          secondaryCta={{ label: 'Speak with an Operations Director', href: '#enquiry' }}
          serviceFacts={archetype.heroFacts}
        />

        {/* 2. TRUST / ACCREDITATIONS BAR */}
        <TrustBar />

        {/* 3. INTRODUCTORY SECTOR SNAPSHOT */}
        <SectorSnapshot
          leadText={archetype.snapshotLead}
          priorities={archetype.snapshotPriorities}
        />

        {/* 4. OPERATING CONTEXT & EDITORIAL CONTENT (PRESERVE ALL EXISTING SEO CONTENT) */}
        {content.sections && content.sections.length > 0 && (
          <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
            <div className="container-custom">
              <div className="max-w-3xl mb-12">
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                    ESTATE CONTEXT &amp; OPERATIONAL DEMAND
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Tailored Facilities Governance for {archetype.name}
                </h2>
                <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                  Understanding what actually matters across the physical estate: uptime, safety, regulatory compliance, and occupant satisfaction.
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

        {/* 5. SECTOR-SPECIFIC FACILITIES SYSTEM (4-COLUMN ARCHITECTURE) */}
        <SectorSystems
          eyebrow="ENGINEERED SCOPES & DISCIPLINES"
          headline={archetype.systemsHeadline}
          subheadline={archetype.systemsSubline}
          groups={archetype.systemGroups}
        />

        {/* 6. OPERATIONAL CHALLENGES & ENTIREFM MITIGATION */}
        <SectorChallenges
          eyebrow="OPERATIONAL CHALLENGES & VULNERABILITY MITIGATION"
          headline={archetype.challengesHeadline}
          subheadline={archetype.challengesSubline}
          challenges={archetype.challenges}
        />

        {/* 7. VISUAL OPERATING MODEL (5-STAGE FLOW) */}
        <SectorOperatingModel
          eyebrow="DELIVERY METHODOLOGY"
          headline={archetype.operatingModelHeadline}
          subheadline={archetype.operatingModelSubline}
          steps={archetype.operatingSteps}
        />

        {/* 8. TECHNOLOGY & CAFM REPORTING SECTION */}
        <TechnologyCafmSection
          eyebrow={archetype.technologyFocus.badge}
          title={archetype.technologyFocus.title}
          subtitle={archetype.technologyFocus.description}
        />

        {/* 9. PROOF / NUMBERS / VERIFIED KPI METRICS */}
        <section className="py-16 bg-slate-900 border-b border-slate-800 text-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {archetype.metrics.map((m, idx) => (
                <div key={idx} className="p-6 md:p-8 text-center sm:text-left space-y-2">
                  <div className="text-3xl sm:text-4xl font-extrabold text-brand-pink-light font-mono">
                    {m.figure}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-white">
                    {m.label}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {m.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. TENDER / PROCUREMENT BRIEF TOOL ADVISORY */}
        <section className="py-16 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <div className="bg-white border border-slate-200/90 rounded-sm p-8 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <div className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                    PROCUREMENT &amp; TENDER PLANNING
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Structuring an FM Invitation to Tender (ITT) for Your Estate?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Use our free interactive Tender Brief Generator to specify plant assets, maintenance frequencies, access windows, and contracted SLA KPIs.
                </p>
              </div>

              <Link
                href="/tools/tender-brief"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 px-5 py-3 rounded-sm shadow-sm transition-all whitespace-nowrap"
              >
                <FileCheck2 className="w-4 h-4 text-brand-pink-light" />
                <span>Open Tender Brief Generator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 11. VERIFIED CASE STUDY PROOF */}
        {caseStudies.length > 0 && (
          <section className="py-20 bg-white border-b border-slate-200">
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
                    className="bg-[#FAF9FB] p-6 rounded-sm border border-slate-200/90 flex flex-col justify-between shadow-sm hover:border-brand-pink/40 hover:shadow-md transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-pink font-semibold">
                          {cs.sector}
                        </span>
                        <span className="text-[10px] font-mono text-slate-600 font-bold bg-slate-200/70 px-2 py-0.5 rounded-sm">
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

                    <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
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

        {/* 12. ACCREDITATIONS CAROUSEL */}
        <section className="py-12 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <AccreditationRail />
          </div>
        </section>

        {/* 13. SECTOR FAQS ACCORDION */}
        {faqs.length > 0 && (
          <section className="py-20 bg-white border-b border-slate-200">
            <div className="container-custom max-w-4xl space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                    EXPERT GUIDANCE
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Frequently Asked Questions — {archetype.name}
                </h2>
              </div>
              <FAQAccordion faqs={faqs} />
            </div>
          </section>
        )}

        {/* 14. RELATED SERVICES DISCIPLINE LINKS */}
        <SectorRelatedServices
          services={relatedServices}
          allSectorsHref="/sectors"
        />

        {/* 15. SECTOR-SPECIFIC CONVERSION & PROPOSAL SECTION */}
        <ServiceConversionSection
          serviceName={content.h1}
          headline={archetype.conversionCta.headline}
          subheadline={archetype.conversionCta.subheadline}
          badgeText={archetype.conversionCta.badgeText}
          ctaButtonText="Request Sector Proposal"
          directDeskNote="Connect directly with an Operations Director or Regional Engineering Manager."
        />
      </main>

      <Footer />
    </div>
  );
}
