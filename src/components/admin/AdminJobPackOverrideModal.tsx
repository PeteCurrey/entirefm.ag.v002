'use client';

import React, { useState } from 'react';
import { X, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { JobPackRecord } from '@/server/contractor/job-pack-engine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jobPack: JobPackRecord;
}

export function AdminJobPackOverrideModal({ isOpen, onClose, onSuccess, jobPack }: Props) {
  const [reason, setReason] = useState('');
  const [scope, setScope] = useState('Emergency / Supervised Attendance Clearance');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Override reason is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/job-packs/${encodeURIComponent(jobPack.id)}/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: reason.trim(),
          scope: scope.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Override failed');

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
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                OPERATIONAL OVERRIDE
              </span>
              <h2 className="text-base font-light text-slate-900">Authorise Pre-Attendance Clearance</h2>
            </div>
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
            <div className="text-slate-900 font-bold font-sans text-sm">{jobPack.workOrderNumber}</div>
            <div className="text-slate-600 text-[11px]">
              Contractor: <strong className="text-slate-900">{jobPack.contractorName}</strong>
            </div>
            <div className="text-slate-500 text-[10.5px]">
              Current Readiness: <span className="text-rose-700 font-bold">{jobPack.readiness.status}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-slate-600 font-bold block">
              Authorised Override Scope *
            </label>
            <input
              type="text"
              required
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full p-2 rounded border border-slate-200 text-xs font-normal"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-slate-600 font-bold block">
              Operational Justification &amp; Mitigations *
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State explicit operational justification (e.g. Operative attending under direct level 3 supervision with physical site permit verification at gate...)"
              className="w-full p-2.5 rounded border border-slate-200 font-sans text-xs focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-sans">
            Authorising this override records an immutable audit event with your EntireFM identity. Critical statutory requirements remain recorded.
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
              className="px-5 py-2 rounded text-white font-bold bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Authorising...' : 'Confirm Authorised Override'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
