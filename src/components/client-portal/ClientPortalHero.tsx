'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Activity, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

interface ClientPortalHeroProps {
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function ClientPortalHero({ breadcrumbs }: ClientPortalHeroProps) {
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const media = mediaRef.current;
    if (!media) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const offset = window.scrollY;
      if (offset > window.innerHeight) return;
      media.style.transform = `translate3d(0, ${(offset * 0.12).toFixed(1)}px, 0)`;
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
    <section className="relative isolate flex min-h-[100svh] min-h-[36rem] sm:min-h-[42rem] lg:min-h-screen w-full flex-col justify-between overflow-hidden bg-brand-graphite text-white pt-20 sm:pt-24 lg:pt-28 pb-10 sm:pb-14">
      {/* 1. Cinematic Background Image with Parallax */}
      <div ref={mediaRef} className="absolute inset-0 -z-20 will-change-transform">
        <div className="absolute inset-0">
          <Image
            src="/images/editorial/entirefm-hero-headquarters-2560w.webp"
            alt="EntireFM headquarters and national operational management centre at dusk"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* 2. Cinematic Scrim Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(102deg, rgba(11,18,32,0.96) 0%, rgba(11,18,32,0.90) 42%, rgba(11,18,32,0.65) 75%, rgba(11,18,32,0.45) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-brand-graphite via-brand-graphite/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(230,0,126,0.08),transparent_50%)] pointer-events-none"
      />

      {/* 3. Top Space with Breadcrumbs */}
      <div className="container-custom relative z-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <Breadcrumbs items={breadcrumbs} className="text-brand-mist/70" />
          </div>
        )}
      </div>

      {/* 4. Main Hero Composition: Headline + Floating Real Platform Inset */}
      <div className="container-custom relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Architectural Typography & Narrative */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-light tracking-wider text-brand-pink">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-pink animate-pulse" />
              ENTIRECAFM // LIVE ESTATE OPERATING ENVIRONMENT
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-[1.08]">
              See your estate.{' '}
              <span className="block font-extralight text-white mt-1">
                As it actually operates.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-light leading-relaxed">
              EntireCAFM gives authorised clients live visibility across their estate — sites, assets, work orders, engineers, statutory compliance, planned maintenance and commercial performance.
            </p>

            <p className="text-xs sm:text-sm text-slate-400 font-light tracking-wide border-l border-brand-pink/60 pl-3">
              One operational environment. Live information. No month-end reconstruction.
            </p>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link
                href="/contact-us?subject=Book%20a%20Live%20Client%20Portal%20Demonstration"
                className="btn-primary py-3 sm:py-3.5 px-5 sm:px-6 text-xs sm:text-sm w-full sm:w-auto text-center justify-center"
              >
                Book a Live Client Portal Demonstration <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#live-operating-picture"
                className="btn-ghost-light py-3 sm:py-3.5 px-4 sm:px-5 text-xs sm:text-sm w-full sm:w-auto text-center justify-center"
              >
                Explore EntireCAFM
              </a>
            </div>

            {/* Subtle Operational Trust Points */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 sm:pt-4 text-xs text-slate-400 font-light">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Statutory audit readiness
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-brand-pink" />
                Live GPS engineer check-in
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-slate-300" />
                ISO 27001 aligned
              </span>
            </div>
          </div>

          {/* Right Column: High-Precision Emerging Platform UI Inset */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-sm border border-white/15 bg-slate-950/80 p-2 sm:p-3 shadow-2xl backdrop-blur-sm">
              {/* Header Bar of Control Interface */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 text-xs font-light text-slate-400 mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  </div>
                  <span className="text-[11px] text-slate-300 ml-2 font-light">
                    EntireCAFM Client Console // 42 Managed Facilities
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 font-light">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE PRODUCTION FEED
                </div>
              </div>

              {/* Real Platform Screenshot in High-Res */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs border border-white/10 bg-slate-900">
                <Image
                  src="/images/client-portal/entirecafm-dashboard-live.png"
                  alt="EntireCAFM Live Client Operating Platform Dashboard showing 42 managed facilities, 3846 assets, and real-time SLA metrics"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </div>

              {/* Bottom Inset Caption */}
              <div className="px-3 pt-2.5 pb-1 flex items-center justify-between text-[11px] text-slate-400 font-light">
                <span>Victoria House &bull; 3,846 Assets in Service</span>
                <span className="text-slate-300">96.2% SLA Performance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Scroll Cue */}
      <div className="container-custom relative z-10 pt-8">
        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-light text-slate-400">
          <span>UK Nationwide Commercial Facilities Management</span>
          <a href="#live-operating-picture" className="hover:text-white transition-colors flex items-center gap-1">
            Scroll to inspect operating platform <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
