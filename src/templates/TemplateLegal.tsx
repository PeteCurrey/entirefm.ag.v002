import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import type { TemplateProps } from './types';
import { CONTACT_CONFIG } from '@/config/contact';
import Link from 'next/link';

export function TemplateLegal({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: content.h1, url: route.path },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={breadcrumbs} />

        {/* Legal Header */}
        <section className="bg-brand-navy border-b border-brand-border-dark text-white py-12 relative overflow-hidden">
          <div className="container-custom">
            <div className="max-w-3xl space-y-4">
              <span className="badge-gold">{content.eyebrow || 'Corporate Governance'}</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {content.h1}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                {content.heroIntro || content.metaDescription}
              </p>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Legal Content Body */}
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl space-y-8">
            <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base leading-relaxed">
              <h2 className="text-xl font-bold text-brand-navy">1. Policy Overview & Commitment</h2>
              <p>
                Entire Facilities Management Ltd is committed to operating under the highest standards of corporate governance, transparency, and statutory compliance. This policy applies across all operations, client contracts, and digital services.
              </p>

              <h2 className="text-xl font-bold text-brand-navy">2. Compliance & Statutory Governance</h2>
              <p>
                We adhere strictly to applicable UK legislation, health and safety regulations, data protection standards (UK GDPR), and industry-specific statutory codes of practice.
              </p>

              {content.sections && content.sections.map((sec, idx) => (
                <div key={idx} className="pt-4 space-y-3">
                  <h2 className="text-xl font-bold text-brand-navy">{sec.heading}</h2>
                  <p>{sec.body}</p>
                </div>
              ))}

              <h2 className="text-xl font-bold text-brand-navy">3. Contact & Inquiries</h2>
              <p>
                For questions regarding this policy or our corporate compliance standards, please contact our compliance desk at{' '}
                <a href={`mailto:${CONTACT_CONFIG.enquiryEmail}`} className="text-brand-navy font-semibold hover:underline">
                  {CONTACT_CONFIG.enquiryEmail}
                </a>{' '}
                or call{' '}
                <a href={CONTACT_CONFIG.mainPhone.href} className="text-brand-navy font-semibold hover:underline">
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
