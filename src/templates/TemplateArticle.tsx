'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { POSTS_BY_DATE, POST_BY_PATH, readingTime } from '@/content/blog/posts';
import { PRIMARY_NAV, FOOTER_NAV } from '@/config/navigation';
import editorial from '@/config/location-images.json';
import { NewsletterSignupSection, NewsletterInlineCard } from '@/components/newsletter/NewsletterSignupSection';
import type { TemplateProps } from './types';

type EditorialManifest = { editorial: Record<string, { src: string; alt: string }> };
const IMAGES = (editorial as EditorialManifest).editorial ?? {};

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
    <div className="bg-[#060A14] text-white min-h-screen flex flex-col font-sans selection:bg-brand-pink selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC HERO (85svh)                                                 */}
        {/* ========================================================================= */}
        <section className="relative min-h-[85svh] lg:min-h-[88svh] flex items-center justify-center bg-[#060A14] overflow-hidden pt-28 pb-16 sm:py-24 border-b border-brand-edge-dark">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/editorial/entirefm-client-review-2000w.webp"
              alt="EntireFM Insights and Articles"
              fill
              priority
              className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.1]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/80 to-[#060A14]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060A14] via-[#060A14]/90 to-transparent" />
          </div>

          <div className="container-custom relative z-10 w-full">
            <div className="max-w-4xl space-y-6">
              
              <div className="mb-2">
                <Breadcrumbs items={breadcrumbs} className="text-slate-300 font-light text-xs" />
              </div>

              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm bg-white/10 backdrop-blur-md border border-white/15">
                <span className="w-2 h-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-white/90 font-medium">
                  Editorial Insights &amp; Analysis
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.06]">
                Facilities Management <br />
                <span className="font-light text-hero-pink">
                  Insights &amp; Analysis.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-3xl">
                Practical, engineer-led analysis on commercial property maintenance, statutory compliance governance, HVAC technology, and the evolving UK facilities management landscape.
              </p>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/15">
                {BLOG_TOPICS.map((topic) => {
                  const active = selectedCategory === topic;
                  return (
                    <button
                      key={topic}
                      onClick={() => setSelectedCategory(topic)}
                      className={`px-3.5 py-2 rounded-sm text-xs font-medium transition-all ${
                        active
                          ? 'bg-brand-pink text-white shadow-elevated'
                          : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. FEATURED LEAD ARTICLE                                                  */}
        {/* ========================================================================= */}
        {selectedCategory === 'All Topics' && featuredPost && (
          <section className="py-20 bg-white text-slate-900 border-b border-slate-200">
            <div className="container-custom">
              <div className="rounded-sm border border-slate-200 bg-slate-50 overflow-hidden shadow-elevated">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-slate-500 font-medium">
                        <span className="text-brand-pink">{featuredPost.category}</span>
                        <span>·</span>
                        <time dateTime={featuredPost.published}>{longDate(featuredPost.published)}</time>
                        <span>·</span>
                        <span>{readingTime(featuredPost)} min read</span>
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                        <Link href={featuredPost.path} className="hover:text-brand-pink transition-colors">
                          {featuredPost.title}
                        </Link>
                      </h2>
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                        {featuredPost.dek}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-light">By EntireFM Technical Team</span>
                      <Link
                        href={featuredPost.path}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-brand-pink hover:text-slate-900 transition-colors"
                      >
                        <span>Read Full Analysis</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                  <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-slate-950">
                    {IMAGES[featuredPost.imageKey] && (
                      <Image
                        src={IMAGES[featuredPost.imageKey].src}
                        alt={featuredPost.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 3. ARTICLES GRID                                                          */}
        {/* ========================================================================= */}
        <section className="py-24 bg-[#0B1220] text-white border-b border-brand-edge-dark">
          <div className="container-custom space-y-12">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-2xl font-light text-white tracking-tight">
                {selectedCategory === 'All Topics' ? 'Latest Publications' : `${selectedCategory} (${filteredPosts.length})`}
              </h3>
              <span className="text-xs text-slate-400 font-light">
                {regularPosts.length} {regularPosts.length === 1 ? 'Article' : 'Articles'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => {
                const image = IMAGES[post.imageKey];
                return (
                  <Link
                    key={post.path}
                    href={post.path}
                    className="group rounded-sm bg-brand-carbon border border-brand-edge-dark overflow-hidden hover:border-brand-pink transition-all flex flex-col justify-between shadow-elevated space-y-6"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                        {image && (
                          <Image
                            src={image.src}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                          />
                        )}
                        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-sm text-[10px] text-brand-pink border border-white/15 font-medium uppercase tracking-wider">
                          {post.category}
                        </div>
                      </div>

                      <div className="p-6 sm:p-8 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-light">
                          <time dateTime={post.published}>{longDate(post.published)}</time>
                          <span>·</span>
                          <span>{readingTime(post)} min</span>
                        </div>
                        <h4 className="text-xl font-light text-white group-hover:text-brand-pink transition-colors leading-snug">
                          {post.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light line-clamp-3">
                          {post.dek}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-4 border-t border-brand-edge-dark flex items-center justify-between text-xs text-slate-400 font-light">
                      <span>Read article</span>
                      <ArrowRight className="h-3.5 w-3.5 text-brand-pink group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </section>

        <NewsletterSignupSection />
        <ProposalSection />
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
    <div className="bg-[#060A14] text-white min-h-screen flex flex-col font-sans selection:bg-brand-pink selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC ARTICLE HERO (85svh)                                         */}
        {/* ========================================================================= */}
        <section className="relative min-h-[85svh] lg:min-h-[88svh] flex items-center justify-center bg-[#060A14] overflow-hidden pt-28 pb-16 sm:py-24 border-b border-brand-edge-dark">
          <div className="absolute inset-0 z-0">
            {image ? (
              <Image
                src={image.src}
                alt={image.alt || content.h1}
                fill
                priority
                className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.1]"
                sizes="100vw"
              />
            ) : (
              <Image
                src="/images/editorial/entirefm-client-review-2000w.webp"
                alt={content.h1}
                fill
                priority
                className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.1]"
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/80 to-[#060A14]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060A14] via-[#060A14]/90 to-transparent" />
          </div>

          <div className="container-custom relative z-10 w-full">
            <div className="max-w-4xl space-y-6">
              
              <div className="mb-2">
                <Breadcrumbs items={breadcrumbs} className="text-slate-300 font-light text-xs" />
              </div>

              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm bg-white/10 backdrop-blur-md border border-white/15">
                <span className="w-2 h-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-white/90 font-medium">
                  {content.eyebrow || 'Technical Analysis'}
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.06]">
                {content.h1}
              </h1>

              <p className="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-3xl">
                {content.heroIntro}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-300 font-light border-t border-white/15">
                <span className="text-white font-medium">EntireFM Technical Team</span>
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
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-brand-pink" />
                    {minutes} min read
                  </span>
                )}
              </div>

            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. LONG-FORM ARTICLE READING FLOW                                         */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
          <div className="container-custom max-w-3xl space-y-16">
            
            <div className="space-y-12">
              {content.sections?.map((section, i) => (
                <div key={i} className="space-y-4">
                  {section.heading && (
                    <h2 className="text-2xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                      {section.heading}
                    </h2>
                  )}
                  {section.body && (
                    <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-light">
                      {section.body}
                    </p>
                  )}
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="space-y-2.5 pt-2">
                      {section.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 font-light">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {content.relatedRoutes && content.relatedRoutes.length > 0 && (
              <div className="pt-10 border-t border-slate-200 space-y-4">
                <span className="text-xs uppercase tracking-widest text-brand-pink font-medium block">
                  Referenced in this article
                </span>
                <div className="flex flex-wrap gap-2">
                  {content.relatedRoutes.map((href) => (
                    <Link
                      key={href}
                      href={href}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm border border-slate-200 bg-slate-50 text-xs font-light text-slate-700 hover:border-brand-pink hover:text-brand-pink transition-all"
                    >
                      <span>{label(href)}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* In-Article Newsletter Briefing Card */}
            <NewsletterInlineCard
              title="Read EntireFM Without Checking EntireFM"
              subtitle="A concise weekly briefing covering the facilities management developments worth knowing about."
              signupPage={route.path}
            />

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. RELATED READING                                                        */}
        {/* ========================================================================= */}
        {others.length > 0 && (
          <section className="py-24 bg-[#0B1220] text-white border-b border-brand-edge-dark">
            <div className="container-custom space-y-12">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-2xl font-light text-white tracking-tight">
                  Further Reading &amp; Analysis
                </h3>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-medium text-brand-pink hover:text-white transition-colors"
                >
                  <span>All Articles</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {others.map((other) => (
                  <Link
                    key={other.path}
                    href={other.path}
                    className="p-8 rounded-sm bg-brand-carbon border border-brand-edge-dark hover:border-brand-pink transition-all space-y-3 flex flex-col justify-between shadow-elevated"
                  >
                    <div className="space-y-2">
                      <span className="text-[11px] uppercase tracking-wider text-brand-pink font-medium block">
                        {other.category}
                      </span>
                      <h4 className="text-xl font-light text-white leading-snug">
                        {other.title}
                      </h4>
                      <p className="text-xs text-slate-300 font-light leading-relaxed line-clamp-3">
                        {other.dek}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-brand-edge-dark text-xs text-slate-400 font-light flex items-center justify-between">
                      <span>Read article</span>
                      <ArrowRight className="h-3.5 w-3.5 text-brand-pink" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <NewsletterSignupSection
          signupPage={route.path}
          sourceContext="article_footer"
        />

        <ProposalSection
          headline="Request a Facilities Management Review"
          subheadline="A detailed survey of what your commercial estate is obliged to deliver, what is evidenced, and where the risk gaps lie."
        />
      </main>

      <Footer />
    </div>
  );
}
