import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { SustainabilityFramework } from '@/components/suppliers/interactive/SustainabilityFramework';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, Leaf, Truck, Recycle, Zap, Users, HeartHandshake, CheckCircle2, TrendingDown, Sun } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/sustainability', {
  title: 'Supply Chain Sustainability & Social Value | Decarbonisation | EntireFM',
  description:
    'Discover EntireFM’s practical, evidence-led approach to supply chain sustainability, Scope 3 fleet decarbonisation, circular waste diversion, and local SME social value.',
});

export default function SustainabilityPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Sustainability & Social Value', url: '/suppliers/sustainability' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="SUSTAINABILITY // PRACTICAL ESG &amp; SOCIAL VALUE"
          title="Practical environmental progress."
          subtitle="Measurable supply chain impact."
          intro="EntireFM prioritises practical, verifiable environmental improvement over superficial ESG marketing. We work with suppliers to reduce vehicle miles, divert waste from landfill, and generate local social value."
          imageSrc="/images/editorial/entirefm-ev-charging-2000w.webp"
          imageAlt="EntireFM sustainable electric vehicle infrastructure and energy management"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Join Our Sustainable Network', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'Review Supplier Standards', href: '/suppliers/standards' }}
          facts={[
            { figure: 'Route Optimised', label: 'Travel Efficiency', detail: 'Minimising dead-mile travel' },
            { figure: 'Zero-to-Landfill', label: 'Waste Streams', detail: 'Verified recycling audits' },
            { figure: 'Regional SMEs', label: 'Local Economic Value', detail: 'Direct regional community spend' },
          ]}
        />

        <TrustBar />

        {/* 2. FOUR PILLARS SUSTAINABILITY FRAMEWORK */}
        <SustainabilityFramework />

        {/* 3. PRACTICAL ESG CALLOUT & METRICS (DARK BREAK) */}
        <section className="py-24 bg-brand-graphite text-white border-t border-b border-brand-edge-dark relative overflow-hidden">
          <div className="container-wide relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink block font-medium">
                  SCOPE 3 DECARBONISATION TARGETS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white leading-tight">
                  Driving Verifiable Carbon Reductions on Live UK Portfolios
                </h2>
                <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  Real sustainability happens on the road and in the plantroom. By dispatching local contractors, enforcing refrigerant reclamation, and recovering waste heat, we help property owners achieve true Net Zero milestones.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-sm">
                    <div className="text-2xl font-light text-brand-pink">60%+</div>
                    <div className="text-xs text-slate-300 font-light mt-1">Regional SME Spend Ringfence</div>
                  </div>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-sm">
                    <div className="text-2xl font-light text-emerald-400">100%</div>
                    <div className="text-xs text-slate-300 font-light mt-1">F-Gas Reclamation Audit Logs</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-950/90 border border-slate-800 rounded-sm p-8 sm:p-10 shadow-2xl space-y-4">
                <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block">
                  SOCIAL VALUE COMMITMENT
                </span>
                <h3 className="text-xl font-light text-white">
                  Local Community Wealth Building
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  When a commercial building is maintained by local craftspeople who live within 20 miles of the asset, wealth stays within the community, vehicle carbon is slashed, and emergency response times improve dramatically.
                </p>
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-light">Join our sustainable supply chain</span>
                  <Link href="/suppliers/apply" className="btn-primary text-xs py-2.5 px-4">
                    Apply Now <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CALL TO ACTION */}
        <section className="py-20 bg-white border-b border-slate-200 text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <span className="eyebrow eyebrow-light">ESG LEADERSHIP</span>
            <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900">
              Partner with a Sustainability-Focused FM Provider
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
              If your business delivers practical environmental improvements and certified trade craft, join the EntireFM supplier network.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Apply for Approved Status <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/suppliers/standards" className="btn-ghost-dark">
                Review Operating Standards
              </Link>
            </div>
          </div>
        </section>

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="SUSTAINABILITY &amp; ESG"
          heading="Related supplier information"
          links={[
            {
              title: 'Supplier Standards',
              href: '/suppliers/standards',
              description: 'Operational principles including environmental responsibility requirements.',
              tag: 'STANDARDS',
            },
            {
              title: 'Compliance & Governance',
              href: '/suppliers/compliance',
              description: 'COSHH, F-Gas, and waste legislation compliance requirements.',
              tag: 'COMPLIANCE',
            },
            {
              title: 'Innovation & PropTech',
              href: '/suppliers/innovation',
              description: 'IoT energy metering, predictive asset management, and carbon reporting.',
              tag: 'INNOVATION',
            },
            {
              title: 'Industry & OEM Partners',
              href: '/suppliers/industry-partners',
              description: 'Collaborations with equipment manufacturers on energy-efficient plant.',
              tag: 'OEM',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
