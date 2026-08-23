'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  ArrowUpRight,
  MapPin,
  CheckCircle2,
  Filter,
  Layers,
  ShieldCheck,
  Wrench,
  Cpu,
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
    <div className="flex min-h-screen flex-col bg-white">
      <Header solid />
      <main id="main" className="flex-1">
        {/* Schema Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />

        {/* Hero Section */}
        <section className="on-dark relative isolate flex w-full flex-col overflow-hidden bg-brand-graphite pt-[calc(var(--header-h)+1rem)] pb-16 sm:pb-20">
          <div className="container-custom">
            <Breadcrumbs items={breadcrumbs} />

            <div className="max-w-4xl mt-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/[0.07] border border-white/15 backdrop-blur-sm mb-6">
                <BookOpen className="h-4 w-4 text-brand-pink-light" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-pink-light">
                  TECHNICAL REFERENCE & DIRECTORY
                </span>
              </div>

              <h1 className="text-display-xl text-white">
                Facilities Management Glossary: <span className="text-hero-pink">FM Terms Explained</span>
              </h1>

              <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-brand-mist/80">
                Plain-English explanations of commercial facilities management, M&E engineering, SFG20 planned preventative maintenance, and statutory compliance terminology for property directors and estate managers.
              </p>

              {/* Live Search Input */}
              <div className="mt-8 relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-mist/50" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search FM terms (e.g. PPM, SFG20, EICR, CAFM, TM44, BMS)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-sm bg-brand-carbon border border-white/15 text-white text-sm placeholder:text-brand-mist/40 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-all outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-brand-mist/60 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Filter Controls & A-Z Navigation */}
        <section className="bg-brand-surface border-b border-brand-edge py-6 sticky top-[var(--header-h)] z-20 shadow-subtle backdrop-blur-md bg-white/95">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* A-Z Alpha Bar */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLetter(null);
                    setSelectedCategory(null);
                  }}
                  className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase transition-colors ${
                    selectedLetter === null && selectedCategory === null
                      ? 'bg-brand-pink text-white'
                      : 'bg-white border border-brand-edge text-brand-graphite hover:border-brand-pink/50'
                  }`}
                >
                  All ({NATIONAL_GLOSSARY_TERMS.length})
                </button>
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                    className={`w-7 h-7 rounded-sm text-xs font-bold uppercase flex items-center justify-center transition-colors ${
                      selectedLetter === letter
                        ? 'bg-brand-pink text-white'
                        : 'bg-white border border-brand-edge text-brand-graphite hover:border-brand-pink/50'
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
                  className="w-full md:w-auto text-xs px-3 py-1.5 rounded-sm border border-brand-edge bg-white text-brand-graphite font-semibold focus:border-brand-pink focus:outline-none"
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

        {/* Glossary Terms List */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Showing {filteredTerms.length} of {NATIONAL_GLOSSARY_TERMS.length} facilities management definitions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTerms.map((item) => (
                <article
                  key={item.slug}
                  id={item.slug}
                  className="p-6 sm:p-7 rounded-sm border border-brand-edge bg-white hover:border-brand-pink/40 hover:shadow-card transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-xl sm:text-2xl font-bold text-brand-graphite tracking-tight">
                        {item.term}
                      </h2>
                      <span className="px-2.5 py-1 rounded-sm bg-brand-surface border border-brand-edge text-[10px] font-bold uppercase tracking-wider text-slate-600 shrink-0">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-brand-graphite leading-relaxed">
                      {item.shortDefinition}
                    </p>

                    <div className="text-xs sm:text-[13px] leading-relaxed text-slate-600 border-t border-brand-edge/60 pt-3">
                      <p>{item.detailedExplanation}</p>
                    </div>

                    <div className="p-3.5 rounded-sm bg-brand-surface/70 border border-brand-edge text-xs leading-relaxed text-slate-700">
                      <span className="font-bold text-brand-graphite block mb-1">Why it matters for commercial estates:</span>
                      {item.whyItMatters}
                    </div>

                    {item.relatedTerms.length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 mr-1">Related terms:</span>
                        {item.relatedTerms.map((rt) => (
                          <span
                            key={rt}
                            className="px-2 py-0.5 rounded-sm bg-slate-100 text-[11px] text-slate-700 font-mono"
                          >
                            {rt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {item.serviceLink && (
                    <div className="mt-6 pt-4 border-t border-brand-edge flex items-center justify-between">
                      <Link
                        href={item.serviceLink.href}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-pink hover:text-brand-magenta transition-colors"
                      >
                        <span>{item.serviceLink.label}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <span className="text-[11px] text-slate-400">EntireFM Capability</span>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {filteredTerms.length === 0 && (
              <div className="p-12 text-center border border-dashed border-brand-edge rounded-sm bg-brand-surface">
                <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-brand-graphite">No glossary definitions found</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  No term matches your current search or category filter. Try clearing filters to explore the full A–Z directory.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLetter(null);
                    setSelectedCategory(null);
                  }}
                  className="btn-primary mt-4 py-2 px-4 text-xs font-bold"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Regional Location Directory Section */}
        <section className="section bg-brand-surface border-t border-brand-edge">
          <div className="container-custom">
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white border border-brand-edge mb-4">
                <MapPin className="h-3.5 w-3.5 text-brand-pink" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-graphite">
                  REGIONAL FM STANDARDS
                </span>
              </div>
              <h2 className="text-display-md text-brand-graphite font-bold tracking-tight">
                Facilities Management Terminology by Location
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                Explore dedicated regional glossary pages explaining how building services, heritage constraints, ULEZ transport regulations, and manufacturing requirements impact FM delivery in specific UK cities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(locationsByRegion).map(([regionName, cityList]) => (
                <div
                  key={regionName}
                  className="p-6 rounded-sm bg-white border border-brand-edge shadow-subtle space-y-4"
                >
                  <h3 className="text-base font-bold text-brand-graphite uppercase tracking-wider border-b border-brand-edge pb-2 flex items-center justify-between">
                    <span>{regionName}</span>
                    <span className="text-xs font-mono text-brand-pink">({cityList.length})</span>
                  </h3>
                  <ul className="space-y-2">
                    {cityList.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/facilities-management-glossary-${c.slug}`}
                          className="group flex items-center justify-between text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-brand-pink transition-colors py-1"
                        >
                          <span>{c.city} FM Glossary</span>
                          <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all" />
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
          headline="Discuss your estate's maintenance and compliance requirements"
          subheadline="Speak to our technical team about single-site contracts, multi-property portfolios, or comprehensive statutory compliance reviews."
        />
      </main>
      <Footer />
    </div>
  );
}
