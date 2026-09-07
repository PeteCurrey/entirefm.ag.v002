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
            className="rounded border border-[#E8E8E5] bg-white px-3.5 py-1.5 text-[12.5px] font-normal text-[#6D6D68] hover:bg-white hover:text-white"
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
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E5] bg-white shadow-sm">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">
                <th className="px-5 py-3">Asset</th>
                <th className="px-5 py-3">Site Location</th>
                <th className="px-5 py-3">Condition / Criticality</th>
                <th className="px-5 py-3">Age / Design Life</th>
                <th className="px-5 py-3">Active Signals</th>
                <th className="px-5 py-3">Replacement Estimate</th>
                <th className="px-5 py-3">Review Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {candidates.map((c) => (
                <tr key={c.asset_id} className="text-[#6D6D68] hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4">
                    <div className="font-normal text-[11px] text-[#111111]">{c.asset_reference}</div>
                    <div className="text-[11.5px] text-[#6D6D68]">{c.asset_name}</div>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-[#6D6D68]">{c.site_name}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-normal ${
                        c.condition === 'CRITICAL' || c.condition === 'POOR'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-[#F5F5F3] text-[#6D6D68]'
                      }`}>
                        {c.condition}
                      </span>
                      <span className="rounded bg-[#FAFAF8] px-1.5 py-0.5 font-normal text-[10px] text-[#9A9A95]">
                        {c.criticality}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-normal text-[11.5px] text-[#6D6D68]">
                    {c.age_years !== 'NO_DATA' ? `${c.age_years} yrs` : 'NO_DATA'} / {c.expected_life_years !== 'NO_DATA' ? `${c.expected_life_years} yrs` : 'NO_DATA'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {c.signals.map((sig) => (
                        <span key={sig} className="rounded bg-amber-500/20 px-1.5 py-0.5 font-normal text-[9.5px] text-amber-300">
                          {sig}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-normal text-[11.5px] text-[#6D6D68]">
                    {c.replacement_estimate_gbp ? `£${c.replacement_estimate_gbp.toFixed(0)}` : 'NOT_CONFIGURED'}
                    {c.estimate_freshness === 'STALE' && (
                      <span className="ml-1 rounded bg-rose-500/20 px-1 py-0.5 text-[9px] text-rose-300">STALE</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded px-2 py-0.5 text-[10.5px] font-normal ${
                      c.has_open_review
                        ? 'bg-brand-electric/20 text-brand-electric'
                        : 'bg-[#F5F5F3] text-[#6D6D68]'
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
