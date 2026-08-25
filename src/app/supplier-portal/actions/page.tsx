import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AlertCircle, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SupplierPortalActionCentrePage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-slate-400">
                ENTIRECAFM // OPERATIONAL ACTION CENTRE
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                Outstanding Compliance Actions
              </h1>
            </div>

            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-amber-100 text-amber-900 rounded">
              2 Actions Required
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-brand-pink shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">Site-Specific RAMS Sample Required</div>
                  <p className="text-xs text-slate-600 font-light">
                    Upload a representative Risk Assessment &amp; Method Statement for HVAC chiller maintenance.
                  </p>
                </div>
              </div>
              <Link href="/supplier-portal/onboarding" className="btn-primary text-xs py-1.5 px-3 shrink-0">
                Upload &rarr;
              </Link>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">Supplier Agreement Signature Required</div>
                  <p className="text-xs text-slate-600 font-light">
                    Please review and execute the 2026 Master Services Agreement and Code of Conduct.
                  </p>
                </div>
              </div>
              <button className="btn-primary text-xs py-1.5 px-3 shrink-0">
                Sign Agreement &rarr;
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
