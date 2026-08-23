'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { buildMarkPlates, MARK_BOUNDS } from '@/lib/brand/mark-geometry';

/**
 * ARRIVAL ANIMATION — FRAGMENTS FLY INTO THE HEADER
 * =================================================
 * The mark's plates are scattered across the viewport, then converge and lock
 * into the header logo, which is sitting there as a wireframe waiting for
 * them.
 *
 * WHY THIS REPLACED THE FULL-SCREEN INTRO
 * ---------------------------------------
 * The previous version was a full-screen overlay that assembled the mark,
 * then flew it up to the header. It looked good and it was the wrong idea: it
 * held the page hostage for two and a half seconds before anyone could see
 * what the site was, needed a Skip control, locked body scroll, and had to be
 * server-rendered to avoid a flash of the homepage behind it.
 *
 * This version costs the visitor nothing. The page is fully visible and fully
 * usable from the first paint. The animation happens in the corner, over the
 * top of a header that is already there and already legible. If it never
 * plays — reduced motion, no JavaScript, second page of the session — the
 * header simply shows the finished mark, and nothing is missing.
 *
 * HOW THE MAPPING WORKS
 * ---------------------
 * One fixed SVG covers the viewport in CSS pixel coordinates. A single group
 * transform maps the mark's model space onto the measured header rect, so
 * every plate can be positioned in model units and still land pixel-accurate
 * on the header logo, whatever size or position that logo happens to be.
 *
 * The flight itself is a per-plate CSS transform with a staggered delay. No
 * animation loop, no per-frame work — the compositor runs the whole thing.
 *
 * FAILURE IS QUIET
 * ----------------
 * If the header mark cannot be measured, or the window resizes mid-flight
 * (which would invalidate the mapping and land the plates in the wrong
 * place), the animation ends immediately and the header goes solid. There is
 * no state in which the visitor is left looking at a wireframe.
 */

const SESSION_KEY = 'efm.mark.assembled';
const PLATES = buildMarkPlates();
const VIEW_WIDTH = MARK_BOUNDS.maxX - MARK_BOUNDS.minX;

/** Flight time for a single plate. */
const FLY_MS = 1150;
/** Gap between consecutive plates setting off. */
const STAGGER_MS = 26;
/** Beat before the first plate moves, so the wireframe is seen first. */
const LEAD_IN_MS = 260;

const TOTAL_MS = LEAD_IN_MS + FLY_MS + PLATES.length * STAGGER_MS + 120;

/**
 * Deterministic scatter. A seeded hash rather than Math.random so the same
 * plate always arrives from the same direction — the animation has a shape
 * you can recognise on a second visit, instead of being different noise
 * every time.
 */
function scatter(index: number) {
  const rand = (salt: number) => {
    const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  // Biased towards arriving from below and from the sides, because the header
  // is at the top: fragments should look like they came off the page.
  const angle = Math.PI * (0.08 + rand(1) * 0.84);
  const distance = 20 + rand(2) * 40;
  return {
    ox: Math.cos(angle) * distance * 1.6,
    oy: -Math.sin(angle) * distance,
    rotate: (rand(3) - 0.5) * 200,
    // Fragments START LARGER and shrink into place. The first attempt had them
    // starting smaller, which is the intuitive reading of "flying in from a
    // distance" and was invisible in practice: a plate is about four pixels
    // across once it has landed, so anything below full size sets off as a
    // sub-pixel speck and the whole animation reads as faint dust. Coming in
    // oversized also carries the right idea — these are pieces of something
    // big that resolve down into a small mark.
    scale: 2.8 + rand(4) * 3.4,
  };
}

interface MarkAssemblyProps {
  /** The header's mark element — measured to work out where to land. */
  target: React.RefObject<HTMLElement | null>;
  /** Called when the plates have landed, or when the animation is skipped. */
  onLanded: () => void;
}

export function MarkAssembly({ target, onLanded }: MarkAssemblyProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [flying, setFlying] = useState(false);

  useEffect(() => {
    const skip = () => onLanded();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return skip();
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return skip();
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // No storage — play it and move on.
    }

    const measured = target.current?.getBoundingClientRect();
    if (!measured || measured.width === 0) return skip();
    setRect(measured);

    // Two frames: one to commit the scattered start positions, one to flip to
    // the resting transform so the browser has something to transition from.
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setFlying(true)));
    const done = setTimeout(onLanded, TOTAL_MS);

    // A resize invalidates the mapping. Finishing early beats finishing in the
    // wrong place.
    const onResize = () => onLanded();
    window.addEventListener('resize', onResize, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
      window.removeEventListener('resize', onResize);
    };
  }, [target, onLanded]);

  if (!rect || typeof document === 'undefined') return null;

  // Model space → viewport pixels. The mark is laid out around the origin, so
  // the centre of the header rect is the origin, and one model unit is the
  // rect's width divided by the mark's own width. The negative y flips the
  // model's upward axis to SVG's downward one.
  const scale = rect.width / VIEW_WIDTH;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  return createPortal(
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
      style={{ contain: 'strict' }}
    >
      <g transform={`translate(${cx} ${cy}) scale(${scale} ${-scale})`}>
        {PLATES.map((plate) => {
          const { ox, oy, rotate, scale: k } = scatter(plate.index);
          const [px, py] = plate.centroid;
          const rest = `translate(${px}px, ${py}px) translate(${-px}px, ${-py}px)`;
          const start =
            `translate(${px + ox}px, ${py + oy}px) rotate(${rotate}deg) ` +
            `scale(${k}) translate(${-px}px, ${-py}px)`;

          return (
            <polygon
              key={plate.index}
              points={plate.points.map(([x, y]) => `${x},${y}`).join(' ')}
              fill={plate.fill}
              style={{
                transform: flying ? rest : start,
                opacity: flying ? 1 : 0,
                transition:
                  `transform ${FLY_MS}ms cubic-bezier(0.16, 0.84, 0.3, 1) ` +
                  `${LEAD_IN_MS + plate.index * STAGGER_MS}ms, ` +
                  `opacity 240ms ease-out ${LEAD_IN_MS + plate.index * STAGGER_MS}ms`,
              }}
            />
          );
        })}
      </g>
    </svg>,
    document.body
  );
}
