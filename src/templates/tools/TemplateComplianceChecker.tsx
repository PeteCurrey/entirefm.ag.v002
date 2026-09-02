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
        finding: 'Full BS 5839-1 testing compliance with zero overdue servicing intervals.',
        action: 'Maintain routine weekly testing and ensure contractor holds active BAFE SP203 accreditation.',
        priority: 'Compliant',
      },
      {
        label: 'Servicing takes place annually, but weekly call point tests are irregular or unlogged.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Missing weekly call point tests leave a gap in statutory fire logbook compliance.',
        action: 'Implement formal digital/physical weekly fire log and confirm 6-monthly engineering inspection schedule.',
        priority: 'Medium',
      },
      {
        label: 'No recorded servicing within the past 12 months or active system faults/disconnections.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Unmaintained fire detection systems represent life-safety danger and violate insurance terms.',
        action: 'Arrange emergency fire alarm service inspection and fault diagnosis immediately.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-emergency-lighting',
    regimeKey: 'EMERGENCY_LIGHTING',
    title: 'Emergency Lighting Inspection',
    category: 'Life Safety & Electrical',
    question: 'Are emergency lighting luminaires subjected to monthly flick tests and annual 3-hour discharge tests?',
    legislation: 'BS 5266-1 / RRO 2005 Article 14',
    options: [
      {
        label: 'Monthly key-switch flick tests and annual 3-hour battery discharge certified with logbook.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'Full compliance with BS 5266-1; battery autonomy verified across all exit routes.',
        action: 'Continue scheduled testing and replace degraded battery packs promptly.',
        priority: 'Compliant',
      },
      {
        label: 'Annual test completed, but monthly functional checks are inconsistent or luminaire failures unrectified.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Partial compliance; unrecorded monthly tests or outstanding luminaire battery defects.',
        action: 'Conduct full emergency lighting drop test, log all luminaires, and replace failed units.',
        priority: 'High',
      },
      {
        label: 'No recorded testing in over 12 months or known widespread luminaire battery failures.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Non-functional emergency lighting creates severe escape route hazard during power failure.',
        action: 'Commission an urgent 3-hour discharge audit and luminaire remedial rectification.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-eicr',
    regimeKey: 'FIXED_WIRE_EICR',
    title: 'Fixed Electrical Testing (EICR)',
    category: 'Electrical Safety',
    question: 'What is the certification date and defect status of your fixed wire installation?',
    legislation: 'Electricity at Work Regulations 1989 / BS 7671',
    options: [
      {
        label: 'Satisfactory EICR certificate on file within the statutory 5-year cycle with zero open C1/C2 defects.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'Fixed wiring certified satisfactory under BS 7671 (18th Edition Amendment 2).',
        action: 'Retain certification and plan next 5-yearly periodic inspection before expiry.',
        priority: 'Compliant',
      },
      {
        label: 'EICR was completed within 5 years, but C2 (Potentially Dangerous) observations remain open.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Open C2 defects render the installation officially "Unsatisfactory" under BS 7671.',
        action: 'Instruct NICEIC/ECA registered electrical contractor to rectify all open C1/C2 defects.',
        priority: 'High',
      },
      {
        label: 'EICR has expired (>5 years), no record exists, or active C1 (Danger Present) defects exist.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Expired EICR violates EAWR 1989 Reg 4 and creates fire and electric shock risk.',
        action: 'Commission full 100% fixed wire electrical inspection and condition report (EICR) immediately.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-pat',
    regimeKey: 'PORTABLE_APPLIANCES',
    title: 'Portable Appliance Testing (PAT)',
    category: 'Electrical Safety',
    question: 'Are portable plug-in electrical appliances inspected and tested in accordance with risk policy?',
    legislation: 'Electricity at Work Regulations 1989 / IET Code of Practice',
    options: [
      {
        label: 'Annual/risk-based PAT register active with pass labels and removal of failed equipment.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'Formal in-service inspection and testing register maintained across all plug-in assets.',
        action: 'Maintain periodic testing schedule based on equipment environment and duty cycle.',
        priority: 'Compliant',
      },
      {
        label: 'PAT testing carried out sporadically; unlabelled or unverified staff appliances present.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Informal equipment introduction introduces electrical risk and logbook gaps.',
        action: 'Execute estate-wide PAT audit and enforce strict policy on personal electrical appliances.',
        priority: 'Medium',
      },
      {
        label: 'No PAT testing performed across the site for over 24 months.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Unchecked portable equipment is a leading cause of commercial electrical fires.',
        action: 'Schedule comprehensive in-service electrical equipment testing (PAT) across all tenancies.',
        priority: 'High',
      },
    ],
  },
  {
    id: 'comp-gas-cp17',
    regimeKey: 'GAS_SAFETY',
    title: 'Commercial Gas & Boilers (CP17)',
    category: 'Mechanical & Gas',
    question: 'Are commercial gas appliances, flues, and pipework certified annually under Gas Safe CP17/CP12?',
    legislation: 'Gas Safety (Installation and Use) Regulations 1998 Reg 36',
    options: [
      {
        label: 'Annual CP17 Gas Safety Certificate valid (<12 months) by Gas Safe commercial engineer.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'All gas-fired plant serviced with flue combustion analysis and tightness testing logged.',
        action: 'Maintain annual servicing cycle and schedule next service 30 days before expiry.',
        priority: 'Compliant',
      },
      {
        label: 'Boilers serviced for efficiency, but formal Gas Safe CP17 safety record is missing.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Maintenance contractor performed servicing without issuing statutory CP17 certificate.',
        action: 'Instruct Gas Safe registered commercial engineer to issue formal CP17 inspection certificate.',
        priority: 'High',
      },
      {
        label: 'Gas appliances overdue annual inspection (>12 months) or warning notices present.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Direct criminal offence under Gas Safety Regs; risk of carbon monoxide poisoning and explosion.',
        action: 'Isolate uncertified gas appliances if unsafe and commission emergency Gas Safe inspection.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-legionella-lra',
    regimeKey: 'WATER_HYGIENE',
    title: 'Legionella & Water Hygiene (ACOP L8)',
    category: 'Water Hygiene',
    question: 'What is the status of your Legionella Risk Assessment (LRA) and monthly temperature monitoring?',
    legislation: 'HSE ACoP L8 / HSG274 / COSHH Regulations 2002',
    options: [
      {
        label: 'LRA current (<2 yrs) with digital/paper log of monthly sentinel temperatures and outlet flushing.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'Structured water safety management in full compliance with HSE ACoP L8 / HSG274.',
        action: 'Maintain monthly sentinel logging, quarterly showerhead cleans, and annual calorifier inspection.',
        priority: 'Compliant',
      },
      {
        label: 'LRA on file, but monthly temperature logs and outlet flushing are irregular or incomplete.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'LRA recommendations not systematically executed; monitoring logs have critical data gaps.',
        action: 'Implement rigorous digital temperature logging regime and close out open LRA remedial tasks.',
        priority: 'High',
      },
      {
        label: 'No valid Legionella Risk Assessment on file, or water systems completely unmonitored.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Absence of LRA is a primary breach of HSE guidelines and creates Legionnaires disease risk.',
        action: 'Commission an immediate commercial Legionella Risk Assessment (LRA) by a certified water hygienist.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-asbestos-car',
    regimeKey: 'ASBESTOS_CAR',
    title: 'Asbestos Management Plan (CAR 2012)',
    category: 'Health & Safety',
    question: 'If building is pre-2000, is an Asbestos Management Plan and Asbestos Register active on site?',
    legislation: 'Control of Asbestos Regulations 2012 (CAR 2012) Regulation 4',
    options: [
      {
        label: 'Building post-2000 OR Asbestos Register & Management Plan fully updated with annual re-inspections.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'Statutory duty to manage asbestos fulfilled with active contractor sign-in protocol.',
        action: 'Maintain annual condition monitoring for known ACMs and ensure contractors review register.',
        priority: 'Compliant',
      },
      {
        label: 'Asbestos survey exists (pre-2000 building), but annual condition re-inspection is overdue.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Condition of known Asbestos Containing Materials (ACMs) has not been verified within 12 months.',
        action: 'Commission competent asbestos surveyor to complete annual ACM re-inspection audit.',
        priority: 'High',
      },
      {
        label: 'Pre-2000 building with no Asbestos Register, or refurbishment works ongoing without R&D survey.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Major HSE enforcement liability; risk of asbestos fibre release and workforce contamination.',
        action: 'Commission immediate Management Asbestos Survey and establish site Asbestos Register.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-loler',
    regimeKey: 'LIFTING_EQUIPMENT_LOLER',
    title: 'Lifting Operations & Lifts (LOLER)',
    category: 'Vertical Transport',
    question: 'Are passenger/goods lifts and lifting accessories inspected 6-monthly under LOLER Thorough Examination?',
    legislation: 'LOLER 1998 Regulation 9 / PUWER 1998',
    options: [
      {
        label: 'Current LOLER Thorough Examination certificate on file (<6 months) with all defects closed out.',
        points: 2,
        status: 'COMPLIANT',
        finding: 'Statutory 6-monthly independent engineering inspection certified with zero open Category A defects.',
        action: 'Retain inspection reports for 2 years and ensure routine maintenance servicing continues.',
        priority: 'Compliant',
      },
      {
        label: 'Lift contractor maintains the lift, but formal independent LOLER Thorough Exam report is missing.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'Routine maintenance is active, but statutory insurance Thorough Examination is unverified.',
        action: 'Engage an independent engineering inspection body to conduct formal LOLER examination.',
        priority: 'High',
      },
      {
        label: 'LOLER inspection overdue (>6 months for passenger lift) or uncertified lifting plant in use.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Operating uncertified passenger lifting equipment represents immediate safety and legal liability.',
        action: 'Schedule emergency LOLER examination immediately; ground equipment if safety faults suspect.',
        priority: 'Immediate',
      },
    ],
  },
  {
    id: 'comp-fgas-tm44',
    regimeKey: 'AIR_CONDITIONING_FGAS',
    title: 'F-Gas & Air Conditioning (TM44)',
    category: 'HVAC & Environmental',
    question: 'Are refrigerant logbooks maintained and is a valid TM44 Air Conditioning Inspection lodged?',
    legislation: 'Fluorinated Greenhouse Gases Regs 2015 / EPB Regulations 2012 (TM44)',
    options: [
      {
        label: 'F-Gas refrigerant logbooks up to date AND valid TM44 energy certificate lodged (<5 yrs for >12kW).',
        points: 2,
        status: 'COMPLIANT',
        finding: 'F-Gas quota leak checks logged and statutory TM44 certificate registered on EPC portal.',
        action: 'Maintain annual leak checks (or 6-monthly if >50t CO2e) and plan next TM44 renewal.',
        priority: 'Compliant',
      },
      {
        label: 'F-Gas logbooks kept, but TM44 air conditioning inspection is expired (>5 years) or unlodged.',
        points: 1,
        status: 'ACTION_REQUIRED',
        finding: 'TM44 inspection non-compliance attracts statutory financial penalties from Trading Standards.',
        action: 'Commission an accredited Level 3/4 Air Conditioning Energy Assessor to lodge valid TM44 report.',
        priority: 'Medium',
      },
      {
        label: 'No F-Gas logs on site for refrigerant circuits and no TM44 inspection ever completed.',
        points: 0,
        status: 'CRITICAL_GAP',
        finding: 'Breach of environmental regulations and building efficiency mandates.',
        action: 'Compile equipment asset register with refrigerant charges and arrange TM44 survey.',
        priority: 'High',
      },
    ],
  },
];

const WIZARD_STEPS = [
  { id: 0, title: '01 Questionnaire', subtitle: '10 Statutory Disciplines' },
  { id: 1, title: '02 Audit Report', subtitle: 'Risk & Action Plan' },
];

export function TemplateComplianceChecker({ route, content }: TemplateProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [siteName, setSiteName] = useState('Commercial Estate');
  const [organisationName, setOrganisationName] = useState('Managing Agent / Duty Holder');
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Interactive Tools', url: '/tools' },
    { name: 'FM Compliance Checker', url: '/tools/compliance-checker' },
  ];

  const totalQuestions = COMPLIANCE_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  // Results computation (100% preserved)
  const results = useMemo(() => {
    let earnedPoints = 0;
    const maxPoints = totalQuestions * 2;

    const criticalFindings: { title: string; legislation: string; finding: string; action: string }[] = [];
    const actionRequiredFindings: { title: string; legislation: string; finding: string; action: string }[] = [];
    const compliantFindings: { title: string; legislation: string; finding: string }[] = [];

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
    let riskColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

    if (criticalFindings.length > 0 || scoreOutOf100 < 50) {
      riskBandLabel = 'Critical Statutory Liability & Enforcement Risk';
      riskDescription = 'Urgent compliance gaps identified across key life-safety or statutory systems. These represent potential criminal liabilities under UK law and may invalidate building insurance.';
      riskColor = 'text-rose-700 bg-rose-50 border-rose-200';
    } else if (actionRequiredFindings.length > 0 || scoreOutOf100 < 80) {
      riskBandLabel = 'Moderate Assurance · Remedial Actions Required';
      riskDescription = 'Core maintenance is occurring, but open remedial defects, incomplete logbooks, or overdue testing create compliance vulnerabilities requiring corrective action.';
      riskColor = 'text-amber-800 bg-amber-50 border-amber-200';
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <div className="flex-grow">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="FM Compliance Checker"
          purpose="Screen your commercial building compliance across 10 statutory regimes and receive an instant risk assessment and prioritised remedial action plan."
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
              <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto flex-1">
                  <div>
                    <label className="block text-[11px] font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                      Site / Property Name
                    </label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-sm bg-slate-50 border border-slate-300 text-xs font-normal text-slate-900 focus:bg-white focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                      Managing Agent / Organisation
                    </label>
                    <input
                      type="text"
                      value={organisationName}
                      onChange={(e) => setOrganisationName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-sm bg-slate-50 border border-slate-300 text-xs font-normal text-slate-900 focus:bg-white focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 text-right">
                  <div className="font-normal text-xs text-slate-600">
                    Questions Completed: <strong className="text-slate-900 font-light">{answeredCount}/{totalQuestions}</strong>
                  </div>
                  <div className="w-36 h-2 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-electric to-brand-violet transition-all duration-300"
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
                      className="bg-white border border-slate-200 rounded-sm p-6 sm:p-7 shadow-sm space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10.5px] font-normal uppercase tracking-wider px-2 py-0.5 rounded-sm bg-blue-50 text-brand-electric border border-blue-100">
                              {q.category}
                            </span>
                            <span className="font-normal text-xs text-slate-500">
                              Question {qIdx + 1} of {totalQuestions}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-light text-slate-900">{q.title}</h3>
                          <p className="text-xs text-slate-500 font-normal">{q.legislation}</p>
                        </div>

                        {selectedOptIdx !== undefined && (
                          <span className="shrink-0 p-1 rounded-full bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm font-normal text-slate-800 leading-snug">
                        {q.question}
                      </p>

                      <div className="space-y-2.5 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedOptIdx === optIdx;

                          return (
                            <div
                              key={optIdx}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`p-3.5 rounded-sm border transition-all cursor-pointer flex items-start gap-3 text-left ${
                                isSelected
                                  ? 'border-brand-electric bg-blue-50/70 shadow-2xs ring-1 ring-brand-electric'
                                  : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/70'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center border transition-all shrink-0 ${
                                  isSelected
                                    ? 'bg-brand-electric border-brand-electric text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className={`text-xs sm:text-sm font-normal leading-snug ${isSelected ? 'text-slate-900 font-light' : 'text-slate-700'}`}>
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
              <div className="sticky bottom-4 z-20 bg-[#0B1220] border border-slate-800 rounded-sm p-4 sm:p-5 text-white shadow-2xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-normal">
                    {answeredCount === totalQuestions ? 'All Questions Complete' : `${answeredCount}/${totalQuestions} Answered`}
                  </div>
                  <div className="text-xs text-slate-300">
                    Calculates statutory risk rating, critical exposures, and remedial roadmap
                  </div>
                </div>

                <button
                  type="button"
                  disabled={answeredCount === 0}
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-gradient-to-r from-brand-electric to-brand-violet text-white font-normal text-xs shadow-md hover:opacity-95 transition-all disabled:opacity-50"
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
              <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-xs font-normal text-brand-electric uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-100 inline-block mb-1">
                      Statutory Compliance Review
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 mt-1">
                      {siteName} — Compliance Audit Report
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Client: <strong className="text-slate-900">{organisationName}</strong> · Evaluated Regimes: <strong className="text-slate-900">{answeredCount} statutory disciplines</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="px-3.5 py-2 rounded-sm border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-normal transition-all"
                  >
                    ← Edit Questionnaire
                  </button>
                </div>

                {/* Score and Risk Band Banner */}
                <div className={`p-6 rounded-sm border ${results.riskColor} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
                  <div className="space-y-2 max-w-2xl">
                    <div className="text-xs font-normal uppercase tracking-wider">
                      Compliance Rating
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extralight">{results.riskBandLabel}</h3>
                    <p className="text-xs sm:text-sm leading-relaxed opacity-95">{results.riskDescription}</p>
                  </div>

                  <div className="flex flex-col items-center justify-center p-5 rounded-sm bg-white border border-slate-200 shadow-sm shrink-0 min-w-[130px]">
                    <span className="text-3xl sm:text-4xl font-light text-slate-900 tabular-nums">
                      {results.scoreOutOf100}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mt-0.5">
                      out of 100
                    </span>
                  </div>
                </div>

                {/* Findings Breakdown Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-sm bg-rose-50 border border-rose-200">
                    <div className="text-[10.5px] uppercase tracking-wider text-rose-700 font-normal">
                      Critical Gaps
                    </div>
                    <div className="text-2xl font-light text-rose-700 mt-1 tabular-nums">
                      {results.criticalFindings.length} Regimes
                    </div>
                    <div className="text-[11.5px] text-rose-800/80 mt-0.5 font-light">Immediate legal exposure</div>
                  </div>

                  <div className="p-4 rounded-sm bg-amber-50 border border-amber-200">
                    <div className="text-[10.5px] uppercase tracking-wider text-amber-800 font-normal">
                      Action Required
                    </div>
                    <div className="text-2xl font-light text-amber-800 mt-1 tabular-nums">
                      {results.actionRequiredFindings.length} Regimes
                    </div>
                    <div className="text-[11.5px] text-amber-900/80 mt-0.5 font-light">Remedial work required</div>
                  </div>

                  <div className="p-4 rounded-sm bg-emerald-50 border border-emerald-200">
                    <div className="text-[10.5px] uppercase tracking-wider text-emerald-700 font-normal">
                      Documented Control
                    </div>
                    <div className="text-2xl font-light text-emerald-700 mt-1 tabular-nums">
                      {results.compliantFindings.length} Regimes
                    </div>
                    <div className="text-[11.5px] text-emerald-800/80 mt-0.5 font-light">Satisfactory evidence on file</div>
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
              <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-light text-slate-900">
                    Prioritised Statutory Remedial Action Plan
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Recommended engineering interventions ordered by statutory urgency.
                  </p>
                </div>

                <div className="space-y-4">
                  {results.criticalFindings.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-sm border border-rose-200 bg-rose-50/60 border-l-4 border-l-rose-600 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-normal uppercase tracking-wider px-2 py-0.5 rounded-sm bg-rose-100 text-rose-800 mr-2 border border-rose-200">
                            Critical Priority
                          </span>
                          <span className="font-normal text-sm text-slate-900">{f.title}</span>
                          <span className="text-xs text-slate-500 font-normal ml-2">({f.legislation})</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700"><strong>Observed Finding:</strong> {f.finding}</p>
                      <p className="text-xs text-rose-800 font-normal"><strong>Remedial Action:</strong> {f.action}</p>
                    </div>
                  ))}

                  {results.actionRequiredFindings.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-sm border border-amber-200 bg-amber-50/60 border-l-4 border-l-amber-600 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-normal uppercase tracking-wider px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 mr-2 border border-amber-200">
                            Action Required
                          </span>
                          <span className="font-normal text-sm text-slate-900">{f.title}</span>
                          <span className="text-xs text-slate-500 font-normal ml-2">({f.legislation})</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700"><strong>Observed Finding:</strong> {f.finding}</p>
                      <p className="text-xs text-amber-900 font-normal"><strong>Remedial Action:</strong> {f.action}</p>
                    </div>
                  ))}

                  {results.compliantFindings.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-sm border border-emerald-200 bg-emerald-50/60 border-l-4 border-l-emerald-600 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-normal uppercase tracking-wider px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Documented Control
                        </span>
                        <span className="font-normal text-sm text-slate-900">{f.title}</span>
                      </div>
                      <p className="text-xs text-slate-600">{f.finding}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversion CTA */}
              <ToolConversionCTA
                toolName="FM Compliance Checker"
                heading="Need an on-site statutory compliance audit &amp; remedial rectification?"
                subheading="EntireFM provides full statutory compliance audits, logbook consolidation, and remedial engineering works to identify documentation gaps and verify duty-holder compliance."
                primaryActionLabel="Request Statutory Compliance Review"
                primaryActionHref="/contact-us#enquiry"
              />
            </div>
          )}
        </ToolShell>
      </div>
      <Footer />
    </div>
  );
}
