import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContractorCinematicHero } from '@/components/contractors/ContractorCinematicHero';
import { ContractorQuickAnswer } from '@/components/contractors/ContractorQuickAnswer';
import { ContractorComparisonTable } from '@/components/contractors/ContractorComparisonTable';
import { ContractorFaqAccordion } from '@/components/contractors/ContractorFaqAccordion';
import { ContractorConversionBanner } from '@/components/contractors/ContractorConversionBanner';
import { ContractorRelatedGrid } from '@/components/contractors/ContractorRelatedGrid';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { CONTRACTOR_RESOURCE_PAGES } from '@/config/contractor-seo-data';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Briefcase,
  Layers,
  Scale,
  Building2
} from 'lucide-react';

const config = CONTRACTOR_RESOURCE_PAGES['/contractor-resources/rams/what-are-rams'];

export const metadata: Metadata = generateRouteMetadata('/contractor-resources/rams/what-are-rams', {
  title: config.metaTitle,
  description: config.metaDescription,
});

export default function WhatAreRamsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* Article & Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TechArticle',
              headline: config.h1,
              description: config.metaDescription,
              image: `https://www.entirefm.com${config.heroImage.src}`,
              author: {
                '@type': 'Organization',
                name: 'EntireFM Technical Compliance Desk',
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
              datePublished: '2026-01-15T08:00:00+00:00',
              dateModified: '2026-08-20T10:00:00+00:00',
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': 'https://www.entirefm.com/contractor-resources/rams/what-are-rams',
              },
            }),
          }}
        />

        {/* 1. FULL-SCREEN CINEMATIC HERO */}
        <ContractorCinematicHero
          eyebrow={config.eyebrow}
          title={config.h1}
          subtitle={config.subtitle}
          intro={config.intro}
          imageSrc={config.heroImage.src}
          imageAlt={config.heroImage.alt}
          breadcrumbs={config.breadcrumbs}
          primaryCta={{ label: 'How to Write RAMS Guide', href: '/contractor-resources/rams/how-to-write-rams' }}
          secondaryCta={{ label: 'Explore Contractor Network', href: '/contractors' }}
          facts={[
            { figure: 'MHSWR 1999', label: 'UK Legal Basis', detail: 'Regulation 3 statutory duty' },
            { figure: '2 Parts', label: 'Safety Package', detail: 'Risk Assessment + Method Statement' },
            { figure: 'Mandatory', label: 'Commercial FM', detail: 'Required for site permits' },
          ]}
        />

        {/* 2. QUICK ANSWER / TL;DR SECTION */}
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

        {/* 3. IN-DEPTH TECHNICAL GUIDE */}
        <article className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-16">
            {/* Section 1: Definition & Meaning */}
            <section className="space-y-4">
              <span className="eyebrow eyebrow-light">01 // MEANING &amp; FOUNDATION</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                What Does RAMS Stand For?
              </h2>
              <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  In UK building services, construction, and facilities management, <strong>RAMS</strong> is the universal acronym for <strong>Risk Assessment and Method Statement</strong>. It refers to a paired package of health and safety documentation that must be authored, reviewed, and signed before carrying out any intrusive, high-risk, or non-routine maintenance task.
                </p>
                <p>
                  While often compiled into a single document, a RAMS package comprises two distinct, complementary parts:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  <div className="p-5 rounded-sm bg-[#FAFAF8] border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider block">
                      PART 1: RISK ASSESSMENT (RA)
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">What Could Go Wrong?</h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      Identifies hazards associated with the job (e.g. electrical shock, falls from height, hazardous chemicals, moving plant), assesses who might be harmed and how, and defines the control measures required to reduce risk to an acceptable level.
                    </p>
                  </div>

                  <div className="p-5 rounded-sm bg-[#FAFAF8] border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                      PART 2: METHOD STATEMENT (MS)
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">How Will the Job Be Done Safely?</h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      Translates the control measures into a chronological, step-by-step procedure for the operatives. It details arrival, service isolations (LOTO), access equipment, PPE requirements, execution, testing, waste removal, and emergency rescue protocols.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Comparison Table */}
            {config.comparison && (
              <section className="pt-8 border-t border-slate-200">
                <ContractorComparisonTable
                  eyebrow={config.comparison.eyebrow}
                  title={config.comparison.title}
                  subtitle={config.comparison.subtitle}
                  colAName={config.comparison.colAName}
                  colBName={config.comparison.colBName}
                  rows={config.comparison.rows}
                />
              </section>
            )}

            {/* Section 3: Legal Basis */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">02 // STATUTORY LEGISLATION</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Are RAMS a Legal Requirement in the UK?
              </h2>
              <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  Contractors frequently ask whether the term "RAMS" appears in UK law. While the acronym itself is an industry convention, the obligations underpinning both halves are firmly anchored in statutory legislation:
                </p>
                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-4 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-1.5">
                    <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                      <Scale className="w-4 h-4 text-[#EA580C]" />
                      <span>Management of Health and Safety at Work Regulations 1999 (MHSWR)</span>
                    </div>
                    <p className="text-slate-600 font-light leading-relaxed">
                      <strong>Regulation 3</strong> places an explicit statutory duty on every employer and self-employed person to conduct a "suitable and sufficient assessment of the risks to the health and safety of his employees" and anyone else who may be affected by the undertaking. If employing 5 or more people, the significant findings must be recorded in writing.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-1.5">
                    <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                      <Scale className="w-4 h-4 text-blue-600" />
                      <span>Health and Safety at Work etc. Act 1974 (HASWA)</span>
                    </div>
                    <p className="text-slate-600 font-light leading-relaxed">
                      <strong>Section 2(2)(a)</strong> legally requires employers to provide and maintain "plant and systems of work that are, so far as is reasonably practicable, safe and without risks to health." The Method Statement is the recognised industry standard for specifying this Safe System of Work (SSoW).
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF9FB] border border-slate-200 rounded-sm space-y-1.5">
                    <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                      <Scale className="w-4 h-4 text-purple-600" />
                      <span>Construction (Design and Management) Regulations 2015 (CDM)</span>
                    </div>
                    <p className="text-slate-600 font-light leading-relaxed">
                      Under CDM 2015, Principal Contractors and clients must ensure that all contractors are competent and have planned work to prevent harm before allowing work to start on site. RAMS provides the primary documentary proof of this pre-construction planning.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Site-Specific RAMS vs Generic Templates */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">03 // COMMON MISTAKES</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Why Generic RAMS Templates Are Rejected by FM Clients
              </h2>
              <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  One of the most frequent points of friction between trade contractors and commercial facilities managers is the submission of generic, unedited safety templates.
                </p>
                <p>
                  A generic template might state "wear hard hats and work safely," but fails to account for:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-light pt-2">
                  <li className="flex items-start gap-2 p-3 bg-[#FAFAF8] border border-slate-200 rounded-sm">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>The physical location of asbestos containing materials (ACM)</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 bg-[#FAFAF8] border border-slate-200 rounded-sm">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Fragile roof lights or edge protection limitations</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 bg-[#FAFAF8] border border-slate-200 rounded-sm">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Occupied office tenant movements and noise restrictions</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 bg-[#FAFAF8] border border-slate-200 rounded-sm">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>Specific building isolation points (gas shutoffs, main breaker panels)</span>
                  </li>
                </ul>
                <p className="pt-2">
                  To pass an FM technical review desk, your RAMS must be visibly tailored to the physical building address and exact asset being maintained.
                </p>
              </div>
            </section>
          </div>
        </article>

        {/* 4. FAQS */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <ContractorFaqAccordion
              eyebrow="RAMS FAQS"
              title="Frequently Asked Questions About RAMS"
              subtitle="Clear answers about statutory compliance, signing requirements, and client review expectations."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 5. CONTEXTUAL CONVERSION CALLOUT */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="JOIN OUR APPROVED PANEL"
            title="Put Your Compliance Standards to Work"
            description="EntireFM works with professional trade contractors who understand the value of robust RAMS. Join our network for commercial FM opportunities. £95+VAT annual membership payable on submission."
            primaryCtaLabel="Apply to Join Network"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="How to Write RAMS Guide"
            secondaryCtaHref="/contractor-resources/rams/how-to-write-rams"
          />
        </div>

        {/* 6. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="CONTINUE READING"
            title="Supporting Health &amp; Safety Guides"
            subtitle="Explore our practical guides on method statements, risk assessments, and contractor compliance."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
