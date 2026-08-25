import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { LEGAL_CATEGORIES, LEGAL_CONFIG, getLegalDisplayValue } from '@/config/legal';
import { LEGAL_POLICIES } from '@/lib/legal/legal-content-registry';
import {
  ShieldCheck,
  Globe,
  Cpu,
  Building2,
  Truck,
  Scale,
  Leaf,
  ArrowRight,
  Search,
  FileText,
  Lock,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Legal, Data & Governance Centre | EntireFM',
  description: 'Authoritative UK legal policies, UK GDPR privacy notices, responsible AI transparency, client terms, contractor standards, and corporate governance for EntireFM.',
  alternates: {
    canonical: 'https://www.entirefm.com/legal',
  },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Globe,
  ShieldCheck,
  Cpu,
  Building2,
  Truck,
  Scale,
  Leaf,
};

export default function LegalHubPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Legal, Data & Governance Centre', url: '/legal' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header solid />

      <main className="flex-grow">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-brand-graphite border-b border-brand-edge-dark text-white py-16 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[10%] -top-[50%] h-[36rem] w-[36rem] rounded-full opacity-20 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }}
          />

          <div className="container-custom relative">
            <div className="max-w-3xl space-y-4">
              <span className="badge-gold">Corporate Trust & Statutory Governance</span>
              <h1 className="text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
                Legal, Data & Governance Centre
              </h1>
              <p className="text-base text-slate-300 leading-relaxed sm:text-lg font-light">
                The authoritative legal, privacy, technology ethics, and compliance framework governing EntireFM operations, client contracts, contractor networks, and digital CAFM platforms.
              </p>

              {/* Quick Jump Bar */}
              <div className="flex flex-wrap gap-2 pt-4">
                {LEGAL_CATEGORIES.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#${cat.slug}`}
                    className="rounded-sm border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    {cat.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Statutory Trust & Entity Summary Bar */}
        <section className="border-b border-slate-200 bg-white py-6">
          <div className="container-custom">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">UK Legal Entity</span>
                  <span>{LEGAL_CONFIG.tradingStatement}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Lock className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Company Registration</span>
                  <span>No. {LEGAL_CONFIG.companyNumber} (England & Wales)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <FileText className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Data Protection Officer</span>
                  <a href={`mailto:${LEGAL_CONFIG.dataProtectionOfficer.email}`} className="text-indigo-600 hover:underline">
                    {LEGAL_CONFIG.dataProtectionOfficer.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Supervisory Authority</span>
                  <span>Information Commissioner’s Office (ICO)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Policy Sections */}
        <section className="section-padding py-12 sm:py-16">
          <div className="container-custom space-y-16">
            {LEGAL_CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.iconName] || ShieldCheck;
              const policies = category.policySlugs
                .map((slug) => LEGAL_POLICIES[slug])
                .filter(Boolean);

              return (
                <div key={category.id} id={category.slug} className="scroll-mt-24">
                  {/* Category Header */}
                  <div className="flex items-start gap-3.5 border-b border-slate-200 pb-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                        {category.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600 max-w-3xl">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Policy Cards Grid */}
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {policies.map((policy) => (
                      <Link
                        key={policy.slug}
                        href={`/legal/${policy.slug}`}
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                              v{policy.version}
                            </span>
                            <span className="text-[11px] text-slate-600">
                              Updated {policy.effectiveDate}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600">
                            {policy.title}
                          </h3>

                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {policy.summary}
                          </p>
                        </div>

                        <div className="mt-6 flex items-center gap-1.5 border-t border-slate-100 pt-4 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                          <span>Read Full Policy</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
