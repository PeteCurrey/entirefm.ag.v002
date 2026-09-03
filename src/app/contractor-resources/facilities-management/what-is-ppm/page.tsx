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
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Zap,
  Wind
} from 'lucide-react';

const config = CONTRACTOR_RESOURCE_PAGES['/contractor-resources/facilities-management/what-is-ppm'];

export const metadata: Metadata = generateRouteMetadata('/contractor-resources/facilities-management/what-is-ppm', {
  title: config.metaTitle,
  description: config.metaDescription,
});

export default function WhatIsPpmPage() {
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
                name: 'EntireFM Maintenance Engineering Desk',
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
              datePublished: '2026-02-15T08:00:00+00:00',
              dateModified: '2026-08-20T10:00:00+00:00',
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': 'https://www.entirefm.com/contractor-resources/facilities-management/what-is-ppm',
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
          primaryCta={{ label: 'Explore PPM vs Reactive', href: '#comparison' }}
          secondaryCta={{ label: 'Commercial Maintenance Network', href: '/contractors/commercial-maintenance' }}
          facts={[
            { figure: 'SFG20', label: 'UK Industry Standard', detail: 'Definitive maintenance task lists' },
            { figure: 'Recurring', label: 'Contract Model', detail: 'Scheduled annual cash flow' },
            { figure: 'Statutory', label: 'Compliance Mandate', detail: 'F-Gas, EICR, Gas Safety, L8' },
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

        {/* 3. TECHNICAL CONTENT */}
        <article className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-16">
            {/* Defining PPM */}
            <section className="space-y-4">
              <span className="eyebrow eyebrow-light">01 // SCHEDULED ASSET CARE</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                What Does PPM Stand For?
              </h2>
              <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  <strong>PPM</strong> stands for <strong>Planned Preventative Maintenance</strong> (sometimes called Planned Preventative Care or Scheduled Maintenance). It represents the systematic, pre-scheduled inspection, cleaning, testing, and servicing of building engineering systems at set calendar intervals or operating hours.
                </p>
                <p>
                  Rather than waiting for a boiler to lockout in winter or a rooftop chiller to fail during a heatwave, PPM identifies minor component degradation before it triggers catastrophic failure, tenant disruption, or statutory compliance breaches.
                </p>
              </div>
            </section>

            {/* PPM vs Reactive Comparison Table */}
            {config.comparison && (
              <section id="comparison" className="pt-8 border-t border-slate-200 scroll-mt-12">
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

            {/* The SFG20 Standard */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">02 // INDUSTRY SPECIFICATIONS</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                What Is SFG20 and Why Does It Govern UK PPM?
              </h2>
              <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  In the UK facilities management industry, planned maintenance is benchmarked against <strong>SFG20</strong>, the standard maintenance specification developed by BESA (Building Engineering Services Association).
                </p>
                <p>
                  SFG20 categorises maintenance tasks using a clear colour-coded priority system that every contractor should understand:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-sm space-y-1">
                    <span className="font-bold text-red-800 block text-sm">Red: Statutory Legal</span>
                    <span className="text-red-700 text-[11px] font-light">
                      Legally mandated tasks (e.g. fire alarm servicing, fixed wire testing, legionella sampling). Non-compliance triggers prosecution.
                    </span>
                  </div>

                  <div className="p-4 bg-pink-50 border border-pink-200 rounded-sm space-y-1">
                    <span className="font-bold text-pink-800 block text-sm">Pink: Business Critical</span>
                    <span className="text-pink-700 text-[11px] font-light">
                      Equipment where failure halts core operations (e.g. data centre cooling, main server room UPS, kitchen extraction).
                    </span>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-sm space-y-1">
                    <span className="font-bold text-emerald-800 block text-sm">Green: Discretionary</span>
                    <span className="text-emerald-700 text-[11px] font-light">
                      Non-critical asset preservation (e.g. re-lamping decorative lights, repainting plant room floors, aesthetic cleans).
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
              eyebrow="PPM FAQS"
              title="Common Questions About Planned Maintenance"
              subtitle="Everything you need to know about statutory schedules, SFG20, and contractor packaging."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 5. CONVERSION CALLOUT */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="GROW YOUR PPM PORTFOLIO"
            title="Join the EntireFM Contractor Network"
            description="EntireFM schedules annual maintenance plans across commercial estates UK-wide. Put your business forward for scheduled PPM packages. £95+VAT annual membership payable on submission."
            primaryCtaLabel="Apply to Join Network"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="Commercial Maintenance Network"
            secondaryCtaHref="/contractors/commercial-maintenance"
          />
        </div>

        {/* 6. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="FURTHER GUIDANCE"
            title="Explore Related Maintenance Topics"
            subtitle="Deepen your technical knowledge with our paired contractor guides on FM, RAMS, and winning contracts."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
