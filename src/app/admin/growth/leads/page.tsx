import { Metadata } from 'next';
import Link from 'next/link';
import { listExtendedLeads } from '@/server/growth/store';
import { Users, Filter, Download, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = { title: 'Inbound Leads & Qualification | EntireFM Admin' };

export default async function GrowthLeadsPage() {
  const { leads, total } = await listExtendedLeads({ limit: 100 });

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-400 font-bold">
            INBOUND PIPELINE · COMMERCIAL QUALIFICATION
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Inbound Leads Directory</h1>
          <p className="text-sm text-zinc-400">
            Audit inbound website leads with multi-touch attribution, touched resources, and qualification status.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/growth"
            className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
          >
            ← Growth Overview
          </Link>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
            All Inbound Leads ({total})
          </h3>
          <span className="text-xs text-zinc-500 font-mono">Durable Supabase Persistence</span>
        </div>

        {leads.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs">
            No inbound leads recorded yet. Submissions via geo and service pages will populate here with full attribution.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4">Prospect / Company</th>
                <th className="py-3 px-4">Service &amp; Location</th>
                <th className="py-3 px-4">First Touch</th>
                <th className="py-3 px-4">Qualification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {leads.map((l) => (
                <tr key={l.id || l.enquiry_id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-zinc-400 whitespace-nowrap">
                    {new Date(l.received_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{l.name}</div>
                    <div className="text-[11px] text-zinc-500">{l.company || l.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-zinc-200 font-medium">{l.service || 'General FM'}</div>
                    <div className="text-[11px] text-zinc-500">{l.location || 'United Kingdom'}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-pink-400 max-w-xs truncate">
                    {l.first_touch_url || l.landing_page || '/'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        l.qualification_status === 'QUALIFIED' || l.qualification_status === 'WON'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                          : l.qualification_status === 'OPPORTUNITY' || l.qualification_status === 'PROPOSAL'
                          ? 'bg-purple-950/60 text-purple-300 border-purple-800/40'
                          : l.qualification_status === 'UNQUALIFIED' || l.qualification_status === 'SPAM'
                          ? 'bg-red-950/60 text-red-300 border-red-800/40'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {l.qualification_status || 'NEW'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/growth/leads/${l.enquiry_id || l.id}`}
                      className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded font-semibold border border-zinc-700 inline-flex items-center gap-1"
                    >
                      Inspect Journey <ArrowRight className="h-3 w-3" />
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
