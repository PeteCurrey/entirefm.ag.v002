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
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Shield,
  ArrowRight,
  ClipboardList,
  Wrench,
  Flame,
  Users
} from 'lucide-react';

const config = CONTRACTOR_RESOURCE_PAGES['/contractor-resources/rams/how-to-write-rams'];

export const metadata: Metadata = generateRouteMetadata('/contractor-resources/rams/how-to-write-rams', {
  title: config.metaTitle,
  description: config.metaDescription,
});

export default function HowToWriteRamsPage() {
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
              '@type': 'TechArticle',
              headline: config.h1,
              description: config.metaDescription,
              image: `https://www.entirefm.com${config.heroImage.src}`,
              author: {
                '@type': 'Organization',
                name: 'EntireFM Technical Desk',
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
              datePublished: '2026-01-20T08:00:00+00:00',
              dateModified: '2026-08-20T10:00:00+00:00',
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': 'https://www.entirefm.com/contractor-resources/rams/how-to-write-rams',
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
          primaryCta={{ label: 'Explore Step-by-Step Guide', href: '#step-by-step' }}
          secondaryCta={{ label: 'What Are RAMS? Overview', href: '/contractor-resources/rams/what-are-rams' }}
          facts={[
            { figure: '11 Steps', label: 'Sequential Process', detail: 'From scoping to briefing' },
            { figure: 'ERICPD', label: 'Control Hierarchy', detail: 'HSE mitigation standard' },
            { figure: 'Audit-Ready', label: 'FM Compliance', detail: 'Pass client desk reviews' },
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

        {/* 3. STEP-BY-STEP 11-STAGE GUIDE */}
        <article id="step-by-step" className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-16">
            <section className="space-y-4">
              <span className="eyebrow eyebrow-light">PRACTICAL AUTHORING BLUEPRINT</span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                How to Write Client-Ready RAMS in 11 Steps
              </h2>
              <p className="text-sm sm:text-base font-light text-slate-600 leading-relaxed">
                Writing RAMS should never be a copy-and-paste exercise. Below is the exact 11-step operational process used by leading UK building engineering contractors to produce robust, audit-proof documentation.
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

            {/* Practical Example Walkthrough: Commercial Plantroom */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">WORKED CASE STUDY</span>
              <h3 className="text-2xl font-light text-slate-900 tracking-tight">
                Practical RAMS Example: Commercial Chiller Compressor Replacement
              </h3>
              <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-4 text-xs">
                <p className="text-slate-700 font-light leading-relaxed">
                  To illustrate how this 11-step process functions in the real world, consider an engineer replacing a semi-hermetic compressor on a rooftop chiller:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3.5 bg-white border border-slate-200 rounded-sm space-y-1">
                    <span className="font-semibold text-slate-900 block">Step 1 &amp; 2: Scope &amp; Hazards Identified</span>
                    <span className="text-slate-600 font-light block">
                      Rooftop location (working at height), 400V 3-phase supply (electrical shock), pressurised R32 refrigerant (cold burns, asphyxiation), 140kg compressor lift (manual handling/rigging).
                    </span>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-sm space-y-1">
                    <span className="font-semibold text-slate-900 block">Step 4 &amp; 5: Controls &amp; PPE Applied</span>
                    <span className="text-slate-600 font-light block">
                      Lockout Tagout (LOTO) on main chiller isolator with multi-padlock hasp; portable A-frame gantry with certified chain block for lift; recovery machine and dedicated cylinders; cryogenic gloves and face shield for refrigerant recovery.
                    </span>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-sm space-y-1">
                    <span className="font-semibold text-slate-900 block">Step 7: Method Statement Sequence</span>
                    <span className="text-slate-600 font-light block">
                      (1) Arrive, sign in at security, review asbestos register; (2) Walk rooftop access route; (3) Verify 0V across all terminals with calibrated multi-meter; (4) Recover refrigerant to 0 bar; (5) Rig gantry; (6) Unbolt compressor; (7) Lower and swap; (8) Pressure test with OFN (Oxygen-Free Nitrogen); (9) Evacuate to &lt;500 microns; (10) Recharge and commission; (11) Sign off client work sheet.
                    </span>
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
              eyebrow="AUTHORING FAQS"
              title="Common Questions About Drafting RAMS"
              subtitle="Clear guidance on page counts, template re-use, and dynamic risk assessments."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 5. CONVERSION CALLOUT */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="PUT YOUR RAMS TO WORK"
            title="Join the EntireFM Contractor Network"
            description="We partner with contractors who uphold professional safety standards. Put your business forward for commercial maintenance assignments. £95+VAT annual membership payable on submission."
            primaryCtaLabel="Apply to Join Network"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="Explore Method Statements"
            secondaryCtaHref="/contractor-resources/rams/what-is-a-method-statement"
          />
        </div>

        {/* 6. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="SUPPORTING GUIDANCE"
            title="Deepen Your Compliance Knowledge"
            subtitle="Explore our paired guides on method statements, risk scoring matrices, and facilities management."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
