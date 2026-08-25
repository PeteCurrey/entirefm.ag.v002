'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ImportStepper } from '@/components/admin/imports/ImportStepper';
import { AlertTriangle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';

export default function ConfirmImportPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [committing, setCommitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetch(`/api/import/${id}/preview`)
      .then((r) => r.json())
      .then((d) => { setBatch(d.batch); setLoading(false); });
  }, [id]);

  const handleCommit = async () => {
    if (!confirmed) return;
    setCommitting(true);
    setError('');
    try {
      const res = await fetch(`/api/import/${id}/commit`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Commit failed');
      }
      router.push(`/admin/platform/imports/${id}/result`);
    } catch (err: any) {
      setError(err.message);
      setCommitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center p-16 gap-2 text-[#686866]"><Loader2 className="h-5 w-5 animate-spin" /> Loading…</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-[22px] font-normal text-[#101010]">Confirm Import</h1>
        <p className="text-[13.5px] text-[#686866] mt-0.5">{batch?.batch_reference}</p>
      </div>

      <ImportStepper currentStep="CONFIRM" batchId={id} />

      {/* Summary */}
      <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-[#15803D]" />
          <h2 className="font-extralight text-[#101010] text-[15px]">Import Summary</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 font-mono">
          {[
            { label: 'Entity Type', value: batch?.entity_type },
            { label: 'Source System', value: batch?.source_system },
            { label: 'Total Rows', value: batch?.total_rows },
            { label: 'Valid → Import', value: batch?.valid_rows },
            { label: 'Errors (Skipped)', value: batch?.error_rows },
            { label: 'Duplicates (Skipped)', value: batch?.duplicate_rows },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-[8px] bg-[#F5F5F3] border border-[#E4E4E1] p-2.5">
              <div className="text-[10px] uppercase text-[#9B9B97]">{label}</div>
              <div className="text-[14px] font-normal text-[#101010] mt-0.5">{value ?? '—'}</div>
            </div>
          ))}
        </div>

        {/* Important Reminders */}
        <div className="rounded-[10px] border border-[#FDE68A] bg-[#FFFBEB] p-3.5 space-y-2 text-[12.5px] text-[#B45309]">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-[#D97706]" />
            <div>
              <p className="font-light text-[#92400E]">Important — read before confirming:</p>
              <ul className="mt-2 space-y-1.5 list-disc list-inside text-[12px]">
                {batch?.entity_type === 'CONTRACTOR' && (
                  <li>Imported contractors are staged as <strong>PENDING_ONBOARDING</strong> and are NOT automatically approved, compliant, or vetted.</li>
                )}
                {batch?.entity_type === 'CLIENT' && (
                  <li>No portal login invitations will be sent automatically. Invite clients separately from the Clients management page.</li>
                )}
                <li>This action creates EntireCAFM records with a full audit trail. It can be rolled back from Import History immediately after.</li>
                <li>AI has assisted in column mapping only. You are the authorised human committing this import.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Confirmation checkbox */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="h-4 w-4 accent-[#FF6B24]"
          />
          <span className="text-[13px] font-normal text-[#101010]">
            I have reviewed the data and authorise this import of {batch?.valid_rows} records.
          </span>
        </label>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-[12.5px] text-[#DC2626]">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <a href={`/admin/platform/imports/${id}/preview`} className="text-[13px] font-normal text-[#686866] hover:text-[#101010]">← Back to Preview</a>
        <button
          onClick={handleCommit}
          disabled={!confirmed || committing}
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#101010] px-6 py-2.5 text-[13px] font-normal text-white hover:bg-[#333] transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {committing ? (<><Loader2 className="h-4 w-4 animate-spin" /> Importing…</>) : (<><CheckCircle2 className="h-4 w-4" /> Commit Import</>)}
        </button>
      </div>
    </div>
  );
}
