import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { CapabilityList, FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { Phone, CheckCircle2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import type { TemplateProps } from './types';
import { CONTACT_CONFIG } from '@/config/contact';
import Link from 'next/link';

export function TemplateSecondaryLocation({ route, content }: TemplateProps) {
  const city = content.location || 'Regional';
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: content.h1, url: route.path },
  ];

  const capabilities = (content.capabilities && content.capabilities.length > 0)
    ? content.capabilities
    : [
        {
          name: 'SFG20 Planned Maintenance Scheduling',
          description: 'Structured PPM protecting mechanical plant and building fabric from unexpected failures.',
          tag: 'SFG20',
        },
        {
          name: 'Statutory Safety Certification',
          description: 'Timely periodic testing of electrical, gas, fire, and water systems with digital logs.',
          tag: 'Compliance',
        },
      ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `How do you structure planned maintenance in ${city}?`,
          answer: 'We conduct full site asset surveys, map all plant into our digital CAFM system, and execute scheduled SFG20 routines with certified engineers.',
        },
      ];

  const relatedLinks = (content.relatedRoutes || ['/locations', '/ppm', '/contact-us']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: `${city} Planned FM`,
    description: `Explore EntireFM capabilities for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={breadcrumbs} />

        {/* Planned Maintenance Hero */}
        <section className="bg-brand-navy border-b border-brand-border-dark text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="badge-gold">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {city} Planned Maintenance
                  </span>
                  <span className="badge-technical text-slate-300">
                    {content.eyebrow || 'PPM & Compliance'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {content.h1}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  {content.heroIntro || content.metaDescription}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link href="#enquiry" className="btn-primary py-3 px-6 text-xs font-bold shadow-command">
                    Request Planned FM Proposal <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href={CONTACT_CONFIG.mainPhone.href} className="btn-phone py-3 px-4 text-xs font-semibold">
                    <Phone className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Call {CONTACT_CONFIG.mainPhone.display}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-4 hidden lg:block">
                <div className="p-6 bg-brand-charcoal border border-brand-border-dark rounded-sm space-y-4 shadow-command">
                  <div className="flex items-center gap-3">
                    <BrandIcon name="complianceAudit" size={32} />
                    <span className="text-xs font-mono uppercase tracking-wider text-brand-gold block">PPM Factsheet</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Guaranteed Compliance</h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>SFG20 maintenance scheduling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Digital CAFM compliance records</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Single consolidated FM contract</span>
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
              <span className="badge-technical">Planned Capabilities</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-navy mt-2">
                Planned Maintenance & Compliance Services
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Systematic engineering routines protecting building value and ensuring safety compliance across {city}.
              </p>
            </div>

            <CapabilityList capabilities={capabilities} />
          </div>
        </section>

        {/* Rendered Body Sections */}
        {content.sections && content.sections.length > 0 && (
          <section className="section-padding bg-brand-surface border-y border-brand-border">
            <div className="container-custom max-w-4xl space-y-10">
              {content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-2xl font-bold text-brand-navy">{sec.heading}</h2>
                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{sec.body}</p>
                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="space-y-2 pt-2">
                      {sec.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
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
        <section className="section-padding bg-brand-surface border-t border-brand-border">
          <div className="container-custom max-w-4xl">
            <div className="mb-8">
              <span className="badge-technical">Compliance FAQs</span>
              <h2 className="text-2xl font-bold text-brand-navy mt-2">
                {city} Planned FM — Frequently Asked Questions
              </h2>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        {/* Related Links */}
        <section className="section-padding bg-white border-t border-brand-border">
          <div className="container-custom">
            <div className="mb-8">
              <span className="badge-technical">Related Solutions</span>
              <h2 className="text-2xl font-bold text-brand-navy mt-2">
                Explore Planned FM Solutions
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>

        {/* Proposal / Conversion Section */}
        <ProposalSection
          defaultLocation={city}
          defaultService="Planned Maintenance (PPM)"
          headline={`Request a Planned Maintenance Review for ${city}`}
          subheadline={`Our technical surveyors provide detailed asset condition reports, SFG20 maintenance schedules, and fixed-price proposals for ${city} estates.`}
        />
      </main>
      <Footer />
    </div>
  );
}
