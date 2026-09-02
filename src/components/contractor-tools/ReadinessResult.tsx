'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, XCircle, ArrowRight, Building2, CreditCard, FileText } from 'lucide-react';
import { trackEvent } from '@/lib/analytics/tracker';
import { ToolDisclaimer } from './ToolDisclaimer';

export type ReadinessStatus = 'READY_TO_REVIEW' | 'ACTION_REQUIRED' | 'MORE_INFORMATION_NEEDED';

export interface ReadinessSummary {
  toolName: string;
  completed: number;
  actionNeeded: number;
  missing: number;
  notApplicable: number;
  total: number;
  outstandingItems: string[];
  disclaimerContext?: 'rams' | 'compliance' | 'coshh' | 'document' | 'onboarding' | 'job' | 'general';
}

function computeStatus(summary: ReadinessSummary): ReadinessStatus {
  const { missing, actionNeeded, total, notApplicable } = summary;
  const applicable = total - notApplicable;
  if (applicable === 0) return 'MORE_INFORMATION_NEEDED';
  if (missing > 0) return 'ACTION_REQUIRED';
  if (actionNeeded > Math.floor(applicable * 0.2)) return 'ACTION_REQUIRED';
  if (actionNeeded > 0) return 'MORE_INFORMATION_NEEDED';
  return 'READY_TO_REVIEW';
}

const STATUS_CONFIG: Record<
  ReadinessStatus,
  {
    label: string;
    description: string;
    iconClass: string;
    Icon: React.ComponentType<{ className?: string }>;
    borderClass: string;
    bgClass: string;
    textClass: string;
  }
> = {
  READY_TO_REVIEW: {
    label: 'READY TO REVIEW',
    description:
      'Your responses indicate you have covered the key preparation areas. Review the items below before proceeding and verify that your documentation is current and specific to the actual work and site.',
    iconClass: 'text-emerald-600',
    Icon: CheckCircle2,
    borderClass: 'border-emerald-200',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-800',
  },
  ACTION_REQUIRED: {
    label: 'ACTION REQUIRED',
    description:
      'Your responses indicate one or more areas require attention before this work is ready to proceed. Review the outstanding items below.',
    iconClass: 'text-rose-600',
    Icon: XCircle,
    borderClass: 'border-rose-200',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-800',
  },
  MORE_INFORMATION_NEEDED: {
    label: 'MORE INFORMATION NEEDED',
    description:
      'Some areas need further attention or clarification. Review the outstanding items and update your preparation before proceeding.',
    iconClass: 'text-amber-600',
    Icon: AlertCircle,
    borderClass: 'border-amber-200',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-800',
  },
};

interface ReadinessResultProps {
  summary: ReadinessSummary;
  onReset: () => void;
}

export function ReadinessResult({ summary, onReset }: ReadinessResultProps) {
  const status = computeStatus(summary);
  const config = STATUS_CONFIG[status];
  const { Icon } = config;
  const applicable = summary.total - summary.notApplicable;

  React.useEffect(() => {
    trackEvent('tool_result_ready', {
      tool_name: summary.toolName,
      status,
      completed: summary.completed,
      action_needed: summary.actionNeeded,
      missing: summary.missing,
    });
  }, [summary, status]);

  const handlePortalClick = () => {
    trackEvent('contractor_portal_clicked', {
      tool_name: summary.toolName,
      source_page: `/contractor-tools`,
      action: 'result_cta',
    });
  };

  const handleMembershipClick = () => {
    trackEvent('membership_clicked', {
      tool_name: summary.toolName,
      source_page: `/contractor-tools`,
      action: 'result_cta',
    });
  };

  const handleApplyClick = () => {
    trackEvent('application_started', {
      tool_name: summary.toolName,
      source_page: `/contractor-tools`,
      action: 'result_cta',
    });
  };

  return (
    <div className="space-y-6" role="region" aria-label="Your readiness result">
      {/* Status Card */}
      <div
        className={`rounded-sm border ${config.borderClass} ${config.bgClass} p-6`}
      >
        <div className="flex items-start gap-4">
          <Icon
            className={`h-7 w-7 shrink-0 mt-0.5 ${config.iconClass}`}
            aria-hidden="true"
          />
          <div>
            <p className="text-[10px] font-medium tracking-widest text-slate-500 uppercase mb-1">
              Your Readiness Summary
            </p>
            <h2 className={`text-xl font-light tracking-tight ${config.textClass}`}>
              {config.label}
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-light max-w-2xl">
              {config.description}
            </p>
          </div>
        </div>
      </div>

      {/* Score Row */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        role="group"
        aria-label="Score breakdown"
      >
        {[
          { label: 'Completed', value: summary.completed, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Needs Attention', value: summary.actionNeeded, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
          { label: 'Missing', value: summary.missing, color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
          { label: 'Not Applicable', value: summary.notApplicable, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className={`flex flex-col items-center justify-center rounded-sm border ${bg} py-4 px-2`}
          >
            <span className={`text-2xl font-extralight ${color}`}>{value}</span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1 text-center">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {applicable > 0 && (
        <div>
          <div
            className="h-1.5 w-full rounded-full overflow-hidden bg-slate-200"
            role="progressbar"
            aria-valuenow={summary.completed}
            aria-valuemin={0}
            aria-valuemax={applicable}
            aria-label={`${summary.completed} of ${applicable} applicable items completed`}
          >
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
              style={{ width: `${Math.round((summary.completed / applicable) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1 text-right font-light">
            {Math.round((summary.completed / applicable) * 100)}% complete ({summary.completed} of {applicable} applicable items)
          </p>
        </div>
      )}

      {/* Outstanding Items */}
      {summary.outstandingItems.length > 0 && (
        <div className="rounded-sm border border-slate-200 bg-white p-5">
          <h3 className="text-xs font-medium text-slate-700 uppercase tracking-wider mb-3">
            Your next steps
          </h3>
          <ul className="space-y-2" role="list" aria-label="Outstanding items">
            {summary.outstandingItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-light">
                <AlertCircle
                  className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <ToolDisclaimer context={summary.disclaimerContext ?? 'general'} />

      {/* Conversion Section */}
      <section
        aria-labelledby="conversion-heading"
        className="rounded-sm border border-slate-200 bg-[#0B1220] p-6 sm:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[11px] font-light tracking-widest text-slate-400 uppercase mb-2">
              From getting ready to getting the work done
            </p>
            <h3
              id="conversion-heading"
              className="text-xl sm:text-2xl font-extralight text-white leading-snug"
            >
              Your documents shouldn&rsquo;t live in isolation.
            </h3>
            <p className="text-sm text-slate-300 mt-2.5 leading-relaxed font-light">
              Professional contractors need more than individual PDFs and spreadsheets. EntireFM brings contractor information, documentation, work orders and job evidence into one connected operating environment.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <Link
              href="/supplier-portal/register"
              onClick={handlePortalClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-brand-electric hover:bg-blue-700 text-white text-xs font-normal tracking-wider uppercase shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
            >
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Explore the Contractor Portal</span>
              <ArrowRight className="h-3 w-3 text-white/70" aria-hidden="true" />
            </Link>
            <Link
              href="/suppliers/membership"
              onClick={handleMembershipClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-normal tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
            >
              <CreditCard className="h-3.5 w-3.5 text-white/60" aria-hidden="true" />
              <span>View Contractor Membership</span>
            </Link>
            <Link
              href="/suppliers/apply"
              onClick={handleApplyClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-normal tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
            >
              <FileText className="h-3.5 w-3.5 text-white/60" aria-hidden="true" />
              <span>Apply to become an EntireFM supplier</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Reset */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-slate-700 underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric rounded-sm"
        >
          Start again
        </button>
      </div>
    </div>
  );
}
