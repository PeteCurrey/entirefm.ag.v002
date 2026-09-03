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
  ShieldCheck,
  CheckCircle2,
  Lock,
  Award,
  ArrowRight,
  FileCheck,
  Users,
  Building2,
  Scale
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/approved-contractor-network'];

export const metadata: Metadata = generateRouteMetadata('/contractors/approved-contractor-network', {
  title: config.metaTitle,
  description: config.metaDescription,
});

export default function ApprovedContractorNetworkPage() {
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
              name: 'Approved Contractor Network UK',
              serviceType: 'Contractor Compliance Assurance & Approved Supplier Network',
              provider: {
                '@type': 'Organization',
                name: 'EntireFM',
                url: 'https://www.entirefm.com',
              },
              offers: {
                '@type': 'Offer',
                price: '95',
                priceCurrency: 'GBP',
                description: 'Annual Approved Contractor Network Membership (£95+VAT/year)',
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
          primaryCta={{ label: 'Apply for Approved Status', href: '/contractors/join' }}
          secondaryCta={{ label: 'Explore Commercial Maintenance', href: '/contractors/commercial-maintenance' }}
          facts={[
            { figure: '£95 / yr', label: 'Annual Membership', detail: 'Payable on submission' },
            { figure: 'SSIP Aligned', label: 'Safety Assurance', detail: 'CHAS / SafeContractor / SMAS' },
            { figure: 'Document Vault', label: 'Compliance Tracking', detail: '90/60/30-day radar alerts' },
          ]}
        />

        {/* 2. WHAT IS AN APPROVED CONTRACTOR NETWORK? */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">GOVERNANCE &amp; ASSURANCE</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                Understanding Approved Contractor Networks in the UK
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                In modern facilities management and commercial property ownership, building owners face severe legal liabilities under CDM 2015, the Building Safety Act 2022, and the Health &amp; Safety at Work etc. Act 1974.
              </p>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                An <strong>approved contractor network</strong> is an audited, actively monitored panel of trade and engineering businesses that have pre-verified their statutory competencies, health &amp; safety systems, and insurance cover. By pre-qualifying onto an approved panel, contractors remove client friction and gain immediate commercial standing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                <span className="text-[10px] font-mono text-[#EA580C] uppercase font-semibold">PILLAR 01</span>
                <h3 className="text-base font-semibold text-slate-900">Statutory Due Diligence</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Verification of Companies House standing, registered business structure, VAT registration, and declared trade trading history.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                <span className="text-[10px] font-mono text-[#EA580C] uppercase font-semibold">PILLAR 02</span>
                <h3 className="text-base font-semibold text-slate-900">Insurance Adequacy</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Confirmation of active £5m–£10m Public Liability and £10m Employers Liability policies with verified indemnity clauses.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                <span className="text-[10px] font-mono text-[#EA580C] uppercase font-semibold">PILLAR 03</span>
                <h3 className="text-base font-semibold text-slate-900">SSIP Safety Verification</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Mutual recognition under Safety Schemes in Procurement (CHAS, SafeContractor, Constructionline) confirming CDM 2015 Stage 1 competence.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                <span className="text-[10px] font-mono text-[#EA580C] uppercase font-semibold">PILLAR 04</span>
                <h3 className="text-base font-semibold text-slate-900">Technical Accreditations</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Trade-specific certifications (NICEIC, Gas Safe, Refcom, BAFE, BM TRADA) demonstrating competent person standards for site tasks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHAT CONTRACTORS MUST DEMONSTRATE */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-10">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">VETTING CRITERIA</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                What EntireFM Looks for in an Approved Contractor
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                When assessing applications for our approved network, our assurance team evaluates four essential operational attributes:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <ShieldCheck className="w-5 h-5 text-[#EA580C]" />
                  <span>1. Health, Safety &amp; RAMS Competency</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  We look for contractors who understand that generic safety templates do not work on live commercial sites. You must demonstrate the ability to produce concise, site-specific Risk Assessments and Method Statements (RAMS) tailored to the actual physical premises.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>2. Qualified &amp; Card-Carrying Workforce</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  Operatives attending EntireFM client buildings must hold verified trade cards (ECS Gold, JIB-PMES, CSCS Skilled Worker) and relevant manufacturer or statutory certifications. Unqualified labour is strictly forbidden on our commercial contracts.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <span>3. Realistic Operating Radius</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  We value regional density over unrealistic national claims. A contractor operating within a 30-mile radius who can reliably attend site within 2–4 hours is far more valuable to commercial building managers than a national provider with distant dispatch centres.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <FileCheck className="w-5 h-5 text-purple-600" />
                  <span>4. Digital Reporting &amp; Photographic Evidence</span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed">
                  Commercial clients demand verifiable closeout evidence. Approved contractors must provide prompt digital service reports detailing asset serial numbers, parts fitted, work completed, and clear before/after photos upon job completion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FAQS */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <ContractorFaqAccordion
              eyebrow="NETWORK ASSURANCE FAQS"
              title="Questions About Approved Contractor Status"
              subtitle="Everything you need to know about compliance requirements, Document Vaults, and audit readiness."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 5. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="READY TO QUALIFY?"
            title="Apply to Become an Approved EntireFM Contractor"
            description="Complete our online pre-qualification intake. Join our network of vetted regional trade specialists for commercial FM opportunities. £95+VAT annual membership payable upon application submission."
            primaryCtaLabel="Apply for Approved Status"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="View Trade Disciplines"
            secondaryCtaHref="/contractors"
          />
        </div>

        {/* 6. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="COMPLIANCE GUIDES"
            title="Deep Dives Into Contractor Assurance"
            subtitle="Explore our expert contractor guides on writing RAMS, method statements, and managing compliance."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
