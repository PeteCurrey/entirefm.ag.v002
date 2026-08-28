'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';
import { ResultsConversionBridge } from '@/components/resources/ResultsConversionBridge';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';

interface TemplateEvergreenGuideProps {
  route: RouteRecord;
  content: ContentRecord;
}

export function TemplateEvergreenGuide({ route, content }: TemplateEvergreenGuideProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>('section-0');

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Guides', url: '/resources/guides' },
    { name: content.title, url: route.path },
  ];

  const sections = content.sections || [];

  // Calculate estimated reading time
  const totalWords = sections.reduce((acc, s) => acc + (s.body ? s.body.split(/\s+/).length : 0), 0) + 250;
  const readTimeMinutes = Math.max(8, Math.ceil(totalWords / 150));

  useEffect(() => {
    const handleScroll = () => {
      const headings = sections.map((_, idx) => document.getElementById(`section-${idx}`));
      const scrollPos = window.scrollY + 200;

      for (let i = headings.length - 1; i >= 0; i--) {
        const el = headings[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(`section-${i}`);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <div className="bg-[#060A14] text-white min-h-screen font-sans selection:bg-brand-pink selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC HERO SECTION (85svh)                                         */}
        {/* ========================================================================= */}
        <section className="relative min-h-[85svh] lg:min-h-[88svh] flex items-center justify-center bg-[#060A14] overflow-hidden pt-28 pb-16 sm:py-24 border-b border-brand-edge-dark">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/editorial/entirefm-client-review-2000w.webp"
              alt={content.title}
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
                  {content.eyebrow || 'Practical FM Engineering Guide'}
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.06]">
                {content.h1 || content.title}
              </h1>

              <p className="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-3xl">
                {content.heroIntro || content.metaDescription}
              </p>

              {/* Guide Metadata Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/15 text-xs">
                <div className="p-3.5 rounded-sm bg-white/[0.04] backdrop-blur-md border border-white/10 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                    Read Time
                  </span>
                  <span className="text-sm font-normal text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-pink" />
                    ~{readTimeMinutes} mins
                  </span>
                </div>

                <div className="p-3.5 rounded-sm bg-white/[0.04] backdrop-blur-md border border-white/10 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                    Author
                  </span>
                  <span className="text-sm font-normal text-slate-200 truncate block">
                    EntireFM Engineering
                  </span>
                </div>

                <div className="p-3.5 rounded-sm bg-white/[0.04] backdrop-blur-md border border-white/10 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                    Peer Review
                  </span>
                  <span className="text-sm font-normal text-slate-200 truncate block">
                    August 2026
                  </span>
                </div>

                <div className="p-3.5 rounded-sm bg-white/[0.04] backdrop-blur-md border border-white/10 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                    Standard
                  </span>
                  <span className="text-sm font-normal text-brand-pink truncate block">
                    SFG20 &amp; CIBSE
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. LONG-FORM ARTICLE & STICKY CONTENTS SIDEBAR                            */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Main Article Content Column */}
              <div className="lg:col-span-8 space-y-16 max-w-3xl">
                {sections.map((section, idx) => (
                  <article
                    key={idx}
                    id={`section-${idx}`}
                    className="scroll-mt-28 space-y-6 pb-12 border-b border-slate-200 last:border-b-0"
                  >
                    <div className="space-y-2">
                      <span className="text-xs uppercase tracking-widest text-brand-pink font-medium block">
                        Section 0{idx + 1}
                      </span>
                      <h2 className="text-2xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-snug">
                        {section.heading}
                      </h2>
                    </div>

                    <div className="text-slate-700 text-base sm:text-lg leading-relaxed font-light space-y-6">
                      <p className="leading-relaxed">{section.body}</p>
                    </div>
                  </article>
                ))}

                {/* Conversion Bridge */}
                <div className="pt-6">
                  <ResultsConversionBridge
                    headline="Need to structure maintenance across your estate?"
                    body="EntireFM builds verified planned maintenance matrices, undertakes on-site asset surveys, and manages total facilities operations across the UK."
                    ctaPrimary={{ label: 'Explore EntireFM Services', href: '/services' }}
                    ctaSecondary={{ label: 'Launch PPM Schedule Builder', href: '/tools/ppm-schedule-builder' }}
                    accent="pink"
                  />
                </div>
              </div>

              {/* Sticky Sidebar Navigation */}
              <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-8">
                {/* Table of Contents */}
                {sections.length > 0 && (
                  <div className="p-6 rounded-sm bg-slate-50 border border-slate-200 space-y-4 shadow-sm">
                    <span className="text-[11px] uppercase tracking-widest text-slate-500 font-medium block border-b border-slate-200 pb-2">
                      In This Technical Guide
                    </span>
                    <nav className="space-y-1">
                      {sections.map((section, idx) => {
                        const isActive = activeSectionId === `section-${idx}`;
                        return (
                          <a
                            key={idx}
                            href={`#section-${idx}`}
                            className={`flex items-start gap-2.5 py-2 px-3 rounded-sm transition-all text-xs ${
                              isActive
                                ? 'bg-brand-pink/10 text-brand-pink font-medium border-l-2 border-brand-pink'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-light'
                            }`}
                          >
                            <span className="text-[10px] text-slate-400 mt-0.5 font-medium">0{idx + 1}</span>
                            <span className="leading-snug">{section.heading}</span>
                          </a>
                        );
                      })}
                    </nav>
                  </div>
                )}

                {/* Related Tools & Resources */}
                <div className="p-6 rounded-sm bg-slate-50 border border-slate-200 space-y-4 shadow-sm">
                  <span className="text-[11px] uppercase tracking-widest text-slate-500 font-medium block border-b border-slate-200 pb-2">
                    Interactive FM Tools
                  </span>
                  <div className="space-y-2 text-xs">
                    <Link
                      href="/tools/ppm-schedule-builder"
                      className="flex items-center justify-between p-3 rounded-sm bg-white border border-slate-200 hover:border-brand-pink text-slate-800 hover:text-brand-pink transition-all group shadow-2xs"
                    >
                      <span className="font-light">PPM Schedule Builder</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all" />
                    </Link>
                    <Link
                      href="/tools/fm-health-check"
                      className="flex items-center justify-between p-3 rounded-sm bg-white border border-slate-200 hover:border-brand-pink text-slate-800 hover:text-brand-pink transition-all group shadow-2xs"
                    >
                      <span className="font-light">Building Health Check</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all" />
                    </Link>
                    <Link
                      href="/tools/compliance-calendar"
                      className="flex items-center justify-between p-3 rounded-sm bg-white border border-slate-200 hover:border-brand-pink text-slate-800 hover:text-brand-pink transition-all group shadow-2xs"
                    >
                      <span className="font-light">Compliance Calendar</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <Link
                      href="/compliance"
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-brand-pink hover:text-slate-900 transition-colors"
                    >
                      <span>Visit Statutory Compliance Centre</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </aside>

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
