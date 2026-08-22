import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ShieldCheck, Phone, Mail, Key, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import type { TemplateProps } from './types';
import { CONTACT_CONFIG } from '@/config/contact';
import Link from 'next/link';

export function TemplateHelpdesk({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: content.h1, url: route.path },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={breadcrumbs} />

        {/* Helpdesk Hero */}
        <section className="bg-brand-navy border-b border-brand-border-dark text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="container-custom">
            <div className="max-w-3xl space-y-4">
              <span className="badge-gold">{content.eyebrow || '24/7 Operations Desk'}</span>
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

        {/* Portal Access Grid */}
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Existing Client Login */}
              <div className="p-8 bg-brand-surface border border-brand-border rounded-sm space-y-6">
                <div className="w-12 h-12 bg-brand-navy text-brand-gold rounded-sm flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-navy">Client Portal Access</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Existing contracted clients: Access live CAFM work orders, statutory compliance certificates, and real-time engineer tracking.
                  </p>
                </div>
                <div className="p-4 bg-white border border-brand-border rounded-sm text-xs text-slate-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>Real-time work order logging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>Compliance certificate downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>SLA performance dashboards</span>
                  </div>
                </div>
                <a
                  href={`mailto:${CONTACT_CONFIG.helpdeskEmail}?subject=Portal Access Request`}
                  className="btn-primary w-full text-center text-xs py-3.5 block"
                >
                  Request Portal Login Credentials
                </a>
              </div>

              {/* Card 2: 24/7 Operations Desk Support */}
              <div className="p-8 bg-brand-charcoal border border-brand-border-dark rounded-sm text-white space-y-6">
                <div className="w-12 h-12 bg-brand-gold/20 text-brand-gold rounded-sm flex items-center justify-center border border-brand-gold/30">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">24/7 Operations Helpdesk</h3>
                  <p className="text-sm text-slate-300 mt-1">
                    For emergency plant failures, urgent M&E triage, or out-of-hours facilities assistance.
                  </p>
                </div>
                <div className="space-y-4 pt-2 border-t border-brand-border-dark text-xs">
                  <div>
                    <span className="text-slate-400 block">Emergency Helpdesk Line:</span>
                    <a href={CONTACT_CONFIG.mainPhone.href} className="text-brand-gold font-mono text-base font-bold hover:underline">
                      {CONTACT_CONFIG.mainPhone.display}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Operations Email:</span>
                    <a href={`mailto:${CONTACT_CONFIG.helpdeskEmail}`} className="text-white font-mono hover:text-brand-gold">
                      {CONTACT_CONFIG.helpdeskEmail}
                    </a>
                  </div>
                </div>
                <Link
                  href="/contact-us#enquiry"
                  className="btn-technical w-full text-center text-xs py-3 block"
                >
                  Submit Support Enquiry
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
