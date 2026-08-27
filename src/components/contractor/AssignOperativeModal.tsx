'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Wrench,
  Lock,
} from 'lucide-react';
import { OperativeProfile } from '@/server/contractor/workforce-service';
import { WorkOrderRequirementContext, OperativeEligibilityEvaluation } from '@/server/contractor/operative-eligibility-engine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (assignedPersonId: string) => void;
  assignmentId: string;
  workOrderReq: WorkOrderRequirementContext;
  operatives: OperativeProfile[];
  isAdminUser?: boolean;
}

export function AssignOperativeModal({
  isOpen,
  onClose,
  onSuccess,
  assignmentId,
  workOrderReq,
  operatives,
  isAdminUser,
}: Props) {
  const [evaluations, setEvaluations] = useState<{ op: OperativeProfile; evaluation: OperativeEligibilityEvaluation }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpId, setSelectedOpId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Admin Override state
  const [showOverridePrompt, setShowOverridePrompt] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    const evaluateAll = async () => {
      try {
        const evals = await Promise.all(
          operatives.map(async (op) => {
            const res = await fetch('/api/contractor/workforce/eligibility-check', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operativeId: op.id, workOrderReq }),
            });
            const data = await res.json();
            return { op, evaluation: data.evaluation as OperativeEligibilityEvaluation };
          })
        );
        setEvaluations(evals);
      } catch (err) {
        console.error('Failed to evaluate operatives:', err);
      } finally {
        setLoading(false);
      }
    };

    evaluateAll();
  }, [isOpen, assignmentId, workOrderReq, operatives]);

  if (!isOpen) return null;

  const eligibleList = evaluations.filter((e) => e.evaluation?.isEligible);
  const ineligibleList = evaluations.filter((e) => !e.evaluation?.isEligible);

  const selectedEvaluation = evaluations.find((e) => e.op.id === selectedOpId);

  const handleAssign = async () => {
    if (!selectedOpId) return;

    if (selectedEvaluation && !selectedEvaluation.evaluation.isEligible && !isAdminUser) {
      setErrorMsg('This operative does not meet mandatory statutory requirements for this work.');
      return;
    }

    if (selectedEvaluation && !selectedEvaluation.evaluation.isEligible && isAdminUser && !overrideReason.trim()) {
      setShowOverridePrompt(true);
      return;
    }

    setIsAssigning(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/contractor/assignments/${assignmentId}/assign-resource`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engineerPersonId: selectedEvaluation?.op.personId || selectedOpId,
          overrideReason: overrideReason.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to assign engineer');
      }

      onSuccess(selectedEvaluation?.op.personId || selectedOpId);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete engineer assignment');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-void/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-edge-dark bg-brand-void/50">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
              COMPETENCY-VALIDATED DISPATCH
            </span>
            <h2 className="text-base font-light text-white">
              Assign Qualified Engineer &bull; {workOrderReq.workOrderNumber || 'Work Order'}
            </h2>
          </div>
          <button onClick={onClose} className="text-brand-mist/60 hover:text-white p-1 rounded-lg hover:bg-brand-edge-dark">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Requirements Strip */}
        <div className="px-6 py-3 bg-brand-void/40 border-b border-brand-edge-dark/50 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-white font-normal block">{workOrderReq.title}</span>
            <span className="text-brand-mist/50 text-[11px] font-mono">
              Required Trade: <strong className="text-brand-electric">{workOrderReq.trade}</strong>
            </span>
          </div>
          {workOrderReq.isEmergencyP1 && (
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
              EMERGENCY P1
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-mono">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-brand-mist/50">
              Evaluating operative competencies and compliance gates...
            </div>
          ) : (
            <div className="space-y-4">
              {/* 1. Fully Eligible Operatives */}
              <div className="space-y-2">
                <span className="text-emerald-400 uppercase text-[10.5px] font-bold tracking-wider block">
                  Eligible Operatives ({eligibleList.length})
                </span>

                {eligibleList.length === 0 ? (
                  <div className="p-3 rounded-lg bg-brand-void border border-brand-edge-dark text-brand-mist/50 font-sans text-xs">
                    No fully eligible operatives found for this work scope.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {eligibleList.map(({ op, evaluation }) => {
                      const isSelected = selectedOpId === op.id;
                      return (
                        <div
                          key={op.id}
                          onClick={() => setSelectedOpId(op.id)}
                          className={`p-3.5 rounded-lg border cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-brand-electric/10 border-brand-electric text-white'
                              : 'bg-brand-void border-brand-edge-dark text-brand-mist hover:border-brand-edge-dark/80'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white font-sans text-sm">{op.fullName}</span>
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9.5px]">
                                {evaluation.status}
                              </span>
                            </div>
                            <span className="text-brand-mist/50 text-[11px] block">
                              {op.jobTitle} &bull; {op.trades.join(', ')}
                            </span>
                          </div>

                          <CheckCircle2
                            className={`w-5 h-5 ${isSelected ? 'text-brand-electric' : 'text-brand-mist/30'}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Action Required / Ineligible Operatives */}
              {ineligibleList.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-brand-edge-dark/50">
                  <span className="text-rose-400 uppercase text-[10.5px] font-bold tracking-wider block">
                    Action Required / Ineligible ({ineligibleList.length})
                  </span>

                  <div className="space-y-2">
                    {ineligibleList.map(({ op, evaluation }) => {
                      const isSelected = selectedOpId === op.id;
                      return (
                        <div
                          key={op.id}
                          onClick={() => setSelectedOpId(op.id)}
                          className={`p-3.5 rounded-lg border cursor-pointer transition-colors space-y-2 ${
                            isSelected
                              ? 'bg-rose-950/20 border-rose-500/40 text-white'
                              : 'bg-brand-void/40 border-brand-edge-dark/60 text-brand-mist/70'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white font-sans text-sm">{op.fullName}</span>
                              <span className="px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9.5px]">
                                {evaluation.blockLevel}
                              </span>
                            </div>
                            <XCircle className="w-4 h-4 text-rose-400" />
                          </div>

                          {/* Missing Reasons */}
                          <div className="text-[11px] text-rose-300 font-sans space-y-0.5">
                            {evaluation.failedChecks.map((f, idx) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <span>&bull;</span>
                                <span>{f.detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Admin Override Input */}
              {selectedEvaluation && !selectedEvaluation.evaluation.isEligible && isAdminUser && (
                <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Lock className="w-4 h-4" />
                    <span>EntireFM Operational Assignment Override</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 font-sans">
                    Authorised staff override will record an immutable audit log. State reason for exceptional deployment:
                  </p>
                  <textarea
                    rows={2}
                    required
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="e.g. Operative attending under direct level 3 supervisor supervision with verified site induction..."
                    className="w-full p-2.5 rounded bg-brand-void border border-amber-500/40 text-white font-sans text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-edge-dark bg-brand-void/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-brand-edge-dark text-xs text-brand-mist hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={!selectedOpId || isAssigning || (selectedEvaluation && !selectedEvaluation.evaluation.isEligible && !isAdminUser)}
            className={`px-5 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 ${
              selectedEvaluation && !selectedEvaluation.evaluation.isEligible
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-brand-electric hover:bg-brand-electric/85 text-white'
            }`}
          >
            {isAssigning
              ? 'Assigning...'
              : selectedEvaluation && !selectedEvaluation.evaluation.isEligible
              ? 'Authorise Override & Assign'
              : 'Confirm Engineer Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
}
