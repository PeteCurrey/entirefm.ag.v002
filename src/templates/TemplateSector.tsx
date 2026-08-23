import React from 'react';
import { Header } from '@/components/layout/Header';
import { PageHero } from '@/components/hero/PageHero';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { CapabilityList, FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { ShieldCheck, CheckCircle2, Phone, ArrowRight } from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import type { TemplateProps } from './types';
import { CONTACT_CONFIG } from '@/config/contact';
import Link from 'next/link';

export function TemplateSector({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Sectors', url: '/sectors' },
    { name: content.h1, url: route.path },
  ];

  const capabilities = (content.capabilities && content.capabilities.length > 0)
    ? content.capabilities
    : [
        {
          name: 'Sector-Specific Compliance Audits',
          description: 'Rigorous health, safety, and environmental statutory compliance.',
          tag: 'Compliance',
        },
        {
          name: 'Planned Plant Maintenance & Uptime',
          description: 'SFG20 maintenance routines preventing costly operational disruptions.',
          tag: 'Maintenance',
        },
      ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `How does EntireFM deliver facilities management for ${content.h1}?`,
          answer: 'We develop bespoke maintenance frameworks matching your sector operating hours, hygiene standards, and regulatory mandates.',
        },
      ];

  const relatedLinks = (content.relatedRoutes || ['/sectors', '/ppm', '/contact-us']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: 'Sector Solution',
    description: `Learn more about EntireFM's capabilities for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <PageHero
          eyebrow={content.eyebrow || content.sector || 'Sector'}
          title={content.h1}
          intro={content.heroIntro || content.metaDescription}
          path={route.path}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Discuss your estate', href: '#enquiry' }}
        />

        <TrustBar />

        {/* Capabilities Grid */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mb-12">
              <span className="badge-technical">Sector Capabilities</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-graphite mt-2">
                Specialist Management for {content.h1}
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Engineered to meet specific regulatory frameworks and operational challenges.
              </p>
            </div>

            <CapabilityList capabilities={capabilities} />
          </div>
        </section>

        {/* Rendered Body Sections */}
        {content.sections && content.sections.length > 0 && (
          <section className="section-padding bg-brand-surface border-y border-brand-edge">
            <div className="container-custom max-w-4xl space-y-10">
              {content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-2xl font-bold text-brand-graphite">{sec.heading}</h2>
                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{sec.body}</p>
                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="space-y-2 pt-2">
                      {sec.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-brand-electric shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Accreditations */}
        <section className="py-12 bg-white">
          <div className="container-custom">
            <AccreditationRail />
          </div>
        </section>

        {/* FAQs */}
        <section className="section-padding bg-brand-surface border-t border-brand-edge">
          <div className="container-custom max-w-4xl">
            <div className="mb-8">
              <span className="badge-technical">Sector Questions</span>
              <h2 className="text-2xl font-bold text-brand-graphite mt-2">
                {content.h1} — Frequently Asked Questions
              </h2>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        {/* Related Links */}
        <section className="section-padding bg-white border-t border-brand-edge">
          <div className="container-custom">
            <div className="mb-8">
              <span className="badge-technical">Related Sectors</span>
              <h2 className="text-2xl font-bold text-brand-graphite mt-2">
                Explore Industry Environments
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>

        {/* Proposal / Conversion Section */}
        <ProposalSection
          defaultService={content.h1}
          headline={`Request a Proposal for ${content.h1}`}
          subheadline="Consult with our sector specialists. We develop comprehensive SLA proposals tailored to your facility operations and compliance demands."
        />
      </main>
      <Footer />
    </div>
  );
}
