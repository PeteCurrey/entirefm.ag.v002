'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Search, ChevronDown } from 'lucide-react';

const HERO_PROMPTS = [
  'What changed in building safety today?',
  'Show me London FM tenders closing soon',
  'F-gas rules for commercial chillers',
  'Who won major cleaning contracts this month?',
];

export function LobbyMasthead() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'ask' | 'deep_research'>('ask');

  const handleSearchSubmit = (e?: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const q = (customQ || query).trim();
    if (!q) return;

    router.push(`/lobby/ask?q=${encodeURIComponent(q)}&mode=${mode}`);
  };

  return (
    <header className="relative h-full w-full bg-brand-void text-white overflow-hidden flex flex-col justify-between font-sans">
      {/* ── Background Photography & Atmospheric Overlays ────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/lobby/b54e9629-0e0c-4e27-ae85-7c1be2dff606.png"
          alt="EntireFM corporate headquarters illuminated reception lobby and meeting lounge"
          fill
          priority
          sizes="100vw"
          quality={95}
          className="object-cover object-center transform-gpu"
        />

        {/* Subtle dark gradient overlay allowing background photography to breathe */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-void/90 via-brand-void/40 to-black/40" />
        <div className="absolute inset-0 bg-black/10" />

        {/* Ambient brand glow accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[10%] -top-[20%] h-[36rem] w-[36rem] rounded-full opacity-15 blur-[140px]"
          style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[5%] -bottom-[15%] h-[32rem] w-[32rem] rounded-full opacity-10 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
        />
        <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-15" />
      </div>

      {/* ── Content Container (Full Height Flex Layout with top clearance for LobbyHeader) ── */}
      <div className="container-wide relative z-10 flex flex-col justify-between h-full pt-20 sm:pt-24 lg:pt-28 pb-6 sm:pb-8">

        {/* ── UPPER/MID AREA: THE LOBBY TITLE & INTRO (JUST ABOVE VERTICAL CENTRE) ── */}
        <div className="w-full pt-12 sm:pt-16 lg:pt-24 pb-4 sm:pb-6 my-auto text-left space-y-3">
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="h-px w-6 bg-brand-electric" />
            <span className="text-[10px] sm:text-[11px] font-extralight uppercase tracking-[0.25em] text-brand-electric-bright">
              Grounded FM Intelligence Network
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.02]">
            THE <span className="font-extralight text-white">LOBBY</span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base lg:text-lg font-extralight text-brand-mist/85 leading-relaxed">
            Ask any question about UK building safety, statutory compliance, procurement tenders, or technical standards with sourced citations.
          </p>
        </div>

        {/* ── LOWER AREA: CENTRED WHITE COMPOSER (LOWER THIRD) ────────── */}
        <div className="w-full max-w-3xl mx-auto mt-2 sm:mt-4 mb-2 sm:mb-3 space-y-3 text-left">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white text-neutral-900 border border-neutral-200/90 rounded-[8px] p-4 sm:p-5 shadow-2xl transition-shadow focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
          >
            {/* Input row */}
            <div className="flex items-start gap-3">
              <Search className="w-5 h-5 text-neutral-400 mt-1 shrink-0" />
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
                placeholder="Ask about FM, regulation, contracts, events, technical issues or what's changing..."
                className="w-full bg-transparent text-neutral-900 placeholder:text-black text-base sm:text-lg font-extralight focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Utility Row: Mode indicator & Action Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-neutral-100">
              {/* Mode Selector */}
              <div className="flex items-center gap-4 text-xs font-extralight">
                <button
                  type="button"
                  onClick={() => setMode('ask')}
                  className={`pb-0.5 transition-colors ${
                    mode === 'ask'
                      ? 'text-brand-electric font-light border-b-2 border-brand-electric'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Quick Ask
                </button>
                <button
                  type="button"
                  onClick={() => setMode('deep_research')}
                  className={`pb-0.5 flex items-center gap-1.5 transition-colors ${
                    mode === 'deep_research'
                      ? 'text-purple-700 font-light border-b-2 border-purple-700'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>Deep Research</span>
                </button>
              </div>

              {/* Submit Action */}
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-[10px] font-extralight text-neutral-400">
                  Enter ↵ to submit
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center gap-2"
                  style={{ color: '#000000' }}
                >
                  <span style={{ color: '#000000' }}>{mode === 'deep_research' ? 'Start Research' : 'Ask The Lobby'}</span>
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: '#000000', stroke: '#000000' }} />
                </button>
              </div>
            </div>
          </form>

          {/* Suggested Prompt Chips (Below the Composer) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
            <span className="text-[10px] font-extralight uppercase tracking-widest text-white/50 mr-1">
              Ask about:
            </span>
            {HERO_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(prompt);
                  handleSearchSubmit(undefined, prompt);
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white px-3 py-1.5 rounded-[6px] text-xs font-extralight transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* ── Bottom Bar: Edition Indicator & Scroll Prompt ────────────────── */}
        <div className="border-t border-white/[0.10] pt-4 flex items-center justify-between text-xs text-brand-mist/70 font-extralight">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-electric" />
            <span className="text-[11px] tracking-wider uppercase text-brand-mist/80 font-extralight">
              Daily Intelligence Edition 2026.35
            </span>
          </div>

          <a
            href="#week-that-matters"
            className="group inline-flex items-center gap-2 text-brand-mist/80 hover:text-white transition-colors"
          >
            <span className="text-xs sm:text-sm font-extralight">Explore editorial briefings</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/5 group-hover:border-white/50 group-hover:bg-white/15 transition-all animate-bounce">
              <ChevronDown className="w-3.5 h-3.5 text-white" />
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
