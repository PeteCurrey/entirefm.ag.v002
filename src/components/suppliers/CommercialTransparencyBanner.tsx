import React from 'react';
import { ShieldCheck, XCircle, CheckCircle2, Check, X } from 'lucide-react';

export function CommercialTransparencyBanner() {
  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-xs overflow-hidden">
      <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#EA580C] font-bold">
            GOVERNANCE PRINCIPLE // INDEPENDENT PROCUREMENT
          </span>
          <h2 className="text-xl sm:text-2xl font-light">
            Supply Chain Integrity &amp; Independent Procurement
          </h2>
          <p className="text-xs text-slate-300 font-light max-w-2xl leading-relaxed">
            EntireFM maintains complete separation between partner network collaboration and operational supplier assurance. Supplier approval and work allocation are awarded purely on technical merit, verified compliance, and operational performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-6 sm:p-8 gap-6 text-xs font-light">
        {/* What Partner Network Supports */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold font-sans text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>What Our Partner Network Supports</span>
          </div>
          <ul className="space-y-2.5 text-slate-600 font-sans">
            <li className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Digital Supplier Portal infrastructure and self-service document vault</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Dedicated technical compliance desk &amp; accreditation verification</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Automated 90/60/30-day insurance and qualification expiry monitoring</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Partner networking events, technical forums, and industry roundtables</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Secure dual-control bank remittance verification and work statements</span>
            </li>
          </ul>
        </div>

        {/* What Cannot Be Bypassed */}
        <div className="space-y-3 pt-6 md:pt-0">
          <div className="flex items-center gap-2 text-rose-800 font-bold font-sans text-sm">
            <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>What Cannot Be Bypassed or Purchased</span>
          </div>
          <ul className="space-y-2.5 text-slate-600 font-sans">
            <li className="flex items-start gap-2.5">
              <X className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>Guaranteed work allocation</strong> or tender success</span>
            </li>
            <li className="flex items-start gap-2.5">
              <X className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>Preferred Supplier status</strong> (must be earned operationally)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <X className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>Bypassing technical vetting</strong> or mandatory safety credentials</span>
            </li>
            <li className="flex items-start gap-2.5">
              <X className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>Higher dispatch ranking</strong> in automated allocation algorithms</span>
            </li>
            <li className="flex items-start gap-2.5">
              <X className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>Favourable performance scores</strong> or audit leniency</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
