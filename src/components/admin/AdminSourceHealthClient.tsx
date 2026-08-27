'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Key,
  RefreshCw,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import type { IntelligenceSource, IngestionRun } from '@/server/intelligence/types';

export function AdminSourceHealthClient() {
  const [sources, setSources] = useState<IntelligenceSource[]>([]);
  const [runs, setRuns] = useState<IngestionRun[]>([]);
  const [counts, setCounts] = useState<{ totalItems: number; statutoryItems: number; pendingReview: number; totalRuns: number }>({
    totalItems: 0,
    statutoryItems: 0,
    pendingReview: 0,
    totalRuns: 0,
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchHealth = () => {
    fetch('/api/lobby/intelligence/sources')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSources(data.sources || []);
          setRuns(data.recentRuns || []);
          if (data.counts) setCounts(data.counts);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const triggerIngestion = async () => {
    setSyncing(true);
    try {
      await fetch('/api/lobby/intelligence/ingest', { method: 'POST' });
      fetchHealth();
    } finally {
      setSyncing(false);
    }
  };

  const getStatusBadge = (status: IntelligenceSource['healthStatus']) => {
    switch (status) {
      case 'LIVE':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            LIVE
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            DEGRADED
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            FAILED
          </span>
        );
      case 'CREDENTIAL_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 border border-purple-500/20">
            <Key className="w-3 h-3" />
            KEY REQUIRED
          </span>
        );
      default:
        return <span className="text-[10px] font-mono text-white/40">DISABLED</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] border border-white/10 p-5 rounded-sm">
          <div className="text-[10px] font-mono uppercase text-white/40">Canonical Items</div>
          <div className="text-2xl font-light text-white mt-1">{counts.totalItems}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 p-5 rounded-sm">
          <div className="text-[10px] font-mono uppercase text-white/40">Statutory / Legal</div>
          <div className="text-2xl font-light text-emerald-400 mt-1">{counts.statutoryItems}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 p-5 rounded-sm">
          <div className="text-[10px] font-mono uppercase text-white/40">Pending Review</div>
          <div className="text-2xl font-light text-amber-400 mt-1">{counts.pendingReview}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 p-5 rounded-sm">
          <div className="text-[10px] font-mono uppercase text-white/40">Total Ingestion Runs</div>
          <div className="text-2xl font-light text-brand-electric mt-1">{counts.totalRuns}</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-white/60">
          Source Registry ({sources.length} Configured Integrations)
        </div>
        <button
          onClick={triggerIngestion}
          disabled={syncing}
          className="inline-flex items-center gap-2 bg-brand-electric text-white text-xs font-mono uppercase tracking-wider px-4 py-2 rounded-sm hover:brightness-110 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing Feeds...' : 'Trigger Immediate Ingestion'}</span>
        </button>
      </div>

      {/* Source Table */}
      <div className="overflow-x-auto border border-white/10 rounded-sm bg-white/[0.01]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-white/[0.04] text-white/60 border-b border-white/10">
            <tr>
              <th className="p-3">Source Name</th>
              <th className="p-3">Authority Tier</th>
              <th className="p-3">Access Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Poll Interval</th>
              <th className="p-3">24h Records</th>
              <th className="p-3">Last Fetch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sources.map((src) => (
              <tr key={src.id} className="hover:bg-white/[0.02]">
                <td className="p-3">
                  <div className="font-sans font-medium text-white">{src.name}</div>
                  <div className="text-[10px] text-white/40">{src.baseDomain}</div>
                </td>
                <td className="p-3">
                  <span className="text-[11px] text-white/70">Tier {src.authorityTier}</span>
                </td>
                <td className="p-3 text-white/50">{src.accessType.replace('_', ' ')}</td>
                <td className="p-3">{getStatusBadge(src.healthStatus)}</td>
                <td className="p-3 text-white/50">{src.pollIntervalMinutes} mins</td>
                <td className="p-3 text-white/80">{src.recordsIngested24h}</td>
                <td className="p-3 text-white/40">
                  {src.lastSuccessfulFetch
                    ? new Date(src.lastSuccessfulFetch).toLocaleTimeString('en-GB')
                    : 'Awaiting Run'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ingestion Runs History */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-white/60 mb-3">
          Recent Ingestion Runs Audit Trail
        </div>
        <div className="space-y-2">
          {runs.map((run) => (
            <div
              key={run.id}
              className="bg-white/[0.02] border border-white/5 p-3 rounded-sm flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-white font-medium">{run.sourceName}</span>
                <span className="text-white/40">Fetched {run.recordsFetched} items</span>
                <span className="text-emerald-400">Created {run.recordsCreated} canonical items</span>
              </div>
              <div className="text-white/40">
                {run.durationMs}ms · {new Date(run.startedAt).toLocaleTimeString('en-GB')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
