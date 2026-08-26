'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowDown, ShieldCheck, Phone } from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';

export interface SectorCinematicHeroProps {
  eyebrow: string;
  headline: string;
  subline: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs: Array<{ name: string; url: string }>;
  facts?: Array<{ label: string; value: string }>;
  primaryCta?: { label: string; href: string };
}

export function SectorCinematicHero({
  eyebrow,
  headline,
  subline,
  imageSrc,
  imageAlt,
  breadcrumbs,
  facts,
  primaryCta = { label: 'Discuss Your Estate', href: '#enquiry' },
}: SectorCinematicHeroProps) {
  const scrollToApproach = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('operational-reality') || document.getElementById('main-content');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const defaultFacts = [
    { label: 'PPM Standard', value: 'SFG20 Aligned' },
    { label: 'Response Protocol', value: 'Contracted Priority' },
    { label: 'Digital Record', value: 'EntireCAFM Certified' },
  ];

  const displayFacts = facts && facts.length >= 3 ? facts : defaultFacts;

  return (
    <section className="relative min-h-[75vh] lg:min-h-[82vh] flex flex-col justify-between bg-slate-950 text-white overflow-hidden">
      {/* Background Image with Cinematic Dark Gradient Vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.42] contrast-[1.08] saturate-[0.9]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
      </div>

      {/* Top Bar: Breadcrumbs */}
      <div className="relative z-10 pt-24 sm:pt-28 pb-4">
        <div className="container-custom">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-slate-400">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-600">/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-slate-200 font-normal truncate max-w-[280px] sm:max-w-none">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.url} className="hover:text-white transition-colors">
                    {crumb.name}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Centre: Primary Editorial Content */}
      <div className="relative z-10 py-12 sm:py-16 my-auto">
        <div className="container-custom">
          <div className="max-w-3xl space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
              <span className="text-xs font-light uppercase tracking-[0.2em] text-slate-300">
                {eyebrow}
              </span>
            </div>

            {/* Giant Human Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-[1.1]">
              {headline}
            </h1>

            {/* Supporting Editorial Paragraph */}
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
              {subline}
            </p>

            {/* Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center gap-2.5 bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-medium uppercase tracking-wider px-7 py-3.5 rounded-sm shadow-md transition-all active:scale-[0.99]"
              >
                <span>{primaryCta.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={scrollToApproach}
                className="inline-flex items-center gap-2 text-xs font-light text-slate-300 hover:text-white transition-colors py-2"
              >
                <span>Explore operational approach</span>
                <ArrowDown className="w-3.5 h-3.5 text-brand-pink" />
              </button>

              <a
                href={CONTACT_CONFIG.mainPhone.href}
                className="hidden sm:inline-flex items-center gap-2 text-xs font-light text-slate-400 hover:text-slate-200 transition-colors ml-auto"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{CONTACT_CONFIG.mainPhone.display}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Proof Strip */}
      <div className="relative z-10 border-t border-slate-800/80 bg-slate-950/75 backdrop-blur-sm py-4">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
            {displayFacts.map((fact, idx) => (
              <div key={idx} className="py-2 sm:py-0 sm:px-6 first:pl-0 flex items-center justify-between sm:justify-start gap-3">
                <span className="text-[11px] font-light uppercase tracking-wider text-slate-400">
                  {fact.label}:
                </span>
                <span className="text-xs font-normal text-white">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
