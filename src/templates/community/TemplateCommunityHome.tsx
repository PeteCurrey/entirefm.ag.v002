'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  MessageSquare,
  PlusCircle,
  CheckCircle2,
  HelpCircle,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  Wrench,
  Flame,
  Droplets,
  Cpu,
  Truck,
  Leaf,
  FileText,
  Sparkles,
  GraduationCap,
  HardHat,
  Search,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  Building2,
  ShieldCheck,
  Wrench,
  Flame,
  Droplets,
  Layers,
  Leaf,
  Cpu,
  FileText,
  Truck,
  Sparkles,
  GraduationCap,
  HardHat,
};

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

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col selection:bg-brand-electric selection:text-white font-sans">
      <Header />

      <main className="flex-1">
        {/* Masthead Banner */}
        <section className="border-b border-brand-graphite/40 bg-gradient-to-b from-brand-graphite/30 to-brand-void/90 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-electric/15 text-brand-electric border border-brand-electric/30">
                    <MessageSquare className="w-3.5 h-3.5" />
                    The Lobby Community
                  </span>
                  <span className="text-xs text-brand-silver">FM Knowledge Roundtable</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  Where UK facilities managers <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-mist to-brand-electric">
                    compare notes and solve problems.
                  </span>
                </h1>
                <p className="mt-3 text-base sm:text-lg text-brand-silver max-w-2xl">
                  A high-trust, technical forum for verified facilities management practitioners. Practical engineering, statutory compliance, contract mobilisation, and asset management.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/lobby/community/new"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-brand-electric text-white hover:bg-brand-electric/90 shadow-lg shadow-brand-electric/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Ask a Question
                </Link>
                <Link
                  href="/lobby/rooms"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-brand-graphite/60 text-white hover:bg-brand-graphite border border-white/10 transition-colors"
                >
                  Live Rooms →
                </Link>
              </div>
            </div>

            {/* Quick Search & Filter Bar */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-silver" />
                <input
                  type="text"
                  placeholder="Search technical discussions (e.g. AHU belts, BSA 2022)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-brand-graphite/50 border border-white/10 rounded-lg text-sm text-white placeholder-brand-silver focus:outline-none focus:border-brand-electric transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-brand-electric text-white'
                      : 'bg-brand-graphite/40 text-brand-silver hover:text-white border border-white/5'
                  }`}
                >
                  All Conversations
                </button>
                <button
                  onClick={() => setActiveFilter('featured')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeFilter === 'featured'
                      ? 'bg-brand-electric text-white'
                      : 'bg-brand-graphite/40 text-brand-silver hover:text-white border border-white/5'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Featured
                </button>
                <button
                  onClick={() => setActiveFilter('unanswered')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeFilter === 'unanswered'
                      ? 'bg-brand-electric text-white'
                      : 'bg-brand-graphite/40 text-brand-silver hover:text-white border border-white/5'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Unanswered
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left/Main: Discussions Feed */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-silver">
                  {activeFilter === 'unanswered'
                    ? 'Questions Needing Practitioner Input'
                    : activeFilter === 'featured'
                    ? 'Curated Professional Discussions'
                    : 'Recent Technical Discussions'}
                </h2>
                <span className="text-xs text-brand-silver">{discussions.length} conversations</span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-brand-silver text-sm">Loading community intelligence...</div>
              ) : discussions.length === 0 ? (
                <div className="bg-brand-graphite/20 border border-white/5 rounded-xl p-8 text-center">
                  <HelpCircle className="w-8 h-8 mx-auto text-brand-silver mb-2 opacity-60" />
                  <p className="text-white font-medium">No discussions found</p>
                  <p className="text-xs text-brand-silver mt-1">Try broadening your search or be the first to ask.</p>
                  <Link
                    href="/lobby/community/new"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-electric hover:underline"
                  >
                    Start a new conversation →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {discussions.map((disc) => {
                    const IconComponent = CATEGORY_ICONS[disc.categorySlug] || MessageSquare;
                    return (
                      <article
                        key={disc.id}
                        className="group bg-brand-graphite/20 hover:bg-brand-graphite/40 border border-white/5 hover:border-white/15 rounded-xl p-5 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <Link
                                href={`/lobby/community/${disc.categorySlug}`}
                                className="font-semibold text-brand-electric hover:underline"
                              >
                                {disc.categoryName}
                              </Link>
                              <span className="text-white/20">•</span>
                              <span className="text-brand-silver">
                                By {disc.authorName}
                                {disc.authorHeadline && ` (${disc.authorHeadline.split('|')[0].trim()})`}
                              </span>
                              {disc.authorBadge && (
                                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-brand-mist border border-white/10">
                                  {disc.authorBadge}
                                </span>
                              )}
                            </div>

                            <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-brand-electric transition-colors">
                              <Link href={`/lobby/community/discussion/${disc.slug}`}>
                                {disc.title}
                              </Link>
                            </h3>

                            <p className="text-xs sm:text-sm text-brand-silver line-clamp-2 leading-relaxed">
                              {disc.body}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-brand-silver">
                              {disc.tags?.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] text-brand-mist"
                                >
                                  #{tag}
                                </span>
                              ))}

                              <div className="ml-auto flex items-center gap-4">
                                {disc.solved && (
                                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Solved
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  {disc.replyCount} {disc.replyCount === 1 ? 'reply' : 'replies'}
                                </span>
                                {disc.helpfulCount > 0 && (
                                  <span className="flex items-center gap-1 text-brand-electric">
                                    ★ {disc.helpfulCount} helpful
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Controlled 13 Categories Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-brand-graphite/25 border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-electric" />
                    FM Disciplines & Categories
                  </h3>
                  <span className="text-xs text-brand-silver">13 Categories</span>
                </div>

                <nav className="space-y-1">
                  {categories.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.icon] || MessageSquare;
                    return (
                      <Link
                        key={cat.id}
                        href={`/lobby/community/${cat.slug}`}
                        className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className="w-4 h-4 text-brand-silver group-hover:text-brand-electric shrink-0 transition-colors" />
                          <span className="font-medium text-brand-mist group-hover:text-white truncate">
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-xs text-brand-silver group-hover:text-white px-2 py-0.5 rounded bg-white/5">
                          {cat.discussionCount}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* The Contractor Desk Callout */}
              <div className="bg-gradient-to-br from-amber-500/10 via-brand-graphite/30 to-brand-void border border-amber-500/20 rounded-xl p-5">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <HardHat className="w-4 h-4" />
                  The Contractor Desk
                </div>
                <h4 className="text-sm font-semibold text-white">Specialist Supplier & MEP Roundtable</h4>
                <p className="text-xs text-brand-silver mt-1.5 leading-relaxed">
                  Dedicated discussion space for commercial FM contractors, specialist engineers, and service partners covering RAMS, job proof, and mobilisation.
                </p>
                <Link
                  href="/lobby/community/contractor-desk"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  Enter Contractor Desk →
                </Link>
              </div>

              {/* Professional Disclaimer */}
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-brand-silver leading-relaxed">
                <p className="font-semibold text-brand-mist mb-1">Professional Practice Disclaimer</p>
                Community contributions reflect the technical insight of individual members and should not replace site-specific competent engineering advice or statutory regulatory compliance checks.
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
