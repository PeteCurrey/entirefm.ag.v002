'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'clients' | 'sites';
  onSuccess?: () => void;
}

interface ImportSummary {
  total: number;
  imported: number;
  updated?: number;
  linked?: number;
  duplicates_skipped?: number;
  failed: number;
  errors?: Array<{ name: string; error: string }>;
}

export function BulkUploadModal({ isOpen, onClose, type, onSuccess }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const title = type === 'clients' ? 'Bulk Upload Clients' : 'Bulk Upload Sites';
  const description =
    type === 'clients'
      ? 'Upload a CSV containing customer names, contact emails, phone numbers, and postcodes.'
      : 'Upload a CSV containing site names, addresses, towns, postcodes, and associated customers.';

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a valid .csv file.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSummary(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        // Quick preview parse
        const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
        const previewRows = lines.slice(0, 6).map((line) => {
          // Simple CSV split for preview
          const row: string[] = [];
          let cur = '';
          let inQ = false;
          for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === '"') inQ = !inQ;
            else if (c === ',' && !inQ) {
              row.push(cur.trim());
              cur = '';
            } else cur += c;
          }
          row.push(cur.trim());
          return row;
        });
        setCsvPreview(previewRows);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    try {
      const text = await file.text();
      const endpoint =
        type === 'clients' ? '/api/admin/clients/bulk-import' : '/api/admin/sites/bulk-import';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent: text }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Bulk upload failed');
      }

      setSummary(data.summary);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Error processing bulk upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setCsvPreview([]);
    setSummary(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-2xl p-6 text-left my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E4E4E1] pb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#101010]">{title}</h3>
            <p className="text-[12.5px] text-[#686866] mt-0.5">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#686866] hover:bg-[#F0F0EE] hover:text-[#101010]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-5 space-y-5">
          {error && (
            <div className="rounded-[8px] bg-red-50 border border-red-200 p-3.5 flex items-start gap-2.5 text-red-800 text-[12.5px]">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!summary ? (
            <>
              {/* File Dropzone */}
              {!file ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-[12px] border-2 border-dashed border-[#D3D3D0] hover:border-[#FF6B24] bg-[#F9F9F8] p-8 text-center cursor-pointer transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
                    }}
                  />
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#FF6B24]/10 flex items-center justify-center text-[#FF6B24] mb-3">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="text-[13.5px] font-medium text-[#101010]">
                    Drag and drop your CSV file here, or click to browse
                  </div>
                  <div className="text-[11.5px] text-[#686866] mt-1">
                    Supports .csv format up to 10MB
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3.5">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-6 w-6 text-[#FF6B24]" />
                      <div>
                        <div className="text-[13px] font-medium text-[#101010]">{file.name}</div>
                        <div className="text-[11px] text-[#686866]">
                          {(file.size / 1024).toFixed(1)} KB · CSV File
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      disabled={isUploading}
                    >
                      Change File
                    </Button>
                  </div>

                  {/* Preview Table */}
                  {csvPreview.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-medium uppercase tracking-wider text-[#686866]">
                        CSV Preview (First {csvPreview.length - 1} rows)
                      </div>
                      <div className="overflow-x-auto rounded-[8px] border border-[#E4E4E1] max-h-48 text-[11.5px]">
                        <table className="w-full border-collapse">
                          <thead className="bg-[#F0F0EE] sticky top-0">
                            <tr>
                              {csvPreview[0]?.map((col, idx) => (
                                <th
                                  key={idx}
                                  className="px-3 py-2 text-left font-medium text-[#101010] border-b border-[#E4E4E1]"
                                >
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E4E4E1]">
                            {csvPreview.slice(1).map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-[#F9F9F8]">
                                {row.map((val, cIdx) => (
                                  <td key={cIdx} className="px-3 py-1.5 text-[#383836] truncate max-w-[160px]">
                                    {val || '—'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Upload Success & Summary View */
            <div className="space-y-4">
              <div className="rounded-[12px] bg-emerald-50 border border-emerald-200 p-5 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-semibold text-emerald-900">
                  Bulk Import Completed Successfully
                </h4>
                <p className="text-[12.5px] text-emerald-700">
                  The dataset has been ingested into the EntireFM database.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="rounded-[8px] border border-[#E4E4E1] bg-[#F9F9F8] p-3">
                  <div className="text-[10.5px] text-[#686866] uppercase">Total Processed</div>
                  <div className="text-lg font-bold text-[#101010] mt-1">{summary.total}</div>
                </div>
                <div className="rounded-[8px] border border-emerald-200 bg-emerald-50/50 p-3">
                  <div className="text-[10.5px] text-emerald-700 uppercase">New Created</div>
                  <div className="text-lg font-bold text-emerald-800 mt-1">{summary.imported}</div>
                </div>
                <div className="rounded-[8px] border border-blue-200 bg-blue-50/50 p-3">
                  <div className="text-[10.5px] text-blue-700 uppercase">
                    {type === 'sites' ? 'Linked to Clients' : 'Updated / Enriched'}
                  </div>
                  <div className="text-lg font-bold text-blue-800 mt-1">
                    {type === 'sites' ? summary.linked ?? summary.updated ?? 0 : summary.updated ?? 0}
                  </div>
                </div>
                <div className="rounded-[8px] border border-amber-200 bg-amber-50/50 p-3">
                  <div className="text-[10.5px] text-amber-700 uppercase">Duplicates / Skipped</div>
                  <div className="text-lg font-bold text-amber-800 mt-1">
                    {summary.duplicates_skipped ?? 0}
                  </div>
                </div>
              </div>

              {summary.errors && summary.errors.length > 0 && (
                <div className="rounded-[8px] border border-amber-200 bg-amber-50 p-3 text-[12px] space-y-1">
                  <div className="font-semibold text-amber-900">
                    {summary.errors.length} Warnings / Unmatched Entries:
                  </div>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {summary.errors.map((e, idx) => (
                      <div key={idx} className="text-amber-800">
                        • {e.name}: {e.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-[#E4E4E1] pt-4">
          {!summary ? (
            <>
              <Button variant="secondary" size="sm" onClick={onClose} disabled={isUploading}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                onClick={handleUpload}
                disabled={!file || isUploading}
              >
                {isUploading ? 'Importing Dataset...' : 'Execute Bulk Import'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="sm" onClick={handleReset}>
                Import Another File
              </Button>
              <Button variant="primary" size="sm" onClick={onClose}>
                Close & View Records
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
