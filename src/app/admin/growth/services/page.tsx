import { Metadata } from 'next';
import Link from 'next/link';
import { getServicePerformance } from '@/server/growth/store';
import { Briefcase, ArrowRight, TrendingUp } from 'lucide-react';

export const metadata: Metadata = { title: 'Service Commercial Performance | EntireFM Admin' };

export default async function ServicePerformancePage() {
  const services = await getServicePerformance();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-400 font-bold">
            COMMERCIAL SERVICE DEMAND &amp; REVENUE
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Service Commercial Performance</h1>
          <p className="text-sm text-zinc-400">
            Track which facilities management services generate the highest volume of qualified enquiries and pipeline.
          </p>
        </div>
        <Link
          href="/admin/growth"
          className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
        >
          ← Growth Overview
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Service Offering</th>
              <th className="py-3 px-4">Total Leads</th>
              <th className="py-3 px-4">Qualified Leads</th>
              <th className="py-3 px-4">Assisted Leads</th>
              <th className="py-3 px-4">Pipeline Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {services.map((s) => (
              <tr key={s.key} className="hover:bg-zinc-800/40">
                <td className="py-3.5 px-4 font-bold text-white">{s.label}</td>
                <td className="py-3.5 px-4 font-mono text-pink-400 font-semibold">{s.leadsCount}</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">{s.qualifiedLeadsCount}</td>
                <td className="py-3.5 px-4 font-mono text-purple-400">{s.assistedCount}</td>
                <td className="py-3.5 px-4 font-mono text-zinc-400">
                  {s.pipelineValueGbp > 0 ? `£${s.pipelineValueGbp.toLocaleString()}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
