'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Building2,
  FileCheck,
  Search,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  ExternalLink,
  PlusCircle,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wrench,
  TrendingUp,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';

export function TemplateLobbyFind() {
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'tenders' | 'contractors' | 'professionals' | 'suppliers'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobCategory, setSelectedJobCategory] = useState<string>('All Disciplines');

  const tabs = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'jobs', label: 'Jobs Board' },
    { id: 'tenders', label: 'Tenders & Frameworks' },
    { id: 'contractors', label: 'Contractor Directory' },
    { id: 'professionals', label: 'Professional Services' },
    { id: 'suppliers', label: 'Suppliers & Partners' },
  ];

  const jobCategories = [
    'All Disciplines',
    'Facilities Management',
    'Estates Management',
    'Property Management',
    'Building Management',
    'M&E Engineering',
    'Compliance & Safety',
    'Operations & Helpdesk',
    'Procurement',
    'Sustainability & Energy',
    'Cleaning & Soft FM',
    'Senior Leadership',
  ];

  const sampleJobs = [
    {
      id: 'job-01',
      title: 'Commercial HVAC & Chiller Specialist Engineer',
      location: 'Manchester & North West',
      type: 'Permanent · Full-time',
      salary: '£46,000 - £52,000 + Van & Callout',
      sector: 'Commercial Plantrooms',
      category: 'M&E Engineering',
      posted: '2 days ago',
      href: '/careers/commercial-hvac-chiller-technician-manchester',
    },
    {
      id: 'job-02',
      title: 'Senior Contract Mobilisation Project Manager',
      location: 'London & Home Counties',
      type: 'Permanent · Hybrid',
      salary: '£60,000 - £68,000 + Bonus',
      sector: 'Total Facilities Management',
      category: 'Operations & Helpdesk',
      posted: '3 days ago',
      href: '/careers/contract-mobilisation-project-manager',
    },
    {
      id: 'job-03',
      title: 'Mobile Building Services M&E Engineer',
      location: 'Central London (City & West End)',
      type: 'Permanent · Mobile',
      salary: '£45,000 - £48,000 + Travel',
      sector: 'Commercial Offices',
      category: 'M&E Engineering',
      posted: '5 days ago',
      href: '/careers/commercial-me-mobile-engineer-london',
    },
  ];

  const tenders = [
    {
      id: 'tnd-01',
      title: 'Total Facilities Management & Hard Services Contract — 240,000 sq ft Commercial Office Estate',
      authority: 'London Borough Commercial Landlord',
      value: '£2.4M - £3.0M per annum (3+2 Year Contract)',
      deadline: '24 September 2026',
      status: 'OPEN FOR SUBMISSION',
      sector: 'Corporate Office',
    },
    {
      id: 'tnd-02',
      title: 'Statutory M&E Planned Preventative Maintenance & 24/7 Reactive Coverage',
      authority: 'Midlands Healthcare & Science Park Trust',
      value: '£850k per annum',
      deadline: '02 October 2026',
      status: 'EXPRESSION OF INTEREST',
      sector: 'Science & Commercial Lab',
    },
    {
      id: 'tnd-03',
      title: 'Commercial Fabric, Roofing & Working at Height Framework Lot 3',
      authority: 'National Logistics Portfolio Operator',
      value: '£1.2M Framework Pool',
      deadline: '15 October 2026',
      status: 'OPEN FOR SUBMISSION',
      sector: 'Industrial & Logistics',
    },
  ];

  const contractorTrades = [
    { name: 'HVAC & Climate Control', count: 'Verified Engineers', href: '/contractors/hvac' },
    { name: 'Electrical & Fixed Wire (EICR)', count: 'NICEIC / ECA', href: '/contractors/electrical' },
    { name: 'Mechanical & Plumbing', count: 'Gas Safe / Water', href: '/contractors/plumbing' },
    { name: 'Fire Safety & Alarms', count: 'BAFE Registered', href: '/contractors/fire-security' },
    { name: 'Commercial Cleaning & Waste', count: 'BICSc Standards', href: '/contractors/cleaning' },
    { name: 'Roofing & Building Fabric', count: 'Rope Access & BMU', href: '/contractors/roofing' },
    { name: 'Drainage & Wastewater', count: 'CCTV Surveyors', href: '/contractors/drainage' },
    { name: 'Grounds & Winter Gritting', count: 'BALI Standards', href: '/contractors/grounds-maintenance' },
  ];

  const professionalServices = [
    {
      title: 'FM & Operations Consultants',
      description: 'Independent advice on contract delivery models, procurement specifications, and CAFM optimisation.',
      scope: 'Tender specification, SLA audits, benchmarking',
    },
    {
      title: 'Chartered Building Surveyors (RICS)',
      description: 'Planned maintenance surveys, dilapidations claims, condition audits, and capital expenditure forecasts.',
      scope: '5-year CapEx plans, defect diagnostics, party wall',
    },
    {
      title: 'Building Services & M&E Consulting Engineers',
      description: 'Specialist mechanical, electrical, and public health design validation and plant replacement schemes.',
      scope: 'CIBSE Guide M audits, thermal modeling, decarbonisation',
    },
    {
      title: 'Fire Safety & Life Safety Consultants',
      description: 'Type 1 to Type 4 Fire Risk Assessments, compartmentalisation surveys, and fire door gap audits.',
      scope: 'Building Safety Act compliance, evacuation modeling',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ── 01. SECONDARY SUB-NAVIGATION BAR ─────────────────────────── */}
      <LobbySubNav currentSection="find" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 w-full space-y-12">
        
        {/* ── 02. BREADCRUMBS & PURPOSE MASTHEAD ───────────────────────── */}
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
            <Link href="/lobby" className="hover:text-neutral-900 transition-colors">
              The Lobby
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">FIND</span>
          </nav>

          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 lg:p-12 shadow-2xs space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold">
                04 · OPPORTUNITIES &amp; DIRECTORY
              </span>
            </div>

            <div className="max-w-4xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-neutral-900 tracking-tight leading-tight">
                Find People, Suppliers and Opportunities.
              </h1>
              <p className="text-sm sm:text-base font-light text-neutral-600 leading-relaxed max-w-3xl">
                The trusted marketplace and talent directory for UK commercial property operations. Professional FM appointments, commercial tenders, verified trade contractors, and supply chain partnerships.
              </p>
            </div>

            {/* Verification Standard Notice */}
            <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-light text-neutral-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-neutral-900 font-medium">Strict Verification Policy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
                <span>No Fabricated Badges · Evidence-Backed Vetting</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                <span>Direct Employer &amp; Contractor Connections</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 03. TABS & SEARCH CONTROLS ───────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-neutral-200/90 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-[4px] text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-neutral-900 text-white font-medium shadow-2xs'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-light'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative shrink-0 sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, tenders, contractors..."
              className="w-full bg-white border border-neutral-200 rounded-[4px] px-3 py-1.5 pl-8 text-xs font-light text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-electric"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* ── 04. SECTION: FM JOBS BOARD ───────────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'jobs') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/90 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  TALENT &amp; APPOINTMENTS
                </span>
                <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                  Dedicated FM &amp; Estates Jobs Board
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/lobby/jobs/post"
                  className="px-4 py-2 bg-brand-electric hover:bg-blue-600 text-white text-xs font-light uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post an FM Role</span>
                </Link>
                <Link
                  href="/lobby/jobs"
                  className="text-xs font-light text-neutral-700 hover:text-neutral-900 hover:underline"
                >
                  View Full Board &rarr;
                </Link>
              </div>
            </div>

            {/* Discipline Pill Scroller */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
              {jobCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedJobCategory(cat)}
                  className={`px-3 py-1 rounded-[2px] whitespace-nowrap transition-colors ${
                    selectedJobCategory === cat
                      ? 'bg-neutral-900 text-white font-normal'
                      : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Job Listings Cards */}
            <div className="space-y-3">
              {sampleJobs.map((job) => (
                <Link
                  key={job.id}
                  href={job.href}
                  className="bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-[4px] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors group"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-light text-neutral-500">
                      <span className="px-2 py-0.5 rounded-[2px] bg-neutral-100 text-neutral-700 text-[10px] font-mono uppercase">
                        {job.category}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        {job.location}
                      </span>
                      <span>·</span>
                      <span>{job.type}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                      {job.title}
                    </h3>

                    <p className="text-xs font-mono text-neutral-700">
                      {job.salary}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-4 text-xs font-light text-neutral-500">
                    <span className="hidden sm:inline">{job.posted}</span>
                    <span className="inline-flex items-center gap-1 text-neutral-900 group-hover:text-brand-electric font-medium">
                      <span>View Specification</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── 05. SECTION: TENDERS & FRAMEWORKS ─────────────────────────── */}
        {(activeTab === 'all' || activeTab === 'tenders') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/90 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  PROCUREMENT &amp; CONTRACTS
                </span>
                <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                  Active Commercial Tenders &amp; Frameworks
                </h2>
              </div>

              <Link
                href="/lobby/opportunities"
                className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1"
              >
                <span>All Procurement Notices</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tenders.map((tnd) => (
                <div
                  key={tnd.id}
                  className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-neutral-400 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] uppercase font-mono">
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-[2px] border border-emerald-200">
                        {tnd.status}
                      </span>
                      <span className="text-neutral-400">{tnd.sector}</span>
                    </div>

                    <h3 className="text-base font-light text-neutral-900 leading-snug">
                      {tnd.title}
                    </h3>

                    <p className="text-xs font-light text-neutral-600">
                      <strong>Client:</strong> {tnd.authority}
                    </p>

                    <div className="pt-2 text-xs font-mono text-neutral-800">
                      {tnd.value}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-light text-neutral-500">
                    <span>Deadline: {tnd.deadline}</span>
                    <Link
                      href="/lobby/opportunities"
                      className="text-brand-electric hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <span>Details &rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 06. SECTION: VERIFIED CONTRACTORS & SPECIALISTS ──────────── */}
        {(activeTab === 'all' || activeTab === 'contractors') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/90 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  TRADE CONTRACTOR DIRECTORY
                </span>
                <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                  Specialist Engineering &amp; Trade Contractors
                </h2>
              </div>

              <Link
                href="/contractors"
                className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1"
              >
                <span>Full Contractor Directory</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {contractorTrades.map((trade) => (
                <Link
                  key={trade.name}
                  href={trade.href}
                  className="bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-[4px] p-5 shadow-2xs transition-colors space-y-1 group"
                >
                  <h4 className="text-sm font-normal text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                    {trade.name}
                  </h4>
                  <p className="text-[11px] font-mono text-neutral-500">
                    {trade.count}
                  </p>
                  <span className="text-[11px] text-brand-electric pt-2 block font-light">
                    Browse trade &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── 07. SECTION: PROFESSIONAL SERVICES DIRECTORY ─────────────── */}
        {(activeTab === 'all' || activeTab === 'professionals') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/90 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  ADVISORY &amp; SURVEYING
                </span>
                <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                  Professional Services &amp; Technical Consultants
                </h2>
              </div>

              <span className="text-xs font-light text-neutral-500">
                Independent RICS &amp; CIBSE Consultants
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {professionalServices.map((prof) => (
                <div
                  key={prof.title}
                  className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs space-y-3"
                >
                  <h3 className="text-lg font-light text-neutral-900">
                    {prof.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                    {prof.description}
                  </p>
                  <div className="pt-2 text-xs font-light text-neutral-500 border-t border-neutral-100 flex items-center justify-between">
                    <span>Scope: {prof.scope}</span>
                    <Link
                      href="/contact?subject=Consultant%20Introduction"
                      className="text-brand-electric hover:underline font-medium"
                    >
                      Enquire &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 08. SECTION: SUPPLIERS & PARTNERSHIP ONBOARDING ───────────── */}
        {(activeTab === 'all' || activeTab === 'suppliers') && (
          <section className="bg-stone-100/80 border border-stone-200/90 rounded-[4px] p-8 sm:p-12 shadow-2xs space-y-6">
            <div className="max-w-3xl space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                SUPPLIER ONBOARDING &amp; VETTING
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                Join the Verified EntireFM Partner Supply Chain
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                We connect certified UK regional contractors and product suppliers directly to multi-site commercial estates. We enforce non-negotiable compliance audits: active public liability insurance, SSIP certification, and verified technical credentials.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/suppliers/apply"
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 shadow-2xs"
              >
                <span>Apply for Supplier Vetting</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/suppliers"
                className="px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs rounded-[4px] transition-colors inline-flex items-center gap-2"
              >
                <span>Explore Supplier Network</span>
              </Link>
            </div>
          </section>
        )}

        {/* ── 09. CROSS-LINKING NAVIGATION ─────────────────────────────── */}
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
              <span className="text-neutral-400 text-[10px] block">03 · TOOLBOX</span>
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
