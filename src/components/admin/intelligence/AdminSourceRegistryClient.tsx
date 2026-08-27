'use client';

import { useState } from 'react';
import type { IntelligenceSource } from '@/server/intelligence/types';

interface AdminSourceRegistryClientProps {
  initialSources: IntelligenceSource[];
  initialHealthSummary: {
    total: number;
    live: number;
    credentialRequired: number;
    degraded: number;
    failed: number;
    disabled: number;
  };
}

export function AdminSourceRegistryClient({
  initialSources,
  initialHealthSummary,
}: AdminSourceRegistryClientProps) {
  const [sources] = useState<IntelligenceSource[]>(initialSources);
  const [summary] = useState(initialHealthSummary);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  async function handleTriggerSync(sourceId?: string) {
    setSyncStatus(`Requesting sync for ${sourceId || 'all sources'}…`);
    try {
      const res = await fetch('/api/admin/intelligence/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SYNC', sourceId }),
      });
      const data = await res.json();
      setSyncStatus(data.message || 'Sync queued.');
    } catch (err: any) {
      setSyncStatus(`Sync failed: ${err.message}`);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
              External Data Feeds Register
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Intelligence Source Registry</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tier-classified external connectors, update frequencies, rights metadata, and live operational status.
          </p>
        </div>

        <button
          onClick={() => handleTriggerSync()}
          className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors self-start md:self-auto"
        >
          Trigger Sync All
        </button>
      </div>

      {syncStatus && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 font-medium">
          {syncStatus}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <span className="text-xs text-gray-500 uppercase font-semibold">Total Connectors</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <span className="text-xs text-gray-500 uppercase font-semibold">Live & Active</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{summary.live}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <span className="text-xs text-gray-500 uppercase font-semibold">Credential Required</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{summary.credentialRequired}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <span className="text-xs text-gray-500 uppercase font-semibold">Degraded / Failed</span>
          <p className="text-2xl font-bold text-rose-600 mt-1">{summary.degraded + summary.failed}</p>
        </div>
      </div>

      {/* Source List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-900">Registered Authoritative Sources ({sources.length})</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {sources.map((src) => {
            const healthColor =
              src.healthStatus === 'LIVE' ? 'bg-emerald-100 text-emerald-800' :
              src.healthStatus === 'CREDENTIAL_REQUIRED' ? 'bg-amber-100 text-amber-800' :
              'bg-rose-100 text-rose-800';

            return (
              <div key={src.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Tier {src.authorityTier}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${healthColor}`}>
                      {src.healthStatus.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">ID: {src.id}</span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900">{src.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{src.description}</p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-gray-500">
                    <span><strong>Poll Interval:</strong> {src.pollIntervalMinutes} min</span>
                    <span>•</span>
                    <span><strong>Access:</strong> {src.accessType.replace(/_/g, ' ')}</span>
                    {src.credentialEnvKey && (
                      <>
                        <span>•</span>
                        <span className="font-mono">Env: {src.credentialEnvKey}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTriggerSync(src.id)}
                    className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                  >
                    Sync Connector
                  </button>
                  <a
                    href={src.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-semibold border border-gray-200 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
                  >
                    Base URL ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
