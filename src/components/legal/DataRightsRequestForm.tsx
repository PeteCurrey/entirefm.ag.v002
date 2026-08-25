'use client';

import React, { useState } from 'react';
import type { DataSubjectRightType } from '@/server/data-rights';

interface DataRightsFormState {
  right_type: DataSubjectRightType;
  full_name: string;
  email: string;
  phone: string;
  relationship: string;
  organisation_name: string;
  request_details: string;
  specific_data_scope: string;
  id_confirmation: boolean;
}

const INITIAL_STATE: DataRightsFormState = {
  right_type: 'ACCESS',
  full_name: '',
  email: '',
  phone: '',
  relationship: 'CLIENT_CONTACT',
  organisation_name: '',
  request_details: '',
  specific_data_scope: '',
  id_confirmation: false,
};

const RIGHT_TYPE_OPTIONS: Array<{
  value: DataSubjectRightType;
  label: string;
  ukGdprArticle: string;
  desc: string;
}> = [
  {
    value: 'ACCESS',
    label: 'Right of Access / Subject Access Request (SAR)',
    ukGdprArticle: 'Article 15',
    desc: 'Request a copy of the personal data EntireFM holds about you and details on how it is processed.',
  },
  {
    value: 'RECTIFICATION',
    label: 'Right to Rectification',
    ukGdprArticle: 'Article 16',
    desc: 'Request correction of inaccurate personal data or completion of incomplete records.',
  },
  {
    value: 'ERASURE',
    label: 'Right to Erasure (Right to be Forgotten)',
    ukGdprArticle: 'Article 17',
    desc: 'Request deletion of your personal data where retention is no longer legally necessary or justified.',
  },
  {
    value: 'RESTRICTION',
    label: 'Right to Restrict Processing',
    ukGdprArticle: 'Article 18',
    desc: 'Request that EntireFM limits the processing of your personal data while accuracy or objections are verified.',
  },
  {
    value: 'PORTABILITY',
    label: 'Right to Data Portability',
    ukGdprArticle: 'Article 20',
    desc: 'Request your personal data in a structured, commonly used, and machine-readable format.',
  },
  {
    value: 'OBJECTION',
    label: 'Right to Object (Direct Marketing & Legitimate Interests)',
    ukGdprArticle: 'Article 21',
    desc: 'Object to direct B2B outreach, marketing communications, or processing based on legitimate interests.',
  },
  {
    value: 'AUTOMATED_DECISION_REVIEW',
    label: 'Automated Decision & Profiling Human Review',
    ukGdprArticle: 'Article 22',
    desc: 'Request human intervention, express your point of view, or contest an automated recommendation or triage result.',
  },

];

export function DataRightsRequestForm() {
  const [formData, setFormData] = useState<DataRightsFormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    reference: string;
    right_type: DataSubjectRightType;
    statutory_due_date: string;
    notice: string;
    escalation: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.full_name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid contact email address.');
      return;
    }
    if (!formData.request_details.trim() || formData.request_details.trim().length < 20) {
      setError('Please provide sufficient detail to help us identify and retrieve relevant records (minimum 20 characters).');
      return;
    }
    if (!formData.id_confirmation) {
      setError('Please confirm that you are the data subject or are legally authorised to act on their behalf.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/legal/data-rights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit data rights request.');
      }

      setSubmissionResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please contact dpo@entirefm.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionResult) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 space-y-6 text-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-light">
            ✓
          </div>
          <div>
            <h3 className="text-xl font-light text-emerald-950">
              Data Subject Rights Request Formally Registered
            </h3>
            <p className="text-xs text-emerald-800 font-mono">
              Statutory Reference: {submissionResult.reference}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white rounded-xl p-4 border border-emerald-100">
          <div>
            <span className="text-slate-500 block uppercase font-light">Request Type</span>
            <span className="font-light text-slate-900">{submissionResult.right_type}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-light">Statutory Target Deadline (Art. 12(3))</span>
            <span className="font-light text-emerald-700">
              {new Date(submissionResult.statutory_due_date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })} (1 calendar month)
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-700 leading-relaxed bg-white/60 p-4 rounded-xl border border-emerald-100/60">
          <p>{submissionResult.notice}</p>
          <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
            <strong>Supervisory Authority Notice:</strong> {submissionResult.escalation}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormData(INITIAL_STATE);
            setSubmissionResult(null);
          }}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-normal rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  const selectedRight = RIGHT_TYPE_OPTIONS.find((r) => r.value === formData.right_type);

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-light text-slate-900 sm:text-xl">
          Exercise Your Data Subject Rights
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. Requests are processed free of charge within 1 calendar month.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Right Type Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-normal uppercase tracking-wider text-slate-700">
          Select Right to Exercise *
        </label>
        <select
          value={formData.right_type}
          onChange={(e) => setFormData({ ...formData, right_type: e.target.value as DataSubjectRightType })}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none"
        >
          {RIGHT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} ({opt.ukGdprArticle})
            </option>
          ))}
        </select>
        {selectedRight && (
          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <strong>{selectedRight.ukGdprArticle} Scope:</strong> {selectedRight.desc}
          </p>
        )}
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-normal text-slate-700">
            Full Legal Name *
          </label>
          <input
            type="text"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="e.g. Jane Doe"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-normal text-slate-700">
            Email Address * (for correspondence & disclosure)
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. jane.doe@example.co.uk"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-normal text-slate-700">
            Contact Telephone (Optional)
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+44 7000 000000"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-normal text-slate-700">
            Your Relationship to EntireFM *
          </label>
          <select
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
          >
            <option value="CLIENT_CONTACT">Client / Managing Agent Contact</option>
            <option value="BUILDING_OCCUPANT">Building Occupant / Tenant</option>
            <option value="CONTRACTOR_PERSONNEL">Contractor / Subcontractor Operative</option>
            <option value="JOB_APPLICANT">Job Applicant</option>
            <option value="WEBSITE_VISITOR">Website Visitor / Prospect Contact</option>
            <option value="OTHER">Other Data Subject</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-normal text-slate-700">
          Organisation / Company (if applicable)
        </label>
        <input
          type="text"
          value={formData.organisation_name}
          onChange={(e) => setFormData({ ...formData, organisation_name: e.target.value })}
          placeholder="e.g. ACME Property Management Ltd"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
        />
      </div>

      {/* Request Details */}
      <div className="space-y-1.5">
        <label className="block text-xs font-normal text-slate-700">
          Details of Your Request *
        </label>
        <textarea
          required
          rows={4}
          value={formData.request_details}
          onChange={(e) => setFormData({ ...formData, request_details: e.target.value })}
          placeholder="Please describe the specific personal data or processing activity your request relates to (e.g. 'I wish to receive a copy of all helpdesk correspondence and site sign-in records for 14 Mayfair Square from January to June 2026')."
          className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-normal text-slate-700">
          Specific Site, Helpdesk Ticket, or Reference Numbers (Optional)
        </label>
        <input
          type="text"
          value={formData.specific_data_scope}
          onChange={(e) => setFormData({ ...formData, specific_data_scope: e.target.value })}
          placeholder="e.g. WO-2026-9912 or Site ID: 104 Piccadilly"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
        />
      </div>

      {/* Confirmation */}
      <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.id_confirmation}
            onChange={(e) => setFormData({ ...formData, id_confirmation: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <span className="text-xs text-slate-700 leading-relaxed">
            I confirm that I am the data subject named above or am legally authorised to make this statutory rights request on their behalf. I understand that EntireFM may request photo ID or authority confirmation before disclosing or modifying personal records to protect data security.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-950 text-white font-normal text-sm hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
      >
        {isSubmitting ? 'Registering Request...' : 'Submit Data Rights Request'}
      </button>
    </form>
  );
}
