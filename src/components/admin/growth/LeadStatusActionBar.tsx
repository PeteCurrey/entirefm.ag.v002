'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, PhoneCall, Sparkles, XCircle, ArrowRight, Loader2 } from 'lucide-react';

interface LeadStatusActionBarProps {
  leadId: string;
  currentStatus: string;
}

export function LeadStatusActionBar({ leadId, currentStatus }: LeadStatusActionBarProps) {
  const [status, setStatus] = useState(currentStatus || 'NEW');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${encodeURIComponent(leadId)}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } catch (e) {
      console.error('[STATUS_UPDATE_ERR]', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-normal text-zinc-300 uppercase tracking-wider">
          Qualification &amp; Status Actions
        </h3>
        <span
          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
            status === 'QUALIFIED' || status === 'WON'
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
              : status === 'OPPORTUNITY' || status === 'CONTACTED'
              ? 'bg-purple-950/60 text-purple-300 border-purple-800/40'
              : status === 'UNQUALIFIED' || status === 'SPAM'
              ? 'bg-red-950/60 text-red-300 border-red-800/40'
              : 'bg-pink-950/60 text-pink-300 border-pink-800/40'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          onClick={() => handleUpdate('CONTACTED')}
          disabled={loading || status === 'CONTACTED'}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-normal bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 disabled:opacity-50 transition-colors"
        >
          <PhoneCall className="h-3.5 w-3.5 text-blue-400" />
          <span>Mark Contacted</span>
        </button>

        <button
          onClick={() => handleUpdate('QUALIFIED')}
          disabled={loading || status === 'QUALIFIED'}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-normal bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 disabled:opacity-50 transition-colors"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>Qualify Lead</span>
        </button>

        <button
          onClick={() => handleUpdate('OPPORTUNITY')}
          disabled={loading || status === 'OPPORTUNITY'}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-normal bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-700/60 disabled:opacity-50 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>Move to Opportunity</span>
        </button>

        <button
          onClick={() => handleUpdate('UNQUALIFIED')}
          disabled={loading || status === 'UNQUALIFIED'}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-normal bg-zinc-800 hover:bg-red-950/40 text-zinc-400 hover:text-red-300 border border-zinc-700 disabled:opacity-50 transition-colors ml-auto"
        >
          <XCircle className="h-3.5 w-3.5 text-zinc-500" />
          <span>Unqualified</span>
        </button>
      </div>
    </div>
  );
}
