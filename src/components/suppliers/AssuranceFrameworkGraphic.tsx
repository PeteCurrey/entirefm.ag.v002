'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileCheck, ShieldAlert, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export function AssuranceFrameworkGraphic() {
  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-16">
          <span className="eyebrow eyebrow-light">GOVERNANCE &amp; RISK MANAGEMENT</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
            The EntireFM Supplier Assurance Framework
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Our assurance model is strictly <strong>risk-based and proportionate</strong>. A grounds maintenance business is not asked for F-Gas certification; a refrigeration engineering company receives rigorous refrigerant containment audits.
          </p>
        </div>

        {/* Formula Representation */}
        <div className="mb-14 p-6 sm:p-8 bg-[#FAF9FB] border border-slate-200 rounded-sm">
          <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-4">
            PROPORTIONATE ASSURANCE FORMULA
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-mono text-slate-800">
            <span className="px-3 py-1.5 bg-white border border-slate-300 rounded-sm font-light text-slate-900">
              Supplier Type
            </span>
            <span className="text-slate-400 font-light">&times;</span>
            <span className="px-3 py-1.5 bg-white border border-slate-300 rounded-sm font-light text-slate-900">
              Service Scope
            </span>
            <span className="text-slate-400 font-light">&times;</span>
            <span className="px-3 py-1.5 bg-white border border-slate-300 rounded-sm font-light text-slate-900">
              Operational Risk
            </span>
            <span className="text-slate-400 font-light">&times;</span>
            <span className="px-3 py-1.5 bg-white border border-slate-300 rounded-sm font-light text-slate-900">
              Client &amp; Site Context
            </span>
            <span className="text-slate-400 font-light">=</span>
            <span className="px-3.5 py-1.5 bg-slate-900 text-white rounded-sm font-light">
              Required Assurance Profile
            </span>
          </div>
        </div>

        {/* 4 Core Assurance Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 bg-[#FAF9FB] border border-slate-200 rounded-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                <FileCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">PILLAR 01</span>
              <h3 className="text-base font-light text-slate-900">Corporate &amp; Financial Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Companies House standing, registered trading details, director verification, operational history, VAT &amp; tax compliance, and commercial bank validation.
              </p>
              <ul className="space-y-1.5 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>Company registration audit</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>Bank fraud prevention validation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 bg-[#FAF9FB] border border-slate-200 rounded-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">PILLAR 02</span>
              <h3 className="text-base font-light text-slate-900">Insurance Thresholds &amp; Indemnity</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Mandatory £5M–£20M Public Liability, £10M Employers Liability, Professional Indemnity for design scopes, and motor fleet cover verified on policy renewal.
              </p>
              <ul className="space-y-1.5 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>Direct broker verification</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>Automated policy expiry tracking</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 bg-[#FAF9FB] border border-slate-200 rounded-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">PILLAR 03</span>
              <h3 className="text-base font-light text-slate-900">Health, Safety &amp; SSIP Schemes</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                H&amp;S policy appraisal, RAMS methodology review, RIDDOR reporting history, COSHH documentation, and SSIP accreditation (CHAS, SafeContractor, SMAS).
              </p>
              <ul className="space-y-1.5 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>SSIP Mutual Recognition</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>Site-specific RAMS approval</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 bg-[#FAF9FB] border border-slate-200 rounded-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">PILLAR 04</span>
              <h3 className="text-base font-light text-slate-900">Technical Competence &amp; Licences</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Direct trade accreditations: Gas Safe, NICEIC/NAPIT, F-Gas/REFCOM, IRATA rope access, IPAF, PASMA, manufacturer OEM tickets, and CSCS/ECS cards.
              </p>
              <ul className="space-y-1.5 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>Operative competence register</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>OEM manufacturer training</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/suppliers/vetting"
            className="btn-primary inline-flex"
          >
            Review Full Vetting Specifications <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
