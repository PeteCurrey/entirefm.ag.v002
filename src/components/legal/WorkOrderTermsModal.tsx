'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, Lock, ArrowRight, X, Info } from 'lucide-react';
import { LEGAL_CONFIG } from '@/config/legal';
import type { AsbestosScopeStatus } from '@/server/asbestos';

export interface WorkOrderData {
  id: string;
  clientName: string;
  siteAddress: string;
  tradeRequired: string;
  priorityTier: 'P1 - Emergency (2-4h)' | 'P2 - Urgent (24h)' | 'P3 - Standard PPM (3-5 days)' | 'P4 - Scheduled Project';
  instructedScope: string;
  workArea: string; // Specific area e.g. "Roof Plant Room 2"
  willDisturbBuildingFabric: boolean;
  buildingConstructionYear?: number;
  maxChargeableBudgetGbp: number;
  materialsCapGbp: number;
  asbestosStatus: AsbestosScopeStatus;
  asbestosDocumentId?: string;
  asbestosDocumentTitle?: string;
  asbestosLastSurveyDate?: string;
  acmLocationsSummary?: string;
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
    asbestosStatus: AsbestosScopeStatus;
    asbestosDocumentId?: string;
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
  const [asbestosDocConfirmedRef, setAsbestosDocConfirmedRef] = useState(
    workOrder.asbestosDocumentId || ''
  );

  if (!isOpen) return null;

  const requiresAsbestosConfirmation =
    workOrder.asbestosStatus === 'ASBESTOS_INFORMATION_AVAILABLE' ||
    workOrder.asbestosStatus === 'NO_ACM_IDENTIFIED_FOR_SCOPE' ||
    workOrder.asbestosStatus === 'PRESUMED_ACM' ||
    workOrder.asbestosStatus === 'SURVEY_REQUIRED';

  const isIntrusiveBlocked =
    workOrder.willDisturbBuildingFabric &&
    (workOrder.asbestosStatus === 'INFORMATION_REQUIRED' ||
      workOrder.asbestosStatus === 'SURVEY_REQUIRED' ||
      workOrder.asbestosStatus === 'SPECIALIST_REVIEW_REQUIRED' ||
      workOrder.asbestosStatus === 'WORK_BLOCKED');

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
      asbestosDocumentId: asbestosDocConfirmedRef || undefined,
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
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-slate-950 font-light">
              WO
            </span>
            <div>
              <h2 id="wo-terms-title" className="text-base font-light text-white">
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
                <span className="font-light text-slate-900">{workOrder.siteAddress}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Job Work Area:</span>
                <span className="font-light text-slate-900">{workOrder.workArea}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Authorised Budget Cap:</span>
                <span className="font-light text-teal-700 font-mono">
                  £{workOrder.maxChargeableBudgetGbp.toFixed(2)} + VAT (NTE)
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 mt-2">
              <span className="text-slate-500 block">Instructed Scope of Works:</span>
              <p className="font-normal text-slate-800 mt-0.5">{workOrder.instructedScope}</p>
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-600">
              <span className="font-light">Fabric Disturbance:</span>
              <span className={workOrder.willDisturbBuildingFabric ? 'text-amber-700 font-light' : 'text-slate-700'}>
                {workOrder.willDisturbBuildingFabric ? 'Yes (Intrusive Work)' : 'No (Surface / Visual / Non-intrusive)'}
              </span>
              {workOrder.buildingConstructionYear && (
                <span className="text-slate-400">· Construction Year: {workOrder.buildingConstructionYear}</span>
              )}
            </div>
          </div>

          {/* Job-Scope Specific Asbestos Governance (Control of Asbestos Regs 2012) */}
          <div className="rounded-xl border p-4 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-light text-slate-900">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Statutory Asbestos Governance (CAR 2012 / Duty to Manage)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-light uppercase bg-slate-100 text-slate-800">
                Scope Status: {workOrder.asbestosStatus}
              </span>
            </div>

            {workOrder.asbestosStatus === 'ASBESTOS_INFORMATION_AVAILABLE' && (
              <div className="bg-amber-50/90 border border-amber-200 rounded-lg p-3 text-amber-950 space-y-2">
                <p>
                  <strong>Dutyholder Document Attached:</strong>{' '}
                  {workOrder.asbestosDocumentTitle || 'Site Asbestos Register'}{' '}
                  {workOrder.asbestosLastSurveyDate && `(Survey Date: ${workOrder.asbestosLastSurveyDate})`}.
                </p>
                {workOrder.acmLocationsSummary && (
                  <p className="text-xs text-amber-900">
                    <strong>Recorded ACMs / Presumptions:</strong> {workOrder.acmLocationsSummary}
                  </p>
                )}
                <label className="flex items-start gap-2 pt-1 cursor-pointer font-light">
                  <input
                    type="checkbox"
                    checked={acknowledgedAsbestos}
                    onChange={(e) => setAcknowledgedAsbestos(e.target.checked)}
                    className="mt-0.5 rounded border-amber-400 text-teal-700 focus:ring-teal-500"
                  />
                  <span>
                    I confirm our operatives have reviewed the asbestos information specific to {workOrder.workArea} and will stop work immediately if unexpected materials are encountered.
                  </span>
                </label>
              </div>
            )}

            {workOrder.asbestosStatus === 'NO_ACM_IDENTIFIED_FOR_SCOPE' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-light">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Survey Completed: No ACMs Identified within Job Scope Area ({workOrder.workArea}).</span>
                </div>
                <label className="flex items-start gap-2 pt-1 cursor-pointer font-normal">
                  <input
                    type="checkbox"
                    checked={acknowledgedAsbestos}
                    onChange={(e) => setAcknowledgedAsbestos(e.target.checked)}
                    className="mt-0.5 rounded border-emerald-400 text-teal-700 focus:ring-teal-500"
                  />
                  <span>
                    I acknowledge receipt of the scope-specific clearance notes and agree to remain strictly within the surveyed work envelope.
                  </span>
                </label>
              </div>
            )}

            {workOrder.asbestosStatus === 'SURVEY_REQUIRED' && (
              <div className="bg-amber-100/90 border border-amber-300 rounded-lg p-3 text-amber-950 space-y-2">
                <p className="font-light">⚠️ Dedicated Refurbishment / Demolition Survey Required</p>
                <p className="text-xs text-amber-900">
                  Planned works involve intrusive penetration of structural fabric. A competent survey must be completed and delivered before intrusive activity begins.
                </p>
                {workOrder.willDisturbBuildingFabric && (
                  <p className="text-xs text-red-700 font-light">
                    BLOCKED: Intrusive drilling/penetration prohibited until survey is attached and verified.
                  </p>
                )}
              </div>
            )}

            {workOrder.asbestosStatus === 'INFORMATION_REQUIRED' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-950 space-y-1">
                <p className="font-light">⚠️ Dutyholder Asbestos Information Pending from Client</p>
                <p className="text-xs text-red-800">
                  {workOrder.willDisturbBuildingFabric
                    ? 'BLOCKED: Intrusive or destructive works are prohibited until the client furnishes the statutory dutyholder register or survey.'
                    : 'Non-intrusive visual / surface inspection only. Operatives must NOT disturb wall fabric, ceiling tiles, or pipe lagging.'}
                </p>
              </div>
            )}

            {workOrder.asbestosStatus === 'SPECIALIST_REVIEW_REQUIRED' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-950 space-y-1">
                <p className="font-light">⚠️ EntireFM QHSE Competent Review Required</p>
                <p className="text-xs text-red-800">
                  Suspected ACM identified in work zone. Work order cannot proceed to execution until cleared by an authorized EntireFM QHSE manager.
                </p>
              </div>
            )}

            {workOrder.asbestosStatus === 'DUTY_NOT_APPLICABLE' && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 flex items-center gap-2">
                <Info className="h-4 w-4 text-slate-500 shrink-0" />
                <span>Dutyholder has confirmed duty to manage is not triggered for this domestic/exempt scope. Standard CDM 2015 RAMS apply.</span>
              </div>
            )}
          </div>

          {/* Core Execution Terms (Summary) */}
          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <h4 className="font-light text-slate-900 text-sm">Binding Work Order Terms:</h4>
            <ol className="list-decimal pl-4 space-y-2">
              <li>
                <strong>Scope Limitation:</strong> You are authorised to perform only the instructed scope. Any variation or additional chargeable works requires prior written EntireFM approval, except for immediate emergency make-safe actions.
              </li>
              <li>
                <strong>Evidence & Completion:</strong> Payment is strictly conditional on submitting time-stamped attendance logs, clear photographic evidence before/after, and certified compliance sheets within 24 hours of job completion.
              </li>
              <li>
                <strong>Competence & Verification:</strong> All personnel deployed must hold verified trade credentials (e.g. Gas Safe, NICEIC, F-Gas) and active contractor vetting status appropriate to the risk class.
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
                <label className="block text-xs font-normal text-slate-700 uppercase">
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
                <label className="block text-xs font-normal text-slate-700 uppercase">
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

            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-800 font-normal">
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
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-normal text-slate-700 hover:bg-slate-50"
              >
                Decline / Cancel
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-5 py-2 text-xs font-normal text-white shadow-xs hover:bg-teal-800 disabled:opacity-50"
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
