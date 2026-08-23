'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone, ArrowDown } from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import editorial from '@/config/location-images.json';

/**
 * PAGE HERO — FULL VIEWPORT, IMAGE BACKED
 * =======================================
 * The standard opening for every main page: service, sector, location, hub and
 * company. Full-height photographic background, breadcrumbs, headline, intro
 * and the two primary actions.
 *
 * IMAGE SELECTION
 * ---------------
 * `imageSrc` wins if given — location pages pass their own city photography.
 * Otherwise a deterministic editorial image is picked from the page path, so a
 * given page always shows the same background rather than shuffling between
 * builds, and neighbouring pages do not all land on the same frame.
 *
 * There is no generic fallback image on purpose. If no photography resolves,
 * the hero renders on the graphite ground with the facet field — which is a
 * deliberate brand surface, not a broken image.
 */

type EditorialManifest = {
  editorial: Record<string, { src: string; alt: string }>;
};

const IMAGES = (editorial as EditorialManifest).editorial ?? {};

/** Editorial frames suitable as a page backdrop — wide, dark, uncluttered. */
const BACKDROPS = [
  'rooftop-plant-night',
  'switchgear-inspection',
  'switchroom-survey',
  'site-arrival',
  'distribution-board-testing',
  'headquarters-exterior',
  'access-control-install',
  'client-review',
];

/** Stable hash so a path always resolves to the same backdrop. */
function backdropFor(path: string) {
  let hash = 0;
  for (let i = 0; i < path.length; i++) hash = (hash * 31 + path.charCodeAt(i)) >>> 0;
  return IMAGES[BACKDROPS[hash % BACKDROPS.length]];
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Path used to pick a deterministic backdrop when no image is supplied. */
  path: string;
  /** Explicit background image — location pages pass their city photography. */
  imageSrc?: string;
  imageAlt?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  primaryCta?: { label: string; href: string };
  /** Short supporting facts shown along the bottom of the hero. */
  facts?: Array<{ figure: string; label: string }>;
}

export function PageHero({
  eyebrow,
  title,
  intro,
  path,
  imageSrc,
  imageAlt,
  breadcrumbs,
  primaryCta = { label: 'Request a proposal', href: '/contact-us' },
  facts = [],
}: PageHeroProps) {
  const mediaRef = useRef<HTMLDivElement>(null);

  const resolved = imageSrc
    ? { src: imageSrc, alt: imageAlt ?? '' }
    : backdropFor(path);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const media = mediaRef.current;
    if (!media) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const offset = window.scrollY;
      if (offset > window.innerHeight) return;
      media.style.transform = `translate3d(0, ${(offset * 0.16).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="on-dark relative isolate flex min-h-[34rem] w-full flex-col overflow-hidden bg-brand-graphite [height:88svh]">
      <div ref={mediaRef} className="absolute inset-0 -z-20 will-change-transform">
        <div className="page-hero-drift absolute inset-0">
          {resolved && (
            <Image
              src={resolved.src}
              alt={resolved.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(96deg, rgba(11,18,32,.95) 0%, rgba(11,18,32,.88) 34%, rgba(11,18,32,.58) 66%, rgba(11,18,32,.40) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-48"
        style={{ background: 'linear-gradient(to top, rgba(11,18,32,.94), transparent)' }}
      />
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-40" />

      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="relative">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}

      <div className="container-wide relative flex flex-1 items-center py-14">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="eyebrow eyebrow-dark" data-reveal>
              {eyebrow}
            </p>
          )}

          <h1
            className="mt-6 text-display-lg text-white"
            data-reveal
            style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
          >
            {title}
          </h1>

          {intro && (
            <p
              className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-brand-mist/80"
              data-reveal
              style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
            >
              {intro}
            </p>
          )}

          <div
            className="mt-9 flex flex-wrap items-center gap-3"
            data-reveal
            style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
          >
            <Link href={primaryCta.href} className="btn-primary">
              {primaryCta.label}
              <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>
            <a href={CONTACT_CONFIG.mainPhone.href} className="btn-ghost-light">
              <Phone className="h-4 w-4 text-brand-electric-bright" />
              {CONTACT_CONFIG.mainPhone.display}
            </a>
          </div>

          {facts.length > 0 && (
            <dl
              className="mt-11 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 sm:grid-cols-3"
              data-reveal
              style={{ '--reveal-delay': '320ms' } as React.CSSProperties}
            >
              {facts.slice(0, 3).map((fact) => (
                <div
                  key={fact.figure}
                  className="group bg-brand-graphite/72 px-5 py-4 backdrop-blur-md transition-colors duration-500 ease-brand hover:bg-brand-graphite/90"
                >
                  <dt className="text-[13.5px] font-bold tracking-tight text-white">{fact.figure}</dt>
                  <dd className="mt-1 text-[11.5px] leading-snug text-brand-mist/60 transition-colors duration-500 group-hover:text-brand-mist/90">
                    {fact.label}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {/* Scroll cue — absolutely placed so it does not push the copy off centre. */}
      <div className="container-wide pointer-events-none absolute inset-x-0 bottom-7">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.2em] text-brand-mist/35">
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" style={{ animationDuration: '2.4s' }} />
          Scroll
        </div>
      </div>

      <div aria-hidden="true" className="rule-spectrum absolute inset-x-0 bottom-0" />

      <style>{`
        .page-hero-drift {
          animation: pageHeroDrift 30s ease-in-out infinite alternate;
          transform-origin: 60% 50%;
        }
        @keyframes pageHeroDrift {
          from { transform: scale(1.02); }
          to   { transform: scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .page-hero-drift { animation: none; transform: scale(1.02); }
        }
      `}</style>
    </section>
  );
}
