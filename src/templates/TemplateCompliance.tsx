import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Scale, BookOpen, Users, AlertTriangle, FileCheck } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { PageHero } from '@/components/hero/PageHero';
import { Footer } from '@/components/layout/Footer';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import editorial from '@/config/location-images.json';
import {
  COMPLIANCE_TOPICS,
  COMPLIANCE_TOPIC_BY_SLUG,
  REQUIREMENT_LEVELS,
  COMPLIANCE_DISCLAIMER,
  type RequirementLevel,
} from '@/content/compliance/topics';
import { PRIMARY_NAV, FOOTER_NAV } from '@/config/navigation';
import type { TemplateProps } from './types';

/**
 * Human labels for the related-service links.
 *
 * These were being titleised from the slug, which rendered `/ppm` as "Ppm"
 * and `/mechanical-electrical` as "Mechanical Electrical" — while the
 * navigation two hundred pixels away called the same pages "Planned
 * Maintenance (PPM)" and "Mechanical & Electrical". The navigation already
 * holds the real names, so use those and fall back to the slug only for a
 * page the navigation does not list.
 */
const NAV_LABELS: Record<string, string> = Object.fromEntries(
  [...PRIMARY_NAV.flatMap((s) => s.columns.flatMap((c) => c.links)), ...FOOTER_NAV.flatMap((c) => c.links)].map(
    (link) => [link.href, link.label]
  )
);

function serviceLabel(href: string) {
  return (
    NAV_LABELS[href] ??
    href
      .replace(/^\//, '')
      .replace(/\//g, ' · ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/**
 * COMPLIANCE CENTRE
 * =================
 * One template for the hub and for each topic.
 *
 * THE POINT OF THE DESIGN
 * -----------------------
 * The section exists to separate four things that FM websites routinely
 * conflate: what the law requires, what a standard says, what the industry
 * habitually does, and what genuinely depends on the building. That
 * distinction has to be visible at a glance, so each requirement carries a
 * colour-coded level chip and the page opens with a legend explaining them.
 *
 * Colour alone never carries the meaning — every chip has its label in text,
 * which matters for anyone who cannot distinguish the hues and for anyone
 * reading a printed copy.
 *
 * ANSWER FIRST
 * ------------
 * Each topic leads with a direct one-paragraph answer before any narrative.
 * That is deliberate: it is what a featured snippet extracts, what an AI
 * assistant quotes, and what a facilities manager checking a frequency at
 * 4pm on a Friday actually needs.
 */

type EditorialManifest = { editorial: Record<string, { src: string; alt: string }> };
const IMAGES = (editorial as EditorialManifest).editorial ?? {};

const LEVEL_STYLES: Record<RequirementLevel, { chip: string; rail: string; icon: React.ElementType }> = {
  LEGAL: {
    chip: 'bg-brand-electric/12 text-brand-electric border-brand-electric/30',
    rail: 'bg-brand-electric',
    icon: Scale,
  },
  STANDARD: {
    chip: 'bg-brand-violet/12 text-brand-violet border-brand-violet/30',
    rail: 'bg-brand-violet',
    icon: BookOpen,
  },
  PRACTICE: {
    chip: 'bg-brand-silver/12 text-brand-silver border-brand-silver/30',
    rail: 'bg-brand-silver',
    icon: Users,
  },
  RISK: {
    chip: 'bg-brand-purple/12 text-brand-purple border-brand-purple/30',
    rail: 'bg-brand-purple',
    icon: AlertTriangle,
  },
};

/* ── Hub ────────────────────────────────────────────────────────────────── */

export function TemplateComplianceHub({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs ?? [
    { name: 'Home', url: '/' },
    { name: 'Compliance Centre', url: route.path },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main id="main" className="flex-1">
        <PageHero
          eyebrow="Compliance Centre"
          title={content.h1}
          intro={content.heroIntro}
          path={route.path}
          imageSrc={IMAGES['switchroom-survey']?.src}
          imageAlt={IMAGES['switchroom-survey']?.alt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Request a compliance review', href: '/contact-us' }}
        />

        {/* The legend is the thesis of the whole section. */}
        <section className="section-tight border-b border-brand-edge bg-brand-surface">
          <div className="container-wide">
            <div className="max-w-2xl" data-reveal>
              <p className="eyebrow">How to read these pages</p>
              <h2 className="mt-5 text-display-sm text-brand-graphite">
                Most FM sites state a frequency as though it were the law. Usually it isn&rsquo;t.
              </h2>
              <p className="prose-brand mt-4">
                Every requirement on these pages is labelled with where it actually comes from.
                Knowing which of the four you are looking at changes what you have to do, what
                you can justify doing differently, and what you would have to defend afterwards.
              </p>
            </div>

            <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-brand-edge bg-brand-edge sm:grid-cols-2 lg:grid-cols-4">
              {(Object.keys(REQUIREMENT_LEVELS) as RequirementLevel[]).map((level, i) => {
                const meta = REQUIREMENT_LEVELS[level];
                const style = LEVEL_STYLES[level];
                const Icon = style.icon;
                return (
                  <li
                    key={level}
                    className="relative bg-white p-6"
                    data-reveal
                    style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
                  >
                    <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-px ${style.rail}`} />
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider ${style.chip}`}
                    >
                      <Icon className="h-3 w-3" />
                      {meta.label}
                    </span>
                    <p className="mt-4 text-[13px] leading-relaxed text-brand-silver">
                      {meta.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Topic index */}
        <section className="section bg-white">
          <div className="container-wide">
            <div className="mb-11 max-w-2xl" data-reveal>
              <p className="eyebrow">Topics</p>
              <h2 className="mt-5 text-display-md text-brand-graphite">
                The obligations that actually apply to commercial property
              </h2>
            </div>

            <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-brand-edge bg-brand-edge md:grid-cols-2 lg:grid-cols-3">
              {COMPLIANCE_TOPICS.map((topic, i) => (
                <li
                  key={topic.slug}
                  data-reveal
                  style={{ '--reveal-delay': `${(i % 3) * 80}ms` } as React.CSSProperties}
                >
                  <Link
                    href={`/compliance/${topic.slug}`}
                    className="group relative flex h-full flex-col bg-white p-7 transition-colors duration-500 ease-brand hover:bg-brand-surface"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand-spectrum transition-transform duration-500 ease-brand group-hover:scale-x-100"
                    />
                    <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-tight text-brand-graphite">
                      {topic.shortName}
                    </h3>
                    <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-brand-silver">
                      {topic.answer.split('. ')[0]}.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 border-t border-brand-edge pt-4 text-[12.5px] font-semibold text-brand-graphite transition-colors duration-300 group-hover:text-brand-electric">
                      Read the requirements
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-3xl text-[12.5px] leading-relaxed text-brand-silver">
              {COMPLIANCE_DISCLAIMER}
            </p>
          </div>
        </section>

        <ProposalSection
          headline="Request a compliance review"
          subheadline="A survey of what your estate is obliged to do, what it currently evidences, and where the gap is."
        />
      </main>
      <Footer />
    </div>
  );
}

/* ── Topic page ─────────────────────────────────────────────────────────── */

export function TemplateComplianceTopic({ route, content }: TemplateProps) {
  const slug = route.path.replace('/compliance/', '');
  const topic = COMPLIANCE_TOPIC_BY_SLUG[slug];

  if (!topic) return <TemplateComplianceHub route={route} content={content} />;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Compliance Centre', url: '/compliance' },
    { name: topic.shortName, url: route.path },
  ];
  const image = topic.imageKey ? IMAGES[topic.imageKey] : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main id="main" className="flex-1">
        <PageHero
          eyebrow="Compliance"
          title={topic.h1}
          path={route.path}
          imageSrc={image?.src}
          imageAlt={image?.alt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Request a compliance review', href: '/contact-us' }}
        />

        {/* Answer first — this is what gets extracted and quoted. */}
        <section className="border-b border-brand-edge bg-brand-surface py-14">
          <div className="container-wide">
            <div className="max-w-3xl" data-reveal>
              <p className="eyebrow">The short answer</p>
              <p className="mt-5 text-[1.25rem] font-medium leading-relaxed tracking-tight text-brand-graphite">
                {topic.answer}
              </p>
            </div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container-wide">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
              <div>
                <p className="prose-brand max-w-2xl text-[1rem]" data-reveal>
                  {topic.intro}
                </p>

                {/* Requirements, each labelled with its level. */}
                <div className="mt-14">
                  <h2 className="text-display-sm text-brand-graphite" data-reveal>
                    What is required, and where it comes from
                  </h2>

                  <ul className="mt-8 space-y-px overflow-hidden rounded-sm border border-brand-edge bg-brand-edge">
                    {topic.requirements.map((requirement, i) => {
                      const meta = REQUIREMENT_LEVELS[requirement.level];
                      const style = LEVEL_STYLES[requirement.level];
                      const Icon = style.icon;
                      return (
                        <li
                          key={requirement.statement}
                          className="relative bg-white p-6 sm:p-7"
                          data-reveal
                          style={{ '--reveal-delay': `${Math.min(i, 4) * 60}ms` } as React.CSSProperties}
                        >
                          <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-[3px] ${style.rail}`} />
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider ${style.chip}`}
                          >
                            <Icon className="h-3 w-3" />
                            {meta.label}
                          </span>
                          <p className="mt-4 text-[15px] font-medium leading-relaxed text-brand-graphite">
                            {requirement.statement}
                          </p>
                          <p className="mt-2.5 text-[12.5px] text-brand-silver">
                            <span className="font-semibold text-brand-slate">Source:</span>{' '}
                            {requirement.source}
                          </p>
                          {requirement.note && (
                            <p className="mt-2.5 border-l-2 border-brand-edge pl-3 text-[13px] leading-relaxed text-brand-silver">
                              {requirement.note}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Evidence */}
                <div className="mt-14" data-reveal>
                  <h2 className="text-display-sm text-brand-graphite">What proves it was done</h2>
                  <p className="prose-brand mt-4 max-w-2xl">
                    Compliance is demonstrated with records, not intentions. These are the documents
                    an enforcing authority, an insurer or a purchaser&rsquo;s solicitor will ask for.
                  </p>
                  <ul className="mt-7 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                    {topic.evidence.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-brand-silver">
                        <FileCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-electric" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common failings */}
                <div className="mt-14" data-reveal>
                  <h2 className="text-display-sm text-brand-graphite">Where this usually goes wrong</h2>
                  <ul className="mt-7 space-y-3">
                    {topic.commonFailings.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-brand-silver">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-brand-purple" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Consequences */}
                <div className="mt-14 rounded-sm border border-brand-edge bg-brand-surface p-7" data-reveal>
                  <h2 className="text-[1.0625rem] font-semibold tracking-tight text-brand-graphite">
                    What happens if it is missed
                  </h2>
                  <p className="prose-brand mt-3">{topic.consequences}</p>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-sm border border-brand-edge bg-brand-surface p-6" data-reveal>
                  <p className="eyebrow">Who holds the duty</p>
                  <p className="mt-4 text-[13.5px] leading-relaxed text-brand-silver">{topic.dutyHolder}</p>
                </div>

                <div className="mt-4 rounded-sm border border-brand-edge p-6" data-reveal>
                  <p className="eyebrow">Related services</p>
                  <ul className="mt-4 space-y-2.5">
                    {topic.relatedServices.map((href) => (
                      <li key={href}>
                        <Link href={href} className="link-underline text-[13.5px]">
                          {serviceLabel(href)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 rounded-sm border border-brand-edge-dark bg-brand-graphite p-6" data-reveal>
                  <p className="eyebrow eyebrow-dark">Not sure where you stand?</p>
                  <p className="mt-4 text-[13.5px] leading-relaxed text-brand-mist/70">
                    A compliance review establishes what your estate is obliged to do, what it
                    currently evidences, and where the gap is.
                  </p>
                  <Link href="/contact-us" className="btn-primary mt-6 w-full text-[13px]">
                    Request a review
                    <ArrowRight className="btn-arrow h-3.5 w-3.5" />
                  </Link>
                </div>
              </aside>
            </div>

            <p className="mt-14 max-w-3xl border-t border-brand-edge pt-7 text-[12.5px] leading-relaxed text-brand-silver">
              {COMPLIANCE_DISCLAIMER}
            </p>
          </div>
        </section>

        <FAQAccordion faqs={topic.faqs} />

        {/* Other topics */}
        <section className="on-dark grain relative overflow-hidden bg-brand-graphite py-16">
          <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-50" />
          <div className="container-wide relative">
            <p className="eyebrow eyebrow-dark" data-reveal>
              More in the Compliance Centre
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
              {COMPLIANCE_TOPICS.filter((t) => t.slug !== topic.slug).map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/compliance/${other.slug}`}
                    className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-brand-mist/70 transition-colors hover:text-white"
                  >
                    {other.shortName}
                    <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 ease-brand group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ProposalSection
          headline={`Need help with ${topic.shortName.toLowerCase()}?`}
          subheadline="We survey what applies, what you can evidence, and what needs doing — then hold the calendar so it does not slip."
        />
      </main>
      <Footer />
    </div>
  );
}
