import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { POSTS_BY_DATE, POST_BY_PATH, readingTime } from '@/content/blog/posts';
import { PRIMARY_NAV, FOOTER_NAV } from '@/config/navigation';
import editorial from '@/config/location-images.json';
import type { TemplateProps } from './types';

/**
 * ARTICLES AND THE BLOG INDEX
 * ===========================
 * One template, two modes: the index when the route is a blog listing, the
 * article otherwise.
 *
 * WHAT THIS REPLACED
 * ------------------
 * The previous version rendered `badge-gold` — a class from the discarded gold
 * design system that nothing defines — used `text-slate-*` outside the brand
 * palette, titleised its related links from the slug, and showed a byline with
 * no date because no date existed in the data.
 *
 * DATES ARE SHOWN, NOT JUST EMITTED
 * ---------------------------------
 * Publication and revision dates appear on the page as well as in the Article
 * schema. An article about statutory obligations that does not say when it was
 * written is asking to be trusted on a subject where currency is the whole
 * question — and the reader has no way to check whether it predates a change
 * in the legislation it describes.
 */

type EditorialManifest = { editorial: Record<string, { src: string; alt: string }> };
const IMAGES = (editorial as EditorialManifest).editorial ?? {};

/** Real page names for internal links, rather than a titleised slug. */
const NAV_LABELS: Record<string, string> = Object.fromEntries(
  [
    ...PRIMARY_NAV.flatMap((s) => s.columns.flatMap((c) => c.links)),
    ...FOOTER_NAV.flatMap((c) => c.links),
  ].map((link) => [link.href, link.label])
);

function label(href: string) {
  return (
    NAV_LABELS[href] ??
    href.replace(/^\//, '').replace(/\//g, ' · ').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function TemplateArticle({ route, content }: TemplateProps) {
  const isIndex = Boolean(content.customData?.isBlogIndex);
  return isIndex ? (
    <BlogIndex route={route} content={content} />
  ) : (
    <Article route={route} content={content} />
  );
}

/* ── Index ──────────────────────────────────────────────────────────────── */

function BlogIndex({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs ?? [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: route.path },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header solid />
      <main id="main" className="flex-1">
        <Breadcrumbs items={breadcrumbs} />

        <section className="on-dark relative isolate overflow-hidden bg-brand-graphite py-20 sm:py-24">
          <div className="facet-rule pointer-events-none absolute inset-0 opacity-40" />
          <div className="container-custom relative max-w-3xl">
            <p className="eyebrow eyebrow-dark">{content.eyebrow}</p>
            <h1 className="mt-5 text-display-lg text-white">{content.h1}</h1>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-brand-mist/75">
              {content.heroIntro}
            </p>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container-custom">
            <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {POSTS_BY_DATE.map((post, i) => {
                const image = IMAGES[post.imageKey];
                return (
                  <li
                    key={post.path}
                    data-reveal
                    style={{ '--reveal-delay': `${(i % 3) * 80}ms` } as React.CSSProperties}
                  >
                    <Link href={post.path} className="group block h-full">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-brand-carbon">
                        {image && (
                          <Image
                            src={image.src}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-[900ms] ease-brand group-hover:scale-[1.06]"
                          />
                        )}
                      </div>
                      <p className="mt-5 flex items-center gap-3 text-[10.5px] uppercase tracking-[0.16em] text-brand-silver">
                        <span className="text-brand-electric">{post.category}</span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={post.published}>{longDate(post.published)}</time>
                      </p>
                      <h2 className="mt-3 text-[1.125rem] font-medium leading-snug tracking-[-0.02em] text-brand-graphite transition-colors duration-300 group-hover:text-brand-electric">
                        {post.title}
                      </h2>
                      <p className="mt-2.5 text-[13.5px] leading-relaxed text-brand-silver">
                        {post.dek}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-graphite">
                        Read
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <ProposalSection
          headline="Request a facilities management review"
          subheadline="A survey of what your estate is obliged to do, what it currently evidences, and where the gap is."
        />
      </main>
      <Footer />
    </div>
  );
}

/* ── Article ────────────────────────────────────────────────────────────── */

function Article({ route, content }: TemplateProps) {
  const post = POST_BY_PATH[route.path];
  const published = (content.customData?.datePublished as string) ?? post?.published;
  const modified = (content.customData?.dateModified as string) ?? post?.updated;
  const minutes = post ? readingTime(post) : (content.customData?.readingTime as number) ?? null;
  const imageKey = (content.customData?.imageKey as string) ?? post?.imageKey;
  const image = imageKey ? IMAGES[imageKey] : null;

  const breadcrumbs = content.breadcrumbs ?? [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: content.h1, url: route.path },
  ];

  const others = POSTS_BY_DATE.filter((p) => p.path !== route.path).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header solid />
      <main id="main" className="flex-1">
        <Breadcrumbs items={breadcrumbs} />

        <article>
          <header className="on-dark relative isolate overflow-hidden bg-brand-graphite py-16 sm:py-20">
            <div className="facet-rule pointer-events-none absolute inset-0 opacity-40" />
            <div className="container-custom relative max-w-3xl">
              <p className="eyebrow eyebrow-dark">{content.eyebrow}</p>
              <h1 className="mt-5 text-display-lg text-white">{content.h1}</h1>
              <p className="mt-6 text-[1.0625rem] leading-relaxed text-brand-mist/75">
                {content.heroIntro}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/12 pt-5 text-[12.5px] text-brand-mist/60">
                <span className="font-medium text-white">EntireFM</span>
                {published && (
                  <span>
                    Published <time dateTime={published}>{longDate(published)}</time>
                  </span>
                )}
                {modified && modified !== published && (
                  <span>
                    Updated <time dateTime={modified}>{longDate(modified)}</time>
                  </span>
                )}
                {minutes && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {minutes} min read
                  </span>
                )}
              </div>
            </div>
          </header>

          {image && (
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-brand-carbon">
              <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" priority />
            </div>
          )}

          <div className="section-tight bg-white">
            <div className="container-custom max-w-[46rem]">
              {content.sections?.map((section, i) => (
                <section key={i} className={i === 0 ? '' : 'mt-11'} data-reveal>
                  {section.heading && (
                    <h2 className="text-display-sm text-brand-graphite">{section.heading}</h2>
                  )}
                  {section.body && (
                    <p
                      className={`text-[1.0625rem] leading-[1.75] text-brand-slate ${
                        section.heading ? 'mt-4' : i === 0 ? 'text-[1.1875rem] leading-[1.7]' : ''
                      }`}
                    >
                      {section.body}
                    </p>
                  )}
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-5 space-y-3">
                      {section.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex gap-3 text-[15px] leading-relaxed text-brand-slate"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-brand-electric"
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {content.relatedRoutes && content.relatedRoutes.length > 0 && (
                <div className="mt-14 border-t border-brand-edge pt-8">
                  <p className="eyebrow">Referenced in this article</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {content.relatedRoutes.map((href) => (
                      <li key={href}>
                        <Link
                          href={href}
                          className="inline-flex items-center gap-1.5 rounded-sm border border-brand-edge px-3 py-2 text-[12.5px] text-brand-slate transition-colors hover:border-brand-electric/60 hover:text-brand-electric"
                        >
                          {label(href)}
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {others.length > 0 && (
            <section className="section-tight border-t border-brand-edge bg-brand-surface">
              <div className="container-custom">
                <p className="eyebrow">More reading</p>
                <ul className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
                  {others.map((other) => (
                    <li key={other.path}>
                      <Link href={other.path} className="group block">
                        <p className="text-[10.5px] uppercase tracking-[0.16em] text-brand-electric">
                          {other.category}
                        </p>
                        <h3 className="mt-2 text-[1rem] font-medium leading-snug tracking-[-0.02em] text-brand-graphite transition-colors duration-300 group-hover:text-brand-electric">
                          {other.title}
                        </h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-brand-silver">
                          {other.dek}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/blog" className="link-underline mt-9 inline-flex text-sm">
                  All articles
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>
          )}
        </article>

        <ProposalSection
          headline="Request a facilities management review"
          subheadline="A survey of what your estate is obliged to do, what it currently evidences, and where the gap is."
        />
      </main>
      <Footer />
    </div>
  );
}
