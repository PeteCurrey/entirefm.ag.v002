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
import { Phone, CheckCircle2, ArrowRight, Building, MapPin } from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import type { TemplateProps } from './types';
import { CONTACT_CONFIG } from '@/config/contact';
import Link from 'next/link';

export function TemplateThirdLocation({ route, content }: TemplateProps) {
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
          name: 'Managing Agent & Multi-Let Estate Care',
          description: 'Common parts maintenance, tenant liaison, and service charge management.',
          tag: 'Managing Agents',
        },
        {
          name: 'Corporate Reception & Workplace Hygiene',
          description: 'High-standard daily office cleaning, washroom servicing, and front-of-house support.',
          tag: 'Corporate Care',
        },
      ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `How do you support managing agents in ${city}?`,
          answer: 'We provide structured service delivery, transparent billing, and dedicated tenant communication to maintain property value and high tenant satisfaction.',
        },
      ];

  const relatedLinks = (content.relatedRoutes || ['/locations', '/services', '/contact-us']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: `${city} Corporate`,
    description: `Explore EntireFM capabilities for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
  }));

  const heroFacts = [
    { figure: 'Coverage', label: `Mobile engineering teams working to ${city}` },
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
              <span className="badge-technical">Corporate Scope</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-graphite mt-2">
                Corporate Real Estate & Managing Agent Services
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Elevating commercial building presentation, tenant satisfaction, and statutory governance across {city}.
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
              <span className="badge-technical">Governance FAQs</span>
              <h2 className="text-2xl font-bold text-brand-graphite mt-2">
                {city} Corporate FM — Frequently Asked Questions
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
                Explore Corporate & Commercial Solutions
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>

        {/* Proposal / Conversion Section */}
        <ProposalSection
          defaultLocation={city}
          headline={`Request a Portfolio Proposal for ${city}`}
          subheadline={`Consult with our commercial estates team. We provide tailored SLA frameworks, common area maintenance scopes, and site survey reviews.`}
        />
      </main>
      <Footer />
    </div>
  );
}
