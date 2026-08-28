'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NATIONAL_GLOSSARY_TERMS, GlossaryTerm } from '@/data/glossary/national-terms';
import { LOCATION_GLOSSARY_DATA } from '@/data/glossary/location-terms';
import {
  Search,
  BookOpen,
  ArrowRight,
  MapPin,
  Filter,
} from 'lucide-react';

export function TemplateGlossaryNational() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Glossary', url: '/facilities-management-glossary' },
  ];

  const categories = useMemo(() => {
    const cats = new Set<string>();
    NATIONAL_GLOSSARY_TERMS.forEach((t) => cats.add(t.category));
    return Array.from(cats);
  }, []);

  const alphabet = useMemo(() => {
    const letters = new Set<string>();
    NATIONAL_GLOSSARY_TERMS.forEach((t) => letters.add(t.term[0].toUpperCase()));
    return Array.from(letters).sort();
  }, []);

  const filteredTerms = useMemo(() => {
    return NATIONAL_GLOSSARY_TERMS.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shortDefinition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.detailedExplanation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLetter =
        selectedLetter === null || item.term[0].toUpperCase() === selectedLetter;

      const matchesCategory =
        selectedCategory === null || item.category === selectedCategory;

      return matchesSearch && matchesLetter && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchTerm, selectedLetter, selectedCategory]);

  // Group locations by region for the hub directory
  const locationsByRegion = useMemo(() => {
    const groups: Record<string, Array<{ city: string; slug: string }>> = {};
    Object.values(LOCATION_GLOSSARY_DATA).forEach((loc) => {
      if (!groups[loc.region]) groups[loc.region] = [];
      groups[loc.region].push({ city: loc.city, slug: loc.slug });
    });
    return groups;
  }, []);

  // DefinedTermSet JSON-LD Schema
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'EntireFM Facilities Management Glossary',
    description: 'Plain-English explanations of common facilities management, M&E engineering, statutory compliance, and building maintenance terminology across the UK.',
    hasDefinedTerm: NATIONAL_GLOSSARY_TERMS.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.shortDefinition,
      inDefinedTermSet: 'https://www.entirefm.com/facilities-management-glossary',
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
              alt="Facilities Management Glossary — Technical Dictionary"
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
                <span className="w-2 h-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-white/90 font-medium">
                  Technical Reference Dictionary
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.06]">
                Facilities Management <br />
                <span className="font-light text-hero-pink">
                  Glossary &amp; Terminology.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-3xl">
                Plain-English technical definitions of commercial building engineering, SFG20 planned preventative maintenance, statutory compliance legislation, and estate management standards.
              </p>

              {/* Live Search Input */}
              <div className="pt-2 relative max-w-2xl">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search FM terms (e.g. PPM, SFG20, EICR, CAFM, TM44, BMS, ACOP L8)..."
                    className="w-full h-14 rounded-sm border border-white/20 bg-brand-carbon/90 backdrop-blur-md pl-12 pr-12 text-sm text-white placeholder-slate-400 focus:border-brand-pink focus:outline-none shadow-elevated"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 text-xs text-slate-400 hover:text-white font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. STICKY A-Z ALPHA BAR & CATEGORY SELECTOR                               */}
        {/* ========================================================================= */}
        <section className="bg-white border-b border-slate-200 py-4 sticky top-[var(--header-h)] z-20 shadow-sm backdrop-blur-md">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              {/* A-Z Alpha Bar */}
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLetter(null);
                    setSelectedCategory(null);
                  }}
                  className={`px-3 py-1.5 rounded-sm text-xs font-medium uppercase transition-colors ${
                    selectedLetter === null && selectedCategory === null
                      ? 'bg-brand-pink text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All ({NATIONAL_GLOSSARY_TERMS.length})
                </button>
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                    className={`w-7 h-7 rounded-sm text-xs font-medium uppercase flex items-center justify-center transition-colors ${
                      selectedLetter === letter
                        ? 'bg-brand-pink text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* Category Dropdown */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? e.target.value : null)}
                  className="w-full md:w-auto text-xs px-3 py-2 rounded-sm border border-slate-200 bg-slate-50 text-slate-900 font-light focus:border-brand-pink focus:outline-none"
                >
                  <option value="">All Categories ({categories.length})</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. TECHNICAL GLOSSARY DEFINITIONS                                         */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white text-slate-900 border-b border-slate-200">
          <div className="container-custom space-y-12">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Displaying {filteredTerms.length} of {NATIONAL_GLOSSARY_TERMS.length} verified facilities management definitions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredTerms.map((item) => (
                <article
                  key={item.slug}
                  id={item.slug}
                  className="p-8 rounded-sm border border-slate-200 bg-slate-50 hover:border-brand-pink transition-all flex flex-col justify-between space-y-6 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                      <h2 className="text-2xl font-light text-slate-900 tracking-tight">
                        {item.term}
                      </h2>
                      <span className="px-2.5 py-1 rounded-sm bg-white border border-slate-200 text-[10px] font-medium uppercase tracking-wider text-slate-600 shrink-0">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-base font-normal text-slate-900 leading-relaxed">
                      {item.shortDefinition}
                    </p>

                    <div className="text-sm leading-relaxed text-slate-600 font-light pt-2">
                      <p>{item.detailedExplanation}</p>
                    </div>

                    <div className="p-4 rounded-sm bg-white border border-slate-200 text-xs sm:text-[13px] leading-relaxed text-slate-700 space-y-1">
                      <span className="font-medium text-slate-900 block text-xs uppercase tracking-wider">
                        Operational Significance:
                      </span>
                      <p className="font-light">{item.whyItMatters}</p>
                    </div>

                    {item.relatedTerms.length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-medium text-slate-500 mr-1">Related Terms:</span>
                        {item.relatedTerms.map((rt) => (
                          <span
                            key={rt}
                            className="px-2 py-0.5 rounded-sm bg-slate-200 text-[11px] text-slate-800 font-light"
                          >
                            {rt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {item.serviceLink && (
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                      <Link
                        href={item.serviceLink.href}
                        className="inline-flex items-center gap-1.5 text-brand-pink hover:text-slate-900 font-medium transition-colors"
                      >
                        <span>{item.serviceLink.label}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <span className="text-[11px] text-slate-400 font-light">EntireFM Delivery</span>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {filteredTerms.length === 0 && (
              <div className="p-16 text-center border border-slate-200 rounded-sm bg-slate-50 space-y-4">
                <BookOpen className="h-10 w-10 text-slate-400 mx-auto" />
                <h3 className="text-xl font-light text-slate-900">No definitions found</h3>
                <p className="text-sm text-slate-600 font-light max-w-md mx-auto">
                  No term matches your active search or filter. Reset your criteria to inspect the full dictionary.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLetter(null);
                    setSelectedCategory(null);
                  }}
                  className="bg-brand-pink text-white text-xs uppercase tracking-wider font-medium px-5 py-2.5 rounded-sm"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. REGIONAL GLOSSARY DIRECTORY                                            */}
        {/* ========================================================================= */}
        <section className="py-24 bg-[#0B1220] text-white border-b border-brand-edge-dark">
          <div className="container-custom space-y-16">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
                  Regional Standards &amp; Context
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-white leading-tight">
                Facilities Terminology by UK Location
              </h2>
              <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
                Explore dedicated regional glossary guides explaining how local building services, heritage restrictions, ULEZ transport regulations, and manufacturing requirements impact FM delivery in specific UK cities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(locationsByRegion).map(([regionName, cityList]) => (
                <div
                  key={regionName}
                  className="p-8 rounded-sm bg-brand-carbon border border-brand-edge-dark space-y-6 shadow-elevated"
                >
                  <div className="border-b border-brand-edge-dark pb-3 flex items-center justify-between">
                    <h3 className="text-base font-light text-white uppercase tracking-wider">
                      {regionName}
                    </h3>
                    <span className="text-xs text-brand-pink font-medium">({cityList.length} Cities)</span>
                  </div>
                  <ul className="space-y-2.5">
                    {cityList.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/facilities-management-glossary-${c.slug}`}
                          className="group flex items-center justify-between text-xs sm:text-sm text-slate-300 hover:text-brand-pink transition-colors py-1 font-light"
                        >
                          <span>{c.city} FM Glossary</span>
                          <ArrowRight className="h-3 w-3 text-slate-500 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ProposalSection
          headline="Discuss Your Estate's Maintenance and Compliance Requirements"
          subheadline="Speak with our technical engineering team about multi-property portfolios, PPM schedules, or statutory risk audits."
        />
      </main>

      <Footer />
    </div>
  );
}
