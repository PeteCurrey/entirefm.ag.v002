'use client';

import React from 'react';
import {
  X,
  User,
  ShieldCheck,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Briefcase,
  Phone,
  Mail,
  Wrench,
} from 'lucide-react';
import { OperativeProfile } from '@/server/contractor/workforce-service';

interface Props {
  operative: OperativeProfile | null;
  onClose: () => void;
}

export function OperativeProfileModal({ operative, onClose }: Props) {
  if (!operative) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-void/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-brand-edge-dark bg-brand-void/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-electric/10 text-brand-electric flex items-center justify-center font-light text-xl border border-brand-electric/20">
              {operative.firstName.charAt(0)}{operative.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-light text-white">{operative.fullName}</h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    operative.isEligibleForDispatch
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {operative.isEligibleForDispatch ? 'ELIGIBLE FOR DISPATCH' : 'ACTION REQUIRED'}
                </span>
              </div>
              <p className="text-xs text-brand-mist/60 font-mono mt-0.5">
                {operative.jobTitle} &bull; {operative.employmentStatus}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-brand-mist/60 hover:text-white p-1 rounded-lg hover:bg-brand-edge-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Eligibility Note */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              operative.isEligibleForDispatch
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
            }`}
          >
            {operative.isEligibleForDispatch ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-0.5">
              <p className="font-semibold text-white">
                {operative.isEligibleForDispatch ? 'Authorised for EntireFM Field Attendance' : 'Dispatch Action Required'}
              </p>
              <p className="font-light text-brand-mist/80">
                {operative.isEligibleForDispatch
                  ? 'All mandatory trade competencies and H&S qualifications are valid and verified.'
                  : operative.ineligibilityReason || 'One or more required qualifications have expired.'}
              </p>
            </div>
          </div>

          {/* Contact & Dispatch Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-brand-void border border-brand-edge-dark">
              <span className="text-brand-mist/40 text-[10px] uppercase font-mono block">Max Daily Jobs</span>
              <span className="text-white font-mono text-sm mt-0.5 block">{operative.maxDailyJobs}</span>
            </div>
            <div className="p-3 rounded-lg bg-brand-void border border-brand-edge-dark">
              <span className="text-brand-mist/40 text-[10px] uppercase font-mono block">Completed Jobs</span>
              <span className="text-white font-mono text-sm mt-0.5 block">{operative.totalCompletedJobs}</span>
            </div>
            <div className="p-3 rounded-lg bg-brand-void border border-brand-edge-dark">
              <span className="text-brand-mist/40 text-[10px] uppercase font-mono block">Postcode Base</span>
              <span className="text-white font-mono text-sm mt-0.5 block">{operative.homePostcode || 'Local Hub'}</span>
            </div>
            <div className="p-3 rounded-lg bg-brand-void border border-brand-edge-dark">
              <span className="text-brand-mist/40 text-[10px] uppercase font-mono block">Status</span>
              <span className="text-emerald-400 font-mono text-sm mt-0.5 block">ACTIVE</span>
            </div>
          </div>

          {/* Approved Trades */}
          <div className="space-y-2">
            <h3 className="text-xs font-normal uppercase tracking-wider text-brand-mist/70">
              Approved Engineering Trades
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {operative.trades.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded bg-brand-void border border-brand-edge-dark text-white text-xs font-light flex items-center gap-1.5"
                >
                  <Wrench className="w-3 h-3 text-brand-electric" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Qualifications & Accreditations */}
          <div className="space-y-3">
            <h3 className="text-xs font-normal uppercase tracking-wider text-brand-mist/70">
              Verified Competencies &amp; Certifications
            </h3>
            <div className="divide-y divide-brand-edge-dark/40 border border-brand-edge-dark rounded-xl bg-brand-void/40 overflow-hidden">
              {operative.qualifications.map((q) => (
                <div key={q.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-white font-normal block">{q.name}</span>
                    <span className="text-[10.5px] font-mono text-brand-mist/50 block">
                      Expires: {q.expiryDate || 'No Expiry'} {q.daysRemaining !== null && `(${q.daysRemaining} days)`}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10.5px] font-mono border ${
                      q.status === 'VALID'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-edge-dark bg-brand-void/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-brand-edge-dark text-xs text-brand-mist hover:text-white transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
