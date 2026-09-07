'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle, ArrowUpRight, Ban, Loader2, ShieldAlert } from 'lucide-react';

interface SupplierInvoiceActionsProps {
  invoiceId: string;
  processingStatus: string;
  actualCostPosted: boolean;
  bankDetailsAlert: boolean;
  bankAlertReviewed: boolean;
  isHighValue: boolean;
}

export function SupplierInvoiceActions({
  invoiceId,
  processingStatus,
  actualCostPosted,
  bankDetailsAlert,
  bankAlertReviewed,
  isHighValue,
}: SupplierInvoiceActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeAmount, setDisputeAmount] = useState('');

  const handleApprove = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/finance/supplier-invoices/${invoiceId}/approve`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to approve invoice');
      }
      setSuccess('Invoice approved successfully');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostActualCost = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/finance/supplier-invoices/${invoiceId}/post-actual-cost`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to post actual cost');
      }
      setSuccess(`Actual cost posted successfully to ${data.workOrdersUpdated?.length ?? 0} work order(s) and consumed ${data.commitmentsConsumed?.length ?? 0} commitment(s).`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) {
      setError('Please provide a dispute reason');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/finance/supplier-invoices/${invoiceId}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: disputeReason,
          disputeAmountGbp: disputeAmount ? parseFloat(disputeAmount) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispute invoice');
      }
      setShowDisputeModal(false);
      setSuccess('Invoice marked as disputed');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const canApprove = ['MATCHING', 'REVIEW_REQUIRED'].includes(processingStatus) && (!bankDetailsAlert || bankAlertReviewed);
  const canPostCost = processingStatus === 'APPROVED' && !actualCostPosted;

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {bankDetailsAlert && !bankAlertReviewed && (
        <div className="p-3 bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs rounded-lg flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
          <span>Bank detail change must be verified before approval can proceed.</span>
        </div>
      )}

      {isHighValue && (
        <div className="text-[11px] text-[#6D6D68] font-mono">
          High-Value Invoice (&gt;£5,000): Segregation of duties enforced — PO creator cannot approve.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {canApprove && (
          <button
            onClick={handleApprove}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            Approve Invoice
          </button>
        )}

        {canPostCost && (
          <button
            onClick={handlePostActualCost}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-electric hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
            Post Actual Cost
          </button>
        )}

        {actualCostPosted && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 rounded-lg text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Actual Cost Posted to Work Order &amp; Commitment
          </div>
        )}

        {['MATCHING', 'REVIEW_REQUIRED'].includes(processingStatus) && (
          <button
            onClick={() => setShowDisputeModal(true)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/40 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
          >
            <Ban className="h-3.5 w-3.5" />
            Dispute
          </button>
        )}
      </div>

      {showDisputeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E8E5] rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
              <h3 className="text-sm font-semibold text-[#111111]">Dispute Supplier Invoice</h3>
              <button
                onClick={() => setShowDisputeModal(false)}
                className="text-[#6D6D68] hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleDispute} className="space-y-4">
              <div>
                <label className="block text-xs text-[#111111] mb-1">Dispute Reason *</label>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Quantity variance: billed for 5 hours but site manager confirmed 3 hours attendance."
                  className="w-full bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg p-2.5 text-xs text-white placeholder-brand-mist/40 focus:outline-none focus:border-brand-electric"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-[#111111] mb-1">Disputed Amount (£ GBP, optional)</label>
                <input
                  type="number"
                  step="0.01"
                  value={disputeAmount}
                  onChange={(e) => setDisputeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg p-2.5 text-xs text-white placeholder-brand-mist/40 focus:outline-none focus:border-brand-electric"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="px-3 py-1.5 text-xs text-[#111111] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Confirm Dispute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
