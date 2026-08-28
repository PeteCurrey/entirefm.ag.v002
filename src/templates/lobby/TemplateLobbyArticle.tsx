'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';
import type { LobbyArticle } from '@/lib/lobby/types';
import { getRelatedArticles, getTopicBySlug } from '@/lib/lobby/repository';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  CheckCircle2,
  ShieldAlert,
  Wrench,
  HelpCircle,
  FileText,
  Compass,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

interface TemplateLobbyArticleProps {
  article: LobbyArticle;
}

export function TemplateLobbyArticle({ article }: TemplateLobbyArticleProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fieldRevealed, setFieldRevealed] = useState(false);

  const relatedArticles = getRelatedArticles(article, 3);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'The Lobby', url: '/lobby' },
    { name: article.title, url: `/lobby/${article.slug}` },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white text-brand-graphite">
      <main id="main" className="flex-1 pt-16 sm:pt-20">
        {/* Navigation & Context Bar */}
        <div className="border-b border-brand-edge bg-brand-surface py-3.5">
          <div className="container-wide flex flex-wrap items-center justify-between gap-3 text-xs">
            <Link
              href="/lobby"
              className="inline-flex items-center gap-1.5 text-brand-slate hover:text-brand-electric font-light transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to The Lobby</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-brand-silver font-light">
              <span className="uppercase text-[10.5px] tracking-wider text-brand-electric font-medium">
                {article.franchise.replace(/-/g, ' ')}
              </span>
              <span>·</span>
              <span>Published {article.publishedAt}</span>
            </div>
          </div>
        </div>

        {/* Article Masthead / Header */}
        <header className="py-10 sm:py-14 lg:py-16 bg-white border-b border-brand-edge">
          <div className="container-custom space-y-6">
            {/* Franchise & Topic Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-sm bg-brand-graphite text-white text-[11px] font-mono tracking-wider uppercase">
                {article.franchise.replace(/-/g, ' ')}
              </span>

              {article.topics.map((tSlug) => {
                const topic = getTopicBySlug(tSlug);
                return (
                  <Link
                    key={tSlug}
                    href={`/lobby/topic/${tSlug}`}
                    className="inline-flex items-center px-2.5 py-1 rounded-sm bg-brand-surface hover:bg-brand-edge text-brand-slate text-[11px] font-light border border-brand-edge transition-colors"
                  >
                    #{topic ? topic.name : tSlug}
                  </Link>
                );
              })}
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-brand-graphite leading-[1.1] tracking-tight">
              {article.title}
            </h1>

            {/* Standfirst */}
            <p className="text-lg sm:text-xl font-light text-brand-slate leading-relaxed text-pretty">
              {article.standfirst}
            </p>

            {/* Author & Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-brand-edge text-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-graphite text-white flex items-center justify-center font-mono text-xs">
                  EFM
                </div>
                <div>
                  <p className="font-normal text-brand-graphite">{article.author.name}</p>
                  <p className="text-brand-silver font-light">{article.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-brand-silver font-light">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readingTimeMinutes} min read
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.publishedAt}
                </span>

                <div className="flex items-center gap-2 border-l border-brand-edge pl-4">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-brand-surface hover:bg-brand-edge text-brand-slate transition-colors"
                    aria-label="Copy article link"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Share'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSaved(!saved)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-brand-surface hover:bg-brand-edge text-brand-slate transition-colors"
                    aria-label="Bookmark article"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-brand-electric text-brand-electric' : ''}`} />
                    <span>{saved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Image (if present) */}
        {article.heroImage && (
          <div className="bg-brand-surface py-6 border-b border-brand-edge">
            <div className="container-custom">
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm bg-brand-carbon">
                <Image
                  src={article.heroImage}
                  alt={article.heroImageAlt || article.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  className="object-cover"
                  priority={true}
                />
              </div>
              {article.heroImageAlt && (
                <p className="mt-2 text-center text-xs font-light text-brand-silver">
                  {article.heroImageAlt}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main Article Body & Specialist Layout */}
        <div className="py-12 sm:py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto space-y-10">
              {/* ───────────────────────────────────────────────────────────── */}
              {/* SPECIALIST FRANCHISE: COMPLIANCE WATCH QUADRANT               */}
              {/* ───────────────────────────────────────────────────────────── */}
              {article.complianceData && (
                <div className="rounded-sm border border-brand-edge-dark bg-brand-carbon text-white p-6 sm:p-8 space-y-6 shadow-elevated">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400">
                        STATUTORY COMPLIANCE TRANSLATION
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {article.complianceData.complianceClassification}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="border-l-2 border-amber-500/60 pl-3.5 py-1 bg-brand-void/50 p-3 rounded-r-sm">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block mb-1">
                        01 · What Changed
                      </span>
                      <p className="text-xs sm:text-[13px] font-light text-brand-mist/90 leading-relaxed">
                        {article.complianceData.whatChanged}
                      </p>
                    </div>

                    <div className="border-l-2 border-brand-electric pl-3.5 py-1 bg-brand-void/50 p-3 rounded-r-sm">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-brand-electric-bright block mb-1">
                        02 · Who It Affects
                      </span>
                      <p className="text-xs sm:text-[13px] font-light text-brand-mist/90 leading-relaxed">
                        {article.complianceData.whoItAffects}
                      </p>
                    </div>

                    <div className="border-l-2 border-emerald-400 pl-3.5 py-1 bg-brand-void/50 p-3 rounded-r-sm">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                        03 · What You Need To Do
                      </span>
                      <p className="text-xs sm:text-[13px] font-light text-brand-mist/90 leading-relaxed">
                        {article.complianceData.whatYouNeedToDo}
                      </p>
                    </div>

                    <div className="border-l-2 border-purple-400 pl-3.5 py-1 bg-brand-void/50 p-3 rounded-r-sm">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 block mb-1">
                        04 · When It Matters
                      </span>
                      <p className="text-xs sm:text-[13px] font-light text-brand-mist/90 leading-relaxed">
                        {article.complianceData.whenItMatters}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] font-mono text-brand-mist/50 border-t border-white/[0.08] flex items-center justify-between">
                    <span>Statute: {article.complianceData.statute}</span>
                    <span>Authority: {article.complianceData.governingBody}</span>
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SPECIALIST FRANCHISE: THE ENGINEER'S NOTE RULE BOX            */}
              {/* ───────────────────────────────────────────────────────────── */}
              {article.engineersNoteData && (
                <div className="rounded-sm border border-brand-edge-dark bg-brand-void text-white p-6 space-y-4 shadow-elevated">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-brand-electric-bright">
                    <Compass className="w-4 h-4" />
                    <span>ENGINEER'S OPERATIONAL RULE</span>
                  </div>
                  <p className="text-sm font-mono text-emerald-300 bg-emerald-950/30 border border-emerald-500/20 p-4 rounded-sm leading-relaxed">
                    {article.engineersNoteData.fieldRule}
                  </p>
                  {article.engineersNoteData.symptom && (
                    <p className="text-xs font-light text-brand-mist/70">
                      <strong className="font-normal text-white">Symptom Diagnosed: </strong>
                      {article.engineersNoteData.symptom}
                    </p>
                  )}
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SPECIALIST FRANCHISE: ASK ENTIREFM ANSWER SUMMARY             */}
              {/* ───────────────────────────────────────────────────────────── */}
              {article.askEntireFMData && (
                <div className="rounded-sm border border-brand-edge bg-brand-surface p-6 space-y-4">
                  <div className="border-b border-brand-edge pb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-brand-silver">
                      Context: {article.askEntireFMData.estateProfile}
                    </span>
                    <h3 className="text-lg font-light text-brand-graphite mt-1">
                      “{article.askEntireFMData.question}”
                    </h3>
                  </div>

                  <div>
                    <span className="text-xs font-medium uppercase text-brand-graphite block mb-1">
                      The Short Answer:
                    </span>
                    <p className="text-sm font-light text-brand-slate leading-relaxed">
                      {article.askEntireFMData.shortAnswer}
                    </p>
                  </div>

                  {article.askEntireFMData.keyAnswerPoints && (
                    <div className="pt-2">
                      <span className="text-xs font-medium uppercase text-brand-graphite block mb-2">
                        Key Information Requirements:
                      </span>
                      <ul className="space-y-2">
                        {article.askEntireFMData.keyAnswerPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs sm:text-[13px] font-light text-brand-slate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-electric shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SPECIALIST FRANCHISE: FROM THE FIELD REVEAL                   */}
              {/* ───────────────────────────────────────────────────────────── */}
              {article.fromTheFieldData && (
                <div className="rounded-sm border border-brand-edge-dark bg-brand-carbon text-white p-6 space-y-4 shadow-elevated">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-brand-electric-bright">
                      Site Defect Diagnosis
                    </span>
                    <button
                      type="button"
                      onClick={() => setFieldRevealed(!fieldRevealed)}
                      className="btn-outline text-xs py-1.5 px-3 text-white border-white/20 hover:bg-white/10"
                    >
                      {fieldRevealed ? 'Hide Diagnosis' : 'Reveal Defect & Remedy'}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-light text-brand-mist/80 leading-relaxed">
                    {article.fromTheFieldData.observation}
                  </p>

                  {fieldRevealed && (
                    <div className="space-y-3 pt-3 border-t border-white/10 animate-rise">
                      <p className="text-xs sm:text-[13px] text-amber-300">
                        <strong className="font-medium text-amber-400">Problem: </strong>
                        {article.fromTheFieldData.problem}
                      </p>
                      <p className="text-xs sm:text-[13px] text-emerald-300">
                        <strong className="font-medium text-emerald-400">Remedial Solution: </strong>
                        {article.fromTheFieldData.technicalExplanation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* EDITORIAL BODY BLOCKS                                         */}
              {/* ───────────────────────────────────────────────────────────── */}
              <div className="space-y-6 pt-2">
                {article.bodyBlocks.map((block, idx) => {
                  switch (block.type) {
                    case 'paragraph':
                      return (
                        <p key={idx} className="text-base sm:text-[17px] font-light text-brand-graphite leading-[1.75] text-pretty">
                          {block.content}
                        </p>
                      );
                    case 'heading2':
                      return (
                        <h2 key={idx} className="text-2xl sm:text-3xl font-extralight text-brand-graphite tracking-tight pt-4">
                          {block.content}
                        </h2>
                      );
                    case 'heading3':
                      return (
                        <h3 key={idx} className="text-xl sm:text-2xl font-light text-brand-graphite tracking-tight pt-2">
                          {block.content}
                        </h3>
                      );
                    case 'keyPoint':
                      return (
                        <div key={idx} className="border-l-2 border-brand-electric bg-brand-surface p-5 rounded-r-sm my-6">
                          <p className="text-sm sm:text-base font-light text-brand-graphite leading-relaxed">
                            {block.content}
                          </p>
                        </div>
                      );
                    case 'pullQuote':
                      return (
                        <blockquote key={idx} className="my-8 border-y border-brand-edge py-6 text-center">
                          <p className="text-xl sm:text-2xl font-extralight italic text-brand-graphite">
                            “{block.content}”
                          </p>
                          {block.quoteAuthor && (
                            <cite className="mt-2 block text-xs font-light text-brand-silver not-italic">
                              — {block.quoteAuthor}
                            </cite>
                          )}
                        </blockquote>
                      );
                    case 'bulletList':
                      return (
                        <ul key={idx} className="space-y-2.5 my-4">
                          {block.items?.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base font-light text-brand-slate leading-relaxed">
                              <span className="h-1.5 w-1.5 rounded-full bg-brand-electric mt-2 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    case 'technicalRule':
                      return (
                        <div key={idx} className="rounded-sm bg-brand-carbon text-white border border-brand-edge-dark p-5 my-6">
                          <p className="text-xs sm:text-sm font-mono text-brand-mist/90 leading-relaxed">
                            {block.content}
                          </p>
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
              </div>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SOURCE REFERENCES & CITATIONS                                 */}
              {/* ───────────────────────────────────────────────────────────── */}
              {article.sources && article.sources.length > 0 && (
                <div className="border-t border-brand-edge pt-8 mt-10 space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-brand-silver">
                    Primary Statutory &amp; Technical Sources
                  </h4>
                  <ul className="space-y-2 text-xs font-light text-brand-silver">
                    {article.sources.map((src, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5 text-brand-electric shrink-0" />
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-slate hover:text-brand-electric underline"
                        >
                          {src.title} — {src.authority}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* CONTEXTUAL EXISTING TOOLS & RESOURCES                         */}
              {/* ───────────────────────────────────────────────────────────── */}
              {article.relatedResources && article.relatedResources.length > 0 && (
                <div className="border-t border-brand-edge pt-8 mt-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-brand-slate">
                      Relevant Tools &amp; Resources
                    </h4>
                    <Link href="/resources" className="text-xs text-brand-electric hover:underline">
                      View all resources →
                    </Link>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {article.relatedResources.map((res, i) => (
                      <Link
                        key={i}
                        href={res.url}
                        className="p-4 rounded-sm border border-brand-edge bg-brand-surface hover:border-brand-electric/50 hover:bg-white transition-all flex flex-col justify-between group"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase text-brand-electric">
                            {res.type.toUpperCase()} {res.badge && `· ${res.badge}`}
                          </span>
                          <p className="text-sm font-light text-brand-graphite group-hover:text-brand-electric transition-colors">
                            {res.title}
                          </p>
                          <p className="text-xs font-light text-brand-silver line-clamp-2">
                            {res.description}
                          </p>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-normal text-brand-electric">
                          Open asset <ArrowRight className="w-3 h-3" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* RELATED LOBBY INTELLIGENCE                                        */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-brand-edge bg-brand-surface py-12 sm:py-16">
            <div className="container-custom">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[10.5px] font-mono uppercase tracking-wider text-brand-silver block mb-1">
                    Keep Reading
                  </span>
                  <h3 className="text-xl sm:text-2xl font-light text-brand-graphite">
                    Related Lobby Intelligence
                  </h3>
                </div>
                <Link href="/lobby/archive" className="btn-outline text-xs py-2 px-4">
                  All Articles →
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/lobby/${rel.slug}`}
                    className="p-5 rounded-sm border border-brand-edge bg-white hover:border-brand-electric hover:-translate-y-0.5 transition-all shadow-subtle flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase text-brand-electric">
                        {rel.franchise.replace(/-/g, ' ')}
                      </span>
                      <h4 className="text-base font-light text-brand-graphite group-hover:text-brand-electric transition-colors leading-snug">
                        {rel.title}
                      </h4>
                      <p className="text-xs font-light text-brand-silver line-clamp-2">
                        {rel.standfirst}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-brand-edge flex items-center justify-between text-[11px] font-light text-brand-silver">
                      <span>{rel.readingTimeMinutes} min read</span>
                      <span className="text-brand-electric font-normal group-hover:translate-x-0.5 transition-transform">
                        Read brief →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
