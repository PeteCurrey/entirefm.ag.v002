import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContractorCinematicHero } from '@/components/contractors/ContractorCinematicHero';
import { ContractorQuickAnswer } from '@/components/contractors/ContractorQuickAnswer';
import { ContractorStepByStep } from '@/components/contractors/ContractorStepByStep';
import { ContractorFaqAccordion } from '@/components/contractors/ContractorFaqAccordion';
import { ContractorConversionBanner } from '@/components/contractors/ContractorConversionBanner';
import { ContractorRelatedGrid } from '@/components/contractors/ContractorRelatedGrid';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { CONTRACTOR_RESOURCE_PAGES } from '@/config/contractor-seo-data';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Building2,
  Award,
  ArrowRight,
  Briefcase
} from 'lucide-react';

const config = CONTRACTOR_RESOURCE_PAGES['/contractor-resources/winning-work/how-to-get-facilities-management-work'];

export const metadata: Metadata = generateRouteMetadata('/contractor-resources/winning-work/how-to-get-facilities-management-work', {
  title: config.metaTitle,
  description: config.metaDescription,
});

export default function HowToGetFacilitiesManagementWorkPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* Article Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: config.h1,
              description: config.metaDescription,
              image: `https://www.entirefm.com${config.heroImage.src}`,
              author: {
                '@type': 'Organization',
                name: 'EntireFM Commercial Intelligence',
                url: 'https://www.entirefm.com',
              },
              publisher: {
                '@type': 'Organization',
                name: 'EntireFM',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.entirefm.com/logos/06-crystalline-colour-mark.webp',
                },
              },
              datePublished: '2026-02-20T08:00:00+00:00',
              dateModified: '2026-08-20T10:00:00+00:00',
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': 'https://www.entirefm.com/contractor-resources/winning-work/how-to-get-facilities-management-work',
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
          primaryCta={{ label: 'Explore the 6-Step Roadmap', href: '#roadmap' }}
          secondaryCta={{ label: 'Apply to Join EntireFM', href: '/contractors/join' }}
          facts={[
            { figure: 'SSIP + £5M', label: 'Mandatory Baseline', detail: 'Public liability & accreditation' },
            { figure: '3 Channels', label: 'Procurement Routes', detail: 'Tenders, agents, networks' },
            { figure: 'Merit-Based', label: 'EntireFM Panel', detail: '£95/yr annual membership' },
          ]}
        />

        {/* 2. QUICK ANSWER */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            {config.quickSummary && (
              <ContractorQuickAnswer
                question={config.quickSummary.question}
                summary={config.quickSummary.summary}
                keyPoints={config.quickSummary.keyPoints}
                readTime={config.quickSummary.readTime}
              />
            )}
          </div>
        </section>

        {/* 3. STEP-BY-STEP STRATEGY ROADMAP */}
        <article id="roadmap" className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-16">
            <section className="space-y-4">
              <span className="eyebrow eyebrow-light">STRATEGIC BLUEPRINT</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                How to Win Work in UK Facilities Management
              </h2>
              <p className="text-sm sm:text-base font-light text-slate-600 leading-relaxed">
                Facilities management procurement operates on very different rules from domestic trade work. FM clients manage large corporate property portfolios under strict legal compliance and contractual SLAs.
              </p>
            </section>

            {config.steps && (
              <ContractorStepByStep
                eyebrow={config.steps.eyebrow}
                title={config.steps.title}
                subtitle={config.steps.subtitle}
                steps={config.steps.items}
                columns={config.steps.columns}
              />
            )}

            {/* Breaking Down the Compliance Prerequisites */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">PROCUREMENT CHECKLIST</span>
              <h3 className="text-2xl font-light text-slate-900 tracking-tight">
                What You Must Have in Place Before Pitching FM Clients
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                    <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
                    <span>SSIP Health &amp; Safety Accreditation</span>
                  </div>
                  <p className="text-slate-600 font-light leading-relaxed">
                    FM companies rarely accept unaccredited contractors. Holding a current SSIP certificate (such as CHAS, SafeContractor, or Constructionline) proves you meet UK CDM 2015 stage 1 safety standards.
                  </p>
                </div>

                <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Statutory Trade Competency</span>
                  </div>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Electrical contractors require NICEIC or NAPIT registration; HVAC contractors require Refcom and F-Gas certificates; commercial gas engineers require Gas Safe with commercial elements (COCN1).
                  </p>
                </div>

                <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>Commercial Insurance Thresholds</span>
                  </div>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Standard commercial FM contracts require a minimum of £5,000,000 Public Liability insurance (often £10M for high-value corporate sites) and £10,000,000 Employers Liability.
                  </p>
                </div>

                <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                    <FileCheck className="w-4 h-4 text-purple-600" />
                    <span>Site-Specific RAMS Capability</span>
                  </div>
                  <p className="text-slate-600 font-light leading-relaxed">
                    FM clients will not issue a Permit to Work without reviewing a compliant Risk Assessment and Method Statement. Demonstrating professional RAMS authoring is essential to winning repeat work.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>

        {/* 4. FAQS */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <ContractorFaqAccordion
              eyebrow="WINNING WORK FAQS"
              title="Common Questions About Winning FM Contracts"
              subtitle="Everything you need to know about SSIP accreditations, insurance limits, and joining approved panels."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 5. CONVERSION CALLOUT */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="FAST-TRACK YOUR FM JOURNEY"
            title="Join the EntireFM Contractor Network"
            description="Bypass complex public tenders. Join an approved panel of regional trade specialists considered for commercial facilities management contracts across the UK. £95+VAT annual membership payable upon application submission."
            primaryCtaLabel="Apply to Join Network"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="Explore Contractor Hub"
            secondaryCtaHref="/contractors"
          />
        </div>

        {/* 6. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="FURTHER GUIDES"
            title="Supporting Information for Contractors"
            subtitle="Explore our practical guides on method statements, planned maintenance, and contractor networks."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
