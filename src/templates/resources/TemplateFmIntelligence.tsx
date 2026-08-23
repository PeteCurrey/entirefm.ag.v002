'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Building2,
  Calendar,
  ExternalLink,
  ArrowRight,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import type { TemplateProps } from '../types';

export function TemplateFmIntelligence({ route, content }: TemplateProps) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Intelligence', url: '/fm-intelligence' },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-void text-white">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-20 border-b border-brand-edge-dark">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[15%] -top-[30%] h-[36rem] w-[36rem] rounded-full opacity-20 blur-[130px]"
            style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }}
          />

          <div className="container-custom relative">
            <Breadcrumbs items={breadcrumbs} className="mb-6" />
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-dark inline-block mb-3">Market Intelligence & Benchmarks</span>
              <h1 className="text-display-md text-white font-extrabold tracking-tight">
                UK Facilities Management Intelligence (2026)
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-brand-mist/75">
                Curated regulatory briefings, engineering labour benchmarks, statutory safety developments, and estate management trends across the UK commercial property sector.
              </p>
              <div className="mt-6 flex items-center gap-3 text-xs text-brand-mist/50">
                <span>Edition: <strong>Q3 2026 Briefing</strong></span>
                <span>·</span>
                <span>Review Date: <strong>August 2026</strong></span>
                <span>·</span>
                <span>Authority: <strong>HSE, BSI, BESA & CIBSE Standards</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* Intelligence Briefings Section */}
        <section className="py-16 bg-brand-carbon">
          <div className="container-custom space-y-12">
            {/* Key Macro Indicators */}
            <div>
              <span className="eyebrow eyebrow-dark">Market Indicators</span>
              <h2 className="mt-2 text-2xl font-bold text-white">
                2026 Commercial FM Key Trends
              </h2>

              <div className="grid gap-6 sm:grid-cols-3 mt-6">
                <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-electric-bright">
                    Statutory Governance
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">Digital Safety Case Evidence</h3>
                  <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                    Higher-risk and commercial buildings continue transitioning to mandatory digital golden-thread records, placing higher evidentiary value on contemporaneous CAFM logs.
                  </p>
                  <div className="mt-4 pt-3 border-t border-brand-edge-dark text-[10px] text-brand-mist/40 font-mono">
                    Source: Building Safety Act 2022 Implementation
                  </div>
                </div>

                <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-electric-bright">
                    Labour & Engineering
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">Specialist Engineering Wage Pressure</h3>
                  <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                    Certified commercial Gas Safe and F-Gas qualified refrigeration technicians continue to experience high national demand, increasing the value of planned retention over spot-market emergency callouts.
                  </p>
                  <div className="mt-4 pt-3 border-t border-brand-edge-dark text-[10px] text-brand-mist/40 font-mono">
                    Source: BESA / ONS Engineering Wage Indices
                  </div>
                </div>

                <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-electric-bright">
                    Decarbonisation
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">Commercial MEES & Heat Pump Servicing</h3>
                  <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                    Commercial landlords are accelerating fossil-fuel boiler replacements with hybrid VRF and commercial air-source heat pump (ASHP) systems to meet tightened EPC / MEES requirements.
                  </p>
                  <div className="mt-4 pt-3 border-t border-brand-edge-dark text-[10px] text-brand-mist/40 font-mono">
                    Source: DESNZ Commercial EPC Regulations
                  </div>
                </div>
              </div>
            </div>

            {/* In-Depth Briefings */}
            <div className="space-y-6">
              <span className="eyebrow eyebrow-dark">Regulatory Briefings</span>
              <h2 className="text-2xl font-bold text-white">
                Detailed Regulatory & Engineering Analysis
              </h2>

              <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold font-mono">
                    STATUTORY UPDATE
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Fire Safety & Evacuation Record Compliance
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-brand-mist/80 leading-relaxed">
                  Under the Fire Safety (England) Regulations and RRO 2005, responsible persons across multi-occupied and commercial buildings must maintain clear digital asset registers of fire doors, damper drop tests, and evacuation signage. Duty holders who rely on paper logbooks risk significant non-compliance findings during local Fire and Rescue Authority audits.
                </p>
                <div className="pt-2">
                  <Link href="/compliance/fire-risk-assessment" className="text-xs font-semibold text-brand-electric-bright inline-flex items-center gap-1 hover:underline">
                    Read Fire Risk Assessment Technical Guidance <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold font-mono">
                    ENGINEERING STANDARD
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Fixed Wire Testing (EICR) Periodic Frequencies in Commercial Estates
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-brand-mist/80 leading-relaxed">
                  While commercial maximum periodic inspection intervals are established at 5 years under standard guidance, high-occupancy corporate environments and industrial facilities with complex machinery require rolling 20% or 33% annual testing programmes to maintain safe operation and satisfy insurer requirements without complete facility shutdowns.
                </p>
                <div className="pt-2">
                  <Link href="/compliance/fixed-wire-testing-eicr" className="text-xs font-semibold text-brand-electric-bright inline-flex items-center gap-1 hover:underline">
                    Read Fixed Wire Testing & EICR Guidance <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Sourcing Transparency */}
            <div className="rounded-sm bg-white/[0.02] border border-brand-edge-dark p-6 text-xs text-brand-mist/60 leading-relaxed">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-brand-electric-bright shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">FM Intelligence Sourcing Methodology</h4>
                  <p className="mt-1">
                    All intelligence briefings are researched and reviewed quarterly by EntireFM’s technical compliance and operations directors. Data references public statutory legislation, British Standards Institution (BSI) publications, CIBSE Technical Guides, and Building Engineering Services Association (BESA) guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />
        <ProposalSection />
      </main>
      <Footer />
    </>
  );
}
