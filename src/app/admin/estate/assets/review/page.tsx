import React from 'react';
import { listAssetCandidates, listAssetDuplicates } from '@/server/ppm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

const SOURCE_COLOURS: Record<string, string> = {
  FIELD_DISCOVERY: 'bg-blue-900/40 text-blue-300',
  SPREADSHEET_IMPORT: 'bg-purple-900/40 text-purple-300',
  DOCUMENT_EXTRACTION: 'bg-amber-900/40 text-amber-300',
  COBIE_IMPORT: 'bg-indigo-900/40 text-indigo-300',
  MANUAL: 'bg-brand-edge-dark text-brand-mist/60',
};

const STATUS_COLOURS: Record<string, string> = {
  PENDING: 'bg-amber-900/40 text-amber-300',
  VERIFIED: 'bg-emerald-900/40 text-emerald-300',
  REJECTED: 'bg-red-900/40 text-red-300',
  MERGED: 'bg-brand-edge-dark text-brand-mist/50',
};

export default async function AssetReviewPage() {
  const [candidates, duplicates] = await Promise.all([
    listAssetCandidates({ status: 'PENDING' }).catch(() => []),
    listAssetDuplicates({ status: 'PENDING' }).catch(() => []),
  ]);

  return (
    <div className="space-y-10">
      <AdminPageHeader
        category="Estate"
        title="Asset Review Desk"
        description="Review AI-extracted, field-discovered, and imported asset candidates before they become authoritative records."
      />

      {/* Summary bar */}
      <div className="flex gap-4">
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 px-5 py-4 text-center">
          <div className="font-mono text-2xl font-extralight text-white">{candidates.length}</div>
          <div className="mt-1 text-[11px] text-brand-mist/50 uppercase tracking-wider">Candidates Pending</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 px-5 py-4 text-center">
          <div className="font-mono text-2xl font-extralight text-white">{duplicates.length}</div>
          <div className="mt-1 text-[11px] text-brand-mist/50 uppercase tracking-wider">Duplicates Pending</div>
        </div>
      </div>

      {/* Asset Candidates */}
      <div>
        <h2 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-brand-mist/40">
          Asset Candidates
        </h2>
        {candidates.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
            <table className="w-full min-w-[56rem] border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                  <th className="px-5 py-3">Proposed Name</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Manufacturer</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Confidence</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/60">
                {candidates.map((c) => (
                  <tr key={c.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                    <td className="px-5 py-4 font-light text-white">{c.proposed_name}</td>
                    <td className="px-5 py-4 text-brand-mist/70">{c.proposed_category || '—'}</td>
                    <td className="px-5 py-4 text-brand-mist/70">{c.proposed_manufacturer || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded px-2 py-0.5 font-mono text-[10px] ${SOURCE_COLOURS[c.source_type] ?? 'bg-brand-edge-dark text-brand-mist/60'}`}>
                        {c.source_type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/70">
                      {Math.round(c.confidence_score * 100)}%
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded px-2 py-0.5 font-mono text-[10px] ${STATUS_COLOURS[c.status] ?? ''}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button className="text-[11px] text-emerald-400 hover:text-emerald-300">Verify</button>
                        <button className="text-[11px] text-red-400 hover:text-red-300">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No Pending Asset Candidates" description="All asset candidates have been reviewed." />
        )}
      </div>

      {/* Duplicate Candidates */}
      <div>
        <h2 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-brand-mist/40">
          Duplicate Candidates
        </h2>
        {duplicates.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
            <table className="w-full border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                  <th className="px-5 py-3">Confidence</th>
                  <th className="px-5 py-3">Match Reasons</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/60">
                {duplicates.map((d) => (
                  <tr key={d.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                    <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/70">
                      {Math.round(d.confidence_score * 100)}%
                    </td>
                    <td className="px-5 py-4 text-[11.5px] text-brand-mist/60">
                      {Array.isArray(d.match_reasons_json) ? d.match_reasons_json.join(', ') : String(d.match_reasons_json || '—')}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded bg-amber-900/40 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                        {d.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/50">
                      {new Date(d.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button className="text-[11px] text-amber-400 hover:text-amber-300">Merge</button>
                        <button className="text-[11px] text-brand-mist/50 hover:text-brand-mist">Keep Separate</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No Duplicate Candidates Pending" description="No duplicate asset pairs require resolution." />
        )}
      </div>
    </div>
  );
}
