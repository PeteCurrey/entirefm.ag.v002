import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const metadata: Metadata = { title: 'Automation Jobs | EntireFM Admin' };

export default function AutomationJobsPage() {
  const jobs = [
    {
      id: 'job-1',
      jobType: 'WEEKLY_BRIEFING_DRAFT',
      status: 'SUCCESS',
      target: 'The FM Briefing — Issue 01',
      time: new Date().toISOString(),
      details: 'Evaluated 15 published articles + 3 rotating tools. Stored in DRAFT.',
    },
  ];

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">Newsletter Automation Job Log</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Execution history, error tracking, and retry visibility for automated newsletter jobs.
          </p>
        </div>
        <Link
          href="/admin/newsletter/automation"
          className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
        >
          ← Automation Controls
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            Recent Jobs ({jobs.length})
          </h3>
        </div>

        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Job Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Output / Target</th>
              <th className="py-3 px-4">Details</th>
              <th className="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-zinc-800/40">
                <td className="py-3.5 px-4 font-mono font-light text-white">{j.jobType}</td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                    {j.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-light text-zinc-200">{j.target}</td>
                <td className="py-3.5 px-4 text-zinc-400">{j.details}</td>
                <td className="py-3.5 px-4 text-zinc-500 font-mono">
                  {new Date(j.time).toLocaleString('en-GB')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
