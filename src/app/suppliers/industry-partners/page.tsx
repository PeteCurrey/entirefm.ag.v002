import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { OemDisciplineGrid } from '@/components/suppliers/interactive/OemDisciplineGrid';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { TrustBar } from '@/components/trust/TrustBar';
import { 
  Cpu, 
  Zap, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Wrench, 
  Award, 
  CheckCircle2, 
  Flame,
  FileCheck
} from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/industry-partners', {
  title: 'Industry & OEM Technology Alliances | Equipment Manufacturers | EntireFM',
  description:
    'Partner with EntireFM as an equipment manufacturer, OEM, or building technology provider. Direct factory warranty preservation, genuine spare parts, and pilot trials across live UK estates.',
});

export default function IndustryPartnersPublicPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Industry & OEM Partners', url: '/suppliers/industry-partners' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="MANUFACTURERS, OEMS &amp; TECHNOLOGY ALLIANCES"
          title="Bring better ideas"
          subtitle="into real buildings."
          intro="We collaborate directly with equipment manufacturers, controls vendors, IoT sensor developers, and smart FM innovators to optimize asset lifecycles, preserve warranties, and maximize energy efficiency across live UK estates."
          imageSrc="/images/editorial/entirefm-engineer-chiller-2000w.webp"
          imageAlt="EntireFM engineering directors collaborating with OEM chiller manufacturer technicians"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Explore OEM Collaboration', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'View Supplier Events', href: '/suppliers/events' }}
          facts={[
            { figure: 'Direct OEM', label: 'Warranty Preservation', detail: 'Factory-certified servicing' },
            { figure: 'Genuine Parts', label: 'Direct Supply Chain', detail: 'Zero counterfeit risk' },
            { figure: 'Live Testbed', label: 'Pilot Sandbox', detail: 'Validating smart technologies' },
          ]}
        />

        <TrustBar />

        {/* 2. OEM DISCIPLINE & ALLIANCE GRID */}
        <OemDisciplineGrid />

        {/* 3. THE MANUFACTURER COLLABORATION CHARTER (DARK BREAK) */}
        <section className="py-24 bg-brand-graphite text-white border-t border-b border-brand-edge-dark relative overflow-hidden">
          <div className="container-wide relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink block font-medium">
                  FACTORY INTEGRITY &amp; ASSET LIFECYCLE
                </span>
                <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white leading-tight">
                  Protecting Manufacturer Warranties on Critical Commercial Assets
                </h2>
                <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  Too often, non-certified third-party contractors void manufacturer warranties by using unapproved pattern parts or skipping factory commissioning steps. EntireFM builds direct reciprocal partnerships with OEMs to safeguard plant longevity.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-sm">
                    <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-white">100% Genuine OEM Spares</h4>
                      <p className="text-[11.5px] text-slate-400 font-light mt-0.5">Sourced directly through manufacturer distribution with verifiable provenance certificates.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-sm">
                    <Award className="h-5 w-5 text-brand-pink shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-white">Factory Training for EntireFM Technicians</h4>
                      <p className="text-[11.5px] text-slate-400 font-light mt-0.5">Annual hands-on training courses at manufacturer technical centres across Daikin, Trane, Ideal, and Trend.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-950/90 border border-slate-800 rounded-sm p-8 sm:p-10 shadow-2xl space-y-5">
                <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block">
                  MANUFACTURER ENGAGEMENT FORUMS
                </span>
                <h3 className="text-xl font-light text-white">
                  Technical Roundtables &amp; Product Demo Days
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Join EntireFM’s Partner Network Technical Forums. Deliver direct engineering briefings to regional contractors, property managers, and building asset directors.
                </p>
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-light">Explore upcoming sessions</span>
                  <Link href="/suppliers/events" className="btn-primary text-xs py-2.5 px-4">
                    View Event Programme <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CALL TO ACTION */}
        <section className="py-20 bg-white border-b border-slate-200 text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <span className="eyebrow eyebrow-light">STRATEGIC ALLIANCES</span>
            <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900">
              Discuss an OEM or Technology Partnership
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
              Connect with our Head of Supply Chain &amp; Technical Governance to explore structured manufacturer agreements and joint technical training.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Apply for Industry Partnership <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/suppliers/events" className="btn-ghost-dark">
                Explore Partner Events Hub
              </Link>
            </div>
          </div>
        </section>

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="INDUSTRY &amp; OEM PARTNERSHIPS"
          heading="Related supplier information"
          links={[
            {
              title: 'Partner Network',
              href: '/suppliers/partner-network',
              description: 'Collaborative ecosystem for contractors, specialists, and OEMs.',
              tag: 'NETWORK',
            },
            {
              title: 'Innovation & PropTech',
              href: '/suppliers/innovation',
              description: 'IoT sensors, AI diagnostics, smart metering, and predictive maintenance.',
              tag: 'INNOVATION',
            },
            {
              title: 'Events & Forums',
              href: '/suppliers/events',
              description: 'Manufacturer open days, product demonstrations, and technical sessions.',
              tag: 'EVENTS',
            },
            {
              title: 'Sustainability & ESG',
              href: '/suppliers/sustainability',
              description: 'Responsible sourcing, carbon targets, and supply chain ESG commitments.',
              tag: 'ESG',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
