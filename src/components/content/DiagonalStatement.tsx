'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import editorial from '@/config/location-images.json';

/**
 * DIAGONAL STATEMENT
 * ==================
 * Two photographs meeting on a single hard diagonal, with the positioning
 * statement laid over them.
 *
 * WHERE IT COMES FROM
 * -------------------
 * The Wix Studio estate opened its "Your Space, Our Expertise" section with a
 * steep diagonal cut across a full-bleed image, and it was the most confident
 * piece of art direction on either legacy site. This rebuilds it properly:
 * one seam, two images, and the headline that both legacy estates and the
 * current site all share.
 *
 * WHY THE DIAGONAL EARNS ITS PLACE
 * --------------------------------
 * It is not a decorative slash. The headline is a two-part sentence — your
 * space, our expertise — and the seam is what separates the two subjects: the
 * client's building on one side, the engineering that keeps it running on the
 * other, each labelled against its own photograph. A diagonal that divides two
 * ideas is composition; a diagonal laid over one image is a filter.
 *
 * The angle is taken from the mark. The brand geometry is isometric — 60°
 * facets, echoed in the `.facet-rule` hairlines — and the seam is set to land
 * close to that at desktop widths rather than at whatever angle happened to
 * look right. It is defined in percentages, so it steepens on narrow screens,
 * which is the correct behaviour: a shallow diagonal on a phone would cut the
 * headline in half.
 *
 * MOTION
 * ------
 * The seam drifts a few percent as the section crosses the viewport, so the
 * two images shear against each other. Small enough to register as depth
 * rather than as an effect, and dropped entirely under reduced motion, where
 * the seam simply sits at its rest position.
 */

type EditorialManifest = {
  editorial: Record<string, { src: string; alt: string }>;
};

const IMAGES = (editorial as EditorialManifest).editorial ?? {};

/** Rest position of the seam, as a percentage of width at top and bottom. */
const SEAM_TOP = 63;
const SEAM_BOTTOM = 37;
/** How far the seam travels across the whole scroll pass, in percent. */
const DRIFT = 4.5;

interface DiagonalStatementProps {
  eyebrow?: string;
  title: string;
  /** Rendered in the accent colour, after `title`. */
  titleAccent?: string;
  body: string;
  leftLabel: string;
  rightLabel: string;
  leftImageKey: string;
  rightImageKey: string;
  points?: string[];
  href?: string;
  cta?: string;
}

export function DiagonalStatement({
  eyebrow,
  title,
  titleAccent,
  body,
  leftLabel,
  rightLabel,
  leftImageKey,
  rightImageKey,
  points = [],
  href = '/services',
  cta = 'What we do',
}: DiagonalStatementProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [drift, setDrift] = useState(0);

  const left = IMAGES[leftImageKey];
  const right = IMAGES[rightImageKey];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    if (!section) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      // −1 when the section is entirely below the fold, +1 when entirely
      // above it, 0 when centred. Keeps the seam still while it is being read.
      const centre = rect.top + rect.height / 2;
      const progress = (window.innerHeight / 2 - centre) / (window.innerHeight / 2 + rect.height / 2);
      setDrift(Math.max(-1, Math.min(1, progress)) * DRIFT);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!left || !right) return null;

  const top = SEAM_TOP + drift;
  const bottom = SEAM_BOTTOM + drift;
  // The right image is clipped to everything on its side of the seam; the
  // left image is simply the layer underneath, so the two can never disagree
  // about where the edge is.
  const clip = `polygon(${top}% 0, 100% 0, 100% 100%, ${bottom}% 100%)`;

  return (
    <section
      ref={sectionRef}
      className="on-dark relative isolate w-full overflow-hidden bg-brand-void"
    >
      <div className="relative min-h-[46rem] w-full lg:min-h-[54rem]">
        {/* Left plate — the client's building. */}
        <div className="absolute inset-0 -z-20">
          <Image src={left.src} alt={left.alt} fill sizes="100vw" className="object-cover object-center" />
        </div>

        {/* Right plate — the engineering. Clipped to the seam. */}
        <div className="absolute inset-0 -z-20" style={{ clipPath: clip }}>
          <Image
            src={right.src}
            alt={right.alt}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* The seam itself, drawn as a spectrum hairline so the cut reads as
            deliberate rather than as a clipping artefact. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background: 'var(--spectrum)',
            clipPath: `polygon(${top}% 0, calc(${top}% + 2px) 0, calc(${bottom}% + 2px) 100%, ${bottom}% 100%)`,
            opacity: 0.9,
          }}
        />

        {/* Legibility. Heavier on the copy side, and lifted off the far edge so
            the right-hand photograph keeps its detail. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(96deg, rgba(6,10,20,.93) 0%, rgba(6,10,20,.76) 32%, rgba(6,10,20,.44) 58%, rgba(6,10,20,.30) 100%)',
          }}
        />
        <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-30" />

        {/* Plate labels — each sits over its own photograph, on its own side of
            the seam, so the diagonal is doing the dividing. */}
        <p className="pointer-events-none absolute left-[4%] top-[8%] text-[10.5px] uppercase tracking-[0.28em] text-brand-mist/70">
          {leftLabel}
        </p>
        <p className="pointer-events-none absolute right-[4%] bottom-[8%] text-right text-[10.5px] uppercase tracking-[0.28em] text-brand-mist/70">
          {rightLabel}
        </p>

        <div className="container-wide relative flex min-h-[46rem] items-center py-24 lg:min-h-[54rem]">
          <div className="max-w-xl">
            {eyebrow && (
              <p className="eyebrow eyebrow-dark" data-reveal>
                {eyebrow}
              </p>
            )}

            <h2
              className="mt-6 text-display-lg text-white"
              data-reveal
              style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
            >
              {title}
              {titleAccent && (
                <>
                  {' '}
                  <span className="text-spectrum">{titleAccent}</span>
                </>
              )}
            </h2>

            <p
              className="mt-7 text-[1.0625rem] leading-relaxed text-brand-mist/80"
              data-reveal
              style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
            >
              {body}
            </p>

            {points.length > 0 && (
              <ul
                className="mt-9 space-y-3 border-l border-white/12 pl-6"
                data-reveal
                style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
              >
                {points.map((point) => (
                  <li key={point} className="text-[14px] leading-relaxed text-brand-mist/70">
                    {point}
                  </li>
                ))}
              </ul>
            )}

            <div
              className="mt-10"
              data-reveal
              style={{ '--reveal-delay': '320ms' } as React.CSSProperties}
            >
              <Link href={href} className="btn-primary">
                {cta}
                <ArrowRight className="btn-arrow h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
