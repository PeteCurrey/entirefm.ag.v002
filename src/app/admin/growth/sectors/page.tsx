import { Metadata } from 'next';
import Link from 'next/link';
import { getSectorPerformance } from '@/server/growth/store';
import { Layers } from 'lucide-react';

export const metadata: Metadata = { title: 'Sector Commercial Performance | EntireFM Admin' };

export default async function SectorPerformancePage() {
  const sectors = await getSectorPerformance();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-400 font-bold">
            SECTOR-SPECIFIC DEMAND &amp; PATHWAYS
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Sector Commercial Performance</h1>
          <p className="text-sm text-zinc-400">
            Track commercial engagement across industrial, commercial offices, healthcare, and retail sectors.
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
              <th className="py-3 px-4">Commercial Sector</th>
              <th className="py-3 px-4">Total Inbound Leads</th>
              <th className="py-3 px-4">Qualified Leads</th>
              <th className="py-3 px-4">Est. Conversion Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {sectors.map((sec) => (
              <tr key={sec.key} className="hover:bg-zinc-800/40">
                <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-blue-400" />
                  {sec.label}
                </td>
                <td className="py-3.5 px-4 font-mono text-pink-400 font-semibold">{sec.leadsCount}</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">{sec.qualifiedLeadsCount}</td>
                <td className="py-3.5 px-4 font-mono text-zinc-400">{sec.conversionRatePct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
