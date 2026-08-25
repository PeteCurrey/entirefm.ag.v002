import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, CreditCard } from 'lucide-react';

export default function SupplierPortalMembershipPage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl space-y-8">
          {/* Top Breadcrumb & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-slate-400">
                ENTIRECAFM // SUPPLIER SELF-SERVICE
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                Supplier Network Membership
              </h1>
            </div>

            <span className="inline-block text-xs font-mono font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-sm self-start sm:self-auto">
              MEMBERSHIP: VERIFIED NETWORK MEMBER
            </span>
          </div>

          {/* Mandatory Non-Negotiable Procurement Firewall Disclaimer */}
          <div className="p-4 bg-slate-900 text-white rounded-sm text-xs leading-relaxed font-light space-y-1">
            <span className="font-bold text-brand-pink block uppercase font-mono">GOVERNANCE &amp; PROCUREMENT NOTICE:</span>
            <p className="text-brand-mist/90">
              Supplier network membership provides profile management, compliance vault archiving, and industry event access. Membership does <strong>NOT</strong> guarantee work allocation and does not influence EntireFM&apos;s supplier assurance, technical scoring, or procurement decisions.
            </p>
          </div>

          {/* Current Membership Card */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-brand-pink font-bold">
                  ACTIVE TIER
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Verified Supplier Network Membership
                </h2>
                <p className="text-xs text-slate-600 mt-1 font-light">
                  Annual recurring membership covering compliance monitoring and verified network profile.
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-mono font-bold text-slate-900">£495</span>
                <span className="text-xs text-slate-500 font-mono block">+ VAT / year</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs font-mono text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10.5px]">START DATE</span>
                <span className="font-bold">2026-01-01</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px]">NEXT RENEWAL DATE</span>
                <span className="font-bold">2027-01-01 (Auto-Renew)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px]">PAYMENT METHOD</span>
                <span className="font-bold">Annual Corporate Invoice (30 Days)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px]">BILLING STATUS</span>
                <span className="text-emerald-600 font-bold">Settled &amp; Up to Date</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                INCLUDED MEMBERSHIP BENEFITS:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-light">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Maintained CAFM Compliance Vault</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Automated Insurance Expiry Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Verified Network Partner Badge</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Priority Invitations to Meet the Supplier Forums</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <Link href="/supplier-portal/billing" className="btn-primary text-xs">
                View Invoices &amp; Billing History <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/contact-us" className="text-xs font-mono text-slate-500 hover:text-slate-900 underline">
                Contact Finance Desk
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
