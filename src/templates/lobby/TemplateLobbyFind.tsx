'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Briefcase,
  TrendingUp,
  GraduationCap,
  Building2,
  Banknote,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Layers,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Filter,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import {
  CAREER_PATHWAYS,
  PROFESSIONAL_ROLES,
  SALARY_BENCHMARKS,
  PROFESSIONAL_OPPORTUNITIES,
  CAREER_NAVIGATOR_QUESTIONS,
  type CareerPathway,
  type ProfessionalRoleGuide,
  type SalaryBenchmark,
  type ProfessionalOpportunity,
} from '@/data/lobby/career-data';
import type { JobListing } from '@/server/jobs/types';

export type FindTab = 'ALL' | 'JOBS' | 'CAREERS' | 'ROLES' | 'SALARY' | 'OPPORTUNITIES';

interface TemplateLobbyFindProps {
  initialTab?: FindTab;
}

export function TemplateLobbyFind({ initialTab = 'ALL' }: TemplateLobbyFindProps) {
  const [activeTab, setActiveTab] = useState<FindTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedLocationType, setSelectedLocationType] = useState('all');
  const [selectedNavigatorOption, setSelectedNavigatorOption] = useState<number | null>(null);

  // Database-backed jobs state
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Fetch real job listings from existing database API
  useEffect(() => {
    let isMounted = true;
    async function fetchJobs() {
      setLoadingJobs(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (selectedDiscipline !== 'all') params.set('discipline', selectedDiscipline);
        if (selectedLocationType !== 'all') params.set('locationType', selectedLocationType);
        params.set('limit', '8');

        const res = await fetch(`/api/lobby/jobs?${params.toString()}`);
        const data = await res.json();
        if (isMounted && data.success) {
          setJobs(data.jobs || []);
          setTotalJobs(data.total || 0);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        if (isMounted) setLoadingJobs(false);
      }
    }

    const timer = setTimeout(fetchJobs, 250);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedDiscipline, selectedLocationType]);

  const disciplines = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'Hard FM & M&E', label: 'Hard FM & M&E' },
    { id: 'Facilities Management', label: 'Facilities Operations' },
    { id: 'Building Safety & Compliance', label: 'Compliance & Safety' },
    { id: 'HVAC & Refrigeration', label: 'HVAC & Refrigeration' },
    { id: 'Contract & Commercial Management', label: 'Contract & Commercial' },
    { id: 'Energy & Sustainability', label: 'Energy & ESG' },
  ];

  const formatSalary = (j: JobListing) => {
    if (!j.salaryMin && !j.salaryMax) return 'Competitive salary';
    const sym = j.salaryCurrency === 'GBP' ? '£' : j.salaryCurrency;
    const period = j.salaryPeriod === 'per_annum' ? '/yr' : j.salaryPeriod === 'per_day' ? '/day' : '/hr';
    if (j.salaryMin && j.salaryMax) {
      return `${sym}${j.salaryMin.toLocaleString()} – ${sym}${j.salaryMax.toLocaleString()} ${period}`;
    }
    if (j.salaryMin) return `From ${sym}${j.salaryMin.toLocaleString()} ${period}`;
    return `Up to ${sym}${j.salaryMax?.toLocaleString()} ${period}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      <LobbySubNav currentSection="find" />

      <main className="flex-1">

        {/* ── 01. HERO SECTION ─────────────────────────────────────────── */}
        <section className="relative bg-neutral-950 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('/images/editorial/entirefm-site-arrival-2000w.webp')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/80 to-neutral-950" aria-hidden="true" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            {/* Eyebrow */}
            <p className="text-[10px] font-mono text-brand-electric uppercase tracking-[0.2em] mb-5">
              THE LOBBY · FIND
            </p>

            <h1 className="text-4xl sm:text-5xl font-extralight tracking-tight leading-tight mb-4">
              Your next role. Your next opportunity. Your next move.
            </h1>

            <p className="text-sm sm:text-base font-light text-neutral-300 leading-relaxed max-w-2xl mb-8">
              FIND brings together verified facilities management vacancies, structured career progression pathways, role guides, and UK salary intelligence. Designed strictly for professionals shaping the built environment.
            </p>

            {/* Primary Search Bar */}
            <div className="relative max-w-xl">
              <label htmlFor="find-search" className="sr-only">Search FM jobs, roles, employers or career topics</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-neutral-400" />
              </div>
              <input
                id="find-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FM jobs, roles, employers or career topics…"
                className="w-full bg-white/10 border border-white/20 rounded-[3px] pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors backdrop-blur-sm"
              />
            </div>

            {/* Quick Filter Prompt Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">Popular:</span>
              {['Facilities Manager', 'Building Safety Manager', 'Technical Services Manager', 'London', 'Commercial Contract Manager'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => { setSearchQuery(chip); setActiveTab('JOBS'); }}
                  className="text-[10px] font-mono text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 rounded-[2px] px-2.5 py-1 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── 02. CATEGORY DISCOVERY TABS ───────────────────────────────── */}
        <section className="border-b border-neutral-200 bg-white sticky top-[calc(3rem+4rem)] z-30 shadow-2xs">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'ALL', label: 'All Opportunities' },
              { id: 'JOBS', label: 'Jobs & Vacancies' },
              { id: 'CAREERS', label: 'Career Paths' },
              { id: 'ROLES', label: 'Role Guides' },
              { id: 'SALARY', label: 'Salary & Market' },
              { id: 'OPPORTUNITIES', label: 'Professional Opportunities' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FindTab)}
                className={`shrink-0 px-3 py-1.5 text-[11px] sm:text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors ${
                  activeTab === tab.id
                    ? 'bg-neutral-900 text-white font-medium shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80 font-light'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">

          {/* ── 03. JOBS DISCOVERY SECTION ──────────────────────────────── */}
          {(activeTab === 'ALL' || activeTab === 'JOBS') && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric mb-1">01 · Professional Vacancies</p>
                  <h2 className="text-2xl sm:text-3xl font-extralight tracking-tight">FM Jobs & Career Vacancies</h2>
                  <p className="text-sm font-light text-neutral-500 mt-1">
                    Authentic roles across commercial estates, M&E engineering, statutory building safety, and operational FM leadership.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href="/lobby/find/jobs"
                    className="text-xs text-brand-electric font-medium hover:underline inline-flex items-center gap-1"
                  >
                    View All {totalJobs > 0 ? `(${totalJobs})` : ''} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedDiscipline}
                  onChange={(e) => setSelectedDiscipline(e.target.value)}
                  className="bg-white border border-neutral-200 rounded-[3px] text-xs font-light px-3 py-2 text-neutral-700 focus:outline-none focus:border-neutral-900"
                >
                  {disciplines.map((d) => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>

                <select
                  value={selectedLocationType}
                  onChange={(e) => setSelectedLocationType(e.target.value)}
                  className="bg-white border border-neutral-200 rounded-[3px] text-xs font-light px-3 py-2 text-neutral-700 focus:outline-none focus:border-neutral-900"
                >
                  <option value="all">All Working Models</option>
                  <option value="on_site">On-site Plant / Building</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote</option>
                  <option value="mobile_field">Mobile Field Regional</option>
                </select>
              </div>

              {/* Jobs List */}
              {loadingJobs ? (
                <div className="p-8 text-center bg-white border border-neutral-200 rounded-[4px]">
                  <p className="text-xs font-mono text-neutral-400">Querying live job listings database…</p>
                </div>
              ) : jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/lobby/jobs/${job.slug || job.id}`}
                      className="group block p-5 bg-white border border-neutral-200 rounded-[4px] shadow-2xs hover:border-neutral-400 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-[2px]">
                              {job.seniority}
                            </span>
                            {job.isEntireFMVerifiedEmployer && (
                              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-[2px] inline-flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Employer
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                            {job.title}
                          </h3>
                          <p className="text-xs font-light text-neutral-600 mt-0.5">{job.employerName}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-light text-neutral-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" /> {job.location}
                        </span>
                        <span className="font-mono text-neutral-700 font-medium">{formatSalary(job)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white border border-neutral-200 rounded-[4px] space-y-2">
                  <p className="text-sm font-light text-neutral-600">No vacancies currently match your query criteria.</p>
                  <p className="text-xs font-light text-neutral-400">
                    All listings are verified employer opportunities. Check back or explore career pathways below.
                  </p>
                </div>
              )}
            </section>
          )}

          {/* ── 04. "WHAT SHOULD I DO NEXT?" CAREER NAVIGATOR ─────────── */}
          {(activeTab === 'ALL' || activeTab === 'CAREERS') && (
            <section className="bg-neutral-950 text-white rounded-[4px] p-8 space-y-6">
              <div>
                <p className="text-[10px] font-mono text-brand-electric uppercase tracking-widest mb-1">Career Intelligence</p>
                <h2 className="text-2xl sm:text-3xl font-extralight tracking-tight">What should I do next?</h2>
                <p className="text-sm font-light text-neutral-300 mt-1 max-w-2xl">
                  Select your current career transition to view the recommended role focus, skills, learning paths in LEARN, and compliance areas in CHECK.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAREER_NAVIGATOR_QUESTIONS[0].options.map((opt, idx) => {
                  const isSelected = selectedNavigatorOption === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedNavigatorOption(isSelected ? null : idx)}
                      className={`text-left p-4 rounded-[3px] border transition-all ${
                        isSelected
                          ? 'bg-white/10 border-brand-electric text-white'
                          : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <p className="text-xs font-medium text-white mb-1">{opt.label}</p>
                      <p className="text-[11px] font-light text-neutral-400 leading-relaxed">{opt.description}</p>
                    </button>
                  );
                })}
              </div>

              {selectedNavigatorOption !== null && (
                <div className="bg-white/5 border border-white/10 rounded-[4px] p-6 space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric">Recommended Strategic Focus</p>
                    <p className="text-sm font-light text-neutral-200 leading-relaxed">
                      {CAREER_NAVIGATOR_QUESTIONS[0].options[selectedNavigatorOption].guidance}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/10 text-xs font-light">
                    {CAREER_NAVIGATOR_QUESTIONS[0].options[selectedNavigatorOption].recommendedRoleSlug && (
                      <Link
                        href={`/lobby/find/roles/${CAREER_NAVIGATOR_QUESTIONS[0].options[selectedNavigatorOption].recommendedRoleSlug}`}
                        className="text-brand-electric hover:underline inline-flex items-center gap-1"
                      >
                        Explore Role Guide <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                    {CAREER_NAVIGATOR_QUESTIONS[0].options[selectedNavigatorOption].recommendedLearnSlug && (
                      <Link
                        href={`/lobby/learn/${CAREER_NAVIGATOR_QUESTIONS[0].options[selectedNavigatorOption].recommendedLearnSlug}`}
                        className="text-neutral-300 hover:text-white inline-flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" /> Read Guide in LEARN
                      </Link>
                    )}
                    {CAREER_NAVIGATOR_QUESTIONS[0].options[selectedNavigatorOption].recommendedToolUrl && (
                      <Link
                        href={CAREER_NAVIGATOR_QUESTIONS[0].options[selectedNavigatorOption].recommendedToolUrl!}
                        className="text-neutral-300 hover:text-white inline-flex items-center gap-1"
                      >
                        <Layers className="w-3 h-3" /> Use Tool in DO
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ── 05. CAREER PROGRESSION PATHWAYS ────────────────────────── */}
          {(activeTab === 'ALL' || activeTab === 'CAREERS') && (
            <section className="space-y-6">
              <div className="border-b border-neutral-200 pb-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric mb-1">02 · Progression Routes</p>
                <h2 className="text-2xl sm:text-3xl font-extralight tracking-tight">FM Career Pathways</h2>
                <p className="text-sm font-light text-neutral-500 mt-1 max-w-2xl">
                  Illustrative progression structures through key facilities management disciplines. Progression varies by organisation, commercial portfolio, and individual experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {CAREER_PATHWAYS.map((path) => (
                  <div
                    key={path.id}
                    className="p-6 bg-white border border-neutral-200 rounded-[4px] shadow-2xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <h3 className="text-base font-light text-neutral-900">{path.title}</h3>
                      <p className="text-xs font-light text-neutral-500 leading-relaxed line-clamp-3">
                        {path.summary}
                      </p>

                      {/* Stepper overview */}
                      <div className="pt-2 space-y-2">
                        {path.stages.slice(0, 3).map((stage, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-light text-neutral-700">
                            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1 rounded-[2px]">{idx + 1}</span>
                            <span className="truncate">{stage.title}</span>
                          </div>
                        ))}
                        {path.stages.length > 3 && (
                          <p className="text-[10px] font-mono text-neutral-400 pt-1">+ {path.stages.length - 3} senior & director tiers</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <Link
                        href={`/lobby/find/careers/${path.slug}`}
                        className="text-xs text-brand-electric font-medium hover:underline inline-flex items-center gap-1"
                      >
                        Explore Pathway <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/lobby/learn?pathway=${path.slug}`}
                        className="text-[10px] font-mono text-neutral-400 hover:text-neutral-700"
                      >
                        LEARN Modules &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── 06. PROFESSIONAL ROLE GUIDES ──────────────────────────── */}
          {(activeTab === 'ALL' || activeTab === 'ROLES') && (
            <section className="space-y-6">
              <div className="border-b border-neutral-200 pb-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric mb-1">03 · Role Profiles</p>
                <h2 className="text-2xl sm:text-3xl font-extralight tracking-tight">Professional Role Guides</h2>
                <p className="text-sm font-light text-neutral-500 mt-1 max-w-2xl">
                  Deep-dive specifications into what different FM roles actually entail: responsibilities, technical knowledge, compliance duties, and progression routes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROFESSIONAL_ROLES.map((role) => (
                  <Link
                    key={role.id}
                    href={`/lobby/find/roles/${role.slug}`}
                    className="group block p-6 bg-white border border-neutral-200 rounded-[4px] shadow-2xs hover:border-neutral-400 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-[2px] mb-2 inline-block">
                          {role.seniority}
                        </span>
                        <h3 className="text-lg font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                          {role.title}
                        </h3>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform shrink-0 mt-1" />
                    </div>

                    <p className="text-xs font-light text-neutral-500 leading-relaxed line-clamp-2 mb-4">
                      {role.overview}
                    </p>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-light">
                      <span className="font-mono text-neutral-600 text-[11px]">{role.typicalSalaryRangeUK}</span>
                      <span className="text-brand-electric font-medium">Read Guide &rarr;</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── 07. SALARY & MARKET INTELLIGENCE ───────────────────────── */}
          {(activeTab === 'ALL' || activeTab === 'SALARY') && (
            <section className="space-y-6">
              <div className="border-b border-neutral-200 pb-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric mb-1">04 · Employment Market</p>
                <h2 className="text-2xl sm:text-3xl font-extralight tracking-tight">FM Salary & Market Intelligence</h2>
                <p className="text-sm font-light text-neutral-500 mt-1 max-w-2xl">
                  Sourced baseline salary guidelines across UK regions. Sourced from published industry benchmarks (IWFM / CIBSE / BESA market indexes). EntireFM does not fabricate proprietary salary claims.
                </p>
              </div>

              <div className="bg-white border border-neutral-200 rounded-[4px] overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-light">
                    <thead className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                      <tr>
                        <th className="py-3 px-4">Role Title & Discipline</th>
                        <th className="py-3 px-4">Junior / Entry</th>
                        <th className="py-3 px-4">Mid-Level</th>
                        <th className="py-3 px-4">Senior Tier</th>
                        <th className="py-3 px-4">London Allowance</th>
                        <th className="py-3 px-4">Source Baseline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 font-mono">
                      {SALARY_BENCHMARKS.map((item, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-sans font-medium text-neutral-900">
                            <div>{item.roleTitle}</div>
                            <span className="text-[10px] font-mono text-neutral-400 font-normal">{item.discipline}</span>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-600">{item.juniorSalary}</td>
                          <td className="py-3.5 px-4 text-neutral-900 font-medium">{item.midSalary}</td>
                          <td className="py-3.5 px-4 text-neutral-700">{item.seniorSalary}</td>
                          <td className="py-3.5 px-4 text-neutral-500">{item.londonWeighting}</td>
                          <td className="py-3.5 px-4 font-sans text-[11px] text-neutral-400">{item.sourceAttribution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-neutral-50/60 border-t border-neutral-200 text-[11px] font-light text-neutral-500">
                  <p>
                    <span className="font-medium">Methodology Note:</span> Figures represent UK regional base salary bands excluding car allowances, pensions, or performance bonuses. Actual remuneration depends on asset complexity, on-site mechanical/electrical scope, and individual candidate certifications.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ── 08. PROFESSIONAL OPPORTUNITIES ────────────────────────── */}
          {(activeTab === 'ALL' || activeTab === 'OPPORTUNITIES') && (
            <section className="space-y-6">
              <div className="border-b border-neutral-200 pb-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric mb-1">05 · Non-Permanent & Industry Roles</p>
                <h2 className="text-2xl sm:text-3xl font-extralight tracking-tight">Professional Opportunities</h2>
                <p className="text-sm font-light text-neutral-500 mt-1 max-w-2xl">
                  Opportunities beyond conventional permanent positions: interim management, advisory roles, apprenticeships, and industry contribution opportunities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROFESSIONAL_OPPORTUNITIES.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-6 bg-white border border-neutral-200 rounded-[4px] shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-[2px]">
                          {opp.type}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">{opp.discipline}</span>
                      </div>
                      <h3 className="text-base font-light text-neutral-900">{opp.title}</h3>
                      <p className="text-xs font-light text-neutral-500 leading-relaxed">{opp.description}</p>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono text-neutral-400">{opp.commitment}</span>
                      <Link
                        href={opp.actionUrl}
                        className="text-brand-electric font-medium hover:underline inline-flex items-center gap-1"
                      >
                        {opp.actionLabel} &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── 09. CROSS-LOBBY INTEGRATION FOOTER ─────────────────────── */}
          <section className="border-t border-neutral-200 pt-12">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-6">Explore The Entire Lobby</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              {[
                { label: 'KNOW', desc: 'FM Employment Intelligence', href: '/lobby/know', num: '01' },
                { label: 'CHECK', desc: 'Compliance Duties in Roles', href: '/lobby/check', num: '02' },
                { label: 'DO', desc: 'Tools for Your Next Role', href: '/lobby/do', num: '03' },
                { label: 'LEARN', desc: 'Skills & Development', href: '/lobby/learn', num: '05' },
                { label: 'CONNECT', desc: 'Discuss Career Moves', href: '/lobby/connect', num: '06' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors"
                >
                  <span className="text-neutral-400 text-[10px] block font-mono mb-1">{item.num} · {item.label}</span>
                  <span className="text-neutral-900 font-medium">{item.desc} &rarr;</span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── 10. DISCLAIMER / INTEGRITY CALLOUT ─────────────────────── */}
          <section className="text-[11px] font-light text-neutral-400 leading-relaxed border-t border-neutral-200 pt-6">
            <p>
              FIND is a professional career intelligence resource provided by The Lobby on EntireFM. EntireFM is not a recruitment agency. Vacancy listings are sourced directly from verified employers or authenticated industry feeds. Salary ranges reflect aggregated industry benchmarks (IWFM/CIBSE) and do not represent contractual offers.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
