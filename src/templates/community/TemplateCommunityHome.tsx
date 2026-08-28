'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';
import {
  MessageSquare,
  PlusCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Search,
  HardHat,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Wrench,
  Flame,
  Droplets,
  Layers,
  Cpu,
  Truck,
  Leaf,
  Users,
} from 'lucide-react';

interface CommunityDiscussion {
  id: string;
  slug: string;
  title: string;
  body: string;
  authorMemberId: string;
  authorName: string;
  authorHeadline: string;
  authorCompany?: string;
  authorBadge?: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  tags: string[];
  replyCount: number;
  helpfulCount: number;
  viewCount: number;
  featured: boolean;
  solved: boolean;
  acceptedReplyId?: string;
  createdAt: string;
  lastActivityAt?: string;
}

interface CommunityCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  discussionCount: number;
}

export function TemplateCommunityHome() {
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [discussions, setDiscussions] = useState<CommunityDiscussion[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unanswered' | 'featured' | 'solved'>('all');
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

  // Featured discussion: prioritised high-value conversation
  const featuredDiscussion = discussions.find((d) => d.featured) || discussions[0];
  const listDiscussions = discussions.filter((d) => d.id !== featuredDiscussion?.id);
  const unansweredDiscussions = discussions.filter((d) => !d.solved && (d.replyCount === 0 || d.replyCount <= 2)).slice(0, 3);
  const solvedDiscussions = discussions.filter((d) => d.solved).slice(0, 2);

  // Top contributors
  const contributors = [
    {
      name: 'Peter Currey',
      initials: 'PC',
      role: 'Managing Director · EntireFM',
      specialism: 'Contract Mobilisation & Asset Registers',
      signal: 'Founding Member · 14 Discussions',
    },
    {
      name: 'Marcus Vance',
      initials: 'MV',
      role: 'Senior Mechanical Engineer · MCIBSE',
      specialism: 'HVAC & Plantroom Engineering',
      signal: 'Verified Practitioner · 12 Useful Responses',
    },
    {
      name: 'Sarah Jenkins',
      initials: 'SJ',
      role: 'Head of Building Safety & Compliance',
      specialism: 'Building Safety Act & Golden Thread',
      signal: 'Compliance Lead · 8 Solved Answers',
    },
    {
      name: 'David Sterling',
      initials: 'DS',
      role: 'Director of Estates · Healthcare & Education',
      specialism: 'Water Hygiene & Statutory PPM',
      signal: 'Active Contributor · 6 Discussions',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ─── 1. COMMUNITY MASTHEAD (LIGHT / WARM NEUTRAL EDITORIAL) ─── */}
      <header className="border-b border-neutral-200/80 bg-white pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Top Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                The Professional Common Room
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-extralight text-neutral-500">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Practitioner knowledge exchange · UK Facilities Management</span>
            </div>
          </div>

          {/* Title & Standfirst */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-neutral-900 leading-[1.08]">
                Where FM professionals <br className="hidden sm:inline" />
                compare experience.
              </h1>

              <p className="text-lg sm:text-xl font-extralight text-neutral-700 leading-relaxed">
                Real questions. Practical answers. Professional conversation for facilities directors, estates managers, and building services engineers.
              </p>
            </div>

            {/* Primary Action Suite */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/lobby/community/new"
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light tracking-wide rounded-[4px] inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Ask a question</span>
              </Link>

              <Link
                href="/lobby/rooms/building-safety"
                className="px-4 py-2.5 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-light tracking-wide rounded-[4px] inline-flex items-center gap-2 transition-colors shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Enter Live Rooms</span>
              </Link>
            </div>
          </div>

          {/* Search & Navigation Bar */}
          <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations by topic, regulation, or plant..."
                className="w-full pl-10 pr-4 py-2 text-xs font-light text-neutral-900 placeholder:text-neutral-400 bg-neutral-50/80 border border-neutral-200 focus:border-neutral-900 rounded-[4px] focus:outline-none transition-colors"
              />
            </div>

            {/* Text-Led Filter Navigation (Zero Bubbly Pills) */}
            <div className="flex items-center gap-6 text-xs font-light overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveFilter('all')}
                className={`pb-1 transition-colors border-b-2 ${
                  activeFilter === 'all'
                    ? 'border-neutral-900 text-neutral-900 font-normal'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                All Conversations
              </button>
              <button
                onClick={() => setActiveFilter('featured')}
                className={`pb-1 transition-colors border-b-2 ${
                  activeFilter === 'featured'
                    ? 'border-neutral-900 text-neutral-900 font-normal'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Featured
              </button>
              <button
                onClick={() => setActiveFilter('unanswered')}
                className={`pb-1 transition-colors border-b-2 ${
                  activeFilter === 'unanswered'
                    ? 'border-neutral-900 text-neutral-900 font-normal'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Needs Answer
              </button>
              <button
                onClick={() => setActiveFilter('solved')}
                className={`pb-1 transition-colors border-b-2 ${
                  activeFilter === 'solved'
                    ? 'border-neutral-900 text-neutral-900 font-normal'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Solved
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MAIN COMMUNITY BODY ─── */}
      <main className="space-y-16 sm:space-y-24 py-12 sm:py-16">
        
        {/* ─── 2. FEATURED CONVERSATION (Dominant Subject Spotlight) ─── */}
        {featuredDiscussion && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                  Roundtable Spotlight
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                  Conversation Worth Joining
                </h2>
              </div>
              <span className="text-xs font-light text-neutral-500 hidden sm:inline">
                High-impact practitioner exchange
              </span>
            </div>

            <article className="group bg-white border border-neutral-200/90 rounded-[6px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xs">
              
              {/* Left Photographic Plate (Col 5) */}
              <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-[360px] overflow-hidden bg-neutral-900">
                <Image
                  src="/images/editorial/building-safety-facade-inspection.jpg"
                  alt={featuredDiscussion.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-102 brightness-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-[3px] border border-white/10">
                    {featuredDiscussion.categoryName}
                  </span>
                </div>

                {featuredDiscussion.solved && (
                  <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-xs text-emerald-300 font-light bg-emerald-950/80 px-2.5 py-1 rounded-[3px] border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Solved by Practitioner</span>
                  </div>
                )}
              </div>

              {/* Right Discussion Details (Col 7) */}
              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  
                  {/* Author Identity */}
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
                          <span className="text-[9px] font-mono uppercase text-brand-electric bg-brand-electric/10 px-2 py-0.5 rounded-[2px]">
                            {featuredDiscussion.authorBadge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-500 font-light">{featuredDiscussion.authorHeadline}</div>
                    </div>
                  </div>

                  {/* Headline & Body Excerpt */}
                  <h3 className="text-xl sm:text-2xl font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                    <Link href={`/lobby/community/discussion/${featuredDiscussion.slug}`}>
                      {featuredDiscussion.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm font-extralight text-neutral-600 leading-relaxed line-clamp-3">
                    {featuredDiscussion.body}
                  </p>
                </div>

                {/* Footer Metrics & CTA */}
                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                  <div className="text-xs font-light text-neutral-500 flex items-center gap-3">
                    <span>{featuredDiscussion.replyCount} replies</span>
                    <span>·</span>
                    <span>{featuredDiscussion.helpfulCount} marked helpful</span>
                  </div>

                  <Link
                    href={`/lobby/community/discussion/${featuredDiscussion.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-light text-brand-electric hover:underline"
                  >
                    <span>Join discussion</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* ─── 3. ACTIVE DISCUSSIONS & LIVE ROOM / CONTRACTOR DESK (2-Col Split) ─── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT COLUMN (Col 8): OPEN EDITORIAL CONVERSATION INDEX */}
            <div className="lg:col-span-8 space-y-6">
              <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                    Roundtable Index
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight">
                    Active Discussions
                  </h3>
                </div>
                <span className="text-xs font-light text-neutral-500">
                  {listDiscussions.length} active threads
                </span>
              </div>

              {loading ? (
                <div className="py-16 text-center text-neutral-400 font-light text-xs">
                  Loading roundtable discussions...
                </div>
              ) : listDiscussions.length > 0 ? (
                <div className="divide-y divide-neutral-200 bg-white border border-neutral-200/90 rounded-[6px] px-6 sm:px-8 shadow-2xs">
                  {listDiscussions.map((disc) => (
                    <article key={disc.id} className="py-6 first:pt-6 last:pb-6 group space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          
                          {/* Discipline pill + Solved signal */}
                          <div className="flex items-center gap-2 text-xs font-light">
                            <span className="text-brand-electric font-mono text-[10px] uppercase tracking-wider">
                              {disc.categoryName}
                            </span>
                            {disc.solved && (
                              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-[2px] flex items-center gap-1 text-[10px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Solved
                              </span>
                            )}
                            <span className="text-neutral-300">·</span>
                            <span className="text-neutral-400 text-[11px]">
                              {new Date(disc.lastActivityAt || disc.createdAt).toLocaleDateString('en-GB')}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-base sm:text-lg font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                            <Link href={`/lobby/community/discussion/${disc.slug}`}>
                              {disc.title}
                            </Link>
                          </h4>

                          {/* Excerpt */}
                          <p className="text-xs sm:text-sm font-extralight text-neutral-600 line-clamp-2 leading-relaxed">
                            {disc.body}
                          </p>

                          {/* Author meta */}
                          <div className="pt-1 flex items-center gap-2 text-xs text-neutral-500 font-extralight">
                            <span className="text-neutral-800 font-light">{disc.authorName}</span>
                            <span>—</span>
                            <span>{disc.authorHeadline}</span>
                          </div>
                        </div>

                        {/* Reply count metric */}
                        <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-0.5 shrink-0 pt-1 sm:pt-0">
                          <span className="text-sm font-light text-neutral-900">
                            {disc.replyCount}
                          </span>
                          <span className="text-[10px] font-extralight text-neutral-400">
                            replies
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-neutral-400 font-light text-xs bg-white border border-neutral-200/80 rounded-[6px]">
                  No discussions found matching this filter.
                </div>
              )}
            </div>

            {/* RIGHT COLUMN (Col 4): LIVE ROOM & THE CONTRACTOR DESK */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* 04. CINEMATIC LIVE ROOM ACCENT */}
              <div className="bg-[#0B1220] text-white rounded-[6px] overflow-hidden p-6 sm:p-7 relative group shadow-sm space-y-4">
                <div className="absolute inset-0 opacity-15">
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
                    <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300">
                      Live Room
                    </span>
                  </div>

                  <h4 className="text-lg font-light text-white leading-snug">
                    Building Safety Act &amp; Golden Thread Room
                  </h4>

                  <p className="text-xs font-extralight text-neutral-300 leading-relaxed">
                    Live practitioner discussion on digital occurrence reporting, safety cases, and BSR audits.
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/lobby/rooms/building-safety"
                      className="inline-flex items-center gap-1.5 text-xs font-light text-brand-electric-bright hover:underline"
                    >
                      <span>Enter Live Room</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* 05. THE CONTRACTOR DESK */}
              <div className="bg-white border border-neutral-200/90 p-6 sm:p-7 rounded-[6px] space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-brand-electric font-medium">
                  <HardHat className="w-3.5 h-3.5" />
                  <span>The Contractor Desk</span>
                </div>

                <h4 className="text-base font-light text-neutral-900 leading-snug">
                  Practical Site Execution &amp; Evidence
                </h4>

                <p className="text-xs font-extralight text-neutral-600 leading-relaxed">
                  Dedicated roundtable for specialist MEP contractors: RAMS, asset tagging during mobilisation, first-time-fix evidence, and client expectations.
                </p>

                <div className="pt-2">
                  <Link
                    href="/lobby/community/contractor-desk"
                    className="text-xs font-light text-neutral-900 hover:text-brand-electric inline-flex items-center gap-1 transition-colors"
                  >
                    <span>View Contractor Discussions</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* 06. ASK THE LOBBY PROMPT */}
              <div className="bg-neutral-100/80 border border-neutral-200 p-6 rounded-[6px] space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-600">
                  <Sparkles className="w-3.5 h-3.5 text-brand-electric" />
                  <span>Statutory Grounding</span>
                </div>

                <h4 className="text-sm font-light text-neutral-900">
                  Need statutory citations rather than peer opinions?
                </h4>

                <p className="text-xs font-extralight text-neutral-600 leading-relaxed">
                  Ask The Lobby retrieves grounded UK regulations, Approved Documents, and British Standards with verified source provenance.
                </p>

                <div className="pt-1">
                  <Link
                    href="/lobby/ask"
                    className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1"
                  >
                    <span>Ask The Lobby</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. CAN YOU HELP? (NEEDS AN ANSWER) ─── */}
        {unansweredDiscussions.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-700 font-light">
                  Practitioner Knowledge Network
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                  Can You Help? Needs an Answer
                </h2>
              </div>
              <span className="text-xs font-light text-neutral-500">
                Share your operational experience
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {unansweredDiscussions.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-neutral-200/90 p-6 rounded-[6px] flex flex-col justify-between space-y-4 shadow-2xs hover:border-neutral-400 transition-colors"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-brand-electric">
                      {item.categoryName}
                    </span>
                    <h4 className="text-sm font-light text-neutral-900 leading-snug hover:text-brand-electric transition-colors">
                      <Link href={`/lobby/community/discussion/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h4>
                    <p className="text-xs font-extralight text-neutral-600 line-clamp-2 leading-relaxed">
                      {item.body}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-extralight">
                      Asked by {item.authorName.split(' ')[0]}
                    </span>
                    <Link
                      href={`/lobby/community/discussion/${item.slug}`}
                      className="text-brand-electric hover:underline inline-flex items-center gap-1 font-light"
                    >
                      <span>Answer &rarr;</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ─── 5. SOLVED BY THE COMMUNITY (KNOWLEDGE ASSET) ─── */}
        {solvedDiscussions.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-700 font-light">
                  Verified Solutions
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                  Solved by the Community
                </h2>
              </div>
              <span className="text-xs font-light text-neutral-500">
                Reusable practitioner knowledge
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {solvedDiscussions.map((solvedItem) => (
                <div
                  key={solvedItem.id}
                  className="p-6 sm:p-7 bg-white border border-neutral-200/90 rounded-[6px] shadow-2xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] uppercase text-brand-electric">{solvedItem.categoryName}</span>
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[2px] flex items-center gap-1 text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Accepted Answer
                      </span>
                    </div>

                    <h3 className="text-lg font-light text-neutral-900 leading-snug">
                      <Link href={`/lobby/community/discussion/${solvedItem.slug}`} className="hover:text-brand-electric transition-colors">
                        {solvedItem.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm font-extralight text-neutral-600 line-clamp-3 leading-relaxed">
                      {solvedItem.body}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-light">
                    <span className="text-neutral-500">{solvedItem.helpfulCount} practitioners found this useful</span>
                    <Link
                      href={`/lobby/community/discussion/${solvedItem.slug}`}
                      className="text-brand-electric hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read solution</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── 6. EXPLORE BY DISCIPLINE (OPEN GRID) ─── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                Professional Taxonomy
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                Explore by Discipline
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500">
              Browse discussions by technical area
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/lobby/community/${cat.slug}`}
                className="p-6 bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-[6px] shadow-2xs space-y-2 group transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-light text-neutral-900 group-hover:text-brand-electric transition-colors">
                    {cat.name}
                  </h4>
                  <span className="text-xs text-neutral-400 font-mono group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </div>
                <p className="text-xs font-extralight text-neutral-600 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── 7. CONTRIBUTORS (HUMAN SOCIAL LAYER) ─── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                Practitioner Network
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                People Helping the Community
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500">
              Verified members contributing knowledge
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contributors.map((member) => (
              <div
                key={member.name}
                className="p-6 bg-white border border-neutral-200/90 rounded-[6px] shadow-2xs space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-mono text-xs font-medium">
                    {member.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{member.name}</div>
                    <div className="text-[11px] font-extralight text-neutral-500">{member.role}</div>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-neutral-700 font-light">{member.specialism}</div>
                  <div className="text-[11px] font-mono text-brand-electric pt-1">{member.signal}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
