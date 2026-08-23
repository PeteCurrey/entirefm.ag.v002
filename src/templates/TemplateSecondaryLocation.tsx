import React from 'react';
import { Header } from '@/components/layout/Header';
import { PageHero } from '@/components/hero/PageHero';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { CapabilityList, FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { LocationImage, altForImage } from '@/components/content/LocationImage';
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

  const heroFacts = [
    { figure: 'Coverage', label: `National reach, regional operations covering ${city}` },
    { figure: 'Response', label: 'Out-of-hours cover for contracted sites' },
    { figure: 'Compliance', label: 'Statutory testing, certified and recorded' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <PageHero
          eyebrow={content.eyebrow || 'Facilities Management'}
          title={content.h1}
          intro={content.heroIntro || content.metaDescription}
          path={route.path}
          imageSrc={altForImage(content.heroImage) ? content.heroImage : undefined}
          imageAlt={altForImage(content.heroImage) ?? undefined}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: `Request a ${city} proposal`, href: '#enquiry' }}
          facts={heroFacts}
        />

        <TrustBar />

        {/* Capabilities Grid */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mb-12">
              <span className="badge-technical">Planned Capabilities</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-graphite mt-2">
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
              <span className="badge-technical">Compliance FAQs</span>
              <h2 className="text-2xl font-bold text-brand-graphite mt-2">
                {city} Planned FM — Frequently Asked Questions
              </h2>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        {/* Related Links */}
        <section className="section-padding bg-white border-t border-brand-edge">
          <div className="container-custom">
            <div className="mb-8">
              <span className="badge-technical">Related Solutions</span>
              <h2 className="text-2xl font-bold text-brand-graphite mt-2">
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
