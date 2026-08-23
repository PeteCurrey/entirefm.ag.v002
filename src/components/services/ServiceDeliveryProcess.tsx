'use client';

import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  deliverable?: string;
}

export const DEFAULT_SERVICE_PROCESS: ProcessStep[] = [
  {
    number: '01',
    title: 'Site Survey & Asset Audit',
    description: 'Comprehensive physical review of all mechanical, electrical, or fabric assets, recording condition, serials, and statutory status.',
    deliverable: 'Initial Asset Condition Register',
  },
  {
    number: '02',
    title: 'Scope & SLA Engineering',
    description: 'Developing tailored SFG20 maintenance regimes, emergency response bands, and contract milestones for your estate.',
    deliverable: 'Bespoke Planned Maintenance Schedule',
  },
  {
    number: '03',
    title: 'Mobilisation & Tagging',
    description: 'Digital QR tagging of all plant assets, CAFM system onboarding, and engineer handover with dedicated contract managers.',
    deliverable: 'Live Digital Portal & Logbooks',
  },
  {
    number: '04',
    title: 'Proactive & Reactive Delivery',
    description: 'Execution of scheduled PPM routines alongside 24/7 technical helpdesk dispatch for urgent repairs and breakdowns.',
    deliverable: 'First-Time Fix Focus & Real-time Tracking',
  },
  {
    number: '05',
    title: 'Reporting & Governance',
    description: 'Monthly statutory compliance certification, SLA performance tracking, and strategic capital replacement recommendations.',
    deliverable: 'Consolidated Executive Report',
  },
];

export function ServiceDeliveryProcess({
  eyebrow = 'DELIVERY FRAMEWORK',
  title = 'How Our Service Works',
  subtitle = 'A structured, transparent operational process ensuring zero disruption and complete statutory compliance.',
  steps = DEFAULT_SERVICE_PROCESS,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  steps?: ProcessStep[];
}) {
  return (
    <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="container-custom">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200/90 rounded-sm p-6 flex flex-col justify-between group hover:bg-white hover:border-brand-pink/50 hover:shadow-elevated transition-all duration-300 relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-extrabold font-mono text-brand-pink group-hover:scale-110 transition-transform">
                    {step.number}
                  </span>
                  <span className="h-1.5 w-6 bg-slate-200 group-hover:bg-brand-pink transition-colors rounded-full" />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2.5 group-hover:text-brand-graphite transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              {step.deliverable && (
                <div className="pt-3 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Deliverable
                  </span>
                  <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                    {step.deliverable}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
