'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Building2,
  Wrench,
  MapPin,
  HeartPulse,
  Award,
  CreditCard,
  Send,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';
import { SupplierOnboardingDraft } from '@/server/suppliers/types';
import { SupplierRfiRecord, SupplierApprovalDecision } from '@/server/suppliers/rfi-store';

interface Props {
  draft: SupplierOnboardingDraft;
  rfis: SupplierRfiRecord[];
  decision: SupplierApprovalDecision | null;
}

export function AdminApplicationReviewClient({ draft, rfis: initialRfis, decision: initialDecision }: Props) {
  const [rfis, setRfis] = useState<SupplierRfiRecord[]>(initialRfis);
  const [decision, setDecision] = useState<SupplierApprovalDecision | null>(initialDecision);
  const [status, setStatus] = useState<string>(draft.status);
  const [modalType, setModalType] = useState<'RFI' | 'APPROVE' | 'CONDITIONAL' | 'DECLINE' | null>(null);

  // Form states for modals
  const [rfiTitle, setRfiTitle] = useState('');
  const [rfiSection, setRfiSection] = useState('insurance');
  const [rfiDescription, setRfiDescription] = useState('');
  const [rfiDueDate, setRfiDueDate] = useState('');

  const [approvedRegions, setApprovedRegions] = useState<string[]>(draft.selected_regions || ['West Midlands', 'East Midlands']);
  const [restrictions, setRestrictions] = useState('No unattended hot works');

  const [condDescription, setCondDescription] = useState('Provide renewed Gas Safe certificate upon receipt from body');
  const [condDeadline, setCondDeadline] = useState('2026-11-30');

  const [declineReason, setDeclineReason] = useState('INSUFFICIENT_INSURANCE');
  const [declineExplanation, setDeclineExplanation] = useState('Public liability policy limit is below the minimum required £5,000,000 threshold.');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (action: string, payload: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/supplier/application/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          supplierId: draft.id || 'sup-test-01',
          data: payload,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (action === 'CREATE_RFI') {
          setRfis([data.rfi, ...rfis]);
          setStatus('INFORMATION_REQUIRED');
        } else if (action === 'APPROVE') {
          setDecision(data.decision);
          setStatus('APPROVED');
        } else if (action === 'CONDITIONALLY_APPROVE') {
          setDecision(data.decision);
          setStatus('CONDITIONALLY_APPROVED');
        } else if (action === 'DECLINE') {
          setDecision(data.decision);
          setStatus('DECLINED');
        }
        setModalType(null);
      }
    } catch (err) {
      console.error('Error executing review action:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/suppliers/applications" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-mono">
              <ArrowLeft className="h-3 w-3" /> Back to Application Queue
            </Link>
            <span className="text-slate-300">&bull;</span>
            <span className="text-xs font-mono text-brand-pink font-bold">{draft.application_reference}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            {draft.legal_company_name}
          </h1>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Co # {draft.company_number} &bull; Trading as <strong className="text-slate-700">{draft.trading_name || draft.legal_company_name}</strong>
          </p>
        </div>

        {/* Current State & Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-mono px-3 py-1 rounded font-bold ${
            status === 'APPROVED'
              ? 'bg-emerald-100 text-emerald-800'
              : status === 'CONDITIONALLY_APPROVED'
              ? 'bg-amber-100 text-amber-800'
              : status === 'DECLINED'
              ? 'bg-rose-100 text-rose-800'
              : status === 'INFORMATION_REQUIRED'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-slate-900 text-white'
          }`}>
            STATUS: {status}
          </span>

          <button
            onClick={() => setModalType('RFI')}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Request Info (RFI)</span>
          </button>

          <button
            onClick={() => setModalType('APPROVE')}
            className="btn-primary text-xs py-1.5 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Approve with Scope</span>
          </button>

          <button
            onClick={() => setModalType('DECLINE')}
            className="btn-secondary text-xs py-1.5 px-3 text-rose-700 hover:bg-rose-50 border-rose-200"
          >
            Decline
          </button>
        </div>
      </div>

      {/* Commercial Gateway Verification Banner */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-slate-700" />
          <span className="text-slate-900 font-bold font-sans">Assurance Payment Gate:</span>
          <span className="text-emerald-700 font-bold">
            {draft.assurance_payment?.status === 'PAID'
              ? `PAID — £350 + VAT (Ref: ${draft.assurance_payment.transaction_reference || 'Stripe'})`
              : draft.assurance_payment?.status === 'WAIVED'
              ? `WAIVED (${draft.assurance_payment.waiver_reason || 'Authorised'})`
              : 'AWAITING PAYMENT'}
          </span>
        </div>
        <span className="text-slate-500 text-[11px]">
          Submitted: {draft.submitted_at ? new Date(draft.submitted_at).toLocaleDateString() : 'Pending'}
        </span>
      </div>

      {/* Section Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Box 1: Services & Coverage */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-slate-100">
            <Wrench className="h-4 w-4 text-slate-700" />
            <span>Declared Services &amp; Operational Territory</span>
          </div>
          <div className="space-y-1.5">
            <div>
              <span className="text-slate-400 block text-[10.5px]">Declared Trades</span>
              <span className="font-mono text-slate-900 font-bold">{draft.selected_service_slugs?.join(', ') || 'HVAC, Gas Heating'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Operational Territory</span>
              <span className="text-slate-700">{draft.selected_regions?.join(', ') || 'Midlands, Yorkshire'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Operating Capability</span>
              <span className="text-slate-700">{draft.standard_operating_hours || '08:00 - 17:00 (Mon-Fri)'} &bull; 24/7 Emergency: {draft.emergency_24_7_available ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Box 2: Insurance & Accreditations */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-slate-100">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Insurance Schedules &amp; Accreditations</span>
          </div>
          <div className="space-y-1.5">
            <div>
              <span className="text-slate-400 block text-[10.5px]">Public Liability</span>
              <span className="text-slate-900 font-mono font-bold">£10,000,000 (Aviva Insurance)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Accreditation Registrations</span>
              <span className="text-slate-700">Gas Safe: 654321 &bull; REFCOM: REF101234 &bull; SafeContractor: SC-009882</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Health &amp; Safety Verification</span>
              <span className="text-emerald-700 font-bold">H&amp;S Policy Valid &bull; Competent Person Appointed &bull; Clean 3-Yr Record</span>
            </div>
          </div>
        </div>
      </div>

      {/* RFIs List */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
            Requests For Information (RFI) History ({rfis.length})
          </h3>
          <button
            onClick={() => setModalType('RFI')}
            className="btn-secondary text-xs py-1 px-3 flex items-center gap-1 font-bold"
          >
            + Raise RFI
          </button>
        </div>

        {rfis.length === 0 ? (
          <p className="text-xs text-slate-400 font-light">No clarification requests issued for this application.</p>
        ) : (
          <div className="divide-y divide-slate-200">
            {rfis.map((rfi) => (
              <div key={rfi.id} className="py-3 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rfi.title}</span>
                  <span className={`font-mono font-bold text-[10.5px] px-2 py-0.5 rounded ${
                    rfi.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {rfi.status}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{rfi.requirement_description}</p>
                {rfi.supplier_response_text && (
                  <div className="bg-slate-50 p-2.5 rounded text-[11px] text-slate-800 mt-2 border border-slate-200">
                    <strong>Supplier Response:</strong> {rfi.supplier_response_text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RFI Modal */}
      {modalType === 'RFI' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Raise Clarification Request (RFI)</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Section</label>
                <select
                  value={rfiSection}
                  onChange={(e) => setRfiSection(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-sans"
                >
                  <option value="insurance">Insurance Schedules</option>
                  <option value="accreditations">Accreditations &amp; Registrations</option>
                  <option value="health_safety">Health &amp; Safety / RAMS</option>
                  <option value="operations">Operational Capability</option>
                  <option value="documents">Document Vault</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={rfiTitle}
                  onChange={(e) => setRfiTitle(e.target.value)}
                  placeholder="e.g. Public Liability Schedule Indemnity Confirmation"
                  className="w-full p-2 border border-slate-300 rounded font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Clarification Description</label>
                <textarea
                  value={rfiDescription}
                  onChange={(e) => setRfiDescription(e.target.value)}
                  placeholder="State specifically what evidence or confirmation the supplier must provide..."
                  rows={3}
                  className="w-full p-2 border border-slate-300 rounded font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModalType(null)} className="btn-secondary text-xs py-1.5 px-3">
                Cancel
              </button>
              <button
                disabled={!rfiTitle.trim() || !rfiDescription.trim() || isSubmitting}
                onClick={() =>
                  handleAction('CREATE_RFI', {
                    section_key: rfiSection,
                    title: rfiTitle,
                    requirement_description: rfiDescription,
                    due_date: rfiDueDate || '2026-09-30',
                    raised_by: 'EntireFM Compliance Desk',
                  })
                }
                className="btn-primary text-xs py-1.5 px-4 bg-brand-pink text-white font-bold disabled:opacity-50"
              >
                Send RFI to Supplier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {modalType === 'APPROVE' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Confirm Scoped Supplier Approval</h3>
            <p className="text-xs text-slate-600 font-light">
              Approval establishes the authorized trade scope and geographical boundaries under which EntireFM may allocate work orders.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Approved Geographies</label>
                <input
                  type="text"
                  value={approvedRegions.join(', ')}
                  onChange={(e) => setApprovedRegions(e.target.value.split(',').map((s) => s.trim()))}
                  className="w-full p-2 border border-slate-300 rounded font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Operational Restrictions (if any)</label>
                <input
                  type="text"
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  placeholder="e.g. No unattended hot works"
                  className="w-full p-2 border border-slate-300 rounded font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModalType(null)} className="btn-secondary text-xs py-1.5 px-3">
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={() =>
                  handleAction('APPROVE', {
                    approved_services: [
                      {
                        service_slug: 'hvac',
                        service_name: 'HVAC & Air Conditioning',
                        approved_geographies: approvedRegions,
                        restrictions: restrictions ? [restrictions] : [],
                      },
                      {
                        service_slug: 'gas-heating',
                        service_name: 'Commercial Gas & Heating',
                        approved_geographies: approvedRegions,
                        restrictions: restrictions ? [restrictions] : [],
                      },
                    ],
                    decided_by: 'Head of Supply Chain Assurance',
                  })
                }
                className="btn-primary text-xs py-1.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold disabled:opacity-50"
              >
                Confirm &amp; Issue Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {modalType === 'DECLINE' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Decline Supplier Application</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Reason Category</label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-sans"
                >
                  <option value="INSUFFICIENT_INSURANCE">Insufficient Insurance Limits</option>
                  <option value="UNVERIFIED_ACCREDITATIONS">Unverified Trade Accreditations</option>
                  <option value="HEALTH_SAFETY_CONCERNS">Health &amp; Safety Compliance Issues</option>
                  <option value="OUT_OF_SCOPE">Outside Required Geographical Footprint</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Explanation (Supplier-Facing)</label>
                <textarea
                  value={declineExplanation}
                  onChange={(e) => setDeclineExplanation(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-slate-300 rounded font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModalType(null)} className="btn-secondary text-xs py-1.5 px-3">
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={() =>
                  handleAction('DECLINE', {
                    reason_category: declineReason,
                    explanation: declineExplanation,
                    decided_by: 'Head of Supply Chain Assurance',
                  })
                }
                className="btn-primary text-xs py-1.5 px-4 bg-rose-700 hover:bg-rose-800 text-white font-bold disabled:opacity-50"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
