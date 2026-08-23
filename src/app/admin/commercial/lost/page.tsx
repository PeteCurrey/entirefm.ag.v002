import { Metadata } from 'next';
import Link from 'next/link';
import { listOpportunities } from '@/server/commercial/pipeline';
import { XCircle, ArrowRight, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = { title: 'Lost Opportunity Intelligence | EntireFM Admin' };

export default async function LostOpportunitiesPage() {
  const opps = await listOpportunities('LOST');

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase text-red-400 font-bold">
            COMMERCIAL LOSS ANALYSIS &amp; FEEDBACK
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Lost Opportunities Analysis</h1>
          <p className="text-sm text-zinc-400">
            Audit lost proposals, pricing objections, competitor incumbent retentions, and service fit mismatches.
          </p>
        </div>
        <Link
          href="/admin/commercial"
          className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
        >
          ← Commercial Overview
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
            Lost Opportunities ({opps.length})
          </h3>
        </div>

        {opps.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs font-mono">
            Zero lost opportunities recorded in this period.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Service &amp; Location</th>
                <th className="py-3 px-4">Lost Reason</th>
                <th className="py-3 px-4">Est. Value</th>
                <th className="py-3 px-4">Closed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {opps.map((o) => (
                <tr key={o.id} className="hover:bg-zinc-800/40">
                  <td className="py-3.5 px-4 font-bold text-white">{o.company}</td>
                  <td className="py-3.5 px-4 text-zinc-400">
                    {o.service} · {o.location}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-red-400 font-semibold">{o.won_lost_reason || 'Unspecified'}</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300">
                    {o.estimated_value_gbp ? `£${o.estimated_value_gbp.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-500">
                    {o.closed_at ? new Date(o.closed_at).toLocaleDateString('en-GB') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
