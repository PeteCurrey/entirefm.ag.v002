'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, UserCheck, ShieldAlert, ChevronDown, ChevronUp, ExternalLink, HelpCircle } from 'lucide-react';

export interface AITransparencyNoticeProps {
  featureName: string;
  aiRole: 'triage' | 'drafting' | 'prioritisation' | 'extraction' | 'recommendation' | 'anomaly_detection';
  inputsUsed: string[];
  humanOversightDescription: string;
  canChallenge?: boolean;
  challengeRoute?: string;
  compact?: boolean;
  className?: string;
}

const ROLE_LABELS: Record<AITransparencyNoticeProps['aiRole'], { badge: string; desc: string }> = {
  triage: {
    badge: 'AI-Assisted Triage',
    desc: 'Assists human dispatchers by suggesting issue classifications and trade requirements.',
  },
  drafting: {
    badge: 'AI-Assisted Draft',
    desc: 'Generates an initial draft based on asset and site telemetry. Subject to human review and approval.',
  },
  prioritisation: {
    badge: 'AI Priority Recommendation',
    desc: 'Recommends response priority based on asset criticality and SLAs. Overridable by client and operations desk.',
  },
  extraction: {
    badge: 'AI Document Extraction',
    desc: 'Extracts technical metadata and compliance dates from uploaded service certificates for human verification.',
  },
  recommendation: {
    badge: 'AI Allocation Suggestion',
    desc: 'Suggests qualified and vetted trade contractors based on proximity, skills, and SSIP compliance.',
  },
  anomaly_detection: {
    badge: 'AI Anomaly Flag',
    desc: 'Identifies potential deviations in telemetry or asset condition for engineering investigation.',
  },
};

export function AITransparencyNotice({
  featureName,
  aiRole,
  inputsUsed,
  humanOversightDescription,
  canChallenge = true,
  challengeRoute = '/legal/data-protection-complaints',
  compact = false,
  className = '',
}: AITransparencyNoticeProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const roleInfo = ROLE_LABELS[aiRole];

  return (
    <aside
      aria-label={`AI Transparency Disclosure for ${featureName}`}
      className={`rounded-xl border border-indigo-200/80 bg-indigo-50/50 p-4 transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
            <Cpu className="h-4 w-4" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-normal text-slate-900">{featureName}</span>
              <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[11px] font-normal text-indigo-800">
                {roleInfo.badge}
              </span>
            </div>
            <p className="text-[12px] text-slate-600 mt-0.5">{roleInfo.desc}</p>
          </div>
        </div>

        {compact && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-700 p-1"
            aria-label={isExpanded ? 'Collapse AI details' : 'Expand AI details'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-3.5 border-t border-indigo-100 pt-3 text-xs text-slate-700 space-y-2.5">
          {/* Inputs */}
          <div>
            <span className="font-light text-slate-900">Information Used: </span>
            <span className="text-slate-600">{inputsUsed.join(' · ')}</span>
          </div>

          {/* Human Oversight */}
          <div className="flex items-start gap-1.5 text-slate-800 bg-white/70 p-2.5 rounded-lg border border-indigo-100/80">
            <UserCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Human Governance: </strong>
              <span>{humanOversightDescription}</span>
            </div>
          </div>

          {/* Challenge & Policy Links */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11.5px]">
            <Link
              href="/legal/ai"
              className="inline-flex items-center gap-1 font-light text-indigo-700 hover:underline"
            >
              Responsible AI Policy
              <ExternalLink className="h-3 w-3" />
            </Link>

            {canChallenge && (
              <Link
                href={challengeRoute}
                className="inline-flex items-center gap-1 font-normal text-slate-600 hover:text-slate-900 underline"
              >
                <HelpCircle className="h-3 w-3" />
                Request Human Review / Question Outcome
              </Link>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
