'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  PlusCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
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
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ─── MASTHEAD (LIGHT / ARCHITECTURAL) ─── */}
      <header className="border-b border-neutral-200/80 bg-white pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Link
            href="/lobby/community"
            className="inline-flex items-center gap-1.5 text-xs font-light text-neutral-500 hover:text-brand-electric transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Community Disciplines</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-3 max-w-3xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-light">
                Discipline Roundtable
              </span>
              <h1 className="text-4xl sm:text-5xl font-extralight tracking-tight text-neutral-900 leading-tight">
                {category?.name || categorySlug}
              </h1>
              <p className="text-base sm:text-lg font-extralight text-neutral-600 leading-relaxed max-w-2xl">
                {category?.description || 'Practitioner knowledge, statutory interpretations, and site-level engineering discussions.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/lobby/community/new?category=${categorySlug}`}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light tracking-wide rounded-[4px] inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Ask in {category?.name || 'Category'}</span>
              </Link>
            </div>
          </div>

          {/* Filter Navigation */}
          <div className="pt-6 border-t border-neutral-100 flex items-center gap-6 text-xs font-light">
            <button
              onClick={() => setFilter('all')}
              className={`pb-1 transition-colors border-b-2 ${
                filter === 'all'
                  ? 'border-neutral-900 text-neutral-900 font-normal'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              All ({discussions.length})
            </button>
            <button
              onClick={() => setFilter('solved')}
              className={`pb-1 transition-colors border-b-2 flex items-center gap-1.5 ${
                filter === 'solved'
                  ? 'border-neutral-900 text-neutral-900 font-normal'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Solved ({discussions.filter((d) => d.solved).length})</span>
            </button>
            <button
              onClick={() => setFilter('unanswered')}
              className={`pb-1 transition-colors border-b-2 ${
                filter === 'unanswered'
                  ? 'border-neutral-900 text-neutral-900 font-normal'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Needs Answer ({discussions.filter((d) => !d.solved && d.replyCount === 0).length})
            </button>
          </div>
        </div>
      </header>

      {/* ─── DISCUSSIONS LIST ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {loading ? (
          <div className="py-16 text-center text-neutral-400 font-light text-xs">
            Loading conversations in this discipline...
          </div>
        ) : filteredDiscussions.length > 0 ? (
          <div className="divide-y divide-neutral-200 bg-white border border-neutral-200/90 rounded-[6px] px-6 sm:px-8 shadow-2xs">
            {filteredDiscussions.map((disc) => (
              <article key={disc.id} className="py-6 first:pt-6 last:pb-6 group space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-xs font-light">
                      {disc.solved && (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-[2px] flex items-center gap-1 text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Solved
                        </span>
                      )}
                      <span className="text-neutral-400 text-[11px]">
                        {new Date(disc.lastActivityAt || disc.createdAt).toLocaleDateString('en-GB')}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                      <Link href={`/lobby/community/discussion/${disc.slug}`}>
                        {disc.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm font-extralight text-neutral-600 line-clamp-2 leading-relaxed max-w-3xl">
                      {disc.body}
                    </p>

                    <div className="pt-1 flex items-center gap-2 text-xs text-neutral-500 font-extralight">
                      <span className="text-neutral-800 font-light">{disc.authorName}</span>
                      <span>—</span>
                      <span>{disc.authorHeadline}</span>
                    </div>
                  </div>

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
          <div className="py-16 text-center text-neutral-400 font-light text-xs bg-white border border-neutral-200/80 rounded-[6px] space-y-3">
            <p>No conversations found in this discipline matching this filter.</p>
            <Link
              href={`/lobby/community/new?category=${categorySlug}`}
              className="text-brand-electric hover:underline text-xs inline-block"
            >
              Start the first conversation in {category?.name || 'this category'} &rarr;
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
