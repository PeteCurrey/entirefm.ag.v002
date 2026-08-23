import { Metadata } from 'next';
import Link from 'next/link';
import { getLocationPerformance } from '@/server/growth/store';
import { MapPin, ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'Location Commercial Performance | EntireFM Admin' };

export default async function LocationPerformancePage() {
  const clusters = await getLocationPerformance();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-400 font-bold">
            CITY CLUSTER &amp; REGIONAL CONVERSIONS
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Location Commercial Performance</h1>
          <p className="text-sm text-zinc-400">
            Audit regional inbound demand across Manchester, London, Birmingham, and regional estate landing pages.
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
              <th className="py-3 px-4">City Cluster</th>
              <th className="py-3 px-4">Total Inbound Leads</th>
              <th className="py-3 px-4">Qualified Leads</th>
              <th className="py-3 px-4">Estimated Conv. Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {clusters.map((c) => (
              <tr key={c.key} className="hover:bg-zinc-800/40">
                <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-pink-400" />
                  {c.label}
                </td>
                <td className="py-3.5 px-4 font-mono text-pink-400 font-semibold">{c.leadsCount}</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">{c.qualifiedLeadsCount}</td>
                <td className="py-3.5 px-4 font-mono text-zinc-400">{c.conversionRatePct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
