'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wrench,
  Calculator,
  CalendarCheck,
  FileText,
  Activity,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Clock,
  Download,
  Printer,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import type { TemplateProps } from '../types';

interface ToolItem {
  title: string;
  slug: string;
  category: string;
  tag: string;
  timeEstimate: string;
  description: string;
  deliverables: string[];
  icon: React.ComponentType<{ className?: string }>;
  relatedService: { label: string; href: string };
}

const TOOLS_DATA: ToolItem[] = [
  {
    title: 'FM Compliance Checker',
    slug: '/tools/compliance-checker',
    category: 'Compliance & Safety',
    tag: 'Statutory Screening',
    timeEstimate: '3 mins',
    description: 'Screen your commercial estate across 10 statutory regimes including Fire, Electrical, Gas, Water Hygiene, and LOLER examinations.',
    deliverables: ['10-discipline risk score', 'Statutory legal basis mapping', 'Downloadable PDF review report'],
    icon: ShieldCheck,
    relatedService: { label: 'Compliance Centre', href: '/compliance' },
  },
  {
    title: 'FM Building Health Check',
    slug: '/tools/fm-health-check',
    category: 'Compliance & Safety',
    tag: 'Diagnostic',
    timeEstimate: '3 mins',
    description: 'Evaluate your estate across statutory maintenance baselines to identify documentation gaps and operational risk areas.',
    deliverables: ['7-area gap analysis', 'Prioritised action points', 'Printable review report'],
    icon: Activity,
    relatedService: { label: 'Compliance Centre', href: '/compliance' },
  },
  {
    title: 'PPM Schedule Builder',
    slug: '/tools/ppm-schedule-builder',
    category: 'Maintenance Planning',
    tag: 'Asset-Led Matrix',
    timeEstimate: '4 mins',
    description: 'Select installed assets to build a bespoke planned maintenance schedule with verified statutory, standard, and practice basis.',
    deliverables: ['Custom maintenance matrix', 'Statutory vs practice tags', 'CSV & Print export'],
    icon: Wrench,
    relatedService: { label: 'Planned Maintenance (PPM)', href: '/ppm' },
  },
  {
    title: 'Compliance Calendar Builder',
    slug: '/tools/compliance-calendar',
    category: 'Compliance & Safety',
    tag: 'Statutory Planner',
    timeEstimate: '3 mins',
    description: 'Generate an interactive 12-month schedule of statutory testing milestones with legal duty breakdowns and calendar export.',
    deliverables: ['12-month inspection roadmap', 'Governing legislation references', 'ICS calendar download'],
    icon: CalendarCheck,
    relatedService: { label: 'Fire & Emergency', href: '/fire-emergency-systems' },
  },
  {
    title: 'PPM Cost Estimator',
    slug: '/tools/ppm-estimator',
    category: 'Maintenance Planning',
    tag: 'Budget Model',
    timeEstimate: '2 mins',
    description: 'Model indicative annual maintenance expenditure ranges based on floor area, building sector complexity, and service intensity.',
    deliverables: ['Indicative budget range', 'Cost per sq ft / sq m breakdown', 'Transparent planning assumptions'],
    icon: Calculator,
    relatedService: { label: 'Mechanical & Electrical', href: '/mechanical-electrical' },
  },
  {
    title: 'FM ROI / TCO Calculator',
    slug: '/tools/fm-roi-calculator',
    category: 'Commercial & Strategy',
    tag: 'Financial Model',
    timeEstimate: '3 mins',
    description: 'Compare multiple-supplier reactive spend against a consolidated planned maintenance model to evaluate total cost of ownership.',
    deliverables: ['Reactive vs planned analysis', 'Management overhead savings', 'Model comparison breakdown'],
    icon: TrendingUp,
    relatedService: { label: 'Total FM Contracts', href: '/hard-services' },
  },
  {
    title: 'FM Tender Brief Generator',
    slug: '/tools/tender-brief',
    category: 'Commercial & Strategy',
    tag: 'Procurement Tool',
    timeEstimate: '5 mins',
    description: 'Generate a comprehensive, structured Facilities Management tender brief and RFP specification ready for procurement.',
    deliverables: ['Structured RFP document', 'Service lines & KPI framework', 'PDF & Markdown export'],
    icon: FileText,
    relatedService: { label: 'About EntireFM', href: '/about-entire-facilities-management' },
  },
];

export function TemplateToolsHub({ route, content }: TemplateProps) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Tools', url: '/tools' },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-void text-white">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36 sm:pb-24 border-b border-brand-edge-dark">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[15%] -top-[30%] h-[40rem] w-[40rem] rounded-full opacity-20 blur-[130px]"
            style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }}
          />
          <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-40" />

          <div className="container-custom relative">
            <Breadcrumbs items={breadcrumbs} className="mb-6" />
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-dark inline-block mb-3">Interactive Engineering Toolkit</span>
              <h1 className="text-display-md text-white font-extrabold tracking-tight">
                Practical Facilities Management Tools
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-brand-mist/75">
                Free, asset-led tools engineered for estate directors, property managers, and facilities teams to plan maintenance schedules, evaluate compliance baselines, and structure procurement.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 text-xs font-medium text-brand-mist/60">
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-electric-bright" />
                  Verified UK Statutory Standards
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  <Download className="h-3.5 w-3.5 text-brand-electric-bright" />
                  Instant CSV & Document Export
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-brand-electric-bright" />
                  100% Free — No Sales Gating
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-20 bg-brand-carbon">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="eyebrow eyebrow-dark">Toolkit Directory</span>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Interactive Decision & Planning Tools
                </h2>
              </div>
              <p className="text-sm text-brand-mist/60 max-w-md">
                Select a tool below to begin. All tools provide full instant results on screen with downloadable outputs.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {TOOLS_DATA.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.slug}
                    className="group relative flex flex-col justify-between rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 transition-all duration-300 hover:border-brand-electric/50 hover:bg-white/[0.02]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-white/[0.05] text-brand-electric-bright border border-white/10">
                          <IconComponent className="h-5 w-5" />
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-medium text-brand-mist/50">
                          <Clock className="h-3 w-3" />
                          {tool.timeEstimate}
                        </span>
                      </div>

                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-[11px] uppercase tracking-wider text-brand-mist/40 font-semibold">
                          {tool.category}
                        </span>
                        <span className="text-white/20">·</span>
                        <span className="text-[11px] text-brand-electric-bright font-medium">
                          {tool.tag}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-brand-electric-bright transition-colors">
                        {tool.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-brand-mist/70">
                        {tool.description}
                      </p>

                      <div className="mt-5 border-t border-brand-edge-dark pt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-mist/40 mb-2">
                          What You Receive
                        </p>
                        <ul className="space-y-1.5">
                          {tool.deliverables.map((item) => (
                            <li key={item} className="flex items-center gap-2 text-xs text-brand-mist/80">
                              <span className="h-1 w-1 rounded-full bg-brand-electric-bright shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-brand-edge-dark flex items-center justify-between">
                      <Link
                        href={tool.relatedService.href}
                        className="text-[11px] text-brand-mist/50 hover:text-brand-mist transition-colors"
                      >
                        Learn: {tool.relatedService.label}
                      </Link>
                      <Link
                        href={tool.slug}
                        className="btn-primary py-2 px-3 text-xs"
                      >
                        Launch Tool
                        <ArrowRight className="h-3 w-3 btn-arrow" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Methodology Callout */}
        <section className="py-20 border-t border-brand-edge-dark bg-brand-graphite">
          <div className="container-custom">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div>
                <span className="eyebrow eyebrow-dark">Technical Integrity</span>
                <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
                  Why We Built Transparent FM Planning Tools
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-brand-mist/70">
                  Too much commercial FM guidance relies on vague generalisations or forces users behind contact forms before revealing basic planning matrices. EntireFM provides direct access to structured scheduling logic, legal duty baselines, and transparent cost models.
                </p>
                <div className="mt-6 space-y-3 text-xs text-brand-mist/80">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-electric-bright shrink-0" />
                    <span><strong>Statutory Distinction:</strong> We never state "annual is law" where statute demands risk assessment. We separate Legal, Standard, Practice, and Risk frequencies.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-electric-bright shrink-0" />
                    <span><strong>Transparent Assumptions:</strong> Financial calculators display all formula assumptions, allowing you to customise ratios to your actual estate profile.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-electric-bright shrink-0" />
                    <span><strong>Provider-Neutral Outputs:</strong> Exported PPM matrices and Tender Briefs are open documents for your own internal procurement use.</span>
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-brand-edge-dark bg-brand-carbon p-8">
                <p className="eyebrow eyebrow-dark mb-4">Related Knowledge Hubs</p>
                <div className="space-y-4">
                  <Link
                    href="/compliance"
                    className="flex items-center justify-between p-4 rounded-sm border border-brand-edge-dark bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-white">Compliance Centre</h4>
                      <p className="text-xs text-brand-mist/60">Statutory obligations across fire, electrical, gas, and water hygiene.</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-brand-electric-bright" />
                  </Link>

                  <Link
                    href="/facilities-management-glossary"
                    className="flex items-center justify-between p-4 rounded-sm border border-brand-edge-dark bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-white">FM Glossary</h4>
                      <p className="text-xs text-brand-mist/60">Plain-English definitions of over 50 essential FM technical terms.</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-brand-electric-bright" />
                  </Link>

                  <Link
                    href="/resources/document-vault"
                    className="flex items-center justify-between p-4 rounded-sm border border-brand-edge-dark bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-white">FM Document Vault</h4>
                      <p className="text-xs text-brand-mist/60">Downloadable CSV asset registers, PPM templates, and logbooks.</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-brand-electric-bright" />
                  </Link>
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
