'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Zap,
  Flame,
  Droplets,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import type { TemplateProps } from '../types';

interface CourseModule {
  id: string;
  moduleNumber: string;
  title: string;
  duration: string;
  level: 'Foundational' | 'Intermediate' | 'Operational';
  overview: string;
  keyTopics: string[];
  recommendedRole: string;
  relatedTool: { label: string; href: string };
}

const ACADEMY_MODULES: CourseModule[] = [
  {
    id: 'mod-1',
    moduleNumber: 'Module 01',
    title: 'Planned Preventative Maintenance (PPM) Fundamentals',
    duration: '25 mins',
    level: 'Foundational',
    overview: 'Learn how asset registers, maintenance frequencies, and condition-based monitoring protect commercial estates from reactive chaos and budget overruns.',
    keyTopics: [
      'Reactive vs Planned Maintenance cost dynamics',
      'How to build an accurate plant asset register',
      'Distinguishing between statutory requirements and best practice',
      'Reading CAFM job sheets and verifying engineer sign-offs',
    ],
    recommendedRole: 'Property Managers, Facilities Coordinators, Building Caretakers',
    relatedTool: { label: 'PPM Schedule Builder', href: '/tools/ppm-schedule-builder' },
  },
  {
    id: 'mod-2',
    moduleNumber: 'Module 02',
    title: 'UK Statutory Compliance & Legal Duty Holder Roles',
    duration: '35 mins',
    level: 'Operational',
    overview: 'A plain-English breakdown of legal obligations under the Health & Safety at Work Act, Fire Safety Order, Electricity at Work, and Legionella ACOP L8.',
    keyTopics: [
      'The legal definition of the "Responsible Person" / Duty Holder',
      'Fire Risk Assessment (FRA) validity and review triggers',
      'Fixed wire EICR periodic inspection intervals (BS 7671)',
      'Water hygiene logbooks, flushing records, and sentinel checks',
    ],
    recommendedRole: 'Estates Directors, Managing Agents, Landlords',
    relatedTool: { label: 'Compliance Calendar Builder', href: '/tools/compliance-calendar' },
  },
  {
    id: 'mod-3',
    moduleNumber: 'Module 03',
    title: 'Commercial Building Services Engineering for Non-Engineers',
    duration: '30 mins',
    level: 'Foundational',
    overview: 'Understand how HVAC chillers, AHUs, commercial gas boilers, and distribution boards operate so you can communicate effectively with mobile engineers.',
    keyTopics: [
      'Basic principles of refrigeration, VRF circuits, and F-Gas checks',
      'Commercial boiler houses, flue dilution, and gas interlocks',
      'Main switchboards, sub-distribution panels, and thermal imaging',
      'Passenger lift LOLER 6-month vs goods lift 12-month requirements',
    ],
    recommendedRole: 'Junior FMs, Asset Managers, Operations Teams',
    relatedTool: { label: 'FM Building Health Check', href: '/tools/fm-health-check' },
  },
  {
    id: 'mod-4',
    moduleNumber: 'Module 04',
    title: 'FM Procurement, Tender Structuring & SLA Management',
    duration: '20 mins',
    level: 'Intermediate',
    overview: 'How to structure clear Facilities Management specifications, define measurable Service Level Agreements (SLAs), and evaluate contractor bids.',
    keyTopics: [
      'Hard FM vs Soft FM scope boundaries and bundling',
      'Drafting realistic emergency and routine response KPIs',
      'CAFM digital transparency and audit trail requirements',
      'Contract mobilisation and asset handover management',
    ],
    recommendedRole: 'Procurement Managers, Commercial Property Directors',
    relatedTool: { label: 'Tender Brief Generator', href: '/tools/tender-brief' },
  },
];

export function TemplateAcademy({ route, content }: TemplateProps) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Academy', url: '/academy' },
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
              <span className="eyebrow eyebrow-dark inline-block mb-3">Operational Learning</span>
              <h1 className="text-display-md text-white font-extrabold tracking-tight">
                EntireFM Academy — Practical Facilities Learning
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-brand-mist/75">
                Free, practical operational learning modules covering statutory maintenance compliance, building services engineering basics, and estate contract oversight.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-brand-mist/60">
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-brand-electric-bright" />
                  100% Free Open Access
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-electric-bright" />
                  Verified UK Engineering Standards
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Course Modules Grid */}
        <section className="py-16 bg-brand-carbon">
          <div className="container-custom">
            <div className="mb-10">
              <span className="eyebrow eyebrow-dark">Curriculum Overview</span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Core Operational Modules
              </h2>
              <p className="text-xs text-brand-mist/60 mt-1 max-w-xl">
                Designed for property managers and building custodians wanting direct, engineering-grounded technical knowledge.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {ACADEMY_MODULES.map((mod) => (
                <div
                  key={mod.id}
                  className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 sm:p-8 flex flex-col justify-between hover:border-brand-electric/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono text-brand-electric-bright font-bold uppercase tracking-wider">
                        {mod.moduleNumber}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-brand-mist/50">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{mod.duration}</span>
                        <span>·</span>
                        <span className="text-white/70">{mod.level}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-snug">
                      {mod.title}
                    </h3>
                    <p className="mt-2 text-xs text-brand-mist/75 leading-relaxed">
                      {mod.overview}
                    </p>

                    <div className="mt-5 pt-4 border-t border-brand-edge-dark">
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-brand-mist/40 mb-2">
                        Core Learning Points:
                      </h4>
                      <ul className="space-y-1.5 text-xs text-brand-mist/80">
                        {mod.keyTopics.map((topic, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="h-1 w-1 rounded-full bg-brand-electric-bright shrink-0 mt-1.5" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-edge-dark flex items-center justify-between text-xs">
                    <span className="text-[11px] text-brand-mist/50 truncate max-w-[200px]">
                      Recommended: {mod.recommendedRole}
                    </span>
                    <Link
                      href={mod.relatedTool.href}
                      className="text-brand-electric-bright font-semibold hover:underline inline-flex items-center gap-1 shrink-0"
                    >
                      Use Tool: {mod.relatedTool.label} <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Honest Accreditation Notice */}
            <div className="mt-12 rounded-sm bg-white/[0.02] border border-brand-edge-dark p-6 text-xs text-brand-mist/60 leading-relaxed">
              <h4 className="font-semibold text-white mb-1">About EntireFM Academy</h4>
              <p>
                EntireFM Academy is created and maintained by EntireFM's senior engineering and compliance personnel to elevate facilities management standards across UK commercial property. These modules are practical operational guides and do not confer academic degree credits or formal NVQ accreditations.
              </p>
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
