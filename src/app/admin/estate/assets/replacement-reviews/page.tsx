import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { getReplacementReviewCandidates } from '@/server/asset-intelligence';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function ReplacementReviewsPage() {
  const session = await getCurrentSession();
  const candidates = await getReplacementReviewCandidates(undefined, session || ({} as any));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Estate & Assets"
        title="Asset Replacement Reviews"
        description="Human-governed repair vs replacement decision support driven by deterministic multi-signal evaluation (age, condition, repeat failures, reactive spend)."
        action={
          <a
            href="/admin/estate/assets/intelligence"
            className="rounded border border-brand-edge-dark bg-brand-carbon/60 px-3.5 py-1.5 text-[12.5px] font-normal text-brand-mist/80 hover:bg-brand-carbon hover:text-white"
          >
            ← Intelligence Dashboard
          </a>
        }
      />

      {candidates.length === 0 ? (
        <EmptyState
          title="No Replacement Review Candidates"
          description="No active assets currently meet the multi-signal threshold for replacement review (age exceeding design life, repeat failures, poor/critical condition, high reactive cost)."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Asset</th>
                <th className="px-5 py-3">Site Location</th>
                <th className="px-5 py-3">Condition / Criticality</th>
                <th className="px-5 py-3">Age / Design Life</th>
                <th className="px-5 py-3">Active Signals</th>
                <th className="px-5 py-3">Replacement Estimate</th>
                <th className="px-5 py-3">Review Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {candidates.map((c) => (
                <tr key={c.asset_id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4">
                    <div className="font-mono text-[11px] text-white">{c.asset_reference}</div>
                    <div className="text-[11.5px] text-brand-mist/60">{c.asset_name}</div>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-brand-mist/70">{c.site_name}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-normal ${
                        c.condition === 'CRITICAL' || c.condition === 'POOR'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-brand-edge-dark text-brand-mist/70'
                      }`}>
                        {c.condition}
                      </span>
                      <span className="rounded bg-brand-void px-1.5 py-0.5 font-mono text-[10px] text-brand-mist/50">
                        {c.criticality}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11.5px] text-brand-mist/70">
                    {c.age_years !== 'NO_DATA' ? `${c.age_years} yrs` : 'NO_DATA'} / {c.expected_life_years !== 'NO_DATA' ? `${c.expected_life_years} yrs` : 'NO_DATA'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {c.signals.map((sig) => (
                        <span key={sig} className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[9.5px] text-amber-300">
                          {sig}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11.5px] text-brand-mist/70">
                    {c.replacement_estimate_gbp ? `£${c.replacement_estimate_gbp.toFixed(0)}` : 'NOT_CONFIGURED'}
                    {c.estimate_freshness === 'STALE' && (
                      <span className="ml-1 rounded bg-rose-500/20 px-1 py-0.5 text-[9px] text-rose-300">STALE</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded px-2 py-0.5 font-mono text-[10.5px] font-normal ${
                      c.has_open_review
                        ? 'bg-brand-electric/20 text-brand-electric'
                        : 'bg-brand-edge-dark text-brand-mist/60'
                    }`}>
                      {c.has_open_review ? 'REVIEW_OPEN' : 'ELIGIBLE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
