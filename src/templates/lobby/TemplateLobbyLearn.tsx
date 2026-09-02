'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Layers,
  ChevronRight,
  ArrowRight,
  Clock,
  FileText,
  Wrench,
  ShieldCheck,
  Leaf,
  Users,
  Building2,
  Cpu,
  Plane,
  CheckSquare,
  HelpCircle,
  GraduationCap,
  BookMarked,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import {
  LEARNING_PATHWAYS,
  LEARN_RESOURCES,
  TASK_DISCOVERY_ITEMS,
  ONE_USEFUL_THING,
  type ProfessionalLevel,
  type PathwayId,
} from '@/data/lobby/learn-data';

// ── ICON MAP ──────────────────────────────────────────────────────────

function PathwayIcon({ id }: { id: PathwayId }) {
  const map: Record<PathwayId, React.ReactNode> = {
    'fm-foundations': <BookOpen className="w-5 h-5" />,
    'technical-fm': <Wrench className="w-5 h-5" />,
    'compliance-risk': <ShieldCheck className="w-5 h-5" />,
    'procurement-contracts': <FileText className="w-5 h-5" />,
    'people-leadership': <Users className="w-5 h-5" />,
    'building-estates': <Building2 className="w-5 h-5" />,
    'energy-sustainability': <Leaf className="w-5 h-5" />,
    'digital-fm': <Cpu className="w-5 h-5" />,
    'mobilisation-transition': <Plane className="w-5 h-5" />,
  };
  return <>{map[id]}</>;
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  Guide: 'bg-blue-50 text-blue-700 border-blue-200',
  Playbook: 'bg-violet-50 text-violet-700 border-violet-200',
  'Technical Briefing': 'bg-amber-50 text-amber-700 border-amber-200',
  Checklist: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Explainer: 'bg-neutral-100 text-neutral-700 border-neutral-200',
};

const LEVEL_LABELS: Record<ProfessionalLevel, string> = {
  Foundation: 'bg-sky-50 text-sky-700',
  Practitioner: 'bg-teal-50 text-teal-700',
  Senior: 'bg-indigo-50 text-indigo-700',
  Leadership: 'bg-purple-50 text-purple-700',
  Specialist: 'bg-orange-50 text-orange-700',
};

const LEVELS: ProfessionalLevel[] = ['Foundation', 'Practitioner', 'Senior', 'Leadership', 'Specialist'];

const CTA_LABELS: Record<string, string> = {
  Guide: 'Read Guide',
  Playbook: 'Explore Playbook',
  'Technical Briefing': 'Open Briefing',
  Checklist: 'View Checklist',
  Explainer: 'Start Learning',
  Template: 'View Template',
  'Case Study': 'Read Case Study',
  Scenario: 'Explore Scenario',
};

export function TemplateLobbyLearn() {
  const [search, setSearch] = useState('');
  const [activePathway, setActivePathway] = useState<PathwayId | 'ALL'>('ALL');
  const [activeLevel, setActiveLevel] = useState<ProfessionalLevel | 'ALL'>('ALL');

  const featuredResources = useMemo(
    () => LEARN_RESOURCES.filter((r) => r.isFeatured && r.status === 'PUBLISHED'),
    []
  );

  const filteredResources = useMemo(() => {
    return LEARN_RESOURCES.filter((r) => {
      if (r.status !== 'PUBLISHED') return false;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.topic.toLowerCase().includes(q) ||
        r.contentType.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q);
      const matchPathway = activePathway === 'ALL' || r.pathway === activePathway;
      const matchLevel = activeLevel === 'ALL' || r.level === activeLevel;
      return matchSearch && matchPathway && matchLevel;
    });
  }, [search, activePathway, activeLevel]);

  const EXAMPLE_SEARCHES = [
    'Building Safety Act',
    'PPM',
    'Contract mobilisation',
    'FM procurement',
    'Water hygiene',
    'Energy management',
    'Managing contractors',
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      <LobbySubNav currentSection="learn" />

      <main className="flex-1">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative bg-neutral-950 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('/assets/lobby/learn-hero.jpg')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/80 to-neutral-950" aria-hidden="true" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <p className="text-[10px] font-mono text-brand-electric uppercase tracking-[0.2em] mb-5">
              THE LOBBY · LEARN
            </p>
            <h1 className="text-4xl sm:text-5xl font-extralight tracking-tight leading-tight mb-6">
              Build your FM edge.
            </h1>
            <p className="text-sm sm:text-base font-light text-neutral-300 leading-relaxed max-w-2xl mb-10">
              Practical guides, technical briefings, playbooks, and professional development resources built for UK facilities and property professionals. LEARN teaches — DO executes.
            </p>

            {/* Search */}
            <div className="relative max-w-xl">
              <label htmlFor="learn-search" className="sr-only">What do you want to learn?</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-neutral-400" />
              </div>
              <input
                id="learn-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What do you want to learn?"
                className="w-full bg-white/10 border border-white/20 rounded-[3px] pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors backdrop-blur-sm"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {EXAMPLE_SEARCHES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setSearch(ex)}
                  className="text-[10px] font-mono text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 rounded-[2px] px-2.5 py-1 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── LEVEL FILTER STRIP ────────────────────────────────────────── */}
        <section className="border-b border-neutral-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider shrink-0 mr-2">Level:</span>
            <button
              onClick={() => setActiveLevel('ALL')}
              className={`shrink-0 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-[2px] transition-colors ${
                activeLevel === 'ALL' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              All Levels
            </button>
            {LEVELS.map((lv) => (
              <button
                key={lv}
                onClick={() => setActiveLevel(lv === activeLevel ? 'ALL' : lv)}
                className={`shrink-0 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-[2px] transition-colors ${
                  activeLevel === lv ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {lv}
              </button>
            ))}
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">

          {/* ── SEARCH RESULTS ─────────────────────────────────────────── */}
          {search.trim() && (
            <section>
              <h2 className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-6">
                Results for &ldquo;{search}&rdquo; — {filteredResources.length} result{filteredResources.length !== 1 ? 's' : ''}
              </h2>
              {filteredResources.length === 0 ? (
                <p className="text-sm font-light text-neutral-500 py-8">
                  No resources match your search. Try a broader term or browse the pathways below.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResources.map((r) => (
                    <ResourceCard key={r.slug} resource={r} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── LEARNING PATHWAYS ──────────────────────────────────────── */}
          {!search.trim() && (
            <section>
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric mb-2">Learning Pathways</p>
                  <h2 className="text-2xl sm:text-3xl font-extralight tracking-tight">Enter a professional pathway.</h2>
                  <p className="text-sm font-light text-neutral-500 mt-2">Structured knowledge journeys for every FM discipline.</p>
                </div>
                <Link href="/lobby/learn/guides" className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 font-light shrink-0 transition-colors">
                  All Resources <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {LEARNING_PATHWAYS.map((pw) => (
                  <button
                    key={pw.id}
                    onClick={() => setActivePathway(pw.id === activePathway ? 'ALL' : pw.id)}
                    className={`group text-left p-5 rounded-[4px] border transition-all duration-150 ${
                      activePathway === pw.id
                        ? 'bg-neutral-900 border-neutral-900 text-white'
                        : 'bg-white border-neutral-200 hover:border-neutral-400 text-neutral-900'
                    }`}
                  >
                    <div className={`mb-3 ${activePathway === pw.id ? 'text-brand-electric' : 'text-neutral-500 group-hover:text-neutral-900'}`}>
                      <PathwayIcon id={pw.id} />
                    </div>
                    <h3 className="text-sm font-medium mb-1">{pw.title}</h3>
                    <p className={`text-xs font-light leading-relaxed mb-4 ${activePathway === pw.id ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {pw.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono ${activePathway === pw.id ? 'text-neutral-400' : 'text-neutral-400'}`}>
                        {pw.resourceCount} resources
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${activePathway === pw.id ? 'text-white' : 'text-neutral-400'}`} />
                    </div>
                  </button>
                ))}
              </div>

              {activePathway !== 'ALL' && (
                <div className="mt-8 space-y-4">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    {LEARNING_PATHWAYS.find(p => p.id === activePathway)?.title} resources
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {LEARN_RESOURCES.filter(r => r.pathway === activePathway && r.status === 'PUBLISHED').map(r => (
                      <ResourceCard key={r.slug} resource={r} />
                    ))}
                    {LEARN_RESOURCES.filter(r => r.pathway === activePathway && r.status === 'PUBLISHED').length === 0 && (
                      <p className="col-span-3 text-sm font-light text-neutral-400 py-6">
                        Additional resources for this pathway are in development.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ── FEATURED LEARNING ──────────────────────────────────────── */}
          {!search.trim() && activePathway === 'ALL' && (
            <section>
              <div className="mb-8">
                <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric mb-2">Featured</p>
                <h2 className="text-2xl sm:text-3xl font-extralight tracking-tight">Essential FM knowledge.</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {featuredResources.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/lobby/learn/${r.slug}`}
                    className="group block bg-white border border-neutral-200 rounded-[4px] p-6 shadow-2xs hover:border-neutral-400 hover:shadow-sm transition-all duration-150"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[2px] border ${CONTENT_TYPE_LABELS[r.contentType] ?? 'bg-neutral-100 text-neutral-700 border-neutral-200'}`}>
                        {r.contentType}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">{r.topic}</span>
                    </div>
                    <h3 className="text-base font-light text-neutral-900 leading-snug mb-3 group-hover:text-neutral-700 transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-xs font-light text-neutral-500 leading-relaxed mb-5 line-clamp-2">{r.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${LEVEL_LABELS[r.level]}`}>{r.level}</span>
                        <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {r.readingTimeMinutes} min
                        </span>
                      </div>
                      <span className="text-xs text-brand-electric font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        {CTA_LABELS[r.contentType] ?? 'Read'} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── TASK DISCOVERY ─────────────────────────────────────────── */}
          {!search.trim() && activePathway === 'ALL' && (
            <section className="bg-white border border-neutral-200 rounded-[4px] p-8 shadow-2xs">
              <div className="mb-8">
                <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric mb-2">Task Discovery</p>
                <h2 className="text-2xl sm:text-3xl font-extralight tracking-tight">What are you trying to do?</h2>
                <p className="text-sm font-light text-neutral-500 mt-2">
                  LEARN connects you to the best resource — whether that&rsquo;s a guide here, a tool in DO, or a compliance check in CHECK.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TASK_DISCOVERY_ITEMS.map((task) => (
                  <Link
                    key={task.id}
                    href={task.primaryDestination.url}
                    className="group p-4 border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors"
                  >
                    <p className="text-sm font-medium text-neutral-900 mb-1 group-hover:text-brand-electric transition-colors">
                      {task.label}
                    </p>
                    <p className="text-xs font-light text-neutral-500 mb-3 leading-relaxed">{task.description}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-[2px]">
                        {task.primaryDestination.section}
                      </span>
                      <span className="text-[10px] text-neutral-500 group-hover:text-neutral-900 transition-colors">{task.primaryDestination.label}</span>
                    </div>
                    {task.secondaryDestination && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-[2px]">
                          {task.secondaryDestination.section}
                        </span>
                        <span className="text-[10px] text-neutral-500">{task.secondaryDestination.label}</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── FM PLAYBOOKS ───────────────────────────────────────────── */}
          {!search.trim() && activePathway === 'ALL' && (
            <section>
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric mb-2">FM Playbooks</p>
                  <h2 className="text-2xl sm:text-3xl font-extralight tracking-tight">Structured guides for real work.</h2>
                  <p className="text-sm font-light text-neutral-500 mt-2">Deeper, step-by-step resources for important FM workflows.</p>
                </div>
                <Link href="/lobby/learn/playbooks" className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 font-light shrink-0 transition-colors">
                  All Playbooks <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {LEARN_RESOURCES.filter(r => r.contentType === 'Playbook').map((r) => (
                  <Link
                    key={r.slug}
                    href={r.status === 'PUBLISHED' ? `/lobby/learn/${r.slug}` : '#'}
                    className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-neutral-200 rounded-[4px] shadow-2xs transition-all ${
                      r.status === 'PUBLISHED' ? 'hover:border-neutral-400 hover:shadow-sm' : 'opacity-60 cursor-default'
                    }`}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                        <BookMarked className="w-4 h-4 text-violet-500 shrink-0" />
                        <span className="text-[10px] font-mono text-neutral-400">{r.topic}</span>
                        {r.status === 'COMING_SOON' && (
                          <span className="text-[10px] font-mono bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-[2px] border border-neutral-200">Coming Soon</span>
                        )}
                      </div>
                      <h3 className="text-sm font-light text-neutral-900">{r.title}</h3>
                      <p className="text-xs font-light text-neutral-500 leading-relaxed line-clamp-2">{r.summary}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right space-y-1">
                        <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" /> {r.readingTimeMinutes} min
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${LEVEL_LABELS[r.level]}`}>{r.level}</span>
                      </div>
                      {r.status === 'PUBLISHED' && (
                        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── ONE USEFUL THING ───────────────────────────────────────── */}
          {!search.trim() && activePathway === 'ALL' && (
            <section className="bg-neutral-950 text-white rounded-[4px] p-8">
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-mono text-brand-electric uppercase tracking-widest">
                    One Useful Thing · Edition {ONE_USEFUL_THING.editionNumber}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-extralight tracking-tight leading-snug">
                    {ONE_USEFUL_THING.title}
                  </h2>
                  <p className="text-sm font-light text-neutral-300 leading-relaxed max-w-xl">
                    {ONE_USEFUL_THING.description}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={ONE_USEFUL_THING.ctaUrl}
                      className="inline-flex items-center gap-2 bg-brand-electric text-white text-xs font-medium px-4 py-2.5 rounded-[3px] hover:bg-brand-electric/90 transition-colors"
                    >
                      {ONE_USEFUL_THING.ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
                <CheckSquare className="w-12 h-12 text-neutral-700 shrink-0 hidden sm:block" />
              </div>
            </section>
          )}

          {/* ── EXPLORE LEARN SECTIONS ─────────────────────────────────── */}
          {!search.trim() && activePathway === 'ALL' && (
            <section>
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-6">Explore LEARN</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Guides', description: 'Practical, readable FM guides', href: '/lobby/learn/guides', icon: <BookOpen className="w-5 h-5" /> },
                  { label: 'Glossary', description: '25+ FM terms defined', href: '/lobby/learn/glossary', icon: <FileText className="w-5 h-5" /> },
                  { label: 'Scenarios', description: 'What would you do?', href: '/lobby/learn/scenarios', icon: <HelpCircle className="w-5 h-5" /> },
                  { label: 'Academy', description: 'Structured learning paths', href: '/lobby/learn/academy', icon: <GraduationCap className="w-5 h-5" /> },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group block p-5 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors"
                  >
                    <div className="text-neutral-500 group-hover:text-neutral-900 transition-colors mb-3">{item.icon}</div>
                    <h3 className="text-sm font-medium text-neutral-900 mb-1">{item.label}</h3>
                    <p className="text-xs font-light text-neutral-500">{item.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── ACADEMY PLACEHOLDER ────────────────────────────────────── */}
          {!search.trim() && activePathway === 'ALL' && (
            <section className="border border-dashed border-neutral-300 rounded-[4px] p-8 bg-neutral-50">
              <div className="flex items-start gap-4">
                <GraduationCap className="w-6 h-6 text-neutral-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">EntireFM Academy</p>
                  <h2 className="text-lg font-light text-neutral-900">Structured learning is coming to The Lobby.</h2>
                  <p className="text-sm font-light text-neutral-500 leading-relaxed max-w-2xl">
                    The EntireFM Academy will provide structured professional development pathways, lessons, and completion records for FM and property professionals. This architecture is in development. No courses, certificates, or CPD accreditation are currently available through this platform.
                  </p>
                  <Link href="/lobby/learn/academy" className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 font-light transition-colors mt-2">
                    Learn more about the Academy <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* ── CROSS-LOBBY DISCOVERY ──────────────────────────────────── */}
          <section className="border-t border-neutral-200 pt-12">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-6">Keep Going</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              {[
                { label: 'KNOW', desc: 'See what has changed', href: '/lobby/know', num: '01' },
                { label: 'CHECK', desc: 'What you need to check', href: '/lobby/check', num: '02' },
                { label: 'DO', desc: 'FM tools & generators', href: '/lobby/do', num: '03' },
                { label: 'FIND', desc: 'Find people & companies', href: '/lobby/find', num: '04' },
                { label: 'CONNECT', desc: 'Discuss with the profession', href: '/lobby/connect', num: '06' },
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

          {/* ── DISCLAIMER ─────────────────────────────────────────────── */}
          <section className="text-[11px] font-light text-neutral-400 leading-relaxed border-t border-neutral-200 pt-6">
            <p>
              LEARN resources are provided for general professional information and development purposes only. They do not constitute legal advice, statutory guidance, or formal professional accreditation.
              Always refer to current legislation and official regulatory sources for specific compliance requirements.
              Content is provided as &ldquo;Professional Development&rdquo; — it has not been formally assessed or accredited as CPD.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── SHARED RESOURCE CARD ─────────────────────────────────────────────

export function ResourceCard({ resource }: { resource: typeof LEARN_RESOURCES[0] }) {
  const ctaLabel = CTA_LABELS[resource.contentType] ?? 'Read';
  return (
    <Link
      href={resource.status === 'PUBLISHED' ? `/lobby/learn/${resource.slug}` : '#'}
      className={`group block p-5 bg-white border border-neutral-200 rounded-[4px] shadow-2xs transition-all ${
        resource.status === 'PUBLISHED' ? 'hover:border-neutral-400 hover:shadow-sm' : 'opacity-60 cursor-default'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[2px] border ${CONTENT_TYPE_LABELS[resource.contentType] ?? 'bg-neutral-100 text-neutral-700 border-neutral-200'}`}>
          {resource.contentType}
        </span>
        {resource.status === 'COMING_SOON' && (
          <span className="text-[10px] font-mono text-neutral-400">Coming Soon</span>
        )}
      </div>
      <h3 className="text-sm font-light text-neutral-900 leading-snug mb-2 group-hover:text-neutral-700 transition-colors">{resource.title}</h3>
      <p className="text-xs font-light text-neutral-500 leading-relaxed mb-4 line-clamp-2">{resource.summary}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${LEVEL_LABELS[resource.level] ?? ''}`}>{resource.level}</span>
          <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {resource.readingTimeMinutes} min
          </span>
        </div>
        {resource.status === 'PUBLISHED' && (
          <span className="text-[10px] text-brand-electric font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            {ctaLabel} <ArrowRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </Link>
  );
}
