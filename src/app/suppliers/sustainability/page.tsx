import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, Leaf, Truck, Recycle, Zap, Users, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/sustainability', {
  title: 'Supply Chain Sustainability & Social Value | EntireFM',
  description:
    'Discover EntireFM’s practical, evidence-led approach to supply chain sustainability, route optimization, waste reduction, local SME utilization, and social value.',
});

export default function SustainabilityPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Sustainability & Social Value', url: '/suppliers/sustainability' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <main id="main" className="flex-grow">
        <SupplierHero
          eyebrow="SUSTAINABILITY // PRACTICAL ESG & SOCIAL VALUE"
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

        {/* PRACTICAL PILLARS */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">MEASURABLE ESG COMMITMENTS</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                Our Seven Practical Supply Chain Priorities
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                We encourage and evaluate tangible sustainability improvements across seven operational categories:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Travel & Route Efficiency',
                  desc: 'Matching work orders to nearby regional specialists to cut vehicle emissions, congestion, and dead-leg mileage.',
                  icon: Truck,
                },
                {
                  title: 'Waste Diversion & Recycling',
                  desc: 'Responsible disposal of metals, filters, refrigerants, and packaging with verified Duty of Care audit trails.',
                  icon: Recycle,
                },
                {
                  title: 'Equipment & Asset Efficiency',
                  desc: 'Promoting energy-efficient plant replacements (VSD pumps, inverter HVAC, LED lighting, sub-metering).',
                  icon: Zap,
                },
                {
                  title: 'Local SME Utilisation',
                  desc: 'Prioritising local supply chains to retain economic spend within the communities surrounding client estates.',
                  icon: Users,
                },
                {
                  title: 'Ethical & Fair Employment',
                  desc: 'Fair wage rates, dignified working conditions, and robust health & safety training for all deployed operatives.',
                  icon: HeartHandshake,
                },
                {
                  title: 'Continual Carbon Reduction',
                  desc: 'Collaborating on fleet electrification, low-GWP refrigerants, and sustainable building materials.',
                  icon: Leaf,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-8 bg-white border border-slate-200 rounded-sm shadow-sm space-y-3">
                    <div className="w-10 h-10 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-light">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-carbon text-white border-t border-brand-edge-dark text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <h2 className="text-3xl font-extralight text-white">
              Partner with a Sustainability-Focused FM Provider
            </h2>
            <p className="text-sm text-brand-mist/80 max-w-xl mx-auto font-light leading-relaxed">
              If your business delivers practical environmental improvements and certified trade craft, join the EntireFM supplier network.
            </p>
            <div className="pt-2">
              <Link href="/suppliers/apply" className="btn-primary inline-flex">
                Apply for Approved Status <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
