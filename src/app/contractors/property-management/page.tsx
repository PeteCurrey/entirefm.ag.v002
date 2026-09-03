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
  Building2,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
  Users,
  Clock,
  ArrowRight,
  FileCheck
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/property-management'];

export const metadata: Metadata = generateRouteMetadata('/contractors/property-management', {
  title: config.metaTitle,
  description: config.metaDescription,
});

export default function PropertyManagementContractorPage() {
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
              name: 'Property Management Contractor Network',
              serviceType: 'Commercial Property Maintenance & Managing Agent Contractor Supply Chain',
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
          secondaryCta={{ label: 'Explore Commercial Maintenance', href: '/contractors/commercial-maintenance' }}
          facts={[
            { figure: '£95 / yr', label: 'Annual Membership', detail: 'Payable on submission' },
            { figure: 'Managed Estates', label: 'Property Portfolios', detail: 'Offices, logistics & retail' },
            { figure: 'Service Charge', label: 'Compliance Focus', detail: 'Clear scopes & photo sign-offs' },
          ]}
        />

        {/* 2. THE PROPERTY MANAGEMENT ECOSYSTEM */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">PROPERTY STAKEHOLDER ARCHITECTURE</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                How Landlords, Managing Agents &amp; FM Contractors Connect
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Operating within commercial property management requires understanding the chain of accountability between property owners, managing agents, and trade specialists.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold font-mono">
                  01
                </div>
                <h3 className="text-base font-semibold text-slate-900">Commercial Freeholder &amp; Landlord</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Owns the physical asset. Primarily focused on preserving capital yield, meeting landlord statutory compliance (EPCs, fire safety, building envelope), and maintaining full lease occupancy.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold font-mono">
                  02
                </div>
                <h3 className="text-base font-semibold text-slate-900">Managing Agent &amp; Surveyor</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Appointed by the landlord to administer leases, manage service charge budgets, coordinate tenant requests, and ensure building common parts adhere to legal standards.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-sm bg-[#EA580C] text-white flex items-center justify-center font-bold font-mono">
                  03
                </div>
                <h3 className="text-base font-semibold text-slate-900">EntireFM &amp; Approved Contractors</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Delivers operational building maintenance. EntireFM provides the centralised helpdesk, CAFM dispatch, and contract governance, while our approved network delivers boots-on-the-ground trade engineering.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. UNIQUE DEMANDS OF MANAGED PROPERTY */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-10">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">OPERATIONAL REALITIES</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                What Commercial Property Maintenance Demands
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                Working on commercial managed estates differs significantly from domestic or one-off commercial fit-out work.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
                  <span>Permits to Work &amp; Hot Works Governance</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  Commercial offices and high-density buildings enforce formal Permit-to-Work systems. Approved contractors must understand roof access permits, hot works permits, and live electrical isolation protocols.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Tenant Demarcation &amp; Etiquette</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  Engineers must understand the distinction between landlord common parts (landlord responsibility) and demised tenant areas. Operative conduct must remain professional and respectful in live corporate spaces.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Service Charge Accountability</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  Managing agents must justify every invoice to tenant committees. Quotations must be broken down by labour and materials, and jobs must be backed by photographic proof of work completed.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Punctual Attendance &amp; Emergency Escalation</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  A burst pipe or air conditioning outage in a multi-tenant office building can cause thousands in tenant disruption. Dependable communication and meeting agreed attendance windows is essential.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FAQS */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <ContractorFaqAccordion
              eyebrow="PROPERTY MANAGEMENT FAQS"
              title="Common Questions on Property Management Maintenance"
              subtitle="Everything you need to know about working on commercial estates with EntireFM."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 5. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="WORK WITH COMMERCIAL ESTATES"
            title="Join the EntireFM Property Maintenance Network"
            description="Put your business forward for commercial property maintenance work orders across our managed client portfolios. £95+VAT annual membership payable upon application submission."
            primaryCtaLabel="Apply to Join Network"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="Review Vetting Criteria"
            secondaryCtaHref="/contractors/approved-contractor-network"
          />
        </div>

        {/* 6. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="MAINTENANCE INTELLIGENCE"
            title="Supporting Guides for Property Contractors"
            subtitle="Explore our practical resources on planned maintenance, RAMS, and commercial engineering standards."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
