'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reviewData: any) => void;
  workOrderNumber: string;
}

export function DynamicRiskReviewModal({ isOpen, onClose, onSuccess, workOrderNumber }: Props) {
  const [changedCondition, setChangedCondition] = useState('UNEXPECTED_SERVICES');
  const [hazardDetails, setHazardDetails] = useState('');
  const [additionalControls, setAdditionalControls] = useState('');
  const [canProceedSafely, setCanProceedSafely] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hazardDetails.trim() || !additionalControls.trim()) return;

    setIsSubmitting(true);
    onSuccess({
      changedCondition,
      hazardDetails,
      additionalControls,
      canProceedSafely,
      assessedAt: new Date().toISOString(),
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-void/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-edge-dark bg-brand-void/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                DYNAMIC RISK ASSESSMENT
              </span>
              <h2 className="text-base font-light text-white">Site Conditions Differ &bull; {workOrderNumber}</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-brand-mist/60 hover:text-white p-1 rounded-lg hover:bg-brand-edge-dark">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          <p className="text-brand-mist/80 font-sans leading-relaxed">
            Record changes between planned RAMS and actual physical site conditions before commencing work.
          </p>

          <div className="space-y-1">
            <label className="text-brand-mist/70 block font-sans">Identified Site Change *</label>
            <select
              value={changedCondition}
              onChange={(e) => setChangedCondition(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-xs font-mono focus:outline-none focus:border-brand-electric"
            >
              <option value="UNEXPECTED_SERVICES">Unexpected Live Services / Pipework</option>
              <option value="WATER_INGRESS">Water Ingress / Damp Electrical Area</option>
              <option value="CHANGED_WORK_AREA">Work Area Relocated or Restricted</option>
              <option value="ADDITIONAL_HEIGHT">Additional Unplanned Working at Height</option>
              <option value="PUBLIC_PRESENCE">Increased Public / Tenant Footfall</option>
              <option value="WEATHER_EXPOSURE">Adverse Weather / Wind on Roof</option>
              <option value="OTHER">Other Changed Condition</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-brand-mist/70 block font-sans">Specific Hazard Details *</label>
            <textarea
              rows={3}
              required
              value={hazardDetails}
              onChange={(e) => setHazardDetails(e.target.value)}
              placeholder="Describe the exact physical hazard encountered..."
              className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:outline-none focus:border-brand-electric"
            />
          </div>

          <div className="space-y-1">
            <label className="text-brand-mist/70 block font-sans">Additional Safeguards &amp; Controls Applied *</label>
            <textarea
              rows={3}
              required
              value={additionalControls}
              onChange={(e) => setAdditionalControls(e.target.value)}
              placeholder="Specify the physical controls applied (e.g. Additional barrier tape, secondary testing, harness anchor reassessment...)"
              className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:outline-none focus:border-brand-electric"
            />
          </div>

          <div className="p-3 rounded-lg bg-brand-void border border-brand-edge-dark space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="safe"
                checked={canProceedSafely}
                onChange={(e) => setCanProceedSafely(e.target.checked)}
                className="rounded border-brand-edge-dark bg-brand-carbon text-brand-electric focus:ring-0"
              />
              <label htmlFor="safe" className="text-white font-medium font-sans cursor-pointer">
                I confirm that with these additional controls, work can proceed safely.
              </label>
            </div>
            {!canProceedSafely && (
              <p className="text-rose-400 text-[11px] font-sans pl-6">
                If work cannot proceed safely, cancel and engage the Stop Work escalation.
              </p>
            )}
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
              disabled={!canProceedSafely || isSubmitting}
              className="px-5 py-2 rounded-lg bg-brand-electric hover:bg-brand-electric/85 text-white font-bold disabled:opacity-50"
            >
              Confirm Dynamic Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
