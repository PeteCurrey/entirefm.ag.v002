import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { CapabilityLandscape } from '@/components/suppliers/CapabilityLandscape';
import { SupplierEcosystemDirectory } from '@/components/suppliers/SupplierEcosystemDirectory';
import { DualAudienceSplit } from '@/components/suppliers/DualAudienceSplit';
import { AssuranceFrameworkGraphic } from '@/components/suppliers/AssuranceFrameworkGraphic';
import { OperationalJourneySteps } from '@/components/suppliers/OperationalJourneySteps';
import { SupplierLifecycleModel } from '@/components/suppliers/SupplierLifecycleModel';
import { SupplierStandardsGrid } from '@/components/suppliers/SupplierStandardsGrid';
import { SupplierFAQSection } from '@/components/suppliers/SupplierFAQSection';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Award, Layers, Cpu } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers', {
  title: 'Supplier & Partner Network | Facilities Management Supply Chain | EntireFM',
  description:
    'EntireFM operates a controlled, auditable, and performance-managed supply chain across the UK. Partner with EntireFM for recurring maintenance, specialist engineering, and commercial growth.',
});

export default function SupplierHubPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Supplier & Partner Network', url: '/suppliers' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="SUPPLY CHAIN &amp; PARTNER NETWORK // UK ESTATE DELIVERY"
          title="Built on strong partnerships."
          subtitle="Controlled by stronger standards."
          intro="EntireFM works with carefully selected national contractors, regional specialist SMEs, manufacturers, OEMs, and technology providers to deliver governed facilities services across UK client estates."
          imageSrc="/images/editorial/entirefm-switchroom-survey-2000w.webp"
          imageAlt="EntireFM compliance and engineering directors conducting plant room supplier audit"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Become an EntireFM Supplier', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'How We Vet Our Supply Chain', href: '/suppliers/vetting' }}
          facts={[
            { figure: '100% Proportional', label: 'Risk-Based Vetting', detail: 'Determined by trade & site sensitivity' },
            { figure: '8 Disciplines', label: 'Capability Landscape', detail: 'Hard FM, Fabric, Access, Fire, Tech' },
            { figure: 'EntireCAFM', label: 'Digital Job Management', detail: 'Automated dispatch & evidence sign-off' },
          ]}
        />

        <TrustBar />

        {/* 2. DUAL AUDIENCE VALUE PROPOSITION */}
        <DualAudienceSplit />

        {/* 3. CAPABILITY LANDSCAPE */}
        <CapabilityLandscape />

        {/* 4. COMPLETE SUPPLIER & PARTNER ECOSYSTEM DIRECTORY */}
        <SupplierEcosystemDirectory />

        {/* 5. ASSURANCE FRAMEWORK */}
        <AssuranceFrameworkGraphic />

        {/* 5. 10-STAGE OPERATIONAL JOURNEY */}
        <OperationalJourneySteps />

        {/* 6. SUPPLIER STANDARDS & ETHICS */}
        <SupplierStandardsGrid />

        {/* 7. SUPPLIER LIFECYCLE MODEL */}
        <SupplierLifecycleModel />

        {/* 8. FAQ ACCORDION */}
        <SupplierFAQSection />

        {/* 9. CLOSING CONVERSION STRIP */}
        <section className="py-20 bg-brand-graphite text-white border-t border-brand-edge-dark">
          <div className="container-custom max-w-4xl text-center space-y-6">
            <span className="text-xs font-light uppercase tracking-wider text-brand-electric-bright">
              JOIN THE NETWORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white">
              Ready to partner with EntireFM?
            </h2>
            <p className="text-sm sm:text-base text-brand-mist/80 font-light max-w-2xl mx-auto leading-relaxed">
              Whether you are an established regional specialist SME, an OEM manufacturer, or an innovative building technology company, we welcome credible commercial partnerships.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Start Supplier Application <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/suppliers/membership" className="btn-ghost-light">
                Supplier Platform &amp; Membership (£95/yr)
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
