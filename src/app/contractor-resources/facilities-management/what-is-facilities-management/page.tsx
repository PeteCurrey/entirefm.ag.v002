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
  Building2,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Layers,
  FileCheck
} from 'lucide-react';

const config = CONTRACTOR_RESOURCE_PAGES['/contractor-resources/facilities-management/what-is-facilities-management'];

export const metadata: Metadata = generateRouteMetadata('/contractor-resources/facilities-management/what-is-facilities-management', {
  title: config.metaTitle,
  description: config.metaDescription,
});

export default function WhatIsFacilitiesManagementPage() {
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
                name: 'EntireFM Technical Intelligence',
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
              datePublished: '2026-02-10T08:00:00+00:00',
              dateModified: '2026-08-20T10:00:00+00:00',
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': 'https://www.entirefm.com/contractor-resources/facilities-management/what-is-facilities-management',
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
          primaryCta={{ label: 'Explore Hard vs Soft FM', href: '#hard-vs-soft' }}
          secondaryCta={{ label: 'Join EntireFM Network', href: '/contractors/join' }}
          facts={[
            { figure: 'Hard FM', label: 'Building Engineering', detail: 'M&E, HVAC, plant, fabric' },
            { figure: 'Soft FM', label: 'Building Services', detail: 'Cleaning, security, grounds' },
            { figure: 'CAFM Driven', label: 'Digital Dispatch', detail: 'SLA-backed work orders' },
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
            {/* The Sector from a Contractor's Lens */}
            <section className="space-y-4">
              <span className="eyebrow eyebrow-light">01 // THE SECTOR LANDSCAPE</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                Facilities Management Explained for Trade Contractors
              </h2>
              <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  To the general public, <strong>Facilities Management (FM)</strong> might sound like an abstract corporate phrase. To a trade or engineering contractor, FM is the primary commercial engine that buys trade labour, awards planned maintenance contracts, and dispatches reactive call-outs across the UK.
                </p>
                <p>
                  Facilities management companies sit between property owners (landlords, investors, corporate occupiers) and the physical building infrastructure. Their role is to ensure commercial estates operate safely, efficiently, and legally without interrupting the occupier’s business.
                </p>
              </div>
            </section>

            {/* Hard FM vs Soft FM */}
            {config.comparison && (
              <section id="hard-vs-soft" className="pt-8 border-t border-slate-200 scroll-mt-12">
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

            {/* CAFM & Technology */}
            <section className="space-y-4 pt-8 border-t border-slate-200">
              <span className="eyebrow eyebrow-light">02 // DIGITAL OPERATIONS</span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                CAFM Systems &amp; Contractor Management
              </h2>
              <div className="prose-brand space-y-4 text-slate-700 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  Modern facilities management relies entirely on <strong>CAFM (Computer-Aided Facility Management)</strong> software platforms.
                </p>
                <p>
                  When working with FM companies like EntireFM, contractors interact with the CAFM platform throughout the job lifecycle:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                  <div className="p-4 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-1.5">
                    <span className="font-semibold text-slate-900 block">1. Electronic Dispatch</span>
                    <span className="text-slate-600 font-light block">
                      Receiving work orders directly to mobile devices with pre-authorised Purchase Orders, building access codes, and site drawings.
                    </span>
                  </div>
                  <div className="p-4 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-1.5">
                    <span className="font-semibold text-slate-900 block">2. Asset Verification</span>
                    <span className="text-slate-600 font-light block">
                      Scanning physical asset barcodes or QR codes on plant to view maintenance histories, refrigerant charges, and past defect notes.
                    </span>
                  </div>
                  <div className="p-4 bg-[#FAFAF8] border border-slate-200 rounded-sm space-y-1.5">
                    <span className="font-semibold text-slate-900 block">3. Digital Sign-Off</span>
                    <span className="text-slate-600 font-light block">
                      Capturing client signatures, uploading before/after photos, and generating statutory compliance sheets in real time.
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
              eyebrow="FACILITIES MANAGEMENT FAQS"
              title="Frequently Asked Questions About the FM Sector"
              subtitle="Clear guidance on how FM organisations operate, subcontracting models, and CAFM standards."
              faqs={config.faqs}
            />
          </div>
        </section>

        {/* 5. CONVERSION CALLOUT */}
        <div className="container-custom">
          <ContractorConversionBanner
            eyebrow="CONNECT WITH COMMERCIAL FM"
            title="Join the EntireFM Contractor Network"
            description="Work with an established UK facilities management provider. Connect your trade business with commercial maintenance contracts (£95+VAT annual membership)."
            primaryCtaLabel="Apply to Join Network"
            primaryCtaHref="/contractors/join"
            secondaryCtaLabel="What Is PPM Guide"
            secondaryCtaHref="/contractor-resources/facilities-management/what-is-ppm"
          />
        </div>

        {/* 6. RELATED RESOURCES */}
        <div className="container-custom pb-20">
          <ContractorRelatedGrid
            eyebrow="FURTHER EXPLORATION"
            title="Related Commercial &amp; Technical Guides"
            subtitle="Deepen your understanding of planned maintenance, commercial property, and winning FM work."
            links={config.relatedLinks}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
