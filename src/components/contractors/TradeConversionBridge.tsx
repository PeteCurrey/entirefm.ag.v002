import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, Sliders, Building2 } from "lucide-react";

export function TradeConversionBridge({ tradeName }: { tradeName: string }) {
  return (
    <aside className="my-16 container-wide">
      <div className="rounded-sm border border-slate-200 bg-white shadow-card overflow-hidden">
        <div className="bg-slate-900 text-white p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#EA580C]">
              <Building2 className="w-3.5 h-3.5" />
              <span>THE WORK BEHIND THE WORK</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-light text-white leading-tight">
              Built for the paperwork, compliance and jobs behind {tradeName}.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Your trade is only one part of running a professional contracting business. EntireFM gives you one connected platform to manage documentation, compliance, and commercial work orders.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link href="/suppliers/apply" className="btn-primary text-xs py-3 px-6 font-bold justify-center">
              Apply to Join EntireFM &rarr;
            </Link>
            <Link href="/suppliers/membership" className="btn-ghost-light text-xs py-3 px-6 justify-center">
              View Membership (£95/yr)
            </Link>
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-[#FAFAF8] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light text-slate-700 border-t border-slate-200">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Your Compliance</span>
            </div>
            <p className="text-slate-600 text-[11.5px] leading-relaxed">
              Automated 90/60/30-day expiry tracking on insurance, accreditations, and trade qualifications.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />
              <span>Your Jobs &amp; Evidence</span>
            </div>
            <p className="text-slate-600 text-[11.5px] leading-relaxed">
              Receive work orders, allocate engineers, and upload timestamped before/after photo evidence.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Fair Network Participation</span>
            </div>
            <p className="text-slate-600 text-[11.5px] leading-relaxed">
              Merit-based work allocation based on geography, capability, performance, and client demand.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
