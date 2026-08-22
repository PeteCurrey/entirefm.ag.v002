import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, ArrowRight, ShieldCheck, CheckCircle2, Wrench, Building2, MapPin } from 'lucide-react';

export function HomeHero() {
  return (
    <section className="bg-brand-navy text-white relative overflow-hidden border-b border-brand-border-dark">
      {/* Background Architectural Grid Effect */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="container-custom py-16 sm:py-24 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Positioning */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-gold">
                <ShieldCheck className="w-3.5 h-3.5" />
                National Facilities Management & Engineering
              </span>
              <span className="badge-dark text-slate-300">
                Self-Delivered Model
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Total Facilities Management <br className="hidden sm:block" />
              <span className="text-brand-gold">& Engineering Precision</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              EntireFM delivers integrated hard FM, mechanical & electrical engineering, scheduled PPM, and specialist facilities services across London, Manchester, Birmingham, and nationwide commercial portfolios.
            </p>

            {/* Quick Metrics / Key Capabilities Bar */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg border-y border-brand-border-dark/80 py-3 text-xs text-slate-300 font-mono">
              <div>
                <span className="text-brand-gold font-bold block text-sm">Hard FM</span>
                <span>M&E, HVAC, Gas</span>
              </div>
              <div className="border-l border-brand-border-dark/80 pl-3">
                <span className="text-brand-gold font-bold block text-sm">PPM</span>
                <span>SFG20 Compliance</span>
              </div>
              <div className="border-l border-brand-border-dark/80 pl-3">
                <span className="text-brand-gold font-bold block text-sm">24/7/365</span>
                <span>National Helpdesk</span>
              </div>
            </div>

            {/* Primary Action Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="#enquiry" className="btn-primary py-3.5 px-6 text-sm font-bold shadow-command">
                Request Estate Proposal <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:0800000000" className="btn-phone py-3.5 px-5 text-xs font-semibold">
                <Phone className="w-4 h-4 text-brand-gold" />
                <span>Call [PHONE TO VERIFY]</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />
              Direct access to engineering directors and regional operations managers.
            </p>
          </div>

          {/* Right Column: Hero Visual Asset Card */}
          <div className="lg:col-span-5">
            <div className="relative border border-brand-border-dark rounded-sm overflow-hidden bg-brand-charcoal shadow-command p-2">
              <div className="relative h-72 sm:h-96 w-full rounded-sm overflow-hidden bg-brand-navy">
                <Image
                  src="/branding/EntireFM Branding 001.png"
                  alt="Entire FM Commercial Facilities Management Operations"
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-brand-charcoal/90 backdrop-blur-sm border border-brand-border-dark/80 rounded-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-brand-gold block">Technical Capability</span>
                      <span className="text-sm font-bold text-white block">Multi-Site FM Contract Delivery</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">UK-Wide</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceHero({
  title,
  subtitle,
  category = 'Hard FM & Building Services',
  bulletPoints = [
    'Scheduled Planned Preventative Maintenance (SFG20)',
    'Certified engineers & statutory compliance audits',
    '24/7 reactive emergency triage & callout',
  ],
  defaultService,
}: {
  title: string;
  subtitle: string;
  category?: string;
  bulletPoints?: string[];
  defaultService?: string;
}) {
  return (
    <section className="bg-brand-navy text-white relative overflow-hidden border-b border-brand-border-dark py-14 sm:py-20">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-5">
            <span className="badge-gold">{category}</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {subtitle}
            </p>

            <ul className="space-y-2 pt-2 text-sm text-slate-200">
              {bulletPoints.map((bp, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>{bp}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="#enquiry" className="btn-primary py-3 px-6 text-xs font-bold">
                Request Service Proposal <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:0800000000" className="btn-phone py-3 px-4 text-xs font-semibold">
                <Phone className="w-3.5 h-3.5" />
                <span>Call [PHONE TO VERIFY]</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <div className="p-6 bg-brand-charcoal border border-brand-border-dark rounded-sm space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-gold block">Commercial Factsheet</span>
              <h3 className="text-base font-bold text-white">Direct Technical Delivery</h3>
              <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-brand-border-dark">
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Model:</span>
                  <span className="font-semibold text-white">Self-Delivered Engineers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Helpdesk:</span>
                  <span className="font-semibold text-white">24/7/365 Operations</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reporting:</span>
                  <span className="font-semibold text-white">Digital CAFM & Asset Logs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coverage:</span>
                  <span className="font-semibold text-white">UK Nationwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
