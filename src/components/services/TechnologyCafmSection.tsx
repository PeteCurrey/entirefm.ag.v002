'use client';

import React from 'react';
import Image from 'next/image';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { Database, QrCode, FileCheck, Activity, BarChart3, CheckCircle2, ShieldCheck } from 'lucide-react';

export function TechnologyCafmSection({
  eyebrow = 'DIGITAL ASSET GOVERNANCE',
  title = 'Real-Time CAFM & Digital Compliance Reporting',
  subtitle = 'Every service visit, asset condition check, and statutory test is recorded and indexed within our Computer-Aided Facilities Management platform.',
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}) {
  const CAFM_FEATURES = [
    {
      icon: QrCode,
      title: 'Digital QR Asset Tagging',
      desc: 'Physical barcode/QR scanning at each plant asset ensures engineers physically attend equipment and records precise visit timestamps.',
    },
    {
      icon: FileCheck,
      title: 'Audit-Ready Digital Certificates',
      desc: 'EICR reports, Gas Safety CP12s, F-Gas logs, and emergency lighting certificates are instantly archived and searchable by site.',
    },
    {
      icon: Activity,
      title: 'Live Work Order Triage',
      desc: 'Track reactive requests in real-time from initial helpdesk logging through mobile technician dispatch to photographic completion proof.',
    },
    {
      icon: BarChart3,
      title: 'Monthly Estate Performance Analytics',
      desc: 'Automated executive dashboards detailing SLA adherence, first-time fix ratios, statutory compliance percentage, and asset health.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-brand-graphite text-white relative overflow-hidden border-b border-brand-edge-dark">
      <div
        aria-hidden="true"
        className="facet-rule pointer-events-none absolute inset-0 opacity-25"
      />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Feature Cards */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
                <span className="text-xs font-normal uppercase tracking-wider text-brand-pink-light">
                  {eyebrow}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white leading-tight">
                {title}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                {subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {CAFM_FEATURES.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 bg-brand-carbon border border-brand-edge-dark rounded-sm group hover:border-brand-pink/40 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-sm bg-brand-pink/10 text-brand-pink flex items-center justify-center mb-3.5 border border-brand-pink/20 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-light text-white mb-1.5 group-hover:text-brand-pink-light transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-brand-carbon/60 border border-brand-edge-dark rounded-sm text-xs text-slate-300 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-pink shrink-0" />
              <span>
                Full data isolation and secure 24/7 web access for authorized facilities and property directors.
              </span>
            </div>
          </div>

          {/* Right Column: Visual Telemetry Card */}
          <div className="lg:col-span-6">
            <div className="bg-brand-carbon border border-brand-edge-dark rounded-sm p-7 sm:p-9 shadow-elevated relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-pink-light via-brand-pink to-brand-magenta" />

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-edge-dark">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-brand-graphite p-2 border border-brand-edge-dark flex items-center justify-center">
                    <BrandIcon name="dataInsights" size={28} />
                  </div>
                  <div>
                    <span className="text-xs font-normal text-white block">
                      EntireCAFM Operational Portal
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Asset Intelligence & Compliance Engine
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-light text-emerald-400">
                    LIVE SYSTEM
                  </span>
                </div>
              </div>

              {/* Visual System Metrics Rows */}
              <div className="space-y-3.5 text-xs">
                <div className="p-3.5 bg-brand-graphite rounded-sm border border-brand-edge-dark flex items-center justify-between">
                  <span className="text-slate-300">Statutory Certificate Archival</span>
                  <strong className="text-white font-mono text-emerald-400 font-light">100% Up to Date</strong>
                </div>

                <div className="p-3.5 bg-brand-graphite rounded-sm border border-brand-edge-dark flex items-center justify-between">
                  <span className="text-slate-300">Asset Verification Standard</span>
                  <strong className="text-white font-mono text-brand-pink-light font-light">SFG20 Certified</strong>
                </div>

                <div className="p-3.5 bg-brand-graphite rounded-sm border border-brand-edge-dark flex items-center justify-between">
                  <span className="text-slate-300">Live Work Order Dispatch</span>
                  <strong className="text-white font-mono text-slate-200">Real-Time Mobile Sync</strong>
                </div>

                <div className="p-3.5 bg-brand-graphite rounded-sm border border-brand-edge-dark flex items-center justify-between">
                  <span className="text-slate-300">Audit History Retention</span>
                  <strong className="text-white font-mono text-slate-200">Full Contract Lifetime</strong>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-edge-dark flex items-center justify-between text-[11px] text-slate-400">
                <span>Multi-Site Estate Portal</span>
                <span className="text-brand-pink font-light">Included in Contract</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
