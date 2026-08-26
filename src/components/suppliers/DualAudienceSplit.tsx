'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';

export function DualAudienceSplit() {
  return (
    <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-16">
          <span className="eyebrow eyebrow-light">MUTUAL VALUE PROPOSITION</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
            Controlled for Clients.{' '}
            <span className="font-light block mt-1">
              Commercially Credible for Suppliers.
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            EntireFM is neither an impersonal job-brokerage platform nor a closed contractor clique. We build transparent commercial partnerships managed against defined technical and compliance standards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column: FOR CLIENTS */}
          <div className="bg-white border border-slate-200 p-8 sm:p-10 rounded-sm shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10.5px] font-light uppercase tracking-wider text-slate-500">FOR PROPERTY DIRECTORS &amp; ESTATES</span>
                    <h3 className="text-xl font-light text-slate-900">Total Supply Chain Assurance</h3>
                  </div>
                </div>
                <span className="hidden sm:inline-block text-[11.5px] font-light px-2.5 py-1 bg-slate-100 text-slate-700 rounded-sm">
                  CLIENT VALUE
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                EntireFM does not simply search for contractors when a defect arises. Our supply chain is vetted, insured, audited, and performance-monitored before setting foot on your estate.
              </p>

              <ul className="space-y-3">
                {[
                  '100% Proportional Vetting: Every contractor is vetted against risk, service type, and site sensitivity.',
                  'Real-Time Compliance Verification: Insurances, SSIP, RAMS, and operative tickets verified before dispatch.',
                  'Evidence-Led Job Sign-Off: Completion requires photographic evidence, calibrated readings, and certified reports.',
                  'Strict SLA & Quality Monitoring: Response times, first-time fix rates, and tenant feedback tracked continuously.',
                  'Single Accountable Point of Contact: Complete contractual and statutory liability rests with EntireFM.',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-100">
              <Link
                href="/suppliers/vetting"
                className="inline-flex items-center gap-2 text-xs font-normal uppercase tracking-wider text-slate-900 hover:text-brand-pink transition-colors"
              >
                How We Vet Our Supply Chain <ArrowRight className="h-4 w-4 text-brand-pink" />
              </Link>
            </div>
          </div>

          {/* Right Column: FOR SUPPLIERS */}
          <div className="bg-brand-graphite text-white border border-brand-edge-dark p-8 sm:p-10 rounded-sm shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-edge-dark">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-sm bg-brand-pink text-white flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10.5px] font-light uppercase tracking-wider text-brand-mist/60">FOR CONTRACTORS, SMES &amp; OEMS</span>
                    <h3 className="text-xl font-light text-white">Commercial Growth &amp; Structured Work</h3>
                  </div>
                </div>
                <span className="hidden sm:inline-block text-[11.5px] font-light px-2.5 py-1 bg-white/10 text-brand-mist/90 rounded-sm">
                  SUPPLIER VALUE
                </span>
              </div>

              <p className="text-xs sm:text-sm text-brand-mist/80 leading-relaxed font-light">
                We value high-performing regional specialists, SMEs, manufacturers, and technology innovators. We offer recurring maintenance volume, structured digital instructions, and transparent payment.
              </p>

              <ul className="space-y-3">
                {[
                  'Recurring PPM & Reactive Volume: Access scheduled maintenance schedules across commercial portfolios.',
                  'Clear Digital Work Orders: Full asset details, access requirements, site contacts, and required evidence.',
                  'Prompt Commercial Settlements: Streamlined invoice workflows backed by validated CAFM job completions.',
                  'Fair Performance Management: High-performing suppliers receive priority dispatch and regional exclusivity.',
                  'Strategic Preferred Tiering: Opportunities to scale nationally alongside EntireFM estate acquisitions.',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-brand-mist/90 font-light">
                    <CheckCircle2 className="h-4 w-4 text-brand-electric-bright shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-brand-edge-dark">
              <Link
                href="/suppliers/partner-with-entirefm"
                className="inline-flex items-center gap-2 text-xs font-normal uppercase tracking-wider text-white hover:text-brand-electric-bright transition-colors"
              >
                Partner With EntireFM <ArrowRight className="h-4 w-4 text-brand-electric-bright" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
