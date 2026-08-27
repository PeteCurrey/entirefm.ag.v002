'use client';

import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  Users,
  Shield,
  HelpCircle,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';

export default function ContractorFormsPage() {
  const formsCatalogue = [
    {
      id: 'form-service-report',
      title: 'Digital Service Report',
      category: 'OPERATIONS',
      description: 'Capture engineer times, tasks completed, parts used, readings, and client signature.',
      icon: ClipboardList,
      popular: true,
    },
    {
      id: 'form-variation-request',
      title: 'Commercial Variation Request',
      category: 'COMMERCIAL',
      description: 'Request formal client budget approval for unforeseen works exceeding initial PO cap.',
      icon: FileText,
      popular: true,
    },
    {
      id: 'form-no-access',
      title: 'No Access / Abortive Visit Notice',
      category: 'OPERATIONS',
      description: 'Record failed site attendance with GPS time-stamp, keybox failure notes, and photo evidence.',
      icon: Clock,
      popular: true,
    },
    {
      id: 'form-near-miss',
      title: 'Near Miss & Hazard Report',
      category: 'HEALTH_AND_SAFETY',
      description: 'Log unsafe site conditions, electrical hazards, or structural risks encountered in the field.',
      icon: AlertTriangle,
      popular: false,
    },
    {
      id: 'form-toolbox-talk',
      title: 'Toolbox Talk Delivery Record',
      category: 'WORKFORCE',
      description: 'Record weekly safety briefings delivered to engineers with attendee sign-off register.',
      icon: Users,
      popular: false,
    },
    {
      id: 'form-vehicle-inspection',
      title: 'Vehicle & Plant Pre-Use Check',
      category: 'FLEET',
      description: 'Daily van walkaround check: tyres, lights, fluid levels, and specialist tool calibration.',
      icon: Truck,
      popular: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-brand-edge-dark bg-gradient-to-r from-brand-carbon via-brand-carbon/90 to-brand-void p-6 sm:p-8 space-y-2 shadow-xl">
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
          FIELD OPERATIONS DOCUMENTATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Contractor Forms &amp; Sign-Off Centre
        </h1>
        <p className="text-sm text-brand-mist/70 max-w-xl font-light">
          Submit digital service reports, variation requests, no-access logs, and statutory health &amp; safety records.
        </p>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formsCatalogue.map((form) => {
          const Icon = form.icon;
          return (
            <div
              key={form.id}
              className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4 flex flex-col justify-between hover:border-brand-electric/50 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-brand-electric/10 text-brand-electric flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  {form.popular && (
                    <span className="text-[9.5px] font-mono text-brand-electric-bright bg-brand-electric/10 px-2 py-0.5 rounded border border-brand-electric/30">
                      FREQUENT
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-normal text-white group-hover:text-brand-electric-bright transition-colors">
                    {form.title}
                  </h3>
                  <p className="text-xs text-brand-mist/60 font-light mt-1 leading-relaxed">
                    {form.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => alert(`Starting digital form: ${form.title}`)}
                className="pt-3 border-t border-brand-edge-dark/50 text-[11px] font-mono text-brand-electric flex items-center gap-1.5 hover:underline"
              >
                <span>Launch Digital Form</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
