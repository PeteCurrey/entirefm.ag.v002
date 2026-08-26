'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  Award, 
  CheckCircle2, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Briefcase, 
  Truck, 
  Receipt, 
  Activity,
  ArrowRight,
  Clock
} from 'lucide-react';

interface LifecycleStep {
  num: string;
  phaseId: 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4';
  phaseName: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: React.ElementType;
  touchpoints: string[];
  expectedDuration: string;
  deliverable: string;
  actionLink?: { label: string; href: string };
}

const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    num: '01',
    phaseId: 'phase-1',
    phaseName: 'PHASE 1: REGISTRATION',
    title: 'Registration & Initial Profile',
    shortDesc: 'Submit company profile, trade disciplines, and geographic service areas.',
    fullDesc: 'The supplier registers primary company details, Companies House number, trade disciplines, and confirms insurance baseline readiness through our streamlined online portal.',
    icon: Building2,
    touchpoints: ['Online Application Form', 'Companies House API', 'Automated Credit Agency Score'],
    expectedDuration: '10–15 Minutes',
    deliverable: 'Supplier Account & Application Reference (SUP-YYMMDD-XXXX)',
    actionLink: { label: 'Start Registration', href: '/suppliers/apply' },
  },
  {
    num: '02',
    phaseId: 'phase-1',
    phaseName: 'PHASE 1: REGISTRATION',
    title: 'Risk-Based Assurance Plan',
    shortDesc: 'Our engine generates a tailored compliance checklist based on trade and risk.',
    fullDesc: 'Based on the requested engineering trades (e.g. Low Risk Fabric vs High Risk Gas/HVAC/Access), EntireFM automatically configures the mandatory evidence checklist required for your specific scope.',
    icon: ShieldCheck,
    touchpoints: ['Automated Risk Classification Engine', 'Trade Rule Matrix v3.0'],
    expectedDuration: 'Instant (Automated Configuration)',
    deliverable: 'Customized Document Vault Checklist',
  },
  {
    num: '03',
    phaseId: 'phase-1',
    phaseName: 'PHASE 1: REGISTRATION',
    title: 'Evidence & Document Upload',
    shortDesc: 'Upload insurance schedules, trade accreditations, and H&S policies to the vault.',
    fullDesc: 'The applicant uploads public liability schedules, employers liability, trade certificates (Gas Safe, REFCOM, NICEIC), and health & safety policy statements directly to the secure portal vault.',
    icon: FileText,
    touchpoints: ['Secure Supplier Document Vault', 'Broker Schedule Validation'],
    expectedDuration: 'Self-Paced (Typically 1–2 Days)',
    deliverable: 'Completed Evidence Portfolio in Vault',
    actionLink: { label: 'Review Required Documents', href: '/suppliers/compliance' },
  },
  {
    num: '04',
    phaseId: 'phase-2',
    phaseName: 'PHASE 2: ASSURANCE',
    title: 'Technical Competency Review',
    shortDesc: 'Specialist desks review Gas Safe, F-Gas, NICEIC, and safe working RAMS.',
    fullDesc: 'Dedicated EntireFM Technical Discipline Managers evaluate uploaded statutory licences, verify validity on governing body registers, and review sample RAMS for technical rigor.',
    icon: Award,
    touchpoints: ['Technical Desk Review', 'Governing Body Live Registers (Gas Safe, REFCOM)'],
    expectedDuration: '1–2 Business Days',
    deliverable: 'Technical Competency Assessment Sign-off',
    actionLink: { label: 'Vetting Methodology', href: '/suppliers/vetting' },
  },
  {
    num: '05',
    phaseId: 'phase-2',
    phaseName: 'PHASE 2: ASSURANCE',
    title: 'Scoped Approval Decision',
    shortDesc: 'Approval is granted for specific disciplines and confirmed operating regions.',
    fullDesc: 'EntireFM issues formal approval with strict geographic and service boundaries (e.g. Approved for Commercial HVAC in Greater Manchester; Electrical restricted to Low Voltage).',
    icon: CheckCircle2,
    touchpoints: ['Scoped Authority Matrix', 'CAFM Dispatch Boundary Engine'],
    expectedDuration: 'Same Day as Technical Review',
    deliverable: 'Formal Scoped Approval Certificate',
  },
  {
    num: '06',
    phaseId: 'phase-2',
    phaseName: 'PHASE 2: ASSURANCE',
    title: 'Digital Agreement & Code of Conduct',
    shortDesc: 'Sign framework terms and execute the Supplier Code of Conduct.',
    fullDesc: 'The supplier director executes the master supply chain framework agreement, anti-bribery declarations, modern slavery commitments, and data confidentiality covenants via electronic signature.',
    icon: Lock,
    touchpoints: ['Digital Contract Sign-Off', 'Supplier Ethics Charter'],
    expectedDuration: '10 Minutes (Digital Signature)',
    deliverable: 'Executed Framework Agreement',
    actionLink: { label: 'Supplier Standards', href: '/suppliers/standards' },
  },
  {
    num: '07',
    phaseId: 'phase-3',
    phaseName: 'PHASE 3: ACTIVATION',
    title: 'Dual-Control Bank Verification',
    shortDesc: 'Submit masked bank remittance details with independent phone verification.',
    fullDesc: 'To prevent payment fraud and mandate hijacking, EntireFM finance conducts an independent verbal phone verification with the supplier financial controller before activating bank details.',
    icon: CreditCard,
    touchpoints: ['Dual-Officer Voice Verification', 'Masked Bank Remittance Database'],
    expectedDuration: '1 Business Day',
    deliverable: 'Verified Banking Mandate in Secure ERP',
  },
  {
    num: '08',
    phaseId: 'phase-3',
    phaseName: 'PHASE 3: ACTIVATION',
    title: 'Supplier Portal Activation',
    shortDesc: 'Access the Supplier Portal for jobs, document tracking, and action items.',
    fullDesc: 'Full administrative credentials issued for the EntireFM Supplier Portal. The dispatch desk can manage engineers, view active opportunities, and track compliance status 24/7.',
    icon: Smartphone,
    touchpoints: ['Supplier Portal Dashboard', 'Multi-User Team Provisioning'],
    expectedDuration: 'Instant upon Banking Verification',
    deliverable: 'Live Portal Credentials & Dispatch Roster Inclusion',
  },
  {
    num: '09',
    phaseId: 'phase-3',
    phaseName: 'PHASE 3: ACTIVATION',
    title: 'Work Allocation & Opportunities',
    shortDesc: 'Receive relevant work opportunities matched to your approved scope.',
    fullDesc: 'Reactive work orders and scheduled maintenance visit packages matching your approved trade disciplines and postcode territories are dispatched directly to your desk.',
    icon: Briefcase,
    touchpoints: ['EntireCAFM Automated Dispatch Feed', 'SLA Allocation Engine'],
    expectedDuration: 'Ongoing Continuous Allocation',
    deliverable: 'Issued Work Orders with Pre-Authorised Limits',
    actionLink: { label: 'Partner Opportunities', href: '/suppliers/partner-with-entirefm' },
  },
  {
    num: '10',
    phaseId: 'phase-4',
    phaseName: 'PHASE 4: DELIVERY & GOVERNANCE',
    title: 'Mobilisation & Safe Delivery',
    shortDesc: 'Acknowledge dispatch, assign engineers, and execute safe site delivery.',
    fullDesc: 'Your engineer receives the digital job sheet on their smartphone, checks in on site, confirms dynamic site RAMS, and completes the technical maintenance or repair works.',
    icon: Truck,
    touchpoints: ['Engineer Mobile Web App', 'Digital Permit-to-Work', 'On-Site Sign-In'],
    expectedDuration: 'Per Contract SLA (2hr / 4hr / Planned)',
    deliverable: 'Completed Works with Verified RAMS',
  },
  {
    num: '11',
    phaseId: 'phase-4',
    phaseName: 'PHASE 4: DELIVERY & GOVERNANCE',
    title: 'Evidence Submission & Invoicing',
    shortDesc: 'Upload digital service sheets with photos; submit invoices against authorized POs.',
    fullDesc: 'Engineer captures before/after photographs and digital client signature. Invoice is submitted electronically quoting the PO number for automated matching and prompt payment.',
    icon: Receipt,
    touchpoints: ['EntireCAFM Photo Vault', 'Automated PO Matching & BACS Remittance'],
    expectedDuration: 'Same-Day Digital Sign-Off',
    deliverable: 'Automated Invoice Clearance & BACS Payment',
  },
  {
    num: '12',
    phaseId: 'phase-4',
    phaseName: 'PHASE 4: DELIVERY & GOVERNANCE',
    title: 'Ongoing Compliance & Radar',
    shortDesc: 'Automated 90/60/30-day reminders ensure continuous accreditation validity.',
    fullDesc: 'Our compliance radar continuously monitors your insurance and certification expiry dates, issuing proactive reminders to ensure uninterrupted dispatch clearance and tier growth.',
    icon: Activity,
    touchpoints: ['Dynamic Compliance Radar', 'Quarterly SLA Performance Index'],
    expectedDuration: 'Continuous Real-Time Tracking',
    deliverable: 'Preferred Partner Tier Progression',
  },
];

export function OperationalLifecycleEngine() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const selected = LIFECYCLE_STEPS[activeStepIndex];
  const Icon = selected.icon;

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-14">
          <span className="eyebrow eyebrow-light">THE 12-STEP OPERATIONAL LIFECYCLE</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            How Work Is Governed, Dispatched &amp; Delivered
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Click through our 12 operational stages to explore the exact technical checkpoints, digital touchpoints, and expected turnaround times from initial registration to live service delivery.
          </p>
        </div>

        {/* 12-Step Horizontal Progress Rail */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2 mb-8">
          {LIFECYCLE_STEPS.map((step, idx) => {
            const isSelected = idx === activeStepIndex;
            return (
              <button
                key={idx}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-3 rounded-sm border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-pink bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-[#FAF9FB] text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-extralight ${isSelected ? 'text-brand-pink' : 'text-slate-400'}`}>
                    {step.num}
                  </span>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-brand-pink" />}
                </div>
                <h4 className="text-[11.5px] font-light mt-1 line-clamp-1 leading-tight">{step.title.split(' ')[0]}</h4>
              </button>
            );
          })}
        </div>

        {/* Selected Step Deep Dive Deck */}
        <div className="rounded-sm border border-slate-200 bg-[#FAF9FB] p-8 lg:p-12 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                <Icon className="h-6 w-6 text-brand-pink" />
              </div>
              <div>
                <span className="text-[10px] font-normal uppercase tracking-wider text-brand-pink font-semibold">
                  STEP {selected.num} // {selected.phaseName}
                </span>
                <h3 className="text-2xl font-light text-slate-900 mt-0.5">{selected.title}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-light text-slate-600">Expected Timeframe:</span>
              <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 text-[11px] font-medium rounded-sm">
                {selected.expectedDuration}
              </span>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-700 font-light leading-relaxed max-w-4xl">
            {selected.fullDesc}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 pt-8 border-t border-slate-200">
            {/* Touchpoints & Systems */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block">
                DIGITAL TOUCHPOINTS &amp; GOVERNANCE SYSTEMS
              </span>
              <ul className="space-y-2">
                {selected.touchpoints.map((tp, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs sm:text-[12.5px] text-slate-700 font-light bg-white p-3 rounded-sm border border-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-brand-pink shrink-0" />
                    <span>{tp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Deliverable & Actions */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 rounded-sm border border-slate-200 space-y-2">
                <span className="text-[10.5px] font-normal uppercase tracking-wider text-emerald-700 block font-medium">
                  STEP OUTCOME &amp; DELIVERABLE
                </span>
                <p className="text-xs text-slate-900 font-light leading-relaxed">
                  {selected.deliverable}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                {selected.actionLink ? (
                  <Link href={selected.actionLink.href} className="btn-primary w-full justify-center text-xs py-3">
                    {selected.actionLink.label} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <Link href="/suppliers/apply" className="btn-primary w-full justify-center text-xs py-3">
                    Start Stage 1 Application <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
