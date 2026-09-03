'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Tag, ShieldCheck } from 'lucide-react';
import { SUPPLIER_MEMBERSHIP } from '@/config/supplier-membership';

const PILLARS = [
  { label: 'Operate', detail: 'Contractor Control Centre — dashboards, KPIs, task management.' },
  { label: 'Control', detail: 'Compliance Radar — certification tracking, alerts, document vault.' },
  { label: 'Develop', detail: 'RAMS Builder, method statements, and technical training pathways.' },
  { label: 'Connect', detail: 'Managed introduction to EntireFM supply chain opportunities.' },
  { label: 'Stay Informed', detail: 'Industry briefings, regulatory updates, and market intelligence.' },
  { label: 'Grow', detail: 'Commercial mentoring, bid support, and business development resources.' },
];

export function EventsMembershipBridge() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAFAF8] border-b border-[#E8E8E5]">
      <div className="container-custom space-y-16">
        {/* Membership Pillars */}
        <div>
          <div className="max-w-2xl mb-10 space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                MEMBERSHIP CAPABILITY
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
              Your membership goes beyond the events.
            </h2>
            <p className="text-sm sm:text-base text-[#6D6D68] font-light leading-relaxed">
              Every event you attend is backed by a full contractor operating platform — tools, compliance management, commercial resources, and direct industry connections. Membership gives you all of it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-5 rounded-[8px] bg-[#FFFFFF] border border-[#E8E8E5] hover:border-[#EA580C]/30 transition-colors group"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#EA580C] mt-1.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#111111] mb-1">{pillar.label}</h3>
                  <p className="text-xs text-[#6D6D68] font-light leading-relaxed">{pillar.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E8E8E5]" />

        {/* Single Membership Presentation */}
        <div>
          <div className="max-w-2xl mb-10 space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                ANNUAL MEMBERSHIP
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
              One membership. Full platform access.
            </h2>
          </div>

          {/* Invitation Code Callout */}
          <div className="mb-8 flex items-start gap-3 p-4 rounded-[6px] bg-[#FFF7ED] border border-[#FFEDD5]">
            <Tag className="w-4 h-4 text-[#EA580C] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#7C2D12] font-light leading-relaxed">
              <span className="font-semibold">Invitation Code Waiver:</span> Contractors holding an authorised EntireFM invitation code have the applicable membership fee waived at application. Speak to your EntireFM contact for details.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative p-6 sm:p-8 rounded-[10px] border border-[#111111] bg-[#111111] text-white flex flex-col gap-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#EA580C]">
                    ONE COMMERCIAL PROPOSITION
                  </span>
                  <h3 className="text-xl font-bold mt-1 text-white">
                    {SUPPLIER_MEMBERSHIP.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-light leading-relaxed mt-2 max-w-xl">
                    {SUPPLIER_MEMBERSHIP.platformDescription}
                  </p>
                </div>
                <div className="sm:text-right shrink-0">
                  <div className="flex items-baseline sm:justify-end gap-1">
                    <span className="text-3xl font-bold text-white">£{SUPPLIER_MEMBERSHIP.annualPriceExVat}</span>
                    <span className="text-xs text-slate-400">+ VAT / year</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block font-light">
                    {SUPPLIER_MEMBERSHIP.displayMonthly}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                {SUPPLIER_MEMBERSHIP.includedFeatures.map((feat, fi) => (
                  <div key={fi} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#EA580C]" />
                    <span className="text-xs text-slate-200 font-light">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  Free to start — payment processed upon application submission.
                </span>
                <Link
                  href="/suppliers/apply"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-[6px] text-xs font-semibold uppercase tracking-wider bg-[#EA580C] hover:bg-[#C2410C] text-white transition-colors w-full sm:w-auto justify-center"
                >
                  <span>Apply for Membership</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Procurement Independence Disclaimer */}
          <p className="mt-6 text-center text-xs text-[#9A9A95] font-light max-w-2xl mx-auto leading-relaxed">
            {SUPPLIER_MEMBERSHIP.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
