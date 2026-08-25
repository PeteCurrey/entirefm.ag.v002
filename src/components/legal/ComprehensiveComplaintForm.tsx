'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Truck,
  CreditCard,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  Eye,
  Lock,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Building2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { ComplaintCategory } from '@/server/complaints';

interface CategoryOption {
  id: ComplaintCategory;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  subCategories: string[];
  badgeColor: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'SERVICE',
    label: 'Service & Maintenance Delivery',
    sublabel: 'Reactive FM, PPM schedules, helpdesk communication, or SLA response times',
    icon: Wrench,
    subCategories: [
      'PPM Schedule Delay or Missed Inspection',
      'Reactive Callout SLA Breach',
      'Helpdesk Communication / Unanswered Ticket',
      'Quality of General Maintenance Work',
      'Asset Availability / Outage Downtime',
      'Other Service Issue',
    ],
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'CONTRACTOR',
    label: 'Contractor & Operative Conduct',
    sublabel: 'Workmanship standards, on-site conduct, unannounced attendance, or trade competence',
    icon: Truck,
    subCategories: [
      'Operative Site Conduct or Etiquette',
      'Workmanship Standards or Incomplete Job',
      'Unannounced Attendance / No Prior Notice',
      'PPE or Safety Equipment Deficit',
      'Damaged Property or Untidy Site',
      'Other Contractor Matter',
    ],
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'BILLING',
    label: 'Billing, Invoicing & Rates',
    sublabel: 'Invoice discrepancies, unapproved variations, rate card rates, or payment disputes',
    icon: CreditCard,
    subCategories: [
      'Invoice Line Item Discrepancy',
      'Unapproved Variation or Budget Cap Exceeded',
      'Rate Card Misapplication',
      'Disputed Callout Charge',
      'Credit Note Request',
      'Other Commercial / Financial Query',
    ],
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'HEALTH_SAFETY',
    label: 'Health, Safety & Environmental Risk',
    sublabel: 'Site hazards, near-misses, asbestos management, RAMS, or working at height',
    icon: AlertTriangle,
    subCategories: [
      'Imminent Safety Hazard or Unsafe Asset',
      'Near-Miss Incident Report',
      'Asbestos Register / Management Concern',
      'RAMS / Permit-to-Work Deficit',
      'Working at Height or Electrical Risk',
      'Environmental / Hazardous Waste Spill',
      'Other H&S Concern',
    ],
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'DATA_PROTECTION',
    label: 'Data Protection & Privacy (UK GDPR)',
    sublabel: 'Subject Access Requests, marketing opt-outs, inaccurate records, or data security',
    icon: ShieldAlert,
    subCategories: [
      'Direct Marketing / Right to Object (Opt-out)',
      'Subject Access Request (SAR) Issue',
      'Right to Erasure / Deletion Request',
      'Inaccurate Data / Rectification',
      'Security / Data Breach Notification',
      'Other UK GDPR / DPA 2018 Matter',
    ],
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 'AI_GOVERNANCE',
    label: 'AI Recommendation / Automated Triage',
    sublabel: 'Request human review of AI-assisted job triage, contractor allocation, or quote matrix',
    icon: Cpu,
    subCategories: [
      'Request Human Review of AI-Assisted Triage',
      'Contest Automated Contractor Allocation',
      'Dispute AI-Generated Asset Classification',
      'Explainability / Algorithmic Transparency Request',
      'Other AI Governance Concern',
    ],
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    id: 'ACCESSIBILITY',
    label: 'Digital or Physical Accessibility',
    sublabel: 'Barriers on EntireFM web portals, electronic documents, or site access feedback',
    icon: Eye,
    subCategories: [
      'Website or Portal Navigation Barrier (WCAG)',
      'Alternative Document Format Request',
      'Screen Reader / Keyboard Accessibility Issue',
      'Site Access & Reasonable Adjustments Feedback',
      'Other Accessibility Concern',
    ],
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    id: 'WHISTLEBLOWING',
    label: 'Whistleblowing / Speak Up (Confidential)',
    sublabel: 'Suspected fraud, bribery, criminal conduct, deliberate concealment, or modern slavery',
    icon: Lock,
    subCategories: [
      'Suspected Bribery, Corruption or Kickbacks',
      'Financial Fraud or Dishonest Record Keeping',
      'Modern Slavery or Forced Labour Concern',
      'Deliberate Concealment of Safety / Environmental Hazard',
      'Other Serious Protected Disclosure',
    ],
    badgeColor: 'bg-slate-900 text-white border-slate-800',
  },
];

export function ComprehensiveComplaintForm() {
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory>('SERVICE');
  const [formData, setFormData] = useState({
    subCategory: '',
    fullName: '',
    email: '',
    phone: '',
    organisationName: '',
    relationship: 'Commercial Client Contact',
    siteAddress: '',
    externalReference: '',
    severity: 'MEDIUM',
    description: '',
    desiredResolution: '',
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    reference: string;
    responsibleTeam: string;
    receivedAt: string;
    notice: string;
    escalationRoute: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const currentCategoryConfig = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  const handleCategorySelect = (cat: ComplaintCategory) => {
    setSelectedCategory(cat);
    const catConfig = CATEGORIES.find((c) => c.id === cat);
    setFormData((prev) => ({
      ...prev,
      subCategory: catConfig?.subCategories[0] || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      setErrorMsg('Please acknowledge the declaration before submitting.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/legal/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          subCategory: formData.subCategory || currentCategoryConfig.subCategories[0],
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          organisationName: formData.organisationName,
          relationship: formData.relationship,
          siteAddress: formData.siteAddress,
          externalReference: formData.externalReference,
          severity: formData.severity,
          description: formData.description,
          desiredResolution: formData.desiredResolution,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit complaint.');
      }

      setSuccessData(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please email compliance@entirefm.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRef = () => {
    if (!successData?.reference) return;
    navigator.clipboard.writeText(successData.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (successData) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-10">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div className="space-y-4 w-full">
            <div>
              <span className="badge-gold">Complaint Registered</span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Case Successfully Logged & Routed
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed mt-1">
                {successData.notice}
              </p>
            </div>

            {/* Official Reference Box */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-300 bg-white p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Your Case Tracking Reference
                </p>
                <p className="text-xl font-mono font-semibold text-slate-900">
                  {successData.reference}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Allocated Department: <strong className="text-slate-800">{successData.responsibleTeam}</strong>
                </p>
              </div>
              <button
                onClick={copyRef}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy Reference'}
              </button>
            </div>

            {/* Investigation Progress Stepper */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Investigation Lifecycle:
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5">
                  <span className="font-bold text-emerald-800 block">1. Received</span>
                  <span className="text-[11px] text-emerald-700">Logged & Timestamped</span>
                </div>
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5">
                  <span className="font-bold text-slate-800 block">2. Acknowledged</span>
                  <span className="text-[11px] text-slate-500">Written Notice Sent</span>
                </div>
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5">
                  <span className="font-bold text-slate-800 block">3. Investigating</span>
                  <span className="text-[11px] text-slate-500">Root Cause & Evidence</span>
                </div>
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5">
                  <span className="font-bold text-slate-800 block">4. Resolution</span>
                  <span className="text-[11px] text-slate-500">Remedial Action Plan</span>
                </div>
              </div>
            </div>

            {/* Statutory Escalation Information */}
            <div className="rounded-xl bg-white/80 p-4 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">External Escalation Pathway:</p>
              <p>
                If you remain dissatisfied following our formal decision, you may escalate this matter to: <strong className="text-slate-900">{successData.escalationRoute}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errorMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Step 1: Category Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          1. Select the Nature of Your Concern *
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex flex-col text-left rounded-xl p-4 border transition-all duration-150 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                      Selected
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-900 leading-snug">{cat.label}</span>
                <span className="text-[11px] text-slate-500 mt-1 line-clamp-2">{cat.sublabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Specific Issue Sub-category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          2. Specific Topic / Sub-Category *
        </label>
        <select
          value={formData.subCategory || currentCategoryConfig.subCategories[0]}
          onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 shadow-xs focus:border-indigo-600 focus:outline-hidden"
        >
          {currentCategoryConfig.subCategories.map((sub, idx) => (
            <option key={idx} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      {/* Step 3: Contact & Organisation Information */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          3. Submitter & Contact Details *
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600">Full Name *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. David Morrison"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. d.morrison@estates.co.uk"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-600">Phone Number (Optional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. 07700 900456"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">Company / Organisation</label>
            <input
              type="text"
              value={formData.organisationName}
              onChange={(e) => setFormData({ ...formData, organisationName: e.target.value })}
              placeholder="e.g. Vanguard Logistics Ltd"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">Relationship *</label>
            <select
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
            >
              <option value="Commercial Client Contact">Commercial Client / Property Manager</option>
              <option value="Building Occupant / Tenant">Building Occupant / Tenant</option>
              <option value="Contractor / Supply Chain">Contractor / Supply Chain Partner</option>
              <option value="Employee / Field Engineer">EntireFM Employee / Field Engineer</option>
              <option value="Member of Public / Visitor">Visitor / Member of Public</option>
              <option value="Other">Other Interested Party</option>
            </select>
          </div>
        </div>
      </div>

      {/* Step 4: Site & Operational Reference Details */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          4. Site Location & Work Order Reference
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600">
              Site / Building Address (If applicable)
            </label>
            <input
              type="text"
              value={formData.siteAddress}
              onChange={(e) => setFormData({ ...formData, siteAddress: e.target.value })}
              placeholder="e.g. Apex Industrial Park, Unit 4, Leeds LS11"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">
              Reference # (Work Order, Invoice, Quote, Ticket)
            </label>
            <input
              type="text"
              value={formData.externalReference}
              onChange={(e) => setFormData({ ...formData, externalReference: e.target.value })}
              placeholder="e.g. WO-83921 or INV-4029"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600">Severity Assessment</label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { id: 'LOW', label: 'Low', desc: 'Minor administrative matter' },
              { id: 'MEDIUM', label: 'Medium', desc: 'Routine service or invoice query' },
              { id: 'HIGH', label: 'High', desc: 'Significant disruption / SLA breach' },
              { id: 'SAFETY_CRITICAL', label: 'Safety Critical', desc: 'Immediate risk to life / asset' },
            ].map((sev) => (
              <label
                key={sev.id}
                className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.severity === sev.id
                    ? 'border-indigo-600 bg-indigo-50/70 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="severity"
                  value={sev.id}
                  checked={formData.severity === sev.id}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="sr-only"
                />
                <span className="text-xs font-bold">{sev.label}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{sev.desc}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Step 5: Description & Desired Outcome */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          5. Particulars of Complaint & Desired Resolution *
        </label>

        <div>
          <label className="block text-xs font-medium text-slate-600">
            Detailed Description of What Happened *
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Please detail the sequence of events, specific dates/times, personnel involved, and operational impact."
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600">
            What Resolution or Outcome Are You Seeking? *
          </label>
          <input
            type="text"
            required
            value={formData.desiredResolution}
            onChange={(e) => setFormData({ ...formData, desiredResolution: e.target.value })}
            placeholder="e.g. Remedial engineering visit, invoice adjustment, callout fee waiver, replacement operative, root cause explanation."
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Step 6: Confidentiality & Declaration */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-600 space-y-1">
          <p className="flex items-center gap-1.5 font-bold text-slate-800">
            <Lock className="h-3.5 w-3.5 text-indigo-600" />
            Confidential Governance & Protected Processing
          </p>
          <p className="leading-relaxed">
            Your complaint will be investigated independently by the designated compliance department. Information submitted is treated with strict confidentiality and is never disclosed to unauthorized parties.
          </p>
        </div>

        <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span>
            I confirm that the details provided are accurate to the best of my knowledge and authorise EntireFM to process this information to investigate and resolve this matter.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
      >
        {isSubmitting ? (
          'Registering Complaint...'
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit Formal Complaint for Investigation
          </>
        )}
      </button>
    </form>
  );
}
