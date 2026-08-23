'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Printer,
  ShieldCheck,
  FileCheck,
  Flame,
  Zap,
  Droplets,
  Wind,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import type { TemplateProps } from '../types';

interface Question {
  id: string;
  category: string;
  question: string;
  explanation: string;
  statutoryBasis: string;
  options: {
    label: string;
    description: string;
    points: number; // 2: fully in place, 1: partial/uncertain, 0: gap
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'fire-safety',
    category: 'Fire Safety & Detection',
    question: 'How current and documented is your commercial Fire Risk Assessment (FRA)?',
    explanation: 'The Regulatory Reform (Fire Safety) Order 2005 requires a suitable and sufficient FRA that is kept up to date and reviewed upon significant change or when suspected invalid.',
    statutoryBasis: 'RRO 2005 Article 9 / Fire Safety Act 2021',
    options: [
      {
        label: 'Current & Actions Closed Out',
        description: 'Assessed by a competent person within the last 12–24 months; all significant findings and remedial action points have documented closeout.',
        points: 2,
      },
      {
        label: 'Assessment Exists, Actions Open',
        description: 'We have a written FRA on file, but action items have not been formally tracked or signed off.',
        points: 1,
      },
      {
        label: 'Outdated or Unsure',
        description: 'Over 3 years old, major layout/occupancy changes have occurred, or no formal written assessment is easily accessible.',
        points: 0,
      },
    ],
  },
  {
    id: 'emergency-lighting',
    category: 'Emergency Lighting',
    question: 'How is emergency escape lighting tested and recorded?',
    explanation: 'BS 5266-1 recommends monthly short functional tests and an annual full-duration discharge test (typically 3 hours) recorded in a dedicated logbook.',
    statutoryBasis: 'BS 5266-1 / RRO 2005 Article 17',
    options: [
      {
        label: 'Monthly & Annual Full Duration Logged',
        description: 'Monthly flick tests and annual 3-hour discharge tests are performed by trained technicians with all battery failures rectified immediately.',
        points: 2,
      },
      {
        label: 'Monthly Only or Ad-Hoc',
        description: 'Monthly inspections occur, but the full 3-hour discharge test is skipped or done irregularly without certification.',
        points: 1,
      },
      {
        label: 'No Formal Testing Schedule',
        description: 'Testing is infrequent, unrecorded, or relies solely on self-test indicators without human review.',
        points: 0,
      },
    ],
  },
  {
    id: 'electrical-eicr',
    category: 'Electrical & Fixed Wire',
    question: 'What is the status of your Electrical Installation Condition Report (EICR)?',
    explanation: 'The Electricity at Work Regulations 1989 requires systems to be maintained to prevent danger. IET guidance suggests periodic inspection intervals of up to 5 years for commercial premises.',
    statutoryBasis: 'Electricity at Work Regs 1989 / BS 7671',
    options: [
      {
        label: 'Valid Satisfactory EICR with Schedules',
        description: 'Inspected within recommended interval (≤5 years) with a Satisfactory outcome and all C1/C2 defects rectified and signed off.',
        points: 2,
      },
      {
        label: 'EICR Exists with Open Observations',
        description: 'An EICR was completed, but C2 (potentially dangerous) or C3 observations remain pending remedial electrical works.',
        points: 1,
      },
      {
        label: 'Expired or No Full Certificate',
        description: 'Older than 5 years, only summary page available, or no record of testing across distribution boards.',
        points: 0,
      },
    ],
  },
  {
    id: 'water-hygiene',
    category: 'Water Hygiene & Legionella',
    question: 'How is Legionella risk managed across your hot and cold water services?',
    explanation: 'ACOP L8 and HSG274 require a written Legionella risk assessment, appointment of a Responsible Person, a written scheme of control, and temperature monitoring.',
    statutoryBasis: 'ACOP L8 / HSG274 / COSHH 2002',
    options: [
      {
        label: 'Current Risk Assessment & Monthly Scheme',
        description: 'Written scheme of control active, monthly sentinel temperature logs maintained, regular flushing of little-used outlets documented.',
        points: 2,
      },
      {
        label: 'Assessment Done, Monitoring Irregular',
        description: 'A risk assessment exists, but monthly temperature logs have gaps or little-used outlets are not flushed systematically.',
        points: 1,
      },
      {
        label: 'No Formal Monitoring Scheme',
        description: 'No active temperature log, unreviewed water system alterations, or unknown dead-leg status.',
        points: 0,
      },
    ],
  },
  {
    id: 'gas-safety',
    category: 'Commercial Gas & Heating',
    question: 'How are commercial boilers, gas pipework and plantrooms maintained?',
    explanation: 'Under Gas Safety (Installation & Use) Regs 1998 Reg 35, duty holders must maintain commercial gas fittings in a safe condition using Gas Safe registered commercial engineers.',
    statutoryBasis: 'Gas Safety (Installation and Use) Regs 1998 Reg 35',
    options: [
      {
        label: 'Annual Commercial Inspection & Service Records',
        description: 'Commercial Gas Safe engineers service boilers and safety interlocks annually, with CP15/CP17 records on file.',
        points: 2,
      },
      {
        label: 'Reactive Maintenance Only',
        description: 'Gas plant is serviced when faults occur rather than on a planned annual inspection regime.',
        points: 1,
      },
      {
        label: 'Unknown / Not Applicable',
        description: 'No documentation available, or site uses electric-only heating.',
        points: 2, // Default neutral for electric or verified
      },
    ],
  },
  {
    id: 'hvac-fgas',
    category: 'HVAC & Refrigeration',
    question: 'How are air conditioning chillers and F-Gas leak checks managed?',
    explanation: 'F-Gas regulations require mandatory leak checks based on the CO2 equivalent charge of each refrigeration circuit, with logbooks kept for systems above 5 tonnes CO2e.',
    statutoryBasis: 'GB F-Gas Regulations / TM44 Energy Assessments',
    options: [
      {
        label: 'F-Gas Logbooks & Periodic Leak Testing',
        description: 'Certified F-Gas engineers perform scheduled leak testing with circuit charge records and TM44 energy inspections up to date.',
        points: 2,
      },
      {
        label: 'Filters Changed, F-Gas Records Incomplete',
        description: 'Routine filter and fan cleaning is conducted, but F-Gas refrigerant logbooks are incomplete or unverified.',
        points: 1,
      },
      {
        label: 'No Refrigeration Records',
        description: 'System charges are unknown, no leak testing records exist, or plant is only attended on failure.',
        points: 0,
      },
    ],
  },
  {
    id: 'fabric-records',
    category: 'Fabric, Asbestos & Lifts',
    question: 'What is the position regarding Asbestos management and LOLER lift examinations?',
    explanation: 'Pre-2000 non-domestic buildings require an Asbestos Management Plan. Passenger lifts require thorough examination under LOLER at least every 6 months.',
    statutoryBasis: 'Control of Asbestos Regs 2012 / LOLER 1998 Reg 9',
    options: [
      {
        label: 'Asbestos Register Active & LOLER 6-Monthly',
        description: 'Asbestos register issued to contractors prior to intrusive works; passenger lifts thoroughly examined by an independent competent body every 6 months.',
        points: 2,
      },
      {
        label: 'Registers Exist but Unreviewed',
        description: 'Asbestos survey on file but not re-inspected annually; lift service visits done but LOLER thorough reports not tracked separately.',
        points: 1,
      },
      {
        label: 'Gaps in High-Risk Records',
        description: 'Asbestos register missing on pre-2000 property, or passenger lifts examined only on 12-month intervals.',
        points: 0,
      },
    ],
  },
];

export function TemplateHealthCheck({ route, content }: TemplateProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState<boolean>(false);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Tools', url: '/tools' },
    { name: 'FM Building Health Check', url: '/tools/fm-health-check' },
  ];

  const currentQ = QUESTIONS[currentStep];

  const handleSelectOption = (points: number) => {
    const nextAnswers = { ...answers, [currentQ.id]: points };
    setAnswers(nextAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setCompleted(false);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Calculate scores
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = QUESTIONS.length * 2;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const strongAreas = QUESTIONS.filter((q) => answers[q.id] === 2);
  const reviewAreas = QUESTIONS.filter((q) => answers[q.id] === 1);
  const priorityGaps = QUESTIONS.filter((q) => answers[q.id] === 0);

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
              <span className="eyebrow eyebrow-dark inline-block mb-3">Diagnostic Tool</span>
              <h1 className="text-display-md text-white font-extrabold tracking-tight">
                FM Building Health Check
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-brand-mist/75">
                A 3-minute operational diagnostic to assess your estate against UK statutory maintenance obligations, highlight potential documentation gaps, and prioritise preventative actions.
              </p>
            </div>
          </div>
        </section>

        {/* Diagnostic App Section */}
        <section className="py-16 bg-brand-carbon">
          <div className="container-custom max-w-4xl">
            {!completed ? (
              <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 sm:p-10 shadow-elevated">
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-xs text-brand-mist/60 mb-2">
                    <span className="font-semibold uppercase tracking-wider text-brand-electric-bright">
                      Question {currentStep + 1} of {QUESTIONS.length}
                    </span>
                    <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% Complete</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                    <div
                      className="h-full bg-brand-electric-bright transition-all duration-300 ease-out"
                      style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Details */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-mist/50">
                      {currentQ.category}
                    </span>
                    <span className="text-white/20">·</span>
                    <span className="text-[11px] font-mono text-brand-electric-bright">
                      {currentQ.statutoryBasis}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {currentQ.question}
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-brand-mist/70 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3.5">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(opt.points)}
                      className="group w-full text-left p-5 rounded-sm border border-brand-edge-dark bg-white/[0.02] hover:border-brand-electric/60 hover:bg-white/[0.06] transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-brand-electric-bright transition-colors">
                            {opt.label}
                          </p>
                          <p className="mt-1 text-xs text-brand-mist/70 leading-relaxed">
                            {opt.description}
                          </p>
                        </div>
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/40 group-hover:border-brand-electric-bright group-hover:text-brand-electric-bright">
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation Back */}
                {currentStep > 0 && (
                  <div className="mt-8 pt-4 border-t border-brand-edge-dark flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="inline-flex items-center gap-1.5 text-xs text-brand-mist/60 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Previous Question
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-brand-mist/40 hover:text-brand-mist transition-colors"
                    >
                      Reset diagnostic
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Results Summary View */
              <div className="space-y-8">
                <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 sm:p-10 shadow-elevated">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-brand-edge-dark pb-8">
                    <div>
                      <span className="eyebrow eyebrow-dark">Diagnostic Results</span>
                      <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                        Estate Health Summary
                      </h2>
                      <p className="mt-1 text-xs text-brand-mist/60">
                        Based on your answers across 7 core building engineering and safety disciplines.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="btn-ghost-light py-2 px-3 text-xs"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Print / Save PDF
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="btn-ghost-light py-2 px-3 text-xs"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Restart
                      </button>
                    </div>
                  </div>

                  {/* Score breakdown metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
                    <div className="p-4 rounded-sm bg-brand-carbon border border-brand-edge-dark">
                      <span className="text-[11px] font-semibold text-brand-mist/50 uppercase tracking-wider">
                        Documented Strengths
                      </span>
                      <p className="mt-2 text-2xl font-bold text-emerald-400">
                        {strongAreas.length} Areas
                      </p>
                      <p className="text-[11px] text-brand-mist/60 mt-1">
                        Active maintenance & records on file
                      </p>
                    </div>

                    <div className="p-4 rounded-sm bg-brand-carbon border border-brand-edge-dark">
                      <span className="text-[11px] font-semibold text-brand-mist/50 uppercase tracking-wider">
                        Areas to Review
                      </span>
                      <p className="mt-2 text-2xl font-bold text-amber-400">
                        {reviewAreas.length} Areas
                      </p>
                      <p className="text-[11px] text-brand-mist/60 mt-1">
                        Partial testing or open remedial actions
                      </p>
                    </div>

                    <div className="p-4 rounded-sm bg-brand-carbon border border-brand-edge-dark">
                      <span className="text-[11px] font-semibold text-brand-mist/50 uppercase tracking-wider">
                        Potential Gaps
                      </span>
                      <p className="mt-2 text-2xl font-bold text-rose-400">
                        {priorityGaps.length} Areas
                      </p>
                      <p className="text-[11px] text-brand-mist/60 mt-1">
                        Immediate inspection or register update recommended
                      </p>
                    </div>
                  </div>

                  {/* Action items checklist */}
                  <div className="space-y-6">
                    {priorityGaps.length > 0 && (
                      <div className="rounded-sm border border-rose-500/30 bg-rose-500/[0.03] p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="h-4 w-4 text-rose-400" />
                          <h3 className="text-sm font-bold text-rose-200">
                            Priority Review Items (Immediate Action Recommended)
                          </h3>
                        </div>
                        <ul className="space-y-2.5 text-xs text-brand-mist/80">
                          {priorityGaps.map((g) => (
                            <li key={g.id} className="flex items-start justify-between gap-4 border-b border-rose-500/10 pb-2">
                              <div>
                                <span className="font-semibold text-white">{g.category}: </span>
                                <span>No current records or overdue periodic testing. Verify with competent engineer.</span>
                                <span className="block mt-0.5 font-mono text-[10px] text-rose-300/60">{g.statutoryBasis}</span>
                              </div>
                              <Link
                                href="/compliance"
                                className="text-brand-electric-bright hover:underline shrink-0 text-[11px] font-medium"
                              >
                                View Guidance →
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {reviewAreas.length > 0 && (
                      <div className="rounded-sm border border-amber-500/30 bg-amber-500/[0.03] p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <HelpCircle className="h-4 w-4 text-amber-400" />
                          <h3 className="text-sm font-bold text-amber-200">
                            Areas With Remedial Actions or Open Observations
                          </h3>
                        </div>
                        <ul className="space-y-2.5 text-xs text-brand-mist/80">
                          {reviewAreas.map((r) => (
                            <li key={r.id} className="flex items-start justify-between gap-4 border-b border-amber-500/10 pb-2">
                              <div>
                                <span className="font-semibold text-white">{r.category}: </span>
                                <span>Assessment exists but remedial closeouts or full-duration testing need completion.</span>
                              </div>
                              <Link
                                href="/compliance"
                                className="text-brand-electric-bright hover:underline shrink-0 text-[11px] font-medium"
                              >
                                View Guidance →
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {strongAreas.length > 0 && (
                      <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/[0.03] p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <h3 className="text-sm font-bold text-emerald-200">
                            Documented Areas (Maintain Regular Schedule)
                          </h3>
                        </div>
                        <ul className="space-y-1.5 text-xs text-brand-mist/80">
                          {strongAreas.map((s) => (
                            <li key={s.id} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              <span className="font-semibold text-white">{s.category}:</span> Routine testing and logged closeouts in place.
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Disclaimer */}
                  <div className="mt-8 rounded-sm bg-white/[0.02] border border-brand-edge-dark p-4 text-[11px] leading-relaxed text-brand-mist/50">
                    <p>
                      <strong>Important Notice:</strong> This diagnostic tool is an indicative operational review based solely on your self-selected responses. It does not constitute formal legal advice, statutory inspection, or proof of compliance. Legal duty discharge requires formal surveys, asset verification, and physical inspection by competent persons.
                    </p>
                  </div>
                </div>

                {/* Next steps CTA */}
                <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Need a physical asset & compliance survey?
                    </h3>
                    <p className="text-xs text-brand-mist/70 mt-1 max-w-lg">
                      Our certified mobile engineers can survey your building services, compile an accurate asset register, and establish a verified PPM matrix.
                    </p>
                  </div>
                  <Link href="/contact-us" className="btn-primary shrink-0 py-2.5 px-4 text-xs">
                    Request an Asset Survey
                    <ArrowRight className="h-3.5 w-3.5 btn-arrow" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <TrustBar />
        <ProposalSection />
      </main>
      <Footer />
    </>
  );
}
