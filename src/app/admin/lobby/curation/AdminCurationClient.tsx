'use client';

import React, { useState } from 'react';
import type { LobbyHomepageCuration } from '@/lib/lobby/types';
import type { StalenessCheckResult } from '@/lib/lobby/curation';
import { AlertTriangle, CheckCircle2, RefreshCw, Save, ExternalLink } from 'lucide-react';

interface Props {
  initialCuration: LobbyHomepageCuration;
  initialStaleness: StalenessCheckResult;
}

export function AdminCurationClient({ initialCuration, initialStaleness }: Props) {
  const [curation, setCuration] = useState(initialCuration);
  const [staleness, setStaleness] = useState(initialStaleness);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (field: keyof LobbyHomepageCuration, value: string) => {
    setCuration((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/lobby/curation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotUpdates: curation }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save curation');
      }

      setCuration(data.curation);
      setStaleness(data.staleness);
      setMessage({ type: 'success', text: 'Curation slots saved successfully to database!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error updating curation' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            The Lobby · Homepage Editorial Curation
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Rotate featured long-form stories, technical notes, and tools without application redeployment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/lobby"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-50"
          >
            <span>View Live Lobby</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Staleness Alarm Banner */}
      {staleness.isStale ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-amber-900">
              Curation Stale Alert: {staleness.ageInDays} Days Since Last Update
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              {staleness.warning || `Homepage curation has not been rotated for ${staleness.ageInDays} days (threshold: ${staleness.thresholdDays} days). Update slot assignments below to refresh the edition.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center justify-between gap-3 text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Curation Fresh: Updated {staleness.ageInDays} days ago ({staleness.updatedAt})</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-700 font-medium">
            {curation.editionLabel}
          </span>
        </div>
      )}

      {message && (
        <div
          className={`p-3 rounded-sm text-xs ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Curation Form */}
      <form onSubmit={handleSave} className="bg-white border border-neutral-200 rounded-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lead Story */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              1. The Week That Matters (Lead Briefing Slug)
            </label>
            <input
              type="text"
              value={curation.leadStorySlug}
              onChange={(e) => handleChange('leadStorySlug', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-brand-electric"
              required
            />
            <p className="text-[11px] text-neutral-400">Main hero article on /lobby</p>
          </div>

          {/* Compliance Watch */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              2. Compliance Watch Slug
            </label>
            <input
              type="text"
              value={curation.complianceWatchSlug}
              onChange={(e) => handleChange('complianceWatchSlug', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-brand-electric"
              required
            />
            <p className="text-[11px] text-neutral-400">Statutory directive highlight</p>
          </div>

          {/* Engineer's Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              3. The Engineer's Note Slug
            </label>
            <input
              type="text"
              value={curation.engineersNoteSlug}
              onChange={(e) => handleChange('engineersNoteSlug', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-brand-electric"
              required
            />
            <p className="text-[11px] text-neutral-400">Technical M&amp;E diagnostics feature</p>
          </div>

          {/* Useful Thing */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              4. One Useful Thing Slug
            </label>
            <input
              type="text"
              value={curation.usefulThingSlug}
              onChange={(e) => handleChange('usefulThingSlug', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-brand-electric"
              required
            />
            <p className="text-[11px] text-neutral-400">Practical matrix/checklist download CTA</p>
          </div>

          {/* From The Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              5. From The Field Slug
            </label>
            <input
              type="text"
              value={curation.fromTheFieldSlug}
              onChange={(e) => handleChange('fromTheFieldSlug', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-brand-electric"
              required
            />
            <p className="text-[11px] text-neutral-400">Photographic defect observation</p>
          </div>

          {/* Ask EntireFM */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              6. Ask EntireFM Slug
            </label>
            <input
              type="text"
              value={curation.askEntireFMSlug}
              onChange={(e) => handleChange('askEntireFMSlug', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-brand-electric"
              required
            />
            <p className="text-[11px] text-neutral-400">Technical Q&amp;A advisory feature</p>
          </div>

          {/* Worth Attending */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              7. Worth Attending Slug
            </label>
            <input
              type="text"
              value={curation.worthAttendingSlug}
              onChange={(e) => handleChange('worthAttendingSlug', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-brand-electric"
              required
            />
            <p className="text-[11px] text-neutral-400">CPD certified event highlight</p>
          </div>

          {/* Dynamic Edition Label Preview */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Edition Label (Auto-Derived from ISO Week)
            </label>
            <input
              type="text"
              value={curation.editionLabel}
              disabled
              className="w-full px-3 py-2 text-sm bg-neutral-50 text-neutral-500 border border-neutral-200 rounded-sm cursor-not-allowed font-mono"
            />
            <p className="text-[11px] text-neutral-400">Dynamically generated at render time</p>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-neutral-900 text-white rounded-sm hover:bg-brand-electric transition-colors disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Curation Slots</span>
          </button>
        </div>
      </form>
    </div>
  );
}
