import { Metadata } from 'next';
import Link from 'next/link';
import { listCampaigns } from '@/server/newsletter/store';
import { BarChart3, TrendingUp, Mail, MousePointerClick, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = { title: 'Newsletter Analytics | EntireFM Admin' };

export default async function NewsletterAnalyticsPage() {
  const campaigns = await listCampaigns();
  const sent = campaigns.filter((c) => c.status === 'SENT');

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">The FM Briefing Analytics</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real campaign performance metrics, click attribution, and audience engagement without synthetic inflation.
          </p>
        </div>
        <Link
          href="/admin/newsletter"
          className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
          Campaign Performance Table
        </h3>

        {sent.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs">
            No completed sends recorded yet. Sent campaign delivery, open, and click statistics will populate here once campaigns are broadcast.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {sent.map((c) => (
              <div key={c.id} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-normal text-white">{c.name}</h4>
                  <div className="text-xs text-zinc-400 mt-0.5">{c.subject}</div>
                </div>
                <div className="flex gap-6 text-xs text-zinc-300 font-mono">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">RECIPIENTS</span>
                    {c.totalRecipients}
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">DELIVERED</span>
                    {c.totalDelivered}
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">OPENS</span>
                    {c.totalOpened}
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">CLICKS</span>
                    {c.totalClicked}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
