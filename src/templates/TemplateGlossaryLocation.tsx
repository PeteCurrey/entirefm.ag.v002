'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { LocationGlossaryData, LocalTermItem } from '@/data/glossary/location-terms';
import {
  MapPin,
  Building2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Layers,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

interface TemplateGlossaryLocationProps {
  data: LocationGlossaryData;
}

export function TemplateGlossaryLocation({ data }: TemplateGlossaryLocationProps) {
  if (!data) {
    return (
      <div className="bg-[#060A14] text-white min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-grow container-custom py-32 text-center space-y-4">
          <h1 className="text-3xl font-light">Location Glossary Not Found</h1>
          <p className="text-slate-400">The requested regional glossary page does not exist.</p>
          <Link href="/facilities-management-glossary" className="text-brand-pink underline">
            Return to National Glossary
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Glossary', url: '/facilities-management-glossary' },
    { name: `${data.city} FM Glossary`, url: `/facilities-management-glossary-${data.slug}` },
  ];

  // DefinedTermSet JSON-LD Schema
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: `EntireFM Facilities Management Glossary — ${data.city}`,
    description: `Plain-English explanations of facilities management, M&E engineering, and compliance terminology relevant to commercial estates in ${data.city}.`,
    hasDefinedTerm: data.localTerms.map((t: LocalTermItem) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.definition,
      inDefinedTermSet: `https://www.entirefm.com/facilities-management-glossary-${data.slug}`,
    })),
  };

  return (
    <div className="bg-[#060A14] text-white min-h-screen flex flex-col font-sans selection:bg-brand-pink selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* Schema Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />

        {/* ========================================================================= */}
        {/* 1. CINEMATIC HERO (85svh)                                                 */}
        {/* ========================================================================= */}
        <section className="relative min-h-[85svh] lg:min-h-[88svh] flex items-center justify-center bg-[#060A14] overflow-hidden pt-28 pb-16 sm:py-24 border-b border-brand-edge-dark">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/editorial/entirefm-client-review-2000w.webp"
              alt={`${data.city} Facilities Management Glossary`}
              fill
              priority
              className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.1]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/80 to-[#060A14]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060A14] via-[#060A14]/90 to-transparent" />
          </div>

          <div className="container-custom relative z-10 w-full">
            <div className="max-w-4xl space-y-6">
              
              <div className="mb-2">
                <Breadcrumbs items={breadcrumbs} className="text-slate-300 font-light text-xs" />
              </div>

              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm bg-white/10 backdrop-blur-md border border-white/15">
                <MapPin className="w-3.5 h-3.5 text-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-white/90 font-medium">
                  {data.region} · {data.city} Estate Standards
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.06]">
                Facilities Management Glossary: <br />
                <span className="font-light text-hero-pink">
                  {data.city} &amp; {data.region}.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-3xl">
                A localized technical reference explaining commercial building engineering, statutory compliance requirements, and operational maintenance terminology for property directors across {data.city}.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/facilities-management-glossary"
                  className="bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-medium px-5 py-3 rounded-sm border border-white/20 transition-all inline-flex items-center gap-2"
                >
                  <BookOpen className="h-3.5 w-3.5 text-brand-pink" />
                  <span>National A–Z Glossary</span>
                </Link>
                {data.primaryServiceLinks && data.primaryServiceLinks.length > 0 && (
                  <Link
                    href={data.primaryServiceLinks[0].href}
                    className="bg-brand-pink hover:bg-brand-pink/90 text-white text-xs uppercase tracking-wider font-medium px-5 py-3 rounded-sm transition-all inline-flex items-center gap-2 shadow-elevated"
                  >
                    <span>{data.city} FM Services</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. LOCAL ESTATE CONTEXT & BUILDING STOCK FOCUS                            */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Left Context Column */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs uppercase tracking-wider text-brand-pink font-medium">
                    Estate Context
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                  What FM Terminology Matters in {data.city}?
                </h2>
                <p className="text-base text-slate-600 font-light leading-relaxed">
                  {data.localEstateContext}
                </p>
                <div className="p-6 rounded-sm bg-slate-50 border border-slate-200 space-y-2 shadow-sm">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-slate-900">
                    Regional Sector Dynamics:
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                    {data.sectorContext}
                  </p>
                </div>
              </div>

              {/* Right Property Stock Focus */}
              <div className="lg:col-span-6 p-8 sm:p-10 rounded-sm bg-brand-carbon text-white border border-brand-edge-dark space-y-6 shadow-elevated">
                <div className="flex items-center justify-between border-b border-brand-edge-dark pb-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-brand-pink">
                    Dominant Commercial Building Stock in {data.city}
                  </span>
                  <Layers className="h-4 w-4 text-brand-pink" />
                </div>
                <ul className="space-y-4">
                  {data.propertyStockFocus.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-brand-pink shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. LOCATION-SPECIFIC FM DEFINITIONS                                       */}
        {/* ========================================================================= */}
        <section className="py-24 bg-[#0B1220] text-white border-b border-brand-edge-dark">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
                  Location-Specific Concepts
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extralight text-white tracking-tight">
                {data.city} Property &amp; Engineering Definitions
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
                Key operational terms, statutory compliance factors, and logistics standards specific to commercial estates in {data.city} and the wider {data.region}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.localTerms.map((termItem: LocalTermItem, idx: number) => (
                <article
                  key={idx}
                  className="p-8 rounded-sm bg-brand-carbon border border-brand-edge-dark shadow-elevated space-y-4 hover:border-brand-pink transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <h3 className="text-2xl font-light text-white tracking-tight">
                      {termItem.term}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      {termItem.definition}
                    </p>
                    <div className="p-4 rounded-sm bg-black/40 border border-brand-edge-dark text-xs leading-relaxed text-slate-300 space-y-1">
                      <span className="font-medium text-brand-pink block text-[11px] uppercase tracking-wider">
                        Operational Relevance in {data.city}:
                      </span>
                      <p className="font-light">{termItem.localRelevance}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. LOCAL SERVICE COVERAGE                                                 */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              <div className="lg:col-span-6 space-y-6">
                <h3 className="text-2xl font-light text-slate-900 tracking-tight flex items-center gap-2.5">
                  <MapPin className="h-5 w-5 text-brand-pink" />
                  {data.city} Commercial Services
                </h3>
                <p className="text-sm text-slate-600 font-light leading-relaxed">
                  Explore full commercial service specifications, engineering coverage, and contract models delivered by EntireFM in {data.city}:
                </p>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-sm bg-slate-50">
                  {data.primaryServiceLinks && data.primaryServiceLinks.map((link: { label: string; href: string }, idx: number) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="p-4 flex items-center justify-between hover:bg-white transition-colors group"
                    >
                      <span className="text-xs sm:text-sm font-light text-slate-900 group-hover:text-brand-pink transition-colors">
                        {link.label}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                  <Link
                    href="/facilities-management-glossary"
                    className="p-4 flex items-center justify-between hover:bg-white transition-colors group bg-brand-pink/5"
                  >
                    <span className="text-xs sm:text-sm font-medium text-brand-pink">
                      View All National Glossary Terms (A–Z)
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-brand-pink" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <h3 className="text-2xl font-light text-slate-900 tracking-tight flex items-center gap-2.5">
                  <Building2 className="h-5 w-5 text-brand-pink" />
                  Regional Standards &amp; FAQs
                </h3>
                <div className="space-y-4">
                  {data.faqs && data.faqs.map((faq: { question: string; answer: string }, idx: number) => (
                    <div key={idx} className="p-6 rounded-sm border border-slate-200 bg-slate-50 space-y-2 shadow-sm">
                      <h4 className="text-sm sm:text-base font-light text-slate-900">{faq.question}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        <ProposalSection
          headline={`Discuss Facilities Management for Your ${data.city} Estate`}
          subheadline={`Speak directly with EntireFM's regional operations team about planned maintenance, statutory compliance, or single-source estate management across ${data.city}.`}
        />
      </main>

      <Footer />
    </div>
  );
}
