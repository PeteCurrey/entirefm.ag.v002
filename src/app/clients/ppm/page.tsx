import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export default async function ClientPpmPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const { data: occurrences } = await dbQuery<any[]>(
    `maintenance_occurrences?select=id,occurrence_code,planned_date,status,plan:maintenance_plans(name),asset:assets(name,asset_reference)&order=planned_date.asc&limit=50`
  );

  const list = occurrences || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">Planned Preventive Maintenance (PPM)</h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Statutory, standard, and asset manufacturer service schedules.
        </p>
      </div>

      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-mono text-[11px] uppercase">
            <tr>
              <th className="px-6 py-3">Schedule Code</th>
              <th className="px-6 py-3">Asset</th>
              <th className="px-6 py-3">Plan Name</th>
              <th className="px-6 py-3">Planned Date</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-brand-mist/40">
                  No PPM occurrences scheduled in this period.
                </td>
              </tr>
            ) : (
              list.map((occ) => (
                <tr key={occ.id} className="hover:bg-brand-void/30 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-brand-electric-bright">{occ.occurrence_code}</td>
                  <td className="px-6 py-3.5 font-normal text-white">{occ.asset?.name || 'Asset'}</td>
                  <td className="px-6 py-3.5">{occ.plan?.name || 'PPM Plan'}</td>
                  <td className="px-6 py-3.5 font-mono text-[12px]">{occ.planned_date || '—'}</td>
                  <td className="px-6 py-3.5">
                    <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                      {occ.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
