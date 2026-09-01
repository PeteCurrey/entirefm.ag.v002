'use client';

import React, { useState } from 'react';
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
  FileSpreadsheet,
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
  category: 'Compliance & Safety' | 'Maintenance Planning' | 'Commercial & Strategy';
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
    deliverables: ['Custom maintenance matrix', 'Statutory vs practice tags', 'CSV & PDF export'],
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

const CATEGORIES = ['All Tools', 'Compliance & Safety', 'Maintenance Planning', 'Commercial & Strategy'] as const;

export function TemplateToolsHub({ route, content }: TemplateProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Tools');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Tools', url: '/tools' },
  ];

  const filteredTools = TOOLS_DATA.filter((tool) =>
    selectedCategory === 'All Tools' ? true : tool.category === selectedCategory
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
        {/* Dark Branded Hero */}
        <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 bg-[#0B1220] text-white border-b border-slate-800">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[10%] -top-[25%] h-[35rem] w-[35rem] rounded-full opacity-20 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #0284C7 0%, transparent 70%)' }}
          />

          <div className="container-custom relative">
            <Breadcrumbs items={breadcrumbs} className="mb-5 text-slate-400" />
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-brand-electric" />
                <span className="text-[11px] tracking-widest text-slate-400 uppercase font-medium">
                  Interactive Engineering Toolkit
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
                Practical Facilities Management Tools
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300 font-light">
                Free, asset-led tools engineered for estate directors, property managers, and facilities teams to plan maintenance schedules, evaluate compliance baselines, and structure procurement.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-xs font-normal">
                <span className="flex items-center gap-1.5 rounded-sm border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-slate-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-electric" />
                  Verified UK Statutory Standards
                </span>
                <span className="flex items-center gap-1.5 rounded-sm border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-slate-200">
                  <Download className="h-3.5 w-3.5 text-brand-electric" />
                  Instant CSV, ICS &amp; PDF Export
                </span>
                <span className="flex items-center gap-1.5 rounded-sm border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-slate-200">
                  <Sparkles className="h-3.5 w-3.5 text-brand-electric" />
                  100% Free — No Sales Gating
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid Section */}
        <section className="py-16 sm:py-20 bg-[#F8FAFC]">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
              <div>
                <span className="text-xs font-light uppercase tracking-wider text-brand-electric">
                  Toolkit Directory
                </span>
                <h2 className="mt-1 text-2xl sm:text-3xl font-extralight text-slate-900">
                  Interactive Decision &amp; Planning Tools
                </h2>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-sm text-xs font-normal transition-all ${
                      selectedCategory === cat
                        ? 'bg-brand-graphite text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
              {filteredTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.slug}
                    className="group relative flex flex-col justify-between rounded-sm border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-brand-electric"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-blue-50 text-brand-electric border border-blue-100">
                          <IconComponent className="h-5 w-5" />
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-light text-slate-500 bg-slate-50 px-2 py-0.5 rounded-sm border border-slate-200">
                          <Clock className="h-3 w-3" />
                          {tool.timeEstimate}
                        </span>
                      </div>

                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-[10.5px] uppercase tracking-wider text-slate-500 font-light">
                          {tool.category}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-[10.5px] text-brand-electric font-light">
                          {tool.tag}
                        </span>
                      </div>

                      <h3 className="text-lg font-light text-slate-900 group-hover:text-brand-electric transition-colors">
                        {tool.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        {tool.description}
                      </p>

                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <p className="text-[10.5px] font-normal uppercase tracking-wider text-slate-500 mb-2">
                          What You Receive
                        </p>
                        <ul className="space-y-1.5">
                          {tool.deliverables.map((item) => (
                            <li key={item} className="flex items-center gap-2 text-xs text-slate-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-brand-electric shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={tool.relatedService.href}
                        className="text-[11px] text-slate-500 hover:text-slate-900 transition-colors font-normal"
                      >
                        Learn: {tool.relatedService.label}
                      </Link>
                      <Link
                        href={tool.slug}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm bg-brand-graphite hover:bg-slate-800 text-white text-xs font-normal tracking-wider uppercase transition-all shadow-2xs group-hover:bg-brand-electric"
                      >
                        Launch Tool
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Methodology Callout */}
        <section className="py-16 sm:py-20 border-t border-slate-200 bg-white">
          <div className="container-custom">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div>
                <span className="text-xs font-light uppercase tracking-wider text-brand-electric">
                  Technical Integrity
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-extralight text-slate-900">
                  Why We Built Transparent FM Planning Tools
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Too much commercial FM guidance relies on vague generalisations or forces users behind contact forms before revealing basic planning matrices. EntireFM provides direct access to structured scheduling logic, legal duty baselines, and transparent cost models.
                </p>
                <div className="mt-6 space-y-3 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand-electric shrink-0" />
                    <span><strong>Statutory Distinction:</strong> We never state &quot;annual is law&quot; where statute demands risk assessment. We separate Legal, Standard, Practice, and Risk frequencies.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand-electric shrink-0" />
                    <span><strong>Transparent Assumptions:</strong> Financial calculators display all formula assumptions, allowing you to customise ratios to your actual estate profile.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand-electric shrink-0" />
                    <span><strong>Provider-Neutral Outputs:</strong> Exported PPM matrices and Tender Briefs are open documents for your own internal procurement use.</span>
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-slate-200 bg-slate-50 p-6 sm:p-8 space-y-4 shadow-sm">
                <p className="text-xs font-light uppercase tracking-wider text-slate-600 mb-2">
                  Related Knowledge Hubs
                </p>
                <div className="space-y-3">
                  <Link
                    href="/compliance"
                    className="flex items-center justify-between p-4 rounded-sm border border-slate-200 bg-white hover:border-brand-electric hover:shadow-2xs transition-all"
                  >
                    <div>
                      <h4 className="text-sm font-normal text-slate-900">Compliance Centre</h4>
                      <p className="text-xs text-slate-600">Statutory obligations across fire, electrical, gas, and water hygiene.</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-brand-electric shrink-0" />
                  </Link>

                  <Link
                    href="/facilities-management-glossary"
                    className="flex items-center justify-between p-4 rounded-sm border border-slate-200 bg-white hover:border-brand-electric hover:shadow-2xs transition-all"
                  >
                    <div>
                      <h4 className="text-sm font-normal text-slate-900">FM Glossary</h4>
                      <p className="text-xs text-slate-600">Plain-English definitions of over 50 essential FM technical terms.</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-brand-electric shrink-0" />
                  </Link>

                  <Link
                    href="/resources/document-vault"
                    className="flex items-center justify-between p-4 rounded-sm border border-slate-200 bg-white hover:border-brand-electric hover:shadow-2xs transition-all"
                  >
                    <div>
                      <h4 className="text-sm font-normal text-slate-900">FM Document Vault</h4>
                      <p className="text-xs text-slate-600">Downloadable CSV asset registers, PPM templates, and logbooks.</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-brand-electric shrink-0" />
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
