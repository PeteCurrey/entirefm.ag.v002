'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

interface SupplierHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  intro: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  facts?: Array<{ figure: string; label: string; detail?: string }>;
  fullScreen?: boolean;
}

export function SupplierHero({
  eyebrow = 'ENTIREFM // SUPPLY CHAIN & PARTNER NETWORK',
  title,
  subtitle,
  intro,
  imageSrc,
  imageAlt,
  breadcrumbs,
  primaryCta = { label: 'Become an EntireFM Supplier', href: '/suppliers/apply' },
  secondaryCta = { label: 'How We Vet Our Supply Chain', href: '/suppliers/vetting' },
  facts = [],
  fullScreen = false,
}: SupplierHeroProps) {
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
      media.style.transform = `translate3d(0, ${(offset * 0.14).toFixed(1)}px, 0)`;
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
    <section
      className={`on-dark relative isolate flex w-full flex-col overflow-hidden bg-brand-graphite ${
        fullScreen
          ? 'min-h-[42rem] min-h-screen [height:100svh]'
          : 'min-h-[35rem] [height:86svh]'
      }`}
    >
      {/* Parallax Background */}
      <div ref={mediaRef} className="absolute inset-0 -z-20 will-change-transform">
        <div className="supplier-hero-drift absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Cinematic Gradient Scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(98deg, rgba(11,18,32,0.96) 0%, rgba(11,18,32,0.88) 38%, rgba(11,18,32,0.60) 70%, rgba(11,18,32,0.38) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-44"
        style={{ background: 'linear-gradient(to top, rgba(11,18,32,0.96), transparent)' }}
      />
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-30" />

      {/* Top Breadcrumb Space */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="relative pt-[calc(var(--header-h,72px)+1rem)]">
          <div className="container-wide">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div
        className={`container-wide relative flex flex-1 items-center pb-14 ${
          breadcrumbs && breadcrumbs.length > 0 ? 'pt-4' : 'pt-[calc(var(--header-h,72px)+2rem)]'
        }`}
      >
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-mono tracking-[0.14em] text-brand-mist/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-electric-bright animate-pulse" />
              {eyebrow}
            </div>
          )}

          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-[1.12]">
            {title}
            {subtitle && (
              <span className="block mt-2 font-normal text-brand-mist/95 text-2xl sm:text-3xl lg:text-4xl">
                {subtitle}
              </span>
            )}
          </h1>

          {intro && (
            <p className="mt-6 max-w-2xl text-[15.5px] sm:text-[16.5px] font-light leading-relaxed text-brand-mist/80">
              {intro}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            {primaryCta && (
              <Link href={primaryCta.href} className="btn-primary">
                {primaryCta.label}
                <ArrowRight className="btn-arrow h-4 w-4" />
              </Link>
            )}
            {secondaryCta && (
              <Link href={secondaryCta.href} className="btn-ghost-light">
                {secondaryCta.label}
              </Link>
            )}
          </div>

          {facts.length > 0 && (
            <dl className="mt-10 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 sm:grid-cols-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="group bg-brand-graphite/80 px-5 py-4 backdrop-blur-md transition-colors duration-500 hover:bg-brand-graphite/95"
                >
                  <dt className="text-[14px] font-semibold tracking-tight text-white">{fact.figure}</dt>
                  <dd className="mt-1 text-[11.5px] font-medium leading-snug text-brand-mist/70 group-hover:text-brand-mist">
                    {fact.label}
                  </dd>
                  {fact.detail && (
                    <dd className="mt-0.5 text-[10.5px] text-brand-mist/40">
                      {fact.detail}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      <div aria-hidden="true" className="rule-spectrum absolute inset-x-0 bottom-0" />

      <style>{`
        .supplier-hero-drift {
          animation: supplierHeroDrift 32s ease-in-out infinite alternate;
          transform-origin: 50% 50%;
        }
        @keyframes supplierHeroDrift {
          from { transform: scale(1.01); }
          to   { transform: scale(1.07); }
        }
        @media (prefers-reduced-motion: reduce) {
          .supplier-hero-drift { animation: none; transform: scale(1.02); }
        }
      `}</style>
    </section>
  );
}
