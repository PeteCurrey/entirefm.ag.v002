import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, FileText, CheckCircle2, Sliders, Lock } from "lucide-react";

interface ContractorPortalCtaCardProps {
  headline?: string;
  description?: string;
  bulletPoints?: string[];
  primaryBtnText?: string;
  primaryBtnHref?: string;
  secondaryBtnText?: string;
  secondaryBtnHref?: string;
}

export function ContractorPortalCtaCard({
  headline = "Your documents shouldn't live in isolation.",
  description = "RAMS, insurance certificates, operative qualifications and job records all form part of running a professional contracting business. EntireFM brings them together in one connected contractor operating workspace.",
  bulletPoints = [
    "Digital Document Vault with automated 90/60/30-day expiry tracking",
    "FM-specific RAMS builder with site controls and digital operative sign-off",
    "Direct work order dispatch, photographic job evidence & purchase orders",
    "Verified partner status within the EntireFM supply chain ecosystem",
  ],
  primaryBtnText = "Explore the Contractor Portal",
  primaryBtnHref = "/suppliers/membership#platform-overview",
  secondaryBtnText = "View Membership (£295/yr)",
  secondaryBtnHref = "/suppliers/membership",
}: ContractorPortalCtaCardProps) {
  return (
    <aside className="my-14 rounded-sm border border-slate-200 bg-white shadow-card overflow-hidden" aria-label="EntireFM Contractor Platform">
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#EA580C]">
              <Sliders className="w-3.5 h-3.5" />
              <span>THE WORK BEHIND THE WORK</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-light text-white leading-tight">
              {headline}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              {description}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
            <Link href={primaryBtnHref} className="btn-primary text-xs py-2.5 px-5 font-bold justify-center">
              {primaryBtnText} &rarr;
            </Link>
            <Link href={secondaryBtnHref} className="btn-ghost-light text-xs py-2.5 px-5 justify-center">
              {secondaryBtnText}
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 bg-[#FAFAF8] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light text-slate-700">
        {bulletPoints.map((point, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{point}</span>
          </div>
        ))}
      </div>

      <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <span>Part of the EntireFM Contractor Operating Platform</span>
        <span className="font-mono text-slate-600">platform.entirefm.com/contractor</span>
      </div>
    </aside>
  );
}
