'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search, Clock, Building2, Briefcase, Award, ShieldCheck, Tag, ExternalLink } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import type { NewsArticle, NewsCategoryMeta } from '@/server/news/types';

interface TemplateNewsHomeProps {
  leadStory?: NewsArticle;
  featuredArticles: NewsArticle[];
  latestStream: NewsArticle[];
  contractWins: NewsArticle[];
  peopleMoves: NewsArticle[];
  categories: NewsCategoryMeta[];
}

export function TemplateNewsHome({
  leadStory,
  featuredArticles,
  latestStream,
  contractWins,
  peopleMoves,
  categories,
}: TemplateNewsHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = latestStream.filter((article) => {
    const matchesCat = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.standfirst.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col justify-between pt-16 sm:pt-20">
      {/* Editorial Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="container-wide py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-500 font-semibold">
                  THE LOBBY NEWS DESK · INDUSTRY WIRE
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-neutral-900 tracking-tight">
                FM Industry News
              </h1>
              <p className="text-sm sm:text-base font-light text-neutral-600 max-w-2xl">
                Statutory directives, engineering updates, contract awards, and executive moves across UK facilities management.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/lobby"
                className="text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                &larr; Return to The Lobby
              </Link>
            </div>
          </div>

          {/* Category Taxonomy Filter Bar */}
          <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-neutral-900 text-white font-medium'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-sm text-xs font-mono whitespace-nowrap transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container-wide py-12 sm:py-16 space-y-16">
        
        {/* 1. LEAD STORY SPREAD (Cover Feature) */}
        {leadStory && selectedCategory === 'all' && (
          <section className="grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-stretch border-b border-neutral-200 pb-16">
            <div className="relative min-h-[320px] sm:min-h-[420px] rounded-sm overflow-hidden bg-neutral-900">
              <Image
                src={leadStory.provenance.imageUrl}
                alt={leadStory.provenance.altText || leadStory.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover brightness-90 hover:scale-[1.015] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-sm">
                  {leadStory.category.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white/90 font-light">
                <span>{leadStory.sourceName}</span>
                <span>{new Date(leadStory.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[11px] font-mono text-brand-electric uppercase tracking-widest block font-medium">
                  LEAD EDITORIAL DISPATCH
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-neutral-900 leading-tight">
                  <Link href={`/lobby/news/article/${leadStory.slug}`} className="hover:text-brand-electric transition-colors">
                    {leadStory.title}
                  </Link>
                </h2>

                <p className="text-sm sm:text-base font-light text-neutral-600 leading-relaxed">
                  {leadStory.standfirst}
                </p>

                {leadStory.whyItMatters && (
                  <div className="border-l-2 border-brand-electric pl-3 py-1 space-y-1 bg-white p-3 rounded-sm border border-neutral-100">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric block font-medium">
                      Why It Matters for FM
                    </span>
                    <p className="text-xs sm:text-sm font-light text-neutral-700 leading-relaxed italic">
                      {leadStory.whyItMatters}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                <Link
                  href={`/lobby/news/article/${leadStory.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-brand-electric transition-colors"
                >
                  <span>Read Full Dispatch</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <span className="text-xs text-neutral-400 font-mono">
                  {leadStory.readingTimeMinutes} min read
                </span>
              </div>
            </div>
          </section>
        )}

        {/* 2. THREE-COLUMN EDITORIAL SPREAD: FEATURED STORIES / LATEST WIRE / INDUSTRY MOVES */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
          
          {/* LEFT: LATEST STORIES FEED WITH CRISP THUMBNAILS */}
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900">
                Latest Dispatches &amp; Regulatory Shifts
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                {filteredArticles.length} Stories
              </span>
            </div>

            <div className="divide-y divide-neutral-200">
              {filteredArticles.map((article) => (
                <article key={article.id} className="py-6 first:pt-0 group">
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <div className="relative w-full sm:w-36 h-36 sm:h-28 shrink-0 rounded-sm overflow-hidden bg-neutral-100">
                      <Image
                        src={article.provenance.imageUrl}
                        alt={article.provenance.altText || article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 150px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                        <span className="uppercase text-brand-electric font-medium">
                          {article.category.replace('-', ' ')}
                        </span>
                        <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                      </div>

                      <h3 className="text-lg font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                        <Link href={`/lobby/news/article/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>

                      <p className="text-xs sm:text-sm font-light text-neutral-600 line-clamp-2 leading-relaxed">
                        {article.standfirst}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-xs text-neutral-500">
                        <span className="font-mono">Source: {article.sourceName}</span>
                        <Link
                          href={`/lobby/news/article/${article.slug}`}
                          className="text-neutral-900 font-medium hover:text-brand-electric transition-colors flex items-center gap-1"
                        >
                          <span>Read &rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* RIGHT SIDEBAR: CONTRACTS & WINS + PEOPLE & MOVES */}
          <div className="space-y-10">
            
            {/* CONTRACTS & MOBILISATIONS */}
            <div className="bg-white border border-neutral-200/80 rounded-sm p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-electric font-semibold">
                  CONTRACTS &amp; MOBILISATIONS
                </span>
                <span className="text-xs text-neutral-400 font-mono">Recent Awards</span>
              </div>

              <div className="space-y-4 divide-y divide-neutral-100">
                {contractWins.map((contract) => (
                  <div key={contract.id} className="pt-3 first:pt-0 space-y-1.5">
                    {contract.contractValue && (
                      <span className="inline-block text-[11px] font-mono font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm">
                        {contract.contractValue} · {contract.contractTermYears} Years
                      </span>
                    )}
                    <h4 className="text-sm font-light text-neutral-900 hover:text-brand-electric leading-snug">
                      <Link href={`/lobby/news/article/${contract.slug}`}>
                        {contract.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-neutral-500 font-mono">
                      Client: {contract.contractClient}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* PEOPLE & APPOINTMENTS */}
            <div className="bg-white border border-neutral-200/80 rounded-sm p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                  INDUSTRY MOVES &amp; LEADERSHIP
                </span>
                <span className="text-xs text-neutral-400 font-mono">Appointments</span>
              </div>

              <div className="space-y-4 divide-y divide-neutral-100">
                {peopleMoves.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 space-y-1.5">
                    <div className="text-xs font-mono text-brand-electric">
                      {item.personName}
                    </div>
                    <h4 className="text-sm font-light text-neutral-900 leading-snug hover:text-brand-electric">
                      <Link href={`/lobby/news/article/${item.slug}`}>
                        {item.personNewRole} — {item.personCompany}
                      </Link>
                    </h4>
                    <p className="text-xs text-neutral-500 font-light">
                      Formerly with {item.personPreviousOrg}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AWARDS & RECOGNITION CALLOUT */}
            <div className="bg-[#111622] text-white rounded-sm p-6 sm:p-7 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 block font-medium">
                INDUSTRY RECOGNITION
              </span>
              <h3 className="text-lg font-light text-white leading-snug">
                IWFM &amp; PFM Award Submissions Closing Soon
              </h3>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                Track entry deadlines, ceremony dates, and shortlists across the UK facilities management sector.
              </p>
              <Link
                href="/lobby/awards"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-white transition-colors uppercase tracking-wider pt-2"
              >
                <span>Browse Awards Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
