'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  MessageSquare,
  PlusCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Search,
  Users,
  ShieldCheck,
  Building2,
  Wrench,
  Flame,
  Droplets,
  Cpu,
  Truck,
  Leaf,
  Layers,
  HardHat,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export function TemplateCommunityHome() {
  const [categories, setCategories] = useState<any[]>([]);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unanswered' | 'featured'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, discRes] = await Promise.all([
          fetch('/api/community/categories'),
          fetch(`/api/community/discussions?filter=${activeFilter}&q=${encodeURIComponent(searchQuery)}`),
        ]);
        const catData = await catRes.json();
        const discData = await discRes.json();
        setCategories(catData.categories || []);
        setDiscussions(discData.discussions || []);
      } catch (err) {
        console.error('Error fetching community data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeFilter, searchQuery]);

  const featuredDiscussion = discussions.find((d) => d.featured) || discussions[0];
  const listDiscussions = discussions.filter((d) => d.id !== featuredDiscussion?.id);
  const unansweredDiscussions = discussions.filter((d) => d.replyCount === 0 || !d.solved).slice(0, 3);
  const solvedDiscussions = discussions.filter((d) => d.solved).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#121826] flex flex-col selection:bg-brand-electric selection:text-white font-sans">
      <Header />

      <main className="flex-1 pt-24 pb-20">
        {/* ─── MASTHEAD HERO (LIGHT / WARM NEUTRAL EDITORIAL) ─── */}
        <section className="border-b border-neutral-200/80 bg-white py-12 sm:py-16">
          <div className="container-wide">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-semibold bg-brand-electric/10 px-2.5 py-1 rounded-sm">
                    THE LOBBY ROUNDTABLE
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-neutral-500 font-mono">Peer Discussion &amp; Practitioner Intelligence</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-neutral-900 leading-tight">
                  Where UK facilities managers <br className="hidden sm:inline" />
                  <span className="font-normal text-neutral-950">compare notes and solve problems.</span>
                </h1>

                <p className="mt-3 text-base sm:text-lg font-light text-neutral-600 leading-relaxed">
                  A high-trust professional roundtable for verified facilities directors, estates managers, and building services engineers. Practical engineering, statutory compliance, contract mobilisation, and asset management.
                </p>
              </div>

              {/* Primary Actions (Clear 3-Way Distinction) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <Link
                  href="/lobby/ask"
                  className="px-5 py-3 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5 text-brand-electric" />
                  <span>Ask The Lobby</span>
                </Link>

                <Link
                  href="/lobby/community/new"
                  className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Start Discussion</span>
                </Link>
              </div>
            </div>

            {/* Community Search & Filter Bar */}
            <div className="mt-10 pt-6 border-t border-neutral-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-lg">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search community discussions by topic, equipment, or regulation..."
                  className="w-full pl-10 pr-4 py-2 text-xs font-light text-neutral-900 placeholder:text-neutral-400 bg-neutral-50 border border-neutral-200 focus:border-neutral-900 rounded-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`text-xs px-3 py-1.5 rounded-sm font-mono transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  All Discussions
                </button>
                <button
                  onClick={() => setActiveFilter('featured')}
                  className={`text-xs px-3 py-1.5 rounded-sm font-mono transition-colors ${
                    activeFilter === 'featured'
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  Featured
                </button>
                <button
                  onClick={() => setActiveFilter('unanswered')}
                  className={`text-xs px-3 py-1.5 rounded-sm font-mono transition-colors ${
                    activeFilter === 'unanswered'
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  Needs Answer
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 02. DOMINANT FEATURED CONVERSATION ─── */}
        {featuredDiscussion && (
          <section className="container-wide py-12">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 mb-3">
              ROUNDTABLE SPOTLIGHT · CONVERSATION WORTH JOINING
            </div>

            <article className="group bg-white border border-neutral-200/90 rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] shadow-sm hover:border-neutral-400 transition-colors">
              {/* Left Photographic Plate */}
              <div className="relative min-h-[280px] lg:min-h-[360px] overflow-hidden bg-neutral-900">
                <Image
                  src="/images/editorial/building-safety-facade-inspection.jpg"
                  alt="Commercial estate handover and mobilisation survey"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015] brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-sm">
                    {featuredDiscussion.categoryName || 'Mobilisation'}
                  </span>
                </div>
                {featuredDiscussion.solved && (
                  <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-xs text-emerald-300 font-mono bg-emerald-950/80 px-2.5 py-1 rounded-sm border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Accepted Practitioner Answer</span>
                  </div>
                )}
              </div>

              {/* Right Discussion Body */}
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Author Identity (Single Badge) */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-mono text-xs font-semibold shrink-0">
                      {featuredDiscussion.authorName
                        ? featuredDiscussion.authorName.split(' ').map((n: string) => n[0]).join('')
                        : 'PC'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-900">{featuredDiscussion.authorName}</span>
                        {featuredDiscussion.authorBadge && (
                          <span className="text-[9px] font-mono uppercase text-brand-electric bg-brand-electric/10 px-2 py-0.5 rounded-sm">
                            {featuredDiscussion.authorBadge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-500 font-light">{featuredDiscussion.authorHeadline}</div>
                    </div>
                  </div>

                  {/* Headline & Body Excerpt */}
                  <h2 className="text-xl sm:text-2xl font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                    <Link href={`/lobby/community/discussion/${featuredDiscussion.slug}`}>
                      {featuredDiscussion.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed line-clamp-3">
                    {featuredDiscussion.body}
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                  <div className="text-xs font-mono text-neutral-500 flex items-center gap-3">
                    <span>{featuredDiscussion.replyCount} replies</span>
                    <span>·</span>
                    <span>{featuredDiscussion.helpfulCount} found helpful</span>
                  </div>

                  <Link
                    href={`/lobby/community/discussion/${featuredDiscussion.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-electric hover:text-neutral-900 transition-colors font-semibold"
                  >
                    <span>Join Roundtable</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* ─── 03. ACTIVE DISCUSSIONS & SIDEBAR ─── */}
        <section className="container-wide py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 items-start">
            {/* LEFT COLUMN: EDITORIAL DISCUSSION INDEX (NO RECTANGULAR BOXES) */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-900 font-semibold">
                  Active Practitioner Discussions
                </h3>
                <span className="text-xs font-mono text-neutral-400">
                  {listDiscussions.length} conversations
                </span>
              </div>

              {loading ? (
                <div className="py-16 text-center text-neutral-400 font-mono text-xs">
                  Loading roundtable discussions...
                </div>
              ) : listDiscussions.length > 0 ? (
                <div className="divide-y divide-neutral-200/80">
                  {listDiscussions.map((disc) => (
                    <article key={disc.id} className="py-6 first:pt-0 last:pb-0 group">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          {/* Discipline pill + Solved signal */}
                          <div className="flex items-center gap-2.5 text-[11px] font-mono">
                            <span className="text-brand-electric font-semibold uppercase tracking-wider">
                              {disc.categoryName}
                            </span>
                            {disc.solved && (
                              <span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-sm flex items-center gap-1 font-sans text-[10px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Solved
                              </span>
                            )}
                            <span className="text-neutral-400">·</span>
                            <span className="text-neutral-400">
                              {new Date(disc.lastActivityAt || disc.createdAt).toLocaleDateString('en-GB')}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-lg font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                            <Link href={`/lobby/community/discussion/${disc.slug}`}>
                              {disc.title}
                            </Link>
                          </h4>

                          {/* Excerpt */}
                          <p className="text-xs font-light text-neutral-600 line-clamp-2 leading-relaxed max-w-3xl">
                            {disc.body}
                          </p>

                          {/* Author meta */}
                          <div className="pt-2 flex items-center gap-2 text-xs text-neutral-500 font-light">
                            <span className="font-medium text-neutral-800">{disc.authorName}</span>
                            <span>—</span>
                            <span>{disc.authorHeadline}</span>
                          </div>
                        </div>

                        {/* Reply count metric */}
                        <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-1 shrink-0 pt-2 sm:pt-0">
                          <span className="font-mono text-sm font-medium text-neutral-900">
                            {disc.replyCount}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase">
                            replies
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-neutral-400 font-mono text-xs bg-white border border-neutral-200/80 rounded-sm">
                  No discussions found matching this filter.
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: TAXONOMY, LIVE ROOMS & CONTRACTOR DESK */}
            <div className="space-y-10">
              {/* 04. CINEMATIC LIVE ROOM ACCENT */}
              <div className="bg-neutral-950 text-white rounded-sm overflow-hidden p-6 relative group">
                <div className="absolute inset-0 opacity-20">
                  <Image
                    src="/images/editorial/commercial-switchgear-compliance.jpg"
                    alt="Building Safety Live Room background"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300 font-semibold">
                      LIVE PROFESSIONAL ROOM
                    </span>
                  </div>

                  <h4 className="text-lg font-light text-white leading-snug">
                    Building Safety Act &amp; Golden Thread Room
                  </h4>

                  <p className="text-xs font-light text-white/70 leading-relaxed">
                    Live peer roundtable on digital occurrence logging, safety cases, and BSR audits.
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/lobby/rooms/building-safety"
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-electric hover:text-white transition-colors"
                    >
                      <span>Enter Live Room</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* 05. EXPLORE BY DISCIPLINE (TYPOGRAPHIC INDEX) */}
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-900 font-semibold border-b border-neutral-200 pb-2">
                  Explore by Discipline
                </div>

                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/lobby/community/${cat.slug}`}
                      className="group flex items-center justify-between py-2 text-xs font-light text-neutral-700 hover:text-brand-electric border-b border-neutral-100 last:border-0 transition-colors"
                    >
                      <span className="font-medium text-neutral-900 group-hover:text-brand-electric">
                        {cat.name}
                      </span>
                      <span className="text-neutral-400 font-mono text-[11px] group-hover:translate-x-0.5 transition-transform">
                        &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 06. THE CONTRACTOR DESK */}
              <div className="bg-white border border-neutral-200 p-6 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-brand-electric font-semibold">
                  <HardHat className="w-3.5 h-3.5" />
                  <span>The Contractor Desk</span>
                </div>

                <h4 className="text-sm font-semibold text-neutral-900">
                  Practical Site Execution &amp; Evidence
                </h4>

                <p className="text-xs font-light text-neutral-600 leading-relaxed">
                  Discussions dedicated to RAMS, asset tagging during mobilisation, first-time-fix evidence, and client commercial expectations.
                </p>

                <div className="pt-2">
                  <Link
                    href="/lobby/community/contractor-desk"
                    className="text-xs font-mono uppercase tracking-wider text-neutral-900 hover:text-brand-electric inline-flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <span>View Contractor Discussions</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 07. UNANSWERED / NEEDS AN ANSWER ─── */}
        {unansweredDiscussions.length > 0 && (
          <section className="container-wide py-12 border-t border-neutral-200 mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-700 font-semibold">
                  PRACTITIONER KNOWLEDGE NETWORK
                </span>
                <h3 className="text-2xl font-light text-neutral-900 mt-1">
                  Can you help? Unanswered Questions
                </h3>
              </div>
              <span className="text-xs text-neutral-500 font-mono">
                Share your site experience with fellow FM duty holders
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {unansweredDiscussions.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-neutral-200/80 hover:border-neutral-400 p-6 rounded-sm flex flex-col justify-between space-y-4 shadow-sm transition-colors"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-brand-electric font-semibold">
                      {item.categoryName}
                    </span>
                    <h4 className="text-sm font-medium text-neutral-900 leading-snug hover:text-brand-electric">
                      <Link href={`/lobby/community/discussion/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h4>
                    <p className="text-xs font-light text-neutral-600 line-clamp-2">
                      {item.body}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 font-mono">
                      Asked by {item.authorName.split(' ')[0]}
                    </span>
                    <Link
                      href={`/lobby/community/discussion/${item.slug}`}
                      className="text-xs font-mono uppercase tracking-wider text-brand-electric hover:text-neutral-900 transition-colors font-medium flex items-center gap-1"
                    >
                      <span>Answer &rarr;</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
