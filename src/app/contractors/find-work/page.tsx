import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContractorCinematicHero } from '@/components/contractors/ContractorCinematicHero';
import { ContractorFaqAccordion } from '@/components/contractors/ContractorFaqAccordion';
import { ContractorConversionBanner } from '@/components/contractors/ContractorConversionBanner';
import { ContractorRelatedGrid } from '@/components/contractors/ContractorRelatedGrid';
import { ContractorComparisonTable } from '@/components/contractors/ContractorComparisonTable';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { CONTRACTOR_COMMERCIAL_PAGES } from '@/config/contractor-seo-data';
import {
  CheckCircle2,
  Building2,
  Briefcase,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Search,
  FileCheck
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/find-work'];

export const metadata: Metadata = generateRouteMetadata('/contractors/find-work', {
  title: config.metaTitle,
  description: config.metaDescription,
});

export default function FindWorkContractorPage() {
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
              name: 'Find Facilities Management Work as a Contractor',
              serviceType: 'Contractor Commercial Work Procurement & Network Integration',
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
          secondaryCta={{ label: 'Review Due Diligence Standards', href: '/contractors/approved-contractor-network' }}
          facts={[
            { figure: '£95 / yr', label: 'Annual Membership', detail: 'Payable on submission' },
            { figure: '3 Key Routes', label: 'Market Procurement', detail: 'Tenders, agents, networks' },
            { figure: 'Merit-Based', label: 'Opportunity Access', detail: 'Based on compliance & skill' },
          ]}
        />

        {/* 2. THE THREE ROUTES TO COMMERCIAL FM WORK */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">PROCUREMENT INTELLIGENCE</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                The 3 Core Routes to Winning Facilities Management Contracts
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                For trade contractors, finding sustainable commercial work means understanding how building owners and facilities managers actually purchase trade services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold font-mono">
                    01
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">Direct Public &amp; Corporate Tendering</h3>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Bidding directly on public sector (Find a Tender) or major corporate framework contracts. Offers high contract value but involves extensive PQQ documentation, 3–6 month procurement cycles, high administrative costs, and intense margin competition.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-slate-500 font-mono text-[11px]">
                  High barrier to entry • Resource intensive
                </div>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold font-mono">
                    02
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">Managing Agent Supply Chains</h3>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Pitching individual property managers and managing agents overseeing multi-tenant offices and business parks. Provides local commercial work but requires individual account prospecting, relationship maintenance, and variable payment cycles.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-slate-500 font-mono text-[11px]">
                  Relationship driven • Variable volumes
                </div>
              </div>

              <div className="p-6 bg-white border-2 border-[#EA580C] rounded-sm space-y-3 flex flex-col justify-between shadow-xs">
                <div className="space-y-2.5">
                  <div className="w-8 h-8 rounded-sm bg-[#EA580C] text-white flex items-center justify-center font-bold font-mono">
                    03
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">Approved FM Contractor Networks</h3>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Joining managed supplier panels like EntireFM. Undergo one pre-qualification process, activate your compliance vault, and be considered for ongoing planned maintenance packages and reactive call-outs across pre-scoped regional commercial estates.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[#EA580C] font-semibold text-[11px]">
                  Recommended for regional trade SMEs
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. COMPARISON TABLE */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <ContractorComparisonTable
              eyebrow="STRATEGY COMPARISON"
              title="Direct Tendering vs Joining an Approved Contractor Network"
              subtitle="Evaluate the commercial reality of how contractors secure facilities management work."
              colAName="Approved Network (EntireFM)"
              colBName="Traditional Direct Tendering"
              rows={[
                {
                  attribute: 'Onboarding Speed',
                  colA: 'Fast: 1 streamlined intake and desk verification',
                  colB: 'Slow: Months of PQQ submissions and tender questionnaires',
                  highlight: true,
                },
                {
                  attribute: 'Administrative Overhead',
                  colA: 'Single Document Vault with automated renewal alerts',
                  colB: 'Repeatedly submitting policies and questionnaires for every bid',
                },
                {
                  attribute: 'Work Types',
                  colA: 'Pre-scoped PPM service orders and reactive call-outs',
                  colB: 'Rigid long-term contract commitments with punitive SLA penalties',
                },
                {
                  attribute: 'Payment Governance',
                  colA: 'Standardised invoicing referencing PO numbers',
                  colB: 'Protracted commercial sign-offs and dispute exposure',
                },
                {
                  attribute: 'SME Accessibility',
                  colA: 'Designed specifically for regional specialists and SMEs',
                  colB: 'Frequently excludes contractors without multi-million turnover',
                },
              ]}
            />
          </div>
        </section>

        {/* 4. HOW ENTIREFM MATCHES WORK */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-10">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">WORK ALLOCATION DISCIPLINE</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                How We Match Work Orders to Network Contractors
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Work allocation on our network is governed entirely by merit, proximity, and compliance. We do not sell leads or auction jobs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                <span className="text-[10px] font-mono text-[#EA580C] font-semibold uppercase">CRITERION 1</span>
                <h3 className="text-sm font-semibold text-slate-900">Trade Competence</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Engineers must hold certified qualifications for the specific technical asset (e.g. F-Gas Cat 1 for chillers, 18th Edition for switchgear).
                </p>
              </div>

              <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                <span className="text-[10px] font-mono text-[#EA580C] font-semibold uppercase">CRITERION 2</span>
                <h3 className="text-sm font-semibold text-slate-900">Geographic Proximity</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Jobs are routed to contractors whose declared operating base and travel radius cover the client building, reducing travel costs.
                </p>
              </div>

              <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                <span className="text-[10px] font-mono text-[#EA580C] font-semibold uppercase">CRITERION 3</span>
                <h3 className="text-sm font-semibold text-slate-900">Active Compliance</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Only contractors with active, unexpired Public Liability insurances and current SSIP certificates in their Document Vault are dispatched.
                </p>
              </div>

              <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                <span className="text-[10px] font-mono text-[#EA580C] font-semibold uppercase">CRITERION 4</span>
                <h3 className="text-sm font-semibold text-slate-900">SLA Track Record</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Contractors who consistently deliver punctual attendance, high-quality RAMS, and rapid digital closeout reports earn preferred status.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FAQS */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <ContractorFaqAccordion
              eyebrow="PROCUREMENT FAQS"
              title="Questions About Commercial FM Work"
              subtitle="Common questions from contractors looking to expand into commercial maintenance."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 6. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="READY TO ACCESS OPPORTUNITIES?"
            title="Join the EntireFM Contractor Network"
            description="Put your business forward for commercial facilities management contracts across your operating area. £95+VAT annual membership payable upon application submission."
            primaryCtaLabel="Apply to Join Network"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="View Vetting Requirements"
            secondaryCtaHref="/contractors/approved-contractor-network"
          />
        </div>

        {/* 7. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="WINNING FM WORK"
            title="Guides to Accelerating Contractor Growth"
            subtitle="Explore our comprehensive contractor guides on accreditations, RAMS, and tendering."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
