'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAllPublishedLobbyArticles, getAllLobbyTopics } from '@/lib/lobby/repository';
import type { Franchise, LobbyArticle } from '@/lib/lobby/types';
import { ArrowLeft, ArrowRight, Clock, Calendar, Filter, Layers, Search } from 'lucide-react';

const FRANCHISE_OPTIONS: { label: string; value: Franchise | 'all' }[] = [
  { label: 'All Franchises', value: 'all' },
  { label: 'The Week That Matters', value: 'week-that-matters' },
  { label: 'Compliance Watch', value: 'compliance-watch' },
  { label: 'The Engineer’s Note', value: 'engineers-note' },
  { label: 'Ask EntireFM', value: 'ask-entirefm' },
  { label: 'From The Field', value: 'from-the-field' },
  { label: 'Worth Attending', value: 'worth-attending' },
  { label: 'One Useful Thing', value: 'useful-thing' },
];

export function TemplateLobbyArchive() {
  const articles = getAllPublishedLobbyArticles();
  const topics = getAllLobbyTopics();

  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | 'all'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      if (selectedFranchise !== 'all' && article.franchise !== selectedFranchise) {
        return false;
      }
      if (selectedTopic !== 'all' && !article.topics.includes(selectedTopic)) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesStandfirst = article.standfirst.toLowerCase().includes(query);
        const matchesTopics = article.topics.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesStandfirst && !matchesTopics) {
          return false;
        }
      }
      return true;
    });
  }, [articles, selectedFranchise, selectedTopic, searchQuery]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-brand-graphite">
      <Header solid={true} />

      <main id="main" className="flex-1">
        {/* Masthead */}
        <header className="py-12 sm:py-16 bg-brand-void text-white border-b border-brand-edge-dark">
          <div className="container-custom space-y-4">
            <Link
              href="/lobby"
              className="inline-flex items-center gap-1.5 text-xs text-brand-mist/70 hover:text-white font-light transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to The Lobby Homepage</span>
            </Link>

            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-electric-bright">
                Editorial Repository
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white tracking-tight">
              THE LOBBY ARCHIVE
            </h1>

            <p className="text-sm sm:text-base font-light text-brand-mist/80 max-w-2xl leading-relaxed">
              Explore the complete indexed library of UK facilities management briefings, compliance translations, engineering diagnostics, and operational assets.
            </p>
          </div>
        </header>

        {/* Filter Controls */}
        <section className="border-b border-brand-edge bg-brand-surface py-6">
          <div className="container-custom space-y-4">
            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-silver" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search briefings, standards, symptoms..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-sm border border-brand-edge bg-white focus:border-brand-electric focus:ring-1 focus:ring-brand-electric text-brand-graphite placeholder:text-brand-silver/60"
              />
            </div>

            {/* Franchise Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-xs font-mono uppercase text-brand-silver mr-2 hidden sm:inline">
                Franchise:
              </span>
              {FRANCHISE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedFranchise(opt.value)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-light transition-all ${
                    selectedFranchise === opt.value
                      ? 'bg-brand-graphite text-white font-normal shadow-sm'
                      : 'bg-white border border-brand-edge text-brand-slate hover:border-brand-silver hover:bg-brand-surface'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Topic Selector */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-mono uppercase text-brand-silver mr-2 hidden sm:inline">
                Topic:
              </span>
              <button
                type="button"
                onClick={() => setSelectedTopic('all')}
                className={`px-2.5 py-1 rounded-sm text-[11.5px] font-light transition-all ${
                  selectedTopic === 'all'
                    ? 'bg-brand-electric text-white'
                    : 'bg-white border border-brand-edge text-brand-slate hover:bg-brand-surface'
                }`}
              >
                All Topics
              </button>
              {topics.map((t) => (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => setSelectedTopic(t.slug)}
                  className={`px-2.5 py-1 rounded-sm text-[11.5px] font-light transition-all ${
                    selectedTopic === t.slug
                      ? 'bg-brand-electric text-white'
                      : 'bg-white border border-brand-edge text-brand-slate hover:bg-brand-surface'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Article Grid */}
        <section className="py-12 sm:py-16">
          <div className="container-custom">
            <div className="flex items-center justify-between border-b border-brand-edge pb-4 mb-8">
              <span className="text-xs font-mono text-brand-silver">
                Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
              </span>

              {(selectedFranchise !== 'all' || selectedTopic !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFranchise('all');
                    setSelectedTopic('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-brand-electric hover:underline"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {filteredArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/lobby/${article.slug}`}
                    className="border border-brand-edge bg-white rounded-sm p-6 flex flex-col justify-between hover:border-brand-electric hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-electric font-medium">
                          {article.franchise.replace(/-/g, ' ')}
                        </span>
                        <span className="text-[10.5px] text-brand-silver font-light">
                          {article.publishedAt}
                        </span>
                      </div>

                      <h3 className="text-lg font-light text-brand-graphite leading-snug group-hover:text-brand-electric transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-xs sm:text-[13px] font-light text-brand-slate leading-relaxed line-clamp-3">
                        {article.standfirst}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-brand-edge flex items-center justify-between text-xs">
                      <span className="text-brand-silver font-light">{article.readingTimeMinutes} min read</span>
                      <span className="inline-flex items-center gap-1 text-brand-electric font-normal group-hover:translate-x-0.5 transition-transform">
                        Read brief <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3 bg-brand-surface rounded-sm border border-brand-edge">
                <p className="text-base font-light text-brand-graphite">
                  No articles matched your active filter criteria.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFranchise('all');
                    setSelectedTopic('all');
                    setSearchQuery('');
                  }}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
