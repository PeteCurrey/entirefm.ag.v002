import { Metadata } from 'next';
import Link from 'next/link';
import { getLobbyDailySettings } from '@/server/lobby-daily/store';
import { LobbyDailySettingsForm } from '@/components/admin/LobbyDailySettingsForm';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Publishing Settings | The Lobby Daily Admin',
};

export default async function LobbyDailySettingsPage() {
  const settings = await getLobbyDailySettings();

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <Link
          href="/admin/lobby/newsletters"
          className="text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1 text-xs mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Editions
        </Link>
        <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-medium">
          THE LOBBY DAILY
        </span>
        <h1 className="text-2xl font-light text-white">Publishing &amp; Distribution Settings</h1>
        <p className="text-sm text-zinc-400">
          Configure publication schedules, editorial approval requirements, sender identities, and emergency kill-switches.
        </p>
      </div>

      <LobbyDailySettingsForm initialSettings={settings} />
    </main>
  );
}
