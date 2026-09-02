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
  ShieldCheck,
  Flame,
  Zap,
  Droplets,
  Wind,
  Layers,
  AlertCircle,
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
    explanation: 'The Regulatory Reform (Fire Safety) Order 2005 requires a suitable and sufficient FRA that is kept up to date and reviewed upon significant change.',
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
    category: 'Fixed Electrical Safety (EICR)',
    question: 'What is the certification status of your fixed wire electrical installation?',
    explanation: 'The Electricity at Work Regulations 1989 (EAWR) and BS 7671 require fixed wire electrical installations to be tested at regular intervals (typically 5-yearly for commercial properties).',
    statutoryBasis: 'EAWR 1989 Reg 4 / BS 7671',
    options: [
      {
        label: 'Satisfactory EICR Certificate on File (<5 yrs)',
        description: 'Fixed wiring fully inspected with zero open C1 (Danger Present) or C2 (Potentially Dangerous) defects.',
        points: 2,
      },
      {
        label: 'Inspection Carried Out but Open C2/FI Observations Exist',
        description: 'Testing occurred but remedial rectification works for urgent observations have not been completed.',
        points: 1,
      },
      {
        label: 'Expired (>5 yrs) or No EICR Records',
        description: 'Fixed installation has not been certified within the statutory 5-year window.',
        points: 0,
      },
    ],
  },
  {
    id: 'water-hygiene',
    category: 'Water Hygiene & Legionella',
    question: 'How structured is your Legionella risk management and temperature monitoring regime?',
    explanation: 'HSE ACoP L8 and HSG274 require a valid Legionella Risk Assessment (LRA) and continuous monthly temperature monitoring of sentinel outlets.',
    statutoryBasis: 'HSE ACoP L8 / HSG274 / COSHH 2002',
    options: [
      {
        label: 'Active LRA & Monthly Logged Monitoring',
        description: 'Current LRA with digital/paper log of monthly flow/return temperatures, sentinel taps, and quarterly shower descaling.',
        points: 2,
      },
      {
        label: 'LRA on File but Logging is Inconsistent',
        description: 'A Legionella assessment exists, but monthly temperature logs and outlet flushing are irregular or missing data.',
        points: 1,
      },
      {
        label: 'Expired LRA (>2 yrs) or No Logbook Maintained',
        description: 'No active water hygiene monitoring regime or no competent responsible person designated for water safety.',
        points: 0,
      },
    ],
  },
  {
    id: 'gas-safety',
    category: 'Gas & Commercial Boiler Plant',
    question: 'Are commercial gas appliances certified annually under CP12 / CP17 gas safety checks?',
    explanation: 'Gas Safety (Installation and Use) Regulations 1998 mandate that commercial boilers, flues, and pipework undergo annual servicing and CP17 certification by a Gas Safe registered engineer.',
    statutoryBasis: 'Gas Safety (Installation & Use) Regs 1998 Reg 36',
    options: [
      {
        label: 'Annual CP17 Certificate Current & Logged (<12 months)',
        description: 'All plant serviced by Gas Safe registered commercial engineers with combustion efficiency and safety shut-off tests verified.',
        points: 2,
      },
      {
        label: 'Serviced Regularly but Certificate Documentation Missing',
        description: 'Boilers have been serviced by a contractor, but formal Gas Safe CP17 certification paperwork is incomplete.',
        points: 1,
      },
      {
        label: 'Overdue Annual Inspection (>12 months)',
        description: 'Gas plant has not received annual statutory servicing or warning notices have been issued.',
        points: 0,
      },
    ],
  },
  {
    id: 'emergency-lighting',
    category: 'Emergency Lighting (BS 5266)',
    question: 'Are emergency lighting luminaires tested monthly and subjected to an annual 3-hour discharge test?',
    explanation: 'BS 5266-1 and the Fire Safety Order require monthly functional flick testing and an annual full-duration battery discharge test with logbook records.',
    statutoryBasis: 'BS 5266-1 / RRO 2005 Article 17',
    options: [
      {
        label: 'Monthly Flick Tests & Annual 3-Hour Discharge Logged',
        description: 'Full compliance with BS 5266-1 with all failed lamps, ballasts, and batteries promptly replaced.',
        points: 2,
      },
      {
        label: 'Annual Test Done but Monthly Checks Irregular',
        description: 'Major annual discharge test is performed, but monthly key-switch functional inspections are sporadic.',
        points: 1,
      },
      {
        label: 'No Recorded Testing or Known Luminaire Faults',
        description: 'Emergency lights are not routinely tested or numerous battery luminaire failures are outstanding.',
        points: 0,
      },
    ],
  },
  {
    id: 'lifting-equipment',
    category: 'Lifting & Vertical Transport (LOLER)',
    question: 'Are passenger/goods lifts subject to 6-monthly LOLER Thorough Examinations?',
    explanation: 'Lifting Operations and Lifting Equipment Regulations 1998 (LOLER) require passenger carrying lifts to receive thorough examinations by a competent person every 6 months.',
    statutoryBasis: 'LOLER 1998 Reg 9 / PUWER 1998',
    options: [
      {
        label: 'Current LOLER Thorough Exam on File (<6 months)',
        description: 'Independent inspection completed with zero open Category A or B defects outstanding.',
        points: 2,
      },
      {
        label: 'Servicing Active but LOLER Exam Report Overdue',
        description: 'Maintenance contractor visits the lift, but the formal independent statutory insurance examination is missing.',
        points: 1,
      },
      {
        label: 'Overdue Thorough Examination or Not Applicable',
        description: 'No valid LOLER certificate within the required 6-month statutory window.',
        points: 0,
      },
    ],
  },
  {
    id: 'air-conditioning-fgas',
    category: 'F-Gas & Air Conditioning (TM44)',
    question: 'Are refrigerant logbooks and TM44 Energy Inspection certificates in place?',
    explanation: 'EU/UK F-Gas Regulations require leak check records for systems >5 tonnes CO2 equivalent. EPBD requires TM44 inspections for systems >12kW every 5 years.',
    statutoryBasis: 'F-Gas Regs 2015 / EPB Regs 2012 (TM44)',
    options: [
      {
        label: 'F-Gas Logbook Maintained & TM44 Current (<5 yrs)',
        description: 'Refrigerant additions/removals fully logged with certified leak tests and valid TM44 lodging.',
        points: 2,
      },
      {
        label: 'AC Serviced but TM44 or F-Gas Records Incomplete',
        description: 'Routine filter cleaning occurs, but formal refrigerant logbooks or TM44 report are missing.',
        points: 1,
      },
      {
        label: 'No F-Gas Log or Expired TM44 Report',
        description: 'No formal refrigerant compliance logs on site or no inspection lodged on the national register.',
        points: 0,
      },
    ],
  },
];

const WIZARD_STEPS = [
  { id: 1, title: '01 Evaluation', subtitle: '7 Statutory Disciplines' },
  { id: 2, title: '02 Results', subtitle: 'Diagnostic Breakdown' },
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

  // Calculate scores (100% preserved)
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = QUESTIONS.length * 2;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const strongAreas = QUESTIONS.filter((q) => answers[q.id] === 2);
  const reviewAreas = QUESTIONS.filter((q) => answers[q.id] === 1);
  const priorityGaps = QUESTIONS.filter((q) => answers[q.id] === 0);

  const levelLabel = percentage >= 80 ? 'Low Risk / Robust Control' : percentage >= 50 ? 'Moderate Risk / Partial Actions' : 'Elevated Risk / Action Required';
  const levelDescription = percentage >= 80
    ? 'Your estate exhibits structured statutory maintenance practices with documented proof across core building services.'
    : percentage >= 50
    ? 'Core servicing is taking place, but key periodic certification and audit logs have observable compliance gaps.'
    : 'Multiple statutory risk areas lack verifiable inspection certificates or structured maintenance schedules.';

  const handleDownloadPdf = () => {
    const pdfDoc: PdfDocumentDefinition = {
      title: 'FM Building Health Check & Compliance Diagnostic',
      subtitle: 'Statutory compliance and engineering risk evaluation report.',
      documentRef: `EFM-HC-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      badgeText: 'Technical Audit Diagnostic',
      summaryStats: [
        { label: 'Assurance Score', value: `${percentage}%`, detail: levelLabel },
        { label: 'Verified Disciplines', value: `${strongAreas.length} / 7` },
        { label: 'Action Items', value: `${priorityGaps.length + reviewAreas.length} Regimes` },
      ],
      sections: [
        {
          type: 'text',
          heading: '1. Executive Assurance Overview',
          paragraphs: [
            `Overall Estate Health Rating: ${percentage}% (${levelLabel}).`,
            levelDescription,
          ],
        },
        {
          type: 'table',
          heading: '2. Detailed Discipline Diagnostic Findings',
          columns: [
            { header: 'Discipline', widthPercent: 30 },
            { header: 'Status / Finding', widthPercent: 40 },
            { header: 'Statutory Reference', widthPercent: 30 },
          ],
          rows: QUESTIONS.map((q) => {
            const score = answers[q.id] ?? 0;
            const statusText = score === 2 ? 'COMPLIANT & LOGGED' : score === 1 ? 'PARTIAL / DEFICIENCIES' : 'STATUTORY GAP';
            return [q.category, statusText, q.statutoryBasis];
          }),
        },
      ],
    };
    downloadPdfReport(pdfDoc);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header solid />
      <div className="flex-grow">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="FM Building Health Check"
          purpose="Evaluate your estate across 7 core building engineering and statutory maintenance baselines to identify operational risks and audit gaps."
          timeEstimate="3 min"
          outputs={['PDF Diagnostic Report']}
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
                <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
                  {/* Progress Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-light text-brand-electric uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-electric" />
                      {currentQ.category}
                    </span>
                    <span className="font-normal text-xs text-slate-500">
                      Discipline <strong className="text-slate-900">{currentStep + 1}</strong> of {QUESTIONS.length}
                    </span>
                  </div>

                  {/* Question */}
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-extralight text-slate-900 leading-snug">
                      {currentQ.question}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {currentQ.explanation}
                    </p>
                    <div className="text-[11.5px] font-normal text-slate-500 pt-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-700 font-light">Statutory Basis:</span> {currentQ.statutoryBasis}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 pt-2">
                    {currentQ.options.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(opt.points)}
                        className="w-full text-left p-4 sm:p-5 rounded-sm border border-slate-200 bg-slate-50 hover:bg-white hover:border-brand-electric hover:shadow-sm transition-all flex items-start justify-between gap-4 group"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="text-sm font-normal text-slate-900 group-hover:text-brand-electric transition-colors">
                            {opt.label}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {opt.description}
                          </p>
                        </div>
                        <div className="h-6 w-6 rounded-full bg-slate-200 group-hover:bg-brand-electric group-hover:text-white flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Navigation Back */}
                  {currentStep > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="text-xs font-normal text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors"
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
                <div className="bg-white border border-slate-200 rounded-sm shadow-md p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <span className="text-xs text-emerald-700 font-light uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200 inline-block mb-1.5">
                        Diagnostic Assessment Complete
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900">
                        Estate Health Summary
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Evaluated across 7 core building engineering and statutory regimes.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3.5 py-2 rounded-sm border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-normal self-start sm:self-center transition-colors inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Restart Evaluation
                    </button>
                  </div>

                  {/* Scoreboard Metrics Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2 border-b border-slate-100">
                    <div className="sm:border-r border-slate-200 pr-4">
                      <span className="text-[11px] text-slate-500 font-normal uppercase block">Assurance Rating</span>
                      <div className="text-3xl sm:text-4xl font-light text-slate-900 tabular-nums mt-1">{percentage}%</div>
                      <span className="text-xs text-slate-600 font-normal">{levelLabel}</span>
                    </div>

                    <div className="sm:border-r border-slate-200 pr-4">
                      <span className="text-[11px] text-emerald-700 font-normal uppercase block">Verified Strong</span>
                      <div className="text-3xl sm:text-4xl font-light text-emerald-600 tabular-nums mt-1">{strongAreas.length} / 7</div>
                      <span className="text-xs text-slate-600 font-light">Documented Controls</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-rose-700 font-medium uppercase block">Remedial Attention</span>
                      <div className="text-3xl sm:text-4xl font-light text-rose-600 tabular-nums mt-1">{priorityGaps.length + reviewAreas.length}</div>
                      <span className="text-xs text-slate-600 font-light">Statutory / Standard Gaps</span>
                    </div>
                  </div>

                  {/* Export Toolbar */}
                  <ExportToolbar
                    toolName="FM Building Health Check"
                    onDownloadPdf={handleDownloadPdf}
                    pdfLabel="Download Health Check Diagnostic (PDF)"
                  />
                </div>

                {/* Findings Breakdown */}
                <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 sm:p-8 space-y-4">
                  <h3 className="text-xs font-normal text-slate-900 uppercase tracking-wider">
                    Discipline Risk Register &amp; Statutory References
                  </h3>

                  <div className="divide-y divide-slate-100 text-xs">
                    {QUESTIONS.map((q) => {
                      const score = answers[q.id] ?? 0;
                      return (
                        <div key={q.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-light text-slate-900 text-sm block">{q.category}</span>
                            <span className="text-[11px] font-normal text-slate-500">{q.statutoryBasis}</span>
                          </div>
                          <span
                            className={`px-2.5 py-1 border text-[10.5px] font-light uppercase rounded-sm self-start sm:self-center ${
                              score === 2
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : score === 1
                                ? 'bg-amber-50 border-amber-200 text-amber-800'
                                : 'bg-rose-50 border-rose-200 text-rose-700'
                            }`}
                          >
                            {score === 2 ? 'COMPLIANT & LOGGED' : score === 1 ? 'PARTIAL / ACTION REQ' : 'STATUTORY GAP'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Corporate Conversion CTA */}
                <ToolConversionCTA
                  toolName="FM Building Health Check"
                  heading="Require on-site statutory compliance verification?"
                  subheading="EntireFM mobilises certified engineering teams to audit statutory logbooks, certify physical plant, and eliminate duty-holder liability across commercial estates."
                  primaryActionLabel="Request Engineering Audit"
                  primaryActionHref="/contact-us#enquiry"
                />
              </div>
            )}
          </div>
        </ToolShell>
      </div>
      <Footer />
    </div>
  );
}
