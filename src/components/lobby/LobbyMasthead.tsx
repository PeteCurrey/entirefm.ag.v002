'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, ArrowLeft, ArrowRight, Sparkles, Search, Compass, ShieldCheck, Zap } from 'lucide-react';
import { MemberNavControl } from '@/components/member/MemberNavControl';

const HERO_PROMPTS = [
  'What changed in building safety today?',
  'Show me London FM tenders closing soon',
  'F-gas quota rules for commercial chillers',
  'Who won major cleaning contracts this month?',
  'Standard testing frequency for commercial EICRs',
];

export function LobbyMasthead() {
  const router = useRouter();
  const [currentDateStr, setCurrentDateStr] = useState<string>('Thursday, 27 August 2026');
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'ask' | 'deep_research'>('ask');

  useEffect(() => {
    try {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);
      setCurrentDateStr(formatted);
    } catch {
      // Fallback
    }
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const q = (customQ || query).trim();
    if (!q) return;

    router.push(`/lobby/ask?q=${encodeURIComponent(q)}&mode=${mode}`);
  };

  return (
    <header className="relative h-full w-full bg-brand-void text-white overflow-hidden flex flex-col justify-between">
      {/* ── Background Photography & Atmospheric Overlays ────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/lobby/entirefm-lobby-hero.jpg"
          alt="EntireFM Headquarters architectural entrance and illuminated reception lobby"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-center transform scale-100"
        />

        {/* Cinematic dark gradients allowing background to breathe */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-void/90 via-brand-void/40 to-black/45" />
        <div className="absolute inset-0 bg-black/10" />

        {/* Ambient brand glow accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[10%] -top-[20%] h-[36rem] w-[36rem] rounded-full opacity-20 blur-[140px]"
          style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[5%] -bottom-[15%] h-[32rem] w-[32rem] rounded-full opacity-15 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
        />
        <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-15" />
      </div>

      {/* ── Content Container (Full Height Layout) ────────────────────── */}
      <div className="container-wide relative z-10 flex flex-col justify-between h-full pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
        {/* ── Top Lobby Header Bar (Standalone Lobby Navigation) ──────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.12] pb-4 sm:pb-5 mb-2 sm:mb-4">
          {/* Left: Link to Main Site & Dynamic Date */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-light text-brand-mist/85">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-normal text-brand-mist/85 hover:text-white transition-colors group py-1"
              aria-label="Return to EntireFM main site"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>EntireFM.com</span>
            </Link>
            <span className="text-white/20">|</span>
            <time className="tracking-wide text-brand-mist font-light">{currentDateStr}</time>
          </div>

          {/* Right: Section Links & Member Access */}
          <div className="flex items-center gap-4 sm:gap-6">
            <nav aria-label="Lobby Section Navigation" className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs sm:text-sm text-brand-mist/85 font-light">
              <Link href="/lobby/ask" className="text-brand-electric hover:text-white transition-colors font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Ask The Lobby
              </Link>
              <Link href="/lobby/today" className="hover:text-white transition-colors">
                What Changed Today
              </Link>
              <Link href="/lobby/opportunities" className="hover:text-white transition-colors">
                Procurement
              </Link>
              <Link href="/lobby/compliance" className="hover:text-white transition-colors">
                Compliance Watch
              </Link>
            </nav>

            <MemberNavControl />
          </div>
        </div>

        {/* ── PRIMARY INTERACTION: THE LOBBY HERO & CONVERSATIONAL COMPOSER ── */}
        <div className="max-w-4xl my-auto py-2 sm:py-4 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[11px] font-normal uppercase tracking-[0.22em] text-brand-electric-bright">
                Grounded FM Intelligence Network
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-[1.05]">
              THE <span className="font-light text-white">LOBBY</span>
            </h1>

            <p className="mt-2 text-base sm:text-lg font-light text-brand-mist/90 max-w-2xl">
              Ask any question about UK building safety, statutory compliance, procurement tenders, or technical standards with sourced citations.
            </p>
          </div>

          {/* ── Conversational Composer ────────────────────────────────────── */}
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="border border-white/20 bg-brand-void/75 backdrop-blur-2xl rounded-sm p-2 sm:p-3 shadow-2xl focus-within:border-brand-electric/80 transition-colors">
              <div className="flex items-start gap-3">
                <Search className="w-5 h-5 text-white/40 mt-3 ml-2 shrink-0" />
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSearchSubmit();
                    }
                  }}
                  rows={2}
                  placeholder="Ask about FM regulations, building safety, contracts, tenders, technical issues, or what is changing..."
                  className="w-full bg-transparent text-white placeholder:text-white/40 text-sm sm:text-base font-light focus:outline-none resize-none py-2 pr-2"
                />
              </div>

              {/* Bottom Composer Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08] px-2">
                {/* Mode Selector */}
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setMode('ask')}
                    className={`px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors ${
                      mode === 'ask'
                        ? 'bg-brand-electric text-white font-medium'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Quick Ask
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('deep_research')}
                    className={`px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                      mode === 'deep_research'
                        ? 'bg-purple-600 text-white font-medium'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-purple-300" />
                    <span>Deep Research</span>
                  </button>
                </div>

                {/* Submit Action */}
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-[10px] font-mono text-white/40">
                    Enter ↵ to submit
                  </span>
                  <button
                    type="submit"
                    disabled={!query.trim()}
                    className="px-5 py-2 bg-white hover:bg-white/90 disabled:opacity-30 text-neutral-950 font-mono text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 font-medium"
                  >
                    <span>{mode === 'deep_research' ? 'Start Research' : 'Ask The Lobby'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Suggested Prompt Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[10px] font-mono uppercase text-white/40 mr-1">Suggested:</span>
              {HERO_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(prompt);
                    handleSearchSubmit(undefined, prompt);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white/80 hover:text-white px-3 py-1 rounded-sm text-xs font-light transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Bottom Bar: Edition Indicator & Scroll Prompt */}
        <div className="border-t border-white/[0.1] pt-4 flex items-center justify-between text-xs text-brand-mist/70">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-electric" />
            <span className="font-mono text-[11px] tracking-wider uppercase text-brand-mist/80">
              Daily Intelligence Edition 2026.35
            </span>
          </div>

          <a
            href="#week-that-matters"
            className="group inline-flex items-center gap-2 text-brand-mist/80 hover:text-white transition-colors"
          >
            <span className="text-xs sm:text-sm font-light">Explore editorial briefings</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/5 group-hover:border-white/50 group-hover:bg-white/15 transition-all animate-bounce">
              <ChevronDown className="w-3.5 h-3.5 text-white" />
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
