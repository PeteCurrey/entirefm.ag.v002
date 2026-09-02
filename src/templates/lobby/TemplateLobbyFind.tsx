'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Briefcase,
  Users,
  Building2,
  FileCheck,
  ShieldCheck,
  MapPin,
  Clock,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Layers,
  Wrench,
  Flame,
  Zap,
  Droplets,
  Wind,
  Compass,
  AlertCircle,
  CheckCircle2,
  Filter,
  PlusCircle,
  HelpCircle,
  Award,
  ChevronRight,
  TrendingUp,
  Scale,
  Calendar,
  PhoneCall,
  Check,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import {
  type FindCategory,
  type ContractorListing,
  type SupplierListing,
  type ProfessionalListing,
  type TenderListing,
  type FrameworkListing,
  type JobPreview,
  CONTRACTOR_DIRECTORY,
  SUPPLIER_DIRECTORY,
  PROFESSIONAL_DIRECTORY,
  TENDER_DIRECTORY,
  FRAMEWORK_DIRECTORY,
  SAMPLE_FM_JOBS,
  SUPPLIER_MATCH_QUESTIONS,
} from '@/data/lobby/find-data';

interface TemplateLobbyFindProps {
  initialCategory?: FindCategory;
}

export function TemplateLobbyFind({ initialCategory = 'ALL' }: TemplateLobbyFindProps) {
  const [activeCategory, setActiveCategory] = useState<FindCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedTrade, setSelectedTrade] = useState<string>('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Guided Supplier Match interactive state
  const [matchStep, setMatchStep] = useState(1);
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({
    service: 'electrical',
    region: 'Midlands',
    buildingType: 'Commercial Offices',
    deliveryMode: 'ppm',
  });
  const [matchCompleted, setMatchCompleted] = useState(false);

  const categories: { id: FindCategory; label: string; count: number }[] = [
    { id: 'ALL', label: 'All Discovery', count: 26 },
    { id: 'JOBS', label: 'Jobs', count: SAMPLE_FM_JOBS.length },
    { id: 'CONTRACTORS', label: 'Contractors', count: CONTRACTOR_DIRECTORY.length },
    { id: 'SUPPLIERS', label: 'Suppliers', count: SUPPLIER_DIRECTORY.length },
    { id: 'PROFESSIONALS', label: 'Professionals', count: PROFESSIONAL_DIRECTORY.length },
    { id: 'TENDERS', label: 'Tenders', count: TENDER_DIRECTORY.length },
    { id: 'FRAMEWORKS', label: 'Frameworks', count: FRAMEWORK_DIRECTORY.length },
    { id: 'OPPORTUNITIES', label: 'Opportunities', count: 3 },
  ];

  // Filtered Contractors
  const filteredContractors = useMemo(() => {
    return CONTRACTOR_DIRECTORY.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        c.name.toLowerCase().includes(q) ||
        c.trade.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.regions.some((r) => r.toLowerCase().includes(q));

      const matchesRegion =
        selectedRegion === 'ALL' ||
        c.regions.includes(selectedRegion) ||
        c.regions.includes('National UK Coverage');

      const matchesTrade =
        selectedTrade === 'ALL' || c.tradeSlug.toLowerCase() === selectedTrade.toLowerCase();

      const matchesVerified = !verifiedOnly || c.verificationStatus === 'VERIFIED';

      return matchesSearch && matchesRegion && matchesTrade && matchesVerified;
    });
  }, [searchQuery, selectedRegion, selectedTrade, verifiedOnly]);

  // Guided Match Results
  const matchedContractors = useMemo(() => {
    return CONTRACTOR_DIRECTORY.filter((c) => {
      const matchesService = c.tradeSlug === matchAnswers.service;
      const matchesRegion =
        c.regions.includes(matchAnswers.region) || c.regions.includes('National UK Coverage');
      return matchesService && matchesRegion;
    });
  }, [matchAnswers]);

  const handleMatchSelect = (field: string, value: string) => {
    setMatchAnswers((prev) => ({ ...prev, [field]: value }));
    if (matchStep < SUPPLIER_MATCH_QUESTIONS.length) {
      setMatchStep((prev) => prev + 1);
    } else {
      setMatchCompleted(true);
    }
  };

  const handleResetMatch = () => {
    setMatchStep(1);
    setMatchCompleted(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ── 01. GLOBAL LOBBY SUB-NAVIGATION ──────────────────────────── */}
      <LobbySubNav currentSection="find" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-24 w-full space-y-16">
        
        {/* ── 02. HERO (DARK CINEMATIC MASTHEAD) ───────────────────────── */}
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
            <Link href="/lobby" className="hover:text-neutral-900 transition-colors">
              The Lobby
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">FIND</span>
          </nav>

          <div className="bg-neutral-950 text-white rounded-[4px] p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden border border-neutral-800">
            {/* Ambient Background Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-900/60 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-electric/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-6 bg-brand-electric" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold">
                  THE LOBBY · FIND
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight leading-tight text-white">
                  Find the people, opportunities and services behind FM.
                </h1>
                <p className="text-sm sm:text-base font-light text-neutral-400 leading-relaxed max-w-3xl">
                  A professional discovery centre bringing together UK facilities management appointments, specialist trade contractors, supply-chain partners, commercial tenders, and verified advisory practices.
                </p>
              </div>

              {/* Prominent Search Interface */}
              <div className="pt-2">
                <div className="relative max-w-2xl">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jobs, contractors, suppliers, tenders or services..."
                    className="w-full bg-neutral-900/90 border border-neutral-700 hover:border-neutral-500 focus:border-white rounded-[4px] py-3.5 pl-11 pr-4 text-xs sm:text-sm font-light text-white placeholder:text-neutral-500 focus:outline-none transition-colors shadow-inner"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-4" />
                </div>

                {/* Intelligent Quick-Entry Options */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-light text-neutral-400 pt-3">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-500 mr-1">
                    Quick Entry:
                  </span>
                  {[
                    { label: 'Find a Job', cat: 'JOBS' },
                    { label: 'Find a Contractor', cat: 'CONTRACTORS' },
                    { label: 'Find a Supplier', cat: 'SUPPLIERS' },
                    { label: 'Find a Professional', cat: 'PROFESSIONALS' },
                    { label: 'Find a Tender', cat: 'TENDERS' },
                    { label: 'Find an Opportunity', cat: 'OPPORTUNITIES' },
                  ].map((entry) => (
                    <button
                      key={entry.label}
                      type="button"
                      onClick={() => {
                        setActiveCategory(entry.cat as FindCategory);
                        setSearchQuery('');
                      }}
                      className="px-2.5 py-1 rounded-[2px] bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors text-xs border border-neutral-700/60"
                    >
                      {entry.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust & Transparency Footnote */}
              <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs font-light text-neutral-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-neutral-300">Grounded UK Directory</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                  <span>No Artificial Vanity Metrics or Paid Ranking Inflation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 03. PRIMARY FIND NAVIGATION (7 CORE CATEGORIES) ─────────── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-[4px] text-xs uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-neutral-900 text-white font-medium shadow-2xs'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-light'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-[2px] text-[10px] font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── 04. TRANSPARENCY BANNER: MEMBERSHIP ≠ VERIFICATION ──────── */}
        <section className="bg-amber-50/80 border border-amber-200/90 rounded-[4px] p-5 sm:p-6 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-semibold uppercase tracking-wider text-[10px]">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>EntireFM Standard: Commercial Membership ≠ Statutory Verification</span>
          </div>
          <p className="font-light leading-relaxed text-amber-900/90">
            <strong>Commercial Membership</strong> indicates that a contractor or supplier participates actively within the EntireFM partner network. <strong>Statutory Verification</strong> is a separate, independent check confirming audited £10M Employer Liability, £5M Public Liability, verified SSIP safety schemes (e.g. SafeContractor, CHAS), and trade competency credentials (NICEIC, Gas Safe, BAFE). We never allow commercial membership fees to manufacture fake verification badges.
          </p>
        </section>

        {/* ── 05. GUIDED SUPPLIER MATCH (INTELLIGENT SHORTLIST ENGINE) ─── */}
        {(activeCategory === 'ALL' || activeCategory === 'CONTRACTORS') && (
          <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  INTELLIGENT MATCHING ENGINE
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                  Find the Right Contractor
                </h2>
              </div>
              <span className="text-xs font-light text-neutral-500">
                Tailored discovery based on estate location, building type &amp; trade
              </span>
            </div>

            {!matchCompleted ? (
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>STEP {matchStep} OF {SUPPLIER_MATCH_QUESTIONS.length}</span>
                  <span>{SUPPLIER_MATCH_QUESTIONS[matchStep - 1].question}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUPPLIER_MATCH_QUESTIONS[matchStep - 1].options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleMatchSelect(SUPPLIER_MATCH_QUESTIONS[matchStep - 1].field, opt.value)}
                      className="p-3.5 text-left rounded-[4px] border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-colors text-xs font-light text-neutral-800 flex items-center justify-between group"
                    >
                      <span>{opt.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-[4px] border border-neutral-200 text-xs">
                  <div>
                    <strong className="text-neutral-900 font-medium">Selected Criteria:</strong>{' '}
                    <span className="text-neutral-600 font-light">
                      {matchAnswers.service.toUpperCase()} · {matchAnswers.region} · {matchAnswers.buildingType} · {matchAnswers.deliveryMode.toUpperCase()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetMatch}
                    className="text-brand-electric hover:underline text-xs font-medium"
                  >
                    Change Criteria
                  </button>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-mono text-neutral-500 block">
                    {matchedContractors.length} Verified Contractor{matchedContractors.length === 1 ? '' : 's'} Match Your Requirements:
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchedContractors.map((c) => (
                      <div
                        key={c.id}
                        className="p-5 rounded-[4px] border border-neutral-200/90 bg-white hover:border-neutral-400 transition-colors space-y-3"
                      >
                        <div className="flex items-baseline justify-between">
                          <h4 className="text-base font-normal text-neutral-900">{c.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {c.verificationStatus}
                          </span>
                        </div>
                        <p className="text-xs font-light text-neutral-600">{c.description}</p>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          Insurance: {c.insuranceLevel}
                        </div>
                        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                          <Link href={c.profileUrl} className="text-brand-electric font-medium hover:underline">
                            View Capability Profile &rarr;
                          </Link>
                          {c.complianceConnectionUrl && (
                            <Link href={c.complianceConnectionUrl} className="text-neutral-400 hover:text-neutral-700 text-[11px]">
                              CHECK Regulations &rarr;
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── 06. CONTRACTORS SECTION ──────────────────────────────────── */}
        {(activeCategory === 'ALL' || activeCategory === 'CONTRACTORS') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200/90 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  TRADE CONTRACTORS DIRECTORY
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                  Specialist Trade Contractors
                </h2>
              </div>
              <Link href="/contractors" className="text-xs text-brand-electric hover:underline font-light">
                View Full Contractors Hub &rarr;
              </Link>
            </div>

            {/* Structured Contractor Filter Bar */}
            <div className="bg-white border border-neutral-200/90 rounded-[4px] p-4 flex flex-wrap items-center gap-4 text-xs font-light text-neutral-600">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-neutral-400" />
                <span>Filter by Region:</span>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-neutral-50 border border-neutral-200 rounded-[2px] px-2 py-1 text-xs text-neutral-800 focus:outline-none"
                >
                  <option value="ALL">All Regions</option>
                  <option value="Midlands">Midlands</option>
                  <option value="London & South East">London &amp; South East</option>
                  <option value="North West">North West</option>
                  <option value="Yorkshire">Yorkshire</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span>Trade Discipline:</span>
                <select
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className="bg-neutral-50 border border-neutral-200 rounded-[2px] px-2 py-1 text-xs text-neutral-800 focus:outline-none"
                >
                  <option value="ALL">All Trades</option>
                  <option value="electrical">Electrical</option>
                  <option value="hvac">HVAC &amp; Chillers</option>
                  <option value="fire-security">Fire Safety</option>
                  <option value="plumbing">Plumbing &amp; Water</option>
                  <option value="roofing">Roofing &amp; Drone</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="grounds-maintenance">Grounds &amp; Gritting</option>
                  <option value="drainage">Drainage</option>
                </select>
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-brand-electric focus:ring-0"
                />
                <span className="text-neutral-800 font-medium">Verified Evidence Only</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContractors.map((contractor) => (
                <div
                  key={contractor.id}
                  className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-neutral-400 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-brand-electric font-semibold">
                        {contractor.trade}
                      </span>
                      <span
                        className={`text-[9.5px] font-mono px-2 py-0.5 rounded-[2px] font-semibold border ${
                          contractor.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                        }`}
                      >
                        {contractor.verificationStatus}
                      </span>
                    </div>

                    <h3 className="text-lg font-light text-neutral-900 leading-snug">
                      <Link href={contractor.profileUrl} className="hover:text-brand-electric transition-colors">
                        {contractor.name}
                      </Link>
                    </h3>

                    <p className="text-xs font-light text-neutral-600 leading-relaxed">
                      {contractor.description}
                    </p>

                    <div className="space-y-1 text-[11px] font-light text-neutral-500">
                      <div>
                        <strong>Coverage:</strong> {contractor.regions.join(', ')}
                      </div>
                      <div>
                        <strong>Accreditations:</strong> {contractor.statutoryAccreditations.join(' · ')}
                      </div>
                      <div>
                        <strong>Insurance:</strong> {contractor.insuranceLevel}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <Link href={contractor.profileUrl} className="text-neutral-900 hover:text-brand-electric font-medium inline-flex items-center gap-1">
                      <span>View Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {contractor.complianceConnectionUrl && (
                      <Link href={contractor.complianceConnectionUrl} className="text-neutral-400 hover:text-brand-electric text-[11px]">
                        CHECK Duties &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 07. JOBS BOARD SECTION ───────────────────────────────────── */}
        {(activeCategory === 'ALL' || activeCategory === 'JOBS') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200/90 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  FM CAREERS &amp; APPOINTMENTS
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                  Facilities Management Jobs
                </h2>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <Link href="/lobby/jobs/post" className="text-neutral-900 hover:text-brand-electric font-medium inline-flex items-center gap-1">
                  <PlusCircle className="w-3.5 h-3.5 text-brand-electric" />
                  <span>Post an FM Role</span>
                </Link>
                <Link href="/lobby/jobs" className="text-brand-electric hover:underline font-light">
                  View Full Board ({SAMPLE_FM_JOBS.length}) &rarr;
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAMPLE_FM_JOBS.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs space-y-3 flex flex-col justify-between hover:border-neutral-400 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                      <span className="text-brand-electric font-semibold uppercase">{job.discipline}</span>
                      <span>Posted {job.postedDate}</span>
                    </div>

                    <h3 className="text-lg font-light text-neutral-900 hover:text-brand-electric transition-colors">
                      <Link href={`/lobby/jobs`}>{job.title}</Link>
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-light text-neutral-600">
                      <div><strong>Employer:</strong> {job.employer}</div>
                      <div><strong>Location:</strong> {job.location}</div>
                      {job.salaryGuide && (
                        <div><strong>Salary:</strong> <span className="font-mono text-neutral-800">{job.salaryGuide}</span></div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-neutral-500 uppercase">
                      {job.employmentType} · {job.locationType}
                    </span>
                    <Link href={`/lobby/jobs`} className="text-brand-electric hover:underline font-medium">
                      View Role &amp; Apply &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 08. TENDERS & PROCUREMENT OPPORTUNITIES ──────────────────── */}
        {(activeCategory === 'ALL' || activeCategory === 'TENDERS') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200/90 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  PUBLIC &amp; COMMERCIAL PROCUREMENT
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                  Tenders &amp; Contracts
                </h2>
              </div>
              <Link href="/lobby/opportunities" className="text-xs text-brand-electric hover:underline font-light">
                View All Opportunities Feed &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TENDER_DIRECTORY.map((tender) => (
                <div
                  key={tender.id}
                  className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                      <span className="text-brand-electric font-semibold">{tender.serviceCategory}</span>
                      <span>Deadline: {tender.deadlineDate}</span>
                    </div>

                    <h3 className="text-base font-light text-neutral-900 leading-snug">
                      {tender.title}
                    </h3>

                    <div className="space-y-1 text-xs font-light text-neutral-600">
                      <div><strong>Buyer:</strong> {tender.buyer}</div>
                      <div><strong>Location:</strong> {tender.location}</div>
                      {tender.estimatedValue && (
                        <div><strong>Est. Value:</strong> <span className="font-mono">{tender.estimatedValue}</span></div>
                      )}
                    </div>

                    <p className="text-xs font-light text-neutral-500 pt-1">
                      {tender.significanceSummary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-light text-neutral-400">
                    <span>Source: {tender.procurementRoute}</span>
                    <a
                      href={tender.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-electric hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <span>Notice</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 09. SUPPLIERS & SUPPLY CHAIN PARTNERS ─────────────────────── */}
        {(activeCategory === 'ALL' || activeCategory === 'SUPPLIERS') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200/90 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  PRODUCTS, MATERIALS &amp; SOFTWARE
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                  Suppliers &amp; Technology Partners
                </h2>
              </div>
              <Link href="/suppliers" className="text-xs text-brand-electric hover:underline font-light">
                Supplier Ecosystem Hub &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SUPPLIER_DIRECTORY.map((supplier) => (
                <div
                  key={supplier.id}
                  className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                      <span className="text-brand-electric font-semibold">{supplier.category}</span>
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-neutral-100 text-neutral-600">
                        {supplier.verificationStatus}
                      </span>
                    </div>

                    <h3 className="text-base font-light text-neutral-900 leading-snug">
                      {supplier.name}
                    </h3>

                    <p className="text-xs font-light text-neutral-600 leading-relaxed">
                      {supplier.description}
                    </p>

                    <div className="space-y-1 text-xs font-light text-neutral-500 pt-1">
                      <div><strong>Products:</strong> {supplier.products.join(', ')}</div>
                      <div><strong>Coverage:</strong> {supplier.deliveryCoverage}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <Link href={supplier.applyUrl} className="text-brand-electric hover:underline font-medium">
                      Partner Application &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 10. INDEPENDENT PROFESSIONALS & CONSULTANTS ───────────────── */}
        {(activeCategory === 'ALL' || activeCategory === 'PROFESSIONALS') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200/90 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  ADVISORY &amp; CHARTERED PRACTICES
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                  Independent FM Professionals
                </h2>
              </div>
              <span className="text-xs font-light text-neutral-500">
                Zero vanity metrics · Sourced chartered disciplines
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PROFESSIONAL_DIRECTORY.map((prof) => (
                <div
                  key={prof.id}
                  className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                      <span className="text-brand-electric font-semibold">{prof.discipline}</span>
                      <span>{prof.professionalBody.split('(')[1]?.replace(')', '') || 'Chartered'}</span>
                    </div>

                    <h3 className="text-base font-light text-neutral-900 leading-snug">
                      {prof.name}
                    </h3>

                    <p className="text-xs font-light text-neutral-600 leading-relaxed">
                      {prof.description}
                    </p>

                    <div className="space-y-1 text-xs font-light text-neutral-500 pt-1">
                      <div><strong>Body:</strong> {prof.professionalBody}</div>
                      <div><strong>Statutory Focus:</strong> {prof.statutoryFocus}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <Link href={prof.contactRoute} className="text-neutral-900 hover:text-brand-electric font-medium">
                      Consult via CONNECT &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 11. FRAMEWORKS & PROCUREMENT LOTS ────────────────────────── */}
        {(activeCategory === 'ALL' || activeCategory === 'FRAMEWORKS') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200/90 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  PUBLIC SECTOR BUYING VEHICLES
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                  Procurement Frameworks
                </h2>
              </div>
              <span className="text-xs font-light text-neutral-500">
                Official UK buying routes &amp; supplier lot specifications
              </span>
            </div>

            <div className="space-y-4">
              {FRAMEWORK_DIRECTORY.map((fw) => (
                <div
                  key={fw.id}
                  className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase text-brand-electric font-semibold">
                        {fw.contractingAuthority} · {fw.lotName}
                      </span>
                      <h3 className="text-lg font-light text-neutral-900">{fw.frameworkName}</h3>
                    </div>
                    <span className="text-xs font-mono text-neutral-500">Active to {fw.expiryDate}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light text-neutral-600 pt-2 border-t border-neutral-100">
                    <div>
                      <strong>Services Covered:</strong> {fw.servicesCovered.join(', ')}
                    </div>
                    <div>
                      <strong>Eligibility:</strong> {fw.eligibilityNotes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 12. "REQUEST A SUPPLIER" CONCIERGE PATHWAY ───────────────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-8 sm:p-12 shadow-2xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
              BUYER SOURCING CONCIERGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
              Cannot find the exact trade capability your estate requires?
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
              If your commercial estate has complex statutory or multi-site requirements, the EntireFM supply chain desk can assist in pre-qualifying specialist contractors against your specific scope of works.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/tools/tender-brief"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 shadow-2xs font-medium"
            >
              <span>Build Tender Specification Brief (DO)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/suppliers/partner-with-entirefm"
              className="px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs rounded-[4px] transition-colors inline-flex items-center gap-2"
            >
              <span>Contractor Partner Enquiries</span>
            </Link>
          </div>
        </section>

        {/* ── 13. COMMERCIAL BRIDGE TO CONTRACTOR MEMBERSHIP ───────────── */}
        <section className="bg-stone-100/80 border border-stone-200/90 rounded-[4px] p-8 sm:p-12 shadow-2xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
              SUPPLY CHAIN NETWORK
            </span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
              Join the EntireFM Contractor &amp; Supplier Network
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
              Maintain professional visibility with property managers and facilities directors running major commercial estates across the UK. Showcase your verified statutory accreditations and insurance credentials directly to active buyers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/suppliers/apply"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 shadow-2xs font-medium"
            >
              <span>Apply for Supplier Onboarding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/suppliers/standards"
              className="px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs rounded-[4px] transition-colors inline-flex items-center gap-2"
            >
              <span>View Audit Standards &amp; Criteria</span>
            </Link>
          </div>
        </section>

        {/* ── 14. CROSS-LINKING THE 6 LOBBY WORLDS ─────────────────────── */}
        <section className="pt-6 border-t border-neutral-200/90">
          <div className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-4">
            Navigate The Lobby Knowledge Graph
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <Link href="/lobby/know" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">01 · INTELLIGENCE</span>
              <span className="text-neutral-900 font-medium">KNOW &rarr;</span>
            </Link>
            <Link href="/lobby/check" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">02 · OBLIGATIONS</span>
              <span className="text-neutral-900 font-medium">CHECK &rarr;</span>
            </Link>
            <Link href="/lobby/do" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">03 · WORKBENCH</span>
              <span className="text-neutral-900 font-medium">DO &rarr;</span>
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
