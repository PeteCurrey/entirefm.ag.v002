'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck, Clock, Share2, Tag, Building2 } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import type { NewsArticle } from '@/server/news/types';

interface TemplateNewsArticleProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
}

export function TemplateNewsArticle({ article, relatedArticles }: TemplateNewsArticleProps) {
  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col justify-between pt-16 sm:pt-20">
      
      {/* Header Bar */}
      <header className="border-b border-neutral-200 bg-white py-4">
        <div className="container-wide flex items-center justify-between text-xs font-normal">
          <Link
            href="/lobby/news"
            className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>FM News Desk</span>
          </Link>

          <div className="flex items-center gap-2 text-neutral-400">
            <span className="uppercase">{article.category.replace('-', ' ')}</span>
            <span>·</span>
            <span>{article.readingTimeMinutes} min read</span>
          </div>
        </div>
      </header>

      {/* Main Article Spread */}
      <main className="container-wide py-12 sm:py-16 max-w-4xl mx-auto space-y-10">
        
        {/* Article Meta Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-brand-electric font-semibold uppercase tracking-widest">
            <span>{article.category.replace('-', ' ')}</span>
            <span>·</span>
            <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-neutral-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg font-light text-neutral-600 leading-relaxed pt-2">
            {article.standfirst}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 text-xs text-neutral-500 font-normal">
            <div>
              Source: <span className="text-neutral-800 font-medium">{article.sourceName}</span>
              {article.sourceUrl && (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-brand-electric hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Verify Original Notice</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              {article.topics.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-sm bg-neutral-100 text-neutral-600 text-[11px]">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Photographic Visual Plate */}
        <div className="relative w-full h-[340px] sm:h-[440px] rounded-sm overflow-hidden bg-neutral-900">
          <Image
            src={article.provenance.imageUrl}
            alt={article.provenance.altText || article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover brightness-90"
          />
          {article.provenance.credit && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-sm text-[10px] font-normal text-white/70">
              Image: {article.provenance.credit}
            </div>
          )}
        </div>

        {/* EntireFM Editorial Viewpoint / Why It Matters Box */}
        {article.whyItMatters && (
          <div className="bg-white border-l-4 border-brand-electric p-6 sm:p-7 rounded-sm shadow-subtle space-y-2 border border-neutral-200/80">
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-electric font-semibold block">
              ENTIREFM EDITORIAL INTERPRETATION · WHY IT MATTERS FOR FM
            </span>
            <p className="text-sm sm:text-base font-light text-neutral-800 leading-relaxed">
              {article.whyItMatters}
            </p>
          </div>
        )}

        {/* Article Body */}
        <div className="space-y-6 text-base font-light text-neutral-700 leading-relaxed bg-white p-8 sm:p-10 rounded-sm border border-neutral-200/80">
          {article.bodyParagraphs && article.bodyParagraphs.length > 0 ? (
            article.bodyParagraphs.map((para, idx) => <p key={idx}>{para}</p>)
          ) : (
            <p>{article.standfirst}</p>
          )}

          {article.contractValue && (
            <div className="mt-6 pt-6 border-t border-neutral-100 grid sm:grid-cols-3 gap-4 text-xs font-normal">
              <div>
                <span className="text-neutral-400 block mb-1">CONTRACT VALUE</span>
                <span className="text-sm text-neutral-900 font-semibold">{article.contractValue}</span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-1">CLIENT / ESTATE</span>
                <span className="text-sm text-neutral-900">{article.contractClient}</span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-1">TERM</span>
                <span className="text-sm text-neutral-900">{article.contractTermYears} Years</span>
              </div>
            </div>
          )}
        </div>

        {/* Related Discussions or Resources */}
        {article.relatedDiscussionSlug && (
          <div className="bg-[#FAF9F7] border border-neutral-200 p-6 rounded-sm flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-brand-electric block mb-1">
                COMMUNITY DISCUSSION
              </span>
              <p className="text-sm font-medium text-neutral-900">
                Compare notes with fellow FM duty holders in The Lobby Roundtable
              </p>
            </div>
            <Link
              href={`/lobby/community/discussion/${article.relatedDiscussionSlug}`}
              className="px-4 py-2 bg-neutral-900 text-white rounded-sm text-xs font-medium uppercase tracking-wider hover:bg-brand-electric transition-colors shrink-0"
            >
              Join Discussion &rarr;
            </Link>
          </div>
        )}

        {/* Related Articles Strip */}
        {relatedArticles.length > 0 && (
          <div className="pt-10 border-t border-neutral-200 space-y-6">
            <h3 className="text-xl font-light text-neutral-900">
              Related Industry Dispatches
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/lobby/news/article/${rel.slug}`}
                  className="bg-white p-5 rounded-sm border border-neutral-200 hover:border-neutral-400 transition-colors group block space-y-2"
                >
                  <span className="text-[10px] font-medium text-brand-electric uppercase tracking-wider block">
                    {rel.category.replace('-', ' ')}
                  </span>
                  <h4 className="text-sm font-light text-neutral-900 group-hover:text-brand-electric leading-snug">
                    {rel.title}
                  </h4>
                  <span className="text-xs text-neutral-400 font-normal block pt-1">
                    {new Date(rel.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
