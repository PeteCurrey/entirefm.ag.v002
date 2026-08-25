import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { getActiveReliabilitySignals } from '@/server/reliability';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: 'border-red-500/40 bg-red-500/10 text-red-300',
  HIGH: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
  WARNING: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
  INFO: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
};

const SEVERITY_BADGE: Record<string, string> = {
  CRITICAL: 'bg-red-500/20 text-red-300 border border-red-500/30',
  HIGH: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  WARNING: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  INFO: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
};

export default async function ReliabilityPage() {
  const session = await getCurrentSession();

  let signals: Awaited<ReturnType<typeof getActiveReliabilitySignals>> = [];
  let error: string | null = null;

  try {
    signals = await getActiveReliabilitySignals(50);
  } catch (e: any) {
    error = e.message;
  }

  const criticalCount = signals.filter(s => s.severity === 'CRITICAL').length;
  const highCount = signals.filter(s => s.severity === 'HIGH').length;
  const warningCount = signals.filter(s => s.severity === 'WARNING').length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Estate & Assets"
        title="Reliability Intelligence"
        description="Deterministic reliability signals generated from telemetry, asset condition, failure history, and operating context. No opaque health scores."
        action={
          <div className="flex items-center gap-3">
            <a
              href="/admin/estate/assets/telemetry"
              className="rounded border border-brand-edge-dark bg-brand-carbon/60 px-3.5 py-1.5 text-[12.5px] font-normal text-brand-mist/80 hover:bg-brand-carbon hover:text-white"
            >
              Telemetry Sources
            </a>
            <a
              href="/admin/estate/assets"
              className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white shadow hover:bg-brand-indigo"
            >
              All Assets
            </a>
          </div>
        }
      />

      {error && (
        <div className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Error loading reliability data: {error}
        </div>
      )}

      {/* Summary counts */}
      {signals.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-brand-edge-dark bg-brand-surface p-4">
            <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">Active Signals</p>
            <p className="mt-1 text-2xl font-semibold text-white">{signals.length}</p>
          </div>
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">Critical</p>
            <p className="mt-1 text-2xl font-semibold text-red-400">{criticalCount}</p>
          </div>
          <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
            <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">High</p>
            <p className="mt-1 text-2xl font-semibold text-orange-400">{highCount}</p>
          </div>
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
            <p className="text-[11px] uppercase tracking-wider text-brand-mist/50">Warning</p>
            <p className="mt-1 text-2xl font-semibold text-yellow-400">{warningCount}</p>
          </div>
        </div>
      )}

      {signals.length === 0 && !error && (
        <EmptyState
          title="No Active Reliability Signals"
          description="Reliability signals are generated deterministically from telemetry anomalies, asset condition, failure history, and operational context. Connect telemetry sources to begin generating signals."
        />
      )}

      {/* Signal list */}
      {signals.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-brand-mist/70">Active Signals — most recent first</h3>
          {signals.map((signal) => (
            <div
              key={signal.id}
              className={`rounded-lg border px-4 py-4 ${SEVERITY_STYLES[signal.severity] ?? 'border-brand-edge-dark bg-brand-surface text-brand-mist'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${SEVERITY_BADGE[signal.severity] ?? ''}`}>
                      {signal.severity}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-brand-mist/40">
                      {signal.signal_type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-white">{signal.title}</p>
                  <p className="text-xs text-brand-mist/60 leading-relaxed">{signal.description}</p>
                  <div className="flex flex-wrap gap-3 pt-1 text-[10px] text-brand-mist/40">
                    <span>Asset: <span className="text-brand-mist/60">{signal.asset_id.slice(0, 8)}…</span></span>
                    <span>Criticality: <span className="text-brand-mist/60">{signal.asset_context_snapshot?.criticality ?? '—'}</span></span>
                    <span>Condition: <span className="text-brand-mist/60">{signal.asset_context_snapshot?.condition ?? '—'}</span></span>
                    <span>Failures (90d): <span className="text-brand-mist/60">{signal.asset_context_snapshot?.failure_count_90d ?? '—'}</span></span>
                    <span>Policy: <span className="text-brand-mist/60">v{signal.policy_version}</span></span>
                    <span>Generated: <span className="text-brand-mist/60">{new Date(signal.generated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Governance note */}
      <div className="rounded-lg border border-brand-edge-dark bg-brand-surface px-4 py-4">
        <h3 className="text-sm font-medium text-white mb-2">Determinism Guarantee</h3>
        <p className="text-xs text-brand-mist/60 leading-relaxed">
          All reliability signals are generated deterministically from structured evidence.
          No opaque health scores or AI-invented anomalies.
          Sensor anomalies are explicitly scoped as SENSOR — not promoted to asset-level anomalies without additional evidence.
          Severity is escalated based on asset criticality, condition, and repeat failure history.
          No automatic work orders are created from signals — all actions require human decision.
        </p>
      </div>
    </div>
  );
}
