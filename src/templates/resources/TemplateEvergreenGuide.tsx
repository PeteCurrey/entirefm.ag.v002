'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Wrench,
  ShieldCheck,
  Building,
  FileText,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  AlertTriangle,
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
    { name: 'Guides', url: '/resources/guides' },
    { name: content.title, url: route.path },
  ];

  const sections = content.sections || [];

  // Calculate estimated reading time based on total characters
  const totalWords = sections.reduce((acc, s) => acc + (s.body ? s.body.split(/\s+/).length : 0), 0) + 250;
  const readTimeMinutes = Math.max(8, Math.ceil(totalWords / 150));

  useEffect(() => {
    const handleScroll = () => {
      const headings = sections.map((_, idx) => document.getElementById(`section-${idx}`));
      const scrollPos = window.scrollY + 180;

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
    <div className="bg-brand-void text-white min-h-screen">
      <Header />

      {/* Guide Header */}
      <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 border-b border-brand-edge-dark bg-brand-void overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[15%] -top-[30%] h-[36rem] w-[36rem] rounded-full opacity-20 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }}
        />
        <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-30" />

        <div className="container-custom relative">
          <Breadcrumbs items={breadcrumbs} className="mb-6" />

          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-brand-electric-bright border border-blue-500/20 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-electric" />
              {content.eyebrow || 'Practical FM Guide'}
            </div>

            <h1 className="text-display-md text-white font-light tracking-tight leading-tight">
              {content.h1 || content.title}
            </h1>

            <p className="text-base sm:text-lg text-brand-mist/80 leading-relaxed max-w-3xl">
              {content.heroIntro || content.metaDescription}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-brand-mist/60 pt-6 border-t border-brand-edge-dark">
              <div className="flex items-center gap-1.5 text-brand-electric-bright font-semibold">
                <Clock className="h-3.5 w-3.5" />
                <span>~{readTimeMinutes} min read</span>
              </div>
              <div>
                <span>Author: </span>
                <strong className="text-brand-mist font-semibold">EntireFM Technical Team</strong>
              </div>
              <div>
                <span>Reviewed: </span>
                <strong className="text-brand-mist font-semibold">August 2026</strong>
              </div>
              <div>
                <span>Standards: </span>
                <strong className="text-brand-electric-bright font-semibold">UK Legislation &amp; CIBSE / SFG20</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-brand-carbon">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Article Content Column */}
            <main className="lg:col-span-8 space-y-10">
              {sections.map((section, idx) => (
                <article
                  key={idx}
                  id={`section-${idx}`}
                  className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 sm:p-8 space-y-4 scroll-mt-28"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight border-b border-brand-edge-dark pb-3">
                    {section.heading}
                  </h2>
                  <div className="text-brand-mist/85 text-sm sm:text-base leading-relaxed space-y-4">
                    <p>{section.body}</p>
                  </div>
                </article>
              ))}

              {/* Conversion Bridge */}
              <div className="mt-8">
                <ResultsConversionBridge
                  headline="Need to structure maintenance across your estate?"
                  body="EntireFM builds verified planned maintenance matrices, undertakes on-site asset surveys, and manages total facilities operations across the UK."
                  ctaPrimary={{ label: 'Explore EntireFM Services', href: '/services' }}
                  ctaSecondary={{ label: 'Launch PPM Schedule Builder', href: '/tools/ppm-schedule-builder' }}
                  accent="blue"
                />
              </div>
            </main>

            {/* Sticky Sidebar Navigation */}
            <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-28">
              {/* Table of Contents */}
              {sections.length > 0 && (
                <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 space-y-4 shadow-elevated">
                  <p className="text-[11px] font-mono uppercase tracking-widest text-brand-mist/50 font-bold">
                    IN THIS GUIDE
                  </p>
                  <nav className="space-y-1.5 text-xs">
                    {sections.map((section, idx) => {
                      const isActive = activeSectionId === `section-${idx}`;
                      return (
                        <a
                          key={idx}
                          href={`#section-${idx}`}
                          className={`block py-1.5 px-2.5 rounded-sm transition-all text-xs ${
                            isActive
                              ? 'bg-brand-electric/15 text-brand-electric-bright font-semibold border-l-2 border-brand-electric-bright'
                              : 'text-brand-mist/70 hover:text-white hover:bg-white/[0.03]'
                          }`}
                        >
                          {section.heading}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              )}

              {/* Related Tools & Resources */}
              <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 space-y-4">
                <p className="text-[11px] font-mono uppercase tracking-widest text-brand-mist/50 font-bold">
                  INTERACTIVE FM TOOLS
                </p>
                <div className="space-y-2 text-xs">
                  <Link
                    href="/tools/ppm-schedule-builder"
                    className="flex items-center justify-between p-2.5 rounded-sm bg-white/[0.02] border border-brand-edge-dark hover:border-brand-electric/50 text-brand-mist/90 hover:text-white transition-all group"
                  >
                    <span>PPM Schedule Builder</span>
                    <ArrowRight className="h-3 w-3 text-brand-mist/40 group-hover:text-brand-electric-bright group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <Link
                    href="/tools/fm-health-check"
                    className="flex items-center justify-between p-2.5 rounded-sm bg-white/[0.02] border border-brand-edge-dark hover:border-brand-electric/50 text-brand-mist/90 hover:text-white transition-all group"
                  >
                    <span>Building Health Check</span>
                    <ArrowRight className="h-3 w-3 text-brand-mist/40 group-hover:text-brand-electric-bright group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <Link
                    href="/tools/compliance-calendar"
                    className="flex items-center justify-between p-2.5 rounded-sm bg-white/[0.02] border border-brand-edge-dark hover:border-brand-electric/50 text-brand-mist/90 hover:text-white transition-all group"
                  >
                    <span>Compliance Calendar</span>
                    <ArrowRight className="h-3 w-3 text-brand-mist/40 group-hover:text-brand-electric-bright group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </div>

                <div className="pt-4 border-t border-brand-edge-dark">
                  <Link
                    href="/compliance"
                    className="text-xs font-semibold text-brand-electric-bright hover:underline flex items-center gap-1"
                  >
                    Visit EntireFM Compliance Centre &rarr;
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <TrustBar />
      <ProposalSection />
      <NewsletterSignupSection />
      <Footer />
    </div>
  );
}
