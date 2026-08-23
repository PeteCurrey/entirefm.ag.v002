import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { CapabilityList, FAQAccordion } from '@/components/content/CapabilityList';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { RelatedLinks } from '@/components/content/CaseStudyFeature';
import { LocationImage, altForImage } from '@/components/content/LocationImage';
import { Phone, CheckCircle2, ArrowRight, MapPin } from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import type { TemplateProps } from './types';
import { CONTACT_CONFIG } from '@/config/contact';
import Link from 'next/link';

export function TemplatePrimaryLocation({ route, content }: TemplateProps) {
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
          name: `24/7 ${city} Emergency Engineering Dispatch`,
          description: `Rapid mobile engineering attendance for commercial power, HVAC, plumbing, and plant breakdowns in ${city}.`,
          tag: '24/7 Callout',
        },
        {
          name: `${city} Commercial Property Maintenance`,
          description: `SFG20 maintenance scheduling, statutory testing, and total facilities management across ${city}.`,
          tag: 'Maintenance',
        },
      ];

  const faqs = (content.faqs && content.faqs.length > 0)
    ? content.faqs
    : [
        {
          question: `What emergency response times does EntireFM offer in ${city}?`,
          answer: `Emergency callout windows are agreed contractually per site across ${city}, set by priority band and site criticality rather than promised as a single blanket figure.`,
        },
      ];

  const relatedLinks = (content.relatedRoutes || ['/locations', '/services', '/ppm', '/contact-us']).map(r => ({
    title: r.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    path: r,
    category: `${city} Service`,
    description: `Explore EntireFM capabilities for ${r.replace(/^\//, '').replace(/-/g, ' ')}.`,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={breadcrumbs} />

        {/* Dynamic Location Hero */}
        <section className="bg-brand-graphite border-b border-brand-edge-dark text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="badge-gold">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {city} Coverage
                  </span>
                  <span className="badge-technical text-slate-300">
                    {content.eyebrow || 'Regional Operations'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {content.h1}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  {content.heroIntro || content.metaDescription}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link href="#enquiry" className="btn-primary py-3 px-6 text-xs font-bold shadow-elevated">
                    Request {city} Proposal <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href={CONTACT_CONFIG.mainPhone.href} className="btn-phone py-3 px-4 text-xs font-semibold">
                    <Phone className="w-3.5 h-3.5 text-brand-electric" />
                    <span>Call {CONTACT_CONFIG.mainPhone.display}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-4 hidden lg:block space-y-4">
                {altForImage(content.heroImage) && (
                  <LocationImage src={content.heroImage} priority className="aspect-[16/10] shadow-elevated" />
                )}
                <div className="p-6 bg-brand-carbon border border-brand-edge-dark rounded-sm space-y-4 shadow-elevated">
                  <div className="flex items-center gap-3">
                    <BrandIcon name="nationwideCoverage" size={32} />
                    <span className="text-xs font-mono uppercase tracking-wider text-brand-electric block">{city} Service Summary</span>
                  </div>
                  <h3 className="text-base font-bold text-white">How Coverage Works</h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-electric shrink-0" />
                      <span>Mobile engineering teams working to the area</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-electric shrink-0" />
                      <span>Out-of-hours cover for contracted sites</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-electric shrink-0" />
                      <span>Comprehensive statutory certification</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Dynamic Capabilities Grid */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mb-12">
              <span className="badge-technical">Regional Services</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-graphite mt-2">
                Specialist Facilities Management Across {city}
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Delivering responsive engineering, planned maintenance, and statutory safety across {city}.
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
              <span className="badge-technical">Local FAQs</span>
              <h2 className="text-2xl font-bold text-brand-graphite mt-2">
                {city} Facilities Management — Common Questions
              </h2>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        {/* Related Links */}
        <section className="section-padding bg-white border-t border-brand-edge">
          <div className="container-custom">
            <div className="mb-8">
              <span className="badge-technical">Regional Network</span>
              <h2 className="text-2xl font-bold text-brand-graphite mt-2">
                Explore Local Services & Coverage
              </h2>
            </div>
            <RelatedLinks links={relatedLinks} />
          </div>
        </section>

        {/* Proposal / Conversion Section */}
        <ProposalSection
          defaultLocation={city}
          headline={`Request a Facilities Proposal for ${city}`}
          subheadline={`Speak to our team about planned maintenance contracts, compliance audits or a site survey for your ${city} estate.`}
        />
      </main>
      <Footer />
    </div>
  );
}
