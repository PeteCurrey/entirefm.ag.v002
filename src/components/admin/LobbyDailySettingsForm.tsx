'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LobbyDailySettings } from '@/server/lobby-daily/types';
import {
  Save,
  Clock,
  ShieldAlert,
  Mail,
  Sliders,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  initialSettings: LobbyDailySettings;
}

export function LobbyDailySettingsForm({ initialSettings }: Props) {
  const router = useRouter();
  const [settings, setSettings] = useState<LobbyDailySettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch('/api/admin/lobby-daily/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.ok) {
        setSaveStatus('Settings updated successfully.');
        router.refresh();
      } else {
        setSaveStatus(`Failed: ${data.error}`);
      }
    } catch (e: any) {
      setSaveStatus(`Error: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {saveStatus && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            saveStatus.includes('successfully')
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-800 text-rose-300'
          }`}
        >
          {saveStatus.includes('successfully') ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          {saveStatus}
        </div>
      )}

      {/* Emergency Kill-Switch */}
      <div className="bg-zinc-900 border border-rose-900/40 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-rose-400 text-sm font-medium">
          <ShieldAlert className="h-4 w-4" /> Emergency Master Kill-Switch
        </div>
        <p className="text-xs text-zinc-400">
          Immediately pauses all automated harvesting, draft assembly, and scheduled dispatch routines.
        </p>
        <label className="flex items-center gap-3 text-xs text-zinc-200 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={settings.emergencyKillSwitch}
            onChange={(e) => setSettings({ ...settings, emergencyKillSwitch: e.target.checked })}
            className="rounded border-zinc-700 bg-zinc-950 text-rose-600 focus:ring-rose-500 h-4 w-4"
          />
          <span className="uppercase font-medium">
            {settings.emergencyKillSwitch ? 'KILL-SWITCH ENGAGED (PAUSED)' : 'AUTOMATION ACTIVE (NORMAL)'}
          </span>
        </label>
      </div>

      {/* Editorial Approval & Automation Gate */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-white text-sm font-medium">
          <Sliders className="h-4 w-4 text-emerald-400" /> Editorial Approval Gate
        </div>
        <p className="text-xs text-zinc-400">
          Control whether the morning 06:45 dispatch requires a human editor sign-off or sends automatically if all QA checks pass.
        </p>

        <div className="space-y-3 pt-1">
          <label className="flex items-start gap-3 text-xs text-zinc-200 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.manualApprovalRequired}
              onChange={(e) => setSettings({ ...settings, manualApprovalRequired: e.target.checked })}
              className="rounded border-zinc-700 bg-zinc-950 text-emerald-600 focus:ring-emerald-500 h-4 w-4 mt-0.5"
            />
            <div>
              <span className="font-medium text-white block">Require Manual Editorial Sign-off (Default: Enabled)</span>
              <span className="text-zinc-400 text-[11px]">
                Editions will only be dispatched if manually marked as APPROVED in the admin workspace before 06:45 UK.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 text-xs text-zinc-200 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoSendEnabled}
              onChange={(e) => setSettings({ ...settings, autoSendEnabled: e.target.checked })}
              className="rounded border-zinc-700 bg-zinc-950 text-emerald-600 focus:ring-emerald-500 h-4 w-4 mt-0.5"
            />
            <div>
              <span className="font-medium text-white block">Auto-Dispatch Approved Editions</span>
              <span className="text-zinc-400 text-[11px]">
                If an edition is in SCHEDULED status by 06:45 UK, automatically dispatch without waiting for a manual click.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Schedule Configuration */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-white text-sm font-medium">
          <Clock className="h-4 w-4 text-blue-400" /> Publishing Pipeline Schedule
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Send Schedule Type</label>
            <select
              value={settings.sendScheduleType}
              onChange={(e) =>
                setSettings({ ...settings, sendScheduleType: e.target.value as 'WEEKDAYS_ONLY' | 'EVERYDAY' })
              }
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-normal"
            >
              <option value="WEEKDAYS_ONLY">Weekdays Only (Mon–Fri)</option>
              <option value="EVERYDAY">Everyday (Mon–Sun)</option>
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 mb-1">Dispatch Time (London)</label>
            <input
              type="text"
              value={settings.sendTimeLondon}
              onChange={(e) => setSettings({ ...settings, sendTimeLondon: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-normal"
            />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1">Timezone</label>
            <input
              type="text"
              disabled
              value={settings.timezone}
              className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-400 font-normal"
            />
          </div>
        </div>
      </div>

      {/* Sender Identity */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-white text-sm font-medium">
          <Mail className="h-4 w-4 text-purple-400" /> Sender Identity &amp; Routing
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Sender Email</label>
            <input
              type="email"
              value={settings.senderEmail}
              onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-normal"
            />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1">Sender Display Name</label>
            <input
              type="text"
              value={settings.senderName}
              onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-normal"
            />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1">Reply-To Address</label>
            <input
              type="email"
              value={settings.replyToEmail}
              onChange={(e) => setSettings({ ...settings, replyToEmail: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-normal"
            />
          </div>
        </div>
      </div>

      {/* Sponsor Settings */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-white text-sm font-medium">
          <DollarSign className="h-4 w-4 text-amber-400" /> Sponsor Slot Placement
        </div>
        <label className="flex items-center gap-3 text-xs text-zinc-200 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.sponsorEnabled}
            onChange={(e) => setSettings({ ...settings, sponsorEnabled: e.target.checked })}
            className="rounded border-zinc-700 bg-zinc-950 text-amber-600 focus:ring-amber-500 h-4 w-4"
          />
          <span className="font-medium text-white">Enable Sponsored Placement Slot (Default: Disabled)</span>
        </label>
        <p className="text-[11px] text-zinc-400">
          Sponsor slots are strictly rendered after core editorial sections and explicitly labeled "Sponsored" per UK advertising standards.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving Settings...' : 'Save Publishing Settings'}
        </button>
      </div>
    </form>
  );
}
