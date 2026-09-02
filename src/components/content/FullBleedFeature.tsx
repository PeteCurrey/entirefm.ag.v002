'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import editorial from '@/config/location-images.json';

/**
 * FULL-BLEED FEATURE
 * ==================
 * A full-width, full-height image band with copy over it. The image drifts
 * slowly as the section passes through the viewport — a parallax rather than
 * a loop, so the movement is tied to the reader's own scrolling and stops
 * when they stop.
 *
 * ON VIDEO
 * --------
 * This is built to take a video and currently does not have one: the project
 * has no footage, only stills. Rather than fake it, the component accepts an
 * optional `video` prop — pass a poster-backed source and it plays it in place
 * of the still, muted, looping and `playsInline`, with the still remaining as
 * the poster and the fallback. Until footage exists the still carries a slow
 * scale drift, which is the honest version of the effect.
 *
 * The parallax runs off a scroll listener with `requestAnimationFrame`
 * throttling rather than a scroll-linked animation, so it behaves the same in
 * every browser. It is disabled entirely under `prefers-reduced-motion`.
 */

type EditorialManifest = {
  editorial: Record<string, { src: string; alt: string; widths: Record<string, string> }>;
};

const IMAGES = (editorial as EditorialManifest).editorial ?? {};

interface FullBleedFeatureProps {
  imageKey?: string;
  imageSrc?: string;
  imageAlt?: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  /** Optional video source. Falls back to the still if absent or unplayable. */
  video?: string;
  /** Facts listed beneath the copy. */
  points?: string[];
  align?: 'left' | 'centre';
}

export function FullBleedFeature({
  imageKey,
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  body,
  href,
  cta,
  video,
  points = [],
  align = 'left',
}: FullBleedFeatureProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  const image = imageSrc
    ? { src: imageSrc, alt: imageAlt || title }
    : imageKey
    ? IMAGES[imageKey]
    : null;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    const layer = layerRef.current;
    if (!section || !layer) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewport) return;

      // -1 when the section is entering, +1 when it is leaving.
      const travel = (rect.top + rect.height / 2 - viewport / 2) / (viewport / 2 + rect.height / 2);
      layer.style.transform = `translate3d(0, ${(travel * 7).toFixed(2)}%, 0) scale(1.16)`;
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

  if (!image) return null;

  return (
    <section
      ref={sectionRef}
      className="on-dark relative isolate flex min-h-[32rem] sm:min-h-[36rem] lg:min-h-[38rem] w-full items-center overflow-hidden bg-brand-graphite py-16 sm:py-20 lg:py-0 lg:[height:88svh]"
    >
      {/* Media layer — oversized so the parallax never exposes an edge. */}
      <div ref={layerRef} className="absolute inset-0 -z-10 will-change-transform" style={{ transform: 'scale(1.16)' }}>
        {video && !videoFailed ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={image.src}
            onError={() => setVideoFailed(true)}
            aria-hidden="true"
          >
            <source src={video} />
          </video>
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>

      {/* Legibility scrim. Two layers: a base darkening and a directional
          gradient so the copy side stays readable without flattening the image. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand-graphite/55" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            align === 'centre'
              ? 'radial-gradient(ellipse at center, rgba(11,18,32,.72) 0%, rgba(11,18,32,.42) 55%, rgba(11,18,32,.85) 100%)'
              : 'linear-gradient(95deg, rgba(11,18,32,.94) 0%, rgba(11,18,32,.80) 38%, rgba(11,18,32,.18) 78%)',
        }}
      />
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-40" />

      <div className="container-custom relative">
        <div className={`${align === 'centre' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}`}>
          <p className={`eyebrow eyebrow-dark ${align === 'centre' ? 'justify-center' : ''}`} data-reveal>
            {eyebrow}
          </p>
          <h2
            className="mt-4 sm:mt-6 text-display-lg text-white"
            data-reveal
            style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
          >
            {title}
          </h2>
          <p
            className={`mt-4 sm:mt-6 max-w-xl text-sm sm:text-base lg:text-[1.0625rem] leading-relaxed text-brand-mist/75 ${align === 'centre' ? 'mx-auto' : ''}`}
            data-reveal
            style={{ '--reveal-delay': '150ms' } as React.CSSProperties}
          >
            {body}
          </p>

          {points.length > 0 && (
            <ul
              className={`mt-7 sm:mt-9 grid gap-x-8 gap-y-2.5 sm:gap-y-3 sm:grid-cols-2 ${align === 'centre' ? 'mx-auto max-w-lg text-left' : 'max-w-xl'}`}
              data-reveal
              style={{ '--reveal-delay': '220ms' } as React.CSSProperties}
            >
              {points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-xs sm:text-[13.5px] text-brand-mist/70">
                  <span aria-hidden="true" className="mt-[6px] sm:mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand-electric-bright" />
                  {point}
                </li>
              ))}
            </ul>
          )}

          <div
            className={`mt-8 sm:mt-10 flex ${align === 'centre' ? 'justify-center' : ''}`}
            data-reveal
            style={{ '--reveal-delay': '290ms' } as React.CSSProperties}
          >
            <Link href={href} className="btn-primary w-full sm:w-auto text-center justify-center">
              {cta}
              <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
