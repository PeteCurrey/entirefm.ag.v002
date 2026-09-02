import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { OperationalLifecycleEngine } from '@/components/suppliers/interactive/OperationalLifecycleEngine';
import { PaymentPerformanceBanner } from '@/components/suppliers/interactive/PaymentPerformanceBanner';
import { ScopedApprovalGraphic } from '@/components/suppliers/ScopedApprovalGraphic';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, CheckCircle2, ShieldCheck, Wrench, Clock, FileCheck, ArrowUpRight } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/how-we-work', {
  title: 'How We Work With Suppliers | Operational Lifecycle & Delivery | EntireFM',
  description:
    'Explore EntireFM’s 12-step supplier lifecycle: from initial registration and risk-based assurance to scoped approval and performance-monitored service delivery.',
});

export default function HowWeWorkPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'How We Work', url: '/suppliers/how-we-work' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="OPERATIONAL LIFECYCLE &amp; PROCUREMENT APPROACH"
          title="How EntireFM Works"
          subtitle="with Suppliers."
          intro="A structured, transparent, and auditable operational journey from registration to scoped approval and performance-monitored service delivery across UK client estates."
          imageSrc="/images/editorial/entirefm-engineer-chiller-2000w.webp"
          imageAlt="EntireFM compliance and engineering directors reviewing chiller maintenance"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Start Supplier Application', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'Review Vetting Standards', href: '/suppliers/vetting' }}
          facts={[
            { figure: '12 Stages', label: 'Operational Lifecycle', detail: 'From registration to payment' },
            { figure: 'Scoped Scope', label: 'Approval Granularity', detail: 'Trade & geography matched' },
            { figure: 'EntireCAFM', label: 'Digital Job Management', detail: 'Real-time mobile dispatch' },
          ]}
        />

        <TrustBar />

        {/* 2. THE 12-STEP OPERATIONAL LIFECYCLE ENGINE */}
        <OperationalLifecycleEngine />

        {/* 3. SCOPED APPROVAL & DISPATCH BOUNDARIES */}
        <ScopedApprovalGraphic />

        {/* 4. PAYMENT & PERFORMANCE COMMERCIAL COMMITMENT (DARK BREAK) */}
        <PaymentPerformanceBanner />

        {/* 5. CALL TO ACTION */}
        <section className="py-20 bg-brand-carbon text-white border-t border-brand-edge-dark">
          <div className="container-custom max-w-4xl text-center space-y-6">
            <span className="text-xs font-light uppercase tracking-wider text-brand-pink">
              SUPPLIER ONBOARDING INTAKE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white">
              Ready to Progress Through Our 12-Step Lifecycle?
            </h2>
            <p className="text-sm sm:text-base text-brand-mist/80 font-light max-w-2xl mx-auto leading-relaxed">
              Join verified engineering contractors and regional craft specialists delivering governed FM services across the United Kingdom.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Start Stage 1 Application <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/suppliers/onboarding" className="btn-ghost-light">
                Explore 4-Phase Onboarding
              </Link>
            </div>
          </div>
        </section>

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="OPERATIONAL GUIDANCE"
          heading="Related supplier information"
          links={[
            {
              title: 'Supplier Standards',
              href: '/suppliers/standards',
              description: 'H&S, quality, minimum insurances, and Code of Conduct expectations.',
              tag: 'STANDARDS',
            },
            {
              title: 'Supplier Vetting',
              href: '/suppliers/vetting',
              description: 'The 6-pillar risk-proportional assessment framework before site dispatch.',
              tag: 'ASSURANCE',
            },
            {
              title: 'Onboarding Process',
              href: '/suppliers/onboarding',
              description: '4-phase structured induction, verification, and digital agreement execution.',
              tag: 'ONBOARDING',
            },
            {
              title: 'Compliance & Safety',
              href: '/suppliers/compliance',
              description: 'Insurance minimums, dynamic RAMS, CSCS/SKILLcard, and certificate management.',
              tag: 'COMPLIANCE',
            },
            {
              title: 'Supplier FAQ',
              href: '/suppliers/faq',
              description: 'Frequently asked questions on vetting intervals, rate cards, and payment terms.',
              tag: 'SUPPORT',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
