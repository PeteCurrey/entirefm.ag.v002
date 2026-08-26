import React from 'react';
import { ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';

export function CommercialTransparencyBanner() {
  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-light uppercase tracking-wider text-brand-pink font-bold">
            GOVERNANCE PRINCIPLE // INDEPENDENT PROCUREMENT
          </span>
          <h2 className="text-xl sm:text-2xl font-light">
            Commercial Participation is Separate from Procurement
          </h2>
          <p className="text-xs text-slate-300 font-light max-w-2xl">
            EntireFM maintains complete separation between commercial Partner Network services and operational supplier assurance. Paying EntireFM never purchases work allocation priority or favourable performance ratings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-6 sm:p-8 gap-6 text-xs font-light">
        {/* What Fees Support */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold font-sans text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>What Your Fees Support</span>
          </div>
          <ul className="space-y-2 text-slate-600 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">&check;</span>
              <span>Digital Supplier Portal infrastructure and self-service document vault</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">&check;</span>
              <span>Dedicated technical compliance desk &amp; accreditation verification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">&check;</span>
              <span>Automated 90/60/30-day insurance and qualification expiry monitoring</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">&check;</span>
              <span>Partner networking events, technical forums, and industry roundtables</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">&check;</span>
              <span>Secure dual-control bank remittance verification</span>
            </li>
          </ul>
        </div>

        {/* What Payment Does NOT Buy */}
        <div className="space-y-3 pt-6 md:pt-0">
          <div className="flex items-center gap-2 text-rose-800 font-bold font-sans text-sm">
            <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>What Payment Does NOT Buy</span>
          </div>
          <ul className="space-y-2 text-slate-600 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">&times;</span>
              <span><strong>Guaranteed work allocation</strong> or tender success</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">&times;</span>
              <span><strong>Preferred Supplier status</strong> (must be earned operationally)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">&times;</span>
              <span><strong>Bypassing technical vetting</strong> or mandatory safety credentials</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">&times;</span>
              <span><strong>Higher dispatch ranking</strong> in automated allocation algorithms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">&times;</span>
              <span><strong>Favourable performance scores</strong> or audit leniency</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
