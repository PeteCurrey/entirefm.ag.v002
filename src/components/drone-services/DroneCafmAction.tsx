'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileText, Wrench, ShieldCheck, Database } from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    step: '01',
    name: 'Spatial Anomaly Pin',
    desc: 'Drone inspection generates high-resolution defect with exact georeference coordinates.',
  },
  {
    step: '02',
    name: 'EntireCAFM Ingest',
    desc: 'Defect automatically creates an asset observation record in the client CAFM portal.',
  },
  {
    step: '03',
    name: 'Work Order Dispatch',
    desc: 'EntireFM helpdesk converts observation into a scoped remedial work order.',
  },
  {
    step: '04',
    name: 'Engineer Mobilisation',
    desc: 'Self-delivered trade team arrives on-site with correct access equipment and parts.',
  },
  {
    step: '05',
    name: 'Permanent Asset Audit',
    desc: 'Before/after photos and engineer signoff permanently locked into the asset logbook.',
  },
];

export function DroneCafmAction() {
  return (
    <section 
      aria-label="EntireCAFM Operational Integration"
      className="py-24 sm:py-32 bg-slate-900 text-white overflow-hidden border-b border-slate-800"
    >
      <div className="container-custom space-y-16">
        
        {/* Editorial Narrative Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-brand-pink text-xs uppercase tracking-[0.2em] font-semibold">
              <Database className="h-4 w-4" />
              <span>ENTIRECAFM INTEGRATED WORKFLOW</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-[1.1]">
              The data becomes <br />
              <span className="font-light text-hero-pink">
                an action.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 space-y-4 text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            <p>
              Aerial intelligence shouldn&apos;t live in an isolated PDF report. In EntireCAFM, every drone observation directly creates an actionable maintenance record, dispatches trade engineers, and updates your asset register.
            </p>
          </div>
        </div>

        {/* Real EntireCAFM Screenshot Showcase */}
        <div className="relative rounded-sm overflow-hidden bg-slate-950 border border-slate-700 shadow-2xl p-4 sm:p-8">
          <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden bg-slate-900 shadow-inner">
            <Image
              src="/images/client-portal/entirecafm-dashboard-live.png"
              alt="EntireCAFM live facilities management dashboard and asset register"
              fill
              className="object-cover object-top filter brightness-[0.95] contrast-[1.05]"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </div>

        {/* 5-Step Linear Workflow Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-6">
          {WORKFLOW_STEPS.map((w, idx) => (
            <div key={idx} className="space-y-3 p-5 rounded-sm bg-slate-800/60 border border-slate-700">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-brand-pink font-semibold">STAGE {w.step}</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-medium text-white">
                {w.name}
              </h3>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                {w.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
