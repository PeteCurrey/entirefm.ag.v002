'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Search,
  ShieldCheck,
  MessageSquare,
  Wrench,
  BookOpen,
  Users,
  Radio,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export function TemplateLobbySearch() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [resultsData, setResultsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/lobby/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResultsData(data);
      } catch (err) {
        console.error('Error executing Lobby search:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const bestMatch = resultsData?.resultsByGroup?.BEST_MATCH?.[0];
  const complianceResults = resultsData?.resultsByGroup?.COMPLIANCE || [];
  const communityResults = resultsData?.resultsByGroup?.COMMUNITY || [];
  const toolsResults = resultsData?.resultsByGroup?.TOOLS_RESOURCES || [];
  const guidesResults = resultsData?.resultsByGroup?.GUIDES || [];
  const peopleResults = resultsData?.resultsByGroup?.PEOPLE || [];

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* Search Header Banner */}
        <section className="border-b border-brand-graphite/40 bg-gradient-to-b from-brand-graphite/30 to-brand-void py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-electric">
              The Lobby Knowledge Engine
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
              What are you trying to solve?
            </h1>
            <p className="mt-2 text-sm text-brand-silver">
              Search statutory compliance, field engineering guides, active discussions, FM calculators, and expert practitioners.
            </p>

            {/* Big Search Input */}
            <div className="mt-8 relative max-w-2xl mx-auto">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-brand-silver" />
              <input
                type="text"
                autoFocus
                placeholder="Search by topic, statutory code or symptom (e.g. BSA 2022, AHU belt tension, water hygiene KPI)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-brand-graphite/60 border border-white/15 rounded-2xl text-base text-white placeholder-brand-silver focus:outline-none focus:border-brand-electric shadow-xl"
              />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-brand-silver">
              <span>Popular searches:</span>
              {['mobilisation asset register', 'AHU belt failure', 'BSA 2022 dutyholder', 'water hygiene KPI', 'SFG20'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-brand-mist border border-white/5 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results Container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="py-12 text-center text-brand-silver text-sm">Querying cross-entity intelligence graph...</div>
          ) : !query.trim() ? (
            <div className="py-12 text-center text-brand-silver text-xs">
              Type a search query above to explore connected FM intelligence.
            </div>
          ) : resultsData?.isZeroResult ? (
            /* Zero-Result Knowledge Gap & Fallback Loop */
            <div className="bg-brand-graphite/20 border border-white/5 rounded-2xl p-10 text-center space-y-4 max-w-2xl mx-auto">
              <HelpCircle className="w-10 h-10 mx-auto text-brand-electric opacity-80" />
              <h2 className="text-lg font-bold text-white">We don't have a verified answer for that yet</h2>
              <p className="text-xs sm:text-sm text-brand-silver leading-relaxed">
                Your search query has been logged to our editorial knowledge gap desk. You can ask our community of FM practitioners or submit it directly to Ask EntireFM.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/lobby/community/new?title=${encodeURIComponent(query)}`}
                  className="px-4 py-2.5 rounded-lg bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/90 shadow-md transition-all"
                >
                  Ask the Community →
                </Link>
                <Link
                  href="/lobby#ask-entirefm"
                  className="px-4 py-2.5 rounded-lg bg-white/5 text-brand-mist hover:text-white border border-white/10 text-xs font-semibold transition-colors"
                >
                  Submit to Ask EntireFM
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {/* BEST MATCH / DOMINANT RESULT */}
              {bestMatch && (
                <div className="bg-gradient-to-br from-brand-electric/15 via-brand-graphite/30 to-brand-void border-2 border-brand-electric/40 rounded-2xl p-6 sm:p-8 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 text-brand-electric text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    Best Authoritative Match
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white hover:text-brand-electric transition-colors">
                    <Link href={bestMatch.href}>{bestMatch.title}</Link>
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-silver leading-relaxed">
                    {bestMatch.snippet}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-brand-mist font-medium">{bestMatch.badge}</span>
                    <Link
                      href={bestMatch.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-electric hover:underline"
                    >
                      Read Full Intelligence Brief →
                    </Link>
                  </div>
                </div>
              )}

              {/* Grouped Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Statutory Compliance Watch */}
                {complianceResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-white/5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Statutory Compliance
                    </h3>
                    <div className="space-y-2">
                      {complianceResults.map((item: any) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="block p-3.5 rounded-xl bg-brand-graphite/20 hover:bg-brand-graphite/40 border border-white/5 transition-all text-xs space-y-1 group"
                        >
                          <span className="font-semibold text-white group-hover:text-brand-electric block">
                            {item.title}
                          </span>
                          <p className="text-brand-silver line-clamp-2">{item.snippet}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* FM Tools & Checklists */}
                {toolsResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-white/5">
                      <Wrench className="w-4 h-4 text-brand-electric" />
                      Tools & Calculators
                    </h3>
                    <div className="space-y-2">
                      {toolsResults.map((item: any) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="block p-3.5 rounded-xl bg-brand-graphite/20 hover:bg-brand-graphite/40 border border-white/5 transition-all text-xs space-y-1 group"
                        >
                          <span className="font-semibold text-white group-hover:text-brand-electric block">
                            {item.title}
                          </span>
                          <p className="text-brand-silver line-clamp-2">{item.snippet}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Community Discussions */}
                {communityResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-white/5">
                      <MessageSquare className="w-4 h-4 text-brand-mist" />
                      Community Discussions
                    </h3>
                    <div className="space-y-2">
                      {communityResults.map((item: any) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="block p-3.5 rounded-xl bg-brand-graphite/20 hover:bg-brand-graphite/40 border border-white/5 transition-all text-xs space-y-1 group"
                        >
                          <span className="font-semibold text-white group-hover:text-brand-electric block">
                            {item.title}
                          </span>
                          <p className="text-brand-silver line-clamp-2">{item.snippet}</p>
                          <span className="text-[10px] text-brand-electric pt-1 block">{item.badge}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Guides */}
                {guidesResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-white/5">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      Editorial Briefings
                    </h3>
                    <div className="space-y-2">
                      {guidesResults.map((item: any) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="block p-3.5 rounded-xl bg-brand-graphite/20 hover:bg-brand-graphite/40 border border-white/5 transition-all text-xs space-y-1 group"
                        >
                          <span className="font-semibold text-white group-hover:text-brand-electric block">
                            {item.title}
                          </span>
                          <p className="text-brand-silver line-clamp-2">{item.snippet}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verified Practitioners */}
                {peopleResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-white/5">
                      <Users className="w-4 h-4 text-brand-electric" />
                      Practitioners & Authors
                    </h3>
                    <div className="space-y-2">
                      {peopleResults.map((item: any) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="block p-3.5 rounded-xl bg-brand-graphite/20 hover:bg-brand-graphite/40 border border-white/5 transition-all text-xs space-y-1 group"
                        >
                          <span className="font-semibold text-white group-hover:text-brand-electric block">
                            {item.title}
                          </span>
                          <p className="text-brand-silver">{item.snippet}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
