import { Metadata } from 'next';
import Link from 'next/link';
import { listSubscribers } from '@/server/newsletter/store';
import { Users, Download, Upload, ShieldCheck, Mail, Calendar } from 'lucide-react';

export const metadata: Metadata = { title: 'Newsletter Subscribers | EntireFM Admin' };

export default async function SubscribersPage() {
  const { subscribers, total } = await listSubscribers({ limit: 100 });

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscribers &amp; Audience</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Opted-in readership for The FM Briefing with verified consent timestamps and origin attribution.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/newsletter"
            className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Overview Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
            All Subscribers ({total})
          </h3>
          <span className="text-xs text-zinc-500 font-mono">100% Opted-In · No Cold Scrapes</span>
        </div>

        {subscribers.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs">
            No subscribers yet. Signup forms are active on /fm-briefing, resource hubs, and article footers.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Name / Company</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Signup Source</th>
                <th className="py-3 px-4">Consent Ver.</th>
                <th className="py-3 px-4">Date Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-white">{s.email}</td>
                  <td className="py-3 px-4">
                    {s.firstName || s.company ? (
                      <div>
                        <div className="font-semibold text-zinc-200">{s.firstName || '—'}</div>
                        <div className="text-[11px] text-zinc-500">{s.company || s.role || ''}</div>
                      </div>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        s.status === 'ACTIVE'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                          : s.status === 'UNSUBSCRIBED'
                          ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          : 'bg-red-950/60 text-red-300 border-red-800/40'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-400">{s.signupPage}</td>
                  <td className="py-3 px-4 font-mono text-pink-400">{s.consentTextVersion}</td>
                  <td className="py-3 px-4 text-zinc-500 font-mono">
                    {new Date(s.createdAt).toLocaleDateString('en-GB')}
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
