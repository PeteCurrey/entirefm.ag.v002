import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export interface ContractorConversionBannerProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export function ContractorConversionBanner({
  eyebrow = 'ENTIREFM CONTRACTOR NETWORK',
  title = 'Connect Your Business With Commercial Facilities Management Opportunities',
  description = 'Join our nationwide network of approved regional specialists and engineering contractors. Access commercial facilities management requirements, digital job packs, and professional compliance infrastructure.',
  primaryCtaLabel = 'Apply to Join the Network',
  primaryCtaHref = '/contractors/join',
  secondaryCtaLabel = 'Review Vetting Standards',
  secondaryCtaHref = '/contractors/approved-contractor-network',
}: ContractorConversionBannerProps) {
  return (
    <div className="relative isolate overflow-hidden bg-slate-900 text-white rounded-sm p-8 sm:p-12 border border-slate-800 shadow-xl my-12">
      {/* Background radial highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 w-80 h-80 rounded-full opacity-20 blur-3xl bg-[#EA580C]"
      />
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-mono tracking-wider text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C] animate-pulse" />
          <span>{eyebrow}</span>
        </div>

        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extralight tracking-tight text-white leading-snug">
          {title}
        </h3>

        <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed max-w-2xl">
          {description}
        </p>

        {/* Commercial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-white/[0.04] border border-white/10 rounded-sm">
            <span className="text-[#EA580C] font-semibold block text-[11px] uppercase tracking-wider">
              £95 Annual Membership
            </span>
            <span className="text-slate-300 text-[11px] font-light">
              Payable upon application submission.
            </span>
          </div>
          <div className="p-3 bg-white/[0.04] border border-white/10 rounded-sm">
            <span className="text-white font-semibold block text-[11px] uppercase tracking-wider">
              Merit-Based Allocation
            </span>
            <span className="text-slate-300 text-[11px] font-light">
              Considered based on trade &amp; location.
            </span>
          </div>
          <div className="p-3 bg-white/[0.04] border border-white/10 rounded-sm">
            <span className="text-white font-semibold block text-[11px] uppercase tracking-wider">
              Document Vault
            </span>
            <span className="text-slate-300 text-[11px] font-light">
              Automated compliance &amp; insurance expiry.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href={primaryCtaHref}
            className="btn-primary text-xs py-3.5 px-6 font-semibold flex items-center gap-2"
          >
            <span>{primaryCtaLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={secondaryCtaHref}
            className="btn-ghost-light text-xs py-3.5 px-6 font-normal"
          >
            {secondaryCtaLabel}
          </Link>
        </div>

        {/* Strict Disclaimer */}
        <div className="pt-2 text-[11px] text-slate-400 font-light border-t border-white/10 flex items-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span>
            <strong>Operational Notice:</strong> Membership provides access to the EntireFM Contractor Network and operating platform. Membership does not guarantee work or contract awards; work allocation remains strictly governed by client requirements, compliance verification, geographic proximity, and contractor performance.
          </span>
        </div>
      </div>
    </div>
  );
}
