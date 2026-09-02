'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function SupplierPortalConnectionBanner() {
  return (
    <section className="py-16 bg-[#0B1220] text-white border-t border-[#1E2A3A]">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFEDD5] block">
              EXISTING PARTNER NETWORK MEMBERS
            </span>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white">
              Access the Contractor Portal for Event RSVPs &amp; Digital Materials
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed max-w-2xl">
              Verified Partner Network members can confirm event attendance, download technical presentations, and manage CPD records directly from their Contractor Control Centre.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <Link
              href="/contractor"
              className="px-6 py-3.5 rounded-[4px] bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold uppercase tracking-wider text-center justify-center inline-flex items-center gap-2 transition-all shadow-md shadow-[#EA580C]/20"
            >
              <span>Go to Contractor Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/suppliers/partner-network"
              className="px-6 py-3.5 rounded-[4px] bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider text-center justify-center inline-flex items-center gap-2 transition-all backdrop-blur-sm"
            >
              <span>Explore Partner Network</span>
            </Link>
          </div>
        </div>

        {/* Supplier Ecosystem Cross-Links */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <Link
            href="/suppliers/membership"
            className="p-4 rounded-[6px] bg-white/[0.03] border border-white/10 hover:border-[#EA580C]/50 hover:bg-white/[0.06] transition-all block group"
          >
            <span className="text-white font-semibold block mb-1 group-hover:text-[#EA580C] transition-colors">Membership Tiers</span>
            <span className="text-slate-400 font-light text-[11px]">Vetting, fees &amp; benefits &rarr;</span>
          </Link>

          <Link
            href="/suppliers/industry-partners"
            className="p-4 rounded-[6px] bg-white/[0.03] border border-white/10 hover:border-[#EA580C]/50 hover:bg-white/[0.06] transition-all block group"
          >
            <span className="text-white font-semibold block mb-1 group-hover:text-[#EA580C] transition-colors">OEM Partners</span>
            <span className="text-slate-400 font-light text-[11px]">Factory-backed sessions &rarr;</span>
          </Link>

          <Link
            href="/suppliers/innovation"
            className="p-4 rounded-[6px] bg-white/[0.03] border border-white/10 hover:border-[#EA580C]/50 hover:bg-white/[0.06] transition-all block group"
          >
            <span className="text-white font-semibold block mb-1 group-hover:text-[#EA580C] transition-colors">Innovation Hub</span>
            <span className="text-slate-400 font-light text-[11px]">Telemetry &amp; PropTech &rarr;</span>
          </Link>

          <Link
            href="/suppliers/apply"
            className="p-4 rounded-[6px] bg-white/[0.03] border border-white/10 hover:border-[#EA580C]/50 hover:bg-white/[0.06] transition-all block group"
          >
            <span className="text-white font-semibold block mb-1 group-hover:text-[#EA580C] transition-colors">Become a Supplier</span>
            <span className="text-slate-400 font-light text-[11px]">Start pre-qualification &rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
