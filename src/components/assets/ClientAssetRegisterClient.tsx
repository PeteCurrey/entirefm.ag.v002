'use client';

/**
 * CLIENT COMPONENT: ClientAssetRegisterClient
 * ===========================================
 * Comprehensive interactive asset register with QR generation, label printing,
 * batch sticker sheets, and detailed asset drawer.
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  QrCode,
  Search,
  Filter,
  Download,
  Printer,
  Camera,
  ExternalLink,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  Clock,
  ChevronRight,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

interface AssetRecord {
  id: string;
  asset_reference: string;
  name: string;
  category: string;
  manufacturer?: string;
  model_number?: string;
  serial_number?: string;
  status: string;
  criticality?: string;
  condition?: string;
  installation_date?: string;
  warranty_expiry?: string;
  site?: {
    id: string;
    name: string;
    site_code: string;
  };
}

interface ClientAssetRegisterClientProps {
  initialAssets: AssetRecord[];
  orgName: string;
}

export function ClientAssetRegisterClient({
  initialAssets,
  orgName,
}: ClientAssetRegisterClientProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedSite, setSelectedSite] = useState('ALL');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  
  // Single Asset QR Modal
  const [activeQrAsset, setActiveQrAsset] = useState<AssetRecord | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialAssets.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, [initialAssets]);

  const sites = useMemo(() => {
    const set = new Set<string>();
    initialAssets.forEach((a) => {
      if (a.site?.name) set.add(a.site.name);
    });
    return Array.from(set);
  }, [initialAssets]);

  const filteredAssets = useMemo(() => {
    return initialAssets.filter((a) => {
      const matchSearch =
        !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.asset_reference?.toLowerCase().includes(search.toLowerCase()) ||
        a.manufacturer?.toLowerCase().includes(search.toLowerCase()) ||
        a.serial_number?.toLowerCase().includes(search.toLowerCase());

      const matchCat = selectedCategory === 'ALL' || a.category === selectedCategory;
      const matchStatus = selectedStatus === 'ALL' || a.status === selectedStatus;
      const matchSite = selectedSite === 'ALL' || a.site?.name === selectedSite;

      return matchSearch && matchCat && matchStatus && matchSite;
    });
  }, [initialAssets, search, selectedCategory, selectedStatus, selectedSite]);

  const toggleSelectAll = () => {
    if (selectedAssetIds.length === filteredAssets.length) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(filteredAssets.map((a) => a.id));
    }
  };

  const toggleSelectAsset = (id: string) => {
    setSelectedAssetIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePrintBatchLabels = async () => {
    const ids = selectedAssetIds.length > 0 ? selectedAssetIds : filteredAssets.slice(0, 20).map((a) => a.id);
    if (ids.length === 0) return;

    try {
      const res = await fetch('/api/assets/batch-labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset_ids: ids }),
      });

      if (!res.ok) throw new Error('Failed to generate batch sheet');
      const html = await res.text();
      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.write(html);
        printWin.document.close();
      }
    } catch (err) {
      console.error('[BATCH_PRINT_ERROR]', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── ACTION HEADER ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              ESTATE ASSET INVENTORY &bull; DIGITAL QR REGISTRY
            </span>
          </div>
          <h1 className="text-2xl font-light text-white tracking-tight">Asset Register</h1>
          <p className="text-xs text-brand-mist/70">
            Maintained plant, equipment, and building systems for {orgName}. Every asset is tagged with an encrypted QR attendance code.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/clients/assets/import"
            className="px-3.5 py-2.5 rounded-xl border border-brand-edge-dark bg-brand-carbon/80 text-brand-electric text-xs font-semibold hover:bg-brand-void hover:text-white transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" /> AI Import Schedule
          </Link>
          <Link
            href="/clients/assets/scan"
            className="px-4 py-2.5 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all flex items-center gap-2 shadow-lg shadow-brand-electric/20"
          >
            <Camera className="w-4 h-4" /> Scan QR Tag
          </Link>
          <button
            onClick={handlePrintBatchLabels}
            className="px-3.5 py-2.5 rounded-xl border border-brand-edge-dark bg-brand-carbon/60 text-brand-mist text-xs hover:bg-brand-void hover:text-white transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Labels {selectedAssetIds.length > 0 ? `(${selectedAssetIds.length})` : '(Batch)'}
          </button>
        </div>
      </div>

      {/* ─── SEARCH & FILTER TOOLBAR ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-mist/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by asset reference, name, make, model or serial number..."
              className="w-full rounded-xl bg-brand-void border border-brand-edge-dark pl-9 pr-4 py-2 text-xs text-white placeholder-brand-mist/30 focus:border-brand-electric focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-xs text-brand-mist focus:border-brand-electric focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-xs text-brand-mist focus:border-brand-electric focus:outline-none"
            >
              <option value="ALL">All Sites</option>
              {sites.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-xs text-brand-mist focus:border-brand-electric focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPERATIONAL">OPERATIONAL</option>
              <option value="IN_SERVICE">IN SERVICE</option>
              <option value="DEGRADED">DEGRADED</option>
              <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── ASSET DATA TABLE ────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-brand-edge-dark bg-brand-void/80 text-brand-mist/60 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3.5 w-10">
                <input
                  type="checkbox"
                  checked={filteredAssets.length > 0 && selectedAssetIds.length === filteredAssets.length}
                  onChange={toggleSelectAll}
                  className="rounded border-brand-edge-dark bg-brand-void text-brand-electric focus:ring-0"
                />
              </th>
              <th className="px-5 py-3.5">Asset Ref</th>
              <th className="px-5 py-3.5">Asset Name / Details</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Site Location</th>
              <th className="px-5 py-3.5">Condition / Status</th>
              <th className="px-5 py-3.5 text-right">QR &amp; Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-brand-mist/40 space-y-2">
                  <Layers className="w-8 h-8 mx-auto text-brand-mist/20" />
                  <p>No assets found matching current filters.</p>
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => {
                const isSelected = selectedAssetIds.includes(asset.id);
                return (
                  <tr
                    key={asset.id}
                    className={`hover:bg-brand-void/40 transition-colors ${
                      isSelected ? 'bg-brand-electric/5' : ''
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectAsset(asset.id)}
                        className="rounded border-brand-edge-dark bg-brand-void text-brand-electric focus:ring-0"
                      />
                    </td>
                    <td className="px-5 py-3.5 font-mono font-medium text-brand-electric-bright">
                      <Link href={`/asset/${asset.id}`} className="hover:underline flex items-center gap-1.5">
                        {asset.asset_reference || '—'}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-normal text-white block">{asset.name}</span>
                      <span className="text-[10.5px] text-brand-mist/50">
                        {asset.manufacturer ? `${asset.manufacturer} ` : ''}
                        {asset.model_number ? `· Mod: ${asset.model_number}` : ''}
                        {asset.serial_number ? ` · S/N: ${asset.serial_number}` : ''}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded bg-brand-void border border-brand-edge-dark px-2 py-0.5 text-[10.5px] text-brand-mist/80">
                        {asset.category || 'General'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-brand-mist/80">{asset.site?.name || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-normal text-[10.5px] text-emerald-400">
                        {asset.status || 'OPERATIONAL'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => setActiveQrAsset(asset)}
                        className="px-2.5 py-1 rounded-lg border border-brand-edge-dark bg-brand-void/60 text-brand-mist hover:text-white hover:border-brand-electric/50 text-[11px] inline-flex items-center gap-1 transition-all"
                      >
                        <QrCode className="w-3.5 h-3.5 text-brand-electric" /> Tag
                      </button>
                      <a
                        href={`/api/assets/${asset.id}/qr?format=label&download=true`}
                        title="Download Asset Tag Label"
                        className="px-2 py-1 rounded-lg border border-brand-edge-dark bg-brand-void/60 text-brand-mist hover:text-white text-[11px] inline-flex items-center"
                      >
                        <Download className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ─── SINGLE ASSET QR MODAL ───────────────────────────────────────── */}
      {activeQrAsset && (
        <div className="fixed inset-0 bg-brand-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-brand-carbon border border-brand-edge-dark rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-electric-bright tracking-widest">
                  DIGITAL QR ASSET TAG
                </span>
                <h3 className="text-base font-medium text-white">{activeQrAsset.name}</h3>
                <p className="text-xs text-brand-mist/60 font-mono">{activeQrAsset.asset_reference}</p>
              </div>
              <button
                onClick={() => setActiveQrAsset(null)}
                className="text-brand-mist/50 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {/* Live SVG Tag Preview */}
            <div className="rounded-xl border border-brand-edge-dark bg-white p-4 flex items-center justify-center overflow-hidden">
              <iframe
                src={`/api/assets/${activeQrAsset.id}/qr?format=label`}
                className="w-[380px] h-[200px] border-0 scale-95 pointer-events-none"
                title="Asset Label Preview"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <Link
                href={`/asset/${activeQrAsset.id}`}
                className="px-3.5 py-2 rounded-xl bg-brand-void border border-brand-edge-dark text-xs text-brand-mist hover:text-white flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Asset View
              </Link>

              <div className="flex items-center gap-2">
                <a
                  href={`/api/assets/${activeQrAsset.id}/qr?format=label&download=true`}
                  className="px-3 py-2 rounded-xl border border-brand-edge-dark bg-brand-void text-xs text-brand-mist hover:text-white flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> SVG
                </a>
                <button
                  onClick={() => {
                    const printWin = window.open(`/api/assets/${activeQrAsset.id}/qr?format=label`, '_blank');
                    if (printWin) {
                      printWin.focus();
                      printWin.print();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 flex items-center gap-1.5 shadow-md shadow-brand-electric/20"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Tag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
