'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, Lock, ArrowRight, X, Info } from 'lucide-react';
import { LEGAL_CONFIG } from '@/config/legal';

export type AsbestosSiteStatus =
  | 'NOT_APPLICABLE' // Post-2000 construction with no ACM present
  | 'REGISTER_AVAILABLE' // Dutyholder register on site / reception
  | 'SURVEY_REQUIRED' // Refurbishment / demolition survey required before intrusive work
  | 'INFORMATION_PENDING' // Client has not yet furnished dutyholder register
  | 'REVIEW_REQUIRED'; // Suspected ACM in immediate work zone requiring EFM H&S review

export interface WorkOrderData {
  id: string;
  clientName: string;
  siteAddress: string;
  tradeRequired: string;
  priorityTier: 'P1 - Emergency (2-4h)' | 'P2 - Urgent (24h)' | 'P3 - Standard PPM (3-5 days)' | 'P4 - Scheduled Project';
  instructedScope: string;
  isIntrusiveWork?: boolean;
  maxChargeableBudgetGbp: number;
  materialsCapGbp: number;
  asbestosStatus: AsbestosSiteStatus;
  asbestosRegisterReference?: string;
  asbestosLastSurveyDate?: string;
  asbestosNotes?: string;
  requiredEvidence: string[];
  termsVersion: string;
}

interface WorkOrderTermsModalProps {
  workOrder: WorkOrderData;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (acceptanceRecord: {
    acceptedBy: string;
    acceptedAt: string;
    termsVersion: string;
    workOrderId: string;
    asbestosAcknowledged: boolean;
    asbestosStatus: AsbestosSiteStatus;
    asbestosRegisterReference?: string;
  }) => void;
}

export function WorkOrderTermsModal({
  workOrder,
  isOpen,
  onClose,
  onAccept,
}: WorkOrderTermsModalProps) {
  const [contractorName, setContractorName] = useState('');
  const [contractorCompany, setContractorCompany] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [acknowledgedAsbestos, setAcknowledgedAsbestos] = useState(false);
  const [asbestosRegisterConfirmedRef, setAsbestosRegisterConfirmedRef] = useState(
    workOrder.asbestosRegisterReference || ''
  );

  if (!isOpen) return null;

  const requiresAsbestosConfirmation =
    workOrder.asbestosStatus === 'REGISTER_AVAILABLE' ||
    workOrder.asbestosStatus === 'SURVEY_REQUIRED' ||
    workOrder.asbestosStatus === 'REVIEW_REQUIRED';

  const isIntrusiveBlocked =
    workOrder.isIntrusiveWork &&
    (workOrder.asbestosStatus === 'INFORMATION_PENDING' || workOrder.asbestosStatus === 'REVIEW_REQUIRED');

  const canSubmit =
    contractorName.trim().length > 2 &&
    contractorCompany.trim().length > 2 &&
    agreedTerms &&
    !isIntrusiveBlocked &&
    (!requiresAsbestosConfirmation || acknowledgedAsbestos);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    onAccept({
      acceptedBy: `${contractorName} (${contractorCompany})`,
      acceptedAt: new Date().toISOString(),
      termsVersion: workOrder.termsVersion,
      workOrderId: workOrder.id,
      asbestosAcknowledged: acknowledgedAsbestos,
      asbestosStatus: workOrder.asbestosStatus,
      asbestosRegisterReference: asbestosRegisterConfirmedRef || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wo-terms-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-slate-950 font-bold">
              WO
            </span>
            <div>
              <h2 id="wo-terms-title" className="text-base font-bold text-white">
                Work Order Instruction & Execution Agreement
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                Reference: {workOrder.id} · Priority: {workOrder.priorityTier}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close work order terms modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-700 space-y-6">
          {/* Work Order Particulars */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <span className="text-slate-500 block">Site Location:</span>
                <span className="font-semibold text-slate-900">{workOrder.siteAddress}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Trade / Discipline:</span>
                <span className="font-semibold text-slate-900">{workOrder.tradeRequired}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Authorised Budget Cap:</span>
                <span className="font-semibold text-teal-700 font-mono">
                  £{workOrder.maxChargeableBudgetGbp.toFixed(2)} + VAT (NTE)
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 mt-2">
              <span className="text-slate-500 block">Instructed Scope of Works:</span>
              <p className="font-medium text-slate-800 mt-0.5">{workOrder.instructedScope}</p>
            </div>
          </div>

          {/* Structured Asbestos Pre-Work Governance (Control of Asbestos Regs 2012) */}
          <div className="rounded-xl border p-4 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Statutory Asbestos Governance (CAR 2012 / Reg 4)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase bg-slate-100 text-slate-800">
                Status: {workOrder.asbestosStatus}
              </span>
            </div>

            {workOrder.asbestosStatus === 'REGISTER_AVAILABLE' && (
              <div className="bg-amber-50/90 border border-amber-200 rounded-lg p-3 text-amber-950 space-y-2">
                <p>
                  <strong>Dutyholder Asbestos Register Active on Site:</strong> Ref{' '}
                  <code className="bg-white/80 px-1 py-0.5 rounded font-mono">
                    {workOrder.asbestosRegisterReference || 'REG-ON-SITE'}
                  </code>
                  {workOrder.asbestosLastSurveyDate && ` (Last Survey: ${workOrder.asbestosLastSurveyDate})`}.
                </p>
                <p className="text-xs text-amber-900">
                  {workOrder.asbestosNotes ||
                    'Engineers must inspect the physical register at reception before commencing any intrusive works, drilling, or fabric disturbance.'}
                </p>
                <label className="flex items-start gap-2 pt-1 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={acknowledgedAsbestos}
                    onChange={(e) => setAcknowledgedAsbestos(e.target.checked)}
                    className="mt-0.5 rounded border-amber-400 text-teal-700 focus:ring-teal-500"
                  />
                  <span>
                    I confirm our attending engineers will review the site Asbestos Register prior to invasive work and immediately stop work if suspect materials are uncovered.
                  </span>
                </label>
              </div>
            )}

            {workOrder.asbestosStatus === 'SURVEY_REQUIRED' && (
              <div className="bg-amber-100/90 border border-amber-300 rounded-lg p-3 text-amber-950 space-y-2">
                <p>
                  <strong>Refurbishment & Demolition (R&D) Survey Required:</strong> Works involve structural or deep fabric alteration in a pre-2000 building.
                </p>
                <label className="flex items-start gap-2 pt-1 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={acknowledgedAsbestos}
                    onChange={(e) => setAcknowledgedAsbestos(e.target.checked)}
                    className="mt-0.5 rounded border-amber-400 text-teal-700 focus:ring-teal-500"
                  />
                  <span>
                    I confirm our operatives have received and reviewed the R&D survey specific to this work area and will work strictly within surveyed safe zones.
                  </span>
                </label>
              </div>
            )}

            {workOrder.asbestosStatus === 'NOT_APPLICABLE' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Building constructed post-2000. No asbestos containing materials recorded on site register. Standard CDM 2015 RAMS apply.</span>
              </div>
            )}

            {workOrder.asbestosStatus === 'INFORMATION_PENDING' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-950 space-y-1">
                <p className="font-bold">⚠️ Dutyholder Asbestos Information Pending from Client</p>
                <p className="text-xs text-red-800">
                  {workOrder.isIntrusiveWork
                    ? 'BLOCKED: Intrusive or destructive works are prohibited until the client furnishes a valid site asbestos register or survey.'
                    : 'Non-intrusive visual / surface inspection only. Operatives must NOT disturb wall fabric, ceiling voids, or pipe lagging.'}
                </p>
              </div>
            )}

            {workOrder.asbestosStatus === 'REVIEW_REQUIRED' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-950 space-y-1">
                <p className="font-bold">⚠️ EntireFM Health & Safety Review Required</p>
                <p className="text-xs text-red-800">
                  Suspected ACM identified in the work zone. Work order cannot proceed to execution until cleared by an EntireFM compliance manager.
                </p>
              </div>
            )}
          </div>

          {/* Core Execution Terms (Summary) */}
          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <h4 className="font-bold text-slate-900 text-sm">Binding Work Order Terms:</h4>
            <ol className="list-decimal pl-4 space-y-2">
              <li>
                <strong>Scope Limitation:</strong> You are authorised to perform only the instructed scope. Any variation or additional chargeable works requires prior written EntireFM approval, except for immediate make-safe actions.
              </li>
              <li>
                <strong>Evidence & Completion:</strong> Payment is strictly conditional on submitting time-stamped attendance logs, clear photographic evidence before/after, and certified compliance sheets within 24 hours of job completion.
              </li>
              <li>
                <strong>Competence & Verification:</strong> All personnel deployed must hold verified trade credentials (e.g. Gas Safe, NICEIC, F-Gas) and active contractor vetting status.
              </li>
              <li>
                <strong>No Direct Client Solicitation:</strong> Contractor covenants not to solicit or accept direct maintenance instructions from the client without EntireFM involvement.
              </li>
            </ol>
          </div>

          {/* Electronic Signature Form */}
          <form onSubmit={handleSubmit} className="border-t border-slate-200 pt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Authorised Signatory Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  placeholder="e.g. Mark Roberts"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Contractor Trading Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={contractorCompany}
                  onChange={(e) => setContractorCompany(e.target.value)}
                  placeholder="e.g. Apex Engineering Ltd"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-teal-600 focus:outline-hidden"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-800 font-medium">
              <input
                type="checkbox"
                required
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>
                I agree to the Work Order Execution Terms (v{workOrder.termsVersion}) and EntireFM Contractor Network Agreement on behalf of the contractor entity.
              </span>
            </label>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Decline / Cancel
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-800 disabled:opacity-50"
              >
                <Lock className="h-3.5 w-3.5" />
                Electronically Accept Work Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
