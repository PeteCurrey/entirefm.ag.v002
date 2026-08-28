import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';

export function MembershipTierCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Tier 1: Applicant Supplier */}
      <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">STAGE 1</span>
            <h3 className="text-xl font-bold text-slate-900">Applicant Supplier</h3>
            <p className="text-xs text-slate-500 font-light">
              Create your company profile, declare your trade disciplines and operating regions, and submit compliance evidence.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-sm font-bold text-slate-900 uppercase tracking-wider">Technical Intake</div>
            <div className="text-lg font-light text-slate-900 mt-0.5">£0 Intake</div>
            <span className="text-[11px] text-slate-400">Due diligence verification</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Initial supplier profile creation</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Access to dynamic onboarding checklist</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Submission of compliance credentials</span>
            </li>
          </ul>
        </div>

        <Link href="/suppliers/apply" className="btn-secondary text-xs py-2.5 text-center w-full block font-medium">
          Start Application &rarr;
        </Link>
      </div>

      {/* Tier 2: Contractor Network Membership */}
      <div className="bg-white border-2 border-slate-900 p-8 rounded-sm shadow-md flex flex-col justify-between space-y-6 relative">
        <div className="absolute -top-3 left-6 bg-slate-900 text-white text-[9.5px] font-light uppercase tracking-wider font-bold px-2.5 py-0.5 rounded">
          NETWORK MEMBERSHIP
        </div>

        <div className="space-y-4">
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-light uppercase tracking-wider text-brand-pink font-bold">ANNUAL MEMBERSHIP</span>
            <h3 className="text-xl font-bold text-slate-900">Contractor Network Member</h3>
            <p className="text-xs text-slate-500 font-light">
              For qualified trade contractors with verified credentials, active document vault storage, and authorized service scopes.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-xl font-light text-slate-900">£295 + VAT<span className="text-xs text-slate-500 font-normal"> / year</span></div>
            <span className="text-[11px] text-slate-500 font-light">EntireFM Invitation Codes accepted (£0 waiver)</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-100 font-medium">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Digital Supplier Portal &amp; Document Vault</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Automated accreditation &amp; insurance expiry radar</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Priority network communications &amp; updates</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Verified Supply Chain Partner Status</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Full suite of operational &amp; field execution tooling</span>
            </li>
          </ul>
        </div>

        <Link href="/suppliers/apply" className="btn-primary text-xs py-2.5 text-center w-full block font-bold">
          Apply to Join &rarr;
        </Link>
      </div>

      {/* Tier 3: Contractor Network Partner Membership */}
      <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">PARTNER TIER</span>
            <h3 className="text-xl font-bold text-slate-900">Network Partner</h3>
            <p className="text-xs text-slate-500 font-light">
              For regional and national contractors providing multi-trade coverage across multiple client estates.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-xl font-light text-slate-900">£695 + VAT<span className="text-xs text-slate-500 font-normal"> / year</span></div>
            <span className="text-[11px] text-slate-500 font-light">EntireFM Invitation Codes accepted (£0 waiver)</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Everything in Network Membership (£295)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Multi-user organisational portal seats</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Expanded multi-region operational profile</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Technical industry forum &amp; event priority access</span>
            </li>
          </ul>
        </div>

        <Link href="/suppliers/apply" className="btn-secondary text-xs py-2.5 text-center w-full block font-medium">
          Apply for Partner Tier &rarr;
        </Link>
      </div>
    </div>
  );
}
