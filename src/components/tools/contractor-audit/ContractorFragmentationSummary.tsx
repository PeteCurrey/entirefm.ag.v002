'use client';

import React from 'react';
import {
  PoundSterling,
  Users,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { PortfolioFragmentationSummary } from '@/types/contractor-audit';

interface ContractorFragmentationSummaryProps {
  summary: PortfolioFragmentationSummary;
}

export function ContractorFragmentationSummary({ summary }: ContractorFragmentationSummaryProps) {
  const hasNoticePassed = summary.noticePassedCount > 0;
  const hasNoticeImminent = summary.noticeImminentCount > 0;

  return (
    <div className="space-y-4">
      {/* Alert banner if critical notice periods have passed */}
      {hasNoticePassed && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 leading-relaxed">
            <span className="font-medium">
              {summary.noticePassedCount} {summary.noticePassedCount === 1 ? 'contract has' : 'contracts have'} passed the contractual notice trigger deadline.
            </span>{' '}
            <span className="font-light text-rose-800">
              Without urgent commercial intervention, these agreements may auto-renew or roll into punitive tariff extensions. Review marked contractors below.
            </span>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Spend */}
        <div className="bg-white border border-slate-200 rounded-sm p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-light">
              Total Audited Spend
            </span>
            <span className="p-1.5 rounded-sm bg-blue-50 text-brand-electric">
              <PoundSterling className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-light text-slate-900 mt-2 tabular-nums">
            £{summary.totalAnnualSpend.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 font-light mt-1">
            Avg. £{summary.averageContractSpend.toLocaleString()} / supplier
          </p>
        </div>

        {/* Distinct Contractors */}
        <div className="bg-white border border-slate-200 rounded-sm p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-light">
              Active Suppliers
            </span>
            <span className="p-1.5 rounded-sm bg-slate-100 text-slate-700">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-light text-slate-900 mt-2 tabular-nums">
            {summary.distinctContractorsCount}
          </div>
          <p className="text-[11px] text-slate-500 font-light mt-1">
            {summary.distinctContractorsCount > 4
              ? 'High administrative fragmentation'
              : 'Moderate supplier spread'}
          </p>
        </div>

        {/* Disciplines Covered */}
        <div className="bg-white border border-slate-200 rounded-sm p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-light">
              Disciplines Mapped
            </span>
            <span className="p-1.5 rounded-sm bg-purple-50 text-purple-600">
              <Layers className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-light text-slate-900 mt-2 tabular-nums">
            {summary.disciplinesCoveredCount}
          </div>
          <p className="text-[11px] text-slate-500 font-light mt-1">
            Specialist trade lines
          </p>
        </div>

        {/* Notice Risks */}
        <div
          className={`rounded-sm p-4 sm:p-5 border shadow-2xs ${
            hasNoticePassed
              ? 'bg-rose-50/50 border-rose-200'
              : hasNoticeImminent
              ? 'bg-amber-50/50 border-amber-200'
              : 'bg-emerald-50/40 border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-600 uppercase tracking-wider font-light">
              Notice Status
            </span>
            <span
              className={`p-1.5 rounded-sm ${
                hasNoticePassed
                  ? 'bg-rose-100 text-rose-700'
                  : hasNoticeImminent
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {hasNoticePassed || hasNoticeImminent ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
            </span>
          </div>
          <div
            className={`text-xl sm:text-2xl font-light mt-2 tabular-nums ${
              hasNoticePassed
                ? 'text-rose-700'
                : hasNoticeImminent
                ? 'text-amber-700'
                : 'text-emerald-700'
            }`}
          >
            {hasNoticePassed
              ? `${summary.noticePassedCount} Expired`
              : hasNoticeImminent
              ? `${summary.noticeImminentCount} Imminent`
              : 'All Active'}
          </div>
          <p className="text-[11px] text-slate-600 font-light mt-1">
            {hasNoticePassed
              ? 'Immediate rollover risk'
              : hasNoticeImminent
              ? '< 60 days to serve notice'
              : 'No immediate expiry traps'}
          </p>
        </div>
      </div>
    </div>
  );
}
