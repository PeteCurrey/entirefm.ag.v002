import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { PageHero } from '@/components/hero/PageHero';
import { Footer } from '@/components/layout/Footer';
import { FullBleedFeature } from '@/components/content/FullBleedFeature';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import editorial from '@/config/location-images.json';
import type { TemplateProps } from './types';

/**
 * ABOUT / COMPANY
 * ===============
 * The story told as a sequence, with photography carrying it rather than
 * paragraph after paragraph.
 *
 * The imagery here is the genuine article — real photographs recovered from
 * the legacy Wix estates: two of the team on a rooftop above Sheffield, the
 * company's own premises, Manchester at night. Everything else in the library
 * is brand imagery, and on a page whose entire job is "who are these people"
 * the difference matters.
 *
 * STRUCTURE
 * ---------
 *   hero            full viewport, the Sheffield rooftop
 *   story           alternating image / text, so no block runs long
 *   full-bleed      the ethos, over Manchester at night
 *   commitments     the values expressed as checkable operating promises
 *   faq + CTA
 *
 * Sections come from the content record, so the copy stays editable in one
 * place; this component decides only how they are paced and which image each
 * one sits against.
 */

type EditorialManifest = {
  editorial: Record<string, { src: string; alt: string }>;
};
const IMAGES = (editorial as EditorialManifest).editorial ?? {};

/** Images paired to the story sections, in order. */
const STORY_IMAGES = [
  'entirefm-premises-vans',
  'site-arrival',
  'switchroom-survey',
  'client-review',
];

export function TemplateAbout({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs ?? [
    { name: 'Home', url: '/' },
    { name: content.h1, url: route.path },
  ];

  const sections = content.sections ?? [];
  // The last two sections are pulled out: one becomes the full-bleed break,
  // the other closes the page. The rest alternate with imagery.
  const storySections = sections.slice(0, 4);
  const closingSections = sections.slice(4);

  const hero = IMAGES['sheffield-rooftop-survey'];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main id="main" className="flex-1">
        <PageHero
          eyebrow={content.eyebrow || 'Our story'}
          title={content.h1}
          intro={content.heroIntro}
          path={route.path}
          imageSrc={hero?.src}
          imageAlt={hero?.alt}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Request a proposal', href: '/contact-us' }}
          fullScreen={true}
        />

        {/* ── The story, alternating with photography ────────────────────── */}
        <section className="section bg-white">
          <div className="container-wide">
            <div className="space-y-24 lg:space-y-32">
              {storySections.map((section, i) => {
                const image = IMAGES[STORY_IMAGES[i % STORY_IMAGES.length]];
                const reversed = i % 2 === 1;

                return (
                  <div
                    key={section.heading}
                    className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                  >
                    <div
                      className={reversed ? 'lg:order-2' : ''}
                      data-reveal
                      style={{ '--reveal-delay': '60ms' } as React.CSSProperties}
                    >
                      <p className="eyebrow">
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <h2 className="mt-5 text-display-sm text-brand-graphite">
                        {section.heading}
                      </h2>
                      <p className="prose-brand mt-5">{section.body}</p>

                      {section.bullets && section.bullets.length > 0 && (
                        <ul className="mt-7 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                          {section.bullets.map((bullet) => (
                            <li
                              key={bullet}
                              className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-brand-silver"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-brand-electric"
                              />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {image && (
                      <figure
                        className={`group relative aspect-[4/3] overflow-hidden rounded-sm ${
                          reversed ? 'lg:order-1' : ''
                        }`}
                        data-reveal
                        style={{ '--reveal-delay': '140ms' } as React.CSSProperties}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 44rem"
                          className="object-cover transition-transform duration-[1200ms] ease-brand group-hover:scale-[1.04]"
                        />
                        {/* A hairline of the brand spectrum along the top edge. */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 top-0 h-px bg-brand-spectrum"
                        />
                      </figure>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── The ethos, full bleed ──────────────────────────────────────── */}
        <FullBleedFeature
          imageKey="manchester-castlefield-night"
          eyebrow="What has not changed"
          title="Integrate into the team. Go the extra mile."
          body="The ethos from the first year still governs the work: deliver a bespoke and personalised service, integrate into the client's team rather than operating alongside it, and go the extra mile to achieve excellence. It is the reason clients from 2009 are clients now."
          href="/case-studies"
          cta="See the work"
          align="centre"
        />

        {/* ── Capabilities as a hairline band ────────────────────────────── */}
        {content.capabilities && content.capabilities.length > 0 && (
          <section className="section-tight border-y border-brand-edge bg-brand-surface">
            <div className="container-wide">
              <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-brand-edge bg-brand-edge sm:grid-cols-2 lg:grid-cols-4">
                {content.capabilities.map((capability, i) => (
                  <li
                    key={capability.name}
                    className="group relative bg-white p-7 transition-colors duration-500 ease-brand hover:bg-brand-surface"
                    data-reveal
                    style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand-spectrum transition-transform duration-500 ease-brand group-hover:scale-x-100"
                    />
                    {capability.tag && <span className="eyebrow">{capability.tag}</span>}
                    <p className="mt-5 text-[1.0625rem] font-semibold leading-snug tracking-tight text-brand-graphite">
                      {capability.name}
                    </p>
                    <p className="mt-2.5 text-[13px] leading-relaxed text-brand-silver">
                      {capability.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── Closing sections, on the dark ground ───────────────────────── */}
        {closingSections.length > 0 && (
          <section className="on-dark grain relative overflow-hidden bg-brand-graphite">
            <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-50" />
            <div className="container-wide relative section">
              <div className="grid gap-x-16 gap-y-14 lg:grid-cols-2">
                {closingSections.map((section, i) => (
                  <div
                    key={section.heading}
                    data-reveal
                    style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
                  >
                    <h2 className="text-display-sm text-white">{section.heading}</h2>
                    <p className="mt-5 text-[15px] leading-relaxed text-brand-mist/70">
                      {section.body}
                    </p>
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="mt-6 space-y-2.5">
                        {section.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-brand-mist/60"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-brand-electric-bright"
                            />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {content.relatedRoutes && content.relatedRoutes.length > 0 && (
                <div className="mt-16 border-t border-brand-edge-dark pt-10" data-reveal>
                  <p className="eyebrow eyebrow-dark">Explore further</p>
                  <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                    {content.relatedRoutes.map((href) => (
                      <li key={href}>
                        <Link
                          href={href}
                          className="group inline-flex items-center gap-1.5 text-[13.5px] font-medium text-brand-mist/70 transition-colors hover:text-white"
                        >
                          {href
                            .replace(/^\//, '')
                            .replace(/-/g, ' ')
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                          <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 ease-brand group-hover:translate-x-0 group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {content.faqs && content.faqs.length > 0 && <FAQAccordion faqs={content.faqs} />}

        <ProposalSection
          headline="Start a conversation"
          subheadline="Tell us what the estate is and we will tell you what it needs — beginning with a survey, not a price."
        />
      </main>
      <Footer />
    </div>
  );
}
