import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContractorCinematicHero } from '@/components/contractors/ContractorCinematicHero';
import { ContractorFaqAccordion } from '@/components/contractors/ContractorFaqAccordion';
import { ContractorConversionBanner } from '@/components/contractors/ContractorConversionBanner';
import { ContractorRelatedGrid } from '@/components/contractors/ContractorRelatedGrid';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { CONTRACTOR_COMMERCIAL_PAGES } from '@/config/contractor-seo-data';
import {
  Wrench,
  Cog,
  Wind,
  Zap,
  Droplets,
  Shield,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/commercial-maintenance'];

export const metadata: Metadata = generateRouteMetadata('/contractors/commercial-maintenance', {
  title: config.metaTitle,
  description: config.metaDescription,
});

export default function CommercialMaintenanceContractorPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* Service Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'Commercial Maintenance Contractor Network',
              serviceType: 'Commercial Property Maintenance & Engineering Services Panel',
              provider: {
                '@type': 'Organization',
                name: 'EntireFM',
                url: 'https://www.entirefm.com',
              },
              offers: {
                '@type': 'Offer',
                price: '95',
                priceCurrency: 'GBP',
                description: 'Annual Contractor Network Membership (£95+VAT/year)',
                url: 'https://www.entirefm.com/contractors/join',
              },
            }),
          }}
        />

        {/* 1. CINEMATIC HERO */}
        <ContractorCinematicHero
          eyebrow={config.eyebrow}
          title={config.h1}
          subtitle={config.subtitle}
          intro={config.intro}
          imageSrc={config.heroImage.src}
          imageAlt={config.heroImage.alt}
          breadcrumbs={config.breadcrumbs}
          primaryCta={{ label: 'Apply to Join Network', href: '/contractors/join' }}
          secondaryCta={{ label: 'Subcontractor Opportunities', href: '/contractors/subcontractor-opportunities' }}
          facts={[
            { figure: '£95 / yr', label: 'Annual Membership', detail: 'Payable on submission' },
            { figure: 'PPM + Reactive', label: 'Service Balance', detail: 'Scheduled & responsive call-outs' },
            { figure: 'SFG20 Aligned', label: 'Asset Maintenance', detail: 'Statutory compliance standards' },
          ]}
        />

        {/* 2. COMMERCIAL MAINTENANCE SERVICES SPECTRUM */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">CORE TECHNICAL SCOPES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Specialist Building Services Across UK Commercial Estates
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Commercial maintenance encompasses the entire lifecycle of physical plant, electrical systems, and building fabric. EntireFM delivers structured planned maintenance and emergency reactive cover through our approved contractor panel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Wind className="w-5 h-5 text-blue-600" />
                  <span>HVAC &amp; Chiller Maintenance</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  Scheduled servicing of commercial chillers, AHUs, fan coil units (FCUs), VRF/VRV air conditioning, and statutory F-Gas refrigerant leak inspections with digital F-Gas logbook generation.
                </p>
                <div className="pt-2 border-t border-slate-200 font-mono text-[11px] text-slate-500">
                  Refcom Elite • F-Gas Cat 1
                </div>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Zap className="w-5 h-5 text-[#EA580C]" />
                  <span>Commercial Electrical &amp; Compliance</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  Periodic fixed wire inspection and testing (EICR), distribution board thermal imaging, emergency lighting 3-hour discharge tests, switchgear maintenance, and EV charging infrastructure.
                </p>
                <div className="pt-2 border-t border-slate-200 font-mono text-[11px] text-slate-500">
                  18th Edition BS7671 • NICEIC / NAPIT
                </div>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Cog className="w-5 h-5 text-slate-800" />
                  <span>Mechanical &amp; Plantroom Services</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  Circulating and booster pump sets, pressurisation units, expansion vessels, 3-port control valves, commercial calorifiers, water heaters, and pipework insulation remediation.
                </p>
                <div className="pt-2 border-t border-slate-200 font-mono text-[11px] text-slate-500">
                  City &amp; Guilds Mechanical • Water Regs
                </div>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Droplets className="w-5 h-5 text-cyan-600" />
                  <span>Commercial Plumbing &amp; Water Hygiene</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  L8 water hygiene monitoring, calorifier blowdowns, TMV failsafe testing, cold water storage tank inspections, leak tracing, and commercial sanitaryware repairs.
                </p>
                <div className="pt-2 border-t border-slate-200 font-mono text-[11px] text-slate-500">
                  Gas Safe Commercial • WRAS • Legionella
                </div>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span>Roofing &amp; High-Level Building Fabric</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  Commercial flat roof membrane repairs, gutter clearance and vacuuming, rainwater downpipes, flashing maintenance, cladding repairs, and safe working at height.
                </p>
                <div className="pt-2 border-t border-slate-200 font-mono text-[11px] text-slate-500">
                  NFRC • Working at Height • IPAF / PASMA
                </div>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Wrench className="w-5 h-5 text-purple-600" />
                  <span>Building Fabric &amp; Fire Doors</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  Statutory fire door inspections and remediations (BM TRADA), commercial glazing, automated door operators, industrial roller shutters, flooring, and general carpentry.
                </p>
                <div className="pt-2 border-t border-slate-200 font-mono text-[11px] text-slate-500">
                  BM TRADA Fire Door • CSCS Skilled
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PPM VS REACTIVE MAINTENANCE */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-10">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">WORK CADENCE</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                Delivering Planned Care and Responsive Repairs
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Approved EntireFM contractors are engaged across both structured planned maintenance regimes and urgent reactive repairs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <span className="text-[10px] font-mono text-[#EA580C] uppercase font-semibold">PLANNED PREVENTATIVE MAINTENANCE</span>
                <h3 className="text-base font-semibold text-slate-900">Scheduled Annual Service Visits</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  PPM packages provide predictable, scheduled service dates booked weeks in advance. Contractors follow standardized SFG20 task checklists, inspect asset condition, lubricate components, test safety cut-offs, and generate statutory compliance certificates.
                </p>
                <ul className="space-y-1.5 text-slate-600 font-light pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Predictable engineer scheduling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Recurring annual contract stability</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Remedial quote generation from findings</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <span className="text-[10px] font-mono text-blue-600 uppercase font-semibold">REACTIVE MAINTENANCE &amp; BREAKDOWNS</span>
                <h3 className="text-base font-semibold text-slate-900">Responsive Problem Resolution</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  When critical building equipment trips, leaks, or fails, our central helpdesk dispatches local approved contractors based on proximity and declared response capabilities. Contractors attend site, make safe, diagnose the fault, and quote for permanent replacement parts.
                </p>
                <ul className="space-y-1.5 text-slate-600 font-light pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Agreed hourly rates and call-out fees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Optional 24/7 out-of-hours participation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Clear limits of expenditure for immediate make-safe</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FAQS */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <ContractorFaqAccordion
              eyebrow="COMMERCIAL MAINTENANCE FAQS"
              title="Common Questions About Commercial Maintenance"
              subtitle="Everything you need to know about working on commercial property contracts with EntireFM."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 5. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="PUT YOUR BUSINESS FORWARD"
            title="Join the EntireFM Commercial Maintenance Network"
            description="Connect your engineering business with commercial property maintenance opportunities. £95+VAT annual membership payable upon application submission."
            primaryCtaLabel="Apply to Join Network"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="Explore Subcontractor Options"
            secondaryCtaHref="/contractors/subcontractor-opportunities"
          />
        </div>

        {/* 6. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="MAINTENANCE EXPERTISE"
            title="Essential Reading for Maintenance Contractors"
            subtitle="Learn more about SFG20, planned maintenance schedules, and commercial RAMS standards."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
