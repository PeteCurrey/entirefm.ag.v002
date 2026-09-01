'use client';

/**
 * CLIENT QUOTES & APPROVALS CLIENT (Phase 0M Addendum)
 * ====================================================
 * Allows clients to view quote scope, breakdown, VAT presentation,
 * and click APPROVE / DECLINE / ASK A QUESTION.
 */

import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, FileText, ArrowRight, Clock } from 'lucide-react';

interface Quote {
  id: string;
  quote_number: string;
  title: string;
  description?: string;
  total_price_gbp: number;
  status: string;
  created_at: string;
  site_name?: string;
}

interface Props {
  initialQuotes: Quote[];
  clientName: string;
}

export default function ClientQuotesClient({ initialQuotes, clientName }: Props) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  async function handleAction(action: 'APPROVE' | 'DECLINE' | 'QUESTION') {
    if (!selectedQuote) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/clients/quotes/${selectedQuote.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');

      setActionSuccess(data.message);
      setQuotes((prev) =>
        prev.map((q) => (q.id === selectedQuote.id ? { ...q, status: data.new_status } : q))
      );
      setTimeout(() => {
        setActionSuccess(null);
        setSelectedQuote(null);
      }, 2000);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  const pendingCount = quotes.filter((q) => ['DRAFT', 'ISSUED', 'PENDING_APPROVAL'].includes(q.status)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-edge-dark/60 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
            COMMERCIAL &bull; EXTRA WORKS AUTHORISATIONS
          </span>
          <h1 className="text-2xl font-light text-white mt-1">Quotes &amp; Approvals</h1>
          <p className="text-xs text-brand-mist/60 font-light mt-0.5">
            Review scopes of work, authorised rates, and approve quotations for {clientName}.
          </p>
        </div>
        <div className="text-xs font-normal text-brand-mist/70 bg-brand-carbon/60 px-3 py-1.5 rounded-lg border border-brand-edge-dark">
          {pendingCount} Awaiting Decision
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quotes Table (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
              <tr>
                <th className="px-5 py-3">Quote Ref</th>
                <th className="px-5 py-3">Scope / Title</th>
                <th className="px-5 py-3">Value (ex VAT)</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-brand-mist/40 text-xs">
                    No quotes currently on file.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => {
                  const isSelected = selectedQuote?.id === q.id;
                  const isPending = ['DRAFT', 'ISSUED', 'PENDING_APPROVAL'].includes(q.status);
                  return (
                    <tr
                      key={q.id}
                      onClick={() => setSelectedQuote(q)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-brand-electric/10' : 'hover:bg-brand-void/40'
                      }`}
                    >
                      <td className="px-5 py-3.5 text-brand-electric-bright font-medium">
                        {q.quote_number}
                      </td>
                      <td className="px-5 py-3.5 font-normal text-white">
                        <div>{q.title}</div>
                        {q.site_name && (
                          <span className="text-[11px] text-brand-mist/50 font-normal">{q.site_name}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-medium">
                        £{Number(q.total_price_gbp || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`rounded px-2 py-0.5 font-normal text-[10px] border ${
                            q.status === 'APPROVED'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : isPending
                              ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                              : 'bg-brand-edge-dark/40 border-brand-edge-dark text-brand-mist/60'
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-xs text-brand-electric hover:underline">
                          {isSelected ? 'Viewing' : 'Inspect →'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Quote Detail & Approval Panel (1 col) */}
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-5 flex flex-col justify-between">
          {!selectedQuote ? (
            <div className="py-16 text-center text-xs text-brand-mist/40 space-y-2">
              <FileText className="w-8 h-8 mx-auto opacity-40" />
              <p>Select a quote from the list to review details and approve.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-b border-brand-edge-dark/60 pb-3">
                <span className="text-[10px] uppercase tracking-widest text-brand-mist/50 font-bold">
                  PROPOSAL DETAILS
                </span>
                <h3 className="text-base font-medium text-white mt-0.5">{selectedQuote.title}</h3>
                <p className="text-xs font-normal text-brand-electric-bright mt-0.5">{selectedQuote.quote_number}</p>
              </div>

              {/* Price Breakdown */}
              <div className="rounded-lg bg-brand-void/80 border border-brand-edge-dark p-3 space-y-2">
                <div className="flex justify-between text-xs text-brand-mist/70">
                  <span>Net Price:</span>
                  <span className="font-normal text-white">
                    £{Number(selectedQuote.total_price_gbp || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-brand-mist/70">
                  <span>VAT (20%):</span>
                  <span className="font-normal text-white">
                    £{(Number(selectedQuote.total_price_gbp || 0) * 0.2).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t border-brand-edge-dark pt-2 text-white">
                  <span>Total Gross:</span>
                  <span className="font-normal text-emerald-400">
                    £{(Number(selectedQuote.total_price_gbp || 0) * 1.2).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Success Alert */}
              {actionSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300">
                  ✅ {actionSuccess}
                </div>
              )}

              {/* Optional Client Notes Input */}
              {['DRAFT', 'ISSUED', 'PENDING_APPROVAL'].includes(selectedQuote.status) && !actionSuccess && (
                <div className="space-y-3 pt-2">
                  <label className="block text-[11px] font-normal text-brand-mist/60 uppercase">
                    Approval / Query Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any purchase order reference or specific access instructions..."
                    rows={2}
                    className="w-full rounded-lg border border-brand-edge-dark bg-brand-void p-2 text-xs text-white placeholder:text-brand-mist/40 focus:outline-none focus:border-brand-electric resize-none"
                  />

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleAction('APPROVE')}
                      disabled={submitting}
                      className="py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Quote
                    </button>
                    <button
                      onClick={() => handleAction('DECLINE')}
                      disabled={submitting}
                      className="py-2.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Decline
                    </button>
                  </div>

                  <button
                    onClick={() => handleAction('QUESTION')}
                    disabled={submitting}
                    className="w-full py-2 rounded-lg border border-brand-edge-dark bg-brand-void hover:bg-brand-carbon text-brand-mist text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> Ask a Question
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
