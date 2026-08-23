'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  FileText,
  Activity,
  Cpu,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { ResourceHero } from '@/components/resources/ResourceHero';
import { EditorialImageBreak } from '@/components/resources/EditorialImageBreak';
import { ExecutiveSummary } from '@/components/resources/ExecutiveSummary';
import { RelatedResourceGrid } from '@/components/resources/RelatedResourceGrid';
import type { TemplateProps } from '../types';

interface IntelligenceBriefing {
  tag: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  impactOnClients: string;
  recommendedAction: string;
  relevantServiceUrl: string;
  relevantServiceName: string;
}

const BRIEFINGS: IntelligenceBriefing[] = [
  {
    tag: 'Statutory Safety',
    title: 'Building Safety Act 2022 — Mandatory Digital Golden Thread Logbooks',
    source: 'Health and Safety Executive (HSE) / BSR',
    date: 'Q3 2026 Regulatory Review',
    summary: 'The Building Safety Regulator mandates verified digital evidence trails for high-risk buildings and commercial public realm assets. Duty holders must maintain contemporaneous asset records, test certificates, and design changes.',
    impactOnClients: 'Informal paper logbooks or scattered PDF folders represent immediate regulatory non-compliance during annual safety audits.',
    recommendedAction: 'Consolidate all statutory certifications (Gas, EICR, Fire, LOLER, Water Hygiene) into a single CAFM digital logbook platform.',
    relevantServiceUrl: '/compliance',
    relevantServiceName: 'Compliance Management',
  },
  {
    tag: 'F-Gas & HVAC',
    title: 'UK F-Gas Quota Phase-Down & High-GWP Refrigerant Transition',
    source: 'DEFRA / Environment Agency',
    date: '2026 Quota Update',
    summary: 'The ongoing phase-down of hydrofluorocarbons (HFCs) under UK F-Gas Regulations increases the cost of legacy refrigerants such as R410A and R404A, prioritizing reclaim, low-GWP transitions (R32, R454B), and proactive leak testing.',
    impactOnClients: 'Major refrigerant leaks on older chiller systems carry significantly higher recharge costs and potential supply constraints during peak summer cooling.',
    recommendedAction: 'Enforce statutory 6-monthly leak check intervals and schedule lifecycle replacement reviews for systems over 12 years old.',
    relevantServiceUrl: '/hvac-contractor',
    relevantServiceName: 'HVAC Engineering',
  },
  {
    tag: 'Electrical Safety',
    title: 'BS 7671 Amendment 3 & Commercial EV Charging Infrastructure',
    source: 'IET / BSI British Standards',
    date: 'Standards Directive 2026',
    summary: 'Increased installation of workplace EV charging and commercial heat pumps demands comprehensive load monitoring, thermal imaging of sub-distribution boards, and 5-year periodic inspection and testing (EICR).',
    impactOnClients: 'Unmonitored phase-load imbalances can trip main incomers or cause elevated thermal stress on legacy switchgear.',
    recommendedAction: 'Schedule annual infrared thermographic surveys of main switchrooms alongside mandatory 5-year fixed wire testing cycles.',
    relevantServiceUrl: '/mechanical-electrical',
    relevantServiceName: 'Electrical Services',
  },
  {
    tag: 'Water Hygiene',
    title: 'ACOP L8 / HSG274 — Dynamic Temperature Monitoring Compliance',
    source: 'HSE Guidance Document',
    date: 'Water Hygiene Review',
    summary: 'Stagnant water in under-occupied commercial office buildings accelerates Legionella pneumophila proliferation. Routine monthly sentinel outlet temperature verification and weekly outlet flushing regimes remain mandatory.',
    impactOnClients: 'Tenant hybrid working patterns create unpredictable spatial occupancy, leading to localized stagnant dead-legs in office risers.',
    recommendedAction: 'Implement automated or audited weekly flushing schedules for low-footfall floors and record digital temperature logs.',
    relevantServiceUrl: '/compliance/legionella-water-hygiene',
    relevantServiceName: 'Legionella & Water Hygiene',
  },
];

export function TemplateFmIntelligence({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Intelligence', url: '/fm-intelligence' },
  ];

  return (
    <div className="bg-[#080e18] text-slate-100 min-h-screen flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      <Header solid />
      <main id="main" className="flex-grow">
        {/* 1. RESOURCE HERO */}
        <ResourceHero
          breadcrumbs={breadcrumbs}
          category="Market Intelligence &amp; Standards"
          categoryHref="/resources"
          title="UK Facilities Management Intelligence (2026)"
          intro="Curated regulatory briefings, statutory safety developments, engineering labour benchmarks, and estate management trends across the UK commercial property sector."
          readingTime="Quarterly Intelligence Digest"
          technicalTier="Level 3 · Strategic Intelligence"
          audience="Property Directors, Facilities Managers &amp; Asset Owners"
          standard="HSE, BESA, CIBSE &amp; BSI Standards"
        />

        {/* 2. TRUST BAR */}
        <TrustBar />

        {/* 3. MACRO INDICATORS & REGULATORY DIGEST */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto space-y-16">
            
            {/* 3A. EXECUTIVE SUMMARY */}
            <ExecutiveSummary
              title="2026 Market Intelligence Briefing"
              badge="Q3 Digest"
              takeaways={[
                'Commercial building owners face intensifying statutory enforcement under the Building Safety Act, with digital auditability replacing fragmented paper archives.',
                'Specialist engineering skills (Gas Safe, F-Gas, HV Electrical) remain constrained nationally, making long-term contractual retainers substantially more cost-effective than spot-market emergency callouts.',
                'Hybrid occupancy patterns continue to create localized water stagnation risks and HVAC energy waste, demanding dynamic BMS deadband tuning.',
              ]}
              statutoryReference="Building Safety Act 2022 · Defra F-Gas Regulations · BS 7671 (Amd 3) · ACOP L8"
              operationalOutcome="100% statutory compliance audit readiness · Proactive lifecycle asset management"
            />

            {/* 3B. MACRO KPI DATA CARDS */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-bold block mb-1">
                  Macro Sector Indicators
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  2026 Commercial FM Operating Environment
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 font-bold">
                    Statutory Governance
                  </span>
                  <h3 className="text-lg font-bold text-white">Digital Golden-Thread Mandate</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Regulatory transitions place higher legal evidentiary value on contemporaneous CAFM logs, making manual paperwork an immediate compliance audit liability.
                  </p>
                  <div className="pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                    Source: Building Safety Act 2022 Implementation
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                    Labour &amp; Engineering
                  </span>
                  <h3 className="text-lg font-bold text-white">Certified Engineer Wage Indices</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Commercial Gas Safe and F-Gas engineers remain in acute high national demand, increasing the financial advantage of contracted service delivery over spot callouts.
                  </p>
                  <div className="pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                    Source: BESA / ONS Engineering Wage Indices
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Energy &amp; Sustainability
                  </span>
                  <h3 className="text-lg font-bold text-white">Dynamic BMS Setpoint Optimization</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Occupancy-driven deadband adjustments and weather degree-day forecasting deliver 12–18% measurable reduction in peak HVAC electrical consumption.
                  </p>
                  <div className="pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                    Source: CIBSE Energy Assessment Benchmarks
                  </div>
                </div>
              </div>
            </div>

            {/* 3C. EDITORIAL PHOTO BREAK */}
            <EditorialImageBreak
              layout="split-60-40"
              imageSrc="/images/editorial/entirefm-client-review-2000w.webp"
              imageAlt="EntireFM operations director conducting quarterly facilities performance review with commercial client"
              eyebrow="Commercial Accountability"
              title="Quarterly Estate Performance &amp; Compliance Review"
              description="EntireFM provides commercial property owners and managing agents with complete transparency across asset uptime, statutory test certificates, and forward capital planning recommendations."
              technicalCaption="Client Operations Review — Real-time CAFM compliance verification."
            />

            {/* 3D. REGULATORY BRIEFINGS BREAKDOWN */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-bold block mb-1">
                  Active Directives
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Regulatory Briefings &amp; Action Directives
                </h2>
              </div>

              <div className="space-y-6">
                {BRIEFINGS.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 shadow-xl"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-700 text-xs font-mono font-bold">
                          {b.tag}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{b.date}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-500">{b.source}</span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                        {b.title}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed font-light">
                        {b.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                          Impact on Property Owners
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {b.impactOnClients}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                          Recommended Action
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {b.recommendedAction}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-slate-800/80">
                      <span className="text-slate-500">Related Capability:</span>
                      <Link
                        href={b.relevantServiceUrl}
                        className="inline-flex items-center gap-1.5 text-pink-400 hover:text-pink-300 font-bold transition-colors"
                      >
                        <span>{b.relevantServiceName}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3E. CROSS-LINKING TO KNOWLEDGE ECOSYSTEM */}
            <RelatedResourceGrid
              eyebrow="Knowledge Network"
              title="Related Strategic Resources &amp; Planning Tools"
              intro="Explore interactive calculators, compliance roadmaps, and technical research."
              resources={[
                {
                  title: 'Compliance Centre & Statutory Frameworks',
                  href: '/compliance',
                  category: 'Compliance',
                  description: 'Comprehensive guides separating statutory legislation, British Standards, and industry codes of practice.',
                  imageSrc: '/images/editorial/entirefm-distribution-board-testing-1200w.webp',
                },
                {
                  title: 'Interactive PPM Schedule Builder',
                  href: '/tools/ppm-schedule-builder',
                  category: 'Interactive Tools',
                  description: 'Asset-led planned maintenance matrix aligned with SFG20 task frequencies.',
                  imageSrc: '/images/editorial/entirefm-hvac-plant-deck-1200w.webp',
                },
                {
                  title: 'FM ROI & Total Cost of Ownership Calculator',
                  href: '/tools/fm-roi-calculator',
                  category: 'Commercial Strategy',
                  description: 'Compare multiple uncoordinated contractors against a single accountable delivery contract.',
                  imageSrc: '/images/editorial/entirefm-hero-headquarters-2560w.webp',
                },
              ]}
            />
          </div>
        </div>

        {/* 4. CONVERSION PROPOSAL */}
        <ProposalSection
          headline="Request an Estate Compliance &amp; Operations Audit"
          subheadline="Speak with our technical engineering consultants about reviewing your commercial property maintenance schedules, statutory risk profiles, and CAFM reporting."
        />
      </main>
      <Footer />
    </div>
  );
}
