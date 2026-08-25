import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ShieldCheck, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { TemplateProps } from './types';
import { CONTACT_CONFIG } from '@/config/contact';
import { ORGANIZATION_CONFIG } from '@/config/organization';
import Link from 'next/link';

export function TemplateLegal({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Legal & Governance', url: '/legal' },
    { name: content.h1, url: route.path },
  ];

  const targetMapping: Record<string, { path: string; name: string }> = {
    '/privacy-policy': { path: '/legal/privacy', name: 'UK GDPR Privacy Notice' },
    '/terms-and-conditions': { path: '/legal/terms-of-business', name: 'Terms of Business' },
    '/accessibility-statement': { path: '/legal/accessibility', name: 'Digital Accessibility Statement' },
  };

  const target = targetMapping[route.path] || { path: '/legal', name: 'Legal, Data & Governance Centre' };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header solid />
      <main className="flex-grow">
        <Breadcrumbs items={breadcrumbs} />

        {/* Legal Header */}
        <section className="bg-brand-graphite border-b border-brand-edge-dark text-white py-14 relative overflow-hidden">
          <div className="container-custom">
            <div className="max-w-3xl space-y-4">
              <span className="badge-gold">{content.eyebrow || 'Corporate Governance'}</span>
              <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
                {content.h1}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                {content.heroIntro || content.metaDescription}
              </p>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Legal Content Body */}
        <section className="section-padding py-12 bg-white">
          <div className="container-custom max-w-4xl space-y-8">
            {/* New Centre Notification Card */}
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-normal text-indigo-700 uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4" />
                    Updated Legal & Governance Framework
                  </span>
                  <h2 className="text-base font-light text-slate-900">
                    Comprehensive {target.name} Available
                  </h2>
                  <p className="text-xs text-slate-600">
                    This document has been updated and integrated into our new central governance framework.
                  </p>
                </div>
                <Link
                  href={target.path}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-normal text-white shadow-xs transition-colors hover:bg-slate-800 shrink-0"
                >
                  View {target.name}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="prose-brand max-w-none text-slate-700 space-y-6 text-sm sm:text-base leading-relaxed">
              <h2 className="text-xl font-light text-brand-graphite">1. Corporate Policy Overview & Commitment</h2>
              <p>
                {ORGANIZATION_CONFIG.tradingName} operates under the highest standards of corporate governance, transparency, and statutory compliance. This policy applies across all national facilities management operations, client contracts, supply chain engagements, and digital CAFM services.
              </p>

              <h2 className="text-xl font-light text-brand-graphite">2. Statutory Framework & Compliance</h2>
              <p>
                We adhere strictly to applicable UK legislation, including the UK GDPR, Data Protection Act 2018, Data (Use and Access) Act 2025, Health and Safety at Work etc. Act 1974, CDM Regulations 2015, and the Bribery Act 2010.
              </p>

              {content.sections && content.sections.map((sec, idx) => (
                <div key={idx} className="pt-4 space-y-3">
                  <h2 className="text-xl font-light text-brand-graphite">{sec.heading}</h2>
                  <p>{sec.body}</p>
                </div>
              ))}

              <h2 className="text-xl font-light text-brand-graphite">3. Central Governance Centre</h2>
              <p>
                Explore our full suite of 24 corporate, privacy, AI transparency, client, and contractor policies in the{' '}
                <Link href="/legal" className="text-indigo-600 font-light hover:underline">
                  EntireFM Legal, Data & Governance Centre
                </Link>.
              </p>

              <h2 className="text-xl font-light text-brand-graphite">4. Contact & Inquiries</h2>
              <p>
                For questions regarding this policy or our corporate compliance standards, please contact our compliance desk at{' '}
                <a href={`mailto:${CONTACT_CONFIG.enquiryEmail}`} className="text-brand-graphite font-light hover:underline">
                  {CONTACT_CONFIG.enquiryEmail}
                </a>{' '}
                or call{' '}
                <a href={CONTACT_CONFIG.mainPhone.href} className="text-brand-graphite font-light hover:underline">
                  {CONTACT_CONFIG.mainPhone.display}
                </a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

