'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Download,
  AlertOctagon,
} from 'lucide-react';
import { JobPackRecord } from '@/server/contractor/job-pack-engine';

interface Props {
  workOrderId: string;
  initialJobPack?: JobPackRecord | null;
}

export function JobPackPanel({ workOrderId, initialJobPack }: Props) {
  const [pack, setPack] = useState<JobPackRecord | null>(initialJobPack || null);
  const [loading, setLoading] = useState(!initialJobPack);

  useEffect(() => {
    if (initialJobPack) return;
    const fetchPack = async () => {
      try {
        const res = await fetch(`/api/contractor/job-packs/${encodeURIComponent(workOrderId)}`);
        const data = await res.json();
        if (data.jobPack) setPack(data.jobPack);
      } catch (err) {
        console.error('Failed to load Job Pack:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPack();
  }, [workOrderId, initialJobPack]);

  if (loading) {
    return (
      <div className="p-4 rounded-xl border border-brand-edge-dark bg-brand-carbon/60 text-xs font-mono text-brand-mist/50">
        Loading Job Pack readiness and pre-attendance safety checks...
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="p-4 rounded-xl border border-brand-edge-dark bg-brand-carbon/60 flex items-center justify-between text-xs font-mono">
        <span className="text-brand-mist/70">Job Pack has not been assembled yet.</span>
        <button
          onClick={async () => {
            setLoading(true);
            const res = await fetch(`/api/contractor/job-packs/${encodeURIComponent(workOrderId)}`, {
              method: 'POST',
            });
            const data = await res.json();
            if (data.jobPack) setPack(data.jobPack);
            setLoading(false);
          }}
          className="px-3 py-1.5 rounded-lg bg-brand-electric text-white text-xs font-medium"
        >
          Assemble Job Pack &rarr;
        </button>
      </div>
    );
  }

  const isReady = pack.readiness.isReadyForAttendance;
  const blockers = pack.readiness.blockingReasons;

  return (
    <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-5 space-y-4 shadow-lg">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-edge-dark/60 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
              WORK-READY JOB PACK &bull; {pack.id}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isReady
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold'
              }`}
            >
              {isReady ? 'READY FOR ATTENDANCE' : 'ACTION REQUIRED'}
            </span>
          </div>
          <span className="text-xs text-brand-mist/60 font-light block">
            Pre-attendance safety governance, verified operative competency, RAMS, and site instructions.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`/api/contractor/job-packs/${encodeURIComponent(pack.id)}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded border border-brand-edge-dark bg-brand-void hover:bg-brand-edge-dark text-brand-mist hover:text-white transition-colors"
            title="Download Job Pack PDF"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
          <Link
            href={`/contractor/job-packs/${encodeURIComponent(pack.id)}`}
            className="px-3.5 py-1.5 rounded-lg bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-colors flex items-center gap-1"
          >
            Open Job Pack <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Blocking Items Banner if Not Ready */}
      {!isReady && blockers.length > 0 && (
        <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-800/40 text-xs font-mono space-y-1.5">
          <div className="flex items-center gap-1.5 text-rose-300 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{blockers.length} Item(s) Must Be Resolved Before Site Attendance:</span>
          </div>
          <div className="space-y-1 pl-5">
            {blockers.map((b, idx) => (
              <div key={idx} className="text-[11px] text-rose-200/80 font-sans flex items-start justify-between gap-2">
                <span>&bull; {b.title}: {b.detail}</span>
                {b.actionUrl && (
                  <Link href={b.actionUrl} className="text-brand-electric-bright hover:underline shrink-0 font-mono text-[10.5px]">
                    Resolve &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        {Object.entries(pack.readiness.sections).map(([key, s]) => {
          const isSatisfied = s.status === 'SATISFIED' || s.status === 'NOT_REQUIRED';
          return (
            <div
              key={key}
              className={`p-2.5 rounded-lg border flex flex-col justify-between space-y-1 ${
                isSatisfied
                  ? 'bg-brand-void border-brand-edge-dark/60'
                  : 'bg-rose-950/10 border-rose-800/30'
              }`}
            >
              <span className="text-[10px] text-brand-mist/50 uppercase block truncate">{s.section}</span>
              <div className="flex items-center gap-1.5">
                {isSatisfied ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                )}
                <span className={`text-[10.5px] font-semibold truncate ${isSatisfied ? 'text-white' : 'text-rose-300'}`}>
                  {s.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
