'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  UserX,
  AlertTriangle,
} from 'lucide-react';
import { FieldVisitRecord, FieldOperativeProfile } from '@/server/field/operations-store';

interface Props {
  initialVisits: FieldVisitRecord[];
  operatives: FieldOperativeProfile[];
  providerOrgId: string;
}

export function ContractorDispatcherClient({ initialVisits, operatives, providerOrgId }: Props) {
  const [visits, setVisits] = useState<FieldVisitRecord[]>(initialVisits);
  const [selectedVisit, setSelectedVisit] = useState<FieldVisitRecord | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedOperativeId, setSelectedOperativeId] = useState<string>('');
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const unassigned = visits.filter((v) => !v.assigned_engineer_id || v.status === 'AWARDED');
  const inProgress = visits.filter((v) => ['ASSIGNED', 'ACKNOWLEDGED', 'TRAVELLING', 'ARRIVED', 'IN_PROGRESS'].includes(v.status));
  const completed = visits.filter((v) => ['COMPLETED', 'SUBMITTED', 'VALIDATED'].includes(v.status));
  const awaitingParts = visits.filter((v) => v.status === 'AWAITING_PARTS');

  const filteredVisits = visits.filter((v) => {
    if (filterStatus === 'UNASSIGNED') return !v.assigned_engineer_id || v.status === 'AWARDED';
    if (filterStatus === 'ACTIVE') return ['ASSIGNED', 'ACKNOWLEDGED', 'TRAVELLING', 'ARRIVED', 'IN_PROGRESS'].includes(v.status);
    if (filterStatus === 'AWAITING_PARTS') return v.status === 'AWAITING_PARTS';
    if (filterStatus === 'COMPLETED') return ['COMPLETED', 'SUBMITTED', 'VALIDATED'].includes(v.status);
    return true;
  });

  const handleAssign = async () => {
    if (!selectedVisit || !selectedOperativeId) return;
    setAssignmentError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contractor/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitId: selectedVisit.id,
          operativeId: selectedOperativeId,
          providerOrgId,
          dispatcherName: 'Operations Controller',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAssignmentError(data.error || 'Failed to assign operative');
        setIsSubmitting(false);
        return;
      }

      setVisits((prev) => prev.map((v) => (v.id === selectedVisit.id ? data.visit : v)));
      setAssignModalOpen(false);
      setSelectedVisit(null);
      setSelectedOperativeId('');
    } catch (err: any) {
      setAssignmentError(err.message || 'Network error while assigning operative');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilterStatus('UNASSIGNED')}
          className={`p-4 rounded border text-left transition-all ${
            filterStatus === 'UNASSIGNED' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-medium uppercase tracking-wider block opacity-70">Unassigned</span>
          <span className="text-2xl font-bold mt-1 block">{unassigned.length}</span>
        </button>

        <button
          onClick={() => setFilterStatus('ACTIVE')}
          className={`p-4 rounded border text-left transition-all ${
            filterStatus === 'ACTIVE' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-medium uppercase tracking-wider block opacity-70">In Field / Active</span>
          <span className="text-2xl font-bold mt-1 block">{inProgress.length}</span>
        </button>

        <button
          onClick={() => setFilterStatus('AWAITING_PARTS')}
          className={`p-4 rounded border text-left transition-all ${
            filterStatus === 'AWAITING_PARTS' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-medium uppercase tracking-wider block opacity-70">Awaiting Parts</span>
          <span className="text-2xl font-bold mt-1 block text-amber-600">{awaitingParts.length}</span>
        </button>

        <button
          onClick={() => setFilterStatus('COMPLETED')}
          className={`p-4 rounded border text-left transition-all ${
            filterStatus === 'COMPLETED' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-medium uppercase tracking-wider block opacity-70">Completed / Validated</span>
          <span className="text-2xl font-bold mt-1 block text-emerald-600">{completed.length}</span>
        </button>
      </div>

      {/* Operative Team Summary */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Users className="h-4 w-4 text-slate-700" />
            <span>Field Operative Team &bull; Competency Matrix ({operatives.length})</span>
          </h3>
          <span className="text-[11px] font-normal text-slate-500">Verified Credentials</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {operatives.map((op) => (
            <div key={op.id} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  {op.first_name} {op.last_name}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  {op.role.replace('_', ' ')}
                </span>
              </div>
              <div className="space-y-0.5 text-[11px] text-slate-600">
                <div>Trades: <strong className="text-slate-800">{op.assigned_trades.join(', ')}</strong></div>
                <div className="text-[10.5px] text-slate-500">
                  Qualifications: {op.competencies.map((c) => `${c.code} (${c.status})`).join(' · ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch Job Board */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden space-y-3 p-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Work Orders &amp; Field Visits ({filteredVisits.length})
          </h3>
          {filterStatus !== 'ALL' && (
            <button
              onClick={() => setFilterStatus('ALL')}
              className="text-xs text-slate-500 hover:text-slate-900 underline font-normal"
            >
              Show All ({visits.length})
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {filteredVisits.map((v) => (
            <div key={v.id} className="py-4 space-y-3 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-pink">{v.work_order_id}</span>
                    <span className="text-xs text-slate-400 font-normal">&bull; {v.scheduled_time}</span>
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
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{v.job_pack.title}</h4>
                  <p className="text-xs text-slate-600 font-sans">
                    {v.job_pack.site.name} &bull; {v.job_pack.site.address_line1}, {v.job_pack.site.postcode}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className={`text-xs px-2.5 py-1 rounded font-bold ${
                    v.status === 'VALIDATED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : v.status === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-800'
                      : v.status === 'TRAVELLING'
                      ? 'bg-amber-100 text-amber-800'
                      : v.status === 'AWAITING_PARTS'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-900 text-white'
                  }`}>
                    {v.status}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedVisit(v);
                      setSelectedOperativeId(v.assigned_engineer_id || '');
                      setAssignmentError(null);
                      setAssignModalOpen(true);
                    }}
                    className="btn-secondary text-xs py-1 px-3 flex items-center gap-1 font-bold"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>{v.assigned_engineer_name ? 'Reassign' : 'Assign Engineer'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-normal text-slate-600 bg-slate-50 p-3 rounded">
                <div>
                  <span className="text-slate-400 block font-sans text-[10px]">Assigned Operative</span>
                  <span className="text-slate-900 font-bold">{v.assigned_engineer_name || 'Unassigned'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans text-[10px]">Discipline</span>
                  <span>{v.job_pack.discipline} ({v.job_pack.workflow_type})</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans text-[10px]">SLA Target</span>
                  <span>{v.job_pack.sla_target_completion ? new Date(v.job_pack.sla_target_completion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment & Competency Gating Modal */}
      {assignModalOpen && selectedVisit && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                DISPATCH OPERATIVE ASSIGNMENT
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Assign Operative to {selectedVisit.work_order_id}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Required Discipline: <strong className="text-slate-900">{selectedVisit.job_pack.discipline}</strong>
              </p>
            </div>

            {assignmentError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-900 text-xs flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block font-bold">Competency Gating Block:</strong>
                  <span>{assignmentError}</span>
                </div>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-700">Select Field Operative:</label>
              <div className="space-y-2">
                {operatives.map((op) => (
                  <label
                    key={op.id}
                    className={`p-3 rounded border block cursor-pointer transition-all ${
                      selectedOperativeId === op.id
                        ? 'bg-slate-900 text-white border-slate-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="operative"
                          checked={selectedOperativeId === op.id}
                          onChange={() => setSelectedOperativeId(op.id)}
                          className="text-brand-pink"
                        />
                        <span>{op.first_name} {op.last_name}</span>
                      </div>
                      <span className="text-[10.5px] opacity-75 font-normal">{op.role}</span>
                    </div>
                    <div className="text-[10.5px] opacity-75 mt-1 pl-5">
                      Competencies: {op.competencies.map((c) => c.code).join(', ') || 'General Only'}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedOperativeId || isSubmitting}
                onClick={handleAssign}
                className="btn-primary text-xs py-1.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Verify &amp; Confirm Assignment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
