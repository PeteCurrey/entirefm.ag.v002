'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import editorial from '@/config/location-images.json';

/**
 * HORIZONTAL RAIL
 * ===============
 * A horizontally scrolling band of image cards.
 *
 * WHY THIS IS A REAL SCROLLER, NOT A HIJACKED PAGE
 * ------------------------------------------------
 * The common version of this pattern pins the section and converts vertical
 * wheel movement into horizontal travel. That breaks the scrollbar, breaks
 * keyboard paging, traps people on touchpads and is unusable on a screen
 * reader. This uses a native overflow container instead: it scrolls with a
 * trackpad swipe, a shift-wheel, arrow keys, a touch drag and the buttons —
 * because all of that is free when the browser does the scrolling.
 *
 * Snap points keep cards aligned; the buttons page by one card and disable
 * themselves at either end.
 */

type EditorialManifest = {
  editorial: Record<string, { src: string; alt: string; widths: Record<string, string> }>;
};

const IMAGES = (editorial as EditorialManifest).editorial ?? {};

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
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const available = items.filter((item) => IMAGES[item.imageKey]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = track;
      setAtStart(scrollLeft < 8);
      setAtEnd(scrollLeft + clientWidth >= scrollWidth - 8);
    };

    update();
    track.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [available.length]);

  const page = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('li');
    const step = card ? card.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  if (!available.length) return null;

  return (
    <section className="on-dark grain relative overflow-hidden bg-brand-void py-20 sm:py-28">
      <div className="facet-rule pointer-events-none absolute inset-0 opacity-40" />

      <div className="container-custom relative">
        <div className="mb-11 flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-reveal>
          <div className="max-w-2xl">
            <p className="eyebrow eyebrow-dark">{eyebrow}</p>
            <h2 className="mt-5 text-display-md text-white">{title}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-mist/60">{intro}</p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => page(-1)}
              disabled={atStart}
              aria-label="Previous"
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-brand-edge-dark text-brand-mist transition-all duration-300 ease-brand hover:border-brand-electric/60 hover:bg-white/[0.05] disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={atEnd}
              aria-label="Next"
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-brand-edge-dark text-brand-mist transition-all duration-300 ease-brand hover:border-brand-electric/60 hover:bg-white/[0.05] disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* The track bleeds to the right edge so the row reads as continuing
          past the viewport rather than stopping at the container. */}
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label={title}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 pl-[max(1.25rem,calc((100vw-80rem)/2+2.5rem))] pr-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {available.map((item, i) => {
          const image = IMAGES[item.imageKey];
          return (
            <li
              key={item.href + item.imageKey}
              className="w-[78vw] shrink-0 snap-start sm:w-[54vw] lg:w-[26rem]"
              data-reveal
              style={{ '--reveal-delay': `${Math.min(i, 4) * 70}ms` } as React.CSSProperties}
            >
              <Link
                href={item.href}
                className="edge-lit group relative flex h-full flex-col overflow-hidden rounded-sm border border-brand-edge-dark bg-brand-carbon"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 54vw, 26rem"
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
    </section>
  );
}
