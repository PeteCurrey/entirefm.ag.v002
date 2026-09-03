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
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  FileCheck,
  ArrowRight,
  Calculator,
  Wrench
} from 'lucide-react';

const config = CONTRACTOR_RESOURCE_PAGES['/contractor-resources/risk-assessments/how-to-write-a-risk-assessment'];

export const metadata: Metadata = generateRouteMetadata('/contractor-resources/risk-assessments/how-to-write-a-risk-assessment', {
  title: config.metaTitle,
  description: config.metaDescription,
});

export default function HowToWriteRiskAssessmentPage() {
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
                name: 'EntireFM Safety Assurance Desk',
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
              datePublished: '2026-02-05T08:00:00+00:00',
              dateModified: '2026-08-20T10:00:00+00:00',
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': 'https://www.entirefm.com/contractor-resources/risk-assessments/how-to-write-a-risk-assessment',
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
          primaryCta={{ label: 'Explore the 5 Stages Below', href: '#workflow' }}
          secondaryCta={{ label: 'What Is a Risk Assessment?', href: '/contractor-resources/risk-assessments/what-is-a-risk-assessment' }}
          facts={[
            { figure: '5 Stages', label: 'Practical Workflow', detail: 'HSE aligned methodology' },
            { figure: 'ERICPD', label: 'Control Hierarchy', detail: 'Eliminate → Reduce → Isolate' },
            { figure: 'Residual Score', label: 'Target Mitigation', detail: 'Low to medium required' },
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

        {/* 3. STEP-BY-STEP WORKFLOW */}
        <article id="workflow" className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-16">
            <section className="space-y-4">
              <span className="eyebrow eyebrow-light">AUTHORING BLUEPRINT</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                Step-by-Step: Writing an Audit-Proof Risk Assessment
              </h2>
              <p className="text-sm sm:text-base font-light text-slate-600 leading-relaxed">
                A strong risk assessment is not about generating reams of paperwork. It is about systematically examining the work, applying practical safeguards, and recording evidence of clear technical competence.
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

            {/* Practical Plantroom Example */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">WORKED EXAMPLE</span>
              <h3 className="text-2xl font-light text-slate-900 tracking-tight">
                Plantroom Risk Assessment Matrix: Replacing a Heating Pump
              </h3>
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4 text-xs">
                <p className="text-slate-700 font-light leading-relaxed">
                  Here is how an engineer applies initial scoring, ERICPD control measures, and residual scoring for a commercial pump replacement:
                </p>

                <div className="overflow-x-auto border border-slate-200 rounded-sm bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white font-mono uppercase tracking-wider text-[11px]">
                        <th className="p-3 border-b border-slate-800">Hazard</th>
                        <th className="p-3 border-b border-slate-800">Who Harmed</th>
                        <th className="p-3 border-b border-slate-800">Initial (L×S)</th>
                        <th className="p-3 border-b border-slate-800">Control Measures (ERICPD)</th>
                        <th className="p-3 border-b border-slate-800">Residual (L×S)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px]">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">Live Electricity (400V 3-Phase)</td>
                        <td className="p-3 text-slate-600">Site Engineer</td>
                        <td className="p-3 font-mono font-bold text-red-600">3 × 5 = 15 (High)</td>
                        <td className="p-3 text-slate-600 font-light">
                          Isolate circuit breaker; apply LOTO padlock; test dead using calibrated 2-pole voltage indicator and proving unit; secure keys with lead engineer.
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-700">1 × 5 = 5 (Low)</td>
                      </tr>
                      <tr className="hover:bg-slate-50 bg-[#FAFAF8]">
                        <td className="p-3 font-semibold text-slate-900">Scalding Water &amp; Pressure</td>
                        <td className="p-3 text-slate-600">Site Engineer &amp; Apprentice</td>
                        <td className="p-3 font-mono font-bold text-red-600">4 × 4 = 16 (High)</td>
                        <td className="p-3 text-slate-600 font-light">
                          Allow heating circuit to cool below 40°C; close isolating valves before and after pump; drain pump casing via drain cock to bucket; check pressure gauge reads 0 bar.
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-700">1 × 4 = 4 (Low)</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">Heavy Pump Manual Handling (45kg)</td>
                        <td className="p-3 text-slate-600">Site Engineers</td>
                        <td className="p-3 font-mono font-bold text-amber-600">3 × 3 = 9 (Medium)</td>
                        <td className="p-3 text-slate-600 font-light">
                          Two-person lift; use hydraulic lifting trolley to transport pump across plantroom floor; clear slip and trip hazards along transport route.
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-700">1 × 3 = 3 (Low)</td>
                      </tr>
                    </tbody>
                  </table>
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
              title="Common Authoring Questions"
              subtitle="Clear guidance on ERICPD, scoring calculations, and dynamic risk reviews."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 5. CONVERSION CALLOUT */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="JOIN OUR NETWORK"
            title="Join the EntireFM Contractor Network"
            description="EntireFM works with competent trade contractors across commercial FM contracts. £95+VAT annual membership payable upon application submission."
            primaryCtaLabel="Apply to Join Network"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="What Are RAMS? Overview"
            secondaryCtaHref="/contractor-resources/rams/what-are-rams"
          />
        </div>

        {/* 6. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="FURTHER GUIDES"
            title="Explore Related Safety Resources"
            subtitle="Deepen your technical safety knowledge with our paired contractor guides."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
