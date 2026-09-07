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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAFAF8] backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-[#E8E8E5] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#E8E8E5] bg-[#FAFAF8]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-electric/10 text-brand-electric flex items-center justify-center font-light text-xl border border-brand-electric/20">
              {operative.firstName.charAt(0)}{operative.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-light text-[#111111]">{operative.fullName}</h2>
                <span
                  className={`text-[10px] font-normal px-2 py-0.5 rounded border ${
                    operative.isEligibleForDispatch
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {operative.isEligibleForDispatch ? 'ELIGIBLE FOR DISPATCH' : 'ACTION REQUIRED'}
                </span>
              </div>
              <p className="text-xs text-[#6D6D68] font-normal mt-0.5">
                {operative.jobTitle} &bull; {operative.employmentStatus}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#6D6D68] hover:text-white p-1 rounded-lg hover:bg-[#F5F5F3]"
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
              <p className="font-semibold text-[#111111]">
                {operative.isEligibleForDispatch ? 'Authorised for EntireFM Field Attendance' : 'Dispatch Action Required'}
              </p>
              <p className="font-light text-[#6D6D68]">
                {operative.isEligibleForDispatch
                  ? 'All mandatory trade competencies and H&S qualifications are valid and verified.'
                  : operative.ineligibilityReason || 'One or more required qualifications have expired.'}
              </p>
            </div>
          </div>

          {/* Contact & Dispatch Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#E8E8E5]">
              <span className="text-[#9A9A95] text-[10px] uppercase font-medium block">Max Daily Jobs</span>
              <span className="text-[#111111] font-normal text-sm mt-0.5 block">{operative.maxDailyJobs}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#E8E8E5]">
              <span className="text-[#9A9A95] text-[10px] uppercase font-medium block">Completed Jobs</span>
              <span className="text-[#111111] font-normal text-sm mt-0.5 block">{operative.totalCompletedJobs}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#E8E8E5]">
              <span className="text-[#9A9A95] text-[10px] uppercase font-medium block">Postcode Base</span>
              <span className="text-[#111111] font-normal text-sm mt-0.5 block">{operative.homePostcode || 'Local Hub'}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#E8E8E5]">
              <span className="text-[#9A9A95] text-[10px] uppercase font-medium block">Status</span>
              <span className="text-emerald-400 font-normal text-sm mt-0.5 block">ACTIVE</span>
            </div>
          </div>

          {/* Approved Trades */}
          <div className="space-y-2">
            <h3 className="text-xs font-normal uppercase tracking-wider text-[#6D6D68]">
              Approved Engineering Trades
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {operative.trades.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded bg-[#FAFAF8] border border-[#E8E8E5] text-[#111111] text-xs font-light flex items-center gap-1.5"
                >
                  <Wrench className="w-3 h-3 text-brand-electric" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Qualifications & Accreditations */}
          <div className="space-y-3">
            <h3 className="text-xs font-normal uppercase tracking-wider text-[#6D6D68]">
              Verified Competencies &amp; Certifications
            </h3>
            <div className="divide-y divide-[#E8E8E5] border border-[#E8E8E5] rounded-xl bg-[#FAFAF8] overflow-hidden">
              {operative.qualifications.map((q) => (
                <div key={q.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[#111111] font-normal block">{q.name}</span>
                    <span className="text-[10.5px] font-normal text-[#9A9A95] block">
                      Expires: {q.expiryDate || 'No Expiry'} {q.daysRemaining !== null && `(${q.daysRemaining} days)`}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10.5px] font-normal border ${
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
        <div className="p-4 border-t border-[#E8E8E5] bg-[#FAFAF8] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#E8E8E5] text-xs text-[#111111] hover:text-white transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
