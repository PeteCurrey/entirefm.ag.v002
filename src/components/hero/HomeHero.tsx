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

/**
 * The four-up strip low in the hero, mirroring the arrangement on the live
 * site. The wording is not mirrored: the live site's first pill reads "24/7
 * helpdesk support", which is a claim the register has as TO_VERIFY, and its
 * second promises a contractor network. Both are restated to what is
 * supportable — the layout is the thing worth keeping.
 */
const PROOF = [
  { figure: 'Out-of-hours', label: 'Contracted site cover' },
  { figure: 'UK-wide', label: 'Regional operations' },
  { figure: 'Planned', label: '& reactive maintenance' },
  { figure: 'Compliance', label: 'Led FM delivery' },
];

/** Matches the greeting on the live site. Hours are the visitor's own. */
function greetingFor(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

interface HomeHeroProps {
  /** Override the background video. Defaults to the London aerial. */
  videoSrc?: string;
}

export function HomeHero({ videoSrc = HERO_VIDEO }: HomeHeroProps) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  /**
   * Resolved after mount, never during render. The server has no idea what
   * time it is where the visitor is, so rendering a greeting in the HTML
   * would either be wrong or would mismatch on hydration. Until it resolves
   * the eyebrow reads as the positioning line alone, which is a complete
   * sentence on its own — the greeting is an addition, not a dependency.
   */
  const [greeting, setGreeting] = useState<string | null>(null);
  useEffect(() => setGreeting(greetingFor(new Date().getHours())), []);

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
            'linear-gradient(96deg, rgba(11,18,32,.78) 0%, rgba(11,18,32,.58) 34%, rgba(11,18,32,.26) 64%, rgba(11,18,32,.10) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-44"
        style={{ background: 'linear-gradient(to top, rgba(11,18,32,.70), transparent)' }}
      />
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-30" />


      {/* Copy */}
      {/*
        The header is fixed and transparent over this hero, so the top padding
        has to clear it. Padding rather than a margin: the copy is centred
        within what is left, which puts the headline optically in the middle
        of the visible area rather than in the middle of the section.
      */}
      <div className="container-wide relative flex flex-1 flex-col justify-center pb-16 pt-[calc(var(--header-h)+3rem)]">
        <div className="max-w-3xl">
          <p className="eyebrow eyebrow-dark" data-reveal>
            {/* Dropped on the narrowest screens: the eyebrow already wraps to
                two lines there, and the greeting pushes the positioning line
                onto a third with a slash stranded on its own. */}
            <span
              className="hidden text-brand-pink-light transition-opacity duration-700 ease-brand sm:inline"
              style={{ opacity: greeting ? 1 : 0 }}
            >
              {greeting ?? 'Good day'}
              <span className="mx-2 text-brand-mist/30">/</span>
            </span>
            Total Facilities Management
          </p>

          <h1
            className="mt-6 text-display-xl text-white"
            data-reveal
            style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
          >
            Facilities management,
            <br />
            <span className="text-hero-pink">without the friction.</span>
          </h1>

          <p
            className="mt-7 max-w-2xl text-[1.0625rem] leading-relaxed text-brand-mist/80"
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
            <Link href="/contact-us" className="btn-hero-pink">
              Request a proposal
              <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>
            <a href={CONTACT_CONFIG.mainPhone.href} className="btn-ghost-light">
              <Phone className="h-4 w-4 text-brand-pink-light" />
              {CONTACT_CONFIG.mainPhone.display}
            </a>
          </div>

        </div>

        {/*
            Four separated glass cards, matching entirefm.com: the panels float
            over the photograph rather than sitting in a bordered grid, and the
            frosting is what makes the copy readable over moving video without
            another scrim flattening the image behind it.

            The figure is set large and light in the accent colour with the
            label small, uppercase and widely tracked beneath — the contrast in
            size and weight is what carries the hierarchy, not a rule or a box.
          */}
        <dl
          className="mt-12 grid max-w-5xl grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
          data-reveal
          style={{ '--reveal-delay': '320ms' } as React.CSSProperties}
        >
          {PROOF.map((item) => (
            <div
              key={item.figure}
              className="group rounded-sm border border-white/[0.09] bg-white/[0.06] px-6 py-7 backdrop-blur-xl transition-all duration-500 ease-brand hover:border-white/20 hover:bg-white/[0.11]"
            >
              <dt className="whitespace-nowrap text-[1.75rem] font-extralight leading-none tracking-[-0.035em] text-brand-pink-light transition-colors duration-500 group-hover:text-white">
                {item.figure}
              </dt>
              <dd className="mt-3.5 text-[10.5px] font-medium uppercase leading-snug tracking-[0.16em] text-brand-mist/65 transition-colors duration-500 group-hover:text-brand-mist/90">
                {item.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Scroll cue — absolutely placed so it does not push the copy off centre. */}
      <div className="container-wide pointer-events-none absolute inset-x-0 bottom-8">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.2em] text-brand-mist/40">
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" style={{ animationDuration: '2.4s' }} />
          Scroll
        </div>
      </div>

      <div aria-hidden="true" className="rule-hero-pink absolute inset-x-0 bottom-0" />

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
