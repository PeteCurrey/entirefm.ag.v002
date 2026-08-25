'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { LegalToc, TocItem } from './LegalToc';
import { LegalContactCard } from './LegalContactCard';
import { LegalPrintButton } from './LegalPrintButton';
import { ShieldCheck, Calendar, FileText, ArrowRight } from 'lucide-react';
import { LEGAL_CONFIG } from '@/config/legal';

export interface LegalLayoutProps {
  title: string;
  eyebrow?: string;
  categorySlug?: string;
  categoryTitle?: string;
  summary: string;
  effectiveDate: string;
  version: string;
  tocItems: TocItem[];
  relatedPolicies?: Array<{ title: string; href: string; description?: string }>;
  keyTakeaways?: string[];
  children: React.ReactNode;
}

export function LegalLayout({
  title,
  eyebrow = 'Legal, Data & Governance',
  categorySlug,
  categoryTitle,
  summary,
  effectiveDate,
  version,
  tocItems,
  relatedPolicies = [],
  keyTakeaways = [],
  children,
}: LegalLayoutProps) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Legal & Governance', url: '/legal' },
    ...(categoryTitle && categorySlug
      ? [{ name: categoryTitle, url: `/legal#${categorySlug}` }]
      : []),
    { name: title, url: '#' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header solid />

      <main className="flex-grow">
        <div className="print:hidden">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-brand-graphite border-b border-brand-edge-dark text-white py-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[15%] -top-[50%] h-[30rem] w-[30rem] rounded-full opacity-20 blur-[100px]"
            style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }}
          />

          <div className="container-custom relative">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-gold">{eyebrow}</span>
                  {categoryTitle && (
                    <span className="rounded-md bg-white/10 px-2.5 py-0.5 text-xs font-normal text-slate-300">
                      {categoryTitle}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {title}
                </h1>

                <p className="text-base text-slate-300 leading-relaxed max-w-2xl sm:text-lg font-light">
                  {summary}
                </p>
              </div>

              {/* Document Metadata & Actions */}
              <div className="flex shrink-0 flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs sm:flex-row lg:flex-col print:hidden">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Calendar className="h-4 w-4 text-brand-electric-bright" />
                  <span>Effective: <strong>{effectiveDate}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <FileText className="h-4 w-4 text-brand-electric-bright" />
                  <span>Document Version: <strong>{version}</strong></span>
                </div>
                <LegalPrintButton />
              </div>

            </div>

            {/* Key Takeaways Box (Layered Disclosure) */}
            {keyTakeaways.length > 0 && (
              <div className="mt-8 rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-5 backdrop-blur-xs sm:p-6">
                <p className="flex items-center gap-2 text-xs font-normal uppercase tracking-wider text-brand-electric-bright">
                  <ShieldCheck className="h-4 w-4" />
                  Summary at a Glance
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs text-slate-200">
                  {keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-electric-bright" />
                      <span className="leading-normal">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Content Layout */}
        <section className="section-padding py-12 sm:py-16">
          <div className="container-custom">
            <div className="grid gap-12 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px]">
              {/* Main Policy Body */}
              <article className="min-w-0 max-w-4xl">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-10 lg:p-12">
                  <div className="legal-prose space-y-10 text-slate-700 leading-relaxed text-[15px] sm:text-base">
                    {children}
                  </div>

                  {/* Closing Corporate Authority Statement */}
                  <div className="mt-12 rounded-xl border border-slate-100 bg-slate-50 p-6 text-xs text-slate-500 leading-relaxed">
                    <p className="font-light text-slate-700">
                      Authorised by: EntireFM Legal, Risk & Compliance Committee
                    </p>
                    <p className="mt-1">
                      Operating Company: {LEGAL_CONFIG.tradingStatement}. Registered in {LEGAL_CONFIG.statutoryJurisdiction} (Company No. {LEGAL_CONFIG.companyNumber}).
                    </p>
                    <p className="mt-1">
                      This policy is formally reviewed annually and immediately following any statutory or operational changes.
                    </p>
                  </div>
                </div>

                {/* Contact Card */}
                <LegalContactCard />

                {/* Related Policies Grid */}
                {relatedPolicies.length > 0 && (
                  <div className="mt-12 border-t border-slate-200 pt-8 print:hidden">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-light text-slate-900">Related Governance Policies</h3>
                      <Link
                        href="/legal"
                        className="inline-flex items-center gap-1 text-xs font-normal text-indigo-600 hover:underline"
                      >
                        View Legal Centre
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {relatedPolicies.map((p) => (
                        <Link
                          key={p.href}
                          href={p.href}
                          className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-xs"
                        >
                          <p className="text-sm font-normal text-slate-900 group-hover:text-indigo-600">
                            {p.title}
                          </p>
                          {p.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{p.description}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </article>

              {/* Sticky Table of Contents */}
              <aside className="print:hidden">
                <LegalToc items={tocItems} />
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
