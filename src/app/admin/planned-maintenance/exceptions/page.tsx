import React from 'react';
import Link from 'next/link';
import { listOccurrences, listAssetCandidates } from '@/server/ppm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function PPMExceptionsPage() {
  const [missedOccurrences, pendingCandidates] = await Promise.all([
    listOccurrences({ status: 'MISSED' }).catch(() => []),
    listAssetCandidates({ status: 'PENDING' }).catch(() => []),
  ]);

  return (
    <div className="space-y-10">
      <AdminPageHeader
        category="Planned Maintenance"
        title="PPM Exceptions Desk"
        description="Missed occurrences, unresolved asset candidates, and maintenance planning gaps."
      />

      {/* Alert banner if missed occurrences exist */}
      {missedOccurrences.length > 0 && (
        <div className="rounded-lg border border-red-900/60 bg-red-950/30 p-4 text-[12.5px] text-red-300">
          <span className="font-light">Action Required:</span> {missedOccurrences.length} maintenance occurrence(s) have passed their permitted planning window without satisfactory completion evidence.
        </div>
      )}

      {/* Missed Occurrences Section */}
      <div>
        <h2 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-brand-mist/40">
          Missed Maintenance Occurrences
        </h2>
        {missedOccurrences.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
            <table className="w-full border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                  <th className="px-5 py-3">Occurrence Code</th>
                  <th className="px-5 py-3">Planned Date</th>
                  <th className="px-5 py-3">Window End</th>
                  <th className="px-5 py-3">Missed Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/60">
                {missedOccurrences.map((o) => (
                  <tr key={o.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                    <td className="px-5 py-4 font-mono text-[11px] text-white">{o.occurrence_code}</td>
                    <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/60">
                      {new Date(o.planned_date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-red-400">
                      {new Date(o.window_end_date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-5 py-4 text-brand-mist/70">
                      {o.missed_reason || 'Window passed without completion'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/10 p-5 text-center text-[12.5px] text-emerald-400">
            ✓ No missed occurrences — all planned maintenance is within window.
          </div>
        )}
      </div>

      {/* Pending Asset Candidates Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-brand-mist/40">
            Pending Asset Candidates
          </h2>
          {pendingCandidates.length > 0 && (
            <Link
              href="/admin/estate/assets/review"
              className="text-[11.5px] text-brand-electric hover:underline"
            >
              Open Asset Review Desk ({pendingCandidates.length}) →
            </Link>
          )}
        </div>

        {pendingCandidates.length > 0 ? (
          <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-5 text-[12.5px] text-brand-mist/70">
            There are <span className="font-light text-white">{pendingCandidates.length}</span> unverified asset candidate(s) awaiting review. These must be verified before maintenance requirements can be assigned.
          </div>
        ) : (
          <EmptyState
            title="No Pending Candidates"
            description="All field-discovered and imported asset candidates have been processed."
          />
        )}
      </div>
    </div>
  );
}
