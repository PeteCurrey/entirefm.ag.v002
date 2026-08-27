'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { MemberNavControl } from '@/components/member/MemberNavControl';

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

        {/* Multi-layer gradient scrims for maximum legibility and depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-void via-brand-void/60 to-brand-void/75" />
        <div className="absolute inset-0 bg-brand-void/40 mix-blend-multiply" />

        {/* Ambient brand glow accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[10%] -top-[20%] h-[36rem] w-[36rem] rounded-full opacity-30 blur-[140px]"
          style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[5%] -bottom-[15%] h-[32rem] w-[32rem] rounded-full opacity-25 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
        />
        <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-20" />
      </div>

      {/* ── Content Container (Full Height Layout) ────────────────────── */}
      <div className="container-wide relative z-10 flex flex-col justify-between h-full pt-24 sm:pt-28 lg:pt-32 pb-6 sm:pb-8">
        {/* Top Intelligence Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.12] pb-4 mb-6 sm:mb-8">
          {/* Signal Indicator & Date */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-[13px] font-light text-brand-mist/80">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-normal text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Intelligence Desk Active
            </span>
            <span className="text-white/25">|</span>
            <time className="tracking-wide text-brand-mist font-light">{currentDateStr}</time>
          </div>

          {/* Quick Navigation & Member Control */}
          <div className="flex items-center gap-4">
            <nav aria-label="Lobby Quick Navigation" className="hidden lg:flex items-center gap-5 text-xs text-brand-mist/70 font-light mr-2">
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
            </nav>

            <MemberNavControl />
          </div>
        </div>

        {/* Masthead Identity & Editorial Premise Grid */}
        <div className="grid lg:grid-cols-[1.35fr_1fr] items-center gap-8 lg:gap-14 my-auto py-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[11px] font-normal uppercase tracking-[0.22em] text-brand-electric-bright">
                The Briefing Room for Facilities Professionals
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extralight tracking-tight text-white leading-[1.02]">
              THE <span className="font-light text-white">LOBBY</span>
            </h1>

            <p className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg lg:text-xl font-light text-brand-mist/90 leading-relaxed text-pretty">
              Good morning. Here is what has changed in UK building safety, engineering compliance, and operational facilities management today.
            </p>
          </div>

          {/* Proposition Card: Know / Understand / Get */}
          <div className="border border-white/15 bg-brand-void/60 backdrop-blur-xl rounded-sm p-6 sm:p-7 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.1] pb-3">
              <span className="text-[10.5px] font-normal uppercase tracking-[0.18em] text-brand-mist/60">
                Editorial Premise
              </span>
              <span className="text-[11px] font-light text-brand-mist/50">Edition 2026.35</span>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-electric/20 text-[11px] font-normal text-brand-electric-bright border border-brand-electric/40">
                  01
                </span>
                <p className="text-sm font-light text-brand-mist/95 leading-snug">
                  <strong className="font-normal text-white">Know what’s changed:</strong> Prioritised regulatory shifts, not news aggregation.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-[11px] font-normal text-purple-300 border border-purple-500/40">
                  02
                </span>
                <p className="text-sm font-light text-brand-mist/95 leading-snug">
                  <strong className="font-normal text-white">Understand what matters:</strong> Real engineering analysis and duty holder impact.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] font-normal text-emerald-300 border border-emerald-500/40">
                  03
                </span>
                <p className="text-sm font-light text-brand-mist/95 leading-snug">
                  <strong className="font-normal text-white">Get something useful:</strong> Calculators, checklists, and verified tools every visit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Live Desk Ticker & Scroll Prompt */}
        <div className="border-t border-white/[0.1] pt-4 flex items-center justify-between text-xs text-brand-mist/70">
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-electric animate-ping" />
            <span className="font-mono text-[11px] tracking-wider uppercase text-brand-mist/80">
              Daily Intelligence Stream
            </span>
          </div>

          <a
            href="#week-that-matters"
            className="group inline-flex items-center gap-2 text-brand-mist/80 hover:text-white transition-colors"
          >
            <span className="text-[12px] font-light">Scroll to explore briefings</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/5 group-hover:border-white/50 group-hover:bg-white/15 transition-all animate-bounce">
              <ChevronDown className="w-3.5 h-3.5 text-white" />
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
