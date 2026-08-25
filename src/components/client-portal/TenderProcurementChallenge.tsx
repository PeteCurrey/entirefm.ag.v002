'use client';

import React from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Search,
  FileCheck2,
} from 'lucide-react';

const PROCUREMENT_QUESTIONS = [
  {
    number: '01',
    question: 'How do client teams see live service delivery, open incidents, and contractor dispatch as it happens?',
    entireAnswer: 'EntireCAFM provides an interactive Estate Workspace and live Today’s Operations Timeline with minute-by-minute status updates.',
  },
  {
    number: '02',
    question: 'How are operational risks and imminent SLA breaches surfaced before they become service failures?',
    entireAnswer: 'The Action Required queue flags critical plant trips, water ingress windows, and overdue statutory tasks automatically.',
  },
  {
    number: '03',
    question: 'How is statutory compliance evidenced and audited down to the specific physical asset in the plantroom?',
    entireAnswer: 'Every statutory check is tied to an asset tag, SFG20 task code, time-stamped engineer photo, and certificate stored in the Compliance Vault.',
  },
  {
    number: '04',
    question: 'How does your technology move from a 50-building national portfolio down to a single floor plate or air handling unit?',
    entireAnswer: 'Site 360 allows instant transition from estate-level metrics to photographic site realities, CAD drawings, and equipment hierarchies.',
  },
  {
    number: '05',
    question: 'How is historical audit integrity maintained when contractors complete works or quotes are approved?',
    entireAnswer: 'An immutable, time-stamped chronological audit trail records every user action, status transition, quote approval, and document upload.',
  },
  {
    number: '06',
    question: 'Does the client own and have unrestricted real-time access to their estate and asset data?',
    entireAnswer: 'Yes. EntireFM operates on an open-data philosophy: your asset data, compliance history, and maintenance records remain yours at all times.',
  },
];

export function TenderProcurementChallenge() {
  return (
    <div className="rounded-[16px] border border-[#101010] bg-[#101010] text-white p-6 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-[#EA580C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#EA580C]/40 bg-[#EA580C]/20 px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#FF8A4C] mb-3">
            TENDER &amp; PROCUREMENT GUIDE
          </span>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extralight tracking-tight text-white">
            Evaluating FM providers? Ask them to show you the platform.
          </h3>
          <p className="text-[14px] sm:text-[15px] text-white/70 mt-3 leading-relaxed">
            Most FM tenders feature impressive claims about “proprietary portals” and “real-time analytics”. During your next tender evaluation, challenge every bidder with these six operational questions:
          </p>
        </div>

        {/* 6 Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {PROCUREMENT_QUESTIONS.map((q) => (
            <div
              key={q.number}
              className="rounded-[10px] border border-white/10 bg-white/5 p-5 flex flex-col justify-between hover:border-[#EA580C]/40 transition-colors"
            >
              <div>
                <span className="font-mono text-[11px] font-normal text-[#EA580C] block mb-2">
                  CHALLENGE {q.number}
                </span>
                <p className="text-[13px] font-normal text-white leading-snug mb-3">
                  “{q.question}”
                </p>
              </div>
              <div className="pt-3 border-t border-white/10">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#059669] block mb-1">
                  EntireCAFM Delivery:
                </span>
                <p className="text-[11.5px] text-white/80 leading-normal">
                  {q.entireAnswer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Block */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10 pt-6">
          <div>
            <h4 className="text-lg font-light text-white">
              We would be delighted to demonstrate our live platform.
            </h4>
            <p className="text-xs text-white/60 mt-0.5">
              30 minutes. No marketing slides. Just a live operational walkthrough of EntireCAFM.
            </p>
          </div>
          <Link
            href="/contact-us?subject=EntireCAFM%20Live%20Portal%20Demonstration"
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#EA580C] px-5 py-3 text-[13px] font-normal text-white shadow-lg hover:bg-[#D44708] transition-all shrink-0"
          >
            Book an EntireCAFM Demonstration
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
