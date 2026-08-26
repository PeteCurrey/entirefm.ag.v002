import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Zap, ArrowRight, Lock, Receipt, Smartphone } from 'lucide-react';

export function PaymentPerformanceBanner() {
  return (
    <section className="py-24 bg-brand-graphite text-white border-t border-b border-brand-edge-dark relative overflow-hidden">
      {/* Subtle Glow Background */}
      <div 
        aria-hidden="true" 
        className="absolute -top-40 right-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none"
      />
      <div 
        aria-hidden="true" 
        className="absolute -bottom-40 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Commitments */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink block font-medium">
              THE ENTIREFM COMMERCIAL PLEDGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white leading-tight">
              Predictable Cashflow. Clear Work Orders. Zero Payment Disputes.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              We know what frustrates contractors most: vague job scopes, unapproved variations, slow invoice processing, and late payments. EntireFM eliminates operational friction through digital transparency.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-sm space-y-1.5">
                <span className="text-emerald-400 font-medium text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Pre-Authorised Limits
                </span>
                <p className="text-[12px] text-slate-400 font-light leading-snug">
                  Fixed spend limits on reactive callouts. If remedial parts exceed limits, variation approval is granted in CAFM before leaving site.
                </p>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-sm space-y-1.5">
                <span className="text-emerald-400 font-medium text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Instant Milestone Sign-Off
                </span>
                <p className="text-[12px] text-slate-400 font-light leading-snug">
                  Operative uploads photographic proof of completion and signed worksheet via mobile app for same-day digital sign-off.
                </p>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-sm space-y-1.5">
                <span className="text-emerald-400 font-medium text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Prompt Payment Terms
                </span>
                <p className="text-[12px] text-slate-400 font-light leading-snug">
                  Electronic invoice matching against approved purchase orders. No invoice batch delays or hidden administrative deductions.
                </p>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-sm space-y-1.5">
                <span className="text-emerald-400 font-medium text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Dual-Control Bank Security
                </span>
                <p className="text-[12px] text-slate-400 font-light leading-snug">
                  Rigorous dual-officer phone verification for all supplier bank changes prevents fraudulent mandate hijacking.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Digital CAFM Workflow Diagram Card */}
          <div className="lg:col-span-6 bg-slate-950/90 border border-slate-800 rounded-sm p-8 sm:p-10 shadow-2xl relative">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
              <div>
                <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block">
                  DIGITAL WORK ORDER PIPELINE
                </span>
                <h3 className="text-lg font-light text-white">The EntireCAFM Job Cycle</h3>
              </div>
              <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] text-brand-pink font-light">
                Zero Paperwork
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: '01',
                  title: 'Scoped Digital Work Order',
                  desc: 'Full site access code, tenant contact, asset serial number, and pre-authorised budget issued to your dispatch desk.',
                  icon: Smartphone,
                },
                {
                  step: '02',
                  title: 'Mobile Engineer Check-In & RAMS',
                  desc: 'Your engineer checks in via mobile, confirms dynamic site RAMS, and records initial diagnostic findings.',
                  icon: ShieldCheck,
                },
                {
                  step: '03',
                  title: 'Photographic Evidence & Worksheet',
                  desc: 'Before/after photographs and digital client signature recorded on-site and uploaded instantly to EntireCAFM.',
                  icon: Zap,
                },
                {
                  step: '04',
                  title: 'Automated Invoice Matching & Payment',
                  desc: 'Submit PDF invoice quoting the approved PO number for automated validation and direct BACS remittance.',
                  icon: Receipt,
                },
              ].map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-4 p-3.5 rounded-sm bg-slate-900/50 border border-slate-800/80">
                    <span className="text-sm font-extralight text-brand-pink">{item.step}</span>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-medium text-white">{item.title}</h4>
                      <p className="text-[11.5px] text-slate-400 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <span className="text-[11.5px] text-slate-400 font-light">
                Ready to receive structured work orders?
              </span>
              <Link href="/suppliers/apply" className="btn-primary text-xs py-2.5 px-4">
                Join Supplier Network <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
