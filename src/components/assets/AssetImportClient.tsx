'use client';

/**
 * CLIENT COMPONENT: AssetImportClient
 * ===================================
 * AI-assisted asset register import, reconciliation, and duplicate resolution UI.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Search,
  Database,
  ShieldCheck,
  Building,
  Edit2,
  Trash2,
  Check,
  X,
  Layers,
} from 'lucide-react';
import { CandidateAsset } from '@/server/assets/asset-import-service';

interface AssetImportClientProps {
  sessionUser: {
    id: string;
    name: string;
    role: string;
    orgName?: string;
  };
}

const SAMPLE_CSV = `asset_reference,name,category,manufacturer,model,serial_number,location,condition,criticality
AHU-L1-01,Air Handling Unit Plantroom 1,HVAC,Daikin,D-AHU-400,SN-DK-99281,Level 1 Plant Room,GOOD,HIGH
CHL-RF-01,Rooftop Water Cooled Chiller,HVAC,Trane,RT-CH-800,SN-TR-44810,Roof Level A,EXCELLENT,CRITICAL
PMP-BS-02,Twin Head Booster Pump Set,Plumbing,Grundfos,HYDRO-MPC,SN-GF-10492,Basement Plant,GOOD,HIGH
DB-GF-03,Main 3-Phase Distribution Board,Electrical,Schneider,Acti9-Iso,SN-SN-55201,Ground Floor Riser,GOOD,HIGH
EXT-GF-08,CO2 5kg Portable Extinguisher,Fire Safety,Chubb,CO2-5KG,SN-CH-77401,Reception Lobby,EXCELLENT,MEDIUM`;

export function AssetImportClient({ sessionUser }: AssetImportClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<'upload' | 'reconcile' | 'success'>('upload');
  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<CandidateAsset[]>([]);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitResult, setCommitResult] = useState<{ committedCount: number; assetIds: string[] } | null>(null);

  // Parse Text or File
  const handleParse = async (textToParse: string) => {
    if (!textToParse.trim()) {
      setParseError('Please upload an asset schedule or paste CSV data below.');
      return;
    }

    setIsParsing(true);
    setParseError(null);

    try {
      const res = await fetch('/api/assets/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: textToParse }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse import source');
      }

      setCandidates(data.candidates || []);
      setStep('reconcile');
    } catch (err: any) {
      setParseError(err.message || 'Error processing asset schedule');
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
      handleParse(content);
    };
    reader.readAsText(file);
  };

  const toggleCandidateState = (tempId: string, newState: CandidateAsset['reconciliation_state']) => {
    setCandidates((prev) =>
      prev.map((c) => (c.tempId === tempId ? { ...c, reconciliation_state: newState } : c))
    );
  };

  const handleCommit = async () => {
    const confirmed = candidates.filter((c) => c.reconciliation_state === 'CONFIRMED' || c.reconciliation_state === 'NEW');
    if (confirmed.length === 0) {
      alert('Please confirm at least one asset to commit.');
      return;
    }

    setIsCommitting(true);
    try {
      const res = await fetch('/api/assets/import', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidates: confirmed }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to commit assets');
      }

      setCommitResult({
        committedCount: data.committedCount,
        assetIds: data.assetIds,
      });
      setStep('success');
    } catch (err: any) {
      alert(`Commit error: ${err.message}`);
    } finally {
      setIsCommitting(false);
    }
  };

  const confirmedCount = candidates.filter((c) => c.reconciliation_state === 'CONFIRMED' || c.reconciliation_state === 'NEW').length;
  const duplicateCount = candidates.filter((c) => c.reconciliation_state === 'POSSIBLE_DUPLICATE').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* ─── HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-edge-dark pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-medium text-brand-electric uppercase tracking-wider mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>CAFM Asset Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            AI Asset Register Ingestion &amp; Reconciliation
          </h1>
          <p className="text-xs text-brand-mist/70 mt-0.5">
            Import multi-format equipment schedules, detect duplicates, and commit verified assets with automated QR generation.
          </p>
        </div>

        <Link
          href="/clients/assets"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-brand-edge-dark bg-brand-carbon text-xs text-brand-mist hover:text-white transition-colors"
        >
          View Live Asset Register
        </Link>
      </div>

      {/* ─── STEP 1: UPLOAD & INGESTION ─────────────────────────────────── */}
      {step === 'upload' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Upload Box */}
            <div className="rounded-2xl border-2 border-dashed border-brand-edge-dark bg-brand-carbon/60 hover:bg-brand-carbon p-8 text-center flex flex-col items-center justify-center space-y-4 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-brand-void border border-brand-edge-dark flex items-center justify-center text-brand-electric group-hover:scale-105 transition-transform shadow-xl">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-sm font-semibold text-white">Upload Asset Schedule / CSV / Excel</h3>
                <p className="text-xs text-brand-mist/60">
                  Drag and drop your spreadsheet or schedule export (.csv, .txt)
                </p>
              </div>

              <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all shadow-lg shadow-brand-electric/20">
                Browse Schedule File
                <input
                  type="file"
                  accept=".csv,.txt,.json,.tsv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Manual Paste Text Box */}
            <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">Paste Schedule Data (CSV / Text)</span>
                  <button
                    onClick={() => setRawText(SAMPLE_CSV)}
                    className="text-[11px] text-brand-electric hover:underline"
                  >
                    Load Sample Schedule
                  </button>
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste comma, tab, or semicolon delimited rows..."
                  rows={7}
                  className="w-full rounded-xl border border-brand-edge-dark bg-brand-void/80 p-3 text-xs text-white font-mono placeholder:text-brand-mist/40 focus:outline-none focus:border-brand-electric"
                />
              </div>

              <button
                onClick={() => handleParse(rawText)}
                disabled={isParsing || !rawText.trim()}
                className="w-full py-2.5 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isParsing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Analyzing Evidence &amp; Detecting Duplicates...
                  </>
                ) : (
                  <>
                    Parse &amp; Reconcile Candidates <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {parseError && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}
        </div>
      )}

      {/* ─── STEP 2: RECONCILIATION & REVIEW ───────────────────────────── */}
      {step === 'reconcile' && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl border border-brand-edge-dark bg-brand-carbon/60">
              <div className="text-xs text-brand-mist/60">Total Candidates</div>
              <div className="text-xl font-bold text-white mt-1">{candidates.length}</div>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="text-xs text-emerald-400">Ready to Commit</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">{confirmedCount}</div>
            </div>
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
              <div className="text-xs text-amber-400">Possible Duplicates</div>
              <div className="text-xl font-bold text-amber-400 mt-1">{duplicateCount}</div>
            </div>
            <div className="p-4 rounded-xl border border-brand-edge-dark bg-brand-carbon/60 flex items-center justify-center">
              <button
                onClick={() => setStep('upload')}
                className="text-xs text-brand-mist hover:text-white underline"
              >
                ← Upload Different Schedule
              </button>
            </div>
          </div>

          {/* Candidates Table */}
          <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/80 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-brand-edge-dark flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-electric" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">Candidate Reconciliation Table</span>
              </div>
              <span className="text-[11px] text-brand-mist/60">
                AI suggestions are advisory. Review and confirm records before persisting.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-void/80 text-[11px] uppercase tracking-wider text-brand-mist/60 border-b border-brand-edge-dark">
                  <tr>
                    <th className="py-3 px-4">Asset Reference</th>
                    <th className="py-3 px-4">Equipment Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Make / Model</th>
                    <th className="py-3 px-4">Serial Number</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Reconciliation Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-edge-dark">
                  {candidates.map((c) => (
                    <tr key={c.tempId} className="hover:bg-brand-void/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-white font-medium">{c.asset_reference}</td>
                      <td className="py-3 px-4 text-white">{c.name}</td>
                      <td className="py-3 px-4 text-brand-mist">{c.category}</td>
                      <td className="py-3 px-4 text-brand-mist">
                        {c.manufacturer || c.model ? `${c.manufacturer || ''} ${c.model || ''}` : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-brand-mist">{c.serial_number || '—'}</td>
                      <td className="py-3 px-4 text-brand-mist">{c.location || '—'}</td>
                      <td className="py-3 px-4">
                        {c.reconciliation_state === 'POSSIBLE_DUPLICATE' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <AlertTriangle className="w-3 h-3" /> Duplicate Detected
                            </span>
                            {c.duplicate_match && (
                              <div className="text-[10px] text-brand-mist/70">
                                {c.duplicate_match.match_reason} ({c.duplicate_match.confidence_score}% match)
                              </div>
                            )}
                          </div>
                        ) : c.reconciliation_state === 'CONFIRMED' || c.reconciliation_state === 'NEW' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle className="w-3 h-3" /> Confirmed New
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-500/20 text-zinc-400 border border-zinc-500/30">
                            <X className="w-3 h-3" /> Skipped / Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {c.reconciliation_state !== 'CONFIRMED' && c.reconciliation_state !== 'NEW' ? (
                            <button
                              onClick={() => toggleCandidateState(c.tempId, 'CONFIRMED')}
                              className="px-2 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[11px] font-medium transition-colors"
                            >
                              Include
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleCandidateState(c.tempId, 'REJECTED')}
                              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-brand-mist text-[11px] transition-colors"
                            >
                              Skip
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 border-t border-brand-edge-dark bg-brand-void/60 flex items-center justify-between">
              <div className="text-xs text-brand-mist">
                <strong className="text-white">{confirmedCount}</strong> of {candidates.length} assets selected for register creation.
              </div>

              <button
                onClick={handleCommit}
                disabled={isCommitting || confirmedCount === 0}
                className="px-6 py-2.5 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-brand-electric/20"
              >
                {isCommitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Persisting Assets &amp; Generating QR Tags...
                  </>
                ) : (
                  <>
                    Commit {confirmedCount} Assets to Live Register <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP 3: SUCCESS CONFIRMATION ──────────────────────────────── */}
      {step === 'success' && commitResult && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-5 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-white">Asset Register Successfully Updated</h2>
            <p className="text-xs text-brand-mist/80">
              {commitResult.committedCount} new assets have been committed into the canonical register with unique QR codes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/clients/assets"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all"
            >
              Open Asset Register
            </Link>
            <button
              onClick={() => {
                setRawText('');
                setCandidates([]);
                setStep('upload');
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-brand-edge-dark bg-brand-carbon text-brand-mist text-xs hover:text-white transition-all"
            >
              Import More Assets
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
