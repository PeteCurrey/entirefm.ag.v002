'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  FileCheck2,
  Download,
  Activity,
  Flame,
  Zap,
  Droplets,
  Building2,
  Wind,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
import { WizardProgress } from '@/components/tools/WizardProgress';
import { ExportToolbar } from '@/components/tools/ExportToolbar';
import { ToolConversionCTA } from '@/components/tools/ToolConversionCTA';
import { COMPLIANCE_REGIMES } from '@/lib/tools/compliance-taxonomy';
import { downloadPdfReport, PdfDocumentDefinition } from '@/lib/pdf/generator';
import { generateCsv, downloadCsvFile } from '@/lib/exports/csv-exporter';
import type { TemplateProps } from '../types';

interface ComplianceQuestion {
  id: string;
  regimeKey: keyof typeof COMPLIANCE_REGIMES;
  title: string;
  category: string;
  question: string;
  legislation: string;
  options: {
    label: string;
    points: number; // 0 (Severe Gap), 1 (Partial/Action Required), 2 (Compliant & Documented)
    status: 'COMPLIANT' | 'ACTION_REQUIRED' | 'CRITICAL_GAP';
    finding: string;
    action: string;
    priority: 'Immediate' | 'High' | 'Medium' | 'Compliant';
  }[];
}

const COMPLIANCE_QUESTIONS: ComplianceQuestion[] = [
  {
    id: 'comp-fire-ra',
    regimeKey: 'FIRE_SAFETY_ORDER',
    title: 'Fire Risk Assessment (FRA)',
    category: 'Fire & Life Safety',
    question: 'What is the current status of your commercial Fire Risk Assessment and action closeout?',
    legislation: 'Regulatory Reform (Fire Safety) Order 2005 / Fire Safety Act 2021',
    options: [
      {
        label: 'Current (Reviewed within 12–24m) with all high-priority action items closed out and documented.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'Suitable and sufficient written assessment on record with formal action tracking.',
        action: 'Maintain routine annual review cycle or re-assess following material layout changes.',
        priority: 'Compliant',
      },
      {
        label: 'Written FRA exists, but several remedial findings/action points remain open and unverified.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Fire Risk Assessment exists but open actions represent potential statutory liability.',
        action: 'Appoint competent fire engineering team to complete and sign off open FRA action points.',
        priority: 'High',
      },
      {
        label: 'No formal assessment, FRA is over 3 years old, or significant layout/tenancy changes took place.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Absence of valid Fire Risk Assessment constitutes a direct criminal breach of RRO 2005.',
        action: 'Commission an immediate Type 1 / Type 2 commercial Fire Risk Assessment by a BAFE/IFE registered assessor.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-fire-alarm',
    regimeKey: 'FIRE_ALARM',
    title: 'Fire Alarm Testing & Maintenance',
    category: 'Fire & Life Safety',
    question: 'How are weekly user tests and 6-monthly engineering fire alarm inspections executed?',
    legislation: 'BS 5839-1 / RRO 2005 Article 17',
    options: [
      {
        label: 'Weekly call point tests are formally logged; 6-monthly BAFE engineering certificates on file.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'Full statutory logbook routine and accredited engineering certification active.',
        action: 'Maintain existing scheduled engineer testing and weekly call-point rota.',
        priority: 'Compliant',
      },
      {
        label: 'Engineers attend periodically, but weekly testing log is incomplete or missing entries.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Periodic engineering servicing maintained, but user logbook has evidence gaps.',
        action: 'Reinstate structured weekly manual call point rotation and record in digital CAFM logbook.',
        priority: 'Medium',
      },
      {
        label: 'No scheduled 6-monthly maintenance, or system has persistent open faults/isolated zones.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Unmaintained fire alarm system creates severe life safety exposure and invalidates insurance.',
        action: 'Execute emergency fire alarm service visit and rectify system faults immediately.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-emerg-light',
    regimeKey: 'EMERGENCY_LIGHTING',
    title: 'Emergency Escape Lighting',
    category: 'Fire & Life Safety',
    question: 'Are monthly 30-minute flick tests and annual 3-hour battery discharge tests completed?',
    legislation: 'BS 5266-1:2016 / RRO 2005',
    options: [
      {
        label: 'Monthly functional flick tests logged; annual 3-hour full discharge certificate on record.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'Complete BS 5266 compliance regime with battery duration certified.',
        action: 'Continue planned monthly flick and annual 3-hour discharge tests.',
        priority: 'Compliant',
      },
      {
        label: 'Annual discharge completed, but known failed luminaires / battery units have not been replaced.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Emergency lighting luminaire failures present unlit escape paths in blackout.',
        action: 'Raise remedial work order to replace failed emergency battery packs / LED luminaires.',
        priority: 'High',
      },
      {
        label: 'No formal testing regime, no logbook records, or 3-hour discharge never conducted.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Complete absence of emergency lighting certification breaches RRO 2005 Article 17.',
        action: 'Perform full estate 3-hour discharge test and log all defective units for immediate repair.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-fire-doors',
    regimeKey: 'FIRE_DOORS',
    title: 'Fire Doors & Compartmentation',
    category: 'Fire & Life Safety',
    question: 'What is the inspection and maintenance status of your estate fire doors and smoke seals?',
    legislation: 'BS 8214:2016 / Fire Safety (England) Regs 2022',
    options: [
      {
        label: 'Formal 6-monthly recorded inspections (gaps, intumescent seals, closers, hinges) with defects rectified.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'Compliant compartmentation control and documented gap-measuring records.',
        action: 'Maintain regular door closer checks and 6-monthly full register inspection.',
        priority: 'Compliant',
      },
      {
        label: 'Fire doors are inspected ad-hoc; some self-closers disconnected, wedged open, or seals damaged.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Compromised fire doors allow smoke and thermal breach across compartment boundaries.',
        action: 'Remove all door wedges, replace damaged intumescent brush strips, and adjust closers.',
        priority: 'High',
      },
      {
        label: 'No fire door register, doors are uncertified, or extensive compartmentation penetrations unsealed.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Critical fire stopping failures create immediate risk of rapid vertical/lateral fire spread.',
        action: 'Conduct formal fire door and compartmentation survey; seal all unstopped riser penetrations.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-eicr',
    regimeKey: 'ELECTRICAL_EICR',
    title: 'Fixed Electrical Wiring (EICR)',
    category: 'Electrical Infrastructure',
    question: 'When was the last Electrical Installation Condition Report (EICR) completed across the property?',
    legislation: 'Electricity at Work Regulations 1989 / BS 7671 (18th Edition)',
    options: [
      {
        label: 'Satisfactory EICR certificate on file within the past 5 years with zero outstanding C1/C2 codes.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'Fixed wiring meets BS 7671 safety standards with full distribution board testing on record.',
        action: 'Schedule next 5-yearly periodic inspection (or 20% annual rolling programme).',
        priority: 'Compliant',
      },
      {
        label: 'EICR was completed within 5 years, but reported C2 (Potentially Dangerous) observations remain unrectified.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Open C2 electrical observations expose building to potential fire or electric shock.',
        action: 'Commission NICEIC electrical contractor to quote and rectify all C2 items for clean certification.',
        priority: 'High',
      },
      {
        label: 'EICR expired (>5 years), report is "Unsatisfactory" with open C1 codes, or records are missing.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Operating fixed wiring under an Unsatisfactory EICR directly breaches EAWR 1989 Regulation 4.',
        action: 'Commission urgent full-building EICR inspection and isolate any immediate Danger (C1) circuits.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-gas',
    regimeKey: 'GAS_SAFETY',
    title: 'Commercial Gas Safety (CP15/CP17/CP42)',
    category: 'Mechanical & Heating',
    question: 'What is the certification status of non-domestic gas boilers, water heaters, and pipework?',
    legislation: 'Gas Safety (Installation and Use) Regulations 1998 (GSIUR)',
    options: [
      {
        label: 'Annual Gas Safe non-domestic inspection certificate (CP15/CP17) current within last 12 months.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'Commercial gas appliance flue gas analysis, safety interlocks, and soundness tests certified.',
        action: 'Keep automated annual gas service renewal scheduled 30 days ahead of expiry.',
        priority: 'Compliant',
      },
      {
        label: 'Boilers serviced for efficiency, but formal Gas Safe commercial compliance certificate is missing.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Operational maintenance done without formal CP15/CP17 statutory documentation.',
        action: 'Ensure next maintenance visit includes full Gas Safe commercial certification sign-off.',
        priority: 'Medium',
      },
      {
        label: 'Commercial gas certificate expired (>12 months ago) or gas appliances unmaintained.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Uncertified commercial gas installations breach GSIUR Reg 35 and carry explosion/CO poisoning risk.',
        action: 'Book immediate emergency Gas Safe commercial engineer inspection and tightness testing.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-legionella',
    regimeKey: 'WATER_LEGIONELLA',
    title: 'Water Hygiene & Legionella Control',
    category: 'Water Hygiene & Public Health',
    question: 'Do you have a current Legionella Risk Assessment (LRA) and logged monthly temperature checks?',
    legislation: 'ACOP L8 / Health and Safety at Work etc. Act 1974 / COSHH 2002',
    options: [
      {
        label: 'Valid LRA within 2 years; monthly sentinel temp checks and regular flushing logged in CAFM.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'ACOP L8 written scheme of control active with compliant temperature monitoring.',
        action: 'Maintain routine monthly sentinel logging and annual cold storage tank inspections.',
        priority: 'Compliant',
      },
      {
        label: 'Legionella Risk Assessment is on file, but monthly sentinel water temperatures are not consistently taken.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Incomplete temperature records create evidentiary gap if biological contamination occurs.',
        action: 'Reinstate disciplined monthly sentinel temperature logging (Hot >50°C, Cold <20°C).',
        priority: 'High',
      },
      {
        label: 'No Legionella Risk Assessment exists, or water tanks are uninspected and dead legs unmanaged.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Lack of Legionella management constitutes severe HSE enforcement risk under ACOP L8.',
        action: 'Commission immediate commercial Legionella Risk Assessment and microbiological sampling.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-loler',
    regimeKey: 'LIFTING_LOLER',
    title: 'Lifting Equipment & Passenger Lifts (LOLER)',
    category: 'Vertical Transport & Height',
    question: 'Are passenger/goods lifts and BMUs subject to 6-monthly independent thorough examinations?',
    legislation: 'Lifting Operations and Lifting Equipment Regulations 1998 (LOLER)',
    options: [
      {
        label: '6-monthly independent Competent Person examination certificates current with zero open Section A defects.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'LOLER Thorough Examination reports on file alongside routine monthly maintenance contracts.',
        action: 'Continue coordinating independent insurance surveyor visits every 6 months.',
        priority: 'Compliant',
      },
      {
        label: 'Examinations completed, but Section B remedial defect notices remain uncompleted by lift contractor.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Open Section B defects indicate deferred maintenance that may escalate to dangerous conditions.',
        action: 'Instruct lift maintenance provider to rectify and certify all outstanding examination defects.',
        priority: 'High',
      },
      {
        label: 'Lifts or BMUs have overdue examination reports, or open Section A (Immediate Danger) notices exist.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Operating lifting equipment without current LOLER certification is illegal under UK health & safety law.',
        action: 'Remove lift from service immediately until competent surveyor inspection and repair are complete.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-fall-arrest',
    regimeKey: 'WORKING_AT_HEIGHT',
    title: 'Roof Fall Arrest & Mansafe Systems',
    category: 'Vertical Transport & Height',
    question: 'Have roof safety wire lines, eyebolts, and edge guardrails received annual pull testing?',
    legislation: 'Work at Height Regulations 2005 / BS EN 795',
    options: [
      {
        label: 'Annual certification and pull-testing completed within 12 months with tags/register up to date.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'Fall protection anchors certified for contractor roof access and gutter/plant maintenance.',
        action: 'Ensure annual re-certification date is calendared before contractor high-level access.',
        priority: 'Compliant',
      },
      {
        label: 'System is installed and looks intact, but annual proof-load / re-test certificate has lapsed.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Uncertified fall arrest cables cannot legally be used for roof work restraint or arrest.',
        action: 'Schedule specialist fall-protection testing company for annual re-certification.',
        priority: 'High',
      },
      {
        label: 'No fall arrest certification, or contractors access unprotected roof edges without permit-to-work.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Uncontrolled roof access without tested arrest systems exposes duty holders to corporate manslaughter risk.',
        action: 'Lock off roof access points immediately; install compliant demarcation or certified Mansafe systems.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-asbestos',
    regimeKey: 'ASBESTOS_CAR',
    title: 'Asbestos Management & Re-Inspection',
    category: 'Hazardous Materials & Fabric',
    question: 'If building was constructed prior to 2000, do you have an active Asbestos Management Plan?',
    legislation: 'Control of Asbestos Regulations 2012 (CAR 2012)',
    options: [
      {
        label: 'Management Asbestos Survey on site; annual condition re-inspections logged; register signed by contractors.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'Compliant Duty to Manage Asbestos under CAR 2012 Reg 4 with contractor sign-in controls.',
        action: 'Maintain annual visual condition inspection of identified ACMs.',
        priority: 'Compliant',
      },
      {
        label: 'Asbestos register exists, but annual re-inspection is overdue or not shown to visiting contractors.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Failure to inform contractors of ACM locations breaches CAR 2012 and creates liability.',
        action: 'Implement mandatory contractor asbestos register sign-in procedure and book re-inspection.',
        priority: 'High',
      },
      {
        label: 'Pre-2000 building with no Asbestos Management Survey, or damaged ACMs reported without encapsulation.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Operating a pre-2000 building without an Asbestos Register is a direct statutory offence.',
        action: 'Commission an immediate UKAS-accredited Management Asbestos Survey across all accessible areas.',
        priority: 'Immediate',
      },
    ],
  },
];

const WIZARD_STEPS = [
  { id: 1, title: '01 Audit', subtitle: '10 Statutory Regimes' },
  { id: 2, title: '02 Results', subtitle: 'Risk Band & Remedial Plan' },
];

export function TemplateComplianceChecker({ route, content }: TemplateProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [siteName, setSiteName] = useState('Apex Plaza HQ');
  const [organisationName, setOrganisationName] = useState('Acme Commercial Estates');
  const [answers, setAnswers] = useState<Record<string, number>>({
    'comp-fire-ra': 2,
    'comp-fire-alarm': 2,
    'comp-emerg-light': 1,
    'comp-fire-doors': 1,
    'comp-eicr': 2,
    'comp-gas': 2,
    'comp-legionella': 1,
    'comp-loler': 2,
    'comp-fall-arrest': 1,
    'comp-asbestos': 2,
  });

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Interactive Tools', url: '/tools' },
    { name: 'Compliance Checker', url: '/tools/compliance-checker' },
  ];

  const totalQuestions = COMPLIANCE_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Calculate results
  const results = useMemo(() => {
    let earnedPoints = 0;
    const maxPoints = totalQuestions * 2;

    const criticalFindings: Array<{ title: string; legislation: string; finding: string; action: string }> = [];
    const actionRequiredFindings: Array<{ title: string; legislation: string; finding: string; action: string }> = [];
    const compliantFindings: Array<{ title: string; legislation: string; finding: string }> = [];

    COMPLIANCE_QUESTIONS.forEach((q) => {
      const selectedOptIdx = answers[q.id];
      if (selectedOptIdx !== undefined) {
        const opt = q.options[selectedOptIdx];
        earnedPoints += opt.points;

        if (opt.status === 'CRITICAL_GAP') {
          criticalFindings.push({
            title: q.title,
            legislation: q.legislation,
            finding: opt.finding,
            action: opt.action,
          });
        } else if (opt.status === 'ACTION_REQUIRED') {
          actionRequiredFindings.push({
            title: q.title,
            legislation: q.legislation,
            finding: opt.finding,
            action: opt.action,
          });
        } else {
          compliantFindings.push({
            title: q.title,
            legislation: q.legislation,
            finding: opt.finding,
          });
        }
      }
    });

    const scoreOutOf100 = Math.round((earnedPoints / maxPoints) * 100);

    let riskBandLabel = 'Robust Statutory Assurance';
    let riskDescription = 'Your estate exhibits strong compliance control with up-to-date statutory certification and recorded servicing routines across core building systems.';
    let riskColor = 'text-emerald-400 bg-emerald-950/30 border-emerald-800/40';

    if (criticalFindings.length > 0 || scoreOutOf100 < 50) {
      riskBandLabel = 'Critical Statutory Liability & Enforcement Risk';
      riskDescription = 'Urgent compliance gaps identified across key life-safety or statutory systems. These represent potential criminal liabilities under UK law and may invalidate building insurance.';
      riskColor = 'text-rose-400 bg-rose-950/30 border-rose-800/40';
    } else if (actionRequiredFindings.length > 0 || scoreOutOf100 < 80) {
      riskBandLabel = 'Moderate Assurance · Remedial Actions Required';
      riskDescription = 'Core maintenance is occurring, but open remedial defects, incomplete logbooks, or overdue testing create compliance vulnerabilities requiring corrective action.';
      riskColor = 'text-amber-400 bg-amber-950/30 border-amber-800/40';
    }

    return {
      scoreOutOf100,
      earnedPoints,
      maxPoints,
      riskBandLabel,
      riskDescription,
      riskColor,
      criticalFindings,
      actionRequiredFindings,
      compliantFindings,
    };
  }, [answers, totalQuestions]);

  const handleDownloadPdf = () => {
    const pdfDoc: PdfDocumentDefinition = {
      title: 'Commercial FM Statutory Compliance Review',
      subtitle: `Screening audit across 10 UK regulatory regimes and statutory standards.`,
      documentRef: `EFM-CMP-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      siteName,
      organisationName,
      badgeText: 'Statutory Screening Audit',
      summaryStats: [
        { label: 'Compliance Score', value: `${results.scoreOutOf100} / 100` },
        { label: 'Risk Band', value: results.riskBandLabel },
        { label: 'Critical Gaps', value: `${results.criticalFindings.length} Regimes`, detail: 'Immediate Legal Risk' },
        { label: 'Open Actions', value: `${results.actionRequiredFindings.length} Regimes`, detail: 'Remedial Work Needed' },
      ],
      sections: [
        {
          type: 'cards',
          heading: '1. Executive Compliance Position',
          items: [
            {
              title: results.riskBandLabel,
              subtitle: `Statutory Control Rating: ${results.scoreOutOf100}%`,
              body: results.riskDescription,
            },
          ],
        },
        {
          type: 'table',
          heading: '2. Priority Remedial Action Roadmap',
          columns: [
            { header: 'Statutory Regime', widthPercent: 24 },
            { header: 'Observed Compliance Finding', widthPercent: 38 },
            { header: 'Recommended Remedial Action', widthPercent: 38 },
          ],
          rows: [
            ...results.criticalFindings.map((f) => [
              `[CRITICAL] ${f.title}`,
              f.finding,
              f.action,
            ]),
            ...results.actionRequiredFindings.map((f) => [
              `[ACTION] ${f.title}`,
              f.finding,
              f.action,
            ]),
            ...results.compliantFindings.map((f) => [
              `[COMPLIANT] ${f.title}`,
              f.finding,
              'Routine maintenance and renewal schedule active.',
            ]),
          ],
        },
      ],
      disclaimerText: 'This compliance review is a digital screening and planning instrument designed to assist estate managers in identifying documentation and servicing exposures. It does not constitute a legally binding certificate or replace on-site statutory inspections by competent persons (such as NICEIC, Gas Safe, BAFE, or LOLER engineer surveyors).',
    };
    downloadPdfReport(pdfDoc);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Header />
      <main id="main" className="flex-grow pt-20">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="FM Compliance Checker"
          purpose="Screen your commercial building compliance across 10 statutory regimes and receive an instant risk assessment."
          timeEstimate="3–5 min"
          outputs={['PDF Audit Report']}
          icon={ShieldCheck}
        >
          {/* Stepper */}
          <WizardProgress
            steps={WIZARD_STEPS}
            currentStep={currentStep}
            onSelectStep={(idx) => setCurrentStep(idx)}
          />

          {/* ========================================================================= */}
          {/* STEP 0: QUESTIONNAIRE WIZARD */}
          {/* ========================================================================= */}
          {currentStep === 0 && (
            <div className="space-y-8 max-w-4xl mx-auto">
              {/* Site metadata bar */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm">
                <div className="grid sm:grid-cols-2 gap-4 w-full sm:w-auto flex-1">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Site / Property Name
                    </label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-[#FF3E9D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Managing Agent / Organisation
                    </label>
                    <input
                      type="text"
                      value={organisationName}
                      onChange={(e) => setOrganisationName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-[#FF3E9D]"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 text-right">
                  <div className="font-mono text-xs text-slate-400">
                    Questions Completed: <strong className="text-white">{answeredCount}/{totalQuestions}</strong>
                  </div>
                  <div className="w-36 h-2 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-[#FF3E9D] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Questionnaire Cards */}
              <div className="space-y-6">
                {COMPLIANCE_QUESTIONS.map((q, qIdx) => {
                  const selectedOptIdx = answers[q.id];

                  return (
                    <div
                      key={q.id}
                      className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-4 backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {q.category}
                            </span>
                            <span className="font-mono text-xs text-slate-500">
                              Question {qIdx + 1} of {totalQuestions}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-white">{q.title}</h3>
                          <p className="text-xs text-slate-400 font-mono">{q.legislation}</p>
                        </div>

                        {selectedOptIdx !== undefined && (
                          <span className="shrink-0 p-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm font-medium text-slate-200 leading-snug">
                        {q.question}
                      </p>

                      <div className="space-y-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedOptIdx === optIdx;

                          return (
                            <div
                              key={optIdx}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 text-left ${
                                isSelected
                                  ? 'border-[#FF3E9D]/80 bg-[#FF3E9D]/10 shadow-sm ring-1 ring-[#FF3E9D]/30'
                                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center border transition-all shrink-0 ${
                                  isSelected
                                    ? 'bg-[#FF3E9D] border-[#FF3E9D] text-white'
                                    : 'border-slate-700 bg-slate-900'
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                                  {opt.label}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Generate Actions */}
              <div className="sticky bottom-4 z-20 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold">
                    {answeredCount === totalQuestions ? 'All Questions Complete' : `${answeredCount}/${totalQuestions} Answered`}
                  </div>
                  <div className="text-xs text-slate-400">
                    Calculates statutory risk band, critical liabilities, and remedial action roadmap
                  </div>
                </div>

                <button
                  type="button"
                  disabled={answeredCount === 0}
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#FF3E9D] to-[#D91B7D] text-white font-bold text-xs shadow-lg hover:opacity-95 transition-all disabled:opacity-50"
                >
                  <span>Generate Compliance Report</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 1: RESULTS DASHBOARD & AUDIT REPORT */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-8 max-w-5xl mx-auto">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#FF3E9D] uppercase tracking-wider">
                      Statutory Compliance Review
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      {siteName} — Compliance Audit Report
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Client: <strong className="text-slate-200">{organisationName}</strong> · Evaluated Regimes: <strong className="text-slate-200">{answeredCount} statutory disciplines</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
                  >
                    ← Edit Answers
                  </button>
                </div>

                {/* Score and Risk Band Banner */}
                <div className={`p-6 rounded-2xl border ${results.riskColor} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
                  <div className="space-y-2 max-w-2xl">
                    <div className="font-mono text-xs font-bold uppercase tracking-wider">
                      Compliance Rating
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold">{results.riskBandLabel}</h3>
                    <p className="text-xs sm:text-sm leading-relaxed opacity-90">{results.riskDescription}</p>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/80 border border-slate-800 shadow-sm shrink-0 min-w-[130px]">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      {results.scoreOutOf100}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                      out of 100
                    </span>
                  </div>
                </div>

                {/* Findings Breakdown Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-rose-400 font-semibold">
                      Critical Gaps
                    </div>
                    <div className="text-2xl font-bold text-rose-400 mt-1 font-mono">
                      {results.criticalFindings.length} Regimes
                    </div>
                    <div className="text-[11px] text-rose-300/70 mt-0.5">Immediate legal exposure</div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
                      Action Required
                    </div>
                    <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">
                      {results.actionRequiredFindings.length} Regimes
                    </div>
                    <div className="text-[11px] text-amber-300/70 mt-0.5">Remedial work required</div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
                      Documented Control
                    </div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
                      {results.compliantFindings.length} Regimes
                    </div>
                    <div className="text-[11px] text-emerald-300/70 mt-0.5">Satisfactory evidence on file</div>
                  </div>
                </div>

                {/* Export Toolbar */}
                <ExportToolbar
                  toolName="FM Compliance Checker"
                  onDownloadPdf={handleDownloadPdf}
                  pdfLabel="Download PDF Compliance Review"
                />
              </div>

              {/* REMEDIAL ACTION SCHEDULE TABLE */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Prioritised Statutory Remedial Action Plan
                  </h3>
                  <p className="text-xs text-slate-400">
                    Recommended engineering interventions ordered by legal priority.
                  </p>
                </div>

                <div className="space-y-4">
                  {results.criticalFindings.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-rose-800/50 bg-rose-950/20 border-l-4 border-l-rose-500 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 mr-2 border border-rose-800/50">
                            Critical Priority
                          </span>
                          <span className="font-bold text-sm text-white">{f.title}</span>
                          <span className="text-xs text-slate-400 font-mono ml-2">({f.legislation})</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300"><strong>Finding:</strong> {f.finding}</p>
                      <p className="text-xs text-rose-300 font-medium"><strong>Remedial Action:</strong> {f.action}</p>
                    </div>
                  ))}

                  {results.actionRequiredFindings.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-amber-800/50 bg-amber-950/20 border-l-4 border-l-amber-500 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 mr-2 border border-amber-800/50">
                            Action Required
                          </span>
                          <span className="font-bold text-sm text-white">{f.title}</span>
                          <span className="text-xs text-slate-400 font-mono ml-2">({f.legislation})</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300"><strong>Finding:</strong> {f.finding}</p>
                      <p className="text-xs text-amber-300 font-medium"><strong>Remedial Action:</strong> {f.action}</p>
                    </div>
                  ))}

                  {results.compliantFindings.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-emerald-800/50 bg-emerald-950/20 border-l-4 border-l-emerald-500 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-800/50">
                          Documented
                        </span>
                        <span className="font-bold text-sm text-white">{f.title}</span>
                      </div>
                      <p className="text-xs text-slate-400">{f.finding}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversion CTA */}
              <ToolConversionCTA
                toolName="FM Compliance Checker"
                heading="Need an on-site statutory compliance audit &amp; remedial rectification?"
                subheading="EntireFM provides full statutory compliance audits, logbook consolidation, and remedial engineering works to ensure 100% audit-ready estates."
                primaryActionLabel="Request Statutory Compliance Review"
                primaryActionHref="/contact-us#enquiry"
              />
            </div>
          )}
        </ToolShell>
      </main>
      <Footer />
    </div>
  );
}
