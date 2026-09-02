import React from "react";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";

export function LocalConversionBridge({ locationName }: { locationName: string }) {
  return (
    <aside className="my-16 container-wide">
      <div className="rounded-sm border border-slate-200 bg-white shadow-card overflow-hidden">
        <div className="bg-slate-900 text-white p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#EA580C]">
              <Building2 className="w-3.5 h-3.5" />
              <span>REGIONAL CONTRACTOR MEMBERSHIP</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-light text-white leading-tight">
              Ready to grow your commercial contracting business in {locationName}?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Join the EntireFM Contractor Network. Manage your compliance, access calibrated tester logs, create RAMS, and become eligible for commercial FM work orders in your area.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link href="/suppliers/apply" className="btn-primary text-xs py-3 px-6 font-bold justify-center">
              Apply to Join EntireFM &rarr;
            </Link>
            <Link href="/suppliers/membership" className="btn-ghost-light text-xs py-3 px-6 justify-center">
              View Membership (£295/yr)
            </Link>
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-[#FAFAF8] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light text-slate-700 border-t border-slate-200">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Compliance</span>
            </div>
            <p className="text-slate-600 text-[11.5px] leading-relaxed">
              Automated 90/60/30-day credential alerts so your business stays permanently audit-ready.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />
              <span>Direct Commercial POs</span>
            </div>
            <p className="text-slate-600 text-[11.5px] leading-relaxed">
              Clear job scopes, digital access notes, and fast digital invoicing reconciliation.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Merit-Based Allocation</span>
            </div>
            <p className="text-slate-600 text-[11.5px] leading-relaxed">
              Fair work distribution based on trade capability, location, and verified performance.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
