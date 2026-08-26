import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { MembershipTierCards } from '@/components/suppliers/MembershipTierCards';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { TrustBar } from '@/components/trust/TrustBar';
import { 
  ShieldCheck, 
  Building2, 
  Cpu, 
  Users, 
  Award, 
  ArrowRight, 
  TrendingUp, 
  FileCheck, 
  Wrench, 
  Calendar, 
  Layers,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/partner-network', {
  title: 'EntireFM Partner Network | Regional Contractors, Specialists & OEMs',
  description:
    'Join the EntireFM Partner Network. A professionally managed supply-chain ecosystem for regional contractors, engineering specialists, OEMs, and building technology providers.',
});

export default function PartnerNetworkPublicPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Partner Network', url: '/suppliers/partner-network' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="ENTIREFM PARTNER NETWORK // COLLABORATIVE ECOSYSTEM"
          title="More than an approved"
          subtitle="supplier list."
          intro="The EntireFM Partner Network brings together capable regional contractors, engineering specialists, equipment manufacturers, and technology innovators within a professionally managed, transparent facilities management ecosystem."
          imageSrc="/images/editorial/entirefm-client-review-2000w.webp"
          imageAlt="EntireFM Partner Network directors meeting with regional engineering contractors"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Become an EntireFM Supplier', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'Events & Forums Programme', href: '/suppliers/events' }}
          facts={[
            { figure: 'Regional Hubs', label: 'UK Coverage', detail: 'Manchester, London, Leeds, Bristol' },
            { figure: '4 Operator Tiers', label: 'Ecosystem Diversity', detail: 'SMEs to Global OEMs' },
            { figure: 'EntireCAFM', label: 'Digital Dispatch', detail: 'Direct electronic work orders' },
          ]}
        />

        <TrustBar />

        {/* 2. REGIONAL ECOSYSTEM CLUSTERS */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">NATIONAL FOOTPRINT // REGIONAL CRAFT</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Active Supplier Hubs Across UK Conurbations
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                We combine the governance, insurance protection, and technology of a national FM company with the fast response, local knowledge, and craft of independent regional businesses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  region: 'North West & Midlands',
                  hub: 'Manchester & Birmingham',
                  coverage: 'Greater Manchester, Merseyside, Cheshire, West Midlands, Derbyshire',
                  trades: ['Commercial Gas & Boilers', 'Chiller & HVAC PPM', 'Emergency Drainage', 'Security Systems'],
                },
                {
                  region: 'Yorkshire & North East',
                  hub: 'Leeds & Newcastle',
                  coverage: 'West Yorkshire, South Yorkshire, Tyne & Wear, County Durham',
                  trades: ['M&E Building Services', 'Fixed Wire Testing (EICR)', 'Rooftop Safety & Fabric', 'Grounds Maintenance'],
                },
                {
                  region: 'London & South East',
                  hub: 'London & Home Counties',
                  coverage: 'Greater London, Surrey, Kent, Essex, Hertfordshire, Berkshire',
                  trades: ['High-Rise Façade Maintenance', 'BMS Controls & Niagara', 'Fire Alarms & Aspiration', 'Water Hygiene (L8)'],
                },
                {
                  region: 'South West & Wales',
                  hub: 'Bristol & Cardiff',
                  coverage: 'Bristol, Gloucestershire, Somerset, South Wales, Devon',
                  trades: ['Commercial Plumbing', 'Refrigeration & Cold Stores', 'Automatic Gates & Barriers', 'Industrial Cleaning'],
                },
              ].map((hub, idx) => (
                <div key={idx} className="p-7 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-brand-pink">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="text-xs font-medium uppercase tracking-wider">{hub.region}</span>
                    </div>
                    <h3 className="text-lg font-light text-slate-900">{hub.hub}</h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">{hub.coverage}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block mb-1.5">
                      ACTIVE CONTRACT DISCIPLINES
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {hub.trades.map((t, tIdx) => (
                        <span key={tIdx} className="text-[10.5px] bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-light">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. COMMERCIAL MEMBERSHIP & TRANSPARENCY SECTION */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">COMMERCIAL TIERS</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Transparent Partner Network Tiers
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Explore our commercial engagement levels, from baseline accredited supplier status to strategic partner alliance packages.
              </p>
            </div>

            <MembershipTierCards />
          </div>
        </section>

        {/* 4. PARTNER EVENTS STRIP (DARK BREAK) */}
        <section className="py-24 bg-brand-graphite text-white border-t border-b border-brand-edge-dark relative overflow-hidden">
          <div className="container-wide relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink block font-medium">
                  TECHNICAL COLLABORATION // EVENTS HUB
                </span>
                <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white leading-tight">
                  Connect at EntireFM Partner Forums &amp; Technical Sessions
                </h2>
                <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  We host technical breakfasts, manufacturer product demonstrations, and supply chain summits where contractors, OEMs, and property leaders meet to discuss statutory updates and new technology.
                </p>

                <div className="pt-2 flex flex-wrap gap-4">
                  <Link href="/suppliers/events" className="btn-primary">
                    View 2026 Event Programme <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/suppliers/industry-partners" className="btn-ghost-light">
                    Explore OEM Alliances
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-950/90 border border-slate-800 rounded-sm p-8 sm:p-10 shadow-2xl space-y-4">
                <div className="flex items-center gap-3 text-brand-pink">
                  <Calendar className="h-5 w-5 shrink-0" />
                  <span className="text-xs uppercase tracking-wider font-medium">UPCOMING FORUMS</span>
                </div>
                <h3 className="text-xl font-light text-white">
                  Regional Technical Breakfasts &amp; Briefings
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Join our Manchester, Birmingham, and London sessions covering Building Safety Act golden thread compliance, Heat Pump retrofits, and F-Gas statutory transition milestones.
                </p>
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-light">Free for registered partners</span>
                  <Link href="/suppliers/events" className="text-xs text-brand-pink hover:underline flex items-center gap-1 font-light">
                    Register Interest <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CALL TO ACTION */}
        <section className="py-20 bg-white border-b border-slate-200 text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <span className="eyebrow eyebrow-light">JOIN THE NETWORK</span>
            <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900">
              Apply to the EntireFM Partner Network
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
              Whether you are an established regional specialist SME, an OEM manufacturer, or an innovative building technology company, we welcome credible commercial partnerships.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Start Supplier Application <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/suppliers/how-we-work" className="btn-ghost-dark">
                Review 12-Step Lifecycle
              </Link>
            </div>
          </div>
        </section>

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="PARTNER NETWORK"
          heading="Related supplier information"
          links={[
            {
              title: 'How We Work',
              href: '/suppliers/how-we-work',
              description: 'End-to-end 12-stage operational journey, work allocation, and fair payment.',
              tag: 'PROCESS',
            },
            {
              title: 'Events & Forums',
              href: '/suppliers/events',
              description: 'Technical breakfasts, manufacturer open days, and regional networking forums.',
              tag: 'EVENTS',
            },
            {
              title: 'Membership & Fees',
              href: '/suppliers/membership',
              description: 'Partner Network commercial tiers, assurance fees, and governance firewalls.',
              tag: 'COMMERCIAL',
            },
            {
              title: 'Industry & OEM Partners',
              href: '/suppliers/industry-partners',
              description: 'Direct manufacturer equipment partnerships and factory-backed training.',
              tag: 'OEM',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
