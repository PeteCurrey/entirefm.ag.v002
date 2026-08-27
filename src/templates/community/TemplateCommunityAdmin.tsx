'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserX,
  EyeOff,
  Trash2,
  Award,
} from 'lucide-react';

export function TemplateCommunityAdmin() {
  const [reports, setReports] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'moderation' | 'editorial'>('moderation');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [repRes, candRes] = await Promise.all([
          fetch('/api/admin/community/reports'),
          fetch('/api/admin/community/editorial-candidates'),
        ]);

        if (repRes.status === 403 || repRes.status === 401) {
          window.location.href = '/sign-in?redirect=/admin/community';
          return;
        }

        const repData = await repRes.json();
        const candData = await candRes.json();
        setReports(repData.cases || []);
        setCandidates(candData.candidates || []);
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  async function handleActionReport(caseId: string, action: string) {
    try {
      const res = await fetch('/api/admin/community/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, action }),
      });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== caseId));
      }
    } catch (err) {
      console.error('Error actioning report:', err);
    }
  }

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              EntireFM Staff Operations
            </span>
            <h1 className="text-2xl font-bold text-white mt-1">Community Moderation & Editorial Desk</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('moderation')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                activeTab === 'moderation' ? 'bg-rose-600 text-white' : 'bg-white/5 text-brand-silver'
              }`}
            >
              Open Reports ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('editorial')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                activeTab === 'editorial' ? 'bg-brand-electric text-white' : 'bg-white/5 text-brand-silver'
              }`}
            >
              Editorial Candidates ({candidates.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-brand-silver">Loading moderation records...</div>
        ) : activeTab === 'moderation' ? (
          <div className="space-y-6">
            {reports.length === 0 ? (
              <div className="p-12 text-center text-xs text-brand-silver bg-brand-graphite/20 border border-white/5 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                <p className="text-white font-medium">No open moderation cases</p>
                <p className="text-brand-silver mt-1">Community reports are all resolved.</p>
              </div>
            ) : (
              reports.map((c) => (
                <div key={c.id} className="bg-brand-graphite/30 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 text-xs font-bold">
                      Reason: {c.reason.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-brand-silver">
                      Logged {new Date(c.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="p-4 bg-brand-void rounded-xl border border-white/5 font-mono text-xs text-brand-mist whitespace-pre-line">
                    {c.contentSnapshot}
                  </div>

                  {c.reporterNotes && (
                    <p className="text-xs text-amber-300">
                      <strong>Reporter notes:</strong> {c.reporterNotes}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleActionReport(c.id, 'dismissed')}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-brand-silver hover:text-white"
                    >
                      Dismiss (No Action)
                    </button>
                    <button
                      onClick={() => handleActionReport(c.id, 'hidden')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-xs text-amber-300 font-semibold hover:bg-amber-500/30"
                    >
                      Hide Content
                    </button>
                    <button
                      onClick={() => handleActionReport(c.id, 'removed')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-xs text-white font-semibold hover:bg-rose-500"
                    >
                      Remove & Warn Author
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((cand) => (
              <div key={cand.id} className="bg-brand-graphite/25 border border-white/10 rounded-xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-brand-electric/20 text-brand-electric text-xs font-bold">
                    Target: {cand.candidateType}
                  </span>
                  <span className="text-xs text-brand-silver">Nominated by {cand.nominatedBy}</span>
                </div>
                <h3 className="text-base font-bold text-white">{cand.discussionTitle}</h3>
                <p className="text-xs text-brand-silver">{cand.editorNotes}</p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-brand-mist">Original author: {cand.authorMemberName}</span>
                  <Link
                    href={`/lobby/community/discussion/${cand.discussionSlug}`}
                    className="text-brand-electric font-semibold hover:underline"
                  >
                    Review Discussion Thread →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
