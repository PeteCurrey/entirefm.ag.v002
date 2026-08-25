import React from 'react';
import Link from 'next/link';
import { CreditCard, CheckCircle2, FileText, Calendar, ShieldCheck, Download, AlertCircle } from 'lucide-react';

export default function SupplierPortalMembershipPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
          COMMERCIAL MEMBERSHIP // BILLING
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Partner Network Membership &amp; Invoices
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Manage your Partner Network subscription, payment methods, renewal dates, and commercial VAT invoices.
        </p>
      </div>

      {/* Membership Status Card */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">CURRENT MEMBERSHIP</span>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                Supplier Network Membership
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light">
              Annual subscription supporting digital portal services, document vault storage, and compliance administration.
            </p>
          </div>

          <div className="text-right font-mono">
            <div className="text-2xl font-bold text-slate-900">£495.00</div>
            <span className="text-[10.5px] text-slate-400">+ VAT / year</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase block">Assurance Status</span>
            <div className="flex items-center gap-1.5 font-bold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>APPROVED SUPPLIER</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase block">Renewal Date</span>
            <span className="font-bold text-slate-900 block">01 Jan 2027</span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase block">Payment Method</span>
            <span className="font-bold text-slate-900 block">Credit Card (Stripe) &bull;&bull;&bull;&bull; 4242</span>
          </div>
        </div>
      </div>
    </div>
  );
}
