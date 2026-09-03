import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContractorCinematicHero } from '@/components/contractors/ContractorCinematicHero';
import { ContractorFaqAccordion } from '@/components/contractors/ContractorFaqAccordion';
import { ContractorRelatedGrid } from '@/components/contractors/ContractorRelatedGrid';
import { ContractorApplicationWizard } from '@/components/suppliers/ContractorApplicationWizard';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { CONTRACTOR_COMMERCIAL_PAGES } from '@/config/contractor-seo-data';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  Lock,
  Award,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Zap
} from 'lucide-react';

const config = CONTRACTOR_COMMERCIAL_PAGES['/contractors/join'];

export const metadata: Metadata = generateRouteMetadata('/contractors/join', {
  title: config.metaTitle,
  description: config.metaDescription,
});

export default function ContractorJoinPage() {
  const applicationStages = [
    {
      num: '01',
      title: 'Company & Contact Details',
      desc: 'Declare your registered company name, Companies House number, trading structure, and primary commercial contact info.',
    },
    {
      num: '02',
      title: 'Trade Scope & Operating Territory',
      desc: 'Select your primary trade discipline (e.g. Electrical, HVAC, Mechanical) and operational radius (15 to 60+ miles from your base).',
    },
    {
      num: '03',
      title: 'Assurance & Accreditations',
      desc: 'Declare your Public Liability insurance limit (£5M/£10M), Employers Liability status, SSIP scheme (CHAS/SafeContractor), and trade registrations.',
    },
    {
      num: '04',
      title: 'Annual Membership Submission',
      desc: 'Review your application summary and complete the £95 + VAT annual membership payment to initiate technical desk review.',
    },
    {
      num: '05',
      title: 'Document Vault Activation',
      desc: 'Access your dedicated operating portal. Upload digital PDF copies of insurance schedules and certificates with automated expiry radar.',
    },
    {
      num: '06',
      title: 'Commercial Work Eligibility',
      desc: 'Upon technical verification, your business becomes eligible for consideration across matching commercial FM work orders.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* Service & Offer Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'EntireFM Contractor Network Membership',
              serviceType: 'Contractor Qualification & Network Platform',
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
                availability: 'https://schema.org/InStock',
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
          primaryCta={{ label: 'Start Application Below', href: '#application-start' }}
          secondaryCta={{ label: 'Review Vetting Standards', href: '/contractors/approved-contractor-network' }}
          facts={[
            { figure: '£95 / yr', label: 'Annual Membership', detail: 'Payable on submission' },
            { figure: '15 Mins', label: 'Simple Intake', detail: 'Self-paced application' },
            { figure: 'Merit-Based', label: 'Opportunity Access', detail: 'Trade & geography matched' },
          ]}
        />

        {/* 2. TRANSPARENT MEMBERSHIP PROPOSITION */}
        <section className="py-16 sm:py-20 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-8">
            <div className="space-y-3">
              <span className="eyebrow eyebrow-light">CLEAR COMMERCIAL TERMS</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                What Membership Is — And What It Is Not
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                We believe in total commercial transparency. Below is an honest summary of the EntireFM Contractor Network proposition.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="p-6 bg-white border border-emerald-200 rounded-sm space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>What Your £95 Membership Includes</span>
                </div>
                <ul className="space-y-2 text-slate-600 font-light">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Technical Desk Review:</strong> Rigorous verification of your trade competencies, insurance limits, and health &amp; safety credentials.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Operating Portal Access:</strong> EntireCAFM contractor workspace with Document Vault and 90/60/30-day compliance expiry tracking.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Merit-Based Consideration:</strong> Inclusion on our active panel for matching facilities management requirements across your declared travel radius.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Digital Job Packs:</strong> Standardised scopes of work, site induction notes, and streamlined digital service sign-off tools.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-slate-300 rounded-sm space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <AlertCircle className="w-4 h-4 text-[#EA580C] shrink-0" />
                  <span>What Membership Does NOT Mean</span>
                </div>
                <ul className="space-y-2 text-slate-600 font-light">
                  <li className="flex items-start gap-2">
                    <span className="text-[#EA580C] font-bold">•</span>
                    <span><strong>No Guaranteed Work:</strong> Membership does NOT guarantee that you will be awarded contracts or receive a set volume of job orders.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#EA580C] font-bold">•</span>
                    <span><strong>No Automatic Client Direct Access:</strong> Work orders are issued through EntireFM operational management, matching specific client requirements.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#EA580C] font-bold">•</span>
                    <span><strong>No Bypass of Quality Standards:</strong> Contractors who fail to uphold service levels, fail to follow RAMS, or let insurances lapse are removed from the active panel.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#EA580C] font-bold">•</span>
                    <span><strong>No Hidden Fees:</strong> One single £95 + VAT annual membership. We do not charge per-lead fees or hidden platform deductions.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. INTERACTIVE QUALIFICATION WIZARD */}
        <section id="application-start" className="py-20 sm:py-24 bg-white border-b border-slate-200 scroll-mt-12">
          <div className="container-custom max-w-4xl space-y-10">
            <div className="space-y-3">
              <span className="eyebrow eyebrow-light">ONLINE APPLICATION WIZARD</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                Start Your Contractor Application
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed max-w-2xl">
                Declare your technical trade disciplines, declared operational base, insurance limits, and accreditations below. Complete the 4-stage intake to initiate compliance review.
              </p>
            </div>

            {/* Suspense-wrapped intake wizard */}
            <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-slate-400">Loading Application Wizard...</div>}>
              <ContractorApplicationWizard />
            </Suspense>

            {/* Before You Start Checklist */}
            <div className="bg-[#FAFAF8] border border-slate-200 p-6 sm:p-8 rounded-sm space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-slate-900">Before You Begin Your Submission:</h3>
              <p className="text-slate-600 font-light">
                Having the following details readily available will allow you to complete the application in under 15 minutes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-700 font-light">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                  <span>Companies House registration number &amp; registered address</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                  <span>Operating base postcode &amp; maximum travel radius</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                  <span>Public Liability policy details (£5M–£10M limit)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                  <span>Trade competency details (NICEIC, Gas Safe, Refcom, BAFE, etc.)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                  <span>SSIP scheme reference (CHAS, SafeContractor, or Constructionline)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                  <span>Payment card for £95 + VAT annual membership fee</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ONBOARDING ROADMAP */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="eyebrow eyebrow-light">ONBOARDING LIFECYCLE</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                What Happens After You Submit
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                A structured, transparent review process from initial application to active contractor dispatch.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              {applicationStages.map((stage) => (
                <div
                  key={stage.num}
                  className="p-6 bg-white border border-slate-200 rounded-sm space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#EA580C] block mb-1">
                      PHASE {stage.num}
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">{stage.title}</h3>
                    <p className="text-slate-600 font-light leading-relaxed mt-2">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. FAQ */}
        <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <ContractorFaqAccordion
              eyebrow="JOINING FAQS"
              title="Frequently Asked Questions About Applications"
              subtitle="Clear answers about vetting, membership fees, and contractor onboarding."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 6. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="SUPPORTING RESOURCES"
            title="Guidance for Contractor Applicants"
            subtitle="Prepare your documentation and review standards before submitting your application."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
