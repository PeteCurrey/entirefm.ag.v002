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
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Phone,
  FileText,
} from 'lucide-react';
import { FieldVisitRecord } from '@/server/field/operations-store';

interface Props {
  initialVisits: FieldVisitRecord[];
  operativeId: string;
}

export function EngineerTodayClient({ initialVisits, operativeId }: Props) {
  const [visits, setVisits] = useState<FieldVisitRecord[]>(initialVisits);
  const [declineModalId, setDeclineModalId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('No capacity to meet SLA');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (visitId: string, endpoint: string, body: object = {}) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operativeId, ...body }),
      });

      const data = await res.json();
      if (data.success && data.visit) {
        setVisits((prev) => prev.map((v) => (v.id === visitId ? data.visit : v)));
      }
    } catch (err) {
      console.error('Error executing visit action:', err);
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

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {visits.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded p-8 text-center space-y-2">
          <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">All Scheduled Work Completed</h3>
          <p className="text-xs text-slate-500 font-light">
            You have no outstanding site visits assigned for today.
          </p>
        </div>
      ) : (
        visits.map((v) => (
          <div
            key={v.id}
            className="bg-white border-2 border-slate-200 rounded shadow-sm p-4 space-y-3 transition-all"
          >
            {/* Header: Time, Discipline & Priority */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900">{v.scheduled_time}</span>
                <span className="text-xs font-normal text-slate-400">&bull; {v.work_order_id}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                v.job_pack.priority === 'P1_CRITICAL'
                  ? 'bg-rose-100 text-rose-900'
                  : v.job_pack.priority === 'P2_HIGH'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-slate-100 text-slate-800'
              }`}>
                {v.job_pack.priority}
              </span>
            </div>

            {/* Title & Site Details */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">{v.job_pack.title}</h3>
              <div className="text-xs text-slate-600 flex items-start gap-1.5 font-sans">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{v.job_pack.site.name}</strong> &mdash; {v.job_pack.site.address_line1}, {v.job_pack.site.postcode}
                </span>
              </div>
            </div>

            {/* SLA & Status Pill */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded text-[11px] font-normal">
              <div className="text-slate-600">
                <span>SLA Target: </span>
                <strong className="text-slate-900">
                  {v.job_pack.sla_target_completion ? new Date(v.job_pack.sla_target_completion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                </strong>
              </div>
              <span className={`font-bold px-2 py-0.5 rounded ${
                v.status === 'IN_PROGRESS'
                  ? 'bg-blue-100 text-blue-900'
                  : v.status === 'TRAVELLING'
                  ? 'bg-amber-100 text-amber-900'
                  : v.status === 'ARRIVED'
                  ? 'bg-purple-100 text-purple-900'
                  : 'bg-slate-200 text-slate-800'
              }`}>
                {v.status}
              </span>
            </div>

            {/* Action Bar (One-handed Touch Targets) */}
            <div className="pt-2 border-t border-slate-100">
              {v.status === 'ASSIGNED' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleAction(v.id, `/api/contractor/jobs/${v.id}/acknowledge`, { decision: 'ACCEPT' })}
                    className="btn-primary text-xs py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Accept Job</span>
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={() => setDeclineModalId(v.id)}
                    className="btn-secondary text-xs py-2.5 text-rose-700 hover:bg-rose-50 border-rose-200 flex items-center justify-center gap-1.5 font-bold"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Decline</span>
                  </button>
                </div>
              )}

              {v.status === 'ACKNOWLEDGED' && (
                <div className="grid grid-cols-1 gap-2">
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleAction(v.id, `/api/engineer/visits/${v.id}/journey`, { etaTime: '08:45' })}
                    className="btn-primary text-xs py-3 bg-brand-pink text-white font-bold flex items-center justify-center gap-2 text-sm"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Start Journey &bull; Update ETA</span>
                  </button>
                </div>
              )}

              {v.status === 'TRAVELLING' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleAction(v.id, `/api/engineer/visits/${v.id}/arrive`, { method: 'GEOFENCE' })}
                    className="btn-primary text-xs py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Arrived on Site</span>
                  </button>
                  <Link
                    href={`/engineer/visits/${v.id}`}
                    className="btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5 font-bold"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Job Pack</span>
                  </Link>
                </div>
              )}

              {v.status === 'ARRIVED' && (
                <div className="grid grid-cols-1 gap-2">
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleAction(v.id, `/api/engineer/visits/${v.id}/work`)}
                    className="btn-primary text-xs py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold flex items-center justify-center gap-2 text-sm"
                  >
                    <Wrench className="h-4 w-4" />
                    <span>Start Work</span>
                  </button>
                </div>
              )}

              {v.status === 'IN_PROGRESS' && (
                <Link
                  href={`/engineer/visits/${v.id}`}
                  className="btn-primary text-xs py-3 bg-slate-900 hover:bg-black text-white font-bold flex items-center justify-center gap-2 text-sm"
                >
                  <span>Continue Work Execution &rarr;</span>
                </Link>
              )}
            </div>
          </div>
        ))
      )}

      {/* Decline Modal */}
      {declineModalId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-sm w-full p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Decline Work Order</h3>
            <p className="text-xs text-slate-600">
              State the operational reason why you are unable to attend:
            </p>

            <select
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-xs"
            >
              <option value="No capacity to meet SLA">No capacity to meet SLA</option>
              <option value="Operative unavailable due to emergency on site">Operative unavailable due to emergency</option>
              <option value="Specialist equipment or tooling not available">Specialist equipment not available</option>
              <option value="Outside travel range for scheduled time">Outside travel range</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeclineModalId(null)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDecline(declineModalId)}
                className="btn-primary text-xs py-1.5 px-4 bg-rose-700 text-white font-bold"
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
