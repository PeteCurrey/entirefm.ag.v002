import React from 'react';
import { listAssets } from '@/server/estate';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

const QUALITY_COLOURS: Record<string, string> = {
  VERIFIED: 'bg-emerald-900/40 text-emerald-300',
  PARTIAL: 'bg-amber-900/40 text-amber-300',
  UNVERIFIED: 'bg-orange-900/40 text-orange-300',
  NEEDS_REVIEW: 'bg-red-900/40 text-red-300',
  CONFLICT: 'bg-purple-900/40 text-purple-300',
  ARCHIVED: 'bg-[#F5F5F3] text-[#9A9A95]',
};

export default async function AssetDataQualityPage() {
  const assets = await listAssets().catch(() => []);

  // Compute counts
  let verifiedCount = 0;
  let partialUnverifiedCount = 0;
  let needsReviewCount = 0;

  assets.forEach((a: any) => {
    const status = a.data_quality_status || 'UNVERIFIED';
    if (status === 'VERIFIED') verifiedCount++;
    else if (status === 'NEEDS_REVIEW' || status === 'CONFLICT') needsReviewCount++;
    else partialUnverifiedCount++;
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Estate"
        title="Asset Data Quality"
        description="Identify assets with incomplete, unverified, or conflicting data to improve estate intelligence."
      />

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4 text-center">
          <div className="text-2xl font-extralight text-[#111111]">{assets.length}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-[#9A9A95]">Total Assets</div>
        </div>
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4 text-center">
          <div className="text-2xl font-extralight text-emerald-400">{verifiedCount}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-[#9A9A95]">Verified</div>
        </div>
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4 text-center">
          <div className="text-2xl font-extralight text-amber-400">{partialUnverifiedCount}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-[#9A9A95]">Partial / Unverified</div>
        </div>
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4 text-center">
          <div className="text-2xl font-extralight text-red-400">{needsReviewCount}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-[#9A9A95]">Needs Review</div>
        </div>
      </div>

      {assets.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E5] bg-white shadow-sm">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">
                <th className="px-5 py-3">Asset Ref</th>
                <th className="px-5 py-3">Name / Category</th>
                <th className="px-5 py-3">Quality Status</th>
                <th className="px-5 py-3">Completeness</th>
                <th className="px-5 py-3">Missing Key Fields</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {assets.map((a: any) => {
                const status = a.data_quality_status || 'UNVERIFIED';
                const score = typeof a.completeness_score === 'number' ? Math.round(a.completeness_score * 100) : null;
                const missing: string[] = [];
                if (!a.manufacturer) missing.push('Manufacturer');
                if (!a.model_number) missing.push('Model');
                if (!a.serial_number) missing.push('Serial');
                if (!a.install_date) missing.push('Install Date');

                return (
                  <tr key={a.id} className="text-[#6D6D68] hover:bg-[#FAFAF8]">
                    <td className="px-5 py-4 font-normal text-[11px] text-white">{a.asset_reference}</td>
                    <td className="px-5 py-4">
                      <div className="font-light text-[#111111]">{a.name}</div>
                      <div className="text-[11.5px] text-[#9A9A95]">{a.category}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded px-2 py-0.5 font-normal text-[10px]${QUALITY_COLOURS[status] ?? 'bg-[#F5F5F3] text-[#6D6D68]'}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {score !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#F5F5F3]">
                            <div
                              className={`h-full ${score >= 80 ? 'bg-emerald-400' : score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="font-normal text-[11px] text-[#6D6D68]">{score}%</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#9A9A95]">Not scored</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {missing.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {missing.map((m) => (
                            <span key={m} className="rounded bg-amber-900/20 px-1.5 py-0.5 text-[10px] text-amber-300/80 border border-amber-900/30">
                              {m}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-emerald-400/80">Complete</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Assets Found"
          description="Register assets or import an estate spreadsheet to view data quality analysis."
        />
      )}
    </div>
  );
}
