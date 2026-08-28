'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';
import { POSTS_BY_DATE } from '@/content/blog/posts';
import type { TemplateProps } from '../types';

interface SearchableResource {
  title: string;
  href: string;
  category: string;
  type: 'Tool' | 'Guide' | 'Compliance' | 'Glossary' | 'Document' | 'Learning';
  description: string;
}

const ALL_SEARCHABLE_RESOURCES: SearchableResource[] = [
  // Tools
  { title: 'FM Building Health Check', href: '/tools/fm-health-check', category: 'Compliance & Safety', type: 'Tool', description: '3-minute interactive diagnostic across statutory maintenance and record-keeping baselines.' },
  { title: 'PPM Schedule Builder', href: '/tools/ppm-schedule-builder', category: 'Maintenance Planning', type: 'Tool', description: 'Asset-led planned preventative maintenance matrix with verified legal and standard frequencies.' },
  { title: 'Compliance Calendar Builder', href: '/tools/compliance-calendar', category: 'Compliance & Safety', type: 'Tool', description: '12-month statutory testing roadmap with ICS calendar export for Outlook and Google Calendar.' },
  { title: 'PPM Cost Estimator', href: '/tools/ppm-estimator', category: 'Maintenance Planning', type: 'Tool', description: 'Indicative planned maintenance budget calculator by floor area, sector, and plant age.' },
  { title: 'FM ROI & TCO Calculator', href: '/tools/fm-roi-calculator', category: 'Commercial & Strategy', type: 'Tool', description: 'Compare multiple-supplier reactive spend against a consolidated planned maintenance model.' },
  { title: 'FM Tender Brief Generator', href: '/tools/tender-brief', category: 'Commercial & Strategy', type: 'Tool', description: 'Structured Facilities Management RFP procurement brief and specification generator.' },

  // Compliance
  { title: 'Compliance Centre Hub', href: '/compliance', category: 'Compliance & Safety', type: 'Compliance', description: 'Comprehensive guide separating legal requirements, British Standards, and industry practice.' },
  { title: 'Fire Risk Assessment Guide', href: '/compliance/fire-risk-assessment', category: 'Compliance & Safety', type: 'Compliance', description: 'What the law requires under RRO 2005 Article 9 and review triggers.' },
  { title: 'Fixed Wire Testing & EICR', href: '/compliance/fixed-wire-testing-eicr', category: 'Compliance & Safety', type: 'Compliance', description: 'BS 7671 commercial periodic electrical testing intervals and C1/C2 classifications.' },
  { title: 'Emergency Lighting Testing', href: '/compliance/emergency-lighting-testing', category: 'Compliance & Safety', type: 'Compliance', description: 'Monthly function tests and annual 3-hour discharge tests under BS 5266-1.' },
  { title: 'Legionella & Water Hygiene', href: '/compliance/legionella-water-hygiene', category: 'Compliance & Safety', type: 'Compliance', description: 'ACOP L8 and HSG274 hot and cold water monitoring requirements.' },
  { title: 'Commercial Gas Safety', href: '/compliance/commercial-gas-safety', category: 'Compliance & Safety', type: 'Compliance', description: 'Non-domestic gas installation maintenance duties under Regulation 35.' },

  // Knowledge & Learning
  { title: 'FM Glossary A–Z', href: '/facilities-management-glossary', category: 'Glossary', type: 'Glossary', description: 'Plain-English definitions of over 50 essential FM technical terms from PPM to CAFM.' },
  { title: 'FM Intelligence & Market Trends 2026', href: '/fm-intelligence', category: 'Industry Intelligence', type: 'Guide', description: 'Curated quarterly market analysis, engineering wage rates, and regulatory updates.' },
  
  // AI in FM
  { title: 'AI in Facilities Management: Practical Guide', href: '/resources/ai-in-facilities-management', category: 'AI & Technology', type: 'Guide', description: 'Comprehensive guide to AI in commercial FM: predictive maintenance, CAFM automation, energy tuning and governance.' },
  { title: 'AI Predictive Maintenance Guide', href: '/resources/ai-in-facilities-management/predictive-maintenance', category: 'AI & Technology', type: 'Guide', description: 'Condition-based monitoring, IoT vibration sensors, BMS telemetry, and PPM optimization.' },
  { title: 'AI in the FM Helpdesk', href: '/resources/ai-in-facilities-management/ai-helpdesk-work-orders', category: 'AI & Technology', type: 'Guide', description: 'Natural language ticket triage, spatial asset mapping, automated dispatch and human safety safeguards.' },
  { title: 'AI and Next-Gen CAFM Software', href: '/resources/ai-in-facilities-management/ai-cafm', category: 'AI & Technology', type: 'Guide', description: 'Vector asset search, automated scheduling, predictive SLA risk scoring, and EntireCAFM technology.' },
  { title: 'AI Agents in Facilities Management', href: '/resources/ai-in-facilities-management/ai-agents', category: 'AI & Technology', type: 'Guide', description: 'Goal-directed autonomous agents for triage, planning, compliance verification, and contractor coordination.' },
  { title: 'Is Your FM Data Ready for AI?', href: '/resources/ai-in-facilities-management/fm-data-readiness', category: 'AI & Technology', type: 'Guide', description: 'Asset register quality, spatial hierarchy, failure coding, and the 5-step AI readiness pathway.' },
];

export function TemplateResourcesHub({ route, content }: TemplateProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources & Knowledge', url: '/resources' },
  ];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_SEARCHABLE_RESOURCES.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="bg-[#060A14] text-white min-h-screen font-sans selection:bg-brand-pink selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC FULL-VIEWPORT HERO (min-h-[85svh])                           */}
        {/* ========================================================================= */}
        <section className="relative min-h-[85svh] lg:min-h-[88svh] flex items-center justify-center bg-[#060A14] overflow-hidden pt-28 pb-16 sm:py-24 border-b border-brand-edge-dark">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/editorial/entirefm-client-review-2000w.webp"
              alt="EntireFM technical facilities management resources and intelligence"
              fill
              priority
              className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-[1.1]"
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
                  Knowledge &amp; Intelligence Ecosystem
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.06]">
                Facilities Management <br />
                <span className="font-light text-hero-pink">
                  Intelligence &amp; Guidance.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-3xl">
                Engineering guides, statutory compliance frameworks, operational calculators, and market intelligence engineered for people responsible for commercial buildings and estate portfolios across the UK.
              </p>

              {/* Search Bar */}
              <div className="pt-2 relative max-w-2xl">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search engineering guides, compliance topics, glossary terms, or tools..."
                    className="w-full h-14 rounded-sm border border-white/20 bg-brand-carbon/90 backdrop-blur-md pl-12 pr-12 text-sm text-white placeholder-slate-400 focus:border-brand-pink focus:outline-none shadow-elevated"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 text-xs text-slate-400 hover:text-white font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Instant Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 inset-x-0 z-50 rounded-sm border border-brand-edge-dark bg-[#0B1220] p-4 shadow-elevated max-h-96 overflow-y-auto">
                    <p className="text-[11px] font-medium text-brand-pink uppercase tracking-wider px-3 py-1 mb-2 border-b border-white/10">
                      Search Results ({searchResults.length})
                    </p>
                    <div className="space-y-1">
                      {searchResults.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-start justify-between p-3 rounded-sm hover:bg-white/[0.06] transition-colors group"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white group-hover:text-brand-pink transition-colors">
                                {item.title}
                              </span>
                              <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded-sm bg-white/10 text-slate-300">
                                {item.type}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 font-light leading-relaxed">{item.description}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. THE 6 PRIMARY KNOWLEDGE ECOSYSTEM PILLARS                              */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
          <div className="container-custom space-y-16">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-wider text-brand-pink font-medium">
                  Knowledge Ecosystem
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
                Authoritative Industry Resources
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-light">
                An interconnected digital intelligence platform designed to support commercial property directors, facilities managers, and engineering teams.
              </p>
            </div>

            {/* Asymmetric 6-Pillar Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Pillar 1: FM Guides Library */}
              <Link
                href="/resources/guides"
                className="group p-8 rounded-sm bg-slate-50 border border-slate-200 hover:border-brand-pink transition-all flex flex-col justify-between shadow-sm space-y-6"
              >
                <div className="space-y-3">
                  <span className="text-xs text-brand-pink uppercase tracking-widest font-medium block">
                    Pillar 01 · Reference Library
                  </span>
                  <h3 className="text-2xl font-light text-slate-900 group-hover:text-brand-pink transition-colors">
                    FM Guides Library
                  </h3>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">
                    Comprehensive, long-form technical guides on planned maintenance (PPM), asset registers, tender procurement, and statutory compliance.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-brand-pink font-medium">
                  <span>Explore 18+ Technical Guides</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Pillar 2: Interactive FM Tools */}
              <Link
                href="/tools"
                className="group p-8 rounded-sm bg-slate-50 border border-slate-200 hover:border-brand-pink transition-all flex flex-col justify-between shadow-sm space-y-6"
              >
                <div className="space-y-3">
                  <span className="text-xs text-brand-pink uppercase tracking-widest font-medium block">
                    Pillar 02 · Operational Calculators
                  </span>
                  <h3 className="text-2xl font-light text-slate-900 group-hover:text-brand-pink transition-colors">
                    Interactive Tools &amp; Calculators
                  </h3>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">
                    Interactive PPM schedule builders, building health checks, compliance calendars, and tender brief generators.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-brand-pink font-medium">
                  <span>Launch 6 Free Calculators</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Pillar 3: AI & Operational Technology */}
              <Link
                href="/resources/ai-in-facilities-management"
                className="group p-8 rounded-sm bg-slate-50 border border-slate-200 hover:border-brand-pink transition-all flex flex-col justify-between shadow-sm space-y-6"
              >
                <div className="space-y-3">
                  <span className="text-xs text-brand-pink uppercase tracking-widest font-medium block">
                    Pillar 03 · Operational Technology
                  </span>
                  <h3 className="text-2xl font-light text-slate-900 group-hover:text-brand-pink transition-colors">
                    AI in Facilities Management
                  </h3>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">
                    Demystifying predictive maintenance, IoT telemetry, vector CAFM search, and automated work order triage with strict human safety boundaries.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-brand-pink font-medium">
                  <span>Explore AI Whitepapers</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Pillar 4: Statutory Compliance Centre */}
              <Link
                href="/compliance"
                className="group p-8 rounded-sm bg-slate-50 border border-slate-200 hover:border-brand-pink transition-all flex flex-col justify-between shadow-sm space-y-6"
              >
                <div className="space-y-3">
                  <span className="text-xs text-brand-pink uppercase tracking-widest font-medium block">
                    Pillar 04 · Statutory Authority
                  </span>
                  <h3 className="text-2xl font-light text-slate-900 group-hover:text-brand-pink transition-colors">
                    Statutory Compliance Centre
                  </h3>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">
                    Authoritative guidance separating UK legal obligations from British Standards across Fire Safety, Fixed Wire Testing (EICR), Legionella, and Gas.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-brand-pink font-medium">
                  <span>View Legal Mandates</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Pillar 5: FM Glossary A–Z */}
              <Link
                href="/facilities-management-glossary"
                className="group p-8 rounded-sm bg-slate-50 border border-slate-200 hover:border-brand-pink transition-all flex flex-col justify-between shadow-sm space-y-6"
              >
                <div className="space-y-3">
                  <span className="text-xs text-brand-pink uppercase tracking-widest font-medium block">
                    Pillar 05 · Technical Dictionary
                  </span>
                  <h3 className="text-2xl font-light text-slate-900 group-hover:text-brand-pink transition-colors">
                    FM Glossary A–Z
                  </h3>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">
                    Plain-English definitions and statutory references for over 50 essential FM technical terms, from SFG20 and CAFM to LOLER and EICR.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-brand-pink font-medium">
                  <span>Browse Terminology</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Pillar 6: FM Intelligence 2026 */}
              <Link
                href="/fm-intelligence"
                className="group p-8 rounded-sm bg-slate-50 border border-slate-200 hover:border-brand-pink transition-all flex flex-col justify-between shadow-sm space-y-6"
              >
                <div className="space-y-3">
                  <span className="text-xs text-brand-pink uppercase tracking-widest font-medium block">
                    Pillar 06 · Market Research
                  </span>
                  <h3 className="text-2xl font-light text-slate-900 group-hover:text-brand-pink transition-colors">
                    FM Intelligence 2026
                  </h3>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">
                    Quarterly commercial benchmarks, Building Safety Act enforcement trends, engineering wage indices, and energy optimization metrics.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-brand-pink font-medium">
                  <span>Read Market Analysis</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. FEATURED INTERACTIVE PLANNING SUITE                                    */}
        {/* ========================================================================= */}
        <section className="py-24 bg-[#0B1220] text-white border-b border-brand-edge-dark">
          <div className="container-custom space-y-16">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs uppercase tracking-wider text-brand-pink font-medium">
                    Interactive Suite
                  </span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-white leading-tight">
                  Estate Planning Tools
                </h2>
                <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
                  Free browser-based diagnostics, cost estimators, and schedule generators built on verified SFG20 and UK statutory frequencies.
                </p>
              </div>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-pink hover:text-white transition-colors"
              >
                <span>View all 6 FM tools &amp; calculators</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Numbered Row Format instead of generic SaaS cards */}
            <div className="divide-y divide-white/10 border-t border-b border-white/10">
              
              <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:bg-white/[0.02] transition-colors px-2 sm:px-4">
                <div className="lg:col-span-1 text-2xl font-extralight text-brand-pink">01</div>
                <div className="lg:col-span-4 space-y-1">
                  <h3 className="text-xl font-light text-white">PPM Schedule Builder</h3>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">Asset-Led Maintenance Matrix</span>
                </div>
                <div className="lg:col-span-5 text-sm text-slate-300 font-light leading-relaxed">
                  Build a bespoke maintenance schedule around your installed assets with verified statutory, standard, and practice basis.
                </div>
                <div className="lg:col-span-2 text-right">
                  <Link href="/tools/ppm-schedule-builder" className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-pink hover:text-white transition-colors">
                    <span>Launch Builder</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:bg-white/[0.02] transition-colors px-2 sm:px-4">
                <div className="lg:col-span-1 text-2xl font-extralight text-brand-pink">02</div>
                <div className="lg:col-span-4 space-y-1">
                  <h3 className="text-xl font-light text-white">FM Building Health Check</h3>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">3-Minute Risk Audit</span>
                </div>
                <div className="lg:col-span-5 text-sm text-slate-300 font-light leading-relaxed">
                  Evaluate your estate across 7 statutory maintenance areas to highlight documentation gaps and operational risk points.
                </div>
                <div className="lg:col-span-2 text-right">
                  <Link href="/tools/fm-health-check" className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-pink hover:text-white transition-colors">
                    <span>Start Audit</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:bg-white/[0.02] transition-colors px-2 sm:px-4">
                <div className="lg:col-span-1 text-2xl font-extralight text-brand-pink">03</div>
                <div className="lg:col-span-4 space-y-1">
                  <h3 className="text-xl font-light text-white">Compliance Calendar Builder</h3>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">12-Month Testing Roadmap</span>
                </div>
                <div className="lg:col-span-5 text-sm text-slate-300 font-light leading-relaxed">
                  Generate a synchronized statutory testing schedule with direct calendar file export for Outlook and Google Calendar.
                </div>
                <div className="lg:col-span-2 text-right">
                  <Link href="/tools/compliance-calendar" className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-pink hover:text-white transition-colors">
                    <span>Build Calendar</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:bg-white/[0.02] transition-colors px-2 sm:px-4">
                <div className="lg:col-span-1 text-2xl font-extralight text-brand-pink">04</div>
                <div className="lg:col-span-4 space-y-1">
                  <h3 className="text-xl font-light text-white">Tender Brief Generator</h3>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">RFP Specification Creator</span>
                </div>
                <div className="lg:col-span-5 text-sm text-slate-300 font-light leading-relaxed">
                  Draft a comprehensive, structured Facilities Management tender brief and RFP specification to issue to prospective contractors.
                </div>
                <div className="lg:col-span-2 text-right">
                  <Link href="/tools/tender-brief" className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-pink hover:text-white transition-colors">
                    <span>Create RFP</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. EDITORIAL KNOWLEDGE STRIP                                              */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
          <div className="container-custom space-y-16">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs uppercase tracking-wider text-brand-pink font-medium">
                    Editorial Analysis
                  </span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
                  Technical Articles &amp; Insights
                </h2>
                <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
                  Written by licensed building services engineers and senior FM practitioners.
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-pink hover:text-slate-900 transition-colors"
              >
                <span>View all articles ({POSTS_BY_DATE.length})</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {POSTS_BY_DATE.slice(0, 3).map((post) => (
                <Link
                  key={post.path}
                  href={post.path}
                  className="group p-8 rounded-sm bg-slate-50 border border-slate-200 hover:border-brand-pink transition-all flex flex-col justify-between shadow-sm space-y-6"
                >
                  <div className="space-y-3">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-brand-pink block">
                      {post.published}
                    </span>
                    <h3 className="text-xl font-light text-slate-900 group-hover:text-brand-pink transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed line-clamp-3">
                      {post.dek}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-brand-pink font-medium">
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter & Conversion */}
        <NewsletterSignupSection />
        <ProposalSection />
      </main>

      <Footer />
    </div>
  );
}
