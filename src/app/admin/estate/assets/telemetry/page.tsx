import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { getTelemetryCoverage } from '@/server/telemetry';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function TelemetryPage() {
  const session = await getCurrentSession();

  let coverage;
  let error: string | null = null;

  try {
    coverage = await getTelemetryCoverage();
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Estate & Assets"
        title="Telemetry Sources"
        description="Real-time sensor connectivity, observation quality, and connector health across all telemetry sources."
        action={
          <a
            href="/admin/estate/assets"
            className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white shadow hover:bg-brand-indigo"
          >
            All Assets
          </a>
        }
      />

      {error && (
        <div className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Error loading telemetry data: {error}
        </div>
      )}

      {coverage?.data_status === 'NO_DATA' && (
        <EmptyState
          title="No Telemetry Sources Configured"
          description={coverage.zero_data_message ?? 'Connect a BMS, sensor platform or supported data source to begin telemetry analysis.'}
        />
      )}

      {coverage && coverage.data_status !== 'NO_DATA' && (
        <div className="space-y-6">
          {/* Coverage Summary */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <div className="rounded-lg border border-brand-edge-dark bg-brand-surface p-4">
              <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">Total Sources</p>
              <p className="mt-1 text-2xl font-semibold text-white">{coverage.total_sources}</p>
            </div>
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
              <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">Live</p>
              <p className="mt-1 text-2xl font-semibold text-green-400">{coverage.live_sources}</p>
            </div>
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">Interface Only</p>
              <p className="mt-1 text-2xl font-semibold text-yellow-400">{coverage.interface_only_sources}</p>
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">Degraded / Failed</p>
              <p className="mt-1 text-2xl font-semibold text-red-400">{coverage.degraded_or_failed_sources}</p>
            </div>
            <div className="rounded-lg border border-brand-edge-dark bg-brand-surface p-4">
              <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">Assets with Telemetry</p>
              <p className="mt-1 text-2xl font-semibold text-white">{coverage.assets_with_any_telemetry}</p>
            </div>
            <div className="rounded-lg border border-brand-edge-dark bg-brand-surface p-4">
              <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">Observations (24h)</p>
              <p className="mt-1 text-2xl font-semibold text-white">{coverage.total_observations_24h.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-brand-edge-dark bg-brand-surface p-4">
              <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">Not Configured</p>
              <p className="mt-1 text-2xl font-semibold text-brand-mist/70">{coverage.not_configured_sources}</p>
            </div>
            <div className="rounded-lg border border-brand-edge-dark bg-brand-surface p-4">
              <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">Data Status</p>
              <p className={`mt-1 text-sm font-semibold uppercase tracking-wider ${
                coverage.data_status === 'ACTIVE' ? 'text-green-400' :
                coverage.data_status === 'PARTIAL' ? 'text-yellow-400' : 'text-red-400'
              }`}>{coverage.data_status}</p>
            </div>
          </div>

          {coverage.data_status === 'PARTIAL' && (
            <div className="rounded border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
              <strong>Partial coverage:</strong> Some telemetry sources are configured but not reporting LIVE data. Check connector state and protocol configuration.
            </div>
          )}

          <div className="rounded-lg border border-brand-edge-dark bg-brand-surface px-4 py-4">
            <h3 className="text-sm font-medium text-white mb-2">Governance Note</h3>
            <p className="text-xs text-brand-mist/60 leading-relaxed">
              Telemetry data is used exclusively for deterministic anomaly detection and reliability signal generation.
              No synthetic or fake observations are ever injected at runtime.
              All anomalies include structured evidence — no mystery scores.
              Sensor anomalies are clearly distinguished from asset-level anomalies.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
