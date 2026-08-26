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
    <section className="py-24 bg-brand-graphite text-white border-t border-b border-brand-edge-dark relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-wide relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink block font-medium">
            TENDER &amp; PROCUREMENT DUE DILIGENCE
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
            Evaluating FM providers? Ask them to show you the platform.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Most FM tenders feature impressive claims about &ldquo;proprietary portals&rdquo; and &ldquo;real-time analytics&rdquo;. During your next tender evaluation, challenge every bidder with these six operational questions:
          </p>
        </div>

        {/* 6 Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {PROCUREMENT_QUESTIONS.map((q) => (
            <div
              key={q.number}
              className="rounded-sm border border-slate-800 bg-slate-950/80 p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-2">
                <span className="text-xs font-extralight text-brand-pink block">
                  CHALLENGE {q.number}
                </span>
                <h3 className="text-sm font-normal text-white leading-snug">
                  &ldquo;{q.question}&rdquo;
                </h3>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <span className="text-[10px] font-normal uppercase tracking-wider text-emerald-400 block mb-1">
                  EntireCAFM Operational Delivery:
                </span>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {q.entireAnswer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Block */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-800 pt-8">
          <div>
            <h4 className="text-lg font-light text-white">
              We would be delighted to demonstrate our live platform.
            </h4>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              30-minute interactive walkthrough using representative multi-site commercial estate data.
            </p>
          </div>
          <Link
            href="/contact-us?subject=Book%20a%20Live%20Client%20Portal%20Demonstration"
            className="btn-primary text-xs py-3 px-6 shrink-0"
          >
            Book a Live Client Portal Demonstration <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
