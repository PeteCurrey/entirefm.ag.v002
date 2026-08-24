'use client';

import React, { useState } from 'react';
import {
  FileText,
  Activity,
  AlertCircle,
  Clock,
  Database,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';

export function MonthlyReportComparison() {
  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#C2410C] mb-2">
          THE REPORTING GAP
        </span>
        <h3 className="text-2xl sm:text-3xl font-semibold text-[#101010] tracking-tight">
          Your FM provider says they offer real-time reporting.
        </h3>
        <p className="text-[14.5px] text-[#686866] mt-2 leading-relaxed">
          We think you should be able to see what that actually means in practice.
        </p>
      </div>

      {/* Side-by-side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* LEFT: Traditional FM Reporting (The PDF / Spreadsheet) */}
        <div className="rounded-[12px] border border-[#E4E4E1] bg-[#FBFBFA] p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 rounded-bl-[8px] bg-[#E4E4E1] px-3 py-1 font-mono text-[10px] font-bold text-[#686866]">
            TRADITIONAL FM MODEL
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-[8px] bg-[#F0F0EE] border border-[#D1D1CD] flex items-center justify-center text-[#686866]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-[16px] font-semibold text-[#101010]">
                  June_FM_Performance_Report.pdf
                </h4>
                <p className="text-[11.5px] font-mono text-[#9B9B97]">
                  Issued 18 July 2026 · Static Document
                </p>
              </div>
            </div>

            <p className="text-[13px] text-[#4B5563] leading-relaxed mb-6">
              Information scattered across disconnected spreadsheets, subcontractor exports, email trails, and static PDF packs delivered weeks after the fact.
            </p>

            <ul className="space-y-3">
              {[
                { title: 'Historical & Backward-Looking', desc: 'Arrives 15–20 days after the month ends; issues are already old news.' },
                { title: 'Disconnected Data Silos', desc: 'PPM certificates in one folder, invoices in another, job notes lost in email.' },
                { title: 'No Verifiable Audit Trail', desc: 'Summaries are hand-compiled by account managers with no real-time telemetry.' },
                { title: 'Hidden Bottlenecks', desc: 'No live SLA warnings — you only find out a target was breached after it happened.' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-[#EF4444] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[12.5px] text-[#101010] block font-medium">
                      {item.title}
                    </strong>
                    <span className="text-[12px] text-[#686866]">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-[#E4E4E1] font-mono text-[11px] text-[#9B9B97]">
            Outcome: Reactive estate governance &amp; zero point-in-time visibility
          </div>
        </div>

        {/* RIGHT: EntireCAFM Live Operating Environment */}
        <div className="rounded-[12px] border-2 border-[#EA580C] bg-white p-6 flex flex-col justify-between shadow-[0_8px_28px_rgba(234,88,12,0.08)] relative overflow-hidden">
          <div className="absolute top-0 right-0 rounded-bl-[8px] bg-[#EA580C] px-3 py-1 font-mono text-[10px] font-bold text-white">
            ENTIRECAFM LIVE OPERATING MODEL
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-[8px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#EA580C]">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-[16px] font-semibold text-[#101010]">
                  Your Live Estate Now
                </h4>
                <p className="text-[11.5px] font-mono text-[#059669] font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse" />
                  Live Production Telemetry · Continuous
                </p>
              </div>
            </div>

            <p className="text-[13px] text-[#4B5563] leading-relaxed mb-6">
              One interconnected platform connecting every layer of service delivery directly to the client view in real time.
            </p>

            <ul className="space-y-3">
              {[
                { title: 'Point-in-Time Reality', desc: 'See active jobs, engineer check-ins, and SLA countdowns as they happen today.' },
                { title: 'End-to-End Operational Chain', desc: 'Estate → Site → Asset → Requirement → PPM → Work Order → Evidence → Compliance.' },
                { title: 'Cryptographic & Canonical Proof', desc: 'Time-stamped engineer photos, gas certificates, and sign-offs attached to assets.' },
                { title: 'Proactive SLA Risk Triage', desc: 'EntireCAFM alerts contract managers before an SLA window is compromised.' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[12.5px] text-[#101010] block font-medium">
                      {item.title}
                    </strong>
                    <span className="text-[12px] text-[#4B5563]">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-[#FED7AA] font-mono text-[11px] text-[#C2410C] font-semibold flex items-center justify-between">
            <span>Outcome: Total transparency &amp; audit certainty</span>
            <span className="text-[10px] bg-[#FFF7ED] px-2 py-0.5 rounded border border-[#FED7AA]">98.4% Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
