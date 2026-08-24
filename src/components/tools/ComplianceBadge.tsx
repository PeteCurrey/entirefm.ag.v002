'use client';

import React, { useState } from 'react';
import { ComplianceClassification, getClassificationLabel, getClassificationColor } from '@/lib/tools/compliance-taxonomy';
import { HelpCircle } from 'lucide-react';

const CLASSIFICATION_EXPLANATIONS: Record<ComplianceClassification, { title: string; desc: string }> = {
  LEGAL_STATUTORY_DUTY: {
    title: 'Statutory Duty (Strict Liability)',
    desc: 'Direct legal mandate under UK Acts of Parliament or Statutory Instruments. Non-compliance constitutes a criminal offense and invalidates insurance.',
  },
  BRITISH_INDUSTRY_STANDARD: {
    title: 'British / Industry Standard',
    desc: 'Formally codified engineering standard (e.g. BS 5839, BS 5266, BS 7671) representing statutory benchmark for good engineering practice and evidence.',
  },
  SFG20_PLANNED_PRACTICE: {
    title: 'SFG20 Planned Maintenance Standard',
    desc: 'Industry benchmark specification for building engineering services maintenance, optimising operational life, energy efficiency, and plant reliability.',
  },
  MANUFACTURER_REQUIREMENT: {
    title: 'Manufacturer Specification (OEM)',
    desc: 'Servicing intervals and procedures required to maintain equipment warranties, design efficiency, and prevent premature component failure.',
  },
  RISK_BASED_SITE_SPECIFIC: {
    title: 'Risk-Based / Duty-Holder Assessment',
    desc: 'Interval and inspection scope determined by building risk profile, occupancy density, environmental factors, or formal specialist risk assessment.',
  },
  INDUSTRY_BEST_PRACTICE: {
    title: 'Industry Good Practice',
    desc: 'Recommended engineering and fabric care practice exceeding baseline requirements to protect asset asset valuation and tenant experience.',
  },
};

export function ComplianceBadge({
  classification,
  showExplanation = false,
  className = '',
}: {
  classification: ComplianceClassification;
  showExplanation?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const label = getClassificationLabel(classification);
  const color = getClassificationColor(classification);
  const info = CLASSIFICATION_EXPLANATIONS[classification];

  return (
    <div className="relative inline-flex items-center">
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border tracking-tight ${color.badge} ${className}`}
      >
        <span>{label}</span>
        {showExplanation && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="hover:opacity-80 focus:outline-none ml-0.5 text-current"
            title="Click to view regulatory basis"
          >
            <HelpCircle className="w-2.5 h-2.5" />
          </button>
        )}
      </span>

      {open && (
        <div
          className="absolute left-0 bottom-full mb-2 z-50 w-64 p-3 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl text-left"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-xs font-bold text-white mb-1 flex items-center justify-between">
            <span>{info.title}</span>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">{info.desc}</p>
        </div>
      )}
    </div>
  );
}
