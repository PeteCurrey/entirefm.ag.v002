'use client';

import React, { useState } from 'react';
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
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';

interface TemplateEvergreenGuideProps {
  route: RouteRecord;
  content: ContentRecord;
}

export function TemplateEvergreenGuide({ route, content }: TemplateEvergreenGuideProps) {
  const [activeSection, setActiveSection] = useState<string>('intro');

  return (
    <div className="bg-[#0B0E14] text-white min-h-screen">
      <Header />

      {/* Guide Header */}
      <section className="relative pt-32 pb-16 border-b border-zinc-800 bg-gradient-to-b from-zinc-950 via-[#0B0E14] to-[#0B0E14]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/resources/guides"
              className="text-xs font-mono uppercase text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              &larr; All Guides
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-xs text-zinc-500 font-mono">Evergreen Reference</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            {content.h1 || content.title}
          </h1>

          <p className="text-lg text-zinc-300 leading-relaxed max-w-3xl mb-8">
            {content.heroIntro || content.metaDescription}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-400 pt-6 border-t border-zinc-800/80">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span>15–18 min read</span>
            </div>
            <div>
              <span>Author: </span>
              <strong className="text-zinc-200">EntireFM Technical Team</strong>
            </div>
            <div>
              <span>Reviewed: </span>
              <strong className="text-emerald-400">August 2026</strong>
            </div>
            <div>
              <span>Standards: </span>
              <strong className="text-zinc-200">UK Legislation &amp; CIBSE / SFG20</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Content & Sticky Chapter Navigation */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Body */}
          <main className="lg:col-span-8 space-y-12">
            {content.sections?.map((section, idx) => (
              <article key={idx} className="space-y-4">
                <h2 className="text-2xl font-bold text-white tracking-tight border-b border-zinc-800 pb-3">
                  {section.heading}
                </h2>
                <div className="text-zinc-300 text-base leading-relaxed space-y-4">
                  {section.body}
                </div>
              </article>
            ))}

            {/* In-Context Tool & Commercial Pathway */}
            <div className="bg-zinc-900 border border-emerald-500/30 rounded-xl p-8 space-y-4 mt-12 shadow-lg">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                PRACTICAL FM APPLICATION
              </span>
              <h3 className="text-xl font-bold text-white">
                Need to structure maintenance across your estate?
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Use our interactive PPM schedule builder to establish asset-led planned maintenance frequencies according to verified statutory standards.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/tools/ppm-schedule-builder"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
                >
                  Launch PPM Builder <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/ppm"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold px-4 py-2.5 rounded-lg border border-zinc-700 transition-colors"
                >
                  Explore EntireFM PPM Services
                </Link>
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6">
            <div className="sticky top-28 bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 space-y-6 backdrop-blur-md">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                RELATED FM GUIDES
              </h4>
              <nav className="space-y-3 text-xs">
                <Link
                  href="/resources/guides/facilities-management-guide"
                  className="block text-zinc-300 hover:text-emerald-400 transition-colors"
                >
                  &rarr; The Complete Guide to Facilities Management
                </Link>
                <Link
                  href="/resources/guides/ppm-guide"
                  className="block text-zinc-300 hover:text-emerald-400 transition-colors"
                >
                  &rarr; The Complete Guide to PPM
                </Link>
                <Link
                  href="/resources/guides/asset-register-guide"
                  className="block text-zinc-300 hover:text-emerald-400 transition-colors"
                >
                  &rarr; How to Build an Asset Register
                </Link>
                <Link
                  href="/resources/guides/fm-tender-guide"
                  className="block text-zinc-300 hover:text-emerald-400 transition-colors"
                >
                  &rarr; Facilities Management Tender Guide
                </Link>
              </nav>

              <div className="pt-6 border-t border-zinc-800 space-y-3">
                <h5 className="text-[11px] font-mono uppercase text-zinc-400 font-bold">
                  STATUTORY COMPLIANCE
                </h5>
                <Link
                  href="/compliance"
                  className="text-xs text-emerald-400 hover:underline block font-semibold"
                >
                  Visit EntireFM Compliance Centre &rarr;
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <TrustBar />
      <ProposalSection />
      <NewsletterSignupSection />
      <Footer />
    </div>
  );
}
