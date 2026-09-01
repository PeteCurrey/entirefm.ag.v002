import { Metadata } from 'next';
import Link from 'next/link';
import { listContracts } from '@/server/estate';
import { ShieldCheck, ArrowRight, Building, Layers } from 'lucide-react';

export const metadata: Metadata = { title: 'Live Contract Operational Health | EntireFM Admin' };

export default async function OperationsContractsPage() {
  const contracts = await listContracts();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase text-pink-400 font-light">
            MULTI-DOMAIN CONTRACT HEALTH &amp; TELEMETRY
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">Live Contract Health</h1>
          <p className="text-sm text-zinc-400">
            Factual multi-domain health summaries across Service Requests, SLA, PPM, Compliance, and Supply Chain.
          </p>
        </div>
        <Link
          href="/admin/operations"
          className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
        >
          ← Operations Control
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            Active Contracts ({contracts.length})
          </h3>
          <span className="text-xs text-zinc-500 font-normal">No Opaque Health Scores</span>
        </div>

        {contracts.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs font-normal">
            Zero active contracts loaded. Contracts transitioning from Mobilisation will populate here.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-normal uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Contract / Client</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">Annual Value</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-light text-white">{c.name}</div>
                    <div className="text-[11px] text-zinc-500 font-normal">{c.contract_reference}</div>
                  </td>
                  <td className="py-3.5 px-4 font-normal text-zinc-400">{c.contract_type}</td>
                  <td className="py-3.5 px-4 font-normal text-pink-400">
                    {new Date(c.start_date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-3.5 px-4 font-normal text-zinc-300">
                    {c.annual_value_gbp ? `£${c.annual_value_gbp.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-light">
                      {c.status}
                    </span>
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
