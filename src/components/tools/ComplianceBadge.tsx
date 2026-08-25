'use client';

import React from 'react';
import { ComplianceClassification } from '@/lib/tools/compliance-taxonomy';

interface ComplianceBadgeProps {
  classification: ComplianceClassification;
  showBasisPopover?: boolean;
}

const CLASSIFICATION_CONFIG: Record<
  ComplianceClassification,
  {
    label: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    explanation: string;
  }
> = {
  LEGAL_STATUTORY_DUTY: {
    label: 'LEGAL STATUTE',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-200',
    textClass: 'text-rose-700',
    explanation: 'Mandatory criminal statute or statutory regulation (e.g. Health & Safety at Work Act 1974, RRO 2005, EAWR 1989). Non-compliance creates immediate corporate and personal director liability.',
  },
  BRITISH_INDUSTRY_STANDARD: {
    label: 'BS STANDARD',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-700',
    explanation: 'Recognised British / European Standard (e.g. BS 5839, BS 5266, BS 7671). Expected by property insurers, warranty providers, and fire authorities during formal audits.',
  },
  SFG20_PLANNED_PRACTICE: {
    label: 'SFG20 PRACTICE',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-700',
    explanation: 'Industry standard planned preventative maintenance schedule defined by the Building Engineering Services Association (BESA). Prevents premature plant degradation.',
  },
  MANUFACTURER_REQUIREMENT: {
    label: 'OEM SPEC',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-800',
    explanation: 'Mandatory maintenance task stipulated by the Original Equipment Manufacturer to maintain equipment warranty and design performance efficiency.',
  },
  RISK_BASED_SITE_SPECIFIC: {
    label: 'RISK ASSESSMENT',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200',
    textClass: 'text-purple-700',
    explanation: 'Task frequency or scope determined by on-site risk assessment and equipment duty cycle rather than a rigid calendar interval.',
  },
  INDUSTRY_BEST_PRACTICE: {
    label: 'BEST PRACTICE',
    bgClass: 'bg-slate-100',
    borderClass: 'border-slate-200',
    textClass: 'text-slate-700',
    explanation: 'Discretionary engineering maintenance task recommended for optimal asset longevity, energy efficiency, and operational reliability.',
  },
};

export function ComplianceBadge({ classification }: ComplianceBadgeProps) {
  const config = CLASSIFICATION_CONFIG[classification] || {
    label: 'PRACTICE',
    bgClass: 'bg-slate-100',
    borderClass: 'border-slate-200',
    textClass: 'text-slate-700',
    explanation: 'Standard maintenance practice.',
  };

  return (
    <span
      title={config.explanation}
      className={`inline-flex items-center px-2 py-0.5 border ${config.bgClass} ${config.borderClass} ${config.textClass} text-[10.5px] font-mono font-light tracking-wider uppercase rounded-sm shadow-2xs`}
    >
      {config.label}
    </span>
  );
}
