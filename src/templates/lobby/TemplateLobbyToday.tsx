'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
  MessageSquare,
  Wrench,
  HelpCircle,
  Briefcase,
  Layers,
  ChevronRight,
  Calendar,
  Building2,
  Clock,
} from 'lucide-react';

interface TodayPayload {
  dateFormatted: string;
  timeFormatted: string;
  threeThingsThatMatter: {
    lead: {
      id: string;
      title: string;
      standfirst: string;
      whyItMatters: string;
      discipline: string;
      authority: string;
      jurisdiction: string;
      time: string;
      heroImage: string;
      heroImageAlt?: string;
      url: string;
      sourceUrl: string;
    };
    secondary1: {
      id: string;
      title: string;
      standfirst: string;
      whyItMatters: string;
      discipline: string;
      authority: string;
      jurisdiction: string;
      time: string;
      url: string;
      sourceUrl: string;
    };
    secondary2: {
      id: string;
      title: string;
      standfirst: string;
      whyItMatters: string;
      discipline: string;
      authority: string;
      jurisdiction: string;
      time: string;
      url: string;
      sourceUrl: string;
    };
  };
  whatChanged: Array<{
    id: string;
    time: string;
    discipline: string;
    title: string;
    summary: string;
    authority: string;
    jurisdiction: string;
    url: string;
  }>;
  whoWonWhat: {
    featuredAward: {
      supplier: string;
      title: string;
      buyer: string;
      service: string;
      region: string;
      term: string;
      publishedAt: string;
    };
    recentAwards: Array<{
      id: string;
      supplier: string;
      title: string;
      buyer: string;
      term: string;
      region: string;
    }>;
  };
  onTheHorizon: Array<{
    id: string;
    dateStr: string;
    month: string;
    year: number;
    title: string;
    type: string;
    discipline: string;
    jurisdiction: string;
  }>;
  fromTheIndustry: Array<{
    id: string;
    title: string;
    summary: string;
    category: string;
    date: string;
    url: string;
  }>;
  theConversation?: {
    title: string;
    author: string;
    role: string;
    repliesCount: number;
    url: string;
    summary: string;
  };
  oneUsefulThing?: {
    title: string;
    category: string;
    whyItMatters: string;
    format: string;
    url: string;
    image: string;
  };
}

export function TemplateLobbyToday() {
  const [data, setData] = useState<TodayPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/lobby/intelligence/today')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ── 1. DAILY EDITION MASTHEAD (Light, Architectural, Work Sans ExtraLight) ── */}
      <header className="border-b border-neutral-200/80 bg-white pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Top Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                The Daily FM Briefing
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-extralight text-neutral-500">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{data?.dateFormatted || 'Friday, 28 August 2026'} · Updated {data?.timeFormatted || '07:42'}</span>
            </div>
          </div>

          {/* Main Title & Standfirst */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 max-w-7xl">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-neutral-900 leading-[1.08]">
                What Changed Today
              </h1>

              <p className="text-lg sm:text-xl font-extralight text-neutral-700 leading-relaxed">
                The developments worth knowing across FM, commercial property, compliance, and the built environment.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/member/profile"
                className="px-4 py-2 rounded-[4px] border border-neutral-300 bg-neutral-50 hover:bg-white text-neutral-700 hover:text-neutral-900 text-xs font-light tracking-wide transition-colors"
              >
                Personalise my briefing &rarr;
              </Link>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="max-w-7xl mx-auto py-20 px-4 text-center text-neutral-500 font-light text-sm">
          Loading today&apos;s executive FM briefing...
        </div>
      ) : data ? (
        <main className="space-y-16 sm:space-y-24 py-12 sm:py-16">
          
          {/* ── 2. THREE THINGS THAT MATTER TODAY (Image-Led Editorial Layer) ── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                  Priority Briefing
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                  3 Things That Matter Today
                </h2>
              </div>
              <span className="text-xs font-light text-neutral-500 hidden sm:inline">
                Top developments selected for estate leaders
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Lead Feature Story (Col 7) */}
              {data.threeThingsThatMatter.lead && (
                <div className="lg:col-span-7 bg-[#07090E] text-white rounded-[6px] overflow-hidden flex flex-col justify-between group shadow-sm">
                  <div className="relative min-h-[280px] sm:min-h-[340px] overflow-hidden">
                    <Image
                      src={data.threeThingsThatMatter.lead.heroImage}
                      alt={data.threeThingsThatMatter.lead.heroImageAlt || data.threeThingsThatMatter.lead.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover object-center brightness-85 group-hover:scale-102 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-transparent" />
                    
                    <div className="absolute top-4 left-4 z-10">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white/90 border border-white/10 rounded-[3px]">
                        {data.threeThingsThatMatter.lead.time} · {data.threeThingsThatMatter.lead.discipline}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-2xl sm:text-3xl font-extralight text-white leading-snug tracking-tight">
                        {data.threeThingsThatMatter.lead.title}
                      </h3>

                      <p className="text-sm font-extralight text-neutral-300 leading-relaxed">
                        {data.threeThingsThatMatter.lead.standfirst}
                      </p>

                      <div className="border-l-2 border-brand-electric pl-3 py-0.5 mt-3">
                        <p className="text-xs font-light text-neutral-300 leading-relaxed">
                          <strong className="text-white font-normal">Why it matters:</strong> {data.threeThingsThatMatter.lead.whyItMatters}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4 text-xs font-light">
                      <span className="text-neutral-400">
                        Authority: <span className="text-white">{data.threeThingsThatMatter.lead.authority}</span>
                      </span>

                      <Link
                        href={data.threeThingsThatMatter.lead.url}
                        className="inline-flex items-center gap-1.5 text-brand-electric-bright hover:underline"
                      >
                        <span>Read full intelligence</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Secondary Stories 1 & 2 (Col 5) */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                
                {/* Secondary Story 1 */}
                {data.threeThingsThatMatter.secondary1 && (
                  <div className="p-6 sm:p-7 bg-white border border-neutral-200/90 rounded-[6px] shadow-2xs space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-extralight text-neutral-500">
                        <span className="font-mono text-[10px] uppercase text-brand-electric font-medium tracking-wider">
                          {data.threeThingsThatMatter.secondary1.discipline}
                        </span>
                        <span>{data.threeThingsThatMatter.secondary1.time}</span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-light text-neutral-900 leading-snug">
                        {data.threeThingsThatMatter.secondary1.title}
                      </h4>

                      <p className="text-xs sm:text-sm font-extralight text-neutral-600 leading-relaxed">
                        {data.threeThingsThatMatter.secondary1.standfirst}
                      </p>

                      <p className="text-xs font-light text-neutral-700 pt-1">
                        <strong>Why it matters:</strong> {data.threeThingsThatMatter.secondary1.whyItMatters}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <span className="text-neutral-500 font-extralight">{data.threeThingsThatMatter.secondary1.authority}</span>
                      <Link
                        href={data.threeThingsThatMatter.secondary1.url}
                        className="text-brand-electric hover:underline inline-flex items-center gap-1 font-light"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Secondary Story 2 */}
                {data.threeThingsThatMatter.secondary2 && (
                  <div className="p-6 sm:p-7 bg-white border border-neutral-200/90 rounded-[6px] shadow-2xs space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-extralight text-neutral-500">
                        <span className="font-mono text-[10px] uppercase text-brand-electric font-medium tracking-wider">
                          {data.threeThingsThatMatter.secondary2.discipline}
                        </span>
                        <span>{data.threeThingsThatMatter.secondary2.time}</span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-light text-neutral-900 leading-snug">
                        {data.threeThingsThatMatter.secondary2.title}
                      </h4>

                      <p className="text-xs sm:text-sm font-extralight text-neutral-600 leading-relaxed">
                        {data.threeThingsThatMatter.secondary2.standfirst}
                      </p>

                      <p className="text-xs font-light text-neutral-700 pt-1">
                        <strong>Why it matters:</strong> {data.threeThingsThatMatter.secondary2.whyItMatters}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <span className="text-neutral-500 font-extralight">{data.threeThingsThatMatter.secondary2.authority}</span>
                      <Link
                        href={data.threeThingsThatMatter.secondary2.url}
                        className="text-brand-electric hover:underline inline-flex items-center gap-1 font-light"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── 3. WHAT CHANGED (Compact Statutory & Regulatory Stream - Open Rows) ── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                  Statutory &amp; Technical Wire
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                  What Changed
                </h2>
              </div>
              <Link href="/lobby/compliance" className="text-xs font-light text-brand-electric hover:underline">
                View all statutory updates &rarr;
              </Link>
            </div>

            <div className="divide-y divide-neutral-200 bg-white border border-neutral-200/90 rounded-[6px] px-6 sm:px-8 shadow-2xs">
              {data.whatChanged.map((item) => (
                <div
                  key={item.id}
                  className="py-5 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start group"
                >
                  <div className="lg:col-span-2 text-xs font-mono text-neutral-500">
                    <span className="text-neutral-900 font-light block">{item.time}</span>
                    <span className="text-[10px] uppercase text-brand-electric tracking-wider">{item.discipline}</span>
                  </div>

                  <div className="lg:col-span-8 space-y-1">
                    <h4 className="text-base font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-extralight text-neutral-600 leading-relaxed">
                      {item.summary}
                    </p>
                    <div className="text-[11px] font-extralight text-neutral-400 pt-0.5">
                      {item.authority} · {item.jurisdiction}
                    </div>
                  </div>

                  <div className="lg:col-span-2 flex lg:justify-end items-center pt-1 lg:pt-0">
                    <Link
                      href={item.url}
                      className="text-xs font-light text-neutral-900 hover:text-brand-electric inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>What changed</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 4. WHO WON WHAT (Procurement & Major FM Contract Awards) ── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                  Commercial Market Wire
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                  Who Won What
                </h2>
              </div>
              <Link href="/lobby/opportunities" className="text-xs font-light text-brand-electric hover:underline">
                View all procurement notices &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Featured Major Contract Award */}
              {data.whoWonWhat.featuredAward && (
                <div className="lg:col-span-6 p-6 sm:p-8 bg-white border border-neutral-200/90 rounded-[6px] shadow-2xs space-y-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-extralight text-neutral-500">
                      <span className="font-mono text-[10px] uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[3px]">
                        Featured Major Award
                      </span>
                      <span>{data.whoWonWhat.featuredAward.publishedAt}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium text-brand-electric">
                        {data.whoWonWhat.featuredAward.supplier}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-light text-neutral-900 leading-snug">
                        {data.whoWonWhat.featuredAward.title}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100 text-xs font-light">
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block tracking-wider">Buyer</span>
                        <span className="text-neutral-800">{data.whoWonWhat.featuredAward.buyer}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block tracking-wider">Service Scope</span>
                        <span className="text-neutral-800">{data.whoWonWhat.featuredAward.service}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block tracking-wider">Region</span>
                        <span className="text-neutral-800">{data.whoWonWhat.featuredAward.region}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block tracking-wider">Term</span>
                        <span className="text-neutral-800">{data.whoWonWhat.featuredAward.term}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] font-extralight text-neutral-500">Source: Contracts Finder</span>
                    <Link
                      href="/lobby/opportunities"
                      className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1"
                    >
                      <span>Analyze award details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Smaller Award Headlines */}
              <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                {data.whoWonWhat.recentAwards.map((award) => (
                  <div
                    key={award.id}
                    className="p-5 bg-white border border-neutral-200/90 rounded-[6px] shadow-2xs space-y-2 flex-1 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-brand-electric">
                        {award.supplier}
                      </div>
                      <h4 className="text-sm font-light text-neutral-900 leading-snug">
                        {award.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-xs font-extralight text-neutral-500 pt-2 border-t border-neutral-100">
                      <span>{award.buyer} · {award.region}</span>
                      <span className="font-mono text-[11px] text-neutral-700">{award.term}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 5. ON THE HORIZON (Combined Timeline - Soft Neutral) ── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                  Forward Timeline
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                  On the Horizon
                </h2>
              </div>
              <span className="text-xs font-light text-neutral-500">
                Verified deadlines and milestones
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.onTheHorizon.map((item) => (
                <div
                  key={item.id}
                  className="p-6 bg-white border border-neutral-200/90 rounded-[6px] shadow-2xs space-y-3"
                >
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      {item.month} {item.year}
                    </div>
                    <div className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                      {item.dateStr}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-medium text-brand-electric block tracking-wider">
                      {item.type}
                    </span>
                    <p className="text-xs font-light text-neutral-800 leading-snug">
                      {item.title}
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] font-extralight text-neutral-500 border-t border-neutral-100">
                    {item.discipline} · {item.jurisdiction}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 6. FROM THE INDUSTRY & COMMUNITY ROUNDTABLE (2-Column Split) ── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: From The Industry News */}
            <div className="lg:col-span-7 space-y-6">
              <div className="border-b border-neutral-200 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                  Industry News
                </span>
                <h3 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight">
                  From the Industry
                </h3>
              </div>

              <div className="space-y-6 divide-y divide-neutral-200 bg-white border border-neutral-200/90 rounded-[6px] p-6 shadow-2xs">
                {data.fromTheIndustry.map((story) => (
                  <div key={story.id} className="pt-6 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between text-xs font-extralight text-neutral-500">
                      <span className="font-mono text-[10px] uppercase text-brand-electric">{story.category}</span>
                      <span>{story.date}</span>
                    </div>

                    <h4 className="text-base font-light text-neutral-900 leading-snug">
                      {story.title}
                    </h4>

                    <p className="text-xs sm:text-sm font-extralight text-neutral-600 leading-relaxed">
                      {story.summary}
                    </p>

                    <Link
                      href={story.url}
                      className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1 pt-1"
                    >
                      <span>Read article</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: The Conversation (Community Roundtable) */}
            {data.theConversation && (
              <div className="lg:col-span-5 space-y-6">
                <div className="border-b border-neutral-200 pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                    Community Roundtable
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight">
                    The Conversation
                  </h3>
                </div>

                <div className="p-6 sm:p-8 bg-[#0B1220] text-white rounded-[6px] shadow-sm space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-brand-electric-bright font-mono">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{data.theConversation.repliesCount} Practitioner Responses</span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-extralight text-white leading-snug">
                      &ldquo;{data.theConversation.title}&rdquo;
                    </h4>

                    <p className="text-xs sm:text-sm font-extralight text-neutral-300 leading-relaxed">
                      {data.theConversation.summary}
                    </p>

                    <div className="pt-2 text-xs font-extralight text-neutral-400">
                      Started by <span className="text-white font-light">{data.theConversation.author}</span> · {data.theConversation.role}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <Link
                      href={data.theConversation.url}
                      className="w-full py-2.5 px-4 rounded-[4px] bg-white/10 hover:bg-white/15 text-white text-xs font-light tracking-wide text-center flex items-center justify-center gap-2 transition-colors border border-white/10"
                    >
                      <span>Join discussion</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ── 7. ONE USEFUL THING (Contextual Tool Showcase) ── */}
          {data.oneUsefulThing && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-8 sm:p-10 bg-white border border-neutral-200/90 rounded-[6px] shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-medium">
                    {data.oneUsefulThing.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                    {data.oneUsefulThing.title}
                  </h3>
                  <p className="text-sm font-extralight text-neutral-600 max-w-2xl leading-relaxed">
                    {data.oneUsefulThing.whyItMatters}
                  </p>
                  <div className="text-xs font-extralight text-neutral-400 pt-1">
                    Format: {data.oneUsefulThing.format}
                  </div>
                </div>

                <div className="lg:col-span-4 flex lg:justify-end">
                  <Link
                    href={data.oneUsefulThing.url}
                    className="px-6 py-3 bg-[#0B1220] hover:bg-[#1E293B] text-white text-xs font-light tracking-wide rounded-[4px] inline-flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Launch &amp; download</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* ── 8. ASK THE LOBBY INTEGRATION (Contextual Research Prompt) ── */}
          <section className="bg-[#0B1220] text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-neutral-800">
            <div className="max-w-4xl mx-auto text-center space-y-5">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-electric/10 border border-brand-electric/20 text-brand-electric mx-auto">
                <HelpCircle className="w-5 h-5" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-extralight tracking-tight text-white">
                  Need to go deeper into today&apos;s developments?
                </h3>
                <p className="text-xs sm:text-sm font-extralight text-neutral-300 max-w-lg mx-auto leading-relaxed">
                  Ask The Lobby grounded technical questions about today&apos;s Building Safety circulars, procurement notices, or statutory maintenance deadlines.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/lobby/ask?q=Explain%20the%20Building%20Safety%20Act%20changes%20from%20today%27s%20briefing"
                  className="px-4 py-2 rounded-[4px] bg-white/10 hover:bg-white/15 text-white text-xs font-light border border-white/10 transition-colors"
                >
                  &ldquo;Explain the Building Safety changes from today&apos;s briefing&rdquo; &rarr;
                </Link>

                <Link
                  href="/lobby/ask"
                  className="px-5 py-2 rounded-[4px] bg-brand-electric hover:bg-blue-600 text-white text-xs font-light transition-colors flex items-center gap-1.5"
                >
                  <span>Ask The Lobby</span>
                  <Sparkles className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </section>
        </main>
      ) : null}

      <Footer />
    </div>
  );
}
