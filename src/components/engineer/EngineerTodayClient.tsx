'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Navigation,
  Wrench,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Phone,
  FileText,
  Mic,
  Sparkles,
  ChevronRight,
  AlertOctagon,
  ExternalLink,
} from 'lucide-react';
import { FieldVisitRecord } from '@/server/field/operations-store';

interface Props {
  initialVisits: FieldVisitRecord[];
  operativeId: string;
  engineerName?: string;
}

export function EngineerTodayClient({ initialVisits, operativeId, engineerName }: Props) {
  const [visits, setVisits] = useState<FieldVisitRecord[]>(initialVisits);
  const [declineModalId, setDeclineModalId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('No capacity to meet SLA');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const urgentCount = visits.filter(
    (v) => v.job_pack?.priority === 'P1_CRITICAL' || v.job_pack?.priority === 'P2_HIGH'
  ).length;
  const inProgressCount = visits.filter(
    (v) => v.status === 'IN_PROGRESS' || v.status === 'TRAVELLING' || v.status === 'ARRIVED'
  ).length;
  const completedCount = visits.filter(
    (v) => v.status === 'COMPLETED' || v.status === 'SUBMITTED' || v.status === 'VALIDATED'
  ).length;

  const handleAction = async (visitId: string, endpoint: string, body: object = {}) => {
    setIsSubmitting(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operativeId, ...body }),
      });

      const data = await res.json();
      if (data.success && data.visit) {
        setVisits((prev) => prev.map((v) => (v.id === visitId ? data.visit : v)));
        setFeedbackMsg({ type: 'success', text: `Status updated to ${data.visit.status}` });
      } else if (!res.ok || data.error) {
        setFeedbackMsg({ type: 'error', text: data.error || 'Failed to update visit status' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Network connection failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async (visitId: string) => {
    await handleAction(visitId, `/api/contractor/jobs/${visitId}/acknowledge`, {
      decision: 'DECLINE',
      declineReason,
    });
    setVisits((prev) => prev.filter((v) => v.id !== visitId));
    setDeclineModalId(null);
  };

  // Determine the next primary action job
  const activeOrNextJob =
    visits.find((v) => v.status === 'IN_PROGRESS' || v.status === 'ARRIVED' || v.status === 'TRAVELLING') ||
    visits.find((v) => v.status === 'ACKNOWLEDGED' || v.status === 'ASSIGNED') ||
    visits[0];

  const remainingJobs = visits.filter((v) => v.id !== activeOrNextJob?.id);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Metric Quick Pills */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-2.5">
          <span className="text-brand-mist/60 text-[10px] uppercase tracking-wider block font-semibold">
            Today Queue
          </span>
          <span className="text-lg font-bold text-white mt-0.5 block">{visits.length}</span>
        </div>
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-2.5">
          <span className="text-amber-400/80 text-[10px] uppercase tracking-wider block font-semibold">
            Urgent SLA
          </span>
          <span className="text-lg font-bold text-amber-300 mt-0.5 block">{urgentCount}</span>
        </div>
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-2.5">
          <span className="text-brand-electric-bright text-[10px] uppercase tracking-wider block font-semibold">
            In Flight
          </span>
          <span className="text-lg font-bold text-brand-electric-bright mt-0.5 block">
            {inProgressCount}
          </span>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 border transition-all ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Empty State when no visits assigned */}
      {visits.length === 0 ? (
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">All Assigned Visits Completed</h3>
            <p className="text-xs text-brand-mist/70 max-w-sm mx-auto leading-relaxed">
              You have no active site visits waiting in your queue. Stand by for new dispatches or use Talk to Quote to log a proactive site survey.
            </p>
          </div>
          <Link
            href="/engineer/talk"
            className="inline-flex items-center gap-2 bg-brand-electric hover:bg-brand-indigo text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-electric/25"
          >
            <Mic className="w-4 h-4" />
            <span>Launch Talk to Quote</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Spotlight: Next / Active Priority Job Card */}
          {activeOrNextJob && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-electric-bright flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brand-electric-bright animate-pulse" />
                  PRIORITY ACTION &bull; NEXT VISIT
                </span>
                <span className="text-[10.5px] text-brand-mist/60 font-mono">
                  {activeOrNextJob.job_pack?.work_order_number || activeOrNextJob.work_order_id}
                </span>
              </div>

              <div className="bg-brand-carbon border-2 border-brand-electric/40 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-brand-mist/60 block">
                      {activeOrNextJob.scheduled_time || 'Immediate Attendance'} &bull; {activeOrNextJob.job_pack?.discipline || 'Mechanical'}
                    </span>
                    <h2 className="text-lg font-bold text-white leading-snug">
                      {activeOrNextJob.job_pack?.title || 'Commercial Remedial Execution'}
                    </h2>
                    <div className="text-xs text-brand-mist flex items-start gap-1.5 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-electric-bright shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">{activeOrNextJob.job_pack?.site?.name || 'Site'}</strong>
                        <span className="block text-brand-mist/70 text-[11px]">
                          {activeOrNextJob.job_pack?.site?.address_line1}, {activeOrNextJob.job_pack?.site?.postcode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`text-[9.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                        activeOrNextJob.job_pack?.priority === 'P1_CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : activeOrNextJob.job_pack?.priority === 'P2_HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-brand-void text-brand-mist border-brand-edge-dark'
                      }`}
                    >
                      {activeOrNextJob.job_pack?.priority || 'NORMAL'}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        activeOrNextJob.status === 'IN_PROGRESS'
                          ? 'bg-brand-electric text-white'
                          : activeOrNextJob.status === 'TRAVELLING'
                          ? 'bg-amber-500 text-slate-950'
                          : activeOrNextJob.status === 'ARRIVED'
                          ? 'bg-purple-600 text-white'
                          : 'bg-brand-void text-brand-mist border border-brand-edge-dark'
                      }`}
                    >
                      {activeOrNextJob.status}
                    </span>
                  </div>
                </div>

                {/* Navigation & Context Bar */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-brand-edge-dark">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${activeOrNextJob.job_pack?.site?.name || ''} ${activeOrNextJob.job_pack?.site?.postcode || ''}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-void hover:bg-brand-void/80 border border-brand-edge-dark text-brand-mist hover:text-white rounded-xl py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors font-medium"
                  >
                    <Navigation className="w-3.5 h-3.5 text-brand-electric-bright" />
                    <span>Navigate</span>
                  </a>

                  <Link
                    href={`/engineer/talk?workOrderId=${encodeURIComponent(
                      activeOrNextJob.work_order_id || ''
                    )}&workOrderNumber=${encodeURIComponent(
                      activeOrNextJob.job_pack?.work_order_number || ''
                    )}&siteId=${encodeURIComponent(
                      activeOrNextJob.job_pack?.site?.id || ''
                    )}&siteName=${encodeURIComponent(
                      activeOrNextJob.job_pack?.site?.name || ''
                    )}`}
                    className="bg-brand-electric/15 hover:bg-brand-electric/25 border border-brand-electric/30 text-brand-electric-bright hover:text-white rounded-xl py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors font-bold"
                  >
                    <Mic className="w-3.5 h-3.5 text-brand-electric-bright" />
                    <span>Talk to Quote</span>
                  </Link>
                </div>

                {/* Primary Action Button */}
                <div className="pt-1">
                  {activeOrNextJob.status === 'ASSIGNED' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() =>
                          handleAction(
                            activeOrNextJob.id,
                            `/api/contractor/jobs/${activeOrNextJob.id}/acknowledge`,
                            { decision: 'ACCEPT' }
                          )
                        }
                        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-all active:scale-98"
                        style={{ minHeight: '52px' }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Job</span>
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setDeclineModalId(activeOrNextJob.id)}
                        className="bg-brand-void hover:bg-rose-950/20 border border-rose-500/30 text-rose-300 rounded-xl py-3 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        style={{ minHeight: '52px' }}
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}

                  {activeOrNextJob.status === 'ACKNOWLEDGED' && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() =>
                        handleAction(
                          activeOrNextJob.id,
                          `/api/engineer/visits/${activeOrNextJob.id}/journey`,
                          { etaTime: '08:45' }
                        )
                      }
                      className="w-full bg-brand-electric hover:bg-brand-indigo text-white rounded-xl py-3.5 px-4 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-electric/25 transition-all active:scale-98"
                      style={{ minHeight: '52px' }}
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Start Journey &bull; Update Live ETA</span>
                    </button>
                  )}

                  {activeOrNextJob.status === 'TRAVELLING' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() =>
                          handleAction(
                            activeOrNextJob.id,
                            `/api/engineer/visits/${activeOrNextJob.id}/arrive`,
                            { method: 'GEOFENCE' }
                          )
                        }
                        className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-purple-900/30 transition-all active:scale-98"
                        style={{ minHeight: '52px' }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Arrived</span>
                      </button>
                      <Link
                        href={`/engineer/visits/${activeOrNextJob.id}`}
                        className="bg-brand-void hover:bg-brand-carbon border border-brand-edge-dark text-white rounded-xl py-3 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        style={{ minHeight: '52px' }}
                      >
                        <FileText className="w-4 h-4 text-brand-mist" />
                        <span>View Job Pack</span>
                      </Link>
                    </div>
                  )}

                  {activeOrNextJob.status === 'ARRIVED' && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() =>
                        handleAction(
                          activeOrNextJob.id,
                          `/api/engineer/visits/${activeOrNextJob.id}/work`
                        )
                      }
                      className="w-full bg-brand-electric hover:bg-brand-indigo text-white rounded-xl py-3.5 px-4 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-electric/25 transition-all active:scale-98"
                      style={{ minHeight: '52px' }}
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Commence Site Execution</span>
                    </button>
                  )}

                  {(activeOrNextJob.status === 'IN_PROGRESS' ||
                    activeOrNextJob.status === 'SUBMITTED' ||
                    activeOrNextJob.status === 'COMPLETED') && (
                    <Link
                      href={`/engineer/visits/${activeOrNextJob.id}`}
                      className="w-full bg-brand-void hover:bg-brand-carbon border border-brand-edge-dark hover:border-brand-electric/50 text-white rounded-xl py-3.5 px-4 text-xs font-bold flex items-center justify-between transition-colors shadow-md"
                      style={{ minHeight: '52px' }}
                    >
                      <span className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-brand-electric-bright" />
                        <span>Open Active Execution Console</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-brand-electric-bright" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Remaining Today Queue */}
          {remainingJobs.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist/70">
                  Remaining Queue ({remainingJobs.length})
                </h3>
              </div>

              <div className="space-y-2.5">
                {remainingJobs.map((v) => (
                  <Link
                    key={v.id}
                    href={`/engineer/visits/${v.id}`}
                    className="block bg-brand-carbon border border-brand-edge-dark hover:border-brand-electric/40 rounded-xl p-4 transition-all group shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-brand-mist/60">
                            {v.job_pack?.work_order_number || v.work_order_id}
                          </span>
                          <span className="text-brand-mist/40 text-xs">&bull;</span>
                          <span className="text-xs text-brand-mist/80 font-medium">
                            {v.scheduled_time || 'Standard window'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-brand-electric-bright transition-colors">
                          {v.job_pack?.title || 'Site Remedial Visit'}
                        </h4>
                        <p className="text-xs text-brand-mist/70">
                          {v.job_pack?.site?.name} &bull; {v.job_pack?.site?.address_line1}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                            v.job_pack?.priority === 'P1_CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-brand-void text-brand-mist border-brand-edge-dark'
                          }`}
                        >
                          {v.job_pack?.priority || 'NORMAL'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-brand-mist/40 group-hover:text-brand-electric-bright transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Decline Modal Bottom Sheet */}
      {declineModalId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-t-2xl sm:rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl safe-area-inset-bottom">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Decline Work Order Assignment</h3>
              <p className="text-xs text-brand-mist/70 leading-relaxed">
                Provide an operational justification for declining attendance. EntireFM Helpdesk will be notified immediately.
              </p>
            </div>

            <select
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full p-3 bg-brand-void border border-brand-edge-dark text-white rounded-xl text-xs focus:outline-none focus:border-brand-electric"
            >
              <option value="No capacity to meet SLA">No capacity to meet SLA</option>
              <option value="Operative unavailable due to emergency on site">
                Operative unavailable due to emergency
              </option>
              <option value="Specialist equipment or tooling not available">
                Specialist equipment not available
              </option>
              <option value="Outside travel range for scheduled time">
                Outside travel range
              </option>
            </select>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeclineModalId(null)}
                className="bg-brand-void hover:bg-brand-carbon border border-brand-edge-dark text-white rounded-xl py-2.5 text-xs font-semibold"
                style={{ minHeight: '48px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDecline(declineModalId)}
                className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-2.5 text-xs font-bold shadow-lg shadow-rose-950/30"
                style={{ minHeight: '48px' }}
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
