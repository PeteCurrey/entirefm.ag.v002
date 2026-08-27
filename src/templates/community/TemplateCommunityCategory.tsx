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
  ArrowLeft,
  Search,
} from 'lucide-react';

export function TemplateCommunityCategory({ categorySlug }: { categorySlug: string }) {
  const [category, setCategory] = useState<any>(null);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'solved'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, discRes] = await Promise.all([
          fetch('/api/community/categories'),
          fetch(`/api/community/discussions?category=${categorySlug}`),
        ]);
        const catData = await catRes.json();
        const discData = await discRes.json();

        const currentCat = (catData.categories || []).find((c: any) => c.slug === categorySlug);
        setCategory(currentCat);
        setDiscussions(discData.discussions || []);
      } catch (err) {
        console.error('Error fetching category discussions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categorySlug]);

  const filteredDiscussions = discussions.filter((d) => {
    if (filter === 'unanswered') return d.replyCount === 0 || !d.solved;
    if (filter === 'solved') return d.solved;
    return true;
  });

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* Category Masthead */}
        <section className="border-b border-brand-graphite/40 bg-gradient-to-b from-brand-graphite/30 to-brand-void/90 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/lobby/community"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-silver hover:text-brand-electric mb-4 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Community Categories
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-electric">
                  FM Category Roundtable
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">
                  {category?.name || categorySlug}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-brand-silver max-w-2xl leading-relaxed">
                  {category?.longDescription || category?.shortDescription}
                </p>
              </div>

              <Link
                href={`/lobby/community/new?category=${categorySlug}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-brand-electric text-white hover:bg-brand-electric/90 shadow-lg shadow-brand-electric/20 shrink-0 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Ask in {category?.name || 'Category'}
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="mt-8 flex items-center gap-2 border-b border-white/5 pb-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-white/10 text-white'
                    : 'text-brand-silver hover:text-white'
                }`}
              >
                All ({discussions.length})
              </button>
              <button
                onClick={() => setFilter('solved')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  filter === 'solved'
                    ? 'bg-white/10 text-white'
                    : 'text-brand-silver hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Solved
              </button>
              <button
                onClick={() => setFilter('unanswered')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  filter === 'unanswered'
                    ? 'bg-white/10 text-white'
                    : 'text-brand-silver hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                Unanswered
              </button>
            </div>
          </div>
        </section>

        {/* Discussion List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="py-12 text-center text-brand-silver text-sm">Loading category discussions...</div>
          ) : filteredDiscussions.length === 0 ? (
            <div className="bg-brand-graphite/20 border border-white/5 rounded-xl p-10 text-center">
              <MessageSquare className="w-8 h-8 mx-auto text-brand-silver mb-2 opacity-60" />
              <p className="text-white font-medium">No discussions found in this filter</p>
              <Link
                href={`/lobby/community/new?category=${categorySlug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-electric hover:underline"
              >
                Start the first discussion →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDiscussions.map((disc) => (
                <article
                  key={disc.id}
                  className="group bg-brand-graphite/20 hover:bg-brand-graphite/40 border border-white/5 hover:border-white/15 rounded-xl p-5 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
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

                    <h2 className="text-base sm:text-lg font-semibold text-white group-hover:text-brand-electric transition-colors">
                      <Link href={`/lobby/community/discussion/${disc.slug}`}>
                        {disc.title}
                      </Link>
                    </h2>

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
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
