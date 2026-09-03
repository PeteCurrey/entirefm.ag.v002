'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight, Download, Plus, X } from 'lucide-react';
import type { MemberCpdSummary, CpdLogEntry } from '@/server/cpd/types';

function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return '0 mins';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0 && mins > 0) return `${hrs} hr ${mins} mins`;
  if (hrs > 0) return `${hrs} ${hrs === 1 ? 'hr' : 'hrs'}`;
  return `${mins} mins`;
}

function formatHoursToTime(hours: number, totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).toUpperCase();
  } catch {
    return dateStr;
  }
}

function getActivityTypeLabel(type: string): string {
  switch (type) {
    case 'ask_research':
      return 'Technical Research';
    case 'live_room':
      return 'Executive Briefing';
    case 'lobby_daily_read':
      return 'Statutory Intelligence';
    case 'community_challenge':
      return 'Professional Practice';
    case 'external_course':
      return 'External Course';
    default:
      return type ? type.replace(/_/g, ' ') : 'Learning Activity';
  }
}

function getActivitySourceLabel(entry: CpdLogEntry): string {
  if (entry.activityType === 'external_course') {
    return entry.sourceRef || 'External Provider';
  }
  return 'The Lobby';
}

export function TemplateCpdDashboard() {
  const [summary, setSummary] = useState<MemberCpdSummary | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [sourceRef, setSourceRef] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [cpdRes, meRes] = await Promise.all([
          fetch('/api/lobby/me/cpd'),
          fetch('/api/member/me'),
        ]);

        if (cpdRes.status === 401 || meRes.status === 401) {
          window.location.href = '/sign-in?redirect=/lobby/me/cpd';
          return;
        }

        const cpdData = await cpdRes.json();
        const meData = await meRes.json();

        if (cpdData.success) {
          setSummary(cpdData.summary);
        }
        if (meData.authenticated && meData.member) {
          setProfile(meData.member);
        }
      } catch (err) {
        console.error('Error loading CPD record:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddManualLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/lobby/me/cpd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityType: 'external_course',
          title: title.trim(),
          sourceRef: sourceRef.trim() || undefined,
          description: description.trim() || undefined,
          durationMinutes: Number(durationMinutes),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to log CPD activity');
      }

      // Refresh CPD summary
      const refreshRes = await fetch('/api/lobby/me/cpd');
      const refreshedData = await refreshRes.json();
      if (refreshedData.success) {
        setSummary(refreshedData.summary);
      }

      setShowAddModal(false);
      setTitle('');
      setSourceRef('');
      setDescription('');
      setDurationMinutes('60');
    } catch (err: any) {
      console.error('Error logging external CPD:', err);
      setFormError(err.message || 'An error occurred while saving the activity.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const memberDisplayName =
    profile?.displayName ||
    profile?.display_name ||
    `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() ||
    profile?.email ||
    'Member';

  const memberOrganisation = profile?.company || profile?.headline || 'EntireFM Member';

  const lastActivityDate =
    summary?.entries && summary.entries.length > 0
      ? formatDate(summary.entries[0].loggedAt)
      : '—';

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white print:bg-white print:text-black">
      
      {/* ── PRINT-ONLY FORMAL TRANSCRIPT HEADER ──────────────────────── */}
      <div className="hidden print:block p-8 border-b-2 border-neutral-900 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-neutral-600">
              ENTIREFM · THE LOBBY
            </p>
            <h1 className="text-2xl font-light text-neutral-900 mt-1">
              Continuing Professional Development (CPD) Record
            </h1>
            <p className="text-xs text-neutral-600 mt-1">
              Verified Learning Log &amp; Activity Transcript
            </p>
          </div>
          <div className="text-right text-xs text-neutral-600 space-y-0.5">
            <p><span className="font-medium text-neutral-900">Member:</span> {memberDisplayName}</p>
            <p><span className="font-medium text-neutral-900">Organisation:</span> {memberOrganisation}</p>
            <p><span className="font-medium text-neutral-900">Date Issued:</span> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-20 w-full space-y-10 print:pt-6 print:pb-0 print:px-0 print:space-y-6">
        
        {/* ── 01. BREADCRUMB & CONTEXTUAL INTRO (SCREEN ONLY) ─────────── */}
        <div className="space-y-4 print:hidden">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-normal text-neutral-500 uppercase tracking-wider">
            <Link href="/lobby" className="hover:text-neutral-900 transition-colors">THE LOBBY</Link>
            <span>/</span>
            <Link href="/lobby/me" className="hover:text-neutral-900 transition-colors">MY ACCOUNT</Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">CPD</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-neutral-900 leading-tight">
                My CPD Activity Log
              </h1>
              <p className="text-sm sm:text-base font-light text-neutral-600 max-w-2xl leading-relaxed">
                Track professional development activity and verified learning hours across eligible EntireFM Lobby activities and external coursework.
              </p>
            </div>

            {/* Restrained Action Controls */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] border border-neutral-300 hover:border-neutral-900 bg-white text-xs font-medium uppercase tracking-wider text-neutral-800 hover:text-neutral-900 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500" />
                <span>EXPORT / PRINT RECORD</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium uppercase tracking-wider transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>LOG EXTERNAL HOURS</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 02. CPD RECORD SUMMARY (RESTRAINED HORIZONTAL BAND) ──────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs print:shadow-none print:border-neutral-300">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-6">
            <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
              CPD RECORD SUMMARY · PERIOD {new Date().getFullYear()}
            </p>
            <span className="text-[11px] font-normal text-neutral-500 print:text-neutral-700">
              {memberDisplayName}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-100 print:divide-neutral-200">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                VERIFIED HOURS
              </p>
              <p className="text-2xl sm:text-3xl font-light text-neutral-900 mt-1.5 tracking-tight">
                {summary ? formatHoursToTime(summary.totalHours, summary.totalMinutes) : '00:00'}
              </p>
              <p className="text-[11px] text-neutral-500 font-light mt-0.5">
                {summary ? summary.totalHours : 0} hrs ({summary ? summary.totalMinutes : 0} mins)
              </p>
            </div>

            <div className="pt-4 md:pt-0 md:pl-8">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                ACTIVITIES COMPLETED
              </p>
              <p className="text-2xl sm:text-3xl font-light text-neutral-900 mt-1.5 tracking-tight">
                {summary ? summary.activitiesCount : 0}
              </p>
              <p className="text-[11px] text-neutral-500 font-light mt-0.5">
                Verified log entries
              </p>
            </div>

            <div className="pt-4 md:pt-0 md:pl-8">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                CURRENT PERIOD
              </p>
              <p className="text-2xl sm:text-3xl font-light text-neutral-900 mt-1.5 tracking-tight">
                {new Date().getFullYear()}
              </p>
              <p className="text-[11px] text-neutral-500 font-light mt-0.5">
                Annual learning cycle
              </p>
            </div>

            <div className="pt-4 md:pt-0 md:pl-8">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                LAST ACTIVITY
              </p>
              <p className="text-base sm:text-lg font-light text-neutral-900 mt-2 tracking-tight">
                {lastActivityDate}
              </p>
              <p className="text-[11px] text-neutral-500 font-light mt-0.5">
                Most recent verification
              </p>
            </div>
          </div>
        </section>

        {/* ── 03. ACTIVITY RECORD AUDIT HISTORY ────────────────────────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs space-y-6 print:shadow-none print:border-neutral-300">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-light text-neutral-900 tracking-tight">
                ACTIVITY RECORD
              </h2>
              <p className="text-xs font-light text-neutral-500 mt-0.5">
                Auditable log of professional development activities, briefings, and accredited external learning.
              </p>
            </div>
            {summary && summary.entries.length > 0 && (
              <span className="text-[11px] font-normal text-neutral-500">
                {summary.entries.length} record{summary.entries.length === 1 ? '' : 's'} logged
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs font-light text-neutral-500 uppercase tracking-widest">
              Loading professional development records…
            </div>
          ) : !summary || summary.entries.length === 0 ? (
            /* ── DIGNIFIED EMPTY STATE ── */
            <div className="py-14 sm:py-20 text-center space-y-4 max-w-lg mx-auto">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                NO CPD ACTIVITY RECORDED
              </p>
              <p className="text-sm font-light text-neutral-600 leading-relaxed">
                Your professional development activity will appear here as you complete eligible Lobby learning and record external coursework.
              </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3 print:hidden">
                <Link
                  href="/lobby/learn"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] border border-neutral-300 hover:border-neutral-900 text-xs font-medium uppercase tracking-wider text-neutral-800 transition-colors"
                >
                  <span>EXPLORE LEARNING</span>
                  <ArrowRight className="w-3 h-3 text-neutral-400" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium uppercase tracking-wider transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>LOG EXTERNAL HOURS</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ── DESKTOP AUDIT TABLE ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                      <th className="py-3.5 pr-4 font-medium">DATE</th>
                      <th className="py-3.5 px-4 font-medium">ACTIVITY</th>
                      <th className="py-3.5 px-4 font-medium">TYPE</th>
                      <th className="py-3.5 px-4 font-medium">SOURCE</th>
                      <th className="py-3.5 px-4 font-medium text-right">DURATION</th>
                      <th className="py-3.5 pl-4 font-medium text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700">
                    {summary.entries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-neutral-50/70 transition-colors group"
                      >
                        {/* Date */}
                        <td className="py-4 pr-4 font-normal text-neutral-500 whitespace-nowrap align-top">
                          {formatDate(entry.loggedAt)}
                        </td>

                        {/* Activity Title & Notes */}
                        <td className="py-4 px-4 align-top max-w-md">
                          <p className="font-normal text-neutral-900 text-sm leading-snug">
                            {entry.title}
                          </p>
                          {entry.description && (
                            <p className="text-xs font-light text-neutral-500 mt-1 leading-relaxed">
                              {entry.description}
                            </p>
                          )}
                        </td>

                        {/* Type */}
                        <td className="py-4 px-4 font-normal text-neutral-600 whitespace-nowrap align-top">
                          {getActivityTypeLabel(entry.activityType)}
                        </td>

                        {/* Source */}
                        <td className="py-4 px-4 font-normal text-neutral-600 whitespace-nowrap align-top">
                          {getActivitySourceLabel(entry)}
                        </td>

                        {/* Duration */}
                        <td className="py-4 px-4 font-medium text-neutral-900 whitespace-nowrap text-right align-top">
                          {formatDuration(entry.durationMinutes)}
                        </td>

                        {/* Status (Restrained Uppercase with subtle dot) */}
                        <td className="py-4 pl-4 text-right whitespace-nowrap align-top">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase text-neutral-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            VERIFIED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── MOBILE STACKED RECORD VIEW ── */}
              <div className="block md:hidden divide-y divide-neutral-200">
                {summary.entries.map((entry) => (
                  <div key={entry.id} className="py-4 space-y-2 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span className="font-normal uppercase tracking-wider text-neutral-600">
                        {formatDate(entry.loggedAt)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase text-neutral-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        VERIFIED
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-normal text-neutral-900 leading-snug">
                        {entry.title}
                      </h3>
                      {entry.description && (
                        <p className="text-xs font-light text-neutral-500 mt-1 leading-relaxed">
                          {entry.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-100">
                      <span className="text-neutral-500 font-light">
                        {getActivityTypeLabel(entry.activityType)} · {getActivitySourceLabel(entry)}
                      </span>
                      <span className="font-medium text-neutral-900">
                        {formatDuration(entry.durationMinutes)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* ── 04. EDITORIAL PROFESSIONAL DEVELOPMENT CONTEXT ─────────── */}
        <section className="border-t border-neutral-200/80 pt-8 space-y-2 print:hidden">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
            YOUR PROFESSIONAL DEVELOPMENT
          </p>
          <p className="text-xs sm:text-sm font-light text-neutral-600 max-w-3xl leading-relaxed">
            The Lobby brings together technical briefings, research, live professional discussions and structured learning to support continuing development across facilities management and property.
          </p>
        </section>

        {/* ── 05. DELIBERATE CONCLUSION & LINK TO LEARNING ───────────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xs print:hidden">
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-electric">
              CONTINUE YOUR DEVELOPMENT
            </p>
            <h2 className="text-lg sm:text-xl font-light text-neutral-900">
              Explore Technical Briefings &amp; Professional Guides
            </h2>
            <p className="text-xs font-light text-neutral-500">
              Access statutory compliance scenarios, engineering frameworks, and live discussions.
            </p>
          </div>
          <Link
            href="/lobby/learn"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-[4px] bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium uppercase tracking-wider transition-colors"
          >
            <span>Explore Learning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

      </main>

      {/* ── PRINT-ONLY AUDIT FOOTNOTE ───────────────────────────────── */}
      <div className="hidden print:block p-8 border-t border-neutral-300 text-[10px] text-neutral-500 mt-12">
        <p>
          This Continuous Professional Development record certifies learning activities completed through EntireFM The Lobby and member-declared external training.
          Authentic audit record generated from EntireFM Lobby Member Services.
        </p>
      </div>

      {/* ── MODAL: LOG EXTERNAL CPD ACTIVITY (LIGHT CORPORATE THEME) ── */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-neutral-200 rounded-[4px] max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl text-neutral-900">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                  EXTERNAL RECORD
                </p>
                <h3 className="text-xl font-light text-neutral-900 mt-0.5">
                  Log External CPD Activity
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-800 p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-light text-neutral-600 leading-relaxed">
              Record external coursework, professional seminars, or statutory training to maintain a central, auditable transcript.
            </p>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-[4px]">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddManualLog} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1.5">
                  Activity / Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CIBSE Ventilation & Indoor Air Quality Masterclass"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-[4px] p-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1.5">
                    Provider / Source
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CIBSE, IWFM, BESA"
                    value={sourceRef}
                    onChange={(e) => setSourceRef(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-[4px] p-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1.5">
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
                    className="w-full bg-white border border-neutral-300 rounded-[4px] p-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric"
                  />
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {[30, 45, 60, 120].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDurationMinutes(String(mins))}
                        className={`text-[10px] px-2 py-0.5 rounded-[2px] border transition-colors ${
                          durationMinutes === String(mins)
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1.5">
                  Notes / Certification Reference
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Completed module on non-domestic ventilation systems. Certificate ref: CIBSE-2026-948"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-[4px] p-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-electric focus:ring-1 focus:ring-brand-electric"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-[4px] border border-neutral-300 text-xs font-medium uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-[4px] bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving Activity…' : 'Save to Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
