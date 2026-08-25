'use client';

import React, { useState } from 'react';

interface QuoteScopeConfirmProps {
  visitId: string;
  workOrderId?: string;
  scopeDescription: string;
  engineersCount: number;
  estimatedHours: number;
  materials: Array<{ description: string; quantity: number; unit?: string }>;
  onSubmitted?: (scopeId: string) => void;
  onCancel?: () => void;
}

export function QuoteScopeConfirm({
  visitId,
  workOrderId,
  scopeDescription,
  engineersCount,
  estimatedHours,
  materials,
  onSubmitted,
  onCancel,
}: QuoteScopeConfirmProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/engineer/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_QUOTE_SCOPE',
          visitId,
          workOrderId,
          scopeDescription,
          engineersCount,
          estimatedHours,
          materials,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to submit quote scope');

      setSubmitted(true);
      if (onSubmitted) onSubmitted(json.id);
    } catch (err: any) {
      setError(err.message || 'Error submitting scope');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center space-y-3">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-lg">
          ✓
        </div>
        <h4 className="text-[14px] font-normal text-white">Quote Scope Submitted</h4>
        <p className="text-[12px] text-brand-mist/80">
          Your field scope has been transferred to the Commercial Operations Desk for rate card matching and client proposal creation.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
        <h4 className="text-[14px] font-normal text-white flex items-center gap-2">
          <span>📋</span> Confirm Quoting Scope
        </h4>
        <span className="rounded bg-brand-electric/15 px-2 py-0.5 font-mono text-[10px] text-brand-electric-bright">
          Field Estimate Only
        </span>
      </div>

      {error && (
        <div className="rounded bg-rose-500/10 border border-rose-500/20 p-3 text-[12px] text-rose-300">
          {error}
        </div>
      )}

      {/* Scope Narrative */}
      <div>
        <label className="font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/50 block mb-1">
          Work Description
        </label>
        <p className="text-[12.5px] text-brand-mist/90 bg-brand-void/60 rounded p-3 border border-brand-edge-dark/60">
          {scopeDescription}
        </p>
      </div>

      {/* Labour & Resources */}
      <div className="grid grid-cols-2 gap-3 text-[12px]">
        <div className="rounded bg-brand-void/40 p-3 border border-brand-edge-dark/40">
          <span className="font-mono text-[10px] text-brand-mist/40 block">Estimated Labour</span>
          <span className="font-mono font-normal text-white text-[13px]">{estimatedHours} hours</span>
        </div>
        <div className="rounded bg-brand-void/40 p-3 border border-brand-edge-dark/40">
          <span className="font-mono text-[10px] text-brand-mist/40 block">Team Required</span>
          <span className="font-mono font-normal text-white text-[13px]">{engineersCount} Engineer(s)</span>
        </div>
      </div>

      {/* Materials */}
      <div>
        <label className="font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/50 block mb-1">
          Required Materials ({materials.length})
        </label>
        {materials.length > 0 ? (
          <ul className="divide-y divide-brand-edge-dark/40 rounded border border-brand-edge-dark/60 bg-brand-void/40">
            {materials.map((m, idx) => (
              <li key={idx} className="flex items-center justify-between p-2.5 text-[12px]">
                <span className="text-brand-mist/90">{m.description}</span>
                <span className="font-mono text-brand-electric-bright font-normal">
                  {m.quantity} {m.unit || 'unit'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[11.5px] text-brand-mist/40 italic">No additional parts/materials specified.</p>
        )}
      </div>

      {/* Governance Notice */}
      <p className="text-[11px] text-brand-mist/50 italic">
        Commercial pricing, rate cards, and client proposals are calculated deterministically by EntireFM CAFM. Pricing is not displayed on mobile field devices.
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 rounded-lg border border-brand-edge-dark bg-brand-void py-3 text-[13px] font-normal text-brand-mist hover:text-white"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 rounded-lg bg-brand-electric py-3 text-[13px] font-normal text-white hover:bg-brand-indigo shadow-lg transition-colors"
        >
          {submitting ? 'Submitting Scope...' : 'Submit for Quotation →'}
        </button>
      </div>
    </div>
  );
}
