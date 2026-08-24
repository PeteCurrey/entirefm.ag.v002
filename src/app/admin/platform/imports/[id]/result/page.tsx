'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ImportStepper } from '@/components/admin/imports/ImportStepper';
import { CheckCircle2, AlertTriangle, RotateCcw, ArrowRight, Building2, Users, Wrench, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ImportResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rollingBack, setRollingBack] = useState(false);
  const [rollbackSuccess, setRollbackSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchBatch = () => {
    fetch(`/api/import/${id}/preview`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError('Failed to load batch result.'); setLoading(false); });
  };

  useEffect(() => {
    fetchBatch();
  }, [id]);

  const handleRollback = async () => {
    if (!confirm('Are you sure you want to rollback this import? This will remove all records created by this batch.')) {
      return;
    }
    setRollingBack(true);
    setError('');
    try {
      const res = await fetch(`/api/import/${id}/rollback`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Rollback failed');
      }
      setRollbackSuccess(true);
      fetchBatch();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRollingBack(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center p-16 gap-2 text-[#686866]"><Loader2 className="h-5 w-5 animate-spin" /> Loading…</div>;

  const batch = data?.batch;
  const isRolledBack = batch?.status === 'ROLLED_BACK';
  const isSuccess = batch?.status === 'COMPLETED' || batch?.status === 'COMPLETED_WITH_ERRORS';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-[22px] font-semibold text-[#101010]">Import Results</h1>
        <p className="text-[13.5px] text-[#686866] mt-0.5">{batch?.batch_reference}</p>
      </div>

      <ImportStepper currentStep="RESULT" batchId={id} />

      {/* Outcome Banner */}
      <div className={`rounded-[16px] border p-6 text-center space-y-3 ${
        isRolledBack
          ? 'border-[#E4E4E1] bg-[#F5F5F3]'
          : isSuccess
          ? 'border-[#BBF7D0] bg-[#F0FDF4]'
          : 'border-[#FECACA] bg-[#FEF2F2]'
      }`}>
        <div className="flex justify-center">
          {isRolledBack ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E4E4E1] text-[#686866]">
              <RotateCcw className="h-6 w-6" />
            </div>
          ) : isSuccess ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#15803D] text-white shadow-md">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DC2626] text-white shadow-md">
              <AlertTriangle className="h-6 w-6" />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-[18px] font-semibold text-[#101010]">
            {isRolledBack
              ? 'Import Batch Rolled Back'
              : isSuccess
              ? `Successfully Imported ${batch?.imported_rows} Records`
              : 'Import Failed'}
          </h2>
          <p className="text-[13px] text-[#686866] mt-1">
            {isRolledBack
              ? `All ${batch?.rolled_back_rows} records created by this batch have been removed.`
              : isSuccess
              ? `${batch?.entity_type} records are now live and operational in EntireCAFM.`
              : 'Please review error logs below.'}
          </p>
        </div>
      </div>

      {/* Stats Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        {[
          { label: 'Total Rows', value: batch?.total_rows, color: 'text-[#101010]' },
          { label: 'Imported', value: batch?.imported_rows, color: 'text-[#15803D]' },
          { label: 'Errors (Skipped)', value: batch?.error_rows, color: batch?.error_rows > 0 ? 'text-[#DC2626]' : 'text-[#9B9B97]' },
          { label: 'Duplicates', value: batch?.duplicate_rows, color: 'text-[#9B9B97]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-[12px] border border-[#E4E4E1] bg-[#FFFFFF] p-3.5 text-center">
            <div className={`text-[22px] font-light tabular-nums ${color}`}>{value ?? 0}</div>
            <div className="text-[10px] uppercase text-[#9B9B97] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Navigation to imported entities */}
      {isSuccess && !isRolledBack && (
        <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686866]">
            VIEW IMPORTED DATA IN ENTIRECAFM
          </h3>
          <div className="flex flex-wrap gap-3">
            {batch?.entity_type === 'CLIENT' && (
              <Link
                href="/admin/estate/clients"
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#FF6B24] px-4 py-2 text-[12.5px] font-medium text-white hover:bg-[#E9540F] transition-colors"
              >
                <Users className="h-4 w-4" /> View Client Accounts <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            {batch?.entity_type === 'SITE' && (
              <Link
                href="/admin/estate/sites"
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#FF6B24] px-4 py-2 text-[12.5px] font-medium text-white hover:bg-[#E9540F] transition-colors"
              >
                <Building2 className="h-4 w-4" /> View Sites Register <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            {batch?.entity_type === 'CONTRACTOR' && (
              <Link
                href="/admin/estate/contractors"
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#FF6B24] px-4 py-2 text-[12.5px] font-medium text-white hover:bg-[#E9540F] transition-colors"
              >
                <Wrench className="h-4 w-4" /> View Contractors Register <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-[12.5px] text-[#DC2626]">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Rollback & Exit Actions */}
      <div className="flex items-center justify-between border-t border-[#E4E4E1] pt-5">
        <div>
          {isSuccess && !isRolledBack && (
            <button
              onClick={handleRollback}
              disabled={rollingBack}
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-3.5 py-1.5 text-[12px] font-medium text-[#DC2626] hover:bg-[#FEE2E2] transition-colors disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {rollingBack ? 'Rolling back…' : 'Rollback This Import'}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/platform/imports"
            className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] px-4 py-2 text-[12.5px] font-medium text-[#101010] hover:bg-[#F5F5F3] transition-colors"
          >
            Import Centre Home
          </Link>
          <Link
            href="/admin/platform/imports/new"
            className="rounded-[10px] bg-[#101010] px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-[#333] transition-colors"
          >
            Import Next File →
          </Link>
        </div>
      </div>
    </div>
  );
}
