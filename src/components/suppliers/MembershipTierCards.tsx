import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { SUPPLIER_MEMBERSHIP } from '@/config/supplier-membership';

/**
 * MembershipTierCards — Single Membership Card
 *
 * Replaces the previous 3-card tier grid (Applicant / £295 / £695).
 * There is now ONE membership at £95 + VAT / year.
 *
 * NOTE: An applicant is NOT a membership tier. It is a business going
 * through the EntireFM onboarding process. This card represents the
 * membership they unlock upon successful approval.
 */
export function MembershipTierCards() {
  return (
    <div className="space-y-6">
      {/* Application Journey Explainer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 – Application */}
        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">1</div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Start Here</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Apply</h3>
            <p className="text-xs text-slate-600 font-light leading-relaxed">
              Complete your company profile, declare your trade capabilities and operating regions, and submit your baseline compliance evidence. Free to start — no fee until submission.
            </p>
          </div>

          <ul className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
            {[
              'Company profile & trade registration',
              'Capability & coverage declaration',
              'Statutory compliance evidence upload',
              'Technical intake review by EntireFM',
            ].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link href="/suppliers/apply" className="btn-secondary text-xs py-2.5 text-center w-full block font-medium">
            Start Application <ArrowRight className="inline h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Step 2 – Membership */}
        <div className="bg-[#0B1220] border border-slate-800 p-6 rounded-sm shadow-md flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/10 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] text-xs font-bold">2</div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">Annual Membership</span>
            </div>
            <h3 className="text-lg font-bold text-white">EntireFM Supplier Membership</h3>
            <div className="pt-2 border-t border-slate-700">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-light text-white">£95</span>
                <span className="text-sm text-slate-400 font-light">+ VAT / year</span>
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                Invitation codes accepted — fee waived for qualifying applicants
              </p>
            </div>
          </div>

          <ul className="relative z-10 space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-700 font-medium">
            {SUPPLIER_MEMBERSHIP.includedFeatures.slice(0, 7).map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link href="/suppliers/apply" className="relative z-10 btn-primary text-xs py-2.5 text-center w-full block font-bold">
            Apply to Join <ArrowRight className="inline h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-500 font-light leading-relaxed text-center max-w-xl mx-auto">
        {SUPPLIER_MEMBERSHIP.disclaimer}
      </p>
    </div>
  );
}
