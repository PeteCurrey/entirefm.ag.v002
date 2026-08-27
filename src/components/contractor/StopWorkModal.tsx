'use client';

import React, { useState } from 'react';
import { X, AlertOctagon, AlertTriangle, ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jobPackId: string;
  workOrderNumber: string;
}

export function StopWorkModal({ isOpen, onClose, onSuccess, jobPackId, workOrderNumber }: Props) {
  const [reasonCategory, setReasonCategory] = useState('UNSAFE_SITE_CONDITION');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      setErrorMsg('Please describe the unsafe site condition in detail.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/contractor/job-packs/${encodeURIComponent(jobPackId)}/stop-work`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reasonCategory,
          details: details.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to record stop-work event');

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-void/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-brand-carbon border border-rose-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-800/40 bg-rose-950/30">
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300 font-bold">
                SAFETY ESCALATION
              </span>
              <h2 className="text-base font-light text-white">Stop Work &bull; {workOrderNumber}</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-brand-mist/60 hover:text-white p-1 rounded-lg hover:bg-brand-edge-dark">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <p className="text-brand-mist/80 font-sans leading-relaxed">
            If you encounter unmanaged safety risks, unexpected live services, suspect asbestos materials, or missing permits, engage the safety stop-work procedure immediately.
          </p>

          <div className="space-y-1">
            <label className="text-brand-mist/70 block font-sans">Primary Safety Reason *</label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-xs font-mono focus:outline-none focus:border-rose-500"
            >
              <option value="UNSAFE_SITE_CONDITION">Unsafe Site / Structural Condition</option>
              <option value="ASBESTOS_SUSPECTED">Suspect Asbestos Material Identified</option>
              <option value="INCORRECT_ISOLATION">Inability to Safely Isolate Services (LOTO)</option>
              <option value="PERMIT_UNAVAILABLE">Mandatory Site Permit Unavailable / Refused</option>
              <option value="LACK_OF_SAFE_ACCESS">Lack of Safe Working Access / Fragile Roof</option>
              <option value="PUBLIC_SAFETY_RISK">Immediate Public / Occupant Safety Hazard</option>
              <option value="OTHER">Other Safety-Critical Issue</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-brand-mist/70 block font-sans">Detailed Observations &amp; Actions Taken *</label>
            <textarea
              rows={4}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Detail the exact location, condition observed, initial make-safe actions taken, and who on site was notified..."
              className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="p-3 rounded-lg bg-brand-void/50 border border-brand-edge-dark text-[11px] text-brand-mist/60 font-sans">
            Engaging Stop Work will immediately update the Job Pack readiness state, notify EntireFM 24/7 Operations, and record an immutable safety audit event.
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-edge-dark/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-brand-edge-dark text-brand-mist hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Engage Safety Stop Work'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
