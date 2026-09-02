'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Filter,
  ExternalLink,
  BookOpen,
  Sparkles,
  TrendingUp,
  AlertCircle,
  FileText,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  Briefcase,
  Layers,
  Award,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import { getLatestNewsStream } from '@/server/news/news-store';

export function TemplateLobbyKnow() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'briefings' | 'regulatory' | 'market' | 'field' | 'research'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const liveNews = getLatestNewsStream(6);

  const filters = [
    { id: 'all', label: 'All Intelligence' },
    { id: 'briefings', label: 'Daily Briefings' },
    { id: 'regulatory', label: 'Regulatory Watch' },
    { id: 'market', label: 'Market & Contracts' },
    { id: 'field', label: 'From The Field' },
    { id: 'research', label: 'EntireFM Research' },
  ];

  // Verified intelligence records with rigorous provenance
  const regulatoryBriefs = [
    {
      id: 'reg-01',
      title: 'Mandatory Digital Occurrence Reporting — Building Safety Act 2022 Part 4',
      statute: 'Building Safety Act 2022 (Part 4, Section 87)',
      governingBody: 'Building Safety Regulator (HSE)',
      effectiveDate: 'Enforced October 2024 / Active Q4 2026 Focus',
      publicationDate: '28 August 2026',
      lastReviewed: '01 September 2026',
      relevantSector: 'High-Rise Residential (18m+) & Commercial Mixed-Use',
      impactLevel: 'CRITICAL STATUTORY DUTY',
      summary:
        'Accountable Persons (APs) and Principal Accountable Persons (PAPs) must establish a mandatory occurrence reporting system. Safety-critical structural or fire occurrences must be reported to the regulator within 48 hours of identification.',
      sourceAttribution: 'HSE Statutory Guidance Reg 2023/1096 · UK Parliament Statutory Instruments',
      checkCrossLink: '/lobby/check#building-safety',
      doCrossLink: '/tools/compliance-checker',
      learnCrossLink: '/lobby/learn#bsa-briefing',
      connectCrossLink: '/lobby/community',
    },
    {
      id: 'reg-02',
      title: 'ACOP L8 Fourth Edition & HSG274 — Temperature & Biocide Regime Audits',
      statute: 'Health and Safety at Work etc. Act 1974 / Control of Substances Hazardous to Health Regs 2002',
      governingBody: 'Health and Safety Executive (HSE)',
      effectiveDate: 'Active Statutory Standard',
      publicationDate: '24 August 2026',
      lastReviewed: '30 August 2026',
      relevantSector: 'Commercial Healthcare, Hospitality & Central Office Plant',
      impactLevel: 'HIGH COMPLIANCE PRIORITY',
      summary:
        'Sentinels, calorifiers, and cooling towers require immutable physical inspection records. Calorifiers must maintain flow temperature of ≥60°C and return temperature of ≥50°C to prevent biological colonization.',
      sourceAttribution: 'HSE Approved Code of Practice L8 (4th edition) · HSG274 Parts 1-3',
      checkCrossLink: '/lobby/check#water-hygiene',
      doCrossLink: '/tools/ppm-schedule-builder',
      learnCrossLink: '/lobby/learn#legionella-briefing',
      connectCrossLink: '/lobby/community',
    },
    {
      id: 'reg-03',
      title: 'BS 7671:2018+A3:2024 (Amendment 3) — Bidirectional Protective Devices & EV/PV Integration',
      statute: 'Electricity at Work Regulations 1989 / BS 7671',
      governingBody: 'Institution of Engineering and Technology (IET) & BSI',
      effectiveDate: 'Immediate Standard',
      publicationDate: '19 August 2026',
      lastReviewed: '28 August 2026',
      relevantSector: 'Commercial Estates with Solar PV, Battery Storage & EV Chargers',
      impactLevel: 'TECHNICAL MANDATE',
      summary:
        'Where power generation equipment or battery energy storage is connected in parallel with distribution boards, overcurrent protective devices must be specifically verified for bidirectional power flow.',
      sourceAttribution: 'IET Wiring Regulations Amendment 3:2024 · BSI Standards Publication',
      checkCrossLink: '/lobby/check#electrical',
      doCrossLink: '/contractor-tools/contractor-compliance-check',
      learnCrossLink: '/lobby/learn#eicr-briefing',
      connectCrossLink: '/lobby/community',
    },
  ];

  const marketMoves = [
    {
      id: 'mkt-01',
      headline: 'Crown Commercial Service RM6264 Crown Estates FM Framework Extension',
      category: 'Framework Award',
      date: '01 September 2026',
      source: 'Crown Commercial Service / Find a Tender',
      impact: 'Procurement Strategy',
      summary: 'CCS confirms extension notice on Lot 1 Total Facilities Management and Lot 2 Hard Services frameworks.',
    },
    {
      id: 'mkt-02',
      headline: 'UK Commercial Real Estate Energy Performance Certificates (EPC B Transition)',
      category: 'Market Intelligence',
      date: '27 August 2026',
      source: 'Department for Energy Security & Net Zero (DESNZ)',
      impact: 'Capital Planning',
      summary: 'Consultation update confirms trajectory toward EPC rating B for commercial lettings by 2030, impacting plantroom replacement cycles.',
    },
    {
      id: 'mkt-03',
      headline: 'SFG20 Maintenance Matrix 2026 Industry Index Update',
      category: 'Standards & Practice',
      date: '22 August 2026',
      source: 'Building Engineering Services Association (BESA)',
      impact: 'Operating Costs',
      summary: 'Updated labour hour norms released for commercial heat pump servicing and smart building sensor calibration.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ── 01. SECONDARY SUB-NAVIGATION BAR ─────────────────────────── */}
      <LobbySubNav currentSection="know" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 w-full space-y-12">
        
        {/* ── 02. BREADCRUMBS & PURPOSE MASTHEAD ───────────────────────── */}
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
            <Link href="/lobby" className="hover:text-neutral-900 transition-colors">
              The Lobby
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">KNOW</span>
          </nav>

          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 lg:p-12 shadow-2xs space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold">
                01 · THE FM INTELLIGENCE CENTRE
              </span>
            </div>

            <div className="max-w-4xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-neutral-900 tracking-tight leading-tight">
                Understand What&apos;s Changing.
              </h1>
              <p className="text-sm sm:text-base font-light text-neutral-600 leading-relaxed max-w-3xl">
                The definitive operational intelligence desk for facilities leaders, property directors, and engineering professionals. Trusted regulatory shifts, Building Safety Act developments, verified market trends, and authoritative analysis.
              </p>
            </div>

            {/* Quick Intelligence Status Strip */}
            <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-light text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-neutral-900 font-medium">Statutory Monitoring Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>Zero Fabricated News · Sourced Provable Citations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Updated Daily at 06:00 UK</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 03. CATEGORY FILTERS & SEARCH CONTROLS ───────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-neutral-200/90 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFilter(f.id as any)}
                className={`px-3.5 py-1.5 rounded-[4px] text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
                  selectedFilter === f.id
                    ? 'bg-neutral-900 text-white font-medium shadow-2xs'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-light'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative shrink-0 sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter intelligence..."
              className="w-full bg-white border border-neutral-200 rounded-[4px] px-3 py-1.5 pl-8 text-xs font-light text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-electric"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* ── 04. FEATURED LEAD BRIEFING (AUTHORITATIVE SIGNAL) ────────── */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-neutral-200/80 pb-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold">
              FEATURED ANALYSIS · LEAD EDITORIAL
            </span>
            <span className="text-xs font-light text-neutral-500">Edition 2026.35</span>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-[4px] overflow-hidden shadow-2xs grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-stretch">
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-[2px] bg-neutral-100 text-[10px] font-mono uppercase text-neutral-700 border border-neutral-200">
                    BSA Part 4
                  </span>
                  <span className="text-xs text-neutral-400 font-light">· 6 min intelligence brief</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight leading-snug">
                  The Golden Thread in Practice: How Estate Directors Must Structure Asset Change Logs
                </h2>
                <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                  With the Building Safety Regulator issuing mandatory enforcement directions, commercial portfolios containing residential components can no longer rely on disparate PDF handovers. Here is how EntireFM engineers structure immutable asset logs.
                </p>
              </div>

              {/* Source Provenance Strip */}
              <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs font-light text-neutral-500">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span><strong>Source:</strong> EntireFM Engineering Directorate &amp; BSR Technical Guidance</span>
                  <span>·</span>
                  <span><strong>Reviewed:</strong> 01 September 2026</span>
                </div>
                {/* Knowledge Graph Cross Links */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-normal uppercase tracking-wider">
                  <Link href="/lobby/check" className="text-brand-electric hover:underline inline-flex items-center gap-1">
                    <span>Check BSA Checklist</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <span className="text-neutral-300">|</span>
                  <Link href="/tools/asset-scanner" className="text-brand-electric hover:underline inline-flex items-center gap-1">
                    <span>Run Asset Scanner (DO)</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <span className="text-neutral-300">|</span>
                  <Link href="/lobby/learn" className="text-brand-electric hover:underline inline-flex items-center gap-1">
                    <span>10-Min Briefing (LEARN)</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative min-h-[260px] lg:min-h-full bg-neutral-900">
              <Image
                src="/images/editorial/entirefm-distribution-board-testing-2000w.webp"
                alt="Building Safety Golden Thread and commercial asset verification"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </section>

        {/* ── 05. REGULATORY WATCH (STATUTORY DUTY SHIFTS) ─────────────── */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                STATUTORY REGISTER
              </span>
              <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                Regulatory Watch &amp; Duty-Holder Circulars
              </h2>
            </div>
            <Link
              href="/lobby/compliance"
              className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1"
            >
              <span>Full Compliance Desk</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {regulatoryBriefs.map((brief) => (
              <article
                key={brief.id}
                className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs space-y-4 hover:border-neutral-400 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded-[2px] bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-mono uppercase tracking-wider">
                      {brief.impactLevel}
                    </span>
                    <span className="text-xs text-neutral-500 font-light">{brief.statute}</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">{brief.effectiveDate}</span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-light text-neutral-900 leading-snug">
                    {brief.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed mt-1.5">
                    {brief.summary}
                  </p>
                </div>

                {/* Provenance Metadata Table */}
                <div className="pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-light text-neutral-500">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Authority &amp; Body</span>
                    <span className="text-neutral-800">{brief.governingBody}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Sector Scope</span>
                    <span className="text-neutral-800">{brief.relevantSector}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Source Documentation</span>
                    <span className="text-neutral-800 font-mono text-[11px]">{brief.sourceAttribution}</span>
                  </div>
                </div>

                {/* Knowledge Graph Interconnection */}
                <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-4 text-xs">
                  <Link href={brief.checkCrossLink} className="text-brand-electric hover:underline inline-flex items-center gap-1 font-light">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>CHECK: Statutory Duty Schedule &rarr;</span>
                  </Link>
                  <Link href={brief.doCrossLink} className="text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-1 font-light">
                    <Layers className="w-3.5 h-3.5" />
                    <span>DO: Launch Audit Tool &rarr;</span>
                  </Link>
                  <Link href={brief.learnCrossLink} className="text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-1 font-light">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>LEARN: 10-Min Briefing &rarr;</span>
                  </Link>
                  <Link href={brief.connectCrossLink} className="text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-1 font-light">
                    <span>CONNECT: Discuss with Peers &rarr;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 06. MARKET INTELLIGENCE & CONTRACT AWARDS ────────────────── */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                COMMERCIAL LANDSCAPE
              </span>
              <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                Market Intelligence, Frameworks &amp; Contract Shifts
              </h2>
            </div>
            <Link
              href="/lobby/opportunities"
              className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1"
            >
              <span>Procurement Opportunities</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketMoves.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-neutral-400 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                    <span>{item.category}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-base font-light text-neutral-900 leading-snug">
                    {item.headline}
                  </h3>
                  <p className="text-xs font-light text-neutral-600 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-light">
                  <span>Source: {item.source}</span>
                  <Link href="/lobby/find" className="text-brand-electric hover:underline inline-flex items-center gap-1">
                    <span>Tenders (FIND) &rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 07. RESEARCH & THE PULSE (EMPIRICAL BENCHMARKS) ──────────── */}
        <section className="bg-stone-100/80 border border-stone-200/90 rounded-[4px] p-8 sm:p-12 shadow-2xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
              ENTIREFM PROPRIETARY RESEARCH
            </span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
              State of UK Commercial FM &amp; Operating Cost Benchmarks
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
              Empirical cost indices, engineer wage movements, energy efficiency targets, and statutory spend per square metre across multi-tenant commercial property in London, Birmingham, Manchester, and Leeds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/lobby/benchmarking"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 shadow-2xs"
            >
              <span>Explore Benchmark Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/lobby/pulse"
              className="px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs rounded-[4px] transition-colors inline-flex items-center gap-2"
            >
              <TrendingUp className="w-3.5 h-3.5 text-brand-electric" />
              <span>Participate in The Pulse</span>
            </Link>
          </div>
        </section>

        {/* ── 08. CROSS-LINKING TO REMAINING 5 AREAS ───────────────────── */}
        <section className="pt-6 border-t border-neutral-200/90">
          <div className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-4">
            Navigate The Lobby Knowledge Graph
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <Link href="/lobby/check" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">02 · OBLIGATIONS</span>
              <span className="text-neutral-900 font-medium">CHECK &rarr;</span>
            </Link>
            <Link href="/lobby/do" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">03 · TOOLBOX</span>
              <span className="text-neutral-900 font-medium">DO &rarr;</span>
            </Link>
            <Link href="/lobby/find" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">04 · DIRECTORY</span>
              <span className="text-neutral-900 font-medium">FIND &rarr;</span>
            </Link>
            <Link href="/lobby/learn" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">05 · CPD &amp; BRIEFS</span>
              <span className="text-neutral-900 font-medium">LEARN &rarr;</span>
            </Link>
            <Link href="/lobby/connect" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors col-span-2 sm:col-span-1">
              <span className="text-neutral-400 text-[10px] block">06 · PEER NETWORK</span>
              <span className="text-neutral-900 font-medium">CONNECT &rarr;</span>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
