'use client';

import { useState } from 'react';
import Link from 'next/link';
import type {
  NormalisedIntelligenceItem,
  EntireFMTenderRecord,
} from '@/server/intelligence/intelligence-engine';

interface AdminIntelligenceClientProps {
  initialSummary: {
    requiresComplianceReview: number;
    newRegulatoryEvents: number;
    newTenderMatches: number;
    imminentTenderDeadlines: number;
    sourceHealthIssues: number;
    sourceCredentialRequired: number;
  };
  initialPendingItems: NormalisedIntelligenceItem[];
  initialTenderHighlights: EntireFMTenderRecord[];
}

export function AdminIntelligenceClient({
  initialSummary,
  initialPendingItems,
  initialTenderHighlights,
}: AdminIntelligenceClientProps) {
  const [summary] = useState(initialSummary);
  const [pendingItems, setPendingItems] = useState(initialPendingItems);
  const [selectedItem, setSelectedItem] = useState<NormalisedIntelligenceItem | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedItem) return;
    setProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/admin/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: reviewDecision === 'APPROVED' ? 'APPROVE' : 'REJECT',
          itemId: selectedItem.id,
          notes: reviewNotes,
        }),
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Review submission failed');

      // Remove from pending
      setPendingItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
      setSelectedItem(null);
      setReviewNotes('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              EntireFM Admin Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Intelligence Governance & Tender Radar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review incoming regulatory changes, manage source health, and assess internal public sector tender opportunities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/intelligence/tenders"
            className="px-4 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            Open Tender Radar ↗
          </Link>
          <Link
            href="/admin/intelligence/sources"
            className="px-4 py-2.5 text-xs font-semibold bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
          >
            Source Registry
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase block">Pending Compliance Reviews</span>
          <p className="text-3xl font-bold text-amber-600 mt-1">{summary.requiresComplianceReview}</p>
          <span className="text-xs text-gray-400 mt-1 block">Awaiting human sign-off</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase block">New Tender Matches</span>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{summary.newTenderMatches}</p>
          <span className="text-xs text-gray-400 mt-1 block">Internal EntireFM BD opportunities</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase block">Imminent Tender Deadlines</span>
          <p className="text-3xl font-bold text-rose-600 mt-1">{summary.imminentTenderDeadlines}</p>
          <span className="text-xs text-gray-400 mt-1 block">Closing within 5 days</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase block">Source Health Status</span>
          <p className="text-3xl font-bold text-emerald-600 mt-1">
            {summary.sourceHealthIssues === 0 ? 'Optimal' : `${summary.sourceHealthIssues} Issues`}
          </p>
          <span className="text-xs text-gray-400 mt-1 block">
            {summary.sourceCredentialRequired > 0 ? `${summary.sourceCredentialRequired} API keys unconfigured` : 'All connectors healthy'}
          </span>
        </div>
      </div>

      {/* Main Grid: Pending Reviews & Tender Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Pending Review Queue */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900">
              Regulatory Review Queue ({pendingItems.length})
            </h2>
            <span className="text-xs text-gray-400">Human gate before publishing to contractors</span>
          </div>

          {pendingItems.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">No regulatory items awaiting review.</p>
          ) : (
            <div className="space-y-3">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-blue-300 transition-all cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Tier {item.authorityTier}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{item.sourceName}</span>
                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded ml-auto">
                      {item.severity}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.entirefmSummary}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Internal Tender Radar Quick View */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">EntireFM Tender Radar Highlights</h2>
              <span className="text-xs text-indigo-600 font-medium">Internal BD intelligence only</span>
            </div>
            <Link
              href="/admin/intelligence/tenders"
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Full Radar →
            </Link>
          </div>

          {initialTenderHighlights.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">No active tender opportunities matching EntireFM criteria.</p>
          ) : (
            <div className="space-y-3">
              {initialTenderHighlights.slice(0, 4).map((record) => (
                <div key={record.id} className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      Match: {record.matchScore}% ({record.matchStrength})
                    </span>
                    {record.opportunity.estimatedValueFormatted && (
                      <span className="text-xs font-bold text-gray-900">
                        {record.opportunity.estimatedValueFormatted}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mt-1">{record.opportunity.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{record.opportunity.buyerName} • {record.opportunity.buyerRegion}</p>
                  {record.opportunity.closingDate && (
                    <span className="text-[11px] text-rose-600 font-medium block mt-2">
                      Closing: {record.opportunity.closingDate} ({record.deadlineUrgency})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                  Tier {selectedItem.authorityTier} • {selectedItem.sourceName}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-2">{selectedItem.title}</h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase">Proposed Summary</h3>
              <p className="text-sm text-gray-700 mt-1">{selectedItem.entirefmSummary}</p>
            </div>

            {selectedItem.whatChanged && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase">Semantic Diff</h3>
                <p className="text-xs text-gray-600 mt-1">{selectedItem.whatChanged}</p>
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Decision</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="decision"
                      value="APPROVED"
                      checked={reviewDecision === 'APPROVED'}
                      onChange={() => setReviewDecision('APPROVED')}
                    />
                    Approve & Publish to Eligible Contractors
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="decision"
                      value="REJECTED"
                      checked={reviewDecision === 'REJECTED'}
                      onChange={() => setReviewDecision('REJECTED')}
                    />
                    Reject / Do Not Publish
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Review Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Internal rationale for this decision…"
                  rows={2}
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  {processing ? 'Saving…' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2.5 border border-gray-200 text-xs font-semibold rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
