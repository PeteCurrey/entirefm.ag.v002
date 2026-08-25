import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { SupplierFAQSection, SUPPLIER_FAQS } from '@/components/suppliers/SupplierFAQSection';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/faq', {
  title: 'Supplier & Contractor FAQ | Facilities Management Supply Chain | EntireFM',
  description:
    'Frequently asked questions regarding EntireFM supplier vetting, SSIP accreditation, insurance thresholds, work order dispatch, invoice processing, and SME opportunities.',
});

export default function FAQPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Frequently Asked Questions', url: '/suppliers/faq' },
  ];

  // Schema.org FAQPage structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SUPPLIER_FAQS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />

      <main id="main" className="flex-grow">
        <SupplierHero
          eyebrow="KNOWLEDGE BASE // SUPPLIER &amp; PARTNER FAQ"
          title="Frequently asked questions."
          subtitle="Clear answers for contractors &amp; partners."
          intro="Find detailed information regarding EntireFM supplier qualification, insurance minimums, SSIP recognition, payment timelines, and preferred partner progression."
          imageSrc="/images/editorial/entirefm-switchroom-survey-2000w.webp"
          imageAlt="EntireFM facilities management support desk"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Start Supplier Application', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'Review Supplier Standards', href: '/suppliers/standards' }}
          facts={[
            { figure: '18+ Topics', label: 'FAQ Coverage', detail: 'From insurance to CAFM dispatch' },
            { figure: 'Clear Answers', label: 'Transparent Terms', detail: 'No procurement ambiguity' },
            { figure: 'Direct Help', label: 'Procurement Desk', detail: 'Human support available' },
          ]}
        />

        <TrustBar />

        {/* ACCORDION FAQ */}
        <SupplierFAQSection />

        {/* CTA */}
        <section className="py-20 bg-brand-carbon text-white border-t border-brand-edge-dark text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <h2 className="text-3xl font-extralight text-white">
              Still have questions regarding our supplier network?
            </h2>
            <p className="text-sm text-brand-mist/80 max-w-xl mx-auto font-light leading-relaxed">
              Our supply chain governance team is available to discuss specific trade accreditations or framework terms.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary inline-flex">
                Apply for Qualification <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact-us" className="btn-ghost-light inline-flex">
                Contact Procurement Desk
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
