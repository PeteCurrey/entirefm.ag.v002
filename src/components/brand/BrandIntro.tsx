'use client';

import React, { useEffect, useLayoutEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { MarkCanvas } from './MarkCanvas';

/**
 * FIRST-VISIT INTRO
 * =================
 * The mark assembles from scattered fragments, resolves into the real logo
 * artwork, then shrinks and flies into its resting place in the header.
 *
 * FOUR PHASES
 * -----------
 *   playing   fragments converge into the assembled mark (WebGL)
 *   settling  the WebGL render crossfades to the supplied logo file
 *   flying    that logo shrinks and travels to the header, backdrop fades
 *   done      unmounted; the header's own logo takes over
 *
 * WHY IT LANDS ON THE REAL ASSET
 * ------------------------------
 * The WebGL mark is a procedural reconstruction — close, but not the artwork.
 * Crossfading to `/logos/06-crystalline-colour-mark.webp` before the flight
 * means the thing that arrives in the header is the genuine file, with its
 * exact facet colouring and silver edges. The end state cannot drift from the
 * brand asset because it *is* the brand asset.
 *
 * THE FLIGHT
 * ----------
 * A FLIP transform: measure where the logo is, measure the header target,
 * transform between them. The target is found via `[data-brand-mark]` on the
 * header, and the header's own mark stays hidden (`data-intro-running` on the
 * root element) until the flight lands, so only one mark is ever visible.
 *
 * If the header target cannot be found — a page without a header, or a layout
 * change — the flight is skipped and the overlay simply fades. The intro
 * never blocks the page.
 *
 * RULES
 * -----
 *  · Once per session, and never under `prefers-reduced-motion`.
 *  · Always skippable: any click, key, scroll or touch dismisses it.
 *  · The real page is rendered underneath; this is `aria-hidden` throughout,
 *    so crawlers and assistive tech see the page, not the animation.
 *  · The decision to play is made after mount, so it cannot cause a
 *    hydration mismatch.
 */

const SESSION_KEY = 'efm.intro.seen';
const ASSEMBLE_MS = 2600;
// Long enough for the 3D mark to ease to front-on before the artwork fades in.
const SETTLE_ROTATE_MS = 260;
const SETTLE_MS = 620;
const FLY_MS = 900;

type Phase = 'idle' | 'playing' | 'settling' | 'flying' | 'done';

/**
 * useLayoutEffect warns when it runs during server rendering. The overlay is
 * server-rendered by design, so fall back to useEffect there — the layout
 * effect only matters in the browser, where it prevents a visible flash.
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function BrandIntro() {
  // Starts at 'playing' so the overlay is present in the server-rendered
  // HTML. Mounting at 'idle' meant the homepage painted first and the intro
  // appeared over it a moment later — a visible flash of the page underneath.
  const [phase, setPhase] = useState<Phase>('playing');
  const markRef = useRef<HTMLDivElement>(null);
  const [flight, setFlight] = useState<React.CSSProperties>({});

  // React StrictMode invokes effects twice in development. Without this guard
  // the second pass reads the session key it just wrote and short-circuits,
  // while the first pass's cleanup has already torn down shared state.
  const started = useRef(false);

  // useLayoutEffect so a visitor who should not see the intro loses it before
  // the next paint, rather than watching it appear and then vanish.
  useIsomorphicLayoutEffect(() => {
    if (started.current) return;
    started.current = true;

    const skip = () => setPhase('done');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return skip();
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return skip();
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Storage unavailable — play it once and move on.
    }
    // Already 'playing' from the server render; nothing more to do.
  }, []);

  // The header's mark stays hidden for exactly as long as the intro owns one.
  // Driven off `phase` rather than mount/unmount so a double-invoked effect
  // cannot leave the header permanently blank.
  useEffect(() => {
    const active = phase === 'playing' || phase === 'settling' || phase === 'flying';
    if (active) {
      document.documentElement.dataset.introRunning = 'true';
    } else {
      delete document.documentElement.dataset.introRunning;
    }
  }, [phase]);

  /** Begin the wind-down, from wherever we currently are. */
  const dismiss = useCallback(() => {
    setPhase((current) => (current === 'playing' ? 'settling' : current));
  }, []);

  // Phase: playing → hold, then settle. Any interaction cuts it short.
  useEffect(() => {
    if (phase !== 'playing') return;

    const timer = setTimeout(dismiss, ASSEMBLE_MS);
    const events: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, dismiss, { passive: true, once: true }));

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, dismiss));
      document.body.style.overflow = previousOverflow;
    };
  }, [phase, dismiss]);

  // Phase: settling → measure, then fly.
  useEffect(() => {
    if (phase !== 'settling') return;

    const timer = setTimeout(() => {
      const source = markRef.current?.getBoundingClientRect();
      const target = document
        .querySelector('[data-brand-mark]')
        ?.getBoundingClientRect();

      if (source && target && target.width > 0) {
        // The logo image is `contain`ed inside its box, so the visible mark is
        // narrower than the box it sits in. Scaling box-to-box would land it
        // too large; comparing the rendered heights is the closer match.
        const scale = target.height / source.height;
        const dx = target.left + target.width / 2 - (source.left + source.width / 2);
        const dy = target.top + target.height / 2 - (source.top + source.height / 2);
        setFlight({ transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})` });
      }
      setPhase('flying');
    }, SETTLE_MS);

    return () => clearTimeout(timer);
  }, [phase]);

  // Phase: flying → finish and hand over to the header.
  useEffect(() => {
    if (phase !== 'flying') return;
    const timer = setTimeout(() => {
      delete document.documentElement.dataset.introRunning;
      setPhase('done');
    }, FLY_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  // Whatever happens, never leave the page unscrollable.
  useEffect(
    () => () => {
      delete document.documentElement.dataset.introRunning;
      document.body.style.overflow = '';
    },
    []
  );

  // Flight distance is measured from the live layout, so a resize mid-flight
  // would land the mark in the wrong place. Finishing early is better than
  // finishing wrong.
  useEffect(() => {
    if (phase !== 'flying') return;
    const onResize = () => setPhase('done');
    window.addEventListener('resize', onResize, { once: true });
    return () => window.removeEventListener('resize', onResize);
  }, [phase]);

  if (phase === 'idle' || phase === 'done') return null;

  const settling = phase === 'settling' || phase === 'flying';
  const flying = phase === 'flying';

  return (
    <div
      aria-hidden="true"
      className="brand-intro fixed inset-0 z-[200] overflow-hidden"
      style={{ pointerEvents: flying ? 'none' : 'auto' }}
    >
      {/* Backdrop — fades independently so the mark stays visible in flight. */}
      <div
        className="absolute inset-0 bg-brand-graphite transition-opacity ease-brand"
        style={{ opacity: flying ? 0 : 1, transitionDuration: `${FLY_MS * 0.8}ms` }}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 68%)' }}
        />
        <div className="facet-rule pointer-events-none absolute inset-0 opacity-40" />
      </div>

      {/* The mark. Positioned where it starts; the flight is a transform. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          ref={markRef}
          className="relative h-[34vmin] w-[62vmin] max-w-[36rem] will-change-transform"
          style={{
            transition: `transform ${FLY_MS}ms cubic-bezier(0.62, 0.03, 0.28, 1)`,
            ...flight,
          }}
        >
          {/*
            Two states of the same mark. The 3D render eases to front-on first
            (`settle`), then the artwork fades in on top of it — so the shape,
            angle and colour are already identical at the moment of the swap.
          */}
          <div
            className="absolute inset-0 transition-opacity ease-brand"
            style={{
              opacity: settling ? 0 : 1,
              transitionDuration: `${SETTLE_MS - SETTLE_ROTATE_MS}ms`,
              transitionDelay: settling ? `${SETTLE_ROTATE_MS}ms` : '0ms',
            }}
          >
            <MarkCanvas delay={0.15} settle={settling} />
          </div>

          {/* The supplied artwork — what actually lands in the header. */}
          <Image
            src="/logos/06-crystalline-colour-mark.webp"
            alt=""
            fill
            priority
            sizes="36rem"
            className="object-contain transition-opacity ease-brand"
            style={{
              opacity: settling ? 1 : 0,
              transitionDuration: `${SETTLE_MS - SETTLE_ROTATE_MS}ms`,
              transitionDelay: settling ? `${SETTLE_ROTATE_MS}ms` : '0ms',
            }}
          />
        </div>

        {/* Wordmark resolves under the mark, then clears before the flight. */}
        {/*
          `animation-fill-mode: forwards` wins over an inline opacity, so the
          fade-out is a class swap rather than a style override — otherwise the
          wordmark stays on screen through the flight.
        */}
        <div
          className={`absolute top-[calc(50%+20vmin)] text-center ${
            flying ? 'intro-wordmark-out' : 'intro-wordmark'
          }`}
        >
          <p className="text-[clamp(1.4rem,3.6vw,2.25rem)] font-extrabold tracking-[-0.02em] text-white">
            ENTIRE<span className="text-spectrum">FM</span>
          </p>
          <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.34em] text-brand-mist/45">
            Facilities Management. Evolved.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={dismiss}
        tabIndex={-1}
        className="absolute bottom-8 right-8 text-[11px] uppercase tracking-[0.18em] text-brand-mist/35 transition-opacity hover:text-brand-mist/80"
        style={{ opacity: flying ? 0 : 1 }}
      >
        Skip
      </button>

      <style>{`
        /* The overlay ships in the server-rendered HTML, so it must be able to
           remove itself without React: no scripting means nothing would ever
           dismiss it, and reduced motion should never see it at all. */
        @media (scripting: none) {
          .brand-intro { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .brand-intro { display: none; }
        }
        .intro-wordmark {
          opacity: 0;
          animation: introWordmark 800ms cubic-bezier(0.22, 0.61, 0.36, 1) 1400ms forwards;
        }
        .intro-wordmark-out {
          animation: none;
          opacity: 0;
          transition: opacity 260ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        @keyframes introWordmark {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
