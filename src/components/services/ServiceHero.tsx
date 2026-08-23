'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CONTACT_CONFIG } from '@/config/contact';

export interface ServiceHeroProps {
  eyebrow: string;
  title: string;
  highlightedTitle?: string;
  intro: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs: Array<{ name: string; url: string }>;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  serviceFacts?: Array<{ label: string; value: string }>;
}

export function ServiceHero({
  eyebrow,
  title,
  highlightedTitle,
  intro,
  imageSrc,
  imageAlt,
  breadcrumbs,
  primaryCta = { label: 'Request a Proposal', href: '#enquiry' },
  secondaryCta = { label: 'Speak with an Engineer', href: '#contact-routes' },
  serviceFacts = [],
}: ServiceHeroProps) {
  return (
    <section className="on-dark relative isolate flex min-h-screen min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-brand-graphite">
      {/* Photographic Background */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Multi-stop dark gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(96deg, rgba(11,18,32,0.96) 0%, rgba(11,18,32,0.90) 42%, rgba(11,18,32,0.68) 78%, rgba(11,18,32,0.48) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-36"
        style={{ background: 'linear-gradient(to top, rgba(11,18,32,1), transparent)' }}
      />
      <div
        aria-hidden="true"
        className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-30"
      />

      {/* Breadcrumbs offset past header */}
      <div className="relative pt-[calc(var(--header-h)+0.25rem)]">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Hero Content */}
      <div className="container-wide relative flex flex-1 flex-col justify-center py-6">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/[0.07] border border-white/15 backdrop-blur-sm mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-pink-light">
              {eyebrow}
            </span>
          </div>

          {/* Single clear H1 */}
          <h1 className="text-display-xl text-white">
            {title}{' '}
            {highlightedTitle && (
              <span className="text-hero-pink">{highlightedTitle}</span>
            )}
          </h1>

          {/* Commercial Intro */}
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-brand-mist/80">
            {intro}
          </p>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={primaryCta.href}
              onClick={(e) => {
                if (primaryCta.href.startsWith('#')) {
                  e.preventDefault();
                  document.querySelector(primaryCta.href)?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-hero-pink"
            >
              <span>{primaryCta.label}</span>
              <ArrowRight className="btn-arrow h-4 w-4" />
            </a>

            <a href={CONTACT_CONFIG.mainPhone.href} className="btn-ghost-light">
              <Phone className="h-4 w-4 text-brand-pink-light" />
              <span>{CONTACT_CONFIG.mainPhone.display}</span>
            </a>
          </div>
        </div>

        {/* Proof / Service Facts Row (Glass Cards matching homepage design) */}
        {serviceFacts.length > 0 && (
          <dl className="mt-8 grid max-w-5xl grid-cols-1 gap-2.5 sm:grid-cols-3 lg:gap-3.5">
            {serviceFacts.map((fact, idx) => (
              <div
                key={idx}
                className="group rounded-sm border border-white/[0.09] bg-white/[0.06] px-5 py-4 backdrop-blur-xl transition-all duration-500 ease-brand hover:border-white/20 hover:bg-white/[0.11]"
              >
                <dt className="whitespace-nowrap text-base sm:text-lg font-semibold tracking-tight text-white transition-colors duration-500 group-hover:text-brand-pink-light">
                  {fact.value}
                </dt>
                <dd className="mt-1 text-[10.5px] font-medium uppercase tracking-[0.14em] text-brand-mist/65 transition-colors duration-500 group-hover:text-brand-mist/90">
                  {fact.label}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div aria-hidden="true" className="rule-hero-pink absolute inset-x-0 bottom-0" />
    </section>
  );
}
