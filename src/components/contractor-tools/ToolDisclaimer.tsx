import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ToolDisclaimerProps {
  context?: 'rams' | 'compliance' | 'coshh' | 'document' | 'onboarding' | 'job' | 'general';
  className?: string;
}

const DISCLAIMER_TEXT: Record<NonNullable<ToolDisclaimerProps['context']>, string> = {
  rams: 'This tool is provided as a practical preparation aid. It does not constitute legal, health and safety, or professional advice, and completing it does not confirm that your RAMS are compliant, legally sufficient, or approved by the HSE or any other authority. RAMS must remain specific to the actual work, site, risks and applicable legislation. Contractors remain responsible for carrying out appropriate assessments and obtaining competent advice where required.',
  compliance: 'This tool is a practical preparation checklist, not a compliance audit or certification. Completing it does not confirm legal compliance, regulatory approval, or suitability for any specific contract or client. Requirements vary according to the work, client, site and applicable legislation. Contractors remain responsible for maintaining appropriate documentation and obtaining professional advice where required.',
  coshh: 'This tool is a practical preparation aid and does not replace a competent COSHH assessment. It does not generate legally valid exposure limits, hazard classifications or control measures, and completing it does not confirm that hazardous substances are being handled safely. Requirements depend on the specific substances, work activities and site conditions. Contractors must obtain authoritative Safety Data Sheets and competent COSHH advice as required.',
  document: 'The classifications shown (Legally Required / Commonly Requested / Good Practice) are provided as general guidance only. The specific documents required for any contract will depend on the client, site, work scope, applicable legislation and regulatory requirements. This tool does not constitute legal advice. Contractors should verify requirements directly with clients and appropriate professional advisers.',
  onboarding: 'This checklist is a practical guide to the information and documentation commonly associated with joining a professional contractor network. Requirements for specific contracts, clients and platforms may vary. Completing this checklist does not constitute an application, guarantee of acceptance, or promise of work. EntireFM membership is subject to separate application, vetting and approval processes.',
  job: 'This tool is a practical preparation aid only. Requirements for specific jobs will depend on the work scope, client, site, applicable legislation and permit-to-work conditions. Completing this checklist does not confirm that work is safe to proceed. Contractors remain responsible for carrying out appropriate risk assessments and following applicable safety procedures for every job.',
  general: 'This tool is provided as a practical preparation aid. It does not constitute legal, health and safety, COSHH or professional advice, and completing it does not confirm that work is compliant or safe. Requirements vary according to the work, site, risks and applicable legislation. Contractors remain responsible for carrying out appropriate assessments and obtaining competent advice where required.',
};

export function ToolDisclaimer({ context = 'general', className = '' }: ToolDisclaimerProps) {
  const text = DISCLAIMER_TEXT[context];

  return (
    <aside
      role="note"
      aria-label="Important disclaimer"
      className={`flex gap-3 rounded-sm border border-amber-200 bg-amber-50 px-4 py-3.5 ${className}`}
    >
      <AlertTriangle
        className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
        aria-hidden="true"
      />
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-amber-700 mb-1">
          Important
        </p>
        <p className="text-xs text-amber-800 leading-relaxed font-light">
          {text}
        </p>
      </div>
    </aside>
  );
}
