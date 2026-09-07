'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ClientInvoiceXeroSyncActionProps {
  invoiceId: string;
  isIssued: boolean;
  currentSyncStatus: string;
  xeroInvoiceId?: string | null;
}

export function ClientInvoiceXeroSyncAction({
  invoiceId,
  isIssued,
  currentSyncStatus,
  xeroInvoiceId,
}: ClientInvoiceXeroSyncActionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const isSynced = currentSyncStatus === 'SYNCED' && !!xeroInvoiceId;

  async function handleSync() {
    if (!isIssued) {
      alert('Invoice must be in ISSUED status before synchronising to Xero.');
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/finance/client-invoices/${invoiceId}/sync-xero`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFeedback({
          type: 'success',
          message: `Invoice synchronised to Xero (Xero Ref: ${data.xeroInvoiceNumber || data.xeroInvoiceId})`,
        });
        router.refresh();
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to synchronise invoice to Xero.',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Network error attempting Xero synchronisation.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={handleSync}
          disabled={loading || !isIssued}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition ${
            !isIssued
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : isSynced
              ? 'bg-brand-void border border-brand-edge-dark text-brand-mist hover:text-white hover:border-brand-mist/40'
              : 'bg-brand-electric text-black hover:bg-white'
          }`}
        >
          {loading ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : isSynced ? (
            <RefreshCw className="h-3.5 w-3.5" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          {loading
            ? 'Synchronising...'
            : isSynced
            ? 'Re-sync to Xero'
            : 'Sync to Xero'}
        </button>

        {!isIssued && (
          <span className="text-[11px] text-zinc-500">
            Invoice must be issued before sending to Xero
          </span>
        )}
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg text-xs font-normal border ${
            feedback.type === 'success'
              ? 'border-emerald-800/40 bg-emerald-950/40 text-emerald-300'
              : 'border-red-800/40 bg-red-950/40 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
}
