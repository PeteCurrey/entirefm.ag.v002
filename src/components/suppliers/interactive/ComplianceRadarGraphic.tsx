import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Clock, AlertTriangle, CheckCircle2, ArrowRight, Bell, Lock } from 'lucide-react';

export function ComplianceRadarGraphic() {
  return (
    <section className="py-24 bg-brand-graphite text-white border-t border-b border-brand-edge-dark relative overflow-hidden">
      <div className="container-wide relative z-10">
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink block font-medium">
            CONTINUOUS GOVERNANCE &amp; ACCREDITATION MONITORING
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-white leading-tight">
            The EntireFM Dynamic Compliance Radar
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            We do not believe in once-a-year paper audits that get filed away and forgotten. Our automated compliance radar proactively tracks every insurance schedule, Gas Safe licence, and CSCS card in real time to prevent sudden job dispatch blocks.
          </p>
        </div>

        {/* 4 Radar Stages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stage 1: Active & Compliant */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-sm p-6 space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extralight text-slate-400">STAGE 01</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/80 text-emerald-400 text-[10.5px] font-light">
                &gt; 90 Days Valid
              </span>
            </div>
            <h3 className="text-lg font-light text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              Active Status
            </h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              All insurances, statutory certificates, and RAMS are fully valid. Operatives carry unobstructed digital CAFM dispatch clearance.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 font-light border-t border-slate-800">
              Action: Normal automated dispatch active.
            </div>
          </div>

          {/* Stage 2: 60-Day Proactive Advisory */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-sm p-6 space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extralight text-slate-400">STAGE 02</span>
              <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800/80 text-blue-400 text-[10.5px] font-light">
                60 Days to Expiry
              </span>
            </div>
            <h3 className="text-lg font-light text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-400 shrink-0" />
              Proactive Alert
            </h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Automated email notification sent to supplier compliance desk reminding them that renewal documentation will soon be requested.
            </p>
            <div className="pt-2 text-[11px] text-blue-400/80 font-light border-t border-slate-800">
              Action: Advance notification for broker renewal.
            </div>
          </div>

          {/* Stage 3: 30-Day Urgent Upload Request */}
          <div className="bg-slate-900/90 border border-amber-900/50 rounded-sm p-6 space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extralight text-slate-400">STAGE 03</span>
              <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800/80 text-amber-400 text-[10.5px] font-light">
                30 Days to Expiry
              </span>
            </div>
            <h3 className="text-lg font-light text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400 shrink-0" />
              Action Required
            </h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Supplier Portal Action Centre flags amber alert. Direct upload portal prompt opens to submit renewed broker schedule or certificate.
            </p>
            <div className="pt-2 text-[11px] text-amber-400/80 font-light border-t border-slate-800">
              Action: Upload renewed document via portal vault.
            </div>
          </div>

          {/* Stage 4: Expired Temporary Hold */}
          <div className="bg-slate-900/90 border border-rose-900/50 rounded-sm p-6 space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extralight text-slate-400">STAGE 04</span>
              <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800/80 text-rose-400 text-[10.5px] font-light">
                0 Days (Expired)
              </span>
            </div>
            <h3 className="text-lg font-light text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-rose-400 shrink-0" />
              Automatic Hold
            </h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              CAFM automatically pauses job dispatch for expired trade disciplines until verified. Prevents compliance exposure on client sites.
            </p>
            <div className="pt-2 text-[11px] text-rose-400/80 font-light border-t border-slate-800">
              Action: Instant reactivation upon verified upload.
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 p-6 bg-slate-950/80 border border-slate-800 rounded-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-brand-pink shrink-0" />
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              <strong className="font-normal text-white">Zero Administrative Penalties:</strong> Our portal gives your team full self-service access to upload renewals 24/7 with same-day verification.
            </p>
          </div>

          <Link href="/suppliers/apply" className="btn-primary text-xs py-2.5 px-4">
            Become an Approved Supplier <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
