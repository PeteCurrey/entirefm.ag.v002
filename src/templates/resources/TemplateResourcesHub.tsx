'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Wrench,
  ShieldCheck,
  BookOpen,
  FileText,
  Activity,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Layers,
  GraduationCap,
  Download,
  Video,
  ChevronRight,
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

const TAXONOMY_CATEGORIES = [
  'All Topics',
  'AI & Technology',
  'FM Fundamentals',
  'Maintenance & PPM',
  'Compliance & Safety',
  'Engineering',
  'Procurement',
];

export function TemplateResourcesHub({ route, content }: TemplateProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
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
    <>
      <Header />
      <main className="min-h-screen bg-brand-void text-white">
        {/* 1. STRONG HERO WITH SEARCH FIELD */}
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36 sm:pb-24 border-b border-brand-edge-dark">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[15%] -top-[30%] h-[40rem] w-[40rem] rounded-full opacity-20 blur-[130px]"
            style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }}
          />
          <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-40" />

          <div className="container-custom relative">
            <Breadcrumbs items={breadcrumbs} className="mb-6" />
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-dark inline-block mb-3">Knowledge & Tools Ecosystem</span>
              <h1 className="text-display-md text-white font-light tracking-tight">
                Resources for People Responsible for Buildings
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-brand-mist/75">
                Practical engineering tools, statutory compliance guides, plain-English terminology, and operational templates designed for facilities managers, property directors, and estate teams.
              </p>

              {/* Search Bar */}
              <div className="mt-8 relative max-w-2xl">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-brand-mist/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tools, compliance topics, glossary terms, or guides..."
                    className="w-full h-13 rounded-sm border border-brand-edge-dark bg-brand-graphite pl-12 pr-4 text-sm text-white placeholder-brand-mist/40 shadow-glow-sm focus:border-brand-electric/80 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 text-xs text-brand-mist/50 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Instant Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 inset-x-0 z-50 rounded-sm border border-brand-edge-dark bg-brand-carbon p-3 shadow-glow-lg max-h-96 overflow-y-auto">
                    <p className="text-[11px] font-semibold text-brand-mist/50 uppercase tracking-wider px-3 py-1">
                      Search Results ({searchResults.length})
                    </p>
                    <div className="space-y-1 mt-1">
                      {searchResults.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-start justify-between p-3 rounded-sm hover:bg-white/[0.05] transition-colors group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white group-hover:text-brand-electric-bright transition-colors">
                                {item.title}
                              </span>
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-brand-mist/60">
                                {item.type}
                              </span>
                            </div>
                            <p className="text-xs text-brand-mist/65 mt-0.5">{item.description}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-brand-mist/40 group-hover:text-brand-electric-bright group-hover:translate-x-0.5 transition-all mt-1" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. FEATURED INTERACTIVE TOOLS */}
        <section className="py-20 bg-brand-carbon border-b border-brand-edge-dark">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="eyebrow eyebrow-dark">Interactive Planning</span>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Featured Facilities Management Tools
                </h2>
              </div>
              <Link href="/tools" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-electric-bright hover:underline">
                View all 6 FM tools & calculators <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Tool 1: PPM Schedule Builder */}
              <div className="group rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 flex flex-col justify-between hover:border-brand-electric/50 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-white/[0.05] text-brand-electric-bright border border-white/10">
                      <Wrench className="h-5 w-5" />
                    </span>
                    <span className="text-[11px] font-mono text-brand-electric-bright font-semibold">
                      Asset-Led Matrix
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-electric-bright transition-colors">
                    PPM Schedule Builder
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-brand-mist/70">
                    Build a bespoke maintenance schedule around your installed assets with verified statutory, standard, and practice basis.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-edge-dark flex items-center justify-between">
                  <span className="text-[11px] text-brand-mist/50">CSV & Print Export</span>
                  <Link href="/tools/ppm-schedule-builder" className="btn-primary py-2 px-3 text-xs">
                    Launch Builder <ArrowRight className="h-3 w-3 btn-arrow" />
                  </Link>
                </div>
              </div>

              {/* Tool 2: Building Health Check */}
              <div className="group rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 flex flex-col justify-between hover:border-brand-electric/50 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-white/[0.05] text-emerald-400 border border-white/10">
                      <Activity className="h-5 w-5" />
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      Diagnostic Tool
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    FM Building Health Check
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-brand-mist/70">
                    Evaluate your estate across 7 statutory maintenance areas to highlight documentation gaps and operational risk points.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-edge-dark flex items-center justify-between">
                  <span className="text-[11px] text-brand-mist/50">3-Min Assessment</span>
                  <Link href="/tools/fm-health-check" className="btn-primary py-2 px-3 text-xs">
                    Start Health Check <ArrowRight className="h-3 w-3 btn-arrow" />
                  </Link>
                </div>
              </div>

              {/* Tool 3: Tender Brief Generator */}
              <div className="group rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 flex flex-col justify-between hover:border-brand-electric/50 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-white/[0.05] text-amber-400 border border-white/10">
                      <FileText className="h-5 w-5" />
                    </span>
                    <span className="text-[11px] font-mono text-amber-400 font-semibold">
                      RFP Generator
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    Tender Brief Generator
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-brand-mist/70">
                    Generate a structured Facilities Management tender brief and RFP specification to issue to prospective contractors.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-edge-dark flex items-center justify-between">
                  <span className="text-[11px] text-brand-mist/50">Markdown & PDF</span>
                  <Link href="/tools/tender-brief" className="btn-primary py-2 px-3 text-xs">
                    Generate Brief <ArrowRight className="h-3 w-3 btn-arrow" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. COMPLIANCE & SAFETY PATHWAY */}
        <section className="py-20 bg-brand-graphite border-b border-brand-edge-dark">
          <div className="container-custom">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              <div className="lg:col-span-5">
                <span className="eyebrow eyebrow-dark">Statutory Authority</span>
                <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
                  Compliance Centre: What the Law Actually Requires
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-brand-mist/70">
                  Most FM websites present common habits as though they were statutory obligations. The EntireFM Compliance Centre separates legal statutes, recognised standards, industry practices, and risk-based frequencies across non-domestic property.
                </p>
                <div className="mt-6">
                  <Link href="/compliance" className="btn-primary py-2.5 px-4 text-xs inline-flex">
                    Explore Compliance Centre <ArrowRight className="h-3.5 w-3.5 btn-arrow" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/compliance/fire-risk-assessment"
                  className="p-4 rounded-sm border border-brand-edge-dark bg-brand-carbon hover:border-brand-electric/50 transition-colors block group"
                >
                  <span className="text-[10px] uppercase font-semibold text-rose-400 font-mono">RRO 2005 Article 9</span>
                  <h4 className="text-sm font-bold text-white mt-1 group-hover:text-brand-electric-bright transition-colors">
                    Fire Risk Assessment →
                  </h4>
                  <p className="text-xs text-brand-mist/60 mt-1">Review triggers, recorded findings, and responsible person duties.</p>
                </Link>

                <Link
                  href="/compliance/fixed-wire-testing-eicr"
                  className="p-4 rounded-sm border border-brand-edge-dark bg-brand-carbon hover:border-brand-electric/50 transition-colors block group"
                >
                  <span className="text-[10px] uppercase font-semibold text-blue-400 font-mono">EAWR 1989 / BS 7671</span>
                  <h4 className="text-sm font-bold text-white mt-1 group-hover:text-brand-electric-bright transition-colors">
                    Fixed Wire Testing (EICR) →
                  </h4>
                  <p className="text-xs text-brand-mist/60 mt-1">Periodic inspection intervals, C1/C2 classifications, and schedules.</p>
                </Link>

                <Link
                  href="/compliance/emergency-lighting-testing"
                  className="p-4 rounded-sm border border-brand-edge-dark bg-brand-carbon hover:border-brand-electric/50 transition-colors block group"
                >
                  <span className="text-[10px] uppercase font-semibold text-amber-400 font-mono">BS 5266-1</span>
                  <h4 className="text-sm font-bold text-white mt-1 group-hover:text-brand-electric-bright transition-colors">
                    Emergency Lighting Testing →
                  </h4>
                  <p className="text-xs text-brand-mist/60 mt-1">Monthly function tests vs annual 3-hour full duration discharge.</p>
                </Link>

                <Link
                  href="/compliance/legionella-water-hygiene"
                  className="p-4 rounded-sm border border-brand-edge-dark bg-brand-carbon hover:border-brand-electric/50 transition-colors block group"
                >
                  <span className="text-[10px] uppercase font-semibold text-emerald-400 font-mono">ACOP L8 / HSG274</span>
                  <h4 className="text-sm font-bold text-white mt-1 group-hover:text-brand-electric-bright transition-colors">
                    Legionella & Water Hygiene →
                  </h4>
                  <p className="text-xs text-brand-mist/60 mt-1">Written scheme of control, sentinel temperatures, and 5-year records.</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3b. AI & THE FUTURE OF FM */}
        <section className="py-20 bg-gradient-to-b from-brand-graphite to-brand-void border-b border-brand-edge-dark relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="container-custom relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                  Engineering & Operational Technology
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  AI & the Future of Facilities Management
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-brand-mist/70">
                  Practical, fluff-free guidance on machine learning, CAFM automation, predictive maintenance, and data readiness for UK commercial building operators.
                </p>
              </div>
              <Link
                href="/resources/ai-in-facilities-management"
                className="btn-primary py-2.5 px-4 text-xs inline-flex shrink-0 items-center gap-1.5"
              >
                Explore AI Pillar Hub <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/resources/ai-in-facilities-management"
                className="p-6 rounded-xl border border-pink-500/30 bg-pink-950/20 hover:border-pink-500/60 transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-pink-400">Pillar Whitepaper</span>
                  <h3 className="text-base font-bold text-white mt-1 group-hover:text-pink-300 transition-colors">
                    AI in Facilities Management: Complete Guide
                  </h3>
                  <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                    Demystifying ML, NLP, digital twins, and autonomous agents with an interactive request-to-resolution work order diagram.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-pink-500/20 text-xs font-semibold text-pink-400 group-hover:text-pink-300 flex items-center justify-between">
                  <span>Read Complete Guide</span>
                  <span>→</span>
                </div>
              </Link>

              <Link
                href="/resources/ai-in-facilities-management/predictive-maintenance"
                className="p-6 rounded-xl border border-brand-edge-dark bg-brand-graphite hover:border-pink-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Plant Reliability</span>
                  <h3 className="text-base font-bold text-white mt-1 group-hover:text-pink-300 transition-colors">
                    Predictive Maintenance
                  </h3>
                  <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                    How IoT vibration sensors, BMS telemetry, and failure pattern models optimize critical plant alongside statutory PPM.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-brand-edge-dark text-xs font-semibold text-slate-400 group-hover:text-pink-400 flex items-center justify-between">
                  <span>Explore Guide</span>
                  <span>→</span>
                </div>
              </Link>

              <Link
                href="/resources/ai-in-facilities-management/ai-cafm"
                className="p-6 rounded-xl border border-brand-edge-dark bg-brand-graphite hover:border-pink-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Software Architecture</span>
                  <h3 className="text-base font-bold text-white mt-1 group-hover:text-pink-300 transition-colors">
                    AI + CAFM Systems
                  </h3>
                  <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                    Natural language search, automated scheduling, predictive SLA risk scoring, and EntireCAFM software.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-brand-edge-dark text-xs font-semibold text-slate-400 group-hover:text-pink-400 flex items-center justify-between">
                  <span>Explore Guide</span>
                  <span>→</span>
                </div>
              </Link>

              <Link
                href="/resources/ai-in-facilities-management/fm-data-readiness"
                className="p-6 rounded-xl border border-brand-edge-dark bg-brand-graphite hover:border-pink-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Asset Data Hygiene</span>
                  <h3 className="text-base font-bold text-white mt-1 group-hover:text-pink-300 transition-colors">
                    FM Data Readiness
                  </h3>
                  <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                    Asset register auditing, spatial hierarchy, standardized failure coding, and the 5-step AI readiness pathway.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-brand-edge-dark text-xs font-semibold text-slate-400 group-hover:text-pink-400 flex items-center justify-between">
                  <span>Explore Guide</span>
                  <span>→</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 4. KNOWLEDGE & INTELLIGENCE PILLARS (Glossary, Academy, Document Vault, Intelligence, Building Walk) */}
        <section className="py-20 bg-brand-carbon border-b border-brand-edge-dark">
          <div className="container-custom">
            <div className="max-w-2xl mb-12">
              <span className="eyebrow eyebrow-dark">Knowledge Ecosystem</span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Learning, Intelligence & Operational Resources
              </h2>
              <p className="mt-2 text-sm text-brand-mist/60">
                Explore plain-English terminology, downloadable templates, market intelligence, and plantroom walkthroughs.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* FM Glossary */}
              <div className="p-6 rounded-sm border border-brand-edge-dark bg-brand-graphite flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-5 w-5 text-brand-electric-bright" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-brand-mist/50">Reference</span>
                  </div>
                  <h3 className="text-base font-bold text-white">FM Glossary A–Z</h3>
                  <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                    Don’t know your PPM from your EICR? Plain-English definitions of over 50 essential FM technical terms from asset registers to statutory testing.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-edge-dark">
                  <Link href="/facilities-management-glossary" className="text-xs font-semibold text-brand-electric-bright inline-flex items-center gap-1 hover:underline">
                    Open FM Glossary <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* FM Intelligence */}
              <div className="p-6 rounded-sm border border-brand-edge-dark bg-brand-graphite flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-brand-electric-bright" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-brand-mist/50">Market Intelligence</span>
                  </div>
                  <h3 className="text-base font-bold text-white">FM Intelligence 2026</h3>
                  <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                    Verified commercial benchmarks, regulatory shifts under the Building Safety Act, engineering labour trends, and operational data.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-edge-dark">
                  <Link href="/fm-intelligence" className="text-xs font-semibold text-brand-electric-bright inline-flex items-center gap-1 hover:underline">
                    Read 2026 Analysis <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* EntireFM Academy */}
              <div className="p-6 rounded-sm border border-brand-edge-dark bg-brand-graphite flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="h-5 w-5 text-brand-electric-bright" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-brand-mist/50">Training</span>
                  </div>
                  <h3 className="text-base font-bold text-white">EntireFM Academy</h3>
                  <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                    Free operational learning modules on statutory maintenance, building services engineering fundamentals, and contract oversight.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-edge-dark">
                  <Link href="/academy" className="text-xs font-semibold text-brand-electric-bright inline-flex items-center gap-1 hover:underline">
                    Browse Curriculum <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Document Vault */}
              <div className="p-6 rounded-sm border border-brand-edge-dark bg-brand-graphite flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Download className="h-5 w-5 text-brand-electric-bright" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-brand-mist/50">Downloads</span>
                  </div>
                  <h3 className="text-base font-bold text-white">FM Document Vault</h3>
                  <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                    Verified, downloadable CSV asset registers, PPM matrix templates, compliance logbooks, and contractor induction checklists.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-edge-dark">
                  <Link href="/resources/document-vault" className="text-xs font-semibold text-brand-electric-bright inline-flex items-center gap-1 hover:underline">
                    Access Downloads <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* The Building Walk */}
              <div className="p-6 rounded-sm border border-brand-edge-dark bg-brand-graphite flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="h-5 w-5 text-brand-electric-bright" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-brand-mist/50">Site Surveys</span>
                  </div>
                  <h3 className="text-base font-bold text-white">The Building Walk</h3>
                  <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                    Step-by-step engineering walkthroughs of plantrooms, switchrooms, chiller decks, and commercial estate roofs.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-edge-dark">
                  <Link href="/building-walk" className="text-xs font-semibold text-brand-electric-bright inline-flex items-center gap-1 hover:underline">
                    Explore Walkthroughs <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Case Studies */}
              <div className="p-6 rounded-sm border border-brand-edge-dark bg-brand-graphite flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="h-5 w-5 text-brand-electric-bright" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-brand-mist/50">Real Estates</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Case Studies</h3>
                  <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                    Anonymised profiles of real-world commercial estates, motorway services, clinical buildings, and industrial complexes.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-edge-dark">
                  <Link href="/case-studies" className="text-xs font-semibold text-brand-electric-bright inline-flex items-center gap-1 hover:underline">
                    View Case Studies <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ARTICLES & EDITORIAL GUIDES */}
        <section className="py-20 bg-brand-graphite">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="eyebrow eyebrow-dark">Editorial Guides</span>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Technical Articles & Insights
                </h2>
              </div>
              <Link href="/blog" className="text-xs font-semibold text-brand-electric-bright hover:underline">
                View all articles ({POSTS_BY_DATE.length}) →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {POSTS_BY_DATE.slice(0, 6).map((post) => (
                <Link
                  key={post.path}
                  href={post.path}
                  className="group rounded-sm border border-brand-edge-dark bg-brand-carbon p-6 flex flex-col justify-between hover:border-brand-electric/50 transition-colors"
                >
                  <div>
                    <span className="text-[11px] font-mono text-brand-electric-bright uppercase">
                      {post.published}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2 group-hover:text-brand-electric-bright transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-brand-mist/70 mt-2 line-clamp-3 leading-relaxed">
                      {post.dek}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-brand-edge-dark flex items-center justify-between text-xs text-brand-mist/50">
                    <span>{Math.max(3, Math.round(post.sections.length * 1.5))} min read</span>
                    <span className="text-brand-electric-bright group-hover:translate-x-0.5 transition-transform">Read guide →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <NewsletterSignupSection />
        <TrustBar />
        <ProposalSection />
      </main>
      <Footer />
    </>
  );
}
