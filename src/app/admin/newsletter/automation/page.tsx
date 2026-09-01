'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, AlertTriangle, CheckCircle2, Play } from 'lucide-react';

export default function AutomationSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/newsletter/automation')
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleToggle = async (key: string) => {
    if (!settings) return;
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    setSaving(true);
    try {
      await fetch('/api/admin/newsletter/automation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: updated[key] }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateNow = async () => {
    setGenerating(true);
    setGenMessage('');
    try {
      const res = await fetch('/api/admin/newsletter/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueNumber: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        setGenMessage(data.message || 'Draft created successfully!');
      } else {
        setGenMessage(`Generation failed: ${data.error || data.message}`);
      }
    } catch (err: any) {
      setGenMessage(`Error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-zinc-500 text-xs">Loading automation settings...</div>;
  }

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">The FM Briefing Automation Controls</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Weekly briefing drafting, scheduling gates, and emergency kill-switch controls.
          </p>
        </div>
        <Link
          href="/admin/newsletter"
          className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
        >
          ← Dashboard
        </Link>
      </div>

      {genMessage && (
        <div className="p-4 bg-zinc-900 border border-pink-500/40 rounded-xl text-xs text-pink-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-pink-400" />
          <span>{genMessage}</span>
        </div>
      )}

      {/* Toggles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Toggle 1: Auto Draft */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-normal text-zinc-300 uppercase">Automatic Weekly Draft</span>
            <span
              className={`text-[10px] uppercase px-2 py-0.5 rounded font-light ${
                settings?.autoDraftEnabled ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {settings?.autoDraftEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Automatically compiles a weekly draft of The FM Briefing every Tuesday at 08:00 UTC using recently published articles and rotating tools.
          </p>
          <button
            onClick={() => handleToggle('autoDraftEnabled')}
            disabled={saving}
            className={`w-full py-2 px-3 rounded-lg text-xs font-normal transition-colors ${
              settings?.autoDraftEnabled
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {settings?.autoDraftEnabled ? 'Disable Auto Draft' : 'Enable Auto Draft'}
          </button>
        </div>

        {/* Toggle 2: Auto Schedule */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-normal text-zinc-300 uppercase">Automatic Scheduling</span>
            <span
              className={`text-[10px] uppercase px-2 py-0.5 rounded font-light ${
                settings?.autoScheduleEnabled ? 'bg-blue-950/80 text-blue-400 border border-blue-800/60' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {settings?.autoScheduleEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Automatically queues passing drafts for send out without waiting for explicit human button click. (Recommended OFF initially).
          </p>
          <button
            onClick={() => handleToggle('autoScheduleEnabled')}
            disabled={saving}
            className={`w-full py-2 px-3 rounded-lg text-xs font-normal transition-colors ${
              settings?.autoScheduleEnabled
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {settings?.autoScheduleEnabled ? 'Disable Auto Schedule' : 'Enable Auto Schedule'}
          </button>
        </div>

        {/* Toggle 3: Auto Send */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-normal text-zinc-300 uppercase">Automatic Sending</span>
            <span
              className={`text-[10px] uppercase px-2 py-0.5 rounded font-light ${
                settings?.autoSendEnabled ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {settings?.autoSendEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Directly transmits scheduled briefings to audience. Gated behind Pre-Send QA check.
          </p>
          <button
            onClick={() => handleToggle('autoSendEnabled')}
            disabled={saving}
            className={`w-full py-2 px-3 rounded-lg text-xs font-normal transition-colors ${
              settings?.autoSendEnabled
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                : 'bg-pink-600 hover:bg-pink-500 text-white'
            }`}
          >
            {settings?.autoSendEnabled ? 'Disable Auto Send' : 'Enable Auto Send'}
          </button>
        </div>
      </div>

      {/* Emergency Kill-Switch & Manual Generator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
          <h3 className="text-xs font-normal text-zinc-300 uppercase tracking-wider">
            Trigger Manual Briefing Run
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Execute the weekly compilation job on demand. Generates a fresh campaign stored safely in DRAFT status.
          </p>
          <button
            onClick={handleGenerateNow}
            disabled={generating}
            className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-normal py-2.5 px-4 rounded-lg border border-zinc-700 flex items-center gap-2"
          >
            <Play className="h-3.5 w-3.5 text-pink-400" />
            {generating ? 'Compiling Briefing...' : 'Compile Issue 01 Draft'}
          </button>
        </div>

        <div className="bg-zinc-900 border border-red-900/40 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <h3 className="text-xs font-normal uppercase tracking-wider">
              Emergency Kill-Switch
            </h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Immediately halts all automated newsletter drafting and campaign dispatching across EntireFM without affecting the blog editorial pipeline.
          </p>
          <button
            onClick={() => handleToggle('killSwitchPaused')}
            disabled={saving}
            className={`text-xs font-normal py-2.5 px-4 rounded-lg transition-colors ${
              settings?.killSwitchPaused
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700'
            }`}
          >
            {settings?.killSwitchPaused ? 'Resume Newsletter Automation' : 'PAUSE ALL NEWSLETTER SENDS'}
          </button>
        </div>
      </div>
    </main>
  );
}
