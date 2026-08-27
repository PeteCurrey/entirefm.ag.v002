'use client';

import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertTriangle, Download, RefreshCw } from 'lucide-react';
import { BulkImportRow, BulkImportResult } from '@/server/contractor/workforce-service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contractorOrgId: string;
}

export function BulkImportWorkforceModal({ isOpen, onClose, onSuccess, contractorOrgId }: Props) {
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<BulkImportRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParseCsv = () => {
    setErrorMsg(null);
    setResult(null);

    const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) {
      setErrorMsg('Please paste CSV rows or upload a CSV file.');
      return;
    }

    const rows: BulkImportRow[] = [];
    const startIndex = lines[0].toLowerCase().includes('email') || lines[0].toLowerCase().includes('first') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length >= 3) {
        rows.push({
          firstName: parts[0] || '',
          lastName: parts[1] || '',
          email: parts[2] || '',
          phone: parts[3] || undefined,
          jobTitle: parts[4] || 'Field Engineer',
          primaryTrade: parts[5] || 'General Maintenance',
          employmentStatus: parts[6] || 'EMPLOYED',
        });
      }
    }

    if (rows.length === 0) {
      setErrorMsg('No valid rows found. Ensure CSV format: FirstName, LastName, Email, Phone, JobTitle, Trade');
      return;
    }

    setParsedRows(rows);
  };

  const handleExecuteImport = async () => {
    if (parsedRows.length === 0) return;
    setIsImporting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contractor/workforce/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorOrgId,
          rows: parsedRows,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Import failed');
      }

      setResult(data.result);
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during import');
    } finally {
      setIsImporting(false);
    }
  };

  const sampleCsv = `FirstName,LastName,Email,Phone,JobTitle,PrimaryTrade
David,Miller,david.m@apex.co.uk,+447700900123,Senior HVAC Engineer,HVAC & Refrigeration
Sarah,Jones,sarah.j@apex.co.uk,+447700900124,Commercial Gas Engineer,Commercial Gas & Heating
James,Taylor,james.t@apex.co.uk,+447700900125,Qualified Electrician,Electrical & Testing`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-void/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-edge-dark bg-brand-void/50">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
              BULK WORKFORCE IMPORT
            </span>
            <h2 className="text-base font-light text-white">Import Engineers &amp; Operatives via CSV</h2>
          </div>
          <button onClick={onClose} className="text-brand-mist/60 hover:text-white p-1 rounded-lg hover:bg-brand-edge-dark">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {result ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Bulk Import Completed</span>
                </div>
                <p className="text-xs text-brand-mist font-sans">
                  Successfully imported {result.importedCount} operatives. Skipped {result.duplicateCount} duplicate records.
                </p>
              </div>

              {result.errors.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                  <span className="font-bold block">Validation Warnings ({result.errors.length}):</span>
                  {result.errors.map((e, idx) => (
                    <div key={idx} className="text-[11px]">
                      Row {e.row}: {e.reason}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-brand-mist/70 block font-sans text-xs">
                  Paste CSV Records or Load Template
                </label>
                <button
                  type="button"
                  onClick={() => setCsvText(sampleCsv)}
                  className="text-brand-electric-bright hover:underline text-[11px]"
                >
                  Load Sample Template
                </button>
              </div>

              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="FirstName,LastName,Email,Phone,JobTitle,PrimaryTrade"
                className="w-full p-3 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono text-xs focus:border-brand-electric focus:outline-none"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleParseCsv}
                  className="px-4 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white hover:border-brand-electric text-xs transition-colors"
                >
                  Preview Parsed Data ({parsedRows.length > 0 ? `${parsedRows.length} Rows` : 'Parse CSV'})
                </button>
              </div>

              {parsedRows.length > 0 && (
                <div className="space-y-2">
                  <span className="text-brand-mist/60 text-[11px] block font-sans">
                    Parsed {parsedRows.length} Operative Records Ready for Import:
                  </span>
                  <div className="max-h-48 overflow-y-auto divide-y divide-brand-edge-dark/30 border border-brand-edge-dark rounded-lg bg-brand-void/50">
                    {parsedRows.map((r, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="text-white font-medium">{r.firstName} {r.lastName}</span>
                          <span className="text-brand-mist/50 block">{r.email} &bull; {r.jobTitle}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-brand-carbon text-brand-mist border border-brand-edge-dark text-[10px]">
                          {r.primaryTrade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-edge-dark bg-brand-void/50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-brand-edge-dark text-xs text-brand-mist hover:text-white"
          >
            {result ? 'Close' : 'Cancel'}
          </button>

          {!result && parsedRows.length > 0 && (
            <button
              onClick={handleExecuteImport}
              disabled={isImporting}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold disabled:opacity-50"
            >
              {isImporting ? 'Importing...' : `Import ${parsedRows.length} Operatives`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
