'use client';

import React from 'react';
import { CalendarCheck2, Zap, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';

export interface PlannedVsReactiveSplitProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  plannedTitle?: string;
  plannedSubtitle?: string;
  plannedItems?: string[];
  reactiveTitle?: string;
  reactiveSubtitle?: string;
  reactiveItems?: string[];
}

export function PlannedVsReactiveSplit({
  eyebrow = 'OPERATIONAL DELIVERY MODEL',
  title = 'Planned Preventative Care vs Reactive Response',
  subtitle = 'Balancing strategic preventative asset maintenance with responsive emergency engineering.',
  plannedTitle = 'Planned Preventative Maintenance (PPM)',
  plannedSubtitle = 'Scheduled routines to prevent downtime and protect asset longevity',
  plannedItems = [
    'SFG20-aligned maintenance tasks scheduled across all equipment',
    'Statutory inspection & certification (EICR, Gas Safety, TM44, Fire)',
    'Lubrication, filter changes, belt tensioning, and coil cleaning',
    'Asset degradation profiling and forward capital planning',
    'Compliance logbook archival in the client portal',
  ],
  reactiveTitle = 'Reactive Engineering & Emergency Cover',
  reactiveSubtitle = 'Swift technical triage and rapid engineer dispatch when issues arise',
  reactiveItems = [
    'Central operations desk coordinating regional mobile engineers',
    'Prioritised response bands based on plant criticality and tenant safety',
    'Specialist mobile diagnostic tooling and common van stock parts',
    'Root-cause fault identification preventing repeat breakdowns',
    'Live digital work order tracking and instant completion reports',
  ],
}: PlannedVsReactiveSplitProps) {
  return (
    <section className="py-20 sm:py-28 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-custom">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-light">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* LEFT: Planned Maintenance */}
          <div className="bg-white border border-slate-200/90 rounded-sm p-8 sm:p-10 flex flex-col justify-between shadow-elevated relative overflow-hidden group hover:border-brand-pink/40 transition-all">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-pink-light to-brand-magenta" />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-sm bg-brand-pink/10 text-brand-pink flex items-center justify-center shrink-0 border border-brand-pink/20">
                  <CalendarCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-normal text-brand-pink uppercase tracking-wider block">
                    PROACTIVE STRATEGY
                  </span>
                  <h3 className="text-xl font-light text-slate-900">
                    {plannedTitle}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {plannedSubtitle}
              </p>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                {plannedItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-normal">
              <span>Goal: Zero Plant Stoppages</span>
              <span className="text-brand-pink font-light">Scheduled Visits</span>
            </div>
          </div>

          {/* RIGHT: Reactive Support */}
          <div className="bg-brand-graphite border border-brand-edge-dark rounded-sm p-8 sm:p-10 flex flex-col justify-between text-white shadow-elevated relative overflow-hidden group hover:border-brand-electric/50 transition-all">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-electric" />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-sm bg-brand-electric/20 text-brand-electric-bright flex items-center justify-center shrink-0 border border-brand-electric/30">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-normal text-brand-electric-bright uppercase tracking-wider block">
                    REACTIVE SUPPORT
                  </span>
                  <h3 className="text-xl font-light text-white">
                    {reactiveTitle}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {reactiveSubtitle}
              </p>

              <div className="space-y-3 pt-2 border-t border-brand-edge-dark">
                {reactiveItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-brand-electric-bright shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-brand-edge-dark flex items-center justify-between text-xs text-slate-400 font-normal">
              <span>Direct Helpdesk: {CONTACT_CONFIG.mainPhone.display}</span>
              <span className="text-brand-electric-bright font-light">Priority Triage</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
