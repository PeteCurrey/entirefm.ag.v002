import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export function MembershipTierCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Tier 1: Applicant Supplier */}
      <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-xs flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">STAGE 1 &bull; INTAKE</span>
            <h3 className="text-xl font-bold text-slate-900">Applicant Supplier</h3>
            <p className="text-xs text-slate-600 font-light leading-relaxed">
              Create your company profile, declare your genuine trade capabilities and operating regions, and submit baseline compliance evidence.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Technical Intake</div>
            <div className="text-2xl font-light text-slate-900 mt-0.5">£0 Intake</div>
            <span className="text-[11px] text-slate-500 font-light">Free registration &amp; evidence verification</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Initial supplier profile creation &amp; trade registration</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Access to dynamic onboarding checklist</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Submission of statutory compliance credentials</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Technical intake &amp; scope review by EntireFM</span>
            </li>
          </ul>
        </div>

        <Link href="/suppliers/apply" className="btn-secondary text-xs py-2.5 text-center w-full block font-medium">
          Start Application &rarr;
        </Link>
      </div>

      {/* Tier 2: Contractor Network Member */}
      <div className="bg-white border-2 border-slate-900 p-8 rounded-sm shadow-md flex flex-col justify-between space-y-6 relative">
        <div className="absolute -top-3 left-6 bg-[#EA580C] text-white text-[9.5px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-sm">
          CONTRACTOR OPERATING ENVIRONMENT
        </div>

        <div className="space-y-4">
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">ANNUAL MEMBERSHIP</span>
            <h3 className="text-xl font-bold text-slate-900">Contractor Network Member</h3>
            <p className="text-xs text-slate-600 font-light leading-relaxed">
              For established trade contractors joining the EntireFM supply chain with a professional digital operating environment.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-2xl font-light text-slate-900">£295 + VAT<span className="text-xs text-slate-500 font-normal"> / year</span></div>
            <span className="text-[11px] text-emerald-700 font-medium">EntireFM Invitation Codes accepted (£0 waiver)</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-100 font-medium">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Digital Contractor Control Centre &amp; Work Queue</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Compliance Centre &amp; Document Vault with expiry radar</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>RAMS creation &amp; digital Job Pack assembly tools</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Workforce &amp; Competency Matrix (engineer credentials)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Business productivity tools (labour &amp; margin calculators)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Contractor Intelligence (Company Watch &amp; safety alerts)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Verified Supply Chain Partner status &amp; work eligibility</span>
            </li>
          </ul>
        </div>

        <Link href="/suppliers/apply" className="btn-primary text-xs py-2.5 text-center w-full block font-bold">
          Apply to Join &rarr;
        </Link>
      </div>

      {/* Tier 3: Network Partner */}
      <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-xs flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PARTNER TIER</span>
            <h3 className="text-xl font-bold text-slate-900">Network Partner</h3>
            <p className="text-xs text-slate-600 font-light leading-relaxed">
              For contractors with broader regional coverage, larger workforce teams, or multi-trade operational capability.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-2xl font-light text-slate-900">£695 + VAT<span className="text-xs text-slate-500 font-normal"> / year</span></div>
            <span className="text-[11px] text-emerald-700 font-medium">EntireFM Invitation Codes accepted (£0 waiver)</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Everything in Contractor Network Member (£295)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Multi-user organisational portal seats for dispatch &amp; admin</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Expanded multi-region operational profile &amp; representation</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Broader organizational capability &amp; multi-trade grouping</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Partner-level technical engagement &amp; priority forum access</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Direct supply chain director &amp; procurement alignment</span>
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
