'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import editorial from '@/config/location-images.json';

/**
 * SCROLL-DRIVEN HORIZONTAL RAIL
 * =============================
 * The section pins to the viewport and the card track travels sideways as the
 * visitor scrolls down normally. No sideways scrolling, no wheel hijacking.
 *
 * HOW IT WORKS
 * ------------
 * The outer wrapper is made tall — one viewport height plus the horizontal
 * distance the track needs to cover. Inside it, a `position: sticky` panel
 * holds the cards. As the wrapper scrolls through, the fraction of it
 * consumed maps directly to the track's `translateX`.
 *
 * This is not scroll hijacking. Nothing intercepts the wheel, nothing calls
 * `preventDefault`, and the scrollbar stays truthful — the page really is that
 * tall, and scroll position always means what it says. Scroll up and it
 * reverses; flick past it and it behaves; the browser's own scrolling is
 * untouched.
 *
 * ACCESSIBILITY
 * -------------
 * Sticky-translate sections are usually unreachable by keyboard, because
 * focusing an off-screen card does not advance the page scroll. Here, focusing
 * a card scrolls the page to the point where that card is centred, so tabbing
 * moves through the rail exactly as it appears to.
 *
 * FALLBACK
 * --------
 * Under `prefers-reduced-motion`, and on screens below 1024px where a tall
 * pinned section is miserable, the pinning is dropped — but the horizontal
 * layout stays. The row becomes a native scroller with snap points, so it
 * still reads as a rail and still works with a trackpad, arrow keys, a touch
 * drag or a screen reader. Reduced motion should mean less scroll-linked
 * movement, not a different design.
 */

type EditorialManifest = {
  editorial: Record<string, { src: string; alt: string }>;
};

const IMAGES = (editorial as EditorialManifest).editorial ?? {};

/**
 * Where the pinned panel latches. The header is fixed and overlays the page,
 * so sticking at 0 would slide the first row of cards underneath it.
 */
const STICK_OFFSET = 84;

export interface RailItem {
  imageKey: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
}

interface HorizontalRailProps {
  eyebrow: string;
  title: string;
  intro: string;
  items: RailItem[];
}

export function HorizontalRail({ eyebrow, title, intro, items }: HorizontalRailProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [pinned, setPinned] = useState(false);
  const [progress, setProgress] = useState(0);
  const distanceRef = useRef(0);

  const available = items.filter((item) => IMAGES[item.imageKey]);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const decide = () => setPinned(query.matches && !motion.matches);
    decide();
    query.addEventListener('change', decide);
    motion.addEventListener('change', decide);
    return () => {
      query.removeEventListener('change', decide);
      motion.removeEventListener('change', decide);
    };
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    let ticking = false;

    /**
     * How far the track must travel for its last card to reach the right edge,
     * and therefore how tall the wrapper has to be: one panel height plus that
     * distance. The extra height is the scroll budget the sideways movement
     * spends.
     */
    const measure = () => {
      const overflow = Math.max(0, track.scrollWidth - window.innerWidth + 80);
      distanceRef.current = overflow;
      wrapper.style.height = `${window.innerHeight - STICK_OFFSET + overflow}px`;
    };

    const update = () => {
      ticking = false;
      const rect = wrapper.getBoundingClientRect();
      const travel = distanceRef.current;
      if (travel <= 0) return setProgress(0);
      // Progress is measured from the point the sticky panel latches to the
      // top of the viewport, not from the wrapper's own top. Those are the
      // same number only when the panel is full height and starts at zero —
      // which it is not, because it is offset by the header.
      const p = Math.min(1, Math.max(0, (-rect.top + STICK_OFFSET) / travel));
      setProgress(p);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      measure();
      update();
    });
    const observer = new ResizeObserver(() => {
      measure();
      update();
    });
    observer.observe(track);

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
      wrapper.style.height = '';
    };
  }, [pinned, available.length]);

  /**
   * Keyboard reachability: bring the focused card into view by moving the page
   * scroll, since the card's own position is a transform the browser will not
   * scroll to on its own.
   */
  const onCardFocus = (index: number) => {
    if (!pinned) return;
    const wrapper = wrapperRef.current;
    if (!wrapper || distanceRef.current <= 0) return;
    const fraction = available.length > 1 ? index / (available.length - 1) : 0;
    const top = wrapper.offsetTop + distanceRef.current * fraction;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  if (!available.length) return null;

  const cards = (
    <ul
      ref={trackRef}
      className={
        pinned
          ? 'flex gap-6 will-change-transform'
          : 'flex snap-x snap-mandatory gap-6'
      }
      style={
        pinned
          ? { transform: `translate3d(-${(progress * distanceRef.current).toFixed(1)}px, 0, 0)` }
          : undefined
      }
    >
      {available.map((item, i) => {
        const image = IMAGES[item.imageKey];
        return (
          <li
            key={item.href + item.imageKey}
            className={pinned ? 'w-[24rem] shrink-0' : 'w-[80vw] shrink-0 snap-start sm:w-[22rem]'}
            data-reveal={pinned ? undefined : ''}
            style={pinned ? undefined : ({ '--reveal-delay': `${(i % 3) * 80}ms` } as React.CSSProperties)}
          >
            <Link
              href={item.href}
              onFocus={() => onCardFocus(i)}
              className="edge-lit group relative flex h-full flex-col overflow-hidden rounded-sm border border-brand-edge-dark bg-brand-carbon"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 24rem"
                  className="object-cover transition-transform duration-[900ms] ease-brand group-hover:scale-[1.06]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-brand-carbon via-brand-carbon/25 to-transparent"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="eyebrow eyebrow-dark">{item.eyebrow}</p>
                <h3 className="mt-4 text-[1.0625rem] font-semibold leading-snug tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-brand-mist/60">
                  {item.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 border-t border-brand-edge-dark pt-4 text-[12.5px] font-semibold text-brand-electric-bright">
                  Explore
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const heading = (
    <div className="mb-10 max-w-2xl" data-reveal>
      <p className="eyebrow eyebrow-dark">{eyebrow}</p>
      <h2 className="mt-5 text-display-md text-white">{title}</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-brand-mist/60">{intro}</p>
    </div>
  );

  // Fallback: no pinning, but still a horizontal rail — scrolled natively.
  if (!pinned) {
    return (
      <section className="on-dark grain relative overflow-hidden bg-brand-void py-20 sm:py-28">
        <div className="facet-rule pointer-events-none absolute inset-0 opacity-40" />
        <div className="container-wide relative">{heading}</div>
        <div className="relative overflow-x-auto pb-4 pl-[max(1.25rem,calc((100vw-88rem)/2+2.5rem))] pr-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cards}
        </div>
      </section>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      {/* The pinned panel. `top` and the height below must both agree with
          STICK_OFFSET — the measurement uses it to work out how much scroll
          budget the sideways travel gets, and if the CSS latches somewhere
          else the track finishes early and the section keeps scrolling while
          the cards have already stopped. */}
      <section
        className="on-dark grain sticky flex flex-col justify-center overflow-hidden bg-brand-void"
        style={{ top: `${STICK_OFFSET}px`, height: `calc(100vh - ${STICK_OFFSET}px)` }}
      >
        <div className="facet-rule pointer-events-none absolute inset-0 opacity-40" />

        <div className="container-wide relative">{heading}</div>

        {/* The track starts at the container's left edge and bleeds right, so
            the row reads as continuing past the viewport. */}
        <div className="relative overflow-hidden pl-[max(1.25rem,calc((100vw-88rem)/2+2.5rem))] pr-10">
          {cards}
        </div>

        {/* Progress rail — the only affordance that says this section moves. */}
        <div className="container-wide relative mt-10">
          <div className="h-px w-full max-w-md overflow-hidden bg-white/10">
            <div
              className="h-full origin-left bg-brand-spectrum transition-transform duration-150 ease-out"
              style={{ transform: `scaleX(${Math.max(0.04, progress)})` }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
