'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { LocationGlossaryData, LOCATION_GLOSSARY_DATA } from '@/data/glossary/location-terms';
import {
  BookOpen,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Building2,
  CheckCircle2,
  Layers,
  HelpCircle,
  Wrench,
} from 'lucide-react';

export function TemplateGlossaryLocation({ data }: { data: LocationGlossaryData }) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Glossary', url: '/facilities-management-glossary' },
    { name: `${data.city} FM Terms`, url: `/facilities-management-glossary-${data.slug}` },
  ];

  // Related locations from data
  const relatedLocations = data.relatedCitySlugs
    .map((slug) => LOCATION_GLOSSARY_DATA[slug])
    .filter(Boolean);

  // DefinedTermSet JSON-LD Schema
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: `EntireFM ${data.city} Facilities Management Glossary`,
    description: data.metaDescription,
    hasDefinedTerm: data.localTerms.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.definition,
      inDefinedTermSet: `https://www.entirefm.com/facilities-management-glossary-${data.slug}`,
    })),
  };

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header solid />
      <main id="main" className="flex-1">
        {/* Schema Scripts */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Hero Section */}
        <section className="on-dark relative isolate flex w-full flex-col overflow-hidden bg-brand-graphite pt-[calc(var(--header-h)+1rem)] pb-16 sm:pb-20">
          <div className="container-custom">
            <Breadcrumbs items={breadcrumbs} />

            <div className="max-w-4xl mt-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/[0.07] border border-white/15 backdrop-blur-sm mb-6">
                <MapPin className="h-4 w-4 text-brand-pink-light" />
                <span className="text-xs font-normal uppercase tracking-wider text-brand-pink-light">
                  {data.city.toUpperCase()} COMMERCIAL ESTATE STANDARDS · {data.region.toUpperCase()}
                </span>
              </div>

              <h1 className="text-display-xl text-white">
                {data.h1}
              </h1>

              <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-brand-mist/80">
                {data.intro}
              </p>

              {/* Breadcrumb back to National A-Z */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/facilities-management-glossary"
                  className="btn-ghost-light text-xs font-normal inline-flex items-center gap-2"
                >
                  <BookOpen className="h-3.5 w-3.5 text-brand-pink-light" />
                  <span>View Full National A–Z FM Glossary</span>
                </Link>
                {data.primaryServiceLinks.length > 0 && (
                  <Link
                    href={data.primaryServiceLinks[0].href}
                    className="btn-hero-pink text-xs font-normal inline-flex items-center gap-2"
                  >
                    <span>{data.city} Facilities Management</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Local Estate Context & Building Stock */}
        <section className="section bg-white border-b border-brand-edge">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Context */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-surface border border-brand-edge">
                  <Building2 className="h-3.5 w-3.5 text-brand-pink" />
                  <span className="text-[11px] font-normal uppercase tracking-wider text-brand-graphite">
                    ESTATE CONTEXT
                  </span>
                </div>
                <h2 className="text-display-md text-brand-graphite font-extralight tracking-tight">
                  What FM Terminology Matters in {data.city}?
                </h2>
                <p className="text-[15px] leading-relaxed text-slate-700">
                  {data.localEstateContext}
                </p>
                <div className="p-5 rounded-sm bg-brand-surface border border-brand-edge space-y-2">
                  <h3 className="text-xs font-normal uppercase tracking-wider text-brand-graphite">
                    Local Sector Dynamics:
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {data.sectorContext}
                  </p>
                </div>
              </div>

              {/* Right Property Stock List */}
              <div className="lg:col-span-6 p-7 rounded-sm bg-brand-graphite text-white border border-brand-edge-dark space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-normal uppercase tracking-wider text-brand-pink-light">
                    Dominant Building Stock in {data.city}
                  </span>
                  <Layers className="h-4 w-4 text-brand-pink" />
                </div>
                <ul className="space-y-3">
                  {data.propertyStockFocus.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-[13px] text-brand-mist/90">
                      <CheckCircle2 className="h-4 w-4 text-brand-pink shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Local FM Terms */}
        <section className="section bg-brand-surface border-b border-brand-edge">
          <div className="container-custom">
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white border border-brand-edge mb-4">
                <Wrench className="h-3.5 w-3.5 text-brand-pink" />
                <span className="text-[11px] font-normal uppercase tracking-wider text-brand-graphite">
                  LOCATION-SPECIFIC FM CONCEPTS
                </span>
              </div>
              <h2 className="text-display-md text-brand-graphite font-extralight tracking-tight">
                {data.city} Property & Engineering Definitions
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Key operational terms, statutory compliance factors, and logistics standards specific to commercial estates in {data.city} and the {data.region}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.localTerms.map((termItem, idx) => (
                <article
                  key={idx}
                  className="p-6 sm:p-7 rounded-sm bg-white border border-brand-edge shadow-subtle space-y-4 hover:border-brand-pink/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-light text-brand-graphite tracking-tight">
                      {termItem.term}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-normal text-slate-800 leading-relaxed">
                      {termItem.definition}
                    </p>
                    <div className="p-3.5 rounded-sm bg-brand-surface border border-brand-edge/60 text-xs leading-relaxed text-slate-600">
                      <span className="font-light text-brand-graphite block mb-1">
                        Operational relevance in {data.city}:
                      </span>
                      {termItem.localRelevance}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Local Services & Regional Links */}
        <section className="section bg-white border-b border-brand-edge">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Primary Location Service Links */}
              <div className="lg:col-span-6 space-y-5">
                <h3 className="text-lg font-light text-brand-graphite tracking-tight flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-pink" />
                  {data.city} Commercial Services
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Explore full commercial service specifications, engineering coverage, and contract models delivered by EntireFM in {data.city}:
                </p>
                <div className="divide-y divide-brand-edge border border-brand-edge rounded-sm">
                  {data.primaryServiceLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="p-3.5 flex items-center justify-between hover:bg-brand-surface transition-colors group"
                    >
                      <span className="text-xs font-normal text-brand-graphite group-hover:text-brand-pink transition-colors">
                        {link.label}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                  <Link
                    href="/facilities-management-glossary"
                    className="p-3.5 flex items-center justify-between hover:bg-brand-surface transition-colors group bg-brand-surface/40"
                  >
                    <span className="text-xs font-normal text-brand-pink">
                      View All National Glossary Terms (A–Z)
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-brand-pink" />
                  </Link>
                </div>
              </div>

              {/* Related Regional Markets */}
              {relatedLocations.length > 0 && (
                <div className="lg:col-span-6 space-y-5">
                  <h3 className="text-lg font-light text-brand-graphite tracking-tight flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-brand-pink" />
                    Related Regional Glossary Hubs
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Compare building maintenance terminology across neighbouring commercial markets in the {data.region}:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {relatedLocations.map((relLoc) => (
                      <Link
                        key={relLoc.slug}
                        href={`/facilities-management-glossary-${relLoc.slug}`}
                        className="p-3 rounded-sm border border-brand-edge hover:border-brand-pink/50 hover:bg-brand-surface transition-colors flex items-center justify-between group"
                      >
                        <span className="text-xs font-normal text-slate-700 group-hover:text-brand-pink">
                          {relLoc.city} FM Terms
                        </span>
                        <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-brand-pink" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Location FAQs */}
        {data.faqs.length > 0 && (
          <section className="section bg-brand-surface border-b border-brand-edge">
            <div className="container-custom max-w-4xl">
              <div className="max-w-2xl mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white border border-brand-edge mb-3">
                  <HelpCircle className="h-3.5 w-3.5 text-brand-pink" />
                  <span className="text-[11px] font-normal uppercase tracking-wider text-brand-graphite">
                    {data.city.toUpperCase()} FAQ
                  </span>
                </div>
                <h2 className="text-display-md text-brand-graphite font-extralight tracking-tight">
                  Frequently Asked Questions about {data.city} FM
                </h2>
              </div>

              <div className="space-y-4">
                {data.faqs.map((faq, idx) => (
                  <div key={idx} className="p-6 rounded-sm bg-white border border-brand-edge shadow-subtle space-y-2">
                    <h3 className="text-base font-light text-brand-graphite">
                      {faq.question}
                    </h3>
                    <p className="text-xs sm:text-[13.5px] text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <ProposalSection
          headline={`Discuss facilities management for your ${data.city} estate`}
          subheadline={`Speak to our technical team about single-site maintenance, regional portfolio coverage, or statutory compliance reviews in ${data.city}.`}
        />
      </main>
      <Footer />
    </div>
  );
}
