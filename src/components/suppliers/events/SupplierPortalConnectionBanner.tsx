'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, ExternalLink, Cpu, Users, Award } from 'lucide-react';

export function SupplierPortalConnectionBanner() {
  return (
    <section className="py-16 bg-[#0B1220] text-white border-t border-brand-edge-dark">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[10.5px] font-mono uppercase text-brand-pink-light block">
              EXISTING PARTNER NETWORK MEMBERS
            </span>
            <h3 className="text-2xl sm:text-3xl font-light text-white">
              Access the Supplier Portal for Event RSVPs &amp; Digital Materials
            </h3>
            <p className="text-xs sm:text-sm text-brand-mist/80 font-light leading-relaxed max-w-2xl">
              Verified Partner Network members can confirm attendance, download speaker presentations, and manage CPD certificates directly from their dashboard.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <Link
              href="/supplier-portal"
              className="btn-hero-pink text-xs py-3 px-5 text-center justify-center inline-flex items-center gap-2"
            >
              <span>Sign In to Supplier Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/suppliers/partner-network"
              className="btn-ghost-light text-xs py-3 px-5 text-center justify-center inline-flex items-center gap-2"
            >
              <span>Explore Partner Network</span>
            </Link>
          </div>
        </div>

        {/* Supplier Ecosystem Cross-Links */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <Link
            href="/suppliers/membership"
            className="p-3.5 rounded-sm bg-white/[0.03] border border-white/10 hover:border-brand-pink hover:bg-white/[0.06] transition-all block"
          >
            <span className="text-white font-normal block mb-1">Membership Tiers</span>
            <span className="text-brand-mist/60 font-light text-[11px]">Vetting, fees &amp; benefits &rarr;</span>
          </Link>

          <Link
            href="/suppliers/industry-partners"
            className="p-3.5 rounded-sm bg-white/[0.03] border border-white/10 hover:border-brand-pink hover:bg-white/[0.06] transition-all block"
          >
            <span className="text-white font-normal block mb-1">OEM Partners</span>
            <span className="text-brand-mist/60 font-light text-[11px]">Factory-backed sessions &rarr;</span>
          </Link>

          <Link
            href="/suppliers/innovation"
            className="p-3.5 rounded-sm bg-white/[0.03] border border-white/10 hover:border-brand-pink hover:bg-white/[0.06] transition-all block"
          >
            <span className="text-white font-normal block mb-1">Innovation Hub</span>
            <span className="text-brand-mist/60 font-light text-[11px]">Telemetry &amp; PropTech &rarr;</span>
          </Link>

          <Link
            href="/suppliers/apply"
            className="p-3.5 rounded-sm bg-white/[0.03] border border-white/10 hover:border-brand-pink hover:bg-white/[0.06] transition-all block"
          >
            <span className="text-white font-normal block mb-1">Become a Supplier</span>
            <span className="text-brand-mist/60 font-light text-[11px]">Start pre-qualification &rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
