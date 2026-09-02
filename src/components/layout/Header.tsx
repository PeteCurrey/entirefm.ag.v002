'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { BrandMark } from '@/components/brand/BrandMark';
import { MarkAssembly } from '@/components/brand/MarkAssembly';
import { ExploreNavigation } from '@/components/layout/ExploreNavigation';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  /** Opt out of the overlay: for pages with no full-bleed hero beneath. */
  solid?: boolean;
  /** When transparent (before scroll), render dark text/elements for light page backgrounds. Upon scroll, reverts to standard dark header. */
  lightOnTransparent?: boolean;
}

/**
 * SITE HEADER — v2 (Minimal Premium)
 * ====================================
 * Persistent header reduced to: Logo | Explore | Search | Login
 *
 * Navigation depth moves entirely into the full-screen Explore overlay
 * (ExploreNavigation) so the persistent bar remains architectural and clean.
 *
 * Behaviour:
 *  · Fixed, transparent over hero images; graphite + blur once scrolled.
 *  · `solid` prop opts a page out of overlay mode (used on pages without
 *    a full-bleed hero beneath the header).
 *  · `lightOnTransparent` prop renders dark text/elements on light transparent backgrounds,
 *    reverting to dark graphite + white text once scrolled.
 *  · Explore, Search, and Login each have distinct, accessible controls.
 *  · Escape closes whichever overlay is open.
 *  · Body scroll is locked while either overlay is active.
 *  · The brand mark assembles on first load via MarkAssembly.
 *  · Cmd+K / Ctrl+K opens Search globally.
 */

export function Header({ solid = false, lightOnTransparent = false }: HeaderProps) {
  const pathname = usePathname();
  const [exploreOpen, setExploreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const markRef = useRef<HTMLSpanElement>(null);
  const [assembled, setAssembled] = useState(true);
  const [assembling, setAssembling] = useState(false);

  // Brand mark animation — only on first session page
  useEffect(() => {
    setAssembled(false);
    setAssembling(true);
  }, []);

  const onLanded = useCallback(() => {
    setAssembled(true);
    setAssembling(false);
  }, []);

  // Scroll detection for header solidification
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Route change closes everything
  useEffect(() => {
    setExploreOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Global Cmd+K shortcut for search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setExploreOpen(false);
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const opaque = solid || scrolled || exploreOpen;
  const isLight = lightOnTransparent && !opaque;

  return (
    <>
      <header
        className={`z-50 transition-all duration-500 ease-brand ${
          solid ? 'sticky top-0' : 'fixed inset-x-0 top-0'
        } ${isLight ? '' : 'on-dark'} ${
          opaque
            ? 'border-b border-brand-edge-dark bg-brand-graphite/95 shadow-elevated backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        {/* Gradient scrim — improves legibility over bright hero photography */}
        {!opaque && !lightOnTransparent && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'linear-gradient(to bottom, rgba(11,18,32,.72) 0%, rgba(11,18,32,.34) 58%, transparent 100%)',
            }}
          />
        )}

        <div className="container-wide">
          <div className="flex h-[72px] items-center justify-between">
            {/* ── Brand mark + wordmark ─────────────────────────────── */}
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-3"
              aria-label="EntireFM — home"
            >
              <span
                ref={markRef}
                data-brand-mark
                className={`brand-mark relative block w-11 transition-all duration-500 ease-brand group-hover:scale-105 ${
                  isLight ? 'text-slate-800' : 'text-brand-mist/55'
                }`}
              >
                <BrandMark state={assembled ? 'solid' : 'wire'} className="block w-full" />
              </span>
              <span className="flex flex-col leading-none">
                <span
                  className={`text-[19px] font-extralight tracking-[0.08em] transition-colors duration-300 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Entire<span className="font-bold text-hero-pink">FM</span>
                </span>
                <span
                  className={`mt-1 hidden text-[9px] font-medium tracking-[0.18em] transition-colors duration-300 2xl:block ${
                    isLight ? 'text-slate-600' : 'text-brand-mist/45'
                  }`}
                >
                  Facilities Management. Evolved.
                </span>
              </span>
            </Link>

            {/* ── Actions: Explore · Search · The Lobby · Login ─────────── */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Explore */}
              <button
                type="button"
                aria-expanded={exploreOpen}
                aria-controls="explore-navigation"
                aria-label={exploreOpen ? 'Close navigation' : 'Explore site navigation'}
                onClick={() => {
                  setSearchOpen(false);
                  setExploreOpen((v) => !v);
                }}
                className={`group flex items-center gap-2 rounded-sm px-3 sm:px-4 py-2 text-xs sm:text-sm font-light tracking-wide transition-all duration-300 ease-brand ${
                  exploreOpen
                    ? 'bg-white/[0.08] text-white border border-white/20'
                    : isLight
                    ? 'text-slate-800 hover:text-black border border-transparent hover:border-slate-300 hover:bg-slate-900/5'
                    : 'text-brand-mist/80 hover:text-white border border-transparent hover:border-white/15 hover:bg-white/[0.04]'
                }`}
              >
                <span>Explore</span>
                {/* Animated lines / X icon */}
                <span className="flex flex-col justify-center gap-[4px] w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true">
                  <span
                    className={`block h-px rounded-full bg-current transition-all duration-300 ease-brand ${
                      exploreOpen ? 'translate-y-[4.5px] sm:translate-y-[5px] rotate-45' : ''
                    }`}
                  />
                  <span
                    className={`block h-px rounded-full bg-current transition-all duration-300 ease-brand ${
                      exploreOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`block h-px rounded-full bg-current transition-all duration-300 ease-brand ${
                      exploreOpen ? '-translate-y-[4.5px] sm:-translate-y-[5px] -rotate-45' : ''
                    }`}
                  />
                </span>
              </button>

              {/* Search */}
              <button
                type="button"
                aria-label="Open site search"
                onClick={() => {
                  setExploreOpen(false);
                  setSearchOpen(true);
                }}
                className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-sm transition-all duration-200 ${
                  isLight
                    ? 'border border-slate-300 text-slate-800 hover:border-slate-600 hover:text-black hover:bg-slate-900/5'
                    : 'border border-white/12 text-brand-mist/70 hover:border-white/30 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              {/* The Lobby Primary Editorial Destination */}
              <Link
                href="/lobby"
                className={`inline-flex items-center justify-center rounded-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-light tracking-wide transition-all duration-300 ease-brand ${
                  pathname?.startsWith('/lobby')
                    ? 'border border-brand-electric/80 bg-brand-electric/25 text-white shadow-glow'
                    : isLight
                    ? 'border border-slate-300 bg-white text-slate-800 hover:text-black hover:border-slate-400 hover:bg-slate-50'
                    : 'border border-white/15 bg-white/[0.05] text-brand-mist/90 hover:text-white hover:border-brand-electric/60 hover:bg-brand-electric/15'
                }`}
                aria-label="The Lobby — Facilities Management Intelligence & Briefing Room"
              >
                The Lobby
              </Link>

              {/* Login */}
              <Link
                href="/login"
                className={`inline-flex items-center justify-center rounded-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-light transition-all duration-300 ease-brand ${
                  isLight
                    ? 'border border-brand-electric/60 bg-brand-electric/10 text-brand-electric font-medium hover:border-brand-electric hover:bg-brand-electric hover:text-white'
                    : 'border border-brand-electric/40 bg-brand-electric/10 text-brand-electric-bright hover:border-brand-electric/70 hover:bg-brand-electric/20 hover:text-white'
                }`}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Full-screen Explore overlay ───────────────────────── */}
      <ExploreNavigation
        open={exploreOpen}
        onClose={() => setExploreOpen(false)}
      />

      {/* ── Global search modal ───────────────────────────────── */}
      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* ── Brand mark assembly (first load only) ─────────────── */}
      {assembling && <MarkAssembly target={markRef} onLanded={onLanded} />}
    </>
  );
}
