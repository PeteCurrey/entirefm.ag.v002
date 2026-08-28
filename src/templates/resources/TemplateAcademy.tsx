'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';
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
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('entirefm_academy_completed');
      if (saved) {
        setCompletedModules(JSON.parse(saved));
      }
    } catch {
      // Ignore local storage errors
    }
  }, []);

  const toggleModuleCompletion = (id: string) => {
    setCompletedModules((prev) => {
      const next = prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id];
      try {
        localStorage.setItem('entirefm_academy_completed', JSON.stringify(next));
      } catch {
        // Ignore local storage errors
      }
      return next;
    });
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'EntireFM Academy', url: '/academy' },
  ];

  const totalModules = ACADEMY_MODULES.length;
  const completedCount = completedModules.length;

  return (
    <div className="bg-[#060A14] text-white min-h-screen font-sans selection:bg-brand-pink selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC HERO (85svh)                                                 */}
        {/* ========================================================================= */}
        <section className="relative min-h-[85svh] lg:min-h-[88svh] flex items-center justify-center bg-[#060A14] overflow-hidden pt-28 pb-16 sm:py-24 border-b border-brand-edge-dark">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/editorial/entirefm-client-review-2000w.webp"
              alt="EntireFM Academy — Professional Facilities Management Learning"
              fill
              priority
              className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.1]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/80 to-[#060A14]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060A14] via-[#060A14]/90 to-transparent" />
          </div>

          <div className="container-custom relative z-10 w-full">
            <div className="max-w-4xl space-y-6">
              
              <div className="mb-2">
                <Breadcrumbs items={breadcrumbs} className="text-slate-300 font-light text-xs" />
              </div>

              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm bg-white/10 backdrop-blur-md border border-white/15">
                <span className="w-2 h-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-white/90 font-medium">
                  Professional Development &amp; Operations
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.06]">
                EntireFM Academy.
              </h1>

              <p className="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-3xl">
                Engineering-grounded operational modules covering statutory maintenance compliance, building services engineering fundamentals, and commercial estate contract management.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-300 font-light border-t border-white/15">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  Free Open Access Curriculum
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  Practitioner-Led Modules
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  Aligned to SFG20 &amp; CIBSE
                </span>
              </div>

            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. CORE CURRICULUM MODULES                                                */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
          <div className="container-custom space-y-16">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-pink" />
                  <span className="text-xs uppercase tracking-wider text-brand-pink font-medium">
                    Operational Modules
                  </span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
                  Curriculum Pathway
                </h2>
                <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
                  Designed for property managers, estate directors, and building custodians requiring direct, engineering-grounded technical knowledge.
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="p-4 rounded-sm bg-slate-50 border border-slate-200 text-xs flex items-center gap-4 shrink-0 shadow-sm">
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium block">
                    Learning Progress
                  </span>
                  <span className="text-sm font-light text-slate-900">
                    {completedCount} of {totalModules} Modules Completed
                  </span>
                </div>
                <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-pink transition-all duration-500"
                    style={{ width: `${(completedCount / totalModules) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ACADEMY_MODULES.map((mod) => {
                const isCompleted = completedModules.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    className={`p-8 sm:p-10 rounded-sm border flex flex-col justify-between transition-all space-y-8 shadow-sm ${
                      isCompleted
                        ? 'border-emerald-500/40 bg-emerald-50/20'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
                            {mod.moduleNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-sm border text-[11px] font-medium uppercase tracking-wider bg-white border-slate-200 text-slate-700">
                            {mod.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-light">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{mod.duration}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl font-light text-slate-900 leading-snug">
                          {mod.title}
                        </h3>
                        <p className="text-sm text-slate-600 font-light leading-relaxed">
                          {mod.overview}
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs uppercase tracking-wider font-medium text-slate-500">
                          Core Technical Learning Points:
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-light">
                          {mod.keyTopics.map((topic, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-1.5 shrink-0" />
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <button
                        type="button"
                        onClick={() => toggleModuleCompletion(mod.id)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-medium transition-colors border ${
                          isCompleted
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-brand-pink hover:text-brand-pink'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{isCompleted ? 'Completed' : 'Mark as Completed'}</span>
                      </button>

                      <Link
                        href={mod.relatedTool.href}
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-brand-pink hover:text-slate-900 transition-colors"
                      >
                        <span>Interactive Tool: {mod.relatedTool.label}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Honest Accreditation Notice */}
            <div className="rounded-sm bg-slate-50 border border-slate-200 p-8 text-xs text-slate-600 leading-relaxed space-y-2">
              <h4 className="font-medium text-slate-900 uppercase tracking-wider text-xs">About EntireFM Academy</h4>
              <p className="font-light">
                EntireFM Academy is created and maintained by EntireFM's senior engineering and compliance personnel to elevate facilities management standards across UK commercial property. These modules are practical operational guides and do not confer academic degree credits or formal NVQ accreditations.
              </p>
            </div>

          </div>
        </section>

        <NewsletterSignupSection />
        <ProposalSection />
      </main>

      <Footer />
    </div>
  );
}
