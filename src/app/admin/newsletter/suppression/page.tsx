import { Metadata } from 'next';
import Link from 'next/link';
import { listSuppressions } from '@/server/newsletter/store';
import { ShieldCheck, AlertOctagon, UserX } from 'lucide-react';

export const metadata: Metadata = { title: 'Suppression & Compliance | EntireFM Admin' };

export default async function SuppressionListPage() {
  const suppressions = await listSuppressions();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">Suppression &amp; Compliance List</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Permanent record of unsubscribed emails, hard bounces, and spam complaints. These addresses are strictly barred from all outgoing newsletter campaigns.
          </p>
        </div>
        <Link
          href="/admin/newsletter"
          className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            Suppressed Emails ({suppressions.length})
          </h3>
          <span className="text-xs text-zinc-500 font-normal">PECR / GDPR Compliant Isolation</span>
        </div>

        {suppressions.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs">
            Suppression list is currently empty. Any user who clicks unsubscribe or registers a bounce is automatically captured here.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-normal uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Suppressed Email</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {suppressions.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-normal text-white">{s.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-normal uppercase px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/40">
                      {s.reason}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-normal text-zinc-400">{s.source}</td>
                  <td className="py-3.5 px-4 text-zinc-500 font-normal">
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
