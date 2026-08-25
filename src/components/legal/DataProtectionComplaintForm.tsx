'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertCircle, Send, FileText, Lock, Copy, Check } from 'lucide-react';
import { LEGAL_CONFIG } from '@/config/legal';

export function DataProtectionComplaintForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organisationName: '',
    relationship: 'Prospective Client / B2B Contact',
    complaintType: 'Direct Marketing / Right to Object (Opt-out)',
    incidentDate: '',
    referenceNumber: '',
    description: '',
    desiredOutcome: 'Cessation of direct marketing & entry on suppression register',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    reference: string;
    receivedAt: string;
    acknowledgementNotice: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/legal/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit complaint.');
      }

      setSuccessData(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again or email privacy@entirefm.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReference = () => {
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
          <div className="space-y-3">
            <h3 className="text-xl font-light text-slate-900">
              Data Protection Complaint Formally Registered
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {successData.acknowledgementNotice}
            </p>

            {/* Reference Badge */}
            <div className="my-4 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-300/80 bg-white p-4">
              <div>
                <p className="text-xs font-normal uppercase tracking-wider text-slate-500">
                  Your Official Complaint Reference
                </p>
                <p className="text-lg font-mono font-light text-slate-900">
                  {successData.reference}
                </p>
              </div>
              <button
                onClick={copyReference}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-normal text-slate-700 transition-colors hover:bg-slate-100"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy Reference'}
              </button>
            </div>

            {/* Statutory Next Steps */}
            <div className="space-y-2 rounded-xl bg-white/70 p-4 text-xs text-slate-600">
              <p className="font-light text-slate-800">What happens next?</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Our Data Protection Officer will review your submission and initiate an investigation.</li>
                <li>You will receive a formal written acknowledgement to <strong className="text-slate-900">{formData.email}</strong> within statutory timelines (UK GDPR Article 12(3)).</li>
                <li>If your complaint relates to direct marketing opt-out, your details have been immediately marked for suppression across all outreach channels.</li>
                <li>If you require further information in the interim, contact <a href={`mailto:${LEGAL_CONFIG.dataProtectionOfficer.email}`} className="text-indigo-600 underline font-light">{LEGAL_CONFIG.dataProtectionOfficer.email}</a> quoting your reference.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Sarah Jenkins"
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        <div>
          <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. s.jenkins@company.co.uk"
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. 07700 900123"
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        <div>
          <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider">
            Company / Organisation (If applicable)
          </label>
          <input
            type="text"
            value={formData.organisationName}
            onChange={(e) => setFormData({ ...formData, organisationName: e.target.value })}
            placeholder="e.g. Acme Commercial Estates Ltd"
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider">
            Relationship with EntireFM *
          </label>
          <select
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
          >
            <option value="Prospective Client / B2B Contact">Prospective Client / B2B Marketing Contact</option>
            <option value="Client Personnel / Property Manager">Client Personnel / Property Manager</option>
            <option value="Building Occupant / Service User">Building Occupant / Service Request Submitter</option>
            <option value="Contractor / Subcontractor">Contractor / Subcontractor Personnel</option>
            <option value="Supplier">Supplier / Trade Partner</option>
            <option value="Job Applicant">Job Applicant / Candidate</option>
            <option value="Website Visitor">Website Visitor</option>
            <option value="Other">Other Interested Party</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider">
            Nature of Data Protection Complaint *
          </label>
          <select
            value={formData.complaintType}
            onChange={(e) => setFormData({ ...formData, complaintType: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
          >
            <option value="Direct Marketing / Right to Object (Opt-out)">Direct Marketing / Right to Object (Opt-out Request)</option>
            <option value="Subject Access Request (SAR) Issue">Subject Access Request (SAR) Delay or Scope Issue</option>
            <option value="Right to Erasure (Deletion Request)">Right to Erasure (Deletion Request)</option>
            <option value="Inaccurate / Outdated Personal Data">Inaccurate / Outdated Personal Data (Rectification)</option>
            <option value="Unlawful Processing / Lack of Lawful Basis">Unlawful Processing / Lack of Lawful Basis</option>
            <option value="Security / Data Breach Concern">Security / Data Breach Concern</option>
            <option value="AI / Automated Decision Making Objection">AI / Automated Decision-Making Objection</option>
            <option value="Other Data Protection Matter">Other Data Protection Matter</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider">
            Relevant Date / First Occurrence
          </label>
          <input
            type="date"
            value={formData.incidentDate}
            onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        <div>
          <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider">
            Associated Reference / Work Order / Quote (If known)
          </label>
          <input
            type="text"
            value={formData.referenceNumber}
            onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
            placeholder="e.g. WO-84920 or Quote Q-1029"
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider">
          Detailed Description of the Complaint *
        </label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Please provide full particulars of the matter, including any communication received, email subjects, dates, or specific personal data involved."
          className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-900 shadow-xs focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
        />
      </div>

      <div>
        <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider">
          Desired Resolution / Outcome *
        </label>
        <input
          type="text"
          required
          value={formData.desiredOutcome}
          onChange={(e) => setFormData({ ...formData, desiredOutcome: e.target.value })}
          placeholder="e.g. Immediate suppression from all marketing lists, rectification of contact record, full SAR disclosure."
          className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
        />
      </div>

      <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
        <p className="flex items-center gap-1.5 font-light text-slate-700">
          <Lock className="h-3.5 w-3.5 text-indigo-600" />
          Confidentiality & Statutory Governance
        </p>
        <p className="mt-1 leading-relaxed">
          Information provided on this form is processed solely by the EntireFM Data Protection team to investigate and resolve your complaint under UK GDPR Article 12 and Data Protection Act 2018. It is never used for commercial or marketing purposes.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-normal text-white shadow-sm transition-all hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
      >
        {isSubmitting ? (
          'Submitting Complaint...'
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit Formal Data Protection Complaint
          </>
        )}
      </button>
    </form>
  );
}
