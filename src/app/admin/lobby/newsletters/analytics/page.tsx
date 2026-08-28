import { Metadata } from 'next';
import Link from 'next/link';
import { listSubscribers, listSuppressions } from '@/server/newsletter/store';
import { listEditions } from '@/server/lobby-daily/store';
import type { LobbyDailyEdition } from '@/server/lobby-daily/types';
import {
  ArrowLeft,
  Users,
  MailCheck,
  ShieldAlert,
  Send,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Audience & Analytics | The Lobby Daily Admin',
};

export default async function LobbyDailyAnalyticsPage() {
  const { subscribers } = await listSubscribers({ limit: 1000 });
  const suppressions = await listSuppressions();
  const { editions } = await listEditions({ limit: 50 });

  const activeSubscribers = subscribers.filter((s) => s.status === 'ACTIVE');
  const dailyOnly = activeSubscribers.filter(
    (s) => s.interests?.includes('DAILY_LOBBY') && !s.interests?.includes('WEEKLY_BRIEFING')
  ).length;
  const weeklyOnly = activeSubscribers.filter(
    (s) => s.interests?.includes('WEEKLY_BRIEFING') && !s.interests?.includes('DAILY_LOBBY')
  ).length;
  const bothFrequencies = activeSubscribers.filter(
    (s) => s.interests?.includes('DAILY_LOBBY') && s.interests?.includes('WEEKLY_BRIEFING')
  ).length;
  const unsubscribed = subscribers.filter((s) => s.status === 'UNSUBSCRIBED').length;
  const bounced = subscribers.filter((s) => s.status === 'BOUNCED').length;

  const sentEditions: LobbyDailyEdition[] = editions.filter((e) => e.status === 'SENT');
  const totalSentDispatches = sentEditions.reduce(
    (acc: number, e: LobbyDailyEdition) => acc + (e.totalDelivered || 0),
    0
  );

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="space-y-1">
        <Link
          href="/admin/lobby/newsletters"
          className="text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1 text-xs mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Editions
        </Link>
        <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-medium">
          THE LOBBY DAILY
        </span>
        <h1 className="text-2xl font-light text-white">Audience &amp; Delivery Analytics</h1>
        <p className="text-sm text-zinc-400">
          Subscriber segmentation, preference frequency breakdown, bounce health, and delivery metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Active Audience</span>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-light text-white font-mono">{activeSubscribers.length}</div>
          <div className="mt-1 text-[11px] text-zinc-500">Across Daily &amp; Weekly channels</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>The Lobby Daily Audience</span>
            <Send className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-light text-white font-mono">{dailyOnly + bothFrequencies}</div>
          <div className="mt-1 text-[11px] text-zinc-500">
            {dailyOnly} daily only • {bothFrequencies} both
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Delivered Briefings</span>
            <MailCheck className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-light text-white font-mono">{totalSentDispatches}</div>
          <div className="mt-1 text-[11px] text-zinc-500">{sentEditions.length} editions dispatched</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Suppression List</span>
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-light text-white font-mono">{suppressions.length}</div>
          <div className="mt-1 text-[11px] text-zinc-500">
            {unsubscribed} unsubscribed • {bounced} bounced
          </div>
        </div>
      </div>

      {/* Breakdown by Frequency */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-medium text-white">Audience Frequency Distribution</h3>
        <p className="text-xs text-zinc-400">
          Subscribers manage their preferred frequency via the self-service Preference Centre.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-emerald-400">The Lobby Daily Only</span>
            <div className="text-xl font-mono text-white">{dailyOnly}</div>
            <p className="text-[11px] text-zinc-500">06:45 UK weekday morning briefings</p>
          </div>

          <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-blue-400">Both Daily &amp; Weekly</span>
            <div className="text-xl font-mono text-white">{bothFrequencies}</div>
            <p className="text-[11px] text-zinc-500">Weekday briefings + Thursday digest</p>
          </div>

          <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-purple-400">Weekly Briefing Only</span>
            <div className="text-xl font-mono text-white">{weeklyOnly}</div>
            <p className="text-[11px] text-zinc-500">Thursday 07:00 UK weekly digest</p>
          </div>
        </div>
      </div>

      {/* Historical Performance Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-zinc-800">
          <h3 className="text-base font-medium text-white">Edition Dispatch History</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Performance and delivery metrics for recent dispatches.</p>
        </div>

        {sentEditions.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">No sent editions recorded yet.</div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {sentEditions.map((edition: LobbyDailyEdition) => (
              <div key={edition.id} className="p-4 sm:px-6 flex items-center justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <div className="font-medium text-zinc-200">
                    #{edition.editionNumber} • {edition.masthead?.ukDateFormatted || edition.editionDate}
                  </div>
                  <div className="text-zinc-400 text-[11px] truncate max-w-md">{edition.subjectLine}</div>
                </div>

                <div className="flex items-center gap-6 font-mono text-zinc-300 shrink-0">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Delivered</span>
                    {edition.totalDelivered || 0}
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Opened</span>
                    {edition.totalOpened || 0}
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Clicked</span>
                    {edition.totalClicked || 0}
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
