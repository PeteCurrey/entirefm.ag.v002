'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { MarkCanvas } from './MarkCanvas';

/**
 * FIRST-VISIT INTRO
 * =================
 * A short overlay in which the mark assembles from scattered fragments, the
 * wordmark resolves beneath it, and the panel lifts away to reveal the page.
 *
 * RULES IT FOLLOWS
 * ----------------
 *  · Once per session. Returning to the homepage mid-visit does not replay it —
 *    an intro you cannot get past is a nuisance, not a brand moment.
 *  · Always skippable. Any click, key or scroll dismisses it immediately, and
 *    there is a visible Skip control.
 *  · Never blocks the page. The real content is rendered and in the DOM
 *    underneath; this sits on top and is `aria-hidden`, so assistive tech and
 *    crawlers see the page, not the animation.
 *  · Honours `prefers-reduced-motion` by not mounting at all.
 *  · Never runs on a fresh server render, so it cannot cause a hydration
 *    mismatch — the decision to show it is made after mount.
 */

const SESSION_KEY = 'efm.intro.seen';
const HOLD_MS = 3100;
const LIFT_MS = 700;

export function BrandIntro() {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'lifting'>('idle');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Private mode or storage disabled — play it once and move on.
    }
    setPhase('playing');
  }, []);

  const dismiss = useCallback(() => {
    setPhase((current) => (current === 'playing' ? 'lifting' : current));
  }, []);

  // Auto-advance, and let anything the visitor does cut it short.
  useEffect(() => {
    if (phase !== 'playing') return;

    const timer = setTimeout(dismiss, HOLD_MS);
    const events: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, dismiss, { passive: true, once: true }));

    // The page must not scroll behind a full-screen overlay.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, dismiss));
      document.body.style.overflow = previousOverflow;
    };
  }, [phase, dismiss]);

  useEffect(() => {
    if (phase !== 'lifting') return;
    const timer = setTimeout(() => setPhase('idle'), LIFT_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === 'idle') return null;

  const lifting = phase === 'lifting';

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-brand-graphite transition-all ease-brand ${
        lifting ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${LIFT_MS}ms` }}
    >
      {/* Ambient pools, matching the hero so the transition feels continuous. */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 68%)' }}
      />
      <div className="facet-rule pointer-events-none absolute inset-0 opacity-40" />

      <div
        className={`relative h-[42vmin] w-[76vmin] max-w-[44rem] transition-transform ease-brand ${
          lifting ? 'scale-[1.06]' : 'scale-100'
        }`}
        style={{ transitionDuration: `${LIFT_MS}ms` }}
      >
        <MarkCanvas delay={0.15} />
      </div>

      {/* Wordmark resolves after the fragments have mostly landed. */}
      <div className="intro-wordmark relative mt-8 text-center">
        <p className="text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold tracking-[-0.02em] text-white">
          ENTIRE<span className="text-spectrum">FM</span>
        </p>
        <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.34em] text-brand-mist/45">
          Facilities Management. Evolved.
        </p>
      </div>

      <button
        type="button"
        onClick={dismiss}
        tabIndex={-1}
        className="absolute bottom-8 right-8 text-[11px] uppercase tracking-[0.18em] text-brand-mist/35 transition-colors hover:text-brand-mist/80"
      >
        Skip
      </button>

      <style>{`
        .intro-wordmark {
          opacity: 0;
          transform: translateY(10px);
          animation: introWordmark 900ms cubic-bezier(0.22, 0.61, 0.36, 1) 1500ms forwards;
        }
        @keyframes introWordmark {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
