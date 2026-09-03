import React from "react";
import Link from "next/link";
import { Sliders, CheckCircle2, Clock, ShieldCheck, Building2 } from "lucide-react";

interface LocalPortalShowcaseProps {
  locationName: string;
  sampleWorkOrder: {
    title: string;
    ref: string;
    location: string;
    poValue: string;
    scope: string;
  };
}

export function LocalPortalShowcase({
  locationName,
  sampleWorkOrder,
}: LocalPortalShowcaseProps) {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="container-wide space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="eyebrow eyebrow-light">OPERATING PLATFORM</span>
          <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
            Manage Your {locationName} Commercial Work from One Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            The Contractor Portal gives your business a unified digital workspace — connecting work order dispatch, compliance tracking, and photographic proof of delivery.
          </p>
        </div>

        <div className="rounded-sm border border-slate-200 bg-[#FAFAF8] p-6 sm:p-8 shadow-card space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-slate-900 text-white rounded-sm">
                <Sliders className="w-4 h-4 text-[#EA580C]" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">Contractor Operations Command</h3>
                <span className="text-xs text-slate-500 font-mono">Live {locationName} Regional Feed</span>
              </div>
            </div>

            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-sm flex items-center gap-1.5 self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5" /> Regional Dispatch Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-sm p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Regional Work Order</span>
                </div>
                <span className="text-[11px] font-mono text-[#EA580C] font-bold">{sampleWorkOrder.ref}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-900 text-sm">{sampleWorkOrder.title}</div>
                <div className="text-slate-500 font-light flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sampleWorkOrder.location}</span>
                </div>
                <p className="text-slate-600 font-light text-[11.5px] leading-relaxed bg-[#FAFAF8] p-2.5 rounded-sm border border-slate-100">
                  {sampleWorkOrder.scope}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Commercial PO Value:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
                    {sampleWorkOrder.poValue}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{locationName} Document &amp; Radius Vault</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">90/60/30 Expiry Alerts</span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-[#FAFAF8] border border-slate-100 rounded-sm flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-900">Public &amp; Employers Liability (£10m)</span>
                  </div>
                  <span className="text-[10.5px] font-mono text-slate-500">Exp: 18 Nov 2026</span>
                </div>

                <div className="p-2.5 bg-[#FAFAF8] border border-slate-100 rounded-sm flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-900">SSIP Scheme Accreditation (SafeContractor)</span>
                  </div>
                  <span className="text-[10.5px] font-mono text-slate-500">Exp: 22 Feb 2027</span>
                </div>

                <div className="p-2.5 bg-[#FAFAF8] border border-slate-100 rounded-sm flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-900">Coverage Radius: 35 miles from {locationName}</span>
                  </div>
                  <span className="text-[10.5px] font-mono text-emerald-700">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200">
            <span className="text-xs text-slate-600 font-light">
              Full platform access included with Supplier Membership (£95+VAT/year).
            </span>
            <Link
              href="/suppliers/membership#platform-overview"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C] hover:underline"
            >
              Explore Full Platform Tools &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
