'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  RotateCw,
  Clock,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Layers,
  Building2,
  Users,
  Briefcase,
  Wrench,
  Zap,
  MapPin,
} from 'lucide-react';
import type { BenchmarkSnapshot } from '@/server/benchmarking/types';

interface CutItem {
  label: string;
  count: number;
}

interface AdminCutCounts {
  year: number;
  totalRows: number;
  suspiciousRowCount: number;
  salaryBand: CutItem[];
  teamSize: CutItem[];
  primarySector: CutItem[];
  biggestChallenge: CutItem[];
  technologyAdoptionLevel: CutItem[];
  sustainabilityTargetYear: CutItem[];
  region: CutItem[];
}

interface Props {
  initialCutCounts: AdminCutCounts;
  initialLatestSnapshot: BenchmarkSnapshot | null;
  initialHistory: BenchmarkSnapshot[];
}

const THRESHOLD = 10;

function getStatusBadge(count: number) {
  if (count >= THRESHOLD) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        n={count} (Valid)
      </span>
    );
  }
  if (count >= 7) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium bg-amber-500/10 text-amber-800 border border-amber-500/30">
        <AlertTriangle className="w-3 h-3 text-amber-600" />
        n={count} (Near Threshold)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium bg-rose-500/10 text-rose-700 border border-rose-500/30">
      <ShieldAlert className="w-3 h-3 text-rose-600" />
      n={count} (Suppressed)
    </span>
  );
}

export function AdminPulseClient({
  initialCutCounts,
  initialLatestSnapshot,
  initialHistory,
}: Props) {
  const [cutCounts, setCutCounts] = useState<AdminCutCounts>(initialCutCounts);
  const [latestSnapshot, setLatestSnapshot] = useState<BenchmarkSnapshot | null>(initialLatestSnapshot);
  const [history, setHistory] = useState<BenchmarkSnapshot[]>(initialHistory);
  const [runningSnapshot, setRunningSnapshot] = useState(false);
  const [runMessage, setRunMessage] = useState<string | null>(null);

  const handleRunSnapshot = async () => {
    setRunningSnapshot(true);
    setRunMessage(null);

    try {
      const res = await fetch(`/api/admin/pulse/snapshot?year=${cutCounts.year}`, {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success && data.snapshot) {
        setLatestSnapshot(data.snapshot);
        setHistory((prev) => [data.snapshot, ...prev.slice(0, 19)]);
        setRunMessage(`✅ Successfully compiled snapshot ${data.snapshot.id} (${data.snapshot.totalResponses} verified responses).`);
      } else {
        setRunMessage(`❌ Error: ${data.error || 'Failed to run snapshot'}`);
      }
    } catch (err: any) {
      setRunMessage(`❌ Exception: ${err.message}`);
    } finally {
      setRunningSnapshot(false);
    }
  };

  const categories = [
    { title: 'Top Operational Challenges', icon: Wrench, data: cutCounts.biggestChallenge },
    { title: 'Primary Sectors', icon: Building2, data: cutCounts.primarySector },
    { title: 'Salary Bands', icon: Briefcase, data: cutCounts.salaryBand },
    { title: 'Team Sizes', icon: Users, data: cutCounts.teamSize },
    { title: 'CAFM & Technology Adoption', icon: Zap, data: cutCounts.technologyAdoptionLevel },
    { title: 'Sustainability Target Timelines', icon: Calendar, data: cutCounts.sustainabilityTargetYear },
    { title: 'Geographic Regions', icon: MapPin, data: cutCounts.region },
  ];

  return (
    <div className="space-y-8">
      {/* Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#EA580C] uppercase tracking-wider">
            <span>The Lobby • Pulse Intelligence</span>
            <span>/</span>
            <span>Survey Cut Governance</span>
          </div>
          <h1 className="text-2xl font-light text-slate-900 mt-1">
            Pulse Survey Health &amp; Suppression Monitor
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal-only audit tool showing raw response counts per cut. Monitor which topics clear the n ≥ {THRESHOLD} privacy suppression threshold before the next scheduled quarterly release.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/lobby/benchmarking"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium px-3.5 py-2 rounded-md flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            Live Member View
          </a>
          <button
            onClick={handleRunSnapshot}
            disabled={runningSnapshot}
            className="text-xs bg-[#EA580C] hover:bg-[#EA580C]/90 text-white font-medium px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${runningSnapshot ? 'animate-spin' : ''}`} />
            {runningSnapshot ? 'Compiling Snapshot...' : 'Run Snapshot Now'}
          </button>
        </div>
      </div>

      {runMessage && (
        <div className="p-3 rounded-lg border text-xs bg-slate-50 border-slate-200 text-slate-800">
          {runMessage}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Verified Response Rows</span>
            <Users className="w-4 h-4 text-[#EA580C]" />
          </div>
          <div className="text-2xl font-semibold text-slate-900">{cutCounts.totalRows}</div>
          <div className="text-[11px] text-slate-400">Year {cutCounts.year} survey cohort</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Privacy Suppression Threshold</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-semibold text-slate-900">n ≥ {THRESHOLD}</div>
          <div className="text-[11px] text-slate-400">Minimum cell size to publish</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Snapshot</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-mono font-medium text-slate-800 truncate">
            {latestSnapshot ? latestSnapshot.id : 'No snapshot recorded'}
          </div>
          <div className="text-[11px] text-slate-400">
            {latestSnapshot ? new Date(latestSnapshot.runAt).toLocaleString('en-GB') : 'Awaiting initial run'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Data Hygiene Exclusions</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-semibold text-slate-900">{cutCounts.suspiciousRowCount}</div>
          <div className="text-[11px] text-slate-400">Seed/test rows filtered out</div>
        </div>
      </div>

      {/* Per-Cut Category Tables */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-900">Per-Cut Respondent Counts</h2>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Valid (≥10)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Near (7–9)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Suppressed (&lt;7)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#EA580C]" />
                    <h3 className="text-sm font-semibold text-slate-900">{cat.title}</h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {cat.data.length} cuts
                  </span>
                </div>

                {cat.data.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No submissions recorded for this field.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {cat.data.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="py-2.5 flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="text-slate-700 font-medium truncate">{item.label}</span>
                        <div className="shrink-0">{getStatusBadge(item.count)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Snapshot History Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-900">Snapshot Run History</h3>
          </div>
          <span className="text-xs text-slate-400">Last 20 quarterly compilation runs</span>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No snapshots recorded yet. Click &quot;Run Snapshot Now&quot; to compile the initial snapshot.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-2.5 px-4">Snapshot ID</th>
                  <th className="py-2.5 px-4">Period</th>
                  <th className="py-2.5 px-4">Total Responses</th>
                  <th className="py-2.5 px-4">Run At (London Time)</th>
                  <th className="py-2.5 px-4">Initiated By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {history.map((snap) => (
                  <tr key={snap.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{snap.id}</td>
                    <td className="py-2.5 px-4">Q{snap.quarter} {snap.year}</td>
                    <td className="py-2.5 px-4">{snap.totalResponses}</td>
                    <td className="py-2.5 px-4 text-slate-500">{new Date(snap.runAt).toLocaleString('en-GB')}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 border border-slate-200 text-slate-700">
                        {snap.runBy}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
