'use client';

import React, { useState } from 'react';
import { SupplierOpportunityRecord } from '@/server/allocation/allocation-types';
import { AlertCircle, Ban, CheckCircle2, Loader2, X } from 'lucide-react';

interface Props {
  initialOpportunities: SupplierOpportunityRecord[];
}

const NON_TERMINAL_STATUSES = new Set(['ISSUED', 'RESPONSES_RECEIVED', 'AWAITING_AWARD']);

export function OpportunitiesAdminTable({ initialOpportunities }: Props) {
  const [opps, setOpps] = useState<SupplierOpportunityRecord[]>(initialOpportunities);
  const [selectedOpp, setSelectedOpp] = useState<SupplierOpportunityRecord | null>(null);
  const [reason, setReason] = useState('Escalating to autonomous reactive auto-dispatch');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpp) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/operations/allocation/opportunities/${encodeURIComponent(selectedOpp.id)}/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to withdraw opportunity');
      }

      // Optimistically update list
      setOpps((prev) =>
        prev.map((o) => (o.id === selectedOpp.id ? { ...o, status: 'WITHDRAWN' } : o))
      );

      setFeedback({
        type: 'success',
        message: `Opportunity "${selectedOpp.title}" has been withdrawn. ${data.notified_contractors || 0} responding contractor(s) were notified. The work order is now unblocked for auto-dispatch.`,
      });
      setSelectedOpp(null);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'An error occurred during withdrawal',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {feedback && (
        <div
          className={`p-4 rounded-sm text-xs font-sans flex items-start gap-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <span className="flex-1 leading-relaxed">{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 text-xs ml-2"
          >
            &times;
          </button>
        </div>
      )}

      <div className="divide-y divide-slate-100 font-normal text-xs">
        {opps.length === 0 ? (
          <div className="py-8 text-center text-slate-500 font-sans">
            No supplier opportunities found in the platform.
          </div>
        ) : (
          opps.map((o) => {
            const isNonTerminal = NON_TERMINAL_STATUSES.has(o.status);

            return (
              <div
                key={o.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-sans text-sm">{o.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {o.opportunity_type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-slate-600 font-sans">{o.scope_summary}</p>
                  <span className="text-slate-400 text-[10.5px]">
                    City: {o.site_city} &middot; Basis: {o.commercial_basis} &middot; NTE: £
                    {o.not_to_exceed_gbp || '—'} &middot; Deadline:{' '}
                    {o.response_deadline.substring(0, 16).replace('T', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`font-bold px-2.5 py-1 rounded text-xs ${
                      o.status === 'WITHDRAWN'
                        ? 'text-amber-800 bg-amber-100'
                        : o.status === 'AWARDED'
                        ? 'text-emerald-800 bg-emerald-100'
                        : o.status === 'CANCELLED' || o.status === 'TIMED_OUT'
                        ? 'text-slate-600 bg-slate-100'
                        : 'text-blue-800 bg-blue-100'
                    }`}
                  >
                    {o.status}
                  </span>

                  {isNonTerminal && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOpp(o);
                        setReason('Escalating to autonomous reactive auto-dispatch');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* WITHDRAW MODAL */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Withdraw from Marketplace</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOpp(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="p-6 space-y-4 font-sans text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-xs leading-relaxed">
                <strong>Important:</strong> Withdrawing <strong>&quot;{selectedOpp.title}&quot;</strong> will mark
                this marketplace opportunity as <code className="bg-amber-100 px-1 py-0.5 rounded">WITHDRAWN</code>.
                Any contractor quotes or expressions of interest will be closed, and notifications will be dispatched.
                The underlying work order will immediately become eligible for System B Auto-Dispatch.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Withdrawal Reason / Transition Note
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  placeholder="e.g. Escalating to autonomous reactive auto-dispatch"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOpp(null)}
                  disabled={submitting}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition-colors font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-rose-600 text-white rounded font-medium text-xs hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-xs"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
