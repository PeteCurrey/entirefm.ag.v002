'use client';

import React, { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ImportStepper } from '@/components/admin/imports/ImportStepper';
import { FileUp, Users, Building2, Wrench, AlertCircle, CheckCircle2 } from 'lucide-react';

const ENTITY_TYPES = [
  { id: 'CLIENT', label: 'Clients / Accounts', icon: Users, description: 'SimPRO Customer export CSV', color: 'bg-[#1D4ED8]' },
  { id: 'SITE', label: 'Sites / Facilities', icon: Building2, description: 'SimPRO Site export CSV', color: 'bg-[#15803D]' },
  { id: 'CONTRACTOR', label: 'Contractors / Suppliers', icon: Wrench, description: 'SimPRO Supplier export CSV', color: 'bg-[#D97706]' },
];

const SOURCE_SYSTEMS = [
  { id: 'SIMPRO', label: 'SimPRO' },
  { id: 'BIGCHANGE', label: 'BigChange' },
  { id: 'JOBLOGIC', label: 'Joblogic' },
  { id: 'GENERIC_CSV', label: 'Generic CSV' },
];

export default function NewImportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get('type') || '';

  const [selectedEntityType, setSelectedEntityType] = useState<string>(preselectedType);
  const [selectedSourceSystem, setSelectedSourceSystem] = useState<string>('SIMPRO');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('Only CSV files are supported. Please convert your data to CSV format.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('File exceeds the 25 MB maximum allowed size.');
      return;
    }
    setError('');
    setCsvFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!selectedEntityType || !csvFile) return;
    setUploading(true);
    setError('');

    try {
      const fileContent = await csvFile.text();
      const res = await fetch('/api/import/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: selectedEntityType,
          sourceSystem: selectedSourceSystem,
          filename: csvFile.name,
          fileContent,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Upload failed');
      }

      const data = await res.json();
      router.push(`/admin/platform/imports/${data.batch.id}/mapping`);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-[22px] font-semibold text-[#101010]">New Data Import</h1>
        <p className="text-[13.5px] text-[#686866] mt-0.5">Upload a SimPRO CSV export to begin migrating your operational data.</p>
      </div>

      <ImportStepper currentStep="UPLOAD" />

      {/* 1. Entity Type Selection */}
      <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686866] mb-4">STEP 1 — SELECT DATA TYPE</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ENTITY_TYPES.map(({ id, label, icon: Icon, description, color }) => (
            <button
              key={id}
              onClick={() => setSelectedEntityType(id)}
              className={`flex flex-col items-start gap-2 rounded-[12px] border p-4 text-left transition-all ${
                selectedEntityType === id
                  ? 'border-[#FF6B24] bg-[#FFF7F3] shadow-[0_0_0_2px_rgba(255,107,36,0.15)]'
                  : 'border-[#E4E4E1] bg-[#FFFFFF] hover:border-[#D0D0CD]'
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-[8px] ${color} text-white`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-[13px] text-[#101010]">{label}</p>
                <p className="text-[11.5px] text-[#686866] mt-0.5">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Source System Selection */}
      <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686866] mb-4">STEP 2 — SOURCE SYSTEM</h2>
        <div className="flex flex-wrap gap-2">
          {SOURCE_SYSTEMS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSelectedSourceSystem(id)}
              className={`rounded-[8px] border px-4 py-2 text-[13px] font-medium transition-all ${
                selectedSourceSystem === id
                  ? 'border-[#FF6B24] bg-[#FF6B24] text-white'
                  : 'border-[#E4E4E1] bg-[#FFFFFF] text-[#686866] hover:border-[#D0D0CD]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. File Upload */}
      <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686866] mb-4">STEP 3 — UPLOAD CSV FILE</h2>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onClick={() => fileRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-[12px] border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-[#FF6B24] bg-[#FFF7F3]'
              : csvFile
              ? 'border-[#15803D] bg-[#F0FDF4]'
              : 'border-[#D0D0CD] bg-[#FAFAF9] hover:border-[#FF6B24] hover:bg-[#FFF7F3]'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
          />
          {csvFile ? (
            <>
              <CheckCircle2 className="h-8 w-8 text-[#15803D] mb-2" />
              <p className="font-semibold text-[#15803D]">{csvFile.name}</p>
              <p className="text-[12px] text-[#686866] mt-1">{(csvFile.size / 1024).toFixed(1)} KB · Click to change</p>
            </>
          ) : (
            <>
              <FileUp className="h-8 w-8 text-[#D0D0CD] mb-2" />
              <p className="font-semibold text-[#686866]">Drop your CSV file here</p>
              <p className="text-[12px] text-[#9B9B97] mt-1">or click to browse · Maximum 25 MB</p>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-[12.5px] text-[#DC2626]">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <a href="/admin/platform/imports" className="text-[13px] font-medium text-[#686866] hover:text-[#101010]">← Cancel</a>
        <button
          onClick={handleUpload}
          disabled={!selectedEntityType || !csvFile || uploading}
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#FF6B24] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[#E9540F] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading…' : 'Upload & Map Columns →'}
        </button>
      </div>
    </div>
  );
}
