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
    <section className="on-dark relative isolate flex min-h-[36rem] lg:min-h-[42rem] w-full flex-col overflow-hidden bg-brand-graphite">
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
      <div className="relative pt-[calc(var(--header-h)+0.5rem)]">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Hero Content */}
      <div className="container-wide relative flex flex-1 items-center pb-16 pt-6">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/[0.07] border border-white/15 backdrop-blur-sm mb-6">
            <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-pink-light">
              {eyebrow}
            </span>
          </div>

          {/* Single clear H1 */}
          <h1 className="text-display-xl text-white font-extrabold tracking-tight">
            {title}{' '}
            {highlightedTitle && (
              <span className="text-hero-pink">{highlightedTitle}</span>
            )}
          </h1>

          {/* Commercial Intro */}
          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-brand-mist/85 font-normal">
            {intro}
          </p>

          {/* Action CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
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

          {/* Service Facts Row */}
          {serviceFacts.length > 0 && (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10">
              {serviceFacts.map((fact, idx) => (
                <div key={idx} className="bg-brand-graphite/75 px-5 py-3.5 backdrop-blur-md">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">{fact.value}</div>
                  <div className="text-xs text-brand-mist/70 mt-0.5">{fact.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div aria-hidden="true" className="rule-hero-pink absolute inset-x-0 bottom-0" />
    </section>
  );
}
