import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export function MembershipTierCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Tier 1: Registered Supplier */}
      <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">ENTRY STAGE</span>
            <h3 className="text-xl font-bold text-slate-900">Registered Supplier</h3>
            <p className="text-xs text-slate-500 font-light">
              Create your initial profile, register your trade disciplines, and begin the assurance process.
            </p>
          </div>

          <div className="font-mono pt-2 border-t border-slate-100">
            <div className="text-3xl font-bold text-slate-900">£0</div>
            <span className="text-[11px] text-slate-400">Free to register</span>
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

        <Link href="/suppliers/apply" className="btn-secondary text-xs py-2.5 text-center w-full block">
          Register Interest &rarr;
        </Link>
      </div>

      {/* Tier 2: Verified Supplier */}
      <div className="bg-white border-2 border-slate-900 p-8 rounded-sm shadow-md flex flex-col justify-between space-y-6 relative">
        <div className="absolute -top-3 left-6 bg-slate-900 text-white text-[9.5px] font-mono uppercase font-bold px-2.5 py-0.5 rounded">
          STANDARD COMMERCIAL TIER
        </div>

        <div className="space-y-4">
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-mono uppercase text-brand-pink font-bold">VERIFIED NETWORK</span>
            <h3 className="text-xl font-bold text-slate-900">Verified Supplier</h3>
            <p className="text-xs text-slate-500 font-light">
              For approved contractors requiring active compliance management, portal access, and work consideration.
            </p>
          </div>

          <div className="font-mono pt-2 border-t border-slate-100">
            <div className="text-3xl font-bold text-slate-900">£495</div>
            <span className="text-[11px] text-slate-400">+ VAT per year</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-100 font-medium">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Maintained verified supplier record</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Digital Supplier Portal &amp; Document Vault</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Automated accreditation expiry radar</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Eligible for work allocation once approved</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Partner network event invitations</span>
            </li>
          </ul>
        </div>

        <Link href="/suppliers/apply" className="btn-primary text-xs py-2.5 text-center w-full block">
          Apply for Verification &rarr;
        </Link>
      </div>

      {/* Tier 3: Network Partner */}
      <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">EXPANDED FOOTPRINT</span>
            <h3 className="text-xl font-bold text-slate-900">Network Partner</h3>
            <p className="text-xs text-slate-500 font-light">
              For larger regional or multi-discipline providers with multiple users, wider scope, and active engagement.
            </p>
          </div>

          <div className="font-mono pt-2 border-t border-slate-100">
            <div className="text-3xl font-bold text-slate-900">£1,250</div>
            <span className="text-[11px] text-slate-400">+ VAT per year</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Everything in Verified Supplier</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Multi-user organisational portal access</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Extended technical forum participation</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Dedicated supply chain account point</span>
            </li>
          </ul>
        </div>

        <Link href="/suppliers/membership" className="btn-secondary text-xs py-2.5 text-center w-full block">
          View Partner Details &rarr;
        </Link>
      </div>
    </div>
  );
}
