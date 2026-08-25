'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ImportStepper } from '@/components/admin/imports/ImportStepper';
import { ImportDryRunSummary } from '@/components/admin/imports/ImportDryRunSummary';
import { ValidationIssueList } from '@/components/admin/imports/ValidationIssueList';
import { Loader2 } from 'lucide-react';

export default function ReviewDuplicateConflictsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/import/${id}/preview`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center p-16 gap-2 text-[#686866]"><Loader2 className="h-5 w-5 animate-spin" /> Loading…</div>;
  }

  const preview = data && {
    batchId: data.batch.id,
    batchReference: data.batch.batch_reference,
    entityType: data.batch.entity_type,
    sourceSystem: data.batch.source_system,
    totalRows: data.batch.total_rows,
    validRows: data.batch.valid_rows,
    errorRows: data.batch.error_rows,
    duplicateRows: data.batch.duplicate_rows,
    newRows: data.batch.valid_rows,
    matchedExistingRows: data.batch.duplicate_rows,
    blockedRows: data.batch.error_rows,
    issues: data.issues || [],
    sampleMappedRows: (data.rows || []).slice(0, 10).map((r: any) => ({
      rowIndex: r.row_index,
      status: r.status,
      externalId: r.external_id,
      displayName: r.mapped_data?.name || r.mapped_data?.company_name || `Row ${r.row_index}`,
      details: r.mapped_data?.city || r.mapped_data?.email || '',
      issues: r.error_messages || [],
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-normal text-[#101010]">Review Duplicate Conflicts</h1>
        <p className="text-[13.5px] text-[#686866] mt-0.5">{data?.batch?.batch_reference}</p>
      </div>

      <ImportStepper currentStep="REVIEW" batchId={id} />

      {preview && <ImportDryRunSummary preview={preview} />}
      {data?.issues?.length > 0 && <ValidationIssueList issues={data.issues} batchId={id} />}

      <div className="flex items-center justify-between">
        <a href={'/admin/platform/imports/' + id + '/mapping'} className="text-[13px] font-normal text-[#686866] hover:text-[#101010]">← Back</a>
        {preview?.validRows > 0 && (
          <button
            onClick={() => router.push('/admin/platform/imports/' + id + '/confirm')}
            className="inline-flex items-center gap-2 rounded-[10px] bg-[#FF6B24] px-6 py-2.5 text-[13px] font-normal text-white hover:bg-[#E9540F] transition-colors shadow-sm"
          >
            Proceed to Confirm →
          </button>
        )}
      </div>
    </div>
  );
}
