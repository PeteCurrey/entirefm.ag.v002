import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { Building2, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import type { TemplateProps } from './types';
import Link from 'next/link';

export function TemplateCaseStudy({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Case Studies', url: '/case-studies' },
    { name: content.h1, url: route.path },
  ];

  const relatedLinks = (content.relatedRoutes || ['/services', '/ppm', '/contact-us']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: 'Related Capability',
    description: `Explore EntireFM capabilities for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={breadcrumbs} />

        {/* Case Study Hero */}
        <section className="bg-brand-navy border-b border-brand-border-dark text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="container-custom max-w-4xl space-y-4">
            <span className="badge-gold">{content.eyebrow || 'Commercial Estate Case Study'}</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {content.h1}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {content.heroIntro || content.metaDescription}
            </p>
          </div>
        </section>

        <TrustBar />

        {/* Case Study Details */}
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl space-y-8">
            <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
              <div>
                <span className="badge-technical">Operational Challenge</span>
                <h2 className="text-2xl font-bold text-brand-navy mt-2">
                  Client Estate & Operational Scope
                </h2>
                <p className="mt-2 text-slate-600">
                  EntireFM was appointed to manage mechanical and electrical building services, statutory compliance, and planned preventative maintenance to ensure continuous business operations and asset longevity.
                </p>
              </div>

              <div>
                <span className="badge-technical">Engineering Solution</span>
                <h2 className="text-2xl font-bold text-brand-navy mt-2">
                  Transition to Structured SFG20 Maintenance
                </h2>
                <p className="mt-2 text-slate-600">
                  Our engineering team conducted comprehensive asset verification surveys, logged all plant infrastructure into our digital CAFM portal, and deployed dedicated mobile engineers for scheduled PPM and 24/7 reactive response.
                </p>
              </div>

              {content.sections && content.sections.map((sec, idx) => (
                <div key={idx} className="pt-4 space-y-3">
                  <h2 className="text-2xl font-bold text-brand-navy">{sec.heading}</h2>
                  <p>{sec.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="section-padding bg-brand-surface border-t border-brand-border">
          <div className="container-custom max-w-4xl">
            <div className="mb-8">
              <span className="badge-technical">Related Capabilities</span>
              <h2 className="text-2xl font-bold text-brand-navy mt-2">
                Explore Relevant Services & Sectors
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>

        {/* Conversion Section */}
        <ProposalSection
          headline="Looking for Similar Estate Management Results?"
          subheadline="Consult with our operations team for portfolio dilapidation surveys, SFG20 maintenance reviews, and bespoke SLA proposals."
        />
      </main>
      <Footer />
    </div>
  );
}
