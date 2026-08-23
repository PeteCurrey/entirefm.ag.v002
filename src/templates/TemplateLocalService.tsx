import React from 'react';
import { Header } from '@/components/layout/Header';
import { PageHero } from '@/components/hero/PageHero';
import { altForImage } from '@/components/content/LocationImage';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { CapabilityList, FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { Phone, CheckCircle2, ArrowRight, MapPin } from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import type { TemplateProps } from './types';
import { CONTACT_CONFIG } from '@/config/contact';
import Link from 'next/link';

export function TemplateLocalService({ route, content }: TemplateProps) {
  const city = content.location || 'Local';
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: content.h1, url: route.path },
  ];

  const capabilities = (content.capabilities && content.capabilities.length > 0)
    ? content.capabilities
    : [
        {
          name: 'Direct Local Service Delivery',
          description: `Directly employed local technicians and specialist equipment servicing ${city}.`,
          tag: 'Local Delivery',
        },
        {
          name: 'Health, Safety & COSHH Compliance',
          description: 'Fully insured, certified, and compliant with all relevant safety standards.',
          tag: 'Safety',
        },
      ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `How quickly can you deliver ${content.h1} in ${city}?`,
          answer: `Our local teams provide flexible scheduling, including out-of-hours and rapid response for urgent requirements in ${city}.`,
        },
      ];

  const relatedLinks = (content.relatedRoutes || ['/locations', '/services', '/contact-us']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: 'Local Service',
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
              <span className="badge-technical">Service Capabilities</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-graphite mt-2">
                Specialist Scope & Standards
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Delivering high-quality, dependable {content.h1} for commercial properties in {city}.
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
                {content.h1} — Common Inquiries
              </h2>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        {/* Related Links */}
        <section className="section-padding bg-white border-t border-brand-edge">
          <div className="container-custom">
            <div className="mb-8">
              <span className="badge-technical">Explore More</span>
              <h2 className="text-2xl font-bold text-brand-graphite mt-2">
                Related Regional & Cleaning Services
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>

        {/* Proposal / Conversion Section */}
        <ProposalSection
          defaultLocation={city}
          defaultService={content.service || content.h1}
          headline={`Request a Quote for ${content.h1}`}
          subheadline={`Contact our local operations team for site surveys, scope of works, and fixed pricing in ${city}.`}
        />
      </main>
      <Footer />
    </div>
  );
}
