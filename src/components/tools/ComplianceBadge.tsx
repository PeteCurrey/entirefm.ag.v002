'use client';

import React, { useState } from 'react';
import { ComplianceClassification } from '@/lib/tools/compliance-taxonomy';

interface ComplianceBadgeProps {
  classification: ComplianceClassification;
  showBasisPopover?: boolean;
}

const CLASSIFICATION_CONFIG: Record<
  ComplianceClassification,
  {
    label: string;
    borderClass: string;
    textClass: string;
    explanation: string;
  }
> = {
  LEGAL_STATUTORY_DUTY: {
    label: 'LEGAL',
    borderClass: 'border-rose-700/80',
    textClass: 'text-rose-300',
    explanation: 'Mandatory criminal statute or statutory regulation (e.g. Health & Safety at Work Act 1974, RRO 2005, EAWR 1989). Non-compliance creates immediate corporate and personal director liability.',
  },
  BRITISH_INDUSTRY_STANDARD: {
    label: 'STANDARD',
    borderClass: 'border-blue-700/80',
    textClass: 'text-blue-300',
    explanation: 'Recognised British / European Standard (e.g. BS 5839, BS 5266, BS 7671). Expected by property insurers, warranty providers, and fire authorities during formal audits.',
  },
  SFG20_PLANNED_PRACTICE: {
    label: 'PRACTICE',
    borderClass: 'border-emerald-700/80',
    textClass: 'text-emerald-300',
    explanation: 'Industry standard planned preventative maintenance schedule defined by the Building Engineering Services Association (BESA). Prevents premature plant degradation.',
  },
  MANUFACTURER_REQUIREMENT: {
    label: 'OEM',
    borderClass: 'border-amber-700/80',
    textClass: 'text-amber-300',
    explanation: 'Mandatory maintenance task stipulated by the Original Equipment Manufacturer to maintain equipment warranty and design performance efficiency.',
  },
  RISK_BASED_SITE_SPECIFIC: {
    label: 'RISK',
    borderClass: 'border-purple-700/80',
    textClass: 'text-purple-300',
    explanation: 'Task frequency or scope determined by on-site risk assessment and equipment duty cycle rather than a rigid calendar interval.',
  },
  INDUSTRY_BEST_PRACTICE: {
    label: 'BEST PRACTICE',
    borderClass: 'border-slate-700',
    textClass: 'text-slate-300',
    explanation: 'Discretionary engineering maintenance task recommended for optimal asset longevity, energy efficiency, and operational reliability.',
  },
};

export function ComplianceBadge({ classification }: ComplianceBadgeProps) {
  const config = CLASSIFICATION_CONFIG[classification] || {
    label: 'PRACTICE',
    borderClass: 'border-slate-700',
    textClass: 'text-slate-400',
    explanation: 'Standard maintenance practice.',
  };

  return (
    <span
      title={config.explanation}
      className={`inline-block px-1.5 py-0.5 border ${config.borderClass} ${config.textClass} text-[10px] font-mono font-semibold tracking-wider uppercase rounded-[2px]`}
    >
      {config.label}
    </span>
  );
}
