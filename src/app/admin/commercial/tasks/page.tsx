import { Metadata } from 'next';
import Link from 'next/link';
import { listCommercialTasks } from '@/server/commercial/pipeline';
import { CheckSquare, Clock, AlertTriangle, CheckCircle2, User } from 'lucide-react';

export const metadata: Metadata = { title: 'Commercial Follow-Up Tasks | EntireFM Admin' };

export default async function TasksPage() {
  const tasks = await listCommercialTasks();
  const now = new Date();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-400 font-bold">
            FOLLOW-UP INTEGRITY · NO DEAD-END RECORDS
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Commercial Follow-Up Tasks</h1>
          <p className="text-sm text-zinc-400">
            Actionable discovery calls, site survey arrangements, proposal drafting, and client follow-ups.
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
            All Commercial Tasks ({tasks.length})
          </h3>
        </div>

        {tasks.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs font-mono">
            Zero pending tasks. When leads qualify or opportunities advance, required follow-up actions populate here.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Task Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {tasks.map((t) => {
                const isOverdue = new Date(t.due_date) < now && t.status === 'PENDING';
                return (
                  <tr key={t.id} className="hover:bg-zinc-800/40">
                    <td className="py-3.5 px-4 font-bold text-white">{t.title}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {t.task_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-400">{t.owner}</td>
                    <td className={`py-3.5 px-4 font-mono ${isOverdue ? 'text-red-400 font-bold' : 'text-zinc-400'}`}>
                      {new Date(t.due_date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          t.priority === 'URGENT'
                            ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
