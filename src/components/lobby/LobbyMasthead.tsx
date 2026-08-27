'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Radio, Sparkles, BookOpen, Clock } from 'lucide-react';

export function LobbyMasthead() {
  const [currentDateStr, setCurrentDateStr] = useState<string>('Thursday, 27 August 2026');

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

  return (
    <header className="relative border-b border-brand-edge-dark bg-brand-void pt-28 pb-12 sm:pt-32 sm:pb-16 text-white overflow-hidden">
      {/* Subtle ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[15%] -top-[30%] h-[38rem] w-[38rem] rounded-full opacity-20 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[5%] -bottom-[40%] h-[30rem] w-[30rem] rounded-full opacity-15 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
      />
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-40" />

      <div className="container-wide relative z-10">
        {/* Top Intelligence Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4 mb-8 sm:mb-12">
          {/* Signal Indicator & Date */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-[13px] font-light text-brand-mist/70">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-normal text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Intelligence Desk Active
            </span>
            <span className="text-white/20">|</span>
            <time className="tracking-wide text-brand-mist/90 font-light">{currentDateStr}</time>
          </div>

          {/* Quick jump anchor links */}
          <nav aria-label="Lobby Quick Navigation" className="hidden md:flex items-center gap-5 text-xs text-brand-mist/60 font-light">
            <a href="#week-that-matters" className="hover:text-white transition-colors">
              The Week That Matters
            </a>
            <a href="#compliance-watch" className="hover:text-white transition-colors">
              Compliance Watch
            </a>
            <a href="#engineers-note" className="hover:text-white transition-colors">
              Engineer’s Note
            </a>
            <a href="#toolkit" className="hover:text-white transition-colors">
              Toolkit
            </a>
            <a href="#lobby-question" className="hover:text-white transition-colors">
              Weekly Question
            </a>
          </nav>
        </div>

        {/* Masthead Identity & Lead Grid */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] items-end gap-8 lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[11px] font-normal uppercase tracking-[0.22em] text-brand-electric-bright">
                The Briefing Room for Facilities Professionals
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-[1.04]">
              THE <span className="font-light text-white">LOBBY</span>
            </h1>

            <p className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg lg:text-xl font-light text-brand-mist/80 leading-relaxed text-pretty">
              Good morning. Here is what has changed in UK building safety, engineering compliance, and operational facilities management today.
            </p>
          </div>

          {/* Proposition Card: Know / Understand / Get */}
          <div className="border border-white/10 bg-white/[0.03] backdrop-blur-md rounded-sm p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="text-[10.5px] font-normal uppercase tracking-[0.18em] text-brand-mist/50">
                Editorial Premise
              </span>
              <span className="text-[11px] font-light text-brand-mist/40">Edition 2026.35</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-electric/15 text-[11px] font-normal text-brand-electric-bright border border-brand-electric/30">
                  01
                </span>
                <p className="text-sm font-light text-brand-mist/90 leading-snug">
                  <strong className="font-normal text-white">Know what’s changed:</strong> Prioritised regulatory shifts, not news aggregation.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-[11px] font-normal text-purple-300 border border-purple-500/30">
                  02
                </span>
                <p className="text-sm font-light text-brand-mist/90 leading-snug">
                  <strong className="font-normal text-white">Understand what matters:</strong> Real engineering analysis and duty holder impact.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[11px] font-normal text-emerald-300 border border-emerald-500/30">
                  03
                </span>
                <p className="text-sm font-light text-brand-mist/90 leading-snug">
                  <strong className="font-normal text-white">Get something useful:</strong> Calculators, checklists, and verified tools every visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
