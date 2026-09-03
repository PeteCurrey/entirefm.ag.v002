import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, ShieldCheck, Zap, Info } from 'lucide-react';
import { SUPPLIER_MEMBERSHIP } from '@/config/supplier-membership';

interface SupplierMembershipSummaryProps {
  showCta?: boolean;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Canonical Supplier Membership Summary Component
 *
 * Single source of truth display component for the £95 + VAT / year
 * EntireFM Supplier Membership.
 */
export function SupplierMembershipSummary({
  showCta = true,
  ctaText = 'Apply for Membership',
  ctaHref = '/suppliers/apply',
  className = '',
  compact = false,
}: SupplierMembershipSummaryProps) {
  return (
    <div className={`bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden ${className}`}>
      {/* Header Banner */}
      <div className="bg-[#0B1220] p-6 text-white relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#2563EB]/20 text-[#60A5FA] text-[10px] font-bold uppercase tracking-wider mb-2 border border-[#2563EB]/30">
              <ShieldCheck className="w-3 h-3" />
              Annual Commercial Membership
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{SUPPLIER_MEMBERSHIP.name}</h3>
            <p className="text-xs text-slate-400 mt-1 font-light max-w-xl">
              {SUPPLIER_MEMBERSHIP.platformDescription}
            </p>
          </div>
          <div className="sm:text-right shrink-0">
            <div className="flex items-baseline sm:justify-end gap-1">
              <span className="text-3xl font-light text-white">£{SUPPLIER_MEMBERSHIP.annualPriceExVat}</span>
              <span className="text-xs text-slate-400 font-light">+ VAT / year</span>
            </div>
            <span className="text-[11px] text-slate-400 block font-light">
              {SUPPLIER_MEMBERSHIP.displayMonthly}
            </span>
          </div>
        </div>

        {/* Invitation Code Callout */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <Zap className="w-3.5 h-3.5 shrink-0" />
          <span>EntireFM Invitation Codes accepted — fee waived for qualifying applicants</span>
        </div>
      </div>

      {/* Feature List */}
      <div className="p-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
          Complete Platform Access Included
        </h4>
        <div className={`grid grid-cols-1 ${compact ? 'gap-2.5' : 'sm:grid-cols-2 gap-3'} text-xs text-slate-700`}>
          {SUPPLIER_MEMBERSHIP.includedFeatures.map((feature) => (
            <div key={feature} className="flex items-start gap-2">
              <div className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="h-2.5 w-2.5 text-emerald-600" />
              </div>
              <span className="font-medium text-slate-800">{feature}</span>
            </div>
          ))}
        </div>

        {/* Six Operational Pillars Overview */}
        {!compact && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(SUPPLIER_MEMBERSHIP.pillars).map(([key, pillar]) => (
                <div key={key} className="p-3 bg-slate-50 border border-slate-200 rounded-sm">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {pillar.label}
                  </div>
                  <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                    {pillar.features[0]}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    +{pillar.features.length - 1} capabilities
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer Note */}
        <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-sm flex items-start gap-2.5 text-[11px] text-slate-600 font-light leading-relaxed">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>{SUPPLIER_MEMBERSHIP.disclaimer}</span>
        </div>

        {/* CTA */}
        {showCta && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              No payment required until application review stage.
            </div>
            <Link
              href={ctaHref}
              className="btn-primary text-xs py-2.5 px-6 font-bold flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {ctaText} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
