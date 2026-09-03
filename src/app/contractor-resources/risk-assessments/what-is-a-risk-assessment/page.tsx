import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContractorCinematicHero } from '@/components/contractors/ContractorCinematicHero';
import { ContractorQuickAnswer } from '@/components/contractors/ContractorQuickAnswer';
import { ContractorFaqAccordion } from '@/components/contractors/ContractorFaqAccordion';
import { ContractorConversionBanner } from '@/components/contractors/ContractorConversionBanner';
import { ContractorRelatedGrid } from '@/components/contractors/ContractorRelatedGrid';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { CONTRACTOR_RESOURCE_PAGES } from '@/config/contractor-seo-data';
import {
  ShieldAlert,
  CheckCircle2,
  Scale,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Calculator,
  Activity
} from 'lucide-react';

const config = CONTRACTOR_RESOURCE_PAGES['/contractor-resources/risk-assessments/what-is-a-risk-assessment'];

export const metadata: Metadata = generateRouteMetadata('/contractor-resources/risk-assessments/what-is-a-risk-assessment', {
  title: config.metaTitle,
  description: config.metaDescription,
});

export default function WhatIsRiskAssessmentPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* TechArticle Schema */}
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
                name: 'EntireFM Compliance Team',
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
              datePublished: '2026-02-01T08:00:00+00:00',
              dateModified: '2026-08-20T10:00:00+00:00',
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': 'https://www.entirefm.com/contractor-resources/risk-assessments/what-is-a-risk-assessment',
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
          primaryCta={{ label: 'How to Write a Risk Assessment', href: '/contractor-resources/risk-assessments/how-to-write-a-risk-assessment' }}
          secondaryCta={{ label: 'What Are RAMS? Guide', href: '/contractor-resources/rams/what-are-rams' }}
          facts={[
            { figure: '5 Steps', label: 'HSE Framework', detail: 'UK statutory standard' },
            { figure: '5x5 Matrix', label: 'Risk Scoring', detail: 'Likelihood × Severity' },
            { figure: 'Reg 3', label: 'MHSWR 1999', detail: 'Mandatory duty of care' },
          ]}
        />

        {/* 2. QUICK SUMMARY */}
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

        {/* 3. TECHNICAL CONTENT ARTICLE */}
        <article className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-16">
            {/* Hazard vs Risk */}
            <section className="space-y-4">
              <span className="eyebrow eyebrow-light">01 // CORE DEFINITIONS</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Hazard vs Risk: The Crucial Distinction
              </h2>
              <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  A common flaw in contractor safety documentation is confusing a <strong>hazard</strong> with a <strong>risk</strong>. In UK occupational health and safety:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  <div className="p-5 rounded-sm bg-[#FAFAF8] border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider block">
                      THE HAZARD
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">The Potential for Harm</h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      A hazard is anything with the intrinsic capacity to cause injury or damage. Examples: a high-voltage electrical cable, toxic refrigerant gas, an unguarded roof edge, or heavy rotating machinery.
                    </p>
                  </div>

                  <div className="p-5 rounded-sm bg-[#FAFAF8] border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                      THE RISK
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">The Likelihood &amp; Severity</h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      Risk is the chance (high or low) that someone will actually be harmed by the hazard, combined with how severe that harm could be. If the high-voltage cable is de-energised and padlocked, the hazard exists, but the risk is negligible.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* The 5 Steps to Risk Assessment */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">02 // HSE METHODOLOGY</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                The HSE 5 Steps to Risk Assessment
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                The UK Health and Safety Executive (HSE) promotes a five-step approach that forms the benchmark for all commercial maintenance risk assessments:
              </p>

              <div className="space-y-3 pt-2 text-xs">
                {[
                  { step: '1', title: 'Identify the hazards', desc: 'Inspect work areas, equipment, chemicals, working at height, and electrical sources.' },
                  { step: '2', title: 'Decide who might be harmed and how', desc: 'Identify affected personnel: engineers, apprentices, building occupants, cleaners, and the public.' },
                  { step: '3', title: 'Evaluate the risks and decide on control measures', desc: 'Score initial risk, apply the ERICPD hierarchy, and implement control measures to lower risk.' },
                  { step: '4', title: 'Record your significant findings', desc: 'Document the hazards, controls, and residual risk scores on your formal risk assessment sheet.' },
                  { step: '5', title: 'Review your assessment and update if necessary', desc: 'Revisit the assessment when site conditions, plant, or scope change, or after any incident.' },
                ].map((item) => (
                  <div key={item.step} className="p-4 bg-[#FAF9FB] border border-slate-200 rounded-sm flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-slate-600 font-light mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* The 5x5 Risk Matrix */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">03 // QUANTITATIVE SCORING</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                How a 5x5 Risk Matrix Works in Commercial FM
              </h2>
              <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  To make hazard assessment objective rather than subjective, facilities management organisations use a standard <strong>5×5 Risk Matrix</strong>.
                </p>
                <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-3 text-xs">
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    Risk Score = Likelihood (1–5) × Severity (1–5)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm">
                      <span className="font-bold text-emerald-800 block text-sm">1 – 6: Low Risk</span>
                      <span className="text-emerald-700 text-[11px] font-light">Acceptable. Proceed with baseline controls and standard PPE.</span>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm">
                      <span className="font-bold text-amber-800 block text-sm">8 – 12: Medium Risk</span>
                      <span className="text-amber-700 text-[11px] font-light">Tolerable with specific controls, supervision, and permit-to-work sign-off.</span>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-sm">
                      <span className="font-bold text-red-800 block text-sm">15 – 25: High Risk</span>
                      <span className="text-red-700 text-[11px] font-light">Unacceptable. Work must NOT proceed until further controls reduce the score.</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </article>

        {/* 4. FAQS */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <ContractorFaqAccordion
              eyebrow="RISK ASSESSMENT FAQS"
              title="Common Questions About Risk Assessments"
              subtitle="Everything you need to know about statutory duties, scoring, and client expectations."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 5. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="AUDIT-READY CONTRACTORS"
            title="Join the EntireFM Contractor Network"
            description="EntireFM engages vetted contractors who understand health &amp; safety compliance. Put your business forward for commercial maintenance contracts (£95+VAT annual membership)."
            primaryCtaLabel="Apply to Join Network"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="How to Write a Risk Assessment"
            secondaryCtaHref="/contractor-resources/risk-assessments/how-to-write-a-risk-assessment"
          />
        </div>

        {/* 6. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="FURTHER READING"
            title="Supporting Health &amp; Safety Intelligence"
            subtitle="Explore our practical step-by-step guides on writing risk assessments and RAMS."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
