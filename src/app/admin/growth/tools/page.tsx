import { Metadata } from 'next';
import Link from 'next/link';
import { getToolsPerformance } from '@/server/growth/store';
import { Wrench, ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'Tools & Resources Commercial Impact | EntireFM Admin' };

export default async function ToolsPerformancePage() {
  const tools = await getToolsPerformance();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-400 font-bold">
            INTERACTIVE CALCULATORS &amp; ASSISTED CONVERSIONS
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Tools &amp; Resources Performance</h1>
          <p className="text-sm text-zinc-400">
            Measure how interactive FM tools (PPM Builder, ROI Calculator, Compliance Calendar) influence qualified leads.
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
              <th className="py-3 px-4">Interactive Tool</th>
              <th className="py-3 px-4">Direct Leads</th>
              <th className="py-3 px-4">Assisted Leads</th>
              <th className="py-3 px-4">Completion Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {tools.map((t) => (
              <tr key={t.key} className="hover:bg-zinc-800/40">
                <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                  <Wrench className="h-3.5 w-3.5 text-emerald-400" />
                  {t.label}
                </td>
                <td className="py-3.5 px-4 font-mono text-pink-400 font-semibold">{t.leadsCount}</td>
                <td className="py-3.5 px-4 font-mono text-purple-400 font-semibold">{t.assistedCount}</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400">TRACKING ACTIVE</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
