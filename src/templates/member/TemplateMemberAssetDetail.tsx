'use client';

/**
 * TEMPLATE: Member Asset Detail & Edit View
 * =========================================
 * Displays full metadata for a single estate asset document.
 * Allows editing assetType, manufacturer, model, serialNumber, and SFG20 regime re-selection.
 * Displays extractionConfidence (without overwriting), flaggedIssues, and PPM handoff.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  Building2,
  ArrowLeft,
  Pencil,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Calendar,
  FileSpreadsheet,
  ShieldAlert,
  Clock,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Tag,
  Hash,
  Layers,
  FileText,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { AssetDocument } from '@/types/asset-scanner';
import { getAllAssetDefinitions, getAssetById } from '@/lib/tools/asset-taxonomy';
import { generateIcsCalendar, downloadIcsFile } from '@/lib/exports/ics-exporter';

type AssetWithId = AssetDocument & { id: string };

const STATUS_CONFIG = {
  complete: { label: 'Complete', icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  processing: { label: 'Processing', icon: Loader2, className: 'bg-blue-50 text-blue-700 border-blue-200' },
  needs_review: { label: 'Needs Review', icon: AlertTriangle, className: 'bg-amber-50 text-amber-700 border-amber-200' },
  failed: { label: 'Failed', icon: XCircle, className: 'bg-rose-50 text-rose-700 border-rose-200' },
} as const;

export function TemplateMemberAssetDetail() {
  const router = useRouter();
  const params = useParams();
  const assetId = (params?.assetId as string) || '';

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [asset, setAsset] = useState<AssetWithId | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    assetType: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    sfg20AssetId: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ success?: boolean; error?: string } | null>(null);

  // PPM Action State
  const [ppmLoading, setPpmLoading] = useState(false);

  const allDefs = useMemo(() => getAllAssetDefinitions(), []);

  const fetchAssetDetail = useCallback(async (bearerToken: string, id: string) => {
    setFetchError(null);
    try {
      const res = await fetch(`/api/tools/asset-scanner/estate-assets?assetId=${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.asset) {
        setFetchError(data.message || data.error || 'Failed to load asset details');
        return;
      }
      const loadedAsset = data.asset as AssetWithId;
      setAsset(loadedAsset);
      setEditForm({
        assetType: loadedAsset.assetType || '',
        manufacturer: loadedAsset.manufacturer || '',
        model: loadedAsset.model || '',
        serialNumber: loadedAsset.serialNumber || '',
        sfg20AssetId: loadedAsset.sfg20AssetId || '',
      });
    } catch {
      setFetchError('Network error loading asset details.');
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/member/me');
        if (res.status === 401) { setAuthError(true); setLoading(false); return; }
        const data = await res.json();
        if (!data.authenticated) { setAuthError(true); setLoading(false); return; }

        const tokenRes = await fetch('/api/auth/session-token').catch(() => null);
        let sessionToken: string | null = null;
        if (tokenRes?.ok) {
          const tokenData = await tokenRes.json();
          sessionToken = tokenData.token || null;
        }

        if (!sessionToken) {
          const altRes = await fetch('/api/member/me?include_token=1').catch(() => null);
          if (altRes?.ok) {
            const altData = await altRes.json();
            sessionToken = altData.token || null;
          }
        }

        setToken(sessionToken);
        if (assetId) {
          await fetchAssetDetail(sessionToken || 'cookie', assetId);
        }
      } catch {
        setAuthError(true);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [assetId, fetchAssetDetail]);

  const handleSaveEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset || !token) return;
    setSaving(true);
    setSaveFeedback(null);

    try {
      const res = await fetch(`/api/tools/asset-scanner/estate-assets/${encodeURIComponent(asset.id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assetType: editForm.assetType.trim() || null,
          manufacturer: editForm.manufacturer.trim() || null,
          model: editForm.model.trim() || null,
          serialNumber: editForm.serialNumber.trim() || null,
          sfg20AssetId: editForm.sfg20AssetId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to save changes');
      }

      setSaveFeedback({ success: true });
      await fetchAssetDetail(token, asset.id);
      setTimeout(() => {
        setIsEditing(false);
        setSaveFeedback(null);
      }, 1200);
    } catch (err: any) {
      setSaveFeedback({ error: err.message || 'Error saving changes' });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePpm = async () => {
    if (!asset || !token) return;
    setPpmLoading(true);

    try {
      const willAdd = !asset.addedToPpmScheduleAt;
      const res = await fetch('/api/tools/asset-scanner/estate-assets', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assetId: asset.id,
          addedToPpmSchedule: willAdd,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchAssetDetail(token, asset.id);
        if (willAdd && asset.sfg20AssetId) {
          router.push(`/tools/ppm-schedule-builder?importScannedAsset=${encodeURIComponent(asset.sfg20AssetId)}&quantity=1`);
        }
      }
    } catch {
      // ignore
    } finally {
      setPpmLoading(false);
    }
  };

  const handleDownloadComplianceIcs = () => {
    if (!asset || !asset.flaggedIssues?.length) return;
    const assetLabel = asset.assetType || asset.manufacturer || 'Asset';
    const events = asset.flaggedIssues.map((issue, idx) => ({
      id: `compliance-${asset.id}-${idx}`,
      title: `[Compliance Review] ${assetLabel}`,
      description: `Asset: ${assetLabel}\nManufacturer: ${asset.manufacturer || 'N/A'}\nModel: ${asset.model || 'N/A'}\nSerial: ${asset.serialNumber || 'N/A'}\n\nFlagged Issue: ${issue}\n\nManaged via EntireFM My Estate.`,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      durationMinutes: 60,
      reminderDaysBefore: 7,
      categories: ['Compliance', 'EstateManagement'],
    }));

    const icsContent = generateIcsCalendar(`EntireFM Compliance — ${assetLabel}`, events);
    downloadIcsFile(icsContent, `EntireFM_Compliance_${assetLabel.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAF9F7]">
        <Header solid={true} />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-electric" />
        </main>
        <Footer />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAF9F7]">
        <Header solid={true} />
        <main className="flex-1 flex items-center justify-center py-20 px-4 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-light">Sign in to view asset details</h1>
            <Link href="/sign-in" className="inline-block px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-wider rounded-[6px]">
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (fetchError || !asset) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAF9F7]">
        <Header solid={true} />
        <main className="flex-1 container-wide py-12">
          <Link href="/member/my-estate" className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Estate
          </Link>
          <div className="bg-white border border-neutral-200 rounded-[8px] p-8 text-center space-y-3">
            <XCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <h2 className="text-lg font-light text-neutral-900">{fetchError || 'Asset not found'}</h2>
            <p className="text-xs text-neutral-500 font-extralight">This asset may not exist or belong to another account.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[asset.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.needs_review;
  const StatusIcon = statusCfg.icon;
  const manuallyEdited = asset.manuallyEditedFields || [];
  const selectedSfgDef = asset.sfg20AssetId ? getAssetById(asset.sfg20AssetId) : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F7] text-neutral-900 font-sans">
      <Header solid={true} />

      <main className="flex-1 pb-24">
        {/* ── Masthead ── */}
        <div className="w-full bg-[#0D131F] text-white border-b border-neutral-800 py-8 sm:py-10">
          <div className="container-wide">
            <Link
              href="/member/my-estate"
              className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to My Estate
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight text-white">
                    {asset.assetType || 'Unidentified Asset'}
                  </h1>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium border ${statusCfg.className}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusCfg.label}
                  </span>
                </div>
                <p className="text-xs text-brand-mist/70 font-extralight mt-1">
                  {[asset.manufacturer, asset.model].filter(Boolean).join(' · ') || 'No manufacturer or model recorded'}
                  {asset.serialNumber && ` · SN: ${asset.serialNumber}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center gap-2"
                >
                  <Pencil className="w-3.5 h-3.5 text-brand-electric" />
                  {isEditing ? 'Cancel Editing' : 'Edit Asset'}
                </button>

                {asset.recommendedRegime && (
                  <button
                    onClick={handleTogglePpm}
                    disabled={ppmLoading}
                    className="px-4 py-2 bg-brand-electric hover:bg-brand-electric/90 disabled:opacity-50 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center gap-2"
                  >
                    {ppmLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    )}
                    {asset.addedToPpmScheduleAt ? 'Re-add to PPM' : 'Add to PPM Schedule'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container-wide py-10 space-y-8">
          {/* ── Inline Edit Drawer / Form (Prompt 2) ── */}
          {isEditing && (
            <div className="bg-white border-2 border-neutral-900 rounded-[8px] p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div>
                  <h2 className="text-base font-light text-neutral-900">Edit Asset Information</h2>
                  <p className="text-xs font-extralight text-neutral-500">
                    Modifying values updates your digital estate. AI extraction confidence will not be overwritten.
                  </p>
                </div>
                <button onClick={() => setIsEditing(false)} className="p-1 text-neutral-400 hover:text-neutral-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {saveFeedback && (
                <div
                  className={`p-3 rounded-[6px] text-xs flex items-center gap-2 ${
                    saveFeedback.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {saveFeedback.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                  <span>{saveFeedback.success ? 'Asset saved successfully.' : saveFeedback.error}</span>
                </div>
              )}

              <form onSubmit={handleSaveEdits} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-extralight text-neutral-700">Asset Type</label>
                    <input
                      type="text"
                      value={editForm.assetType}
                      onChange={(e) => setEditForm({ ...editForm, assetType: e.target.value })}
                      className="w-full px-3 py-2 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extralight text-neutral-700">Manufacturer</label>
                    <input
                      type="text"
                      value={editForm.manufacturer}
                      onChange={(e) => setEditForm({ ...editForm, manufacturer: e.target.value })}
                      className="w-full px-3 py-2 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extralight text-neutral-700">Model</label>
                    <input
                      type="text"
                      value={editForm.model}
                      onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                      className="w-full px-3 py-2 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extralight text-neutral-700">Serial Number</label>
                    <input
                      type="text"
                      value={editForm.serialNumber}
                      onChange={(e) => setEditForm({ ...editForm, serialNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-[6px] border border-neutral-200 text-sm font-extralight font-mono text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                {/* SFG20 Regime Re-selection (Prompt 2 requirement: real SFG20 dataset, not free-text) */}
                <div className="space-y-1 pt-2 border-t border-neutral-100">
                  <label className="text-xs font-extralight text-neutral-700">SFG20 Maintenance Regime Re-selection</label>
                  <select
                    value={editForm.sfg20AssetId}
                    onChange={(e) => setEditForm({ ...editForm, sfg20AssetId: e.target.value })}
                    className="w-full px-3 py-2 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 focus:outline-none focus:border-neutral-900 bg-white"
                  >
                    <option value="">No regime / Clear regime</option>
                    {allDefs.map((def) => (
                      <option key={def.id} value={def.id}>
                        {def.categoryName} — {def.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-neutral-400 font-extralight">
                    Regimes cannot be typed manually. Selecting from this dataset links the canonical task frequency, statutory references, and SFG20 standard.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-neutral-300 text-neutral-700 font-extralight text-xs uppercase tracking-wider rounded-[6px] hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] flex items-center gap-2"
                  >
                    {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</> : <>Save Changes<Check className="w-3.5 h-3.5" /></>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Metadata Grid ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-neutral-200 rounded-[8px] p-5 space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase tracking-wider font-medium">Asset Type</span>
                {manuallyEdited.includes('assetType') && (
                  <span className="text-[10px] text-brand-electric font-medium">Edited</span>
                )}
              </div>
              <p className="text-base font-light text-neutral-900">{asset.assetType || '—'}</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-[8px] p-5 space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase tracking-wider font-medium">Manufacturer</span>
                {manuallyEdited.includes('manufacturer') && (
                  <span className="text-[10px] text-brand-electric font-medium">Edited</span>
                )}
              </div>
              <p className="text-base font-light text-neutral-900">{asset.manufacturer || '—'}</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-[8px] p-5 space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase tracking-wider font-medium">Model</span>
                {manuallyEdited.includes('model') && (
                  <span className="text-[10px] text-brand-electric font-medium">Edited</span>
                )}
              </div>
              <p className="text-base font-light text-neutral-900">{asset.model || '—'}</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-[8px] p-5 space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase tracking-wider font-medium">Serial Number</span>
                {manuallyEdited.includes('serialNumber') && (
                  <span className="text-[10px] text-brand-electric font-medium">Edited</span>
                )}
              </div>
              <p className="text-base font-light font-mono text-neutral-900">{asset.serialNumber || '—'}</p>
            </div>
          </div>

          {/* ── Extraction & Audit Info ── */}
          <div className="bg-white border border-neutral-200 rounded-[8px] p-6 shadow-sm space-y-4">
            <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">Scan &amp; Audit Traceability</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-sm font-extralight">
              <div>
                <span className="text-xs text-neutral-500 block mb-1">Extraction Confidence</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-medium ${
                  asset.extractionConfidence === 'high' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  asset.extractionConfidence === 'medium' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  asset.extractionConfidence === 'manual' ? 'bg-neutral-100 text-neutral-700 border border-neutral-200' :
                  'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {asset.extractionConfidence === 'manual' ? 'Manual Entry' : `${asset.extractionConfidence.toUpperCase()} Confidence`}
                </span>
              </div>

              <div>
                <span className="text-xs text-neutral-500 block mb-1">Source Upload ID</span>
                <p className="font-mono text-xs text-neutral-700 truncate">{asset.sourceUploadId || '—'}</p>
              </div>

              <div>
                <span className="text-xs text-neutral-500 block mb-1">Last Updated</span>
                <p className="text-xs text-neutral-700">{asset.updatedAt ? new Date(asset.updatedAt).toLocaleString('en-GB') : '—'}</p>
              </div>
            </div>

            {manuallyEdited.length > 0 && (
              <div className="pt-3 border-t border-neutral-100">
                <span className="text-xs text-neutral-500">Member-Edited Fields: </span>
                <span className="text-xs font-light text-brand-electric">{manuallyEdited.join(', ')}</span>
              </div>
            )}
          </div>

          {/* ── Recommended Regime Section ── */}
          <div className="bg-white border border-neutral-200 rounded-[8px] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">Maintenance Regime &amp; Compliance</h2>
              {asset.addedToPpmScheduleAt && (
                <span className="text-xs text-emerald-600 font-light flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Added to PPM Schedule ({new Date(asset.addedToPpmScheduleAt).toLocaleDateString('en-GB')})
                </span>
              )}
            </div>

            {asset.recommendedRegime ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#FAF9F7] rounded-[6px] border border-neutral-200/80 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-light text-neutral-900">
                      Standard: <span className="font-medium text-brand-electric">{asset.recommendedRegime.standard}</span>
                    </p>
                    <span className="text-xs font-extralight text-neutral-500">
                      Frequency: <strong className="font-medium text-neutral-800">{asset.recommendedRegime.frequency}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-extralight">
                    Task Reference: <code className="text-[11px] bg-neutral-200 px-1 py-0.5 rounded">{asset.recommendedRegime.taskRef}</code>
                  </p>
                </div>

                {selectedSfgDef && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-light text-neutral-700">SFG20 Task Schedule Breakdown:</h3>
                    <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-[6px]">
                      {selectedSfgDef.tasks.map((task, idx) => (
                        <div key={idx} className="p-3 text-xs flex items-start justify-between gap-4 font-extralight">
                          <div>
                            <p className="text-neutral-900 font-light">{task.activity}</p>
                            <p className="text-neutral-500 text-[11px] mt-0.5">{task.governingBasis}</p>
                          </div>
                          <span className="shrink-0 font-mono text-[10px] px-2 py-0.5 bg-neutral-100 rounded text-neutral-700">
                            {task.frequency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-neutral-50 rounded-[6px] text-xs font-extralight text-neutral-500">
                No maintenance regime currently assigned. Click &ldquo;Edit Asset&rdquo; above to select an SFG20 regime.
              </div>
            )}
          </div>

          {/* ── Flagged Compliance Issues (Prompt 4) ── */}
          <div className="bg-white border border-neutral-200 rounded-[8px] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">Flagged Compliance Issues</h2>
              </div>
              {asset.flaggedIssues?.length > 0 && (
                <button
                  onClick={handleDownloadComplianceIcs}
                  className="text-xs text-brand-electric hover:underline font-light flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3" /> Download Calendar Reminder (.ics)
                </button>
              )}
            </div>

            {asset.flaggedIssues && asset.flaggedIssues.length > 0 ? (
              <ul className="space-y-2">
                {asset.flaggedIssues.map((issue, idx) => (
                  <li key={idx} className="p-3 rounded-[6px] bg-rose-50 border border-rose-200 text-xs text-rose-800 font-extralight flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs font-extralight text-neutral-500 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                No compliance issues or date warnings flagged for this asset.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
