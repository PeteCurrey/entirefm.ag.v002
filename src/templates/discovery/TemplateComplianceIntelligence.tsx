'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import {
  ShieldCheck,
  Calendar,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  HelpCircle,
  Bell,
  BookOpen,
  Wrench,
} from 'lucide-react';
import type {
  ComplianceRecord,
  ConsultationItem,
  RegulatorActivityItem,
  HorizonTimelineMilestone,
} from '@/server/compliance/compliance-store';

const DISCIPLINES = [
  { id: 'all', label: 'All Disciplines' },
  { id: 'building-safety', label: 'Building Safety' },
  { id: 'fire', label: 'Fire Safety' },
  { id: 'electrical', label: 'Electrical (BS 7671)' },
  { id: 'water', label: 'Water Hygiene (L8)' },
  { id: 'hvac', label: 'HVAC & F-Gas' },
  { id: 'lifts', label: 'Lifts (LOLER)' },
  { id: 'asbestos', label: 'Asbestos' },
  { id: 'energy', label: 'Energy & MEES' },
];

const JURISDICTIONS = ['All UK', 'England', 'Wales', 'Scotland', 'Northern Ireland'];

export function TemplateComplianceIntelligence() {
  const router = useRouter();

  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [horizon, setHorizon] = useState<HorizonTimelineMilestone[]>([]);
  const [regulators, setRegulators] = useState<RegulatorActivityItem[]>([]);
  const [activeDiscipline, setActiveDiscipline] = useState('all');
  const [activeJurisdiction, setActiveJurisdiction] = useState('All UK');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [followedDisciplines, setFollowedDisciplines] = useState<string[]>([]);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompliance() {
      try {
        const jurisdictionParam = activeJurisdiction === 'All UK' ? 'all' : activeJurisdiction;
        const res = await fetch(
          `/api/lobby/compliance?discipline=${activeDiscipline}&jurisdiction=${encodeURIComponent(
            jurisdictionParam
          )}`
        );
        const data = await res.json();
        setRecords(data.records || []);
        setConsultations(data.consultations || []);
        setHorizon(data.horizon || []);
        setRegulators(data.regulators || []);
      } catch (err) {
        console.error('Error loading compliance records:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCompliance();
  }, [activeDiscipline, activeJurisdiction]);

  const toggleFollow = (disciplineId: string) => {
    setFollowedDisciplines((prev) => {
      const exists = prev.includes(disciplineId);
      const next = exists ? prev.filter((d) => d !== disciplineId) : [...prev, disciplineId];
      const name = DISCIPLINES.find((d) => d.id === disciplineId)?.label || disciplineId;
      setAlertSuccess(exists ? `Unfollowed ${name} alerts` : `Now following ${name} statutory alerts`);
      setTimeout(() => setAlertSuccess(null), 3000);
      return next;
    });
  };

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/lobby/ask?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  // Lead Feature item
  const leadRecord = records.find((r) => r.isLeadFeature) || records[0];
  const listRecords = records.filter((r) => r.id !== leadRecord?.id);

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ── 1. COMPLIANCE MASTHEAD (Light, Architectural, Work Sans ExtraLight) ── */}
      <header className="border-b border-neutral-200/80 bg-white pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Mark & Live Status */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                Statutory Regulatory Desk
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-extralight text-neutral-500">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Updated in real-time · Monitored across UK statutory authorities</span>
            </div>
          </div>

          {/* Main Title & Standfirst */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-neutral-900 leading-[1.08]">
              Compliance Watch
            </h1>

            <p className="text-lg sm:text-xl font-extralight text-neutral-700 leading-relaxed max-w-3xl">
              What changed. What matters. What needs attention. Independent, source-backed regulatory intelligence and statutory deadlines for facilities and estates leaders.
            </p>
          </div>

          {/* Jurisdiction Selector */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-extralight text-neutral-600 border-t border-neutral-100 pt-4">
            <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Jurisdiction:</span>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              {JURISDICTIONS.map((j) => (
                <button
                  key={j}
                  onClick={() => setActiveJurisdiction(j)}
                  className={`transition-colors font-light ${
                    activeJurisdiction === j
                      ? 'text-neutral-900 border-b border-brand-electric pb-0.5 font-normal'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {j}
                </button>
              ))}
            </div>
          </div>

          {/* Contextual Ask Search Bar */}
          <form onSubmit={handleAskSubmit} className="pt-4 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search statutory compliance, regulations, or ask a question..."
                className="w-full pl-11 pr-28 py-3 rounded-[6px] border border-neutral-300 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 text-xs sm:text-sm font-light focus:outline-none focus:border-brand-electric focus:bg-white focus:ring-1 focus:ring-brand-electric transition-all shadow-2xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 bg-[#0B1220] hover:bg-[#1E293B] text-white px-3.5 py-1.5 rounded-[4px] text-xs font-light tracking-wide flex items-center gap-1 transition-colors"
              >
                <span>Ask</span>
                <Sparkles className="w-3 h-3 text-brand-electric-bright" />
              </button>
            </div>
          </form>

          {/* Follow Notification Feedback */}
          {alertSuccess && (
            <div
              role="status"
              className="p-3 rounded-[6px] border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn max-w-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-light">{alertSuccess}</span>
            </div>
          )}
        </div>
      </header>

      {/* ── 2. THE CHANGE THAT MATTERS (Lead Compliance Feature - Dark Cinematic Split) ── */}
      {leadRecord && (
        <section className="bg-[#07090E] text-white overflow-hidden relative border-b border-neutral-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            
            {/* Left: Cinematic Image Container */}
            <div className="relative lg:col-span-6 min-h-[300px] lg:min-h-[480px] overflow-hidden group">
              <Image
                src={leadRecord.heroImage || '/images/editorial/building-safety-facade-inspection.jpg'}
                alt={leadRecord.heroImageAlt || leadRecord.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center brightness-85 group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#07090E]/40 lg:to-[#07090E]" />
              
              {/* Micro badge on image */}
              <div className="absolute bottom-4 left-4 z-10">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white/80 border border-white/10 rounded-[3px]">
                  {leadRecord.jurisdiction} · {leadRecord.statuteCitation}
                </span>
              </div>
            </div>

            {/* Right: Editorial Story Details */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-14 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric-bright font-light">
                    The Change That Matters
                  </span>

                  <span className="text-xs font-light text-neutral-400">
                    Effective: {leadRecord.effectiveDate}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-white leading-snug tracking-tight">
                  {leadRecord.title}
                </h2>

                <p className="text-sm sm:text-base font-extralight text-neutral-300 leading-relaxed">
                  {leadRecord.summary}
                </p>

                {leadRecord.entirefmTake && (
                  <div className="border-l-2 border-brand-electric pl-4 py-1 space-y-1 bg-white/[0.02]">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-brand-electric-bright">
                      EntireFM Operational View
                    </span>
                    <p className="text-xs font-light text-neutral-300 leading-relaxed">
                      {leadRecord.entirefmTake}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-extralight text-neutral-400">
                  Authority: <span className="text-white font-light">{leadRecord.authority}</span>
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href={leadRecord.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-light text-neutral-400 hover:text-white transition-colors"
                  >
                    <span>Official source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <Link
                    href={`/lobby/${leadRecord.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-light text-brand-electric-bright hover:underline"
                  >
                    <span>Read full intelligence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. ON THE HORIZON (Forward-Looking Timeline - Soft Light Neutral) ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-200/80 bg-white">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-neutral-200 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                Forward Statutory Agenda
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                On the Horizon
              </h2>
            </div>
            <p className="text-xs font-light text-neutral-500">
              Verified consultation closing dates and statutory effective milestones across the UK
            </p>
          </div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
            {horizon.map((item) => (
              <div
                key={item.id}
                className="space-y-3 pb-6 border-b sm:border-b-0 sm:border-r border-neutral-200/80 pr-4 last:border-r-0"
              >
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    {item.month} {item.year}
                  </div>
                  <div className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                    {item.dateStr}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-medium text-brand-electric block tracking-wider">
                    {item.type}
                  </span>
                  <p className="text-xs font-light text-neutral-800 leading-snug">
                    {item.title}
                  </p>
                </div>

                <div className="pt-2 text-[11px] font-extralight text-neutral-500">
                  {item.disciplineLabel} · {item.jurisdiction}
                </div>

                {item.recordSlug && (
                  <Link
                    href={`/lobby/${item.recordSlug}`}
                    className="inline-flex items-center gap-1 text-xs font-light text-brand-electric hover:underline pt-1"
                  >
                    <span>View details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. DISCIPLINE EXPLORATION & FILTERING ── */}
      <section className="bg-[#FAF9F7] py-10 px-4 sm:px-6 lg:px-8 border-b border-neutral-200/80 sticky top-14 z-30 backdrop-blur-md bg-[#FAF9F7]/95">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mr-2 shrink-0">
              Filter:
            </span>
            {DISCIPLINES.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDiscipline(d.id)}
                className={`px-3 py-1.5 rounded-[4px] text-xs transition-colors shrink-0 ${
                  activeDiscipline === d.id
                    ? 'bg-neutral-900 text-white font-light'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 font-light'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {activeDiscipline !== 'all' && (
            <button
              onClick={() => toggleFollow(activeDiscipline)}
              className={`px-3 py-1.5 rounded-[4px] text-xs font-light tracking-wide flex items-center gap-1.5 transition-colors shrink-0 ${
                followedDisciplines.includes(activeDiscipline)
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                  : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>
                {followedDisciplines.includes(activeDiscipline)
                  ? 'Following alerts'
                  : `Alert me on ${DISCIPLINES.find((d) => d.id === activeDiscipline)?.label}`}
              </span>
            </button>
          )}
        </div>
      </section>

      {/* ── 5. LATEST CHANGES (Editorial Index - Open Layout, Zero Nested Card Box Soup) ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-12">
          
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-neutral-200 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                Statutory Intelligence Index
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                Latest Regulatory Changes
              </h2>
            </div>

            <div className="text-xs font-light text-neutral-500">
              Showing {listRecords.length + (leadRecord ? 1 : 0)} verified statutory items
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-neutral-500 font-light text-sm">
              Loading verified compliance records...
            </div>
          ) : listRecords.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 font-light text-sm bg-white p-8 rounded-[6px] border border-neutral-200">
              No specific statutory changes logged for this discipline filter. Select another discipline above or explore the timeline.
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {listRecords.map((rec) => (
                <article
                  key={rec.id}
                  className="py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start group"
                >
                  {/* Left Column: Metadata & Classification */}
                  <div className="lg:col-span-3 space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-brand-electric font-medium">
                      {rec.classification} · {rec.jurisdiction}
                    </div>
                    <div className="text-xs font-light text-neutral-500">
                      Authority: <span className="text-neutral-800">{rec.authority}</span>
                    </div>
                    <div className="text-xs font-extralight text-neutral-400">
                      Effective: {rec.effectiveDate}
                    </div>
                  </div>

                  {/* Middle Column: Headline & One-Sentence Summary */}
                  <div className="lg:col-span-7 space-y-2.5">
                    <h3 className="text-xl sm:text-2xl font-light text-neutral-900 tracking-tight leading-snug group-hover:text-brand-electric transition-colors">
                      {rec.title}
                    </h3>

                    <p className="text-sm font-extralight text-neutral-600 leading-relaxed">
                      {rec.summary}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-light">
                      <span className="text-neutral-500">
                        Statutory Citation: <span className="font-mono text-neutral-700 text-[11px]">{rec.statuteCitation}</span>
                      </span>

                      {rec.relatedDiscussion && (
                        <Link
                          href={rec.relatedDiscussion.url}
                          className="text-brand-electric hover:underline"
                        >
                          Community discussion &rarr;
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions & Source Provenance */}
                  <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 pt-2 lg:pt-0">
                    <a
                      href={rec.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-light text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      <span>Official source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <Link
                      href={`/lobby/${rec.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-light text-neutral-900 hover:text-brand-electric transition-colors group-hover:translate-x-0.5 transform"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 6. OPEN CONSULTATIONS & REGULATOR ACTIVITY (2-Column Open Split) ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left: Open Consultations */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-neutral-200 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                Public Consultations
              </span>
              <h3 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight">
                Open Government &amp; Regulator Consultations
              </h3>
            </div>

            <div className="space-y-6 divide-y divide-neutral-100">
              {consultations.map((c) => (
                <div key={c.id} className="pt-6 first:pt-0 space-y-2.5">
                  <div className="flex items-center justify-between gap-4 text-xs font-extralight text-neutral-500">
                    <span>{c.authority} · {c.jurisdiction}</span>
                    <span className="text-rose-700 font-light">Closes: {c.closingDateFormatted}</span>
                  </div>

                  <h4 className="text-base sm:text-lg font-light text-neutral-900 leading-snug">
                    {c.title}
                  </h4>

                  <p className="text-xs sm:text-sm font-extralight text-neutral-600 leading-relaxed">
                    <strong className="font-normal text-neutral-800">Why FM should care:</strong> {c.whyFMShouldCare}
                  </p>

                  <div className="pt-1">
                    <a
                      href={c.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-light text-brand-electric hover:underline"
                    >
                      <span>Participate in official consultation</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Recent Regulator Activity */}
          <div className="lg:col-span-5 space-y-8">
            <div className="border-b border-neutral-200 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                Regulator Stream
              </span>
              <h3 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight">
                From the Regulators
              </h3>
            </div>

            <div className="space-y-6">
              {regulators.map((r) => (
                <div key={r.id} className="space-y-1.5 border-l-2 border-neutral-200 pl-4 py-1 hover:border-brand-electric transition-colors">
                  <div className="flex items-center justify-between text-xs font-light text-neutral-500">
                    <span className="font-normal text-neutral-800">{r.regulator}</span>
                    <span className="font-extralight text-[11px]">{r.date}</span>
                  </div>

                  <h4 className="text-sm font-light text-neutral-900 leading-snug">
                    {r.title}
                  </h4>

                  <p className="text-xs font-extralight text-neutral-600 leading-relaxed">
                    {r.summary}
                  </p>

                  <a
                    href={r.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-light text-neutral-500 hover:text-neutral-900 transition-colors pt-1"
                  >
                    <span>View circular</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. PUT THIS INTO PRACTICE (Editorial Tool Presentation) ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="border-b border-neutral-200 pb-4 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
              Operational Tools &amp; Matrices
            </span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
              Put This Into Practice
            </h2>
          </div>
          <p className="text-xs font-light text-neutral-500">
            Field-tested tools and compliance models built for commercial estates teams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tool 1: Asset Register Builder */}
          <div className="space-y-4 p-6 sm:p-8 bg-white border border-neutral-200/90 rounded-[6px] shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-electric font-light">
                Digital Golden Thread Tool
              </span>
              <h3 className="text-xl font-light text-neutral-900">
                Asset Register Builder
              </h3>
              <p className="text-xs sm:text-sm font-extralight text-neutral-600 leading-relaxed">
                Standardise M&amp;E plant hierarchies and verify mandatory statutory attributes required for Building Safety Case submissions.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <Link
                href="/tools/asset-register-builder"
                className="inline-flex items-center gap-1.5 text-xs font-light text-brand-electric hover:underline"
              >
                <span>Launch tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tool 2: Statutory Compliance Matrix */}
          <div className="space-y-4 p-6 sm:p-8 bg-white border border-neutral-200/90 rounded-[6px] shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-electric font-light">
                Commercial Matrix (.xlsx / PDF)
              </span>
              <h3 className="text-xl font-light text-neutral-900">
                Statutory Compliance Matrix
              </h3>
              <p className="text-xs sm:text-sm font-extralight text-neutral-600 leading-relaxed">
                Comprehensive reference framework mapping statutory testing intervals, British Standards, and duty-holder assignments across 14 Hard FM disciplines.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <Link
                href="/resources/commercial-fm-statutory-compliance-matrix"
                className="inline-flex items-center gap-1.5 text-xs font-light text-brand-electric hover:underline"
              >
                <span>Download matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tool 3: PPM Frequency Calculator */}
          <div className="space-y-4 p-6 sm:p-8 bg-white border border-neutral-200/90 rounded-[6px] shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-electric font-light">
                Engineering Diagnostics
              </span>
              <h3 className="text-xl font-light text-neutral-900">
                PPM Frequency Calculator
              </h3>
              <p className="text-xs sm:text-sm font-extralight text-neutral-600 leading-relaxed">
                Calculate risk-based periodic inspection frequencies for electrical switchgear, water systems, fire dampers, and emergency lighting.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <Link
                href="/tools/ppm-frequency-calculator"
                className="inline-flex items-center gap-1.5 text-xs font-light text-brand-electric hover:underline"
              >
                <span>Launch calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. CONTEXTUAL ASK THE LOBBY PROMPT ── */}
      <section className="bg-[#0B1220] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-electric/10 border border-brand-electric/20 text-brand-electric mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extralight tracking-tight text-white">
              Unsure how these changes affect your estate?
            </h2>
            <p className="text-xs sm:text-sm font-extralight text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Research technical statutory questions grounded directly against primary legislation, HSE Approved Codes of Practice, and British Standards.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/lobby/ask?q=What%20are%20the%20statutory%20duty%20holder%20obligations%20under%20the%20Building%20Safety%20Act%202022%3F"
              className="px-4 py-2 rounded-[4px] bg-white/10 hover:bg-white/15 text-white text-xs font-light border border-white/10 transition-colors"
            >
              &ldquo;Explain BSA 2022 duty holder obligations&rdquo; &rarr;
            </Link>

            <Link
              href="/lobby/ask?q=What%20are%20the%20commercial%20EICR%20inspection%20intervals%20under%20BS%207671%3F"
              className="px-4 py-2 rounded-[4px] bg-white/10 hover:bg-white/15 text-white text-xs font-light border border-white/10 transition-colors"
            >
              &ldquo;Check commercial EICR inspection intervals&rdquo; &rarr;
            </Link>

            <Link
              href="/lobby/ask"
              className="px-5 py-2 rounded-[4px] bg-brand-electric hover:bg-blue-600 text-white text-xs font-light transition-colors flex items-center gap-1.5"
            >
              <span>Ask The Lobby</span>
              <Sparkles className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. SOURCES & METHODOLOGY (Trust Architecture) ── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 border-t border-neutral-200/80 bg-white">
        <div className="max-w-7xl mx-auto space-y-4 text-xs font-extralight text-neutral-600">
          <h4 className="text-xs font-light uppercase tracking-wider text-neutral-900">
            How Compliance Watch Works
          </h4>
          <p className="leading-relaxed max-w-4xl text-neutral-500">
            EntireFM continuously indexes primary legislation, statutory instruments, and guidance published by the Building Safety Regulator, Health and Safety Executive (HSE), Department for Energy Security and Net Zero (DESNZ), Environment Agency, and British Standards Institution (BSI). All intelligence undergoes engineering review before publication.
          </p>
          <div className="pt-2 flex items-center gap-4 text-neutral-400">
            <span>Primary UK Statutory Feeds</span>
            <span>·</span>
            <span>Zero AI-Hallucinated Citations</span>
            <span>·</span>
            <Link href="/lobby" className="text-brand-electric hover:underline">
              Return to The Lobby &rarr;
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
