import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { InteractiveFaqHub } from '@/components/suppliers/interactive/InteractiveFaqHub';
import { CommercialTransparencyBanner } from '@/components/suppliers/CommercialTransparencyBanner';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { TrustBar } from '@/components/trust/TrustBar';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/faq', {
  title: 'Supplier Network FAQ | Questions & Commercial Answers | EntireFM',
  description:
    'Frequently asked questions for contractors, specialists, OEMs, and technology partners joining the EntireFM Partner Network.',
});

export default function SupplierFaqPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Frequently Asked Questions', url: '/suppliers/faq' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="TRANSPARENT ADVISORY // SUPPLIER HELP DESK"
          title="Supplier &amp; Partner"
          subtitle="Network FAQ."
          intro="Direct, transparent answers regarding vetting, scoped approvals, commercial fees, operational payments, and digital work order allocation."
          imageSrc="/images/editorial/entirefm-client-review-2000w.webp"
          imageAlt="EntireFM supplier helpdesk and commercial advisory team"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Start Supplier Application', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'How We Work', href: '/suppliers/how-we-work' }}
          facts={[
            { figure: 'Instant Search', label: 'Knowledge Base', detail: 'Real-time question filter' },
            { figure: 'Zero Hidden Fees', label: 'Commercial Terms', detail: 'Prompt BACS remittances' },
            { figure: 'Direct Helpdesk', label: 'Support Desk', detail: 'Mon-Fri 08:00–17:30' },
          ]}
        />

        <TrustBar />

        {/* 2. INTERACTIVE CATEGORIZED FAQ HUB */}
        <InteractiveFaqHub />

        {/* 3. COMMERCIAL TRANSPARENCY BANNER */}
        <CommercialTransparencyBanner />

        {/* 4. Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="SUPPLIER INFORMATION &amp; RESOURCES"
          heading="Related supplier information"
          links={[
            {
              title: 'How We Work',
              href: '/suppliers/how-we-work',
              description: 'End-to-end 12-stage lifecycle from registration to work delivery.',
              tag: 'PROCESS',
            },
            {
              title: 'Membership & Fees',
              href: '/suppliers/membership',
              description: 'Commercial transparency on membership tiers, fees, and procurement separation.',
              tag: 'COMMERCIAL',
            },
            {
              title: 'Supplier Vetting',
              href: '/suppliers/vetting',
              description: '6-pillar assurance framework and trade competency benchmarks.',
              tag: 'VETTING',
            },
            {
              title: 'Compliance & Insurance',
              href: '/suppliers/compliance',
              description: 'Insurance thresholds, RAMS, CSCS, and certification requirements.',
              tag: 'COMPLIANCE',
            },
            {
              title: 'Become a Supplier',
              href: '/suppliers/apply',
              description: 'Start your pre-qualification submission for the EntireFM supply chain.',
              tag: 'APPLY',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
