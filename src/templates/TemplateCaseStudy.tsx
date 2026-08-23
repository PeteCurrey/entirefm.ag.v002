'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { PageHero } from '@/components/hero/PageHero';
import { Footer } from '@/components/layout/Footer';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { ENGAGEMENTS, ANONYMITY_NOTE, type Engagement } from '@/content/case-studies/engagements';
import editorial from '@/config/location-images.json';
import type { TemplateProps } from './types';

/**
 * CASE STUDIES — THE LOBBY
 * ========================
 * A room of full-height image panels, one per engagement. Choosing one opens
 * it in place rather than navigating away, so a visitor can look through four
 * of them without four page loads and four returns to a listing.
 *
 * WHY IN PLACE RATHER THAN SEPARATE PAGES
 * ---------------------------------------
 * Six thin detail pages, all following the same template, is precisely the
 * near-duplicate pattern the differentiation gate exists to catch — and none
 * of them would carry real client detail yet, so they would be thin as well as
 * similar. Everything is in the DOM on one page, which means it is crawlable,
 * linkable and readable without JavaScript; the panel is presentation.
 *
 * When real, permissioned client detail exists, each of these becomes its own
 * page and earns it.
 *
 * WHAT REPLACED WHAT
 * ------------------
 * The previous template printed the same two invented paragraphs — "Client
 * Estate & Operational Scope", "Transition to Structured SFG20 Maintenance" —
 * on every case study route, whatever the route was, and titleised its related
 * links from the slug. None of that survives.
 */

type EditorialManifest = { editorial: Record<string, { src: string; alt: string }> };
const IMAGES = (editorial as EditorialManifest).editorial ?? {};

export function TemplateCaseStudy({ route, content }: TemplateProps) {
  const [open, setOpen] = useState<string | null>(null);
  const active = ENGAGEMENTS.find((e) => e.slug === open) ?? null;

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Case Studies', url: '/case-studies' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main id="main" className="flex-1">
        <PageHero
          eyebrow={content.eyebrow || 'Selected work'}
          title={content.h1}
          intro={content.heroIntro || content.metaDescription}
          path={route.path}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Discuss your estate', href: '/contact-us' }}
        />

        <section className="section bg-brand-void">
          <div className="container-wide">
            <div className="mb-12 max-w-2xl" data-reveal>
              <p className="eyebrow eyebrow-dark">The estates we maintain</p>
              <h2 className="mt-5 text-display-md text-white">
                Six kinds of building, six different definitions of a bad day
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-brand-mist/65">
                The trades are largely the same across all of them. What changes is what failure
                costs, and that is what should shape a maintenance plan. Open any of these to see
                how.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ENGAGEMENTS.map((item, i) => (
                <li
                  key={item.slug}
                  data-reveal
                  style={{ '--reveal-delay': `${(i % 3) * 80}ms` } as React.CSSProperties}
                >
                  <LobbyCard item={item} onOpen={() => setOpen(item.slug)} />
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-3xl text-[12.5px] leading-relaxed text-brand-mist/45">
              {ANONYMITY_NOTE}
            </p>
          </div>
        </section>

        {/* Always in the DOM: crawlable, and readable with the panel closed. */}
        <section className="sr-only">
          <h2>Engagement detail</h2>
          {ENGAGEMENTS.map((item) => (
            <article key={item.slug}>
              <h3>{item.title}</h3>
              <p>{item.sector} — {item.client}</p>
              <p>{item.situation}</p>
              <ul>
                {item.approach.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <p>{item.outcome}</p>
            </article>
          ))}
        </section>

        <ProposalSection
          headline="Tell us what your estate does when something fails"
          subheadline="That answer shapes the maintenance plan more than the building type does. We will survey the assets before proposing a schedule."
        />
      </main>
      <Footer />

      {active && <DetailPanel item={active} onClose={() => setOpen(null)} />}
    </div>
  );
}

/* ── Lobby card ─────────────────────────────────────────────────────────── */

function LobbyCard({ item, onOpen }: { item: Engagement; onOpen: () => void }) {
  const image = IMAGES[item.imageKey];
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group relative flex h-[26rem] w-full flex-col justify-end overflow-hidden rounded-sm border border-brand-edge-dark bg-brand-carbon p-7 text-left transition-colors duration-500 ease-brand hover:border-white/25"
    >
      {image && (
        <Image
          src={image.src}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="scale-105 object-cover opacity-45 transition-all duration-[1100ms] ease-brand group-hover:scale-110 group-hover:opacity-70"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(6,10,20,.96) 18%, rgba(6,10,20,.62) 58%, rgba(6,10,20,.34) 100%)',
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand-spectrum transition-transform duration-500 ease-brand group-hover:scale-x-100"
      />

      <span className="relative">
        <span className="eyebrow eyebrow-dark">{item.sector}</span>
        <span className="mt-4 block text-[1.25rem] font-extralight leading-tight tracking-[-0.03em] text-white">
          {item.title}
        </span>
        <span className="mt-3 block text-[13px] leading-relaxed text-brand-mist/70">
          {item.summary}
        </span>
        <span className="mt-6 inline-flex items-center gap-1.5 border-t border-white/12 pt-4 text-[12.5px] font-semibold text-white transition-colors duration-300 group-hover:text-brand-electric-bright">
          Open
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </span>
    </button>
  );
}

/* ── Detail panel ───────────────────────────────────────────────────────── */

function DetailPanel({ item, onClose }: { item: Engagement; onClose: () => void }) {
  const image = IMAGES[item.imageKey];

  // Escape closes, and the page behind must not scroll while it is open.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[120] flex justify-end"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-brand-void/80 backdrop-blur-sm"
      />

      <div className="on-dark panel-in relative flex h-full w-full max-w-3xl flex-col overflow-y-auto bg-brand-graphite shadow-elevated">
        <div className="relative h-64 shrink-0 overflow-hidden">
          {image && (
            <Image src={image.src} alt={image.alt} fill sizes="48rem" className="object-cover" />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(11,18,32,1) 4%, rgba(11,18,32,.45) 60%, rgba(11,18,32,.2) 100%)',
            }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/20 bg-brand-graphite/60 text-white backdrop-blur-md transition-colors hover:bg-brand-graphite"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-8 pb-14 pt-2 sm:px-12">
          <p className="eyebrow eyebrow-dark">{item.sector}</p>
          <h2 className="mt-4 text-display-md text-white">{item.title}</h2>
          <p className="mt-3 text-[13px] uppercase tracking-[0.16em] text-brand-mist/45">
            {item.client}
          </p>

          <Block heading="The situation">
            <p className="text-[15px] leading-relaxed text-brand-mist/75">{item.situation}</p>
          </Block>

          <Block heading="How the work is approached">
            <ul className="space-y-3">
              {item.approach.map((point) => (
                <li key={point} className="flex gap-3 text-[14px] leading-relaxed text-brand-mist/75">
                  <span
                    aria-hidden="true"
                    className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-brand-electric-bright"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </Block>

          <Block heading="What that produces">
            <p className="text-[15px] leading-relaxed text-brand-mist/75">{item.outcome}</p>
          </Block>

          <Block heading="Services involved">
            <ul className="flex flex-wrap gap-2">
              {item.services.map((href) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-white/15 px-3 py-2 text-[12.5px] text-brand-mist transition-colors hover:border-brand-electric/60 hover:text-white"
                  >
                    {href.replace(/^\//, '').replace(/\//g, ' · ').replace(/-/g, ' ')}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </Block>

          <p className="mt-10 border-t border-white/10 pt-6 text-[12.5px] leading-relaxed text-brand-mist/45">
            {ANONYMITY_NOTE}
          </p>

          <Link href="/contact-us" className="btn-primary mt-8">
            Discuss an estate like this
            <ArrowRight className="btn-arrow h-4 w-4" />
          </Link>
        </div>
      </div>

      <style>{`
        .panel-in { animation: panelIn 420ms cubic-bezier(0.22, 0.61, 0.36, 1); }
        @keyframes panelIn {
          from { transform: translateX(3%); opacity: 0; }
          to   { transform: translateX(0);  opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .panel-in { animation: none; }
        }
      `}</style>
    </div>
  );
}

function Block({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="mt-10">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-electric-bright">
        {heading}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}
