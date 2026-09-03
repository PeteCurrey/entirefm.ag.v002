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
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ListOrdered,
  Layers,
  ShieldCheck,
  Scale,
  Wrench
} from 'lucide-react';

const config = CONTRACTOR_RESOURCE_PAGES['/contractor-resources/rams/what-is-a-method-statement'];

export const metadata: Metadata = generateRouteMetadata('/contractor-resources/rams/what-is-a-method-statement', {
  title: config.metaTitle,
  description: config.metaDescription,
});

export default function WhatIsMethodStatementPage() {
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
                name: 'EntireFM Compliance Operations',
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
              datePublished: '2026-01-25T08:00:00+00:00',
              dateModified: '2026-08-20T10:00:00+00:00',
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': 'https://www.entirefm.com/contractor-resources/rams/what-is-a-method-statement',
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
          primaryCta={{ label: 'Explore Key Components Below', href: '#anatomy' }}
          secondaryCta={{ label: 'How to Write RAMS Guide', href: '/contractor-resources/rams/how-to-write-rams' }}
          facts={[
            { figure: 'SSoW', label: 'Safe System of Work', detail: 'HASWA 1974 Section 2 standard' },
            { figure: 'Sequential', label: 'Step-by-Step Instructions', detail: 'Chronological execution' },
            { figure: 'Permit Ready', label: 'Commercial Access', detail: 'Required before site permits' },
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

        {/* 3. TECHNICAL DEEP DIVE */}
        <article className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-16">
            {/* Section 1: Definition & Purpose */}
            <section className="space-y-4">
              <span className="eyebrow eyebrow-light">01 // DEFINITION &amp; CONTEXT</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                What Is a Method Statement?
              </h2>
              <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  A <strong>Method Statement</strong> (frequently referred to in UK industry as a <strong>Safe System of Work (SSoW)</strong>) is a detailed, formal document that specifies the exact, step-by-step sequence in which a work task will be carried out safely and without risk to health.
                </p>
                <p>
                  While the Risk Assessment calculates potential hazards and evaluates initial risk scores, the Method Statement is the practical operational guide for engineers on site. It details how the controls identified in the risk assessment will actually be executed in the physical plantroom, switchroom, or roof space.
                </p>
              </div>
            </section>

            {/* Section 2: Anatomy of a Method Statement */}
            <section id="anatomy" className="space-y-4 pt-8 border-t border-slate-200 scroll-mt-12">
              <span className="eyebrow eyebrow-light">02 // DOCUMENT STRUCTURE</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Typical Contents of a Commercial Method Statement
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                To satisfy facilities management review desks, an approved Method Statement must contain eight mandatory components:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                    <ListOrdered className="w-4 h-4 text-[#EA580C]" />
                    <span>1. Title, Scope &amp; Site Details</span>
                  </div>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Exact building name and address, client work order reference, specific room/location, and clear boundary of the task.
                  </p>
                </div>

                <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>2. Competent Personnel &amp; Supervision</span>
                  </div>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Names and contact details of the lead engineer, site supervisor, appointed first aider, and required competency card types (e.g. ECS Gold, Gas Safe).
                  </p>
                </div>

                <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                    <Wrench className="w-4 h-4 text-emerald-600" />
                    <span>3. Plant, Tooling &amp; Equipment</span>
                  </div>
                  <p className="text-slate-600 font-light leading-relaxed">
                    List of all hand tools, 110V power tools, access equipment (podiums, MEWPs), calibrated test instruments, and rigging gear.
                  </p>
                </div>

                <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>4. Step-by-Step Chronological Sequence</span>
                  </div>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Chronological numbered instructions from arrival and sign-in through service isolations, component replacement, commissioning, and final sign-out.
                  </p>
                </div>

                <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>5. Isolation &amp; Lockout Protocols (LOTO)</span>
                  </div>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Exact procedure for proving dead, applying padlocks and warning tags, draining pressurised pipework, or blanking gas lines.
                  </p>
                </div>

                <div className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                    <Layers className="w-4 h-4 text-slate-800" />
                    <span>6. Waste Disposal &amp; Environmental Controls</span>
                  </div>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Disposal routes for removed components, hazardous waste consignment notes (fluorescent tubes, batteries, refrigerants, oils), and spill kit provisions.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Common Mistakes */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">03 // QUALITY CONTROL</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Top 5 Method Statement Mistakes to Avoid
              </h2>
              <ul className="space-y-3 pt-2 text-xs">
                <li className="p-4 bg-[#FAF9FB] border border-slate-200 rounded-sm flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">1</span>
                  <div>
                    <h3 className="font-semibold text-slate-900">Vague Statements ("Work Carefully")</h3>
                    <p className="text-slate-600 font-light mt-0.5">Writing "the engineer will proceed with caution" fails to define a safe system of work. Be specific: "Engineer will place GRP barriers at a 2-metre radius and isolate breaker MCB-04."</p>
                  </div>
                </li>
                <li className="p-4 bg-[#FAF9FB] border border-slate-200 rounded-sm flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">2</span>
                  <div>
                    <h3 className="font-semibold text-slate-900">Ignoring Emergency Rescue Plans</h3>
                    <p className="text-slate-600 font-light mt-0.5">Stating that workers will wear a harness is inadequate. The method statement must state how a suspended or injured worker will be rescued within 15 minutes.</p>
                  </div>
                </li>
                <li className="p-4 bg-[#FAF9FB] border border-slate-200 rounded-sm flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">3</span>
                  <div>
                    <h3 className="font-semibold text-slate-900">Missing Operative Signatures</h3>
                    <p className="text-slate-600 font-light mt-0.5">A method statement is legally worthless if the operatives executing the task have not read and signed it. The sign-off sheet must accompany the site file.</p>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </article>

        {/* 4. FAQS */}
        <section className="py-20 sm:py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <ContractorFaqAccordion
              eyebrow="METHOD STATEMENT FAQS"
              title="Frequently Asked Questions on Method Statements"
              subtitle="Clear guidance on legal duties, drafting, and client approval."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 5. CONVERSION BANNER */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="PROFESSIONAL CONTRACTOR NETWORK"
            title="Join the EntireFM Contractor Network"
            description="EntireFM values trade contractors who take pride in safe systems of work. Apply to become an approved supplier for commercial FM contracts (£95+VAT annual membership)."
            primaryCtaLabel="Apply to Join Network"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="How to Write RAMS Guide"
            secondaryCtaHref="/contractor-resources/rams/how-to-write-rams"
          />
        </div>

        {/* 6. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="FURTHER GUIDES"
            title="Supporting Technical Resources"
            subtitle="Explore our companion guides on risk assessments, RAMS, and winning facilities management work."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
