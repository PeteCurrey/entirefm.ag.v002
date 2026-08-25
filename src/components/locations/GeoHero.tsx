'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone, Mail, ChevronRight, ShieldCheck, Clock, Layers, Building2, MapPin } from 'lucide-react';
import type { RegionalContact } from '@/config/regional-contacts';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface GeoHeroProps {
  city: string;
  h1: string;
  highlightedTitle?: string;
  intro: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs: BreadcrumbItem[];
  contact: RegionalContact;
  proofPills?: Array<{ figure: string; label: string }>;
}

function greetingFor(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function GeoHero({
  city,
  h1,
  highlightedTitle,
  intro,
  imageSrc,
  imageAlt,
  breadcrumbs,
  contact,
  proofPills,
}: GeoHeroProps) {
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    setGreeting(greetingFor(new Date().getHours()));
  }, []);

  const defaultPills = [
    { figure: 'Contracted Response', label: '24/7 Priority cover' },
    { figure: 'Hard & Soft FM', label: 'Single accountable scope' },
    { figure: 'SFG20 Aligned', label: 'Planned preventative care' },
    { figure: 'Digital CAFM', label: 'Real-time compliance vault' },
  ];

  const displayPills = proofPills && proofPills.length > 0 ? proofPills : defaultPills;

  return (
    <section className="on-dark relative isolate flex min-h-[44rem] w-full flex-col overflow-hidden bg-brand-graphite [height:100svh] min-h-[640px]">
      {/* 1. Background Cinematic Image Layer */}
      <div className="absolute inset-0 -z-20">
        <div className="geo-drift absolute inset-0">
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

      {/* 2. Softened Directional Scrim Overlay (Matches Homepage standard) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(96deg, rgba(11,18,32,0.86) 0%, rgba(11,18,32,0.68) 38%, rgba(11,18,32,0.36) 70%, rgba(11,18,32,0.18) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-44"
        style={{ background: 'linear-gradient(to top, rgba(11,18,32,0.78), transparent)' }}
      />
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-30" />

      {/* 3. Hero Content Container */}
      <div className="container-wide relative flex flex-1 flex-col justify-center pb-12 pt-[calc(var(--header-h,4.5rem)+2rem)]">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-brand-mist/60" data-reveal>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.url}>
              {idx > 0 && <ChevronRight className="h-3 w-3 text-brand-mist/40" />}
              {idx === breadcrumbs.length - 1 ? (
                <span className="font-light text-brand-pink-light truncate max-w-[280px]" aria-current="page">
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

        <div className="max-w-3xl">
          {/* Eyebrow badge with live pulse */}
          <div className="flex items-center gap-2.5 mb-4" data-reveal>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-pink" />
            </span>
            <p className="eyebrow eyebrow-dark">
              <span className="hidden text-brand-pink-light sm:inline" style={{ opacity: greeting ? 1 : 0 }}>
                {greeting ?? 'Welcome'}
                <span className="mx-2 text-brand-mist/30">/</span>
              </span>
              OPERATIONAL REGION // {city.toUpperCase()}
            </p>
          </div>

          {/* Primary H1 */}
          <h1
            className="text-display-xl text-white tracking-tight leading-[1.08]"
            data-reveal
            style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
          >
            {h1}
          </h1>

          {/* Intro copy */}
          <p
            className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-brand-mist/85 font-light"
            data-reveal
            style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
          >
            {intro}
          </p>

          {/* Action CTAs & Location-Specific Email Hotlink */}
          <div
            className="mt-8 flex flex-wrap items-center gap-3.5"
            data-reveal
            style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
          >
            <Link href="#enquiry" className="btn-hero-pink">
              Request a {city} proposal
              <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>
            <a href={contact.phone.href} className="btn-ghost-light">
              <Phone className="h-4 w-4 text-brand-pink-light" />
              {contact.phone.display}
            </a>
            <a
              href={contact.emailHref}
              className="inline-flex items-center gap-2 rounded-sm border border-white/15 bg-white/10 px-4 py-3 text-xs font-normal text-white backdrop-blur-md hover:bg-white/20 hover:border-brand-pink/50 transition-all duration-300"
              title={`Direct email to EntireFM ${city} Operations Desk`}
            >
              <Mail className="h-3.5 w-3.5 text-brand-pink-light" />
              <span>{contact.email}</span>
            </a>
          </div>
        </div>

        {/* 4. Floating Glass Proof Cards */}
        <dl
          className="mt-10 grid max-w-5xl grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
          data-reveal
          style={{ '--reveal-delay': '320ms' } as React.CSSProperties}
        >
          {displayPills.map((item) => (
            <div
              key={item.figure}
              className="group flex flex-col justify-between rounded-sm border border-white/[0.09] bg-white/[0.06] p-4 sm:p-5 backdrop-blur-xl transition-all duration-500 ease-brand hover:border-white/20 hover:bg-white/[0.12] min-h-[104px]"
            >
              <dt className="text-[1.25rem] sm:text-[1.45rem] font-extralight leading-tight tracking-[-0.03em] text-brand-pink-light transition-colors duration-500 group-hover:text-white line-clamp-1">
                {item.figure}
              </dt>
              <dd className="mt-2 text-[10px] sm:text-[10.5px] font-normal uppercase leading-snug tracking-[0.12em] text-brand-mist/70 transition-colors duration-500 group-hover:text-brand-mist/95 line-clamp-2">
                {item.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div aria-hidden="true" className="rule-hero-pink absolute inset-x-0 bottom-0" />

      <style jsx>{`
        .geo-drift {
          animation: geoDrift 28s ease-in-out infinite alternate;
          transform-origin: 60% 50%;
        }
        @keyframes geoDrift {
          from { transform: scale(1.01); }
          to   { transform: scale(1.07); }
        }
        @media (prefers-reduced-motion: reduce) {
          .geo-drift { animation: none; transform: scale(1.01); }
        }
      `}</style>
    </section>
  );
}
