'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Award,
  Clock,
  Video,
  FileText,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Search,
  Calendar,
  Sparkles,
  Info,
  Layers,
  Building2,
  Wrench,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';

export function TemplateLobbyLearn() {
  const [activeTab, setActiveTab] = useState<'all' | 'briefings' | 'cpd' | 'webinars' | 'guides'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', label: 'All Learning' },
    { id: 'briefings', label: '10-Minute Briefings' },
    { id: 'cpd', label: 'CPD Activity & Log' },
    { id: 'webinars', label: 'Webinars & Masterclasses' },
    { id: 'guides', label: 'Technical Field Guides' },
  ];

  const tenMinuteBriefings = [
    {
      id: 'brief-01',
      title: 'Understanding the Building Safety Act 2022: Accountable Persons & The Golden Thread',
      category: 'Statutory Governance',
      duration: '10 min read · CPD Self-Certified (1.0h)',
      description:
        'A concise breakdown of Part 4 duties: identifying Accountable Persons, contemporaneous digital occurrence logging, and maintaining machine-readable asset records.',
      status: 'AVAILABLE',
      slug: 'building-safety-act-what-fm-teams-need-to-know-now',
      checkRef: '/lobby/check#building-safety',
      doRef: '/tools/compliance-checker',
    },
    {
      id: 'brief-02',
      title: 'EICR Explained: What Commercial Property Managers Need to Know About Electrical Observations',
      category: 'Electrical Engineering',
      duration: '8 min read · CPD Self-Certified (0.75h)',
      description:
        'Decoding Observation Codes C1 (Danger Present), C2 (Potentially Dangerous), and FI (Further Investigation). How to manage immediate remedial isolations and duty-holder liabilities.',
      status: 'AVAILABLE',
      slug: 'eicr-commercial-property-guide',
      checkRef: '/lobby/check#electrical',
      doRef: '/contractor-tools/contractor-compliance-check',
    },
    {
      id: 'brief-03',
      title: 'Legionella & ACOP L8: What Physical & Digital Evidence Must Estates Teams Hold?',
      category: 'Water Hygiene',
      duration: '10 min read · CPD Self-Certified (1.0h)',
      description:
        'Auditing temperature sentinel logs, calorifier purge records, TMV servicing sheets, and biennial Legionella Risk Assessments to survive an HSE inspection.',
      status: 'AVAILABLE',
      slug: 'acop-l8-legionella-evidence-requirements',
      checkRef: '/lobby/check#water',
      doRef: '/tools/compliance-calendar',
    },
    {
      id: 'brief-04',
      title: 'How to Mobilise an FM Contract: 90-Day Transition Without Compliance Gaps',
      category: 'Contract Mobilisation',
      duration: '12 min read · CPD Self-Certified (1.0h)',
      description:
        'Step-by-step estate handover governance: capturing legacy plant documentation, verifying asset registers, re-commissioning permits-to-work, and onboarding supply chains.',
      status: 'AVAILABLE',
      slug: 'how-much-asset-data-do-you-insist-on-before-mobilisation-sign-off',
      checkRef: '/lobby/check',
      doRef: '/tools/ppm-schedule-builder',
    },
    {
      id: 'brief-05',
      title: 'How to Audit a Subcontractor: Vetting RAMS, Insurance & Competency Matrices',
      category: 'Health & Safety',
      duration: '9 min read · CPD Self-Certified (0.75h)',
      description:
        'Practical methodologies for reviewing subcontractor risk assessments, checking SSIP accreditations, and verifying skill cards (CSCS, Gas Safe, REFCOM, NICEIC) before site entry.',
      status: 'AVAILABLE',
      slug: 'how-to-audit-subcontractor-rams',
      checkRef: '/lobby/check',
      doRef: '/contractor-tools/contractor-document-checklist',
    },
    {
      id: 'brief-06',
      title: 'Understanding SFG20: How Planned Preventative Maintenance Standards Are Built',
      category: 'Asset Engineering',
      duration: '11 min read · CPD Self-Certified (1.0h)',
      description:
        'Demystifying SFG20 statutory schedules, non-statutory maintenance tasks, and discretionary inspections. How to build a defensible annual PPM regime without over-spending.',
      status: 'AVAILABLE',
      slug: 'understanding-sfg20-maintenance-matrix',
      checkRef: '/lobby/check',
      doRef: '/tools/ppm-cost-estimator',
    },
  ];

  const webinars = [
    {
      id: 'web-01',
      title: 'Decarbonising Commercial Heating: High-Temperature Heat Pump Plantroom Retrofits',
      speaker: 'Senior Mechanical Building Services Engineer, EntireFM Directorate',
      date: 'Wednesday, 16 September 2026 · 10:00 BST',
      format: 'Live Technical Broadcast · Interactive Q&A',
      cpdCredit: '1.5 Hours Verifiable CPD',
      status: 'OPEN FOR REGISTRATION',
      href: '/lobby/events',
    },
    {
      id: 'web-02',
      title: 'Building Safety Act 2022 Part 4: Surviving the First BSR Statutory Audit',
      speaker: 'Director of Risk & Compliance Advisory, EntireFM',
      date: 'Recorded Masterclass · On-Demand Streaming',
      format: 'Archived Video + Case Study PDF',
      cpdCredit: '1.0 Hour Self-Certified CPD',
      status: 'ON-DEMAND ACCESS',
      href: '/lobby/events',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ── 01. SECONDARY SUB-NAVIGATION BAR ─────────────────────────── */}
      <LobbySubNav currentSection="learn" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 w-full space-y-12">
        
        {/* ── 02. BREADCRUMBS & PURPOSE MASTHEAD ───────────────────────── */}
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
            <Link href="/lobby" className="hover:text-neutral-900 transition-colors">
              The Lobby
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">LEARN</span>
          </nav>

          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 lg:p-12 shadow-2xs space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold">
                05 · PROFESSIONAL DEVELOPMENT &amp; EDUCATION
              </span>
            </div>

            <div className="max-w-4xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-neutral-900 tracking-tight leading-tight">
                Build Your Professional Edge.
              </h1>
              <p className="text-sm sm:text-base font-light text-neutral-600 leading-relaxed max-w-3xl">
                Ground-truth professional development for UK facilities leaders, estates managers, and building services engineers. Practical 10-minute technical briefings, verifiable CPD activity logs, engineering masterclasses, and field defect analyses.
              </p>
            </div>

            {/* CPD Standard Strip */}
            <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-light text-neutral-500">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="text-neutral-900 font-medium">Personal CPD Log &amp; Certificate Vault</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>Zero Fake Accreditations · Rigorous Technical Curriculum</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Micro-Learning (8–12 Min Structured Modules)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 03. HONEST ACCREDITATION STANDARD ────────────────────────── */}
        <div className="bg-blue-50/70 border border-blue-200/90 rounded-[4px] p-4 sm:p-6 text-xs text-blue-950 flex items-start gap-4">
          <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-blue-800 block">
              CPD Integrity &amp; Professional Recognition Policy
            </span>
            <p className="font-light leading-relaxed text-blue-900/90">
              EntireFM provides rigorous self-certified Continuing Professional Development (CPD) structured for your professional portfolio (such as CIBSE, IWFM, RICS, or IOSH). We do not claim fabricated university accreditations or proprietary fake certificates. Our learning modules are authored by chartered engineers and senior facilities directors for direct field utility.
            </p>
          </div>
        </div>

        {/* ── 04. CATEGORY TABS & SEARCH ───────────────────────────────── */}
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
              placeholder="Search briefings & guides..."
              className="w-full bg-white border border-neutral-200 rounded-[4px] px-3 py-1.5 pl-8 text-xs font-light text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-electric"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* ── 05. SECTION: 10-MINUTE TECHNICAL BRIEFINGS ───────────────── */}
        {(activeTab === 'all' || activeTab === 'briefings') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/90 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  TECHNICAL BRIEFINGS (MICRO-CURRICULUM)
                </span>
                <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                  10-Minute FM Briefings
                </h2>
              </div>

              <span className="text-xs font-light text-neutral-500">
                Peer-reviewed engineering &amp; compliance guides
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenMinuteBriefings.map((brief) => (
                <article
                  key={brief.id}
                  className="bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-[4px] p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-5 transition-colors group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] uppercase font-mono">
                      <span className="px-2 py-0.5 rounded-[2px] bg-neutral-100 text-neutral-700 border border-neutral-200">
                        {brief.category}
                      </span>
                      <span className="text-neutral-400 font-mono text-[11px]">{brief.duration}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                      {brief.title}
                    </h3>

                    <p className="text-xs font-light text-neutral-600 leading-relaxed">
                      {brief.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex flex-col space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/lobby/${brief.slug}`}
                        className="text-neutral-900 font-medium group-hover:text-brand-electric inline-flex items-center gap-1"
                      >
                        <span>Read Technical Brief</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-neutral-400 font-light border-t border-neutral-50">
                      <Link href={brief.checkRef} className="hover:text-brand-electric">
                        Check Duties &rarr;
                      </Link>
                      <span>·</span>
                      <Link href={brief.doRef} className="hover:text-brand-electric">
                        Run Tool &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── 06. SECTION: CPD ACTIVITY & TRANSCRIPT VAULT ─────────────── */}
        {(activeTab === 'all' || activeTab === 'cpd') && (
          <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 shadow-2xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  PROFESSIONAL LOGBOOK
                </span>
                <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight">
                  Your Personal CPD Hours &amp; Activity Log
                </h2>
                <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed max-w-2xl">
                  Track time spent reading regulatory briefs, completing webinars, and diagnosing technical scenarios. Export verified audit transcripts for your annual professional appraisal.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link
                  href="/lobby/me/cpd"
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 shadow-2xs"
                >
                  <span>Open Personal CPD Log</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-light text-neutral-600">
              <div className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200/70 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 block">Logging Mechanism</span>
                <p className="text-neutral-800 font-normal">Automated Reading &amp; Interaction Tracking</p>
                <p className="text-[11px] text-neutral-500">Every completed intelligence brief and technical challenge logs verified time.</p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200/70 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 block">Export Formats</span>
                <p className="text-neutral-800 font-normal">Signed PDF Activity Transcripts</p>
                <p className="text-[11px] text-neutral-500">Download formatted portfolios ready for CIBSE, IWFM, or RICS submission.</p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200/70 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 block">Ethics &amp; Standards</span>
                <p className="text-neutral-800 font-normal">Non-Fabricated Records</p>
                <p className="text-[11px] text-neutral-500">Only genuine verified reading and webinar attendances appear in your vault.</p>
              </div>
            </div>
          </section>
        )}

        {/* ── 07. SECTION: WEBINARS & RECORDED MASTERCLASSES ───────────── */}
        {(activeTab === 'all' || activeTab === 'webinars') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/90 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  TECHNICAL BROADCASTS
                </span>
                <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                  Webinars &amp; Industry Masterclasses
                </h2>
              </div>

              <Link
                href="/lobby/events"
                className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1"
              >
                <span>Full Events Calendar</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {webinars.map((web) => (
                <div
                  key={web.id}
                  className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] uppercase font-mono">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[2px] border border-emerald-200">
                        {web.status}
                      </span>
                      <span className="text-neutral-400">{web.cpdCredit}</span>
                    </div>

                    <h3 className="text-lg font-light text-neutral-900 leading-snug">
                      {web.title}
                    </h3>

                    <p className="text-xs font-light text-neutral-600">
                      <strong>Presenter:</strong> {web.speaker}
                    </p>

                    <p className="text-xs font-mono text-neutral-500">
                      {web.date} · {web.format}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <Link
                      href={web.href}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-900 hover:text-brand-electric"
                    >
                      <span>Reserve Broadcast Seat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 08. CROSS-LINKING NAVIGATION ─────────────────────────────── */}
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
            <Link href="/lobby/find" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">04 · DIRECTORY</span>
              <span className="text-neutral-900 font-medium">FIND &rarr;</span>
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
