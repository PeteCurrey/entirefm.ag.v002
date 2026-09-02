'use client';

/**
 * TEMPLATE: My Estate Dashboard
 * ==============================
 * Member-authenticated dashboard for the digital estate asset register.
 * Reads real Firestore data from /estates/{uid}/assets — no placeholder data.
 *
 * Features (Prompts 1–4):
 *  - Asset grid/list with status-aware visual treatment
 *  - Multi-select bulk PPM handoff
 *  - Manual asset entry drawer
 *  - Compliance flags panel with ICS handoff
 *  - Empty state directing to Asset Scanner
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Scan,
  Plus,
  CheckSquare,
  Square,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  LayoutGrid,
  List,
  Calendar,
  FileSpreadsheet,
  X,
  Loader2,
  ShieldAlert,
  Download,
  RefreshCw,
  Pencil,
  Info,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { AssetDocument } from '@/types/asset-scanner';
import { getAllAssetDefinitions } from '@/lib/tools/asset-taxonomy';
import { generateIcsCalendar, downloadIcsFile } from '@/lib/exports/ics-exporter';

type AssetWithId = AssetDocument & { id: string };

// ── Status Helpers ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  complete: {
    label: 'Complete',
    icon: CheckCircle2,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cardBorder: 'border-neutral-200',
  },
  processing: {
    label: 'Processing',
    icon: Loader2,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    cardBorder: 'border-blue-200',
  },
  needs_review: {
    label: 'Needs Review',
    icon: AlertTriangle,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    cardBorder: 'border-amber-300',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    className: 'bg-rose-50 text-rose-700 border-rose-200',
    cardBorder: 'border-rose-300',
  },
} as const;

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.needs_review;
}

function StatusBadge({ status }: { status: string }) {
  const cfg = getStatusConfig(status);
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${cfg.className}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ── Manual Asset Form ─────────────────────────────────────────────────────────

interface ManualAddDrawerProps {
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}

function ManualAddDrawer({ token, onClose, onSuccess }: ManualAddDrawerProps) {
  const allDefs = useMemo(() => getAllAssetDefinitions(), []);
  const [assetType, setAssetType] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [sfg20AssetId, setSfg20AssetId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchPreview, setMatchPreview] = useState<string | null>(null);

  // Show regime preview when SFG20 asset is selected
  useEffect(() => {
    if (!sfg20AssetId) { setMatchPreview(null); return; }
    const def = allDefs.find((d) => d.id === sfg20AssetId);
    setMatchPreview(def ? `${def.name} — ${def.tasks[0]?.frequency ?? def.defaultFrequencies[0] ?? ''}` : null);
  }, [sfg20AssetId, allDefs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetType.trim()) { setError('Asset type is required.'); return; }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/tools/asset-scanner/estate-assets/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          assetType: assetType.trim(),
          manufacturer: manufacturer.trim() || null,
          model: model.trim() || null,
          serialNumber: serialNumber.trim() || null,
          sfg20AssetId: sfg20AssetId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || data.error || 'Failed to add asset');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to add asset. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-[10px] border border-neutral-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-100 p-6">
          <div>
            <h2 className="text-lg font-light text-neutral-900">Add Asset Manually</h2>
            <p className="text-xs text-neutral-500 mt-0.5 font-extralight">
              For equipment not put through the scanner. SFG20 regime matching runs automatically.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-900"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-[6px] bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-extralight text-neutral-700">Asset Type <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              placeholder="e.g. Air Handling Unit, Commercial Gas Boiler"
              className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extralight text-neutral-700">Manufacturer</label>
              <input type="text" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} placeholder="e.g. Daikin" className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 focus:outline-none focus:border-neutral-900" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-extralight text-neutral-700">Model</label>
              <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. VRV IV" className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 focus:outline-none focus:border-neutral-900" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extralight text-neutral-700">Serial Number</label>
            <input type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="e.g. SN-2024-001234" className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight font-mono text-neutral-900 focus:outline-none focus:border-neutral-900" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extralight text-neutral-700">SFG20 Maintenance Regime</label>
            <select
              value={sfg20AssetId}
              onChange={(e) => setSfg20AssetId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-[6px] border border-neutral-200 text-sm font-extralight text-neutral-900 focus:outline-none focus:border-neutral-900 bg-white"
            >
              <option value="">Auto-match from asset type (recommended)</option>
              {allDefs.map((def) => (
                <option key={def.id} value={def.id}>{def.categoryName} — {def.name}</option>
              ))}
            </select>
            {matchPreview && (
              <p className="text-[11px] text-brand-electric font-light flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Regime: {matchPreview}
              </p>
            )}
            <p className="text-[11px] text-neutral-400">
              Selecting a regime links this asset to its statutory SFG20 maintenance schedule. If left on auto-match, the server will attempt to resolve from the asset type you entered.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-neutral-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-neutral-300 text-neutral-700 font-extralight text-xs uppercase tracking-wider rounded-[6px] hover:bg-neutral-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center gap-2"
            >
              {submitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Adding…</> : <>Add Asset<ArrowRight className="w-3.5 h-3.5" /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Template ─────────────────────────────────────────────────────────────

export function TemplateMemberMyEstate() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [assets, setAssets] = useState<AssetWithId[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showManualAdd, setShowManualAdd] = useState(false);

  // Multi-select state
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkResult, setBulkResult] = useState<string | null>(null);

  // ── Auth + Asset Fetch ─────────────────────────────────────────────────────

  const fetchAssets = useCallback(async (bearerToken: string) => {
    setFetchError(null);
    try {
      const res = await fetch('/api/tools/asset-scanner/estate-assets', {
        headers: { Authorization: `Bearer ${bearerToken}` },
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFetchError(data.message || data.error || 'Failed to load estate assets');
        return;
      }
      setAssets(data.assets as AssetWithId[]);
    } catch {
      setFetchError('Network error loading your estate. Please try again.');
    }
  }, []);

  useEffect(() => {
    // Retrieve the Supabase session token stored by the auth system
    const getToken = async () => {
      try {
        const res = await fetch('/api/member/me');
        if (res.status === 401) { setAuthError(true); setLoading(false); return; }
        const data = await res.json();
        if (!data.authenticated) { setAuthError(true); setLoading(false); return; }

        // The session token is available from supabase client-side
        // Fallback: fetch from /api/member/session-token if available, else use cookie-based auth
        const tokenRes = await fetch('/api/auth/session-token').catch(() => null);
        let sessionToken: string | null = null;
        if (tokenRes?.ok) {
          const tokenData = await tokenRes.json();
          sessionToken = tokenData.token || null;
        }

        if (!sessionToken) {
          // Try to extract from the supabase-auth-token cookie via a dedicated endpoint
          const altRes = await fetch('/api/member/me?include_token=1').catch(() => null);
          if (altRes?.ok) {
            const altData = await altRes.json();
            sessionToken = altData.token || null;
          }
        }

        setToken(sessionToken);
        if (sessionToken) {
          await fetchAssets(sessionToken);
        } else {
          // Token not accessible from client — fall back to cookie-based fetch
          await fetchAssets('cookie');
        }
      } catch {
        setAuthError(true);
      } finally {
        setLoading(false);
      }
    };
    getToken();
  }, [fetchAssets]);

  // ── Derived Data ───────────────────────────────────────────────────────────

  const complianceFlags = useMemo(() =>
    assets.filter((a) => a.flaggedIssues && a.flaggedIssues.length > 0),
    [assets]
  );

  const needsReviewCount = useMemo(() =>
    assets.filter((a) => a.status === 'needs_review' || a.status === 'failed').length,
    [assets]
  );

  const eligibleForPpm = useMemo(() =>
    assets.filter((a) => a.recommendedRegime && !a.addedToPpmScheduleAt),
    [assets]
  );

  // ── Selection Helpers ──────────────────────────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAllEligible = () => {
    setSelected(new Set(eligibleForPpm.map((a) => a.id)));
  };

  const clearSelection = () => {
    setSelected(new Set());
    setSelectionMode(false);
    setBulkResult(null);
  };

  // ── Bulk PPM Handoff ───────────────────────────────────────────────────────

  const handleBulkSendToPpm = async () => {
    if (selected.size === 0) return;
    setBulkSending(true);
    setBulkResult(null);

    const selectedAssets = assets.filter((a) => selected.has(a.id));

    // Resolve SFG20 asset IDs for the PPM builder URL
    const eligibleSelected = selectedAssets.filter((a) => a.sfg20AssetId && a.recommendedRegime);
    const alreadyAdded = selectedAssets.filter((a) => a.addedToPpmScheduleAt && a.sfg20AssetId);
    const noMatch = selectedAssets.filter((a) => !a.recommendedRegime);

    if (eligibleSelected.length === 0 && alreadyAdded.length === 0) {
      setBulkResult('None of the selected assets have a matched regime. Select assets with a SFG20 match to add to PPM.');
      setBulkSending(false);
      return;
    }

    // Stamp addedToPpmScheduleAt on newly-eligible assets
    const toStamp = eligibleSelected.map((a) => a.id);
    if (toStamp.length > 0 && token) {
      await fetch('/api/tools/asset-scanner/estate-assets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assetIds: toStamp, addedToPpmSchedule: true }),
      }).catch(() => null);
    }

    // Build PPM builder URL with all eligible SFG20 IDs
    const allForPpm = [...eligibleSelected, ...alreadyAdded];
    const sfg20Ids = allForPpm.map((a) => a.sfg20AssetId).filter(Boolean) as string[];
    const quantities = allForPpm.map(() => '1');

    if (sfg20Ids.length === 0) {
      setBulkResult('No SFG20 regime IDs resolved. Try re-scanning these assets.');
      setBulkSending(false);
      return;
    }

    // Refresh asset list
    if (token) await fetchAssets(token);

    const summaryParts: string[] = [];
    if (eligibleSelected.length > 0) summaryParts.push(`${eligibleSelected.length} asset${eligibleSelected.length !== 1 ? 's' : ''} added`);
    if (alreadyAdded.length > 0) summaryParts.push(`${alreadyAdded.length} already added (re-included)`);
    if (noMatch.length > 0) summaryParts.push(`${noMatch.length} excluded (no regime match)`);
    setBulkResult(summaryParts.join(' · '));

    setBulkSending(false);

    // Navigate to PPM builder
    router.push(
      `/tools/ppm-schedule-builder?importScannedAssets=${sfg20Ids.join(',')}&quantities=${quantities.join(',')}`
    );
  };

  // ── Compliance ICS Handoff ─────────────────────────────────────────────────

  const handleDownloadComplianceIcs = (asset: AssetWithId) => {
    const assetLabel = asset.assetType || asset.manufacturer || 'Asset';
    const events = asset.flaggedIssues.map((issue, idx) => ({
      id: `compliance-${asset.id}-${idx}`,
      title: `[Compliance Review] ${assetLabel}`,
      description: `Asset: ${assetLabel}${asset.manufacturer ? ` — ${asset.manufacturer}` : ''}${asset.model ? ` ${asset.model}` : ''}\n\nFlagged Issue: ${issue}\n\nManaged via EntireFM My Estate.`,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now by default
      durationMinutes: 60,
      reminderDaysBefore: 7,
      categories: ['Compliance', 'EstateManagement'],
    }));

    const icsContent = generateIcsCalendar(`EntireFM Compliance — ${assetLabel}`, events);
    downloadIcsFile(icsContent, `EntireFM_Compliance_${assetLabel.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
  };

  // ── Auth Gate ──────────────────────────────────────────────────────────────

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
      <div className="flex min-h-screen flex-col bg-[#FAF9F7] text-neutral-900 font-sans">
        <Header solid={true} />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-electric/10 border border-brand-electric/20 text-brand-electric mx-auto">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extralight text-neutral-900">Sign in to view My Estate</h1>
              <p className="mt-2 text-sm font-extralight text-neutral-600">A verified Lobby Member account is required.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/sign-in" className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors inline-flex items-center justify-center gap-2">
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/join" className="px-6 py-2.5 border border-neutral-300 hover:border-neutral-400 bg-white text-neutral-700 font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors inline-flex items-center justify-center">
                Become a Member
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F7] text-neutral-900 font-sans">
      <Header solid={true} />

      <main className="flex-1 pb-24">
        {/* ── Masthead ── */}
        <div className="w-full bg-[#0D131F] text-white border-b border-neutral-800 relative overflow-hidden py-8 sm:py-12">
          <div className="container-wide relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="h-px w-6 bg-brand-electric" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric-bright font-light">
                  My Estate
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
                Digital Asset Register
              </h1>
              <p className="text-xs sm:text-sm font-extralight text-brand-mist/70 mt-1">
                Your scanned and manually-added plant and equipment — all in one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowManualAdd(true)}
                className="px-4 py-2 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5 text-brand-electric" />
                Add Asset Manually
              </button>
              <Link
                href="/tools/asset-scanner"
                className="px-4 py-2 bg-brand-electric hover:bg-brand-electric/90 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center gap-2"
              >
                <Scan className="w-3.5 h-3.5" />
                Scan New Asset
              </Link>
            </div>
          </div>
        </div>

        <div className="container-wide py-10 sm:py-14 space-y-10">

          {/* ── Fetch Error ── */}
          {fetchError && (
            <div className="p-4 rounded-[8px] bg-rose-50 border border-rose-200 flex items-start gap-3 text-sm text-rose-700">
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">Failed to load estate: </span>{fetchError}
                <button onClick={() => token && fetchAssets(token)} className="ml-2 underline text-rose-600 hover:text-rose-800">Retry</button>
              </div>
            </div>
          )}

          {/* ── Summary Stats ── */}
          {assets.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Assets', value: assets.length, icon: Building2, color: 'text-neutral-700' },
                { label: 'Complete', value: assets.filter((a) => a.status === 'complete').length, icon: CheckCircle2, color: 'text-emerald-600' },
                { label: 'Needs Attention', value: needsReviewCount, icon: AlertTriangle, color: 'text-amber-600' },
                { label: 'Compliance Flags', value: complianceFlags.length, icon: ShieldAlert, color: 'text-rose-600' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white border border-neutral-200/90 rounded-[8px] p-5 shadow-sm">
                  <Icon className={`w-4 h-4 mb-2 ${color}`} />
                  <div className="text-2xl font-extralight text-neutral-900">{value}</div>
                  <div className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── Compliance Flags Panel (Prompt 4) ── */}
          <div className="bg-white border border-neutral-200/90 rounded-[8px] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <h2 className="text-sm font-medium text-neutral-900">Compliance Flags</h2>
              </div>
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Live from your asset data</span>
            </div>

            {complianceFlags.length === 0 ? (
              <div className="px-6 py-5 flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-neutral-600 font-extralight">
                  No compliance flags across your estate — verified live from your scanned asset data.
                </span>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {complianceFlags.map((asset) => (
                  <div key={asset.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-light text-neutral-900 truncate">
                        {asset.assetType || asset.manufacturer || 'Unknown Asset'}
                        {asset.manufacturer && asset.assetType && (
                          <span className="text-neutral-400 font-extralight ml-2">— {asset.manufacturer}</span>
                        )}
                      </p>
                      <ul className="mt-1 space-y-0.5">
                        {asset.flaggedIssues.map((issue, idx) => (
                          <li key={idx} className="text-xs text-rose-600 font-extralight flex items-start gap-1.5">
                            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/member/my-estate/${asset.id}`}
                        className="text-[11px] text-brand-electric hover:underline font-light"
                      >
                        View asset
                      </Link>
                      <button
                        onClick={() => handleDownloadComplianceIcs(asset)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 hover:border-neutral-400 text-neutral-700 hover:text-neutral-900 text-[11px] rounded-[6px] transition-colors font-extralight"
                        title="Download .ics reminder for Compliance Calendar"
                      >
                        <Calendar className="w-3 h-3" />
                        Add to Compliance Calendar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Asset List / Grid ── */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <h2 className="text-base font-light text-neutral-900">
                Your Assets{assets.length > 0 && <span className="text-neutral-400 ml-2 font-extralight">({assets.length})</span>}
              </h2>
              <div className="flex items-center gap-3">
                {!selectionMode ? (
                  <>
                    {assets.length > 0 && (
                      <button
                        onClick={() => setSelectionMode(true)}
                        className="text-xs text-neutral-500 hover:text-neutral-900 font-extralight flex items-center gap-1 transition-colors"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        Select for PPM
                      </button>
                    )}
                    <div className="flex items-center gap-1 border border-neutral-200 rounded-[6px] p-0.5 bg-white">
                      <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-[4px] transition-colors ${viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'}`}>
                        <LayoutGrid className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-[4px] transition-colors ${viewMode === 'list' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'}`}>
                        <List className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <button onClick={selectAllEligible} className="text-xs text-brand-electric hover:underline font-extralight">
                      Select all eligible ({eligibleForPpm.length})
                    </button>
                    <button onClick={clearSelection} className="text-xs text-neutral-500 hover:text-neutral-900 font-extralight flex items-center gap-1">
                      <X className="w-3.5 h-3.5" />Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bulk action bar */}
            {selectionMode && selected.size > 0 && (
              <div className="mb-4 p-4 bg-brand-electric/5 border border-brand-electric/20 rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-light text-neutral-900">{selected.size} asset{selected.size !== 1 ? 's' : ''} selected</p>
                  {bulkResult && (
                    <p className="text-xs text-neutral-600 font-extralight mt-0.5">{bulkResult}</p>
                  )}
                  {/* Show exclusion reasons */}
                  {(() => {
                    const sel = assets.filter((a) => selected.has(a.id));
                    const noMatchSel = sel.filter((a) => !a.recommendedRegime);
                    const alreadyAddedSel = sel.filter((a) => a.addedToPpmScheduleAt && a.recommendedRegime);
                    return (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {alreadyAddedSel.length > 0 && (
                          <span className="text-[11px] text-neutral-500 font-extralight flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            {alreadyAddedSel.length} already added (will re-add)
                          </span>
                        )}
                        {noMatchSel.length > 0 && (
                          <span className="text-[11px] text-rose-500 font-extralight flex items-center gap-1">
                            <X className="w-3 h-3" />
                            {noMatchSel.length} excluded (no regime match)
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
                <button
                  onClick={handleBulkSendToPpm}
                  disabled={bulkSending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors shrink-0"
                >
                  {bulkSending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Sending…</> : <><FileSpreadsheet className="w-3.5 h-3.5" />Add to PPM Schedule</>}
                </button>
              </div>
            )}

            {/* Empty state */}
            {assets.length === 0 && !fetchError && (
              <div className="bg-white border border-neutral-200/90 rounded-[8px] p-12 text-center shadow-sm space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-brand-electric/10 flex items-center justify-center">
                  <Scan className="w-6 h-6 text-brand-electric" />
                </div>
                <div>
                  <h3 className="text-lg font-light text-neutral-900">No assets in your estate yet</h3>
                  <p className="text-sm font-extralight text-neutral-500 mt-1 max-w-md mx-auto">
                    Scan a plant nameplate or compliance certificate to add your first asset, or add equipment manually.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link
                    href="/tools/asset-scanner"
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Scan className="w-3.5 h-3.5" />Go to Asset Scanner
                  </Link>
                  <button
                    onClick={() => setShowManualAdd(true)}
                    className="px-6 py-2.5 border border-neutral-300 hover:border-neutral-400 bg-white text-neutral-700 font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" />Add Manually
                  </button>
                </div>
              </div>
            )}

            {/* Asset grid */}
            {assets.length > 0 && (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
              }>
                {assets.map((asset) => {
                  const cfg = getStatusConfig(asset.status);
                  const isSelected = selected.has(asset.id);
                  const isNeedsAttention = asset.status === 'needs_review' || asset.status === 'failed';

                  return viewMode === 'grid' ? (
                    <div
                      key={asset.id}
                      className={`bg-white border rounded-[8px] shadow-sm overflow-hidden transition-all ${cfg.cardBorder} ${isNeedsAttention ? 'ring-1 ring-amber-200' : ''} ${isSelected ? 'ring-2 ring-brand-electric' : ''}`}
                    >
                      {/* Card top accent for needs_review / failed */}
                      {isNeedsAttention && (
                        <div className={`h-1 w-full ${asset.status === 'failed' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                      )}
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-light text-neutral-900 truncate">
                              {asset.assetType || <span className="text-neutral-400 italic">Unidentified</span>}
                            </p>
                            <p className="text-xs text-neutral-500 font-extralight truncate mt-0.5">
                              {[asset.manufacturer, asset.model].filter(Boolean).join(' · ') || 'No ID details'}
                            </p>
                          </div>
                          {selectionMode && (
                            <button onClick={() => toggleSelect(asset.id)} className="shrink-0 mt-0.5">
                              {isSelected ? <CheckSquare className="w-4 h-4 text-brand-electric" /> : <Square className="w-4 h-4 text-neutral-300" />}
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge status={asset.status} />
                          {asset.addedToPpmScheduleAt && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              <FileSpreadsheet className="w-3 h-3" />PPM Added
                            </span>
                          )}
                          {asset.extractionConfidence === 'manual' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                              <Pencil className="w-3 h-3" />Manual
                            </span>
                          )}
                        </div>

                        {asset.recommendedRegime && (
                          <p className="text-[11px] text-neutral-500 font-extralight truncate">
                            {asset.recommendedRegime.taskRef} · {asset.recommendedRegime.frequency}
                          </p>
                        )}

                        {asset.flaggedIssues?.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[11px] text-rose-600 font-extralight">
                            <AlertTriangle className="w-3 h-3" />
                            {asset.flaggedIssues.length} compliance flag{asset.flaggedIssues.length !== 1 ? 's' : ''}
                          </div>
                        )}

                        <Link
                          href={`/member/my-estate/${asset.id}`}
                          className="text-[11px] text-brand-electric hover:underline font-light flex items-center gap-1 mt-1"
                        >
                          View full details <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    /* List view row */
                    <div
                      key={asset.id}
                      className={`bg-white border rounded-[8px] shadow-sm px-5 py-4 flex items-center gap-4 ${cfg.cardBorder} ${isNeedsAttention ? 'border-l-4 border-l-amber-400' : ''} ${asset.status === 'failed' ? 'border-l-4 border-l-rose-400' : ''} ${isSelected ? 'ring-2 ring-brand-electric' : ''}`}
                    >
                      {selectionMode && (
                        <button onClick={() => toggleSelect(asset.id)} className="shrink-0">
                          {isSelected ? <CheckSquare className="w-4 h-4 text-brand-electric" /> : <Square className="w-4 h-4 text-neutral-300" />}
                        </button>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-light text-neutral-900 truncate">
                          {asset.assetType || <span className="text-neutral-400 italic">Unidentified</span>}
                        </p>
                        <p className="text-xs text-neutral-500 font-extralight">
                          {[asset.manufacturer, asset.model].filter(Boolean).join(' · ') || 'No ID details'}
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 shrink-0">
                        <StatusBadge status={asset.status} />
                        {asset.addedToPpmScheduleAt && (
                          <span className="text-[10px] text-blue-600 font-extralight">PPM ✓</span>
                        )}
                      </div>
                      <Link
                        href={`/member/my-estate/${asset.id}`}
                        className="text-[11px] text-brand-electric hover:underline font-light shrink-0"
                      >
                        View <ArrowRight className="w-3 h-3 inline" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Manual Add Drawer */}
      {showManualAdd && token && (
        <ManualAddDrawer
          token={token}
          onClose={() => setShowManualAdd(false)}
          onSuccess={async () => {
            setShowManualAdd(false);
            if (token) await fetchAssets(token);
          }}
        />
      )}
    </div>
  );
}
