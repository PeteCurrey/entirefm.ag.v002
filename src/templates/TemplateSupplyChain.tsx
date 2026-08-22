import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ShieldCheck, CheckCircle2, FileCheck, Mail, ArrowRight } from 'lucide-react';
import type { TemplateProps } from './types';
import { CONTACT_CONFIG } from '@/config/contact';
import Link from 'next/link';

export function TemplateSupplyChain({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: content.h1, url: route.path },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={breadcrumbs} />

        {/* Supply Chain Hero */}
        <section className="bg-brand-navy border-b border-brand-border-dark text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="container-custom">
            <div className="max-w-3xl space-y-4">
              <span className="badge-gold">{content.eyebrow || 'Supply Chain & Procurement'}</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {content.h1}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                {content.heroIntro || content.metaDescription}
              </p>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Contractor Onboarding Standards */}
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl space-y-8">
            <div className="space-y-4">
              <span className="badge-technical">Compliance Criteria</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy">
                Supply Chain Accreditation & Standards
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                EntireFM maintains rigorous vetting standards for all approved subcontractors and specialist suppliers to ensure consistent safety, quality, and statutory compliance across our client portfolio.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-brand-surface border border-brand-border rounded-sm space-y-2">
                <FileCheck className="w-5 h-5 text-brand-gold" />
                <h4 className="text-sm font-bold text-brand-navy">Insurance Verification</h4>
                <p className="text-xs text-slate-600">Minimum £5M Public Liability and £10M Employers Liability coverage required.</p>
              </div>
              <div className="p-4 bg-brand-surface border border-brand-border rounded-sm space-y-2">
                <ShieldCheck className="w-5 h-5 text-brand-gold" />
                <h4 className="text-sm font-bold text-brand-navy">Health & Safety Certification</h4>
                <p className="text-xs text-slate-600">SSIP accreditation (CHAS, SafeContractor) and documented RAMS required.</p>
              </div>
            </div>

            <div className="p-8 bg-brand-charcoal border border-brand-border-dark rounded-sm text-white space-y-4">
              <h3 className="text-lg font-bold text-white">Subcontractor Registration Form</h3>
              <p className="text-xs text-slate-300">
                To apply for our approved contractor network, please submit your company details, certifications, and insurance documents to our procurement desk.
              </p>
              <a
                href={`mailto:${CONTACT_CONFIG.enquiryEmail}?subject=Supply Chain Registration`}
                className="btn-primary text-xs py-3 px-6 inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Submit Supplier Application
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
