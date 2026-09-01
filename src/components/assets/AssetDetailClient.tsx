'use client';

/**
 * CLIENT COMPONENT: AssetDetailClient
 * ===================================
 * Mobile-first operational asset view and attendance verification interface.
 */

import React, { useState, useEffect } from 'react';
import {
  QrCode,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Wrench,
  Camera,
  ShieldCheck,
  PlusCircle,
  History,
  Download,
  Printer,
  Navigation,
} from 'lucide-react';
import { AssetOperationalContext } from '@/server/assets/asset-service';

interface AssetDetailClientProps {
  asset: AssetOperationalContext;
  sessionUser: {
    id: string;
    name: string;
    role: string;
    orgType: string;
  };
  initialWorkOrderId?: string;
}

export function AssetDetailClient({
  asset,
  sessionUser,
  initialWorkOrderId,
}: AssetDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'work_orders' | 'ppm' | 'compliance' | 'defects' | 'scans' | 'docs'>('overview');
  const [workOrderId, setWorkOrderId] = useState<string>(initialWorkOrderId || '');
  const [isRecordingScan, setIsRecordingScan] = useState(false);
  const [scanSuccessMsg, setScanSuccessMsg] = useState<string | null>(null);
  const [scanErrorMsg, setScanErrorMsg] = useState<string | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);

  // Modals for engineer actions
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showDefectModal, setShowDefectModal] = useState(false);
  const [inspectionCondition, setInspectionCondition] = useState('GOOD');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [defectTitle, setDefectTitle] = useState('');
  const [defectSeverity, setDefectSeverity] = useState('MEDIUM');

  // Attempt silent GPS geolocation acquisition on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        },
        (err) => {
          console.warn('[GPS_WARN]', err.message);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  const handleRecordAttendance = async (eventType: string = 'CHECK_IN', customNotes?: string) => {
    setIsRecordingScan(true);
    setScanSuccessMsg(null);
    setScanErrorMsg(null);

    try {
      const res = await fetch('/api/assets/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_id: asset.id,
          work_order_id: workOrderId || undefined,
          scan_event_type: eventType,
          latitude: gpsCoords?.lat,
          longitude: gpsCoords?.lng,
          accuracy_meters: gpsCoords?.accuracy,
          notes: customNotes || `Verified attendance by ${sessionUser.name} (${sessionUser.role})`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to record attendance');
      }

      setScanSuccessMsg(data.message || 'Physical attendance verified and logged to auditable ledger.');
    } catch (err: any) {
      setScanErrorMsg(err.message || 'Error recording attendance');
    } finally {
      setIsRecordingScan(false);
    }
  };

  const isOperative = ['CONTRACTOR', 'ENGINEER', 'ENTIREFM'].includes(sessionUser.orgType);

  return (
    <div className="space-y-6">
      {/* ─── TOP STATUS BANNER & ATTENDANCE ACTION ─────────────────────────── */}
      <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/80 p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded bg-brand-electric/10 border border-brand-electric/30 px-2 py-0.5 font-bold text-[11px] text-brand-electric-bright">
                {asset.asset_reference}
              </span>
              <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-normal text-emerald-400">
                {asset.status}
              </span>
              <span className="rounded bg-brand-void border border-brand-edge-dark px-2 py-0.5 text-[11px] text-brand-mist/60">
                {asset.category}
              </span>
            </div>
            <h1 className="text-2xl font-light text-white tracking-tight">{asset.name}</h1>
            <p className="text-xs text-brand-mist/70 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-electric" />
              {asset.site?.name} {asset.space ? `· Space: ${asset.space.name}` : ''}
            </p>
          </div>

          {/* Quick Action Button for Operatives */}
          {isOperative && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={() => handleRecordAttendance('CHECK_IN')}
                disabled={isRecordingScan}
                className="px-4 py-2.5 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-electric/20 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                {isRecordingScan ? 'Verifying...' : 'Verify Attendance (Check-In)'}
              </button>
              <a
                href={`/api/assets/${asset.id}/qr?format=label&download=true`}
                className="px-3 py-2.5 rounded-xl border border-brand-edge-dark bg-brand-void text-brand-mist text-xs hover:bg-brand-void/80 hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Label
              </a>
            </div>
          )}
        </div>

        {/* Feedback messages */}
        {scanSuccessMsg && (
          <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{scanSuccessMsg}</span>
          </div>
        )}
        {scanErrorMsg && (
          <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{scanErrorMsg}</span>
          </div>
        )}

        {/* GPS Verification Indicator */}
        {gpsCoords && (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-brand-mist/50">
            <Navigation className="w-3 h-3 text-brand-electric" />
            <span>GPS Geolocation Ready: {gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)} (±{Math.round(gpsCoords.accuracy)}m)</span>
          </div>
        )}
      </div>

      {/* ─── OPERATIVE ACTION BAR (Field Actions) ─────────────────────────── */}
      {isOperative && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => setShowInspectionModal(true)}
            className="p-3 rounded-xl border border-brand-edge-dark bg-brand-carbon/60 hover:bg-brand-void text-left transition-all group"
          >
            <ShieldCheck className="w-4 h-4 text-brand-electric group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-normal text-white block">Log Inspection</span>
            <span className="text-[10.5px] text-brand-mist/50">Condition assessment</span>
          </button>

          <button
            onClick={() => setShowDefectModal(true)}
            className="p-3 rounded-xl border border-brand-edge-dark bg-brand-carbon/60 hover:bg-brand-void text-left transition-all group"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-normal text-white block">Report Defect</span>
            <span className="text-[10.5px] text-brand-mist/50">Log failure / fault</span>
          </button>

          <button
            onClick={() => handleRecordAttendance('PPM_ATTENDANCE', 'PPM maintenance completed')}
            className="p-3 rounded-xl border border-brand-edge-dark bg-brand-carbon/60 hover:bg-brand-void text-left transition-all group"
          >
            <Wrench className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-normal text-white block">Complete PPM</span>
            <span className="text-[10.5px] text-brand-mist/50">Record task completion</span>
          </button>

          <a
            href={`/clients/log-a-job?asset_id=${asset.id}`}
            className="p-3 rounded-xl border border-brand-edge-dark bg-brand-carbon/60 hover:bg-brand-void text-left transition-all group block"
          >
            <PlusCircle className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-normal text-white block">Raise Work Order</span>
            <span className="text-[10.5px] text-brand-mist/50">Reactive ticket</span>
          </a>
        </div>
      )}

      {/* ─── TAB NAVIGATION ──────────────────────────────────────────────── */}
      <div className="border-b border-brand-edge-dark flex gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'overview', label: 'Overview & Specs', icon: FileText },
          { id: 'work_orders', label: `Work Orders (${asset.work_orders.length})`, icon: Wrench },
          { id: 'ppm', label: `PPM Schedules (${asset.ppm_schedules.length})`, icon: Clock },
          { id: 'compliance', label: `Compliance (${asset.compliance_obligations.length})`, icon: ShieldCheck },
          { id: 'defects', label: `Defects (${asset.defects.length})`, icon: AlertTriangle },
          { id: 'scans', label: `Scan Audit (${asset.scans.length})`, icon: History },
          { id: 'docs', label: `O&M Documents (${asset.documents.length})`, icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-b-2 border-brand-electric text-white font-medium bg-brand-carbon/60'
                  : 'text-brand-mist/60 hover:text-white hover:bg-brand-void/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── TAB CONTENT PANELS ──────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Specifications */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-5 space-y-4">
            <h2 className="text-sm font-medium text-white uppercase tracking-wider">Asset Specifications</h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-brand-mist/50 block">Manufacturer</span>
                <span className="text-white font-normal">{asset.manufacturer || '—'}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Model Number</span>
                <span className="text-white font-normal">{asset.model || '—'}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Serial Number</span>
                <span className="text-white font-mono">{asset.serial_number || '—'}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Condition</span>
                <span className="text-brand-electric-bright font-normal">{asset.condition}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Criticality</span>
                <span className="text-amber-400 font-normal">{asset.criticality}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Installation Date</span>
                <span className="text-white font-normal">{asset.installation_date || '—'}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Warranty Status</span>
                <span className="text-white font-normal">{asset.warranty_expiry ? `Expires ${asset.warranty_expiry}` : 'Standard / Expired'}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Statutory Item</span>
                <span className="text-white font-normal">{asset.statutory_relevance ? 'Yes (Mandatory Compliance)' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Location & Site Details */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-5 space-y-4">
            <h2 className="text-sm font-medium text-white uppercase tracking-wider">Site Location & Tag</h2>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-brand-mist/50 block">Site Name</span>
                <span className="text-white font-normal">{asset.site?.name}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Address</span>
                <span className="text-brand-mist/80">
                  {asset.site?.address_line1}, {asset.site?.city} {asset.site?.postcode}
                </span>
              </div>
              <div className="pt-2">
                <a
                  href={`/api/assets/${asset.id}/qr?format=qr_only`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-brand-electric-bright hover:underline"
                >
                  <QrCode className="w-4 h-4" /> View Direct QR Tag Code
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'work_orders' && (
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-brand-edge-dark bg-brand-void/80 text-brand-mist/60 text-[11px] uppercase">
              <tr>
                <th className="px-5 py-3">WO Number</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
              {asset.work_orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-brand-mist/40">
                    No work orders recorded on this asset.
                  </td>
                </tr>
              ) : (
                asset.work_orders.map((wo) => (
                  <tr key={wo.id} className="hover:bg-brand-void/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-brand-electric-bright">{wo.work_order_number}</td>
                    <td className="px-5 py-3 text-white">{wo.title}</td>
                    <td className="px-5 py-3">{wo.priority}</td>
                    <td className="px-5 py-3">
                      <span className="rounded bg-brand-electric/10 border border-brand-electric/20 px-2 py-0.5 text-[10px] text-brand-electric-bright">
                        {wo.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-brand-mist/60">{new Date(wo.created_at).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'scans' && (
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
          <div className="p-4 border-b border-brand-edge-dark flex items-center justify-between">
            <h2 className="text-xs font-medium text-white uppercase tracking-wider">Auditable Physical Attendance Log</h2>
            <span className="text-[11px] text-brand-mist/50">Recorded scans with timestamps &amp; GPS</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="border-b border-brand-edge-dark bg-brand-void/80 text-brand-mist/60 text-[11px] uppercase">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Event Type</th>
                <th className="px-5 py-3">Operative</th>
                <th className="px-5 py-3">GPS Coordinates</th>
                <th className="px-5 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
              {asset.scans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-brand-mist/40">
                    No scan records yet. Scan the physical QR tag to verify attendance.
                  </td>
                </tr>
              ) : (
                asset.scans.map((s) => (
                  <tr key={s.id} className="hover:bg-brand-void/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-brand-mist/80">{new Date(s.created_at).toLocaleString('en-GB')}</td>
                    <td className="px-5 py-3">
                      <span className="rounded bg-brand-electric/10 border border-brand-electric/20 px-2 py-0.5 text-[10px] text-brand-electric-bright">
                        {s.scan_event_type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white">{s.scanned_by_name}</td>
                    <td className="px-5 py-3 text-brand-mist/60 font-mono text-[11px]">
                      {s.latitude && s.longitude ? `${s.latitude.toFixed(4)}, ${s.longitude.toFixed(4)}` : 'Verified via QR'}
                    </td>
                    <td className="px-5 py-3 text-brand-mist/70">{s.notes || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspection Modal */}
      {showInspectionModal && (
        <div className="fixed inset-0 bg-brand-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-brand-carbon border border-brand-edge-dark rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-light text-white">Record Condition Inspection</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-brand-mist/60 block mb-1">Observed Condition</label>
                <select
                  value={inspectionCondition}
                  onChange={(e) => setInspectionCondition(e.target.value)}
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                >
                  <option value="EXCELLENT">EXCELLENT — Like New</option>
                  <option value="GOOD">GOOD — Operational with normal wear</option>
                  <option value="FAIR">FAIR — Minor degradation observed</option>
                  <option value="POOR">POOR — Requires corrective maintenance</option>
                  <option value="CRITICAL">CRITICAL — High risk of imminent failure</option>
                </select>
              </div>
              <div>
                <label className="text-brand-mist/60 block mb-1">Inspection Notes</label>
                <textarea
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  rows={3}
                  placeholder="Record observations, noise, leaks, vibration..."
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white placeholder-brand-mist/30"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowInspectionModal(false)}
                className="px-4 py-2 rounded-xl border border-brand-edge-dark text-xs text-brand-mist hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleRecordAttendance('INSPECTION', `Condition: ${inspectionCondition}. Notes: ${inspectionNotes}`);
                  setShowInspectionModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85"
              >
                Save Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Defect Modal */}
      {showDefectModal && (
        <div className="fixed inset-0 bg-brand-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-brand-carbon border border-brand-edge-dark rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-light text-white">Report Asset Defect</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-brand-mist/60 block mb-1">Defect Description</label>
                <input
                  type="text"
                  value={defectTitle}
                  onChange={(e) => setDefectTitle(e.target.value)}
                  placeholder="e.g. Bearing noise on motor, refrigerant leak..."
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white placeholder-brand-mist/30"
                />
              </div>
              <div>
                <label className="text-brand-mist/60 block mb-1">Severity</label>
                <select
                  value={defectSeverity}
                  onChange={(e) => setDefectSeverity(e.target.value)}
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                >
                  <option value="LOW">LOW — Cosmetic / Minor</option>
                  <option value="MEDIUM">MEDIUM — Operational with degradation</option>
                  <option value="HIGH">HIGH — Urgent repair needed</option>
                  <option value="CRITICAL">CRITICAL — Plant down / Safety hazard</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDefectModal(false)}
                className="px-4 py-2 rounded-xl border border-brand-edge-dark text-xs text-brand-mist hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleRecordAttendance('DEFECT_REPORT', `Defect: ${defectTitle} (${defectSeverity})`);
                  setShowDefectModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-brand-void text-xs font-semibold hover:bg-amber-400"
              >
                Submit Defect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
