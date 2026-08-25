import { Metadata } from 'next';
import Link from 'next/link';
import { listCampaigns } from '@/server/newsletter/store';
import { Mail, Plus, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = { title: 'Newsletter Campaigns | EntireFM Admin' };

export default async function CampaignsListPage() {
  const campaigns = await listCampaigns();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">The FM Briefing Campaigns</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Weekly briefing editions, special reports, and distribution records.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/newsletter/new"
            className="text-xs bg-pink-600 hover:bg-pink-500 text-white font-light px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> New Campaign
          </Link>
          <Link
            href="/admin/newsletter"
            className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-700 rounded-lg"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            All Campaigns ({campaigns.length})
          </h3>
        </div>

        {campaigns.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs">
            No campaigns found. Create your first campaign or run the weekly automation.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">UTM Campaign</th>
                <th className="py-3 px-4">QA Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-light text-white">{c.name}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        c.status === 'SENT'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                          : c.status === 'SCHEDULED'
                          ? 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-zinc-400">{c.subject}</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-500">{c.utmCampaign}</td>
                  <td className="py-3.5 px-4">
                    {c.validationPassed ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-light">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Passed
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1 font-light">
                        <AlertTriangle className="h-3.5 w-3.5" /> Needs Review
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/newsletter/${c.id}`}
                      className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded font-light border border-zinc-700"
                    >
                      Edit / Review
                    </Link>
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
