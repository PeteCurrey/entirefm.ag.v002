'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ImportStepper } from '@/components/admin/imports/ImportStepper';
import { ColumnMappingTable } from '@/components/admin/imports/ColumnMappingTable';
import { AlertCircle } from 'lucide-react';

export default function MappingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [batchData, setBatchData] = useState<any>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/import/${id}/preview`)
      .then((r) => r.json())
      .then((data) => {
        setBatchData(data);
        setMapping(data.batch?.mapping_config || {});
        setLoading(false);
      })
      .catch(() => { setError('Failed to load import batch.'); setLoading(false); });
  }, [id]);

  const handleApplyMapping = async () => {
    setApplying(true);
    setError('');
    try {
      const res = await fetch(`/api/import/${id}/mapping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapping }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Failed to apply mapping');
      }
      router.push(`/admin/platform/imports/${id}/preview`);
    } catch (err: any) {
      setError(err.message);
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-16 text-[#686866]">Loading import batch…</div>;
  }

  const headers = batchData?.file?.raw_headers || [];
  const sampleRows = batchData?.rows?.slice(0, 3).map((r: any) => r.raw_data) || [];
  const entityType = batchData?.batch?.entity_type || 'CLIENT';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-semibold text-[#101010]">Map CSV Columns</h1>
        <p className="text-[13.5px] text-[#686866] mt-0.5">
          {batchData?.batch?.batch_reference} · {batchData?.batch?.entity_type} · {batchData?.batch?.source_system}
        </p>
      </div>

      <ImportStepper currentStep="MAP" batchId={id} />

      <ColumnMappingTable
        headers={headers}
        sampleRows={sampleRows}
        mapping={mapping}
        onMappingChange={(col, target) => setMapping((prev) => ({ ...prev, [col]: target }))}
        entityType={entityType}
      />

      {error && (
        <div className="flex items-start gap-2 rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-[12.5px] text-[#DC2626]">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <a href="/admin/platform/imports" className="text-[13px] font-medium text-[#686866] hover:text-[#101010]">← Back</a>
        <button
          onClick={handleApplyMapping}
          disabled={applying}
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#FF6B24] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[#E9540F] transition-colors shadow-sm disabled:opacity-50"
        >
          {applying ? 'Validating…' : 'Apply Mapping & Validate →'}
        </button>
      </div>
    </div>
  );
}
