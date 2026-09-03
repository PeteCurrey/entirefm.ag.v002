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
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Building2,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/subcontractor-opportunities'];

export const metadata: Metadata = generateRouteMetadata('/contractors/subcontractor-opportunities', {
  title: config.metaTitle,
  description: config.metaDescription,
});

export default function SubcontractorOpportunitiesPage() {
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
              name: 'Facilities Management Subcontractor Opportunities UK',
              serviceType: 'Commercial Subcontracting Framework & Contractor Supply Chain',
              provider: {
                '@type': 'Organization',
                name: 'EntireFM',
                url: 'https://www.entirefm.com',
              },
              offers: {
                '@type': 'Offer',
                price: '95',
                priceCurrency: 'GBP',
                description: 'Annual Subcontractor Network Membership (£95+VAT/year)',
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
          primaryCta={{ label: 'Apply for Subcontracting', href: '/contractors/join' }}
          secondaryCta={{ label: 'How the Network Works', href: '/contractors/find-work' }}
          facts={[
            { figure: '£95 / yr', label: 'Annual Membership', detail: 'Payable on submission' },
            { figure: 'PO Backed', label: 'Work Orders', detail: 'Pre-authorised commercial scopes' },
            { figure: 'Fair Terms', label: 'Commercial Payments', detail: 'Prompt invoice processing' },
          ]}
        />

        {/* 2. UNDERSTANDING FM SUBCONTRACTING */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">INDUSTRY FRAMEWORK</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                How Subcontracting Operates in UK Facilities Management
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Facilities management companies are responsible for total estate delivery across hundreds of commercial buildings. To service technical assets—from complex high-voltage switchgear and chillers to fire suppression systems and roof membranes—FM providers maintain dedicated supply chains of specialist subcontractors.
              </p>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                For trade and engineering contractors, subcontracting within an established network eliminates client acquisition overheads, provides pre-authorised purchase orders, and delivers regular work orders within your regional operating corridor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-mono font-bold">
                  01
                </div>
                <h3 className="text-base font-semibold text-slate-900">Clear Work Orders &amp; Scopes</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Every assignment is backed by an authoritative Purchase Order detailing asset location, site access instructions, contact details, and agreed labour/materials limits.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-mono font-bold">
                  02
                </div>
                <h3 className="text-base font-semibold text-slate-900">Standardised Compliance Handshake</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Undergo compliance vetting once through our Document Vault. Your insurances, SSIP certificates, and operative cards are held on record, eliminating repetitive paperwork.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-[#EA580C] text-white flex items-center justify-center font-mono font-bold">
                  03
                </div>
                <h3 className="text-base font-semibold text-slate-900">Dependable Commercial Accounting</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Clear, prompt invoice settlement. When your engineers complete the digital sign-off and provide photographic evidence, invoices are matched to POs for timely payment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HOW CONTRACTORS CAN POSITION THEMSELVES */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-10">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">CONTRACTOR BEST PRACTICE</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                How to Become a Preferred FM Subcontractor
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                FM operations desks allocate recurring planned maintenance packages and priority call-outs to subcontractors who consistently demonstrate four core operational behaviours:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Clock className="w-4 h-4 text-[#EA580C]" />
                  <span>1. Punctual Arrival &amp; Status Updates</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  Keeping the helpdesk informed when arriving on site and when work is completed. If parts are needed or access is delayed, notifying the team immediately allows us to update the client.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>2. Uncompromising RAMS &amp; Site Safety</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  Ensuring site engineers sign into the building, follow the agreed Method Statement, adhere to isolations (LOTO), and leave plantrooms immaculate after completing maintenance.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>3. High-Standard Digital Service Sheets</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  Submitting thorough service reports within 24 hours with exact asset serial numbers, readings, filter sizes, test results, and clear before/after photographs.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  <span>4. Transparent &amp; Accurate Invoicing</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  Invoices that clearly state the EntireFM Purchase Order number, break down labour and approved materials accurately, and match agreed contract rates without surprises.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FAQS */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <ContractorFaqAccordion
              eyebrow="SUBCONTRACTOR FAQS"
              title="Common Questions on Subcontracting with EntireFM"
              subtitle="Clear answers about purchase orders, payment terms, and working on commercial client sites."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 5. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="PUT YOUR BUSINESS FORWARD"
            title="Join the EntireFM Subcontractor Network"
            description="Access commercial facilities management subcontracting assignments. £95+VAT annual membership payable upon application submission."
            primaryCtaLabel="Apply for Subcontracting"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="Review Vetting Criteria"
            secondaryCtaHref="/contractors/approved-contractor-network"
          />
        </div>

        {/* 6. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="SUBCONTRACTING RESOURCES"
            title="Supporting Information for Trade Subcontractors"
            subtitle="Explore our practical guides on method statements, risk assessments, and getting FM work."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
