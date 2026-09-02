'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  Award,
  Clock,
  BookOpen,
  Calendar,
  PlusCircle,
  Download,
  ArrowLeft,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import type { MemberCpdSummary } from '@/server/cpd/types';

export function TemplateCpdDashboard() {
  const [summary, setSummary] = useState<MemberCpdSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('30');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch('/api/lobby/me/cpd');
        const data = await res.json();
        if (data.success) {
          setSummary(data.summary);
        }
      } catch (err) {
        console.error('Error fetching CPD summary:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  const handleAddManualLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/lobby/me/cpd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityType: 'external_course',
          title,
          description,
          durationMinutes: Number(durationMinutes),
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh summary
        const refresh = await fetch('/api/lobby/me/cpd');
        const refreshedData = await refresh.json();
        if (refreshedData.success) {
          setSummary(refreshedData.summary);
        }
        setShowAddModal(false);
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      console.error('Error logging manual CPD:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintTranscript = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 pt-16 sm:pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/lobby/training"
            className="inline-flex items-center gap-1.5 text-xs text-brand-silver hover:text-white transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Training Directory
          </Link>

          {/* Stats Bar */}
          <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-2">
                  <Award className="w-3.5 h-3.5" />
                  Continuous Professional Development
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  My CPD Activity Log
                </h1>
                <p className="text-xs text-brand-silver mt-1">
                  Track authentic hours earned across Ask The Lobby research, Live Rooms, and external coursework.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrintTranscript}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/10 hover:border-white/20 text-xs font-medium text-brand-silver hover:text-white transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Print / Export Log
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-electric hover:bg-brand-electric-hover text-white text-xs font-medium transition shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Log External Hours
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-center sm:text-left">
              <div className="rounded-xl border border-white/5 bg-brand-void/60 p-4">
                <p className="text-xs text-brand-slate uppercase tracking-wider font-semibold">
                  Total Verified Hours
                </p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">
                  {summary?.totalHours || 0} <span className="text-sm font-normal text-brand-silver">hrs</span>
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-brand-void/60 p-4">
                <p className="text-xs text-brand-slate uppercase tracking-wider font-semibold">
                  Total Minutes Earned
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {summary?.totalMinutes || 0} <span className="text-sm font-normal text-brand-silver">mins</span>
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-brand-void/60 p-4">
                <p className="text-xs text-brand-slate uppercase tracking-wider font-semibold">
                  Completed Activities
                </p>
                <p className="text-3xl font-bold text-brand-electric mt-1">
                  {summary?.activitiesCount || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Activity Log List */}
          <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md">
            <h2 className="text-base font-semibold text-white mb-4">Activity Audit History</h2>

            {loading ? (
              <div className="py-12 text-center text-xs text-brand-silver">
                Loading verified CPD activity records...
              </div>
            ) : !summary || summary.entries.length === 0 ? (
              <div className="py-12 text-center rounded-xl border border-white/5 bg-brand-void/40">
                <FileText className="w-8 h-8 text-brand-slate mx-auto mb-2" />
                <p className="text-sm font-medium text-white">No CPD hours logged yet</p>
                <p className="text-xs text-brand-silver mt-1 max-w-sm mx-auto">
                  Earn CPD minutes automatically when you complete technical Ask The Lobby research sessions or attend live rooms.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {summary.entries.map((entry) => (
                  <div key={entry.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-brand-void text-brand-silver border border-white/5">
                          {entry.activityType.replace('_', ' ')}
                        </span>
                        <h3 className="text-sm font-medium text-white">{entry.title}</h3>
                      </div>
                      {entry.description && (
                        <p className="text-xs text-brand-silver">{entry.description}</p>
                      )}
                      <p className="text-[11px] text-brand-slate">
                        Logged on {new Date(entry.loggedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <Clock className="w-3 h-3" />
                        +{entry.durationMinutes} mins
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-charcoal border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Log External CPD Activity</h3>
            <p className="text-xs text-brand-silver">
              Record external coursework, webinars, or statutory training to maintain a central transcript.
            </p>

            <form onSubmit={handleAddManualLog} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-brand-silver mb-1">
                  Activity / Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CIBSE Ventilation & Indoor Air Quality Webinar"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-brand-void border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-electric"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-silver mb-1">
                  Duration (Minutes) *
                </label>
                <input
                  type="number"
                  required
                  min="5"
                  step="5"
                  placeholder="60"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full bg-brand-void border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-electric"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-silver mb-1">
                  Notes / Institution Reference
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Completed module with certificate number CIBSE-2026-948"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-brand-void border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-electric"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-xs text-brand-silver hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-lg bg-brand-electric hover:bg-brand-electric-hover text-white text-xs font-medium disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
