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
  Sparkles,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
import { WizardProgress } from '@/components/tools/WizardProgress';
import { ExportToolbar } from '@/components/tools/ExportToolbar';
import { ToolConversionCTA } from '@/components/tools/ToolConversionCTA';
import { downloadPdfReport, PdfDocumentDefinition } from '@/lib/pdf/generator';
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
        label: 'FRA Exists but Open Actions Remain',
        description: 'An assessment was completed within 3 years, but several recommended improvements or remedial items remain open and unverified.',
        points: 1,
      },
      {
        label: 'Expired or No Written FRA on File',
        description: 'No current written assessment available, the assessment exceeds 3 years, or major layout/occupancy alterations took place since.',
        points: 0,
      },
    ],
  },
  {
    id: 'electrical-eicr',
    category: 'Electrical Systems & EICR',
    question: 'What is the certification status of your Fixed Electrical Installation (EICR)?',
    explanation: 'BS 7671 (18th Edition) and the Electricity at Work Regulations 1989 require commercial electrical systems to be periodically inspected (typically 5-yearly or rolling 20% annual programme).',
    statutoryBasis: 'Electricity at Work Regs 1989 / BS 7671',
    options: [
      {
        label: 'Satisfactory EICR Within 5 Years',
        description: 'Full electrical installation condition report on file, rated Satisfactory with zero unresolved C1 (Danger) or C2 (Potential Danger) codes.',
        points: 2,
      },
      {
        label: 'EICR on File but Open C2 Remedials',
        description: 'An inspection report exists within 5 years, but reported C2 observations or distribution board labeling items have not been rectified.',
        points: 1,
      },
      {
        label: 'Overdue / Unsatisfactory / Missing',
        description: 'The last EICR exceeds 5 years, was certified Unsatisfactory, or comprehensive distribution board records cannot be located.',
        points: 0,
      },
    ],
  },
  {
    id: 'water-hygiene',
    category: 'Water Hygiene & Legionella',
    question: 'How is water hygiene and Legionella compliance managed and recorded?',
    explanation: 'HSE Approved Code of Practice (ACOP) L8 requires a valid Legionella Risk Assessment and a documented written scheme of control, including sentinel temperature monitoring and tank inspections.',
    statutoryBasis: 'HSE ACOP L8 / HSG274 / COSHH 2002',
    options: [
      {
        label: 'Current LRA & Monthly Logged Monitoring',
        description: 'Legionella Risk Assessment updated within 2 years; monthly sentinel temperatures logged in CAFM; annual tank inspections on file.',
        points: 2,
      },
      {
        label: 'Risk Assessment Exists, Irregular Logging',
        description: 'An LRA is on record, but monthly sentinel temperature checks and outlet flushing are not logged consistently every month.',
        points: 1,
      },
      {
        label: 'No Current LRA or Monitoring Scheme',
        description: 'No written Legionella assessment exists, records are older than 2 years without review, or cold water storage tanks are uninspected.',
        points: 0,
      },
    ],
  },
  {
    id: 'emergency-lighting',
    category: 'Emergency Lighting',
    question: 'What is the testing frequency for emergency escape lighting systems?',
    explanation: 'BS 5266-1 specifies monthly functional flick tests and an annual full 3-hour battery discharge test, all recorded in a dedicated fire safety logbook.',
    statutoryBasis: 'BS 5266-1 / RRO 2005 Article 17',
    options: [
      {
        label: 'Monthly Flick + Annual 3-Hour Discharge Logged',
        description: 'Monthly short duration checks and annual 3-hour battery duration tests are completed by competent engineers and recorded.',
        points: 2,
      },
      {
        label: 'Monthly Checks Done, Annual Test Overdue',
        description: 'In-house monthly checks are maintained, but the annual 3-hour battery capacity test has not been executed within the last 12 months.',
        points: 1,
      },
      {
        label: 'No Formal Testing or Logbook Incomplete',
        description: 'Emergency lighting is checked ad-hoc without formal logbook entries or duration test certificates.',
        points: 0,
      },
    ],
  },
  {
    id: 'commercial-gas',
    category: 'Gas Safety & Plant',
    question: 'Are commercial gas boilers and heating plant certified annually by Gas Safe engineers?',
    explanation: 'The Gas Safety (Installation and Use) Regulations 1998 mandate that non-domestic gas appliances and flues must be maintained in a safe condition by registered Gas Safe engineers.',
    statutoryBasis: 'Gas Safety (Installation and Use) Regs 1998',
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

const WIZARD_STEPS = [
  { id: 1, title: '01 Diagnostic', subtitle: '7 Engineering Disciplines' },
  { id: 2, title: '02 Results', subtitle: 'Estate Health Score & Plan' },
];

export function TemplateHealthCheck({ route, content }: TemplateProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState<boolean>(false);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Interactive Tools', url: '/tools' },
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

  // Calculate scores
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = QUESTIONS.length * 2;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const strongAreas = QUESTIONS.filter((q) => answers[q.id] === 2);
  const reviewAreas = QUESTIONS.filter((q) => answers[q.id] === 1);
  const priorityGaps = QUESTIONS.filter((q) => answers[q.id] === 0);

  const scorePercent = percentage;
  const totalPoints = totalScore;
  const maxPoints = maxScore;
  const levelLabel = percentage >= 80 ? 'Low Risk / Robust Control' : percentage >= 50 ? 'Moderate Risk / Partial Actions' : 'Elevated Risk / Action Required';
  const levelDescription = percentage >= 80
    ? 'Your estate exhibits structured statutory maintenance practices with documented proof across core building services.'
    : percentage >= 50
    ? 'Core servicing is taking place, but key periodic certification and audit logs have observable compliance gaps.'
    : 'Multiple statutory risk areas lack verifiable inspection certificates or structured maintenance schedules.';

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Header />
      <main id="main" className="flex-grow pt-20">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="FM Building Health Check"
          purpose="Evaluate your estate across 7 core building engineering and statutory maintenance baselines."
          timeEstimate="3 min"
          outputs={['PDF Diagnostic Report']}
          icon={Activity}
        >
          {/* Stepper */}
          <WizardProgress
            steps={WIZARD_STEPS}
            currentStep={completed ? 1 : 0}
            onSelectStep={(idx) => {
              if (idx === 0 && completed) {
                setCompleted(false);
              }
            }}
          />

          <div className="max-w-4xl mx-auto space-y-8">
            {!completed ? (
              /* Diagnostic Questions View */
              <div className="space-y-6">
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
                  {/* Progress Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-semibold">
                        {currentQ.category}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      Discipline <strong className="text-white">{currentStep + 1}</strong> of {QUESTIONS.length}
                    </span>
                  </div>

                  {/* Question */}
                  <div className="space-y-2">
                    <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      {currentQ.question}
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {currentQ.explanation}
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10.5px] font-mono text-[#FF3E9D]">
                      <span>Basis:</span> {currentQ.statutoryBasis}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 pt-2">
                    {currentQ.options.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(opt.points)}
                        className="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 hover:border-[#FF3E9D]/60 hover:ring-1 hover:ring-[#FF3E9D]/30 transition-all group flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="text-sm font-bold text-white group-hover:text-[#FF3E9D] transition-colors">
                            {opt.label}
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {opt.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-[#FF3E9D] shrink-0 mt-1 transition-colors" />
                      </button>
                    ))}
                  </div>

                  {/* Navigation Back */}
                  {currentStep > 0 && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="text-xs font-semibold text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Previous Question
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Results Dashboard View */
              <div className="space-y-8">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#FF3E9D] uppercase tracking-wider">
                        Diagnostic Assessment Complete
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                        Estate Health Summary
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Evaluated across 7 core building engineering and statutory disciplines.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restart
                      </button>
                    </div>
                  </div>

                  {/* Score Banner */}
                  <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="relative flex items-center justify-center h-20 w-20 shrink-0">
                        <svg className="h-20 w-20 -rotate-90 transform" viewBox="0 0 36 36">
                          <path
                            className="text-slate-800"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={percentage >= 80 ? 'text-emerald-400' : percentage >= 50 ? 'text-amber-400' : 'text-rose-400'}
                            strokeDasharray={`${percentage}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-sm font-extrabold font-mono text-white">
                          {percentage}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                          Overall Statutory Health Rating
                        </span>
                        <p className="text-lg font-bold text-white mt-0.5">
                          {levelLabel}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {totalScore} of {maxScore} available compliance points achieved.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
                      <span className="text-[10px] font-semibold font-mono text-emerald-400 uppercase tracking-wider">
                        Documented Controls
                      </span>
                      <p className="mt-1 text-2xl font-bold text-emerald-400 font-mono">
                        {strongAreas.length} Areas
                      </p>
                      <p className="text-[11px] text-emerald-300/70 mt-0.5">
                        Active maintenance &amp; records on file
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40">
                      <span className="text-[10px] font-semibold font-mono text-amber-400 uppercase tracking-wider">
                        Areas to Review
                      </span>
                      <p className="mt-1 text-2xl font-bold text-amber-400 font-mono">
                        {reviewAreas.length} Areas
                      </p>
                      <p className="text-[11px] text-amber-300/70 mt-0.5">
                        Partial testing or open remedial actions
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40">
                      <span className="text-[10px] font-semibold font-mono text-rose-400 uppercase tracking-wider">
                        Priority Gaps
                      </span>
                      <p className="mt-1 text-2xl font-bold text-rose-400 font-mono">
                        {priorityGaps.length} Areas
                      </p>
                      <p className="text-[11px] text-rose-300/70 mt-0.5">
                        Immediate inspection or register update required
                      </p>
                    </div>
                  </div>

                  {/* Export Toolbar */}
                  <ExportToolbar
                    toolName="FM Building Health Check"
                    onDownloadPdf={() => {
                      const pdfDoc: PdfDocumentDefinition = {
                        title: 'Building Compliance Health Check Diagnostic Report',
                        subtitle: `Self-assessment diagnostic score and statutory action plan for estate management.`,
                        documentRef: `EFM-HC-${Date.now().toString().slice(-6)}`,
                        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
                        badgeText: 'Health Diagnostic Review',
                        summaryStats: [
                          { label: 'Overall Score', value: `${scorePercent}%`, detail: levelLabel },
                          { label: 'Documented Areas', value: `${strongAreas.length} Regimes`, detail: 'Active Control' },
                          { label: 'Review Required', value: `${reviewAreas.length} Regimes`, detail: 'Partial / Open Actions' },
                          { label: 'Priority Gaps', value: `${priorityGaps.length} Regimes`, detail: 'Immediate Attention' },
                        ],
                        sections: [
                          {
                            type: 'cards',
                            heading: '1. Executive Diagnostic Summary',
                            items: [
                              {
                                title: levelLabel,
                                subtitle: `Overall Health Score: ${scorePercent}% (${totalPoints}/${maxPoints} points)`,
                                body: levelDescription,
                              },
                            ],
                          },
                          {
                            type: 'table',
                            heading: '2. Priority Remedial Actions & Review Items',
                            columns: [
                              { header: 'Discipline', widthPercent: 25 },
                              { header: 'Status / Finding', widthPercent: 45 },
                              { header: 'Statutory Basis', widthPercent: 30 },
                            ],
                            rows: [
                              ...priorityGaps.map((g) => [
                                `[PRIORITY GAP] ${g.category}`,
                                'No current records or overdue periodic testing. Competent engineer review required.',
                                g.statutoryBasis || 'Statutory Duty',
                              ]),
                              ...reviewAreas.map((r) => [
                                `[REVIEW REQUIRED] ${r.category}`,
                                'Assessment exists but remedial closeouts or full-duration testing need completion.',
                                r.statutoryBasis || 'Industry Standard',
                              ]),
                            ],
                          },
                        ],
                      };
                      downloadPdfReport(pdfDoc);
                    }}
                    pdfLabel="Download Diagnostic PDF Report"
                  />
                </div>

                {/* Priority Review Checklist */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                  <h3 className="text-lg font-bold text-white">
                    Action Plan &amp; Guidance
                  </h3>

                  <div className="space-y-4">
                    {priorityGaps.map((g) => (
                      <div key={g.id} className="p-4 rounded-xl border border-rose-800/50 bg-rose-950/20 border-l-4 border-l-rose-500 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">{g.category}</span>
                          <span className="text-[10px] font-mono text-rose-400">{g.statutoryBasis}</span>
                        </div>
                        <p className="text-xs text-slate-300">No current records or overdue periodic testing. Verify with competent engineer.</p>
                      </div>
                    ))}

                    {reviewAreas.map((r) => (
                      <div key={r.id} className="p-4 rounded-xl border border-amber-800/50 bg-amber-950/20 border-l-4 border-l-amber-500 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">{r.category}</span>
                          <span className="text-[10px] font-mono text-amber-400">{r.statutoryBasis}</span>
                        </div>
                        <p className="text-xs text-slate-300">Assessment exists but remedial closeouts or full-duration testing need completion.</p>
                      </div>
                    ))}

                    {strongAreas.map((s) => (
                      <div key={s.id} className="p-4 rounded-xl border border-emerald-800/50 bg-emerald-950/20 border-l-4 border-l-emerald-500 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">{s.category}</span>
                          <span className="text-[10px] font-mono text-emerald-400">Compliant</span>
                        </div>
                        <p className="text-xs text-slate-400">Routine testing and logged closeouts in place.</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversion CTA */}
                <ToolConversionCTA
                  toolName="FM Building Health Check"
                  heading="Need a physical on-site building compliance survey?"
                  subheading="Our certified engineers survey building services, verify asset condition, and consolidate digital compliance logbooks across UK commercial estates."
                  primaryActionLabel="Request an Asset Survey"
                  primaryActionHref="/contact-us#enquiry"
                />
              </div>
            )}
          </div>
        </ToolShell>
      </main>
      <Footer />
    </div>
  );
}
