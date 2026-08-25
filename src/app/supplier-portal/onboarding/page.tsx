import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, CheckCircle2, Upload, FileText, ArrowRight, AlertCircle } from 'lucide-react';

export default function SupplierPortalOnboardingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-5xl space-y-8">
          {/* Top Breadcrumb & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-slate-400">
                ENTIRECAFM // ASSURANCE &amp; QUALIFICATION PORTAL
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                Supplier Onboarding &amp; Compliance Hub
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-sm">
                STATUS: UNDER DUE DILIGENCE
              </span>
            </div>
          </div>

          {/* Progress Banner */}
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-700">ASSURANCE PROGRESS</span>
              <span className="text-sm font-mono font-bold text-slate-900">75% COMPLETE</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-3/4" />
            </div>
            <p className="text-xs text-slate-500 font-light">
              6 of 8 mandatory requirements accepted. Complete remaining items to activate work eligibility.
            </p>
          </div>

          {/* Onboarding Requirement Steps */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Required Compliance Submissions
            </h2>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Public &amp; Products Liability Insurance (£5,000,000)</div>
                    <span className="text-xs text-slate-500 font-mono">Policy Verified &middot; Expires 2027-01-01</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                  ACCEPTED
                </span>
              </div>

              {/* Item 2 */}
              <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Employers Liability Insurance (£10,000,000)</div>
                    <span className="text-xs text-slate-500 font-mono">Certificate Verified &middot; Expires 2027-01-01</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                  ACCEPTED
                </span>
              </div>

              {/* Item 3 */}
              <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">F-Gas Company Registration (REFCOM)</div>
                    <span className="text-xs text-slate-500 font-mono">Verified REFCOM Elite Certificate</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                  ACCEPTED
                </span>
              </div>

              {/* Item 4 */}
              <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Health &amp; Safety Policy &amp; Competent Person Confirmation</div>
                    <span className="text-xs text-slate-500 font-mono">Uploaded 2026-01-14 &middot; Awaiting Compliance Team Review</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded">
                  UNDER REVIEW
                </span>
              </div>

              {/* Item 5 */}
              <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Upload className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Site-Specific RAMS Sample (Representative HVAC Task)</div>
                    <span className="text-xs text-slate-500 font-mono">Please upload task-specific Risk Assessment &amp; Method Statement</span>
                  </div>
                </div>
                <button className="btn-primary text-xs py-1.5 px-3">
                  Upload Document &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
