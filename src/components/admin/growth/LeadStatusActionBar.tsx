'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, PhoneCall, Sparkles, XCircle } from 'lucide-react';
import { StatusDot } from '@/components/admin/DataTable';

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

  const statusType: 'new' | 'active' | 'warning' | 'neutral' | 'completed' =
    status === 'QUALIFIED' || status === 'WON'
      ? 'active'
      : status === 'OPPORTUNITY' || status === 'PROPOSAL' || status === 'CONTACTED'
      ? 'warning'
      : status === 'SPAM'
      ? 'warning'
      : status === 'NEW'
      ? 'new'
      : 'neutral';

  return (
    <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
        <h3 className="text-[11px] font-normal text-[#6D6D68] uppercase tracking-wider">
          Qualification &amp; Status
        </h3>
        <StatusDot
          status={statusType}
          label={
            <span className="font-medium text-[11px] uppercase tracking-wider text-[#111111]">
              {status}
            </span>
          }
        />
      </div>

      <div className="flex flex-col gap-2 pt-1">
        {status === 'SPAM' ? (
          <button
            onClick={() => handleUpdate('NEW')}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 rounded-[6px] text-[12.5px] font-normal bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-40 transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Restore as Genuine (New Lead)</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => handleUpdate('QUALIFIED')}
              disabled={loading || status === 'QUALIFIED'}
              className="inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 rounded-[6px] text-[12.5px] font-normal bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-xs disabled:opacity-40 transition-colors"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Qualify Lead</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleUpdate('CONTACTED')}
                disabled={loading || status === 'CONTACTED'}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-[11.5px] font-normal bg-[#FAFAF8] hover:bg-[#F0F0EE] text-[#111111] border border-[#E8E8E5] disabled:opacity-40 transition-colors"
              >
                <PhoneCall className="h-3.5 w-3.5 text-[#6D6D68]" />
                <span>Mark Contacted</span>
              </button>

              <button
                onClick={() => handleUpdate('OPPORTUNITY')}
                disabled={loading || status === 'OPPORTUNITY'}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-[11.5px] font-normal bg-[#FAFAF8] hover:bg-[#F0F0EE] text-[#111111] border border-[#E8E8E5] disabled:opacity-40 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#EA580C]" />
                <span>Opportunity</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => handleUpdate('UNQUALIFIED')}
                disabled={loading || status === 'UNQUALIFIED'}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-[11.5px] font-normal text-[#6D6D68] hover:text-[#111111] bg-[#FAFAF8] hover:bg-[#F0F0EE] border border-[#E8E8E5] disabled:opacity-40 transition-colors"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Archive</span>
              </button>

              <button
                onClick={() => handleUpdate('SPAM')}
                disabled={loading}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-[11.5px] font-normal text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 disabled:opacity-40 transition-colors"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Mark as Spam</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

