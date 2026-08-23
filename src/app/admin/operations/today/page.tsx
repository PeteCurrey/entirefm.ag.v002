import { Metadata } from 'next';
import Link from 'next/link';
import { listOperationalExceptions, listClientActions } from '@/server/work/live-control';
import { Clock, AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: "Today's Operational Exceptions | EntireFM Admin" };

export default async function OperationsTodayPage() {
  const exceptions = await listOperationalExceptions({ status: 'ACTIVE' });
  const clientActions = await listClientActions();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-400 font-bold">
            DUTY MANAGER DAILY OPERATING SCREEN
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Today&rsquo;s Exceptions &amp; Actions</h1>
          <p className="text-sm text-zinc-400">
            Immediate items requiring operational intervention: SLA at-risk clocks, urgent callouts, and client sign-offs.
          </p>
        </div>
        <Link
          href="/admin/operations"
          className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
        >
          ← Operations Control
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Active Duty Exceptions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Critical &amp; High Priority Exceptions ({exceptions.length})
          </h3>

          {exceptions.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs font-mono">
              Zero urgent operational exceptions detected today.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {exceptions.map((exc) => (
                <div key={exc.id} className="py-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{exc.title}</span>
                    <span className="text-[10px] font-mono text-red-400 uppercase font-bold">{exc.severity}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">{exc.details}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Owner: {exc.owner}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Client Action Register */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Items Awaiting Client Action ({clientActions.length})
          </h3>

          {clientActions.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs font-mono">
              Zero client approval or access bottlenecks currently outstanding.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {clientActions.map((act) => (
                <div key={act.id} className="py-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{act.title}</span>
                    {act.amount_gbp && (
                      <span className="text-[11px] font-mono text-pink-400 font-bold">
                        £{act.amount_gbp.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-400">{act.description}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    Due: {new Date(act.due_date).toLocaleDateString('en-GB')} · Status: {act.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
