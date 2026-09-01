'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import { RamsRecord } from '@/server/contractor/rams-service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  rams: RamsRecord;
}

export function AdminRamsReviewModal({ isOpen, onClose, onSuccess, rams }: Props) {
  const [decision, setDecision] = useState<'ACCEPTED_FOR_WORK' | 'CHANGES_REQUESTED' | 'REJECTED'>('ACCEPTED_FOR_WORK');
  const [generalNotes, setGeneralNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (decision === 'CHANGES_REQUESTED' && !generalNotes.trim()) {
      setErrorMsg('Please enter the specific changes requested for the contractor.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/rams/${encodeURIComponent(rams.id)}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          generalNotes: generalNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Review failed');

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review');
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
              ENTIREFM SAFETY REVIEW
            </span>
            <h2 className="text-base font-light text-slate-900">Review Contractor RAMS Pack</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-normal">
          {errorMsg && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1">
            <div className="text-slate-900 font-bold font-sans text-sm">{rams.title}</div>
            <div className="text-slate-600 text-[11px]">
              Contractor: <strong className="text-slate-900">{rams.contractorName}</strong>
            </div>
            <div className="text-slate-500 text-[10.5px]">
              Site: {rams.siteName} &bull; Ref: {rams.id} (v{rams.version})
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-slate-600 font-bold block">
              Compliance Review Decision *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDecision('ACCEPTED_FOR_WORK')}
                className={`py-2 px-2 rounded border text-center font-bold text-xs flex flex-col items-center gap-1 transition-colors ${
                  decision === 'ACCEPTED_FOR_WORK'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Accept for Work
              </button>

              <button
                type="button"
                onClick={() => setDecision('CHANGES_REQUESTED')}
                className={`py-2 px-2 rounded border text-center font-bold text-xs flex flex-col items-center gap-1 transition-colors ${
                  decision === 'CHANGES_REQUESTED'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Request Changes
              </button>

              <button
                type="button"
                onClick={() => setDecision('REJECTED')}
                className={`py-2 px-2 rounded border text-center font-bold text-xs flex flex-col items-center gap-1 transition-colors ${
                  decision === 'REJECTED'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-4 h-4" />
                Reject Pack
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-slate-600 font-bold block">
              Reviewer Notes / Feedback to Contractor {decision === 'CHANGES_REQUESTED' && '*'}
            </label>
            <textarea
              rows={3}
              required={decision === 'CHANGES_REQUESTED'}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder={
                decision === 'CHANGES_REQUESTED'
                  ? 'State explicit changes required (e.g. Please specify rescue plan for roof MEWP access...)'
                  : 'Add any optional observation notes for contractor records...'
              }
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
              {isSubmitting ? 'Saving...' : 'Confirm Safety Decision'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
