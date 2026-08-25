import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { getAssetIntelligenceSummary } from '@/server/asset-intelligence';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function AssetIntelligencePage() {
  const session = await getCurrentSession();
  const summary = await getAssetIntelligenceSummary(session || ({} as any));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Estate & Assets"
        title="Asset Intelligence & Lifecycle"
        description="Deterministic lifecycle cost tracking, condition evidence, repeat failure detection, and predictive maintenance readiness."
        action={
          <div className="flex items-center gap-3">
            <a
              href="/admin/estate/assets/replacement-reviews"
              className="rounded border border-brand-edge-dark bg-brand-carbon/60 px-3.5 py-1.5 text-[12.5px] font-normal text-brand-mist/80 hover:bg-brand-carbon hover:text-white"
            >
              Replacement Reviews
            </a>
            <a
              href="/admin/estate/assets"
              className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white shadow hover:bg-brand-indigo"
            >
              Asset Register
            </a>
          </div>
        }
      />

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4">
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/50">Active Assets</div>
          <div className="mt-1 font-mono text-2xl font-light text-white">{summary.total_assets}</div>
          <div className="mt-1 text-[11px] text-brand-mist/60">Registered in estate</div>
        </div>

        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4">
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/50">Assets With Signals</div>
          <div className="mt-1 font-mono text-2xl font-light text-amber-400">{summary.assets_with_signals}</div>
          <div className="mt-1 text-[11px] text-brand-mist/60">{summary.critical_signals} critical severity</div>
        </div>

        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4">
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/50">Repeat Failures (90d)</div>
          <div className="mt-1 font-mono text-2xl font-light text-rose-400">{summary.repeat_failure_assets.length}</div>
          <div className="mt-1 text-[11px] text-brand-mist/60">≥3 same-category failures</div>
        </div>

        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4">
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/50">Replacement Candidates</div>
          <div className="mt-1 font-mono text-2xl font-light text-brand-electric">{summary.replacement_candidates.length}</div>
          <div className="mt-1 text-[11px] text-brand-mist/60">Multi-signal review recommended</div>
        </div>
      </div>

      {summary.data_status === 'NO_DATA' ? (
        <EmptyState
          title="No Asset Intelligence Data Available"
          description="Import an asset register or register assets to begin deterministic lifecycle cost, condition tracking, and repeat failure analysis."
          action={{
            label: "Open Migration Centre",
            href: "/admin/platform/imports"
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Repeat Failures Section */}
          <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-5">
            <h3 className="text-sm font-normal text-white">Repeat Failure Assets (90 Days)</h3>
            <p className="mt-0.5 text-[11.5px] text-brand-mist/60">Assets with 3+ failures in the same category within window</p>

            {summary.repeat_failure_assets.length === 0 ? (
              <div className="mt-4 text-[12px] text-brand-mist/50">No repeat failure patterns detected in the last 90 days.</div>
            ) : (
              <div className="mt-4 space-y-3">
                {summary.repeat_failure_assets.map((rf) => (
                  <div key={rf.asset_id} className="flex items-center justify-between rounded border border-brand-edge-dark/60 bg-brand-void/40 p-3">
                    <div>
                      <div className="font-mono text-[11.5px] font-normal text-white">{rf.asset_reference} — {rf.asset_name}</div>
                      <div className="text-[11px] text-brand-mist/60">{rf.site_name} · {rf.failure_categories.join(', ')}</div>
                    </div>
                    <span className="rounded bg-rose-500/20 px-2 py-0.5 font-mono text-[11px] font-normal text-rose-300">
                      {rf.failure_count} failures
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Data Quality Completeness */}
          <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-5">
            <h3 className="text-sm font-normal text-white">Asset Register Completeness</h3>
            <p className="mt-0.5 text-[11.5px] text-brand-mist/60">Deterministic data quality coverage across registered assets</p>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-[11.5px]">
                  <span className="text-brand-mist/80">Install Date Coverage</span>
                  <span className="font-mono text-white">{summary.data_quality.install_date_coverage_pct}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-brand-void">
                  <div className="h-1.5 rounded-full bg-brand-electric" style={{ width: `${summary.data_quality.install_date_coverage_pct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11.5px]">
                  <span className="text-brand-mist/80">Manufacturer / Model Coverage</span>
                  <span className="font-mono text-white">{summary.data_quality.manufacturer_coverage_pct}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-brand-void">
                  <div className="h-1.5 rounded-full bg-brand-electric" style={{ width: `${summary.data_quality.manufacturer_coverage_pct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11.5px]">
                  <span className="text-brand-mist/80">Condition Assessed Coverage</span>
                  <span className="font-mono text-white">{summary.data_quality.condition_assessed_pct}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-brand-void">
                  <div className="h-1.5 rounded-full bg-amber-400" style={{ width: `${summary.data_quality.condition_assessed_pct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11.5px]">
                  <span className="text-brand-mist/80">Expected Life Configured</span>
                  <span className="font-mono text-white">{summary.data_quality.expected_life_coverage_pct}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-brand-void">
                  <div className="h-1.5 rounded-full bg-brand-indigo" style={{ width: `${summary.data_quality.expected_life_coverage_pct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
