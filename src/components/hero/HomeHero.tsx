'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone, ArrowDown } from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';
import editorial from '@/config/location-images.json';

/**
 * HOME HERO — FULL VIEWPORT IMAGE
 * ===============================
 * A full-bleed photographic opening: the EntireFM building at dusk, with the
 * headline over it.
 *
 * The mark is no longer in the hero. It arrives in the header at the end of
 * the intro animation and stays there, so the page has one logo in one place
 * rather than competing marks in the header and the hero at once.
 *
 * MOTION
 * ------
 * A slow scale drift on the image (about 4% over 24 seconds) plus a light
 * scroll parallax. Both are disabled under `prefers-reduced-motion`, where
 * the image simply sits still.
 *
 * ON VIDEO
 * --------
 * `videoSrc` is wired and unused: the project has stills only. Drop an mp4 in
 * and it plays in place of the image, muted and looping, with the still as
 * poster and fallback. The scrim and layout do not change.
 *
 * HEIGHT
 * ------
 * `100svh` rather than `100vh` so mobile browsers do not hide the call to
 * action behind the address bar, with a `min-height` floor so the copy never
 * crushes on a short laptop screen.
 */

type EditorialManifest = {
  editorial: Record<string, { src: string; alt: string; widths: Record<string, string> }>;
};

/** London aerial timelapse, recovered from the legacy Wix homepage. */
const HERO_VIDEO = '/video/entirefm-london-aerial.mp4';
const HERO = (editorial as EditorialManifest).editorial?.['london-aerial-poster'];

const PROOF = [
  { figure: 'Hard FM', label: 'M&E, HVAC and building plant' },
  { figure: 'PPM', label: 'Schedules built from real asset surveys' },
  { figure: 'Compliance', label: 'Statutory testing, certified and recorded' },
];

interface HomeHeroProps {
  /** Override the background video. Defaults to the London aerial. */
  videoSrc?: string;
}

export function HomeHero({ videoSrc = HERO_VIDEO }: HomeHeroProps) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  /**
   * The poster carries the first paint and the video fades in over it once it
   * can actually play. Loading is deferred to idle and skipped entirely under
   * reduced motion or Save-Data, so a 3.4MB background never competes with the
   * content for bandwidth.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const start = () => {
      video.src = videoSrc;
      video.load();
      video.play().catch(() => {
        /* Autoplay refused — the poster stays, which is a fine outcome. */
      });
    };

    const idle =
      (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const handle = idle ? idle(start) : window.setTimeout(start, 900);
    return () => {
      if (!idle) clearTimeout(handle as number);
    };
  }, [videoSrc]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const media = mediaRef.current;
    if (!media) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const offset = window.scrollY;
      if (offset > window.innerHeight) return; // off screen, nothing to do
      media.style.transform = `translate3d(0, ${(offset * 0.18).toFixed(1)}px, 0)`;
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
    <section className="on-dark relative isolate flex min-h-[40rem] w-full flex-col overflow-hidden bg-brand-graphite [height:100svh]">
      {/* Media layer */}
      <div ref={mediaRef} className="absolute inset-0 -z-20 will-change-transform">
        <div className="hero-drift absolute inset-0">
          {/* Poster first — this is the LCP image and it must not wait on video. */}
          {HERO && (
            <Image
              src={HERO.src}
              alt={HERO.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
          {/* Video fades in over the poster once it can play. */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-brand"
            style={{ opacity: videoReady ? 1 : 0 }}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            onCanPlay={() => setVideoReady(true)}
          />
        </div>
      </div>

      {/* Legibility scrim. A directional gradient keeps the copy side readable
          without flattening the building or dulling the lit signage. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(96deg, rgba(11,18,32,.95) 0%, rgba(11,18,32,.86) 32%, rgba(11,18,32,.52) 62%, rgba(11,18,32,.34) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-52"
        style={{ background: 'linear-gradient(to top, rgba(11,18,32,.92), transparent)' }}
      />
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-40" />

      {/* Copy */}
      <div className="container-wide relative flex flex-1 items-center py-16">
        <div className="max-w-2xl">
          <p className="eyebrow eyebrow-dark" data-reveal>
            Total Facilities Management
          </p>

          <h1
            className="mt-6 text-display-xl text-white"
            data-reveal
            style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
          >
            Facilities management,
            <br />
            <span className="text-spectrum">without the friction.</span>
          </h1>

          <p
            className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-brand-mist/80"
            data-reveal
            style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
          >
            EntireFM maintains commercial property across the UK — planned maintenance,
            mechanical and electrical engineering, statutory compliance and reactive cover,
            held under one contract so responsibility never moves between suppliers while a
            building sits unusable.
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-3"
            data-reveal
            style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
          >
            <Link href="/contact-us" className="btn-primary">
              Request a proposal
              <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>
            <a href={CONTACT_CONFIG.mainPhone.href} className="btn-ghost-light">
              <Phone className="h-4 w-4 text-brand-electric-bright" />
              {CONTACT_CONFIG.mainPhone.display}
            </a>
          </div>

          <dl
            className="mt-12 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 sm:grid-cols-3"
            data-reveal
            style={{ '--reveal-delay': '320ms' } as React.CSSProperties}
          >
            {PROOF.map((item) => (
              <div
                key={item.figure}
                className="group bg-brand-graphite/72 px-5 py-4 backdrop-blur-md transition-colors duration-500 ease-brand hover:bg-brand-graphite/90"
              >
                <dt className="text-[14px] font-bold tracking-tight text-white">{item.figure}</dt>
                <dd className="mt-1 text-[11.5px] leading-snug text-brand-mist/60 transition-colors duration-500 group-hover:text-brand-mist/90">
                  {item.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Scroll cue — absolutely placed so it does not push the copy off centre. */}
      <div className="container-wide pointer-events-none absolute inset-x-0 bottom-8">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.2em] text-brand-mist/40">
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" style={{ animationDuration: '2.4s' }} />
          Scroll
        </div>
      </div>

      <div aria-hidden="true" className="rule-spectrum absolute inset-x-0 bottom-0" />

      <style>{`
        .hero-drift {
          animation: heroDrift 26s ease-in-out infinite alternate;
          transform-origin: 62% 55%;
        }
        @keyframes heroDrift {
          from { transform: scale(1.02); }
          to   { transform: scale(1.09); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-drift { animation: none; transform: scale(1.02); }
        }
      `}</style>
    </section>
  );
}
