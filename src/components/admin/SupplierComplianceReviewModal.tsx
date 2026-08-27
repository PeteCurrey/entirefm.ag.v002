'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, AlertCircle, ShieldCheck, Lock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supplierId: string;
  documentId: string;
  documentTitle: string;
  fileName: string;
  expiryDate?: string;
  currentStatus: string;
}

export function SupplierComplianceReviewModal({
  isOpen,
  onClose,
  onSuccess,
  supplierId,
  documentId,
  documentTitle,
  fileName,
  expiryDate,
  currentStatus,
}: Props) {
  const [decision, setDecision] = useState<'VERIFY' | 'REJECT'>('VERIFY');
  const [rejectionReason, setRejectionReason] = useState('');
  const [contractorVisibleNote, setContractorVisibleNote] = useState('');
  const [internalEntirefmNote, setInternalEntirefmNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (decision === 'REJECT' && !rejectionReason.trim()) {
      setErrorMessage('Please provide a reason for rejection (this will be visible to the contractor)');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/suppliers/${encodeURIComponent(supplierId)}/verify-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          decision,
          rejectionReason: decision === 'REJECT' ? rejectionReason : undefined,
          contractorVisibleNote: contractorVisibleNote || (decision === 'VERIFY' ? 'Verified by EntireFM' : rejectionReason),
          internalEntirefmNote: internalEntirefmNote || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to submit review');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-sm w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
              ENTIREFM COMPLIANCE VERIFICATION
            </span>
            <h2 className="text-base font-light text-slate-900">Review Supplier Document Evidence</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          {errorMessage && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Document Summary Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1">
            <div className="text-slate-900 font-bold font-sans text-sm">{documentTitle}</div>
            <div className="text-slate-600 text-[11px]">
              File: {fileName} {expiryDate ? `&bull; Expiry: ${expiryDate}` : ''}
            </div>
            <div className="text-slate-500 text-[10.5px]">Current status: {currentStatus}</div>
          </div>

          {/* Decision Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-slate-600 font-bold block">
              Verification Decision *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('VERIFY')}
                className={`py-2.5 px-3 rounded border text-center font-bold flex items-center justify-center gap-2 transition-colors ${
                  decision === 'VERIFY'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Verify &amp; Accept
              </button>

              <button
                type="button"
                onClick={() => setDecision('REJECT')}
                className={`py-2.5 px-3 rounded border text-center font-bold flex items-center justify-center gap-2 transition-colors ${
                  decision === 'REJECT'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-4 h-4" />
                Reject Document
              </button>
            </div>
          </div>

          {/* Rejection Reason (Contractor-Visible) */}
          {decision === 'REJECT' && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <label className="text-[11px] uppercase tracking-wider text-rose-700 font-bold block">
                Contractor-Visible Rejection Reason *
              </label>
              <textarea
                rows={2}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Uploaded policy schedule does not confirm £5M cover limit or is missing policy schedule..."
                className="w-full p-2.5 rounded border border-rose-300 font-sans text-xs focus:outline-none focus:border-rose-600"
              />
            </div>
          )}

          {/* Internal EntireFM Note (Quarantined) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-600 font-bold">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Internal EntireFM Notes (Strictly Confidential)</span>
            </div>
            <p className="text-[10px] text-slate-500 font-sans">
              Internal notes are permanently quarantined and will NEVER be visible to the contractor.
            </p>
            <textarea
              rows={2}
              value={internalEntirefmNote}
              onChange={(e) => setInternalEntirefmNote(e.target.value)}
              placeholder="Add internal audit notes, risk assessment observations, or verification references..."
              className="w-full p-2.5 rounded border border-slate-200 font-sans text-xs focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 rounded text-white font-bold transition-colors disabled:opacity-50 ${
                decision === 'VERIFY' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {isSubmitting ? 'Saving...' : decision === 'VERIFY' ? 'Confirm Verification' : 'Reject Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
