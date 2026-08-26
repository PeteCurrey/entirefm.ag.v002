import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { CANONICAL_PUBLIC_PRICING } from '@/config/supplier-data';

export function MembershipTierCards() {
  const reg = CANONICAL_PUBLIC_PRICING.REGISTERED;
  const member = CANONICAL_PUBLIC_PRICING.SUPPLIER_NETWORK_MEMBER;
  const partner = CANONICAL_PUBLIC_PRICING.NETWORK_PARTNER;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Tier 1: Registered Supplier */}
      <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">ENTRY STAGE</span>
            <h3 className="text-xl font-bold text-slate-900">{reg.name}</h3>
            <p className="text-xs text-slate-500 font-light">
              Create your initial profile, register your trade disciplines, and begin the assurance process.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-3xl font-bold text-slate-900">{reg.displayPrice}</div>
            <span className="text-[11px] text-slate-400">Free to register · Does not constitute approval</span>
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

      {/* Tier 2: Supplier Network Membership */}
      <div className="bg-white border-2 border-slate-900 p-8 rounded-sm shadow-md flex flex-col justify-between space-y-6 relative">
        <div className="absolute -top-3 left-6 bg-slate-900 text-white text-[9.5px] font-light uppercase tracking-wider font-bold px-2.5 py-0.5 rounded">
          STANDARD COMMERCIAL TIER
        </div>

        <div className="space-y-4">
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-light uppercase tracking-wider text-brand-pink font-bold">NETWORK MEMBERSHIP</span>
            <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
            <p className="text-xs text-slate-500 font-light">
              For suppliers requiring active compliance document administration, digital portal tools, and network engagement.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-3xl font-bold text-slate-900">£{member.priceGbp}</div>
            <span className="text-[11px] text-slate-400">+ VAT per year · Separate from assurance approval</span>
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
              <span>Partner network event invitations</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Eligible for work consideration once technically approved</span>
            </li>
          </ul>
        </div>

        <Link href="/suppliers/apply" className="btn-primary text-xs py-2.5 text-center w-full block">
          Apply for Membership &rarr;
        </Link>
      </div>

      {/* Tier 3: Network Partner Membership */}
      <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">EXPANDED FOOTPRINT</span>
            <h3 className="text-xl font-bold text-slate-900">{partner.name}</h3>
            <p className="text-xs text-slate-500 font-light">
              For larger regional or multi-discipline providers with multiple portal users, wider scope, and active forum engagement.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-3xl font-bold text-slate-900">£{partner.priceGbp.toLocaleString()}</div>
            <span className="text-[11px] text-slate-400">+ VAT per year · Does not buy Preferred status</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Everything in Supplier Network Membership</span>
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
              <span>Dedicated supply chain account coordinator</span>
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
