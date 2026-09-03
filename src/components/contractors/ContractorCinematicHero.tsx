'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Breadcrumbs, BreadcrumbItem } from '@/components/layout/Breadcrumbs';

export interface ContractorHeroFact {
  figure: string;
  label: string;
  detail?: string;
}

export interface ContractorCinematicHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  intro: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs: BreadcrumbItem[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  facts?: ContractorHeroFact[];
  fullScreen?: boolean;
}

export function ContractorCinematicHero({
  eyebrow = 'ENTIREFM CONTRACTOR NETWORK // COMMERCIAL INTAKE',
  title,
  subtitle,
  intro,
  imageSrc,
  imageAlt,
  breadcrumbs,
  primaryCta = { label: 'Apply to Join Network', href: '/contractors/join' },
  secondaryCta = { label: 'How the Network Works', href: '/contractors/find-work' },
  facts = [
    { figure: '£95 / yr', label: 'Annual Membership', detail: 'Payable on submission' },
    { figure: 'Merit-Based', label: 'Work Allocation', detail: 'Capability & compliance' },
    { figure: 'UK-Wide', label: 'Commercial FM', detail: 'Regional & national estates' },
  ],
  fullScreen = true,
}: ContractorCinematicHeroProps) {
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
      className={`on-dark relative isolate flex w-full flex-col justify-between overflow-hidden bg-[#0B1220] text-white pt-[calc(var(--header-h,72px)+1rem)] pb-12 sm:pb-16 border-b border-slate-800 ${
        fullScreen
          ? 'min-h-[90vh] lg:min-h-[96vh]'
          : 'min-h-[38rem] lg:min-h-[75vh]'
      }`}
    >
      {/* Parallax Background Photography */}
      <div ref={mediaRef} className="absolute inset-0 -z-20 will-change-transform">
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-[0.78] contrast-[1.05]"
          />
        </div>
      </div>

      {/* Cinematic Contrast Scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(98deg, rgba(11,18,32,0.96) 0%, rgba(11,18,32,0.88) 42%, rgba(11,18,32,0.60) 75%, rgba(11,18,32,0.40) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40"
        style={{ background: 'linear-gradient(to top, rgba(11,18,32,0.95), transparent)' }}
      />
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-30" />

      {/* Top Breadcrumb Space */}
      <div className="container-wide">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Central Content */}
      <div className="container-wide py-8 sm:py-12 my-auto">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow / Status Tag */}
          <div className="inline-flex items-center gap-2.5 rounded-sm border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-[11px] font-mono tracking-wider text-slate-300 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C] animate-pulse" />
            <span>{eyebrow}</span>
          </div>

          {/* Primary H1 */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-[1.1]">
            {title}
            {subtitle && (
              <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl text-slate-300 font-extralight">
                {subtitle}
              </span>
            )}
          </h1>

          {/* Supporting Intro */}
          <p className="text-base sm:text-lg font-light leading-relaxed text-slate-300 max-w-2xl">
            {intro}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="btn-primary text-xs py-3.5 px-7 font-semibold flex items-center gap-2 shadow-lg hover:shadow-orange-500/20"
              >
                <span>{primaryCta.label}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="btn-ghost-light text-xs py-3.5 px-6 font-normal"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Key Facts Bar */}
      {facts && facts.length > 0 && (
        <div className="container-wide pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10">
            {facts.map((fact, idx) => (
              <div
                key={idx}
                className="p-4 rounded-sm bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-1"
              >
                <div className="text-lg sm:text-xl font-light text-white tracking-tight">
                  {fact.figure}
                </div>
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  {fact.label}
                </div>
                {fact.detail && (
                  <div className="text-[11px] text-slate-400 font-light">
                    {fact.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
