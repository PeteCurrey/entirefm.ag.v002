import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FileText, Download, Upload, CheckCircle2 } from 'lucide-react';

export default function SupplierPortalDocumentsPage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-slate-400">
                ENTIRECAFM // COMPLIANCE VAULT
              </span>
              <h1 className="text-2xl font-extralight text-slate-900 mt-1">
                Compliance Documents &amp; Certificates
              </h1>
            </div>

            <button className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5" /> Upload Replacement Document
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200">
              Active Compliance Certificates on File
            </h3>

            <div className="divide-y divide-slate-100 text-xs font-mono">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-light text-slate-900 font-sans">Public &amp; Products Liability Policy Schedule</div>
                  <span className="text-slate-500">Aviva Insurance &middot; Policy #AV-987622 &middot; Expires 2027-01-01</span>
                </div>
                <span className="text-emerald-800 bg-emerald-100 font-light px-2 py-0.5 rounded text-[10px]">
                  VERIFIED
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-light text-slate-900 font-sans">F-Gas Company Registration (REFCOM Elite)</div>
                  <span className="text-slate-500">REFCOM Certification #REF-88421 &middot; Expires 2028-06-30</span>
                </div>
                <span className="text-emerald-800 bg-emerald-100 font-light px-2 py-0.5 rounded text-[10px]">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
