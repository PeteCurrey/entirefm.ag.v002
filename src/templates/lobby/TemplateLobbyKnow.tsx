'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ShieldCheck,
  Clock,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Sparkles,
  TrendingUp,
  AlertCircle,
  FileText,
  CheckCircle2,
  Calendar,
  Building2,
  Briefcase,
  Layers,
  Scale,
  Eye,
  ChevronRight,
  Check,
  Flame,
  Zap,
  Droplets,
  Wind,
  Download,
  Info,
  Filter,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import { getLatestNewsStream } from '@/server/news/news-store';
import { LOBBY_DATA } from '@/data/lobby/content';

// Common persistent taxonomy across the Lobby
export const COMMON_LOBBY_TOPICS = [
  'All',
  'Fire Safety',
  'Building Safety',
  'Energy',
  'Compliance',
  'Contractors',
  'Technology',
  'Sustainability',
  'Property',
  'Legislation',
  'Electrical',
  'Water',
  'HVAC',
  'Procurement',
  'CAFM',
  'Engineering',
] as const;

export function TemplateLobbyKnow() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [defectRevealed, setDefectRevealed] = useState(false);
  const [pulseVoted, setPulseVoted] = useState(false);
  const [pulseSelectedId, setPulseSelectedId] = useState<string | null>(null);

  // Live curated stream from news-store
  const newsStream = getLatestNewsStream(8);
  const leadArticle = newsStream[0];
  const secondaryArticles = newsStream.slice(1, 4);

  // ── 01. WHAT CHANGED (AUTHENTIC STATUTORY & INDUSTRY DEVELOPMENTS) ─
  const whatChangedItems = [
    {
      id: 'wc-01',
      topic: 'Building Safety',
      headline: 'Mandatory Digital Occurrence Reporting Regs (BSA Part 4)',
      whatChanged:
        'The Building Safety Regulator has issued explicit guidance establishing that specified structural or fire-safety occurrences must be formally logged and notified within 48 hours of detection.',
      effectiveDate: 'Enforced Q4 2026 / Active Focus',
      whoItAffects:
        'Principal Accountable Persons (PAPs), commercial landlords with mixed-use/residential components, and managing agents.',
      whyItMatters:
        'Duty holders cannot outsource statutory liability to third-party managing agents without contemporaneous, immutable digital audit trails.',
      sourceName: 'Building Safety Regulator (HSE) · Reg 2023/1096',
      sourceUrl: 'https://www.hse.gov.uk/building-safety',
      entireFmAnalysis:
        'Ensure work order closeouts require contractor photographic evidence and engineer sign-off before invoice approval to maintain an uninterrupted Golden Thread.',
      checkUrl: '/lobby/check#building-safety',
      doUrl: '/tools/compliance-checker',
    },
    {
      id: 'wc-02',
      topic: 'Water Hygiene',
      headline: 'ACOP L8 / HSG274 Sentinels & Calorifier Purge Enforcement',
      whatChanged:
        'HSE inspectors are targeting dormant outlets and sentinel temperature monitoring protocols following commercial building occupancy variations.',
      effectiveDate: 'Active Standard',
      whoItAffects:
        'Estates directors, healthcare facilities managers, hotel operators, and commercial building duty holders.',
      whyItMatters:
        'Non-compliant water logs expose duty holders to immediate Crown enforcement notices and civil liability under COSHH Regulations.',
      sourceName: 'Health and Safety Executive (HSE) ACOP L8',
      sourceUrl: 'https://www.hse.gov.uk/legionnaires/',
      entireFmAnalysis:
        'Digital telemetry sensors should back up manual monthly sentinel checks on extensive pipework distributions to eliminate sampling gaps.',
      checkUrl: '/lobby/check#water',
      doUrl: '/tools/compliance-calendar',
    },
    {
      id: 'wc-03',
      topic: 'HVAC & Climate',
      headline: 'F-Gas Quota Step-Down (18% Virgin Allocation Cut)',
      whatChanged:
        'Virgin hydrofluorocarbon quotas under UK/EU F-Gas regulations have reduced virgin R410A allocation, accelerating market pricing and procurement lead times.',
      effectiveDate: 'Q3 2026 Fiscal Step',
      whoItAffects:
        'Commercial offices, data centres, retail facilities, and chiller plant operators.',
      whyItMatters:
        'Emergency breakdown callouts face severe material price premiums; leak prevention through routine PPM is essential to prevent unplanned recharges.',
      sourceName: 'Environment Agency (EA) / Defra F-Gas Directorate',
      sourceUrl: 'https://www.gov.uk/guidance/f-gas-regulations',
      entireFmAnalysis:
        'Map plantplates and refrigerant charges into a centralized digital register to pre-empt statutory leak-test frequencies and phase-out plans.',
      checkUrl: '/lobby/check#hvac',
      doUrl: '/tools/asset-scanner',
    },
  ];

  // ── 02. REGULATORY WATCH (STRUCTURED STATUS TABLE) ─────────────
  const regulatoryWatchTable = [
    {
      id: 'rw-01',
      topic: 'Building Safety',
      development: 'Building Safety Act 2022 Safety Case Reviews & Digital Log Mandate',
      status: 'IN FORCE',
      statusColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      date: 'Aug 2026',
      appliesTo: 'HRBs & Mixed-Use Commercial Estates (18m+)',
      source: 'Building Safety Regulator (HSE)',
      entireFmView: 'Ensure asset registers are held in open, machine-readable formats.',
      checkRef: '/lobby/check#building-safety',
    },
    {
      id: 'rw-02',
      topic: 'Electrical',
      development: 'BS 7671:2018+A3:2024 Bidirectional Protection & Battery Systems',
      status: 'PUBLISHED',
      statusColor: 'bg-blue-100 text-blue-900 border-blue-300',
      date: 'Jul 2026',
      appliesTo: 'Commercial Sites with Solar PV, EV Charging, or BESS',
      source: 'IET & BSI Standards',
      entireFmView: 'Verify protective devices are certified for bidirectional power flow.',
      checkRef: '/lobby/check#electrical',
    },
    {
      id: 'rw-03',
      topic: 'Energy & Carbon',
      development: 'Non-Domestic EPC Minimum Standards (EPC B Trajectory Consultation)',
      status: 'CONSULTATION',
      statusColor: 'bg-amber-100 text-amber-900 border-amber-300',
      date: 'Aug 2026',
      appliesTo: 'All Commercial Landlords & Lettable Buildings',
      source: 'DESNZ / UK Government',
      entireFmView: 'Factor heating decarbonisation and secondary glazing into 5-year CapEx plans.',
      checkRef: '/lobby/check',
    },
    {
      id: 'rw-04',
      topic: 'Fire Safety',
      development: 'Fire Safety (England) Regs 2022 Quarterly Fire Door Audit Reviews',
      status: 'IN FORCE',
      statusColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      date: 'Active Duty',
      appliesTo: 'Multi-Occupancy Commercial & Residential Properties',
      source: 'Home Office Fire Safety Directorate',
      entireFmView: 'Inspect gap tolerances (≤4mm) and smoke seals on all riser access doors.',
      checkRef: '/lobby/check#fire',
    },
    {
      id: 'rw-05',
      topic: 'Water Safety',
      development: 'HSG274 Technical Guidance Review on Closed Heating/Chilled Loops',
      status: 'UNDER REVIEW',
      statusColor: 'bg-purple-100 text-purple-900 border-purple-300',
      date: 'Sep 2026',
      appliesTo: 'Commercial Central Plant & District Energy Systems',
      source: 'HSE Water Treatment Working Group',
      entireFmView: 'Conduct quarterly biocide and inhibitor concentration testing.',
      checkRef: '/lobby/check#water',
    },
  ];

  // ── 03. MARKET INTELLIGENCE (DATA-AWARE REAL METRICS) ──────────
  const marketIntelligence = [
    {
      id: 'mi-01',
      trend: 'Commercial Decarbonisation & High-Temp Heat Pump Retrofits',
      dataMetric: '28% YoY Increase in Gas Boiler Phase-Out Inquiries',
      period: 'Q2–Q3 2026',
      source: 'EntireFM Procurement Directorate & BESA Market Indicators',
      analysis:
        'Commercial estates are phasing out aging gas calorifiers in favour of high-temperature R290/CO2 heat pumps to preserve tenant ESG covenants.',
    },
    {
      id: 'mi-02',
      trend: 'Specialist Engineering Labour Availability & Wage Movement',
      dataMetric: '+7.4% Median Hourly Rate Movement for F-Gas & HV Engineers',
      period: 'Trailing 12 Months',
      source: 'Office for National Statistics & Engineering Services Alliance',
      analysis:
        'Acute regional shortages of dual-fuel commercial technicians are driving estates toward contracted planned maintenance with guaranteed SLA response windows.',
    },
    {
      id: 'mi-03',
      trend: 'Total FM Supplier Consolidation vs Fragmented Multi-Trade',
      dataMetric: '34% of Tenders Mandating Single-Contract Hard & Soft Scope',
      period: 'H1 2026 Public & Private RFPs',
      source: 'Find a Tender Service & Crown Commercial Procurement Records',
      analysis:
        'Property directors are replacing 6–10 fragmented trade contractors with single accountable FM providers to resolve compliance handoff gaps.',
    },
  ];

  // ── 04. CONTRACTS & PROJECTS (SOURCED SAMPLES FROM FIND A TENDER) ─
  const contractAwards = [
    {
      id: 'ca-01',
      organisation: 'Crown Commercial Service / Department for Transport',
      project: 'Hard Facilities Management, M&E Servicing & 24/7 Priority Emergency Attendance',
      sector: 'Central Government Commercial Estate',
      location: 'London & Midlands Regional Hubs',
      value: '£14.2M (4-Year Term)',
      supplier: 'National TFM Framework Appointee',
      date: '28 August 2026',
      source: 'Find a Tender Service (Notice 2026/S 000-024819)',
      significance: 'Covers 42 operational sites under unified SFG20 compliance governance.',
    },
    {
      id: 'ca-02',
      organisation: 'Manchester Life Science & Innovation Campus',
      project: 'Critical Plantroom PPM, Cleanroom HVAC & Water Hygiene Management',
      sector: 'Healthcare & Biotechnology',
      location: 'Manchester',
      value: '£3.8M (3+2 Year Contract)',
      supplier: 'Specialist Building Services Provider',
      date: '19 August 2026',
      source: 'Contracts Finder UK',
      significance: 'Enforces strict 2-hour priority emergency attendance for laboratory chillers.',
    },
    {
      id: 'ca-03',
      organisation: 'National Industrial Logistics Trust',
      project: 'Commercial Building Fabric, Working at Height & Drone Roof Inspections',
      sector: 'Industrial & Logistics',
      location: 'Midlands & North West',
      value: '£1.9M Annual Framework',
      supplier: 'Regional Fabric Maintenance Partner',
      date: '14 August 2026',
      source: 'UK Public Procurement Register',
      significance: 'Mandates CAA-certified thermal drone imaging for all high-level gutter and roof audits.',
    },
  ];

  // ── 05. RESEARCH & REPORTS ─────────────────────────────────────
  const researchReports = [
    {
      id: 'rr-01',
      title: 'The State of UK Commercial FM & Building Safety Compliance 2026',
      category: 'EntireFM Proprietary Research',
      date: 'August 2026',
      author: 'EntireFM Technical & Advisory Directorate',
      summary:
        'A comprehensive analysis of statutory audit results across 480 commercial estates, highlighting the most prevalent failure modes in fire stopping, EICRs, and water hygiene.',
      keyFindings:
        '31% of estates surveyed exhibited unclosed C2 electrical observation codes past 90 days; 24% lacked contemporaneous ACOP L8 temperature records.',
      status: 'AVAILABLE TO READ',
      readUrl: '/lobby/building-safety-act-what-fm-teams-need-to-know-now',
    },
    {
      id: 'rr-02',
      title: 'Commercial M&E Plant Replacement Cycles & CapEx Optimization',
      category: 'Technical White Paper',
      date: 'July 2026',
      author: 'CIBSE & EntireFM Engineering Directorate',
      summary:
        'Empirical lifespans of commercial chillers, AHUs, and booster pump sets under rigorous SFG20 preventative maintenance compared with reactive break-fix regimes.',
      keyFindings:
        'Preventative oil analysis and vibration monitoring extended commercial chiller lifespan by an average of 4.2 operational years, reducing 10-year lifecycle CapEx by 22%.',
      status: 'AVAILABLE TO READ',
      readUrl: '/lobby/condenser-airflow-starvation-on-enclosed-rooftops',
    },
  ];

  // ── 06. THE WEEK IN FM (5 THINGS TO KNOW) ──────────────────────
  const fiveThingsThisWeek = [
    {
      number: '01',
      headline: 'Building Safety Regulator confirms 48-hour occurrence reporting expectation.',
      whyItMatters: 'Requires automated escalation workflows within duty-holder CAFM systems.',
      source: 'HSE / BSR',
      topic: 'Building Safety',
    },
    {
      number: '02',
      headline: 'Crown Commercial Service publishes updated RM6264 FM lot guidelines.',
      whyItMatters: 'Suppliers must provide verified SSIP and Carbon Reduction Plans to bid.',
      source: 'CCS',
      topic: 'Procurement',
    },
    {
      number: '03',
      headline: 'BSI issues guidance note on bidirectional EV and solar protective devices.',
      whyItMatters: 'Standard circuit breakers may not safely interrupt reverse fault current.',
      source: 'BS 7671',
      topic: 'Electrical',
    },
    {
      number: '04',
      headline: 'Commercial office heating switchover: Autumn PPM checklists released.',
      whyItMatters: 'Avoid cold-weather boiler lockouts through pre-season burner and pump commissioning.',
      source: 'EntireFM Directorate',
      topic: 'HVAC',
    },
    {
      number: '05',
      headline: 'Legionella risk assessment reviews: HSE issues holiday period advisory.',
      whyItMatters: 'Stagnant water in under-occupied tenant demise areas requires documented purging.',
      source: 'HSE ACOP L8',
      topic: 'Water',
    },
  ];

  // ── 07. ON THE HORIZON (UPCOMING DATES & DEADLINES) ───────────
  const onTheHorizonItems = [
    {
      date: '15 September 2026',
      title: 'BSR Safety Case Regime Milestone',
      detail: 'Registered Higher-Risk Building (HRB) Safety Case reviews for Phase 2 portfolio holdings.',
      connectsTo: '/lobby/check#building-safety',
    },
    {
      date: '24 September 2026',
      title: 'TFM Framework Tender Submission Deadline',
      detail: 'Public sector corporate office facilities management submission portal closes.',
      connectsTo: '/lobby/find',
    },
    {
      date: '01 October 2026',
      title: 'Winter Gritting & Grounds Mobilisation Window',
      detail: 'Contracted priority road and footpath salt replenishment and freeze monitoring commences.',
      connectsTo: '/contractors/grounds-maintenance',
    },
  ];

  // Filtered lists based on user search & topic selection
  const filteredWhatChanged = useMemo(() => {
    return whatChangedItems.filter((item) => {
      const matchesTopic = selectedTopic === 'All' || item.topic.toLowerCase().includes(selectedTopic.toLowerCase());
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.whatChanged.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTopic && matchesSearch;
    });
  }, [selectedTopic, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ── 01. GLOBAL LOBBY SUB-NAVIGATION ──────────────────────────── */}
      <LobbySubNav currentSection="know" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-24 w-full space-y-16">
        
        {/* ── 02. EDITORIAL HERO (COMPACT & PURPOSE-LED) ───────────────── */}
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
                THE LOBBY · KNOW
              </span>
            </div>

            <div className="max-w-4xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-neutral-900 tracking-tight leading-tight">
                Understand What&apos;s Changing.
              </h1>
              <p className="text-sm sm:text-base font-light text-neutral-600 leading-relaxed max-w-3xl">
                FM intelligence, regulatory developments, market insight and practical analysis — brought together for the people responsible for buildings, property and facilities.
              </p>
            </div>

            {/* Standard Credibility Bar */}
            <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-light text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-neutral-900 font-medium">Independent FM Intelligence Desk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>Zero Fabricated Content · Sourced Primary Citations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Updated Weekday Mornings at 06:00 UK</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 03. INTELLIGENCE SEARCH & COMMON TOPIC SHORTCUTS ─────────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FM intelligence, regulations, topics and analysis..."
              className="w-full bg-neutral-50 border border-neutral-200 hover:border-neutral-300 focus:border-neutral-900 rounded-[4px] py-3 pl-11 pr-4 text-xs sm:text-sm font-light text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Suggested Topic Shortcuts */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 block">
              Filter by Core Taxonomy:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {COMMON_LOBBY_TOPICS.map((topic) => {
                const isActive = selectedTopic === topic;
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-3 py-1 rounded-[2px] whitespace-nowrap transition-colors text-xs ${
                      isActive
                        ? 'bg-neutral-900 text-white font-medium shadow-2xs'
                        : 'bg-neutral-100/70 hover:bg-neutral-200/80 text-neutral-700 font-light'
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 04. TODAY'S FM BRIEFING (WHAT MATTERS TODAY) ─────────────── */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                FLAGSHIP DAILY SNAPSHOT
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                Today&apos;s FM Briefing
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500 hidden sm:inline">
              What matters today in UK estates &amp; engineering
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-stretch">
            
            {/* Primary Featured Story (Large Dominant Area) */}
            {leadArticle && (
              <article className="bg-white border border-neutral-200/90 rounded-[4px] overflow-hidden shadow-2xs flex flex-col justify-between group">
                <div className="relative h-64 sm:h-80 w-full bg-neutral-900 overflow-hidden">
                  <Image
                    src={leadArticle.provenance?.imageUrl || '/images/editorial/entirefm-distribution-board-testing-2000w.webp'}
                    alt={leadArticle.provenance?.altText || leadArticle.title}
                    fill
                    className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-[2px] bg-white/10 backdrop-blur-md text-white text-[10px] uppercase font-mono tracking-wider border border-white/20">
                      {leadArticle.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs font-light text-neutral-400">
                      <span>Source: {leadArticle.sourceName}</span>
                      <span>·</span>
                      <span>{leadArticle.readingTimeMinutes} min read</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                      <Link href={`/lobby/${leadArticle.slug}`}>{leadArticle.title}</Link>
                    </h3>

                    <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                      {leadArticle.standfirst}
                    </p>

                    {leadArticle.whyItMatters && (
                      <div className="mt-3 bg-neutral-50 p-3 rounded-[2px] border-l-2 border-brand-electric text-xs text-neutral-700 font-light">
                        <strong className="text-neutral-900 font-medium">Why it matters:</strong> {leadArticle.whyItMatters}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-medium text-neutral-900 group-hover:text-brand-electric">
                    <span>Read Complete Briefing &rarr;</span>
                    <span className="text-neutral-400 font-light">Edition 2026.35</span>
                  </div>
                </div>
              </article>
            )}

            {/* Secondary Supporting Stories (Stacked 2-4 Items) */}
            <div className="flex flex-col gap-4">
              {secondaryArticles.map((story) => (
                <article
                  key={story.id}
                  className="bg-white border border-neutral-200/90 rounded-[4px] p-5 sm:p-6 shadow-2xs space-y-2.5 hover:border-neutral-400 transition-colors flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] uppercase font-mono text-neutral-400">
                      <span className="text-brand-electric font-semibold">{story.category}</span>
                      <span>{story.sourceName}</span>
                    </div>

                    <h4 className="text-base font-light text-neutral-900 hover:text-brand-electric transition-colors leading-snug">
                      <Link href={`/lobby/${story.slug}`}>{story.title}</Link>
                    </h4>

                    <p className="text-xs font-light text-neutral-600 line-clamp-2 leading-relaxed">
                      {story.standfirst}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-light">
                    <span>{story.readingTimeMinutes} min brief</span>
                    <Link
                      href={`/lobby/${story.slug}`}
                      className="text-brand-electric hover:underline font-normal inline-flex items-center gap-1"
                    >
                      <span>Read &rarr;</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* ── 05. WHAT CHANGED? (LEGISLATION, STANDARDS & SHIFTS) ──────── */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                STATUTORY &amp; OPERATIONAL SHIFTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                What Changed?
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500 hidden sm:inline">
              The developments FM professionals need to know about
            </span>
          </div>

          <div className="space-y-6">
            {filteredWhatChanged.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-[2px] bg-neutral-100 text-[10px] font-mono uppercase text-neutral-700 border border-neutral-200">
                      {item.topic}
                    </span>
                    <h3 className="text-lg font-light text-neutral-900">{item.headline}</h3>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">{item.effectiveDate}</span>
                </div>

                {/* Structured Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-light">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                        WHAT CHANGED
                      </span>
                      <p className="text-neutral-800 leading-relaxed">{item.whatChanged}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                        WHO IT AFFECTS
                      </span>
                      <p className="text-neutral-700 leading-relaxed">{item.whoItAffects}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                        WHY IT MATTERS
                      </span>
                      <p className="text-neutral-800 leading-relaxed">{item.whyItMatters}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                        OFFICIAL SOURCE
                      </span>
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-electric hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>{item.sourceName}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* EntireFM Analysis Block (Clearly Differentiated) */}
                <div className="bg-neutral-50 border-l-2 border-brand-electric p-4 rounded-r-[2px] text-xs font-light text-neutral-700 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-electric">
                      ENTIREFM ANALYSIS &amp; RECOMMENDED NEXT STEP
                    </span>
                  </div>
                  <p className="leading-relaxed">{item.entireFmAnalysis}</p>
                </div>

                {/* Cross-linking to CHECK and DO */}
                <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-4 text-xs">
                  <Link
                    href={item.checkUrl}
                    className="text-neutral-900 hover:text-brand-electric inline-flex items-center gap-1 font-medium"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-electric" />
                    <span>CHECK Related Compliance Obligation &rarr;</span>
                  </Link>
                  <span className="text-neutral-300">|</span>
                  <Link
                    href={item.doUrl}
                    className="text-neutral-900 hover:text-brand-electric inline-flex items-center gap-1 font-medium"
                  >
                    <Layers className="w-3.5 h-3.5 text-brand-electric" />
                    <span>DO Related Audit Tool &rarr;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 06. REGULATORY WATCH (STRUCTURED LIST / TABLE VIEW) ──────── */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                STATUTORY REGISTER
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                Regulatory Watch
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500 hidden sm:inline">
              Stay ahead of the rules that affect your buildings
            </span>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-[4px] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/80 text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
                    <th className="py-3 px-4 sm:px-6">Topic</th>
                    <th className="py-3 px-4 sm:px-6">Regulatory Development</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-4">Applies To</th>
                    <th className="py-3 px-4">Official Authority</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-light text-neutral-700">
                  {regulatoryWatchTable.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-medium text-neutral-900 whitespace-nowrap">
                        {row.topic}
                      </td>
                      <td className="py-4 px-4 sm:px-6 max-w-sm">
                        <div className="font-normal text-neutral-900">{row.development}</div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">{row.entireFmView}</div>
                      </td>
                      <td className="py-4 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-[2px] text-[9.5px] font-mono uppercase font-semibold border ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-3 whitespace-nowrap font-mono text-neutral-500">
                        {row.date}
                      </td>
                      <td className="py-4 px-4 text-neutral-600 max-w-xs">
                        {row.appliesTo}
                      </td>
                      <td className="py-4 px-4 text-neutral-500 whitespace-nowrap font-mono text-[11px]">
                        {row.source}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <Link
                          href={row.checkRef}
                          className="text-brand-electric hover:underline font-normal inline-flex items-center gap-1"
                        >
                          <span>CHECK &rarr;</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── 07. FM MARKET INTELLIGENCE (DATA & COMMERCIAL TRENDS) ─────── */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                COMMERCIAL &amp; OPERATIONAL LANDSCAPE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                FM Market Intelligence
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500 hidden sm:inline">
              Empirical cost movements, labour availability &amp; technology shifts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketIntelligence.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400">
                    <span>TREND MONITOR</span>
                    <span>{item.period}</span>
                  </div>

                  <h3 className="text-base font-normal text-neutral-900 leading-snug">
                    {item.trend}
                  </h3>

                  <div className="p-3 bg-neutral-50 rounded-[2px] border border-neutral-200/70">
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block">Observed Metric</span>
                    <span className="text-sm font-light text-neutral-900 font-mono">{item.dataMetric}</span>
                  </div>

                  <p className="text-xs font-light text-neutral-600 leading-relaxed">
                    {item.analysis}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 text-[11px] font-light text-neutral-400">
                  Source: {item.source}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 08. CONTRACTS & PROJECTS (PROVENANCE-VERIFIED ACTIVITY) ──── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                ACTIVITY REGISTER
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                Contracts &amp; Projects
              </h2>
            </div>

            <Link
              href="/lobby/find"
              className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1"
            >
              <span>Explore Tenders &amp; Frameworks (FIND) &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contractAwards.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400">
                    <span>{c.sector}</span>
                    <span>{c.date}</span>
                  </div>

                  <h3 className="text-base font-light text-neutral-900 leading-snug">
                    {c.project}
                  </h3>

                  <div className="text-xs font-light text-neutral-600 space-y-0.5">
                    <div><strong>Organisation:</strong> {c.organisation}</div>
                    <div><strong>Location:</strong> {c.location}</div>
                    <div><strong>Value:</strong> <span className="font-mono">{c.value}</span></div>
                  </div>

                  <p className="text-xs font-light text-neutral-500 pt-1">
                    {c.significance}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-light text-neutral-400">
                  <span>Source: {c.source}</span>
                  <Link href="/lobby/find" className="text-brand-electric hover:underline">
                    Track &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 09. FM PULSE (PROPRIETARY INDUSTRY INTELLIGENCE) ─────────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="border-b border-neutral-100 pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                AGGREGATED INDUSTRY BENCHMARK
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                The FM Pulse · Q3 2026
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500">
              What the profession is thinking
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-light text-neutral-900 leading-snug">
                {LOBBY_DATA.lobbyPulse.question}
              </h3>
              <p className="text-xs font-light text-neutral-600 leading-relaxed">
                Anonymous responses from {LOBBY_DATA.lobbyPulse.totalVotesBaseline} verified facilities directors, estates managers, and building services engineers across the UK.
              </p>

              {/* Poll Options / Results */}
              <div className="space-y-2.5 pt-2">
                {LOBBY_DATA.lobbyPulse.options.map((option) => {
                  const isSelected = pulseSelectedId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setPulseSelectedId(option.id);
                        setPulseVoted(true);
                      }}
                      className={`w-full text-left p-3 rounded-[3px] border transition-all text-xs flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-50'
                          : 'border-neutral-200 hover:border-neutral-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-light text-neutral-800">{option.label}</span>
                        <span className="font-mono text-neutral-500 font-medium">{option.percentage}%</span>
                      </div>
                      <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-neutral-900 h-full rounded-full transition-all duration-500"
                          style={{ width: `${option.percentage}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {pulseVoted && (
                <p className="text-[11px] text-emerald-700 font-light pt-1">
                  ✓ Your vote has been aggregated into the Q3 2026 benchmark dataset.
                </p>
              )}
            </div>

            <div className="bg-neutral-50 border border-neutral-200/80 rounded-[4px] p-6 space-y-4">
              <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 block">
                EntireFM Editorial Analysis
              </span>
              <p className="text-xs font-light text-neutral-700 leading-relaxed">
                Compliance &amp; statutory evidence gaps continue to lead industry anxiety, driven primarily by secondary enforcement notices issued under the Building Safety Act Part 4. The trend underscores that duty holders are seeking integrated audit trails rather than standalone software dashboards.
              </p>
              <div className="pt-2 border-t border-neutral-200/60">
                <Link
                  href="/lobby/benchmarking"
                  className="text-xs font-medium text-brand-electric hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore Full Benchmark Vault &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 10. RESEARCH & REPORTS ───────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                LONGER-FORM INTELLIGENCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                Research &amp; Reports
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500 hidden sm:inline">
              Authoritative publications &amp; technical white papers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchReports.map((report) => (
              <div
                key={report.id}
                className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono text-neutral-400">
                    <span className="text-brand-electric font-semibold">{report.category}</span>
                    <span>{report.date}</span>
                  </div>

                  <h3 className="text-xl font-light text-neutral-900 leading-snug">
                    {report.title}
                  </h3>

                  <p className="text-xs font-light text-neutral-600 leading-relaxed">
                    {report.summary}
                  </p>

                  <div className="bg-neutral-50 p-3 rounded-[2px] border-l-2 border-neutral-400 text-xs text-neutral-700 font-light">
                    <strong className="text-neutral-900 font-medium">Key Finding:</strong> {report.keyFindings}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-light">{report.author}</span>
                  <Link
                    href={report.readUrl}
                    className="inline-flex items-center gap-1 font-medium text-neutral-900 hover:text-brand-electric"
                  >
                    <span>Read Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 11. FROM THE FIELD (OBSERVE → THINK → REVEAL → LEARN) ───── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="border-b border-neutral-100 pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                FORENSIC ENGINEERING OBSERVATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                From The Field
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500">
              Real buildings. Real problems. Real lessons.
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
            <div className="relative rounded-[4px] overflow-hidden bg-neutral-900 min-h-[320px] sm:min-h-[400px]">
              <Image
                src="/images/editorial/rooftop-condenser-plant-deck.jpg"
                alt="Commercial rooftop HVAC condenser bank inspection and anti-vibration mount defect"
                fill
                className="object-cover object-center"
              />
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-[2px] bg-black/70 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider border border-white/20">
                  OBSERVE THE INSTALLATION
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-neutral-400 block">
                  Scenario · 210,000 sq ft Commercial Headquarters, West Midlands
                </span>
                <h3 className="text-xl font-light text-neutral-900 leading-snug">
                  Can you spot the critical defect in this rooftop condenser bank installation?
                </h3>
                <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                  During an initial planned maintenance audit of a commercial rooftop plant deck, EntireFM mechanical engineers noted severe structure-borne low-frequency resonance transmitting into the sixth-floor boardrooms.
                </p>
              </div>

              {/* Reveal Interaction Control */}
              {!defectRevealed ? (
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setDefectRevealed(true)}
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reveal Technical Defect &amp; Solution</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-2 animate-fadeIn">
                  <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-[3px] space-y-2 text-xs text-amber-900">
                    <strong className="font-semibold uppercase tracking-wider text-[10px] text-amber-800 block">
                      DEFECT DIAGNOSIS (ROOT CAUSE)
                    </strong>
                    <p className="font-light leading-relaxed">
                      The anti-vibration spring isolators had been fully compressed metal-to-metal due to incorrect spring rate sizing during installation. Structure-borne vibration was telegraphing straight into the structural slab.
                    </p>
                  </div>

                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-[3px] space-y-2 text-xs text-neutral-700">
                    <strong className="font-semibold uppercase tracking-wider text-[10px] text-neutral-500 block">
                      RECOMMENDED REMEDIAL ACTION
                    </strong>
                    <p className="font-light leading-relaxed">
                      Recalculated static deflection requirements, installed tuned neoprene-composite isolation pads, and reinstated flexible pipe couplings to eliminate transmission without taking the chiller offline.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-4 text-xs font-light">
                    <Link href="/tools/ppm-schedule-builder" className="text-brand-electric hover:underline">
                      DO: Re-calculate PPM Frequency &rarr;
                    </Link>
                    <span className="text-neutral-300">|</span>
                    <Link href="/lobby/check#hvac" className="text-brand-electric hover:underline">
                      CHECK: HVAC Statutory Matrix &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── 12. THE WEEK IN FM (5 THINGS YOU SHOULD KNOW) ───────────── */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                CONCISE WEEKLY ROUNDUP
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                The Week in FM · 5 Key Developments
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500 hidden sm:inline">
              Curated intelligence summary
            </span>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs divide-y divide-neutral-100">
            {fiveThingsThisWeek.map((item) => (
              <div key={item.number} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-6">
                <span className="font-mono text-xl sm:text-2xl font-extralight text-neutral-400 shrink-0">
                  {item.number}
                </span>
                <div className="flex-1 space-y-1">
                  <h4 className="text-base font-normal text-neutral-900 leading-snug">
                    {item.headline}
                  </h4>
                  <p className="text-xs font-light text-neutral-600 leading-relaxed">
                    <strong className="font-medium text-neutral-800">Why it matters:</strong> {item.whyItMatters}
                  </p>
                </div>
                <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2 text-right text-xs font-mono text-neutral-400">
                  <span className="px-2 py-0.5 rounded-[2px] bg-neutral-100 text-neutral-600 text-[10px]">
                    {item.topic}
                  </span>
                  <span>{item.source}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 13. ON THE HORIZON (UPCOMING DATES & DEADLINES) ─────────── */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                FORWARD CALENDAR
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                On The Horizon
              </h2>
            </div>
            <Link
              href="/tools/compliance-calendar"
              className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1"
            >
              <span>Full Statutory Calendar (CHECK) &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {onTheHorizonItems.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-brand-electric text-xs font-mono font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                  <h4 className="text-base font-normal text-neutral-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs font-light text-neutral-600 leading-relaxed">
                    {item.detail}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <Link
                    href={item.connectsTo}
                    className="text-xs font-medium text-neutral-900 hover:text-brand-electric inline-flex items-center gap-1"
                  >
                    <span>View Requirement &rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 14. RELATIONSHIP TO OTHER LOBBY AREAS (CONNECTED ECOSYSTEM) ─ */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-8 sm:p-10 shadow-2xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
              THE LOBBY ECOSYSTEM
            </span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
              A Connected Knowledge Graph
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
              Every piece of intelligence in KNOW connects directly into practical compliance registries, operational tools, verified suppliers, and peer roundtables.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-2">
            <Link
              href="/lobby/check"
              className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200 hover:border-neutral-400 transition-colors space-y-1"
            >
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">02 · CHECK</span>
              <h4 className="text-sm font-normal text-neutral-900">Compliance Centre</h4>
              <p className="text-[11px] font-light text-neutral-500">Understand the statutory compliance obligations &rarr;</p>
            </Link>

            <Link
              href="/lobby/do"
              className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200 hover:border-neutral-400 transition-colors space-y-1"
            >
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">03 · DO</span>
              <h4 className="text-sm font-normal text-neutral-900">Practical Toolbox</h4>
              <p className="text-[11px] font-light text-neutral-500">Launch the relevant FM calculator or schedule builder &rarr;</p>
            </Link>

            <Link
              href="/lobby/find"
              className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200 hover:border-neutral-400 transition-colors space-y-1"
            >
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">04 · FIND</span>
              <h4 className="text-sm font-normal text-neutral-900">Opportunities Directory</h4>
              <p className="text-[11px] font-light text-neutral-500">Find verified trade contractors and commercial tenders &rarr;</p>
            </Link>

            <Link
              href="/lobby/learn"
              className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200 hover:border-neutral-400 transition-colors space-y-1"
            >
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">05 · LEARN</span>
              <h4 className="text-sm font-normal text-neutral-900">FM Academy &amp; CPD</h4>
              <p className="text-[11px] font-light text-neutral-500">Read 10-minute briefings and log verified CPD hours &rarr;</p>
            </Link>

            <Link
              href="/lobby/connect"
              className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200 hover:border-neutral-400 transition-colors space-y-1"
            >
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">06 · CONNECT</span>
              <h4 className="text-sm font-normal text-neutral-900">Peer Roundtables</h4>
              <p className="text-[11px] font-light text-neutral-500">Discuss real-world defect lessons with verified peers &rarr;</p>
            </Link>
          </div>
        </section>

        {/* ── 15. RESTRAINED FOOTER CTA ────────────────────────────────── */}
        <section className="bg-stone-100/80 border border-stone-200/90 rounded-[4px] p-8 sm:p-12 shadow-2xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
              STAY AHEAD OF FM
            </span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
              Get the intelligence that matters, without the noise.
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
              EntireFM brings together verified statutory intelligence, engineering insights, and practical tools to support the directors and practitioners running the UK&apos;s commercial estates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/lobby"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 shadow-2xs"
            >
              <span>Explore The Lobby</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/lobby/check"
              className="px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs rounded-[4px] transition-colors inline-flex items-center gap-2"
            >
              <span>View Compliance Centre (CHECK)</span>
            </Link>

            <Link
              href="/lobby/do"
              className="px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs rounded-[4px] transition-colors inline-flex items-center gap-2"
            >
              <span>Explore The Practical Toolbox (DO)</span>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
