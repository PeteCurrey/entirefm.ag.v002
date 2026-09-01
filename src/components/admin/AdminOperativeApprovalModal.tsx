'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Lock } from 'lucide-react';
import { EntireFMOperativeApprovalStatus } from '@/server/contractor/workforce-service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  operativeId: string;
  operativeName: string;
  contractorName: string;
  currentStatus: string;
}

export function AdminOperativeApprovalModal({
  isOpen,
  onClose,
  onSuccess,
  operativeId,
  operativeName,
  contractorName,
  currentStatus,
}: Props) {
  const [decision, setDecision] = useState<EntireFMOperativeApprovalStatus>('APPROVED');
  const [rejectionReason, setRejectionReason] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (decision === 'REJECTED' && !rejectionReason.trim()) {
      setErrorMsg('Please enter a rejection reason visible to the contractor.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/workforce/${encodeURIComponent(operativeId)}/approval`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalStatus: decision,
          rejectionReason: decision === 'REJECTED' ? rejectionReason : undefined,
          internalNotes: internalNotes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to update approval');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during submission');
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
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              ENTIREFM OPERATIVE VETTING
            </span>
            <h2 className="text-base font-light text-slate-900">Review Supply Chain Operative</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-normal">
          {errorMsg && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1">
            <div className="text-slate-900 font-bold font-sans text-sm">{operativeName}</div>
            <div className="text-slate-600 text-[11px]">
              Employer: <strong className="text-slate-900">{contractorName}</strong>
            </div>
            <div className="text-slate-500 text-[10.5px]">Current EntireFM status: {currentStatus}</div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-slate-600 font-bold block">
              Approval Decision *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDecision('APPROVED')}
                className={`py-2 px-3 rounded border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  decision === 'APPROVED'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Operative
              </button>

              <button
                type="button"
                onClick={() => setDecision('APPROVED_WITH_RESTRICTIONS')}
                className={`py-2 px-3 rounded border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  decision === 'APPROVED_WITH_RESTRICTIONS'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Restricted Approval
              </button>

              <button
                type="button"
                onClick={() => setDecision('REJECTED')}
                className={`py-2 px-3 rounded border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  decision === 'REJECTED'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-4 h-4" />
                Reject Credentials
              </button>

              <button
                type="button"
                onClick={() => setDecision('SUSPENDED')}
                className={`py-2 px-3 rounded border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  decision === 'SUSPENDED'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Lock className="w-4 h-4" />
                Suspend Operative
              </button>
            </div>
          </div>

          {decision === 'REJECTED' && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <label className="text-[11px] uppercase tracking-wider text-rose-700 font-bold block">
                Contractor-Visible Rejection Reason *
              </label>
              <textarea
                rows={2}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Uploaded ECS card does not match operative identity or has expired..."
                className="w-full p-2.5 rounded border border-rose-300 font-sans text-xs focus:outline-none focus:border-rose-600"
              />
            </div>
          )}

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-600 font-bold">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Internal EntireFM Audit Notes (Strictly Confidential)</span>
            </div>
            <textarea
              rows={2}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Add internal vetting observations, reference verification notes..."
              className="w-full p-2.5 rounded border border-slate-200 font-sans text-xs focus:outline-none focus:border-slate-900"
            />
          </div>

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
              className="px-5 py-2 rounded text-white font-bold bg-slate-900 hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Confirm Operative Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
