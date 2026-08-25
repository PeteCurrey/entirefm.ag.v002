'use client';

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
import { NewsletterSignupSection, NewsletterInlineCard } from '@/components/newsletter/NewsletterSignupSection';
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

const BLOG_TOPICS = [
  'All Topics',
  'AI & Technology',
  'Maintenance & PPM',
  'Compliance & Safety',
  'Engineering',
  'FM Strategy',
  'Procurement',
];

function BlogIndex({ route, content }: TemplateProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('All Topics');

  const breadcrumbs = content.breadcrumbs ?? [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: route.path },
  ];

  const filteredPosts = React.useMemo(() => {
    if (selectedCategory === 'All Topics') return POSTS_BY_DATE;
    return POSTS_BY_DATE.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const featuredPost = POSTS_BY_DATE[0];
  const regularPosts = selectedCategory === 'All Topics' ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header solid />
      <main id="main" className="flex-1">
        <Breadcrumbs items={breadcrumbs} />

        {/* Editorial Hero Header */}
        <section className="on-dark relative isolate overflow-hidden bg-brand-graphite pt-20 pb-16 sm:pt-24 sm:pb-20 border-b border-brand-edge-dark">
          <div className="facet-rule pointer-events-none absolute inset-0 opacity-40" />
          <div className="container-custom relative max-w-4xl">
            <p className="eyebrow eyebrow-dark">INSIGHTS</p>
            <h1 className="mt-4 text-display-lg text-white">Facilities Management Insights</h1>
            <p className="mt-5 text-[1.125rem] leading-relaxed text-brand-mist/85 font-light">
              Practical thinking on buildings, maintenance, compliance, technology and the changing FM profession.
            </p>

            {/* Category Filter Pills */}
            <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-white/10">
              {BLOG_TOPICS.map((topic) => {
                const active = selectedCategory === topic;
                return (
                  <button
                    key={topic}
                    onClick={() => setSelectedCategory(topic)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-normal transition-all ${
                      active
                        ? 'bg-brand-electric text-brand-void font-light shadow-sm'
                        : 'bg-white/5 text-brand-mist hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Lead Story (Only shown when viewing 'All Topics') */}
        {selectedCategory === 'All Topics' && featuredPost && (
          <section className="bg-brand-carbon border-b border-brand-edge-dark py-12 sm:py-16">
            <div className="container-custom">
              <div className="mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-pink-400 font-light">
                  Featured Analysis
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-brand-graphite border border-brand-edge-dark rounded-sm overflow-hidden p-6 sm:p-8 group hover:border-pink-500/40 transition-all">
                <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden rounded-sm bg-brand-void">
                  {IMAGES[featuredPost.imageKey] && (
                    <Image
                      src={IMAGES[featuredPost.imageKey].src}
                      alt={featuredPost.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-brand-mist/60 mb-3 font-mono">
                      <span className="text-pink-400 font-light">{featuredPost.category}</span>
                      <span>·</span>
                      <time dateTime={featuredPost.published}>{longDate(featuredPost.published)}</time>
                      <span>·</span>
                      <span>{readingTime(featuredPost)} min read</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extralight text-white leading-tight group-hover:text-pink-300 transition-colors">
                      <Link href={featuredPost.path}>
                        {featuredPost.title}
                      </Link>
                    </h2>
                    <p className="mt-4 text-sm sm:text-base leading-relaxed text-brand-mist/80">
                      {featuredPost.dek}
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-brand-edge-dark flex items-center justify-between">
                    <span className="text-xs text-brand-mist/60">By EntireFM Technical Team</span>
                    <Link
                      href={featuredPost.path}
                      className="inline-flex items-center gap-2 text-xs font-normal text-pink-400 group-hover:text-pink-300 transition-colors"
                    >
                      Read full analysis <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Regular Article Grid */}
        <section className="section bg-white py-16">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-edge">
              <h3 className="text-base font-light text-brand-graphite">
                {selectedCategory === 'All Topics' ? 'Latest Articles & Guides' : `${selectedCategory} (${filteredPosts.length})`}
              </h3>
              <span className="text-xs text-brand-slate font-mono">
                Showing {regularPosts.length} {regularPosts.length === 1 ? 'article' : 'articles'}
              </span>
            </div>

            <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post, i) => {
                const image = IMAGES[post.imageKey];
                return (
                  <li
                    key={post.path}
                    data-reveal
                    style={{ '--reveal-delay': `${(i % 3) * 80}ms` } as React.CSSProperties}
                  >
                    <Link href={post.path} className="group block h-full flex flex-col justify-between p-5 rounded-sm border border-brand-edge hover:border-brand-electric/60 hover:shadow-md transition-all">
                      <div>
                        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-brand-carbon mb-4">
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
                        <p className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-brand-silver font-mono">
                          <span className="text-brand-electric font-light">{post.category}</span>
                          <span aria-hidden="true">·</span>
                          <time dateTime={post.published}>{longDate(post.published)}</time>
                        </p>
                        <h2 className="mt-2.5 text-[1.125rem] font-extralight leading-snug tracking-[-0.02em] text-brand-graphite transition-colors duration-300 group-hover:text-brand-electric">
                          {post.title}
                        </h2>
                        <p className="mt-2 text-[13px] leading-relaxed text-brand-slate line-clamp-3">
                          {post.dek}
                        </p>
                      </div>
                      <div className="mt-5 pt-3 border-t border-brand-edge flex items-center justify-between text-[12px]">
                        <span className="text-brand-silver font-mono">{readingTime(post)} min read</span>
                        <span className="inline-flex items-center gap-1 font-light text-brand-graphite group-hover:text-brand-electric transition-colors">
                          Read article
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Evergreen Guides & Resources Banner */}
        <section className="bg-brand-carbon border-t border-brand-edge-dark py-16 text-white">
          <div className="container-custom">
            <div className="max-w-3xl mb-8">
              <span className="eyebrow eyebrow-dark">Evergreen Knowledge Estate</span>
              <h2 className="text-2xl font-extralight text-white mt-2">
                Looking for Tools, Glossaries or Compliance Guides?
              </h2>
              <p className="text-xs text-brand-mist/70 mt-1">
                EntireFM provides free, ungated tools and technical guidance for facilities leaders.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/resources/ai-in-facilities-management" className="p-4 rounded-sm bg-brand-graphite border border-brand-edge-dark hover:border-pink-500/50 transition-all block group">
                <span className="text-[10px] uppercase font-light text-pink-400 font-mono">Resource Pillar</span>
                <h4 className="text-sm font-normal text-white mt-1 group-hover:text-pink-300">AI in Facilities Management →</h4>
                <p className="text-xs text-brand-mist/60 mt-1">Complete practical whitepaper on ML, CAFM, and predictive maintenance.</p>
              </Link>
              <Link href="/tools/ppm-schedule-builder" className="p-4 rounded-sm bg-brand-graphite border border-brand-edge-dark hover:border-brand-electric/50 transition-all block group">
                <span className="text-[10px] uppercase font-light text-emerald-400 font-mono">Interactive Tool</span>
                <h4 className="text-sm font-normal text-white mt-1 group-hover:text-brand-electric-bright">PPM Schedule Builder →</h4>
                <p className="text-xs text-brand-mist/60 mt-1">Generate an asset-led planned preventative maintenance matrix.</p>
              </Link>
              <Link href="/compliance" className="p-4 rounded-sm bg-brand-graphite border border-brand-edge-dark hover:border-brand-electric/50 transition-all block group">
                <span className="text-[10px] uppercase font-light text-blue-400 font-mono">Statutory Hub</span>
                <h4 className="text-sm font-normal text-white mt-1 group-hover:text-brand-electric-bright">Compliance Centre →</h4>
                <p className="text-xs text-brand-mist/60 mt-1">Clear guidance separating legal statutory requirements from standards.</p>
              </Link>
              <Link href="/facilities-management-glossary" className="p-4 rounded-sm bg-brand-graphite border border-brand-edge-dark hover:border-brand-electric/50 transition-all block group">
                <span className="text-[10px] uppercase font-light text-amber-400 font-mono">Reference</span>
                <h4 className="text-sm font-normal text-white mt-1 group-hover:text-brand-electric-bright">FM Glossary A–Z →</h4>
                <p className="text-xs text-brand-mist/60 mt-1">Plain-English definitions of over 50 essential FM technical terms.</p>
              </Link>
            </div>
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
                <span className="font-normal text-white">EntireFM</span>
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

              {/* In-Article Newsletter Briefing Card */}
              <NewsletterInlineCard
                title="Read EntireFM without checking EntireFM"
                subtitle="A concise weekly briefing covering the facilities management developments worth knowing about."
                signupPage={route.path}
              />
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
                        <h3 className="mt-2 text-[1rem] font-light leading-snug tracking-[-0.02em] text-brand-graphite transition-colors duration-300 group-hover:text-brand-electric">
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

        {/* Blog Article Footer Newsletter Signup */}
        <NewsletterSignupSection
          signupPage={route.path}
          sourceContext="article_footer"
        />

        <ProposalSection
          headline="Request a facilities management review"
          subheadline="A survey of what your estate is obliged to do, what it currently evidences, and where the gap is."
        />
      </main>
      <Footer />
    </div>
  );
}
