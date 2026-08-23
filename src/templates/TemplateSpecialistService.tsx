import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { CapabilityList, FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import type { TemplateProps } from './types';
import { CONTACT_CONFIG } from '@/config/contact';
import Link from 'next/link';

export function TemplateSpecialistService({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: content.h1, url: route.path },
  ];

  const capabilities = (content.capabilities && content.capabilities.length > 0)
    ? content.capabilities
    : [
        {
          name: 'Specialist Equipment & Access',
          description: 'High-reach access, heavy-duty machinery, and certified operatives.',
          tag: 'Specialist',
        },
        {
          name: 'Health & Safety Certified',
          description: 'Comprehensive risk assessments, method statements, and safety compliance.',
          tag: 'Safety',
        },
      ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `What standards govern EntireFM’s ${content.h1}?`,
          answer: 'All specialist operations adhere to relevant UK statutory health and safety regulations, environmental guidelines, and industry certifications.',
        },
      ];

  const relatedLinks = (content.relatedRoutes || ['/services', '/ppm', '/contact-us']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: 'Specialist Service',
    description: `Explore EntireFM capabilities for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={breadcrumbs} />

        {/* Dynamic Specialist Hero */}
        <section className="bg-brand-graphite border-b border-brand-edge-dark text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="badge-gold">{content.eyebrow || 'Specialist Services'}</span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {content.h1}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  {content.heroIntro || content.metaDescription}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link href="#enquiry" className="btn-primary py-3 px-6 text-xs font-bold shadow-elevated">
                    Request Specialist Proposal <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href={CONTACT_CONFIG.mainPhone.href} className="btn-phone py-3 px-4 text-xs font-semibold">
                    <Phone className="w-3.5 h-3.5 text-brand-electric" />
                    <span>Call {CONTACT_CONFIG.mainPhone.display}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-4 hidden lg:block">
                <div className="p-6 bg-brand-carbon border border-brand-edge-dark rounded-sm space-y-4 shadow-elevated">
                  <div className="flex items-center gap-3">
                    <BrandIcon name="integratedServices" size={32} />
                    <span className="text-xs font-mono uppercase tracking-wider text-brand-electric block">Specialist Factsheet</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Certified Delivery</h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-electric shrink-0" />
                      <span>Specialist plant & certified operators</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-electric shrink-0" />
                      <span>Full statutory RAMS & method statements</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-electric shrink-0" />
                      <span>National mobilization capability</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Capabilities Grid */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mb-12">
              <span className="badge-technical">Capabilities</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-graphite mt-2">
                Specialist Scope & Methodologies
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Engineered for complex environments requiring specialized plant and strict safety procedures.
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
              <span className="badge-technical">Frequently Asked Questions</span>
              <h2 className="text-2xl font-bold text-brand-graphite mt-2">
                {content.h1} — Common Questions
              </h2>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        {/* Related Links */}
        <section className="section-padding bg-white border-t border-brand-edge">
          <div className="container-custom">
            <div className="mb-8">
              <span className="badge-technical">Related Services</span>
              <h2 className="text-2xl font-bold text-brand-graphite mt-2">
                Explore Specialist Solutions
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>

        {/* Proposal / Conversion Section */}
        <ProposalSection
          defaultService={content.service || content.h1}
          headline={`Request a Proposal for ${content.h1}`}
          subheadline="Consult with our technical operations team for project surveys, method statements, and specialist contract pricing."
        />
      </main>
      <Footer />
    </div>
  );
}
